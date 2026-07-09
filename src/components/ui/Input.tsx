import { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * Input — campo de texto padronizado.
 * tone: 'light' (sobre fundo claro) | 'dark' (sobre fundo escuro/teal, ex: telas de auth)
 */
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label?: string
  icon?: ReactNode
  rightIcon?: ReactNode
  onRightIconPress?: () => void
  error?: string
  helperText?: string
  tone?: 'light' | 'dark'
  containerClassName?: string
  inputClassName?: string
}

const PALETTE = {
  light: {
    bg: 'bg-surface-alt',
    border: 'border-border',
    borderFocus: 'focus-within:border-primary',
    text: 'text-text-primary',
    placeholder: 'placeholder:text-text-muted',
    label: 'text-text-secondary',
    helper: 'text-text-muted',
  },
  dark: {
    bg: 'bg-white/8',
    border: 'border-white/18',
    borderFocus: 'focus-within:border-white/50',
    text: 'text-text-on-primary',
    placeholder: 'placeholder:text-[rgba(255,248,244,0.45)]',
    label: 'text-[rgba(255,248,244,0.65)]',
    helper: 'text-[rgba(255,248,244,0.5)]',
  },
} as const

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    icon,
    rightIcon,
    onRightIconPress,
    error,
    helperText,
    tone = 'light',
    containerClassName,
    inputClassName,
    onFocus,
    onBlur,
    id,
    ...rest
  },
  ref,
) {
  const [focused, setFocused] = useState(false)
  const palette = PALETTE[tone]
  const inputId = id ?? label?.replace(/\s+/g, '-').toLowerCase()

  return (
    <div className={cn('w-full mb-md', containerClassName)}>
      {label ? (
        <label
          htmlFor={inputId}
          className={cn('block text-label mb-xs uppercase tracking-[1.2px]', error ? 'text-error' : palette.label)}
        >
          {label}
        </label>
      ) : null}

      <div
        className={cn(
          'flex items-center min-h-12 px-lg rounded-md border transition-colors',
          palette.bg,
          error ? 'border-error' : palette.border,
          !error && palette.borderFocus,
          focused && !error && 'border-[1.5px]',
        )}
      >
        {icon ? <span className="mr-sm inline-flex shrink-0">{icon}</span> : null}

        <input
          ref={ref}
          id={inputId}
          aria-label={label}
          aria-invalid={!!error}
          aria-describedby={error || helperText ? `${inputId}-helper` : undefined}
          className={cn('flex-1 min-w-0 bg-transparent outline-none text-body py-0', palette.text, palette.placeholder, inputClassName)}
          onFocus={e => {
            setFocused(true)
            onFocus?.(e)
          }}
          onBlur={e => {
            setFocused(false)
            onBlur?.(e)
          }}
          {...rest}
        />

        {rightIcon ? (
          <button
            type="button"
            onClick={onRightIconPress}
            disabled={!onRightIconPress}
            className="ml-sm py-xs pl-xs inline-flex shrink-0"
          >
            {rightIcon}
          </button>
        ) : null}
      </div>

      {error ? (
        <p id={`${inputId}-helper`} className="text-caption text-error mt-xs ml-xs">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${inputId}-helper`} className={cn('text-caption mt-xs ml-xs', palette.helper)}>
          {helperText}
        </p>
      ) : null}
    </div>
  )
})

export default Input
