'use client'

import { useMemo, useRef, useState } from 'react'
import { GALLERY, SEASONS } from '@/content/gallery'
import { GALLERY_TEXT } from '@/content/home'
import { SITE } from '@/content/site'
import type { Season, Shot } from '@/content/types'
import { Icon } from './icons'
import { Lightbox } from './Lightbox'
import { Arrows, Bar, Tile, useStrip } from './Strip'

export function Gallery() {
  const [season, setSeason] = useState<Season>('day')
  const [lb, setLb] = useState<{ open: boolean; index: number }>({ open: false, index: 0 })
  const opener = useRef<HTMLElement | null>(null)
  const { track, vp, cur, last, go, sw, reveal, progress, offset } = useStrip(season)

  const items = GALLERY[season]
  const list = useMemo(() => items.flatMap((it) => (it.type === 'end' ? [] : it.photos)), [items])
  const seasonLabel = SEASONS.find((s) => s.id === season)?.label ?? ''

  let n = -1
  const cell = (p: Shot, big: boolean) => {
    n += 1
    const idx = n
    return (
      <Tile
        key={p.key}
        shot={p}
        big={big}
        onOpen={(e) => {
          opener.current = e.currentTarget
          setLb({ open: true, index: idx })
        }}
        onFocus={reveal}
      />
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
          <div className="g-track" ref={track} style={{ transform: `translateX(${-offset}px)` }}>
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
