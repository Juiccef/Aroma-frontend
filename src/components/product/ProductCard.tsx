import { Link } from 'react-router-dom'
import type { Product } from '../../lib/shop'
import { useStore } from '../../lib/store-context'
import { IconPlus } from '../Icons'
import { ProductImage } from './ProductImage'
import { BilingualTitle, Price, ProductBadges, WeightNote } from './ProductBits'

export function ProductCard({ product, eager = false }: { product: Product; eager?: boolean }) {
  const { addToCart, openQuickView, cartBusy } = useStore()
  const multiVariant = product.variants.length > 1
  const available = product.availableForSale
  const to = `/products/${product.handle}`

  const quickAdd = () => {
    if (!available) return
    if (multiVariant) openQuickView(product)
    else void addToCart(product.variants[0].id)
  }

  return (
    <article className="group hover-lift relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-cream shadow-card">
      <div className="@container relative aspect-square overflow-hidden border-b border-line/60 bg-white">
        <Link to={to} tabIndex={-1} aria-hidden className="block h-full w-full">
          <ProductImage
            product={product}
            eager={eager}
            className="transition-transform duration-500 ease-out group-hover:scale-[1.045]"
          />
        </Link>
        <ProductBadges product={product} className="absolute start-3 top-3 z-10" />

        {/* desktop hover actions */}
        <div className="pointer-events-none absolute inset-x-3 bottom-3 z-10 hidden gap-2 opacity-0 transition-all duration-300 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100 sm:flex sm:translate-y-1.5 sm:group-focus-within:translate-y-0 sm:group-hover:translate-y-0">
          <button
            type="button"
            onClick={() => openQuickView(product)}
            className="flex-1 rounded-full border border-espresso/15 bg-cream/95 px-3 py-2 text-xs font-bold tracking-wide text-espresso backdrop-blur-sm transition-colors hover:bg-paper"
          >
            Quick view
          </button>
          <button
            type="button"
            onClick={quickAdd}
            disabled={cartBusy || !available}
            className="flex-1 rounded-full bg-espresso px-3 py-2 text-xs font-bold tracking-wide text-cream transition-colors hover:bg-cocoa disabled:opacity-50"
          >
            {!available ? 'Sold out' : multiVariant ? 'Choose size' : 'Add to cart'}
          </button>
        </div>

        {/* mobile quick-add */}
        <button
          type="button"
          onClick={quickAdd}
          disabled={cartBusy || !available}
          aria-label={multiVariant ? `Choose a size for ${product.title}` : `Add ${product.title} to cart`}
          className="absolute bottom-3 end-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-espresso text-cream shadow-card transition-transform active:scale-90 disabled:opacity-40 sm:hidden"
        >
          <IconPlus size={16} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <Link to={to} className="outline-offset-4">
          <BilingualTitle
            product={product}
            className="text-[0.92rem] font-bold leading-snug"
            arClassName="mt-0.5 text-[0.95rem] font-normal leading-snug text-mocha"
          />
        </Link>
        <WeightNote product={product} />
        <Price product={product} className="mt-auto pt-1 font-display text-lg font-semibold" />
      </div>
    </article>
  )
}
