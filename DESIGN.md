# NewsEngine Zee News-inspired design system

## Source and evidence

Reference URL: https://zeenews.india.com/

Live page extraction was completed through the available web fetch route on 2026-10-08 after the local Firecrawl CLI and npx fallback were blocked by desktop `EACCES` network permissions. The reference page exposed Entertainment-led editorial sections, headline-first story links, a strong current-affairs content hierarchy, and category-oriented navigation. Zee Media’s own identity article was also read at https://zeenews.india.com/india/zee-media-embraces-new-brand-identity-with-purpose-driven-z-transformation-2903019.html.

The brand article describes the new Z identity as bold, modern, emotionally intelligent, dynamic, digital-ready, and rooted in clarity, consistency, trust, multilingual reach, and citizen-centric journalism. The implementation below uses those principles as inspiration and does not copy Zee News logos, artwork, or page copy.

## Design summary

NewsEngine should feel like a digital-first live newsroom rather than a SaaS landing page. The visual hierarchy begins with the current signal, then category navigation, then the lead story and supporting headlines. Product capabilities remain present but are expressed as newsroom workflow and distribution utilities.

## Tokens

| Role | Value | Confidence |
|---|---|---|
| Primary broadcast red | `#d9232e` | Inferred from the visible Zee identity and current brand references |
| Deep red | `#a91522` | NewsEngine implementation token |
| Editorial blue | `#164e8b` | Inferred from reported 2025 red-blue-white Zee refresh |
| Paper background | `#f7f4ef` | NewsEngine adaptation |
| White content surface | `#fffdf9` | NewsEngine adaptation |
| Ink | `#202124` | NewsEngine adaptation |
| Muted text | `#687078` | NewsEngine adaptation |
| Rule line | `#dedbd4` | NewsEngine adaptation |

Typography uses a high-contrast editorial serif for headlines and compact sans-serif utility text. Headline scale should be assertive and condensed by line-height. Navigation and metadata remain small, uppercase, and letter-spaced.

## Layout patterns

The shell uses a red identity bar, a compact utility header, a channel/category rail, and a breaking-news strip. The homepage uses a broad masthead, a lead story panel, supporting headlines, and a dense category filter. Sections are separated with rules instead of large rounded containers. Cards use square or near-square edges, thin rules, clear shadows, and restrained animation.

## Motion

Motion is purposeful and broadcast-like: short entrance reveals, live pulse indicators, ticker movement, loading skeletons, and state transitions. Avoid decorative hover-heavy motion, liquid glass, neon, or rainbow effects. Respect `prefers-reduced-motion`.

## Implementation rules

Use the NewsEngine brand mark rather than the Zee logo. Use Zee-inspired red broadcast framing and category density, but keep NewsEngine copy, routes, stories, and product identity original. Keep `/feed`, `/debate`, `/upload`, `/terms`, and `/privacy` reachable from the shared shell or homepage. Keep remote story imagery resilient with a local fallback.
