import { MockShopClient } from './client'
import type { ShopClient } from './client'

/**
 * Swap point for going live: replace MockShopClient with a
 * StorefrontShopClient (Storefront GraphQL API) implementing the same
 * interface. Components import `shop` and never fetch on their own.
 */
export const shop: ShopClient = new MockShopClient()

export * from './types'
export type { ShopClient, CollectionProductsQuery } from './client'
