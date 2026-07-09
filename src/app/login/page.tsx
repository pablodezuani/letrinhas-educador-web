import { RequireGuest } from '@/components/auth/RequireGuest'
import Login from '@/screens/Login'

export default function LoginPage() {
  return (
    <RequireGuest>
      <Login />
    </RequireGuest>
  )
}
