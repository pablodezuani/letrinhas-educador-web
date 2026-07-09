import { RequireAuth } from '@/components/auth/RequireAuth'
import PhraseBuilder from '@/screens/PhraseBuilder/PhraseBuilder'

export default function PhraseBuilderPage() {
  return (
    <RequireAuth>
      <PhraseBuilder />
    </RequireAuth>
  )
}
