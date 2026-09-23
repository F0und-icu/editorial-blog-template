import { assetPath } from "@/lib/asset-path"
import Link from "next/link"
import type { Post } from "@/lib/content"

export function artwork(post: Pick<Post, "artwork">) {
  return assetPath(post.artwork || "/images/editorial/rates.svg")
}

export function PostCard({ post }: { post: Post }) {
  return <article className="feature-card"><Link href={`/articles/${post.id}`}><div className="card-art"><img src={artwork(post)} width="560" height="320" alt="" loading="lazy" /></div><div className="eyebrow">{post.archive.category}</div><h3 className="en">{post.title}</h3></Link><p>{post.excerpt}</p><span className="meta">{post.date} · {post.readTime}</span></article>
}
