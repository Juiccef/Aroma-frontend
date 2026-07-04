import { useRef } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../../lib/shop'
import { useReveal } from '../../lib/hooks'
import { IconArrow } from '../Icons'
import { SectionHeading } from '../Motif'
import { ProductCard } from './ProductCard'

export function ProductRail({
  eyebrow,
  title,
  titleAr,
  to,
  products,
  className = '',
}: {
  eyebrow?: string
  title: string
  titleAr?: string
  to?: string
  products: Product[]
  className?: string
}) {
  const railRef = useRef<HTMLDivElement>(null)
  const revealRef = useReveal<HTMLElement>()

  if (products.length === 0) return null

  const scrollBy = (dir: 1 | -1) => {
    railRef.current?.scrollBy({ left: dir * 560, behavior: 'smooth' })
  }

  return (
    <section ref={revealRef} className={`reveal ${className}`}>
      <div className="mx-auto flex max-w-7xl items-end justify-between gap-4 px-5 sm:px-8">
        <SectionHeading eyebrow={eyebrow} title={title} titleAr={titleAr} />
        <div className="flex items-center gap-3 pb-1">
          {to && (
            <Link to={to} className="link-ink hidden items-center gap-2 text-sm font-bold text-bark sm:inline-flex">
              View all <IconArrow size={15} />
            </Link>
          )}
          <div className="hidden gap-2 lg:flex">
            <button
              type="button"
              aria-label="Scroll back"
              onClick={() => scrollBy(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-cream text-espresso transition-colors hover:border-bark"
            >
              <IconArrow size={16} className="rotate-180" />
            </button>
            <button
              type="button"
              aria-label="Scroll forward"
              onClick={() => scrollBy(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-cream text-espresso transition-colors hover:border-bark"
            >
              <IconArrow size={16} />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={railRef}
        className="no-scrollbar snap-rail mt-6 flex gap-4 overflow-x-auto px-5 pb-2 sm:px-8 lg:[padding-inline-start:max(2rem,calc((100vw-80rem)/2+2rem))]"
      >
        {products.map((p, i) => (
          <div key={p.id} className="w-[230px] shrink-0 sm:w-[262px]">
            <ProductCard product={p} eager={i < 2} />
          </div>
        ))}
        {to && (
          <Link
            to={to}
            className="flex w-[160px] shrink-0 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-bark/40 text-bark transition-colors hover:border-bark hover:bg-parchment/60"
          >
            <IconArrow size={22} />
            <span className="text-sm font-bold">View all</span>
          </Link>
        )}
      </div>
    </section>
  )
}
