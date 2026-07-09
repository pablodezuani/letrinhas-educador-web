import { memo } from 'react'
import { Plus, Users } from 'lucide-react'
import { gradients } from '@/theme'

interface EmptyStateProps {
  searchQuery: string
  onAddChild: () => void
}

/** EmptyState — estado vazio da lista de crianças (busca vs. sem cadastro). */
function EmptyStateComponent({ searchQuery, onAddChild }: EmptyStateProps) {
  const searching = searchQuery.length > 0

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-[72px] px-huge text-center">
      <div className="w-[120px] h-[120px] rounded-pill flex items-center justify-center mb-xxl shadow-md" style={{ backgroundImage: `linear-gradient(135deg, ${gradients.secondary.join(', ')})` }}>
        <Users size={56} color="white" />
      </div>

      <h2 className="text-h2 text-text-primary mb-sm">{searching ? 'Nenhuma criança encontrada' : 'Nenhuma criança cadastrada'}</h2>

      <p className="text-body text-text-secondary mb-xxxl">
        {searching ? 'Tente buscar por outro nome ou apelido.' : 'Adicione sua primeira criança para começar a acompanhar o desenvolvimento.'}
      </p>

      {!searching && (
        <button type="button" onClick={onAddChild} aria-label="Adicionar criança" className="rounded-lg overflow-hidden shadow-md transition-transform active:scale-[0.97]">
          <span className="flex items-center gap-sm px-xxl py-md" style={{ backgroundImage: `linear-gradient(90deg, ${gradients.primary.join(', ')})` }}>
            <Plus size={20} color="white" />
            <span className="text-button text-white">Adicionar criança</span>
          </span>
        </button>
      )}
    </div>
  )
}

export const EmptyState = memo(EmptyStateComponent)
