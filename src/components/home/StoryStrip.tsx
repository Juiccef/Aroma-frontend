import { Link } from 'react-router-dom'
import { useReveal } from '../../lib/hooks'
import { IconArrow } from '../Icons'
import { Divider } from '../Motif'

export function StoryStrip() {
  const revealRef = useReveal<HTMLElement>()
  return (
    <section ref={revealRef} className="reveal relative overflow-hidden bg-parchment/70">
      <p
        lang="ar"
        dir="rtl"
        aria-hidden
        className="pointer-events-none absolute -top-6 end-4 select-none text-[9rem] leading-none text-bark/8 sm:text-[13rem]"
      >
        أصالة
      </p>
      <div className="relative mx-auto max-w-3xl px-5 py-16 text-center sm:px-8 lg:py-20">
        <Divider className="mx-auto mb-8 w-40 text-gold" />
        <p className="font-display display-tight text-2xl font-medium italic leading-snug text-cocoa sm:text-[2rem]">
          “We roast the way our parents shopped: by the scoop, by the smell, by name. If it
          wouldn't pass at their table, it doesn't leave ours.”
        </p>
        <p className="mt-6 text-[0.95rem] leading-relaxed text-bark">
          AROMA started as a promise to keep the corner-shop ritual alive in Georgia: warm nuts
          weighed by hand, coffee ground with cardamom while you wait, and shelves stacked with the
          sweets of every childhood between Amman, Aleppo and Istanbul.
        </p>
        <Link
          to="/pages/about"
          className="link-ink mt-7 inline-flex items-center gap-2 text-sm font-bold text-gold"
        >
          Read our story <IconArrow size={15} />
        </Link>
      </div>
    </section>
  )
}
