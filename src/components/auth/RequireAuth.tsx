'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { SplashScreen } from '@/components/feedback/SplashScreen'

/** Protege telas internas: redireciona pra "/" se o usuário não estiver autenticado. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/')
    }
  }, [loading, isAuthenticated, router])

  if (loading || !isAuthenticated) {
    return <SplashScreen />
  }

  return <>{children}</>
}

export default RequireAuth
