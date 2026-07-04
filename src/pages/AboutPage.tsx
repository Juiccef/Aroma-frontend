import { Link } from 'react-router-dom'
import { site } from '../content/site'
import { Seo } from '../components/Seo'
import { Divider, StarMotif } from '../components/Motif'
import { HalalMark, IconArrow, IconFlame, IconGlobe, IconLeaf } from '../components/Icons'

const values = [
  {
    icon: <IconFlame size={22} className="text-terracotta" />,
    title: 'Roasted, not warehoused',
    copy: 'Nuts and seeds go on our roaster in small weekly batches. If it sits, it doesn’t ship.',
  },
  {
    icon: <IconGlobe size={22} className="text-gold" />,
    title: 'Sourced by name',
    copy: 'Palestinian zaatar, Egyptian seeds, Syrian coffee: we buy from the origins our shelves claim.',
  },
  {
    icon: <HalalMark className="text-pistachio" />,
    title: 'Halal-conscious',
    copy: 'We answer honestly, item by item. If we can’t verify a product, we say so before you buy.',
  },
  {
    icon: <IconLeaf size={22} className="text-pistachio" />,
    title: 'Generous by default',
    copy: 'By-the-scoop portions, honest prices and trays built like we’re feeding our own guests.',
  },
]

export function AboutPage() {
  return (
    <>
      <Seo
        title="Our Story · AROMA"
        description={`AROMA is a family roastery and Levantine pantry in ${site.city}, ${site.region}: fresh-roasted nuts, coffee with cardamom, sweets and spices from home.`}
      />

      <section className="grain relative overflow-hidden bg-espresso py-20 text-paper lg:py-28">
        <div className="pattern-star absolute inset-0 opacity-[0.06]" aria-hidden />
        <p
          lang="ar"
          dir="rtl"
          aria-hidden
          className="pointer-events-none absolute -bottom-10 start-0 select-none text-[11rem] leading-none text-goldlight/10 sm:text-[16rem]"
        >
          أروما
        </p>
        <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
          <p className="eyebrow flex items-center justify-center gap-2 text-goldlight">
            <StarMotif size={14} /> Our story
          </p>
          <h1 className="font-display display-tight mt-5 text-4xl font-semibold sm:text-6xl">
            A corner shop from home,
            <br />
            <em className="text-goldlight">rebuilt in Georgia</em>
          </h1>
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-paper/80">
            Everyone who grew up around a Levantine roastery knows the ritual: the scoop, the paper
            bag, the handful passed over the counter before you pay. AROMA exists to keep that
            ritual alive in {site.city}, and to ship it anywhere the craving reaches.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="space-y-6 text-[1.02rem] leading-relaxed text-cocoa">
          <p>
            It starts with the roaster. Every week we roast pistachios, cashews, almonds and the
            seeds of long family evenings (watermelon, pumpkin, Egyptian, Palestinian), then
            season them by hand and sell them by weight, the way it's done back home. Coffee gets
            the same respect: ground with cardamom so the smell greets you before the cup does.
          </p>
          <p>
            Around the roaster we built the pantry: zaatar and sumac by the scoop, saffron and
            mahlab for the ones who bake, mamool and Turkish delight for the ones who don't, and a
            fridge of juices and malts from every corner shop between Amman and Istanbul.
          </p>
          <p>
            And because no visit home ends without a full tray, we build gift trays and boxes for
            Eid, weddings, graduations and new babies, packed the way your aunties would insist
            on: too much, beautifully arranged.
          </p>
        </div>
        <Divider className="mx-auto my-12 w-40 text-gold" />
        <div className="grid gap-4 sm:grid-cols-2">
          {values.map((v) => (
            <div key={v.title} className="keyline rounded-2xl bg-cream p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line">
                {v.icon}
              </span>
              <h2 className="mt-4 font-display text-xl font-semibold">{v.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-bark">{v.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-parchment/60">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-5 py-14 text-center sm:px-8">
          <h2 className="font-display display-tight text-3xl font-semibold">
            Come by, or let us come to you
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-bark">
            We're in {site.city}, {site.region}, and everything on the shelf ships across the US,
            Canada and beyond.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              to="/pages/contact"
              className="inline-flex items-center gap-2 rounded-full bg-espresso px-7 py-3.5 text-sm font-bold text-cream transition-colors hover:bg-cocoa"
            >
              Visit or contact us <IconArrow size={15} />
            </Link>
            <Link
              to="/collections/best-sellers"
              className="rounded-full border-2 border-espresso px-7 py-3.5 text-sm font-bold transition-colors hover:bg-espresso hover:text-cream"
            >
              Shop best sellers
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
