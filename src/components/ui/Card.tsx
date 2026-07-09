import { memo, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * Card — superfície padronizada.
 * Variantes: default (branco, sombra md) · elevated (sombra lg) · outlined ·
 * accent (pêssego claro) · soft (surfaceAlt) · primary (fundo teal escuro).
 * Quando recebe `onClick` vira um <button> com feedback de pressionar.
 */
export type CardVariant = 'default' | 'elevated' | 'outlined' | 'accent' | 'soft' | 'primary'
export type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl'
export type CardRadius = 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

interface CardBaseProps {
  children: ReactNode
  variant?: CardVariant
  padding?: CardPadding
  radiusToken?: CardRadius
  className?: string
}

export type CardProps = CardBaseProps &
  (Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> | Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'children'>)

const PADDING: Record<CardPadding, string> = {
  none: 'p-none',
  sm: 'p-sm',
  md: 'p-md',
  lg: 'p-lg',
  xl: 'p-xl',
}

const RADIUS: Record<CardRadius, string> = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  xxl: 'rounded-xxl',
}

const VARIANT: Record<CardVariant, string> = {
  default: 'bg-surface shadow-md',
  elevated: 'bg-surface shadow-lg',
  outlined: 'bg-surface border border-border',
  accent: 'bg-accent-light shadow-sm',
  soft: 'bg-surface-alt',
  primary: 'bg-primary shadow-md text-text-on-primary',
}

function CardComponent({ children, variant = 'default', padding = 'lg', radiusToken = 'lg', className, onClick, ...rest }: CardProps & { onClick?: () => void }) {
  const composed = cn(PADDING[padding], RADIUS[radiusToken], VARIANT[variant], className)

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(composed, 'text-left w-full transition-transform active:scale-[0.98] active:opacity-95')}
        {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    )
  }

  return (
    <div className={composed} {...(rest as HTMLAttributes<HTMLDivElement>)}>
      {children}
    </div>
  )
}

export const Card = memo(CardComponent)
export default Card
