import IMAGES from '@/content/images.json'
import { CH2, FAQ, SERVICES } from '@/content/home'
import { GALLERY } from '@/content/gallery'
import { MAP_POINTS } from '@/content/map'
import { SLIDES } from '@/content/slides'
import { SITE } from '@/content/site'
import { photoSrc } from '@/components/Photo'

const abs = (path: string) => `${SITE.url}${path}`
const HOME = `${SITE.url}/`
const VENUE = `${HOME}#venue`
const WEBSITE = `${HOME}#website`

export function homePhotoKeys() {
  const keys = new Set<string>(['hero_river'])
  Object.values(SLIDES).flat().forEach((s) => keys.add(s.key))
  Object.values(GALLERY).flat().forEach((g) => {
    if (g.type !== 'end') g.photos.forEach((p) => keys.add(p.key))
  })
  MAP_POINTS.forEach((m) => m.photos.forEach((p) => keys.add(p.key)))
  return [...keys].filter((k) => k in IMAGES)
}

export const photoUrl = (k: string) => abs(photoSrc(k, 1600))

const menuPrice = CH2.stats.find((s) => s.label.includes('меню'))?.value.replace(/\s*р$/, ' BYN')

export function homeSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': WEBSITE,
        url: HOME,
        name: SITE.name,
        alternateName: `Усадьба «${SITE.name}»`,
        description: SITE.description,
        inLanguage: 'ru',
        publisher: { '@id': VENUE },
      },
      {
        '@type': ['EventVenue', 'LodgingBusiness'],
        '@id': VENUE,
        name: `Усадьба «${SITE.name}»`,
        description: SITE.description,
        url: HOME,
        telephone: SITE.phone.replace(/[^\d+]/g, ''),
        ...(SITE.email.includes('@') ? { email: SITE.email } : {}),
        logo: abs('/icon-512.png'),
        image: [abs('/og-image.jpg'), ...homePhotoKeys().slice(0, 8).map(photoUrl)],
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'аг. Морино, д. 185',
          addressLocality: 'Морино',
          addressRegion: 'Гродненская область, Ивьевский район',
          addressCountry: 'BY',
        },
        geo: { '@type': 'GeoCoordinates', latitude: SITE.geo.lat, longitude: SITE.geo.lng },
        hasMap: SITE.yandexMaps,
        sameAs: [SITE.instagram, SITE.yandexMaps],
        maximumAttendeeCapacity: 200,
        ...(menuPrice ? { priceRange: `Меню ${menuPrice} на гостя` } : {}),
        currenciesAccepted: 'BYN',
        amenityFeature: SERVICES.items.map((s) => ({ '@type': 'LocationFeatureSpecification', name: s.title, value: true })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${HOME}#faq`,
        isPartOf: { '@id': WEBSITE },
        inLanguage: 'ru',
        mainEntity: FAQ.items.map((it) => ({
          '@type': 'Question',
          name: it.q,
          acceptedAnswer: { '@type': 'Answer', text: it.a },
        })),
      },
    ],
  }
}

export function breadcrumbSchema(name: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: HOME },
      { '@type': 'ListItem', position: 2, name, item: abs(path) },
    ],
  }
}
