// Next Link handles basePath; ordinary image URLs need the same prefix explicitly.
export function assetPath(src: string) {
  return src.startsWith("/") && !src.startsWith("//") ? `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${src}` : src
}
