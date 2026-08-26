'use client'

import { memo, useCallback, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, CircleHelp, Mail, Search, XCircle } from 'lucide-react'

import { ScreenHeader } from '@/components/common'
import { colors } from '@/theme'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: 'jogos' | 'cadastro' | 'progresso' | 'privacidade'
}

const FAQ: readonly FAQItem[] = [
  { id: '1', category: 'cadastro', question: 'Como cadastro uma criança no app?', answer: 'Na tela inicial toque no botão + (canto inferior direito) e siga as etapas. Você pode adicionar nome, foto, gostos, dificuldades e nível de TEA para que o app adapte melhor a experiência.' },
  { id: '2', category: 'jogos', question: 'Os jogos são adaptados para TEA níveis 1, 2 e 3?', answer: 'Sim. Usamos cores suaves, feedbacks previsíveis e evitamos estímulos bruscos. Quanto maior o nível de suporte cadastrado, mais simples fica a progressão dos jogos.' },
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
    <div className="bg-surface rounded-lg overflow-hidden">
      <button type="button" onClick={() => onToggle(item.id)} aria-expanded={expanded} aria-label={item.question} className="w-full flex items-center gap-md p-md text-left">
        <span className="text-label px-sm py-1 rounded-md bg-surface-alt text-text-secondary shrink-0">{CATEGORY_LABEL[item.category]}</span>
        <span className="flex-1 text-body-small font-medium text-text-primary">{item.question}</span>
        <ChevronDown size={16} color={colors.textMuted} className="shrink-0 transition-transform" style={{ transform: expanded ? 'rotate(180deg)' : 'none' }} />
      </button>

      {expanded && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.25 }} className="px-md pb-md overflow-hidden">
          <p className="text-caption text-text-secondary leading-relaxed">{item.answer}</p>
        </motion.div>
      )}
    </div>
  )
})

export default function HelpSupportScreen() {
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

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <ScreenHeader title="Ajuda e suporte" />

      <div className="flex-1 overflow-y-auto px-xl pb-huge flex flex-col gap-md">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex items-center gap-sm bg-surface-alt border border-divider rounded-md px-md h-11">
          <Search size={16} color={colors.textMuted} />
          <input className="flex-1 bg-transparent outline-none text-body-small text-text-primary placeholder:text-text-muted" value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar pergunta..." />
          {query.length > 0 && (
            <button type="button" onClick={() => setQuery('')} aria-label="Limpar busca">
              <XCircle size={16} color={colors.textMuted} />
            </button>
          )}
        </motion.div>

        <p className="text-label text-text-muted ml-xs mt-sm">Perguntas frequentes</p>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-sm p-xl bg-surface rounded-lg">
            <Search size={28} color={colors.textMuted} />
            <p className="text-body-small font-medium text-text-primary">Nada encontrado</p>
            <p className="text-caption text-text-secondary text-center">Tente outra palavra.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-sm">
            {filtered.map(item => (
              <AccordionItem key={item.id} item={item} expanded={expandedId === item.id} onToggle={handleToggle} />
            ))}
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-surface rounded-lg p-xl flex flex-col items-center gap-sm mt-sm">
          <CircleHelp size={22} color={colors.primary} />
          <p className="text-body-small font-medium text-text-primary">Ainda com dúvida?</p>
          <p className="text-caption text-text-secondary text-center">Nosso time responde em até 48h.</p>
          <button
            type="button"
            onClick={handleEmail}
            aria-label="Enviar email para o suporte"
            className="w-full h-11 rounded-pill border border-primary text-primary flex items-center justify-center gap-sm text-button-small mt-sm"
          >
            <Mail size={16} />
            Enviar email
          </button>
        </motion.div>
      </div>
    </div>
  )
}
