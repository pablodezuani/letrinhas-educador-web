'use client'

import { memo, useCallback, type ComponentType } from 'react'
import { motion } from 'framer-motion'
import { Camera, Leaf, Moon, Music, PauseCircle, RefreshCw, Volume2 } from 'lucide-react'

import { AlertModal, ScreenHeader, useAlertModal } from '@/components/common'
import { useSettings } from '@/hooks'
import type { AppSettings } from '@/contexts/SettingsContext'
import { colors } from '@/theme'

interface SettingRowProps {
  Icon: ComponentType<{ size?: number; color?: string }>
  iconColor: string
  iconBg: string
  title: string
  description?: string
  value: boolean
  onToggle?: () => void
  last?: boolean
}

const SettingRow = memo(function SettingRow({ Icon, iconColor, iconBg, title, description, value, onToggle, last }: SettingRowProps) {
  const locked = !onToggle
  return (
    <div className={`flex items-center gap-md px-lg py-md ${!last ? 'border-b border-divider' : ''} ${locked ? 'opacity-60' : ''}`}>
      <div className="w-9 h-9 rounded-pill flex items-center justify-center shrink-0" style={{ backgroundColor: iconBg }}>
        <Icon size={17} color={iconColor} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-body text-text-primary">{title}</p>
        {description ? <p className="text-caption text-text-muted mt-0.5">{description}</p> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={title}
        aria-disabled={locked}
        onClick={onToggle}
        disabled={locked}
        className="w-[38px] h-[22px] rounded-pill shrink-0 relative transition-colors disabled:cursor-default"
        style={{ backgroundColor: value ? colors.primary : colors.divider }}
      >
        <span className="absolute top-0.5 w-[18px] h-[18px] rounded-pill bg-white shadow-sm transition-[left]" style={{ left: value ? 18 : 2 }} />
      </button>
    </div>
  )
})

type ToggleKey = {
  [K in keyof AppSettings]: AppSettings[K] extends boolean ? K : never
}[keyof AppSettings]

export default function SettingsScreen() {
  const { settings, toggle, reset } = useSettings()
  const alert = useAlertModal()

  const handleToggle = useCallback((key: ToggleKey) => () => toggle(key), [toggle])

  const handleReset = useCallback(() => {
    alert.show({
      title: 'Restaurar padrões',
      message: 'Isso vai restaurar todas as configurações para os valores iniciais. Deseja continuar?',
      variant: 'warning',
      actions: [
        {
          label: 'Restaurar',
          variant: 'primary',
          onPress: () => {
            reset()
            alert.showSuccess('Configurações restauradas!', 'Pronto')
          },
        },
        { label: 'Cancelar', variant: 'ghost' },
      ],
    })
  }, [alert, reset])

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <ScreenHeader title="Configurações" subtitle="Ajuste a experiência do app" />

      <div className="flex-1 overflow-y-auto px-xl pb-huge flex flex-col gap-lg">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-col gap-sm">
          <p className="text-label text-text-muted ml-xs">Aparência</p>
          <div className="bg-surface rounded-lg overflow-hidden">
            <SettingRow Icon={Moon} iconColor={colors.primaryLight} iconBg={colors.primarySoft} title="Modo escuro" description="Ativado por padrão na nova identidade" value last />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col gap-sm">
          <p className="text-label text-text-muted ml-xs">Notificações</p>
          <div className="bg-surface rounded-lg overflow-hidden">
            <SettingRow Icon={Music} iconColor={colors.accent} iconBg={colors.accentSoft} title="Notificações" description="Receba avisos de atividades e conquistas" value={settings.notificationsEnabled} onToggle={handleToggle('notificationsEnabled')} />
            <SettingRow
              Icon={Music}
              iconColor={colors.accent}
              iconBg={colors.accentSoft}
              title="Som de notificação"
              description="Tocar som ao chegar uma notificação"
              value={settings.notificationSound && settings.notificationsEnabled}
              onToggle={handleToggle('notificationSound')}
              last
            />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }} className="flex flex-col gap-sm">
          <p className="text-label text-text-muted ml-xs">Acessibilidade</p>
          <div className="bg-surface rounded-lg overflow-hidden">
            <SettingRow
              Icon={Leaf}
              iconColor={colors.success}
              iconBg={colors.successLight}
              title="Modo baixo estímulo"
              description="Reduz cores fortes, gradientes e celebrações. Recomendado para crianças com sensibilidade sensorial."
              value={settings.lowStimulationMode}
              onToggle={handleToggle('lowStimulationMode')}
            />
            <SettingRow
              Icon={PauseCircle}
              iconColor={colors.info}
              iconBg={colors.infoLight}
              title="Reduzir animações"
              description="Diminui ou desativa transições e movimentos da interface"
              value={settings.reduceMotion}
              onToggle={handleToggle('reduceMotion')}
              last
            />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-col gap-sm">
          <p className="text-label text-text-muted ml-xs">Permissões</p>
          <div className="bg-surface rounded-lg overflow-hidden">
            <SettingRow Icon={Volume2} iconColor={colors.secondary} iconBg={colors.secondarySoft} title="Som do app" description="Sons e feedback sonoro nos mini-jogos" value={settings.soundEnabled} onToggle={handleToggle('soundEnabled')} />
            <SettingRow Icon={Camera} iconColor={colors.primaryLight} iconBg={colors.primarySoft} title="Câmera" description="Permitir usar a câmera para foto da criança" value={settings.cameraEnabled} onToggle={handleToggle('cameraEnabled')} last />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <button
            type="button"
            onClick={handleReset}
            aria-label="Restaurar configurações padrão"
            className="w-full flex items-center justify-center gap-sm border border-error text-error rounded-pill h-11 mt-xs"
          >
            <RefreshCw size={16} />
            <span className="text-button-small">Restaurar padrões</span>
          </button>
        </motion.div>
      </div>

      <AlertModal visible={alert.state.visible} onClose={alert.hide} title={alert.state.title} message={alert.state.message} variant={alert.state.variant} actions={alert.state.actions} autoHideMs={alert.state.autoHideMs} />
    </div>
  )
}
