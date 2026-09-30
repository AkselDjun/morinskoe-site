'use client'

import { useEffect, useRef } from 'react'
import { DAY } from '@/content/home'

export function DayScroller() {
  const box = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = box.current
    const b = bar.current
    if (!el || !b) return
    const update = () => {
      const max = el.scrollWidth - el.clientWidth
      const vis = el.clientWidth / el.scrollWidth
      b.style.width = Math.max(12, vis * 100) + '%'
      b.style.transform = `translateX(${max > 0 ? (el.scrollLeft / max) * (1 / vis - 1) * 100 : 0}%)`
    }
    let drag: { x: number; s: number } | null = null
    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      drag = { x: e.clientX, s: el.scrollLeft }
    }
    const move = (e: PointerEvent) => {
      if (!drag) return
      const dx = e.clientX - drag.x
      if (Math.abs(dx) > 4) el.classList.add('drag')
      el.scrollLeft = drag.s - dx
    }
    const up = () => {
      if (!drag) return
      el.classList.remove('drag')
      drag = null
    }
    const ro = new ResizeObserver(update)
    ro.observe(el)
    el.addEventListener('scroll', update, { passive: true })
    el.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    update()
    return () => {
      ro.disconnect()
      el.removeEventListener('scroll', update)
      el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [])

  return (
    <section className="day" id="day" aria-labelledby="day-h">
      <div className="wrap day-head">
        <h2 id="day-h">{DAY.title}</h2>
        <span>{DAY.note}</span>
      </div>
      <div className="scroller" ref={box} tabIndex={0} aria-label="Сценарий дня, листается вбок">
        {DAY.cards.map((c) => (
          <div className={`dcard${c.dark ? ' dark' : ''}`} key={c.title}>
            <em>{c.when}</em>
            <div>
              <b>{c.title}</b>
              <span>{c.text}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="wrap">
        <div className="bar" aria-hidden="true">
          <i ref={bar} />
        </div>
      </div>
    </section>
  )
}
