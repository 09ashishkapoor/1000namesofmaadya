# Design reference — The Pothi

Approved redesign for **1000namesofmakali.com** (Maa Ādya Mahākālī Sahasranāma), produced 2026-11-13.
This folder is the design record and the implementation input. No production files were changed to
create it.

**Status:** Direction 02, *The Pothi*, is approved by the client — as the system for the **whole site**,
with a required night-reading selector.

## Read in this order

| File | What it is |
|---|---|
| [`BUILD-BRIEF.md`](BUILD-BRIEF.md) | start here to implement; scope, non-negotiables, done criteria |
| [`POTHI-SYSTEM.md`](POTHI-SYSTEM.md) | the system: tokens, components, page-by-page mapping, effort, risks |
| [`NIGHT-MODE.md`](NIGHT-MODE.md) | night reading: palette, control, implementation, what not to do |
| [`direction-approved.md`](direction-approved.md) | what was shown and the client's own words |
| [`review.md`](review.md) | critique of the current site (5.2/10) with measured evidence |
| [`polish-log.md`](polish-log.md) | craft rounds and the mobile pass |

## Working prototypes

Open in a browser from this folder (`file://` works; images resolve to `../public/`).

| File | Route it stands for |
|---|---|
| [`dir-2.html`](dir-2.html) | the reader (`/`) — the approved homepage |
| [`pothi-name-page.html`](pothi-name-page.html) | a name page (`/names/kali/`) |
| [`pothi-range-page.html`](pothi-range-page.html) | a range page (`/names/1-100/`, real 100 rows) |
| [`thumbs.html`](thumbs.html) | six candidate directions (02 is the approved one) |
| [`dir-1.html`](dir-1.html), [`dir-3.html`](dir-3.html) | the two non-chosen directions, kept for reference |

Shared assets: [`pothi-system.css`](pothi-system.css) (one stylesheet for every template) and
[`pothi-theme.js`](pothi-theme.js) (the night-reading control).

The prototypes carry **22 names** (two sets) so search and paging can be felt end to end; production
renders all **1,072**.

## Directories

- `review/` — screenshots and boards: the live site before the redesign, the three directions, the
  day/night pair, the phone check. All taken at 1440×900 and 375×812.
- `refs/` — reference boards for the two "reality reference" directions (Sefaria, Emergence, Irma Boom).
- `_tools/` — the scripts used to produce this folder: Playwright screenshots and audits, data
  extraction, the HTML builders. They hardcode local Playwright paths; adjust before reusing.

## What is *not* here

The production build itself. The implementation brief lists the templates to migrate, the data fields
to use, and the SEO constraints that must survive the change.
