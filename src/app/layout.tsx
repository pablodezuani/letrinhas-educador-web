import type { Metadata, Viewport } from 'next'
import { Nunito, Pacifico } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-nunito',
  display: 'swap',
})

const pacifico = Pacifico({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-pacifico',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Letrinhas Encantadas',
  description: 'Um mundo mágico de palavras — aplicativo de letramento para crianças com TEA.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#305F72',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${nunito.variable} ${pacifico.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
