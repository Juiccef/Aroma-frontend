import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../../lib/hooks'
import { IconArrow, IconMaximize, IconPause, IconPlay } from '../Icons'
import { StarMotif } from '../Motif'

/**
 * Real in-store footage: a bag opened and packed on camera, no stock
 * photography. Trimmed to 18s to cut the source clip's original
 * pre-launch "coming to Duluth" title card.
 */
export function BehindTheCounter() {
  const revealRef = useReveal<HTMLElement>()
  const videoRef = useRef<HTMLVideoElement>(null)
  const userControlled = useRef(false)
  const [paused, setPaused] = useState(true)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    const onPlay = () => setPaused(false)
    const onPause = () => setPaused(true)
    el.addEventListener('play', onPlay)
    el.addEventListener('pause', onPause)
    return () => {
      el.removeEventListener('play', onPlay)
      el.removeEventListener('pause', onPause)
    }
  }, [])

  useEffect(() => {
    const el = videoRef.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (userControlled.current) return
        if (entry.isIntersecting) void el.play().catch(() => {})
        else el.pause()
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const togglePlay = () => {
    userControlled.current = true
    const el = videoRef.current
    if (!el) return
    if (el.paused) void el.play().catch(() => {})
    else el.pause()
  }

  const maximize = () => {
    const el = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null
    if (!el) return
    if (el.requestFullscreen) void el.requestFullscreen().catch(() => {})
    else if (el.webkitEnterFullscreen) el.webkitEnterFullscreen()
  }

  return (
    <section ref={revealRef} className="reveal grain relative overflow-hidden bg-espresso text-paper">
      <div className="pattern-star absolute inset-0 opacity-[0.06]" aria-hidden />
      <div
        aria-hidden
        className="absolute -start-32 top-1/2 h-[40rem] w-[40rem] -translate-y-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #d2a44c 0%, transparent 65%)' }}
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:py-20">
        <div className="order-2 mx-auto w-full max-w-sm lg:order-1">
          <div className="group relative aspect-[9/16] w-full overflow-hidden rounded-2xl border border-cream/15 bg-cocoa shadow-lift">
            <video
              ref={videoRef}
              poster="/media/hero-bag-reveal-poster.jpg"
              muted
              loop
              playsInline
              preload="none"
              onClick={togglePlay}
              className="h-full w-full cursor-pointer object-cover"
            >
              <source src="/media/hero-bag-reveal.mp4" type="video/mp4" />
            </video>

            <button
              type="button"
              onClick={togglePlay}
              aria-label={paused ? 'Play video' : 'Pause video'}
              className="absolute bottom-4 start-4 flex h-11 w-11 items-center justify-center rounded-full bg-espresso/70 text-cream backdrop-blur-sm transition-colors hover:bg-espresso/90"
            >
              {paused ? <IconPlay size={18} className="ms-0.5" /> : <IconPause size={18} />}
            </button>
            <button
              type="button"
              onClick={maximize}
              aria-label="View fullscreen"
              className="absolute bottom-4 end-4 flex h-11 w-11 items-center justify-center rounded-full bg-espresso/70 text-cream backdrop-blur-sm transition-colors hover:bg-espresso/90"
            >
              <IconMaximize size={17} />
            </button>
          </div>
          <StarMotif size={44} className="absolute -top-2 end-4 text-gold/50 max-lg:hidden lg:end-10" />
        </div>

        <div className="order-1 lg:order-2">
          <p className="eyebrow flex items-center gap-2 text-goldlight">
            <StarMotif size={14} /> Behind the counter
          </p>
          <h2 className="font-display display-tight mt-5 text-[clamp(2.2rem,5vw,3.4rem)] font-semibold">
            Straight from our <em className="text-goldlight">counter to yours</em>
          </h2>
          <p lang="ar" dir="rtl" className="mt-4 text-start text-2xl text-paper/70">
            طازة بإيدينا
          </p>
          <p className="mt-5 max-w-lg text-[0.98rem] leading-relaxed text-paper/80">
            Real footage from our counter. Every bag is packed by hand in Duluth: the same nuts,
            chocolate and coffee you will find on the shelf when you visit.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/collections/best-sellers"
              className="group inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-bold text-espresso transition-colors hover:bg-goldlight"
            >
              Shop Best Sellers
              <IconArrow size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/pages/about"
              className="rounded-full border border-cream/30 px-7 py-3.5 text-sm font-bold text-paper transition-colors hover:border-goldlight hover:text-goldlight"
            >
              Our story
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
