import { Link } from 'react-router-dom'
import { shop } from '../../lib/shop'
import type { Collection } from '../../lib/shop'
import { useShopData, useReveal } from '../../lib/hooks'
import { collectionArabic, collectionCopy } from '../../content/site'
import { shopifyImage } from '../../lib/format'
import { IconArrow } from '../Icons'
import { SectionHeading } from '../Motif'

/** display order interleaves photographed and typographic tiles */
const tileOrder = [
  'nuts-seeds', // big tile, has image
  'coffee',
  'gummy',
  'spices-herbs',
  'turkish',
  'snacks',
  'cjhoci',
  'exotic-drinks',
  'trays-sets-and-gifts',
]

const ornamentTones: Record<string, string> = {
  coffee: 'bg-bark text-honey',
  'spices-herbs': 'bg-[#84421f] text-paper',
  snacks: 'bg-cocoa text-honey',
  'exotic-drinks': 'bg-pistachio-deep text-paper',
  'trays-sets-and-gifts': 'bg-[#6d5416] text-paper',
}

function CategoryTile({ collection, big = false }: { collection: Collection; big?: boolean }) {
  const ar = collectionArabic[collection.handle]
  const copy = collectionCopy[collection.handle]

  return (
    <Link
      to={`/collections/${collection.handle}`}
      className={`group relative block overflow-hidden rounded-2xl border border-line shadow-card transition-shadow hover:shadow-lift ${
        big ? 'col-span-2 row-span-2' : ''
      }`}
    >
      {collection.image ? (
        <>
          <img
            src={shopifyImage(collection.image.url, big ? 1200 : 640)}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/25 to-transparent"
          />
        </>
      ) : (
        <div className={`absolute inset-0 ${ornamentTones[collection.handle] ?? 'bg-cocoa text-honey'}`}>
          <div className="pattern-star absolute inset-0 opacity-[0.13]" aria-hidden />
          <span
            lang="ar"
            dir="rtl"
            aria-hidden
            className="absolute inset-x-4 top-1/2 -translate-y-[62%] text-center leading-snug opacity-90"
            style={{ fontSize: big ? 'clamp(3rem,6vw,4.5rem)' : 'clamp(1.5rem,3.4vw,2.2rem)' }}
          >
            {ar}
          </span>
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-espresso/60 via-transparent to-transparent"
          />
        </div>
      )}

      <div className={`relative flex flex-col justify-end p-4 text-paper sm:p-5 ${big ? 'aspect-square sm:aspect-auto sm:h-full sm:min-h-[420px]' : 'aspect-square'}`}>
        <p className={`font-display font-semibold leading-tight ${big ? 'text-3xl' : 'text-lg sm:text-xl'}`}>
          {collection.title}
        </p>
        {collection.image && ar && (
          <p lang="ar" dir="rtl" className="mt-0.5 text-start text-sm text-paper/80">
            {ar}
          </p>
        )}
        {big && copy && <p className="mt-2 max-w-sm text-sm text-paper/80">{copy}</p>}
        <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-goldlight opacity-0 transition-all duration-300 group-hover:opacity-100 max-sm:opacity-100">
          Shop now <IconArrow size={13} />
        </span>
      </div>
    </Link>
  )
}

export function CategoryGrid() {
  const revealRef = useReveal<HTMLElement>()
  const { data: collections } = useShopData<Collection[]>(() => shop.getCollections(), [])
  if (!collections) return <div className="min-h-[40rem]" aria-hidden />

  const byHandle = new Map(collections.map((c) => [c.handle, c]))

  return (
    <section ref={revealRef} className="reveal mx-auto max-w-7xl px-5 sm:px-8">
      <SectionHeading
        eyebrow="Every aisle of home"
        title="Shop by category"
        titleAr="تسوق حسب الفئة"
      />
      <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {tileOrder.map((handle) => {
          const collection = byHandle.get(handle)
          if (!collection) return null
          return <CategoryTile key={handle} collection={collection} big={handle === 'nuts-seeds'} />
        })}
      </div>
    </section>
  )
}
