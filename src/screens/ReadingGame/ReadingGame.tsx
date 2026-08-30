'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image, { type StaticImageData } from 'next/image'
import confetti from 'canvas-confetti'
import { ArrowLeft, CheckCircle2, Eye, Star, Target, Volume2, XCircle } from 'lucide-react'

import { api } from '@/services/api'
import { readGameNav } from '@/lib/navState'
import { ANIMALS_IMAGE_MAP } from '@/lib/gameImages'
import { speak } from '@/lib/speech'
import { playSound } from '@/lib/sound'
import { useChildTheme, useReduceMotion, useLowStimulation } from '@/hooks'
import { EmptyState, Loading } from '@/components/feedback'
import { colors } from '@/theme'

interface AnimalOption {
  label: string
  emoji: string
  sound: string
  image?: StaticImageData
}

interface Question {
  correct: AnimalOption
  options: AnimalOption[]
}

type GameState = 'playing' | 'correct' | 'wrong'

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => 0.5 - Math.random())
}

export default function ReadingGame() {
  const router = useRouter()
  const reduceMotion = useReduceMotion()
  const lowStimulationMode = useLowStimulation()
  const navState = useMemo(() => readGameNav(), [])
  const childTheme = useChildTheme(navState?.gender)

  const [animalsData, setAnimalsData] = useState<AnimalOption[]>([])
  const [question, setQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(true)
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [gameState, setGameState] = useState<GameState>('playing')

  const scoreRef = useRef(0)
  const attemptsRef = useRef(0)
  const startTimeRef = useRef(Date.now())
  scoreRef.current = score
  attemptsRef.current = attempts

  const generateQuestion = useCallback((source: AnimalOption[]) => {
    if (source.length === 0) return
    const correct = source[Math.floor(Math.random() * source.length)]
    const wrong = shuffle(source.filter(a => a.label !== correct.label)).slice(0, 3)
    setQuestion({ correct, options: shuffle([correct, ...wrong]) })
    setSelectedOption(null)
    setGameState('playing')
  }, [])

  useEffect(() => {
    let cancelled = false
    api
      .get('/words', { params: { gameType: 'ReadingGame' } })
      .then(res => {
        if (cancelled) return
        const items: AnimalOption[] = res.data.map((w: any) => ({
          label: w.text,
          emoji: w.emoji ?? '',
          sound: w.sound ?? '',
          image: w.imageUrl ? ANIMALS_IMAGE_MAP[w.imageUrl] : undefined,
        }))
        setAnimalsData(items)
        generateQuestion(items)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [generateQuestion])

  useEffect(() => {
    const childId = navState?.childId
    return () => {
      if (childId && attemptsRef.current > 0) {
        api
          .post('/game-sessions', {
            childId,
            gameType: 'ReadingGame',
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
      spread: 70,
      origin: { y: 0.6 },
      colors: [colors.accent, colors.success, colors.info, colors.secondary],
    })
  }, [lowStimulationMode])

  const handleOptionPress = useCallback(
    (option: AnimalOption) => {
      if (gameState !== 'playing' || !question) return

      setSelectedOption(option.label)
      setAttempts(a => a + 1)
      speak(option.label)

      if (option.label === question.correct.label) {
        setGameState('correct')
        setScore(s => s + 1)
        playSound('/sounds/correct.mp3')
        fireConfetti()
        setTimeout(() => generateQuestion(animalsData), 2400)
      } else {
        setGameState('wrong')
        setTimeout(() => {
          setGameState('playing')
          setSelectedOption(null)
        }, 1400)
      }
    },
    [gameState, question, animalsData, generateQuestion, fireConfetti],
  )

  const speakWord = useCallback(() => {
    if (question) speak(question.correct.label, { rate: 1, pitch: 1.1 })
  }, [question])

  if (loading) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center" style={{ backgroundImage: `linear-gradient(160deg, ${childTheme.backgroundGradient.join(', ')})` }}>
        <Loading variant="inline" message="Carregando..." color={childTheme.palette.primaryDark} />
      </div>
    )
  }

  if (!question) {
    return (
      <div className="min-h-dvh flex flex-col" style={{ backgroundImage: `linear-gradient(160deg, ${childTheme.backgroundGradient.join(', ')})` }}>
        <div className="flex items-center px-xl pt-[calc(env(safe-area-inset-top)+12px)] pb-md">
          <button type="button" onClick={() => router.back()} aria-label="Voltar" className="w-10 h-10 rounded-pill bg-white/60 shadow-sm flex items-center justify-center">
            <ArrowLeft size={20} color={childTheme.palette.primaryDark} />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center px-xl">
          <EmptyState
            icon={<Eye size={48} color={childTheme.palette.primaryDark} />}
            title="Nenhuma palavra disponível"
            description="Ainda não há atividades cadastradas para o Jogo de Leitura. Tente novamente mais tarde."
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh flex flex-col" style={{ backgroundImage: `linear-gradient(160deg, ${childTheme.backgroundGradient.join(', ')})` }}>
      <div className="flex items-center justify-between px-xl pt-[calc(env(safe-area-inset-top)+12px)] pb-md gap-md">
        <button type="button" onClick={() => router.back()} aria-label="Voltar" className="w-10 h-10 rounded-pill bg-white/60 shadow-sm flex items-center justify-center shrink-0">
          <ArrowLeft size={20} color={childTheme.palette.primaryDark} />
        </button>

        <div className="flex-1 min-w-0 text-center">
          <h1 className="text-h3 font-extrabold truncate" style={{ color: childTheme.palette.primaryDark }}>
            🎯 Jogo de Leitura
          </h1>
          <p className="text-caption truncate" style={{ color: childTheme.palette.primaryDark, opacity: 0.75 }}>
            {navState?.childName ? `Vamos lá, ${navState.childName}!` : 'Toque no animal certo'}
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
          key={`${question.correct.label}-${score}-${attempts}`}
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-xxl p-xl shadow-lg mb-lg"
          style={{ backgroundColor: childTheme.palette.cardBg }}
        >
          <div className="flex items-center gap-sm mb-md">
            <p className="flex-1 text-subtitle font-bold" style={{ color: childTheme.palette.primaryDark }}>
              Toque no animal:
            </p>
            <button type="button" onClick={speakWord} aria-label="Ouvir palavra" className="w-9 h-9 rounded-pill bg-white/70 shadow-sm flex items-center justify-center shrink-0">
              <Volume2 size={18} color={childTheme.palette.primary} />
            </button>
          </div>

          <div className="flex flex-col items-center py-md">
            <span className="text-[48px] leading-[56px] mb-sm">{question.correct.emoji}</span>
            <span className="text-h3 font-extrabold" style={{ color: childTheme.palette.primary }}>
              {question.correct.label}
            </span>
            {question.correct.sound ? (
              <span className="text-body-small italic mt-sm font-semibold" style={{ color: childTheme.palette.primaryDark, opacity: 0.75 }}>
                &quot;{question.correct.sound}&quot;
              </span>
            ) : null}
          </div>
        </motion.div>

        <p className="text-subtitle font-extrabold text-center mb-md" style={{ color: childTheme.palette.primaryDark }}>
          🖼️ Escolha a imagem correta
        </p>

        <div className="grid grid-cols-2 gap-md">
          {question.options.map(option => {
            const isSelected = selectedOption === option.label
            const isCorrectAnswer = option.label === question.correct.label
            const showCorrect = gameState === 'correct' && isCorrectAnswer
            const showWrong = gameState === 'wrong' && isSelected

            const borderColor = showCorrect ? colors.success : showWrong ? colors.error : isSelected ? childTheme.palette.primary : 'rgba(255,255,255,0.6)'
            const accentGradient = showCorrect ? childTheme.correctGradient : showWrong ? childTheme.wrongGradient : childTheme.primaryGradient
            const fillStyle = showCorrect
              ? { backgroundImage: `linear-gradient(135deg, ${childTheme.correctGradient.join(', ')})` }
              : showWrong
                ? { backgroundImage: `linear-gradient(135deg, ${childTheme.wrongGradient.join(', ')})` }
                : { backgroundColor: childTheme.palette.cardBg }

            return (
              <button
                key={option.label}
                type="button"
                onClick={() => handleOptionPress(option)}
                disabled={gameState === 'correct'}
                className="rounded-xl overflow-hidden shadow-md text-left transition-transform active:scale-[0.97] disabled:pointer-events-none"
                style={{ border: `2px solid ${borderColor}`, ...fillStyle }}
              >
                <div className="h-1.5 w-full" style={{ backgroundImage: `linear-gradient(90deg, ${accentGradient.join(', ')})` }} />
                <div className="p-md flex flex-col items-center">
                  <div className="relative w-full h-[100px] flex items-center justify-center mb-sm">
                    {option.image ? (
                      <Image src={option.image} alt={option.label} width={90} height={90} className="max-w-[90px] max-h-[90px] object-contain" />
                    ) : (
                      <span className="text-[40px]">{option.emoji}</span>
                    )}
                    {showCorrect && (
                      <span className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-pill bg-success flex items-center justify-center border-2 border-white">
                        <CheckCircle2 size={16} color="white" />
                      </span>
                    )}
                    {showWrong && (
                      <span className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-pill bg-error flex items-center justify-center border-2 border-white">
                        <XCircle size={16} color="white" />
                      </span>
                    )}
                  </div>
                  <span className="text-body-small font-bold text-center line-clamp-2" style={{ color: showCorrect || showWrong ? 'white' : childTheme.palette.primaryDark }}>
                    {option.label}
                  </span>
                </div>
              </button>
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
              <CheckCircle2 size={44} color="white" />
              <span className="text-h3 text-white font-extrabold mt-sm">Parabéns! 🎉</span>
              <span className="text-body-small text-white/90 mt-1">Você acertou!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
