import type { Metadata } from 'next'
import { Playfair_Display, Crimson_Pro, DM_Mono } from 'next/font/google'
import './globals.css'
import SharkChat from '@/components/SharkChat'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
})

const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-crimson',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-dm-mono',
})

export const metadata: Metadata = {
  title: {
    default: 'Identificación de Tiburones',
    template: '%s — Identificación de Tiburones',
  },
  description:
    'La guía de identificación de tiburones más completa en español. 518 especies, 103 géneros, 35 familias, 8 órdenes.',
  openGraph: {
    siteName: 'Identificación de Tiburones',
    type: 'website',
    locale: 'es_ES',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${crimsonPro.variable} ${dmMono.variable}`}
    >
      <body>
        {children}
        <SharkChat />
      </body>
    </html>
  )
}
