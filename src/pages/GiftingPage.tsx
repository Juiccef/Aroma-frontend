import { Link } from 'react-router-dom'
import { occasions, site } from '../content/site'
import { shop } from '../lib/shop'
import type { ProductConnection } from '../lib/shop'
import { useShopData } from '../lib/hooks'
import { Seo } from '../components/Seo'
import { ProductRail } from '../components/product/ProductRail'
import { StarMotif } from '../components/Motif'
import { IconArrow, IconWhatsApp } from '../components/Icons'

const steps = [
  {
    n: '١',
    title: 'Tell us the occasion',
    copy: 'Eid morning, a wedding sofra, a graduation, a new baby, and your budget.',
  },
  {
    n: '٢',
    title: 'We build the tray',
    copy: 'Fresh-roasted nuts, chocolates, mamool and delights, arranged on serveware worth keeping.',
  },
  {
    n: '٣',
    title: 'Pickup or delivery',
    copy: `Collect it in ${site.city} or have it shipped, packed so it arrives the way it left.`,
  },
]

export function GiftingPage() {
  const { data: serveware } = useShopData<ProductConnection>(
    () => shop.getCollectionProducts('trays-sets-and-gifts', { first: 8 }),
    [],
  )
  const whatsapp = site.social.whatsapp

  return (
    <>
      <Seo
        title="Gifting Guide · AROMA"
        description="Custom gift trays and boxes for Eid, weddings, graduations and corporate gifting, built with fresh-roasted nuts, sweets and serveware from AROMA."
      />

      <section className="grain relative overflow-hidden bg-pistachio-deep py-20 text-paper lg:py-24">
        <div className="pattern-star absolute inset-0 opacity-[0.08]" aria-hidden />
        <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
          <p className="eyebrow flex items-center justify-center gap-2 text-honey">
            <StarMotif size={14} /> The gifting guide
          </p>
          <h1 className="font-display display-tight mt-5 text-4xl font-semibold sm:text-6xl">
            Arrive with a <em className="text-honey">full tray</em>
          </h1>
          <p lang="ar" dir="rtl" className="mt-4 text-2xl text-paper/70">
            الهدية الأحلى من عنا
          </p>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-paper/85">
            In our culture a gift isn't a card. It's abundance you can pass around the room. We
            build trays and boxes to order for every occasion that deserves one.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <ul className="grid gap-4 sm:grid-cols-3">
          {steps.map((step) => (
            <li key={step.title} className="keyline rounded-2xl bg-cream p-7">
              <span
                lang="ar"
                className="font-arabic flex h-12 w-12 items-center justify-center rounded-full bg-gold text-2xl leading-none text-espresso"
                aria-hidden
              >
                {step.n}
              </span>
              <h2 className="mt-4 font-display text-xl font-semibold">{step.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-bark">{step.copy}</p>
            </li>
          ))}
        </ul>

        <div className="mt-12">
          <h2 className="eyebrow text-gold">Made for the moment</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {occasions.map((o) => (
              <span
                key={o.label}
                className="flex items-baseline gap-2 rounded-full border border-line bg-cream px-5 py-2.5 text-sm font-bold"
              >
                {o.label}
                <span lang="ar" dir="rtl" className="text-[0.82rem] font-normal text-mocha">
                  {o.labelAr}
                </span>
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          {whatsapp ? (
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-espresso px-7 py-3.5 text-sm font-bold text-cream transition-colors hover:bg-cocoa"
            >
              <IconWhatsApp size={17} /> Plan a tray on WhatsApp
            </a>
          ) : (
            <Link
              to="/pages/contact"
              className="inline-flex items-center gap-2 rounded-full bg-espresso px-7 py-3.5 text-sm font-bold text-cream transition-colors hover:bg-cocoa"
            >
              <IconWhatsApp size={17} /> Plan a custom tray
            </Link>
          )}
          <Link
            to="/pages/shipping"
            className="inline-flex items-center gap-2 rounded-full border-2 border-espresso px-7 py-3.5 text-sm font-bold transition-colors hover:bg-espresso hover:text-cream"
          >
            Corporate & wholesale <IconArrow size={15} />
          </Link>
        </div>
      </section>

      {serveware && serveware.nodes.length > 0 && (
        <div className="border-t border-line bg-parchment/50 py-14">
          <ProductRail
            eyebrow="Worth keeping after the sweets are gone"
            title="Serveware & sets"
            titleAr="طقم الضيافة"
            to="/collections/trays-sets-and-gifts"
            products={serveware.nodes}
          />
        </div>
      )}
    </>
  )
}
