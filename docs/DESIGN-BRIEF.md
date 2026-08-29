# DESIGN BRIEF — Potts Deck and Patio
**v1.1 · 2026-08-29 · canonical copy: `[repo] potts_digital/docs/DESIGN-BRIEF.md` · working copies in Drive carry date+version in the filename**

This brief is written to stand alone: a Design agent with no chat history should be able to start from this document plus the linked references. It is the contract between two seats:

- **Design seat** (you, if you're reading this as the designer): owns look, feel, brand, typography, layout patterns, and the *values* in the design library. Has **no repo write access** — deliverables go to Google Drive as dated, versioned documents (and/or Claude Design canvases), and the Code seat implements them.
- **Code seat** (Firehorse Foundry infrastructure session): owns the repo, deployment, the DAM pipeline, SEO/GEO plumbing, and the *implementation* of everything you design. Also owns this brief.

---

## 1 · The client and the job

**Potts Deck and Patio** builds custom decks, pergolas, covered patios, and screened porches for homeowners in the Central Texas corridor (Belton / Temple / Killeen / Salado — pending final confirmation). Owner is a friend of the Foundry's principal; the Foundry manages his entire digital presence under contract.

**The customer** is a Central Texas homeowner, very likely on a phone, who wants to (a) see proof this builder does beautiful work, (b) trust him enough to have him at their house, and (c) call or text him. Every design decision serves those three moments. The phone call is the conversion — there is no cart, no signup, no funnel beyond "get a free estimate."

**The product proof is photography.** The portfolio is the site's engine, and it gets refreshed continuously through a DAM pipeline (§5) — design for a gallery that grows and changes weekly, not a fixed set of images.

## 2 · What already exists

- **Live phase-1 site:** repo `github.com/flyingtigerstrat-coder/Potts_digital`, GitHub Pages from `main`. Pages: home, portfolio (filterable gallery + lightbox), FAQ, six service pages. Fully functional, deliberately plain.
- **Review mock:** a Claude Design canvas of the homepage (desktop + mobile) exists for markup sessions with the owner — ask the principal for the artifact link.
- **The current aesthetic is a declared placeholder.** Warm paper/cedar/pine palette, system-ui type, flat cards. It's clean and inoffensive — it is not yet a brand. That's the job (§6).
- **No logo exists.** The "brand" is currently a text wordmark ("Potts **Deck & Patio**" with the second half in soft gold).

## 3 · Roles, workflow, and the handoff loop

1. Design seat produces deliverables (§8) and saves them to **`[drive] Project Phoenix → Potts Digital → Potts Design`** with **date and version in every filename** (e.g. `DIRECTION-boards_v1_2026-09-02`). Drive has no git — the filename carries the history. Never edit a Drive doc in place; save a new dated version.
2. Code seat reads the deliverable, implements it in the repo, and publishes a preview for review.
3. Feedback rounds happen on the Claude Design canvas or in dated Drive docs; ratified decisions get folded back into this brief by the Code seat (this file is canonical; a new version is committed, and a dated snapshot mirrored to Drive).
4. **The client's eyes are final** on anything visual. The principal runs review sessions with the owner; assume every deliverable will be looked at on a phone first.

## 4 · The design library (the scale contract)

The site is intentionally **static, no-build HTML/CSS/JS**. The design library therefore lives as:

- **`assets/css/tokens.css`** — the single interface between the seats. Every color, both font stacks, radius, shadow, and the layout width are CSS custom properties with documented roles. **Design seat owns the values; Code seat owns the plumbing.** A palette or type change is a token change — nothing else moves. Current tokens (v1.0):
  - Color: `--ink #24211c`, `--ink-soft #5c564c`, `--paper #faf7f2`, `--paper-deep #f0e9df`, `--cedar #a45a2a` (primary accent), `--cedar-deep #7c3f1d`, `--pine #3e4a3a`, `--pine-deep #2c352a`, `--line #ddd3c4`, `--gold-soft #e9b877`, `--gold-muted #f0d6ad`, `--sky #e8f0ee` (reserved, unused)
  - Type: `--font-display`, `--font-body` (both system-ui today — placeholder, see §6)
  - Shape/layout: `--radius 10px`, `--shadow`, `--max 1100px`
- **A component inventory** the library must cover (all exist in v1 form): header/nav, hero, section + kicker pattern, service card, gallery card (photo + service tag chip + caption), filter pill, lightbox, button (primary/ghost), FAQ accordion, page-head, footer, draft-notice callout.
- **Rules:** no raw hex where a token exists; every interactive element has a visible focus state and a hover state; nothing animates when `prefers-reduced-motion` is set; components are specified with their states (default/hover/focus/active/disabled where relevant), not just their happy face.

**Specify in tokens and components, and the implementation scales with you.** New pages, seasonal refreshes, and future Foundry client sites reuse this same structure.

## 5 · DAM integration — design for freshness

The owner uploads job photos to a Drive intake folder; a pipeline processes them (EXIF/GPS stripped for customer privacy, resized, renamed) and appends entries to **`content/photos.json`** in the repo. The gallery renders entirely from that file. Consequences for design:

- **The gallery is data, not layout.** Design the *card and grid system*, not a fixed arrangement. It must look right with 8 photos or 80, and with lopsided category counts (today: 5 custom-deck photos, 1 pergola).
- Each photo carries: `src`, `alt`, `caption`, `service` (one of six categories), `area`, `date`. Anything else the design needs (e.g. `featured`, `beforeOf` pairing) is a schema-change request to the Code seat — cheap, just ask.
- **Current crop is 3:4 portrait** (phone photos). If the design wants a different ratio system (mixed ratios, masonry, hero-crops), spec it — the pipeline regenerates variants; but every ratio must work with `object-fit: cover` on arbitrary job-site phone photography, uncropped by humans.
- Freshness surfaces to design: "Recent projects" ordering by `date` exists; consider whether recency deserves visible treatment (a "new" state, a rotating hero). Photos arrive in batches after jobs finish — sometimes weeks apart.
- **Today's images are low-res screenshots (~491px) — placeholders.** Design against the assumption of decent phone originals (1600px+). Do not design anything requiring professional photography, drone shots, or consistent lighting; input is whatever the owner shoots.

## 6 · What we need designed (scope, in priority order)

1. **Brand direction** — 2–4 genuinely different direction boards (not five shades of one idea). Must feel like a real Central Texas trade business a homeowner trusts with their backyard: craftsmanship, not corporate; warm, not rustic-kitsch. The current cedar/pine palette is a starting point to keep, evolve, or overthrow — argue your call.
2. **A mark/logo** for Potts Deck and Patio, working at favicon size and on a business card.
3. **Typography** — a real display/body pairing (Google Fonts only, ≤2 families + fallback stacks; see §7 constraints). Not Inter/Roboto/Arial.
4. **Homepage** applying the direction (desktop + mobile).
5. **Component sheet** — the §4 inventory in the new direction, with states.
6. **Portfolio/gallery treatment** — the card/grid/lightbox system under §5's data constraints.
7. Later, on request: testimonial/review pattern (GBP reviews will feed it), before/after pairing pattern (deck building's best sales asset), seasonal campaign treatments.

**Ask before adding scope** (new sections, new pages, new content types) — propose, don't unilaterally design them in.

## 7 · Technical constraints (non-negotiable, from the Code seat)

These are GEO/SEO and performance requirements the design must live within. GEO = Generative Engine Optimization (being quotable by AI answer engines) + geographic local SEO; both reward the same thing: fast, semantic, machine-legible pages.

1. **Semantic HTML skeleton is sacred.** One `h1` per page; heading levels in order; real `<nav>`, `<main>`, `<footer>`; content readable without JS. Design compositions must map to this (no heading-as-decoration that breaks the outline).
2. **Page granularity is an SEO decision already made:** one page per service, one per service city (planned), FAQ as question/answer pairs. Design the templates; don't consolidate pages for aesthetic economy.
3. **Performance budget:** no CSS/JS frameworks, no web-font flash — `font-display: swap` with metric-compatible fallbacks; ≤2 font families; hero image is the LCP element, keep it a plain `<img>`/CSS background (no carousel, no video hero); total JS stays under ~30KB. Core Web Vitals green is a feature the client is paying for.
4. **No layout shift:** every image slot declares its aspect ratio; nothing pops in and pushes content.
5. **Accessibility floor:** WCAG AA contrast (4.5:1 body text), 44px touch targets, visible focus, reduced-motion honored. The audience skews older-homeowner; err legible.
6. **Alt text and captions are SEO surface** — the design must keep captions visible or available, not decoration to be cropped.
7. **Phone-first conversion:** the call/text action is reachable within one thumb-move on mobile at all scroll positions (sticky or repeated CTA — design's call which).
8. Schema.org markup (LocalBusiness, Service, FAQPage) is invisible plumbing the Code seat maintains — but visible NAP (name/phone) must match the Google Business Profile exactly wherever the design displays it.

## 8 · Deliverable formats

Any of, saved to the Drive folder (dated + versioned) — pick what fits the deliverable:
- **Claude Design canvases** (preferred for anything visual — the principal can mark them up with the client directly)
- Dated Drive docs for rationale, copy decks, and specs
- Token specs as a simple list (`--cedar: #B4622D` …) — the Code seat translates to `tokens.css`

Always include: what changed vs. the previous version, and the reasoning — the client relationship runs on being able to explain *why*.

## 9 · Voice (ratified 2026-08-29)

**Plain, specific, confident, a little warm — a Texas tradesman you'd trust at your house.** Established examples from the live site: "Keep the breeze, lose the mosquitoes." · "A straight answer on cost." · "Days, not months." Sentences say something checkable and distinct; no interchangeable marketing filler. This is also a GEO decision: answer engines quote specific claims, not "stunning oasis" copy.

**Anti-reference:** the client's original GBP description ("Transform your backyard into a stunning oasis… leading experts in custom outdoor living solutions… meticulous attention to detail and exceptional customer service") is the register to avoid. But it carries three facts the design and copy should absorb: (1) he **designs and** builds — design consultation is part of the offer; (2) the process is **collaborative** ("works closely with you"); (3) the range runs **cozy to grand** — useful portfolio framing. Confirm with the owner whether that description was his own wording; if it was, weigh his preference before pushing the plainer voice into client-facing surfaces.

## 10 · Facts still pending from the client (design around them)

Domain name (owned, not yet supplied) · phone/email · Google Business Profile link · confirmed city list · owner's preferred service names · years in business / license / warranty info · testimonials. Use visibly bracketed placeholders (`[PHONE NUMBER]`) — never invent a plausible-looking fact.

---
*Maintained by the Code seat. Propose amendments via a dated Drive doc; ratified changes become v1.x here.*
