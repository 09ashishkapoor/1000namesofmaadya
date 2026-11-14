# The Pothi — one system for the whole site

Short answer to the question: **yes, the whole site can move to this style**, and it is not a rebuild.
The site is 12 page types built from 3 templates; the reader is one, the reference pages are the other
two. This document maps every page type to the system, gives the technical change, and states what it
costs.

Proof, not promise:
- `pothi-name-page.html` — `/names/kali/` rebuilt (long-form reading template)
- `pothi-range-page.html` — `/names/1-100/` rebuilt (100-row reference template, real data)
- `pothi-system.css` — the one stylesheet both share with the reader

---

## 1. The system

**Tokens**

| Token | Value | Use |
|---|---|---|
| paper | `#faf3e3` | reading surfaces, panels |
| paper-2 | `#eee3ca` | page ground |
| paper-3 | `#f2e7cf` | strips, mobile index |
| ink | `#1b1510` | headings, names |
| ink-2 | `#4a3f31` | prose |
| ash | `#5b5142` | captions, metadata (≥5:1 on paper) |
| cinnabar | `#9c2b1c` | the single accent: IAST, current range, links, folios |
| gold | `#775a21` | numerals, rules that need warmth |
| rule | `#cdbc9c` | hairlines |
| desk | `#ddcfb2` | the ground the book sits on |

**Type** — Crimson Pro (300/400/600 + italic) for Latin; Tiro Devanagari Sanskrit for Devanagari,
with Noto Serif Devanagari as fallback. Two voices, one accent.

**Voice** — the Devanagari is the hero on every page; the IAST sits under it in cinnabar italic; the
English is the commentary. Nothing is set in all-caps ASCII any more.

**Components** (all in `pothi-system.css`): running head · breadcrumb · kicker · `dev-title` /
`iast-title` / `num-title` · panel · prose measure with drop cap · `sec` heading with a Devanagari
label · folio · name pager · leader-dot contents list · range tabs · dense name index · colophon
footer · fore-edge thumb index (11 ranges) · **night-reading control**.

**Night reading is a required component of every template** — not an optional extra:

```html
<!-- in the running head, after the nav -->
<button class="theme" type="button" data-theme-toggle aria-pressed="false"
        aria-label="Switch to night reading">
  <span class="sw" aria-hidden="true"></span><span class="lbl">Night</span>
</button>

<!-- in <head>, before first paint (inline) -->
<script>
  (function () { try {
    var t = localStorage.getItem('pothi-theme');
    if (!t) t = matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
    if (t === 'night') document.documentElement.dataset.theme = 'night';
  } catch (e) {} })();
</script>

<!-- before </body> -->
<script src="pothi-theme.js" defer></script>
```

Both themes are checked in the visual-regression pass (`light` and `dark` projects in Playwright).

**Fixed rules**
- One accent per screen: cinnabar, never on small text below 4.5:1, never as a gradient.
- No cards, no shadows except one soft paper shadow, no pills, no emoji, no glow.
- Reading measure 60–66ch; body 18–19px desktop, 17.5px phone.
- Every page opens with the same running head and closes with the same colophon — that is what makes
  it feel like one book.

---

## 2. Page-by-page mapping

| Page type | Route | Treatment in the system |
|---|---|---|
| **Reader** (home) | `/` | Approved prototype `dir-2.html`: duotone frontispiece, 98-band fore-edge, two-leaf spread (set list + name page), 2-column mobile index. |
| **Name page** | `/names/[name]/` | Built — `pothi-name-page.html`: Devanagari as `h1`, IAST under it, "What it means" panel with a spelling table (Devanagari / IAST / common / source), elaboration as a measured prose column with section heads, folio = position number, pager = previous/next name with Devanagari, see-also list and sources panel. |
| **Range page** | `/names/1-100/` … `/names/1001-1072/` | Built — `pothi-range-page.html`: Devanagari numerals as the title (`१–१००`), 11 range tabs, 100-row two-column index (number · Devanagari · IAST · meaning), previous/next range. |
| **Names hub** | `/names/` | Same as range page minus the rows: title, range tabs, an 11-card "contents" list of ranges with first/last name, plus the "about these pages" panel. Half a day. |
| **Guide pages** (108, 1008, PDF, lyrics, benefits) | `/108-names-of-kali/` etc. | Long-form guide template: kicker + Devanagari title + IAST + lead, one duotone plate, prose sections, a data table (the 108 rows use the same `.nrow` component as the range index), FAQ as a definition list with hairlines, contents list at the top. ~1 day for all five; they share one template. |
| **About / Contact / Privacy / Sources** | `/about/` etc. | Text page: single 62ch column, section heads, no images except About (small frontispiece), sources as a numbered bibliography style. Half a day. |
| **404 / offline** | — | One sheet: ॐ, one line, links. 15 minutes. |
| **PDF edition** | `/downloads/…pdf` | Already printed; restyle the cover to the same typography so the PDF and the site match. Optional. |

Templates needed: **5** (reader, name, range/hub, guide, text). Two are built.

---

## 3. Technical change

Current state: `public/styles.css` (landing, 2,007 lines) and `public/reference.css` (all other pages,
1,162 lines) are two systems. The Pothi replaces both with one stylesheet (~500 lines).

- **Layout:** `src/layouts/ReferenceLayout.astro` keeps its job (head/SEO/schema) and swaps its CSS for
  `pothi.css`, gaining the running head, breadcrumbs and colophon as small components.
- **Reader:** `src/pages/index.astro` becomes the approved prototype structure; the first set of eleven
  is rendered **server-side** from `src/data/name-mapping.json` (Devanagari + IAST already live there),
  so the sacred text is on the page with no extra network cost. The client script keeps search, set
  paging and the note disclosure.
- **Name / range pages:** markup changes are structural but small — the data and `getStaticNamesData()`
  already provide everything (Devanagari, IAST, common spelling, page slug, ranges). No new data work.
- **SEO:** all text stays in server-rendered HTML; headings, breadcrumbs, schema and internal links are
  preserved. Nothing in this design hides content behind JS (the range prototype uses a script only for
  the demo; production renders the rows statically).
- **Analytics / service worker / sitemap / tests:** untouched. The Playwright visual snapshots will need
  regenerating once (`npm run test:browser:update`) after review.

Estimated diff: ~5 templates + 1 stylesheet + 1 layout + small component partials. No database, no
build-pipeline change.

---

## 4. Effort and sequence

| Step | Work | Time |
|---|---|---|
| 1 | Design tokens + `pothi.css` extracted from the prototypes | 0.5 day |
| 2 | Reader (`/`) rebuilt and wired to real data + search + paging | 1–1.5 days |
| 3 | Name page + range page + hub templates | 1.5 days |
| 4 | Guide template × 5 pages + about/contact/privacy/sources | 1–1.5 days |
| 5 | Content QA pass (see risk 1) | 1 day |
| 6 | Accessibility + visual regression + Lighthouse pass (both themes) | 0.5 day |
| 7 | Night reading: tokens, control, no-flash script, print fallback | 0.5 day |
| **Total** | | **~6.5 days** |

---

## 5. Risks, stated plainly

1. **The ASCII spellings in the copy.** The elaboration texts open with the source transliteration
   ("Shhmashhana Kalika", "Kurukulla-'Virodhini", "Kala Ratri Cha"). Once the page shows IAST, those
   become visible contradictions. Fix the opening sentence of each note from `iast` (script-assisted),
   keep the prose. This is a content job, not a design job — but it must ship with the redesign.
2. **1,072 long pages on a slow connection.** The paper texture, two Google font families and the
   duotone frontispiece need to stay light: subset the Devanagari font to the glyphs used, self-host the
   fonts, compress the frontispiece to ~80 KB AVIF/WebP. Target: no page over 500 KB.
3. **The dark reference pages disappear.** Today those pages have a maroon ground; the Pothi is paper.
   That is the point of the change (one book), but anyone attached to the dark look will notice it.
   If you want a dark mode later, it becomes a token swap, not a redesign.
4. **The 108 / 1008 pages are SEO earners.** They must keep their headings, FAQ text and internal
   links verbatim. The template moves them visually, not editorially.
