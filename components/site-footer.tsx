import Link from "next/link"
import { siteConfig } from "@/lib/site-config"

export function SiteFooter() {
  return <footer className="site-footer wrap"><Link className="footer-brand" href="/">{siteConfig.site.mark}<span>{siteConfig.site.name}</span></Link><p className="footer-motto">{siteConfig.footer.motto}</p><span>© {siteConfig.site.year}</span></footer>
}
