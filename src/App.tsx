import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { StoreProvider } from './lib/store-context'
import { Header } from './components/chrome/Header'
import { Footer } from './components/chrome/Footer'
import { MobileNav } from './components/chrome/MobileNav'
import { CartDrawer } from './components/chrome/CartDrawer'
import { SearchOverlay } from './components/chrome/SearchOverlay'
import { QuickView } from './components/product/QuickView'
import { HomePage } from './pages/HomePage'
import { CollectionPage } from './pages/CollectionPage'
import { ProductPage } from './pages/ProductPage'
import { SearchPage } from './pages/SearchPage'
import { AboutPage } from './pages/AboutPage'
import { GiftingPage } from './pages/GiftingPage'
import { ContactPage } from './pages/ContactPage'
import { FaqPage } from './pages/FaqPage'
import { ShippingPage } from './pages/ShippingPage'
import { NotFoundPage } from './pages/NotFoundPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <StoreProvider>
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-5 focus:py-2.5 focus:text-sm focus:font-bold focus:text-espresso"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Shopify-style URL structure so live routing maps 1:1 */}
          <Route path="/collections/:handle" element={<CollectionPage />} />
          <Route path="/products/:handle" element={<ProductPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/pages/about" element={<AboutPage />} />
          <Route path="/pages/gifting" element={<GiftingPage />} />
          <Route path="/pages/contact" element={<ContactPage />} />
          <Route path="/pages/faq" element={<FaqPage />} />
          <Route path="/pages/shipping" element={<ShippingPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <MobileNav />
      <CartDrawer />
      <SearchOverlay />
      <QuickView />
    </StoreProvider>
  )
}
