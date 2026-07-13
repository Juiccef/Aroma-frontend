import { MockShopClient } from './client'
import type { ShopClient } from './client'
import { StorefrontShopClient } from './storefront-client'

const shopDomain = import.meta.env.VITE_SHOPIFY_SHOP_DOMAIN as string | undefined
const storefrontToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN as string | undefined

/**
 * Swap point for going live: MockShopClient (seed.json snapshot) is used by
 * default; setting VITE_SHOPIFY_SHOP_DOMAIN + VITE_SHOPIFY_STOREFRONT_TOKEN
 * switches to StorefrontShopClient (real Storefront GraphQL API) with no
 * other code changes. Components import `shop` and never fetch on their own.
 */
export const shop: ShopClient =
  shopDomain && storefrontToken
    ? new StorefrontShopClient(shopDomain, storefrontToken)
    : new MockShopClient()

export * from './types'
export type { ShopClient, CollectionProductsQuery } from './client'
