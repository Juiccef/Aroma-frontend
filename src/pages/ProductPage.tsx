import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { shop } from '../lib/shop'
import type { Product } from '../lib/shop'
import { arabicTitle, origin, soldByWeight } from '../lib/shop'
import { useShopData } from '../lib/hooks'
import { site } from '../content/site'
import { formatMoney, shopifyImage } from '../lib/format'
import { Seo } from '../components/Seo'
import { ProductImage } from '../components/product/ProductImage'
import { Price, ProductBadges, WeightNote } from '../components/product/ProductBits'
import { PurchasePanel, usePurchase } from '../components/product/PurchasePanel'
import { ProductRail } from '../components/product/ProductRail'
import { IconCheck, IconChevron, IconFlame, IconTruck, IconWhatsApp } from '../components/Icons'
import { HalalMark } from '../components/Icons'
import { NotFoundPage } from './NotFoundPage'

function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  return (
    <details open={defaultOpen} className="group border-b border-line">
      <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-bold [&::-webkit-details-marker]:hidden">
        {title}
        <IconChevron size={16} className="text-bark transition-transform group-open:rotate-180" />
      </summary>
      <div className="pb-5 text-[0.92rem] leading-relaxed text-bark">{children}</div>
    </details>
  )
}

/** honest fallback copy per collection while product descriptions are unwritten */
function categoryNote(product: Product): string {
  if (product.collections.includes('nuts-seeds'))
    return 'Roasted and seasoned in-house in small weekly batches, then weighed and packed to order.'
  if (product.collections.includes('spices-herbs'))
    return 'Measured and packed to order from whole-lot stock, the way a spice souq would.'
  if (product.collections.includes('coffee'))
    return 'Kept sealed until it ships so the aroma opens in your kitchen, not our shelf.'
  if (product.collections.includes('turkish'))
    return 'Cut and boxed fresh from the block when your order comes in.'
  return 'Stocked fresh in our Duluth shop and packed with care for shipping.'
}

function ProductView({ product }: { product: Product }) {
  const purchase = usePurchase(product)
  const [activeImage, setActiveImage] = useState(0)
  const { data: related } = useShopData<Product[]>(
    () => shop.getProductRecommendations(product.id, 8),
    [product.id],
  )

  useEffect(() => setActiveImage(0), [product.id])

  const ar = arabicTitle(product)
  const from = origin(product)
  const primaryCollection = product.collections[0]
  const whatsapp = site.social.whatsapp
  const images = product.images.length > 0 ? product.images : null

  return (
    <>
      <Seo
        title={`${product.title} · AROMA`}
        description={
          product.description ||
          `${product.title}${ar ? ` (${ar})` : ''}, from AROMA in ${site.city}, ${site.region}.`
        }
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.title,
            ...(product.featuredImage ? { image: product.featuredImage.url } : {}),
            description: product.description || categoryNote(product),
            brand: { '@type': 'Brand', name: site.name },
            offers: {
              '@type': 'AggregateOffer',
              priceCurrency: product.priceRange.minVariantPrice.currencyCode,
              lowPrice: product.priceRange.minVariantPrice.amount,
              highPrice: product.priceRange.maxVariantPrice.amount,
              offerCount: product.variants.length,
              availability: product.availableForSale
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            },
          },
        ]}
      />

      <div className="mx-auto max-w-7xl px-5 pb-16 pt-6 sm:px-8">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs font-bold uppercase tracking-[0.16em] text-mocha">
          <Link to="/" className="transition-colors hover:text-espresso">
            Home
          </Link>
          {primaryCollection && (
            <>
              <span className="mx-2" aria-hidden>·</span>
              <Link to={`/collections/${primaryCollection}`} className="transition-colors hover:text-espresso">
                {primaryCollection.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase())}
              </Link>
            </>
          )}
          <span className="mx-2" aria-hidden>·</span>
          <span aria-current="page" className="text-bark">
            {product.title}
          </span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* gallery */}
          <div>
            <div className="@container relative aspect-square overflow-hidden rounded-3xl border border-line bg-white shadow-card">
              {images ? (
                <img
                  src={shopifyImage(images[activeImage].url, 1200)}
                  alt={images[activeImage].altText ?? product.title}
                  width={images[activeImage].width ?? 1200}
                  height={images[activeImage].height ?? 1200}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ProductImage product={product} width={1200} sizes="(min-width:1024px) 50vw, 100vw" eager />
              )}
              <ProductBadges product={product} className="absolute start-4 top-4" />
            </div>
            {images && images.length > 1 && (
              <div className="mt-3 flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={img.url}
                    type="button"
                    aria-label={`View image ${i + 1}`}
                    aria-pressed={i === activeImage}
                    onClick={() => setActiveImage(i)}
                    className={`h-20 w-20 overflow-hidden rounded-xl border-2 transition-colors ${
                      i === activeImage ? 'border-gold' : 'border-line hover:border-bark'
                    }`}
                  >
                    <img
                      src={shopifyImage(img.url, 160)}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* info */}
          <div>
            {from && <p className="eyebrow text-pistachio">{from} origin</p>}
            <h1 className="font-display display-tight mt-2 text-3xl font-semibold sm:text-4xl">
              {product.title}
            </h1>
            {ar && (
              <p lang="ar" dir="rtl" className="mt-2 text-start text-2xl text-mocha">
                {ar}
              </p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1">
              <Price product={product} className="font-display text-2xl font-semibold" />
              <WeightNote product={product} />
            </div>

            <div className="mt-7">
              <PurchasePanel product={product} purchase={purchase} large />
            </div>

            {/* trust row */}
            <ul className="mt-7 grid grid-cols-3 gap-3 border-y border-line py-4 text-center text-[0.7rem] font-bold uppercase tracking-[0.1em] text-bark">
              <li className="flex flex-col items-center gap-1.5">
                <HalalMark className="scale-90 text-pistachio" /> Halal-conscious
              </li>
              <li className="flex flex-col items-center gap-1.5">
                <IconFlame size={20} className="text-terracotta" />
                {soldByWeight(product) ? 'Roasted weekly' : 'Stocked fresh'}
              </li>
              <li className="flex flex-col items-center gap-1.5">
                <IconTruck size={20} className="text-gold" /> Ships US & CA
              </li>
            </ul>

            <div className="mt-2">
              <Accordion title="Description" defaultOpen>
                <p>{product.description || categoryNote(product)}</p>
                {soldByWeight(product) && (
                  <p className="mt-3">
                    Sold by weight. Pick your size above. Prices start at{' '}
                    {formatMoney(product.priceRange.minVariantPrice)}.
                  </p>
                )}
              </Accordion>
              <Accordion title="Ingredients & allergens">
                <p>
                  Full ingredient and allergen details for this item are a message away. Our
                  team checks the exact batch on the shelf before you order.
                </p>
                <Link to="/pages/contact" className="link-ink mt-2 inline-block font-bold text-gold">
                  Ask about this product
                </Link>
              </Accordion>
              <Accordion title="Freshness & shipping">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <IconCheck size={15} className="mt-1 shrink-0 text-pistachio" />
                    Orders pack within 1–2 business days from {site.city}, {site.region}.
                  </li>
                  <li className="flex items-start gap-2">
                    <IconCheck size={15} className="mt-1 shrink-0 text-pistachio" />
                    Free US shipping over {formatMoney(site.freeShippingThreshold)}.
                  </li>
                  <li className="flex items-start gap-2">
                    <IconCheck size={15} className="mt-1 shrink-0 text-pistachio" />
                    We ship to Canada and {site.shipsTo.length - 2}+ more countries.
                  </li>
                </ul>
              </Accordion>
              <Accordion title="Ask a question">
                <p>Fastest answers come through WhatsApp or the contact page, usually same day.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {whatsapp ? (
                    <a
                      href={whatsapp}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-pistachio px-5 py-2.5 text-sm font-bold text-cream transition-colors hover:bg-pistachio-deep"
                    >
                      <IconWhatsApp size={16} /> WhatsApp us
                    </a>
                  ) : (
                    <Link
                      to="/pages/contact"
                      className="inline-flex items-center gap-2 rounded-full bg-pistachio px-5 py-2.5 text-sm font-bold text-cream transition-colors hover:bg-pistachio-deep"
                    >
                      <IconWhatsApp size={16} /> Message us
                    </Link>
                  )}
                  <Link
                    to="/pages/faq"
                    className="inline-flex items-center rounded-full border border-line px-5 py-2.5 text-sm font-bold transition-colors hover:border-bark"
                  >
                    Read the FAQ
                  </Link>
                </div>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {related && related.length > 0 && (
        <div className="border-t border-line bg-parchment/50 py-14">
          <ProductRail
            eyebrow="Goes well with"
            title="You might also like"
            titleAr="قد يعجبك أيضاً"
            products={related}
          />
        </div>
      )}

      {/* sticky mobile buy bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream/95 px-4 py-3 shadow-[0_-8px_30px_-12px_rgba(38,22,11,0.25)] backdrop-blur-sm lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">{product.title}</p>
            <p className="text-sm text-bark">
              {formatMoney(purchase.total)}
              {purchase.variant.title !== 'Default Title' && (
                <span className="text-mocha"> · {purchase.variant.title.replace('Quarter Pound', '¼ lb').replace('Half Pound', '½ lb').replace(/\bPound\b/, '1 lb')}</span>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void purchase.add()}
            disabled={purchase.disabled}
            className="shrink-0 rounded-full bg-espresso px-6 py-3 text-sm font-bold text-cream transition-colors hover:bg-cocoa disabled:opacity-50"
          >
            {purchase.justAdded ? 'Added ✓' : purchase.variant.availableForSale ? 'Add to cart' : 'Sold out'}
          </button>
        </div>
      </div>
      {/* spacer so the sticky bar never covers page content on mobile */}
      <div className="h-20 lg:hidden" aria-hidden />
    </>
  )
}

export function ProductPage() {
  const { handle = '' } = useParams()
  const { data: product, loading } = useShopData<Product | null>(
    () => shop.getProduct(handle),
    [handle],
  )

  if (!loading && !product) return <NotFoundPage />
  if (!product) return <div className="min-h-screen" aria-hidden />
  return <ProductView key={product.id} product={product} />
}
