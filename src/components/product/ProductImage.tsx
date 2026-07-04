import type { Product } from '../../lib/shop'
import { arabicTitle } from '../../lib/shop'
import { shopifyImage } from '../../lib/format'

/**
 * Product image with a designed bilingual fallback tile.
 * 260 of the store's 313 products have no photography yet (flagged in the
 * README); the fallback keeps grids intentional instead of broken.
 */

const FALLBACK_TONES = [
  { bg: 'bg-cocoa', ink: 'text-honey' },
  { bg: 'bg-pistachio-deep', ink: 'text-paper' },
  { bg: 'bg-[#84421f]', ink: 'text-paper' },
  { bg: 'bg-bark', ink: 'text-honey' },
]

function toneFor(handle: string) {
  let hash = 0
  for (let i = 0; i < handle.length; i++) hash = (hash * 31 + handle.charCodeAt(i)) | 0
  return FALLBACK_TONES[Math.abs(hash) % FALLBACK_TONES.length]
}

export function ProductImage({
  product,
  width = 640,
  sizes = '(min-width: 1024px) 25vw, 50vw',
  className = '',
  eager = false,
}: {
  product: Product
  width?: number
  sizes?: string
  className?: string
  eager?: boolean
}) {
  const image = product.featuredImage
  if (image) {
    return (
      <img
        src={shopifyImage(image.url, width)}
        srcSet={[width / 2, width, width * 2]
          .map((w) => `${shopifyImage(image.url, Math.round(w))} ${Math.round(w)}w`)
          .join(', ')}
        sizes={sizes}
        alt={image.altText ?? product.title}
        width={image.width ?? 1200}
        height={image.height ?? 1200}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={`h-full w-full object-cover ${className}`}
      />
    )
  }

  const ar = arabicTitle(product)
  const tone = toneFor(product.handle)
  return (
    <div
      role="img"
      aria-label={product.title}
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${tone.bg} ${tone.ink} ${className}`}
    >
      <div className="pattern-star absolute inset-0 opacity-[0.14]" aria-hidden />
      <div className="relative px-4 text-center">
        {ar ? (
          <span lang="ar" dir="rtl" className="block text-[clamp(1.4rem,9cqw,2.6rem)] leading-snug">
            {ar}
          </span>
        ) : (
          <span className="font-display text-[clamp(2.2rem,16cqw,4.5rem)] font-semibold italic">
            {product.title.charAt(0)}
          </span>
        )}
        <span className="mx-auto mt-2 block h-px w-10 bg-current opacity-50" aria-hidden />
        <span className="mt-2 block font-body text-[0.6rem] font-bold uppercase tracking-[0.24em] opacity-80">
          Aroma
        </span>
      </div>
    </div>
  )
}
