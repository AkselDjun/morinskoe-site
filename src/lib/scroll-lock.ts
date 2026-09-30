let locks = 0

export function lockScroll(on: boolean) {
  locks = Math.max(0, locks + (on ? 1 : -1))
  document.documentElement.style.overflow = locks > 0 ? 'hidden' : ''
}
