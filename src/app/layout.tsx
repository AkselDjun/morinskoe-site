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
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  applicationName: SITE.name,
  appleWebApp: { title: SITE.name, statusBarStyle: 'black-translucent' },
  formatDetection: { telephone: false, address: false, email: false, date: false },
  robots: SITE.demo
    ? { index: false, follow: false }
    : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  verification: {
    ...(SITE.googleVerification ? { google: SITE.googleVerification } : {}),
    ...(SITE.yandexVerification ? { yandex: SITE.yandexVerification } : {}),
  },
  other: {
    'geo.region': 'BY-HR',
    'geo.placename': 'Морино, Ивьевский район, Гродненская область',
    'geo.position': `${SITE.geo.lat};${SITE.geo.lng}`,
    ICBM: `${SITE.geo.lat}, ${SITE.geo.lng}`,
  },
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
