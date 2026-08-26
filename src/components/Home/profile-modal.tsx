'use client'

import { memo, useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, CircleHelp, Info, LogOut, Settings, User, X, Bell } from 'lucide-react'

import type { User as UserType } from '@/lib/types'
import { AlertModal, useAlertModal } from '@/components/common'
import { useAuth } from '@/hooks'

interface ProfileModalProps {
  user: UserType
  visible: boolean
  onClose: () => void
}

interface MenuItem {
  Icon: typeof User
  title: string
  onPress: () => void
}

function ProfileModalComponent({ user, visible, onClose }: ProfileModalProps) {
  const { signOut } = useAuth()
  const router = useRouter()
  const alert = useAlertModal()
  const [signingOut, setSigningOut] = useState(false)

  const navigateTo = useCallback(
    (path: string) => {
      onClose()
      router.push(path)
    },
    [router, onClose],
  )

  const menuItems = useMemo<MenuItem[]>(
    () => [
      { Icon: User, title: 'Editar perfil', onPress: () => navigateTo('/edit-profile') },
      { Icon: Settings, title: 'Configurações', onPress: () => navigateTo('/settings') },
      { Icon: Bell, title: 'Notificações', onPress: () => navigateTo('/notifications') },
      { Icon: CircleHelp, title: 'Ajuda e suporte', onPress: () => navigateTo('/help-support') },
      { Icon: Info, title: 'Sobre o app', onPress: () => navigateTo('/about') },
    ],
    [navigateTo],
  )

  const performSignOut = useCallback(() => {
    if (signingOut) return
    setSigningOut(true)
    try {
      signOut()
      onClose()
    } catch {
      alert.showError('Não foi possível sair agora. Tente novamente em instantes.', 'Ops!')
    } finally {
      setSigningOut(false)
    }
  }, [alert, onClose, signOut, signingOut])

  const handleLogoutPress = useCallback(() => {
    alert.show({
      title: 'Sair da conta',
      message: 'Tem certeza que deseja sair da sua conta?',
      variant: 'warning',
      actions: [
        { label: 'Sair', variant: 'primary', onPress: performSignOut },
        { label: 'Cancelar', variant: 'ghost' },
      ],
    })
  }, [alert, performSignOut])

  const joinedAt = useMemo(() => {
    try {
      return new Date(user.joinDate).toLocaleDateString('pt-BR')
    } catch {
      return '—'
    }
  }, [user.joinDate])

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center px-xl bg-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-[360px] bg-surface rounded-xl overflow-hidden shadow-lg"
            >
              <div className="relative pt-xxl pb-lg px-xl flex flex-col items-center gap-1">
                <button type="button" onClick={onClose} aria-label="Fechar menu" className="absolute top-3 right-3 w-7 h-7 rounded-pill bg-white/10 flex items-center justify-center text-text-primary">
                  <X size={14} />
                </button>

                <div className="w-16 h-16 rounded-pill bg-primary-soft flex items-center justify-center mb-1">
                  <span className="text-[24px] font-medium text-primary-light">{user.name?.charAt(0)?.toUpperCase() || '?'}</span>
                </div>
                <p className="text-subtitle text-text-primary text-center truncate max-w-full">{user.name || 'Usuário'}</p>
                <p className="text-caption text-text-secondary text-center truncate max-w-full">{user.email}</p>
                <p className="text-label text-text-muted text-center">Membro desde {joinedAt}</p>
              </div>

              <div className="flex flex-col">
                {menuItems.map(item => (
                  <button key={item.title} type="button" onClick={item.onPress} className="w-full flex items-center gap-md px-xl py-[13px] text-left border-t border-divider">
                    <item.Icon size={18} className="text-text-secondary shrink-0" />
                    <span className="flex-1 text-body text-text-primary">{item.title}</span>
                    <ChevronRight size={14} className="text-text-muted" />
                  </button>
                ))}
              </div>

              <div className="px-xl pt-md pb-xl">
                <button
                  type="button"
                  onClick={handleLogoutPress}
                  disabled={signingOut}
                  aria-label="Sair da conta"
                  className="w-full h-11 rounded-pill border border-error text-error text-button-small flex items-center justify-center gap-sm disabled:opacity-45"
                >
                  <LogOut size={16} />
                  {signingOut ? 'Saindo...' : 'Sair da conta'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AlertModal visible={alert.state.visible} onClose={alert.hide} title={alert.state.title} message={alert.state.message} variant={alert.state.variant} actions={alert.state.actions} autoHideMs={alert.state.autoHideMs} />
    </>
  )
}

export const ProfileModal = memo(ProfileModalComponent)
