import type { Metadata } from "next"
import { getAllPosts } from "@/lib/content"
import { siteConfig } from "@/lib/site-config"
import { Collection } from "@/components/editorial/collection"
export const metadata: Metadata = { title: "Notes", description: siteConfig.journal.description }
export default function NotesPage() {
  const { journal } = siteConfig
  return <><header className="page-intro"><div className="eyebrow">{journal.eyebrow}</div><h1>{journal.headline}</h1><p className="deck">{journal.description}</p></header><Collection posts={getAllPosts().filter(p => p.type === "Journal")} mode="notes" /></>
}
