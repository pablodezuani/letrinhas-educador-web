import { motion } from 'framer-motion'
import Image from 'next/image'
import logo from '@/assets/brand/letrinhas.png'
import { useReduceMotion } from '@/contexts/ThemeContext'

/** SplashScreen — estado de boot do app (enquanto AuthContext hidrata). Respeita Reduce Motion. */
export function SplashScreen() {
  const reduceMotion = useReduceMotion()

  return (
    <div role="progressbar" aria-label="Carregando o app" className="flex-1 min-h-dvh bg-background flex flex-col items-center justify-center p-xxl">
      <motion.div
        initial={reduceMotion ? false : { scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.34, 1.56, 0.64, 1] }}
        className="w-[140px] h-[140px] rounded-pill bg-accent-light border-[3px] border-accent flex items-center justify-center mb-xl shadow-md"
      >
        <Image src={logo} alt="Letrinhas Encantadas" priority className="w-[65%] h-[65%] object-contain" />
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: reduceMotion ? 0 : 0.4 }}
        className="flex items-center justify-center"
      >
        <div className="flex gap-xs mb-xl">
          <span className="w-1.5 h-1.5 rounded-pill bg-secondary opacity-50" />
          <span className="w-1.5 h-1.5 rounded-pill bg-accent" />
          <span className="w-1.5 h-1.5 rounded-pill bg-secondary opacity-50" />
        </div>
      </motion.div>

      <span className="mt-lg h-9 w-9 rounded-full border-[3px] border-primary border-t-transparent animate-spin" />
    </div>
  )
}

export default SplashScreen
