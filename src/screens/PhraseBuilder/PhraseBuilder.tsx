'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  ArrowLeft, CheckCircle2, MessageCircle, Sparkles, Star, Target,
  Volume2, Delete, Eraser, Wand2, RefreshCcw, X,
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
  category: string
}

// Categoria temática (comunicação) → apresentação da grade de categorias.
// Mesma lista de categorias usada no seed (Letrinhas-Encantadas-back/prisma/seed-games.ts).
// O papel GRAMATICAL de cada palavra (usado só pra validar a frase) vive à parte,
// em `data.role` de cada Word — não tem relação com essas categorias que a criança vê.
const CATEGORY_CONFIG: Record<string, { label: string; emoji: string; gradient: readonly [string, string] }> = {
  pessoas_familia: { label: 'Pessoas', emoji: '👤', gradient: ['#FF6B9D', '#FF8E9B'] },
  necessidades: { label: 'Necessidades', emoji: '🧩', gradient: ['#FFB74D', '#FF9800'] },
  comunicacao: { label: 'Comunicação', emoji: '🗣️', gradient: ['#FDCB6E', '#E17055'] },
  sentimentos: { label: 'Sentimentos', emoji: '❤️', gradient: ['#A8E6CF', '#4FA88F'] },
  comida_bebida: { label: 'Comida', emoji: '🍎', gradient: ['#FF9A8B', '#FF6B9D'] },
  acoes: { label: 'Ações', emoji: '🏃', gradient: ['#4ECDC4', '#2E8B84'] },
  objetos: { label: 'Objetos', emoji: '🧸', gradient: ['#81C784', '#388E3C'] },
  lugares: { label: 'Lugares', emoji: '🏠', gradient: ['#64B5F6', '#1976D2'] },
  brincadeiras: { label: 'Brincadeiras', emoji: '🎨', gradient: ['#BA68C8', '#9C27B0'] },
  corpo_higiene: { label: 'Corpo e Higiene', emoji: '👕', gradient: ['#90CAF9', '#42A5F5'] },
  palavras_ligacao: { label: 'Ligações', emoji: '🔗', gradient: ['#74B9FF', '#0984E3'] },
}
const CATEGORY_ORDER = Object.keys(CATEGORY_CONFIG)
const DEFAULT_CATEGORY_CONFIG = { label: 'Outros', emoji: '💬', gradient: ['#B0BEC5', '#78909C'] as const }

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

interface PhraseBarProps {
  phrase: string[]
  feedback: string | null
  primaryDark: string
  primaryColor: string
  correctGradient: readonly [string, string]
  onRemoveAt: (index: number) => void
  onSpeak: () => void
  onDeleteLast: () => void
  onClearAll: () => void
  onVerify: () => void
  sticky?: boolean
}

// Área da frase + ações — usada tanto na tela de categorias (visível o tempo
// todo, sem precisar entrar numa categoria) quanto na tela de palavras (onde
// fica "grudada" no topo, sticky, enquanto a grade de palavras rola por baixo).
function PhraseBar({
  phrase, feedback, primaryDark, primaryColor, correctGradient,
  onRemoveAt, onSpeak, onDeleteLast, onClearAll, onVerify, sticky,
}: PhraseBarProps) {
  return (
    <div className={sticky ? 'sticky top-0 z-10 px-xl pt-sm pb-sm' : 'px-xl pb-sm'} style={sticky ? { backgroundColor: 'transparent' } : undefined}>
      <div className="rounded-xl p-md shadow-md" style={{ backgroundColor: 'rgba(255,255,255,0.97)' }}>
        <div className="flex items-center gap-xs mb-xs">
          <MessageCircle size={16} color={primaryDark} />
          <span className="text-caption font-bold flex-1" style={{ color: primaryDark }}>Sua frase</span>
          {phrase.length > 0 && (
            <span className="px-2 py-0.5 rounded-pill text-[10px] font-extrabold text-white" style={{ backgroundColor: primaryColor }}>
              {phrase.length}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-xs min-h-[32px]">
          {phrase.length > 0 ? (
            phrase.map((word, i) => (
              <button
                key={`${word}-${i}`}
                type="button"
                onClick={() => onRemoveAt(i)}
                aria-label={`Remover ${word}`}
                className="flex items-center gap-1 pl-sm pr-1.5 py-1 rounded-pill text-caption font-semibold transition-transform active:scale-[0.93]"
                style={{ backgroundColor: 'rgba(0,0,0,0.06)', color: primaryDark }}
              >
                {word}
                <X size={12} strokeWidth={3} style={{ opacity: 0.6 }} />
              </button>
            ))
          ) : (
            <span className="text-caption italic" style={{ color: primaryDark, opacity: 0.6 }}>
              Toque nas palavras para começar...
            </span>
          )}
        </div>
        {feedback && (
          <p className="text-caption font-semibold mt-xs" style={{ color: colors.warningDark ?? colors.warning }}>
            {feedback}
          </p>
        )}

        <div className="flex gap-xs mt-sm">
          <button
            type="button"
            onClick={onSpeak}
            disabled={phrase.length === 0}
            aria-label="Ouvir frase"
            className="flex-1 h-11 rounded-lg flex items-center justify-center shadow-sm disabled:opacity-40 transition-transform active:scale-[0.95]"
            style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
          >
            <Volume2 size={18} color={primaryDark} />
          </button>
          <button
            type="button"
            onClick={onDeleteLast}
            disabled={phrase.length === 0}
            aria-label="Apagar última palavra"
            className="flex-1 h-11 rounded-lg flex items-center justify-center shadow-sm disabled:opacity-40 transition-transform active:scale-[0.95]"
            style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
          >
            <Delete size={18} color={primaryDark} />
          </button>
          <button
            type="button"
            onClick={onClearAll}
            disabled={phrase.length === 0}
            aria-label="Limpar frase"
            className="flex-1 h-11 rounded-lg flex items-center justify-center shadow-sm disabled:opacity-40 transition-transform active:scale-[0.95]"
            style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
          >
            <Eraser size={18} color={primaryDark} />
          </button>
          <button
            type="button"
            onClick={onVerify}
            disabled={phrase.length < 2}
            className="flex-[1.6] h-11 rounded-lg flex items-center justify-center gap-1.5 shadow-md disabled:opacity-40 transition-transform active:scale-[0.95]"
            style={{ backgroundImage: `linear-gradient(135deg, ${correctGradient.join(', ')})` }}
          >
            <Wand2 size={16} color="white" />
            <span className="text-caption font-extrabold text-white">Verificar</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PhraseBuilder() {
  const router = useRouter()
  const reduceMotion = useReduceMotion()
  const lowStimulationMode = useLowStimulation()
  const navState = useMemo(() => readGameNav(), [])
  const childTheme = useChildTheme(navState?.gender)

  const [level, setLevel] = useState<Difficulty | null>(null)
  const [loading, setLoading] = useState(false)
  const [wordsByCategory, setWordsByCategory] = useState<Record<string, WordItem[]>>({})
  const [roleByText, setRoleByText] = useState<Map<string, string>>(new Map())
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
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
    setSelectedCategory(null)
    setPhrase([])
    setFeedback(null)
    setGameState('building')

    api
      .get('/words', { params: { gameType: 'PhraseBuilder', difficulty: chosen } })
      .then(res => {
        const grouped: Record<string, WordItem[]> = {}
        const roleMap = new Map<string, string>()
        res.data.forEach((w: any) => {
          const category = w.category ?? 'objetos'
          const item: WordItem = { text: w.text, emoji: w.emoji ?? null, category }
          if (!grouped[category]) grouped[category] = []
          grouped[category].push(item)
          roleMap.set(w.text, w.data?.role ?? 'objeto')
        })
        setWordsByCategory(grouped)
        setRoleByText(roleMap)
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

  const handleRemoveAt = useCallback((index: number) => {
    setPhrase(prev => prev.filter((_, i) => i !== index))
    setFeedback(null)
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
    setWordsByCategory({})
    setRoleByText(new Map())
    setSelectedCategory(null)
    setPhrase([])
    setFeedback(null)
    setGameState('building')
  }, [])

  const categoryKeys = useMemo(() => {
    const present = Object.keys(wordsByCategory)
    const ordered = CATEGORY_ORDER.filter(c => present.includes(c))
    const extra = present.filter(c => !CATEGORY_ORDER.includes(c))
    return [...ordered, ...extra]
  }, [wordsByCategory])

  const phraseBarProps = {
    phrase,
    feedback,
    primaryDark: childTheme.palette.primaryDark,
    primaryColor: childTheme.palette.primary,
    correctGradient: childTheme.correctGradient,
    onRemoveAt: handleRemoveAt,
    onSpeak: handleSpeakPhrase,
    onDeleteLast: handleDeleteLast,
    onClearAll: handleClearAll,
    onVerify: handleVerify,
  }

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
            <motion.button
              type="button"
              onClick={() => loadLevel('easy')}
              whileTap={{ scale: 0.96 }}
              className="rounded-xxl p-lg shadow-lg flex items-center gap-md text-left"
              style={{ backgroundColor: childTheme.palette.cardBg }}
            >
              <span className="text-[36px]">🌱</span>
              <span>
                <span className="block text-subtitle font-extrabold" style={{ color: childTheme.palette.primaryDark }}>Básico</span>
                <span className="block text-caption" style={{ color: childTheme.palette.primaryDark, opacity: 0.7 }}>Frases curtas, tipo &quot;EU GOSTO&quot;</span>
              </span>
            </motion.button>
            <motion.button
              type="button"
              onClick={() => loadLevel('medium')}
              whileTap={{ scale: 0.96 }}
              className="rounded-xxl p-lg shadow-lg flex items-center gap-md text-left"
              style={{ backgroundColor: childTheme.palette.cardBg }}
            >
              <span className="text-[36px]">🌳</span>
              <span>
                <span className="block text-subtitle font-extrabold" style={{ color: childTheme.palette.primaryDark }}>Médio</span>
                <span className="block text-caption" style={{ color: childTheme.palette.primaryDark, opacity: 0.7 }}>Frases maiores, tipo &quot;EU QUERO BRINCAR COM A BOLA&quot;</span>
              </span>
            </motion.button>
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

  if (categoryKeys.length === 0) {
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

  const HeaderBar = ({ onBack, title, subtitleAction }: { onBack: () => void; title: string; subtitleAction: () => void }) => (
    <div className="flex items-center justify-between px-xl pt-[calc(env(safe-area-inset-top)+12px)] pb-sm gap-md">
      <motion.button type="button" onClick={onBack} whileTap={{ scale: 0.9 }} aria-label="Voltar" className="w-11 h-11 rounded-pill bg-white/70 shadow-sm flex items-center justify-center shrink-0">
        <ArrowLeft size={20} color={childTheme.palette.primaryDark} />
      </motion.button>

      <div className="flex-1 min-w-0 text-center">
        <h1 className="text-h3 font-extrabold truncate" style={{ color: childTheme.palette.primaryDark }}>
          {title}
        </h1>
        <button type="button" onClick={subtitleAction} className="text-caption truncate underline" style={{ color: childTheme.palette.primaryDark, opacity: 0.75 }}>
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
  )

  // ── Tela 2: escolher a categoria (grade grande, sem scroll lateral) ─────
  if (!selectedCategory) {
    return (
      <div className="min-h-dvh flex flex-col" style={{ backgroundImage: `linear-gradient(160deg, ${childTheme.backgroundGradient.join(', ')})` }}>
        <HeaderBar onBack={changeLevel} title="💬 Monte sua frase" subtitleAction={changeLevel} />

        <div className="flex-1 overflow-y-auto pb-huge">
          <PhraseBar {...phraseBarProps} />

          <p className="px-xl text-subtitle font-extrabold mb-md" style={{ color: childTheme.palette.primaryDark }}>
            🗂️ Escolha uma categoria
          </p>

          <div className="px-xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-md">
            {categoryKeys.map(category => {
              const config = CATEGORY_CONFIG[category] ?? DEFAULT_CATEGORY_CONFIG
              const count = wordsByCategory[category]?.length ?? 0
              return (
                <motion.button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-xxl overflow-hidden shadow-md text-left"
                  style={{ minHeight: 128 }}
                >
                  <span
                    className="flex flex-col items-center justify-center gap-1 h-full py-lg px-sm"
                    style={{ backgroundImage: `linear-gradient(135deg, ${config.gradient.join(', ')})` }}
                  >
                    <span className="text-[34px] leading-none mb-1">{config.emoji}</span>
                    <span className="text-body-small text-white font-extrabold text-center">{config.label}</span>
                    <span className="text-caption text-white/80">{count} palavras</span>
                  </span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // ── Tela 3: palavras da categoria escolhida (grade vertical, frase fixa em cima) ─
  const activeConfig = CATEGORY_CONFIG[selectedCategory] ?? DEFAULT_CATEGORY_CONFIG

  return (
    <div className="min-h-dvh flex flex-col" style={{ backgroundImage: `linear-gradient(160deg, ${childTheme.backgroundGradient.join(', ')})` }}>
      <HeaderBar onBack={() => setSelectedCategory(null)} title={`${activeConfig.emoji} ${activeConfig.label}`} subtitleAction={changeLevel} />

      <div className="flex-1 overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+24px)]">
        <PhraseBar {...phraseBarProps} sticky />

        <div className="px-xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-sm mt-sm">
          {(wordsByCategory[selectedCategory] ?? []).map(word => {
            const config = CATEGORY_CONFIG[word.category] ?? DEFAULT_CATEGORY_CONFIG
            const isPicked = phrase.includes(word.text)
            const isAnimating = animatingWord === word.text
            return (
              <motion.button
                key={word.text}
                type="button"
                onClick={() => handleWordPress(word)}
                animate={{ scale: isAnimating ? 1.06 : isPicked ? 1.02 : 1 }}
                whileTap={{ scale: 0.94 }}
                className="rounded-xl overflow-hidden shadow-sm text-center relative"
                style={{
                  backgroundColor: childTheme.palette.cardBg,
                  border: `2px solid ${isPicked ? childTheme.palette.primary : 'rgba(255,255,255,0.6)'}`,
                }}
              >
                <div className="h-1.5 w-full" style={{ backgroundImage: `linear-gradient(90deg, ${config.gradient.join(', ')})` }} />
                <div className="px-sm py-md flex flex-col items-center gap-1.5 min-h-[96px] justify-center">
                  {word.emoji ? (
                    <span className="text-[34px] leading-none">{word.emoji}</span>
                  ) : (
                    <span
                      className="w-10 h-10 rounded-md flex items-center justify-center text-body-small font-extrabold text-white"
                      style={{ backgroundImage: `linear-gradient(135deg, ${config.gradient.join(', ')})` }}
                    >
                      {word.text.length > 3 ? word.text.slice(0, 2).toUpperCase() : word.text}
                    </span>
                  )}
                  <span className="text-[13px] font-bold leading-tight line-clamp-2" style={{ color: childTheme.palette.primaryDark }}>
                    {word.text}
                  </span>
                </div>
                {isPicked && (
                  <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-pill bg-success flex items-center justify-center">
                    <CheckCircle2 size={13} color="white" />
                  </span>
                )}
              </motion.button>
            )
          })}
        </div>
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
