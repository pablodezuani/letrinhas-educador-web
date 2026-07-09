import { RequireAuth } from '@/components/auth/RequireAuth'
import HelpSupportScreen from '@/screens/HelpSupport'

export default function HelpSupportPage() {
  return (
    <RequireAuth>
      <HelpSupportScreen />
    </RequireAuth>
  )
}
