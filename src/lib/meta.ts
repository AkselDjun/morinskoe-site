import { SITE } from '@/content/site'

export const OG_BASE = {
  type: 'website' as const,
  locale: 'ru_RU',
  siteName: SITE.name,
  images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Утренний туман над Неманом, ветви дуба и ступени к воде — усадьба «Моринское»' }],
}
