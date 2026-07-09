import { memo, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Badge — pequeno marcador (TEA Nível 1, Concluído, Novo, etc). */
export type BadgeTone = 'neutral' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'tea1' | 'tea2' | 'tea3'

export interface BadgeProps {
  label: string
  tone?: BadgeTone
  icon?: ReactNode
  size?: 'sm' | 'md'
  className?: string
}

const TONES: Record<BadgeTone, string> = {
  neutral: 'bg-surface-alt text-text-secondary',
  primary: 'bg-primary-soft text-primary',
  secondary: 'bg-secondary-soft text-secondary-dark',
  accent: 'bg-accent-soft text-accent-dark',
  success: 'bg-success-light text-success-dark',
  warning: 'bg-warning-light text-warning-dark',
  error: 'bg-error-light text-error-dark',
  info: 'bg-info-light text-info-dark',
  tea1: 'bg-tea-level-1-light text-success-dark',
  tea2: 'bg-tea-level-2-light text-warning-dark',
  tea3: 'bg-tea-level-3-light text-error-dark',
}

function BadgeComponent({ label, tone = 'neutral', icon, size = 'md', className }: BadgeProps) {
  return (
    <span
      aria-label={label}
      className={cn(
        'inline-flex items-center rounded-pill self-start font-semibold truncate',
        size === 'sm' ? 'py-0.5 px-sm text-[11px]' : 'py-1 px-md text-caption',
        TONES[tone],
        className,
      )}
    >
      {icon ? <span className="mr-xs inline-flex">{icon}</span> : null}
      {label}
    </span>
  )
}

export const Badge = memo(BadgeComponent)
export default Badge
