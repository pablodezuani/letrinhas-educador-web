import { Navigate, Route, Routes } from 'react-router-dom'

import HomeScreen from '@/screens/Home'
import AddChildScreen from '@/screens/AddChild'
import ChildScreen from '@/screens/ChildScreen/ChildScreen'
import ReadingGame from '@/screens/ReadingGame/ReadingGame'
import VowelsGame from '@/screens/VowelsGame/VowelsGame'
import WordFormationGame from '@/screens/WordFormationGame/WordFormationGame'
import PhraseBuilder from '@/screens/PhraseBuilder/PhraseBuilder'
import EditProfileScreen from '@/screens/EditProfile'
import SettingsScreen from '@/screens/Settings'
import NotificationsScreen from '@/screens/Notifications'
import AboutScreen from '@/screens/About'
import HelpSupportScreen from '@/screens/HelpSupport'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/add-child" element={<AddChildScreen />} />
      <Route path="/child" element={<ChildScreen />} />

      <Route path="/games/reading" element={<ReadingGame />} />
      <Route path="/games/vowels" element={<VowelsGame />} />
      <Route path="/games/word-formation" element={<WordFormationGame />} />
      <Route path="/games/phrase-builder" element={<PhraseBuilder />} />

      <Route path="/edit-profile" element={<EditProfileScreen />} />
      <Route path="/settings" element={<SettingsScreen />} />
      <Route path="/notifications" element={<NotificationsScreen />} />
      <Route path="/about" element={<AboutScreen />} />
      <Route path="/help-support" element={<HelpSupportScreen />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
