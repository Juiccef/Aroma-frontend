/** Eight-point star (khatam), the brand's ornamental mark */
export function StarMotif({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      aria-hidden
      className={className}
    >
      <rect x="6" y="6" width="12" height="12" />
      <rect x="6" y="6" width="12" height="12" transform="rotate(45 12 12)" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** Ornamental section divider: line · star · line */
export function Divider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`} aria-hidden>
      <span className="h-px flex-1 bg-current opacity-30" />
      <StarMotif size={16} />
      <span className="h-px flex-1 bg-current opacity-30" />
    </div>
  )
}

/** Section heading with bilingual accent */
export function SectionHeading({
  eyebrow,
  title,
  titleAr,
  className = '',
  align = 'start',
}: {
  eyebrow?: string
  title: string
  titleAr?: string
  className?: string
  align?: 'start' | 'center'
}) {
  return (
    <div className={`${align === 'center' ? 'text-center' : 'text-start'} ${className}`}>
      {eyebrow && <p className="eyebrow mb-2 text-gold">{eyebrow}</p>}
      <div
        className={`flex flex-wrap items-baseline gap-x-4 gap-y-1 ${
          align === 'center' ? 'justify-center' : ''
        }`}
      >
        <h2 className="font-display display-tight text-3xl font-semibold sm:text-4xl">{title}</h2>
        {titleAr && (
          <span lang="ar" dir="rtl" className="text-xl text-mocha sm:text-2xl">
            {titleAr}
          </span>
        )}
      </div>
    </div>
  )
}
