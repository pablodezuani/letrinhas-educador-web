import axios from 'axios'

// Aponta para o backend em produção por padrão — o app é aberto no navegador
// do celular, então não há como alcançar um host local tipo 10.0.2.2.
// Sobrescreva com NEXT_PUBLIC_API_URL em .env.local para apontar para um backend local.
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'https://letrinhas-encantadas-back.vercel.app',
  timeout: 10000,
})

export { api }
