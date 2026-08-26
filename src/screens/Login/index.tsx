'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'

import { useAuth } from '@/hooks/useAuth'
import { AlertModal, useAlertModal } from '@/components/common'

const SOCIALS = [
  { label: 'Google', glyph: 'G' },
  { label: 'Apple', glyph: '' },
  { label: 'Facebook', glyph: 'f' },
]

export default function Login() {
  const router = useRouter()
  const { signIn, loadingAuth } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const alert = useAlertModal()

  const togglePassword = useCallback(() => setShowPassword(v => !v), [])

  const handleLogin = useCallback(async () => {
    if (!email.trim() || !password) {
      alert.showWarning('Preencha email e senha para continuar.', 'Dados incompletos')
      return
    }
    try {
      await signIn({ email: email.trim(), password })
    } catch (err: any) {
      const status = err?.response?.status
      if (status === 400 || status === 401) {
        alert.showError('Email ou senha incorretos.', 'Não foi possível entrar')
      } else {
        alert.showError(err?.message || 'Tente novamente em instantes.', 'Erro inesperado')
      }
    }
  }, [email, password, signIn, alert])

  const goToCreate = useCallback(() => router.push('/create'), [router])
  const goToReset = useCallback(() => router.push('/forgot-password'), [router])
  const goBack = useCallback(() => router.back(), [router])

  return (
    <div className="relative flex flex-col min-h-dvh overflow-hidden bg-background">
      <div className="absolute -top-16 -right-16 w-[220px] h-[220px] rounded-pill pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(145,132,217,.16), transparent 70%)' }} />

      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 px-xxl pt-[calc(env(safe-area-inset-top)+26px)]">
        <button type="button" onClick={goBack} aria-label="Voltar" className="w-9 h-9 rounded-pill bg-surface border border-border flex items-center justify-center text-text-primary transition-transform active:scale-[0.92]">
          <ArrowLeft size={16} />
        </button>

        <div className="mt-lg flex flex-col gap-sm">
          <div className="flex items-center gap-sm">
            <span className="w-3.5 h-0.5 bg-primary inline-block" />
            <span className="text-label text-primary-light">Letrinhas Encantadas</span>
          </div>
          <h1 className="text-h1 text-text-primary leading-tight">
            Bem-vindo
            <br />
            de volta
          </h1>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="relative z-10 flex-1 flex flex-col justify-end px-xxl pb-xxl gap-md mt-xxxl">
        <div className="flex flex-col gap-1.5">
          <label className="text-caption text-text-secondary">Email</label>
          <input
            className="bg-surface-alt border border-divider rounded-md px-md py-sm text-body text-text-primary outline-none focus-visible:border-primary"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="seu@email.com"
            type="email"
            autoCapitalize="none"
            autoCorrect="off"
          />
        </div>

        <div className="flex flex-col gap-1.5 relative">
          <label className="text-caption text-text-secondary">Senha</label>
          <input
            className="bg-surface-alt border border-divider rounded-md px-md py-sm pr-11 text-body text-text-primary outline-none focus-visible:border-primary"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            type={showPassword ? 'text' : 'password'}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
          <button type="button" onClick={togglePassword} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'} className="absolute right-2 bottom-2 w-7 h-7 flex items-center justify-center text-text-muted">
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <button type="button" onClick={goToReset} className="self-end -mt-2 text-caption text-primary">
          Esqueceu a senha?
        </button>

        <button
          type="button"
          onClick={handleLogin}
          disabled={loadingAuth}
          className="h-[52px] rounded-pill border border-primary text-primary flex items-center justify-center text-button mt-1 transition-transform active:scale-[0.98] disabled:opacity-50"
        >
          {loadingAuth ? 'Entrando...' : 'Entrar'}
        </button>

        <div className="h-px bg-divider my-1" />

        <div className="flex justify-center gap-md">
          {SOCIALS.map(social => (
            <button key={social.label} type="button" aria-label={social.label} className="w-[38px] h-[38px] rounded-pill border border-border flex items-center justify-center text-caption font-semibold text-text-secondary">
              {social.glyph}
            </button>
          ))}
        </div>

        <span className="text-center text-caption text-text-muted mt-1">
          Não tem conta?{' '}
          <button type="button" onClick={goToCreate} className="text-primary font-medium">
            Cadastre-se
          </button>
        </span>
      </motion.div>

      <AlertModal visible={alert.state.visible} onClose={alert.hide} title={alert.state.title} message={alert.state.message} variant={alert.state.variant} autoHideMs={alert.state.autoHideMs} />
    </div>
  )
}
