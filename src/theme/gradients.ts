/**
 * Tuplas de cores para gradientes. Em modo "baixo estímulo" (lowStimulationMode)
 * o ThemeContext acha por bem achatar para a primeira cor da tupla.
 * Use `gradientCss(token)` para obter a string CSS `linear-gradient(...)`.
 */
export const gradients = {
  primary: ['#305F72', '#567B8B'],
  primaryDeep: ['#1F4352', '#305F72'],
  secondary: ['#CBAACB', '#E2CDE2'],
  accent: ['#F5A97C', '#FAC7A6'],
  success: ['#7FB77E', '#A8CEA7'],
  warning: ['#E9B44C', '#F3CC7F'],
  error: ['#D9756B', '#E89990'],
  info: ['#6DAED9', '#A4CDE5'],
  soft: ['#FFF8F4', '#F6EEE6'],
  cream: ['#FFFFFF', '#FFF8F4'],
  boy: ['#DBEDF7', '#B9D9EA', '#6DAED9'],
  girl: ['#F7E0E8', '#EEBFCD', '#E8A7BD'],
  sunset: ['#FAC7A6', '#E8A7BD'],
  ocean: ['#B9D9EA', '#567B8B'],
  candy: ['#CBAACB', '#F5A97C'],
} as const satisfies Record<string, readonly string[]>

export type GradientToken = keyof typeof gradients

/** Resolve a gradient token (or raw color array) into a CSS `linear-gradient()` string. */
export function gradientCss(colorsOrToken: GradientToken | readonly string[], angle = 135): string {
  const stops = Array.isArray(colorsOrToken) ? colorsOrToken : gradients[colorsOrToken as GradientToken]
  return `linear-gradient(${angle}deg, ${stops.join(', ')})`
}

export default gradients
