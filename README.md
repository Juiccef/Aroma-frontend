# AROMA storefront

A conversion-focused, bilingual (English | Arabic) storefront prototype for **AROMA**
(aromaroastco.com): roasted nuts, Arabic sweets, coffee, spices and gifts from Duluth, Georgia.

Built React + TypeScript + Tailwind v4 with a **Shopify-shaped data layer**: every read and cart
mutation mirrors the Storefront API, so going live is configuration, not a rewrite.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run lint
```

---

## What's real vs. mock

**Real (captured from the live Shopify store on 2026-07-02):**
- All **313 products** with real handles, prices, weight variants (¼ / ½ / 1 lb) and availability
- All **9 collections** and their memberships, plus collection images where the store has them
- Product photography for the 53 products that have it (served from Shopify's CDN)
- Ships-to country list (from the store's Shopify settings)
- Checkout: the cart drawer's "Check out securely" builds a **real Shopify cart permalink**
  (`aromaroastco.com/cart/{variantId}:{qty},…`): it works against the live store today

**Mock / to be swapped (all flagged in "Gaps" below):**
- Arabic names, origins, subcategory tags (derived/curated: see "Metafields contract")
- Reviews, announcement copy, free-shipping threshold, social URLs

Seed snapshot lives in `src/data/seed.json`; regenerate it anytime with
`python3 scripts/build-seed.py` (fetches the live `/products.json` + `/collections.json`).

## Architecture

```
src/
  data/seed.json           Storefront-API-shaped snapshot of the live catalog
  lib/
    shop/
      types.ts             Product, Variant, Collection, Money, Cart: mirrors Storefront API
      client.ts            ShopClient interface + MockShopClient (the ONLY data access point)
      index.ts             `export const shop: ShopClient`: the swap point for going live
    store-context.tsx      cart state; every mutation flows through ShopClient cart methods
    hooks.ts               useShopData / useReveal / useBodyLock / useEscape
    format.ts              money + Shopify CDN image resizing helpers
  content/site.ts          ALL merchant-editable content: nav/mega-menu, merchandising,
                           announcements, occasions, FAQ, sample reviews, social URLs
  components/
    chrome/                AnnouncementBar · Header (mega menu) · MobileNav · SearchOverlay ·
                           CartDrawer (free-shipping progress) · Footer (newsletter)
    product/               ProductCard · ProductImage (bilingual fallback tile) · QuickView ·
                           PurchasePanel (shared buy state) · ProductRail · Price/Badges/Bilingual
    home/                  HeroCarousel · TrustStrip · CategoryGrid · GiftBand · StoryStrip ·
                           ReviewsBlock · SocialStrip
  pages/                   Home · Collection (filters/sort/load-more) · Product (weight variants,
                           sticky mobile buy bar) · Search · About · Gifting · Contact · FAQ ·
                           Shipping · 404
```

Components never fetch on their own: they call `shop.*` through `useShopData`. URLs follow
Shopify conventions (`/collections/:handle`, `/products/:handle`, `?tag=`), so live routing maps 1:1.

## Going live on Shopify

Two supported paths: **A is recommended** for this design.

### Path A: Headless (Hydrogen / Storefront API)
1. Implement `StorefrontShopClient` with the same `ShopClient` interface
   (`src/lib/shop/client.ts` documents the query per method: `collection.products`,
   `product(handle)`, `search`, `cartCreate` / `cartLinesAdd` / `cartLinesUpdate` / `cartLinesRemove`).
2. Change one line in `src/lib/shop/index.ts` to export the new client.
3. Replace the cart permalink with `cart.checkoutUrl` from the Cart API (same field name already).
4. Port routes to Hydrogen/Remix file routes; `Seo.tsx` becomes Remix `meta` exports.
   Needs: Storefront API access token + Hydrogen storefront setup.

### Path B: Custom Liquid theme (Online Store 2.0)
The component inventory maps to sections: hero carousel, category grid, product rails, gift band,
trust strip, reviews, newsletter → JSON-template sections; mega-menu/nav → theme settings +
`linklists`; cart drawer → AJAX Cart API; quick view → product card snippet + fetch
`/products/{handle}.js`. `content/site.ts` values become section/theme settings so the merchant
edits everything in the customizer.

### Shopify objects to create (either path)
| In this prototype | On live Shopify |
|---|---|
| Virtual collection `best-sellers` | Real collection, sort: Best selling |
| Virtual collection `new-trending` | Manual collection (merchant curates) |
| Virtual collection `under-10` | Automated collection: price < $10 |
| Derived tags (`pistachios`, `zaatar`, …) | Product tags with the same slugs (mega-menu + filter chips read them) |
| `metafields custom.title_ar` | Product metafield (single-line text): Arabic display name |
| `metafields custom.origin` | Product metafield: provenance ("Palestine", "Syria", …) |
| Free-shipping threshold ($59 in `site.ts`) | Real shipping rate + announcement copy |

## Metafields contract (bilingual + provenance)

- `custom.title_ar`: Arabic product name. **127 products** have curated translations in the seed
  (transliterations for brands). The rest fall back to a designed tile with the product initial.
  Fill these in Shopify Admin and every card, rail, cart line, and PDP shows Arabic automatically.
- `custom.origin`: set only where the product name itself states origin (Palestinian seeds,
  Aleppo pepper, …). Powers the origin chips.
- RTL-ready: layout uses logical properties (`ms/me/ps/pe`, `start/end`) throughout, so an Arabic
  locale flip (`dir="rtl"`) does not need a rebuild.

## Flagged gaps: needs the merchant / real data

1. **Product photography**: only 53 of 313 products have images. The bilingual fallback tile keeps
   grids intentional, but hero categories (coffee, spices, sweets) deserve real shots first.
2. **Social + WhatsApp URLs** (`content/site.ts → site.social`): not publicly findable. All
   WhatsApp/social buttons currently fall back to `/pages/contact`; set the real URLs and every
   touchpoint lights up. WhatsApp is wired as a first-class channel across PDP, gifting, contact, footer.
3. **Free-shipping threshold**: $59 is a placeholder config value: set the real one.
4. **Halal**: no per-product halal data exists, so there are **no per-product halal claims**.
   Storewide messaging is "halal-conscious, ask us" (trust strip, PDP, FAQ). If the merchant
   certifies items, add a `dietary` metafield and the badge system in `ProductBits.tsx` can show it.
5. **Reviews are sample content** (`content/site.ts → sampleReviews`): swap in Judge.me / Okendo /
   Google Reviews before launch.
6. **Product descriptions**: the live catalog has none. PDPs show honest per-category copy
   (`categoryNote` in `ProductPage.tsx`) + an "ask us" path for ingredients/allergens. Real
   descriptions and allergen data should come from the merchant.
7. **No gift tray / gift card products exist** in the catalog. The Gifting page sells the *service*
   (custom trays via contact/WhatsApp) and rails real serveware. Recommend adding tray products
   and enabling Shopify Gift Cards; nav already has room for them.
8. **No dates/dried-fruit products** despite the category concept ("Turkish Delights & Dried
   Fruits" holds 2 items): a merchandising gap worth filling.
9. **Store hours / exact address**: only "Duluth, Georgia" is public; contact page says
   city-level info until the merchant provides details (no map embed without an address).
10. **Multi-currency (US/CA)**: announcement bar shows USD; on live Shopify, Markets handles
    CAD pricing at checkout. A currency selector becomes real with Storefront `@inContext`.
11. **Best sellers are curated** (no sales analytics in public data): becomes Shopify's real
    best-selling sort on live.
12. **Contact + newsletter forms** are working prototypes (in-memory success). Wire to Shopify's
    `/contact` form or Klaviyo on live.

## Quality notes

- **A11y**: skip link, semantic landmarks, focus-visible rings, keyboard-operable mega menu
  (focus-within), Escape closes all overlays, aria-modal dialogs, alt text everywhere,
  `aria-pressed` filters, progressbar semantics on the shipping meter.
- **Performance**: Shopify CDN images get `?width=` + `srcset`; lazy loading below the fold;
  width/height set to avoid CLS; system-quiet animations under `prefers-reduced-motion`.
- **SEO**: per-page titles/descriptions, JSON-LD (Store, Product + AggregateOffer, Breadcrumb,
  FAQPage), Shopify-style clean URLs.
- **No browser storage** is used; cart lives in memory by design (drops in for Shopify's
  persistent cart on live).
- Bundle is ~640 KB minified because the full 313-product seed ships in-app; it disappears
  entirely once the live client replaces the mock.

## Design system

Warm-earth palette from coffee, pistachio, honey and saffron (tokens in `src/index.css` `@theme`):
espresso `#26160b` · paper `#f5edda` · gold `#b07f22` · pistachio `#5e6f3d` · terracotta `#a8471d`.
Type: **Fraunces** (display, heritage feel) + **Karla** (body) + **Amiri** (Arabic). Ornament:
eight-point star (khatam) as favicon, dividers, and pattern; Levantine arch frames on imagery;
film grain on dark bands.
