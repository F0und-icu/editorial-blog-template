"use client"

import { useEffect, useState } from "react"
export type TocItem = { id: string; label: string }

export function ArticleToc({ items, mobile = false, label }: { items: TocItem[]; mobile?: boolean; label: string }) {
  const [active, setActive] = useState(items[0]?.id)
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible[0]) setActive(visible[0].target.id)
    }, { rootMargin: "-5% 0px -65% 0px", threshold: 0 })
    items.forEach(item => { const el = document.getElementById(item.id); if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [items])
  const links = items.map(item => <a key={item.id} className={item.id === active ? "active" : undefined} aria-current={item.id === active ? "location" : undefined} href={`#${item.id}`} onClick={e => { setActive(item.id); if (mobile) e.currentTarget.closest("details")?.removeAttribute("open") }}>{item.label}</a>)
  if (!items.length) return null
  return mobile ? <details className="mobile-toc"><summary>{label}</summary><nav aria-label="Table of contents">{links}</nav></details> : <nav className="toc" aria-label="Table of contents"><p className="toc-label">{label}</p>{links}</nav>
}
