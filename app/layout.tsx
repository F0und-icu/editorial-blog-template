import { assetPath } from "@/lib/asset-path"
import type { Metadata } from "next"
import { siteConfig } from "@/lib/site-config"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import "./globals.css"

export const metadata: Metadata = {
  title: { default: siteConfig.site.title, template: `%s — ${siteConfig.site.name}` },
  description: siteConfig.site.description,
  icons: { icon: assetPath("/icon.svg") },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth"><body><SiteHeader /><main id="main" className="wrap" tabIndex={-1}>{children}</main><SiteFooter /></body></html>
}
