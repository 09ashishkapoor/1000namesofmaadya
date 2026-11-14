# Design review — 1000namesofmakali.com

Reviewed 2026-11-13. Evidence: live site screenshots at 1440 and 375 (`design-demos/review/`),
the four reference-page templates, and the source CSS/JS in this repo. Scores follow the
huashu-design critique rubric (0–10, concept first — a design with no idea cannot be rescued
by execution).

**Overall: 5.2 / 10 — "needs work" (needs the concept fixed before more polish).**

| Dimension | Score | One line |
|---|---|---|
| Concept / idea | 5.5 | "Midnight shrine" is a real idea for the *palette*, but the page structure is a generic landing page: hero → CTA → card grid → FAQ → footer. |
| Philosophy alignment | 5.0 | The stated system says "cards are not repeated SaaS modules" and "accents are not wallpaper"; the page is a wall of identical rounded cards with gold-crimson glow everywhere, and the rest of the site uses a different system entirely. |
| Visual hierarchy | 6.0 | The hero title is strong; after that, 11 cards have identical weight and 11 identical "Read More" buttons compete with the names. |
| Craft | 5.0 | Broken alignment in the PDF feature list, dangling colons, mismatched emoji glyphs, a stray `</script>`, a permanent disabled "Clear" button, 14px body text on mobile. |
| Functionality | 5.0 | The core task — read a name *with* its meaning — costs one tap per name (up to 1,072 taps), and the Devanagari (what a devotee actually chants) never appears in the reader. |
| Originality | 4.5 | Dark + crimson + gold + glowing pill is the 2026 default for "spiritual" pages; the one genuinely ownable asset — 1,072 Devanagari names in sets of 11 — is used as plain text in a grid. |

---

## What is already good (keep)

1. **The content is the product, and it is real.** 1,072 names, Devanagari, IAST, common spellings, one-line meanings, long elaborations, a printable PDF, sources page. Very few devotional sites have this depth.
2. **The 11-name pacing is a genuinely good idea.** "The text is arranged in sets of 11 so it is easier to read slowly" is a devotional design decision, not a UI one. It deserves to be visible in the layout, not just in a Next button.
3. **The name pages are the best-looking pages on the site.** `/names/kali/` has a large title, Devanagari काली, IAST, a "What Kali means" panel, the elaboration, prev/next name navigation, and a source note. That page feels like a book. It is the template to build on.
4. **The photo assets are beautiful and authentic.** `MaaAdyaKali_5.webp` — statue, hibiscus, diya, storm sky — is a real devotional image, and it is being darkened to near-black and used as wallpaper.
5. **Restraint is a stated value** (PRODUCT.md: red and black "with restraint and intention"). The brand already knows what it wants; the landing page has not caught up with it.

## Problems, in order

### 1. ⚠️ The reader hides the text
- **Current:** each card shows a number, an uppercase ASCII name, and a "Read More" bar. Devanagari and IAST exist in the data (`src/data/name-mapping.json`: `श्मशान कालिका`, `Śmaśāna Kālikā`) but are never used by the reader. The one-line meaning is inside the collapsed panel.
- **Problem:** a devotee wants to chant the name as written and understand it in the same glance. Today the page reads like an index of an app, and 1,072 names × one tap is not a reading experience. The transliteration shown (`SHHMASHHANA KALIKA`, `KURUKULLA-'VIRODHINI`, `KALA RATRI CHA`) is not the IAST text at all — it is an all-caps ASCII variant, and it drops the diacritics that tell a reader how to voice the name.
- **Fix:** put Devanagari + IAST + one-line meaning in the default state; keep the long elaboration behind the disclosure. Eleven per page stays.

### 2. ⚠️ The site is two designs stitched together
- **Current:** the landing page uses `styles.css` (shrine black `#0a0a0a`, crimson `#dc143c`, system sans, Georgia, 16px radius, pills, glows). Every other page uses `reference.css` (temple maroon `#8b2635`, gold `#e8c468`, Crimson Text + Philosopher + Noto Sans Devanagari, light paper panels).
- **Problem:** a visitor crossing from the reader to a name page or the 108-names guide feels handed to a different website. Same palette family, different physics: cards on dark vs printed paper on maroon. The deeper issue is philosophical — the landing builds "UI", the rest builds "book", and the book is better.
- **Fix:** one system. The reference-page world (paper panel on a temple-dark ground, serif voice, real Devanagari font) is the stronger foundation; rebuild the landing inside it rather than the reverse.

### 3. ⚠️ Legibility does not meet the site's own claims
- **Current:** body text drops to **14px** at ≤768px (`styles.css` L1811). Crimson as text measures **3.97:1** on `#0a0a0a` ("Showing all 1072 names of Maa Adya Mahakali") and **3.49:1** on `#1a1a1a` (the "DIGITAL LIBRARY" badge, 13px). Cards run a `#1a1a1a → #0a0a0a` gradient, so every card edge dissolves into the page.
- **Problem:** PRODUCT.md promises "readable text, strong contrast" and "text legibility … especially important" on mobile. AA needs 4.5:1 for normal text and ≥16px body on phones.
- **Fix:** crimson only on large text or as a surface fill; for small text use a lighter red (`#F04A63` measures 5.53:1 on `#0a0a0a` and 4.86:1 on `#1a1a1a`) or the existing gold. Body 17–18px on mobile, 19–20px on desktop.

### 4. ⚡ The first viewport is a crowded stage
- **Current:** title + gold italic "Sahasranāma" + a sentence that repeats the title + "Start Reading" + "About the Sahasranama" + "Browse static names reference pages" + a floating gold arrow button. All of it sits over the deity's face.
- **Problem:** four navigation affordances before any content; the strongest element in the composition (the Goddess's face) is the one thing being covered. The sentence "Adya Mahakali 1000 Names is a searchable reading with English meanings" tells you what a button would have told you.
- **Fix:** one entrance into the text, one secondary link. If the photo is the opening, give it negative space for the type instead of printing over the face.

### 5. ⚡ A card grid is the wrong container for a prayer
- **Current:** 11 names in a 3-column grid at ≥1200px, 2 columns at ≥768px, each an identical 170px-tall rounded card with a red index pill, a serif name, and a full-width "Read More" bar.
- **Problem:** a sequence of 1→11 is being read *across* rows in a card wall. The repeated button is visually heavier than the name it belongs to; at mobile the 11 cards take ~1,900px of scroll and show no meaning at all. The layout says "content feed", not "text you recite".
- **Fix:** one continuous reading column (or a two-leaf spread), numbers in the margin, no card chrome, the disclosure as a quiet inline affordance.

### 6. ⚡ Template decoration, everywhere
- **Current:** ~15 emoji as icons (📿 📖 📥 📄 🌐 🔖 🖨️ ✨ 🔥 🕉️ 🌟 💫 ⭐ 🙏), uppercase micro-kickers ("DIGITAL LIBRARY", "QUICK ANSWERS"), gradient glow on buttons and card edges, a monospace version string, a "Showing all 1072 names" stat line.
- **Problem:** these are the exact props of an AI-generated 2026 landing page, and they are the first thing a thoughtful visitor notices. Each one also costs a little reverence.
- **Fix:** delete them. Replace functional icons with a hairline rule, a numeral, or nothing.

### 7. ⚡ Copy written for crawlers is visible to humans
- **Current:** "Short answers for readers and search engines, with the same information visible on the page as the structured data." · "Hosted by Khyapa Parampara for readers who want an offline copy" · "Version V1.53 | Last Updated: November 7, 2026" · an ebook feature list where the colons dangle (`📥 Free to download : No registration required`, `📄 Direct PDF download :`).
- **Problem:** it breaks the fourth wall in the one place that should feel timeless. The FAQ itself is fine; the meta-commentary about SEO and versions is not.
- **Fix:** keep the FAQ answers, drop the meta sentences; move the version into a single small line, or remove it from the devotional footer entirely.

### 8. ⚡ Three introductions before the first name
- **Current:** h2 "Read, Search, and Sit with Each Name" + subtitle, then h3 "Begin the Sahasranama" + another paragraph, then the search panel, then the cards.
- **Problem:** two headings and two paragraphs explaining that you can read names — before any name. It is the purest form of "landing page thinking" applied to a book.
- **Fix:** let the first name appear within the first screen of the reader; use one short line to introduce the set.

### 9. 💡 Details that undercut the craft
- A stray `</script>` at the end of `index.astro` (L661).
- `body { background-attachment: fixed }` with a 190–317 KB image — janky on mobile, and the shrine vanishes after the hero anyway.
- The hero image is preloaded twice (preload + inline critical CSS) and then covered by two overlays.
- "1000 Names" in the title vs 1,072 in the data, never reconciled in the hero.
- The floating nav button (a 56px gold/red circle) overlaps content and is the only affordance with a halo.

## Quick wins (if only one afternoon is available)

1. Show Devanagari + IAST + one-line meaning by default in each card.
2. Raise mobile body to 17px and stop using crimson for small text.
3. Remove the emoji icons and uppercase kickers; keep the copy.
4. Cut the hero to one line, one button, one image.
5. Adopt `reference.css` as the single system and restyle the landing page inside it.

## What the redesign has to solve

- **Make the name itself the visual event** — the Devanagari is the only asset this site has that no template can fake.
- **Design the recitation rhythm** — 11 names, 98 sets, progress through them, without turning it into a progress bar.
- **One system for both worlds** — the reader and the reference pages must feel like the same book.
- **Use the photo as a sacred object, not as wallpaper.**
- **Mobile first, long-session legible** — most visitors arrive on a phone and stay for a while.
