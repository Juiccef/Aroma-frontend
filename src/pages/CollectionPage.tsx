import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { shop } from '../lib/shop'
import type { Collection, Product, ProductSortKey } from '../lib/shop'
import { useShopData } from '../lib/hooks'
import { collectionArabic, collectionCopy, navigation, virtualCollections } from '../content/site'
import { Seo } from '../components/Seo'
import { ProductCard } from '../components/product/ProductCard'
import { IconChevron } from '../components/Icons'
import { StarMotif } from '../components/Motif'
import { NotFoundPage } from './NotFoundPage'

const PAGE_SIZE = 24

const priceBuckets = [
  { label: 'Any price', value: '' },
  { label: 'Under $5', value: '0-5' },
  { label: '$5 – $10', value: '5-10' },
  { label: '$10 – $25', value: '10-25' },
  { label: '$25 and up', value: '25-' },
]

const sortOptions: { label: string; value: ProductSortKey }[] = [
  { label: 'Featured', value: 'FEATURED' },
  { label: 'Newest', value: 'CREATED' },
  { label: 'Price, low to high', value: 'PRICE_ASC' },
  { label: 'Price, high to low', value: 'PRICE_DESC' },
  { label: 'Name, A to Z', value: 'TITLE' },
]

/** subcategory chips come straight from the mega-menu config for this collection */
function tagChipsFor(handle: string): { label: string; tag: string }[] {
  const item = navigation.find((n) => n.to === `/collections/${handle}`)
  if (!item?.columns) return []
  const chips: { label: string; tag: string }[] = []
  for (const col of item.columns) {
    for (const link of col.links) {
      const match = link.to.match(new RegExp(`^/collections/${handle}\\?tag=([\\w-]+)$`))
      if (match) chips.push({ label: link.label, tag: match[1] })
    }
  }
  return chips
}

export function CollectionPage() {
  const { handle = '' } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const tag = searchParams.get('tag') ?? ''
  const [sortKey, setSortKey] = useState<ProductSortKey>('FEATURED')
  const [priceBucket, setPriceBucket] = useState('')
  const [items, setItems] = useState<Product[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasNext, setHasNext] = useState(false)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const { data: collection, loading: collectionLoading } = useShopData<Collection | null>(
    () => shop.getCollection(handle),
    [handle],
  )

  const [minP, maxP] = useMemo(() => {
    if (!priceBucket) return [undefined, undefined] as const
    const [lo, hi] = priceBucket.split('-')
    return [lo ? Number(lo) : undefined, hi ? Number(hi) : undefined] as const
  }, [priceBucket])

  useEffect(() => {
    let alive = true
    setLoading(true)
    shop
      .getCollectionProducts(handle, {
        tag: tag || undefined,
        sortKey,
        first: PAGE_SIZE,
        minPrice: minP,
        maxPrice: maxP,
      })
      .then((page) => {
        if (!alive) return
        setItems(page.nodes)
        setCursor(page.pageInfo.endCursor)
        setHasNext(page.pageInfo.hasNextPage)
        setTotal(page.totalCount)
        setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [handle, tag, sortKey, minP, maxP])

  const loadMore = async () => {
    const page = await shop.getCollectionProducts(handle, {
      tag: tag || undefined,
      sortKey,
      first: PAGE_SIZE,
      after: cursor,
      minPrice: minP,
      maxPrice: maxP,
    })
    setItems((prev) => [...prev, ...page.nodes])
    setCursor(page.pageInfo.endCursor)
    setHasNext(page.pageInfo.hasNextPage)
  }

  if (!collectionLoading && !collection) return <NotFoundPage />
  if (!collection) return <div className="min-h-screen" aria-hidden />

  const virtual = virtualCollections.find((v) => v.handle === handle)
  const titleAr = virtual?.titleAr ?? collectionArabic[handle]
  const description = collection.description || collectionCopy[handle] || ''
  const chips = tagChipsFor(handle)
  const activeChip = chips.find((c) => c.tag === tag)

  const setTag = (next: string) => {
    const params = new URLSearchParams(searchParams)
    if (next) params.set('tag', next)
    else params.delete('tag')
    setSearchParams(params, { replace: false })
  }

  return (
    <>
      <Seo
        title={`${activeChip ? `${activeChip.label} · ` : ''}${collection.title} · AROMA`}
        description={description || `Shop ${collection.title} at AROMA.`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
            { '@type': 'ListItem', position: 2, name: collection.title, item: `/collections/${handle}` },
          ],
        }}
      />

      {/* collection header */}
      <section className="border-b border-line bg-parchment/60">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-mocha">
            <Link to="/" className="transition-colors hover:text-espresso">
              Home
            </Link>
            <span className="mx-2" aria-hidden>·</span>
            <span aria-current="page" className="text-bark">
              {collection.title}
            </span>
          </nav>
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
            <h1 className="font-display display-tight text-4xl font-semibold sm:text-5xl">
              {activeChip ? activeChip.label : collection.title}
            </h1>
            {titleAr && (
              <span lang="ar" dir="rtl" className="text-2xl text-mocha">
                {titleAr}
              </span>
            )}
          </div>
          {description && <p className="mt-3 max-w-2xl leading-relaxed text-bark">{description}</p>}

          {chips.length > 0 && (
            <div className="no-scrollbar -mx-5 mt-6 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
              <button
                type="button"
                onClick={() => setTag('')}
                aria-pressed={!tag}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
                  !tag ? 'border-espresso bg-espresso text-cream' : 'border-line bg-cream hover:border-bark'
                }`}
              >
                All
              </button>
              {chips.map((chip) => (
                <button
                  key={chip.tag}
                  type="button"
                  onClick={() => setTag(chip.tag)}
                  aria-pressed={tag === chip.tag}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
                    tag === chip.tag
                      ? 'border-espresso bg-espresso text-cream'
                      : 'border-line bg-cream hover:border-bark'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* filter / sort bar */}
      <div className="sticky top-16 z-30 border-b border-line bg-paper/95 backdrop-blur-sm lg:top-[74px]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-5 gap-y-2 px-5 py-3 sm:px-8">
          <p className="me-auto text-sm text-mocha">
            {loading ? 'Loading…' : `${total} item${total === 1 ? '' : 's'}`}
          </p>
          <label className="flex items-center gap-2 text-sm font-bold">
            <span className="text-mocha">Price</span>
            <span className="relative">
              <select
                value={priceBucket}
                onChange={(e) => setPriceBucket(e.target.value)}
                className="appearance-none rounded-full border border-line bg-cream py-2 pe-9 ps-4 text-sm font-bold outline-none transition-colors hover:border-bark"
              >
                {priceBuckets.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
              <IconChevron size={14} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-bark" />
            </span>
          </label>
          <label className="flex items-center gap-2 text-sm font-bold">
            <span className="text-mocha">Sort</span>
            <span className="relative">
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as ProductSortKey)}
                className="appearance-none rounded-full border border-line bg-cream py-2 pe-9 ps-4 text-sm font-bold outline-none transition-colors hover:border-bark"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <IconChevron size={14} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-bark" />
            </span>
          </label>
        </div>
      </div>

      {/* grid */}
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        {items.length === 0 && !loading ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <StarMotif size={36} className="text-gold" />
            <p className="font-display text-2xl font-semibold">Nothing in this corner yet</p>
            <p className="max-w-sm text-sm text-mocha">
              No items match those filters. Loosen the price range or browse the whole collection.
            </p>
            <button
              type="button"
              onClick={() => {
                setPriceBucket('')
                setTag('')
              }}
              className="mt-2 rounded-full bg-espresso px-6 py-3 text-sm font-bold text-cream transition-colors hover:bg-cocoa"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
              {items.map((p, i) => (
                <li key={p.id}>
                  <ProductCard product={p} eager={i < 4} />
                </li>
              ))}
            </ul>
            {hasNext && (
              <div className="mt-10 flex flex-col items-center gap-3">
                <p className="text-xs uppercase tracking-[0.16em] text-mocha">
                  Showing {items.length} of {total}
                </p>
                <button
                  type="button"
                  onClick={() => void loadMore()}
                  className="rounded-full border-2 border-espresso px-8 py-3.5 text-sm font-bold transition-colors hover:bg-espresso hover:text-cream"
                >
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
