import { useState } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../content/site'
import { Seo } from '../components/Seo'
import { IconArrow, IconCheck, IconWhatsApp } from '../components/Icons'
import { StarMotif } from '../components/Motif'

/**
 * The form is a working prototype (in-memory success state). On live
 * Shopify it posts to the native /contact form endpoint or a Hydrogen
 * action (see README).
 */
export function ContactPage() {
  const [sent, setSent] = useState(false)
  const whatsapp = site.social.whatsapp

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <>
      <Seo
        title="Contact · AROMA"
        description={`Questions, custom trays, wholesale: reach AROMA in ${site.city}, ${site.region}.`}
      />
      <section className="border-b border-line bg-parchment/60">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
          <p className="eyebrow text-gold">Contact</p>
          <h1 className="font-display display-tight mt-2 text-4xl font-semibold sm:text-5xl">
            Talk to a human who knows the shelf
          </h1>
          <p className="mt-3 max-w-xl leading-relaxed text-bark">
            Ingredient questions, halal checks, custom trays, wholesale: send it over. We usually
            answer the same day.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.2fr_0.8fr]">
        {sent ? (
          <div className="keyline flex flex-col items-start gap-4 self-start rounded-2xl bg-cream p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-pistachio text-cream">
              <IconCheck size={22} />
            </span>
            <h2 className="font-display text-2xl font-semibold">Shukran, message received</h2>
            <p className="text-sm leading-relaxed text-bark">
              We'll get back to you within a business day. If it's urgent, the phone and WhatsApp
              details on your order confirmation reach us fastest.
            </p>
            <Link
              to="/collections/best-sellers"
              className="link-ink mt-2 inline-flex items-center gap-2 text-sm font-bold text-gold"
            >
              Browse while you wait <IconArrow size={15} />
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="keyline self-start rounded-2xl bg-cream p-6 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="eyebrow mb-2 block text-bark">Name</span>
                <input
                  required
                  name="name"
                  autoComplete="name"
                  className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none transition-colors focus:border-gold"
                />
              </label>
              <label className="block">
                <span className="eyebrow mb-2 block text-bark">Email</span>
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none transition-colors focus:border-gold"
                />
              </label>
            </div>
            <label className="mt-5 block">
              <span className="eyebrow mb-2 block text-bark">Topic</span>
              <select
                name="topic"
                className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none transition-colors focus:border-gold"
              >
                <option>Order question</option>
                <option>Product / halal / allergen check</option>
                <option>Custom tray or gift</option>
                <option>Wholesale</option>
                <option>Something else</option>
              </select>
            </label>
            <label className="mt-5 block">
              <span className="eyebrow mb-2 block text-bark">Message</span>
              <textarea
                required
                name="message"
                rows={5}
                className="w-full resize-y rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none transition-colors focus:border-gold"
              />
            </label>
            <button
              type="submit"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-espresso px-7 py-3.5 text-sm font-bold text-cream transition-colors hover:bg-cocoa"
            >
              Send message <IconArrow size={15} />
            </button>
          </form>
        )}

        <aside className="space-y-4 self-start">
          {whatsapp && (
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="hover-lift flex items-center gap-4 rounded-2xl bg-pistachio p-6 text-cream"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-cream/40">
                <IconWhatsApp size={22} />
              </span>
              <span>
                <span className="block font-display text-lg font-semibold">WhatsApp us</span>
                <span className="mt-0.5 block text-sm text-cream/85">
                  Fastest for order help and tray planning
                </span>
              </span>
            </a>
          )}
          <div className="keyline rounded-2xl bg-cream p-6">
            <p className="eyebrow flex items-center gap-2 text-gold">
              <StarMotif size={13} /> Visit the shop
            </p>
            <p className="mt-3 font-display text-xl font-semibold">
              {site.city}, {site.region}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-bark">
              Local pickup is available at checkout. We'll email you the moment your order is
              packed and ready.
            </p>
          </div>
          <div className="keyline rounded-2xl bg-cream p-6">
            <p className="eyebrow text-gold">Wholesale & corporate</p>
            <p className="mt-3 text-sm leading-relaxed text-bark">
              Cafés, restaurants and offices: we supply roasted nuts, spices and coffee at volume,
              and build branded gift boxes for teams and clients.
            </p>
            <Link
              to="/pages/shipping"
              className="link-ink mt-3 inline-flex items-center gap-2 text-sm font-bold text-gold"
            >
              Shipping & wholesale details <IconArrow size={14} />
            </Link>
          </div>
        </aside>
      </div>
    </>
  )
}
