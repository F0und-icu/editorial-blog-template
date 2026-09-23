import type { Metadata } from "next"
import { getAllPosts } from "@/lib/content"
import { siteConfig } from "@/lib/site-config"
import { Collection } from "@/components/editorial/collection"
export const metadata: Metadata = { title: "Articles", description: siteConfig.archive.description }
export default function ArticlesPage() {
  const { archive } = siteConfig
  return <><header className="page-intro"><div className="eyebrow">{archive.eyebrow}</div><h1>{archive.headline}</h1><p className="deck">{archive.description}</p></header><Collection posts={getAllPosts().filter(p => p.type !== "Journal")} mode="articles" /></>
}
