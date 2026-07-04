import { useEffect } from 'react'

/**
 * Document head manager for the SPA prototype. In Hydrogen this becomes
 * Remix meta exports; in a Liquid theme it's handled by theme.liquid.
 */
export function Seo({
  title,
  description,
  jsonLd,
}: {
  title: string
  description?: string
  jsonLd?: object | object[]
}) {
  const jsonLdString = jsonLd ? JSON.stringify(jsonLd) : null

  useEffect(() => {
    document.title = title
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description)
      document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
    }
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)

    let script: HTMLScriptElement | null = null
    if (jsonLdString) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.text = jsonLdString
      document.head.appendChild(script)
    }
    return () => script?.remove()
  }, [title, description, jsonLdString])

  return null
}
