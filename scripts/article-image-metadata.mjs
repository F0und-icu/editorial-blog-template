import fs from "node:fs/promises"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const content = new URL("../content/articles/", import.meta.url)
const dimensions = {}
for (const file of await fs.readdir(content)) {
  if (!file.endsWith(".md")) continue
  const body = await fs.readFile(new URL(file, content), "utf8")
  for (const match of body.matchAll(/!\[[^\]]*\]\((\/[^\s)]+)\)/g)) {
    const src = match[1]
    if (src.startsWith("//")) continue
    const asset = new URL(`../public${src}`, import.meta.url)
    const { width, height } = await sharp(fileURLToPath(asset)).metadata()
    if (width && height) dimensions[src] = { width, height }
  }
}
await fs.writeFile(new URL("../content/image-dimensions.json", import.meta.url), JSON.stringify(dimensions, null, 2) + "\n")
console.log(`Recorded dimensions for ${Object.keys(dimensions).length} article images.`)
