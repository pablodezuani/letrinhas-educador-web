'use client'

import { useCallback, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, CheckCircle2, ShieldCheck } from 'lucide-react'

import { AlertModal, ScreenHeader, useAlertModal } from '@/components/common'
import { useAuth, usePhotoPicker } from '@/hooks'
import { colors } from '@/theme'

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
    <div className="min-h-dvh flex flex-col bg-background">
      <ScreenHeader
        title="Editar perfil"
        rightAction={
          <button type="button" onClick={handleSave} disabled={disabled} aria-label="Salvar alterações" className="text-caption font-medium text-primary px-sm py-1 disabled:opacity-40">
            {saving ? '...' : 'Salvar'}
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto px-xl pb-huge flex flex-col gap-lg">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-col items-center mt-sm">
          <button type="button" onClick={handleChangePhoto} aria-label="Alterar foto de perfil" className="relative w-24 h-24">
            {photoUri ? (
              <img src={photoUri} alt="" className="w-24 h-24 rounded-pill object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-pill flex items-center justify-center bg-primary-soft">
                <span className="text-[28px] font-medium text-primary-light">{initial}</span>
              </div>
            )}
            <span className="absolute right-0 bottom-0 w-7 h-7 rounded-pill bg-primary flex items-center justify-center">
              <Camera size={14} color={colors.textOnPrimary} />
            </span>
          </button>
          <p className="text-label text-text-muted mt-sm">Toque na foto para alterar</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-surface rounded-lg p-lg flex flex-col gap-lg">
          <div className="flex flex-col gap-1.5">
            <label className="text-caption text-text-secondary">Nome completo</label>
            <input
              className="bg-surface-alt border border-divider rounded-md px-md py-sm text-body text-text-primary outline-none focus-visible:border-primary"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Digite seu nome"
            />
          </div>

          <div className="h-px bg-divider" />

          <div className="flex flex-col gap-1.5">
            <label className="text-caption text-text-secondary">Email</label>
            <input
              className="bg-surface-alt border border-divider rounded-md px-md py-sm text-body text-text-primary outline-none focus-visible:border-primary"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              type="email"
              autoCapitalize="none"
            />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex items-center gap-sm bg-info-light rounded-md p-md">
          <ShieldCheck size={18} color={colors.info} className="shrink-0" />
          <p className="flex-1 text-caption text-text-secondary">Seus dados são privados e ficam salvos com segurança.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <button
            type="button"
            onClick={handleSave}
            disabled={disabled}
            aria-label="Salvar alterações"
            className="w-full h-[50px] rounded-pill border flex items-center justify-center gap-sm text-button transition-transform active:scale-[0.98] disabled:opacity-45"
            style={{ borderColor: disabled ? colors.divider : colors.primary, color: disabled ? colors.textMuted : colors.primary }}
          >
            <CheckCircle2 size={18} />
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </motion.div>
      </div>

      <AlertModal visible={alert.state.visible} onClose={alert.hide} title={alert.state.title} message={alert.state.message} variant={alert.state.variant} actions={alert.state.actions} autoHideMs={alert.state.autoHideMs} />
    </div>
  )
}
