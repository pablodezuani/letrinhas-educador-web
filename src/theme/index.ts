/**
 * Reexporta todos os tokens do design system. Importe daqui:
 *
 *   import { colors, spacing, typography } from '@/theme'
 */
import { colors } from './colors'
import { gradients } from './gradients'
import { fontFamily, fontWeight, typography } from './typography'
import { spacing } from './spacing'
import { radius } from './radius'
import { shadows } from './shadows'
import { animation, easing } from './animation'

export { colors } from './colors'
export { gradients, gradientCss } from './gradients'
export { fontFamily, fontWeight, typography } from './typography'
export { spacing } from './spacing'
export { radius } from './radius'
export { shadows } from './shadows'
export { animation, easing } from './animation'

export type { ColorToken } from './colors'
export type { GradientToken } from './gradients'
export type { TypographyToken } from './typography'
export type { SpacingToken } from './spacing'
export type { RadiusToken } from './radius'
export type { ShadowToken } from './shadows'
export type { AnimationToken } from './animation'

export const theme = {
  colors,
  gradients,
  fontFamily,
  fontWeight,
  typography,
  spacing,
  radius,
  shadows,
  animation,
  easing,
} as const

export type Theme = typeof theme
export default theme
