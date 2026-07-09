import { RequireAuth } from '@/components/auth/RequireAuth'
import ReadingGame from '@/screens/ReadingGame/ReadingGame'

export default function ReadingGamePage() {
  return (
    <RequireAuth>
      <ReadingGame />
    </RequireAuth>
  )
}
