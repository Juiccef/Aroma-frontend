import { sampleReviews } from '../../content/site'
import { useReveal } from '../../lib/hooks'
import { IconStar } from '../Icons'
import { SectionHeading } from '../Motif'

/**
 * Review content comes from content/site.ts (sample data); swap in a live
 * Judge.me / Okendo / Google Reviews feed with the same shape at launch.
 */
export function ReviewsBlock() {
  const revealRef = useReveal<HTMLElement>()
  return (
    <section ref={revealRef} className="reveal mx-auto max-w-7xl px-5 sm:px-8">
      <SectionHeading
        eyebrow="From the community"
        title="Kind words"
        titleAr="كلام طيب"
        align="center"
      />
      <div className="mt-9 grid gap-4 sm:grid-cols-3 sm:gap-5">
        {sampleReviews.map((review) => (
          <figure
            key={review.author}
            className="keyline flex flex-col rounded-2xl bg-cream p-6 sm:p-7"
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
    </section>
  )
}
