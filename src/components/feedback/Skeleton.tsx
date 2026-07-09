import { useReduceMotion } from '@/contexts/ThemeContext'
import { cn } from '@/lib/cn'

/** Skeleton — placeholder shimmer suave. Em modo Reduce Motion, fica estático. */
export interface SkeletonProps {
  width?: number | `${number}%`
  height?: number
  rounded?: boolean
  className?: string
}

export function Skeleton({ width = '100%', height = 14, rounded = false, className }: SkeletonProps) {
  const reduceMotion = useReduceMotion()

  return (
    <div
      className={cn('bg-surface-alt', rounded ? 'rounded-pill' : 'rounded-sm', reduceMotion ? 'opacity-70' : 'animate-pulse', className)}
      style={{ width, height }}
    />
  )
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center p-lg bg-surface rounded-lg gap-md', className)}>
      <Skeleton height={60} rounded className="w-[60px] shrink-0" />
      <div className="flex-1">
        <Skeleton height={14} width="70%" />
        <div className="h-sm" />
        <Skeleton height={10} width="50%" />
      </div>
    </div>
  )
}

export default Skeleton
