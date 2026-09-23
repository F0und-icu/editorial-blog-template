import fs from "node:fs"
import path from "node:path"
import metadata from "@/content/article-meta.json"

export type PostMeta = {
  title: string
  subtitle: string
  excerpt: string
  date: string
  category: string
  tags: string[]
  type?: "Essay" | "Journal"
  featuredOrder?: number
  artwork?: string
}
export type Post = PostMeta & {
  id: string
  body: string
  readTime: string
  type: "Essay" | "Journal"
  archive: { category: string; tone: string }
  sections: { paragraphs: string[] }[]
}
const entries = metadata as Record<string, PostMeta>
const directory = path.join(process.cwd(), "content/articles")

export function getAllPosts(): Post[] {
  return fs.readdirSync(directory).filter(name => name.endsWith(".md")).map(name => {
    const id = name.slice(0, -3)
    const meta = entries[id]
    if (!meta) throw new Error(`Missing article metadata: ${id}`)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date) || Number.isNaN(Date.parse(meta.date))) throw new Error(`Invalid article date: ${id}`)
    const body = fs.readFileSync(path.join(directory, name), "utf8")
    const plain = body.replace(/```[\s\S]*?```/g, "").replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/[#>*`|]/g, "")
    const paragraphs = body.split(/\n\s*\n/).map(p => p.trim()).filter(p => p && !/^(#|!|>|\||```|- )/.test(p))
    return { ...meta, id, body, type: meta.type || "Essay", readTime: `${Math.max(1, Math.ceil(plain.split(/\s+/).filter(Boolean).length / 220))} min read`, archive: { category: meta.category, tone: meta.category }, sections: [{ paragraphs }] }
  }).sort((a, b) => (a.featuredOrder ?? Infinity) - (b.featuredOrder ?? Infinity) || Date.parse(b.date) - Date.parse(a.date) || a.id.localeCompare(b.id))
}
export function getPostById(id: string) { return getAllPosts().find(post => post.id === id) }
export function getRelatedPosts(id: string, limit = 2) {
  const posts = getAllPosts()
  const current = posts.find(post => post.id === id)
  if (!current) return []
  const score = (post: Post) => (post.category === current.category ? 2 : 0) + post.tags.filter(tag => current.tags.includes(tag)).length
  return posts.filter(post => post.id !== id).sort((a,b) => score(b) - score(a) || Date.parse(b.date) - Date.parse(a.date)).slice(0, limit)
}
