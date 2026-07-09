'use client'

import { memo, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { gradients } from '@/theme'

/**
 * ScreenHeader — cabeçalho reutilizável para telas internas (EditProfile,
 * Settings, Notifications, About, Help): gradient + botão voltar + título +
 * slot de ação à direita.
 */
export interface ScreenHeaderProps {
  title: string
  subtitle?: string
  onBack?: () => void
  rightAction?: ReactNode
  gradient?: readonly string[]
  /** Espaçamento extra embaixo, quando há conteúdo grande logo abaixo. */
  spacious?: boolean
}

function ScreenHeaderComponent({ title, subtitle, onBack, rightAction, gradient = gradients.primary, spacious = false }: ScreenHeaderProps) {
  const router = useRouter()
  const handleBack = onBack ?? (() => router.back())

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-b-xxl shadow-lg ${spacious ? 'mb-md' : ''}`}
    >
      <div
        className="relative pt-[calc(env(safe-area-inset-top)+32px)] pb-xl px-xl"
        style={{ backgroundImage: `linear-gradient(135deg, ${gradient.join(', ')})` }}
      >
        <div className="absolute w-[180px] h-[180px] rounded-pill bg-white/8 -top-[60px] -right-10 pointer-events-none" />
        <div className="absolute w-[90px] h-[90px] rounded-pill bg-white/6 -bottom-5 -left-2.5 pointer-events-none" />

        <div className="relative flex items-center gap-md">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Voltar"
            className="w-10 h-10 rounded-pill bg-white/20 border border-white/32 flex items-center justify-center shrink-0 transition-transform active:scale-[0.92]"
          >
            <ArrowLeft size={22} color="white" />
          </button>

          <div className="flex-1 min-w-0 text-left">
            <h2 className="text-h2 text-white truncate">{title}</h2>
            {subtitle ? <p className="text-caption text-white/82 mt-0.5 line-clamp-2">{subtitle}</p> : null}
          </div>

          <div className="min-w-10 flex justify-end shrink-0">{rightAction}</div>
        </div>
      </div>
    </motion.div>
  )
}

export const ScreenHeader = memo(ScreenHeaderComponent)
export default ScreenHeader
