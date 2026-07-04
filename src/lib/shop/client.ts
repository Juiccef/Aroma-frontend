/**
 * The single data-access layer for the storefront.
 *
 * Every product/collection/cart read or write in the app goes through the
 * `ShopClient` interface below. Today it is backed by `MockShopClient`,
 * which serves seed data captured from the live aromaroastco.com Shopify
 * store (313 real products, real prices, real variants).
 *
 * To go live headless, implement `StorefrontShopClient` with the same
 * interface using Storefront GraphQL queries/mutations:
 *   getCollections        -> `collections(first:…)`
 *   getCollectionProducts -> `collection(handle:…){ products(…) }`
 *   getProduct            -> `product(handle:…)`
 *   searchProducts        -> `search(query:…)`
 *   cartCreate/LinesAdd/… -> cartCreate / cartLinesAdd / cartLinesUpdate / cartLinesRemove
 * then change the export at the bottom of index.ts. Nothing else changes.
 */

import seedJson from '../../data/seed.json'
import { merchandising, virtualCollections } from '../../content/site'
import type {
  Cart,
  CartLine,
  Collection,
  Product,
  ProductConnection,
  ProductSortKey,
} from './types'
import { minPrice } from './types'

interface Seed {
  shop: { name: string; primaryDomain: string; currencyCode: string }
  collections: Collection[]
  products: Product[]
}

const seed = seedJson as unknown as Seed

export interface CollectionProductsQuery {
  tag?: string
  sortKey?: ProductSortKey
  first?: number
  after?: string | null
  minPrice?: number
  maxPrice?: number
  availableOnly?: boolean
}

export interface ShopClient {
  getShop(): Promise<Seed['shop']>
  getCollections(): Promise<Collection[]>
  getCollection(handle: string): Promise<Collection | null>
  getCollectionProducts(handle: string, query?: CollectionProductsQuery): Promise<ProductConnection>
  getProduct(handle: string): Promise<Product | null>
  getProductsByHandles(handles: string[]): Promise<Product[]>
  getProductRecommendations(productId: string, limit?: number): Promise<Product[]>
  getNewArrivals(limit?: number): Promise<Product[]>
  getProductsUnderPrice(price: number, limit?: number): Promise<Product[]>
  searchProducts(term: string, limit?: number): Promise<Product[]>
  cartCreate(): Promise<Cart>
  cartLinesAdd(cartId: string, lines: { merchandiseId: string; quantity: number }[]): Promise<Cart>
  cartLinesUpdate(cartId: string, lines: { id: string; quantity: number }[]): Promise<Cart>
  cartLinesRemove(cartId: string, lineIds: string[]): Promise<Cart>
}

/* ---------------- mock implementation over seed data ---------------- */

function sortProducts(products: Product[], sortKey: ProductSortKey): Product[] {
  const list = [...products]
  switch (sortKey) {
    case 'PRICE_ASC':
      return list.sort((a, b) => minPrice(a) - minPrice(b))
    case 'PRICE_DESC':
      return list.sort((a, b) => minPrice(b) - minPrice(a))
    case 'CREATED':
      return list.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    case 'TITLE':
      return list.sort((a, b) => a.title.localeCompare(b.title))
    case 'FEATURED':
    case 'BEST_SELLING':
    default:
      // no sales analytics in seed data: surface photographed products first,
      // then alphabetical. The live Storefront API sorts BEST_SELLING itself.
      return list.sort((a, b) => {
        const ia = a.featuredImage ? 0 : 1
        const ib = b.featuredImage ? 0 : 1
        return ia !== ib ? ia - ib : a.title.localeCompare(b.title)
      })
  }
}

function paginate(products: Product[], first: number, after?: string | null): ProductConnection {
  const start = after ? parseInt(after, 10) : 0
  const nodes = products.slice(start, start + first)
  const end = start + nodes.length
  return {
    nodes,
    pageInfo: { hasNextPage: end < products.length, endCursor: end < products.length ? String(end) : null },
    totalCount: products.length,
  }
}

/** simulated network latency so loading states stay honest in the prototype */
const delay = <T,>(value: T): Promise<T> => new Promise((res) => setTimeout(() => res(value), 60))

let cartCounter = 0
let lineCounter = 0
const carts = new Map<string, Cart>()
const variantIndex = new Map<string, { product: Product; variantId: string }>()
for (const p of seed.products) {
  for (const v of p.variants) variantIndex.set(v.id, { product: p, variantId: v.id })
}

function money(amount: number) {
  return { amount: amount.toFixed(2), currencyCode: seed.shop.currencyCode }
}

function recalc(cart: Cart): Cart {
  let subtotal = 0
  let qty = 0
  for (const line of cart.lines) {
    const price = parseFloat(line.merchandise.variant.price.amount)
    line.cost.totalAmount = money(price * line.quantity)
    subtotal += price * line.quantity
    qty += line.quantity
  }
  cart.totalQuantity = qty
  cart.cost.subtotalAmount = money(subtotal)
  // Shopify cart permalink: works against the live store today; the
  // Storefront API returns cart.checkoutUrl with the same role.
  const path = cart.lines
    .map((l) => `${l.merchandise.variant.id.split('/').pop()}:${l.quantity}`)
    .join(',')
  cart.checkoutUrl = path ? `${seed.shop.primaryDomain}/cart/${path}` : seed.shop.primaryDomain
  return cart
}

/**
 * "Virtual" collections (best-sellers, new-trending, under-10) are resolved
 * from merchandising config here. On the live store each becomes a real
 * Shopify collection (automated by price / best-selling sort, or manual),
 * at which point this special-casing disappears.
 */
function virtualCollectionProducts(handle: string): Product[] | null {
  const byHandle = new Map(seed.products.map((p) => [p.handle, p]))
  if (handle === 'best-sellers') {
    return merchandising.bestSellers
      .map((h) => byHandle.get(h))
      .filter((p): p is Product => Boolean(p))
  }
  if (handle === 'new-trending') {
    const curated = merchandising.trending
      .map((h) => byHandle.get(h))
      .filter((p): p is Product => Boolean(p))
    const newest = sortProducts(seed.products, 'CREATED').filter(
      (p) => !curated.some((cp) => cp.id === p.id),
    )
    return [...curated, ...newest.slice(0, 24 - curated.length)]
  }
  if (handle === 'under-10') {
    return sortProducts(
      seed.products.filter((p) => minPrice(p) < merchandising.underPrice && p.availableForSale),
      'FEATURED',
    )
  }
  return null
}

export class MockShopClient implements ShopClient {
  getShop() {
    return delay(seed.shop)
  }

  getCollections() {
    return delay(seed.collections)
  }

  getCollection(handle: string) {
    const virtual = virtualCollections.find((v) => v.handle === handle)
    if (virtual) {
      return delay<Collection | null>({
        id: `gid://shopify/Collection/virtual-${virtual.handle}`,
        handle: virtual.handle,
        title: virtual.title,
        description: virtual.description,
        image: null,
      })
    }
    return delay(seed.collections.find((c) => c.handle === handle) ?? null)
  }

  getCollectionProducts(handle: string, query: CollectionProductsQuery = {}) {
    const { tag, sortKey = 'FEATURED', first = 24, after = null, availableOnly } = query
    const virtual = virtualCollectionProducts(handle)
    let items = virtual ?? seed.products.filter((p) => p.collections.includes(handle))
    if (tag) items = items.filter((p) => p.tags.includes(tag))
    if (query.minPrice !== undefined) items = items.filter((p) => minPrice(p) >= query.minPrice!)
    if (query.maxPrice !== undefined) items = items.filter((p) => minPrice(p) < query.maxPrice!)
    if (availableOnly) items = items.filter((p) => p.availableForSale)
    // curated virtual collections keep their hand-picked order under FEATURED
    const sorted = virtual && sortKey === 'FEATURED' ? items : sortProducts(items, sortKey)
    return delay(paginate(sorted, first, after))
  }

  getProduct(handle: string) {
    return delay(seed.products.find((p) => p.handle === handle) ?? null)
  }

  getProductsByHandles(handles: string[]) {
    const byHandle = new Map(seed.products.map((p) => [p.handle, p]))
    return delay(handles.map((h) => byHandle.get(h)).filter((p): p is Product => Boolean(p)))
  }

  getProductRecommendations(productId: string, limit = 8) {
    const source = seed.products.find((p) => p.id === productId)
    if (!source) return delay([])
    const scored = seed.products
      .filter((p) => p.id !== productId)
      .map((p) => {
        let score = 0
        for (const c of p.collections) if (source.collections.includes(c)) score += 2
        for (const t of p.tags) if (source.tags.includes(t)) score += 3
        if (p.featuredImage) score += 1
        return { p, score }
      })
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
    return delay(scored.slice(0, limit).map((s) => s.p))
  }

  getNewArrivals(limit = 10) {
    return delay(sortProducts(seed.products, 'CREATED').slice(0, limit))
  }

  getProductsUnderPrice(price: number, limit = 12) {
    const items = seed.products.filter((p) => minPrice(p) < price && p.availableForSale)
    return delay(sortProducts(items, 'FEATURED').slice(0, limit))
  }

  searchProducts(term: string, limit = 30) {
    const q = term.trim().toLowerCase()
    if (!q) return delay([])
    const words = q.split(/\s+/)
    const scored = seed.products
      .map((p) => {
        const hay = `${p.title} ${p.tags.join(' ')} ${p.metafields.map((m) => m.value).join(' ')}`.toLowerCase()
        let score = 0
        for (const w of words) {
          if (!hay.includes(w)) return { p, score: 0 }
          score += p.title.toLowerCase().startsWith(w) ? 3 : 1
        }
        if (p.featuredImage) score += 0.5
        return { p, score }
      })
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
    return delay(scored.slice(0, limit).map((s) => s.p))
  }

  cartCreate() {
    const id = `gid://shopify/Cart/mock-${++cartCounter}`
    const cart: Cart = {
      id,
      totalQuantity: 0,
      lines: [],
      cost: { subtotalAmount: money(0) },
      checkoutUrl: seed.shop.primaryDomain,
    }
    carts.set(id, cart)
    return delay(cart)
  }

  cartLinesAdd(cartId: string, lines: { merchandiseId: string; quantity: number }[]) {
    const cart = carts.get(cartId)
    if (!cart) throw new Error(`Unknown cart ${cartId}`)
    for (const { merchandiseId, quantity } of lines) {
      const hit = variantIndex.get(merchandiseId)
      if (!hit) throw new Error(`Unknown variant ${merchandiseId}`)
      const existing = cart.lines.find((l) => l.merchandise.variant.id === merchandiseId)
      if (existing) {
        existing.quantity += quantity
      } else {
        const variant = hit.product.variants.find((v) => v.id === merchandiseId)!
        const line: CartLine = {
          id: `gid://shopify/CartLine/mock-${++lineCounter}`,
          quantity,
          merchandise: { variant, product: hit.product },
          cost: { totalAmount: money(0) },
        }
        cart.lines.push(line)
      }
    }
    return delay({ ...recalc(cart) })
  }

  cartLinesUpdate(cartId: string, lines: { id: string; quantity: number }[]) {
    const cart = carts.get(cartId)
    if (!cart) throw new Error(`Unknown cart ${cartId}`)
    for (const { id, quantity } of lines) {
      const line = cart.lines.find((l) => l.id === id)
      if (line) line.quantity = Math.max(1, quantity)
    }
    return delay({ ...recalc(cart) })
  }

  cartLinesRemove(cartId: string, lineIds: string[]) {
    const cart = carts.get(cartId)
    if (!cart) throw new Error(`Unknown cart ${cartId}`)
    cart.lines = cart.lines.filter((l) => !lineIds.includes(l.id))
    return delay({ ...recalc(cart) })
  }
}
