'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'

import { type Child, mapApiChild, type User } from '@/lib/types'
import { api } from '@/services/api'
import { ChildrenList } from '@/components/Home/ChildrenList'
import { ChildModal } from '@/components/Home/ChildModal'
import { ProfileModal } from '@/components/Home/profile-modal'
import { Header } from '@/components/Home/header'
import { useAuth } from '@/hooks'
import { gradients } from '@/theme'

export default function HomeScreen() {
  const router = useRouter()
  const { user: authUser } = useAuth()
  const [children, setChildren] = useState<Child[]>([])
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [profileModalVisible, setProfileModalVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [loadingChildren, setLoadingChildren] = useState(true)

  const fetchChildren = useCallback(async () => {
    try {
      const response = await api.get('/my-children')
      const mapped: Child[] = response.data.map(mapApiChild)
      setChildren(mapped)
    } catch (err) {
      console.error('Erro ao buscar crianças:', err)
    } finally {
      setLoadingChildren(false)
    }
  }, [])

  useEffect(() => {
    fetchChildren()
  }, [fetchChildren])

  const user = useMemo<User>(() => {
    const displayName = authUser.name?.trim() || 'Usuário'
    const totalActivities = children.reduce((sum, c) => sum + (c.activitiesCompleted ?? 0), 0)
    return {
      name: displayName,
      email: authUser.email || '',
      avatar: '',
      joinDate: new Date().toISOString(),
      totalChildren: children.length,
      completedActivities: totalActivities,
    }
  }, [authUser.name, authUser.email, children])

  const filteredChildren = useMemo(() => {
    if (!searchQuery) return children
    const q = searchQuery.toLowerCase()
    return children.filter(child => child.name.toLowerCase().includes(q) || child.nickname.toLowerCase().includes(q))
  }, [searchQuery, children])

  const openModal = useCallback((child: Child) => {
    setSelectedChild(child)
    setModalVisible(true)
  }, [])

  const closeModal = useCallback(() => {
    setModalVisible(false)
    setSelectedChild(null)
  }, [])

  const openProfile = useCallback(() => setProfileModalVisible(true), [])
  const closeProfile = useCallback(() => setProfileModalVisible(false), [])

  const toggleSearchBar = useCallback(() => {
    setShowSearchBar(prev => {
      if (prev) setSearchQuery('')
      return !prev
    })
  }, [])

  const navigateToAddChild = useCallback(() => router.push('/add-child'), [router])

  return (
    <div className="min-h-dvh bg-background flex flex-col relative">
      <Header
        user={user}
        children={children}
        searchQuery={searchQuery}
        showSearchBar={showSearchBar}
        onSearchChange={setSearchQuery}
        onToggleSearch={toggleSearchBar}
        onOpenProfile={openProfile}
      />

      <ChildrenList children={filteredChildren} loading={loadingChildren} onChildSelect={openModal} searchQuery={searchQuery} onAddChild={navigateToAddChild} />

      {selectedChild && <ChildModal child={selectedChild} visible={modalVisible} onClose={closeModal} />}

      <ProfileModal user={user} visible={profileModalVisible} onClose={closeProfile} />

      <button
        type="button"
        onClick={navigateToAddChild}
        aria-label="Adicionar criança"
        className="fixed bottom-[calc(env(safe-area-inset-bottom)+30px)] right-5 w-14 h-14 rounded-pill shadow-xl flex items-center justify-center transition-transform active:scale-[0.9]"
        style={{ backgroundImage: `linear-gradient(135deg, ${gradients.primary.join(', ')})` }}
      >
        <Plus size={24} color="white" />
      </button>
    </div>
  )
}
