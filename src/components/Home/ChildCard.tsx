'use client'

import { memo, useCallback, type MouseEvent } from 'react'
import { useRouter } from 'next/navigation'
import { MoreHorizontal, Play, School as SchoolIcon } from 'lucide-react'
import type { Child } from '@/lib/types'
import { colors } from '@/theme'
import { stashSelectedChild } from '@/lib/navState'

const TEA_LEVEL_META: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: 'TEA N1', color: colors.teaLevel1, bg: colors.teaLevel1Light },
  2: { label: 'TEA N2', color: colors.teaLevel2, bg: colors.teaLevel2Light },
  3: { label: 'TEA N3', color: colors.teaLevel3, bg: colors.teaLevel3Light },
}

interface ChildCardProps {
  child: Child
  onSelect: () => void
}

function ChildCardComponent({ child, onSelect }: ChildCardProps) {
  const router = useRouter()
  const teaMeta = child.hasTEA ? TEA_LEVEL_META[child.teaLevel] : undefined
  const progressColor = child.progressToday >= 70 ? colors.success : colors.warning

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
      className="w-full text-left flex gap-md bg-surface rounded-lg p-md cursor-pointer"
    >
      <div className="w-24 h-24 rounded-md overflow-hidden shrink-0 bg-surface-alt flex items-center justify-center">
        {child.image ? <img src={child.image} alt="" className="w-full h-full object-cover" /> : <span className="text-[40px] opacity-70">{child.emoji}</span>}
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-1.5 justify-center">
        <div className="flex items-center gap-sm">
          <span className="text-body font-medium text-text-primary truncate flex-1">
            {child.name} · {child.age}
          </span>
          {teaMeta ? (
            <span className="text-label px-sm py-0.5 rounded-md shrink-0" style={{ color: teaMeta.color, backgroundColor: teaMeta.bg }}>
              {teaMeta.label}
            </span>
          ) : (
            <span className="text-label px-sm py-0.5 rounded-md shrink-0 bg-surface-alt text-text-muted">Sem TEA</span>
          )}
          <button type="button" onClick={handleInfoPress} aria-label="Mais informações" className="shrink-0 text-text-muted">
            <MoreHorizontal size={16} />
          </button>
        </div>

        <div className="h-[5px] rounded-pill bg-surface-alt overflow-hidden">
          <div className="h-full rounded-pill transition-[width]" style={{ width: `${child.progressToday}%`, backgroundColor: progressColor }} />
        </div>

        <div className="flex items-center justify-between gap-sm">
          <span className="text-label text-text-muted truncate">
            {child.favoriteActivity || 'Sem atividade'} · {child.progressToday}%
          </span>
          <button type="button" onClick={handleCardPress} className="h-6 px-sm rounded-pill border border-primary text-primary flex items-center gap-1 text-label shrink-0">
            <Play size={10} />
            Jogar
          </button>
        </div>

        {child.school ? (
          <span className="inline-flex items-center gap-1 text-label px-sm py-0.5 rounded-md self-start" style={{ color: colors.success, backgroundColor: colors.successLight }}>
            <SchoolIcon size={9} />
            {child.school.name}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-label px-sm py-0.5 rounded-md self-start bg-surface-alt text-text-muted">
            Sem unidade
          </span>
        )}
      </div>
    </div>
  )
}

export const ChildCard = memo(ChildCardComponent)
