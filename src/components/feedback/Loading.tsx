import { memo } from 'react'
import { colors } from '@/theme'
import { cn } from '@/lib/cn'

/**
 * Loading — único spinner do app.
 * screen (tela inteira) · inline (fluxo normal) · overlay (translúcido sobre o conteúdo)
 */
export interface LoadingProps {
  variant?: 'screen' | 'inline' | 'overlay'
  message?: string
  size?: 'small' | 'large'
  color?: string
  className?: string
}

const VARIANT_CLASS: Record<NonNullable<LoadingProps['variant']>, string> = {
  screen: 'flex-1 min-h-dvh bg-background items-center justify-center p-xxl',
  inline: 'items-center justify-center p-lg',
  overlay: 'absolute inset-0 bg-[rgba(255,248,244,0.6)] items-center justify-center z-[999]',
}

function LoadingComponent({ variant = 'inline', message, size = 'large', color = colors.primary, className }: LoadingProps) {
  const dim = size === 'large' ? 36 : 20

  return (
    <div role="progressbar" aria-label={message ?? 'Carregando'} className={cn('flex flex-col', VARIANT_CLASS[variant], className)}>
      <span
        className="rounded-full border-[3px] border-current border-t-transparent animate-spin"
        style={{ width: dim, height: dim, color }}
      />
      {message ? <p className="text-body-small text-text-secondary mt-md">{message}</p> : null}
    </div>
  )
}

export const Loading = memo(LoadingComponent)
export default Loading
