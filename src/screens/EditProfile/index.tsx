'use client'

import { useCallback, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, CheckCircle2, Mail, ShieldCheck, User } from 'lucide-react'

import { AlertModal, ScreenHeader, useAlertModal } from '@/components/common'
import { useAuth, usePhotoPicker } from '@/hooks'
import { colors, gradients } from '@/theme'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export default function EditProfileScreen() {
  const { user } = useAuth()
  const { openCamera, openGallery } = usePhotoPicker({ aspect: [1, 1] })
  const alert = useAlertModal()

  const [name, setName] = useState(user.name || '')
  const [email, setEmail] = useState(user.email || '')
  const [photoUri, setPhotoUri] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const initial = useMemo(() => (name?.trim()?.charAt(0) || '?').toUpperCase(), [name])

  const hasChanges = useMemo(
    () => name.trim() !== (user.name || '').trim() || email.trim() !== (user.email || '').trim() || !!photoUri,
    [name, email, photoUri, user.name, user.email],
  )

  const handlePickResult = useCallback(
    (uri: string | null, error?: 'permission-denied' | 'unknown') => {
      if (error === 'permission-denied') {
        alert.showWarning('Precisamos da sua permissão para acessar a câmera ou a galeria.', 'Permissão necessária')
        return
      }
      if (error === 'unknown') {
        alert.showError('Não foi possível abrir agora. Tente novamente.', 'Ops!')
        return
      }
      if (uri) setPhotoUri(uri)
    },
    [alert],
  )

  const handleChangePhoto = useCallback(() => {
    alert.show({
      title: 'Alterar foto',
      message: 'Como você quer adicionar a nova foto?',
      variant: 'info',
      actions: [
        {
          label: 'Câmera',
          variant: 'primary',
          onPress: async () => {
            const res = await openCamera()
            handlePickResult(res.uri, res.error)
          },
        },
        {
          label: 'Galeria',
          variant: 'secondary',
          onPress: async () => {
            const res = await openGallery()
            handlePickResult(res.uri, res.error)
          },
        },
        { label: 'Cancelar', variant: 'ghost' },
      ],
    })
  }, [alert, handlePickResult, openCamera, openGallery])

  const handleSave = useCallback(async () => {
    if (!name.trim()) {
      alert.showWarning('Digite seu nome para continuar.', 'Nome obrigatório')
      return
    }
    if (!isValidEmail(email)) {
      alert.showWarning('Informe um email válido.', 'Email inválido')
      return
    }
    setSaving(true)
    try {
      // TODO: integrar com backend quando endpoint de update de usuário existir.
      await new Promise(r => setTimeout(r, 600))
      alert.showSuccess('Seus dados foram atualizados!', 'Tudo certo')
    } finally {
      setSaving(false)
    }
  }, [alert, email, name])

  const disabled = !hasChanges || saving

  return (
    <div className="min-h-dvh flex flex-col" style={{ backgroundImage: `linear-gradient(180deg, ${gradients.soft.join(', ')})` }}>
      <ScreenHeader
        title="Editar perfil"
        subtitle="Atualize suas informações"
        rightAction={
          <button
            type="button"
            onClick={handleSave}
            disabled={disabled}
            aria-label="Salvar alterações"
            className="px-md py-sm rounded-pill bg-white/20 border border-white/32 disabled:opacity-45"
          >
            <span className="text-caption text-white font-bold">{saving ? '...' : 'Salvar'}</span>
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto p-xl pb-huge flex flex-col gap-lg">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-col items-center mt-md">
          <button type="button" onClick={handleChangePhoto} aria-label="Alterar foto de perfil" className="relative w-32 h-32 shadow-lg rounded-pill">
            {photoUri ? (
              <img src={photoUri} alt="" className="w-32 h-32 rounded-pill object-cover border-[3px] border-white" />
            ) : (
              <div className="w-32 h-32 rounded-pill flex items-center justify-center border-[3px] border-white" style={{ backgroundImage: `linear-gradient(135deg, ${gradients.primary.join(', ')})` }}>
                <span className="text-white text-[54px]" style={{ fontFamily: 'var(--font-display)' }}>
                  {initial}
                </span>
              </div>
            )}
            <span className="absolute right-1 bottom-1 w-[34px] h-[34px] rounded-pill bg-accent border-2 border-white flex items-center justify-center">
              <Camera size={16} color={colors.white} />
            </span>
          </button>
          <p className="text-caption text-text-secondary mt-sm">Toque na foto para alterar</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-surface rounded-lg p-lg shadow-sm">
          <p className="text-label text-text-secondary mb-sm">Nome completo</p>
          <div className="flex items-center gap-sm bg-surface-alt rounded-md px-md py-md">
            <User size={18} color={colors.primary} />
            <input className="flex-1 bg-transparent outline-none text-body text-text-primary placeholder:text-text-muted" value={name} onChange={e => setName(e.target.value)} placeholder="Digite seu nome" />
          </div>

          <div className="h-px bg-divider my-lg" />

          <p className="text-label text-text-secondary mb-sm">Email</p>
          <div className="flex items-center gap-sm bg-surface-alt rounded-md px-md py-md">
            <Mail size={18} color={colors.primary} />
            <input className="flex-1 bg-transparent outline-none text-body text-text-primary placeholder:text-text-muted" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" type="email" autoCapitalize="none" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex items-center gap-sm bg-info-light rounded-md p-md">
          <ShieldCheck size={20} color={colors.primary} />
          <p className="flex-1 text-caption text-primary-dark">Seus dados são privados e ficam salvos com segurança.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <button type="button" onClick={handleSave} disabled={disabled} aria-label="Salvar alterações" className="w-full rounded-lg overflow-hidden shadow-md transition-transform active:scale-[0.98] disabled:opacity-60">
            <span className="flex items-center justify-center gap-sm py-md" style={{ backgroundImage: disabled ? `linear-gradient(90deg, ${colors.textMuted}, ${colors.textMuted})` : `linear-gradient(90deg, ${gradients.primary.join(', ')})` }}>
              <CheckCircle2 size={20} color={colors.white} />
              <span className="text-button text-white">{saving ? 'Salvando...' : 'Salvar alterações'}</span>
            </span>
          </button>
        </motion.div>
      </div>

      <AlertModal visible={alert.state.visible} onClose={alert.hide} title={alert.state.title} message={alert.state.message} variant={alert.state.variant} actions={alert.state.actions} autoHideMs={alert.state.autoHideMs} />
    </div>
  )
}
