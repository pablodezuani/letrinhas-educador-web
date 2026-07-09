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

/**
 * Substitui o `import.meta.glob` do Vite (não suportado pelo bundler do
 * Next.js) por um mapa estático. São só 20 imagens e a lista muda raramente,
 * então listar explicitamente é mais simples que qualquer alternativa dinâmica.
 */
export const VOWELS_IMAGE_MAP: Record<string, string> = {
  abacaxi: abacaxi.src,
  bola: bola.src,
  cachorro: cachorro.src,
  casa: casa.src,
  chave: chave.src,
  elefante: elefante.src,
  faca: faca.src,
  flor: flor.src,
  gato: gato.src,
  gelo: gelo.src,
  igreja: igreja.src,
  lapis: lapis.src,
  mao: mao.src,
  mesa: mesa.src,
  ovo: ovo.src,
  pato: pato.src,
  peixe: peixe.src,
  sol: sol.src,
  telefone: telefone.src,
  uva: uva.src,
}
