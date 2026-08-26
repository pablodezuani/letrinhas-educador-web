/**
 * Sombras (CSS box-shadow). No fundo escuro, um hairline sutil + sombra ambiente
 * substitui a sombra pura de tinta usada no tema claro (senão a elevação some no preto).
 */
export const shadows = {
  none: 'none',
  sm: '0 0 0 1px #3f424d',
  md: '0 0 0 1px #595d6c, 0 6px 18px rgba(0, 0, 0, 0.55)',
  lg: '0 0 0 1px #9397ab, 0 16px 40px rgba(0, 0, 0, 0.65)',
  xl: '0 0 0 1px #9397ab, 0 20px 60px rgba(0, 0, 0, 0.6)',
} as const

export type ShadowToken = keyof typeof shadows
export default shadows
