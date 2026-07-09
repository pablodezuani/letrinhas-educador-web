import { RequireAuth } from '@/components/auth/RequireAuth'
import ChildScreen from '@/screens/ChildScreen/ChildScreen'

export default function ChildPage() {
  return (
    <RequireAuth>
      <ChildScreen />
    </RequireAuth>
  )
}
