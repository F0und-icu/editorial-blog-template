import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"
import { toString } from "mdast-util-to-string"
import type { Root, RootContent } from "mdast"

export function cleanHeading(label: string) {
  return label.replace(/^0x[0-9a-f]+[.、:：]?\s+/i, "")
}

export function normalizeArticleHeadings() {
  return (tree: Root) => {
    // Only an opening H1 is the article title; later H1s are actual body sections.
    if (tree.children[0]?.type === "heading" && tree.children[0].depth === 1) tree.children.shift()
    function walk(nodes: RootContent[]) {
      for (const node of nodes) {
        if (node.type === "heading" && node.depth === 1) node.depth = 2
        if ("children" in node) walk(node.children as RootContent[])
      }
    }
    walk(tree.children)
  }
}

const parser = unified().use(remarkParse).use(remarkGfm)

export function articleHeadings(body: string) {
  const headings: { id: string; label: string }[] = []
  function walk(nodes: RootContent[]) {
    for (const node of nodes) {
      if (node.type === "heading" && node.depth === 2) headings.push({ id: `section-${headings.length + 1}`, label: cleanHeading(toString(node)) })
      if ("children" in node) walk(node.children as RootContent[])
    }
  }
  const tree = parser.parse(body)
  normalizeArticleHeadings()(tree)
  walk(tree.children)
  return headings
}
