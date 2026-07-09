import { RequireAuth } from '@/components/auth/RequireAuth'
import EditProfileScreen from '@/screens/EditProfile'

export default function EditProfilePage() {
  return (
    <RequireAuth>
      <EditProfileScreen />
    </RequireAuth>
  )
}
