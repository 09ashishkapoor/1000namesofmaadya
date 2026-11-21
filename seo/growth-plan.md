# Growth project — defend the brand, own the meaning layer

**Created:** 2026-11-21 · **Owner:** Ashish (Kaliputra) · **Repo:** `1000namesofmaadya` · **Site:** https://1000namesofmakali.com

This is the working plan for the next phase of SEO. It is written to be picked up cold — by a new
chat, a subagent, or a swarm — without the conversation that produced it.

---

## 1. The decision

**We are not competing for the bare head terms** (`kali sahasranama`, `1000 names of kali`). Those SERPs
are held by [drikpanchang](https://www.drikpanchang.com/deities-namavali/goddesses/parvati/mahavidya/kali/stotram/kali-sahasranama-stotram.html?lang=en),
[Sanskrit Documents](https://sanskritdocuments.org/doc_devii/kaalikaasahasra.html),
[stotranidhi](https://stotranidhi.com/en/sri-kalika-sahasranama-stotram-in-english/) and a
multi-million-subscriber YouTube channel — all publishing the public-domain stotram text with 10+ years
of authority. We cannot out-authority them, and a visitor who wants the chant text is not our reader.

**What we do instead:**

1. **Defend** the brand queries we already win (`adya kali sahasranama`, `adya kali sahasranamavali`).
2. **Own the meaning layer** — English meanings per name, which no competitor above offers.
3. **Unlock the crawl** — 933 pages Google knows about but has never fetched.

The bottleneck is **indexation**, not keyword choice. Every task below is judged on whether it helps
Google crawl, index, or click.

---

## 2. Baseline (Google Search Console, pulled 2026-11-21)

Property: `sc-domain:1000namesofmakali.com` · verified via DNS TXT · account `adyakaligeneral@gmail.com`.
Sitemap submitted 2026-11-07, last read 2026-11-18, status Success, 1,061 URLs discovered.

| Metric | 3 months | Last 28 days |
|---|---|---|
| Clicks | 275 | 138 |
| Impressions | 3.63K | 2.31K |
| CTR | 7.6% | 6.0% |
| Avg position | 9.6 | 10.2 |

**Top queries (3 months)**

| Query | Clicks | Impr. | CTR | Pos |
|---|---|---|---|---|
| adya kali sahasranama | 54 | 154 | 35.1% | 2.5 |
| adya kali sahasranamavali | 27 | 49 | 55.1% | 1.3 |
| kali sahasranama benefits | 5 | 57 | 8.8% | 5.8 |
| 1000 names of maa kali | 4 | 56 | 7.1% | 7.8 |
| maa kali 1008 names pdf | 3 | 38 | 7.9% | 9.2 |
| 1000 names of kali | 3 | 34 | 6.1% | ~6.5 |
| kali sahasranama with meaning | 3 | 15 | 20% | 8.1 |
| mahakali names | 1 | 45 | 2.2% | — |
| kali 1000 names | 1 | 40 | — | — |

**Top pages (3 months):** `/` 192 clicks / 1,005 impr (19.1%, pos 8.9) · `/names/` 55 / 1,306 (4.2%, 7.8) ·
`/kali-sahasranama-benefits/` 14 / 189 (7.4%, 4.9) · `/pdf/` 5 / 39 (now 301s) · `/names/kali/` 1 / 78 (1.3%, **27.6**)

**Geography:** India 199 clicks (72%) · US 21 (8%, pos 15.6) · UK 9 · Malaysia 9 · Canada 7 · Australia 4 · 103 countries.
**Devices:** mobile 83% (2,845 impr, pos 7.2) · desktop (749 impr, pos 18.9).

**Indexation:** 124 indexed · 944 not indexed — **933 "Discovered – currently not indexed"**, 7 "Crawled – currently not indexed",
2 redirect, 2 alternate-canonical. Google's last crawls: 13–16 Nov.
**Links:** 52 external total — `1008namesofmakali.com` 43, `reddit.com` 6, `jaikhyaparampara.com` 3.
**Internal structure:** home 24 unique links · hub 23 · range page ~123 (100 names + prev/next) · name page 15.

---

## 3. Definition of done (whole project)

- Indexed pages **124 → 300+** (GSC, 8 weeks after link work).
- 90-day clicks **275 → 500+** without losing the brand position.
- Brand queries stay at **position ≤3** for `adya kali sahasranama` and `adya kali sahasranamavali`.
- No regression: build passes, tests pass, no page (other than name pages) over 60-char title / 160-char description,
  sitemap `lastmod` never equals the deploy date, 404 page and favicons intact.

## 4. Non-goals

- ❌ Do not create `/kali-sahasranama/` (withdrawn — that is the head-term fight).
- ❌ Do not mass-generate new pages; 933 are already waiting to be crawled.
- ❌ Do not remove `kali sahasranama` from titles/descriptions; it costs nothing and feeds modifiers.
- ❌ Do not touch `design-demos/**` (unrelated WIP) or redesign anything.
- ❌ Do not change `og:locale` (must stay `en_US`), the favicon set, or the colophon page.
- ❌ Do not rewrite `public/pothi.css` unless a task explicitly requires it.

---

## 5. Tasks

Format: **ID — what — files — acceptance.** Effort is rough agent-time.

### Lane A — Brand moat (one agent; owns `src/pages/index.astro`, `src/pages/kali-sahasranama-lyrics/index.astro`)

- **A1 — Schema alternate names.**
  `src/pages/index.astro`
  Add to the existing `WebPage` and `WebSite` JSON-LD:
  `"alternateName": ["Adya Kali", "Adya Kali Sahasranama", "Adya Kali Sahasranamavali", "Maa Adya Mahakali Sahasranama"]`.
  *Acceptance:* JSON-LD parses; `alternateName` present in both blocks; visible page unchanged; build passes.
  *Why:* we rank #2.5 for "adya kali sahasranama" while the string "Adya Kali" appears **zero** times on the site — the rank is proximity, not match.

- **A2 — Visible "also known as" line.**
  `src/pages/index.astro`
  Add one sentence near the hero (not in the `<h1>`): "Also known as Adya Kali Sahasranama or the Kali Sahasranamavali."
  Keep the Devanagari/IAST H1 untouched.
  *Acceptance:* phrase appears once in body HTML; H1 unchanged; no layout shift at 375/1440 (screenshot).

- **A3 — Sahasranamavali coverage.**
  `src/pages/kali-sahasranama-lyrics/index.astro`
  Add one FAQ entry to the existing FAQ block + FAQPage schema: "Is the Kali Sahasranama the same as a Sahasranamavali?"
  (Answer: yes — *sahasranamavali* is the name-by-name recitation form of the same 1,072-name text.) Mention "sahasranamavali"
  once in body copy.
  *Acceptance:* FAQ appears visibly and in JSON-LD; description stays ≤160 chars.

- **A4 — Home FAQ for the brand.**
  `src/pages/index.astro`
  Add a 5th FAQ to the home `FAQPage`: "What is Adya Kali Sahasranama?" with a 2-sentence answer linking `/names/`.
  *Acceptance:* 5 questions in schema and visible FAQ; links resolve.

### Lane B — Mid-tail pages (parallel, one agent per file)

Each task: keep title ≤60 chars and description ≤160; keep existing canonical/schema; add real content, never filler.

- **B1 — Hub CTR fix (highest leverage).**
  `src/pages/names/index.astro`
  `/names/` gets **1,306 impressions at 4.2% CTR** — it is being seen and not clicked. Rewrite `<title>` and
  description to promise what is there (all 1,072 names in 11 ranges, English meanings, Devanagari, free).
  *Acceptance:* title ≤60; description ≤160; contains "1000 Names of Maa Kali" or "Adya Mahakali"; no duplicate title.

- **B2 — Benefits page depth.**
  `src/pages/kali-sahasranama-benefits/index.astro`
  Position 5.8 — closest to page 1. Add: a short "how the recitation is done" ordered list, a "what the tradition
  claims / what it does not" section, and internal links to lyrics + PDF + a range page. Do not invent medical claims.
  *Acceptance:* +300 words of genuine content; ≥3 internal links with descriptive anchors; FAQ schema still valid.

- **B3 — PDF page completeness.**
  `src/pages/kali-sahasranama-pdf/index.astro`
  Add a small file-details block (pages, format, size, license), the 1,008/1,000/1,072 naming note, Hindi edition link,
  and a "what's inside" list. Targets `maa kali 1008 names pdf` (pos 9.2).
  *Acceptance:* no broken external links; description ≤160; existing Book schema still parses.

- **B4 — 1008 explainer upgrade.**
  `src/pages/1008-names-of-kali/index.astro`
  Add a comparison table (1,008 vs 1,000 vs 1,072: what each count refers to), and links to the range pages.
  *Acceptance:* table is real HTML (not an image); heading order valid; no duplicate H1.

### Lane C — Crawl and links (one agent; owns `seo/`, `README.md`, measurement)

- **C1 — Hub deep links.**
  `src/pages/names/index.astro` *(coordinate with B1 — same file, same agent)*
  The hub currently links only the 11 ranges. Add a "Start here" block linking 10 representative name pages
  (kali, shmashana-kalika, kapalini, bhairavi, dakshina-kali, …) with descriptive anchors.
  *Acceptance:* ≥10 crawlable name links on the hub; links point to real slugs; no layout break at 375px.

- **C2 — Diagnose the 4 anomalies.**
  GSC → Pages: identify the 2 "page with redirect" and 2 "alternate page with proper canonical tag" URLs; confirm both are
  intentional (`/pdf/` redirect, old canonical). Record findings in this file under "Appendix B".
  *Acceptance:* 4 URLs listed with a verdict.

- **C3 — Link acquisition (owner-assisted, not code).**
  Checklist, one row per link, with status:
  - [ ] GitHub README links `1000namesofmakali.com/names/` with anchor "1,000 names of Maa Kali"
  - [ ] archive.org item descriptions (English + Hindi) link the site
  - [ ] Instagram bio → `/names/`
  - [ ] `jaikhyapaparampara.com` links the site (already 3 — add a names-hub link)
  - [ ] `1008namesofmakali.com` cross-link with descriptive anchor (currently 43 links, likely boilerplate — verify)
  - [ ] 1–2 genuine Reddit/forum answers (r/Shaktism, r/hinduism) linking the relevant name page, not the home page
  *Acceptance:* each row status is `done` with URL, or `rejected` with reason. No spam.

- **C4 — Request indexing.**
  After the deploy lands, request indexing in GSC for: `/`, `/names/`, `/kali-sahasranama-benefits/`,
  `/kali-sahasranama-lyrics/`, `/kali-sahasranama-pdf/`, `/1008-names-of-kali/`, `/names/kali/`,
  `/names/shmashana-kalika/`. Max 10/day; log date in Appendix B.
  *Acceptance:* 8 requests logged.

### Lane D — Measurement (one agent, read-only + docs)

- **D1 — Snapshot script.**
  Write `seo/snapshot.md` (manual, from GSC) with the table from §2 plus a "next review" date.
  *Acceptance:* file exists, dated, matches GSC.

- **D2 — Weekly review checklist.**
  Add a 10-line checklist to `seo/snapshot.md`: indexed count, discovered count, clicks/impressions 28d, brand position,
  top 5 queries, any new "Crawled – not indexed".
  *Acceptance:* checklist present; no automation required.

### Lane E — Verification (single agent, runs last)

- **E1 — Full verification.**
  Run: `npm run build` · `npm test` · `npm run check:syntax` · `npx playwright test smoke.spec.js`.
  Then audit the built output: titles/descriptions, canonical coverage, icons, 404 status, sitemap `lastmod` ≠ today.
  *Acceptance:* all green; report pasted into the PR/commit description.

---

## 6. Swarm execution plan

**File ownership prevents merge conflicts.** One file is edited by one agent per wave.

| Wave | Agents | Files |
|---|---|---|
| 1 | A, B1, B2, B3, B4, C2 | `index.astro`, `names/index.astro` (+C1), `benefits`, `pdf`, `1008`, read-only GSC |
| 2 | A3 (lyrics — same lane as A), C3, D1 | `lyrics`, docs, external |
| 3 | E1 | — |

- A owns `src/pages/index.astro` — no other lane may touch it in this project.
- B1 and C1 are the **same file** (`src/pages/names/index.astro`) and must be the **same agent**.
- A3 and B-lane lyrics: if split, coordinate on `src/pages/kali-sahasranama-lyrics/index.astro` — one agent only.
- Never edit `src/layouts/ReferenceLayout.astro` unless a task explicitly says so (shared by 1,063 pages).

**Git:** one branch per lane (`seo/brand`, `seo/midtail-hub`, …), rebase on `main`, merge sequentially.
`main` auto-deploys on push (Cloudflare Pages). The pre-commit hook bumps `public/version.json` and commits it —
that is expected, do not revert it.

**Verification before every merge:** `npm run build && npm test`.

---

## 7. Guardrails for agents

- Read this file first. Do not re-litigate the head-term decision.
- No new pages, no new URLs, no new dependencies.
- Keep `en_US`, the favicon set, the colophon page, and the 404 page as they are.
- Do not touch `design-demos/**` or `tmp/**`.
- Content claims must stay honest: devotional tradition, not medical or guaranteed outcomes.
- After changing a title/description, count characters (≤60 / ≤160).
- If a task cannot be done without conflicting with another lane, stop and report; do not guess.

---

## 8. Appendix A — GSC access

Property lives under **`adyakaligeneral@gmail.com`** (not `09ashishkapoor`), type `sc-domain`. Use the browser
skill (`bsk_*`) with that signed-in Chrome profile; start the daemon with `bsk daemon start --foreground` in a
persistent task if needed. Reports used: Performance (Web, 3 months / 28 days), Page indexing, Sitemaps, Links.

## 9. Appendix B — Findings log

| Date | Item | Result |
|---|---|---|
| 2026-11-21 | Baseline captured | see §2 |
| | C2 redirect/canonical anomalies | _pending_ |
| | Indexing requests | _pending_ |

## 10. Open questions

1. Hindi edition on-site or keep pointing at archive.org? (Decides whether `kali sahasranama in hindi` is in scope.)
2. Is `1008namesofmakali.com` ours and safe to cross-link deliberately? (43 existing links look templated.)
3. Do we want Bing Webmaster Tools + IndexNow as a second crawl channel?
