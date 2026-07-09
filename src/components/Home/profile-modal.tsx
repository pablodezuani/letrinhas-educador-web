'use client'

import { memo, useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, CircleHelp, Info, LogOut, Settings, User, X, Bell } from 'lucide-react'

import type { User as UserType } from '@/lib/types'
import { gradients } from '@/theme'
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
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.26, ease: [0.34, 1.56, 0.64, 1] }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-[420px] bg-surface rounded-xl overflow-hidden shadow-xl"
            >
              <div className="relative pt-huge pb-xxl px-xxl flex flex-col items-center" style={{ backgroundImage: `linear-gradient(135deg, ${gradients.primary.join(', ')})` }}>
                <button type="button" onClick={onClose} aria-label="Fechar perfil" className="absolute top-md right-md w-8 h-8 rounded-pill bg-white/22 flex items-center justify-center">
                  <X size={22} color="white" />
                </button>

                <div className="w-[84px] h-[84px] rounded-pill bg-white/22 flex items-center justify-center mb-md shadow-md">
                  <span className="text-[34px] text-white font-bold">{user.name?.charAt(0)?.toUpperCase() || '?'}</span>
                </div>
                <p className="text-h2 text-white mb-xs text-center truncate max-w-full">{user.name || 'Usuário'}</p>
                <p className="text-body text-white/85 text-center truncate max-w-full mb-[2px]">{user.email}</p>
                <p className="text-caption text-white/75 text-center">Membro desde {joinedAt}</p>
              </div>

              <div className="py-md">
                {menuItems.map((item, i) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={item.onPress}
                    className={`w-full flex items-center px-xl py-md text-left ${i !== menuItems.length - 1 ? 'border-b border-divider' : ''}`}
                  >
                    <span className="w-10 h-10 rounded-pill bg-surface-alt flex items-center justify-center mr-md shrink-0">
                      <item.Icon size={22} className="text-primary" />
                    </span>
                    <span className="flex-1 text-subtitle text-text-primary">{item.title}</span>
                    <ChevronRight size={18} className="text-text-muted" />
                  </button>
                ))}
              </div>

              <div className="mx-xl mb-xl">
                <button
                  type="button"
                  onClick={handleLogoutPress}
                  disabled={signingOut}
                  aria-label="Sair da conta"
                  className="w-full rounded-lg overflow-hidden shadow-md transition-transform active:scale-[0.98] disabled:opacity-70"
                >
                  <span className="flex items-center justify-center gap-sm py-md" style={{ backgroundImage: `linear-gradient(90deg, ${gradients.error.join(', ')})` }}>
                    <LogOut size={22} color="white" />
                    <span className="text-button text-white">{signingOut ? 'Saindo...' : 'Sair da conta'}</span>
                  </span>
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
