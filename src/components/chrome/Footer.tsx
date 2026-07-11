import { useState } from 'react'
import { Link } from 'react-router-dom'
import { navigation, site } from '../../content/site'
import { IconArrow, IconCheck, IconFacebook, IconInstagram, IconPhone } from '../Icons'
import { Divider, StarMotif } from '../Motif'
import { Wordmark } from './Wordmark'

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) return
    setDone(true)
  }

  return done ? (
    <p className="flex items-center gap-2 rounded-2xl border border-pistachio/40 bg-pistachio/15 px-5 py-4 text-sm font-bold text-honey">
      <IconCheck size={17} className="shrink-0" /> Ahlan! You're on the list. Fresh roasts and Eid
      drops, straight to your inbox.
    </p>
  ) : (
    <form onSubmit={submit} className="flex overflow-hidden rounded-full border border-cream/25 bg-cream/5 focus-within:border-gold">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        aria-label="Email address"
        className="w-full bg-transparent px-5 py-3.5 text-sm text-paper outline-none placeholder:text-paper/50"
      />
      <button
        type="submit"
        className="flex shrink-0 items-center gap-2 bg-gold px-5 text-sm font-bold text-espresso transition-colors hover:bg-goldlight"
      >
        Join <IconArrow size={15} />
      </button>
    </form>
  )
}

const shopLinks = [
  ...navigation.map((n) => ({ label: n.label, to: n.to })),
  { label: 'Under $10', to: '/collections/under-10' },
]

const learnLinks = [
  { label: 'Our Story', to: '/pages/about' },
  { label: 'Gifting Guide', to: '/pages/gifting' },
  { label: 'Shipping & Wholesale', to: '/pages/shipping' },
  { label: 'FAQ', to: '/pages/faq' },
  { label: 'Contact', to: '/pages/contact' },
]

/** live Shopify policy pages on the current store */
const policyLinks = [
  { label: 'Privacy Policy', href: `${site.liveDomain}/policies/privacy-policy` },
  { label: 'Refund Policy', href: `${site.liveDomain}/policies/refund-policy` },
  { label: 'Terms of Service', href: `${site.liveDomain}/policies/terms-of-service` },
  { label: 'Shipping Policy', href: `${site.liveDomain}/policies/shipping-policy` },
]

export function Footer() {
  const socials = [
    { label: 'Instagram', href: site.social.instagram, Icon: IconInstagram },
    { label: 'Facebook', href: site.social.facebook, Icon: IconFacebook },
  ]

  return (
    <footer className="grain relative overflow-hidden bg-espresso text-paper">
      <div className="pattern-star absolute inset-0 opacity-[0.05]" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Wordmark size="footer" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/75">
              Nuts and coffee roasted in-house every week in {site.city}, {site.region}, plus the
              sweets, spices and drinks of home, shipped across the US, Canada and beyond.
            </p>
            <p className="eyebrow mt-8 mb-3 text-goldlight">Fresh drops, no spam</p>
            <NewsletterForm />
            <div className="mt-6 flex items-center gap-2.5">
              {socials.map(({ label, href, Icon }) =>
                href ? (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-paper/85 transition-colors hover:border-gold hover:text-goldlight"
                  >
                    <Icon size={17} />
                  </a>
                ) : (
                  <Link
                    key={label}
                    to="/pages/contact"
                    aria-label={`${label} (via contact page)`}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-paper/85 transition-colors hover:border-gold hover:text-goldlight"
                  >
                    <Icon size={17} />
                  </Link>
                ),
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <nav aria-label="Shop">
              <p className="eyebrow mb-4 text-goldlight">Shop</p>
              <ul className="space-y-2.5">
                {shopLinks.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="link-ink text-sm text-paper/80 hover:text-paper">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Learn">
              <p className="eyebrow mb-4 text-goldlight">Learn</p>
              <ul className="space-y-2.5">
                {learnLinks.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="link-ink text-sm text-paper/80 hover:text-paper">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <p className="eyebrow mb-4 text-goldlight">Visit</p>
              <p className="text-sm leading-relaxed text-paper/80">
                {site.streetAddress}
                <br />
                {site.city}, {site.region} {site.postalCode}
              </p>
              <Link
                to="/pages/contact"
                className="link-ink mt-3 inline-flex items-center gap-2 text-sm font-bold text-goldlight"
              >
                Directions & hours <IconArrow size={14} />
              </Link>
              <a
                href={site.phoneHref}
                className="link-ink mt-2 flex items-center gap-2 text-sm font-bold text-paper/85 hover:text-paper"
              >
                <IconPhone size={13} /> {site.phone}
              </a>
              <p className="eyebrow mt-6 mb-2 text-goldlight">We ship to</p>
              <p className="text-sm text-paper/70">
                US · Canada · {site.shipsTo.length - 2}+ more countries
              </p>
            </div>
          </div>
        </div>

        <Divider className="my-10 text-cream/40" />

        <div className="flex flex-col items-center justify-between gap-5 text-center lg:flex-row lg:text-start">
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {policyLinks.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-paper/60 transition-colors hover:text-paper"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="flex flex-wrap items-center justify-center gap-2 text-[0.68rem] uppercase tracking-[0.14em] text-paper/60">
            Visa · Mastercard · Amex · Discover · Apple Pay · Google Pay · Shop Pay
          </p>
        </div>

        <p className="mt-8 flex flex-wrap items-center justify-center gap-2 text-center text-xs text-paper/55">
          <StarMotif size={12} className="text-gold" />
          © {new Date().getFullYear()} {site.name} · Roasted with care in {site.city},{' '}
          {site.region}
          <span lang="ar" dir="rtl">
            محمّص بحب
          </span>
          <StarMotif size={12} className="text-gold" />
        </p>
      </div>
    </footer>
  )
}
