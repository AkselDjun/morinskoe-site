import type { MetadataRoute } from 'next'
import { SITE } from '@/content/site'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  if (SITE.demo) return { rules: [{ userAgent: '*', disallow: '/' }] }
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  }
}
