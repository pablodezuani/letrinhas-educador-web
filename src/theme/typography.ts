/**
 * Pacifico → branding (logo, títulos especiais) — mantido para os poucos usos pontuais.
 * Inter    → fonte funcional (todo o resto), identidade Nocturne. Carregada via next/font.
 */
export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const

export const fontFamily = {
  display: "'Pacifico', cursive",
  regular: "'Inter', sans-serif",
  medium: "'Inter', sans-serif",
  semibold: "'Inter', sans-serif",
  bold: "'Inter', sans-serif",
} as const

export interface TypographyStyle {
  fontFamily: string
  fontWeight: number
  fontSize: number
  lineHeight: number
  letterSpacing?: number
  textTransform?: 'uppercase'
}

export const typography = {
  display: {
    fontFamily: fontFamily.display,
    fontWeight: fontWeight.regular,
    fontSize: 40,
    lineHeight: 48,
    letterSpacing: 0.5,
  },
  h1: {
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.2,
  },
  h2: {
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    fontSize: 22,
    lineHeight: 28,
  },
  h3: {
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    fontSize: 18,
    lineHeight: 24,
  },
  subtitle: {
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    fontSize: 16,
    lineHeight: 22,
  },
  body: {
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  bodyStrong: {
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    fontSize: 15,
    lineHeight: 22,
  },
  bodySmall: {
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.regular,
    fontSize: 13,
    lineHeight: 20,
  },
  caption: {
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    fontSize: 12,
    lineHeight: 16,
  },
  label: {
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  button: {
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.3,
  },
  buttonSmall: {
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.2,
  },
} as const satisfies Record<string, TypographyStyle>

export type TypographyToken = keyof typeof typography
export default typography
