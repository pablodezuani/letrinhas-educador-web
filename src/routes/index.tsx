import { useAuth } from '@/hooks/useAuth'
import { SplashScreen } from '@/components/feedback/SplashScreen'
import AppRoutes from './AppRoutes'
import AuthRoutes from './AuthRoutes'

/** Routes — gateway autenticado/não-autenticado. Mostra SplashScreen enquanto o AuthContext hidrata. */
export default function Routes() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <SplashScreen />
  }

  return isAuthenticated ? <AppRoutes /> : <AuthRoutes />
}
