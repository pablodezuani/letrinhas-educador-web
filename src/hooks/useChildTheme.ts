'use client'

import { useMemo } from 'react'
import { colors, gradients } from '@/theme'
import { useTheme } from '@/contexts/ThemeContext'

/**
 * Paleta personalizada por gênero da criança — usada pelos jogos e pelo ChildScreen
 * para não duplicar mapas menino/menina em cada tela.
 */
export type ChildGender = 'menino' | 'menina' | 'male' | 'female' | string

interface ChildThemePalette {
  primary: string
  primaryLight: string
  primaryDark: string
  textOnPrimary: string
  background: readonly [string, string, string]
  cardBg: string
  shadowColor: string
  correct: readonly [string, string]
  wrong: readonly [string, string]
}

const PALETTES: Record<'menino' | 'menina', ChildThemePalette> = {
  menino: {
    primary: colors.boy,
    primaryLight: colors.boyLight,
    primaryDark: colors.boyDark,
    textOnPrimary: colors.white,
    background: [colors.boyLight, '#B9D9EA', colors.boy] as const,
    cardBg: 'rgba(255,255,255,0.95)',
    shadowColor: colors.boyDark,
    correct: [colors.success, colors.successDark] as const,
    wrong: [colors.error, colors.errorDark] as const,
  },
  menina: {
    primary: colors.girl,
    primaryLight: colors.girlLight,
    primaryDark: colors.girlDark,
    textOnPrimary: colors.white,
    background: [colors.girlLight, '#EEBFCD', colors.girl] as const,
    cardBg: 'rgba(255,255,255,0.95)',
    shadowColor: colors.girlDark,
    correct: [colors.success, colors.successDark] as const,
    wrong: [colors.error, colors.errorDark] as const,
  },
}

function normalizeGender(g: ChildGender | undefined | null): 'menino' | 'menina' {
  if (!g) return 'menino'
  const lower = String(g).toLowerCase()
  if (lower === 'menina' || lower === 'female' || lower === 'f') return 'menina'
  return 'menino'
}

export function useChildTheme(gender: ChildGender | undefined | null) {
  const { resolveGradient, lowStimulationMode } = useTheme()

  return useMemo(() => {
    const key = normalizeGender(gender)
    const palette = PALETTES[key]

    const bg = resolveGradient(palette.background) as readonly [string, string, string]
    const correct = resolveGradient(palette.correct) as readonly [string, string]
    const wrong = resolveGradient(palette.wrong) as readonly [string, string]

    return {
      gender: key,
      palette,
      backgroundGradient: bg,
      correctGradient: correct,
      wrongGradient: wrong,
      primaryGradient: resolveGradient(
        key === 'menino' ? gradients.ocean : gradients.sunset,
      ) as readonly [string, string],
      lowStimulationMode,
    }
  }, [gender, resolveGradient, lowStimulationMode])
}

export default useChildTheme
