"use client"

import { isValidElement, useRef, useState, type ReactNode } from "react"

export function CodeBlock({ children }: { children: ReactNode }) {
  const language = isValidElement<{ className?: string }>(children) ? children.props.className?.match(/language-(\S+)/)?.[1] : undefined
  const pre = useRef<HTMLPreElement>(null)
  const [status, setStatus] = useState("")
  async function copy() {
    try {
      await navigator.clipboard.writeText(pre.current?.textContent || "")
      setStatus("Copied")
    } catch { setStatus("Copy failed. Select the code to copy it.") }
  }
  return <div className="code-block"><div className="code-toolbar"><span>{language?.toUpperCase() || "CODE"}</span><span className="copy-status" role="status">{status}</span><button className="copy-button" aria-label="Copy code" onClick={copy}>{status === "Copied" ? "Copied ✓" : "Copy ⧉"}</button></div><pre ref={pre} tabIndex={0} aria-label="Code, scroll horizontally">{children}</pre></div>
}
