import { shop } from '../lib/shop'
import type { Product, ProductConnection } from '../lib/shop'
import { useShopData } from '../lib/hooks'
import { merchandising, site } from '../content/site'
import { Seo } from '../components/Seo'
import { HeroCarousel } from '../components/home/HeroCarousel'
import { TrustStrip } from '../components/home/TrustStrip'
import { CategoryGrid } from '../components/home/CategoryGrid'
import { GiftBand } from '../components/home/GiftBand'
import { StoryStrip } from '../components/home/StoryStrip'
import { ReviewsBlock } from '../components/home/ReviewsBlock'
import { SocialStrip } from '../components/home/SocialStrip'
import { ProductRail } from '../components/product/ProductRail'

export function HomePage() {
  const { data: bestSellers } = useShopData<Product[]>(
    () => shop.getProductsByHandles(merchandising.bestSellers),
    [],
  )
  const { data: trending } = useShopData<ProductConnection>(
    () => shop.getCollectionProducts('new-trending', { first: 10 }),
    [],
  )
  const { data: underTen } = useShopData<Product[]>(
    () => shop.getProductsUnderPrice(merchandising.underPrice, 10),
    [],
  )

  return (
    <>
      <Seo
        title="AROMA · Roasted Nuts, Arabic Sweets, Coffee & Spices"
        description={`Nuts and coffee roasted fresh every week in ${site.city}, ${site.region}, plus authentic Middle Eastern sweets, spices and drinks. Free US shipping over $${site.freeShippingThreshold}.`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Store',
          name: site.name,
          url: site.liveDomain,
          address: {
            '@type': 'PostalAddress',
            addressLocality: site.city,
            addressRegion: site.region,
            addressCountry: 'US',
          },
        }}
      />
      <HeroCarousel />
      <TrustStrip />
      <div className="space-y-16 py-14 lg:space-y-24 lg:py-20">
        <CategoryGrid />
        <ProductRail
          eyebrow="Refilled every week"
          title="Best sellers"
          titleAr="الأكثر مبيعاً"
          to="/collections/best-sellers"
          products={bestSellers ?? []}
        />
        <ProductRail
          eyebrow="Fresh on the shelf"
          title="New & trending"
          titleAr="جديد ورائج"
          to="/collections/new-trending"
          products={trending?.nodes ?? []}
        />
        <GiftBand />
        <ProductRail
          eyebrow="Easy yes"
          title="Under $10"
          titleAr="أقل من ١٠ دولارات"
          to="/collections/under-10"
          products={underTen ?? []}
        />
        <StoryStrip />
        <ReviewsBlock />
      </div>
      <SocialStrip />
    </>
  )
}
