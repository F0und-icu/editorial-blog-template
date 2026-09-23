import { assetPath } from "@/lib/asset-path"
import Link from "next/link"
import { getAllPosts } from "@/lib/content"
import { siteConfig } from "@/lib/site-config"
import { PostCard } from "@/components/editorial/post-card"

export default function HomePage() {
  const posts = getAllPosts()
  const selected = posts.filter(p => p.type !== "Journal").slice(0, 3)
  const recent = [...posts].sort((a, b) => Date.parse(b.date) - Date.parse(a.date)).slice(0, 3)
  const { hero, archive } = siteConfig
  return <>
    <section className="hero"><div className="hero-copy"><div className="eyebrow">{hero.eyebrow}</div><h1>{hero.headline.split("\n").map(line => <span key={line}>{line}<br /></span>)}<em>{hero.emphasis}</em></h1><p className="deck">{hero.deck}</p><Link className="text-link" href={hero.primaryCta.href}>{hero.primaryCta.label}<span aria-hidden="true">↗</span></Link></div><figure className="hero-figure"><img src={assetPath(hero.image.src)} alt={hero.image.alt} width="1448" height="1086" fetchPriority="high" /><figcaption>{hero.image.caption}</figcaption></figure></section>
    <section className="section" id="archive"><div className="section-heading"><h2>{archive.selectedTitle}</h2><Link className="text-link" href="/articles">All articles ↗</Link></div><div className="featured-grid">{selected.map(post => <PostCard key={post.id} post={post} />)}</div></section>
    <div className="lower-grid" id="journal"><section><div className="section-heading"><h2>{archive.latestTitle}</h2><Link className="text-link" href="/articles">All articles ↗</Link></div>{recent.map(post => <article className="writing-row" key={post.id}><span className="meta">{post.date} · {post.archive.category}</span><Link href={`/articles/${post.id}`}><h3>{post.title}</h3></Link><p>{post.excerpt}</p></article>)}</section><aside className="author-aside"><span className="eyebrow">Behind the notes</span><h3>Money moves.<br />Perspective matters.</h3><p>{siteConfig.about.summary[0]}</p><Link className="text-link" href="/about">About the journal ↗</Link><div className="note-inset"><span className="eyebrow">A working principle</span><blockquote>Understand the assumptions.<br />Then consider the possibilities.</blockquote></div></aside></div>
  </>
}
