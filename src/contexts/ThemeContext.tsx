'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { theme as baseTheme, type Theme } from '@/theme'
import { useSettings } from '@/hooks/useSettings'

/**
 * Centraliza acesso ao design system + estados que afetam a UI globalmente:
 *
 *  - reduceMotion       → respeita `prefers-reduced-motion` do SO + toggle do app
 *  - lowStimulationMode → modo "calmo" para crianças com TEA mais sensíveis
 *  - motionDuration(ms) → helper para escalar durações de animação
 *  - resolveGradient    → retorna gradiente "achatado" (1 cor) quando lowStimulationMode
 */
interface ThemeContextValue {
  theme: Theme
  reduceMotion: boolean
  lowStimulationMode: boolean
  motionDuration: (ms: number) => number
  resolveGradient: <T extends readonly string[]>(gradient: T) => readonly string[]
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function fallbackValue(): ThemeContextValue {
  return {
    theme: baseTheme,
    reduceMotion: false,
    lowStimulationMode: false,
    motionDuration: ms => ms,
    resolveGradient: g => g,
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings()
  const [systemReduceMotion, setSystemReduceMotion] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setSystemReduceMotion(query.matches)
    const listener = (e: MediaQueryListEvent) => setSystemReduceMotion(e.matches)
    query.addEventListener('change', listener)
    return () => query.removeEventListener('change', listener)
  }, [])

  const reduceMotion = systemReduceMotion || settings.reduceMotion
  const lowStimulationMode = settings.lowStimulationMode

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: baseTheme,
      reduceMotion,
      lowStimulationMode,
      motionDuration: (ms: number) => (reduceMotion ? 0 : ms),
      resolveGradient: gradient => (lowStimulationMode ? [gradient[0], gradient[0]] : gradient),
    }),
    [reduceMotion, lowStimulationMode],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/** Devolve theme + flags + helpers. Seguro fora do Provider (fallback). */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  return ctx ?? fallbackValue()
}

/** Hook menor para casos em que só precisamos saber se devemos animar. */
export function useReduceMotion(): boolean {
  return useTheme().reduceMotion
}

/** Hook menor para casos em que só precisamos saber se estamos em modo calmo. */
export function useLowStimulation(): boolean {
  return useTheme().lowStimulationMode
}
