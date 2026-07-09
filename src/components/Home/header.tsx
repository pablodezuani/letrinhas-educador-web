import { memo, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Bell, Search, X, XCircle } from 'lucide-react'
import { StatsCards } from './StatsCards'
import type { Child, User } from '@/lib/types'
import { gradients } from '@/theme'

interface HeaderProps {
  user: User
  children: Child[]
  searchQuery: string
  showSearchBar: boolean
  onSearchChange: (query: string) => void
  onToggleSearch: () => void
  onOpenProfile: () => void
}

function getGreeting(): { text: string; emoji: string } {
  const h = new Date().getHours()
  if (h < 12) return { text: 'Bom dia', emoji: '☀️' }
  if (h < 18) return { text: 'Boa tarde', emoji: '🌤️' }
  return { text: 'Boa noite', emoji: '🌙' }
}

function HeaderComponent({ user, children, searchQuery, showSearchBar, onSearchChange, onToggleSearch, onOpenProfile }: HeaderProps) {
  const greeting = useMemo(getGreeting, [])

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
    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative overflow-hidden rounded-b-xxl shadow-lg mb-xl">
      <div className="relative px-xl pt-[calc(env(safe-area-inset-top)+40px)] pb-xl" style={{ backgroundImage: `linear-gradient(135deg, ${gradients.primary.join(', ')})` }}>
        <div className="absolute w-[200px] h-[200px] rounded-pill bg-white/8 -top-[70px] -right-[50px] pointer-events-none" />
        <div className="absolute w-[100px] h-[100px] rounded-pill bg-white/6 -bottom-[30px] -left-5 pointer-events-none" />

        <div className="relative flex items-center justify-between mb-lg gap-md">
          <button type="button" onClick={onOpenProfile} aria-label="Abrir perfil" className="flex items-center gap-md flex-1 min-w-0 text-left">
            <div
              className="w-[54px] h-[54px] rounded-pill flex items-center justify-center border-[2.5px] border-white/35 shrink-0"
              style={{ backgroundImage: `linear-gradient(135deg, ${gradients.accent.join(', ')})` }}
            >
              <span className="text-h3 text-white text-[20px]">{user.name?.charAt(0)?.toUpperCase() || '?'}</span>
            </div>

            <div className="min-w-0">
              <p className="text-caption text-white/75">
                {greeting.emoji} {greeting.text},
              </p>
              <p className="text-h3 text-white truncate">{user.name} 👋</p>
              <p className="text-caption text-white/70 truncate">
                {user.totalChildren} crianças · {user.completedActivities} atividades
              </p>
            </div>
          </button>

          <div className="flex items-center gap-sm shrink-0">
            <button
              type="button"
              onClick={onToggleSearch}
              aria-label={showSearchBar ? 'Fechar busca' : 'Abrir busca'}
              className="w-10 h-10 rounded-pill bg-white/18 border border-white/30 flex items-center justify-center transition-transform active:scale-[0.92]"
            >
              {showSearchBar ? <X size={20} color="white" /> : <Search size={20} color="white" />}
            </button>
            <button type="button" aria-label="Notificações" className="relative w-10 h-10 rounded-pill bg-white/18 border border-white/30 flex items-center justify-center transition-transform active:scale-[0.92]">
              <Bell size={20} color="white" />
              <span className="absolute -top-[3px] -right-[3px] min-w-[17px] h-[17px] px-[3px] rounded-[9px] bg-error border-[1.5px] border-primary flex items-center justify-center text-white text-[9px] font-extrabold">3</span>
            </button>
          </div>
        </div>

        {showSearchBar && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex items-center gap-sm bg-white/14 border border-white/30 rounded-md px-md h-11 mb-lg">
            <Search size={16} color="rgba(255,255,255,0.7)" />
            <input
              className="flex-1 bg-transparent outline-none text-body text-[14px] text-white placeholder:text-white/55"
              placeholder="Buscar criança..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <button type="button" onClick={clearSearch} aria-label="Limpar busca">
                <XCircle size={16} color="rgba(255,255,255,0.7)" />
              </button>
            )}
          </motion.div>
        )}

        <StatsCards stats={stats} />
      </div>
    </motion.div>
  )
}

export const Header = memo(HeaderComponent)
