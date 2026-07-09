'use client'

import { memo, useCallback, type MouseEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Brain, CheckCircle2, MoreHorizontal, Play, Star } from 'lucide-react'
import type { Child } from '@/lib/types'
import { colors } from '@/theme'
import { stashSelectedChild } from '@/lib/navState'

const MOOD_EMOJIS: Record<string, string> = {
  happy: '😊',
  excited: '🤩',
  calm: '😌',
  sad: '😢',
  angry: '😠',
  anxious: '😰',
  tired: '😴',
}
const getMoodEmoji = (mood: string) => MOOD_EMOJIS[mood] ?? '😊'

interface ChildCardProps {
  child: Child
  onSelect: () => void
}

function ChildCardComponent({ child, onSelect }: ChildCardProps) {
  const router = useRouter()

  const handleCardPress = useCallback(() => {
    stashSelectedChild(child)
    router.push('/child')
  }, [router, child])

  const handleInfoPress = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation()
      onSelect()
    },
    [onSelect],
  )

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardPress}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleCardPress()}
      className="w-full text-left rounded-xxl overflow-hidden bg-surface shadow-lg transition-transform active:scale-[0.99] cursor-pointer"
    >
      <div
        className="relative h-[190px] flex flex-col justify-between bg-cover bg-center"
        style={{
          backgroundImage: child.image ? `url(${child.image})` : `linear-gradient(135deg, ${child.lightColor}, ${child.color})`,
        }}
      >
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.18), rgba(0,0,0,0.72))' }} />

        {!child.image && <span className="absolute text-[80px] opacity-45 left-1/2 top-[20%] -translate-x-1/2">{child.emoji}</span>}

        <div className="relative flex items-start justify-between p-md">
          <div className="w-9 h-9 rounded-pill bg-white/92 shadow-sm flex items-center justify-center">
            <span className="text-lg">{getMoodEmoji(child.mood)}</span>
          </div>

          <div className="flex items-center gap-xs">
            {child.hasTEA && (
              <span className="flex items-center gap-[3px] px-2 py-1 rounded-pill" style={{ backgroundColor: child.color }}>
                <Brain size={10} color={colors.white} />
                <span className="text-white font-extrabold text-[10px]">TEA</span>
              </span>
            )}
            <button type="button" onClick={handleInfoPress} aria-label="Mais informações" className="w-8 h-8 rounded-pill bg-black/38 flex items-center justify-center">
              <MoreHorizontal size={16} color={colors.white} />
            </button>
          </div>
        </div>

        <div className="relative p-lg pt-0 pb-md">
          <h3 className="truncate" style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: colors.white, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
            {child.name}
          </h3>
          <p className="text-caption text-white/82 mt-0.5">
            "{child.nickname}" · {child.age} anos
          </p>
        </div>
      </div>

      <div className="bg-surface px-lg pt-md pb-lg">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-caption text-text-muted font-semibold">Progresso hoje</span>
          <span className="text-caption font-extrabold" style={{ color: child.color }}>
            {child.progressToday}%
          </span>
        </div>
        <div className="h-2.5 rounded-[5px] bg-black/7 overflow-hidden mb-md">
          <div className="h-full rounded-[5px]" style={{ width: `${child.progressToday}%`, backgroundImage: `linear-gradient(90deg, ${child.lightColor}, ${child.color})` }} />
        </div>

        <div className="flex items-center gap-md">
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <CheckCircle2 size={15} color={colors.success} />
            <span className="text-caption text-text-secondary font-semibold truncate">{child.activitiesCompleted} atividades</span>
          </div>
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <Star size={13} color={colors.warning} />
            <span className="text-caption text-text-secondary font-semibold truncate">{child.favoriteActivity}</span>
          </div>

          <span className="flex items-center gap-[5px] px-md py-sm rounded-pill shadow-sm shrink-0" style={{ backgroundColor: child.color }}>
            <Play size={14} color={colors.white} />
            <span className="text-caption text-white font-extrabold">Jogar</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export const ChildCard = memo(ChildCardComponent)
