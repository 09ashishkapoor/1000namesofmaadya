# Build brief — implementing The Pothi in the Astro app

Hand this file to a fresh agent. It is self-contained: the design is **approved and finished**, this is
an implementation job, not a design job.

Repo: `C:\Users\kalbhairav\Documents\productionwebsite\1000namesofmaadya`
Live site (current): https://1000namesofmakali.com/
Branch: `main` · `design-demos/` is currently **untracked** — commit it first as the design reference.

---

## 1. Read these first, in this order

| File | Why |
|---|---|
| `design-demos/direction-approved.md` | what the client approved, in their own words |
| `design-demos/POTHI-SYSTEM.md` | the system, page-by-page mapping, technical change, effort, risks |
| `design-demos/NIGHT-MODE.md` | night reading is a **required** component, with the token table |
| `design-demos/pothi-system.css` | the approved stylesheet (tokens + components) |
| `design-demos/dir-2.html` | the approved **reader** prototype |
| `design-demos/pothi-name-page.html` | the approved **name page** template |
| `design-demos/pothi-range-page.html` | the approved **range page** template |
| `design-demos/pothi-theme.js` | the shared night-reading control |
| `design-demos/review.md` | why the old design failed — useful constraints |
| `design-demos/polish-log.md` | the craft fixes already made; don't regress them |

Open the prototypes in a browser before writing any code. They are the visual spec.

## 2. What is being built

Replace the site's two stylesheets (`public/styles.css` for the landing page, `public/reference.css`
for every other page) with the single Pothi system, and rebuild the templates:

| Template | Route(s) | Source of truth |
|---|---|---|
| Reader (home) | `/` | `dir-2.html` |
| Name page | `/names/[name]/` (1,039 pages) | `pothi-name-page.html` |
| Range page | `/names/1-100/` … `/names/1001-1072/` (11) | `pothi-range-page.html` |
| Names hub | `/names/` | range page minus the rows |
| Guide pages | `/108-names-of-kali/`, `/1008-names-of-kali/`, `/kali-sahasranama-pdf/`, `/kali-sahasranama-lyrics/`, `/kali-sahasranama-benefits/` | long-form guide layout |
| Text pages | `/about/`, `/contact/`, `/privacy/`, `/sources/` | single measured column |
| Night reading | all pages | `NIGHT-MODE.md` — button + pre-paint script + `pothi-theme.js` |

## 3. Non-negotiables

1. **All content stays server-rendered.** The names, meanings, elaborations, FAQ text, guide text and
   internal links must be in the HTML Astro emits. No client-side-only content on SEO pages.
2. **URLs, titles, descriptions, canonical tags, structured data (Article, DefinedTerm, FAQPage,
   BreadcrumbList, ItemList) and internal links stay exactly as they are.** This is a visual rebuild.
   The 108/1008/PDF/lyrics/benefits pages carry most of the search traffic.
3. **The reader is server-rendered for its first set of eleven.** Render Devanagari + IAST + meaning
   from `src/data/name-mapping.json` at build time (the data is already there: `devanagari`, `iast`,
   `spelling_common`, `page_slug`). `public/data_chunk_*.json` stays the source for the rest.
4. **One stylesheet.** Delete the split: one `pothi.css` (or `.scss`-free equivalent) built from
   `design-demos/pothi-system.css`. Keep `reference.css`/`styles.css` in git history, not in the build.
5. **Night reading is required on every template** — the button in the running head, the pre-paint
   script inline in `<head>`, `pothi-theme.js` loaded with `defer`. Day is the default when the system
   has no preference.
6. **Accessibility floor:** body ≥17.5px on phones, all active text ≥4.5:1 in **both** themes, visible
   focus rings, 44px targets for controls, `prefers-reduced-motion` respected.
7. **No new dependencies** (no Tailwind, no UI kit, no framework). Plain CSS + the existing vanilla JS.
8. **No invented copy.** All text comes from the current site or the prototypes. No placeholder Latin.
9. **No emoji, no gradient glows, no pills, no uppercase micro-labels.** These were the specific
   failures of the old design (see `review.md`).

## 4. Known facts about this repo

- Astro 6 static build (`astro.config.mjs`), Cloudflare Pages output, no runtime database.
- `package.json` scripts: `dev`, `build` (runs `prebuild` → `seo/build-sitemap.mjs`), `preview`,
  `test:unit`, `check:syntax`, `test:browser`, `validate`.
- **`node_modules` is installed in this checkout** (verified 2026-11-13), so `npm run dev` works
  immediately. On a fresh clone: `npm install` (Node 22 recommended).
- Tests: `tests/*.test.js` (unit), `playwright-tests/*.spec.js` (smoke, accessibility, visual,
  performance), `playwright.config.js` (preview server on 127.0.0.1:4321, chromium, viewport 1280×1800).
- CI: `.github/workflows/validation.yml` runs `npm run validate`.
- **Husky hooks are active** (`core.hooksPath=.husky`). Every commit that touches more than
  `public/version.json` runs `npm run bump-version`, which bumps the version and creates its own
  `chore: auto-increment version to X.Y [skip version]` commit. Expect the version to climb during the
  build — that is the repo's normal behaviour, not a mistake.
- Visual snapshots live in `playwright-tests/visual.spec.js-snapshots/` and **will** change. Update them
  with `npm run test:browser:update` only after the design is verified, and review the diffs.
- `src/lib/staticNames.js` already builds ranges (100 per range, 11 ranges) and splits elaboration
  paragraphs — reuse it, don't duplicate.
- There is a stray `</script>` at the end of `src/pages/index.astro` (L661) — remove it while you are
  in that file.
- Fonts are currently loaded per page; the Pothi uses **Crimson Pro** + **Tiro Devanagari Sanskrit**
  (Noto Serif Devanagari fallback) from Google Fonts. Self-host and subset the Devanagari before launch
  (performance risk 2 in `POTHI-SYSTEM.md`).

## 5. Order of work

1. Confirm `node_modules` (already installed); open the three prototypes; note the current branch.
2. Branch: `pothi-system` (or similar).
3. **Tokens first**: create the new stylesheet from `pothi-system.css`; add night tokens; wire the
   `ReferenceLayout.astro` head (fonts, pre-paint theme script, `pothi-theme.js`).
4. **Name page** (`src/pages/names/[name].astro`) — smallest blast radius, proves the system on real
   data. Screenshot day/night at 1440 and 375, compare against `pothi-name-page.html`.
5. **Range pages** (`src/pages/names/[range].astro` + hub `src/pages/names/index.astro`) — static rows,
   no JS.
6. **Reader** (`src/pages/index.astro` + `public/app.js`): server-render the first set of 11 from the
   mapping; keep search, set paging, note disclosure about a third of the current script; keep the PDF
   promo content but restyle it (no emoji list).
7. **Guide + text templates**; move the five guide pages and four text pages onto them without touching
   their copy.
8. **Clean up**: delete dead CSS/JS, remove the old inline critical CSS from `index.astro`, update
   `DESIGN.md`/`DESIGN.json` (they still describe the old "Midnight Shrine" system) — or add a note that
   they are superseded by `design-demos/POTHI-SYSTEM.md`.
9. **Validate**: `npm run validate`; fix failures; update visual snapshots; Lighthouse on the home, a
   name page and a guide page (mobile), target ≥90 performance / 100 accessibility.

## 6. Definition of done

- [ ] Every route in section 2 renders in the Pothi system — no page still uses `styles.css` or `reference.css`.
- [ ] Reader shows Devanagari + IAST + meaning without a tap; eleven names per set; set nav works.
- [ ] Search works across the loaded data and is accent-insensitive (`kali` finds `Kālī`).
- [ ] Name and range pages: real data, correct slugs, correct prev/next, correct breadcrumbs.
- [ ] Night selector on every page: toggles, persists, follows system when unset, no flash, print = day.
- [ ] Both themes pass the contrast check; no horizontal scroll at 320/375/1440.
- [ ] `npm run validate` green; snapshots updated and reviewed; CI config untouched.
- [ ] No console errors on any page; no failed network requests.
- [ ] `README.md`'s feature list and `DESIGN.md` updated to describe the new system (or point to the brief).
- [ ] No content changed: run a diff of the rendered text for a name page and a guide page before/after.

## 7. Do not do

- Do not re-open the design direction, restyle "in the spirit of", or add new visual ideas. If something
  in the prototypes is genuinely broken, fix it and say so.
- Do not change URLs, redirects (`public/_redirects`), sitemap generation, robots, `llms.txt`, or the PDF.
- Do not rewrite the meanings/elaborations. The ASCII spellings in the note openings
  ("The name Shhmashhana Kalika is…") are a **separate content pass** — flag them, don't silently edit
  sacred text. (See risk 1 in `POTHI-SYSTEM.md`.)
- Do not add a CSS framework, a component library, or client-side routing.
- Do not remove the service worker, analytics, or structured data.

## 8. Open question to ask the human before starting

Only one: **reader first, or all templates before anything ships?** Everything else is specified.

## 9. When you report back

For each template: a day and night screenshot at 1440 and 375, a one-line note on what changed, and any
deviation from the prototypes with the reason. End with the validation result and the list of files
touched.
