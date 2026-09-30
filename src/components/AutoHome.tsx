'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useConsent } from './Consent'

const SECONDS = 6

const word = (n: number) => (n === 1 ? 'секунду' : n >= 2 && n <= 4 ? 'секунды' : 'секунд')

export function AutoHome() {
  const router = useRouter()
  const [left, setLeft] = useState(SECONDS)
  const [stopped, setStopped] = useState(false)
  const { ready, bannerOpen } = useConsent()
  const paused = !ready || bannerOpen

  useEffect(() => {
    router.prefetch('/')
  }, [router])

  useEffect(() => {
    if (stopped || paused) return
    if (left <= 0) {
      router.replace('/')
      return
    }
    const t = window.setTimeout(() => setLeft((x) => x - 1), 1000)
    return () => window.clearTimeout(t)
  }, [left, stopped, paused, router])

  if (stopped) return null

  return (
    <div className="nf-auto">
      <p aria-live="polite">
        Через {left} {word(left)} откроем главную
      </p>
      <button type="button" onClick={() => setStopped(true)}>
        Остаться здесь
      </button>
      <span className="nf-auto-bar" aria-hidden="true">
        <i style={{ animationDuration: `${SECONDS}s`, animationPlayState: paused ? 'paused' : 'running' }} />
      </span>
    </div>
  )
}
