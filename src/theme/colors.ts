/**
 * Paleta pastel acolhedora pensada para crianças com TEA (níveis 1, 2 e 3).
 * Ported 1:1 from the React Native app's theme/colors.ts.
 * Keep in sync with the `--color-*` variables in src/index.css.
 */
export const colors = {
  // Base / neutros
  background: '#FFF8F4',
  surface: '#FFFFFF',
  surfaceAlt: '#F6EEE6',
  surfaceMuted: '#F1E9DF',
  overlay: 'rgba(48, 95, 114, 0.45)',
  overlayLight: 'rgba(48, 95, 114, 0.18)',

  // Primárias (Teal suave) — marca, headers, ações
  primary: '#305F72',
  primaryLight: '#567B8B',
  primaryDark: '#1F4352',
  primarySoft: 'rgba(48, 95, 114, 0.08)',

  // Secundárias (Lilás suave) — CTA primário
  secondary: '#CBAACB',
  secondaryLight: '#E2CDE2',
  secondaryDark: '#A988A9',
  secondarySoft: 'rgba(203, 170, 203, 0.18)',

  // Acento (Pêssego) — destaques, badges, branding
  accent: '#F5A97C',
  accentLight: '#FAC7A6',
  accentDark: '#D48660',
  accentSoft: 'rgba(245, 169, 124, 0.18)',

  // Semânticos (suaves, com versão "Light" para fundos)
  success: '#7FB77E',
  successLight: '#E4F1E3',
  successDark: '#5C9A5B',

  warning: '#E9B44C',
  warningLight: '#FBEED1',
  warningDark: '#B98A2D',

  error: '#D9756B',
  errorLight: '#FBE5E2',
  errorDark: '#B85048',

  info: '#6DAED9',
  infoLight: '#DBEDF7',
  infoDark: '#4D8AB2',

  // Texto
  textPrimary: '#305F72',
  textSecondary: '#6B7F88',
  textMuted: '#98A5AB',
  textDisabled: '#C2C8CB',
  textOnPrimary: '#FFF8F4',
  textOnSecondary: '#FFFFFF',
  textOnAccent: '#4A1B0C',

  // Bordas e divisores
  border: 'rgba(48, 95, 114, 0.12)',
  borderStrong: 'rgba(48, 95, 114, 0.25)',
  borderFocus: '#305F72',
  divider: 'rgba(48, 95, 114, 0.08)',

  // Utilitários
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
  shadow: '#000000',

  // Níveis TEA (suavizados, sem alarmismo)
  teaLevel1: '#7FB77E',
  teaLevel1Light: '#E4F1E3',
  teaLevel2: '#E9B44C',
  teaLevel2Light: '#FBEED1',
  teaLevel3: '#D9756B',
  teaLevel3Light: '#FBE5E2',

  // Temas suaves de gênero (para personalização das crianças)
  boy: '#6DAED9',
  boyLight: '#DBEDF7',
  boyDark: '#4D8AB2',
  girl: '#E8A7BD',
  girlLight: '#F7E0E8',
  girlDark: '#C5879B',
} as const

export type ColorToken = keyof typeof colors
export default colors
