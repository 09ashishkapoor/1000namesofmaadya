# Polish log — three directions

Method: `design-demos/_tools/shot.mjs` (Playwright + local Chrome) for 1440×900 and 375×812 full-page
shots, `_tools/eshots.mjs` for element crops at 2×, `_tools/audit.mjs` for contrast / small text /
touch targets / emoji / horizontal overflow, `_tools/test_interactions.mjs` for expand · search · set
navigation · console errors.

`polish.py shot` requires Python Playwright, which is not installed in this runtime, so the
screen-by-screen pass was done with the scripts above; the same checks were run by hand.

## Direction 1 — The Ring of Names

**Round 1 — worst three**
1. Nav links rendered in browser-default blue — the whole header read as unstyled. → `a{color:inherit}` + explicit nav colour.
2. A 72px hole between the section head and the reading column — the grid `gap` was applying to rows as well as columns. → `column-gap` only, `row-gap:0`.
3. The 98-arc ring read as a braided dash circle, with the active arc sitting off 12 o'clock. → arc gap 0.004 → 0.0016, half-step rotation, two faint inner guide rings.

**Round 2**
4. The aside's mini-ring with a photo inside looked like a loading spinner. → replaced by a 98-mark progress matrix that shows where the set sits.
5. Mobile: nav overflowed and the search field collapsed to ~90px. → nav trimmed to two items at ≤720px, search stacks with its count.

**Final audit** — contrast failures: none at 1440 or 375 · horizontal overflow: 0 · emoji: none · console errors: none · interactions: expand ✓, search 6 of 11 ✓, next set → names 12–22 ✓.

## Direction 2 — The Pothi

**Round 1 — worst three**
1. The frontispiece was absolutely positioned over the left leaf and covered the spread. → rebuilt as a duotone strip inside the leaf.
2. The reading page ran ~900px tall, so the spread lost its balance and the left leaf floated in empty paper. → note truncated at a sentence boundary with an ellipsis + "Read the full note"; page foot anchors the folio.
3. Paper-on-paper (leaves #f6efdd on #efe5cf) read flat. → darker desk ground (#ddcfb2) and a deeper shadow, so the spread reads as an object.

**Round 2**
4. Gold folio numerals (3.1:1) and ash captions on the desk (3.9:1) failed contrast. → gold #a9853f → #775a21, ash #6d6250 → #5b5142, cinnabar #a5301f → #9c2b1c.
5. The frontispiece caption measured 1.43:1 over the light sky. → gradient scrim behind the caption.
6. Contents leaders rendered as a solid rule. → radial-gradient dot leader.

**Final audit** — contrast failures: none at 1440 or 375 · overflow: 0 · emoji: none · console errors: none · interactions: page switches on name click ✓, search 6/11 with accent-insensitive matching ✓, thumb index on mobile ✓.

## Direction 3 — The Study Page

**Round 1 — worst three**
1. The entry grid stretched the title block to 1071px with the seal marooned at the far right. → entry capped at 1000px with a 720px text column.
2. Eleven identical "Meaning note" buttons at full size added a second column of CTAs. → 11.5px muted inline control, tighter segment rhythm.
3. No set navigation at all on mobile (the rail is hidden). → fixed bottom bar (set 01 / 98, prev, next) + full-width search row.

**Round 2**
4. `--mute` at 2.95:1 on white was used for segment numbers, the "Meaning note" control, and the rail hints. → #6d6459 (5.5:1).
5. The 98 ticks were 15×8px click targets. → visual progress only (`aria-hidden`), with the jump field and the set buttons as the accessible path.
6. Disabled prev/next at 1.9:1 — kept; disabled controls are exempt and the state reads correctly.

**Final audit** — contrast failures: only the disabled "prev" control (exempt) · overflow: 0 · emoji: none · console errors: none · interactions: note expand ✓, search 6/11 ✓, set nav (rail + mobile bar) ✓.

## Cross-direction checks

| Check | D1 | D2 | D3 |
|---|---|---|---|
| Devanagari + IAST + meaning visible without a click | ✓ | ✓ (name + IAST in list, meaning on the page) | ✓ |
| Body ≥16px on mobile | ✓ 16.5–17 | ✓ 17.5 | ✓ 17–17.5 |
| Contrast ≥4.5:1 for all active text | ✓ | ✓ | ✓ (disabled control excepted) |
| No emoji icons | ✓ | ✓ | ✓ |
| No horizontal overflow at 375 | ✓ | ✓ | ✓ |
| Set of 11 is visible as structure | 98-arc ring + matrix | left leaf list + fore-edge | rail ticks + mobile set bar |
| Photo used | ring aperture | duotone frontispiece | small seal + plaque |
| Console errors | 0 | 0 | 0 |

Note: `design_lint.py check / compare` also needs Python Playwright and could not run here; the
equivalent checks (contrast, small type, touch targets, emoji, overflow, screenshot comparison of
the three skeletons) were run with the scripts above and by eye on native-resolution crops.

## Responsive pass (phones)

Checked at **320 · 360 · 375 · 390 · 414 · 768** with _tools/responsive.mjs (document width vs
viewport, elements past the right edge, clipped text, fixed-bar vs body padding) and
_tools/mobile_test.mjs (expand, search, set navigation, console errors).

Found and fixed:

| # | Problem | Direction | Fix |
|---|---|---|---|
| 1 | **No search on phones** — the field lived in the desktop-only left leaf | 2 | Added a mobile set index: 2-column list of the eleven names with its own search and match count; tapping a name turns the page and scrolls it into view |
| 2 | Header wrapped at 320 (`THE BOOK / WHY RECITE` on two ragged lines) | 2 | Nav keeps Contents + PDF ≤640, PDF only ≤359; brand white-space:nowrap |
| 3 | Sticky header ate ~200px of the viewport | 3 | Bar is static on phones; the fixed bottom set bar owns navigation |
| 4 | “Meaning note” was an 87 × 16 tap target | 3 | Hit area expanded to ~42px with a pseudo-element, type size unchanged |
| 5 | Drop cap read as a stray indent at 375 | 2 | Drop caps off below 640px |
| 6 | Search placeholders truncated at 320 | 1, 3 | Shortened to “a name or a meaning…” / “Search a name or a meaning” |
| 7 | Nav links were 18–20px tall | 1, 3 | Inline-flex with min-height:44px |

Result: **no horizontal scroll, no clipped text and no console errors at any of the six widths**;
expand, search and set navigation all work at 375 with touch input. Screenshots:

eview/m-view-d1.png, 
eview/m-view-d2.png, 
eview/m-view-d3.png,

eview/m-view-d2-reader.png, 
eview/mobile-board.png.

## Pothi system pass (after direction 02 was chosen)

Built two more templates on the approved system so full-site coverage is visible rather than promised:

- pothi-name-page.html — /names/kali/: Devanagari h1 at 118px, IAST in cinnabar, a two-column
  meaning panel (prose + spelling table), elaboration in a 62ch measure with drop cap and section
  heads, position folio, previous/next name pager, see-also list, sources panel. Real copy from the
  dataset; no invented text.
- pothi-range-page.html — /names/1-100/: Devanagari numeral title (१–१००), 11 range tabs, a
  100-row two-column index (number · Devanagari · IAST · meaning) from real data, next-range pager.
- pothi-system.css — the single stylesheet both share.

Fixed during this pass: mobile header wrapping (brand + nav on two rows), range tabs as a 4-column
grid on phones, drop cap off on phones, folio hidden on phones, the empty right half of the meaning
panel (now a prose + table grid), and the 34px thumb index replacing 11 full-height fore-edge bands.

Verified: no horizontal overflow and no console errors at 320 / 375 / 768 / 1440 on both templates.
