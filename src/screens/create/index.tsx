'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Eye, EyeOff, Lock, Mail, User } from 'lucide-react'

import { AlertModal, useAlertModal } from '@/components/common'
import { Input } from '@/components/ui'
import { useAuth } from '@/hooks'
import { FloatingLetters, type FloatingLetterSpec } from '@/components/auth/FloatingLetters'
import { useReduceMotion } from '@/contexts/ThemeContext'
import { colors } from '@/theme'

const MINI_LETTERS: FloatingLetterSpec[] = [
  { char: 'C', leftPct: 8, color: '#7FB77E', size: 24, delay: 0, dur: 5600 },
  { char: 'R', leftPct: 65, color: '#CBAACB', size: 20, delay: 1000, dur: 5000 },
  { char: '✦', leftPct: 85, color: '#FAC7A6', size: 14, delay: 500, dur: 6200 },
  { char: 'S', leftPct: 40, color: '#6DAED9', size: 18, delay: 1800, dur: 4800 },
]

export default function CadastroScreen() {
  const [nome, setNome] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false)

  const { signUp, loadingAuth } = useAuth()
  const alert = useAlertModal()
  const router = useRouter()
  const reduceMotion = useReduceMotion()

  const goBack = useCallback(() => router.back(), [router])
  const goToLogin = useCallback(() => router.push('/login'), [router])

  const toggleSenha = useCallback(() => setMostrarSenha(p => !p), [])
  const toggleConfirmar = useCallback(() => setMostrarConfirmar(p => !p), [])

  const formatarData = useCallback((input: string) => {
    let value = input.replace(/\D/g, '').substring(0, 8)
    value = value.replace(/^(\d{2})(\d)/, '$1/$2')
    value = value.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3')
    setDataNascimento(value)
  }, [])

  const handleCadastro = useCallback(async () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      alert.showWarning('Preencha todos os campos.', 'Atenção')
      return
    }
    if (senha !== confirmarSenha) {
      alert.showWarning('As senhas não coincidem.', 'Atenção')
      return
    }
    if (senha.length < 8) {
      alert.showWarning('A senha deve ter pelo menos 8 caracteres.', 'Atenção')
      return
    }
    try {
      await signUp({ name: nome, email, password: senha })
      alert.show({ title: 'Tudo certo!', message: 'Cadastro realizado com sucesso.', variant: 'success', autoHideMs: 1800 })
      setTimeout(goToLogin, 1800)
    } catch (error: any) {
      alert.showError(error?.message || 'Tente novamente em instantes.', 'Erro ao cadastrar')
    }
  }, [alert, confirmarSenha, email, goToLogin, nome, senha, signUp])

  return (
    <div className="relative flex flex-col min-h-dvh overflow-hidden" style={{ backgroundImage: 'linear-gradient(160deg, #061720, #0F2D3E, #1A4055, #305F72)' }}>
      <FloatingLetters letters={MINI_LETTERS} />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.2 }}
        className="relative z-10 flex-[0.45] px-xxl pb-lg flex flex-col justify-end pt-[calc(env(safe-area-inset-top)+16px)]"
      >
        <button type="button" onClick={goBack} aria-label="Voltar" className="w-[42px] h-[42px] rounded-pill bg-white/14 border border-white/22 flex items-center justify-center mb-lg transition-transform active:scale-[0.92]">
          <ArrowLeft size={20} color={colors.white} />
        </button>
        <p className="text-label mb-xs tracking-[1.2px]" style={{ color: 'rgba(245,169,124,0.85)' }}>
          ✦ CRIE SUA CONTA ✦
        </p>
        <h1 className="text-white text-[28px] leading-[38px]" style={{ fontFamily: 'var(--font-display)', textShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
          Vamos começar
          <br />
          sua jornada!
        </h1>
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.25 }}
        className="relative z-10 flex-1 bg-primary rounded-t-[40px] px-xxl pt-xl flex flex-col overflow-y-auto"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom) + 16px, 24px)' }}
      >
        <div className="w-11 h-1 bg-white/28 rounded-full self-center mb-lg" />

        <div className="flex gap-xs mb-lg">
          <span className="h-1.5 w-7 rounded-full bg-accent" />
          <span className="h-1.5 w-7 rounded-full bg-accent" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
        </div>

        <Input label="Nome completo" tone="dark" icon={<User size={18} color="rgba(255,248,244,0.7)" />} placeholder="Ex: Maria Souza" value={nome} onChange={e => setNome(e.target.value)} />
        <Input
          label="Data de nascimento"
          tone="dark"
          icon={<Calendar size={18} color="rgba(255,248,244,0.7)" />}
          placeholder="DD/MM/AAAA"
          value={dataNascimento}
          onChange={e => formatarData(e.target.value)}
          inputMode="numeric"
          maxLength={10}
        />
        <Input label="Email" tone="dark" icon={<Mail size={18} color="rgba(255,248,244,0.7)" />} placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} type="email" autoCapitalize="none" />
        <Input
          label="Senha"
          tone="dark"
          icon={<Lock size={18} color="rgba(255,248,244,0.7)" />}
          rightIcon={mostrarSenha ? <EyeOff size={18} color="rgba(255,248,244,0.7)" /> : <Eye size={18} color="rgba(255,248,244,0.7)" />}
          onRightIconPress={toggleSenha}
          placeholder="Mínimo 8 caracteres"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          type={mostrarSenha ? 'text' : 'password'}
        />
        <Input
          label="Confirmar senha"
          tone="dark"
          icon={<Lock size={18} color="rgba(255,248,244,0.7)" />}
          rightIcon={mostrarConfirmar ? <EyeOff size={18} color="rgba(255,248,244,0.7)" /> : <Eye size={18} color="rgba(255,248,244,0.7)" />}
          onRightIconPress={toggleConfirmar}
          placeholder="Repita a senha"
          value={confirmarSenha}
          onChange={e => setConfirmarSenha(e.target.value)}
          type={mostrarConfirmar ? 'text' : 'password'}
        />

        <button
          type="button"
          onClick={handleCadastro}
          disabled={loadingAuth}
          className="h-[54px] rounded-pill flex items-center justify-center mt-sm mb-lg transition-transform active:scale-[0.97] disabled:opacity-70"
          style={{ backgroundImage: loadingAuth ? 'linear-gradient(90deg, #888, #888)' : 'linear-gradient(90deg, #F5A97C, #D48660)' }}
        >
          <span className="text-white font-extrabold">{loadingAuth ? 'Cadastrando…' : 'Cadastrar ✨'}</span>
        </button>

        <div className="text-center pb-xxl">
          <span className="text-body-small" style={{ color: 'rgba(255,248,244,0.7)' }}>
            Já tem conta?{'  '}
            <button type="button" onClick={goToLogin} className="font-bold underline" style={{ color: colors.secondaryLight }}>
              Entrar
            </button>
          </span>
        </div>
      </motion.div>

      <AlertModal visible={alert.state.visible} onClose={alert.hide} title={alert.state.title} message={alert.state.message} variant={alert.state.variant} actions={alert.state.actions} autoHideMs={alert.state.autoHideMs} />
    </div>
  )
}
