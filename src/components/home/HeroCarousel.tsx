import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { shop } from '../../lib/shop'
import type { Product } from '../../lib/shop'
import { heroImageOverrides } from '../../content/site'
import { useShopData } from '../../lib/hooks'
import { IconArrow } from '../Icons'
import { StarMotif } from '../Motif'
import { ProductImage } from '../product/ProductImage'

function HeroImage({
  product,
  width,
  sizes,
  eager,
}: {
  product: Product
  width: number
  sizes: string
  eager?: boolean
}) {
  const override = heroImageOverrides[product.handle]
  if (override) {
    return (
      <img
        src={override}
        alt={product.title}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="h-full w-full object-cover"
      />
    )
  }
  return <ProductImage product={product} width={width} sizes={sizes} eager={eager} />
}

interface Slide {
  eyebrow: string
  title: [string, string]
  titleAr: string
  copy: string
  primary: { label: string; to: string }
  secondary: { label: string; to: string }
  /** real catalog products for the visual side */
  handles: [string, string]
}

const slides: Slide[] = [
  {
    eyebrow: 'Roasted this week in Duluth, Georgia',
    title: ['The roast you', 'grew up around'],
    titleAr: 'محمّص على أصوله',
    copy: 'Pistachios, cashews and watermelon seeds, roasted in small batches and seasoned by hand, sold by the scoop just like back home.',
    primary: { label: 'Shop Nuts & Seeds', to: '/collections/nuts-seeds' },
    secondary: { label: 'Best sellers', to: '/collections/best-sellers' },
    handles: ['pistachios-salted', 'watermelon-seeds-salted'],
  },
  {
    eyebrow: 'Ground fresh · هيل وقهوة',
    title: ['Cardamom', 'in the air'],
    titleAr: 'قهوة بالهيل',
    copy: 'House-ground coffee with cardamom, karak for the stovetop and chai from Aden. One pot and the whole house smells like a visit to Teta.',
    primary: { label: 'Shop Coffee & Tea', to: '/collections/coffee' },
    secondary: { label: 'Karak & chai', to: '/collections/coffee?tag=karak-chai' },
    handles: ['coffee-mixed-with-cardamom', 'karak-tea-original'],
  },
  {
    eyebrow: 'Gifts, trays & sweetness',
    title: ['Sweetness worth', 'wrapping up'],
    titleAr: 'حلويات تليق بالهدية',
    copy: 'Hand-filled chocolates, rose-dusted Turkish delights and mamool, ready for Eid tables, wedding trays and every excuse in between.',
    primary: { label: 'Shop Sweets', to: '/collections/snacks?tag=arabic-sweets' },
    secondary: { label: 'Gifting guide', to: '/pages/gifting' },
    handles: ['mixed-chocolates', 'mixed-turkish-delights'],
  },
]

const allHandles = [...new Set(slides.flatMap((s) => s.handles))]

export function HeroCarousel() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const regionRef = useRef<HTMLElement>(null)
  const pointerStart = useRef<{ x: number; y: number } | null>(null)

  const { data: products } = useShopData<Product[]>(() => shop.getProductsByHandles(allHandles), [])
  const byHandle = useMemo(() => new Map((products ?? []).map((p) => [p.handle, p])), [products])

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setActive((i) => (i + 1) % slides.length), 6500)
    return () => clearInterval(id)
  }, [paused])

  const goNext = () => setActive((i) => (i + 1) % slides.length)
  const goPrev = () => setActive((i) => (i - 1 + slides.length) % slides.length)

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStart.current = { x: e.clientX, y: e.clientY }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    const start = pointerStart.current
    pointerStart.current = null
    if (!start) return
    const dx = e.clientX - start.x
    const dy = e.clientY - start.y
    // require a mostly-horizontal drag past a small threshold so vertical
    // scrolling and ordinary taps/clicks never get mistaken for a swipe
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return
    if (dx < 0) goNext()
    else goPrev()
  }

  return (
    <section
      ref={regionRef}
      aria-roledescription="carousel"
      aria-label="Featured"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        pointerStart.current = null
      }}
      onDragStart={(e) => e.preventDefault()}
      className="touch-pan-y grain relative overflow-hidden bg-espresso text-paper"
    >
      <div className="pattern-star absolute inset-0 opacity-[0.06]" aria-hidden />
      {/* warm glow behind the media side */}
      <div
        aria-hidden
        className="absolute -end-40 top-1/2 h-[46rem] w-[46rem] -translate-y-1/2 rounded-full opacity-25 blur-3xl"
        style={{ background: 'radial-gradient(circle, #d2a44c 0%, transparent 65%)' }}
      />

      <div className="relative mx-auto grid max-w-7xl">
        {slides.map((slide, i) => {
          const main = byHandle.get(slide.handles[0])
          const side = byHandle.get(slide.handles[1])
          const current = i === active
          return (
            <div
              key={slide.titleAr}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
              aria-hidden={!current}
              className={`col-start-1 row-start-1 grid items-center gap-10 px-5 pb-20 pt-14 transition-opacity duration-700 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pb-24 lg:pt-20 ${
                current ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              <div className={current ? 'animate-fade-up' : ''}>
                <p className="eyebrow flex items-center gap-2 text-goldlight">
                  <StarMotif size={14} /> {slide.eyebrow}
                </p>
                <h1 className="font-display display-tight mt-5 text-[clamp(2.6rem,7vw,4.6rem)] font-semibold">
                  {slide.title[0]}
                  <br />
                  <em className="text-goldlight">{slide.title[1]}</em>
                </h1>
                <p lang="ar" dir="rtl" className="mt-4 text-start text-2xl text-paper/70">
                  {slide.titleAr}
                </p>
                <p className="mt-5 max-w-lg text-[0.98rem] leading-relaxed text-paper/80">
                  {slide.copy}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    to={slide.primary.to}
                    tabIndex={current ? 0 : -1}
                    className="group inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-bold text-espresso transition-colors hover:bg-goldlight"
                  >
                    {slide.primary.label}
                    <IconArrow size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    to={slide.secondary.to}
                    tabIndex={current ? 0 : -1}
                    className="rounded-full border border-cream/30 px-7 py-3.5 text-sm font-bold text-paper transition-colors hover:border-goldlight hover:text-goldlight"
                  >
                    {slide.secondary.label}
                  </Link>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                <div className="@container arch relative z-10 ms-auto aspect-[4/4.8] w-[78%] overflow-hidden border border-cream/15 shadow-lift">
                  {main && (
                    <HeroImage product={main} width={900} sizes="(min-width:1024px) 40vw, 80vw" eager={i === 0} />
                  )}
                </div>
                {side && (
                  <Link
                    to={`/products/${side.handle}`}
                    tabIndex={current ? 0 : -1}
                    className="@container hover-lift absolute -bottom-6 start-0 z-20 block w-[44%] -rotate-3 overflow-hidden rounded-2xl border border-cream/20 shadow-lift"
                  >
                    <div className="aspect-square">
                      <HeroImage product={side} width={480} sizes="20vw" />
                    </div>
                  </Link>
                )}
                <StarMotif
                  size={54}
                  className="absolute -top-4 start-6 z-0 text-gold/50 max-lg:hidden"
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* controls */}
      <div className="absolute bottom-7 start-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rtl:translate-x-1/2 lg:start-8 lg:translate-x-0 lg:rtl:translate-x-0">
        {slides.map((s, i) => (
          <button
            key={s.titleAr}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === active}
            onClick={() => setActive(i)}
            className={`h-2 rounded-full transition-all duration-400 ${
              i === active ? 'w-8 bg-gold' : 'w-2 bg-cream/35 hover:bg-cream/60'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
