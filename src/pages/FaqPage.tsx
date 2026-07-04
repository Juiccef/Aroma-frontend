import { Link } from 'react-router-dom'
import { faqs } from '../content/site'
import { Seo } from '../components/Seo'
import { IconArrow, IconChevron } from '../components/Icons'

export function FaqPage() {
  return (
    <>
      <Seo
        title="FAQ · AROMA"
        description="Freshness, buying by weight, halal questions, international shipping and wholesale, all answered."
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }}
      />
      <section className="border-b border-line bg-parchment/60">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
          <p className="eyebrow text-gold">Help</p>
          <h1 className="font-display display-tight mt-2 text-4xl font-semibold sm:text-5xl">
            Questions we hear across the counter
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
        <div className="keyline rounded-2xl bg-cream px-6 sm:px-8">
          {faqs.map((f) => (
            <details key={f.q} className="group border-b border-line last:border-b-0">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-bold [&::-webkit-details-marker]:hidden">
                {f.q}
                <IconChevron
                  size={16}
                  className="shrink-0 text-bark transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="pb-6 text-[0.92rem] leading-relaxed text-bark">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-mocha">
          Didn't find it?{' '}
          <Link to="/pages/contact" className="link-ink inline-flex items-center gap-1.5 font-bold text-gold">
            Ask us directly <IconArrow size={14} />
          </Link>
        </p>
      </div>
    </>
  )
}
