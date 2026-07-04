import { useMemo, useState } from 'react'
import type { Product, ProductVariant } from '../../lib/shop'
import { useStore } from '../../lib/store-context'
import { formatMoney } from '../../lib/format'
import { IconCheck, IconMinus, IconPlus } from '../Icons'

const WEIGHT_LABELS: Record<string, string> = {
  'Quarter Pound': '¼ lb',
  'Half Pound': '½ lb',
  Pound: '1 lb',
}

export function weightLabel(value: string): string {
  return WEIGHT_LABELS[value] ?? value
}

export interface PurchaseState {
  selection: Record<string, string>
  select: (name: string, value: string) => void
  qty: number
  setQty: (updater: (q: number) => number) => void
  variant: ProductVariant
  total: number
  disabled: boolean
  justAdded: boolean
  add: () => Promise<void>
}

/**
 * Shared buying state: variant selection, quantity, add-to-cart. Used by
 * the quick-view modal, the product page and its sticky mobile buy bar so
 * behavior stays identical everywhere.
 */
export function usePurchase(product: Product): PurchaseState {
  const { addToCart, cartBusy } = useStore()
  const firstAvailable = product.variants.find((v) => v.availableForSale) ?? product.variants[0]
  const [selection, setSelection] = useState<Record<string, string>>(() =>
    Object.fromEntries(firstAvailable.selectedOptions.map((o) => [o.name, o.value])),
  )
  const [qty, setQtyState] = useState(1)
  const [justAdded, setJustAdded] = useState(false)

  const variant = useMemo<ProductVariant>(
    () =>
      product.variants.find((v) => v.selectedOptions.every((o) => selection[o.name] === o.value)) ??
      firstAvailable,
    [product, selection, firstAvailable],
  )

  const add = async () => {
    await addToCart(variant.id, qty)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1600)
  }

  return {
    selection,
    select: (name, value) => setSelection((s) => ({ ...s, [name]: value })),
    qty,
    setQty: (updater) => setQtyState((q) => Math.max(1, updater(q))),
    variant,
    total: parseFloat(variant.price.amount) * qty,
    disabled: cartBusy || !variant.availableForSale,
    justAdded,
    add,
  }
}

export function PurchasePanel({
  product,
  purchase,
  large = false,
}: {
  product: Product
  purchase?: PurchaseState
  large?: boolean
}) {
  const internal = usePurchase(product)
  const state = purchase ?? internal
  const { selection, select, qty, setQty, variant, total, disabled, justAdded, add } = state

  return (
    <div className="flex flex-col gap-4">
      {product.options.map((option) => (
        <fieldset key={option.name}>
          <legend className="eyebrow mb-2 text-bark">{option.name}</legend>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const active = selection[option.name] === value
              const priced = product.variants.find((v) =>
                v.selectedOptions.some((o) => o.name === option.name && o.value === value),
              )
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => select(option.name, value)}
                  className={`rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
                    active
                      ? 'border-espresso bg-espresso text-cream'
                      : 'border-line bg-cream text-espresso hover:border-bark'
                  }`}
                >
                  {option.name === 'Weight' ? weightLabel(value) : value}
                  {option.name === 'Weight' && priced && (
                    <span className={`ms-2 text-xs font-normal ${active ? 'text-paper/80' : 'text-mocha'}`}>
                      {formatMoney(priced.price)}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </fieldset>
      ))}

      <div className="flex items-stretch gap-3">
        <div className="flex items-center rounded-full border border-line bg-cream">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => q - 1)}
            className="flex h-full w-10 items-center justify-center text-bark transition-colors hover:text-espresso"
          >
            <IconMinus size={15} />
          </button>
          <span aria-live="polite" className="min-w-7 text-center text-sm font-bold">
            {qty}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQty((q) => q + 1)}
            className="flex h-full w-10 items-center justify-center text-bark transition-colors hover:text-espresso"
          >
            <IconPlus size={15} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => void add()}
          disabled={disabled}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full bg-espresso font-bold text-cream transition-all hover:bg-cocoa disabled:opacity-50 ${
            large ? 'px-6 py-4 text-base' : 'px-5 py-3 text-sm'
          }`}
        >
          {justAdded ? (
            <>
              <IconCheck size={17} /> Added
            </>
          ) : !variant.availableForSale ? (
            'Sold out'
          ) : (
            <>Add to cart · {formatMoney(total)}</>
          )}
        </button>
      </div>
    </div>
  )
}
