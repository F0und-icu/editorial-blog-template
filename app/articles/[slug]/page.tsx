import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getAllPosts, getPostById, getRelatedPosts } from "@/lib/content"
import { siteConfig } from "@/lib/site-config"
import { ArticleMarkdown } from "@/components/editorial/markdown"
import { ArticleToc } from "@/components/editorial/article-toc"
import { articleHeadings } from "@/lib/markdown"

type Props = { params: Promise<{ slug: string }> }
export function generateStaticParams() { return getAllPosts().map(post => ({ slug: post.id })) }
export const dynamicParams = false
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostById((await params).slug)
  return { title: post?.title || "Article not found", description: post?.subtitle }
}
export default async function ArticlePage({ params }: Props) {
  const post = getPostById((await params).slug)
  if (!post) notFound()
  const toc = articleHeadings(post.body)
  const related = getRelatedPosts(post.id, 2)
  return <>
    <header className="article-head"><div className="breadcrumb"><Link href="/articles">Essays / {post.archive.category}</Link><span className="pill">{post.type === "Journal" ? "FIELD NOTE" : "ESSAY"}</span></div><h1>{post.title}</h1><p className="deck">{post.subtitle}</p><div className="article-byline"><span>{siteConfig.site.name} &nbsp; / &nbsp; <time dateTime={post.date}>{post.date}</time></span><span>{post.readTime}</span></div></header>
    <div className="article-layout"><article className="prose"><ArticleToc items={toc} label={siteConfig.article.planLabel} mobile /><ArticleMarkdown body={post.body} /><div className="article-tags">{post.tags.map(tag => <Link className="tag" key={tag} href={`/search?q=${encodeURIComponent(tag)}`}>#{tag}</Link>)}</div><nav className="reading-nav" aria-label="Article navigation"><Link href="/articles">← {siteConfig.article.backLabel}</Link><Link href="/notes">Continue with Notes ↗</Link></nav></article><aside className="toc-wrap"><ArticleToc items={toc} label={siteConfig.article.planLabel} /><div className="toc-meta">{post.archive.category}<br />{post.readTime}<br /><Link href="/articles">All articles ↗</Link></div></aside></div>
    {related.length > 0 && <section className="related-reading"><div className="section-heading"><h2>{siteConfig.article.relatedHeadline}</h2></div><div className="related-grid">{related.map(item => <Link href={`/articles/${item.id}`} key={item.id}><span className="meta">{item.archive.category}</span><h3>{item.title}</h3><span className="meta">{item.readTime} ↗</span></Link>)}</div></section>}
  </>
}
