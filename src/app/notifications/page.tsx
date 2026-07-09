import { RequireAuth } from '@/components/auth/RequireAuth'
import NotificationsScreen from '@/screens/Notifications'

export default function NotificationsPage() {
  return (
    <RequireAuth>
      <NotificationsScreen />
    </RequireAuth>
  )
}
