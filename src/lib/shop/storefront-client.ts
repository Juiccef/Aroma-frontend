/**
 * Real implementation of `ShopClient` backed by Shopify's Storefront GraphQL
 * API. Used in place of `MockShopClient` once
 * VITE_SHOPIFY_SHOP_DOMAIN / VITE_SHOPIFY_STOREFRONT_TOKEN are set
 * (see src/lib/shop/index.ts for the swap point).
 */
import type {
  Cart,
  CartLine,
  Collection,
  Metafield,
  Money,
  Product,
  ProductConnection,
  ProductOption,
  ProductSortKey,
  ProductVariant,
  ShopImage,
} from './types'
import { minPrice } from './types'
import type { CollectionProductsQuery, ShopClient } from './client'
import { merchandising, virtualCollections } from '../../content/site'

/** small in-memory sort/paginate for the array-based virtual collections below (mirrors MockShopClient) */
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
    default:
      return list
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

const API_VERSION = '2025-01'

const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    vendor
    productType
    tags
    availableForSale
    createdAt
    publishedAt
    featuredImage { url altText width height }
    images(first: 10) { nodes { url altText width height } }
    options { name values }
    priceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
    variants(first: 25) {
      nodes {
        id
        title
        availableForSale
        sku
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
        selectedOptions { name value }
      }
    }
    collections(first: 10) { nodes { handle } }
    metafields(identifiers: [
      { namespace: "custom", key: "title_ar" }
      { namespace: "custom", key: "origin" }
      { namespace: "custom", key: "halal" }
    ]) {
      namespace
      key
      value
    }
  }
`

interface GqlImage {
  url: string
  altText: string | null
  width: number | null
  height: number | null
}

interface GqlProduct {
  id: string
  handle: string
  title: string
  description: string
  vendor: string
  productType: string
  tags: string[]
  availableForSale: boolean
  createdAt: string
  publishedAt: string
  featuredImage: GqlImage | null
  images: { nodes: GqlImage[] }
  options: ProductOption[]
  priceRange: { minVariantPrice: Money; maxVariantPrice: Money }
  variants: { nodes: (Omit<ProductVariant, 'compareAtPrice'> & { compareAtPrice: Money | null })[] }
  collections: { nodes: { handle: string }[] }
  metafields: (Metafield | null)[]
}

function toShopImage(img: GqlImage | null): ShopImage | null {
  if (!img) return null
  return { url: img.url, altText: img.altText, width: img.width, height: img.height }
}

function toProduct(p: GqlProduct): Product {
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    description: p.description,
    vendor: p.vendor,
    productType: p.productType,
    tags: p.tags,
    availableForSale: p.availableForSale,
    createdAt: p.createdAt,
    publishedAt: p.publishedAt,
    featuredImage: toShopImage(p.featuredImage),
    images: p.images.nodes.map((n) => toShopImage(n)!).filter(Boolean),
    options: p.options,
    priceRange: p.priceRange,
    variants: p.variants.nodes,
    collections: p.collections.nodes.map((c) => c.handle),
    metafields: p.metafields.filter((m): m is Metafield => m !== null),
  }
}

function toCollection(c: {
  id: string
  handle: string
  title: string
  description: string
  image: GqlImage | null
}): Collection {
  return {
    id: c.id,
    handle: c.handle,
    title: c.title,
    description: c.description,
    image: toShopImage(c.image),
  }
}

interface GqlCartLine {
  id: string
  quantity: number
  cost: { totalAmount: Money }
  merchandise: {
    id: string
    title: string
    availableForSale: boolean
    sku: string | null
    price: Money
    compareAtPrice: Money | null
    selectedOptions: { name: string; value: string }[]
    product: GqlProduct
  }
}

interface GqlCart {
  id: string
  totalQuantity: number
  checkoutUrl: string
  cost: { subtotalAmount: Money }
  lines: { nodes: GqlCartLine[] }
}

function toCart(c: GqlCart): Cart {
  return {
    id: c.id,
    totalQuantity: c.totalQuantity,
    checkoutUrl: c.checkoutUrl,
    cost: { subtotalAmount: c.cost.subtotalAmount },
    lines: c.lines.nodes.map(
      (l): CartLine => ({
        id: l.id,
        quantity: l.quantity,
        cost: { totalAmount: l.cost.totalAmount },
        merchandise: {
          variant: {
            id: l.merchandise.id,
            title: l.merchandise.title,
            availableForSale: l.merchandise.availableForSale,
            sku: l.merchandise.sku,
            price: l.merchandise.price,
            compareAtPrice: l.merchandise.compareAtPrice,
            selectedOptions: l.merchandise.selectedOptions,
          },
          product: toProduct(l.merchandise.product),
        },
      }),
    ),
  }
}

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    totalQuantity
    checkoutUrl
    cost { subtotalAmount { amount currencyCode } }
    lines(first: 50) {
      nodes {
        id
        quantity
        cost { totalAmount { amount currencyCode } }
        merchandise {
          ... on ProductVariant {
            id
            title
            availableForSale
            sku
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
            selectedOptions { name value }
            product { ...ProductFields }
          }
        }
      }
    }
  }
`

class StorefrontError extends Error {}

async function storefrontFetch<T>(
  domain: string,
  token: string,
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json()
  if (json.errors) {
    throw new StorefrontError(json.errors.map((e: { message: string }) => e.message).join('; '))
  }
  return json.data as T
}

const collectionSortMap: Record<ProductSortKey, string> = {
  FEATURED: 'COLLECTION_DEFAULT',
  BEST_SELLING: 'BEST_SELLING',
  CREATED: 'CREATED',
  PRICE_ASC: 'PRICE',
  PRICE_DESC: 'PRICE',
  TITLE: 'TITLE',
}

export class StorefrontShopClient implements ShopClient {
  private domain: string
  private token: string

  constructor(domain: string, token: string) {
    this.domain = domain
    this.token = token
  }

  private fetch<T>(query: string, variables?: Record<string, unknown>) {
    return storefrontFetch<T>(this.domain, this.token, query, variables)
  }

  async getShop() {
    const data = await this.fetch<{
      shop: { name: string; description: string; paymentSettings: { currencyCode: string } }
    }>(`{ shop { name description paymentSettings { currencyCode } } }`)
    return {
      name: data.shop.name,
      primaryDomain: `https://${this.domain.replace('.myshopify.com', '')}.com`,
      currencyCode: data.shop.paymentSettings.currencyCode,
    }
  }

  async getCollections() {
    const data = await this.fetch<{
      collections: { nodes: { id: string; handle: string; title: string; description: string; image: GqlImage | null }[] }
    }>(`{ collections(first: 50) { nodes { id handle title description image { url altText width height } } } }`)
    return data.collections.nodes.map(toCollection)
  }

  async getCollection(handle: string) {
    const virtual = virtualCollections.find((v) => v.handle === handle)
    if (virtual) {
      return {
        id: `gid://shopify/Collection/virtual-${virtual.handle}`,
        handle: virtual.handle,
        title: virtual.title,
        description: virtual.description,
        image: null,
      } satisfies Collection
    }
    const data = await this.fetch<{
      collection: { id: string; handle: string; title: string; description: string; image: GqlImage | null } | null
    }>(
      `query($handle: String!) {
        collection(handle: $handle) { id handle title description image { url altText width height } }
      }`,
      { handle },
    )
    return data.collection ? toCollection(data.collection) : null
  }

  /** Shopify's real sales-ranked order, not the curated fallback list */
  async getBestSellers(limit = 12) {
    const data = await this.fetch<{ products: { nodes: GqlProduct[] } }>(
      `${PRODUCT_FRAGMENT}
      query($limit: Int!) {
        products(first: $limit, sortKey: BEST_SELLING) { nodes { ...ProductFields } }
      }`,
      { limit },
    )
    return data.products.nodes.map(toProduct)
  }

  /**
   * new-trending / under-10 aren't real Shopify collections on this store;
   * resolved the same way MockShopClient does, from merchandising config in
   * content/site.ts, using real product data. best-sellers uses Shopify's
   * actual sales ranking directly instead, so it's live rather than curated.
   */
  private async virtualCollectionProducts(handle: string): Promise<Product[] | null> {
    if (handle === 'best-sellers') {
      return this.getBestSellers(24)
    }
    if (handle === 'new-trending') {
      const curated = await this.getProductsByHandles(merchandising.trending)
      const curatedIds = new Set(curated.map((p) => p.id))
      const pool = await this.getNewArrivals(40)
      const newest = pool.filter((p) => !curatedIds.has(p.id))
      return [...curated, ...newest.slice(0, 24 - curated.length)]
    }
    if (handle === 'under-10') {
      return this.getProductsUnderPrice(merchandising.underPrice, 250)
    }
    return null
  }

  async getCollectionProducts(handle: string, query: CollectionProductsQuery = {}) {
    const { tag, sortKey = 'FEATURED', first = 24, after = null, minPrice: qMin, maxPrice: qMax, availableOnly } = query

    const virtual = await this.virtualCollectionProducts(handle)
    if (virtual) {
      let items = virtual
      if (tag) items = items.filter((p) => p.tags.includes(tag))
      if (qMin !== undefined) items = items.filter((p) => minPrice(p) >= qMin)
      if (qMax !== undefined) items = items.filter((p) => minPrice(p) < qMax)
      if (availableOnly) items = items.filter((p) => p.availableForSale)
      const sorted = sortKey === 'FEATURED' ? items : sortProducts(items, sortKey)
      return paginate(sorted, first, after)
    }

    const filters: Record<string, unknown>[] = []
    if (tag) filters.push({ tag })
    if (qMin !== undefined || qMax !== undefined) {
      filters.push({ price: { min: qMin, max: qMax } })
    }
    if (availableOnly) filters.push({ available: true })

    const data = await this.fetch<{
      collection: {
        products: { nodes: GqlProduct[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } }
      } | null
    }>(
      `${PRODUCT_FRAGMENT}
      query($handle: String!, $first: Int!, $after: String, $sortKey: ProductCollectionSortKeys, $reverse: Boolean, $filters: [ProductFilter!]) {
        collection(handle: $handle) {
          products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse, filters: $filters) {
            nodes { ...ProductFields }
            pageInfo { hasNextPage endCursor }
          }
        }
      }`,
      {
        handle,
        first,
        after,
        sortKey: collectionSortMap[sortKey],
        reverse: sortKey === 'PRICE_DESC',
        filters: filters.length ? filters : undefined,
      },
    )
    const products = data.collection?.products
    const nodes = (products?.nodes ?? []).map(toProduct)
    return {
      nodes,
      pageInfo: products?.pageInfo ?? { hasNextPage: false, endCursor: null },
      totalCount: nodes.length,
    } satisfies ProductConnection
  }

  async getProduct(handle: string) {
    const data = await this.fetch<{ product: GqlProduct | null }>(
      `${PRODUCT_FRAGMENT}
      query($handle: String!) { product(handle: $handle) { ...ProductFields } }`,
      { handle },
    )
    return data.product ? toProduct(data.product) : null
  }

  async getProductsByHandles(handles: string[]) {
    if (handles.length === 0) return []
    const aliases = handles.map((h, i) => `p${i}: product(handle: ${JSON.stringify(h)}) { ...ProductFields }`)
    const data = await this.fetch<Record<string, GqlProduct | null>>(
      `${PRODUCT_FRAGMENT}\nquery { ${aliases.join('\n')} }`,
    )
    return Object.values(data)
      .filter((p): p is GqlProduct => p !== null)
      .map(toProduct)
  }

  async getProductRecommendations(productId: string, limit = 8) {
    const data = await this.fetch<{ productRecommendations: GqlProduct[] | null }>(
      `${PRODUCT_FRAGMENT}
      query($productId: ID!) { productRecommendations(productId: $productId) { ...ProductFields } }`,
      { productId },
    )
    return (data.productRecommendations ?? []).slice(0, limit).map(toProduct)
  }

  async getNewArrivals(limit = 10) {
    const data = await this.fetch<{ products: { nodes: GqlProduct[] } }>(
      `${PRODUCT_FRAGMENT}
      query($limit: Int!) {
        products(first: $limit, sortKey: CREATED_AT, reverse: true) { nodes { ...ProductFields } }
      }`,
      { limit },
    )
    return data.products.nodes.map(toProduct)
  }

  async getProductsUnderPrice(price: number, limit = 12) {
    const data = await this.fetch<{ products: { nodes: GqlProduct[] } }>(
      `${PRODUCT_FRAGMENT}
      query($limit: Int!, $search: String!) {
        products(first: $limit, sortKey: PRICE, query: $search) {
          nodes { ...ProductFields }
        }
      }`,
      { limit, search: `variants.price:<${price} AND available_for_sale:true` },
    )
    return data.products.nodes.map(toProduct)
  }

  async searchProducts(term: string, limit = 30) {
    const q = term.trim()
    if (!q) return []
    const data = await this.fetch<{ search: { nodes: (GqlProduct & { __typename: string })[] } }>(
      `${PRODUCT_FRAGMENT}
      query($term: String!, $limit: Int!) {
        search(query: $term, first: $limit, types: [PRODUCT]) {
          nodes { __typename ... on Product { ...ProductFields } }
        }
      }`,
      { term: q, limit },
    )
    return data.search.nodes.filter((n) => n.__typename === 'Product').map(toProduct)
  }

  async cartCreate() {
    const data = await this.fetch<{ cartCreate: { cart: GqlCart } }>(
      `${PRODUCT_FRAGMENT}\n${CART_FRAGMENT}
      mutation { cartCreate { cart { ...CartFields } userErrors { field message } } }`,
    )
    return toCart(data.cartCreate.cart)
  }

  async cartLinesAdd(cartId: string, lines: { merchandiseId: string; quantity: number }[]) {
    const data = await this.fetch<{ cartLinesAdd: { cart: GqlCart } }>(
      `${PRODUCT_FRAGMENT}\n${CART_FRAGMENT}
      mutation($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart { ...CartFields }
          userErrors { field message }
        }
      }`,
      { cartId, lines },
    )
    return toCart(data.cartLinesAdd.cart)
  }

  async cartLinesUpdate(cartId: string, lines: { id: string; quantity: number }[]) {
    const data = await this.fetch<{ cartLinesUpdate: { cart: GqlCart } }>(
      `${PRODUCT_FRAGMENT}\n${CART_FRAGMENT}
      mutation($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart { ...CartFields }
          userErrors { field message }
        }
      }`,
      { cartId, lines },
    )
    return toCart(data.cartLinesUpdate.cart)
  }

  async cartLinesRemove(cartId: string, lineIds: string[]) {
    const data = await this.fetch<{ cartLinesRemove: { cart: GqlCart } }>(
      `${PRODUCT_FRAGMENT}\n${CART_FRAGMENT}
      mutation($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart { ...CartFields }
          userErrors { field message }
        }
      }`,
      { cartId, lineIds },
    )
    return toCart(data.cartLinesRemove.cart)
  }
}
