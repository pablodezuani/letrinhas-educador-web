'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, Gamepad2, MessageCircle, Music, Play, Puzzle } from 'lucide-react'
import { readSelectedChild, stashGameNav } from '@/lib/navState'

type Gender = 'menino' | 'menina'

type GameId = 'reading' | 'phrase-builder' | 'vowels' | 'word-formation'

interface GameDef {
  id: GameId
  title: string
  subtitle: string
  emoji: string
  Icon: typeof BookOpen
  colors: { menino: readonly [string, string]; menina: readonly [string, string] }
}

const GAME_BUTTONS: readonly GameDef[] = [
  { id: 'reading', title: 'Jogo de Leitura', subtitle: 'Aprenda a ler com os animais', emoji: '📚', Icon: BookOpen, colors: { menino: ['#4D9DE0', '#2196F3'], menina: ['#E07A9E', '#E91E63'] } },
  { id: 'phrase-builder', title: 'Formação de Frases', subtitle: 'Monte frases incríveis', emoji: '💬', Icon: MessageCircle, colors: { menino: ['#6A5ACD', '#9C27B0'], menina: ['#FF7AA2', '#F06292'] } },
  { id: 'vowels', title: 'Jogo das Vogais', subtitle: 'A · E · I · O · U', emoji: '🎵', Icon: Music, colors: { menino: ['#20B2AA', '#00BCD4'], menina: ['#F78DA7', '#FF4081'] } },
  { id: 'word-formation', title: 'Formação de Palavras', subtitle: 'Junte letrinhas e crie', emoji: '🧩', Icon: Puzzle, colors: { menino: ['#FFA07A', '#FF9800'], menina: ['#F06292', '#E91E63'] } },
]

const THEMES = {
  menino: { background: ['#E3F2FD', '#BBDEFB', '#90CAF9'], primary: '#1565C0', secondary: '#1976D2', avatarBorder: '#4D9DE0' },
  menina: { background: ['#FCE4EC', '#F8BBD9', '#F48FB1'], primary: '#AD1457', secondary: '#C2185B', avatarBorder: '#E07A9E' },
} as const

export default function ChildScreen() {
  const router = useRouter()
  const child = useMemo(() => readSelectedChild(), [])

  const gender: Gender = useMemo(() => (child ? (child.gender === 'female' ? 'menina' : 'menino') : 'menino'), [child])
  const displayName = child?.name || 'Amiguinho'
  const avatarSrc = child?.image || ''
  const childColor = child?.color
  const theme = THEMES[gender]

  const handleGamePress = (gameId: GameId) => {
    stashGameNav({ gender, childName: displayName, childColor, childId: child?.id })
    router.push(`/games/${gameId}`)
  }

  return (
    <div className="min-h-dvh relative overflow-hidden" style={{ backgroundImage: `linear-gradient(180deg, ${theme.background.join(', ')})` }}>
      <div className="absolute w-[180px] h-[180px] rounded-pill border-2 opacity-[0.18] -top-[60px] -right-[50px] pointer-events-none" style={{ borderColor: theme.avatarBorder }} />
      <div className="absolute w-[100px] h-[100px] rounded-pill border-2 opacity-[0.18] top-[140px] -left-[30px] pointer-events-none" style={{ borderColor: theme.avatarBorder }} />

      <div className="relative flex items-center justify-between px-xl pb-sm pt-[calc(env(safe-area-inset-top)+8px)]">
        <button type="button" onClick={() => router.back()} aria-label="Voltar" className="w-11 h-11 rounded-pill bg-white/85 shadow-sm flex items-center justify-center">
          <ArrowLeft size={22} color={theme.primary} />
        </button>

        <div className="flex items-center gap-xs px-md py-1.5 rounded-pill bg-white/85 shadow-sm">
          <Gamepad2 size={16} color={theme.primary} />
          <span className="text-caption font-extrabold" style={{ color: theme.primary }}>
            Hub de jogos
          </span>
        </div>
      </div>

      <div className="relative pb-huge overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 24, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }} className="mx-xl mb-sm rounded-xxl overflow-hidden shadow-lg">
          <div className="flex items-center gap-lg p-xl" style={{ backgroundImage: `linear-gradient(135deg, ${theme.background.join(', ')})` }}>
            <div className="relative w-[84px] h-[84px] rounded-pill border-[3.5px] overflow-hidden bg-white/60 shrink-0" style={{ borderColor: childColor ?? theme.avatarBorder }}>
              {avatarSrc ? <img src={avatarSrc} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-3xl">🙂</div>}
            </div>

            <div className="min-w-0">
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: theme.primary }} className="truncate">
                {displayName}
              </p>
              <p className="text-body-small opacity-85" style={{ color: theme.secondary }}>
                Pronto para aprender? 🎉
              </p>
              <span className="inline-flex items-center gap-1 mt-0.5 px-sm py-1 rounded-pill" style={{ backgroundColor: childColor ?? theme.primary }}>
                <Gamepad2 size={13} color="rgba(255,255,255,0.95)" />
                <span className="text-caption text-white/95 font-bold">Hub de Jogos</span>
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="px-xl pt-sm pb-xs">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: theme.primary }}>Olá, {displayName}! 👋</h1>
          <p className="text-body opacity-85" style={{ color: theme.secondary }}>
            Escolhe um joguinho para hoje
          </p>
        </motion.div>

        <div className="flex items-baseline justify-between px-xl mb-sm">
          <h2 className="text-h3 font-extrabold" style={{ color: theme.primary }}>
            🎮 Mini-jogos
          </h2>
          <span className="text-caption font-bold" style={{ color: theme.secondary }}>
            {GAME_BUTTONS.length} disponíveis
          </span>
        </div>

        <div className="px-xl flex flex-wrap gap-md mb-lg">
          {GAME_BUTTONS.map((game, i) => (
            <motion.button
              key={game.id}
              type="button"
              onClick={() => handleGamePress(game.id)}
              initial={{ opacity: 0, y: 30 + i * 10, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.05 * i }}
              className="rounded-xl overflow-hidden shadow-md transition-transform active:scale-[0.96]"
              style={{ width: '47.5%' }}
            >
              <span
                className="flex flex-col items-center justify-center gap-1 py-xl px-md rounded-xl"
                style={{ backgroundImage: `linear-gradient(135deg, ${game.colors[gender].join(', ')})`, minHeight: 150 }}
              >
                <span className="w-16 h-16 rounded-pill bg-white/25 flex items-center justify-center mb-sm">
                  <span className="text-[34px]">{game.emoji}</span>
                </span>
                <span className="text-subtitle text-white font-extrabold text-center text-[14px]">{game.title}</span>
                <span className="text-caption text-white/82 text-center">{game.subtitle}</span>
                <span className="mt-sm w-7 h-7 rounded-pill bg-white/25 flex items-center justify-center">
                  <Play size={14} color="rgba(255,255,255,0.9)" />
                </span>
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
