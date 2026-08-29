# Potts Deck and Patio — website

Static marketing site for **Potts Deck and Patio**, a Central Texas deck and patio builder. Managed by Firehorse Foundry (project docs: `[repo] firehorse-foundry/projects/potts-deck-and-patio/` — brief, architecture, and the content-refresh runbook).

**Stack:** plain HTML/CSS/JS, no build step. GitHub Pages from `main`.

## Layout

```
index.html            home: hero, services grid, portfolio preview, area, contact
portfolio.html        full gallery with service filters
faq.html              FAQ with FAQPage schema
services/*.html       one page per service (SEO/GEO page granularity)
content/photos.json   THE gallery data source — the DAM pipeline writes this
assets/photos/        processed images (WebP + JPEG, 1600/800 variants)
assets/css/site.css   design tokens (top of file) + styles
assets/js/site.js     contact fill-in + gallery renderer; CONFIG at top
llms.txt              plain-language site summary for AI crawlers
robots.txt, sitemap.xml, .nojekyll
```

## photos.json schema

```json
{ "photos": [ {
  "src": "assets/photos/<seo-name>",   // base path; -800/-1600 .webp/.jpg variants must exist
  "alt": "descriptive alt text",
  "caption": "short human caption",
  "service": "custom-decks | composite-decks | pergolas | covered-patios | screened-porches | outdoor-structures",
  "area": "central-texas",
  "date": "YYYY-MM-DD"
} ] }
```

Adding photos = adding entries here + files in `assets/photos/`. Never hand-edit gallery markup. The refresh procedure (Drive intake → EXIF strip → resize → this file) is the runbook in the foundry repo.

## Launch checklist (placeholders to replace)

- [ ] **Domain**: replace `PLACEHOLDER-DOMAIN.com` in `index.html`, `portfolio.html`, `faq.html`, `services/*.html`, `sitemap.xml`, `robots.txt`, `llms.txt`; add `CNAME` file with the bare domain; configure Pages custom domain + DNS.
- [ ] **Phone/email**: fill `CONFIG` at the top of `assets/js/site.js` AND `telephone` in the JSON-LD in `index.html`.
- [ ] **Google Business Profile URL**: replace `TODO-GOOGLE-BUSINESS-PROFILE-URL` in `index.html` JSON-LD (`sameAs`). NAP must match GBP exactly.
- [ ] **Service area**: Belton/Temple/Killeen/Salado is presumed — confirm with owner (index, faq, service pages, JSON-LD).
- [ ] **Copy review**: all service-page and FAQ copy is Foundry draft — owner confirms services offered and wording (especially anything implying scope, e.g. electrical rough-ins).
- [ ] **Photos**: current images are low-res bootstrap screenshots. Replace with originals via the DAM (`Potts DAM/00_INTAKE` in Drive) before launch. IMG_4569 was excluded (contains phone UI).
- [ ] Enable GitHub Pages: Settings → Pages → deploy from `main`, root.
