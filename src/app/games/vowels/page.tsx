import { RequireAuth } from '@/components/auth/RequireAuth'
import VowelsGame from '@/screens/VowelsGame/VowelsGame'

export default function VowelsGamePage() {
  return (
    <RequireAuth>
      <VowelsGame />
    </RequireAuth>
  )
}
