/**
 * Toca um efeito sonoro curto (ex.: `assets/sounds/correct.mp3`) via
 * `<audio>` do navegador. Erros de política de autoplay (usuário ainda não
 * interagiu com a página) são silenciosamente ignorados — o efeito sonoro é
 * só um reforço, nunca algo bloqueante para o jogo.
 */
export function playSound(src: string): void {
  if (typeof window === 'undefined') return
  try {
    const audio = new Audio(src)
    void audio.play().catch(() => {})
  } catch {
    // Ignora — ambiente sem suporte a Audio (SSR, navegador antigo, etc).
  }
}

export default playSound
