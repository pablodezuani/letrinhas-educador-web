import { memo, useMemo } from 'react'
import { colors } from '@/theme'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/cn'

/** ProgressBar — barra de progresso única para todo o app. Aceita 0..1 ou 0..max. */
export interface ProgressBarProps {
  value: number
  max?: number
  height?: number
  trackColor?: string
  color?: string
  gradient?: readonly [string, string] | readonly [string, string, string]
  rounded?: boolean
  className?: string
  'aria-label'?: string
}

function ProgressBarComponent({
  value,
  max = 1,
  height = 8,
  trackColor = colors.divider,
  color = colors.primary,
  gradient,
  rounded = true,
  className,
  'aria-label': ariaLabel,
}: ProgressBarProps) {
  const { resolveGradient } = useTheme()
  const ratio = Math.max(0, Math.min(1, max === 0 ? 0 : value / max))

  const fillStyle = useMemo(() => {
    if (gradient) {
      const stops = resolveGradient(gradient)
      return { backgroundImage: `linear-gradient(90deg, ${stops.join(', ')})` }
    }
    return { backgroundColor: color }
  }, [gradient, color, resolveGradient])

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(ratio * 100)}
      aria-label={ariaLabel}
      className={cn('overflow-hidden', rounded && 'rounded-pill', className)}
      style={{ height, backgroundColor: trackColor }}
    >
      <div className={cn('h-full transition-[width]', rounded && 'rounded-pill')} style={{ width: `${ratio * 100}%`, ...fillStyle }} />
    </div>
  )
}

export const ProgressBar = memo(ProgressBarComponent)
export default ProgressBar
