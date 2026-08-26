import { memo } from 'react'
import { colors } from '@/theme'

interface Stats {
  total: number
  withTEA: number
  averageProgress: number
  totalActivities: number
}

interface StatItem {
  key: keyof Stats
  label: string
  suffix?: string
  color: string
}

const STAT_ITEMS: readonly StatItem[] = [
  { key: 'total', label: 'Crianças', color: colors.textPrimary },
  { key: 'withTEA', label: 'Com TEA', color: colors.accent },
  { key: 'averageProgress', label: 'Progresso médio', suffix: '%', color: colors.success },
  { key: 'totalActivities', label: 'Atividades hoje', color: colors.info },
] as const

function StatsCardsComponent({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-2 gap-sm">
      {STAT_ITEMS.map(item => (
        <div key={item.key} className="bg-surface rounded-md px-md py-2.5 flex flex-col gap-0.5">
          <span className="text-body font-medium" style={{ color: item.color }}>
            {stats[item.key]}
            {item.suffix ?? ''}
          </span>
          <span className="text-label text-text-muted">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export const StatsCards = memo(StatsCardsComponent)
