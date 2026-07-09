# letrinhas-educador-web

Versão web (React + Vite) das telas do app mobile [Letrinhas-Encantadas](../Letrinhas-Encantadas), otimizada para ser aberta no navegador do celular.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Navegação via `next/navigation` (`useRouter`); estado que o react-router passaria por `location.state` (ex.: criança selecionada para o hub de jogos) atravessa a navegação via `sessionStorage`, em `src/lib/navState.ts`
- Tailwind CSS v4 (tokens do design system em `src/index.css` via `@theme`, espelhando `src/theme/*.ts`)
- framer-motion (animações)
- lucide-react (ícones)
- axios (`src/services/api.ts`)

## Rodando localmente

```bash
npm install
npm run dev
```

Por padrão a API aponta para o backend de produção (Vercel). Para apontar para um backend local, copie `.env.example` para `.env.local` e ajuste `NEXT_PUBLIC_API_URL`.

## Status

**Fase 1 (concluída):** fundação (tema, auth, rotas), telas de autenticação, Home + lista de crianças, formulário de cadastro de criança (6 etapas), hub de jogos (ChildScreen) e telas de perfil/configurações.

**Fase 2 (pendente):** os 4 mini-jogos (ReadingGame, VowelsGame, WordFormationGame, PhraseBuilder) — atualmente placeholders em `src/components/games/ComingSoon.tsx`. A lógica completa (pontuação, áudio, confete, TTS) ainda precisa ser portada do app React Native.
