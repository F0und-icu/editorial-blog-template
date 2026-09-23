import type { Metadata } from "next"
import { Collection } from "@/components/editorial/collection"
import { getAllPosts } from "@/lib/content"
export const metadata: Metadata = { title: "Search", description: "Search across articles, field notes, and research topics." }
export default function SearchPage() {
  return <><header className="page-intro search-page"><div className="eyebrow">The index</div><h1>Find a thread.</h1><p className="deck">Search across articles, field notes, and research topics.</p></header><Collection posts={getAllPosts()} mode="search" /></>
}
