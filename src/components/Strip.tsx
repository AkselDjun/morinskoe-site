'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import type { Shot } from '@/content/types'
import { useSwipe } from '@/lib/swipe'
import { Icon } from './icons'
import { Photo, coverSizes } from './Photo'

const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect

export function Arrows({ gi, last, go }: { gi: number; last: number; go: (d: number) => void }) {
  return (
    <div className="arrows">
      <button className="arr prev" type="button" aria-label="Предыдущие фото" disabled={gi === 0} onClick={() => go(-1)}>
        <Icon name="chevL" size={20} sw={1.8} />
      </button>
      <button className="arr next" type="button" aria-label="Следующие фото" disabled={gi >= last} onClick={() => go(1)}>
        <Icon name="chevR" size={20} sw={1.8} />
      </button>
    </div>
  )
}

export function Bar({ value }: { value: number }) {
  return (
    <div className="g-bar" aria-hidden="true">
      <i style={{ width: `${value}%` }} />
    </div>
  )
}

export function useStrip(reset: unknown) {
  const [gi, setGi] = useState(0)
  const [stops, setStops] = useState<number[]>([0])
  const track = useRef<HTMLDivElement>(null)
  const vp = useRef<HTMLDivElement>(null)

  const measure = useCallback(() => {
    const t = track.current
    const v = vp.current
    if (!t || !v) return
    const max = Math.max(0, t.scrollWidth - v.clientWidth)
    const next: number[] = []
    Array.from(t.children).forEach((c) => {
      const x = Math.min((c as HTMLElement).offsetLeft, max)
      if (!next.includes(x)) next.push(x)
    })
    setStops(next.length ? next : [0])
  }, [])

  useIso(() => {
    setGi(0)
    measure()
  }, [reset, measure])

  useEffect(() => {
    const v = vp.current
    if (!v) return
    const ro = new ResizeObserver(measure)
    ro.observe(v)
    document.fonts?.ready.then(measure)
    return () => ro.disconnect()
  }, [measure])

  const last = stops.length - 1
  const cur = Math.min(gi, last)
  const go = useCallback((d: number) => setGi((x) => Math.max(0, Math.min(last, Math.min(x, last) + d))), [last])
  const sw = useSwipe(() => go(-1), () => go(1))
  const reveal = (el: HTMLElement) => {
    const v = vp.current
    if (!v) return
    v.scrollLeft = 0
    const col = (el.closest('.g-col') as HTMLElement | null) ?? el
    const left = col.offsetLeft
    const view = stops[cur]
    if (left >= view && left + col.offsetWidth <= view + v.clientWidth) return
    const target = Math.min(left, stops[last])
    const k = stops.indexOf(target)
    if (k >= 0) setGi(k)
  }
  const progress = ((cur + 1) / stops.length) * 100

  return { track, vp, cur, last, go, sw, reveal, progress, offset: stops[cur] }
}

type TileProps = { shot: Shot; big: boolean; onOpen: (e: MouseEvent<HTMLButtonElement>) => void; onFocus: (el: HTMLElement) => void }

export function Tile({ shot, big, onOpen, onFocus }: TileProps) {
  return (
    <button
      type="button"
      className={big ? 'g-big' : 'g-tile'}
      aria-label={`Открыть фото: ${shot.cap}`}
      onClick={onOpen}
      onFocus={(e) => onFocus(e.currentTarget)}
    >
      <Photo
        k={shot.key}
        pos={shot.pos}
        sizes={coverSizes(
          shot.key,
          big
            ? [
                [1200, 480, 496],
                [768, 340, 372],
                [null, 180, 370],
              ]
            : [
                [1200, 300, 240],
                [768, 290, 180],
                [null, 150, 180],
              ],
        )}
      />
      <span className="chip">{shot.cap}</span>
      <span className="g-zoom">
        <Icon name="zoom" size={16} sw={1.7} />
      </span>
    </button>
  )
}
