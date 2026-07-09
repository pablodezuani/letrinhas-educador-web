/**
 * Durações padrão (ms). Sempre lidas via useReduceMotion() — quando o usuário
 * prefere menos movimento, as durações efetivas vão para 0.
 */
export const animation = {
  fast: 150,
  normal: 250,
  slow: 400,
  lazy: 600,
  splash: 1200,
} as const

export const easing = {
  standard: [0.25, 0.1, 0.25, 1],
  decelerate: [0.0, 0.0, 0.2, 1],
  accelerate: [0.4, 0.0, 1, 1],
  bounce: [0.34, 1.56, 0.64, 1],
} as const satisfies Record<string, readonly [number, number, number, number]>

export type AnimationToken = keyof typeof animation
export default animation
