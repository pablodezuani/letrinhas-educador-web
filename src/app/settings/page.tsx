import { RequireAuth } from '@/components/auth/RequireAuth'
import SettingsScreen from '@/screens/Settings'

export default function SettingsPage() {
  return (
    <RequireAuth>
      <SettingsScreen />
    </RequireAuth>
  )
}
