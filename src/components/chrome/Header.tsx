import { Link, NavLink } from 'react-router-dom'
import { navigation, site } from '../../content/site'
import { shop } from '../../lib/shop'
import type { Product } from '../../lib/shop'
import { useShopData } from '../../lib/hooks'
import { useStore } from '../../lib/store-context'
import { formatProductPrice } from '../../lib/format'
import { IconBag, IconMenu, IconSearch } from '../Icons'
import { ProductImage } from '../product/ProductImage'

const allFeaturedHandles = [...new Set(navigation.flatMap((n) => n.featured ?? []))]

export function Header() {
  const { cart, openCart, setNavOpen, setSearchOpen } = useStore()
  const { data: featured } = useShopData<Product[]>(
    () => shop.getProductsByHandles(allFeaturedHandles),
    [],
  )
  const featuredByHandle = new Map((featured ?? []).map((p) => [p.handle, p]))
  const count = cart?.totalQuantity ?? 0

  return (
    <header className="sticky top-0 z-50 bg-espresso text-paper shadow-[0_1px_0_rgba(251,247,235,0.12)]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex h-16 items-center gap-3 lg:h-[74px]">
          <button
            type="button"
            onClick={() => setNavOpen(true)}
            aria-label="Open menu"
            className="-ms-2 flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-cream/10 xl:hidden"
          >
            <IconMenu size={22} />
          </button>

          <Link to="/" className="flex items-baseline gap-2.5 outline-offset-4" aria-label="AROMA home">
            <span className="font-display text-[1.65rem] font-semibold tracking-[0.16em]">AROMA</span>
            <span lang="ar" dir="rtl" className="hidden text-lg leading-none text-goldlight sm:block">
              {site.nameAr}
            </span>
          </Link>

          <nav aria-label="Main" className="ms-6 hidden flex-1 xl:block">
            <ul className="flex items-center gap-0.5">
              {navigation.map((item) => (
                <li key={item.label} className="group">
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `relative block px-3 py-5 text-[0.82rem] font-bold tracking-wide transition-colors ${
                        item.accent === 'gold'
                          ? 'text-goldlight'
                          : item.accent === 'terracotta'
                            ? 'text-[#e08a5e]'
                            : 'text-paper/85 hover:text-paper'
                      } ${isActive ? 'text-paper' : ''}`
                    }
                  >
                    {item.label}
                    <span className="absolute inset-x-3 bottom-3.5 h-0.5 origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100" />
                  </NavLink>

                  {item.columns && (
                    <div className="pointer-events-none invisible absolute inset-x-0 top-full translate-y-1 opacity-0 transition-all duration-200 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      <div className="border-t-2 border-gold bg-paper text-espresso shadow-lift">
                        <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr] gap-12 px-8 py-8">
                          <div className="flex gap-12">
                            {item.columns.map((col) => (
                              <div key={col.title} className="min-w-40">
                                <p className="eyebrow mb-3 text-gold">{col.title}</p>
                                <ul className="space-y-2">
                                  {col.links.map((link) => (
                                    <li key={link.to + link.label}>
                                      <Link
                                        to={link.to}
                                        className="link-ink text-[0.9rem] font-medium text-bark hover:text-espresso"
                                      >
                                        {link.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                            <div className="hidden min-w-36 flex-col justify-between border-s border-line ps-10 2xl:flex">
                              <p lang="ar" dir="rtl" className="text-3xl leading-relaxed text-mocha">
                                {item.labelAr}
                              </p>
                              <Link to={item.to} className="link-ink text-sm font-bold text-gold">
                                Shop all →
                              </Link>
                            </div>
                          </div>
                          {item.featured && (
                            <div className="flex justify-end gap-4">
                              {item.featured.map((handle) => {
                                const p = featuredByHandle.get(handle)
                                if (!p) return null
                                return (
                                  <Link
                                    key={handle}
                                    to={`/products/${p.handle}`}
                                    className="hover-lift @container w-44 overflow-hidden rounded-xl border border-line bg-cream"
                                  >
                                    <div className="aspect-square overflow-hidden bg-white">
                                      <ProductImage product={p} width={360} sizes="176px" />
                                    </div>
                                    <div className="p-3">
                                      <p className="truncate text-xs font-bold">{p.title}</p>
                                      <p className="mt-0.5 text-xs text-mocha">{formatProductPrice(p)}</p>
                                    </div>
                                  </Link>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="ms-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
              className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-cream/10"
            >
              <IconSearch size={20} />
            </button>
            <button
              type="button"
              onClick={openCart}
              aria-label={`Open cart, ${count} item${count === 1 ? '' : 's'}`}
              className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-cream/10"
            >
              <IconBag size={20} />
              {count > 0 && (
                <span className="absolute -end-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[0.65rem] font-bold text-espresso">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
