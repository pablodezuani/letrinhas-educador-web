import { useMemo, type ReactNode } from 'react'
import { colors, gradients } from '@/theme'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/cn'

/**
 * Screen — wrapper padrão de telas. Resolve em um só lugar:
 *  - Respiro de safe-area (notch/home-indicator) via `env(safe-area-inset-*)`
 *  - Background sólido OU gradient (modo baixo-estímulo achata para 1 cor)
 *  - Scroll opcional + padding horizontal padrão
 */
type Background = 'cream' | 'white' | 'primary' | 'gradientSoft' | 'gradientPrimary' | 'gradientOcean'
type Edge = 'top' | 'bottom'

export interface ScreenProps {
  children: ReactNode
  background?: Background
  scroll?: boolean
  padded?: boolean
  paddingTop?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  edges?: Edge[]
  className?: string
}

const PAD_TOP: Record<NonNullable<ScreenProps['paddingTop']>, string> = {
  none: 'pt-none',
  sm: 'pt-md',
  md: 'pt-xl',
  lg: 'pt-xxl',
  xl: 'pt-xxxl',
}

const SOLID_BG: Partial<Record<Background, string>> = {
  cream: colors.background,
  white: colors.surface,
  primary: colors.primary,
}

const GRADIENT: Partial<Record<Background, readonly string[]>> = {
  gradientSoft: gradients.soft,
  gradientPrimary: gradients.primary,
  gradientOcean: gradients.ocean,
}

const IS_DARK: Record<Background, boolean> = {
  cream: false,
  white: false,
  primary: true,
  gradientSoft: false,
  gradientPrimary: true,
  gradientOcean: true,
}

export function Screen({ children, background = 'cream', scroll = false, padded = true, paddingTop = 'none', edges = ['top', 'bottom'], className }: ScreenProps) {
  const { resolveGradient } = useTheme()

  const bgStyle = useMemo(() => {
    const gradient = GRADIENT[background]
    if (gradient) {
      const stops = resolveGradient(gradient)
      return { backgroundImage: `linear-gradient(180deg, ${stops.join(', ')})` }
    }
    return { backgroundColor: SOLID_BG[background] }
  }, [background, resolveGradient])

  return (
    <div
      data-theme={IS_DARK[background] ? 'dark-surface' : undefined}
      className={cn('min-h-dvh flex flex-col', edges.includes('top') && 'pt-[env(safe-area-inset-top)]', edges.includes('bottom') && 'pb-[env(safe-area-inset-bottom)]')}
      style={bgStyle}
    >
      <div className={cn('flex-1 flex flex-col', scroll && 'overflow-y-auto', padded && 'px-xxl', PAD_TOP[paddingTop], className)}>{children}</div>
    </div>
  )
}

export default Screen
