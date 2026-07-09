import { motion } from 'framer-motion'
import { useReduceMotion } from '@/contexts/ThemeContext'

export interface FloatingLetterSpec {
  char: string
  leftPct: number
  color: string
  size: number
  delay: number
  dur: number
}

/**
 * Letras do alfabeto flutuando pelo fundo das telas de auth (welcome/login/cadastro).
 * Sobe de baixo pra cima em loop infinito. Não renderiza nada em Reduce Motion.
 */
export function FloatingLetters({ letters }: { letters: readonly FloatingLetterSpec[] }) {
  const reduceMotion = useReduceMotion()
  if (reduceMotion) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {letters.map((l, i) => (
        <motion.span
          key={i}
          className="absolute font-black"
          style={{
            left: `${l.leftPct}%`,
            fontSize: l.size,
            color: l.color,
            fontFamily: /[A-Za-z]/.test(l.char) ? 'var(--font-display)' : undefined,
            bottom: 0,
          }}
          initial={{ y: '20vh', opacity: 0 }}
          animate={{ y: '-120vh', opacity: [0, 0.8, 0.8, 0] }}
          transition={{ duration: l.dur / 1000, delay: l.delay / 1000, repeat: Infinity, ease: 'linear' }}
        >
          {l.char}
        </motion.span>
      ))}
    </div>
  )
}

export default FloatingLetters
