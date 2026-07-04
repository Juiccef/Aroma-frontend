import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { shop } from '../../lib/shop'
import type { Product } from '../../lib/shop'
import { useStore } from '../../lib/store-context'
import { useBodyLock, useEscape } from '../../lib/hooks'
import { formatProductPrice } from '../../lib/format'
import { IconArrow, IconClose, IconSearch } from '../Icons'
import { ProductImage } from '../product/ProductImage'
import { arabicTitle } from '../../lib/shop'

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useStore()
  const [term, setTerm] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useBodyLock(searchOpen)
  useEscape(searchOpen, () => setSearchOpen(false))

  useEffect(() => {
    if (searchOpen) {
      setTerm('')
      setResults([])
      setTimeout(() => inputRef.current?.focus(), 60)
    }
  }, [searchOpen])

  useEffect(() => {
    if (!term.trim()) {
      setResults([])
      return
    }
    const id = setTimeout(() => {
      void shop.searchProducts(term, 6).then(setResults)
    }, 140)
    return () => clearTimeout(id)
  }, [term])

  if (!searchOpen) return null

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!term.trim()) return
    setSearchOpen(false)
    navigate(`/search?q=${encodeURIComponent(term.trim())}`)
  }

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Search">
      <button
        type="button"
        aria-label="Close search"
        onClick={() => setSearchOpen(false)}
        className="animate-fade-in absolute inset-0 bg-espresso/55 backdrop-blur-[2px]"
      />
      <div className="animate-fade-up relative mx-auto mt-0 max-w-2xl bg-paper p-5 shadow-lift sm:mt-20 sm:rounded-3xl sm:p-7">
        <form onSubmit={submit} className="flex items-center gap-3 border-b-2 border-espresso pb-3">
          <IconSearch size={20} className="shrink-0 text-bark" />
          <input
            ref={inputRef}
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search pistachios, zaatar, karak…"
            aria-label="Search products"
            className="w-full bg-transparent font-display text-xl font-medium outline-none placeholder:text-mocha/60"
          />
          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            aria-label="Close search"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-bark transition-colors hover:bg-parchment"
          >
            <IconClose size={17} />
          </button>
        </form>

        {term.trim() && (
          <div className="mt-4">
            {results.length === 0 ? (
              <p className="px-1 py-6 text-center text-sm text-mocha">
                Nothing yet for “{term}”. Try “seeds”, “coffee” or “sumac”.
              </p>
            ) : (
              <ul className="divide-y divide-line/70">
                {results.map((p) => (
                  <li key={p.id}>
                    <Link
                      to={`/products/${p.handle}`}
                      onClick={() => setSearchOpen(false)}
                      className="@container flex items-center gap-4 rounded-xl px-2 py-2.5 transition-colors hover:bg-parchment/70"
                    >
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-line bg-white">
                        <ProductImage product={p} width={112} sizes="56px" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold">{p.title}</p>
                        {arabicTitle(p) && (
                          <p lang="ar" dir="rtl" className="truncate text-start text-sm text-mocha">
                            {arabicTitle(p)}
                          </p>
                        )}
                      </div>
                      <span className="text-sm font-bold text-bark">{formatProductPrice(p)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              onClick={submit}
              className="link-ink mt-3 inline-flex items-center gap-2 px-2 text-sm font-bold text-gold"
            >
              See all results <IconArrow size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
