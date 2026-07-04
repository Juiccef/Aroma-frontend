import { HalalMark, IconFlame, IconGlobe, IconTruck } from '../Icons'

const items = [
  {
    icon: <HalalMark className="text-pistachio" />,
    title: 'Halal-conscious',
    sub: 'Ask us about any item and we confirm before you buy',
  },
  {
    icon: (
      <span className="flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-current text-terracotta">
        <IconFlame size={18} />
      </span>
    ),
    title: 'Roasted in-house',
    sub: 'Small batches on the roaster every single week',
  },
  {
    icon: (
      <span className="flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-current text-gold">
        <IconGlobe size={18} />
      </span>
    ),
    title: 'Authentic imports',
    sub: 'Sourced from the Levant, the Gulf and Türkiye',
  },
  {
    icon: (
      <span className="flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-current text-bark">
        <IconTruck size={18} />
      </span>
    ),
    title: 'Fast shipping',
    sub: 'US, Canada and 25+ countries worldwide',
  },
]

export function TrustStrip() {
  return (
    <section aria-label="Why shop with AROMA" className="border-b border-line bg-parchment/60">
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-5 px-5 py-6 sm:px-8 lg:grid-cols-4">
        {items.map((item) => (
          <li key={item.title} className="flex items-center gap-3.5">
            <span className="shrink-0">{item.icon}</span>
            <div>
              <p className="text-sm font-bold">{item.title}</p>
              <p className="mt-0.5 text-xs leading-snug text-mocha">{item.sub}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
