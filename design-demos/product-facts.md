# Product facts (verified before design work)

Checked 2026-11-13 against the live site (https://1000namesofmakali.com/), the local
source in this repo, and the shipped data files.

| Fact | Value | Source |
|---|---|---|
| Names in the dataset | **1,072** | `public/data_manifest.json`, `public/data_chunk_*.json` (6 chunks, 200 per chunk) |
| Unique name pages | **1,039** | `src/data/name-mapping.json` → `pageGroups` |
| Reader page size | **11 names** per page | `public/app.js` L69 `pageSize: 11` |
| Full sets of 11 | 97 sets of 11 + a final set of 5 = **98 sets** | 1,072 ÷ 11 = 97.45 |
| Per-name fields available | Devanagari, IAST, common spelling, simple spelling, variants, meaning, elaboration, slug | `src/data/name-mapping.json` |
| Per-name fields available **at runtime in the reader** | uppercase ASCII name, one-line English meaning, English elaboration only | `public/data_chunk_1.json` keys: `index, english_name, english_one_line, english_elaboration` |
| Landing page design system | `public/styles.css` — shrine black `#0a0a0a`, crimson `#dc143c`, gold `#ffd700`, system sans + Georgia | `public/styles.css` |
| All other pages design system | `public/reference.css` — temple maroon `#8b2635`, gold `#e8c468`, Crimson Text + Philosopher + Noto Sans Devanagari | `public/reference.css` header comment |
| Devanagari font on landing page | none (the only Devanagari glyph rendered is the footer ॐ) | grep of `styles.css` / `index.astro` |
| Devanagari font on reference pages | `Noto Sans Devanagari` | `reference.css` L843 |
| Free asset images | `MaaAdyaKali_5.webp` (1920×1080, statue with hibiscus, diya, storm sky), `maadya-bg-1111-landscape.webp`, `maadya-bg-1111-portrait.webp` | `public/` |
| PDF edition | 68 pages, 2.57 MB, Devanagari + English | `README.md`, `public/downloads/` |
| Brand constraints | red and black are important, used with restraint; must not feel like SaaS / social / occult shock / luxury gloss | `PRODUCT.md` |

## Text I will reuse verbatim in the prototypes (no invented copy)

- Name 1: श्मशान कालिका · Śmaśāna Kālikā — "The Dark-bodied Goddess of the Cremation Ground, the Power of Death and Dissolution."
- Name 2: काली · Kālī — "The Black Goddess, Ruler of Time."
- …(names 1–11 with Devanagari, IAST and one-line meanings extracted to `design-demos/_tools/names-1-11.json`)
- "Maa Adya Mahakali is revered as the primordial source: the first, original power from which creation unfolds. In this form she is linked with time, change, and the full cycle of arising, sustaining, and dissolving."
- "For many devotees, the Sahasranama is recited as prayer, remembrance, and steady practice. The names are a way of drawing closer to Maa Adya and returning the mind to devotion."
- Chant reasons (titles + one line each): Protection / Facing the Inner Obstacles / Less Fear, More Steadiness / Grace / Awakening.
- Dedication: "Dedicated to Shri Praveen Radhakrishnan and Khyapa Parampara" · "Om Shri Gurubhyo Namaha, Jai Khyapa Parampara"
- Footer mantra: "Jai Ma Krishna / Jai Mā Ādya Mahākālī / Jai Kālabhairava"

## Number tension worth designing for

The brand says "1000 Names"; the text has **1,072**. The site explains the 1,008 vs 1,072
question on a subpage but the hero never resolves it. Any redesign should state the count
honestly and use it as structure (98 sets of 11), not hide it.
