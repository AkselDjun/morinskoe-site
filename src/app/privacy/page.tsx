import type { Metadata } from 'next'
import Link from 'next/link'
import { ANALYTICS, ANALYTICS_ROWS, POLICY_DATE, POLICY_LAW, POLICY_LEAD, POLICY_SECTIONS, POLICY_SUMMARY, POLICY_TITLE } from '@/content/policy'
import type { PolicyBlock } from '@/content/types'
import { SITE, host } from '@/content/site'
import { Icon } from '@/components/icons'
import { Footer } from '@/components/Book'
import { PolicyToc } from '@/components/PolicyToc'
import { OG_BASE } from '@/lib/meta'
import { JsonLd } from '@/components/JsonLd'
import { breadcrumbSchema } from '@/lib/seo'

export const metadata: Metadata = {
  title: POLICY_TITLE,
  description: POLICY_LEAD,
  alternates: { canonical: '/privacy/' },
  openGraph: { ...OG_BASE, title: `${POLICY_TITLE} — ${SITE.name}`, description: POLICY_LEAD, url: '/privacy/' },
}

const fill = (s: string) =>
  s
    .replaceAll('{{phone}}', `<a class="nw" href="${SITE.phoneHref}">${SITE.phone}</a>`)
    .replaceAll('{{email}}', `<a class="nw" href="mailto:${SITE.email}">${SITE.email}</a>`)
    .replaceAll('{{host}}', host())
    .replaceAll('{{address}}', SITE.address)

const Html = ({ as: Tag = 'p', html }: { as?: 'p' | 'li' | 'dd' | 'td' | 'span'; html: string }) => <Tag dangerouslySetInnerHTML={{ __html: fill(html) }} />

function Block({ b }: { b: PolicyBlock }) {
  switch (b.type) {
    case 'p':
      return <Html html={b.html} />
    case 'note':
      return (
        <div className="pl-note">
          <span className="pl-ic" aria-hidden="true">
            <Icon name="info" size={18} sw={1.7} />
          </span>
          <Html html={b.html} />
        </div>
      )
    case 'ul':
      return (
        <ul>
          {b.items.map((it, i) => (
            <Html key={i} as="li" html={it} />
          ))}
        </ul>
      )
    case 'dl':
      return (
        <dl className="pl-dl">
          {b.rows.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <Html as="dd" html={v} />
            </div>
          ))}
        </dl>
      )
    case 'table':
      return (
        <div className="pl-table">
          <table>
            <thead>
              <tr>
                {b.cols.map((c, i) => (
                  <th key={c} scope="col" style={{ width: `${b.widths[i]}%` }}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.filter((r) => ANALYTICS || !ANALYTICS_ROWS.includes(r[0])).map((r, i) => (
                <tr key={i}>
                  {r.map((v, j) => (
                    <td key={j} data-label={b.cols[j]} dangerouslySetInnerHTML={{ __html: fill(v) }} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
  }
}

export default function PrivacyPage() {
  return (
    <div className="policy">
      <header className="pl-top">
        <div className="pl-bar">
          <Link className="pl-back" href="/">
            <Icon name="chevL" size={18} sw={1.8} />
            Вернуться на сайт
          </Link>
          <Link className="pl-mark" href="/">
            МОРИНСКОЕ
          </Link>
        </div>
        <div className="pl-head">
          <span className="eyebrow">Документы</span>
          <h1>{POLICY_TITLE}</h1>
          <p>{POLICY_LEAD}</p>
          <div className="pl-meta">
            <span>Редакция от {POLICY_DATE}</span>
            <span>{POLICY_LAW}</span>
          </div>
        </div>
      </header>
      <main className="pl-body">
        <div className="pl-grid">
          <PolicyToc items={POLICY_SECTIONS.map((s) => ({ id: s.id, title: s.title }))} />
          <div className="pl-content">
            <div className="pl-sum">
              <b>Коротко</b>
              <ul>
                {POLICY_SUMMARY.map((s, i) => (
                  <li key={i}>
                    <span className="pl-ic" aria-hidden="true">
                      <Icon name="check" size={16} sw={1.9} />
                    </span>
                    <span dangerouslySetInnerHTML={{ __html: fill(s) }} />
                  </li>
                ))}
              </ul>
            </div>
            {POLICY_SECTIONS.map((s, i) => (
              <section className="pl-sec" id={s.id} key={s.id} aria-labelledby={`${s.id}-h`}>
                <h2 id={`${s.id}-h`}>
                  <span>{i + 1}</span>
                  {s.title}
                </h2>
                {s.blocks.map((b, j) => (
                  <Block key={j} b={b} />
                ))}
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer onPolicy />
      <JsonLd data={breadcrumbSchema(POLICY_TITLE, '/privacy/')} />
    </div>
  )
}
