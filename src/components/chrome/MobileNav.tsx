import { Link } from 'react-router-dom'
import { navigation, site } from '../../content/site'
import { useStore } from '../../lib/store-context'
import { useBodyLock, useEscape } from '../../lib/hooks'
import { IconChevron, IconClose, IconInstagram, IconTikTok, IconWhatsApp } from '../Icons'
import { StarMotif } from '../Motif'

export function MobileNav() {
  const { navOpen, setNavOpen } = useStore()
  useBodyLock(navOpen)
  useEscape(navOpen, () => setNavOpen(false))

  if (!navOpen) return null
  const close = () => setNavOpen(false)

  return (
    <div className="fixed inset-0 z-[80] xl:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <button
        type="button"
        aria-label="Close menu"
        onClick={close}
        className="animate-fade-in absolute inset-0 bg-espresso/55 backdrop-blur-[2px]"
      />
      <div className="animate-fade-in relative flex h-full w-[min(22rem,88vw)] flex-col overflow-y-auto bg-espresso text-paper shadow-drawer">
        <div className="flex items-center justify-between border-b border-cream/10 px-5 py-4">
          <Link to="/" onClick={close} className="flex items-baseline gap-2">
            <span className="font-display text-xl font-semibold tracking-[0.16em]">AROMA</span>
            <span lang="ar" dir="rtl" className="text-base text-goldlight">
              {site.nameAr}
            </span>
          </Link>
          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-cream/10"
          >
            <IconClose size={18} />
          </button>
        </div>

        <nav aria-label="Mobile" className="flex-1 px-2 py-3">
          <ul>
            {navigation.map((item) =>
              item.columns ? (
                <li key={item.label} className="border-b border-cream/8">
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-3.5 font-bold [&::-webkit-details-marker]:hidden">
                      <span className="flex items-baseline gap-3">
                        {item.label}
                        <span lang="ar" dir="rtl" className="text-sm font-normal text-paper/50">
                          {item.labelAr}
                        </span>
                      </span>
                      <IconChevron size={16} className="transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="pb-3 ps-4">
                      {item.columns.map((col) => (
                        <div key={col.title} className="mb-2">
                          <p className="eyebrow px-3 pb-1.5 pt-2 text-goldlight/80">{col.title}</p>
                          <ul>
                            {col.links.map((link) => (
                              <li key={link.to + link.label}>
                                <Link
                                  to={link.to}
                                  onClick={close}
                                  className="block rounded-lg px-3 py-2 text-[0.92rem] text-paper/85 transition-colors hover:bg-cream/10"
                                >
                                  {link.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </details>
                </li>
              ) : (
                <li key={item.label} className="border-b border-cream/8">
                  <Link
                    to={item.to}
                    onClick={close}
                    className={`flex items-baseline gap-3 rounded-lg px-3 py-3.5 font-bold ${
                      item.accent === 'gold'
                        ? 'text-goldlight'
                        : item.accent === 'terracotta'
                          ? 'text-[#e08a5e]'
                          : ''
                    }`}
                  >
                    {item.label}
                    <span lang="ar" dir="rtl" className="text-sm font-normal text-paper/50">
                      {item.labelAr}
                    </span>
                  </Link>
                </li>
              ),
            )}
          </ul>

          <ul className="mt-4 px-3 text-sm text-paper/75">
            {[
              { label: 'Gifting Guide', to: '/pages/gifting' },
              { label: 'Our Story', to: '/pages/about' },
              { label: 'Shipping & Wholesale', to: '/pages/shipping' },
              { label: 'FAQ', to: '/pages/faq' },
              { label: 'Contact', to: '/pages/contact' },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} onClick={close} className="block py-2 transition-colors hover:text-paper">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-cream/10 px-5 py-4">
          <div className="flex items-center gap-3">
            {[
              { label: 'Instagram', href: site.social.instagram, Icon: IconInstagram },
              { label: 'TikTok', href: site.social.tiktok, Icon: IconTikTok },
              { label: 'WhatsApp', href: site.social.whatsapp, Icon: IconWhatsApp },
            ].map(({ label, href, Icon }) =>
              href ? (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 transition-colors hover:bg-cream/10"
                >
                  <Icon size={18} />
                </a>
              ) : (
                <Link
                  key={label}
                  to="/pages/contact"
                  onClick={close}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 transition-colors hover:bg-cream/10"
                >
                  <Icon size={18} />
                </Link>
              ),
            )}
            <span className="ms-auto flex items-center gap-2 text-xs text-paper/50">
              <StarMotif size={12} /> {site.city}, {site.region}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
