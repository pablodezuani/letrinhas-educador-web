'use client'

import { memo, type ComponentType } from 'react'
import { motion } from 'framer-motion'
import { Gamepad2, Heart, ShieldCheck, Smile, Sparkles, TrendingUp } from 'lucide-react'

import { ScreenHeader } from '@/components/common'
import { colors, gradients } from '@/theme'

interface Feature {
  Icon: ComponentType<{ size?: number; color?: string }>
  color: string
  bg: string
  title: string
  description: string
}

const FEATURES: readonly Feature[] = [
  { Icon: Smile, color: colors.accent, bg: '#FBEFE4', title: 'Pensado para o TEA', description: 'Paleta suave, fontes arredondadas e interações previsíveis. Menos sobrecarga sensorial.' },
  { Icon: Gamepad2, color: colors.primary, bg: colors.infoLight, title: 'Mini-jogos adaptados', description: 'Atividades de vogais, formação de palavras e frases com progressão gentil.' },
  { Icon: TrendingUp, color: colors.success, bg: colors.successLight, title: 'Acompanhamento do progresso', description: 'Pais e terapeutas veem conquistas, tempo de atividade e rotina em um só lugar.' },
  { Icon: ShieldCheck, color: colors.secondaryDark, bg: colors.secondaryLight, title: 'Privacidade em primeiro lugar', description: 'Dados das crianças são guardados com segurança. Sem publicidade dentro do app.' },
]

const FeatureCard = memo(function FeatureCard({ feature, delay }: { feature: Feature; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }} className="flex items-start gap-md bg-surface rounded-lg p-md shadow-sm">
      <div className="w-11 h-11 rounded-pill flex items-center justify-center shrink-0" style={{ backgroundColor: feature.bg }}>
        <feature.Icon size={22} color={feature.color} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-subtitle text-text-primary mb-0.5">{feature.title}</p>
        <p className="text-body-small text-text-secondary">{feature.description}</p>
      </div>
    </motion.div>
  )
})

export default function AboutScreen() {
  return (
    <div className="min-h-dvh flex flex-col" style={{ backgroundImage: `linear-gradient(180deg, ${gradients.soft.join(', ')})` }}>
      <ScreenHeader title="Sobre o app" subtitle="Letrinhas Encantadas" />

      <div className="flex-1 overflow-y-auto p-xl pb-huge flex flex-col gap-md">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="rounded-xl overflow-hidden shadow-lg">
          <div className="flex flex-col items-center py-xxl px-xl" style={{ backgroundImage: `linear-gradient(135deg, ${gradients.primary.join(', ')})` }}>
            <div className="w-18 h-18 rounded-pill bg-white/20 border-2 border-white/35 flex items-center justify-center mb-md" style={{ width: 72, height: 72 }}>
              <Sparkles size={32} color={colors.white} />
            </div>
            <h1 className="text-h1 text-white text-center">Letrinhas Encantadas</h1>
            <p className="text-body text-white/88 text-center mt-sm mb-md">Um app de letramento pensado com carinho para crianças com TEA (níveis 1, 2 e 3).</p>
            <span className="px-md py-1.5 rounded-pill bg-white/22">
              <span className="text-caption text-white font-bold">Versão 1.0.0</span>
            </span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-surface rounded-lg p-lg flex flex-col gap-sm shadow-sm">
          <h2 className="text-h3 text-text-primary mb-xs">Nossa missão</h2>
          <p className="text-body text-text-secondary">Ajudar crianças com Transtorno do Espectro Autista a desenvolver fala, leitura e autoconfiança através de mini-jogos visuais, previsíveis e acolhedores.</p>
          <p className="text-body text-text-secondary">Cada jogo foi desenhado respeitando os tempos e as sensibilidades de cada criança — sem barulho excessivo, sem pressão, com muitos feedbacks positivos.</p>
        </motion.div>

        <p className="text-label text-text-secondary ml-xs mt-md mb-xs">O que tem de bom</p>
        <div className="flex flex-col gap-sm">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} feature={f} delay={0.3 + i * 0.1} />
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8 }} className="bg-surface rounded-lg p-lg flex flex-col items-center mt-md shadow-sm">
          <Heart size={24} color={colors.error} className="mb-sm" />
          <h3 className="text-h3 text-text-primary mb-xs">Feito com carinho</h3>
          <p className="text-body text-text-secondary text-center">Letrinhas Encantadas é desenvolvido por uma equipe que acredita em um letramento inclusivo. Agradecemos a cada família que nos inspira.</p>
          <p className="text-caption text-text-muted mt-md">© {new Date().getFullYear()} Letrinhas Encantadas</p>
        </motion.div>
      </div>
    </div>
  )
}
