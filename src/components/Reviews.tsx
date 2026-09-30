import { REVIEWS } from '@/content/home'
import { SITE } from '@/content/site'
import { Stars } from './icons'

export function Reviews() {
  return (
    <section className="reviews" id="reviews" aria-labelledby="rv-h">
      <div className="wrap">
        <div className="sec-head">
          <div className="sec-title">
            <span className="eyebrow">{REVIEWS.eyebrow}</span>
            <h2 id="rv-h">{REVIEWS.title}</h2>
          </div>
          <span className="note">{REVIEWS.note}</span>
        </div>
        <div className="rv-band">
          <div className="rv-score">
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
          </div>
          <div className="rv-ask">
            <b>{REVIEWS.askTitle}</b>
            <p>{REVIEWS.askText}</p>
          </div>
          <a className="btn btn-dark" href={SITE.yandexReviews} target="_blank" rel="noopener">
            {REVIEWS.askButton}
          </a>
        </div>
      </div>
    </section>
  )
}
