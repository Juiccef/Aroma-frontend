import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Tiny async-data hook for ShopClient calls. Keeps components declarative
 * and gives the live GraphQL client (real latency) working loading states
 * for free.
 */
export function useShopData<T>(fetcher: () => Promise<T>, deps: unknown[]): {
  data: T | null
  loading: boolean
} {
  const [state, setState] = useState<{ data: T | null; loading: boolean }>({
    data: null,
    loading: true,
  })

  useEffect(() => {
    let alive = true
    setState((s) => ({ ...s, loading: true }))
    fetcher().then((data) => {
      if (alive) setState({ data, loading: false })
    })
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}

/**
 * Adds .is-visible when the element scrolls into view (pairs with .reveal).
 * One shared observer; the callback ref handles attach/detach so it works
 * both for sections that mount immediately and ones that mount after their
 * shop data resolves (and survives StrictMode double-invocation).
 */
const revealObserver =
  typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver(
        (entries, io) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              e.target.classList.add('is-visible')
              io.unobserve(e.target)
            }
          }
        },
        { rootMargin: '0px 0px -8% 0px' },
      )
    : null

export function useReveal<T extends HTMLElement>(): (el: T | null) => void {
  const lastEl = useRef<T | null>(null)
  return useCallback((el: T | null) => {
    if (lastEl.current && revealObserver) revealObserver.unobserve(lastEl.current)
    lastEl.current = el
    if (!el) return
    if (!revealObserver) {
      el.classList.add('is-visible')
      return
    }
    revealObserver.observe(el)
  }, [])
}

/** locks body scroll while a drawer/modal is open */
export function useBodyLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [locked])
}

/** Escape-key handler for dialogs */
export function useEscape(active: boolean, onClose: () => void) {
  useEffect(() => {
    if (!active) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [active, onClose])
}
