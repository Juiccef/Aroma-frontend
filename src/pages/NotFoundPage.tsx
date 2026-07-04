import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { Divider } from '../components/Motif'

export function NotFoundPage() {
  return (
    <>
      <Seo title="Page not found · AROMA" />
      <div className="mx-auto flex max-w-2xl flex-col items-center px-5 py-24 text-center sm:py-32">
        <p className="font-display display-tight text-[7rem] font-semibold leading-none text-gold sm:text-[9rem]">
          404
        </p>
        <p lang="ar" dir="rtl" className="mt-2 text-2xl text-mocha">
          الصفحة غير موجودة
        </p>
        <Divider className="my-8 w-40 text-gold" />
        <h1 className="font-display text-2xl font-semibold">This shelf is empty</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-bark">
          The page you're after may have moved or sold out. The good stuff is still where it always
          is.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="rounded-full bg-espresso px-7 py-3.5 text-sm font-bold text-cream transition-colors hover:bg-cocoa"
          >
            Back home
          </Link>
          <Link
            to="/collections/best-sellers"
            className="rounded-full border-2 border-espresso px-7 py-3.5 text-sm font-bold transition-colors hover:bg-espresso hover:text-cream"
          >
            Shop best sellers
          </Link>
        </div>
      </div>
    </>
  )
}
