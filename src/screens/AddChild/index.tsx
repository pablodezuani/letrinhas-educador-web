'use client'

import { useCallback, useRef, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Calendar, Camera, CheckCircle2, Heart, Pencil, User, XCircle } from 'lucide-react'

import { AlertModal, useAlertModal } from '@/components/common'
import { Button, Input, ProgressBar } from '@/components/ui'
import { CHILD_PALETTES, JOURNEY_STEPS } from '@/constants'
import { usePhotoPicker } from '@/hooks'
import { api } from '@/services/api'
import { colors, gradients } from '@/theme'

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
}

const csvField = (value: string[]) => value.join(', ')
const parseCsv = (text: string) => text.split(', ').filter(i => i.trim())

export default function AddChildScreen() {
  const router = useRouter()
  const alert = useAlertModal()
  const { openCamera, openGallery } = usePhotoPicker()
  const [currentStep, setCurrentStep] = useState(1)
  const [childData, setChildData] = useState<ChildFormData>(INITIAL_DATA)
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

  return (
    <div className="min-h-dvh flex flex-col relative" style={{ backgroundImage: `linear-gradient(160deg, ${gradients.primary.join(', ')})` }}>
      <div className="w-full mx-auto" style={{ maxWidth: CONTENT_MAX_WIDTH }}>
        <div className="flex items-center gap-md px-xl pb-md pt-[calc(env(safe-area-inset-top)+10px)]">
          <button type="button" onClick={handleBack} aria-label="Voltar" className="w-9 h-9 rounded-pill bg-white/15 flex items-center justify-center shrink-0 transition-transform active:scale-[0.92]">
            <ArrowLeft size={20} color="white" />
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between mb-1.5">
              <p className="text-white text-[15px] font-semibold truncate">{currentStepData?.title}</p>
              <span className="text-white/60 text-label shrink-0 ml-sm">
                {currentStep}/{JOURNEY_STEPS.length}
              </span>
            </div>
            <ProgressBar value={currentStep} max={JOURNEY_STEPS.length} height={4} color={colors.white} trackColor="rgba(255,255,255,0.15)" aria-label="Progresso do cadastro" />
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-xl pt-sm" style={{ paddingBottom: 110 }}>
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="w-full mx-auto bg-white/8 rounded-xl p-xl border border-white/12"
          style={{ maxWidth: CONTENT_MAX_WIDTH }}
        >
          {currentStep === 1 && <BasicInfoStep childData={childData} set={set} onSelectPhoto={selectPhoto} />}
          {currentStep === 2 && (
            <CategoryStep emoji="👤" title="Informações Pessoais">
              <ElegantTextArea label="Sobre mim" placeholder="Conte sobre a personalidade da criança..." value={childData.aboutMe} onChange={v => set('aboutMe', v)} />
              <ElegantTextArea label="Interesses especiais" placeholder="Quais são os interesses especiais?" value={csvField(childData.specialInterests)} onChange={v => set('specialInterests', parseCsv(v))} />
              <ElegantTextArea label="Rotina" placeholder="Descreva a rotina diária..." value={childData.routine} onChange={v => set('routine', v)} />
              <ElegantTextArea label="Comunicação" placeholder="Como a criança se comunica?" value={childData.communication} onChange={v => set('communication', v)} />
            </CategoryStep>
          )}
          {currentStep === 3 && (
            <CategoryStep emoji="😊" title="Comportamento">
              <ElegantTextArea label="O que gosta" placeholder="O que a criança mais gosta?" value={csvField(childData.likes)} onChange={v => set('likes', parseCsv(v))} />
              <ElegantTextArea label="O que não gosta" placeholder="O que a criança não gosta?" value={csvField(childData.dislikes)} onChange={v => set('dislikes', parseCsv(v))} />
              <ElegantTextArea label="Habilidades" placeholder="Principais habilidades..." value={csvField(childData.skills)} onChange={v => set('skills', parseCsv(v))} />
              <ElegantTextArea label="Necessidades sensoriais" placeholder="Necessidades sensoriais..." value={childData.sensoryNeeds} onChange={v => set('sensoryNeeds', v)} />
            </CategoryStep>
          )}
          {currentStep === 4 && (
            <CategoryStep emoji="🤝" title="Como Ajudar">
              <ElegantTextArea label="Como ajudar" placeholder="Como posso ajudar no dia a dia?" value={childData.howToHelp} onChange={v => set('howToHelp', v)} />
              <ElegantTextArea label="Quando frustrada" placeholder="O que fazer quando frustrada?" value={childData.whenFrustrated} onChange={v => set('whenFrustrated', v)} />
              <ElegantTextArea label="Precisa de atenção" placeholder="Como demonstra que precisa de atenção?" value={childData.whenNeedsAttention} onChange={v => set('whenNeedsAttention', v)} />
              <ElegantTextArea label="Dificuldades" placeholder="Principais dificuldades..." value={csvField(childData.difficulties)} onChange={v => set('difficulties', parseCsv(v))} />
            </CategoryStep>
          )}
          {currentStep === 5 && (
            <CategoryStep emoji="🏥" title="Saúde">
              <ElegantTextArea label="Informações médicas" placeholder="Informações médicas relevantes..." value={childData.medicalInfo} onChange={v => set('medicalInfo', v)} />
              <ElegantTextArea label="Informações TEA" placeholder="Detalhes sobre o TEA..." value={childData.autismInfo} onChange={v => set('autismInfo', v)} />
              <ElegantTextArea label="Medicamentos" placeholder="Medicamentos em uso..." value={csvField(childData.medications)} onChange={v => set('medications', parseCsv(v))} />
              <ElegantTextArea label="Alergias" placeholder="Alergias ou restrições..." value={csvField(childData.allergies)} onChange={v => set('allergies', parseCsv(v))} />
            </CategoryStep>
          )}
        </motion.div>
      </div>

      <div className="fixed left-5 right-5 z-10" style={{ bottom: 'calc(env(safe-area-inset-bottom) + 25px)', maxWidth: CONTENT_MAX_WIDTH, marginInline: 'auto' }}>
        <Button
          label={isLoading ? 'Salvando...' : isLastStep ? 'Finalizar' : 'Continuar'}
          onClick={handleNext}
          disabled={!canProceed()}
          loading={isLoading}
          fullWidth
          size="lg"
          variant="gradient"
          gradient={gradients.success}
          icon={isLastStep ? <CheckCircle2 size={22} /> : <ArrowRight size={22} />}
          iconPosition="right"
        />
      </div>

      <AlertModal visible={alert.state.visible} onClose={alert.hide} title={alert.state.title} message={alert.state.message} variant={alert.state.variant} actions={alert.state.actions} autoHideMs={alert.state.autoHideMs} />
    </div>
  )
}

function CategoryStep({ emoji, title, children }: { emoji: string; title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-white text-[18px] font-semibold mb-5 text-center">
        {emoji} {title}
      </p>
      <div className="w-full flex flex-col gap-lg mb-6">{children}</div>
    </div>
  )
}

function BasicInfoStep({ childData, set, onSelectPhoto }: { childData: ChildFormData; set: <K extends keyof ChildFormData>(key: K, value: ChildFormData[K]) => void; onSelectPhoto: () => void }) {
  return (
    <>
      <div className="flex justify-center mb-xxl">
        <button type="button" onClick={onSelectPhoto} aria-label="Selecionar foto" className="relative w-[90px] h-[90px] rounded-pill overflow-hidden border-2 border-white/30 transition-transform active:scale-[0.96]">
          {childData.photo ? (
            <img src={childData.photo} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="w-full h-full flex items-center justify-center" style={{ backgroundImage: `linear-gradient(135deg, ${gradients.girl.join(', ')})` }}>
              <Camera size={28} color="white" />
            </span>
          )}
          <span className="absolute bottom-0 right-0 w-[26px] h-[26px] rounded-pill bg-black/50 flex items-center justify-center">
            <Pencil size={16} color="white" />
          </span>
        </button>
      </div>

      <div className="flex flex-col gap-none mb-lg">
        <Input tone="dark" label="Nome da criança *" placeholder="Nome completo" value={childData.name} onChange={e => set('name', e.target.value)} icon={<User size={18} color="rgba(255,248,244,0.7)" />} />
        <Input tone="dark" label="Apelido" placeholder="Como ela gosta de ser chamada (opcional)" value={childData.nickname} onChange={e => set('nickname', e.target.value)} icon={<Heart size={18} color="rgba(255,248,244,0.7)" />} />

        <div className="flex gap-md items-start">
          <Input
            tone="dark"
            label="Idade"
            placeholder="Ex: 6"
            value={childData.age}
            onChange={e => set('age', e.target.value.replace(/\D/g, ''))}
            icon={<Calendar size={18} color="rgba(255,248,244,0.7)" />}
            inputMode="numeric"
            containerClassName="flex-1"
          />

          <div className="flex-1 mb-md">
            <p className="text-label mb-xs uppercase tracking-[1.2px] text-[rgba(255,248,244,0.65)]">Gênero</p>
            <div className="flex h-12 rounded-md overflow-hidden border border-white/18">
              <button
                type="button"
                onClick={() => set('gender', 'male')}
                className="flex-1 min-w-0 flex items-center justify-center gap-1 px-1 border-r border-white/18 transition-colors"
                style={{ backgroundColor: childData.gender === 'male' ? colors.boy : 'rgba(255,255,255,0.08)' }}
              >
                <span className="shrink-0 text-[13px]" style={{ color: childData.gender === 'male' ? '#fff' : 'rgba(255,255,255,0.6)' }}>
                  ♂
                </span>
                <span className="text-[11px] font-medium truncate" style={{ color: childData.gender === 'male' ? '#fff' : 'rgba(255,255,255,0.6)' }}>
                  Menino
                </span>
              </button>
              <button
                type="button"
                onClick={() => set('gender', 'female')}
                className="flex-1 min-w-0 flex items-center justify-center gap-1 px-1 transition-colors"
                style={{ backgroundColor: childData.gender === 'female' ? colors.girl : 'rgba(255,255,255,0.08)' }}
              >
                <span className="shrink-0 text-[13px]" style={{ color: childData.gender === 'female' ? '#fff' : 'rgba(255,255,255,0.6)' }}>
                  ♀
                </span>
                <span className="text-[11px] font-medium truncate" style={{ color: childData.gender === 'female' ? '#fff' : 'rgba(255,255,255,0.6)' }}>
                  Menina
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-lg border-t border-white/12">
        <p className="text-white text-[17px] font-semibold mb-3 text-center">Diagnóstico TEA</p>

        <div className="flex flex-col gap-2.5 mb-4">
          <button type="button" onClick={() => set('hasAutism', 'yes')} className="rounded-xl overflow-hidden transition-transform active:scale-[0.98]">
            <span
              className="flex items-center p-3 rounded-xl"
              style={{ backgroundImage: childData.hasAutism === 'yes' ? `linear-gradient(90deg, ${gradients.secondary.join(', ')})` : 'linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))' }}
            >
              <span className="flex items-center bg-black/20 rounded-[11px] p-3 w-full">
                <CheckCircle2 size={22} color={childData.hasAutism === 'yes' ? '#fff' : 'rgba(255,255,255,0.6)'} className="mr-3" />
                <span className="text-[15px] font-medium" style={{ color: childData.hasAutism === 'yes' ? '#fff' : 'rgba(255,255,255,0.8)' }}>
                  Sim, possui TEA
                </span>
              </span>
            </span>
          </button>

          <button type="button" onClick={() => set('hasAutism', 'no')} className="rounded-xl overflow-hidden transition-transform active:scale-[0.98]">
            <span
              className="flex items-center p-3 rounded-xl"
              style={{ backgroundImage: childData.hasAutism === 'no' ? `linear-gradient(90deg, ${gradients.secondary.join(', ')})` : 'linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))' }}
            >
              <span className="flex items-center bg-black/20 rounded-[11px] p-3 w-full">
                <XCircle size={22} color={childData.hasAutism === 'no' ? '#fff' : 'rgba(255,255,255,0.6)'} className="mr-3" />
                <span className="text-[15px] font-medium" style={{ color: childData.hasAutism === 'no' ? '#fff' : 'rgba(255,255,255,0.8)' }}>
                  Não possui TEA
                </span>
              </span>
            </span>
          </button>
        </div>

        {childData.hasAutism === 'yes' && (
          <div>
            <p className="text-white text-[15px] font-medium mb-2.5 text-center">Nível de Suporte</p>
            <div className="flex gap-2">
              {(
                [
                  { key: '1', label: 'Nível 1', desc: 'Apoio', color: colors.teaLevel1 },
                  { key: '2', label: 'Nível 2', desc: 'Apoio substancial', color: colors.teaLevel2 },
                  { key: '3', label: 'Nível 3', desc: 'Apoio muito substancial', color: colors.teaLevel3 },
                ] as const
              ).map(level => (
                <button key={level.key} type="button" onClick={() => set('autismLevel', level.key)} className="flex-1 rounded-[10px] overflow-hidden transition-transform active:scale-[0.97]">
                  <span
                    className="flex flex-col items-center p-3 rounded-[10px] transition-colors"
                    style={{ backgroundColor: childData.autismLevel === level.key ? level.color : 'rgba(255,255,255,0.08)' }}
                  >
                    <span className="w-2.5 h-2.5 rounded-pill mb-1.5" style={{ backgroundColor: childData.autismLevel === level.key ? '#fff' : 'rgba(255,255,255,0.3)' }} />
                    <span className="text-[13px] font-semibold mb-0.5" style={{ color: childData.autismLevel === level.key ? '#fff' : 'rgba(255,255,255,0.8)' }}>
                      {level.label}
                    </span>
                    <span className="text-[10px] text-center" style={{ color: childData.autismLevel === level.key ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.5)' }}>
                      {level.desc}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function ElegantTextArea({ label, placeholder, value, onChange }: { label: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div>
      <p className="text-label mb-xs uppercase tracking-[1.2px] text-[rgba(255,248,244,0.65)]">{label}</p>
      <div
        className="rounded-md border p-3 transition-colors"
        style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderColor: isFocused ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.18)', borderWidth: isFocused ? 1.5 : 1 }}
      >
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          rows={3}
          className="w-full min-h-[70px] bg-transparent outline-none text-white text-[15px] placeholder:text-white/45 resize-none"
        />
      </div>
    </div>
  )
}
