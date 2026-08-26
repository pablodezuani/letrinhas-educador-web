/**
 * Tuplas de cores para gradientes. Em modo "baixo estímulo" (lowStimulationMode)
 * o ThemeContext acha por bem achatar para a primeira cor da tupla.
 * Use `gradientCss(token)` para obter a string CSS `linear-gradient(...)`.
 */
export const gradients = {
  primary: ['#9184d9', '#b5abfc'],
  primaryDeep: ['#796cbf', '#9184d9'],
  secondary: ['#a7a1db', '#d2cefd'],
  accent: ['#f0c368', '#f6d692'],
  success: ['#8fcb92', '#a8d9ab'],
  warning: ['#f0c368', '#f6d692'],
  error: ['#e38a7e', '#eba89f'],
  info: ['#7ebbe0', '#a8d0ea'],
  soft: ['#161826', '#232532'],
  cream: ['#232532', '#0d0e16'],
  boy: ['#3a4a5a', '#5a7a95', '#7ebbe0'],
  girl: ['#4a3a45', '#8a5a75', '#e6a0c4'],
  sunset: ['#f6d692', '#e6a0c4'],
  ocean: ['#7ebbe0', '#796cbf'],
  candy: ['#a7a1db', '#f0c368'],
} as const satisfies Record<string, readonly string[]>

export type GradientToken = keyof typeof gradients

/** Resolve a gradient token (or raw color array) into a CSS `linear-gradient()` string. */
export function gradientCss(colorsOrToken: GradientToken | readonly string[], angle = 135): string {
  const stops = Array.isArray(colorsOrToken) ? colorsOrToken : gradients[colorsOrToken as GradientToken]
  return `linear-gradient(${angle}deg, ${stops.join(', ')})`
}

export default gradients
