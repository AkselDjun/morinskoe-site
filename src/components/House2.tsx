'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { HOUSE2, HOUSE2_ITEMS } from '@/content/house2'
import type { Clip, Shot } from '@/content/types'
import { photoSrc } from './Photo'
import { Lightbox } from './Lightbox'
import { Arrows, Bar, Tile, useStrip } from './Strip'

function ClipTile({ clip }: { clip: Clip }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(
      (en) => {
        if (en[0].isIntersecting) v.play().catch(() => {})
        else v.pause()
      },
      { threshold: 0.4 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [])
  return (
    <div className="g-big g-clip">
      <video
        ref={ref}
        poster={photoSrc(clip.poster, 800)}
        muted
        loop
        playsInline
        preload="none"
        aria-label={clip.cap}
        style={{ objectPosition: clip.pos }}
      >
        <source src={`${clip.src}.mp4`} type="video/mp4" />
        <source src={`${clip.src}.webm`} type="video/webm" />
      </video>
      <span className="chip">{clip.cap}</span>
    </div>
  )
}

export function House2() {
  const [lb, setLb] = useState<{ open: boolean; index: number }>({ open: false, index: 0 })
  const opener = useRef<HTMLElement | null>(null)
  const { track, vp, cur, last, go, sw, reveal, progress, offset } = useStrip(null)
  const list = useMemo(() => HOUSE2_ITEMS.flatMap((it) => (it.type === 'video' ? [] : it.photos)), [])

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
    <section className="gallery house2" id="house2" aria-labelledby="h2-h">
      <div className="wrap">
        <div className="g-head">
          <div className="g-left">
            <div className="g-title">
              <div className="h2-title">
                <span className="eyebrow">{HOUSE2.eyebrow}</span>
                <h2 id="h2-h">{HOUSE2.title}</h2>
              </div>
              <Arrows gi={cur} last={last} go={go} />
            </div>
            <p className="h2-text">{HOUSE2.text}</p>
          </div>
          <div className="g-ctrl">
            <Bar value={progress} />
            <Arrows gi={cur} last={last} go={go} />
          </div>
        </div>
        <div className="g-vp" ref={vp} {...sw}>
          <div className="g-track" ref={track} style={{ transform: `translateX(${-offset}px)` }}>
            {HOUSE2_ITEMS.map((it, i) =>
              it.type === 'video' ? (
                <ClipTile key={it.clip.src} clip={it.clip} />
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
        title={HOUSE2.title}
        subtitle={HOUSE2.eyebrow}
        onClose={() => {
          setLb((s) => ({ ...s, open: false }))
          opener.current?.focus({ preventScroll: true })
        }}
      />
    </section>
  )
}
