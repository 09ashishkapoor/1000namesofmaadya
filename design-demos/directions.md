# Redesign — shared spec + six direction cards

## Phase 2 · Restated need

The site is not a landing page with a name list attached; it is a printed Sahasranama that has
been implemented as a web app. The people who come to it are on phones, they stay for a while,
and they want three things in one glance: **the name as it is written (Devanagari), how to say it
(IAST), and what it means.** Everything the redesign does has to serve that, and it has to feel
like one book — the reader and the 1,000+ reference pages today look like two different sites.
The 1,072 names are already organised in sets of 11; that pacing is the product's own idea and
should be visible in the layout. Red and black are the brand, but as consecration, not as
decoration.

I am building three complete, different versions rather than asking which direction you like
before there is anything to look at.

## Phase 3 · Spec (identical input for all three)

- **What it is:** homepage + reader for the Maa Ādya Mahākālī Sahasranāma, 1,072 names.
- **Audience:** devotees reading on phones, long sessions, returning daily; plus search visitors who land on the 108-names / PDF / FAQ pages.
- **Core message:** the names are the text — read them as written, with their meaning.
- **Emotional tone:** reverent, quiet, grounded. Not occult, not SaaS, not luxury gloss.
- **Format (same for all three):** one self-contained HTML prototype, 1440×900 desktop and 390×844 mobile; full-page screenshots for side-by-side comparison; real names 1–11; real site copy; the real photo.
- **Known constraints:** brand red / black / gold with restraint; body ≥17px on mobile; text contrast ≥4.5:1; no emoji icons; no invented data; one type family + Devanagari companion where possible; 11 names per set, 98 sets.
- **Image needs:** `public/MaaAdyaKali_5.webp` (1920×1080) + the two background crops. No image generation.

## Phase 4b · Six cards

### 1 · Best designer — 杉浦康平 Kohei Sugiura → "The Ring of Names"
- **Source:** Kohei Sugiura's information mandalas (specimen `assets/style-specimens/east/08-sugiura-info-mandala.jpg`): one ring, labels set radially on the circumference, numbered annotations on leader lines, a data table in the corner, gold on black, a single crimson aperture at the centre.
- **What I borrow:** 98 sets become 98 arcs on one ring (3.67° each) — the ring *is* the progress and the navigation; ticks and hairlines carry all the structure; annotations attach to names by leader lines; type sits on radial axes; exactly one crimson element per screen.
- **Hero material:** the Devanagari name at monumental scale + the deity photo cropped into the ring's centre.
- **Skeleton:** deep-black field · left: the 11-name reading column (Devanagari, IAST, meaning) · right: sticky ring of 98 sets with the current set lit · narrow header.
- **Where the nerve goes:** the ring is real navigation, not an ornament — click an arc and the set changes.
- **form from content:** a sahasranama is recited in a cycle, and 1,072 is 97 sets of 11 plus 5 — a circle, not a scrollbar.

### 2 · Best designer — Irma Boom → "The Pothi"
- **Source:** Irma Boom's book objects (irmaboom.nl, `refs/irma-boom.png` — the fore-edge photo with coloured page blocks): paper as the material, coloured fore-edges as the only colour system, running heads, huge folios, text blocks that behave like signatures.
- **What I borrow:** the page is a *spread* with a gutter and two leaves; set number and folio in the outer corners; the right fore-edge is a strip of 98 coloured bands (current set extended) — progress as a bound edge; ink black + cinnabar + gold; no cards, no shadows that read as software.
- **Hero material:** warm paper + giant Devanagari as the printed object; the deity photo as a duotone frontispiece.
- **Skeleton:** paper ground · symmetrical spread · left leaf: name list (Devanagari large, IAST small) · right leaf: meaning + elaboration · fore-edge strip · running foot.
- **Where the nerve goes:** the spread and the fore-edge — a website commits to looking like a bound book.
- **form from content:** the site already publishes this text as a 68-page PDF for printing; the web version should be the same object.

### 3 · Reality reference — Sefaria's bilingual reading page → "The Study Page"
- **Source:** sefaria.org bilingual reader (`refs/sefaria.png`, verified live): verse numbers in the margin rail, original on its own line, translation beneath in a lighter voice, a ~62-character measure, near-white ground, chrome reduced to a thin bar.
- **What I borrow:** a left rail with segment numbers and set progress; each name is a *segment* (Devanagari line, IAST line, meaning line) separated by hairlines, not cards; the elaboration opens inline under the segment; one sticky bar for search and "next 11"; no images competing with the text.
- **Hero material:** the typography itself; the photo appears once, small, as a seal beside the dedication.
- **Skeleton:** warm-white ground · 720px column · 96px left rail · sticky bar · quiet footer.
- **Where the nerve goes:** the nerve is restraint — no texture, no ornament, and the reader is usable in one screen with a 1,072-name index behind it.
- **form from content:** this is a text read repeatedly for study; it behaves like a study page, not a marketing page.

### 4 · Reality reference — Emergence Magazine → "Darshan"
- **Source:** emergencemagazine.org (`refs/emergence.png`, verified live; Webby-winning editorial design by Studio Airport): one full-bleed image per viewport, tiny navigation set on the image, a small framed card at the lower right, a warm dark ground under the photograph, large serif headline.
- **What I borrow:** the deity photo at full bleed with five words on it and nothing else; a framed "current set" card floating at the lower right; below, an editorial list of the 11 names on a warm dark field; captions and labels tiny.
- **Hero material:** the real photograph, uncropped and undimmed.
- **Skeleton:** full-bleed opening · editorial 11-name list · guides · footer.
- **Where the nerve goes:** the photo owns a whole viewport; almost no information on the first screen.
- **form from content:** darshan — you look at the Goddess before you read.

### 5 · Roulette (web #20) — Kenya Hara White Gallery → "The Name Gallery"
- **Source:** specimen `assets/style-specimens/web/20-kenya-hara-white-gallery.jpg` (Cosmos / Aesop; Hara's *White*): near-white ground, hairline dividers, luxury emptiness, content as the only colour.
- **What I borrow:** #FAFAFA field, ~70% empty, 11 names as gallery labels in a masonry of plates, image plates as the only colour, type small with wide tracking, UI retreating to a hairline.
- **Hero material:** the photo plates + Devanagari as an exhibit label.
- **Skeleton:** white gallery grid · masonry plates · single-line search · no chrome.
- **Where the nerve goes:** the emptiness — one name per large plate.
- **form from content:** 1,072 names as an exhibition, not a feed.

### 6 · Roulette (east #12) — Japanese lifestyle magazine dense → "The Practice Index"
- **Source:** specimen `assets/style-specimens/east/12-japan-magazine-dense.jpg` (POPEYE / BRUTUS lineage): dense white-paper grid, highlighter blocks, a numbered route diagram, small data cells with heavy rules, handwritten-feel annotations, narrow Latin folios.
- **What I borrow:** a route diagram of the 98 sets as the progress device; 11 names in a tight four-column index with cinnabar highlighter blocks; folio numbers in a narrow Latin face; one annotation column.
- **Hero material:** the dense index itself + the route diagram.
- **Skeleton:** magazine spread · route map left · 11-row index right · heavy rules.
- **Where the nerve goes:** density — 1,072 names treated as an index you can actually scan.
- **form from content:** recitation is a route through 98 sets; showing the route teaches the structure.

## Chosen for full build

**1 · The Ring of Names** (dark, ceremonial, radial) · **2 · The Pothi** (warm paper, bound book) ·
**3 · The Study Page** (white, utility, bilingual segments).

Four, five and six stay as alternates — if one of them is the one you want, say so and I will
build it out.

## Phase 5 · Assumptions (no client answers were available at build time)

- **A1** The primary job is reading and chanting, so the reader is the homepage below the entry — not a separate `/read` route.
- **A2** 98 sets of 11 is the honest structure (1,072 = 97×11 + 5); the last set shows 5 names.
- **A3** "1000 Names" stays as the marketing name, with 1,072 stated plainly next to it.
- **A4** Search, PDF, 108-names and sources entry points must remain visible — they carry most of the search traffic.
- **A5** No new copy is invented; all sentences come from the live site or from `PRODUCT.md`.
