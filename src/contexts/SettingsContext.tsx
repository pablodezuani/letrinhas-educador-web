'use client'

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

/**
 * SettingsContext — preferências do usuário persistidas em localStorage.
 * Ported from the RN app's AsyncStorage-backed context (same shape/keys).
 */
export interface AppSettings {
  darkMode: boolean
  notificationsEnabled: boolean
  notificationSound: boolean
  soundEnabled: boolean
  cameraEnabled: boolean
  /** Modo baixo estímulo: desativa confete, reduz gradientes/sombras/animações. */
  lowStimulationMode: boolean
  /** Forçar redução de animações independente do sistema (a11y). */
  reduceMotion: boolean
}

const STORAGE_KEY = '@letrinhas:settings'

const DEFAULT_SETTINGS: AppSettings = {
  darkMode: false,
  notificationsEnabled: true,
  notificationSound: true,
  soundEnabled: true,
  cameraEnabled: true,
  lowStimulationMode: false,
  reduceMotion: false,
}

type BooleanSettingKey = {
  [K in keyof AppSettings]: AppSettings[K] extends boolean ? K : never
}[keyof AppSettings]

interface SettingsContextData {
  settings: AppSettings
  hydrated: boolean
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void
  toggle: (key: BooleanSettingKey) => void
  reset: () => void
}

export const SettingsContext = createContext<SettingsContextData | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<AppSettings>
        setSettings({ ...DEFAULT_SETTINGS, ...parsed })
      }
    } catch (err) {
      console.warn('[SettingsContext] falha ao carregar settings:', err)
    } finally {
      setHydrated(true)
    }
  }, [])

  const persist = useCallback((next: AppSettings) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch (err) {
      console.warn('[SettingsContext] falha ao persistir settings:', err)
    }
  }, [])

  const updateSetting = useCallback<SettingsContextData['updateSetting']>(
    (key, value) => {
      setSettings(prev => {
        const next = { ...prev, [key]: value }
        persist(next)
        return next
      })
    },
    [persist],
  )

  const toggle = useCallback<SettingsContextData['toggle']>(
    key => {
      setSettings(prev => {
        const next = { ...prev, [key]: !prev[key] } as AppSettings
        persist(next)
        return next
      })
    },
    [persist],
  )

  const reset = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
    persist(DEFAULT_SETTINGS)
  }, [persist])

  const value = useMemo<SettingsContextData>(
    () => ({ settings, hydrated, updateSetting, toggle, reset }),
    [settings, hydrated, updateSetting, toggle, reset],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}
