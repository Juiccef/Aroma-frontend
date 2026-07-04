import { Link } from 'react-router-dom'
import { site } from '../../content/site'
import { useReveal } from '../../lib/hooks'
import { IconInstagram, IconTikTok, IconWhatsApp } from '../Icons'
import { StarMotif } from '../Motif'

const words = [
  'قهوة بالهيل',
  'Fresh roast',
  'فستق حلبي',
  'Karak time',
  'زعتر فلسطيني',
  'Movie-night seeds',
  'معمول',
  'Weighed by hand',
  'راحة',
  'Eid trays',
]

const channels = [
  {
    label: 'Instagram',
    handleText: 'Behind the roaster, every week',
    href: site.social.instagram,
    Icon: IconInstagram,
  },
  {
    label: 'TikTok',
    handleText: 'New & viral finds, unboxed first',
    href: site.social.tiktok,
    Icon: IconTikTok,
  },
  {
    label: 'WhatsApp',
    handleText: 'Order help & custom trays, one message away',
    href: site.social.whatsapp,
    Icon: IconWhatsApp,
  },
]

export function SocialStrip() {
  const revealRef = useReveal<HTMLElement>()
  return (
    <section ref={revealRef} className="reveal grain relative overflow-hidden bg-espresso py-14 text-paper lg:py-16">
      {/* bilingual marquee */}
      <div aria-hidden className="pointer-events-none select-none overflow-hidden whitespace-nowrap border-y border-cream/10 py-3">
        <div className="animate-[marquee_38s_linear_infinite] inline-block">
          {[0, 1].map((copy) => (
            <span key={copy} className="inline-flex items-center">
              {words.map((word) => (
                <span key={word + copy} className="inline-flex items-center gap-6 pe-6 font-display text-lg text-paper/45">
                  <span lang={/[؀-ۿ]/.test(word) ? 'ar' : undefined}>{word}</span>
                  <StarMotif size={11} className="text-gold/50" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>

      <div className="relative mx-auto max-w-7xl px-5 pt-12 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-goldlight">Come hungry to the feed</p>
            <h2 className="font-display display-tight mt-3 text-3xl font-semibold sm:text-4xl">
              Follow the roast
            </h2>
          </div>
          <p lang="ar" dir="rtl" className="text-xl text-paper/50">
            تابعونا
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {channels.map(({ label, handleText, href, Icon }) => {
            const inner = (
              <>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cream/25 transition-colors group-hover:border-goldlight group-hover:text-goldlight">
                  <Icon size={19} />
                </span>
                <span>
                  <span className="block text-sm font-bold">{label}</span>
                  <span className="mt-0.5 block text-xs leading-snug text-paper/65">{handleText}</span>
                </span>
              </>
            )
            const cls =
              'group flex items-center gap-4 rounded-2xl border border-cream/12 bg-cream/[0.04] p-5 transition-all hover:border-cream/30 hover:bg-cream/[0.08]'
            return href ? (
              <a key={label} href={href} target="_blank" rel="noreferrer" className={cls}>
                {inner}
              </a>
            ) : (
              <Link key={label} to="/pages/contact" className={cls}>
                {inner}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
