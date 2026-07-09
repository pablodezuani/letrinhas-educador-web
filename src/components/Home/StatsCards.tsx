import { memo } from 'react'

interface Stats {
  total: number
  withTEA: number
  averageProgress: number
  totalActivities: number
}

interface StatItem {
  key: keyof Stats
  label: string
  emoji: string
  suffix?: string
  iconBg: string
  valueBg: string
}

const STAT_ITEMS: readonly StatItem[] = [
  { key: 'total', label: 'Crianças', emoji: '👧', iconBg: 'rgba(203,170,203,0.35)', valueBg: 'rgba(203,170,203,0.18)' },
  { key: 'withTEA', label: 'Com TEA', emoji: '🧩', iconBg: 'rgba(109,174,217,0.35)', valueBg: 'rgba(109,174,217,0.18)' },
  { key: 'averageProgress', label: 'Progresso médio', emoji: '📈', suffix: '%', iconBg: 'rgba(127,183,126,0.35)', valueBg: 'rgba(127,183,126,0.18)' },
  { key: 'totalActivities', label: 'Atividades hoje', emoji: '✅', iconBg: 'rgba(245,169,124,0.35)', valueBg: 'rgba(245,169,124,0.18)' },
] as const

function StatsCardsComponent({ stats }: { stats: Stats }) {
  return (
    <div className="flex flex-wrap gap-sm mt-xs">
      {STAT_ITEMS.map(item => (
        <div key={item.key} className="flex-1 min-w-[46%] rounded-md border border-white/30 py-2.5 px-md flex items-center gap-sm" style={{ backgroundColor: item.valueBg }}>
          <div className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: item.iconBg }}>
            <span className="text-lg">{item.emoji}</span>
          </div>
          <div className="min-w-0">
            <p className="text-h3 text-white text-[18px] truncate">
              {stats[item.key]}
              {item.suffix ?? ''}
            </p>
            <p className="text-caption text-white/80 truncate">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export const StatsCards = memo(StatsCardsComponent)
