'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  ArrowLeft, CheckCircle2, MessageCircle, Sparkles, Star, Target,
  Volume2, Delete, Eraser, Wand2, RefreshCcw,
} from 'lucide-react'

import { api } from '@/services/api'
import { readGameNav } from '@/lib/navState'
import { speak } from '@/lib/speech'
import { useChildTheme, useReduceMotion, useLowStimulation } from '@/hooks'
import { EmptyState, Loading } from '@/components/feedback'
import { colors } from '@/theme'

type Difficulty = 'easy' | 'medium'

interface WordItem {
  text: string
  emoji: string | null
  role: string
}

// Papel gramatical → apresentação das abas do banco de palavras.
// Mesma lista de papéis usada no seed (Letrinhas-Encantadas-back/prisma/seed-games.ts).
const ROLE_CONFIG: Record<string, { label: string; emoji: string; gradient: readonly [string, string] }> = {
  pronome: { label: 'Quem', emoji: '🙋', gradient: ['#FF6B9D', '#FF8E9B'] },
  verbo: { label: 'Verbos', emoji: '🤲', gradient: ['#4ECDC4', '#44A08D'] },
  acao: { label: 'Ações', emoji: '🏃', gradient: ['#4ECDC4', '#2E8B84'] },
  objeto: { label: 'Objetos', emoji: '🧸', gradient: ['#81C784', '#388E3C'] },
  alimento: { label: 'Comidas', emoji: '🍎', gradient: ['#FF9A8B', '#FF6B9D'] },
  lugar: { label: 'Lugares', emoji: '🏠', gradient: ['#64B5F6', '#1976D2'] },
  animal: { label: 'Animais', emoji: '🐶', gradient: ['#FFB74D', '#FF9800'] },
  cor: { label: 'Cores', emoji: '🎨', gradient: ['#BA68C8', '#9C27B0'] },
  sentimento: { label: 'Sentimentos', emoji: '😊', gradient: ['#A8E6CF', '#4FA88F'] },
  social: { label: 'Gentileza', emoji: '🤗', gradient: ['#FDCB6E', '#E17055'] },
  preposicao: { label: 'Ligações', emoji: '🔗', gradient: ['#74B9FF', '#0984E3'] },
  artigo: { label: 'Artigos', emoji: '📎', gradient: ['#FD79A8', '#E84393'] },
  conectivo: { label: 'Conectivos', emoji: '➕', gradient: ['#FFD93D', '#E17055'] },
  letra: { label: 'Letras', emoji: '🔤', gradient: ['#B39DDB', '#7E57C2'] },
  numero: { label: 'Números', emoji: '🔢', gradient: ['#90CAF9', '#42A5F5'] },
}
const DEFAULT_ROLE_CONFIG = { label: 'Outros', emoji: '💬', gradient: ['#B0BEC5', '#78909C'] as const }

// Papéis que servem de "complemento" na regra do nível médio.
const COMPLEMENT_ROLES = ['objeto', 'alimento', 'lugar', 'acao', 'animal', 'cor', 'sentimento']

type GameState = 'building' | 'correct'

interface ValidationResult {
  valid: boolean
  missing?: string
}

function validatePhrase(roles: (string | undefined)[], level: Difficulty): ValidationResult {
  if (level === 'easy') {
    if (roles.length < 2) return { valid: false, missing: 'mais uma palavra' }
    if (roles[0] !== 'pronome') return { valid: false, missing: 'começar com quem (EU, VOCÊ, MAMÃE...)' }
    if (!roles.some(r => r === 'verbo')) return { valid: false, missing: 'um verbo (QUERO, GOSTO, TENHO...)' }
    return { valid: true }
  }
  if (roles.length < 4) return { valid: false, missing: 'mais palavras (pelo menos 4)' }
  if (roles[0] !== 'pronome') return { valid: false, missing: 'começar com quem (EU, VOCÊ, MAMÃE...)' }
  if (!roles.some(r => r === 'verbo')) return { valid: false, missing: 'um verbo (QUERO, GOSTO, TENHO...)' }
  if (!roles.some(r => r && COMPLEMENT_ROLES.includes(r))) return { valid: false, missing: 'uma ação, um lugar ou um objeto' }
  return { valid: true }
}

export default function PhraseBuilder() {
  const router = useRouter()
  const reduceMotion = useReduceMotion()
  const lowStimulationMode = useLowStimulation()
  const navState = useMemo(() => readGameNav(), [])
  const childTheme = useChildTheme(navState?.gender)

  const [level, setLevel] = useState<Difficulty | null>(null)
  const [loading, setLoading] = useState(false)
  const [wordsByRole, setWordsByRole] = useState<Record<string, WordItem[]>>({})
  const [roleByText, setRoleByText] = useState<Map<string, string>>(new Map())
  const [selectedRole, setSelectedRole] = useState<string>('pronome')
  const [phrase, setPhrase] = useState<string[]>([])
  const [gameState, setGameState] = useState<GameState>('building')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [animatingWord, setAnimatingWord] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)

  const scoreRef = useRef(0)
  const attemptsRef = useRef(0)
  const startTimeRef = useRef(Date.now())
  scoreRef.current = score
  attemptsRef.current = attempts

  const loadLevel = useCallback((chosen: Difficulty) => {
    setLevel(chosen)
    setLoading(true)
    setPhrase([])
    setFeedback(null)
    setGameState('building')

    api
      .get('/words', { params: { gameType: 'PhraseBuilder', difficulty: chosen } })
      .then(res => {
        const grouped: Record<string, WordItem[]> = {}
        const roleMap = new Map<string, string>()
        res.data.forEach((w: any) => {
          const role = w.data?.role ?? w.category ?? 'objeto'
          const item: WordItem = { text: w.text, emoji: w.emoji ?? null, role }
          if (!grouped[role]) grouped[role] = []
          grouped[role].push(item)
          roleMap.set(w.text, role)
        })
        setWordsByRole(grouped)
        setRoleByText(roleMap)
        const firstRole = grouped['pronome'] ? 'pronome' : Object.keys(grouped)[0]
        if (firstRole) setSelectedRole(firstRole)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const childId = navState?.childId
    return () => {
      if (childId && attemptsRef.current > 0) {
        api
          .post('/game-sessions', {
            childId,
            gameType: 'PhraseBuilder',
            score: scoreRef.current,
            maxScore: attemptsRef.current,
            timeSpent: Math.round((Date.now() - startTimeRef.current) / 1000),
            completed: false,
          })
          .catch(() => {})
      }
    }
  }, [navState?.childId])

  const fireConfetti = useCallback(() => {
    if (lowStimulationMode) return
    confetti({
      particleCount: 100,
      spread: 75,
      origin: { y: 0.6 },
      colors: [colors.accent, colors.success, colors.info, colors.secondary],
    })
  }, [lowStimulationMode])

  const handleWordPress = useCallback((word: WordItem) => {
    setAnimatingWord(word.text)
    speak(word.text)
    setPhrase(prev => [...prev, word.text])
    setFeedback(null)
    setTimeout(() => setAnimatingWord(null), 400)
  }, [])

  const handleSpeakPhrase = useCallback(() => {
    if (phrase.length > 0) speak(phrase.join(' '), { rate: 0.9 })
  }, [phrase])

  const handleDeleteLast = useCallback(() => {
    setPhrase(prev => prev.slice(0, -1))
    setFeedback(null)
  }, [])

  const handleClearAll = useCallback(() => {
    setPhrase([])
    setFeedback(null)
  }, [])

  const handleVerify = useCallback(() => {
    if (!level || phrase.length === 0) return
    setAttempts(a => a + 1)
    const roles = phrase.map(word => roleByText.get(word))
    const result = validatePhrase(roles, level)

    if (result.valid) {
      setScore(s => s + 1)
      setGameState('correct')
      setFeedback(null)
      fireConfetti()
      speak(phrase.join(' '), { rate: 0.9 })
      setTimeout(() => {
        setGameState('building')
        setPhrase([])
      }, 2400)
    } else {
      setFeedback(`Quase lá! Sua frase precisa de ${result.missing}.`)
    }
  }, [level, phrase, roleByText, fireConfetti])

  const changeLevel = useCallback(() => {
    setLevel(null)
    setWordsByRole({})
    setRoleByText(new Map())
    setPhrase([])
    setFeedback(null)
    setGameState('building')
  }, [])

  const roleKeys = useMemo(() => Object.keys(wordsByRole), [wordsByRole])

  // ── Tela 1: escolher o nível ────────────────────────────────────────────
  if (!level) {
    return (
      <div className="min-h-dvh flex flex-col" style={{ backgroundImage: `linear-gradient(160deg, ${childTheme.backgroundGradient.join(', ')})` }}>
        <div className="flex items-center px-xl pt-[calc(env(safe-area-inset-top)+12px)] pb-md">
          <button type="button" onClick={() => router.back()} aria-label="Voltar" className="w-10 h-10 rounded-pill bg-white/60 shadow-sm flex items-center justify-center">
            <ArrowLeft size={20} color={childTheme.palette.primaryDark} />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-xl gap-lg text-center">
          <span className="text-[64px] leading-none">💬</span>
          <h1 className="text-h2 font-extrabold" style={{ color: childTheme.palette.primaryDark }}>
            Monte sua frase
          </h1>
          <p className="text-body max-w-[280px]" style={{ color: childTheme.palette.primaryDark, opacity: 0.8 }}>
            {navState?.childName ? `Escolha um nível, ${navState.childName}!` : 'Escolha um nível para começar'}
          </p>

          <div className="flex flex-col w-full max-w-[320px] gap-md mt-md">
            <button
              type="button"
              onClick={() => loadLevel('easy')}
              className="rounded-xxl p-lg shadow-lg flex items-center gap-md text-left transition-transform active:scale-[0.97]"
              style={{ backgroundColor: childTheme.palette.cardBg }}
            >
              <span className="text-[36px]">🌱</span>
              <span>
                <span className="block text-subtitle font-extrabold" style={{ color: childTheme.palette.primaryDark }}>Básico</span>
                <span className="block text-caption" style={{ color: childTheme.palette.primaryDark, opacity: 0.7 }}>Frases curtas, tipo &quot;EU GOSTO&quot;</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => loadLevel('medium')}
              className="rounded-xxl p-lg shadow-lg flex items-center gap-md text-left transition-transform active:scale-[0.97]"
              style={{ backgroundColor: childTheme.palette.cardBg }}
            >
              <span className="text-[36px]">🌳</span>
              <span>
                <span className="block text-subtitle font-extrabold" style={{ color: childTheme.palette.primaryDark }}>Médio</span>
                <span className="block text-caption" style={{ color: childTheme.palette.primaryDark, opacity: 0.7 }}>Frases maiores, tipo &quot;EU QUERO BRINCAR COM A BOLA&quot;</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center" style={{ backgroundImage: `linear-gradient(160deg, ${childTheme.backgroundGradient.join(', ')})` }}>
        <Loading variant="inline" message="Carregando..." color={childTheme.palette.primaryDark} />
      </div>
    )
  }

  if (roleKeys.length === 0) {
    return (
      <div className="min-h-dvh flex flex-col" style={{ backgroundImage: `linear-gradient(160deg, ${childTheme.backgroundGradient.join(', ')})` }}>
        <div className="flex items-center px-xl pt-[calc(env(safe-area-inset-top)+12px)] pb-md">
          <button type="button" onClick={() => router.back()} aria-label="Voltar" className="w-10 h-10 rounded-pill bg-white/60 shadow-sm flex items-center justify-center">
            <ArrowLeft size={20} color={childTheme.palette.primaryDark} />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center px-xl">
          <EmptyState
            icon={<MessageCircle size={48} color={childTheme.palette.primaryDark} />}
            title="Nenhuma palavra disponível"
            description="Ainda não há palavras cadastradas para este nível. Tente novamente mais tarde."
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh flex flex-col" style={{ backgroundImage: `linear-gradient(160deg, ${childTheme.backgroundGradient.join(', ')})` }}>
      {/* Header */}
      <div className="flex items-center justify-between px-xl pt-[calc(env(safe-area-inset-top)+12px)] pb-sm gap-md">
        <button type="button" onClick={() => router.back()} aria-label="Voltar" className="w-10 h-10 rounded-pill bg-white/60 shadow-sm flex items-center justify-center shrink-0">
          <ArrowLeft size={20} color={childTheme.palette.primaryDark} />
        </button>

        <div className="flex-1 min-w-0 text-center">
          <h1 className="text-h3 font-extrabold truncate" style={{ color: childTheme.palette.primaryDark }}>
            💬 Monte sua frase
          </h1>
          <button type="button" onClick={changeLevel} className="text-caption truncate underline" style={{ color: childTheme.palette.primaryDark, opacity: 0.75 }}>
            Nível {level === 'easy' ? 'Básico' : 'Médio'} · trocar
          </button>
        </div>

        <div className="flex items-center gap-xs shrink-0">
          <span className="flex items-center gap-1 px-sm py-1 rounded-pill bg-white/70 shadow-sm">
            <Star size={13} color={colors.warning} />
            <span className="text-caption font-extrabold" style={{ color: childTheme.palette.primaryDark }}>{score}</span>
          </span>
          <span className="flex items-center gap-1 px-sm py-1 rounded-pill bg-white/70 shadow-sm">
            <Target size={13} color={childTheme.palette.primary} />
            <span className="text-caption font-extrabold" style={{ color: childTheme.palette.primaryDark }}>{attempts}</span>
          </span>
        </div>
      </div>

      {/* Abas de categoria */}
      <div className="px-xl pb-sm overflow-x-auto">
        <div className="flex gap-sm w-max">
          {roleKeys.map(role => {
            const config = ROLE_CONFIG[role] ?? DEFAULT_ROLE_CONFIG
            const active = selectedRole === role
            return (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className="flex items-center gap-1.5 px-md h-9 rounded-pill shadow-sm shrink-0 transition-transform active:scale-[0.97]"
                style={
                  active
                    ? { backgroundImage: `linear-gradient(135deg, ${config.gradient.join(', ')})` }
                    : { backgroundColor: 'rgba(255,255,255,0.75)' }
                }
              >
                <span className="text-body-small">{config.emoji}</span>
                <span className="text-caption font-bold whitespace-nowrap" style={{ color: active ? 'white' : childTheme.palette.primaryDark }}>
                  {config.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Grade de palavras */}
      <div className="flex-1 overflow-y-auto px-xl pb-md">
        <div className="grid grid-cols-3 gap-sm">
          {(wordsByRole[selectedRole] ?? []).map(word => {
            const config = ROLE_CONFIG[word.role] ?? DEFAULT_ROLE_CONFIG
            const isPicked = phrase.includes(word.text)
            const isAnimating = animatingWord === word.text
            return (
              <motion.button
                key={word.text}
                type="button"
                onClick={() => handleWordPress(word)}
                animate={{ scale: isAnimating ? 1.06 : isPicked ? 1.02 : 1 }}
                className="rounded-xl overflow-hidden shadow-sm text-center relative"
                style={{
                  backgroundColor: childTheme.palette.cardBg,
                  border: `2px solid ${isPicked ? childTheme.palette.primary : 'rgba(255,255,255,0.6)'}`,
                }}
              >
                <div className="h-1 w-full" style={{ backgroundImage: `linear-gradient(90deg, ${config.gradient.join(', ')})` }} />
                <div className="px-xs py-sm flex flex-col items-center gap-1 min-h-[76px] justify-center">
                  {word.emoji ? (
                    <span className="text-[26px] leading-none">{word.emoji}</span>
                  ) : (
                    <span
                      className="w-8 h-8 rounded-md flex items-center justify-center text-body-small font-extrabold text-white"
                      style={{ backgroundImage: `linear-gradient(135deg, ${config.gradient.join(', ')})` }}
                    >
                      {word.text.length > 3 ? word.text.slice(0, 2).toUpperCase() : word.text}
                    </span>
                  )}
                  <span className="text-[11px] font-bold leading-tight line-clamp-2" style={{ color: childTheme.palette.primaryDark }}>
                    {word.text}
                  </span>
                </div>
                {isPicked && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-pill bg-success flex items-center justify-center">
                    <CheckCircle2 size={11} color="white" />
                  </span>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Tira da frase */}
      <div className="px-xl pb-sm">
        <div className="rounded-xl p-md shadow-md min-h-[64px]" style={{ backgroundColor: childTheme.palette.cardBg }}>
          <div className="flex items-center gap-xs mb-xs">
            <MessageCircle size={16} color={childTheme.palette.primaryDark} />
            <span className="text-caption font-bold flex-1" style={{ color: childTheme.palette.primaryDark }}>Sua frase</span>
            {phrase.length > 0 && (
              <span className="px-2 py-0.5 rounded-pill text-[10px] font-extrabold text-white" style={{ backgroundColor: childTheme.palette.primary }}>
                {phrase.length}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-xs min-h-[28px]">
            {phrase.length > 0 ? (
              phrase.map((word, i) => (
                <span key={`${word}-${i}`} className="px-sm py-1 rounded-pill text-caption font-semibold" style={{ backgroundColor: 'rgba(0,0,0,0.06)', color: childTheme.palette.primaryDark }}>
                  {word}
                </span>
              ))
            ) : (
              <span className="text-caption italic" style={{ color: childTheme.palette.primaryDark, opacity: 0.6 }}>
                Toque nas palavras para começar...
              </span>
            )}
          </div>
          {feedback && (
            <p className="text-caption font-semibold mt-xs" style={{ color: colors.warningDark ?? colors.warning }}>
              {feedback}
            </p>
          )}
        </div>
      </div>

      {/* Ações */}
      <div className="flex px-xl pb-[calc(env(safe-area-inset-bottom)+16px)] gap-xs">
        <button
          type="button"
          onClick={handleSpeakPhrase}
          disabled={phrase.length === 0}
          className="flex-1 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 shadow-sm disabled:opacity-40"
          style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}
        >
          <Volume2 size={16} color={childTheme.palette.primaryDark} />
          <span className="text-[10px] font-bold" style={{ color: childTheme.palette.primaryDark }}>Falar</span>
        </button>
        <button
          type="button"
          onClick={handleDeleteLast}
          disabled={phrase.length === 0}
          className="flex-1 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 shadow-sm disabled:opacity-40"
          style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}
        >
          <Delete size={16} color={childTheme.palette.primaryDark} />
          <span className="text-[10px] font-bold" style={{ color: childTheme.palette.primaryDark }}>Apagar</span>
        </button>
        <button
          type="button"
          onClick={handleClearAll}
          disabled={phrase.length === 0}
          className="flex-1 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 shadow-sm disabled:opacity-40"
          style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}
        >
          <Eraser size={16} color={childTheme.palette.primaryDark} />
          <span className="text-[10px] font-bold" style={{ color: childTheme.palette.primaryDark }}>Limpar</span>
        </button>
        <button
          type="button"
          onClick={handleVerify}
          disabled={phrase.length < 2}
          className="flex-[1.4] h-12 rounded-xl flex items-center justify-center gap-1.5 shadow-md disabled:opacity-40"
          style={{ backgroundImage: `linear-gradient(135deg, ${childTheme.correctGradient.join(', ')})` }}
        >
          <Wand2 size={16} color="white" />
          <span className="text-caption font-extrabold text-white">Verificar</span>
        </button>
      </div>

      <AnimatePresence>
        {gameState === 'correct' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: reduceMotion ? 0 : 0.25 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50 px-xl"
          >
            <div className="rounded-xl px-xxl py-xl flex flex-col items-center shadow-xl" style={{ backgroundImage: `linear-gradient(135deg, ${childTheme.correctGradient.join(', ')})` }}>
              <Sparkles size={44} color="white" />
              <span className="text-h3 text-white font-extrabold mt-sm">Frase válida! 🎉</span>
              <span className="text-body-small text-white/90 mt-1 flex items-center gap-1">
                <RefreshCcw size={12} /> Toque nas palavras pra montar outra
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
