import { memo, type ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { colors } from '@/theme'
import { cn } from '@/lib/cn'

/** SimpleHeader — cabeçalho padrão das telas internas (não-auth). */
export interface SimpleHeaderProps {
  title?: string
  subtitle?: string
  onBackPress?: () => void
  rightAction?: ReactNode
  tone?: 'light' | 'dark'
  className?: string
  hideBack?: boolean
}

function SimpleHeaderComponent({ title, subtitle, onBackPress, rightAction, tone = 'light', className, hideBack }: SimpleHeaderProps) {
  const fg = tone === 'dark' ? colors.white : colors.primary
  const muted = tone === 'dark' ? 'rgba(255,248,244,0.7)' : colors.textSecondary
  const btnBg = tone === 'dark' ? 'rgba(255,255,255,0.14)' : colors.primarySoft

  return (
    <div className={cn('flex items-center py-md min-h-14', className)}>
      {!hideBack && onBackPress ? (
        <button
          type="button"
          aria-label="Voltar"
          onClick={onBackPress}
          style={{ backgroundColor: btnBg }}
          className="w-10 h-10 rounded-pill flex items-center justify-center shrink-0 transition-transform active:scale-[0.92]"
        >
          <ArrowLeft size={20} color={fg} />
        </button>
      ) : (
        <div className="w-10 h-10 shrink-0" />
      )}

      <div className="flex-1 text-center px-md min-w-0">
        {title ? (
          <h3 style={{ color: fg }} className="text-h3 truncate">
            {title}
          </h3>
        ) : null}
        {subtitle ? (
          <p style={{ color: muted }} className="text-caption mt-0.5 truncate">
            {subtitle}
          </p>
        ) : null}
      </div>

      <div className="min-w-10 flex justify-end shrink-0">{rightAction ?? <div className="w-10 h-10" />}</div>
    </div>
  )
}

export const SimpleHeader = memo(SimpleHeaderComponent)
export default SimpleHeader
