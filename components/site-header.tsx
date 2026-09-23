"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { siteConfig } from "@/lib/site-config"

export function SearchIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.7" /><path d="m16 16 4.5 4.5" /></svg>
}

export function SiteHeader() {
  const path = usePathname()
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLElement>(null)
  useEffect(() => { setOpen(false) }, [path])
  useEffect(() => {
    if (!open) return
    menu.current?.querySelector("a")?.focus()
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); menuButton.current?.focus() }
    }
    document.addEventListener("keydown", escape)
    return () => document.removeEventListener("keydown", escape)
  }, [open])
  const links = siteConfig.navigation.map(item => <Link key={item.href} href={item.href} aria-current={path === item.href || path.startsWith(item.href + "/") ? "page" : undefined} onClick={() => setOpen(false)}>{item.label}</Link>)
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header wrap">
      <Link className="brand" href="/" aria-label={`${siteConfig.site.name} home`}><span className="monogram" aria-hidden="true">{siteConfig.site.shortName.slice(0, 1)}</span><span className="brand-name">{siteConfig.site.name}</span></Link>
      <nav className="desktop-nav" aria-label="Main navigation">{links}</nav>
      <div className="header-actions"><Link className="icon-link" href="/search" aria-label="Search"><SearchIcon /></Link><button ref={menuButton} className="menu-button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}><span /><span /></button></div>
      <nav ref={menu} id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation" hidden={!open}>{links}</nav>
    </header>
  </>
}
