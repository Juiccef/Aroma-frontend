import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../../content/site'
import { useStore } from '../../lib/store-context'
import { useBodyLock, useEscape } from '../../lib/hooks'
import { formatMoney } from '../../lib/format'
import { arabicTitle } from '../../lib/shop'
import { IconArrow, IconBag, IconCheck, IconClose, IconMinus, IconPlus, IconTrash } from '../Icons'
import { ProductImage } from '../product/ProductImage'

function FreeShippingProgress({ subtotal }: { subtotal: number }) {
  const threshold = site.freeShippingThreshold
  const remaining = Math.max(0, threshold - subtotal)
  const pct = Math.min(100, (subtotal / threshold) * 100)
  return (
    <div className="border-b border-line bg-parchment/70 px-6 py-4">
      {remaining > 0 ? (
        <p className="text-sm">
          You're <strong className="text-terracotta">{formatMoney(remaining)}</strong> away from free
          US shipping
        </p>
      ) : (
        <p className="flex items-center gap-2 text-sm font-bold text-pistachio">
          <IconCheck size={16} /> You've unlocked free US shipping
        </p>
      )}
      <div
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progress toward free shipping"
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-line/80"
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${remaining > 0 ? 'bg-gold' : 'bg-pistachio'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export function CartDrawer() {
  const { cart, cartOpen, closeCart, updateLine, removeLine, cartBusy } = useStore()
  const panelRef = useRef<HTMLDivElement>(null)

  useBodyLock(cartOpen)
  useEscape(cartOpen, closeCart)

  useEffect(() => {
    if (cartOpen) panelRef.current?.focus()
  }, [cartOpen])

  if (!cartOpen) return null
  const lines = cart?.lines ?? []
  const subtotal = cart ? parseFloat(cart.cost.subtotalAmount.amount) : 0

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <button
        type="button"
        aria-label="Close cart"
        onClick={closeCart}
        className="animate-fade-in absolute inset-0 bg-espresso/55 backdrop-blur-[2px]"
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className="animate-fade-in absolute inset-y-0 end-0 flex w-[min(26rem,94vw)] flex-col bg-paper shadow-drawer outline-none"
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-display text-xl font-semibold">
            Your cart{' '}
            {cart && cart.totalQuantity > 0 && (
              <span className="text-base text-mocha">({cart.totalQuantity})</span>
            )}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="flex h-9 w-9 items-center justify-center rounded-full text-bark transition-colors hover:bg-parchment"
          >
            <IconClose size={17} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-parchment text-bark">
              <IconBag size={26} />
            </span>
            <p className="font-display text-xl font-semibold">Your cart is empty</p>
            <p className="text-sm text-mocha">
              Fill it with warm nuts, fresh zaatar and something sweet.
            </p>
            <Link
              to="/collections/best-sellers"
              onClick={closeCart}
              className="mt-2 rounded-full bg-espresso px-6 py-3 text-sm font-bold text-cream transition-colors hover:bg-cocoa"
            >
              Shop best sellers
            </Link>
          </div>
        ) : (
          <>
            <FreeShippingProgress subtotal={subtotal} />
            <ul className="flex-1 divide-y divide-line/70 overflow-y-auto px-6">
              {lines.map((line) => {
                const p = line.merchandise.product
                const v = line.merchandise.variant
                const ar = arabicTitle(p)
                return (
                  <li key={line.id} className="@container flex gap-4 py-4">
                    <Link
                      to={`/products/${p.handle}`}
                      onClick={closeCart}
                      className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-line bg-white"
                    >
                      <ProductImage product={p} width={160} sizes="80px" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/products/${p.handle}`}
                          onClick={closeCart}
                          className="min-w-0 text-sm font-bold leading-snug"
                        >
                          <span className="block truncate">{p.title}</span>
                          {ar && (
                            <span lang="ar" dir="rtl" className="block truncate text-start font-normal text-mocha">
                              {ar}
                            </span>
                          )}
                        </Link>
                        <button
                          type="button"
                          onClick={() => void removeLine(line.id)}
                          aria-label={`Remove ${p.title}`}
                          className="mt-0.5 shrink-0 text-mocha transition-colors hover:text-terracotta"
                        >
                          <IconTrash size={15} />
                        </button>
                      </div>
                      {v.title !== 'Default Title' && (
                        <p className="mt-0.5 text-xs text-mocha">
                          {v.title.replace('Quarter Pound', '¼ lb').replace('Half Pound', '½ lb').replace(/\bPound\b/, '1 lb')}
                        </p>
                      )}
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-line bg-cream">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            disabled={cartBusy}
                            onClick={() => void updateLine(line.id, line.quantity - 1)}
                            className="flex h-7 w-8 items-center justify-center text-bark hover:text-espresso disabled:opacity-40"
                          >
                            <IconMinus size={13} />
                          </button>
                          <span className="min-w-6 text-center text-xs font-bold">{line.quantity}</span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            disabled={cartBusy}
                            onClick={() => void updateLine(line.id, line.quantity + 1)}
                            className="flex h-7 w-8 items-center justify-center text-bark hover:text-espresso disabled:opacity-40"
                          >
                            <IconPlus size={13} />
                          </button>
                        </div>
                        <span className="text-sm font-bold">{formatMoney(line.cost.totalAmount)}</span>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className="border-t border-line bg-cream px-6 py-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-[0.12em] text-bark">Subtotal</span>
                <span className="font-display text-xl font-semibold">
                  {cart && formatMoney(cart.cost.subtotalAmount)}
                </span>
              </div>
              <p className="mt-1 text-xs text-mocha">
                Shipping and taxes are calculated at Shopify checkout.
              </p>
              <a
                href={cart?.checkoutUrl}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-espresso py-4 text-sm font-bold tracking-wide text-cream transition-colors hover:bg-cocoa"
              >
                Check out securely <IconArrow size={16} />
              </a>
              <p className="mt-3 text-center text-[0.68rem] uppercase tracking-[0.14em] text-mocha">
                Visa · Mastercard · Amex · Apple Pay · Google Pay · Shop Pay
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
