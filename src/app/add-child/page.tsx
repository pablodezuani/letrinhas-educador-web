import { RequireAuth } from '@/components/auth/RequireAuth'
import AddChildScreen from '@/screens/AddChild'

export default function AddChildPage() {
  return (
    <RequireAuth>
      <AddChildScreen />
    </RequireAuth>
  )
}
