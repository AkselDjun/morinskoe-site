import type { Metadata } from 'next'
import { SITE } from '@/content/site'
import { OG_BASE } from '@/lib/meta'
import { HomeUI } from '@/components/HomeUI'
import { Hero, Intro, SideNav } from '@/components/Hero'
import { Chapter1, Chapter2, Chapter3 } from '@/components/Chapters'
import { DayScroller } from '@/components/DayScroller'
import { Faq, Marquee, Services } from '@/components/Sections'
import { Gallery } from '@/components/Gallery'
import { Reviews } from '@/components/Reviews'
import { EstateMap } from '@/components/EstateMap'
import { Book, Footer } from '@/components/Book'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: { ...OG_BASE, title: SITE.title, description: SITE.description, url: '/' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EventVenue',
  name: `Усадьба «${SITE.name}»`,
  description: SITE.description,
  url: SITE.url,
  image: `${SITE.url}/og-image.jpg`,
  telephone: SITE.phone.replace(/[^\d+]/g, ''),
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'аг. Морино, д. 185',
    addressLocality: 'Морино',
    addressRegion: 'Гродненская область, Ивьевский район',
    addressCountry: 'BY',
  },
  geo: { '@type': 'GeoCoordinates', latitude: SITE.geo.lat, longitude: SITE.geo.lng },
  maximumAttendeeCapacity: 200,
  sameAs: [SITE.instagram, SITE.yandexMaps],
}

export default function Home() {
  return (
    <HomeUI>
      <SideNav />
      <div className="page">
        <Hero />
        <main>
          <Intro />
          <Chapter1 />
          <Chapter2 />
          <Chapter3 />
          <DayScroller />
          <Marquee />
          <Services />
          <Gallery />
          <Reviews />
          <Faq />
          <EstateMap />
          <Book />
        </main>
        <Footer />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
    </HomeUI>
  )
}
