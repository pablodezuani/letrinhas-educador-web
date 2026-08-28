import { RequireAuth } from '@/components/auth/RequireAuth'
import MessageThreadScreen from '@/screens/MessageThread'

export default function MessageThreadPage() {
  return (
    <RequireAuth>
      <MessageThreadScreen />
    </RequireAuth>
  )
}
