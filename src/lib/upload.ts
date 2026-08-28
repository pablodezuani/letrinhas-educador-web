import { upload } from '@vercel/blob/client'
import type { AttachmentKind } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://letrinhas-encantadas-back.vercel.app'

export function kindFromMime(mime: string): AttachmentKind {
  if (mime.startsWith('image/')) return 'IMAGE'
  if (mime.startsWith('video/')) return 'VIDEO'
  return 'DOCUMENT'
}

export const MAX_SIZE_BYTES: Record<AttachmentKind, number> = {
  IMAGE: 8 * 1024 * 1024,
  VIDEO: 100 * 1024 * 1024,
  DOCUMENT: 15 * 1024 * 1024,
}

interface UploadAttachmentResult {
  kind: AttachmentKind
  url: string
  fileName: string
  mimeType: string
  size: number
}

/**
 * Sobe um anexo de mensagem direto pro Vercel Blob usando um token de vida curta
 * emitido pelo backend (POST /uploads/token) — o arquivo nunca passa pelo corpo
 * da função serverless do Express, que teria o limite de tamanho da Vercel.
 */
export async function uploadAttachment(
  childId: string,
  file: File,
  token: string,
  onProgress?: (percentage: number) => void,
  abortSignal?: AbortSignal,
): Promise<UploadAttachmentResult> {
  const kind = kindFromMime(file.type)

  if (file.size > MAX_SIZE_BYTES[kind]) {
    throw new Error(`Arquivo muito grande (máx. ${Math.round(MAX_SIZE_BYTES[kind] / 1024 / 1024)}MB para este tipo).`)
  }

  const blob = await upload(`messages/${childId}/${Date.now()}-${file.name}`, file, {
    access: 'public',
    handleUploadUrl: `${API_URL}/uploads/token`,
    clientPayload: JSON.stringify({ childId, kind }),
    headers: { Authorization: `Bearer ${token}` },
    contentType: file.type,
    abortSignal,
    onUploadProgress: evt => onProgress?.(evt.percentage),
  })

  return { kind, url: blob.url, fileName: file.name, mimeType: file.type, size: file.size }
}
