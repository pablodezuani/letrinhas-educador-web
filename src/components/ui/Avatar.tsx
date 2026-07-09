import { memo } from 'react'
import { cn } from '@/lib/cn'

/** Avatar — usado para usuário e crianças. Suporta imagem, fallback de iniciais e tom por gênero/tema. */
export type AvatarTone = 'neutral' | 'boy' | 'girl' | 'primary' | 'accent'
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface AvatarProps {
  src?: string | null
  initials?: string
  size?: AvatarSize
  tone?: AvatarTone
  className?: string
  borderColor?: string
  borderWidth?: number
}

const SIZE: Record<AvatarSize, number> = { xs: 28, sm: 36, md: 48, lg: 64, xl: 88 }

const TONE: Record<AvatarTone, string> = {
  neutral: 'bg-surface-alt text-text-secondary',
  boy: 'bg-boy-light text-boy-dark',
  girl: 'bg-girl-light text-girl-dark',
  primary: 'bg-primary-soft text-primary',
  accent: 'bg-accent-soft text-accent-dark',
}

function AvatarComponent({ src, initials, size = 'md', tone = 'neutral', className, borderColor, borderWidth = 0 }: AvatarProps) {
  const dim = SIZE[size]

  return (
    <div
      className={cn('inline-flex items-center justify-center rounded-pill overflow-hidden shrink-0 font-bold', TONE[tone], className)}
      style={{ width: dim, height: dim, borderWidth, borderColor, borderStyle: borderWidth ? 'solid' : undefined }}
    >
      {src ? (
        <img src={src} alt="" className="w-full h-full object-cover" />
      ) : (
        <span style={{ fontSize: dim * 0.4, lineHeight: `${dim * 0.5}px` }} className="truncate">
          {(initials ?? '?').slice(0, 2).toUpperCase()}
        </span>
      )}
    </div>
  )
}

export const Avatar = memo(AvatarComponent)
export default Avatar
