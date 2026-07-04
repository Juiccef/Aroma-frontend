import { useEffect, useState } from 'react'
import { site } from '../../content/site'
import { StarMotif } from '../Motif'

export function AnnouncementBar() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % site.announcements.length), 4500)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="bg-gold text-espresso">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-center gap-6 px-5 sm:justify-between sm:px-8">
        <span className="hidden items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.18em] sm:flex">
          <StarMotif size={12} /> {site.tagline}
        </span>
        <p aria-live="polite" className="text-center text-xs font-bold tracking-wide">
          {site.announcements[index]}
        </p>
        <span className="hidden text-[0.68rem] font-bold uppercase tracking-[0.18em] sm:block">
          USD $ · {site.city}, {site.region}
        </span>
      </div>
    </div>
  )
}
