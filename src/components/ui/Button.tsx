import { memo, useMemo, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { gradients } from '@/theme'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/cn'

/**
 * Button — botão padronizado do design system.
 * Variantes: primary (CTA, lilás) · secondary (teal) · outline · ghost ·
 * success · danger · gradient (consciente do lowStimulationMode).
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'danger' | 'gradient'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  label: string
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  className?: string
  /** Para variant="gradient" */
  gradient?: readonly [string, string]
}

const SIZE: Record<ButtonSize, string> = {
  sm: 'h-10 px-lg text-button-small',
  md: 'h-12 px-xl text-button',
  lg: 'h-14 px-xxl text-[17px]',
}

const VARIANT: Record<Exclude<ButtonVariant, 'gradient'>, string> = {
  primary: 'bg-secondary text-white shadow-sm',
  secondary: 'bg-primary text-text-on-primary shadow-sm',
  outline: 'bg-transparent text-primary border-[1.5px] border-primary',
  ghost: 'bg-transparent text-primary',
  success: 'bg-success text-white shadow-sm',
  danger: 'bg-error text-white shadow-sm',
}

function ButtonComponent({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  disabled,
  className,
  gradient,
  ...rest
}: ButtonProps) {
  const { resolveGradient } = useTheme()
  const isDisabled = disabled || loading

  const gradientStyle = useMemo(() => {
    if (variant !== 'gradient') return undefined
    const [c1, c2] = resolveGradient(gradient ?? gradients.primary)
    return { backgroundImage: `linear-gradient(135deg, ${c1}, ${c2})` }
  }, [variant, gradient, resolveGradient])

  return (
    <button
      type="button"
      aria-label={label}
      aria-busy={loading}
      disabled={isDisabled}
      style={gradientStyle}
      className={cn(
        'inline-flex items-center justify-center gap-sm rounded-pill font-semibold transition-transform active:scale-[0.97]',
        SIZE[size],
        variant === 'gradient' ? 'text-white shadow-sm' : VARIANT[variant],
        fullWidth ? 'w-full' : 'self-start',
        isDisabled && 'opacity-55 pointer-events-none',
        className,
      )}
      {...rest}
    >
      {loading ? (
        <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="inline-flex">{icon}</span>}
          <span className="truncate">{label}</span>
          {icon && iconPosition === 'right' && <span className="inline-flex">{icon}</span>}
        </>
      )}
    </button>
  )
}

export const Button = memo(ButtonComponent)
export default Button
