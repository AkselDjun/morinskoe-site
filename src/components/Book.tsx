import Link from 'next/link'
import { BOOK, FOOTER } from '@/content/home'
import { SITE } from '@/content/site'
import { BookingForm } from './BookingForm'
import { CookieSettingsButton } from './Consent'

export function Book() {
  return (
    <section className="book" id="book" aria-labelledby="book-h">
      <div className="wrap">
        <ol className="steps" aria-label="Как забронировать">
          {BOOK.steps.map((s, i) => (
            <li key={s.title}>
              <span className="num">{i + 1}</span>
              <span>
                <b>{s.title}</b>
                <small>{s.text}</small>
              </span>
            </li>
          ))}
        </ol>
        <div className="book-grid">
          <div className="contacts" id="contacts">
            <h2 id="book-h">{BOOK.title}</h2>
            <p>{BOOK.text}</p>
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
          </div>
          <div className="formcard">
            <BookingForm />
          </div>
        </div>
      </div>
    </section>
  )
}

export function Footer({ onPolicy }: { onPolicy?: boolean }) {
  return (
    <footer className="foot">
      <div className="wrap foot-in">
        <Link className="fmark" href="/">
          Моринское
        </Link>
        <span className="foot-mid">
          <span>{FOOTER.tagline}</span>
          <span className="legal">
            {SITE.operator} · УНП {SITE.unp}
          </span>
        </span>
        <span className="foot-links">
          {onPolicy ? <span className="here">Политика конфиденциальности</span> : <Link href="/privacy/">Политика конфиденциальности</Link>}
          <CookieSettingsButton />
          <span>© {SITE.year}</span>
        </span>
        {SITE.demo ? <span className="demo-line">Демо-версия сайта. Заявки с этой страницы никуда не отправляются.</span> : null}
      </div>
    </footer>
  )
}
