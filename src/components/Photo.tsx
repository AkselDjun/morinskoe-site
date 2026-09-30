import type { CSSProperties } from 'react'
import IMAGES from '@/content/images.json'
import { PHOTOS } from '@/content/photos'

type Meta = { w: number[]; ratio: number }
const LIST = IMAGES as Record<string, Meta>

type Props = {
  k: string
  sizes: string
  pos?: string
  alt?: string
  className?: string
  eager?: boolean
  priority?: boolean
  hidden?: boolean
  style?: CSSProperties
}

export function photoSrc(k: string, width = 800) {
  const meta = LIST[k]
  if (!meta) return ''
  const w = meta.w.filter((x) => x <= width).pop() ?? meta.w[0]
  return `/img/${k}-${w}.webp`
}

export type Box = [number | null, number, number]

export function coverSizes(k: string, boxes: Box[]) {
  const ratio = LIST[k]?.ratio ?? 1.5
  return boxes.map(([mw, w, h]) => {
    const need = Math.ceil(Math.max(w, h * ratio))
    return mw ? `(min-width: ${mw}px) ${need}px` : `${need}px`
  }).join(', ')
}

const set = (k: string, meta: Meta, fmt: 'avif' | 'webp') => meta.w.map((w) => `/img/${k}-${w}.${fmt} ${w}w`).join(', ')

export function Photo({ k, sizes, pos, alt, className, eager, priority, hidden, style }: Props) {
  const meta = LIST[k]
  if (!meta) return null
  return (
    <picture>
      <source type="image/avif" srcSet={set(k, meta, 'avif')} sizes={sizes} />
      <img
        className={className}
        src={photoSrc(k)}
        srcSet={set(k, meta, 'webp')}
        sizes={sizes}
        alt={hidden ? '' : alt ?? PHOTOS[k]?.alt ?? ''}
        aria-hidden={hidden || undefined}
        loading={eager || priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : undefined}
        style={{ objectPosition: pos ?? PHOTOS[k]?.pos, ...style }}
      />
    </picture>
  )
}
