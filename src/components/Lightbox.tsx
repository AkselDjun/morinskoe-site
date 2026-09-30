'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Shot } from '@/content/types'
import { lockScroll } from '@/lib/scroll-lock'
import { pad } from '@/lib/pad'
import { useSwipe } from '@/lib/swipe'
import { useFocusTrap } from '@/lib/focus-trap'
import { Icon } from './icons'
import { Photo, coverSizes } from './Photo'

type Props = { open: boolean; start: number; list: Shot[]; title: string; subtitle: string; onClose: () => void }

export function Lightbox({ open, start, list, title, subtitle, onClose }: Props) {
  const [li, setLi] = useState(start)
  const [animate, setAnimate] = useState(false)
  const [x, setX] = useState(0)
  const stage = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const thumbs = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const box = useRef<HTMLDivElement>(null)
  const n = list.length
  useFocusTrap(box, open)

  const go = useCallback((j: number) => setLi(((j % n) + n) % n), [n])
  const sw = useSwipe(() => go(li - 1), () => go(li + 1))

  const layout = useCallback(() => {
    const s = stage.current
    const t = track.current
    if (!s || !t) return
    const first = t.children[0] as HTMLElement | undefined
    if (!first) return
    const w = first.offsetWidth
    const gap = parseFloat(getComputedStyle(t).columnGap) || 0
    setX(s.clientWidth / 2 - w / 2 - li * (w + gap))
  }, [li])

  useEffect(() => {
    if (!open) return
    setLi(start)
    setAnimate(false)
    lockScroll(true)
    requestAnimationFrame(() => {
      closeRef.current?.focus({ preventScroll: true })
      requestAnimationFrame(() => setAnimate(true))
    })
    return () => lockScroll(false)
  }, [open, start])

  useEffect(() => {
    if (!open) return
    layout()
    const on = thumbs.current?.children[li] as HTMLElement | undefined
    on?.scrollIntoView({ block: 'nearest', inline: 'center' })
  }, [open, li, layout])

  useEffect(() => {
    if (!open) return
    const onResize = () => layout()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') go(li - 1)
      if (e.key === 'ArrowRight') go(li + 1)
    }
    window.addEventListener('resize', onResize)
    document.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('resize', onResize)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, li, go, layout, onClose])

  const cur = list[Math.min(li, n - 1)]

  return (
    <div ref={box} className={`lb${open ? ' open' : ''}`} role="dialog" aria-modal="true" aria-label="Просмотр фото" aria-hidden={!open} inert={!open}>
      <div className="lb-head">
        <div className="lb-title">
          <b>{title}</b>
          <span>{subtitle}</span>
        </div>
        <div className="lb-head-r">
          <span className="lb-count" aria-live="polite">
            {pad(li + 1)}
            <i> / {pad(n)}</i>
          </span>
          <button className="icon-btn" type="button" aria-label="Закрыть просмотр" onClick={onClose} ref={closeRef}>
            <Icon name="close" size={20} sw={1.8} />
          </button>
        </div>
      </div>
      <div className="lb-stage" ref={stage} {...sw}>
        <div className="lb-track" ref={track} style={{ transform: `translateX(${x}px)`, transition: animate ? undefined : 'none' }}>
          {open
            ? list.map((p, j) => (
                <button
                  key={p.key}
                  type="button"
                  className={`lb-slide${j === li ? ' on' : ''}`}
                  aria-label={`Фото ${j + 1}`}
                  aria-current={j === li ? 'true' : undefined}
                  onClick={() => go(j)}
                  onFocus={() => {
                    if (j !== li) go(j)
                  }}
                >
                  <Photo k={p.key} pos={p.pos} sizes={coverSizes(p.key, [
                      [1200, 500, 570],
                      [768, 540, 616],
                      [null, 310, 420],
                    ])} eager={Math.abs(j - li) <= 1} />
                </button>
              ))
            : null}
        </div>
        <button className="arr prev lb-arr" type="button" aria-label="Предыдущее фото" onClick={() => go(li - 1)}>
          <Icon name="chevL" size={20} sw={1.8} />
        </button>
        <button className="arr next lb-arr" type="button" aria-label="Следующее фото" onClick={() => go(li + 1)}>
          <Icon name="chevR" size={20} sw={1.8} />
        </button>
      </div>
      <div className="lb-foot">
        <span className="lb-cap">{open && cur ? cur.cap : ''}</span>
        <div className="lb-thumbs" ref={thumbs}>
          {open
            ? list.map((p, j) => (
                <button key={p.key} type="button" className={j === li ? 'on' : undefined} aria-label={`Фото ${j + 1}`} aria-current={j === li ? 'true' : undefined} onClick={() => go(j)}>
                  <Photo k={p.key} pos={p.pos} sizes="64px" hidden />
                </button>
              ))
            : null}
        </div>
        <div className="lb-nav">
          <button className="arr prev" type="button" aria-label="Предыдущее фото" onClick={() => go(li - 1)}>
            <Icon name="chevL" size={20} sw={1.8} />
          </button>
          <div className="lb-dots" aria-hidden="true">
            {list.map((p, j) => (
              <span key={p.key} className={j === li ? 'on' : undefined} />
            ))}
          </div>
          <button className="arr next" type="button" aria-label="Следующее фото" onClick={() => go(li + 1)}>
            <Icon name="chevR" size={20} sw={1.8} />
          </button>
        </div>
      </div>
    </div>
  )
}
