const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""
if (basePath && (!basePath.startsWith("/") || basePath.endsWith("/"))) {
  throw new Error("NEXT_PUBLIC_BASE_PATH must be empty or a path such as /my-blog, without a trailing slash")
}
export default {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
}
