'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail } from 'lucide-react'

import { api } from '@/services/api'
import { AlertModal, useAlertModal } from '@/components/common'
import { colors } from '@/theme'

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const alert = useAlertModal()
  const router = useRouter()

  const goBack = useCallback(() => router.back(), [router])

  const handleResetPassword = useCallback(async () => {
    if (!email.trim()) {
      alert.showWarning('Digite seu e-mail para continuar.', 'Atenção')
      return
    }
    setLoading(true)
    try {
      await api.post('/reset-password', { email })
      setSent(true)
    } catch {
      alert.showError('Não foi possível enviar o e-mail. Tente novamente.', 'Ops!')
    } finally {
      setLoading(false)
    }
  }, [alert, email])

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <div className="px-xxl pt-[calc(env(safe-area-inset-top)+26px)]">
        <button type="button" onClick={goBack} aria-label="Voltar" className="w-9 h-9 rounded-pill bg-surface border border-border flex items-center justify-center text-text-primary transition-transform active:scale-[0.92]">
          <ArrowLeft size={16} />
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex-1 flex flex-col items-center justify-center gap-md px-xxl text-center">
        <div className="w-16 h-16 rounded-pill bg-primary-soft flex items-center justify-center">
          <Mail size={26} color={colors.primaryLight} />
        </div>

        {sent ? (
          <>
            <p className="text-h2 text-text-primary">Link enviado!</p>
            <p className="text-body-small text-text-secondary max-w-[280px]">Verifique sua caixa de entrada — o link expira em 30 minutos.</p>
            <button
              type="button"
              onClick={handleResetPassword}
              disabled={loading}
              className="h-11 w-full max-w-[320px] rounded-pill border border-divider text-text-secondary flex items-center justify-center text-button-small mt-sm disabled:opacity-50"
            >
              {loading ? 'Reenviando...' : 'Reenviar'}
            </button>
          </>
        ) : (
          <>
            <p className="text-h2 text-text-primary">Esqueceu sua senha?</p>
            <p className="text-body-small text-text-secondary max-w-[280px]">Digite seu e-mail e enviaremos um link para criar uma nova senha.</p>

            <div className="w-full max-w-[320px] flex flex-col gap-1.5 text-left mt-sm">
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

            <button
              type="button"
              onClick={handleResetPassword}
              disabled={loading}
              className="h-[50px] w-full max-w-[320px] rounded-pill border border-primary text-primary flex items-center justify-center text-button transition-transform active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar link'}
            </button>
          </>
        )}

        <span className="text-caption text-text-muted mt-sm">
          Lembrou a senha?{' '}
          <button type="button" onClick={goBack} className="text-primary font-medium">
            Voltar ao login
          </button>
        </span>
      </motion.div>

      <AlertModal visible={alert.state.visible} onClose={alert.hide} title={alert.state.title} message={alert.state.message} variant={alert.state.variant} actions={alert.state.actions} autoHideMs={alert.state.autoHideMs} />
    </div>
  )
}
