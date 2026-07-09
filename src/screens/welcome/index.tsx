import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import logo from '@/assets/brand/letrinhas.png'
import { FloatingLetters, type FloatingLetterSpec } from '@/components/auth/FloatingLetters'
import { useReduceMotion } from '@/contexts/ThemeContext'

const PILLS = ['Leitura', 'Expressão', 'Aprendizado'] as const

const LETTERS: FloatingLetterSpec[] = [
  { char: 'A', leftPct: 7, color: '#F5A97C', size: 38, delay: 0, dur: 5200 },
  { char: 'E', leftPct: 20, color: '#CBAACB', size: 26, delay: 600, dur: 4600 },
  { char: 'I', leftPct: 42, color: '#7FB77E', size: 44, delay: 1400, dur: 5800 },
  { char: 'O', leftPct: 61, color: '#6DAED9', size: 30, delay: 300, dur: 4900 },
  { char: 'U', leftPct: 80, color: '#E9B44C', size: 22, delay: 1100, dur: 5500 },
  { char: 'B', leftPct: 14, color: '#FAC7A6', size: 19, delay: 2000, dur: 4400 },
  { char: 'L', leftPct: 52, color: '#D4B0D4', size: 28, delay: 500, dur: 6000 },
  { char: '✦', leftPct: 72, color: '#FAC7A6', size: 18, delay: 900, dur: 5100 },
  { char: 'R', leftPct: 33, color: '#A8CEA7', size: 24, delay: 1800, dur: 4200 },
  { char: '★', leftPct: 89, color: '#D4D4EA', size: 16, delay: 2500, dur: 4700 },
]

export default function Welcome() {
  const navigate = useNavigate()
  const reduceMotion = useReduceMotion()

  const goToLogin = useCallback(() => navigate('/login'), [navigate])

  return (
    <div
      className="relative flex flex-col min-h-dvh overflow-hidden"
      style={{ backgroundImage: 'linear-gradient(160deg, #061720, #0F2D3E, #1A4055, #305F72)' }}
    >
      <FloatingLetters letters={LETTERS} />

      <div className="relative z-10 flex-[1.5] flex flex-col items-center justify-center pt-[calc(env(safe-area-inset-top)+20px)]">
        <div className="relative flex items-center justify-center mb-xl">
          {!reduceMotion && (
            <>
              <motion.div
                className="absolute w-[222px] h-[222px] rounded-pill border-[1.5px]"
                style={{ borderColor: 'rgba(245,169,124,0.28)' }}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 3.2, repeat: Infinity }}
              />
              <motion.div
                className="absolute w-[183px] h-[183px] rounded-pill border-2"
                style={{ borderColor: 'rgba(245,169,124,0.5)' }}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2.4, delay: 0.6, repeat: Infinity }}
              />
            </>
          )}
          <div className="w-[152px] h-[152px] rounded-pill bg-white border-[3.5px] border-accent flex items-center justify-center shadow-lg">
            <img src={logo} alt="" className="w-[68%] h-[68%] object-contain" />
          </div>
        </div>

        <h1
          className="text-center text-white text-[32px] leading-[44px]"
          style={{ fontFamily: 'var(--font-display)', textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}
        >
          Letrinhas
          <br />
          Encantadas
        </h1>
        <p className="text-caption mt-sm tracking-[1.4px]" style={{ color: 'rgba(245,169,124,0.85)' }}>
          ✦ Um mundo mágico de palavras ✦
        </p>
      </div>

      <div
        className="relative z-10 flex-[1.6] bg-primary rounded-t-[40px] px-xxl pt-lg flex flex-col"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom) + 16px, 24px)' }}
      >
        <div className="absolute top-0 left-12 right-12 h-px bg-white/22" />
        <div className="w-11 h-1 bg-white/30 rounded-full self-center mb-lg" />

        <h2 className="text-h2 text-white text-center mb-sm">
          Descubra o prazer
          <br />
          de aprender!
        </h2>

        <p className="text-body text-center mb-lg" style={{ color: 'rgba(255,248,244,0.78)' }}>
          Criado com carinho para ajudar crianças a se expressarem e descobrirem as letras.
        </p>

        <div className="flex justify-center gap-sm flex-wrap mb-xl">
          {PILLS.map(label => (
            <span key={label} className="bg-white/13 border border-white/22 rounded-pill px-md py-1.5 text-caption font-semibold" style={{ color: 'rgba(255,248,244,0.9)' }}>
              {label}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={goToLogin}
          className="mt-auto h-14 rounded-pill flex items-center justify-center shadow-lg transition-transform active:scale-[0.97]"
          style={{ backgroundImage: 'linear-gradient(90deg, #F5A97C, #D48660)' }}
        >
          <span className="text-white text-[17px] font-extrabold">Começar a Jornada ✨</span>
        </button>
      </div>
    </div>
  )
}
