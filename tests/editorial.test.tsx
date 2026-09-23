import assert from "node:assert/strict"
import test from "node:test"
import fs from "node:fs"
import { renderToStaticMarkup } from "react-dom/server"
import { ArticleMarkdown } from "../components/editorial/markdown"
import { articleHeadings } from "../lib/markdown"
import { getAllPosts, getRelatedPosts } from "../lib/content"
import { assetPath } from "../lib/asset-path"
import metadata from "../content/article-meta.json"

const fixture = '# Title\n\nIntro.\n\n## Repeated\n\n```python\nprint(1 < 2)\n```\n\n## Repeated\n\n# Later section\n\n| A | B |\n|---|---|\n| 1 | 2 |\n\n<script>alert(1)</script>\n\n[Unsafe](javascript:alert%281%29)'
test("Markdown anchors agree with the TOC, including duplicate and later H1 headings", () => {
  const html = renderToStaticMarkup(<ArticleMarkdown body={fixture} />)
  const headings = articleHeadings(fixture)
  assert.deepEqual(headings.map(h => h.label), ['Repeated','Repeated','Later section'])
  for (const h of headings) assert.ok(html.includes(`id="${h.id}"`))
  assert.ok(!html.includes('<h1'))
  assert.ok(html.includes('class="code-block"'))
  assert.ok(html.includes('class="table-wrap"'))
  assert.ok(!html.includes('<script>'))
  assert.ok(!html.includes('href="javascript:'))
})
test("All sample content renders, references local artwork, and has valid related posts", () => {
  const posts = getAllPosts()
  assert.equal(posts.length, Object.keys(metadata).length)
  assert.equal(new Set(posts.map(p => p.id)).size, posts.length)
  for (const post of posts) {
    const html = renderToStaticMarkup(<ArticleMarkdown body={post.body} />)
    for (const h of articleHeadings(post.body)) assert.ok(html.includes(`id="${h.id}"`))
    if (post.artwork) assert.ok(fs.existsSync(`public${post.artwork}`))
    assert.ok(getRelatedPosts(post.id).every(p=>p.id!==post.id))
    for (const match of post.body.matchAll(/!\[[^\]]*\]\((\/[^)]+)\)/g)) assert.ok(fs.existsSync(`public${match[1]}`))
  }
})
test("Asset URLs preserve remote URLs and support project-site prefixes", () => {
  const previous = process.env.NEXT_PUBLIC_BASE_PATH
  try {
    process.env.NEXT_PUBLIC_BASE_PATH='/example'
    assert.equal(assetPath('/images/chart.svg'),'/example/images/chart.svg')
    assert.equal(assetPath('https://example.org/chart.svg'),'https://example.org/chart.svg')
    assert.equal(assetPath('//example.org/chart.svg'),'//example.org/chart.svg')
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_BASE_PATH
    else process.env.NEXT_PUBLIC_BASE_PATH=previous
  }
})
