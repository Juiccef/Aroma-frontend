import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../../lib/store-context'
import { useBodyLock, useEscape } from '../../lib/hooks'
import { origin } from '../../lib/shop'
import { IconArrow, IconClose } from '../Icons'
import { ProductImage } from './ProductImage'
import { Price, ProductBadges, WeightNote } from './ProductBits'
import { PurchasePanel } from './PurchasePanel'
import { arabicTitle } from '../../lib/shop'

export function QuickView() {
  const { quickView: product, closeQuickView } = useStore()
  const panelRef = useRef<HTMLDivElement>(null)
  const open = Boolean(product)

  useBodyLock(open)
  useEscape(open, closeQuickView)

  useEffect(() => {
    if (open) panelRef.current?.focus()
  }, [open, product?.id])

  if (!product) return null
  const ar = arabicTitle(product)

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view: ${product.title}`}
    >
      <button
        type="button"
        aria-label="Close quick view"
        onClick={closeQuickView}
        className="animate-fade-in absolute inset-0 bg-espresso/55 backdrop-blur-[2px]"
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className="animate-fade-up relative grid max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-paper shadow-lift outline-none sm:grid-cols-2 sm:rounded-3xl"
      >
        <button
          type="button"
          onClick={closeQuickView}
          aria-label="Close"
          className="absolute end-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-cream/90 text-espresso shadow-card transition-colors hover:bg-cream"
        >
          <IconClose size={16} />
        </button>

        <div className="@container relative aspect-square bg-white max-sm:max-h-[38dvh] max-sm:overflow-hidden">
          <ProductImage product={product} width={800} sizes="(min-width: 640px) 380px, 100vw" eager />
          <ProductBadges product={product} className="absolute start-4 top-4" />
        </div>

        <div className="flex flex-col gap-3 p-6 sm:p-7">
          {origin(product) && (
            <p className="eyebrow text-pistachio">{origin(product)} origin</p>
          )}
          <div>
            <h2 className="font-display display-tight text-2xl font-semibold">{product.title}</h2>
            {ar && (
              <p lang="ar" dir="rtl" className="mt-1 text-lg text-mocha">
                {ar}
              </p>
            )}
          </div>
          <Price product={product} className="font-display text-xl font-semibold" />
          <WeightNote product={product} />
          {product.description && (
            <p className="text-sm leading-relaxed text-bark">{product.description}</p>
          )}
          <div className="mt-1">
            <PurchasePanel product={product} />
          </div>
          <Link
            to={`/products/${product.handle}`}
            onClick={closeQuickView}
            className="link-ink mt-1 inline-flex items-center gap-2 self-start text-sm font-bold text-bark"
          >
            View full details <IconArrow size={15} />
          </Link>
        </div>
      </div>
    </div>
  )
}
