'use client'

import { createContext, useEffect, useState, type ReactNode } from 'react'
import { api } from '@/services/api'

type AuthContextData = {
  user: UserProps
  isAuthenticated: boolean
  signIn: (credentials: SignInProps) => Promise<void>
  signUp: (credentials: SignUpProps) => Promise<void>
  loadingAuth: boolean
  loading: boolean
  signOut: () => void
}

type UserProps = {
  id: string
  name: string
  email: string
  token: string
}

type SignInProps = {
  email: string
  password: string
}

type SignUpProps = {
  name: string
  email: string
  password: string
}

const EMPTY_USER: UserProps = { id: '', name: '', email: '', token: '' }
const STORAGE_KEY = '@coinDezuToken'

export const AuthContext = createContext<AuthContextData | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProps>(EMPTY_USER)
  const [loadingAuth, setLoadingAuth] = useState(false)
  const [loading, setLoading] = useState(true)

  const isAuthenticated = !!user.token

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    const hasUser: UserProps = raw ? JSON.parse(raw) : EMPTY_USER

    if (hasUser?.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${hasUser.token}`
      setUser(hasUser)
    }

    setLoading(false)
  }, [])

  async function signIn({ email, password }: SignInProps) {
    setLoadingAuth(true)

    try {
      const response = await api.post('/session', { email, password })
      const { id, name, token } = response.data
      const data: UserProps = { id, name, email, token }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(data)
    } catch (err: any) {
      throw new Error(
        err.response?.data?.error || err.response?.data?.message || 'Erro ao fazer login',
      )
    } finally {
      setLoadingAuth(false)
    }
  }

  async function signUp({ name, email, password }: SignUpProps) {
    setLoadingAuth(true)

    try {
      await api.post('/users', { name, email, password })

      const response = await api.post('/session', { email, password })
      const { id, name: userName, token } = response.data
      const data: UserProps = { id, name: userName, email, token }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(data)
    } catch (err: any) {
      throw new Error(
        err.response?.data?.error || err.response?.data?.message || 'Erro ao cadastrar',
      )
    } finally {
      setLoadingAuth(false)
    }
  }

  function signOut() {
    localStorage.clear()
    delete api.defaults.headers.common['Authorization']
    setUser(EMPTY_USER)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signUp, loading, loadingAuth, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
