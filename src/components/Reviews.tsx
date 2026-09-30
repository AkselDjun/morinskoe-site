'use client'

import { REVIEWS } from '@/content/home'
import { SITE } from '@/content/site'
import { Stars } from './icons'
import { useConsent } from './Consent'

function Skeleton() {
  const item = (a: number, b: number, lines: number[]) => (
    <div className="yw-item">
      <div className="yw-who">
        <span className="yw-ava" />
        <span className="yw-lines">
          <i style={{ width: a }} />
          <i style={{ width: b }} />
        </span>
      </div>
      <span className="yw-stars">
        <Stars value={5} color="#C9BDA3" size={13} />
      </span>
      <div className="yw-text">
        {lines.map((w, i) => (
          <i key={i} style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  )
  return (
    <div className="yw-items" aria-hidden="true">
      {item(120, 70, [100, 94, 58])}
      {item(96, 84, [100, 88, 40])}
    </div>
  )
}

function Score() {
  return (
    <>
      <span className="eyebrow">Яндекс Карты</span>
      <div className="ya-score">
        <b>{SITE.rating.value}</b>
        <span className="stars" role="img" aria-label={`Оценка ${SITE.rating.value} из 5`}>
          <Stars value={SITE.rating.stars} color="#1E3328" size={18} />
        </span>
      </div>
      <small>
        {SITE.rating.count} · {REVIEWS.cardNote}
      </small>
    </>
  )
}

function Invite() {
  return (
    <div className="rv-band">
      <div className="rv-score">
        <Score />
      </div>
      <div className="rv-ask">
        <b>{REVIEWS.askTitle}</b>
        <p>{REVIEWS.askText}</p>
      </div>
      <a className="btn btn-dark" href={SITE.yandexReviews} target="_blank" rel="noopener">
        {REVIEWS.askButton}
      </a>
    </div>
  )
}

function Widget() {
  const { consent, ready, save } = useConsent()
  const allowed = !!consent?.maps
  return (
    <div className="rv-grid">
      <div className={`yw${allowed ? ' live' : ''}`} role="region" aria-label="Отзывы с Яндекс Карт">
        {allowed ? (
          <iframe
            className="yw-frame"
            src={`https://yandex.ru/maps-reviews-widget/${SITE.yandexOrgId}?comments`}
            title="Отзывы об усадьбе «Моринское» на Яндекс Картах"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <>
            <div className="yw-head">
              <span className="eyebrow">{REVIEWS.consentTitle}</span>
            </div>
            <Skeleton />
            <div className="yw-gate">
              <p>{REVIEWS.consentText}</p>
              <button
                className="btn btn-dark"
                type="button"
                disabled={!ready}
                onClick={() => save({ maps: true, an: consent?.an ?? false })}
              >
                {REVIEWS.consentButton}
              </button>
            </div>
          </>
        )}
      </div>
      <article className="ya">
        <Score />
        <a className="btn btn-dark" href={SITE.yandexMaps} target="_blank" rel="noopener">
          {REVIEWS.cardButton}
        </a>
      </article>
    </div>
  )
}

export function Reviews() {
  const withReviews = SITE.rating.reviews > 0
  return (
    <section className="reviews" id="reviews" aria-labelledby="rv-h">
      <div className="wrap">
        <div className="sec-head">
          <div className="sec-title">
            <span className="eyebrow">{REVIEWS.eyebrow}</span>
            <h2 id="rv-h">{REVIEWS.title}</h2>
          </div>
          <span className="note">{withReviews ? REVIEWS.note : REVIEWS.noteEmpty}</span>
        </div>
        {withReviews ? <Widget /> : <Invite />}
      </div>
    </section>
  )
}
