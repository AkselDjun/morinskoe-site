import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { ViewTransition } from 'react'
import '@fontsource/prata/400.css'
import '@fontsource/golos-text/400.css'
import '@fontsource/golos-text/500.css'
import '@fontsource/golos-text/600.css'
import './globals.css'
import { SITE } from '@/content/site'
import { ConsentProvider } from '@/components/Consent'
import { OG_BASE } from '@/lib/meta'

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s — ${SITE.name}` },
  description: SITE.description,
  openGraph: { ...OG_BASE, title: SITE.title, description: SITE.description },
  twitter: { card: 'summary_large_image' },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  appleWebApp: { title: SITE.name, statusBarStyle: 'black-translucent' },
  formatDetection: { telephone: false, address: false, email: false, date: false },
  ...(SITE.demo ? { robots: { index: false, follow: false } } : {}),
}

export const viewport: Viewport = {
  themeColor: '#1E3328',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" data-scroll-behavior="smooth">
      <body>
        <div className="safe-top" aria-hidden="true" />
        <ConsentProvider>
          <ViewTransition>{children}</ViewTransition>
        </ConsentProvider>
      </body>
    </html>
  )
}
