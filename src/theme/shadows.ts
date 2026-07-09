/** Sombras (CSS box-shadow). Opacidade moderada para preservar a sensação calmante do app. */
const create = (offsetY: number, opacity: number, blur: number): string =>
  `0 ${offsetY}px ${blur}px rgba(0, 0, 0, ${opacity})`

export const shadows = {
  none: 'none',
  sm: create(1, 0.06, 2),
  md: create(2, 0.1, 4),
  lg: create(4, 0.14, 8),
  xl: create(8, 0.2, 16),
} as const

export type ShadowToken = keyof typeof shadows
export default shadows
