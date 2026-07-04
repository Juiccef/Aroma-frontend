import { Link } from 'react-router-dom'
import { site } from '../content/site'
import { formatMoney } from '../lib/format'
import { Seo } from '../components/Seo'
import { IconArrow, IconCheck, IconFlame, IconGlobe, IconTruck } from '../components/Icons'

export function ShippingPage() {
  return (
    <>
      <Seo
        title="Shipping & Wholesale · AROMA"
        description={`Free US shipping over ${formatMoney(site.freeShippingThreshold)}, Canada and ${site.shipsTo.length - 2}+ more countries, plus wholesale supply for cafés and markets.`}
      />
      <section className="border-b border-line bg-parchment/60">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
          <p className="eyebrow text-gold">Logistics, with love</p>
          <h1 className="font-display display-tight mt-2 text-4xl font-semibold sm:text-5xl">
            Shipping & wholesale
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-12 px-5 py-12 sm:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="keyline rounded-2xl bg-cream p-7">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-gold">
              <IconTruck size={20} />
            </span>
            <h2 className="mt-4 font-display text-xl font-semibold">United States</h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-bark">
              <li className="flex gap-2">
                <IconCheck size={15} className="mt-1 shrink-0 text-pistachio" />
                Free shipping on orders over {formatMoney(site.freeShippingThreshold)}
              </li>
              <li className="flex gap-2">
                <IconCheck size={15} className="mt-1 shrink-0 text-pistachio" />
                Orders pack within 1–2 business days in {site.city}, {site.region}
              </li>
              <li className="flex gap-2">
                <IconCheck size={15} className="mt-1 shrink-0 text-pistachio" />
                Local pickup available at checkout
              </li>
            </ul>
          </div>
          <div className="keyline rounded-2xl bg-cream p-7">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-terracotta">
              <IconGlobe size={20} />
            </span>
            <h2 className="mt-4 font-display text-xl font-semibold">Canada & international</h2>
            <p className="mt-3 text-sm leading-relaxed text-bark">
              Rates are calculated at checkout by destination and weight. Duties and customs fees
              on international orders are the recipient's responsibility.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-bark">
              Apple Pay, Google Pay and Shop Pay are available at checkout.
            </p>
          </div>
          <div className="keyline rounded-2xl bg-cream p-7">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-bark">
              <IconFlame size={20} />
            </span>
            <h2 className="mt-4 font-display text-xl font-semibold">Freshness promise</h2>
            <p className="mt-3 text-sm leading-relaxed text-bark">
              By-weight items are roasted in weekly batches and packed to order. Your bag was on
              the roaster days before it ships, not months. If anything arrives below our standard,
              tell us and we'll make it right.
            </p>
          </div>
        </div>

        <section>
          <h2 className="eyebrow text-gold">We currently ship to</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {site.shipsTo.map((country) => (
              <li
                key={country}
                className="rounded-full border border-line bg-cream px-4 py-1.5 text-sm font-medium text-bark"
              >
                {country}
              </li>
            ))}
          </ul>
        </section>

        <section className="grain relative overflow-hidden rounded-3xl bg-espresso p-8 text-paper sm:p-12">
          <div className="pattern-star absolute inset-0 opacity-[0.06]" aria-hidden />
          <div className="relative max-w-2xl">
            <p className="eyebrow text-goldlight">Wholesale</p>
            <h2 className="font-display display-tight mt-3 text-3xl font-semibold sm:text-4xl">
              Stock your café, restaurant or market
            </h2>
            <p className="mt-4 leading-relaxed text-paper/80">
              We supply roasted nuts, spices, coffee and sweets at volume, with the same weekly
              roasting schedule we hold ourselves to. Corporate gifting programs and branded boxes
              are available seasonally.
            </p>
            <Link
              to="/pages/contact"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-bold text-espresso transition-colors hover:bg-goldlight"
            >
              Request wholesale pricing <IconArrow size={15} />
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
