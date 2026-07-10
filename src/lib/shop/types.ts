/**
 * Types mirror the Shopify Storefront API object model 1:1
 * (Product, ProductVariant, Collection, Image, MoneyV2, Metafield, Cart)
 * so the mock client can be swapped for a Storefront GraphQL client
 * without touching any component.
 */

export interface Money {
  amount: string
  currencyCode: string
}

export interface ShopImage {
  id?: string
  url: string
  altText: string | null
  width?: number | null
  height?: number | null
}

export interface Metafield {
  namespace: string
  key: string
  value: string
}

export interface SelectedOption {
  name: string
  value: string
}

export interface ProductOption {
  name: string
  values: string[]
}

export interface ProductVariant {
  id: string
  title: string
  availableForSale: boolean
  price: Money
  compareAtPrice: Money | null
  selectedOptions: SelectedOption[]
  sku: string | null
}

export interface Product {
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
  featuredImage: ShopImage | null
  images: ShopImage[]
  options: ProductOption[]
  priceRange: {
    minVariantPrice: Money
    maxVariantPrice: Money
  }
  variants: ProductVariant[]
  /** collection handles this product belongs to (flattened from the collections connection) */
  collections: string[]
  metafields: Metafield[]
}

export interface Collection {
  id: string
  handle: string
  title: string
  description: string
  image: ShopImage | null
}

export interface CartLine {
  id: string
  quantity: number
  merchandise: {
    variant: ProductVariant
    product: Product
  }
  cost: {
    totalAmount: Money
  }
}

export interface Cart {
  id: string
  totalQuantity: number
  lines: CartLine[]
  cost: {
    subtotalAmount: Money
  }
  checkoutUrl: string
}

export type ProductSortKey =
  | 'FEATURED'
  | 'BEST_SELLING'
  | 'CREATED'
  | 'PRICE_ASC'
  | 'PRICE_DESC'
  | 'TITLE'

export interface PageInfo {
  hasNextPage: boolean
  endCursor: string | null
}

export interface ProductConnection {
  nodes: Product[]
  pageInfo: PageInfo
  totalCount: number
}

/* ---------- convenience accessors (pure helpers, no fetching) ---------- */

export function metafield(p: Product, key: string): string | null {
  return p.metafields.find((m) => m.key === key)?.value ?? null
}

/** Arabic display name, stored as the custom.title_ar metafield in Shopify */
export function arabicTitle(p: Product): string | null {
  return metafield(p, 'title_ar')
}

/** provenance, stored as the custom.origin metafield in Shopify */
export function origin(p: Product): string | null {
  return metafield(p, 'origin')
}

/** merchant-confirmed halal, stored as the custom.halal boolean metafield in Shopify */
export function isHalal(p: Product): boolean {
  return metafield(p, 'halal') === 'true'
}

/** true when the product sells by weight (a Shopify option named "Weight") */
export function soldByWeight(p: Product): boolean {
  return p.options.some((o) => o.name === 'Weight')
}

export function hasPriceRange(p: Product): boolean {
  return p.priceRange.minVariantPrice.amount !== p.priceRange.maxVariantPrice.amount
}

export function onSale(p: Product): boolean {
  return p.variants.some(
    (v) => v.compareAtPrice && parseFloat(v.compareAtPrice.amount) > parseFloat(v.price.amount),
  )
}

export function minPrice(p: Product): number {
  return parseFloat(p.priceRange.minVariantPrice.amount)
}
