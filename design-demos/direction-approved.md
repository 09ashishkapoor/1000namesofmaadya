# Direction approved

**Project:** 1000namesofmakali.com — Maa Ādya Mahākālī Sahasranāma
**Date:** 2026-11-13

## What was shown

Three complete directions, each with a working prototype, desktop and phone screenshots:

| # | Direction | Prototype | Screens |
|---|---|---|---|
| 01 | The Ring of Names (Sugiura) | `dir-1.html` | `review/d1-1440.png`, `review/m-final-d1.png` |
| 02 | The Pothi (Irma Boom) | `dir-2.html` | `review/d2-1440.png`, `review/m-final-d2.png` |
| 03 | The Study Page (Sefaria) | `dir-3.html` | `review/d3-1440.png`, `review/m-final-d3.png` |

Plus six candidate thumbnails (`thumbs.html`) and the three unbuilt alternates (Darshan, Name Gallery,
Practice Index).

## The choice, in the user's words

> "i really like option2. if i choose it can the full website be changed to that style. not just the
> main landing page"

**Direction 02 — The Pothi** is approved as the visual system for the **whole site**, not only the
landing page. Secondary question in the same message: full-site coverage.

## What was produced to answer it

- `pothi-system.css` — one shared stylesheet (tokens, type scale, components) for reader, name pages and reference pages.
- `pothi-name-page.html` — `/names/kali/` in the system (long-form reading template).
- `pothi-range-page.html` — `/names/1-100/` in the system (100-row reference template, real data).
- `POTHI-SYSTEM.md` — page-by-page mapping, technical changes, effort, risks.

## Standing approvals

- Direction 02 approved; the 01 and 03 prototypes stay in `design-demos/` as reference only.
- **Night-reading selector approved.** The user's words: *"add the selector please"* (2026-11-13).
  It ships as a required component of every template, not an optional extra.
- The user has **not** yet approved building into the Astro app; the next step is confirmation to start
  implementation (or to review the two extra templates first).

## Night reading (added after the approval)

- `pothi-theme.js` — the shared control (event delegation, persistence, system-follow, labels).
- Pre-paint script in every template's `<head>` so the stored choice applies before first paint.
- Verified on the reader, the name page and the range page: click, keyboard, persistence, both themes,
  no console errors, no text under 4.5:1 in night mode at 1440 and 375.
