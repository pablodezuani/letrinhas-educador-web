'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { FileText, Loader2, Paperclip, Send, Video, X } from 'lucide-react'
import { api } from '@/services/api'
import { useAuth } from '@/hooks'
import { uploadAttachment, kindFromMime } from '@/lib/upload'
import { Screen } from '@/components/ui/Screen'
import { ScreenHeader } from '@/components/common'
import { Loading } from '@/components/feedback/Loading'
import type { Message, Attachment } from '@/lib/types'
import { colors } from '@/theme'

interface ConversationContext {
  child: {
    id: string
    name: string
    photo?: string | null
    school?: { id: string; name: string } | null
  }
}

function AttachmentBubble({ attachment }: { attachment?: Attachment | null }) {
  if (!attachment) return null

  if (attachment.kind === 'IMAGE') {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={attachment.url} alt={attachment.fileName} className="rounded-md max-w-full max-h-64 object-cover mb-1.5" />
  }
  if (attachment.kind === 'VIDEO') {
    return <video src={attachment.url} controls className="rounded-md max-w-full max-h-64 mb-1.5" />
  }
  return (
    <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-sm px-sm py-2 rounded-md mb-1.5 bg-black/10">
      <FileText size={16} className="shrink-0" />
      <span className="text-caption font-medium truncate">{attachment.fileName}</span>
    </a>
  )
}

export default function MessageThreadScreen() {
  const { childId } = useParams<{ childId: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const [context, setContext] = useState<ConversationContext | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [body, setBody] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [uploadPct, setUploadPct] = useState<number | null>(null)
  const [sending, setSending] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!childId) return

    Promise.all([api.get(`/conversations/${childId}`), api.get(`/conversations/${childId}/messages`)])
      .then(([ctxRes, msgRes]) => {
        setContext(ctxRes.data)
        setMessages(msgRes.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))

    api.patch(`/conversations/${childId}/read`).catch(() => {})
  }, [childId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  async function handleSend() {
    if ((!body.trim() && !file) || sending) return
    setSending(true)

    try {
      let attachment
      if (file) {
        attachment = await uploadAttachment(childId, file, user.token, setUploadPct)
      }

      const res = await api.post('/messages', { childId, body: body.trim() || undefined, attachment })
      setMessages(prev => [...prev, res.data])
      setBody('')
      setFile(null)
      setUploadPct(null)
    } catch {
      // Mantém o texto/arquivo pra o usuário tentar de novo
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <Screen background="cream">
        <Loading variant="screen" message="Carregando conversa..." />
      </Screen>
    )
  }

  let lastDay = ''

  return (
    <Screen background="cream" padded={false} className="!px-0">
      <div className="px-xl">
        <ScreenHeader
          title={context?.child.name ?? 'Conversa'}
          subtitle={context?.child.school ? context.child.school.name : undefined}
          onBack={() => router.push('/messages')}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-xl flex flex-col gap-1">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-xxl">
            <p className="text-body-small font-medium text-text-primary">Nenhuma mensagem ainda</p>
            <p className="text-caption text-text-muted mt-1 max-w-[260px]">Envie uma mensagem, foto, vídeo ou documento para a educadora.</p>
          </div>
        ) : (
          messages.map(msg => {
            const mine = msg.senderId === user.id
            const day = new Date(msg.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })
            const showDay = day !== lastDay
            lastDay = day

            return (
              <div key={msg.id}>
                {showDay && (
                  <div className="flex justify-center my-sm">
                    <span className="text-label px-sm py-0.5 rounded-pill bg-surface-alt text-text-muted">{day}</span>
                  </div>
                )}
                <div className={`flex ${mine ? 'justify-end' : 'justify-start'} mb-1.5`}>
                  <div className="max-w-[78%]">
                    {!mine && <p className="text-label text-text-muted mb-0.5 px-1">{msg.sender.name}</p>}
                    <div
                      className="rounded-lg px-3.5 py-2.5"
                      style={
                        mine
                          ? { backgroundColor: colors.primary, color: colors.textOnPrimary, borderBottomRightRadius: 4 }
                          : { backgroundColor: colors.surface, color: colors.textPrimary, borderBottomLeftRadius: 4 }
                      }
                    >
                      <AttachmentBubble attachment={msg.attachment} />
                      {msg.body && <p className="text-body-small leading-relaxed whitespace-pre-wrap break-words">{msg.body}</p>}
                    </div>
                    <p className={`text-label text-text-disabled mt-0.5 px-1 ${mine ? 'text-right' : ''}`}>
                      {new Date(msg.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-xl pt-sm pb-[calc(env(safe-area-inset-bottom)+16px)]">
        {file && (
          <div className="flex items-center gap-sm px-md py-2 mb-sm rounded-md bg-surface-alt">
            {kindFromMime(file.type) === 'VIDEO' ? <Video size={15} className="text-text-secondary shrink-0" /> : <FileText size={15} className="text-text-secondary shrink-0" />}
            <span className="text-caption font-medium text-text-primary truncate flex-1">{file.name}</span>
            {uploadPct !== null ? (
              <span className="text-label text-text-muted shrink-0">{Math.round(uploadPct)}%</span>
            ) : (
              <button type="button" onClick={() => setFile(null)} className="shrink-0 text-text-muted">
                <X size={14} />
              </button>
            )}
          </div>
        )}

        <div className="flex items-end gap-sm">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
            className="hidden"
            onChange={e => setFile(e.target.files?.[0] ?? null)}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={sending}
            className="w-11 h-11 rounded-pill bg-surface border border-border flex items-center justify-center shrink-0 disabled:opacity-50"
          >
            <Paperclip size={16} className="text-text-secondary" />
          </button>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Escreva uma mensagem..."
            rows={1}
            className="flex-1 resize-none rounded-md bg-surface-alt border border-divider px-md py-sm text-body-small text-text-primary outline-none focus-visible:border-primary"
            style={{ maxHeight: 96 }}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={(!body.trim() && !file) || sending}
            className="w-11 h-11 rounded-pill bg-primary flex items-center justify-center shrink-0 disabled:opacity-40"
          >
            {sending ? <Loader2 size={16} className="animate-spin" color={colors.textOnPrimary} /> : <Send size={16} color={colors.textOnPrimary} />}
          </button>
        </div>
      </div>
    </Screen>
  )
}
