'use client'

import { useContext } from 'react'
import { SettingsContext } from '@/contexts/SettingsContext'

/** useSettings — consumo seguro de SettingsContext. Lança erro claro fora do Provider. */
export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) {
    throw new Error('useSettings deve ser usado dentro de <SettingsProvider>.')
  }
  return ctx
}
