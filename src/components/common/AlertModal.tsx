import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { colors } from '@/theme'
import { cn } from '@/lib/cn'

/**
 * AlertModal — modal controlado por props (substitui o `Alert.alert` nativo).
 * 4 variantes: error | warning | success | info, com confirmação de 1-2 botões.
 */
export type AlertVariant = 'error' | 'warning' | 'success' | 'info'

export interface AlertModalAction {
  label: string
  onPress?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
}

export interface AlertModalProps {
  visible: boolean
  onClose: () => void
  title?: string
  message: string
  variant?: AlertVariant
  /** Se informado, renderiza botões customizados. Caso contrário, um único "OK". */
  actions?: AlertModalAction[]
  /** Fecha ao tocar fora da caixa. Default: true. */
  dismissOnBackdropPress?: boolean
  /** Se true, fecha automaticamente após `autoHideMs` ms. */
  autoHideMs?: number
}

const VARIANT_CONFIG: Record<AlertVariant, { Icon: typeof AlertCircle; color: string; bg: string; defaultTitle: string }> = {
  error: { Icon: AlertCircle, color: colors.error, bg: colors.errorLight, defaultTitle: 'Ops!' },
  warning: { Icon: AlertTriangle, color: colors.warning, bg: colors.warningLight, defaultTitle: 'Atenção' },
  success: { Icon: CheckCircle, color: colors.success, bg: colors.successLight, defaultTitle: 'Tudo certo!' },
  info: { Icon: Info, color: colors.info, bg: colors.infoLight, defaultTitle: 'Aviso' },
}

function AlertModalComponent({ visible, onClose, title, message, variant = 'error', actions, dismissOnBackdropPress = true, autoHideMs }: AlertModalProps) {
  const config = VARIANT_CONFIG[variant]

  useEffect(() => {
    if (!visible || !autoHideMs) return
    const id = setTimeout(onClose, autoHideMs)
    return () => clearTimeout(id)
  }, [visible, autoHideMs, onClose])

  const resolvedActions = useMemo<AlertModalAction[]>(() => {
    if (actions && actions.length > 0) return actions
    return [{ label: 'OK', onPress: onClose, variant: 'primary' }]
  }, [actions, onClose])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-xl"
          style={{ backgroundColor: colors.overlay }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={dismissOnBackdropPress ? onClose : undefined}
        >
          <motion.div
            className="w-full max-w-[360px] bg-surface rounded-xl px-xxl py-xxl flex flex-col items-center shadow-xl"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.26, ease: [0.34, 1.56, 0.64, 1] }}
            onClick={e => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-pill flex items-center justify-center mb-md" style={{ backgroundColor: config.bg }}>
              <config.Icon size={26} color={config.color} />
            </div>

            <h3 className="text-h3 font-semibold text-text-primary mb-xs text-center">{title ?? config.defaultTitle}</h3>
            <p className="text-body text-text-secondary text-center mb-xl">{message}</p>

            <div className={cn('flex w-full gap-sm', resolvedActions.length === 1 && 'justify-center')}>
              {resolvedActions.map((action, idx) => {
                const isPrimary = action.variant === 'primary' || !action.variant
                const isDanger = action.variant === 'danger'
                const isGhost = action.variant === 'ghost'
                const isSecondary = action.variant === 'secondary'

                return (
                  <button
                    key={`${action.label}-${idx}`}
                    type="button"
                    onClick={() => {
                      action.onPress?.()
                      onClose()
                    }}
                    style={isPrimary ? { backgroundColor: config.color } : undefined}
                    className={cn(
                      'min-h-[46px] px-xl rounded-pill flex items-center justify-center text-button transition-transform active:scale-[0.97]',
                      resolvedActions.length > 1 && 'flex-1',
                      isDanger && 'bg-error text-white',
                      isSecondary && 'bg-surface-alt text-text-primary',
                      isGhost && 'bg-transparent text-text-primary',
                      isPrimary && 'text-text-on-primary',
                    )}
                  >
                    {action.label}
                  </button>
                )
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export const AlertModal = memo(AlertModalComponent)
export default AlertModal

export interface UseAlertState {
  visible: boolean
  title?: string
  message: string
  variant: AlertVariant
  actions?: AlertModalAction[]
  autoHideMs?: number
}

export function useAlertModal() {
  const [state, setState] = useState<UseAlertState>({ visible: false, message: '', variant: 'error' })

  const show = useCallback((opts: Omit<UseAlertState, 'visible'>) => setState({ ...opts, visible: true }), [])
  const hide = useCallback(() => setState(prev => ({ ...prev, visible: false })), [])

  const showError = useCallback(
    (message: string, title?: string, opts?: Partial<UseAlertState>) => show({ message, title, variant: 'error', autoHideMs: 2400, ...opts }),
    [show],
  )
  const showWarning = useCallback(
    (message: string, title?: string, opts?: Partial<UseAlertState>) => show({ message, title, variant: 'warning', ...opts }),
    [show],
  )
  const showSuccess = useCallback(
    (message: string, title?: string, opts?: Partial<UseAlertState>) => show({ message, title, variant: 'success', autoHideMs: 2000, ...opts }),
    [show],
  )
  const showInfo = useCallback(
    (message: string, title?: string, opts?: Partial<UseAlertState>) => show({ message, title, variant: 'info', ...opts }),
    [show],
  )

  return { state, hide, show, showError, showWarning, showSuccess, showInfo }
}
