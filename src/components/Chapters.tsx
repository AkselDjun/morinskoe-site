'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { CH1, CH2, CH3 } from '@/content/home'
import { SLIDES } from '@/content/slides'
import type { Shot } from '@/content/types'
import { pad } from '@/lib/pad'
import { useSwipe } from '@/lib/swipe'
import { Icon } from './icons'
import { Photo, coverSizes } from './Photo'
import type { Box } from './Photo'

const BOX_WIDE: Box[] = [
  [1200, 710, 520],
  [768, 1000, 380],
  [null, 400, 280],
]
const BOX_PAIR: Box[] = [
  [1200, 346, 400],
  [768, 520, 280],
  [null, 200, 190],
]

function useCycle(n: number) {
  const [i, setI] = useState(0)
  const [loaded, setLoaded] = useState<number[]>([0])
  const ref = useRef<HTMLElement>(null)
  const warm = useCallback(
    (k: number) =>
      setLoaded((l) => {
        const add = [k, (k + 1) % n, (k - 1 + n) % n].filter((x, j, a) => !l.includes(x) && a.indexOf(x) === j)
        return add.length ? [...l, ...add] : l
      }),
    [n],
  )
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (en) => {
        if (!en[0].isIntersecting) return
        warm(0)
        io.disconnect()
      },
      { rootMargin: '200px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [warm])
  const go = (k: number) => {
    const x = ((k % n) + n) % n
    warm(x)
    setI(x)
  }
  return { i, loaded, ref, prev: () => go(i - 1), next: () => go(i + 1) }
}

function Pill({ i, n, onPrev, onNext }: { i: number; n: number; onPrev: () => void; onNext: () => void }) {
  return (
    <div className="pill">
      <button type="button" aria-label="Предыдущее фото" onClick={onPrev}>
        <Icon name="chevL" size={20} sw={1.8} />
      </button>
      <span className="count" aria-live="polite">
        {pad(i + 1)}
        <i> / {pad(n)}</i>
      </span>
      <button type="button" aria-label="Следующее фото" onClick={onNext}>
        <Icon name="chevR" size={20} sw={1.8} />
      </button>
    </div>
  )
}

function Slides({ list, i, loaded, box }: { list: Shot[]; i: number; loaded: number[]; box: Box[] }) {
  return (
    <>
      {list.map((s, j) =>
        loaded.includes(j) ? <Photo key={s.key} k={s.key} pos={s.pos} sizes={coverSizes(s.key, box)} className={`slide${j === i ? ' on' : ''}`} hidden={j !== i} /> : null,
      )}
    </>
  )
}

export function Chapter1() {
  const list = SLIDES.ch1
  const c = useCycle(list.length)
  const sw = useSwipe(c.prev, c.next)
  return (
    <section className="ch ch1" id="ch1" aria-labelledby="ch1-h" ref={c.ref}>
      <div className="wrap ch-grid">
        <div className="shot" {...sw}>
          <Slides list={list} i={c.i} loaded={c.loaded} box={BOX_WIDE} />
          <div className="shot-ui">
            <Pill i={c.i} n={list.length} onPrev={c.prev} onNext={c.next} />
            <span className="chip">{list[c.i].cap}</span>
          </div>
        </div>
        <div className="card sand">
          <span className="eyebrow">{CH1.eyebrow}</span>
          <h2 id="ch1-h">{CH1.title}</h2>
          <p>{CH1.text}</p>
        </div>
      </div>
    </section>
  )
}

export function Chapter2() {
  const list = SLIDES.ch2
  const c = useCycle(list.length)
  const sw = useSwipe(c.prev, c.next)
  return (
    <section className="ch ch2" id="ch2" aria-labelledby="ch2-h" ref={c.ref}>
      <div className="wrap ch-grid">
        <div className="card pine">
          <span className="eyebrow">{CH2.eyebrow}</span>
          <h2 id="ch2-h">{CH2.title}</h2>
          <p>{CH2.text}</p>
          <div className="stats">
            {CH2.stats.map((s) => (
              <div key={s.label}>
                <b>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="shot" {...sw}>
          <Slides list={list} i={c.i} loaded={c.loaded} box={BOX_WIDE} />
          <div className="shot-ui">
            <span className="chip">{list[c.i].cap}</span>
            <Pill i={c.i} n={list.length} onPrev={c.prev} onNext={c.next} />
          </div>
        </div>
      </div>
    </section>
  )
}

export function Chapter3() {
  const a = SLIDES.ch3a
  const b = SLIDES.ch3b
  const c = useCycle(Math.min(a.length, b.length))
  const sw = useSwipe(c.prev, c.next)
  return (
    <section className="ch ch3" id="ch3" aria-labelledby="ch3-h" ref={c.ref}>
      <div className="wrap ch3-grid">
        <div className="pair">
          <div className="shot" {...sw}>
            <Slides list={a} i={c.i} loaded={c.loaded} box={BOX_PAIR} />
            <span className="chip">{a[c.i].cap}</span>
          </div>
          <div className="shot" {...sw}>
            <Slides list={b} i={c.i} loaded={c.loaded} box={BOX_PAIR} />
            <span className="chip">{b[c.i].cap}</span>
          </div>
          <div className="pair-ui">
            <Pill i={c.i} n={Math.min(a.length, b.length)} onPrev={c.prev} onNext={c.next} />
          </div>
        </div>
        <div className="ch3-text">
          <span className="eyebrow">{CH3.eyebrow}</span>
          <h2 id="ch3-h">{CH3.title}</h2>
          <p>{CH3.text}</p>
          <div className="rows prices">
            {CH3.prices.map((p) => (
              <div key={p.name}>
                <span className="rn">
                  <b>{p.name}</b>
                  <small>{p.note}</small>
                </span>
                <span className="rp">
                  <em>{p.price}</em>
                  {p.sub ? <small>{p.sub}</small> : null}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
