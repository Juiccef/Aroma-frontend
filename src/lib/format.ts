import type { Money, Product } from './shop/types'
import { hasPriceRange } from './shop/types'

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export function formatMoney(m: Money | number): string {
  const value = typeof m === 'number' ? m : parseFloat(m.amount)
  return usd.format(value)
}

/** "$8.00" or "From $8.00" for weight-variant products */
export function formatProductPrice(p: Product): string {
  const min = formatMoney(p.priceRange.minVariantPrice)
  return hasPriceRange(p) ? `From ${min}` : min
}

/** Shopify CDN on-the-fly resize: append a width param to any cdn.shopify.com URL */
export function shopifyImage(url: string, width: number): string {
  if (!url.includes('cdn.shopify.com')) return url
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}width=${width}`
}
