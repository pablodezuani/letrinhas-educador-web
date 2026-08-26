'use client'

import { memo, type ComponentType } from 'react'
import { motion } from 'framer-motion'
import { Gamepad2, Heart, ShieldCheck, Smile, Sparkles, TrendingUp } from 'lucide-react'

import { ScreenHeader } from '@/components/common'
import { colors } from '@/theme'

interface Feature {
  Icon: ComponentType<{ size?: number; color?: string }>
  color: string
  bg: string
  title: string
  description: string
}

const FEATURES: readonly Feature[] = [
  { Icon: Smile, color: colors.accent, bg: colors.accentSoft, title: 'Pensado para o TEA', description: 'Paleta suave e interações previsíveis. Menos sobrecarga sensorial.' },
  { Icon: Gamepad2, color: colors.primaryLight, bg: colors.primarySoft, title: 'Mini-jogos adaptados', description: 'Vogais, formação de palavras e frases com progressão gentil.' },
  { Icon: TrendingUp, color: colors.success, bg: colors.successLight, title: 'Acompanhamento', description: 'Conquistas e rotina em um só lugar.' },
  { Icon: ShieldCheck, color: colors.info, bg: colors.infoLight, title: 'Privacidade primeiro', description: 'Sem publicidade dentro do app.' },
]

const FeatureRow = memo(function FeatureRow({ feature, delay }: { feature: Feature; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }} className="flex items-start gap-md bg-surface rounded-lg p-md">
      <div className="w-9 h-9 rounded-pill flex items-center justify-center shrink-0" style={{ backgroundColor: feature.bg }}>
        <feature.Icon size={16} color={feature.color} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-body-small font-medium text-text-primary">{feature.title}</p>
        <p className="text-caption text-text-muted mt-0.5">{feature.description}</p>
      </div>
    </motion.div>
  )
})

export default function AboutScreen() {
  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <ScreenHeader title="Sobre o app" />

      <div className="flex-1 overflow-y-auto px-xl pb-huge flex flex-col gap-md">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-surface rounded-lg p-xl flex flex-col items-center text-center gap-sm">
          <div className="w-14 h-14 rounded-pill bg-primary-soft flex items-center justify-center">
            <Sparkles size={22} color={colors.primaryLight} />
          </div>
          <p className="text-subtitle text-text-primary">Letrinhas Encantadas</p>
          <p className="text-caption text-text-secondary max-w-[280px]">Letramento pensado com carinho para crianças com TEA (níveis 1, 2 e 3).</p>
          <span className="text-label px-sm py-1 rounded-md bg-primary-soft text-primary-light mt-1">Versão 1.0.0</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-surface rounded-lg p-lg flex flex-col gap-sm">
          <p className="text-body-small font-medium text-text-primary">Nossa missão</p>
          <p className="text-caption text-text-secondary leading-relaxed">
            Ajudar crianças com Transtorno do Espectro Autista a desenvolver fala, leitura e autoconfiança através de mini-jogos visuais, previsíveis e acolhedores — sem barulho excessivo, sem pressa.
          </p>
        </motion.div>

        <p className="text-label text-text-muted ml-xs mt-md">O que tem de bom</p>
        <div className="flex flex-col gap-sm">
          {FEATURES.map((f, i) => (
            <FeatureRow key={f.title} feature={f} delay={0.3 + i * 0.1} />
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }} className="bg-surface rounded-lg p-lg flex flex-col items-center gap-1 mt-sm">
          <Heart size={18} color={colors.error} />
          <p className="text-body-small font-medium text-text-primary">Feito com carinho</p>
          <p className="text-label text-text-muted">© {new Date().getFullYear()} Letrinhas Encantadas</p>
        </motion.div>
      </div>
    </div>
  )
}
