import { RequireAuth } from '@/components/auth/RequireAuth'
import MessagesScreen from '@/screens/Messages'

export default function MessagesPage() {
  return (
    <RequireAuth>
      <MessagesScreen />
    </RequireAuth>
  )
}
