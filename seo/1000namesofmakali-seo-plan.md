# SEO plan — 1000namesofmakali.com

Audited 2026-11-06. Content is complete; the problem is that almost nothing on the site matches what people type, and there is very little page surface for search engines to rank.

## Diagnosis (evidence)

| Signal | Finding |
|---|---|
| Indexable URLs | **15 total** (home, /names/, /pdf/, /sources/, 11 range pages). Sitemap lists all 15. |
| Individual names | 1,072 names exist only as `id` anchors inside 11 range pages — **no per-name URLs** |
| Ranking footprint | Ranks only when the query contains the exact brand: `Adya Mahakali Sahasranama` → Brave #1, site #1; every other tested query → absent from both Brave and DeepSeek |
| Queries where absent | `1000 names of Ma Kali`(#4 Brave only), `Kali Sahasranama 1000 names`, `1000 names of Maa Kali in Hindi`, `Kali 1008 names list`, `Smasanakalika meaning`, `Shmashana Kalika meaning`, `Kali Sahasranama PDF download`, `1008 names of Kali`, `माता काली के 1000 नाम` |
| Transliteration | Site uses `SHHMASHHANA KALIKA`, `KRIISHHNA`, `SHHIVA`, `DANSHHTRA`; searchers type `Smasanakalika`, `Shmashana Kalika`, `Krishna`, `Shiva`. wisdomlib owns the `smasanakalika meaning` result |
| Language | `lang=en`, no `hreflang`, **0 Devanagari characters** on pages — while Hindi editions already exist (archive.org ebook) |
| Internal links | Homepage: 7 unique links. Each range page: 3 (home, hub, next range). No cross-links, no landing pages linked |
| Thin pages | /names/ 257 words, /sources/ 223, /pdf/ 140 — too thin to rank for their own topics |
| Technical | Good: canonical, meta robots, viewport, OG+Twitter, brotli, Cloudflare, strong JSON-LD (CollectionPage, ItemList, FAQPage, Person, WebSite+SearchAction). Missing: BreadcrumbList on most pages, Book schema on /pdf/, static HTML caching |
| Measurement | No evidence of Search Console / Bing Webmaster verification |

**Plain-English summary:** you built a library, but the doors are labelled with a private name only you use. Search engines have 15 ways in; searchers type ~1,000+ different strings.

## Priority checklist

### 0. Measurement first (30 minutes)
- [ ] Google Search Console → add property → verify via DNS (Cloudflare) → submit sitemap
- [ ] Bing Webmaster Tools → same (Bing feeds Copilot; cheap extra reach)
- [ ] After ~1 week, read **Performance → Queries** — this becomes your real keyword list

### 1. Claim the long tail (biggest win, highest effort)
- [ ] Generate **one page per name**: `/names/smasanakalika/`
  - Title: `Smasanakalika (SHHMASHHANA KALIKA) — Meaning in the 1000 Names of Maa Kali`
  - H1 with common spelling; body includes Devanagari, meaning, alternate spellings, name number, prev/next, link to its range page and hub
  - Schema: `Article`/`DefinedTerm` + `BreadcrumbList`
- [ ] Add an "Also spelled" block to every name with the 2–4 romanizations people actually type (Smasanakalika / Shmashana Kalika / Śmaśānakālikā)
- [ ] Regenerate the sitemap to include every URL (use a sitemap index once > 500)
- [ ] Keep the 11 range pages as hubs linking to their 100 names

#### Input data to prepare for step 1 (one row per name)
The page generator needs a single machine-readable file — CSV, JSON, or even a markdown table — with:

| Field | Required | Example | Notes |
|---|---|---|---|
| `number` | yes | `1` | 1–1072, the sahasranama position |
| `spelling_common` | yes | `Smasanakalika` | **The spelling people actually type.** This is the missing piece; the current site has `SHHMASHHANA KALIKA` only |
| `spelling_site` | yes | `SHHMASHHANA KALIKA` | Existing site transliteration, kept as "also spelled" |
| `devanagari` | strongly wanted | `स्मशानकालिका` | Needed for the Hindi pages and `hreflang` work |
| `meaning` | yes | `She who is the Remover of Darkness…` | Already on the site — can be extracted from the range pages if the local file lacks it |
| `meaning_hi` | wanted | `अंधकार को हटाने वाली` | May already exist in the Hindi ebook |
| `variants` | optional | `Shmashana Kalika; Śmaśānakālikā` | Extra romanizations to list in the "Also spelled" block |

If only some names have the simple spelling locally, supply those — the rest can be mapped later. The first task in the next session should be a **mapping table**: current site spelling → common spelling → Devanagari, plus a list of any numbers still missing data. Do that before generating pages; it is the one input that decides whether the 1,072 pages can match real queries.

### 2. Create pages for the head terms people actually type
Google autocomplete confirms these are live demand:
- [ ] `/108-names-of-kali/` — curate 108 from your data (`108 names of kali with meaning`, `108 names of kali in hindi/bengali/kannada`)
- [ ] `/1008-names-of-kali/` — explain 1,072 vs 1,008 vs 1,000 (FAQ: `माता काली के कितने नाम है`)
- [ ] `/kali-sahasranama-pdf/` — replace thin /pdf/ page; target `kali sahasranama pdf`, `... pdf english`, `... pdf sanskrit` (host the PDF on this domain so it can rank)
- [ ] `/kali-sahasranama-lyrics/` + `/kali-sahasranama-benefits/` — `lyrics`, `benefits`, `stotram`, `with meaning`
- [ ] `/hi/` Hindi section — `माता काली के 1008 नाम`, `काली सहस्रनाम`, `काली सहस्रनाम स्तोत्र pdf`; pair with `hreflang` en/hi
- [ ] Ignore off-intent suggestions (`baby girl names`, `kali mirch`, `kali dal`) — do not chase them

### 3. Internal linking (cheap, do this week)
- [ ] Homepage links to all 11 ranges + all landing pages with descriptive anchor text
- [ ] Every range page: prev/next **and** links to 108/1008/pdf/hindi
- [ ] Name pages: prev/next name, parent range, hub, "names nearby"
- [ ] Add `BreadcrumbList` schema on every page

### 4. Language and transliteration
- [ ] Display standard English spellings as primary; keep your transliteration as "also spelled"
- [ ] Add Devanagari + Hindi meaning to the same name data
- [ ] Ship the Hindi site with `hreflang` pairs

### 5. Trust and authority (E-E-A-T + backlinks)
- [ ] `/about/` author page (you already emit `Person` schema — link it), `/contact/`, `/privacy/`
- [ ] Expand `/sources/` into an editorial-method page naming the manuscripts/tradition used
- [ ] Link the site from: GitHub README, archive.org item description, Instagram bio, YouTube descriptions (if any), jaikhyapaparampara.com
- [ ] Genuine participation: Reddit r/hinduism, r/Shaktism, Quora answers, devotee forums — link only where the index genuinely answers the question
- [ ] Update archive.org item to state the companion site and PDF

### 6. Technical polish
- [ ] Cloudflare: Cache Everything on static HTML (currently `max-age=0, must-revalidate`)
- [ ] `Book` schema on the PDF page, `Article` on name pages
- [ ] Add a couple of real images with alt text (currently 0 images; OG image exists)
- [ ] Check mobile Core Web Vitals after adding pages

## Suggested homepage title/meta
- Title: `1000 Names of Maa Kali (Kali Sahasranama) with Meanings | Adya Mahakali`
- Meta: `Read all 1,072 names of Maa Kali with English meanings, Devanagari, and a free PDF — a searchable Kali Sahasranama index.`

## Keyword seeds (from Google autocomplete, 2026-11-06)
`1000 names of maa kali`, `1000 names of goddess kali`, `108 kali names`, `kali sahasranama pdf`, `kali sahasranama stotram`, `kali sahasranama benefits`, `kali sahasranama english`, `kali sahasranama with meaning pdf`, `1008 names of kali maa`, `1008 names of kali with meaning`, `108 names of kali with meaning`, `108 names of kali in hindi`, `maa kali names in sanskrit`, `kali 1008 names in hindi`, `माता काली के 108 नाम`, `माता काली के 1008 नाम`, `काली सहस्रनामावली`, `काली सहस्रनाम स्तोत्र pdf`
