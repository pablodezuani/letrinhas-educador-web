import { memo, useCallback } from 'react'
import { ChildCard } from './ChildCard'
import type { Child } from '@/lib/types'
import { EmptyState } from './empty-state'

interface ChildrenListProps {
  children: Child[]
  onChildSelect: (child: Child) => void
  searchQuery: string
  onAddChild: () => void
}

function ChildrenListComponent({ children, onChildSelect, searchQuery, onAddChild }: ChildrenListProps) {
  const renderChild = useCallback((child: Child) => <ChildCard key={child.id} child={child} onSelect={() => onChildSelect(child)} />, [onChildSelect])

  if (children.length === 0) {
    return <EmptyState searchQuery={searchQuery} onAddChild={onAddChild} />
  }

  return <div className="flex flex-col gap-xl px-xl pb-[140px]">{children.map(renderChild)}</div>
}

export const ChildrenList = memo(ChildrenListComponent)
