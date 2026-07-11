import { memo, useCallback } from 'react'
import { ChildCard } from './ChildCard'
import type { Child } from '@/lib/types'
import { EmptyState } from './empty-state'
import { SkeletonCard } from '@/components/feedback'

interface ChildrenListProps {
  children: Child[]
  loading?: boolean
  onChildSelect: (child: Child) => void
  searchQuery: string
  onAddChild: () => void
}

function ChildrenListComponent({ children, loading = false, onChildSelect, searchQuery, onAddChild }: ChildrenListProps) {
  const renderChild = useCallback((child: Child) => <ChildCard key={child.id} child={child} onSelect={() => onChildSelect(child)} />, [onChildSelect])

  if (loading) {
    return (
      <div className="flex flex-col gap-xl px-xl pb-[140px]">
        {[0, 1, 2].map(i => (
          <SkeletonCard key={i} className="h-[190px]" />
        ))}
      </div>
    )
  }

  if (children.length === 0) {
    return <EmptyState searchQuery={searchQuery} onAddChild={onAddChild} />
  }

  return <div className="flex flex-col gap-xl px-xl pb-[140px]">{children.map(renderChild)}</div>
}

export const ChildrenList = memo(ChildrenListComponent)
