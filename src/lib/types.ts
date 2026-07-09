export interface User {
  name: string
  email: string
  avatar: string
  joinDate: string
  totalChildren: number
  completedActivities: number
}

export interface Child {
  id: string
  name: string
  nickname: string
  age: number
  image: string
  gender: 'male' | 'female'
  difficulties: string
  hasTEA: boolean
  teaLevel: number
  likes: string
  aboutMe: string
  dislikes: string
  skills: string
  howToHelp: string
  whenFrustrated: string
  whenNeedAttention: string
  color: string
  lightColor: string
  routine: string
  communication: string
  sensoryNeeds: string
  interests: string
  medicalInfo: string
  lastUpdate: string
  priority: 'high' | 'medium' | 'low'
  emoji: string
  progressToday: number
  activitiesCompleted: number
  mood: string
  favoriteActivity: string
  nextAppointment: string
  weeklyProgress: number[]
  achievements: Array<{ id: number; title: string; date: string; icon: string; color: string }>
  recentActivities: Array<{ id: number; name: string; completed: boolean; score: number; time: string }>
  therapies: Array<{ type: string; frequency: string; nextSession: string }>
  emergencyContacts: Array<{ name: string; phone: string; relation: string }>
}

export interface UserProfile {
  name: string
  email: string
  joinDate: string
}

/** Converte resposta da API para o formato Child usado nas telas. */
export function mapApiChild(raw: any): Child {
  const sessions: any[] = raw.gameSessions ?? []
  const activitiesCompleted = sessions.length

  const today = new Date().toDateString()
  const todaySessions = sessions.filter(s => new Date(s.playedAt).toDateString() === today)
  const progressToday =
    todaySessions.length > 0
      ? Math.round(
          todaySessions.reduce(
            (sum: number, s: any) => sum + (s.maxScore > 0 ? (s.score / s.maxScore) * 100 : 0),
            0,
          ) / todaySessions.length,
        )
      : 0

  const gameCount: Record<string, number> = {}
  for (const s of sessions) {
    gameCount[s.gameType] = (gameCount[s.gameType] ?? 0) + 1
  }
  const favoriteActivity = Object.entries(gameCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? ''

  const recentActivities = sessions.slice(0, 5).map((s: any, i: number) => ({
    id: i,
    name: s.gameType,
    completed: s.completed,
    score: s.score,
    time: new Date(s.playedAt).toLocaleDateString('pt-BR'),
  }))

  return {
    id: raw.id,
    name: raw.name ?? '',
    nickname: raw.nickname ?? '',
    age: raw.age ?? 0,
    image: raw.photo ?? '',
    gender: raw.gender === 'female' ? 'female' : 'male',
    difficulties: (raw.difficulties ?? []).join(', '),
    hasTEA: raw.hasAutism === 'yes',
    teaLevel: parseInt(raw.autismLevel ?? '0', 10),
    likes: (raw.likes ?? []).join(', '),
    aboutMe: raw.aboutMe ?? '',
    dislikes: (raw.dislikes ?? []).join(', '),
    skills: (raw.skills ?? []).join(', '),
    howToHelp: raw.howToHelp ?? '',
    whenFrustrated: raw.whenFrustrated ?? '',
    whenNeedAttention: raw.whenNeedsAttention ?? '',
    color: raw.color ?? '#7C3AED',
    lightColor: raw.lightColor ?? '#EDE9FE',
    routine: raw.routine ?? '',
    communication: raw.communication ?? '',
    sensoryNeeds: raw.sensoryNeeds ?? '',
    interests: (raw.specialInterests ?? []).join(', '),
    medicalInfo: raw.medicalInfo ?? '',
    lastUpdate: raw.updatedAt ?? new Date().toISOString(),
    priority: 'medium',
    emoji: raw.emoji ?? '⭐',
    progressToday,
    activitiesCompleted,
    mood: 'happy',
    favoriteActivity,
    nextAppointment: raw.nextAppointment ?? '',
    weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
    achievements: [],
    recentActivities,
    therapies: Array.isArray(raw.therapies) ? raw.therapies : [],
    emergencyContacts: Array.isArray(raw.emergencyContacts) ? raw.emergencyContacts : [],
  }
}
