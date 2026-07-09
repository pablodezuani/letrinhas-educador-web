import { memo, useCallback, type ComponentType } from 'react'
import { motion } from 'framer-motion'
import { Camera, Leaf, Moon, Music, PauseCircle, RefreshCw, Volume2 } from 'lucide-react'

import { AlertModal, ScreenHeader, useAlertModal } from '@/components/common'
import { useSettings } from '@/hooks'
import type { AppSettings } from '@/contexts/SettingsContext'
import { colors, gradients } from '@/theme'

interface SettingRowProps {
  Icon: ComponentType<{ size?: number; color?: string }>
  iconColor: string
  iconBg: string
  title: string
  description?: string
  value: boolean
  onToggle: () => void
  last?: boolean
}

const SettingRow = memo(function SettingRow({ Icon, iconColor, iconBg, title, description, value, onToggle, last }: SettingRowProps) {
  return (
    <div className={`flex items-center gap-md px-lg py-md ${!last ? 'border-b border-divider' : ''}`}>
      <div className="w-10 h-10 rounded-pill flex items-center justify-center shrink-0" style={{ backgroundColor: iconBg }}>
        <Icon size={20} color={iconColor} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-subtitle text-text-primary">{title}</p>
        {description ? <p className="text-caption text-text-secondary mt-0.5">{description}</p> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={title}
        onClick={onToggle}
        className="w-[46px] h-[26px] rounded-pill shrink-0 relative transition-colors"
        style={{ backgroundColor: value ? colors.primaryLight : colors.border }}
      >
        <span className="absolute top-0.5 w-[22px] h-[22px] rounded-pill bg-white shadow-sm transition-[left]" style={{ left: value ? 22 : 2 }} />
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
    <div className="min-h-dvh flex flex-col" style={{ backgroundImage: `linear-gradient(180deg, ${gradients.soft.join(', ')})` }}>
      <ScreenHeader title="Configurações" subtitle="Ajuste a experiência do app" />

      <div className="flex-1 overflow-y-auto p-xl pb-huge">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <p className="text-label text-text-secondary ml-xs mb-sm mt-md">Aparência</p>
          <div className="bg-surface rounded-lg overflow-hidden shadow-sm">
            <SettingRow Icon={Moon} iconColor={colors.primary} iconBg={colors.infoLight} title="Modo escuro" description="Interface com fundo escuro para reduzir o brilho" value={settings.darkMode} onToggle={handleToggle('darkMode')} last />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <p className="text-label text-text-secondary ml-xs mb-sm mt-md">Notificações</p>
          <div className="bg-surface rounded-lg overflow-hidden shadow-sm">
            <SettingRow Icon={Music} iconColor={colors.accent} iconBg="#FBEFE4" title="Notificações" description="Receba avisos de atividades e conquistas" value={settings.notificationsEnabled} onToggle={handleToggle('notificationsEnabled')} />
            <SettingRow
              Icon={Music}
              iconColor={colors.accent}
              iconBg="#FBEFE4"
              title="Som de notificação"
              description="Tocar som ao chegar uma notificação"
              value={settings.notificationSound && settings.notificationsEnabled}
              onToggle={handleToggle('notificationSound')}
              last
            />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}>
          <p className="text-label text-text-secondary ml-xs mb-sm mt-md">Acessibilidade</p>
          <div className="bg-surface rounded-lg overflow-hidden shadow-sm">
            <SettingRow
              Icon={Leaf}
              iconColor={colors.successDark}
              iconBg={colors.successLight}
              title="Modo baixo estímulo"
              description="Reduz cores fortes, gradientes e celebrações. Recomendado para crianças com sensibilidade sensorial."
              value={settings.lowStimulationMode}
              onToggle={handleToggle('lowStimulationMode')}
            />
            <SettingRow
              Icon={PauseCircle}
              iconColor={colors.infoDark}
              iconBg={colors.infoLight}
              title="Reduzir animações"
              description="Diminui ou desativa transições e movimentos da interface"
              value={settings.reduceMotion}
              onToggle={handleToggle('reduceMotion')}
              last
            />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <p className="text-label text-text-secondary ml-xs mb-sm mt-md">Permissões</p>
          <div className="bg-surface rounded-lg overflow-hidden shadow-sm">
            <SettingRow Icon={Volume2} iconColor={colors.secondaryDark} iconBg={colors.secondaryLight} title="Som do app" description="Sons e feedback sonoro nos mini-jogos" value={settings.soundEnabled} onToggle={handleToggle('soundEnabled')} />
            <SettingRow Icon={Camera} iconColor={colors.primary} iconBg={colors.infoLight} title="Câmera" description="Permitir usar a câmera para foto da criança" value={settings.cameraEnabled} onToggle={handleToggle('cameraEnabled')} last />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <button type="button" onClick={handleReset} aria-label="Restaurar configurações padrão" className="w-full flex items-center justify-center gap-sm bg-error-light rounded-lg py-3.5 mt-xl">
            <RefreshCw size={18} color={colors.error} />
            <span className="text-button text-error">Restaurar padrões</span>
          </button>
        </motion.div>
      </div>

      <AlertModal visible={alert.state.visible} onClose={alert.hide} title={alert.state.title} message={alert.state.message} variant={alert.state.variant} actions={alert.state.actions} autoHideMs={alert.state.autoHideMs} />
    </div>
  )
}
