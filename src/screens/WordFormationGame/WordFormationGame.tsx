'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image, { type StaticImageData } from 'next/image'
import confetti from 'canvas-confetti'
import { ArrowLeft, CheckCircle2, Puzzle, RotateCcw, Star, StarHalf, Target } from 'lucide-react'

import { api } from '@/services/api'
import { readGameNav } from '@/lib/navState'
import { WORDS_IMAGE_MAP } from '@/lib/gameImages'
import { playSound } from '@/lib/sound'
import { useChildTheme, useReduceMotion, useLowStimulation } from '@/hooks'
import { EmptyState, Loading } from '@/components/feedback'
import { AlertModal, useAlertModal } from '@/components/common'
import { colors } from '@/theme'

interface WordItem {
  word: string
  image?: StaticImageData
  emoji: string
  difficulty: string
}

type GameState = 'playing' | 'checking' | 'correct'

const DIFFICULTY_CONFIG: Record<string, { label: string; gradient: readonly [string, string]; Icon: typeof Star }> = {
  easy: { label: 'Fácil', gradient: [colors.success, colors.successDark] as const, Icon: Star },
  medium: { label: 'Médio', gradient: [colors.warning, colors.warningDark] as const, Icon: StarHalf },
  hard: { label: 'Difícil', gradient: [colors.error, colors.errorDark] as const, Icon: Star },
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => 0.5 - Math.random())
}

export default function WordFormationGame() {
  const router = useRouter()
  const reduceMotion = useReduceMotion()
  const lowStimulationMode = useLowStimulation()
  const navState = useMemo(() => readGameNav(), [])
  const childTheme = useChildTheme(navState?.gender)
  const alert = useAlertModal()

  const [wordsData, setWordsData] = useState<WordItem[]>([])
  const [currentWord, setCurrentWord] = useState<WordItem | null>(null)
  const [availableLetters, setAvailableLetters] = useState<string[]>([])
  const [letterPositions, setLetterPositions] = useState<(string | null)[]>([])
  const [loading, setLoading] = useState(true)
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [gameState, setGameState] = useState<GameState>('playing')
  const [showQuaseLa, setShowQuaseLa] = useState(false)

  const scoreRef = useRef(0)
  const attemptsRef = useRef(0)
  const startTimeRef = useRef(Date.now())
  scoreRef.current = score
  attemptsRef.current = attempts

  const generateNewWord = useCallback((source: WordItem[]) => {
    if (source.length === 0) return
    const word = source[Math.floor(Math.random() * source.length)]
    setCurrentWord(word)
  }, [])

  useEffect(() => {
    let cancelled = false
    api
      .get('/words', { params: { gameType: 'WordFormationGame' } })
      .then(res => {
        if (cancelled) return
        const items: WordItem[] = res.data.map((w: any) => ({
          word: w.text,
          image: w.imageUrl ? WORDS_IMAGE_MAP[w.imageUrl] : undefined,
          emoji: w.emoji ?? '',
          difficulty: w.difficulty ?? 'easy',
        }))
        setWordsData(items)
        generateNewWord(items)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [generateNewWord])

  useEffect(() => {
    if (!currentWord) return
    const shuffled = shuffle(currentWord.word.split(''))
    setAvailableLetters(shuffled)
    setLetterPositions(new Array(currentWord.word.length).fill(null))
    setGameState('playing')
  }, [currentWord])

  useEffect(() => {
    const childId = navState?.childId
    return () => {
      if (childId && attemptsRef.current > 0) {
        api
          .post('/game-sessions', {
            childId,
            gameType: 'WordFormationGame',
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
      particleCount: 110,
      spread: 75,
      origin: { y: 0.6 },
      colors: [colors.accent, colors.success, colors.info, colors.secondary],
    })
  }, [lowStimulationMode])

  const handleLetterClick = useCallback(
    (index: number) => {
      if (gameState !== 'playing') return
      const letter = availableLetters[index]
      const firstEmpty = letterPositions.indexOf(null)
      if (firstEmpty === -1) return

      const newPositions = [...letterPositions]
      newPositions[firstEmpty] = letter
      setLetterPositions(newPositions)
      setAvailableLetters(prev => prev.filter((_, i) => i !== index))
    },
    [gameState, availableLetters, letterPositions],
  )

  const handleSlotClick = useCallback(
    (index: number) => {
      if (gameState !== 'playing') return
      const letter = letterPositions[index]
      if (!letter) return

      const newPositions = [...letterPositions]
      newPositions[index] = null
      setLetterPositions(newPositions)
      setAvailableLetters(prev => [...prev, letter])
    },
    [gameState, letterPositions],
  )

  const resetWord = useCallback(() => {
    if (!currentWord) return
    setAvailableLetters(shuffle(currentWord.word.split('')))
    setLetterPositions(new Array(currentWord.word.length).fill(null))
    setGameState('playing')
  }, [currentWord])

  const checkWord = useCallback(() => {
    if (!currentWord) return
    if (letterPositions.some(pos => pos === null)) {
      alert.showWarning('Complete todas as letras primeiro!', '🤔 Ops!')
      return
    }

    setGameState('checking')
    setAttempts(a => a + 1)

    setTimeout(() => {
      const guess = letterPositions.join('').toLowerCase()
      if (guess === currentWord.word.toLowerCase()) {
        setGameState('correct')
        setScore(s => s + 1)
        playSound('/sounds/correct.mp3')
        fireConfetti()
        setTimeout(() => generateNewWord(wordsData), 2800)
      } else {
        setGameState('playing')
        setShowQuaseLa(true)
        setTimeout(() => setShowQuaseLa(false), 2000)
      }
    }, 400)
  }, [currentWord, letterPositions, alert, fireConfetti, generateNewWord, wordsData])

  if (loading) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center" style={{ backgroundImage: `linear-gradient(160deg, ${childTheme.backgroundGradient.join(', ')})` }}>
        <Loading variant="inline" message="Carregando..." color={childTheme.palette.primaryDark} />
      </div>
    )
  }

  if (!currentWord) {
    return (
      <div className="min-h-dvh flex flex-col" style={{ backgroundImage: `linear-gradient(160deg, ${childTheme.backgroundGradient.join(', ')})` }}>
        <div className="flex items-center px-xl pt-[calc(env(safe-area-inset-top)+12px)] pb-md">
          <button type="button" onClick={() => router.back()} aria-label="Voltar" className="w-10 h-10 rounded-pill bg-white/60 shadow-sm flex items-center justify-center">
            <ArrowLeft size={20} color={childTheme.palette.primaryDark} />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center px-xl">
          <EmptyState
            icon={<Puzzle size={48} color={childTheme.palette.primaryDark} />}
            title="Nenhuma palavra disponível"
            description="Ainda não há atividades cadastradas para o Jogo de Formação de Palavras. Tente novamente mais tarde."
          />
        </div>
      </div>
    )
  }

  const difficulty = DIFFICULTY_CONFIG[currentWord.difficulty] ?? DIFFICULTY_CONFIG.easy

  return (
    <div className="min-h-dvh flex flex-col" style={{ backgroundImage: `linear-gradient(160deg, ${childTheme.backgroundGradient.join(', ')})` }}>
      <div className="flex items-center justify-between px-xl pt-[calc(env(safe-area-inset-top)+12px)] pb-md gap-md">
        <button type="button" onClick={() => router.back()} aria-label="Voltar" className="w-10 h-10 rounded-pill bg-white/60 shadow-sm flex items-center justify-center shrink-0">
          <ArrowLeft size={20} color={childTheme.palette.primaryDark} />
        </button>

        <div className="flex-1 min-w-0 text-center">
          <h1 className="text-h3 font-extrabold truncate" style={{ color: childTheme.palette.primaryDark }}>
            🧩 Formação de Palavras
          </h1>
          <p className="text-caption truncate" style={{ color: childTheme.palette.primaryDark, opacity: 0.75 }}>
            {navState?.childName ? `Bora, ${navState.childName}!` : 'Junte as letrinhas'}
          </p>
        </div>

        <div className="flex items-center gap-xs shrink-0">
          <span className="flex items-center gap-1 px-sm py-1 rounded-pill bg-white/70 shadow-sm">
            <Star size={13} color={colors.warning} />
            <span className="text-caption font-extrabold" style={{ color: childTheme.palette.primaryDark }}>
              {score}
            </span>
          </span>
          <span className="flex items-center gap-1 px-sm py-1 rounded-pill bg-white/70 shadow-sm">
            <Target size={13} color={childTheme.palette.primary} />
            <span className="text-caption font-extrabold" style={{ color: childTheme.palette.primaryDark }}>
              {attempts}
            </span>
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-xl pb-huge">
        <motion.div
          key={currentWord.word}
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-xxl overflow-hidden shadow-lg mb-lg"
          style={{ backgroundColor: childTheme.palette.cardBg }}
        >
          <div className="h-1.5 w-full" style={{ backgroundImage: `linear-gradient(90deg, ${difficulty.gradient.join(', ')})` }} />
          <div className="p-xl">
            <div className="flex items-center justify-between mb-lg">
              <span
                className="flex items-center gap-1 px-sm py-1 rounded-pill"
                style={{ backgroundImage: `linear-gradient(135deg, ${difficulty.gradient.join(', ')})` }}
              >
                <difficulty.Icon size={13} color="white" />
                <span className="text-caption font-extrabold text-white">{difficulty.label}</span>
              </span>

              <button type="button" onClick={resetWord} aria-label="Reiniciar palavra" className="w-9 h-9 rounded-pill bg-white/70 shadow-sm flex items-center justify-center">
                <RotateCcw size={16} color={childTheme.palette.primary} />
              </button>
            </div>

            <div className="flex flex-col items-center py-md">
              <div className="w-[110px] h-[110px] rounded-xl bg-white/85 shadow-sm flex items-center justify-center mb-md">
                {currentWord.image ? (
                  <Image src={currentWord.image} alt={currentWord.word} width={90} height={90} className="max-w-[90px] max-h-[90px] object-contain" />
                ) : (
                  <span className="text-[56px]">{currentWord.emoji || '🧩'}</span>
                )}
              </div>
              <p className="text-body-small font-semibold text-center" style={{ color: childTheme.palette.primaryDark, opacity: 0.8 }}>
                Toque nas letras para formar a palavra!
              </p>
            </div>
          </div>
        </motion.div>

        <p className="text-subtitle font-extrabold text-center mb-md" style={{ color: childTheme.palette.primaryDark }}>
          📝 Letras Disponíveis
        </p>
        <div className="flex flex-wrap justify-center gap-sm mb-lg">
          {availableLetters.map((letter, index) => (
            <button
              key={`${letter}-${index}`}
              type="button"
              onClick={() => handleLetterClick(index)}
              disabled={gameState !== 'playing'}
              className="w-14 h-14 rounded-xl shadow-md flex items-center justify-center text-h3 font-extrabold transition-transform active:scale-[0.92] disabled:pointer-events-none"
              style={{ backgroundColor: childTheme.palette.cardBg, color: childTheme.palette.primaryDark, border: '2px solid rgba(255,255,255,0.6)' }}
            >
              {letter}
            </button>
          ))}
        </div>

        <p className="text-subtitle font-extrabold text-center mb-md" style={{ color: childTheme.palette.primaryDark }}>
          ✨ Sua Palavra
        </p>
        <div className="flex flex-wrap justify-center gap-sm mb-xl">
          {letterPositions.map((letter, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSlotClick(index)}
              disabled={gameState !== 'playing' || !letter}
              className="w-14 h-14 rounded-xl shadow-sm flex items-center justify-center text-h3 font-extrabold transition-transform active:scale-[0.92] disabled:pointer-events-none"
              style={
                letter
                  ? { backgroundImage: `linear-gradient(135deg, ${childTheme.primaryGradient.join(', ')})`, color: 'white', border: '2px solid rgba(255,255,255,0.6)' }
                  : { backgroundColor: 'rgba(255,255,255,0.5)', color: childTheme.palette.primaryDark, border: '2px dashed rgba(0,0,0,0.15)' }
              }
            >
              {letter || '_'}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={checkWord}
          disabled={gameState === 'checking'}
          className="w-full min-h-[54px] rounded-pill shadow-lg flex items-center justify-center gap-sm text-button font-extrabold text-white transition-transform active:scale-[0.98] disabled:opacity-70"
          style={{ backgroundImage: `linear-gradient(135deg, ${childTheme.correctGradient.join(', ')})` }}
        >
          <CheckCircle2 size={20} />
          {gameState === 'checking' ? 'Verificando...' : 'Verificar Palavra'}
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
              <CheckCircle2 size={44} color="white" />
              <span className="text-h3 text-white font-extrabold mt-sm">Parabéns! 🎉</span>
              <span className="text-body-small text-white/90 mt-1">Palavra formada corretamente!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showQuaseLa && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: reduceMotion ? 0 : 0.25 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50 px-xl"
          >
            <div className="w-[260px] rounded-xl overflow-hidden shadow-xl bg-white">
              <div className="py-lg px-xl flex flex-col items-center" style={{ backgroundImage: `linear-gradient(135deg, ${colors.warning}, ${colors.warningDark})` }}>
                <span className="text-[42px] mb-1">😅</span>
                <span className="text-h3 font-extrabold text-white">Quase lá!</span>
              </div>
              <div className="p-lg text-center">
                <p className="text-body-small font-semibold" style={{ color: childTheme.palette.primaryDark }}>
                  Tente novamente!
                  <br />
                  Você consegue! 💪
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AlertModal
        visible={alert.state.visible}
        onClose={alert.hide}
        title={alert.state.title}
        message={alert.state.message}
        variant={alert.state.variant}
        actions={alert.state.actions}
        autoHideMs={alert.state.autoHideMs}
      />
    </div>
  )
}
