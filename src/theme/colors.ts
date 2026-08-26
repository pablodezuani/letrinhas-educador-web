/**
 * Nocturne — paleta escura da nova identidade (menos brilho, sensibilidade sensorial).
 * Substitui a paleta clara original. Keep in sync with the `--color-*` variables in globals.css.
 */
export const colors = {
  // Base / neutros
  background: '#161826',
  surface: '#232532',
  surfaceAlt: '#2b2e3d',
  surfaceMuted: '#0d0e16',
  overlay: 'rgba(5, 6, 10, 0.72)',
  overlayLight: 'rgba(5, 6, 10, 0.4)',

  // Primárias (accent Nocturne — roxo) — marca, headers, ações
  primary: '#9184d9',
  primaryLight: '#b5abfc',
  primaryDark: '#796cbf',
  primarySoft: 'rgba(181, 171, 252, 0.18)',

  // Secundárias (accent-2 Nocturne) — realces, CTA secundário
  secondary: '#a7a1db',
  secondaryLight: '#d2cefd',
  secondaryDark: '#7972a9',
  secondarySoft: 'rgba(167, 161, 219, 0.18)',

  // Acento (dourado quente) — destaques, badges, conquistas
  accent: '#f0c368',
  accentLight: '#f6d692',
  accentDark: '#c99b3f',
  accentSoft: 'rgba(240, 195, 104, 0.18)',

  // Semânticos (suaves, com versão translúcida para fundos escuros)
  success: '#8fcb92',
  successLight: 'rgba(143, 203, 146, 0.18)',
  successDark: '#6ba86e',

  warning: '#f0c368',
  warningLight: 'rgba(240, 195, 104, 0.18)',
  warningDark: '#c99b3f',

  error: '#e38a7e',
  errorLight: 'rgba(227, 138, 126, 0.18)',
  errorDark: '#c96a5c',

  info: '#7ebbe0',
  infoLight: 'rgba(126, 187, 224, 0.18)',
  infoDark: '#5a97bd',

  // Texto
  textPrimary: '#e9e9ed',
  textSecondary: '#9397ab',
  textMuted: '#75798c',
  textDisabled: '#595d6c',
  textOnPrimary: '#161826',
  textOnSecondary: '#161826',
  textOnAccent: '#161826',

  // Bordas e divisores
  border: 'rgba(233, 233, 237, 0.12)',
  borderStrong: 'rgba(233, 233, 237, 0.24)',
  borderFocus: '#9184d9',
  divider: 'rgba(233, 233, 237, 0.08)',

  // Utilitários
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
  shadow: '#000000',

  // Níveis TEA (suavizados, sem alarmismo)
  teaLevel1: '#8fcb92',
  teaLevel1Light: 'rgba(143, 203, 146, 0.18)',
  teaLevel2: '#f0c368',
  teaLevel2Light: 'rgba(240, 195, 104, 0.18)',
  teaLevel3: '#e38a7e',
  teaLevel3Light: 'rgba(227, 138, 126, 0.18)',

  // Temas suaves de gênero (para personalização das crianças)
  boy: '#7ebbe0',
  boyLight: 'rgba(126, 187, 224, 0.18)',
  boyDark: '#5a97bd',
  girl: '#e6a0c4',
  girlLight: 'rgba(230, 160, 196, 0.18)',
  girlDark: '#b97fa0',
} as const

export type ColorToken = keyof typeof colors
export default colors
