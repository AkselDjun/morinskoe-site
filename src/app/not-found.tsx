import type { Metadata } from 'next'
import Link from 'next/link'
import { NAV } from '@/content/home'
import { SITE } from '@/content/site'
import { Icon } from '@/components/icons'
import { Photo, coverSizes } from '@/components/Photo'
import { AutoHome } from '@/components/AutoHome'

export const metadata: Metadata = {
  title: 'Страница не найдена',
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
}

export default function NotFound() {
  return (
    <div className="nf">
      <div className="nf-bar">
        <Link className="nf-mark" href="/">
          Моринское
        </Link>
        <a className="nf-tel" href={SITE.phoneHref} aria-label="Позвонить">
          <Icon name="phone" size={18} sw={1.6} />
          <span>{SITE.phone}</span>
        </a>
      </div>
      <main className="nf-in">
        <figure className="nf-ph">
          <Photo k="river_fog" pos="70% 62%" sizes={coverSizes('river_fog', [
              [1100, 440, 640],
              [768, 340, 400],
              [null, 220, 260],
            ])} alt="Утренний туман над Неманом, деревянная дорожка ведёт к бане-бочке на берегу" eager />
          <figcaption>Баня-бочка на берегу Немана</figcaption>
        </figure>
        <div className="nf-tx">
          <span className="eyebrow">Ошибка 404 · страница не найдена</span>
          <h1>
            Тропинка ведёт<br /> не туда
          </h1>
          <p>Такой страницы на сайте нет: возможно, ссылка устарела или в адресе опечатка. Всё главное — на главной: шатёр, дома, берег Немана и свободные даты.</p>
          <div className="nf-btns">
            <Link className="btn btn-sand" href="/">
              <Icon name="chevL" size={18} sw={1.8} />
              На главную
            </Link>
            <a className="btn btn-river" href={SITE.phoneHref}>
              <Icon name="phone" size={18} sw={1.6} />
              Позвонить
            </a>
          </div>
          <AutoHome />
          <div className="nf-chips">
            <span>Или сразу в раздел</span>
            <div>
              {NAV.map((n) => (
                <Link key={n.id} href={`/#${n.id}`}>
                  {n.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
