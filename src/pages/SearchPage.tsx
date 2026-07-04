import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { shop } from '../lib/shop'
import type { Product } from '../lib/shop'
import { Seo } from '../components/Seo'
import { ProductCard } from '../components/product/ProductCard'
import { IconSearch } from '../components/Icons'
import { StarMotif } from '../components/Motif'

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const [input, setInput] = useState(q)
  const [results, setResults] = useState<Product[] | null>(null)

  useEffect(() => {
    setInput(q)
    if (!q.trim()) {
      setResults([])
      return
    }
    let alive = true
    shop.searchProducts(q, 48).then((r) => alive && setResults(r))
    return () => {
      alive = false
    }
  }, [q])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchParams(input.trim() ? { q: input.trim() } : {})
  }

  return (
    <>
      <Seo title={q ? `“${q}” · Search · AROMA` : 'Search · AROMA'} />
      <section className="border-b border-line bg-parchment/60">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
          <h1 className="font-display display-tight text-4xl font-semibold">Search the shop</h1>
          <form onSubmit={submit} className="mt-5 flex max-w-xl items-center gap-3 border-b-2 border-espresso pb-3">
            <IconSearch size={20} className="shrink-0 text-bark" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pistachios, zaatar, karak…"
              aria-label="Search products"
              className="w-full bg-transparent font-display text-xl font-medium outline-none placeholder:text-mocha/60"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-espresso px-5 py-2 text-sm font-bold text-cream transition-colors hover:bg-cocoa"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        {q && results && (
          <p className="mb-6 text-sm text-mocha">
            {results.length} result{results.length === 1 ? '' : 's'} for “{q}”
          </p>
        )}
        {results && results.length > 0 ? (
          <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
            {results.map((p, i) => (
              <li key={p.id}>
                <ProductCard product={p} eager={i < 4} />
              </li>
            ))}
          </ul>
        ) : q ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <StarMotif size={36} className="text-gold" />
            <p className="font-display text-2xl font-semibold">No matches for “{q}”</p>
            <p className="max-w-sm text-sm text-mocha">
              Try a broader word like “seeds”, “chocolate” or “spice”, or browse the categories from the
              menu.
            </p>
          </div>
        ) : (
          <p className="py-20 text-center text-sm text-mocha">
            Type what you're craving and press search.
          </p>
        )}
      </div>
    </>
  )
}
