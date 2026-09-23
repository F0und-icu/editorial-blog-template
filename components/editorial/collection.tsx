"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import type { Post } from "@/lib/content"
import { artwork } from "./post-card"
import { SearchIcon } from "@/components/site-header"

type Mode = "articles" | "notes" | "search"

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>
  const at = text.toLowerCase().indexOf(query.toLowerCase())
  if (at < 0) return <>{text}</>
  return <>{text.slice(0, at)}<mark>{text.slice(at, at + query.length)}</mark>{text.slice(at + query.length)}</>
}

export function Collection({ posts, mode }: { posts: Post[]; mode: Mode }) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("All")
  const categories = Array.from(new Set(posts.map(p => p.archive.category)))
  const options = mode === "search" ? ["All", "Articles", "Notes"] : ["All", ...categories]
  const param = mode === "search" ? "scope" : "topic"
  useEffect(() => {
    function read() {
      const params = new URLSearchParams(window.location.search)
      setQuery(params.get("q") || "")
      setFilter(params.get(param) || "All")
    }
    read()
    window.addEventListener("popstate", read)
    return () => window.removeEventListener("popstate", read)
  }, [param])
  function update(q: string, f: string) {
    setQuery(q); setFilter(f)
    const url = new URL(window.location.href)
    q ? url.searchParams.set("q", q) : url.searchParams.delete("q")
    f !== "All" ? url.searchParams.set(param, f) : url.searchParams.delete(param)
    window.history.replaceState(null, "", url.pathname + url.search + url.hash)
  }
  const q = query.trim()
  const filtered = posts.filter(post => {
    const scopeMatches = filter === "All" || (mode === "search" ? (filter === "Notes" ? post.type === "Journal" : post.type !== "Journal") : post.archive.category === filter)
    return scopeMatches && `${post.title} ${post.excerpt} ${post.tags.join(" ")} ${post.body}`.toLowerCase().includes(q.toLowerCase())
  })
  const results = mode === "search" && !q ? [] : filtered
  return <div className={mode === "search" ? "search-page" : "page-columns"}>
    <section>
      {mode !== "notes" && <div className="input-wrap"><SearchIcon /><input type="search" aria-label={mode === "search" ? "Search articles and notes" : "Filter articles"} placeholder="Search a title, topic, or keyword…" value={query} onChange={e => update(e.target.value, filter)} />{query && <button className="clear-search" aria-label="Clear search" onClick={() => update("", filter)}>×</button>}</div>}
      <div className="filters" role="group" aria-label={mode === "search" ? "Search scope" : "Filter by topic"}>{options.map(option => <button key={option} className="filter" aria-pressed={option === filter} onClick={() => update(query, option)}>{option}</button>)}</div>
      <p className="collection-count" role="status" aria-live="polite">{mode === "search" && !q ? "Search the archive" : `${results.length} ${mode === "notes" ? (results.length === 1 ? "note" : "notes") : (results.length === 1 ? "result" : "results")}`}</p>
      {results.map(post => mode === "notes" ? <article className="note-row" key={post.id} id={post.id}><time className="note-date" dateTime={post.date}>{new Date(post.date + "T00:00:00Z").toLocaleString("en", { month: "short", timeZone: "UTC" }).toUpperCase()}<b>{post.date.slice(-2)}</b><span>{post.date.slice(0, 4)}</span></time><div><div className="eyebrow">{post.archive.category}</div><h2><Link href={`/articles/${post.id}`}>{post.title}</Link></h2>{post.sections.flatMap(s => s.paragraphs).slice(0, 2).map((p, i) => <p key={i}>{p}</p>)}<Link className="text-link" href={`/articles/${post.id}`}>Read note ↗</Link><div className="tag-row">{post.tags.map(tag => <Link className="tag" key={tag} href={`/search?q=${encodeURIComponent(tag)}`}>#{tag}</Link>)}</div></div></article> : mode === "search" ? <article className="search-result" key={post.id}><span className="type-label">{post.type === "Journal" ? "NOTE" : "ARTICLE"}</span><Link href={`/articles/${post.id}`}><h2><Highlight text={post.title} query={q} /></h2></Link><p><Highlight text={searchExcerpt(post, q)} query={q} /></p><span className="meta">{post.date} · {post.archive.category}</span></article> : <article className="article-row" key={post.id}><div><span className="eyebrow">{post.archive.category}</span><Link href={`/articles/${post.id}`}><h3 className="en"><Highlight text={post.title} query={q} /></h3></Link><p><Highlight text={post.excerpt} query={q} /></p><span className="meta">{post.date} · {post.readTime}</span></div><Link href={`/articles/${post.id}`} className="row-art" aria-label={`Read ${post.title}`} tabIndex={-1}><img src={artwork(post)} alt="" width="560" height="320" loading="lazy" /></Link></article>)}
      {(q || mode !== "search") && !results.length && <div className="empty"><h2>{posts.length === 0 ? "No notes yet." : "No matches yet."}</h2><p>{posts.length === 0 ? "No notes have been published yet. Explore the essay archive." : "No matching entries. Try a shorter keyword or clear the filters."}</p>{posts.length === 0 ? <Link className="text-link" href="/articles">Browse research ↗</Link> : <button className="text-link" onClick={() => update("", "All")}>Clear filters ↗</button>}</div>}
      {mode === "search" && <section className="search-help"><h2>{q ? "Try a different angle." : "Start with a question."}</h2><p>Search titles, full articles, financial terms, or tags.</p><div className="query-examples">{["duration", "cash flow", "diversification"].map(word => <button key={word} onClick={() => update(word, "All")}>{word}</button>)}</div></section>}
      {results.length > 0 && <p className="list-end">{mode === "notes" ? "End of the notebook" : "End of the collection"}</p>}
    </section>
    {mode !== "search" && <aside className="quiet-aside"><h2>{mode === "notes" ? "About these notes" : "By subject"}</h2>{mode === "notes" ? <><p>A notebook for small observations that do not need a full essay.</p><p>Read the source, test the assumptions, and leave room for unanswered questions.</p><Link className="text-link" href="/articles">Long-form articles ↗</Link></> : categories.map(category => <button className="topic-link" key={category} onClick={() => update(query, category)} aria-pressed={filter === category}><span>{category}</span><span>{posts.filter(p => p.archive.category === category).length}</span></button>)}<div className="note-inset"><div className="eyebrow">A small reminder</div><blockquote>Understand the assumptions.<br />Then consider the possibilities.</blockquote></div></aside>}
  </div>
}

function searchExcerpt(post: Post, query: string) {
  const text = post.body.replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/[#>*`|]/g, "").replace(/\s+/g, " ")
  const at = text.toLowerCase().indexOf(query.toLowerCase())
  if (at < 0) return post.excerpt
  const start = Math.max(0, at - 65)
  return `${start ? "…" : ""}${text.slice(start, start + 220)}${text.length > start + 220 ? "…" : ""}`
}
