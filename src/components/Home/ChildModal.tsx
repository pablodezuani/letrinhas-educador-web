import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Award, Bell, Brain, CheckCircle2, ClipboardList, Clock, Frown, GraduationCap,
  Hand, Heart, MapPin, MessageSquare, School as SchoolIcon, Smile, Star, Stethoscope, X, XCircle,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { api } from '@/services/api'
import { mapApiChild, type Child, type School } from '@/lib/types'
import { InfoCard } from './info-card'
import { SchoolPicker } from '@/components/school/SchoolPicker'

interface ChildModalProps {
  child: Child
  visible: boolean
  onClose: () => void
  onChildUpdated?: (child: Child) => void
}

const TABS = [
  { id: 'overview', label: 'Visão Geral', emoji: '🏠', color: '#4CAF50' },
  { id: 'unit', label: 'Unidade', emoji: '🏫', color: '#3F51B5' },
  { id: 'personal', label: 'Pessoal', emoji: '👤', color: '#2196F3' },
  { id: 'behavior', label: 'Comportamento', emoji: '😊', color: '#FF9800' },
  { id: 'help', label: 'Ajuda', emoji: '🤝', color: '#9C27B0' },
  { id: 'medical', label: 'Saúde', emoji: '🏥', color: '#F44336' },
] as const

export function ChildModal({ child, visible, onClose, onChildUpdated }: ChildModalProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(0)
  const [picking, setPicking] = useState(false)
  const [pendingSchool, setPendingSchool] = useState<School | null>(null)
  const [saving, setSaving] = useState(false)

  async function applySchool(schoolId: string | null) {
    setSaving(true)
    try {
      const res = await api.patch(`/children/${child.id}/school`, { schoolId })
      onChildUpdated?.(mapApiChild(res.data))
      setPicking(false)
      setPendingSchool(null)
    } catch {
      // silencioso — o usuário pode tentar novamente pela mesma tela
    } finally {
      setSaving(false)
    }
  }

  const sections = {
    overview: [
      {
        id: 'summary',
        Icon: ClipboardList,
        color: '#4CAF50',
        bg: '#e8f5e9',
        title: 'Resumo Geral',
        content: `${child.name} (${child.nickname}) tem ${child.age} anos e ${
          child.hasTEA ? `possui diagnóstico de TEA nível ${child.teaLevel}` : 'não possui diagnóstico de TEA'
        }. Hoje completou ${child.activitiesCompleted} atividades com ${child.progressToday}% de progresso.`,
      },
      {
        id: 'progress',
        Icon: CheckCircle2,
        color: '#2196F3',
        bg: '#e3f2fd',
        title: 'Progresso de Hoje',
        content: `Completou ${child.activitiesCompleted} atividades com taxa de sucesso de ${child.progressToday}%. O desempenho está ${
          child.progressToday >= 80 ? 'excelente' : child.progressToday >= 60 ? 'bom' : 'em desenvolvimento'
        }.`,
      },
    ],
    personal: [
      { id: 'about', Icon: Smile, color: '#4CAF50', bg: '#e8f5e9', title: 'Sobre mim', content: child.aboutMe },
      { id: 'interests', Icon: Star, color: '#9C27B0', bg: '#f3e5f5', title: 'Interesses especiais', content: child.interests },
      { id: 'routine', Icon: Clock, color: '#FF9800', bg: '#fff3e0', title: 'Minha rotina', content: child.routine },
    ],
    behavior: [
      { id: 'likes', Icon: Heart, color: '#E91E63', bg: '#fce4ec', title: 'O que eu gosto', content: child.likes },
      { id: 'dislikes', Icon: XCircle, color: '#F44336', bg: '#ffebee', title: 'O que não gosto', content: child.dislikes },
      { id: 'skills', Icon: Award, color: '#673AB7', bg: '#ede7f6', title: 'Minhas habilidades', content: child.skills },
    ],
    help: [
      { id: 'howToHelp', Icon: Hand, color: '#2196F3', bg: '#e3f2fd', title: 'Como me ajudar', content: child.howToHelp },
      { id: 'frustrated', Icon: Frown, color: '#795548', bg: '#efebe9', title: 'Quando frustrado(a)', content: child.whenFrustrated },
      { id: 'attention', Icon: Bell, color: '#607D8B', bg: '#eceff1', title: 'Quando preciso de atenção', content: child.whenNeedAttention },
    ],
    medical: [
      { id: 'medicalInfo', Icon: Stethoscope, color: '#F44336', bg: '#ffebee', title: 'Informações médicas', content: child.medicalInfo },
      {
        id: 'teaInfo',
        Icon: Brain,
        color: '#9C27B0',
        bg: '#f3e5f5',
        title: 'Informações sobre TEA',
        content: child.hasTEA
          ? `TEA nível ${child.teaLevel}. Suporte ${child.teaLevel === 1 ? 'leve' : child.teaLevel === 2 ? 'moderado' : 'substancial'}.`
          : 'Sem diagnóstico de TEA.',
      },
    ],
  }

  const activeTabId = TABS[activeTab].id
  const activeSections = activeTabId in sections ? sections[activeTabId as keyof typeof sections] : undefined
  const accentColor = `${child.color}CC`

  return (
    <AnimatePresence>
      {visible && (
        <motion.div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'tween', duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-[480px] h-[93dvh] bg-[#f5f4ff] rounded-t-[28px] overflow-hidden flex flex-col shadow-xl"
          >
            <div className="relative px-5 pt-5 pb-[18px]" style={{ backgroundImage: `linear-gradient(135deg, ${child.color}, ${accentColor})` }}>
              <div className="absolute w-[180px] h-[180px] rounded-pill bg-white/7 -top-[60px] -right-10 pointer-events-none" />
              <div className="absolute w-[90px] h-[90px] rounded-pill bg-white/6 -bottom-[30px] -left-5 pointer-events-none" />

              <button type="button" onClick={onClose} aria-label="Fechar" className="relative self-end ml-auto w-[34px] h-[34px] rounded-pill bg-white/20 border-[0.5px] border-white/30 flex items-center justify-center mb-3.5">
                <X size={18} color="#fff" />
              </button>

              <div className="relative flex items-center gap-4 mb-4">
                <div className="relative shrink-0">
                  <div className="w-[76px] h-[76px] rounded-pill border-[3px] overflow-hidden bg-white/15" style={{ borderColor: 'rgba(255,255,255,0.35)' }}>
                    {child.image ? <img src={child.image} alt="" className="w-full h-full object-cover" /> : null}
                  </div>
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-pill bg-[#4CAF50] border-[2.5px] border-white/80" />
                  {child.hasTEA && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-[3px] bg-white rounded-xl px-2 py-[3px] whitespace-nowrap">
                      <Brain size={10} color={child.color} />
                      <span className="text-[9px] font-extrabold" style={{ color: child.color }}>
                        TEA {child.teaLevel}
                      </span>
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[22px] font-extrabold text-white truncate">{child.name}</p>
                  <p className="text-[12px] text-white/75 mb-2.5">
                    "{child.nickname}" • {child.age} anos
                  </p>
                  <div className="flex gap-2">
                    <div className="bg-white/15 border-[0.5px] border-white/25 rounded-[20px] px-3 py-1.5 text-center">
                      <p className="text-[16px] font-extrabold text-white">{child.progressToday}%</p>
                      <p className="text-[9px] text-white/70 mt-0.5">Progresso</p>
                    </div>
                    <div className="bg-white/15 border-[0.5px] border-white/25 rounded-[20px] px-3 py-1.5 text-center">
                      <p className="text-[16px] font-extrabold text-white">{child.activitiesCompleted}</p>
                      <p className="text-[9px] text-white/70 mt-0.5">Atividades</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] text-white/65 uppercase tracking-[0.5px]">Progresso hoje</span>
                  <span className="text-[10px] text-white/90 font-bold">{child.progressToday}%</span>
                </div>
                <div className="h-[7px] bg-white/20 rounded overflow-hidden">
                  <div className="h-full bg-white rounded" style={{ width: `${child.progressToday}%` }} />
                </div>
              </div>
            </div>

            <div className="bg-white py-2.5 px-3 border-b border-black/6 overflow-x-auto">
              <div className="flex gap-1.5 w-max">
                {TABS.map((tab, i) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(i)}
                    className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-[20px] border-[0.5px] whitespace-nowrap transition-colors"
                    style={activeTab === i ? { backgroundColor: tab.color, borderColor: tab.color } : { backgroundColor: '#f5f5f5', borderColor: 'transparent' }}
                  >
                    <span className="text-[12px]">{tab.emoji}</span>
                    <span className="text-[11px] font-semibold" style={{ color: activeTab === i ? '#fff' : '#999' }}>
                      {tab.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3.5 pb-9">
              {activeTabId === 'unit' ? (
                <UnitTab
                  child={child}
                  picking={picking}
                  pendingSchool={pendingSchool}
                  saving={saving}
                  onStartPicking={() => setPicking(true)}
                  onCancelPicking={() => setPicking(false)}
                  onPick={school => (child.school ? setPendingSchool(school) : applySchool(school.id))}
                  onConfirmChange={() => pendingSchool && applySchool(pendingSchool.id)}
                  onCancelChange={() => setPendingSchool(null)}
                  onOpenMessages={() => {
                    onClose()
                    router.push(`/messages/${child.id}`)
                  }}
                />
              ) : (
                activeSections?.map(s => (
                  <InfoCard key={s.id} title={s.title} content={s.content} Icon={s.Icon} color={s.color} bg={s.bg} />
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function UnitTab({
  child,
  picking,
  pendingSchool,
  saving,
  onStartPicking,
  onCancelPicking,
  onPick,
  onConfirmChange,
  onCancelChange,
  onOpenMessages,
}: {
  child: Child
  picking: boolean
  pendingSchool: School | null
  saving: boolean
  onStartPicking: () => void
  onCancelPicking: () => void
  onPick: (school: School) => void
  onConfirmChange: () => void
  onCancelChange: () => void
  onOpenMessages: () => void
}) {
  if (picking) {
    return (
      <div className="flex flex-col gap-sm">
        <SchoolPicker onSelect={onPick} excludeId={child.schoolId} />
        <button type="button" onClick={onCancelPicking} className="text-label text-gray-500 self-start">
          Cancelar
        </button>
      </div>
    )
  }

  if (pendingSchool) {
    return (
      <div className="flex flex-col gap-md p-md rounded-md border border-[#f0c368]" style={{ backgroundColor: '#fff8e6' }}>
        <p className="text-body-small font-medium text-gray-800">Trocar para {pendingSchool.name}?</p>
        <p className="text-caption text-gray-600">
          A educadora responsável atual será removida, já que ela pertence à unidade anterior — a comunicação com ela ficará indisponível até uma nova educadora ser atribuída.
        </p>
        <div className="flex gap-sm">
          <button type="button" onClick={onConfirmChange} disabled={saving} className="flex-1 h-9 rounded-md bg-[#3F51B5] text-white text-label font-semibold disabled:opacity-60">
            {saving ? 'Salvando...' : 'Confirmar troca'}
          </button>
          <button type="button" onClick={onCancelChange} className="flex-1 h-9 rounded-md border border-gray-300 text-gray-600 text-label font-semibold">
            Cancelar
          </button>
        </div>
      </div>
    )
  }

  if (!child.school) {
    return (
      <div className="flex flex-col items-center text-center gap-sm py-lg">
        <div className="w-12 h-12 rounded-md flex items-center justify-center" style={{ backgroundColor: '#eef0fb' }}>
          <SchoolIcon size={22} color="#3F51B5" />
        </div>
        <p className="text-body-small font-semibold text-gray-800">Sem unidade vinculada</p>
        <p className="text-caption text-gray-600 max-w-[260px]">
          Vincule esta criança a uma unidade para acompanhar a educadora responsável e receber comunicações.
        </p>
        <button type="button" onClick={onStartPicking} disabled={saving} className="mt-1.5 h-10 px-lg rounded-md bg-[#3F51B5] text-white text-label font-semibold">
          Vincular unidade
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-md">
      <div className="flex items-center gap-sm p-md rounded-md" style={{ backgroundColor: '#eef0fb' }}>
        <div className="w-10 h-10 rounded-md flex items-center justify-center shrink-0 bg-white">
          <SchoolIcon size={18} color="#3F51B5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-body-small font-medium text-gray-800 truncate">{child.school.name}</p>
          {(child.school.address || child.school.city) && (
            <p className="text-caption text-gray-600 truncate flex items-center gap-1">
              <MapPin size={10} className="shrink-0" />
              {[child.school.address, child.school.city, child.school.state].filter(Boolean).join(', ')}
            </p>
          )}
        </div>
        <button type="button" onClick={onStartPicking} className="text-label font-semibold shrink-0" style={{ color: '#3F51B5' }}>
          Trocar
        </button>
      </div>

      {child.educator ? (
        <div className="flex items-center gap-sm p-md rounded-md" style={{ backgroundColor: '#f3e5f5' }}>
          {child.educator.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={child.educator.photo} alt="" className="w-10 h-10 rounded-pill object-cover shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-pill flex items-center justify-center shrink-0 bg-white">
              <GraduationCap size={18} color="#9C27B0" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-caption text-gray-600">Educadora responsável</p>
            <p className="text-body-small font-medium text-gray-800 truncate">{child.educator.name}</p>
          </div>
          <button
            type="button"
            onClick={onOpenMessages}
            aria-label="Enviar mensagem"
            className="w-9 h-9 rounded-pill flex items-center justify-center shrink-0 bg-white"
          >
            <MessageSquare size={16} color="#9C27B0" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-sm p-md rounded-md border border-dashed border-gray-300">
          <GraduationCap size={16} className="text-gray-500 shrink-0" />
          <p className="text-caption text-gray-600">Ainda sem educadora responsável definida pela unidade.</p>
        </div>
      )}
    </div>
  )
}
