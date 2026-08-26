import { memo } from 'react'
import { Plus, Users } from 'lucide-react'

interface EmptyStateProps {
  searchQuery: string
  onAddChild: () => void
}

/** EmptyState — estado vazio da lista de crianças (busca vs. sem cadastro). */
function EmptyStateComponent({ searchQuery, onAddChild }: EmptyStateProps) {
  const searching = searchQuery.length > 0

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-[72px] px-huge text-center">
      <div className="w-[96px] h-[96px] rounded-pill bg-primary-soft flex items-center justify-center mb-xl">
        <Users size={40} className="text-primary-light" />
      </div>

      <h2 className="text-h2 text-text-primary mb-sm">{searching ? 'Nenhuma criança encontrada' : 'Nenhuma criança cadastrada'}</h2>

      <p className="text-body text-text-secondary mb-xxxl">
        {searching ? 'Tente buscar por outro nome ou apelido.' : 'Adicione sua primeira criança para começar a acompanhar o desenvolvimento.'}
      </p>

      {!searching && (
        <button type="button" onClick={onAddChild} aria-label="Adicionar criança" className="h-12 px-xl rounded-pill border border-primary text-primary flex items-center gap-sm text-button">
          <Plus size={18} />
          Adicionar criança
        </button>
      )}
    </div>
  )
}

export const EmptyState = memo(EmptyStateComponent)
