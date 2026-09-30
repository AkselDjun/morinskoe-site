'use client'

import { useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import { SITE } from '@/content/site'

export function PolicyToc({ items }: { items: { id: string; title: string }[] }) {
  const [on, setOn] = useState(items[0]?.id)

  useEffect(() => {
    const update = () => {
      let cur = items[0]?.id
      items.forEach((it) => {
        const el = document.getElementById(it.id)
        if (el && el.getBoundingClientRect().top < 160) cur = it.id
      })
      setOn(cur)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [items])

  const jump = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    e.preventDefault()
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <nav className="pl-toc" aria-label="Содержание">
      <b>Содержание</b>
      <ol>
        {items.map((it, i) => (
          <li key={it.id}>
            <a href={`#${it.id}`} className={on === it.id ? 'on' : undefined} aria-current={on === it.id ? 'true' : undefined} onClick={(e) => jump(e, it.id)}>
              {i + 1}. {it.title}
            </a>
          </li>
        ))}
      </ol>
      <div className="pl-ask">
        <span>Вопросы по данным</span>
        <a href={SITE.phoneHref}>{SITE.phone}</a>
        <small>Звонки, Telegram, Viber</small>
      </div>
    </nav>
  )
}
