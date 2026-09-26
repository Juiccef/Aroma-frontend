import { useRef } from 'react'
import { reviews, site } from '../../content/site'
import { useReveal } from '../../lib/hooks'
import { IconArrow, IconStar } from '../Icons'
import { SectionHeading } from '../Motif'

/**
 * Real Google reviews, transcribed in content/site.ts; swap in a live
 * Judge.me / Okendo / Google Reviews feed with the same shape at launch.
 */
export function ReviewsBlock() {
  const revealRef = useReveal<HTMLElement>()
  const trackRef = useRef<HTMLDivElement>(null)

  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    const card = el.firstElementChild as HTMLElement | null
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  return (
    <section ref={revealRef} className="reveal mx-auto max-w-7xl px-5 sm:px-8">
      <SectionHeading
        eyebrow="From the community"
        title="Kind words"
        titleAr="كلام طيب"
        align="center"
      />
      <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-sm font-bold text-mocha">
        <span className="flex gap-0.5 text-gold">
          {Array.from({ length: 5 }).map((_, i) => (
            <IconStar key={i} size={14} />
          ))}
        </span>
        {site.googleRating.value.toFixed(1)} on Google · {site.googleRating.count} reviews
      </p>

      <div className="relative mt-9">
        <div
          ref={trackRef}
          className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:gap-5 sm:px-0"
        >
          {reviews.map((review) => (
            <figure
              key={review.author}
              className="keyline flex w-[85%] shrink-0 snap-start flex-col rounded-2xl bg-cream p-6 sm:w-[calc((100%-2.5rem)/3)] sm:p-7"
            >
              <div className="flex gap-1 text-gold" aria-label={`${review.rating} out of 5 stars`}>
                {Array.from({ length: review.rating }).map((_, i) => (
                  <IconStar key={i} size={15} />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-[0.92rem] leading-relaxed text-cocoa">
                “{review.quote}”
              </blockquote>
              <figcaption className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-mocha">
                {review.author}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            aria-label="Previous reviews"
            onClick={() => scrollByCard(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-cream text-espresso transition-colors hover:border-bark"
          >
            <IconArrow size={16} className="rotate-180 rtl:rotate-0" />
          </button>
          <button
            type="button"
            aria-label="Next reviews"
            onClick={() => scrollByCard(1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-cream text-espresso transition-colors hover:border-bark"
          >
            <IconArrow size={16} className="rtl:rotate-180" />
          </button>
        </div>
      </div>
    </section>
  )
}
