'use client'

import { memo, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

/**
 * ScreenHeader — cabeçalho reutilizável para telas internas (EditProfile,
 * Settings, Notifications, About, Help): flat, sem gradiente (identidade Nocturne).
 */
export interface ScreenHeaderProps {
  title: string
  subtitle?: string
  onBack?: () => void
  rightAction?: ReactNode
}

function ScreenHeaderComponent({ title, subtitle, onBack, rightAction }: ScreenHeaderProps) {
  const router = useRouter()
  const handleBack = onBack ?? (() => router.back())

  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex items-center gap-md px-xl pt-[calc(env(safe-area-inset-top)+20px)] pb-md">
      <button
        type="button"
        onClick={handleBack}
        aria-label="Voltar"
        className="w-[34px] h-[34px] rounded-pill bg-surface border border-border flex items-center justify-center shrink-0 text-text-primary transition-transform active:scale-[0.92]"
      >
        <ArrowLeft size={15} />
      </button>

      <div className="flex-1 min-w-0 text-left">
        <p className="text-subtitle text-text-primary truncate">{title}</p>
        {subtitle ? <p className="text-caption text-text-muted truncate">{subtitle}</p> : null}
      </div>

      <div className="min-w-[34px] flex justify-end shrink-0">{rightAction}</div>
    </motion.div>
  )
}

export const ScreenHeader = memo(ScreenHeaderComponent)
export default ScreenHeader
