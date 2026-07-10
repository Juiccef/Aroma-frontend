import { site } from '../../content/site'

/**
 * Shared AROMA lockup for the header and footer: title set in the same
 * face as the brand's full logo lockup (Cinzel, standing in for the
 * hand-set Roman capitals in the source artwork), Arabic name held in
 * place beside it, and the tagline + leaf divider from the logo beneath.
 */
export function Wordmark({ size = 'header' }: { size?: 'header' | 'footer' }) {
  const big = size === 'footer'
  return (
    <div className="flex flex-col">
      <p className="flex items-baseline gap-2.5">
        <span
          className={`font-wordmark font-semibold tracking-[0.14em] ${big ? 'text-3xl' : 'text-[1.55rem]'}`}
        >
          AROMA
        </span>
        <span lang="ar" dir="rtl" className={`text-goldlight ${big ? 'text-xl' : 'hidden text-lg leading-none sm:block'}`}>
          {site.nameAr}
        </span>
      </p>
      <p className={`flex items-center gap-2 ${big ? 'mt-1.5' : 'mt-0.5'}`}>
        <span className="h-px flex-1 bg-goldlight/50" aria-hidden />
        <img
          src="/brand/leaf-divider.png"
          alt=""
          aria-hidden
          className={big ? 'h-2.5 w-auto' : 'h-2 w-auto'}
        />
        <span
          className={`font-display shrink-0 whitespace-nowrap italic text-goldlight ${big ? 'text-sm' : 'text-[0.7rem]'}`}
        >
          {site.tagline}
        </span>
        <span className="h-px flex-1 bg-goldlight/50" aria-hidden />
      </p>
    </div>
  )
}
