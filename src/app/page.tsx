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
import { JsonLd } from '@/components/JsonLd'
import { homeSchema } from '@/lib/seo'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: { ...OG_BASE, title: SITE.title, description: SITE.description, url: '/' },
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
      <JsonLd data={homeSchema()} />
    </HomeUI>
  )
}
