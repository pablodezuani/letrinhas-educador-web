import { RequireAuth } from '@/components/auth/RequireAuth'
import AboutScreen from '@/screens/About'

export default function AboutPage() {
  return (
    <RequireAuth>
      <AboutScreen />
    </RequireAuth>
  )
}
