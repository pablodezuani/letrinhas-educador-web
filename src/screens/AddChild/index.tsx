'use client'

import { useCallback, useRef, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Camera, Check, CheckCircle2, MapPin, School as SchoolIcon, X } from 'lucide-react'

import { AlertModal, useAlertModal } from '@/components/common'
import { SchoolPicker } from '@/components/school/SchoolPicker'
import { CHILD_PALETTES, JOURNEY_STEPS } from '@/constants'
import { usePhotoPicker } from '@/hooks'
import { api } from '@/services/api'
import { colors } from '@/theme'
import type { School } from '@/lib/types'

const CONTENT_MAX_WIDTH = 480

interface ChildFormData {
  name: string
  nickname: string
  age: string
  gender: string
  photo: string | null
  hasAutism: '' | 'yes' | 'no'
  autismLevel: '' | '1' | '2' | '3'
  aboutMe: string
  specialInterests: string[]
  routine: string
  communication: string
  likes: string[]
  dislikes: string[]
  skills: string[]
  sensoryNeeds: string
  howToHelp: string
  whenFrustrated: string
  whenNeedsAttention: string
  difficulties: string[]
  medicalInfo: string
  autismInfo: string
  medications: string[]
  allergies: string[]
  schoolId: string | null
}

const INITIAL_DATA: ChildFormData = {
  name: '',
  nickname: '',
  age: '',
  gender: '',
  photo: null,
  hasAutism: '',
  autismLevel: '',
  aboutMe: '',
  specialInterests: [],
  routine: '',
  communication: '',
  likes: [],
  dislikes: [],
  skills: [],
  sensoryNeeds: '',
  howToHelp: '',
  whenFrustrated: '',
  whenNeedsAttention: '',
  difficulties: [],
  medicalInfo: '',
  autismInfo: '',
  medications: [],
  allergies: [],
  schoolId: null,
}

const csvField = (value: string[]) => value.join(', ')
const parseCsv = (text: string) => text.split(', ').filter(i => i.trim())

const NEXT_STEPS_HINT = JOURNEY_STEPS.slice(1)
  .map(s => s.title)
  .join(' · ')

export default function AddChildScreen() {
  const router = useRouter()
  const alert = useAlertModal()
  const { openCamera, openGallery } = usePhotoPicker()
  const [currentStep, setCurrentStep] = useState(1)
  const [childData, setChildData] = useState<ChildFormData>(INITIAL_DATA)
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
  const [pickingSchool, setPickingSchool] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const set = useCallback(<K extends keyof ChildFormData>(key: K, value: ChildFormData[K]) => {
    setChildData(prev => ({ ...prev, [key]: value }))
  }, [])

  const canProceed = useCallback(() => {
    if (currentStep !== 1) return true
    const hasName = childData.name.trim().length > 0
    const hasAutismChoice = childData.hasAutism !== ''
    const hasLevelIfNeeded = childData.hasAutism === 'no' || (childData.hasAutism === 'yes' && childData.autismLevel !== '')
    return hasName && hasAutismChoice && hasLevelIfNeeded
  }, [currentStep, childData])

  const handleNext = useCallback(async () => {
    if (currentStep === 1) {
      if (!childData.name.trim()) {
        alert.showWarning('Por favor, preencha o nome da criança.', 'Atenção')
        return
      }
      if (!childData.hasAutism) {
        alert.showWarning('Por favor, informe se a criança possui diagnóstico de TEA.', 'Atenção')
        return
      }
      if (childData.hasAutism === 'yes' && !childData.autismLevel) {
        alert.showWarning('Por favor, selecione o nível de suporte TEA.', 'Atenção')
        return
      }
    }

    if (currentStep < JOURNEY_STEPS.length) {
      setCurrentStep(prev => prev + 1)
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setIsLoading(true)
    try {
      const palette = CHILD_PALETTES[Math.floor(Math.random() * CHILD_PALETTES.length)]
      await api.post('/children', {
        ...childData,
        age: childData.age ? parseInt(childData.age, 10) : undefined,
        color: palette.color,
        lightColor: palette.lightColor,
        emoji: palette.emoji,
      })
      alert.show({
        title: 'Parabéns! 🎉',
        message: 'Perfil da criança criado com sucesso!',
        variant: 'success',
        actions: [{ label: 'Finalizar', variant: 'primary', onPress: () => router.back() }],
      })
    } catch (err: any) {
      alert.showError(err?.response?.data?.error || 'Não foi possível salvar. Tente novamente.', 'Erro')
    } finally {
      setIsLoading(false)
    }
  }, [currentStep, childData, alert, router])

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    } else {
      router.back()
    }
  }, [currentStep, router])

  const handlePickResult = useCallback(
    (uri: string | null, error?: 'permission-denied' | 'unknown') => {
      if (error === 'permission-denied') {
        alert.showWarning('Precisamos da sua permissão para acessar a câmera ou galeria. Habilite nas configurações do navegador.', 'Permissão necessária')
        return
      }
      if (error === 'unknown') {
        alert.showError('Não foi possível abrir agora. Tente novamente.', 'Ops!')
        return
      }
      if (uri) set('photo', uri)
    },
    [alert, set],
  )

  const selectPhoto = useCallback(() => {
    alert.show({
      title: 'Selecionar foto',
      message: 'Escolha de onde você quer pegar a foto da criança.',
      variant: 'info',
      actions: [
        {
          label: 'Câmera',
          variant: 'primary',
          onPress: async () => {
            const res = await openCamera()
            handlePickResult(res.uri, res.error)
          },
        },
        {
          label: 'Galeria',
          variant: 'secondary',
          onPress: async () => {
            const res = await openGallery()
            handlePickResult(res.uri, res.error)
          },
        },
        { label: 'Cancelar', variant: 'ghost' },
      ],
    })
  }, [alert, openCamera, openGallery, handlePickResult])

  const currentStepData = JOURNEY_STEPS.find(step => step.id === currentStep)
  const isLastStep = currentStep === JOURNEY_STEPS.length
  const progressPct = Math.round((currentStep / JOURNEY_STEPS.length) * 100)

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <div className="w-full mx-auto" style={{ maxWidth: CONTENT_MAX_WIDTH }}>
        <div className="flex items-center gap-md px-xl pb-md pt-[calc(env(safe-area-inset-top)+16px)]">
          <button type="button" onClick={handleBack} aria-label="Voltar" className="w-9 h-9 rounded-pill bg-surface border border-border flex items-center justify-center shrink-0 text-text-primary transition-transform active:scale-[0.92]">
            <ArrowLeft size={16} />
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between mb-1.5">
              <p className="text-body-small font-medium text-text-primary truncate">{currentStepData?.title}</p>
              <span className="text-label text-text-muted shrink-0 ml-sm">
                {currentStep}/{JOURNEY_STEPS.length}
              </span>
            </div>
            <div className="h-1 rounded-pill bg-surface-alt overflow-hidden">
              <div className="h-full rounded-pill bg-primary transition-[width]" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-xl pt-sm" style={{ paddingBottom: 110 }}>
        <motion.div key={currentStep} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }} className="w-full mx-auto bg-surface rounded-lg p-xl" style={{ maxWidth: CONTENT_MAX_WIDTH }}>
          {currentStep === 1 && <BasicInfoStep childData={childData} set={set} onSelectPhoto={selectPhoto} />}
          {currentStep === 2 && (
            <SchoolStep
              schoolId={childData.schoolId}
              selectedSchool={selectedSchool}
              picking={pickingSchool}
              onStartPicking={() => setPickingSchool(true)}
              onCancelPicking={() => setPickingSchool(false)}
              onSelect={school => {
                set('schoolId', school.id)
                setSelectedSchool(school)
                setPickingSchool(false)
              }}
              onClear={() => {
                set('schoolId', null)
                setSelectedSchool(null)
              }}
            />
          )}
          {currentStep === 3 && (
            <CategoryStep title="Informações pessoais">
              <FieldTextArea label="Sobre mim" placeholder="Conte sobre a personalidade da criança..." value={childData.aboutMe} onChange={v => set('aboutMe', v)} />
              <FieldTextArea label="Interesses especiais" placeholder="Quais são os interesses especiais?" value={csvField(childData.specialInterests)} onChange={v => set('specialInterests', parseCsv(v))} />
              <FieldTextArea label="Rotina" placeholder="Descreva a rotina diária..." value={childData.routine} onChange={v => set('routine', v)} />
              <FieldTextArea label="Comunicação" placeholder="Como a criança se comunica?" value={childData.communication} onChange={v => set('communication', v)} />
            </CategoryStep>
          )}
          {currentStep === 4 && (
            <CategoryStep title="Comportamento">
              <FieldTextArea label="O que gosta" placeholder="O que a criança mais gosta?" value={csvField(childData.likes)} onChange={v => set('likes', parseCsv(v))} />
              <FieldTextArea label="O que não gosta" placeholder="O que a criança não gosta?" value={csvField(childData.dislikes)} onChange={v => set('dislikes', parseCsv(v))} />
              <FieldTextArea label="Habilidades" placeholder="Principais habilidades..." value={csvField(childData.skills)} onChange={v => set('skills', parseCsv(v))} />
              <FieldTextArea label="Necessidades sensoriais" placeholder="Necessidades sensoriais..." value={childData.sensoryNeeds} onChange={v => set('sensoryNeeds', v)} />
            </CategoryStep>
          )}
          {currentStep === 5 && (
            <CategoryStep title="Como ajudar">
              <FieldTextArea label="Como ajudar" placeholder="Como posso ajudar no dia a dia?" value={childData.howToHelp} onChange={v => set('howToHelp', v)} />
              <FieldTextArea label="Quando frustrada" placeholder="O que fazer quando frustrada?" value={childData.whenFrustrated} onChange={v => set('whenFrustrated', v)} />
              <FieldTextArea label="Precisa de atenção" placeholder="Como demonstra que precisa de atenção?" value={childData.whenNeedsAttention} onChange={v => set('whenNeedsAttention', v)} />
              <FieldTextArea label="Dificuldades" placeholder="Principais dificuldades..." value={csvField(childData.difficulties)} onChange={v => set('difficulties', parseCsv(v))} />
            </CategoryStep>
          )}
          {currentStep === 6 && (
            <CategoryStep title="Saúde">
              <FieldTextArea label="Informações médicas" placeholder="Informações médicas relevantes..." value={childData.medicalInfo} onChange={v => set('medicalInfo', v)} />
              <FieldTextArea label="Informações TEA" placeholder="Detalhes sobre o TEA..." value={childData.autismInfo} onChange={v => set('autismInfo', v)} />
              <FieldTextArea label="Medicamentos" placeholder="Medicamentos em uso..." value={csvField(childData.medications)} onChange={v => set('medications', parseCsv(v))} />
              <FieldTextArea label="Alergias" placeholder="Alergias ou restrições..." value={csvField(childData.allergies)} onChange={v => set('allergies', parseCsv(v))} />
            </CategoryStep>
          )}
        </motion.div>
      </div>

      <div className="fixed left-5 right-5 z-10" style={{ bottom: 'calc(env(safe-area-inset-bottom) + 25px)', maxWidth: CONTENT_MAX_WIDTH, marginInline: 'auto' }}>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed() || isLoading}
          className="w-full h-[52px] rounded-pill border border-primary text-primary bg-background flex items-center justify-center gap-sm text-button transition-transform active:scale-[0.98] disabled:opacity-45"
        >
          {isLoading ? 'Salvando...' : isLastStep ? 'Finalizar' : 'Continuar'}
          {!isLoading && (isLastStep ? <CheckCircle2 size={20} /> : <ArrowRight size={20} />)}
        </button>
        {!isLastStep && <p className="text-center text-label text-text-disabled mt-sm">Próximas etapas: {NEXT_STEPS_HINT}</p>}
      </div>

      <AlertModal visible={alert.state.visible} onClose={alert.hide} title={alert.state.title} message={alert.state.message} variant={alert.state.variant} actions={alert.state.actions} autoHideMs={alert.state.autoHideMs} />
    </div>
  )
}

function SchoolStep({
  schoolId,
  selectedSchool,
  picking,
  onStartPicking,
  onCancelPicking,
  onSelect,
  onClear,
}: {
  schoolId: string | null
  selectedSchool: School | null
  picking: boolean
  onStartPicking: () => void
  onCancelPicking: () => void
  onSelect: (school: School) => void
  onClear: () => void
}) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-subtitle text-text-primary mb-1.5 text-center">A criança pertence a uma unidade?</p>
      <p className="text-caption text-text-muted mb-lg text-center max-w-[320px]">
        Se a criança já frequenta uma escola ou unidade parceira, você pode vinculá-la agora — ou fazer isso depois, sem problema.
      </p>

      <div className="w-full flex flex-col gap-md">
        {!schoolId && !picking && (
          <div className="flex gap-sm">
            <button
              type="button"
              onClick={onStartPicking}
              className="flex-1 flex items-center gap-sm p-md rounded-md border-[1.5px] text-left transition-colors"
              style={{ borderColor: colors.primary, backgroundColor: colors.primarySoft }}
            >
              <Check size={16} color={colors.primaryLight} />
              <span className="text-body-small font-medium text-text-primary">Sim, buscar unidade</span>
            </button>
            <button
              type="button"
              onClick={onClear}
              className="flex-1 flex items-center gap-sm p-md rounded-md border-[1.5px] text-left transition-colors"
              style={{ borderColor: colors.divider, backgroundColor: 'transparent' }}
            >
              <X size={16} className="text-text-muted" />
              <span className="text-body-small font-medium text-text-secondary">Não, por enquanto</span>
            </button>
          </div>
        )}

        {picking && (
          <div className="flex flex-col gap-sm">
            <SchoolPicker onSelect={onSelect} />
            <button type="button" onClick={onCancelPicking} className="text-label text-text-muted self-start">
              Cancelar busca
            </button>
          </div>
        )}

        {schoolId && selectedSchool && !picking && (
          <div className="flex items-center gap-sm p-md rounded-md border-[1.5px]" style={{ borderColor: colors.primary, backgroundColor: colors.primarySoft }}>
            <div className="w-10 h-10 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: colors.surface }}>
              <SchoolIcon size={18} color={colors.primaryLight} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-body-small font-medium text-text-primary truncate">{selectedSchool.name}</p>
              {(selectedSchool.address || selectedSchool.city) && (
                <p className="text-label text-text-muted truncate flex items-center gap-1">
                  <MapPin size={10} className="shrink-0" />
                  {[selectedSchool.address, selectedSchool.city, selectedSchool.state].filter(Boolean).join(', ')}
                </p>
              )}
            </div>
            <button type="button" onClick={onClear} aria-label="Remover unidade selecionada" className="shrink-0 text-text-muted">
              <X size={16} />
            </button>
          </div>
        )}

        {schoolId && !selectedSchool && !picking && (
          <div className="flex items-center justify-between gap-sm p-md rounded-md border border-divider">
            <span className="text-body-small text-text-secondary">Unidade vinculada.</span>
            <button type="button" onClick={onClear} className="text-label text-primary-light">
              Remover
            </button>
          </div>
        )}

        <p className="text-label text-text-disabled text-center mt-1">
          Você pode vincular, trocar ou remover a unidade depois, a qualquer momento.
        </p>
      </div>
    </div>
  )
}

function CategoryStep({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-subtitle text-text-primary mb-lg text-center">{title}</p>
      <div className="w-full flex flex-col gap-lg mb-1">{children}</div>
    </div>
  )
}

function BasicInfoStep({ childData, set, onSelectPhoto }: { childData: ChildFormData; set: <K extends keyof ChildFormData>(key: K, value: ChildFormData[K]) => void; onSelectPhoto: () => void }) {
  return (
    <>
      <div className="flex justify-center mb-xl">
        <button type="button" onClick={onSelectPhoto} aria-label="Selecionar foto" className="relative w-[88px] h-[88px] transition-transform active:scale-[0.96]">
          <span className="block w-full h-full rounded-pill overflow-hidden bg-primary-soft flex items-center justify-center">
            {childData.photo ? <img src={childData.photo} alt="" className="w-full h-full object-cover" /> : <Camera size={26} className="text-primary-light" />}
          </span>
          <span className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-pill bg-primary flex items-center justify-center">
            <Camera size={12} color={colors.textOnPrimary} />
          </span>
        </button>
      </div>

      <div className="flex flex-col gap-lg mb-lg">
        <div className="flex flex-col gap-1.5">
          <label className="text-caption text-text-secondary">Nome da criança *</label>
          <input
            className="bg-surface-alt border border-divider rounded-md px-md py-sm text-body text-text-primary outline-none focus-visible:border-primary"
            placeholder="Ex: Maria Eduarda"
            value={childData.name}
            onChange={e => set('name', e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-caption text-text-secondary">Apelido (opcional)</label>
          <input
            className="bg-surface-alt border border-divider rounded-md px-md py-sm text-body text-text-primary outline-none focus-visible:border-primary"
            placeholder="Ex: Mari"
            value={childData.nickname}
            onChange={e => set('nickname', e.target.value)}
          />
        </div>

        <div className="flex gap-md">
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-caption text-text-secondary">Idade</label>
            <input
              className="bg-surface-alt border border-divider rounded-md px-md py-sm text-body text-text-primary outline-none focus-visible:border-primary"
              placeholder="7"
              inputMode="numeric"
              value={childData.age}
              onChange={e => set('age', e.target.value.replace(/\D/g, ''))}
            />
          </div>

          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-caption text-text-secondary">Gênero</label>
            <div className="h-9 flex rounded-md border border-divider overflow-hidden">
              <button
                type="button"
                onClick={() => set('gender', 'male')}
                className="flex-1 flex items-center justify-center text-label font-medium"
                style={childData.gender === 'male' ? { backgroundColor: colors.primary, color: colors.textOnPrimary } : { color: colors.textSecondary }}
              >
                Menino
              </button>
              <button
                type="button"
                onClick={() => set('gender', 'female')}
                className="flex-1 flex items-center justify-center text-label font-medium border-l border-divider"
                style={childData.gender === 'female' ? { backgroundColor: colors.primary, color: colors.textOnPrimary } : { color: colors.textSecondary }}
              >
                Menina
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-sm">
        <span className="text-caption font-medium text-text-secondary">Diagnóstico TEA</span>
        <div className="flex gap-sm">
          <button
            type="button"
            onClick={() => set('hasAutism', 'yes')}
            className="flex-1 flex items-center gap-sm p-md rounded-md border-[1.5px] text-left transition-colors"
            style={childData.hasAutism === 'yes' ? { borderColor: colors.primary, backgroundColor: colors.primarySoft } : { borderColor: colors.divider, backgroundColor: 'transparent' }}
          >
            <Check size={16} color={childData.hasAutism === 'yes' ? colors.primaryLight : colors.textMuted} />
            <span className="text-body-small font-medium" style={{ color: childData.hasAutism === 'yes' ? colors.textPrimary : colors.textSecondary }}>
              Possui TEA
            </span>
          </button>
          <button
            type="button"
            onClick={() => set('hasAutism', 'no')}
            className="flex-1 flex items-center gap-sm p-md rounded-md border-[1.5px] text-left transition-colors"
            style={childData.hasAutism === 'no' ? { borderColor: colors.primary, backgroundColor: colors.primarySoft } : { borderColor: colors.divider, backgroundColor: 'transparent' }}
          >
            <X size={16} color={childData.hasAutism === 'no' ? colors.primaryLight : colors.textMuted} />
            <span className="text-body-small font-medium" style={{ color: childData.hasAutism === 'no' ? colors.textPrimary : colors.textSecondary }}>
              Não possui
            </span>
          </button>
        </div>

        {childData.hasAutism === 'yes' && (
          <div className="flex flex-col gap-sm mt-1">
            <span className="text-caption text-text-muted">Nível de suporte</span>
            <div className="flex gap-sm">
              {(
                [
                  { key: '1', label: 'Nível 1', desc: 'Apoio', color: colors.teaLevel1 },
                  { key: '2', label: 'Nível 2', desc: 'Substancial', color: colors.teaLevel2 },
                  { key: '3', label: 'Nível 3', desc: 'Muito subst.', color: colors.teaLevel3 },
                ] as const
              ).map(level => {
                const active = childData.autismLevel === level.key
                return (
                  <button
                    key={level.key}
                    type="button"
                    onClick={() => set('autismLevel', level.key)}
                    className="flex-1 flex flex-col items-center gap-1 p-sm rounded-md border-[1.5px]"
                    style={{ borderColor: active ? level.color : colors.divider }}
                  >
                    <span className="w-2 h-2 rounded-pill" style={{ backgroundColor: level.color }} />
                    <span className="text-caption font-semibold" style={{ color: active ? colors.textPrimary : colors.textSecondary }}>
                      {level.label}
                    </span>
                    <span className="text-label text-text-muted">{level.desc}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function FieldTextArea({ label, placeholder, value, onChange }: { label: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-caption text-text-secondary">{label}</label>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={3}
        className="bg-surface-alt border border-divider rounded-md px-md py-sm text-body text-text-primary outline-none resize-none focus-visible:border-primary"
      />
    </div>
  )
}
