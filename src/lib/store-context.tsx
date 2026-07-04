import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { shop } from './shop'
import type { Cart, Product } from './shop'

/**
 * Cart state lives in memory and every mutation flows through the
 * ShopClient cart API (mirrors Storefront cartCreate/cartLinesAdd/…).
 * Checkout is always Shopify's: we only ever link to cart.checkoutUrl.
 */

interface StoreContextValue {
  cart: Cart | null
  cartBusy: boolean
  addToCart: (merchandiseId: string, quantity?: number) => Promise<void>
  updateLine: (lineId: string, quantity: number) => Promise<void>
  removeLine: (lineId: string) => Promise<void>
  cartOpen: boolean
  openCart: () => void
  closeCart: () => void
  quickView: Product | null
  openQuickView: (p: Product) => void
  closeQuickView: () => void
  navOpen: boolean
  setNavOpen: (open: boolean) => void
  searchOpen: boolean
  setSearchOpen: (open: boolean) => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [cartBusy, setCartBusy] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [quickView, setQuickView] = useState<Product | null>(null)
  const [navOpen, setNavOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const cartIdRef = useRef<string | null>(null)

  useEffect(() => {
    let alive = true
    shop.cartCreate().then((c) => {
      if (alive) {
        cartIdRef.current = c.id
        setCart(c)
      }
    })
    return () => {
      alive = false
    }
  }, [])

  const addToCart = useCallback(async (merchandiseId: string, quantity = 1) => {
    if (!cartIdRef.current) return
    setCartBusy(true)
    const next = await shop.cartLinesAdd(cartIdRef.current, [{ merchandiseId, quantity }])
    setCart(next)
    setCartBusy(false)
    setQuickView(null)
    setCartOpen(true)
  }, [])

  const updateLine = useCallback(async (lineId: string, quantity: number) => {
    if (!cartIdRef.current) return
    setCartBusy(true)
    const next =
      quantity <= 0
        ? await shop.cartLinesRemove(cartIdRef.current, [lineId])
        : await shop.cartLinesUpdate(cartIdRef.current, [{ id: lineId, quantity }])
    setCart(next)
    setCartBusy(false)
  }, [])

  const removeLine = useCallback(async (lineId: string) => {
    if (!cartIdRef.current) return
    setCartBusy(true)
    const next = await shop.cartLinesRemove(cartIdRef.current, [lineId])
    setCart(next)
    setCartBusy(false)
  }, [])

  const value = useMemo<StoreContextValue>(
    () => ({
      cart,
      cartBusy,
      addToCart,
      updateLine,
      removeLine,
      cartOpen,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      quickView,
      openQuickView: (p: Product) => setQuickView(p),
      closeQuickView: () => setQuickView(null),
      navOpen,
      setNavOpen,
      searchOpen,
      setSearchOpen,
    }),
    [cart, cartBusy, addToCart, updateLine, removeLine, cartOpen, quickView, navOpen, searchOpen],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>')
  return ctx
}
