import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { colors } from '@/theme'
import { useReduceMotion } from '@/contexts/ThemeContext'

/**
 * Toast — feedback não-bloqueante, no topo da tela.
 *   const toast = useToast()
 *   toast.success('Salvo!')
 */
type ToastVariant = 'success' | 'error' | 'info' | 'warning'

interface ToastShape {
  id: number
  message: string
  variant: ToastVariant
  duration: number
}

interface ToastContextValue {
  show: (message: string, opts?: { variant?: ToastVariant; duration?: number }) => void
  success: (message: string, duration?: number) => void
  error: (message: string, duration?: number) => void
  info: (message: string, duration?: number) => void
  warning: (message: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const ICON: Record<ToastVariant, typeof CheckCircle> = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
}

const FG: Record<ToastVariant, string> = {
  success: colors.successDark,
  error: colors.errorDark,
  info: colors.infoDark,
  warning: colors.warningDark,
}

const BG: Record<ToastVariant, string> = {
  success: colors.successLight,
  error: colors.errorLight,
  info: colors.infoLight,
  warning: colors.warningLight,
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastShape | null>(null)
  const reduceMotion = useReduceMotion()
  const idRef = useRef(0)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const dismiss = useCallback(() => setToast(null), [])

  const show = useCallback<ToastContextValue['show']>(
    (message, opts) => {
      const variant = opts?.variant ?? 'info'
      const duration = opts?.duration ?? 2400
      idRef.current += 1
      const id = idRef.current
      setToast({ id, message, variant, duration })
      if (hideTimer.current) clearTimeout(hideTimer.current)
      hideTimer.current = setTimeout(() => {
        if (idRef.current === id) dismiss()
      }, duration)
    },
    [dismiss],
  )

  const value = useMemo<ToastContextValue>(
    () => ({
      show,
      success: (m, d) => show(m, { variant: 'success', duration: d }),
      error: (m, d) => show(m, { variant: 'error', duration: d }),
      info: (m, d) => show(m, { variant: 'info', duration: d }),
      warning: (m, d) => show(m, { variant: 'warning', duration: d }),
    }),
    [show],
  )

  const Icon = toast ? ICON[toast.variant] : null

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed left-lg right-lg z-[1000] flex justify-center pointer-events-none top-[calc(env(safe-area-inset-top)+8px)]">
        <AnimatePresence>
          {toast && Icon && (
            <motion.div
              initial={{ y: reduceMotion ? 0 : -80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: reduceMotion ? 0 : -80, opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.28 }}
              role="alert"
              aria-live="polite"
              className="flex items-center py-md px-lg rounded-lg min-w-[200px] max-w-[480px] shadow-lg pointer-events-auto"
              style={{ backgroundColor: BG[toast.variant] }}
            >
              <Icon size={18} color={FG[toast.variant]} className="mr-sm shrink-0" />
              <span className="text-body-small font-semibold" style={{ color: FG[toast.variant] }}>
                {toast.message}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    const noop = () => {}
    return { show: noop, success: noop, error: noop, info: noop, warning: noop }
  }
  return ctx
}

export default ToastProvider
