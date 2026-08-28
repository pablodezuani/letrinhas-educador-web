'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, MessageSquare, Video } from 'lucide-react'
import { api } from '@/services/api'
import { Screen } from '@/components/ui/Screen'
import { ScreenHeader } from '@/components/common'
import { Loading } from '@/components/feedback/Loading'
import { EmptyState } from '@/components/feedback/EmptyState'
import type { Conversation, AttachmentKind } from '@/lib/types'
import { colors } from '@/theme'

const ATTACHMENT_LABEL: Record<AttachmentKind, string> = { IMAGE: 'Imagem', VIDEO: 'Vídeo', DOCUMENT: 'Documento' }
const ATTACHMENT_ICON: Record<AttachmentKind, typeof FileText> = { IMAGE: FileText, VIDEO: Video, DOCUMENT: FileText }

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diffMs / 60000)
  if (mins < 1) return 'agora'
  if (mins < 60) return `${mins}min`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h`
  return `${Math.round(hours / 24)}d`
}

export default function MessagesScreen() {
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/conversations')
      .then(res => setConversations(res.data))
      .catch(() => setConversations([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Screen background="cream" scroll>
      <ScreenHeader title="Mensagens" subtitle="Conversas com as educadoras" onBack={() => router.push('/')} />

      {loading ? (
        <Loading variant="inline" message="Carregando conversas..." />
      ) : conversations.length === 0 ? (
        <EmptyState
          icon={<MessageSquare size={36} color={colors.textMuted} />}
          title="Nenhuma conversa ainda"
          description="Quando uma criança tiver unidade e educadora responsável definidas, a conversa aparece aqui."
        />
      ) : (
        <div className="flex flex-col gap-sm pb-xl">
          {conversations.map(conv => {
            const attachment = conv.lastMessage?.attachment
            const AttachmentIcon = attachment ? ATTACHMENT_ICON[attachment.kind] : null

            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => router.push(`/messages/${conv.child.id}`)}
                className="flex items-center gap-md bg-surface rounded-lg p-md text-left transition-transform active:scale-[0.99]"
              >
                {conv.child.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={conv.child.photo} alt="" className="w-12 h-12 rounded-md object-cover shrink-0" />
                ) : (
                  <div
                    className="w-12 h-12 rounded-md flex items-center justify-center shrink-0 text-[22px]"
                    style={{ backgroundColor: conv.child.lightColor ?? colors.primarySoft }}
                  >
                    {conv.child.emoji ?? conv.child.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-sm">
                    <p className="text-body-small font-medium text-text-primary truncate flex-1">{conv.child.name}</p>
                    {conv.lastMessage && <span className="text-label text-text-muted shrink-0">{timeAgo(conv.lastMessage.createdAt)}</span>}
                  </div>
                  <p
                    className="text-label truncate mt-0.5 flex items-center gap-1"
                    style={{ color: conv.unreadCount > 0 ? colors.textPrimary : colors.textMuted, fontWeight: conv.unreadCount > 0 ? 600 : 400 }}
                  >
                    {AttachmentIcon && <AttachmentIcon size={11} className="shrink-0" />}
                    {conv.lastMessage ? conv.lastMessage.body || (attachment ? ATTACHMENT_LABEL[attachment.kind] : '') : 'Nenhuma mensagem ainda'}
                  </p>
                </div>

                {conv.unreadCount > 0 && (
                  <span
                    className="min-w-[18px] h-[18px] px-1 rounded-pill text-[10px] font-bold flex items-center justify-center shrink-0"
                    style={{ backgroundColor: colors.accent, color: colors.textOnAccent }}
                  >
                    {conv.unreadCount}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </Screen>
  )
}
