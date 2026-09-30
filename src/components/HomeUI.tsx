'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { MENU, SPY_IDS, DOCK, SIDE_DOTS } from '@/content/home'
import { SITE } from '@/content/site'
import { lockScroll } from '@/lib/scroll-lock'
import { useFocusTrap } from '@/lib/focus-trap'
import { Icon } from './icons'
import { useConsent } from './Consent'

type UI = { active: string | null; heroGone: boolean; menuOpen: boolean; openMenu: (from?: HTMLElement | null) => void; closeMenu: (restore?: boolean) => void }

const UIContext = createContext<UI>({ active: null, heroGone: false, menuOpen: false, openMenu: () => {}, closeMenu: () => {} })
const useUI = () => useContext(UIContext)

export function HomeUI({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<string | null>('ch1')
  const [heroGone, setHeroGone] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const returnRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const hero = document.getElementById('top')
    if (!hero) return
    const io = new IntersectionObserver((en) => setHeroGone(!en[0].isIntersecting), { rootMargin: '-120px 0px 0px 0px' })
    io.observe(hero)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const ratios = new Map<string, number>()
    const io = new IntersectionObserver(
      (en) => {
        en.forEach((x) => ratios.set(x.target.id, x.intersectionRatio))
        let best: string | null = null
        let br = 0
        SPY_IDS.forEach((id) => {
          const r = ratios.get(id) ?? 0
          if (r > br) {
            br = r
            best = id
          }
        })
        setActive(best)
      },
      { threshold: [0, 0.15, 0.3, 0.5, 0.75, 1] },
    )
    SPY_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  const openMenu = useCallback((from?: HTMLElement | null) => {
    returnRef.current = from ?? null
    setMenuOpen(true)
  }, [])
  const closeMenu = useCallback((restore = true) => {
    setMenuOpen(false)
    if (restore) returnRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <UIContext.Provider value={{ active, heroGone, menuOpen, openMenu, closeMenu }}>
      {children}
      <Dock />
      <Menu />
    </UIContext.Provider>
  )
}

export function SideDots() {
  const { active } = useUI()
  return (
    <nav className="side-dots" aria-label="Главы">
      {SIDE_DOTS.map((d) => (
        <a key={d.id} href={`#${d.id}`} className={active === d.id ? 'on' : undefined} aria-current={active === d.id ? 'true' : undefined}>
          <span>{d.label}</span>
        </a>
      ))}
    </nav>
  )
}

export function MenuButton({ className, label }: { className?: string; label?: boolean }) {
  const { openMenu, menuOpen } = useUI()
  return (
    <button
      className={className}
      type="button"
      aria-label={label ? undefined : 'Открыть меню'}
      aria-controls="menu"
      aria-expanded={menuOpen}
      onClick={(e) => openMenu(e.currentTarget)}
    >
      <Icon name="menu" size={20} sw={1.8} />
      {label ? 'Меню' : null}
    </button>
  )
}

function Dock() {
  const { heroGone, active } = useUI()
  const { bannerOpen } = useConsent()
  const show = heroGone && !bannerOpen
  return (
    <nav className={`dock${show ? ' show' : ''}`} aria-label="Быстрая навигация" aria-hidden={!show} inert={!show}>
      <MenuButton className="menu-open" label />
      <div className="dock-links">
        {DOCK.map((d) => (
          <a key={d.id} href={`#${d.id}`} className={active === d.id ? 'on' : undefined}>
            {d.label}
          </a>
        ))}
      </div>
      <a className="btn btn-sand" href="#book">
        Проверить дату
      </a>
    </nav>
  )
}

function Menu() {
  const { menuOpen, closeMenu } = useUI()
  const closeRef = useRef<HTMLButtonElement>(null)
  const box = useRef<HTMLDivElement>(null)
  useFocusTrap(box, menuOpen)

  useEffect(() => {
    if (!menuOpen) return
    lockScroll(true)
    requestAnimationFrame(() => closeRef.current?.focus({ preventScroll: true }))
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      lockScroll(false)
    }
  }, [menuOpen, closeMenu])

  return (
    <div ref={box} className={`menu${menuOpen ? ' open' : ''}`} id="menu" role="dialog" aria-modal="true" aria-label="Меню" aria-hidden={!menuOpen} inert={!menuOpen}>
      <div className="menu-top">
        <a className="mark" href="#top" onClick={() => closeMenu(false)}>
          МОРИНСКОЕ
        </a>
        <button className="icon-btn" type="button" aria-label="Закрыть меню" onClick={() => closeMenu()} ref={closeRef}>
          <Icon name="close" size={20} sw={1.8} />
        </button>
      </div>
      <nav aria-label="Разделы">
        {MENU.map((m, i) => (
          <a key={m.id} href={`#${m.id}`} onClick={() => closeMenu(false)}>
            {m.label}
            <small>{String(i + 1).padStart(2, '0')}</small>
          </a>
        ))}
      </nav>
      <div className="menu-foot">
        <a className="big-phone" href={SITE.phoneHref}>
          {SITE.phone}
        </a>
        <div className="msgs">
          <a href={SITE.viber}>Viber</a>
          <a href={SITE.telegram} target="_blank" rel="noopener">
            Telegram
          </a>
          <a href={SITE.instagram} target="_blank" rel="noopener">
            Instagram
          </a>
        </div>
        <a className="btn btn-sand" href="#book" onClick={() => closeMenu(false)}>
          Проверить свободную дату
        </a>
      </div>
    </div>
  )
}
