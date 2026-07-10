import type { Product } from '../../lib/shop'
import { arabicTitle, hasPriceRange, isHalal, onSale, origin, soldByWeight } from '../../lib/shop'
import { formatMoney } from '../../lib/format'

/** EN | AR product title lockup */
export function BilingualTitle({
  product,
  className = '',
  arClassName = '',
}: {
  product: Product
  className?: string
  arClassName?: string
}) {
  const ar = arabicTitle(product)
  return (
    <span className={`block ${className}`}>
      <span className="block">{product.title}</span>
      {ar && (
        <span lang="ar" dir="rtl" className={`block ${arClassName}`}>
          {ar}
        </span>
      )}
    </span>
  )
}

/** price line, weight-variant aware: "From $8.00" */
export function Price({ product, className = '' }: { product: Product; className?: string }) {
  const min = product.priceRange.minVariantPrice
  const compare = product.variants[0]?.compareAtPrice
  const sale = onSale(product)
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <span className={sale ? 'text-terracotta' : ''}>
        {hasPriceRange(product) && <span className="text-[0.82em] opacity-70">From </span>}
        {formatMoney(min)}
      </span>
      {sale && compare && (
        <s className="text-[0.85em] opacity-50">{formatMoney(compare)}</s>
      )}
    </span>
  )
}

/** halal / origin / sale / weight chips */
export function ProductBadges({ product, className = '' }: { product: Product; className?: string }) {
  const from = origin(product)
  const chips: { label: string; tone: string }[] = []
  if (isHalal(product)) chips.push({ label: 'Halal', tone: 'bg-pistachio text-cream' })
  if (onSale(product)) chips.push({ label: 'Sale', tone: 'bg-terracotta text-cream' })
  if (from) chips.push({ label: from, tone: 'bg-gold text-espresso' })
  if (!product.availableForSale) chips.push({ label: 'Sold out', tone: 'bg-espresso/70 text-cream' })
  if (chips.length === 0) return null
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {chips.map((chip) => (
        <span
          key={chip.label}
          className={`rounded-full px-2.5 py-1 text-[0.65rem] font-bold tracking-[0.08em] uppercase ${chip.tone}`}
        >
          {chip.label}
        </span>
      ))}
    </div>
  )
}

export function WeightNote({ product, className = '' }: { product: Product; className?: string }) {
  if (!soldByWeight(product)) return null
  const values = product.options.find((o) => o.name === 'Weight')?.values ?? []
  return (
    <span className={`text-xs text-mocha ${className}`}>
      Sold by weight · {values.join(' / ').replace(/Quarter Pound/g, '¼ lb').replace(/Half Pound/g, '½ lb').replace(/\bPound\b/g, '1 lb')}
    </span>
  )
}
