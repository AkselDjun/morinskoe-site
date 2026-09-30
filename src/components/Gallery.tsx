'use client'

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { GALLERY, SEASONS } from '@/content/gallery'
import { GALLERY_TEXT } from '@/content/home'
import { SITE } from '@/content/site'
import type { Season, Shot } from '@/content/types'
import { useSwipe } from '@/lib/swipe'
import { Icon } from './icons'
import { Photo, coverSizes } from './Photo'
import { Lightbox } from './Lightbox'

const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect

function Arrows({ gi, last, go }: { gi: number; last: number; go: (d: number) => void }) {
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

function Bar({ value }: { value: number }) {
  return (
    <div className="g-bar" aria-hidden="true">
      <i style={{ width: `${value}%` }} />
    </div>
  )
}

export function Gallery() {
  const [season, setSeason] = useState<Season>('day')
  const [gi, setGi] = useState(0)
  const [stops, setStops] = useState<number[]>([0])
  const [lb, setLb] = useState<{ open: boolean; index: number }>({ open: false, index: 0 })
  const track = useRef<HTMLDivElement>(null)
  const vp = useRef<HTMLDivElement>(null)
  const opener = useRef<HTMLElement | null>(null)

  const items = GALLERY[season]
  const list = useMemo(() => items.flatMap((it) => (it.type === 'end' ? [] : it.photos)), [items])
  const seasonLabel = SEASONS.find((s) => s.id === season)?.label ?? ''

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
  }, [season, measure])

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

  let n = -1
  const cell = (p: Shot, big: boolean) => {
    n += 1
    const idx = n
    return (
      <button
        key={p.key}
        type="button"
        className={big ? 'g-big' : 'g-tile'}
        aria-label={`Открыть фото: ${p.cap}`}
        onClick={(e) => {
          opener.current = e.currentTarget
          setLb({ open: true, index: idx })
        }}
        onFocus={(e) => reveal(e.currentTarget)}
      >
        <Photo
          k={p.key}
          pos={p.pos}
          sizes={coverSizes(
            p.key,
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
        <span className="chip">{p.cap}</span>
        <span className="g-zoom">
          <Icon name="zoom" size={16} sw={1.7} />
        </span>
      </button>
    )
  }

  return (
    <section className="gallery" id="gallery" aria-labelledby="gal-h">
      <div className="wrap">
        <div className="g-head">
          <div className="g-left">
            <div className="g-title">
              <h2 id="gal-h">{GALLERY_TEXT.title}</h2>
              <Arrows gi={cur} last={last} go={go} />
            </div>
            <div className="g-row">
              <div className="seasons" role="group" aria-label="Время съёмки">
                {SEASONS.map((s) => (
                  <button key={s.id} type="button" aria-pressed={season === s.id} onClick={() => setSeason(s.id)}>
                    {s.label}
                  </button>
                ))}
              </div>
              <Bar value={progress} />
            </div>
          </div>
          <div className="g-ctrl">
            <Bar value={progress} />
            <Arrows gi={cur} last={last} go={go} />
          </div>
        </div>
        <div className="g-vp" ref={vp} {...sw}>
          <div className="g-track" ref={track} style={{ transform: `translateX(${-stops[cur]}px)` }}>
            {items.map((it, i) =>
              it.type === 'end' ? (
                <a key="end" className="g-end" href={SITE.instagram} target="_blank" rel="noopener">
                  <span className="ig">
                    <Icon name="instagram" size={22} sw={1.5} />
                  </span>
                  <span>
                    <b>{GALLERY_TEXT.endTitle}</b>
                    <span>{SITE.instagramHandle} ↗</span>
                  </span>
                </a>
              ) : it.type === 'big' ? (
                cell(it.photos[0], true)
              ) : (
                <div className="g-col" key={`col-${i}`}>
                  {it.photos.map((p) => cell(p, false))}
                </div>
              ),
            )}
          </div>
        </div>
        <div className="g-foot">
          <Bar value={progress} />
        </div>
      </div>
      <Lightbox
        open={lb.open}
        start={lb.index}
        list={list}
        title={GALLERY_TEXT.title}
        subtitle={seasonLabel}
        onClose={() => {
          setLb((s) => ({ ...s, open: false }))
          opener.current?.focus({ preventScroll: true })
        }}
      />
    </section>
  )
}
