import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail } from 'lucide-react'

import { api } from '@/services/api'
import { AlertModal, useAlertModal } from '@/components/common'
import { Button, Input, Screen } from '@/components/ui'
import { useReduceMotion } from '@/contexts/ThemeContext'
import { colors } from '@/theme'

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const alert = useAlertModal()
  const navigate = useNavigate()
  const reduceMotion = useReduceMotion()

  const goBack = useCallback(() => navigate(-1), [navigate])

  const handleResetPassword = useCallback(async () => {
    if (!email) {
      alert.showWarning('Digite seu e-mail para continuar.', 'Atenção')
      return
    }
    setLoading(true)
    try {
      await api.post('/reset-password', { email })
      alert.show({ title: 'Enviado!', message: 'Verifique sua caixa de entrada.', variant: 'success', autoHideMs: 2500 })
    } catch {
      alert.showError('Não foi possível enviar o e-mail. Tente novamente.', 'Ops!')
    } finally {
      setLoading(false)
    }
  }, [alert, email])

  return (
    <Screen background="cream" padded={false} edges={['top']}>
      <div className="absolute w-[170px] h-[170px] rounded-pill bg-secondary opacity-[0.18] -top-[60px] -right-10 pointer-events-none" />
      <div className="absolute w-[76px] h-[76px] rounded-pill bg-accent opacity-[0.18] top-20 right-[70px] pointer-events-none" />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.2 }}
        className="px-xxl pb-lg pt-xl"
      >
        <button type="button" onClick={goBack} aria-label="Voltar" className="w-10 h-10 rounded-pill bg-primary-soft flex items-center justify-center mb-lg transition-transform active:scale-[0.92]">
          <ArrowLeft size={20} color={colors.primary} />
        </button>
        <p className="text-label mb-xs text-accent-dark">RECUPERAR ACESSO</p>
        <h1 className="text-h1 text-primary">
          Esqueceu
          <br />
          sua senha?
        </h1>
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.25 }}
        className="flex-1 bg-primary rounded-t-xxl px-xxl pt-xxl pb-xxl flex flex-col"
      >
        <div className="w-9 h-1 bg-white/28 rounded-full self-center mb-xxl" />

        <div className="rounded-pill bg-[rgba(203,170,203,0.22)] border-[1.5px] border-[rgba(203,170,203,0.4)] flex items-center justify-center self-center mb-xl" style={{ width: 72, height: 72 }}>
          <Mail size={28} color={colors.secondary} />
        </div>

        <p className="text-body text-center mb-xxl" style={{ color: 'rgba(255,248,244,0.78)' }}>
          Digite seu e-mail e enviaremos um link para você criar uma nova senha.
        </p>

        <Input label="Email" tone="dark" icon={<Mail size={18} color="rgba(255,248,244,0.7)" />} placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} type="email" autoCapitalize="none" />

        <Button label={loading ? 'Enviando…' : 'Enviar link'} variant="primary" size="lg" fullWidth loading={loading} onClick={handleResetPassword} className="mt-sm mb-xl" />

        <button type="button" onClick={goBack} className="text-center text-body-small" style={{ color: 'rgba(255,248,244,0.7)' }}>
          Lembrou a senha?{'  '}
          <span className="font-bold underline" style={{ color: colors.secondaryLight }}>
            Voltar ao login
          </span>
        </button>
      </motion.div>

      <AlertModal visible={alert.state.visible} onClose={alert.hide} title={alert.state.title} message={alert.state.message} variant={alert.state.variant} actions={alert.state.actions} autoHideMs={alert.state.autoHideMs} />
    </Screen>
  )
}
