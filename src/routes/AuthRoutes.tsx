import { Navigate, Route, Routes } from 'react-router-dom'
import Welcome from '@/screens/welcome'
import Login from '@/screens/Login'
import CadastroScreen from '@/screens/create'
import ForgotPasswordScreen from '@/screens/reset'

function AuthRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/create" element={<CadastroScreen />} />
      <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AuthRoutes
