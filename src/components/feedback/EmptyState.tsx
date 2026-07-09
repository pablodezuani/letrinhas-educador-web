import { memo, type ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

/** EmptyState — usado quando uma lista/seção está vazia. Sempre ofereça uma ação clara. */
export interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  actionLabel?: string
  onActionPress?: () => void
  className?: string
}

function EmptyStateComponent({ title, description, icon, actionLabel, onActionPress, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-xxl text-center', className)}>
      {icon ? <div className="mb-lg opacity-85">{icon}</div> : null}
      <h3 className="text-h3 text-text-primary mb-sm">{title}</h3>
      {description ? <p className="text-body text-text-secondary mb-lg max-w-[320px]">{description}</p> : null}
      {actionLabel && onActionPress ? (
        <div className="mt-md">
          <Button label={actionLabel} variant="primary" onClick={onActionPress} />
        </div>
      ) : null}
    </div>
  )
}

export const EmptyState = memo(EmptyStateComponent)
export default EmptyState
