import { Link } from 'react-router-dom'
import { occasions, site } from '../../content/site'
import { useReveal } from '../../lib/hooks'
import { IconArrow, IconWhatsApp } from '../Icons'
import { StarMotif } from '../Motif'

export function GiftBand() {
  const revealRef = useReveal<HTMLElement>()
  const whatsapp = site.social.whatsapp

  return (
    <section ref={revealRef} className="reveal grain relative overflow-hidden bg-pistachio-deep text-paper">
      <div className="pattern-star absolute inset-0 opacity-[0.08]" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
        <div>
          <p className="eyebrow flex items-center gap-2 text-honey">
            <StarMotif size={14} /> Occasions & gifting
          </p>
          <h2 className="font-display display-tight mt-4 text-4xl font-semibold sm:text-5xl">
            Gifting, the <em className="text-honey">Levantine</em> way
          </h2>
          <p className="mt-5 max-w-xl leading-relaxed text-paper/85">
            A tray that arrives full says more than any card. We build custom trays and boxes with
            roasted nuts, chocolates and sweets for Eid, weddings, graduations and new arrivals,
            finished with serveware worthy of the occasion.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {occasions.map((o) => (
              <li
                key={o.label}
                className="flex items-baseline gap-2 rounded-full border border-cream/25 px-4 py-2 text-sm font-bold"
              >
                {o.label}
                <span lang="ar" dir="rtl" className="text-[0.82rem] font-normal text-honey">
                  {o.labelAr}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/pages/gifting"
              className="inline-flex items-center gap-2 rounded-full bg-honey px-7 py-3.5 text-sm font-bold text-espresso transition-colors hover:bg-goldlight"
            >
              Explore the gifting guide <IconArrow size={16} />
            </Link>
            {whatsapp ? (
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-7 py-3.5 text-sm font-bold transition-colors hover:border-honey hover:text-honey"
              >
                <IconWhatsApp size={17} /> Plan a custom tray
              </a>
            ) : (
              <Link
                to="/pages/contact"
                className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-7 py-3.5 text-sm font-bold transition-colors hover:border-honey hover:text-honey"
              >
                <IconWhatsApp size={17} /> Plan a custom tray
              </Link>
            )}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm text-center">
          <div className="arch-tight relative overflow-hidden border border-cream/20 shadow-lift">
            <img
              src="/media/collection-trays-gifts.jpg"
              alt="A wooden gift tray of roasted nuts, spices and Turkish delight"
              className="h-full w-full object-cover"
            />
          </div>
          <StarMotif size={44} className="absolute -bottom-4 -start-4 text-honey/60" />
          <StarMotif size={28} className="absolute -top-3 end-8 text-honey/40" />

          <p lang="ar" dir="rtl" className="relative mt-6 text-[clamp(2.4rem,6vw,3.2rem)] leading-tight text-honey">
            هدايا العيد
          </p>
          <p className="relative mt-3 text-sm font-bold uppercase tracking-[0.2em] text-paper/85">
            Trays · Boxes · Serveware
          </p>
          <Link
            to="/collections/trays-sets-and-gifts"
            className="link-ink relative mt-4 inline-flex items-center gap-2 text-sm font-bold text-honey"
          >
            Shop trays & sets <IconArrow size={15} />
          </Link>
        </div>
      </div>
    </section>
  )
}
