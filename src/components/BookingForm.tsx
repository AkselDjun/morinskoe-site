'use client'

import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import Link from 'next/link'
import { SITE } from '@/content/site'
import { Socials } from './Socials'
import { Icon } from './icons'

type Status = 'idle' | 'sending' | 'failed' | 'done'
type Bad = { name: boolean; phone: boolean; consent: boolean }

function normDigits(v: string) {
  let d = v.replace(/\D/g, '')
  if (d.startsWith('80')) d = '375' + d.slice(2)
  else if ('375'.startsWith(d)) d = '375'
  else if (!d.startsWith('375')) d = '375' + d
  return d.slice(0, 12)
}

function fmtPhone(v: string) {
  const d = normDigits(v)
  const r = d.slice(3)
  let out = '+375'
  if (r.length) out += ' ' + r.slice(0, 2)
  if (r.length > 2) out += ' ' + r.slice(2, 5)
  if (r.length > 5) out += '-' + r.slice(5, 7)
  if (r.length > 7) out += '-' + r.slice(7, 9)
  return out
}

const validate = (name: string, phone: string, consent: boolean): Bad => ({
  name: name.trim().length < 2,
  phone: phone.replace(/\D/g, '').length !== 12,
  consent: !consent,
})

export function BookingForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [msg, setMsg] = useState('')
  const [consent, setConsent] = useState(false)
  const [trap, setTrap] = useState('')
  const [bad, setBad] = useState<Bad | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [offline, setOffline] = useState(false)
  const [sent, setSent] = useState({ name: '', phone: '', msg: '' })
  const started = useRef(0)
  const nameRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const consentRef = useRef<HTMLInputElement>(null)
  const errRef = useRef<HTMLDivElement>(null)
  const doneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    started.current = Date.now()
  }, [])

  useEffect(() => {
    if (status === 'failed') errRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    if (status === 'done') {
      doneRef.current?.focus({ preventScroll: true })
      doneRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }, [status])

  const recheck = (n = name, p = phone, c = consent) => {
    if (bad) setBad(validate(n, p, c))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    const b = validate(name, phone, consent)
    setBad(b)
    if (b.name) return nameRef.current?.focus()
    if (b.phone) return phoneRef.current?.focus()
    if (b.consent) return consentRef.current?.focus()
    setStatus('sending')
    if (SITE.demo) {
      await new Promise((r) => window.setTimeout(r, 1200))
      if (!navigator.onLine) {
        setOffline(true)
        setStatus('failed')
        return
      }
      setSent({ name: name.trim(), phone, msg: msg.trim() || '—' })
      setStatus('done')
      return
    }
    try {
      const ctrl = new AbortController()
      const timer = window.setTimeout(() => ctrl.abort(), 25000)
      const res = await fetch(SITE.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name: name.trim(), phone, msg: msg.trim(), consent: true, hp_field: trap, elapsed: Date.now() - started.current }),
        signal: ctrl.signal,
      }).finally(() => window.clearTimeout(timer))
      const data = (await res.json().catch(() => null)) as { ok?: boolean } | null
      if (!res.ok || !data?.ok) throw new Error('send')
      setSent({ name: name.trim(), phone, msg: msg.trim() || '—' })
      setStatus('done')
    } catch {
      setOffline(!navigator.onLine)
      setStatus('failed')
    }
  }

  const reset = () => {
    setName('')
    setPhone('')
    setMsg('')
    setConsent(false)
    setBad(null)
    setStatus('idle')
    started.current = Date.now()
    requestAnimationFrame(() => nameRef.current?.focus())
  }

  const sending = status === 'sending'

  if (status === 'done') {
    return (
      <div className="done" ref={doneRef} tabIndex={-1} role="status">
        <span className="done-ic" aria-hidden="true">
          <Icon name="check" size={26} sw={1.8} />
        </span>
        <b className="t">Заявка у нас</b>
        <p>Спасибо! Обычно перезваниваем в тот же день. Если удобнее переписка — напишите нам в Viber или Telegram.</p>
        <dl>
          <dt>Имя</dt>
          <dd>{sent.name}</dd>
          <dt>Телефон</dt>
          <dd>{sent.phone}</dd>
          <dt>Сообщение</dt>
          <dd>{sent.msg}</dd>
        </dl>
        <div className="row">
          <button className="btn btn-sand" type="button" onClick={reset}>
            Новая заявка
          </button>
          <Socials names={['viber', 'telegram']} className="row-ic" />
        </div>
        {SITE.demo ? <span className="demo-note">Это демо: заявка никуда не отправлена.</span> : null}
      </div>
    )
  }

  return (
    <form className={`form${sending ? ' sending' : ''}`} noValidate aria-label="Форма обратной связи" aria-busy={sending} onSubmit={submit}>
      <div className="form-head">
        <b>Напишите нам</b>
        <span>Перезвоним и ответим на вопросы</span>
      </div>
      <div className="fields">
        <div className={`field${bad?.name ? ' bad' : ''}`}>
          <label htmlFor="f-name">Имя</label>
          <input
            id="f-name"
            ref={nameRef}
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Анна"
            maxLength={80}
            value={name}
            readOnly={sending}
            aria-invalid={bad?.name || undefined}
            aria-describedby={bad?.name ? 'e-name' : undefined}
            onChange={(e) => {
              setName(e.target.value)
              recheck(e.target.value)
            }}
          />
          <span className="err" id="e-name">
            Напишите, как к вам обращаться
          </span>
        </div>
        <div className={`field${bad?.phone ? ' bad' : ''}`}>
          <label htmlFor="f-phone">Телефон</label>
          <input
            id="f-phone"
            ref={phoneRef}
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+375 __ ___-__-__"
            value={phone}
            readOnly={sending}
            aria-invalid={bad?.phone || undefined}
            aria-describedby={bad?.phone ? 'e-phone' : undefined}
            onFocus={() => {
              if (!phone) setPhone('+375 ')
            }}
            onBlur={() => {
              if (phone.trim() === '+375') setPhone('')
            }}
            onChange={(e) => {
              const el = e.target
              const caret = el.selectionStart ?? el.value.length
              const tail = el.value.length - caret
              let raw = el.value
              const kind = (e.nativeEvent as InputEvent).inputType ?? ''
              const before = phone.replace(/\D/g, '')
              if (raw.length < phone.length && raw.replace(/\D/g, '') === before && kind.startsWith('delete')) {
                const k = raw.slice(0, caret).replace(/\D/g, '').length
                const at = kind === 'deleteContentForward' ? k : k - 1
                raw = at >= 3 ? '+' + before.slice(0, at) + before.slice(at + 1) : raw
              }
              const v = raw.replace(/\D/g, '').length <= 3 && kind.startsWith('delete') ? '+375 ' : fmtPhone(raw)
              setPhone(v)
              recheck(name, v)
              requestAnimationFrame(() => {
                const p = Math.max(0, v.length - tail)
                el.setSelectionRange(p, p)
              })
            }}
          />
          <span className="err" id="e-phone">
            Нужен номер целиком, например <span className="nw">+375 29 123-45-67</span>
          </span>
        </div>
        <div className="field wide">
          <label htmlFor="f-msg">Сообщение</label>
          <textarea
            id="f-msg"
            name="msg"
            rows={4}
            maxLength={2000}
            placeholder="Дата, число гостей, вопросы — как вам удобно"
            value={msg}
            readOnly={sending}
            onChange={(e) => setMsg(e.target.value)}
          />
        </div>
        <div className="hp" aria-hidden="true">
          <label htmlFor="f-hp">Не заполняйте это поле</label>
          <input id="f-hp" name="hp_field" type="text" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
        </div>
      </div>
      <div className={`consent${bad?.consent ? ' bad' : ''}`}>
        <label>
          <input
            ref={consentRef}
            type="checkbox"
            checked={consent}
            disabled={sending}
            aria-invalid={bad?.consent || undefined}
            aria-describedby={bad?.consent ? 'e-consent' : undefined}
            onChange={(e) => {
              setConsent(e.target.checked)
              recheck(name, phone, e.target.checked)
            }}
          />
          <span>
            Согласен(на) на обработку моих данных для ответа на заявку, в том числе на их передачу в Telegram, по{' '}
            <Link href="/privacy/">политике конфиденциальности</Link>
          </span>
        </label>
        <span className="err" id="e-consent">
          Без согласия мы не можем принять заявку
        </span>
      </div>
      {status === 'failed' ? (
        <div className="send-err" role="alert" ref={errRef}>
          <span className="se-ic" aria-hidden="true">
            <Icon name="bang" size={18} sw={2.4} />
          </span>
          <span className="se-t">
            <b>Заявка не отправилась</b>
            <span>
              {offline ? 'Похоже, пропал интернет.' : 'Что-то пошло не так на нашей стороне.'} Всё, что вы написали, осталось в форме — нажмите «Отправить ещё раз» или
              позвоните: <a href={SITE.phoneHref}>{SITE.phone}</a>
            </span>
          </span>
        </div>
      ) : null}
      <button className="btn btn-sand" type="submit" disabled={sending}>
        <span className="spin" aria-hidden="true" />
        <span>{sending ? 'Отправляем…' : status === 'failed' ? 'Отправить ещё раз' : 'Отправить заявку'}</span>
      </button>
      {sending ? <p className="send-hint">Обычно это пара секунд — не закрывайте страницу</p> : null}
      {status === 'failed' ? (
        <div className="send-alt">
          <span>или сразу в мессенджер:</span>
          <Socials names={['viber', 'telegram']} className="send-ic" size={16} />
        </div>
      ) : null}
    </form>
  )
}
