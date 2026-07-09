import { RequireGuest } from '@/components/auth/RequireGuest'
import ForgotPasswordScreen from '@/screens/reset'

export default function ForgotPasswordPage() {
  return (
    <RequireGuest>
      <ForgotPasswordScreen />
    </RequireGuest>
  )
}
