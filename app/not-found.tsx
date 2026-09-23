import Link from "next/link"
export default function NotFound() {
  return <section className="empty"><span className="eyebrow">404 / Page not found</span><h1 className="not-found-title">This page is out of frame.</h1><p>This link may have changed. Return to the archive to keep reading.</p><Link className="text-link" href="/articles">Back to archive ↗</Link></section>
}
