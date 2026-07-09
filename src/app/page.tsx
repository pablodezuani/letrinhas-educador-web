'use client'

import { useAuth } from '@/hooks/useAuth'
import { SplashScreen } from '@/components/feedback/SplashScreen'
import HomeScreen from '@/screens/Home'
import Welcome from '@/screens/welcome'

export default function RootPage() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <SplashScreen />
  }

  return isAuthenticated ? <HomeScreen /> : <Welcome />
}
