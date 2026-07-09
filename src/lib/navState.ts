import type { Child } from './types'

/**
 * Next.js (App Router) não tem um equivalente ao `location.state` do
 * react-router para passar objetos complexos entre rotas. Usamos
 * sessionStorage como uma ponte simples só pro que precisa atravessar uma
 * navegação: a criança selecionada (Home → ChildScreen) e os parâmetros de
 * contexto do jogo (ChildScreen → cada jogo).
 */
const CHILD_KEY = '@letrinhas:selectedChild'
const GAME_NAV_KEY = '@letrinhas:gameNav'

export function stashSelectedChild(child: Child) {
  sessionStorage.setItem(CHILD_KEY, JSON.stringify(child))
}

export function readSelectedChild(): Child | null {
  try {
    const raw = sessionStorage.getItem(CHILD_KEY)
    return raw ? (JSON.parse(raw) as Child) : null
  } catch {
    return null
  }
}

export interface GameNavState {
  gender: 'menino' | 'menina'
  childName: string
  childColor?: string
  childId?: string
}

export function stashGameNav(state: GameNavState) {
  sessionStorage.setItem(GAME_NAV_KEY, JSON.stringify(state))
}

export function readGameNav(): GameNavState | null {
  try {
    const raw = sessionStorage.getItem(GAME_NAV_KEY)
    return raw ? (JSON.parse(raw) as GameNavState) : null
  } catch {
    return null
  }
}
