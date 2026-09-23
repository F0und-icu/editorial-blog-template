import type { Metadata } from "next"
import { siteConfig } from "@/lib/site-config"
import { assetPath } from "@/lib/asset-path"
export const metadata: Metadata = { title: "About", description: siteConfig.about.deck }
export default function AboutPage() {
  const { about, hero, site } = siteConfig
  return <>
    <section className="about-hero"><div><span className="eyebrow">{about.eyebrow}</span><h1>{about.headline.split("\n").map((line,i) => <span key={line}>{i > 0 && <br />}{line}</span>)}</h1><p>{about.deck}</p></div><figure><img src={assetPath(hero.image.src)} alt={hero.image.alt} width="1448" height="1086" /></figure></section>
    <section className="about-section about-profile"><span className="eyebrow">The publication</span><div><h2 className="about-editorial-title">A journal, not a forecast.</h2>{about.summary.map(p => <p key={p}>{p}</p>)}</div></section>
    <section className="about-section"><span className="eyebrow">Focus</span><div>{about.focus.map(item => <div className="focus-row" key={item.title}><h3>{item.title}</h3><p>{item.description}</p></div>)}</div></section>
    <section className="about-section"><span className="eyebrow">Editorial practice</span><div className="method-grid">{about.principles.map(item => <div key={item.title}><h3>{item.title}</h3><p>{item.description}</p></div>)}</div></section>
    {(site.contactEmail || site.githubUrl) && <section className="contact-panel"><div><h2>Continue the conversation.</h2><p>Questions, corrections, and considered disagreements are welcome.</p>{site.contactEmail && <a className="text-link" href={`mailto:${site.contactEmail}`}>Email ↗</a>}{site.githubUrl && <a className="text-link" href={site.githubUrl}>GitHub ↗</a>}</div></section>}
  </>
}
