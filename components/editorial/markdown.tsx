import { assetPath } from "@/lib/asset-path"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import type { Root, Element } from "hast"
import { CodeBlock } from "./code-block"
import { cleanHeading, normalizeArticleHeadings } from "@/lib/markdown"
import figureData from "@/content/figure-meta.json"
import imageDimensions from "@/content/image-dimensions.json"

const figures = figureData as Record<string, { caption: string; original: string }>
const dimensions = imageDimensions as Record<string, { width: number; height: number }>

// Assign the same sequential anchors as the content index, without visible numbers.
function headingAnchors() {
  return (tree: Root) => {
    let index = 0
    function walk(node: Root | Element) {
      if (node.type === "element" && node.tagName === "h2") node.properties.id = `section-${++index}`
      if (node.type === "element" && /^h[2-6]$/.test(node.tagName)) {
        const first = node.children[0]
        if (first?.type === "text") first.value = cleanHeading(first.value)
      }
      for (const child of node.children) if (child.type === "element") walk(child)
    }
    walk(tree)
  }
}

export function ArticleMarkdown({ body }: { body: string }) {
  return <Markdown remarkPlugins={[remarkGfm, normalizeArticleHeadings]} rehypePlugins={[headingAnchors, [rehypeHighlight, { detect: false }]]} components={{
    pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
    table: ({ children }) => <div className="table-wrap" tabIndex={0} role="region" aria-label="Table, scroll horizontally"><table>{children}</table></div>,
    p: ({ children, node }) => node?.children.some(child => child.type === "element" && child.tagName === "img") ? <div className="article-image-row">{children}</div> : <p>{children}</p>,
    img: ({ src, alt }) => {
      const figure = typeof src === "string" ? figures[src] : undefined
      const size = typeof src === "string" ? dimensions[src] : undefined
      return <figure className="article-figure"><img src={typeof src === "string" ? assetPath(src) : src} width={size?.width} height={size?.height} style={size ? { width: size.width, aspectRatio: `${size.width} / ${size.height}` } : undefined} alt={figure?.caption || alt || ""} loading="lazy" />{(figure || alt) && <figcaption className="caption">{figure?.caption || alt}{figure && <> · <a href={assetPath(figure.original)} target="_blank" rel="noopener noreferrer">View original ↗</a></>}</figcaption>}</figure>
    },
    a: ({ href, children }) => <a href={href} rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}>{children}</a>,
  }}>{body}</Markdown>
}
