import abacaxi from '@/assets/vowels/abacaxi.png'
import bola from '@/assets/vowels/bola.png'
import cachorro from '@/assets/vowels/cachorro.png'
import casa from '@/assets/vowels/casa.png'
import chave from '@/assets/vowels/chave.png'
import elefante from '@/assets/vowels/elefante.png'
import faca from '@/assets/vowels/faca.png'
import flor from '@/assets/vowels/flor.png'
import gato from '@/assets/vowels/gato.png'
import gelo from '@/assets/vowels/gelo.png'
import igreja from '@/assets/vowels/igreja.png'
import lapis from '@/assets/vowels/lapis.png'
import mao from '@/assets/vowels/mao.png'
import mesa from '@/assets/vowels/mesa.png'
import ovo from '@/assets/vowels/ovo.png'
import pato from '@/assets/vowels/pato.png'
import peixe from '@/assets/vowels/peixe.png'
import sol from '@/assets/vowels/sol.png'
import telefone from '@/assets/vowels/telefone.png'
import uva from '@/assets/vowels/uva.png'

import type { StaticImageData } from 'next/image'

/**
 * Substitui o `import.meta.glob` do Vite (não suportado pelo bundler do
 * Next.js) por um mapa estático. São só 20 imagens e a lista muda raramente,
 * então listar explicitamente é mais simples que qualquer alternativa dinâmica.
 *
 * Mantém os objetos de import (não `.src`) para que `next/image` conheça as
 * dimensões e otimize (resize/webp/avif) automaticamente.
 */
export const VOWELS_IMAGE_MAP: Record<string, StaticImageData> = {
  abacaxi,
  bola,
  cachorro,
  casa,
  chave,
  elefante,
  faca,
  flor,
  gato,
  gelo,
  igreja,
  lapis,
  mao,
  mesa,
  ovo,
  pato,
  peixe,
  sol,
  telefone,
  uva,
}
