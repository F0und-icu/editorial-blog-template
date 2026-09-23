import fs from "node:fs/promises"
const root = new URL("../out/", import.meta.url)
const metadata = JSON.parse(await fs.readFile(new URL("../content/article-meta.json", import.meta.url), "utf8"))
const pages = ["index.html", "about/index.html", "articles/index.html", "notes/index.html", "search/index.html", "404.html", ...Object.keys(metadata).map(id => `articles/${id}/index.html`)]
const prefix = process.env.NEXT_PUBLIC_BASE_PATH || ""
for (const file of pages) {
  const html = await fs.readFile(new URL(file, root), "utf8")
  for (const match of html.matchAll(/<img\b[^>]*\bsrc="(\/[^"]+)"/g)) {
    const src = decodeURIComponent(match[1].split(/[?#]/)[0])
    if (src.startsWith("//")) continue
    if (prefix && !src.startsWith(prefix + "/")) throw new Error(`Missing base path: ${src}`)
    const asset = src.slice(prefix.length + 1)
    if (asset.split("/").includes("..")) throw new Error(`Invalid path: ${asset}`)
    await fs.access(new URL(asset, root))
  }
}
console.log(`Verified ${pages.length} static routes and local images.`)
