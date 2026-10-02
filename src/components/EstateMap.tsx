'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { MAP_ACTIVE, MAP_H, MAP_POINTS, MAP_SVG, MAP_W } from '@/content/map'
import { ROUTE } from '@/content/home'
import { SITE } from '@/content/site'
import { Photo } from './Photo'

const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect
const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(2)}%`

export function EstateMap() {
  const [pk, setPk] = useState(MAP_ACTIVE)
  const [pi, setPi] = useState(0)
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null)
  const [live, setLive] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const map = useRef<HTMLDivElement>(null)
  const pop = useRef<HTMLDivElement>(null)
  const tabs = useRef<HTMLDivElement>(null)
  const p = MAP_POINTS[pk]

  const place = useCallback(() => {
    const m = map.current
    const el = pop.current
    if (!m || !el) return
    if (window.matchMedia('(max-width: 767px)').matches) {
      setPos(null)
      return
    }
    const px = (p.x / MAP_W) * m.clientWidth
    const py = (p.y / MAP_H) * m.clientHeight
    const pw = el.offsetWidth
    const ph = el.offsetHeight
    let left = px - pw / 2 + 40
    let top = py - ph - 18
    if (top < 14) top = Math.min(py + 48, m.clientHeight - ph - 14)
    left = Math.max(14, Math.min(m.clientWidth - pw - 14, left))
    top = Math.max(14, top)
    const t = tabs.current
    if (t && left < t.offsetLeft + t.offsetWidth && left + pw > t.offsetLeft && top < t.offsetTop + t.offsetHeight) {
      top = t.offsetTop + t.offsetHeight + 10
    }
    setPos({ left, top })
  }, [p])

  useIso(() => {
    place()
  }, [place, pi])

  useEffect(() => {
    const m = map.current
    if (!m) return
    const ro = new ResizeObserver(() => place())
    ro.observe(m)
    return () => ro.disconnect()
  }, [place])

  const show = (on: boolean) => {
    setLive(on)
    if (on) setLoaded(true)
  }

  const choose = (k: number) => {
    setPk(k)
    setPi(0)
  }

  return (
    <section className="route" id="route" aria-labelledby="route-h">
      <div className="wrap route-grid">
        <div className="map-wrap">
          <div className={`map${live ? ' live' : ''}`} ref={map}>
            <div className="map-art" dangerouslySetInnerHTML={{ __html: MAP_SVG }} aria-hidden="true" />
            {loaded ? (
              <iframe className="map-ya" src={SITE.yandexWidget} title={ROUTE.mapTitle} loading="lazy" allowFullScreen hidden={!live} />
            ) : null}
            <div className="map-tabs" ref={tabs} role="group" aria-label="Вид карты">
              {ROUTE.tabs.map((t, k) => (
                <button key={t} type="button" className={live === (k === 1) ? 'on' : undefined} aria-pressed={live === (k === 1)} onClick={() => show(k === 1)}>
                  {t}
                </button>
              ))}
            </div>
            {MAP_POINTS.map((q, k) => (
              <button
                key={q.n}
                type="button"
                hidden={live}
                className={`pt${k === pk ? ' on' : ''}`}
                style={{ '--ax': pct(q.x, MAP_W), '--ay': pct(q.y, MAP_H), '--px': pct(q.px, MAP_W), '--py': pct(q.py, MAP_H) } as CSSProperties}
                aria-label={`${q.n}. ${q.title}`}
                aria-pressed={k === pk}
                onClick={() => choose(k)}
              >
                <span className="n">{q.n}</span>
                <span className="t">{q.title}</span>
              </button>
            ))}
            {live ? null : <span className="map-note">{ROUTE.note}</span>}
          </div>
          <div className={`pop${p.photos.length ? '' : ' noimg'}`} ref={pop} aria-live="polite" hidden={live} style={pos ? { left: pos.left, top: pos.top } : undefined}>
            {p.photos.length ? (
              <div className="pop-img">
                {p.photos.map((f, j) => (
                  <Photo key={f.key} k={f.key} pos={f.pos} sizes="220px" className={j === pi ? 'on' : undefined} hidden={j !== pi} />
                ))}
                <span className="chip pop-cap">{p.photos[pi]?.cap}</span>
                {p.photos.length > 1 ? (
                  <div className="pop-dots">
                    {p.photos.map((f, j) => (
                      <button key={f.key} type="button" className={j === pi ? 'on' : undefined} aria-label={`Фото ${j + 1}`} onClick={() => setPi(j)}>
                        <span />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
            <div className="pop-txt">
              <b>{p.title}</b>
              <span>{p.text}</span>
            </div>
          </div>
        </div>
        <ol className="legend" aria-label="Точки на карте" hidden={live}>
          {MAP_POINTS.map((q, k) => (
            <li key={q.n}>
              <button type="button" className={k === pk ? 'on' : undefined} aria-pressed={k === pk} onClick={() => choose(k)}>
                <span>{q.n}</span>
                {q.title}
              </button>
            </li>
          ))}
        </ol>
        <div className="route-text">
          <h2 id="route-h">{ROUTE.title}</h2>
          <span className="addr">
            {SITE.addressShort} · <span className="nw">{SITE.coords}</span>
          </span>
          <div className="dist">
            {ROUTE.dist.map((d) => (
              <div key={d.label}>
                <b>{d.value}</b>
                <span>{d.label}</span>
              </div>
            ))}
          </div>
          <div className="maps-btns">
            <a className="btn btn-sand" href={SITE.yandexRoute} target="_blank" rel="noopener">
              {ROUTE.routeBtn}
            </a>
            <a className="btn btn-river" href={SITE.googleMaps} target="_blank" rel="noopener">
              Google Maps ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
