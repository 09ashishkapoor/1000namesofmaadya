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

**Depth is the differentiator, not another domain.** The 1,039 name pages with English meanings are the
asset no competitor — and no sister site — replicates at this granularity. The owner's sister sites
(`kakaradikalisahasranama.com`, `kaliputra.com`, `1008namesofmakali.com`) are complementary and rich in
their own right. **Cross-site cannibalisation is explicitly out of scope** (owner decision, 2026-11-21):
do not propose merging, canonicalising, consolidating or de-indexing a sister site. If two of our pages
rank for the same query, that is acceptable — improve ours, don't tear down theirs.

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

### Crawl health — 2026-11-21 (GSC Crawl stats, updated 19 Nov)

Screenshot: `docs/screenshots/serp/08-gsc-crawl-stats.png`.

| Metric | Value |
|---|---|
| Crawl requests, 90 days | **747** (~8/day) |
| By purpose | **Refresh 81% · Discovery 19%** |
| By response | 200: 94% · 301: 6% |
| By file type | HTML 53% · JS 16% · JSON 13% · CSS 10% · other 6% |
| Hosts | apex 585 · **www 162 (all 301) = 22% of crawl budget** |
| Response time / status | 146 ms · no host problems |

The 90-day chart shows a burst around **8–11 Nov** (peak ≈120 requests in a day) then a fall-off to single
digits, near zero by 17–19 Nov. Page indexing has been flat at **124 indexed / 944 not** since the 15 Nov
stamp.

**Verdict: not blocked — starved.** Technically healthy (94% 200s, 146 ms, sitemap Success, no errors), but
only ~19% of requests were *discovery*, i.e. roughly **140 new URLs fetched in 90 days (~1.5/day)**. At that
rate the 933 discovered pages need ~18 months just to be fetched once. Measurable waste: 22% of the budget
goes to www→apex 301s, and 29% to JS+JSON subresources.

This is why Lane C exists: no title or schema change fixes a crawl that is this rationed. Links and internal
discovery are the only levers that move the ceiling.

### SERP snapshot — 2026-11-21 (US, non-personalized)

Captured in Chrome with `pws=0` and `gl=us` (Google footer: "Results are not personalized", Atlanta IP).
Screenshots: `docs/screenshots/serp/`.

| Query | Our position | Winner |
|---|---|---|
| `kali sahasranama` | **not in top 20** (page 1 *and* 2 checked) | drikpanchang, astromantra, stotranidhi, redzambala, `kaliputra.com` (#7) |
| `1000 names of kali` | **not on page 1** | drikpanchang, narasimhaye blog, Scribd, shreemaa, rudranaad |
| `1000 names of maa kali` | **not on page 1** | drikpanchang, narasimhaye, Scribd, vitalcoaching |
| `adya kali sahasranama` | **#2** ✅ | `kaliputra.com` #1 |
| `kali sahasranama benefits` | **not on page 1** | Quora, then `kakaradikalisahasranama.com` #3 |

Notes:

- Google still serves the **pre-change home title** (`…with Meanings`); the home page had not been recrawled
  since 16 Nov when this was captured. Re-check after the next crawl.
- 72% of GSC clicks are India, so a US SERP understates the India position. The India ground truth is in the
  next section — it comes from Search Console's country filter, not a VPN.
- `adya kali sahasranama` is the **only** query where the site is visible. It ranks #2 while the string
  "Adya Kali" appears **zero** times on the site — the rank comes from proximity, not an exact match.
  That is what A1/A2 fix.

### India — Search Console ground truth (3 months, 2026-11-21)

Search Console has the India data directly, so **no VPN is needed** for it: Performance → Country = India,
then filter `Query contains "kali sahasranama"`. Screenshot:
`docs/screenshots/serp/07-gsc-india-kali-sahasranama.png`.

India totals: **199 clicks / 2.53K impressions / 7.9% CTR / avg position 8.4** across 166 queries.

| Query (India, containing "kali sahasranama") | Clicks | Impr. | CTR | Pos |
|---|---|---|---|---|
| adya kali sahasranama | 44 | 108 | 40.7% | 2.3 |
| adya kali sahasranamavali | 24 | 41 | 58.5% | 1.1 |
| kali sahasranama benefits | 4 | 46 | 8.7% | 5.5 |
| kali sahasranama with meaning | 2 | 11 | 18.2% | 7.7 |
| benefits of kali sahasranama | 0 | 9 | 0% | 4.8 |
| kali sahasranama meaning | 0 | 4 | — | 9.8 |
| **kali sahasranama** | **0** | **4** | **0%** | **26.3** |
| kali sahasranamavali | 0 | 1 | — | 34.0 |
| mahakali sahasranama | 1 | 3 | 33.3% | 42.3 |

Reading: the bare head term is **page 3 at best** in India — 4 impressions in 90 days, position 26.3, zero
clicks. The brand pair (#2.3 / #1.1) carries 68 of these 75 clicks. `benefits of kali sahasranama` sits at 4.8
with 9 impressions and 0 clicks — a CTR/AI-Overview problem, not a ranking problem. This confirms the §1
decision: there is no near-miss on the head term worth optimising.

**VPN:** Mullvad has no India endpoint (50 countries; nearest APAC are Singapore, Malaysia, Indonesia,
Thailand, Hong Kong). A VPN therefore cannot produce an India IP here; use GSC's country filter for data and
`&gl=in` if a visual India SERP is ever needed.

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

**Start here.** A1 + A2 are the first fixes in the project: they are small, they touch the only query the
site is visible for, and they harden a #2 position that currently rests on proximity rather than an exact
match. The site says "Adya Mahakali" everywhere (12,859 mentions) and **"Adya Kali" nowhere (0)**.

- **A1 — Schema alternate names.**
  `src/pages/index.astro`
  Change `alternateName` from a string to an array on **both** the `WebPage` and `WebSite` JSON-LD blocks:
  `["Maa Ādya Mahākālī Sahasranāma", "Adya Kali Sahasranama", "Adya Kali Sahasranamavali", "Maa Adya Mahakali Sahasranama"]`
  (keep the existing IAST/spelling entries; add "Adya Kali …").
  *Acceptance:* both blocks parse; `alternateName` is an array containing `Adya Kali Sahasranama`;
  visible page unchanged; build passes.

- **A2 — Visible "also known as" line.**
  `src/pages/index.astro`
  Add one sentence in the cover copy, outside the `<h1>`:
  "Also known as **Adya Kali Sahasranama**, the **Adya Kali Sahasranamavali**, or the 1,000 names of Maa Kali."
  Use the existing `.small` class (no stylesheet change). Keep the Devanagari/IAST H1 untouched.
  *Acceptance:* the phrase "Adya Kali" appears in rendered body HTML; H1 unchanged; no layout break at
  375/1440 (screenshot).

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

- **C0 — Crawl-waste audit.**
  Confirm where the 22% www→apex 301 budget goes (who still links `www.`) and what drives 29% JS+JSON
  fetches (likely the service-worker precache of `data_chunk_*.json`). Make no change that risks offline
  behaviour; write a short note with a recommendation.
  *Acceptance:* one paragraph in `seo/snapshot.md` + any safe, tested change.

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

- **C5 — Collapse the `1008namesofmakali.com` mirror into this domain.**
  Verified 2026-11-21: `1008namesofmakali.com` is a **second deployment of this same site** — every path returns
  200 with a cross-domain canonical to `1000namesofmakali.com`, and unknown paths still 404. It is not a
  redirect and sends no traffic; it publishes ~1,063 duplicate URLs. Add a Cloudflare **301 for
  `https://1008namesofmakali.com/*` → `https://1000namesofmakali.com/$1`** (Bulk Redirect or Redirect Rule at
  the zone), then confirm a spot check: `/names/kali/` → 301 → 200 on the main domain.
  *Acceptance:* whole-domain 301 live; no `canonical`-only duplicates left; GSC shows the 1008 URLs dropping
  out over the following weeks. **Keep the domain registered and redirecting — do not delete it and do not let
  it lapse.** It renews March 2027; put it on auto-renew. An expired `1008namesofmakali.com` is a brand and
  squatting risk (someone else can host a look-alike next to our brand), and it currently costs nothing but
  the renewal fee once it is a redirect.

### Lane D — Measurement (one agent, read-only + docs)

- **D1 — Snapshot script.**
  Write `seo/snapshot.md` (manual, from GSC) with the table from §2 plus a "next review" date.
  *Acceptance:* file exists, dated, matches GSC.

- **D2 — Weekly review checklist.**
  Add a 10-line checklist to `seo/snapshot.md`: indexed count, discovered count, clicks/impressions 28d, brand position,
  top 5 queries, any new "Crawled – not indexed".
  *Acceptance:* checklist present; no automation required.

- **D3 — India visual SERP (optional).**
  The India numbers are already captured from GSC (§2). A visual pass is optional: repeat the five queries with
  `&gl=in`, save to `docs/screenshots/serp/in/`, and check whether Google's India render matches GSC.
  *Acceptance:* five screenshots, or an explicit "not needed — GSC covers it" note.

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
| 2026-11-21 | US SERP snapshot | see §2 — only `adya kali sahasranama` (#2) is visible; head terms absent from page 1; screenshots in `docs/screenshots/serp/` |
| 2026-11-21 | Owner decision: cannibalisation | Out of scope. Sister sites are complementary; no consolidation. |
| 2026-11-21 | India ground truth (GSC) | bare `kali sahasranama` = position 26.3, 4 impressions/90d; brand pair = 68 of 75 clicks |
| 2026-11-21 | Crawl health | 747 requests/90d, 19% discovery, 81% refresh; ~1.5 new URLs/day → 933 pages ≈ 18 months at this rate |
| | C2 redirect/canonical anomalies | _pending_ |
| | Indexing requests | _pending_ |
| | India SERP snapshot (D3) | _pending_ |

## 10. Open questions

1. **Hindi** — decided separately in [`hindi-plan.md`](hindi-plan.md): `/hi/` on this domain, hub-first,
   not a new domain. The SERP was verified as shallow (2011 Blogspot is the strongest competitor) and the
   Hindi elaborations are recoverable from `7eb337d`. Do not fold Hindi work into this plan.
2. `1008namesofmakali.com` — **resolved 2026-11-21:** it is ours and is a full duplicate deployment, not a
   redirect. Task C5 collapses it with a 301.
3. Do we want Bing Webmaster Tools + IndexNow as a second crawl channel?
