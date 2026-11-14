# Port plan — bhairavakalikenamosthute.com

Audited 2026-11-13. This is **not** a "would this style suit that site" question: the site is the same
product at an earlier stage of the same template. The redesign carries over almost entirely as a
theme plus a content/config layer.

## What the site actually is today

| | bhairavakalikenamosthute.com | 1000namesofmakali.com |
|---|---|---|
| Stack / template | same (data manifest + chunks, `/names/` hub, range pages, name pages) | same |
| Names in the dataset | **1,000** (5 chunks × 200) | 1,072 |
| Sets of eleven | **91** (90 full + a final set of 10) | 98 (97 + 5) |
| Name pages | 935 unique (`/names/bhairavaya/`) | 1,039 |
| Range pages | 10 (`/names/1-100/` … `/names/901-1000/`) | 11 |
| Reader | ASCII name + meaning + elaboration; sets of 11 | same |
| Devanagari + IAST per name | **yes, in the build mapping** — e.g. `भैरवाय` · `Bhairavāya` · common `Bhairava` · source `BHAIRAVAAYA` | yes |
| Guide pages (108, PDF, lyrics, benefits) | **none** | five |
| About / contact / privacy | **none** (only `/sources/`) | yes |
| 404 | **none — unknown paths return the homepage with 200** | 404 page |

`/names/bhairavaaya/` (typo) returned the full homepage with HTTP 200. That is a soft-404: every
mistyped or truncated URL becomes a duplicate of `/`. Fix it in the same pass — a static host rewrite,
not a design decision.

## Why the Pothi fits without rethinking anything

The four things the system needs are all present:

1. **Devanagari + IAST + common spelling + source transliteration** per name (verified on
   `/names/bhairavaya/`).
2. **A numbered sequence**: 1,000 names, ranges of 100, sets of 11 in the reader.
3. **Long-form English** per name (one line + elaboration paragraphs).
4. **A devotional image** (the Kalabhairava statue, same treatment as the Maa Ādya image).

So the same fix applies: **render Devanagari + IAST from the build mapping in the reader** instead of the
ASCII-only runtime chunks. That is the whole point of the redesign and it is available on this site too.

## Mapping: current page → Pothi template

| Route | Today | Pothi template | Notes |
|---|---|---|---|
| `/` | God. 1,072 names + 5 chunks | Reader (same as the parent) | 91 sets, derived from the total — do not hardcode 98 |
| `/names/` | hub of ranges | Range/hub template | 10 ranges |
| `/names/1-100/` … | 100-row table | Range page | 935 name links |
| `/names/[name]/` | title + meaning + elaboration | Name page | Devanagari as `h1`, IAST beneath |
| `/sources/` | source note | Text template | |
| — | missing | Guide template (optional) | only if 108/PDF pages are planned here |
| — | missing | 404 | add a real 404 |

## What changes per site (theme + config)

`theme-kalabhairava.css` holds the tokens. Because both brands are already crimson / ink / gold, it
starts identical to the parent — its job is to be the *one* place the sister site can diverge, not to
differ for the sake of it. Per-site content that must be edited in the templates:

- wordmark ॐ · कालभैरव सहस्रनाम / Kalabhairava Sahasranama
- counts 1,000 / 91 sets (the reader prototype hardcodes 98 for the parent)
- the dedication and guru line from this site's own footer
- the frontispiece image
- navigation: no 108 / PDF / lyrics / benefits links unless those pages are built

## Effort

| Step | Work | Time |
|---|---|---|
| 1 | Theme file + config (wordmark, counts, nav) | 0.5 day |
| 2 | Reader wired to this site's mapping (Devanagari + IAST) | 1 day |
| 3 | Name + range + hub templates onto the system | 0.5 day (same code as parent) |
| 4 | `/sources/` text page + real 404 | 0.5 day |
| 5 | Both themes, 320/375/1440 checks, visual snapshots | 0.5 day |
| **Total** | | **~3 days** — after the parent site ships |

If the two sites share one codebase (recommended), steps 2–3 are **zero extra work** — they are the
same components with different data. That is the argument for a shared repo: the second site becomes a
config, not a project.

## Recommendation

**Do not fork.** After the parent build lands, make the codebase take a site config:

```
sites/
  maadya/       brand tokens, data chunks, name-mapping, copy constants, guide pages
  kalabhairava/ brand tokens, data chunks, name-mapping, copy constants, no guide pages
```

The Astro pages read the active site's config; the CSS is `pothi-system.css` + one theme per site.
Both deploy from the same repo. A fork would drift within a month — that is exactly how the parent site
ended up with two design systems.

## Open questions

1. **Shared codebase or a one-off copy?** Shared is ~1 extra day up front and saves ~2 days here, plus
   every future change.
2. **Does the Kalabhairava text have Devanagari for all 1,000 names?** The name pages show it, so the
   mapping exists — but confirm coverage (spots, variants) before promising the reader.
3. **Do you want the guide/PDF pages on this site too?** If not, the nav drops those items.
