import { RequireAuth } from '@/components/auth/RequireAuth'
import WordFormationGame from '@/screens/WordFormationGame/WordFormationGame'

export default function WordFormationGamePage() {
  return (
    <RequireAuth>
      <WordFormationGame />
    </RequireAuth>
  )
}
