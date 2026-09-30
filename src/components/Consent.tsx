'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SITE } from '@/content/site'
import { lockScroll } from '@/lib/scroll-lock'
import { useFocusTrap } from '@/lib/focus-trap'
import { Icon } from './icons'

export type ConsentState = { maps: boolean; an: boolean }

type Ctx = {
  consent: ConsentState | null
  ready: boolean
  bannerOpen: boolean
  openSettings: () => void
  save: (c: ConsentState) => void
}

const ConsentContext = createContext<Ctx>({
  consent: null,
  ready: false,
  bannerOpen: false,
  openSettings: () => {},
  save: () => {},
})

export const useConsent = () => useContext(ConsentContext)

const COOKIE = 'morinskoe_consent'
const ANALYTICS = !!SITE.metrikaId

function readConsent(): ConsentState | null {
  const m = document.cookie.match(new RegExp(`(?:^|; )${COOKIE}=([^;]*)`))
  if (!m) return null
  const [maps, an] = decodeURIComponent(m[1]).split('.')
  return { maps: maps === '1', an: an === '1' }
}

function writeConsent(c: ConsentState) {
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${COOKIE}=${c.maps ? 1 : 0}.${c.an ? 1 : 0}; Max-Age=31536000; Path=/; SameSite=Lax${secure}`
}

type YM = ((...args: unknown[]) => void) & { a?: unknown[]; l?: number }

function Metrika({ id }: { id: string }) {
  const pathname = usePathname()
  const first = useRef(true)
  useEffect(() => {
    const w = window as unknown as { ym?: YM }
    if (w.ym) return
    const ym: YM = (...args: unknown[]) => {
      ;(ym.a = ym.a || []).push(args)
    }
    ym.l = Date.now()
    w.ym = ym
    const s = document.createElement('script')
    s.async = true
    s.src = 'https://mc.yandex.ru/metrika/tag.js'
    document.head.appendChild(s)
    ym(Number(id), 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: false })
  }, [id])
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const w = window as unknown as { ym?: YM }
    w.ym?.(Number(id), 'hit', location.href)
  }, [pathname, id])
  return null
}

function Banner({ onAll, onMin, onMore }: { onAll: () => void; onMin: () => void; onMore: () => void }) {
  return (
    <div className="cookie" role="region" aria-label="Согласие на cookie">
      <b>Мы используем cookie</b>
      <p>
        Чтобы сайт работал, а отзывы подгружались с Яндекс Карт.{ANALYTICS ? ' Аналитику включим только с вашего согласия.' : ''} Подробнее — в{' '}
        <Link href="/privacy/">политике конфиденциальности</Link>.
      </p>
      <div className="ck-btns">
        <button className="btn btn-dark" type="button" onClick={onAll}>
          Принять все
        </button>
        <button className="btn btn-line2" type="button" onClick={onMin}>
          Только необходимые
        </button>
        <button className="ck-more" type="button" onClick={onMore}>
          Настроить
        </button>
      </div>
    </div>
  )
}

function Settings({ open, initial, onClose, onSave }: { open: boolean; initial: ConsentState; onClose: () => void; onSave: (c: ConsentState) => void }) {
  const [maps, setMaps] = useState(initial.maps)
  const [an, setAn] = useState(initial.an)
  const closeRef = useRef<HTMLButtonElement>(null)
  const returnRef = useRef<Element | null>(null)
  const box = useRef<HTMLDivElement>(null)
  useFocusTrap(box, open)

  useEffect(() => {
    if (!open) return
    setMaps(initial.maps)
    setAn(initial.an)
    returnRef.current = document.activeElement
    lockScroll(true)
    requestAnimationFrame(() => closeRef.current?.focus({ preventScroll: true }))
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      lockScroll(false)
      const el = returnRef.current as HTMLElement | null
      if (el && document.body.contains(el)) el.focus({ preventScroll: true })
    }
  }, [open, initial.maps, initial.an, onClose])

  return (
    <div
      ref={box}
      className={`modal${open ? ' open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ck-h"
      aria-hidden={!open}
      inert={!open}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="sheet">
        <div className="sheet-top">
          <span className="sheet-title">
            <span className="sheet-ic" aria-hidden="true">
              <Icon name="cookie" size={22} sw={1.6} />
            </span>
            <b id="ck-h">Настройки cookie</b>
          </span>
          <button className="x" type="button" aria-label="Закрыть настройки" onClick={onClose} ref={closeRef}>
            <Icon name="close" size={18} sw={1.8} />
          </button>
        </div>
        <p className="sub">Выберите, какие cookie можно использовать. Изменить выбор можно в любой момент по ссылке «Настройки cookie» внизу сайта.</p>
        <div className="opt">
          <div>
            <b>Необходимые</b>
            <span>Работа сайта и отправка формы. Без них сайт не работает.</span>
          </div>
          <em>Всегда включены</em>
        </div>
        <div className="opt">
          <div>
            <b id="ck-maps-l">Отзывы</b>
            <span>Виджет отзывов Яндекс Карт. Яндекс ставит свои cookie.</span>
          </div>
          <label className="sw">
            <input type="checkbox" role="switch" aria-labelledby="ck-maps-l" checked={maps} onChange={(e) => setMaps(e.target.checked)} />
            <i />
          </label>
        </div>
        {ANALYTICS ? (
        <div className="opt">
          <div>
            <b id="ck-an-l">Аналитика</b>
            <span>Яндекс Метрика: помогает понять, какие разделы полезны. Без персональных данных в отчётах.</span>
          </div>
          <label className="sw">
            <input type="checkbox" role="switch" aria-labelledby="ck-an-l" checked={an} onChange={(e) => setAn(e.target.checked)} />
            <i />
          </label>
        </div>
        ) : null}
        <div className="ck-btns">
          <button className="btn btn-line2" type="button" onClick={() => onSave({ maps, an })}>
            Сохранить выбор
          </button>
          <button className="btn btn-dark" type="button" onClick={() => onSave({ maps: true, an: ANALYTICS })}>
            Принять все
          </button>
        </div>
      </div>
    </div>
  )
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentState | null>(null)
  const [ready, setReady] = useState(false)
  const [modal, setModal] = useState(false)

  useEffect(() => {
    setConsent(readConsent())
    setReady(true)
  }, [])

  const save = useCallback(
    (c: ConsentState) => {
      const hadMetrika = !!consent?.an && !!SITE.metrikaId
      writeConsent(c)
      setConsent(c)
      setModal(false)
      if (hadMetrika && !c.an) location.reload()
    },
    [consent],
  )
  const openSettings = useCallback(() => setModal(true), [])
  const closeSettings = useCallback(() => setModal(false), [])
  const bannerOpen = ready && consent === null

  return (
    <ConsentContext.Provider value={{ consent, ready, bannerOpen, openSettings, save }}>
      {children}
      {bannerOpen && !modal ? (
        <Banner onAll={() => save({ maps: true, an: ANALYTICS })} onMin={() => save({ maps: false, an: false })} onMore={openSettings} />
      ) : null}
      <Settings open={modal} initial={consent ?? { maps: true, an: false }} onClose={closeSettings} onSave={save} />
      {consent?.an && SITE.metrikaId ? <Metrika id={SITE.metrikaId} /> : null}
    </ConsentContext.Provider>
  )
}

export function CookieSettingsButton({ className }: { className?: string }) {
  const { openSettings } = useConsent()
  return (
    <button type="button" className={className} onClick={openSettings}>
      Настройки cookie
    </button>
  )
}
