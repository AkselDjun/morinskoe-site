import { HERO, INTRO, NAV } from '@/content/home'
import { SITE } from '@/content/site'
import { Icon } from './icons'
import { Photo } from './Photo'
import { MenuButton, SideDots } from './HomeUI'

export function SideNav() {
  return (
    <aside className="side" aria-label="Навигация по разделам">
      <a className="side-mark" href="#top" aria-label="Моринское — наверх">
        МОРИНСКОЕ
      </a>
      <SideDots />
      <a className="side-cta" href="#book">
        Проверить дату
      </a>
    </aside>
  )
}

export function Hero() {
  return (
    <header className="hero" id="top">
      <Photo k="hero_river" className="hero-art" sizes="(min-width: 1200px) calc(100vw - 96px), (min-width: 768px) 1140px, 530px" priority />
      <div className="hero-shade" aria-hidden="true" />
      <div className="wrap hero-top">
        <a className="mark" href="#top" aria-label="Моринское — наверх">
          МОРИНСКОЕ
        </a>
        <div className="hero-tools">
          <nav className="topnav" aria-label="Основное меню">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`}>
                {n.label}
              </a>
            ))}
          </nav>
          <a className="phone-pill" href={SITE.phoneHref}>
            {SITE.phone}
          </a>
          <a className="icon-btn msg" href={SITE.viber} aria-label="Написать в Viber">
            <Icon name="viber" size={20} sw={1.6} />
          </a>
          <a className="icon-btn msg" href={SITE.telegram} target="_blank" rel="noopener" aria-label="Написать в Telegram">
            <Icon name="telegram" size={20} sw={1.6} />
          </a>
          <a className="icon-btn call" href={SITE.phoneHref} aria-label="Позвонить">
            <Icon name="phone" size={18} sw={1.6} />
          </a>
          <MenuButton className="icon-btn solid menu-open" />
        </div>
      </div>
      <div className="wrap hero-body">
        <span className="kicker">
          {HERO.kicker} · <span className="far">{HERO.kickerFar}</span>
          {HERO.kickerEnd}
        </span>
        <h1>{HERO.title}</h1>
        <div className="hero-cta">
          <a className="btn btn-sand" href="#book">
            {HERO.cta}
          </a>
          <a className="btn btn-line" href="#gallery">
            {HERO.cta2}
          </a>
        </div>
      </div>
      <svg className="wave" viewBox="0 0 1344 90" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d="M0 50 C224 10 448 90 672 50 S1120 10 1344 50 V90 H0Z" fill="#E8DCC4" />
      </svg>
    </header>
  )
}

export function Intro() {
  return (
    <>
      <section className="intro sand-bg" aria-label="Коротко об усадьбе">
        <div className="wrap intro-grid">
          <div className="badge" aria-hidden="true">
            <svg className="ring" viewBox="0 0 172 172" focusable="false">
              <defs>
                <path id="ring" d="M86 86m-64 0a64 64 0 1 1 128 0a64 64 0 1 1-128 0" />
              </defs>
              <text fontFamily="Golos Text, sans-serif" fontSize="12.5" fontWeight="600" letterSpacing="1.84" fill="#E8DCC4">
                <textPath href="#ring" textLength="402" lengthAdjust="spacing">
                  {INTRO.ring}
                </textPath>
              </text>
            </svg>
            <svg className="mid" viewBox="0 0 24 24" fill="none" stroke="#E8DCC4" strokeWidth="1.3" strokeLinecap="round" focusable="false">
              <circle cx="9" cy="10" r="5" />
              <circle cx="15" cy="10" r="5" />
              <path d="M3 19c1.5 0 1.5-1 3-1s1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1" />
            </svg>
          </div>
          <p className="lead">{INTRO.lead}</p>
          <div className="intro-cta">
            <a className="btn btn-dark" href="#book">
              {HERO.cta}
            </a>
            <div className="intro-msg">
              <span>или сразу в мессенджер:</span>
              <a href={SITE.viber}>Viber</a>
              <a href={SITE.telegram} target="_blank" rel="noopener">
                Telegram
              </a>
            </div>
          </div>
          <div className="feats">
            {INTRO.feats.map((f) => (
              <div className="feat" key={f.title}>
                <span className="ic">
                  <Icon name={f.icon} size={22} sw={1.6} />
                </span>
                <span>
                  <b>{f.title}</b>
                  <small>{f.text}</small>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <svg className="wave-down" viewBox="0 0 1344 90" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d="M0 40 C224 80 448 0 672 40 S1120 80 1344 40 V0 H0Z" fill="#E8DCC4" />
      </svg>
    </>
  )
}
