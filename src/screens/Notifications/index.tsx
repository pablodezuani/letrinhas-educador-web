import { memo, useCallback, useMemo, useState, type ComponentType } from 'react'
import { motion } from 'framer-motion'
import { AlarmClock, BellOff, CheckCheck, Info, Lightbulb, Trophy } from 'lucide-react'

import { ScreenHeader } from '@/components/common'
import { colors, gradients } from '@/theme'

type NotificationType = 'achievement' | 'reminder' | 'tip' | 'system'

interface NotificationItem {
  id: string
  type: NotificationType
  title: string
  message: string
  time: string
  read: boolean
}

interface Filter {
  id: 'all' | NotificationType
  label: string
}

const FILTERS: readonly Filter[] = [
  { id: 'all', label: 'Todas' },
  { id: 'achievement', label: 'Conquistas' },
  { id: 'reminder', label: 'Lembretes' },
  { id: 'tip', label: 'Dicas' },
  { id: 'system', label: 'Sistema' },
]

const TYPE_META: Record<NotificationType, { Icon: ComponentType<{ size?: number; color?: string }>; color: string; bg: string }> = {
  achievement: { Icon: Trophy, color: colors.warning, bg: colors.warningLight },
  reminder: { Icon: AlarmClock, color: colors.accent, bg: '#FBEFE4' },
  tip: { Icon: Lightbulb, color: colors.info, bg: colors.infoLight },
  system: { Icon: Info, color: colors.primary, bg: colors.infoLight },
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: '1', type: 'achievement', title: 'Mari completou 12 atividades!', message: 'Ela acertou o Jogo das Vogais com 95% de pontuação.', time: 'Agora', read: false },
  { id: '2', type: 'reminder', title: 'Consulta amanhã', message: 'Terapia de fonoaudiologia às 09:00 com Mari.', time: 'Há 2h', read: false },
  { id: '3', type: 'tip', title: 'Dica para rotina', message: 'Que tal tentar o Jogo de Formação de Palavras com o Lu hoje?', time: 'Há 5h', read: false },
  { id: '4', type: 'achievement', title: 'Nova conquista desbloqueada', message: 'Ana Clara recebeu "Primeira apresentação".', time: 'Ontem', read: true },
  { id: '5', type: 'system', title: 'App atualizado', message: 'Melhorias no desempenho e novos mini-jogos chegando em breve.', time: '2 dias atrás', read: true },
  { id: '6', type: 'reminder', title: 'Hora de brincar', message: 'Faz 3 dias que o Lu não completa uma atividade.', time: '3 dias atrás', read: true },
]

const NotificationRow = memo(function NotificationRow({ item, onPress }: { item: NotificationItem; onPress: (id: string) => void }) {
  const meta = TYPE_META[item.type]
  return (
    <button
      type="button"
      onClick={() => onPress(item.id)}
      aria-label={`Notificação: ${item.title}. ${item.read ? 'Lida' : 'Não lida'}.`}
      className={`w-full flex gap-md rounded-lg p-md shadow-sm text-left ${item.read ? 'bg-surface' : 'bg-info-light border border-info'}`}
    >
      <div className="w-11 h-11 rounded-pill flex items-center justify-center shrink-0" style={{ backgroundColor: meta.bg }}>
        <meta.Icon size={20} color={meta.color} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-sm">
          <p className="text-subtitle text-text-primary truncate flex-1">{item.title}</p>
          {!item.read && <span className="w-2.5 h-2.5 rounded-pill bg-error shrink-0" />}
        </div>
        <p className="text-body-small text-text-secondary line-clamp-2">{item.message}</p>
        <p className="text-caption text-text-muted mt-0.5">{item.time}</p>
      </div>
    </button>
  )
})

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS)
  const [activeFilter, setActiveFilter] = useState<Filter['id']>('all')

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications])

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return notifications
    return notifications.filter(n => n.type === activeFilter)
  }, [notifications, activeFilter])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const activeFilterLabel = useMemo(() => FILTERS.find(f => f.id === activeFilter)?.label ?? 'Todas', [activeFilter])

  return (
    <div className="min-h-dvh flex flex-col" style={{ backgroundImage: `linear-gradient(180deg, ${gradients.soft.join(', ')})` }}>
      <ScreenHeader
        title="Notificações"
        subtitle={unreadCount > 0 ? `${unreadCount} ${unreadCount === 1 ? 'não lida' : 'não lidas'}` : 'Tudo em dia'}
        rightAction={
          unreadCount > 0 ? (
            <button type="button" onClick={markAllAsRead} aria-label="Marcar todas como lidas" className="w-9 h-9 rounded-pill bg-white/22 flex items-center justify-center">
              <CheckCheck size={18} color="white" />
            </button>
          ) : undefined
        }
      />

      <div className="py-md overflow-x-auto">
        <div className="flex gap-sm px-xl w-max">
          {FILTERS.map(f => {
            const active = f.id === activeFilter
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                aria-pressed={active}
                className={`px-3.5 py-sm rounded-pill border whitespace-nowrap text-caption font-semibold ${active ? 'bg-primary border-primary text-white' : 'bg-surface border-border text-text-secondary'}`}
              >
                {f.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-xl pb-huge flex flex-col gap-sm">
        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="flex flex-col items-center justify-center gap-sm pt-[72px] px-xl">
            <div className="w-20 h-20 rounded-pill bg-surface shadow-sm flex items-center justify-center mb-md">
              <BellOff size={40} color={colors.primary} />
            </div>
            <p className="text-h3 text-text-primary">Nada por aqui</p>
            <p className="text-body text-text-secondary text-center">Você não tem notificações {activeFilterLabel.toLowerCase() !== 'todas' ? `em "${activeFilterLabel}"` : 'no momento'}.</p>
          </motion.div>
        ) : (
          filtered.map(item => <NotificationRow key={item.id} item={item} onPress={markAsRead} />)
        )}
      </div>
    </div>
  )
}
