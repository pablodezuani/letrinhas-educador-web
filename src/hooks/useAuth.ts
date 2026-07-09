'use client'

import { useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'

/** Hook conveniente para acessar o AuthContext. Lança erro claro se usado fora do provider. */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>.')
  }
  return ctx
}

export default useAuth
