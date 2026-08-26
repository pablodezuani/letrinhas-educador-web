import { memo, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Bell, Search, X, XCircle } from 'lucide-react'
import { StatsCards } from './StatsCards'
import type { Child, User } from '@/lib/types'
import { colors } from '@/theme'

interface HeaderProps {
  user: User
  children: Child[]
  searchQuery: string
  showSearchBar: boolean
  onSearchChange: (query: string) => void
  onToggleSearch: () => void
  onOpenProfile: () => void
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

function HeaderComponent({ user, children, searchQuery, showSearchBar, onSearchChange, onToggleSearch, onOpenProfile }: HeaderProps) {
  const greeting = useMemo(() => getGreeting(), [])

  const stats = useMemo(
    () => ({
      total: children.length,
      withTEA: children.filter(c => c.hasTEA).length,
      averageProgress: children.length ? Math.round(children.reduce((s, c) => s + c.progressToday, 0) / children.length) : 0,
      totalActivities: children.reduce((s, c) => s + c.activitiesCompleted, 0),
    }),
    [children],
  )

  const clearSearch = useCallback(() => onSearchChange(''), [onSearchChange])

  return (
    <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="px-xl pt-[calc(env(safe-area-inset-top)+18px)] pb-lg flex flex-col gap-md">
      <div className="flex items-center justify-between gap-md">
        <button type="button" onClick={onOpenProfile} aria-label="Abrir perfil" className="flex items-center gap-sm flex-1 min-w-0 text-left">
          <div className="w-11 h-11 rounded-pill bg-primary-soft flex items-center justify-center shrink-0">
            <span className="text-body font-medium text-primary-light">{user.name?.charAt(0)?.toUpperCase() || '?'}</span>
          </div>

          <div className="min-w-0">
            <p className="text-body font-medium text-text-primary truncate">
              {greeting}, {user.name}
            </p>
            <p className="text-label text-text-muted truncate">
              {user.totalChildren} crianças · {user.completedActivities} atividades
            </p>
          </div>
        </button>

        <div className="flex items-center gap-sm shrink-0">
          <button
            type="button"
            onClick={onToggleSearch}
            aria-label={showSearchBar ? 'Fechar busca' : 'Abrir busca'}
            className="w-[34px] h-[34px] rounded-pill bg-surface border border-border flex items-center justify-center text-text-primary transition-transform active:scale-[0.92]"
          >
            {showSearchBar ? <X size={15} /> : <Search size={15} />}
          </button>
          <button type="button" aria-label="Notificações" className="relative w-[34px] h-[34px] rounded-pill bg-surface border border-border flex items-center justify-center text-text-primary transition-transform active:scale-[0.92]">
            <Bell size={15} />
            <span className="absolute -top-[3px] -right-[3px] min-w-[14px] h-[14px] rounded-[7px] bg-error flex items-center justify-center text-[8px] font-bold" style={{ color: colors.textOnPrimary }}>
              3
            </span>
          </button>
        </div>
      </div>

      {showSearchBar && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-sm bg-surface-alt border border-divider rounded-md px-md h-11"
        >
          <Search size={16} className="text-text-muted shrink-0" />
          <input
            className="flex-1 min-w-0 bg-transparent text-body-small text-text-primary outline-none placeholder:text-text-muted"
            placeholder="Buscar criança..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <button type="button" onClick={clearSearch} aria-label="Limpar busca" className="shrink-0 text-text-muted">
              <XCircle size={16} />
            </button>
          )}
        </motion.div>
      )}

      <StatsCards stats={stats} />
    </motion.div>
  )
}

export const Header = memo(HeaderComponent)
