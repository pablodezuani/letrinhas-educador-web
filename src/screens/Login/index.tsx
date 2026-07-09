'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from 'lucide-react'

import { useAuth } from '@/hooks/useAuth'
import { AlertModal, useAlertModal } from '@/components/common'
import { Input } from '@/components/ui'
import { FloatingLetters, type FloatingLetterSpec } from '@/components/auth/FloatingLetters'
import { useReduceMotion } from '@/contexts/ThemeContext'
import { colors } from '@/theme'

const MINI_LETTERS: FloatingLetterSpec[] = [
  { char: 'A', leftPct: 10, color: '#F5A97C', size: 22, delay: 0, dur: 6000 },
  { char: 'E', leftPct: 55, color: '#CBAACB', size: 18, delay: 800, dur: 5400 },
  { char: '✦', leftPct: 80, color: '#FAC7A6', size: 14, delay: 1600, dur: 4800 },
  { char: 'I', leftPct: 30, color: '#7FB77E', size: 26, delay: 400, dur: 5800 },
]

export default function Login() {
  const router = useRouter()
  const { signIn, loadingAuth } = useAuth()
  const reduceMotion = useReduceMotion()

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
    <div className="relative flex flex-col min-h-dvh overflow-hidden" style={{ backgroundImage: 'linear-gradient(160deg, #061720, #0F2D3E, #1A4055, #305F72)' }}>
      <FloatingLetters letters={MINI_LETTERS} />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.2 }}
        className="relative z-10 flex-[0.55] px-xxl pb-lg flex flex-col justify-end pt-[calc(env(safe-area-inset-top)+16px)]"
      >
        <button type="button" onClick={goBack} aria-label="Voltar" className="w-[42px] h-[42px] rounded-pill bg-white/14 border border-white/22 flex items-center justify-center mb-lg transition-transform active:scale-[0.92]">
          <ArrowLeft size={20} color={colors.white} />
        </button>

        <p className="text-label mb-xs tracking-[1.2px]" style={{ color: 'rgba(245,169,124,0.85)' }}>
          ✦ LETRINHAS ENCANTADAS ✦
        </p>
        <h1 className="text-white text-[30px] leading-[40px]" style={{ fontFamily: 'var(--font-display)', textShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
          Bem-vindo
          <br />
          de volta!
        </h1>
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.25 }}
        className="relative z-10 flex-1 bg-primary rounded-t-[40px] px-xxl pt-xl flex flex-col"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom) + 20px, 24px)' }}
      >
        <div className="w-11 h-1 bg-white/28 rounded-full self-center mb-xl" />

        <Input
          label="Email"
          tone="dark"
          icon={<Mail size={18} color="rgba(255,248,244,0.7)" />}
          placeholder="seu@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="email"
          autoCapitalize="none"
          autoCorrect="off"
        />

        <Input
          label="Senha"
          tone="dark"
          icon={<Lock size={18} color="rgba(255,248,244,0.7)" />}
          rightIcon={showPassword ? <EyeOff size={18} color="rgba(255,248,244,0.7)" /> : <Eye size={18} color="rgba(255,248,244,0.7)" />}
          onRightIconPress={togglePassword}
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          type={showPassword ? 'text' : 'password'}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
        />

        <button type="button" onClick={goToReset} className="self-end mb-lg -mt-xs text-body-small font-semibold underline" style={{ color: colors.secondaryLight }}>
          Esqueceu a senha?
        </button>

        <button
          type="button"
          onClick={handleLogin}
          disabled={loadingAuth}
          className="h-[54px] rounded-pill flex items-center justify-center mb-xl transition-transform active:scale-[0.97] disabled:opacity-70"
          style={{ backgroundImage: loadingAuth ? 'linear-gradient(90deg, #888, #888)' : 'linear-gradient(90deg, #F5A97C, #D48660)' }}
        >
          <span className="text-white text-[16px] font-extrabold">{loadingAuth ? 'Entrando…' : 'Acessar ✨'}</span>
        </button>

        <div className="flex items-center gap-md mb-lg">
          <div className="flex-1 h-px bg-white/22" />
          <span className="text-caption" style={{ color: 'rgba(255,248,244,0.6)' }}>
            ou acesse com
          </span>
          <div className="flex-1 h-px bg-white/22" />
        </div>

        <div className="flex justify-center gap-md mb-xxl">
          {[
            { label: 'Google', glyph: 'G', color: '#db4a39' },
            { label: 'Apple', glyph: '', color: 'rgba(255,248,244,0.92)' },
            { label: 'Facebook', glyph: 'f', color: '#5b87d1' },
          ].map(social => (
            <button key={social.label} type="button" aria-label={social.label} className="w-14 h-14 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-xl font-bold" style={{ color: social.color }}>
              {social.glyph}
            </button>
          ))}
        </div>

        <div className="mt-auto text-center pb-lg">
          <span className="text-body-small" style={{ color: 'rgba(255,248,244,0.7)' }}>
            Não possui acesso?{'  '}
            <button type="button" onClick={goToCreate} className="font-bold underline" style={{ color: colors.secondaryLight }}>
              Cadastre-se
            </button>
          </span>
        </div>
      </motion.div>

      <AlertModal visible={alert.state.visible} onClose={alert.hide} title={alert.state.title} message={alert.state.message} variant={alert.state.variant} autoHideMs={alert.state.autoHideMs} />
    </div>
  )
}
