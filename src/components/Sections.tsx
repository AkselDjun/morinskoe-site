import { FAQ, MARQUEE, SERVICES } from '@/content/home'
import { Icon } from './icons'

export function Marquee() {
  const words = [...MARQUEE, ...MARQUEE]
  return (
    <div className="marq" aria-hidden="true">
      <div className="marq-track">
        {words.map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>
    </div>
  )
}

export function Services() {
  return (
    <section className="services" id="services" aria-labelledby="svc-h">
      <div className="wrap">
        <div className="sec-head">
          <h2 id="svc-h">{SERVICES.title}</h2>
          <span className="note">{SERVICES.note}</span>
        </div>
        <div className="svc-grid">
          {SERVICES.items.map((s) => (
            <div className="svc" key={s.title}>
              <Icon name={s.icon} size={30} sw={1.4} color="#E8DCC4" />
              <div>
                <b>{s.title}</b>
                <small>{s.text}</small>
              </div>
            </div>
          ))}
          <div className="price">
            <div>
              <span className="eyebrow">{SERVICES.price.eyebrow}</span>
              <b>{SERVICES.price.title}</b>
            </div>
            <a className="btn btn-dark" href="#book">
              {SERVICES.price.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Faq() {
  const half = Math.ceil(FAQ.items.length / 2)
  const cols = [FAQ.items.slice(0, half), FAQ.items.slice(half)]
  return (
    <section className="faq sand-bg" id="faq" aria-labelledby="faq-h">
      <div className="wrap">
        <div className="sec-head">
          <h2 id="faq-h">{FAQ.title}</h2>
          <span className="note">{FAQ.note}</span>
        </div>
        <div className="faq-grid">
          {cols.map((col, c) => (
            <div className="faq-col" key={c}>
              {col.map((it, i) => (
                <details className="q" key={it.q} open={c === 0 && i === 0}>
                  <summary>
                    {it.q}
                    <i aria-hidden="true" />
                  </summary>
                  <p>{it.a}</p>
                </details>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
