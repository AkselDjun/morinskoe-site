import type { MetadataRoute } from 'next'
import { SITE } from '@/content/site'
import { homePhotoKeys, photoUrl } from '@/lib/seo'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: 'monthly', priority: 1, images: homePhotoKeys().map(photoUrl) },
    { url: `${SITE.url}/privacy/`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ]
}
