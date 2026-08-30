/**
 * Wrapper compartilhado para `window.speechSynthesis` — extraído do
 * `VowelsGame.tsx` (que tinha essa lógica inline) para reuso nos outros
 * jogos (`ReadingGame`, `WordFormationGame`, `PhraseBuilder`).
 */
export function speak(text: string, opts: { rate?: number; pitch?: number } = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'pt-BR'
  utterance.rate = opts.rate ?? 1
  utterance.pitch = opts.pitch ?? 1
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}

export default speak
