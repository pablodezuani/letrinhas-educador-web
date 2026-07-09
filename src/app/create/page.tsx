import { RequireGuest } from '@/components/auth/RequireGuest'
import CadastroScreen from '@/screens/create'

export default function CreatePage() {
  return (
    <RequireGuest>
      <CadastroScreen />
    </RequireGuest>
  )
}
