import { memo, useCallback, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp, CircleHelp, Mail, MessagesSquare, Search, XCircle } from 'lucide-react'

import { AlertModal, ScreenHeader, useAlertModal } from '@/components/common'
import { colors, gradients } from '@/theme'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: 'jogos' | 'cadastro' | 'progresso' | 'privacidade'
}

const FAQ: readonly FAQItem[] = [
  { id: '1', category: 'cadastro', question: 'Como cadastro uma criança no app?', answer: 'Na tela inicial toque no botão + (canto inferior direito) e siga as etapas. Você pode adicionar nome, foto, gostos, dificuldades e nível de TEA para que o app adapte melhor a experiência.' },
  { id: '2', category: 'jogos', question: 'Os jogos são adaptados para TEA níveis 1, 2 e 3?', answer: 'Sim. Usamos cores suaves, fontes arredondadas, feedbacks previsíveis e evitamos estímulos bruscos. Quanto maior o nível de suporte cadastrado, mais simples fica a progressão dos jogos.' },
  { id: '3', category: 'progresso', question: 'Como vejo o progresso da criança?', answer: 'Toque no card da criança na tela inicial para ver conquistas, atividades recentes, rotina e anotações. Na Home também aparecem estatísticas gerais no topo.' },
  { id: '4', category: 'jogos', question: 'Posso desativar os sons dos mini-jogos?', answer: 'Pode! Em Configurações, na seção Permissões, desative a opção "Som do app". Isso remove todos os efeitos sonoros dos jogos.' },
  { id: '5', category: 'privacidade', question: 'Meus dados e os da criança ficam seguros?', answer: 'Sim. Usamos armazenamento seguro no dispositivo e autenticação por token. Não compartilhamos dados com terceiros e o app é livre de publicidade.' },
  { id: '6', category: 'cadastro', question: 'Esqueci minha senha. O que faço?', answer: 'Na tela de login, toque em "Esqueci minha senha" e informe o email cadastrado. Enviaremos um link para redefinir.' },
  { id: '7', category: 'progresso', question: 'Posso ter mais de uma criança no mesmo perfil?', answer: 'Sim. Cadastre quantas crianças precisar. Cada uma terá seu próprio acompanhamento, rotina e conquistas.' },
  { id: '8', category: 'jogos', question: 'O que fazer se a criança ficar frustrada no jogo?', answer: 'Todos os jogos têm saída fácil (botão voltar sempre visível) e pausas entre tentativas. No cadastro da criança você pode anotar "o que fazer quando frustrada" para lembrar estratégias.' },
]

const CATEGORY_LABEL: Record<FAQItem['category'], string> = {
  jogos: 'Jogos',
  cadastro: 'Cadastro',
  progresso: 'Progresso',
  privacidade: 'Privacidade',
}

const AccordionItem = memo(function AccordionItem({ item, expanded, onToggle }: { item: FAQItem; expanded: boolean; onToggle: (id: string) => void }) {
  return (
    <div className="bg-surface rounded-lg overflow-hidden shadow-sm">
      <button type="button" onClick={() => onToggle(item.id)} aria-expanded={expanded} aria-label={item.question} className="w-full flex items-center p-md gap-md text-left">
        <div className="w-[38px] h-[38px] rounded-pill bg-info-light flex items-center justify-center shrink-0">
          <CircleHelp size={22} color={colors.primary} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-caption font-bold uppercase tracking-[0.8px]" style={{ color: colors.primaryLight }}>
            {CATEGORY_LABEL[item.category]}
          </p>
          <p className="text-subtitle text-text-primary mt-0.5">{item.question}</p>
        </div>
        {expanded ? <ChevronUp size={20} color={colors.textSecondary} /> : <ChevronDown size={20} color={colors.textSecondary} />}
      </button>

      {expanded && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.25 }} className="px-lg pb-lg overflow-hidden">
          <p className="text-body text-text-secondary">{item.answer}</p>
        </motion.div>
      )}
    </div>
  )
})

export default function HelpSupportScreen() {
  const alert = useAlertModal()
  const [query, setQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return FAQ
    return FAQ.filter(item => item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q) || CATEGORY_LABEL[item.category].toLowerCase().includes(q))
  }, [query])

  const handleToggle = useCallback((id: string) => {
    setExpandedId(prev => (prev === id ? null : id))
  }, [])

  const handleEmail = useCallback(() => {
    window.location.href = 'mailto:suporte@letrinhasencantadas.app?subject=Ajuda%20no%20app%20Letrinhas%20Encantadas'
  }, [])

  const handleFeedback = useCallback(() => {
    alert.showSuccess('Obrigado! Em breve teremos o envio de feedback direto pelo app.', 'Valeu!')
  }, [alert])

  return (
    <div className="min-h-dvh flex flex-col" style={{ backgroundImage: `linear-gradient(180deg, ${gradients.soft.join(', ')})` }}>
      <ScreenHeader title="Ajuda e suporte" subtitle="Tire suas dúvidas sobre o app" />

      <div className="flex-1 overflow-y-auto p-xl pb-huge flex flex-col gap-md">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex items-center gap-sm bg-surface rounded-md px-md h-[46px] shadow-sm">
          <Search size={18} color={colors.textSecondary} />
          <input className="flex-1 bg-transparent outline-none text-body text-text-primary placeholder:text-text-muted" value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar pergunta..." />
          {query.length > 0 && (
            <button type="button" onClick={() => setQuery('')} aria-label="Limpar busca">
              <XCircle size={18} color={colors.textMuted} />
            </button>
          )}
        </motion.div>

        <p className="text-label text-text-secondary ml-xs mt-sm">Perguntas frequentes</p>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-sm p-xl bg-surface rounded-lg">
            <Search size={32} color={colors.textMuted} />
            <p className="text-subtitle text-text-primary">Nada encontrado</p>
            <p className="text-caption text-text-secondary text-center">Tente outra palavra ou entre em contato conosco.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-sm">
            {filtered.map(item => (
              <AccordionItem key={item.id} item={item} expanded={expandedId === item.id} onToggle={handleToggle} />
            ))}
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="rounded-xl overflow-hidden shadow-lg mt-md">
          <div className="flex flex-col items-center p-xl" style={{ backgroundImage: `linear-gradient(135deg, ${gradients.accent.join(', ')})` }}>
            <div className="w-[60px] h-[60px] rounded-pill bg-white/22 flex items-center justify-center mb-md">
              <MessagesSquare size={28} color={colors.white} />
            </div>
            <h2 className="text-h2 text-white text-center">Ainda com dúvida?</h2>
            <p className="text-body text-white/92 text-center mt-xs mb-lg">Nosso time responde em até 48h. Fale com a gente!</p>

            <button type="button" onClick={handleEmail} aria-label="Enviar email para o suporte" className="w-full flex items-center justify-center gap-sm bg-white px-xl py-md rounded-pill">
              <Mail size={18} color={colors.accent} />
              <span className="text-button text-accent">Enviar email</span>
            </button>

            <button type="button" onClick={handleFeedback} aria-label="Enviar feedback" className="mt-sm py-sm">
              <span className="text-caption text-white/92 font-bold">Enviar feedback</span>
            </button>
          </div>
        </motion.div>
      </div>

      <AlertModal visible={alert.state.visible} onClose={alert.hide} title={alert.state.title} message={alert.state.message} variant={alert.state.variant} actions={alert.state.actions} autoHideMs={alert.state.autoHideMs} />
    </div>
  )
}
