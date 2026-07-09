'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Construction } from 'lucide-react'
import { colors, gradients } from '@/theme'
import { readGameNav } from '@/lib/navState'

/**
 * Placeholder para os 4 jogos (Fase 2 do port). Mantém a navegação e o
 * contexto (nome da criança) já funcionando enquanto a lógica de cada jogo
 * é portada da versão React Native.
 */
export function ComingSoon({ title, emoji }: { title: string; emoji: string }) {
  const router = useRouter()
  const [childName, setChildName] = useState<string>()

  useEffect(() => {
    setChildName(readGameNav()?.childName)
  }, [])

  return (
    <div className="min-h-dvh flex flex-col" style={{ backgroundImage: `linear-gradient(160deg, ${gradients.primary.join(', ')})` }}>
      <div className="flex items-center px-xl pt-[calc(env(safe-area-inset-top)+12px)] pb-md">
        <button type="button" onClick={() => router.back()} aria-label="Voltar" className="w-10 h-10 rounded-pill bg-white/15 flex items-center justify-center">
          <ArrowLeft size={20} color={colors.white} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-xxl text-center">
        <span className="text-[64px] mb-lg">{emoji}</span>
        <h1 className="text-h1 text-white mb-sm">{title}</h1>
        {childName ? <p className="text-body text-white/75 mb-xxl">Prepare-se, {childName}!</p> : null}

        <div className="flex flex-col items-center gap-md bg-white/8 border border-white/12 rounded-lg px-xl py-xxl">
          <Construction size={48} color="rgba(255,255,255,0.6)" />
          <p className="text-body-small text-white/60">Este jogo ainda está sendo preparado para a versão web.</p>
        </div>
      </div>
    </div>
  )
}
