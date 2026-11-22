# SEO snapshot — 2026-11-21

Minimal audit note for Lane C (C0). The full Search Console baseline — clicks, impressions, queries,
pages, indexation and links — lives in [`growth-plan.md`](growth-plan.md) §2 and is owned by D1; do not
duplicate or invent numbers here.

## Crawl waste — 90 days to 2026-11-21

GSC crawl stats show **747 requests**, split **81% refresh / 19% discovery**; by file type HTML 53%,
JS 16%, JSON 13%, CSS 10%; by host apex 585 vs www 162 (**22% of the budget**). The www row does not
behave the way `public/_redirects` implies: live probes on 2026-11-21 (`curl -I --max-redirs 0`,
`cf-cache-status: DYNAMIC`) show `https://www.1000namesofmakali.com/`, `/names/`, `/names/kali/` and
`/llms.txt` all returning **200**; only `http://www…` → 301 → `https://www…` (scheme hop) redirects, and
GSC lists `https://www.1000namesofmakali.com/` under "Alternate page with proper canonical tag", not
"Page with redirect". So the host 301 in the repo file is **not honoured on the www custom domain**: www
is a **200 duplicate that depends on the cross-domain canonical**, and the GSC 162 most likely counts the
`http`→`https` scheme 301s before Google's final fetch lands on that 200. The JS+JSON share traces to the
home page (`src/pages/index.astro`), which preloads `/data_manifest.json`, loads `/app.js` and
`/pothi-theme.js`, and registers `/sw.js`; `app.js` then fetches `/name-spine.json` and
`/data_chunk_1..6.json` (~2.0 MB across six chunks, plus a 78 KB spine) once it runs. `sw.js` precaches
the shell plus `data_chunk_1.json` for real visitors, but Googlebot does not run service workers, so the
service worker is unlikely to be the crawl driver — the home page's own subresource requests are. With
81% refresh, the same home-page JS/JSON is simply re-fetched each time Google revisits.

## Recommendation

Fix www at the Cloudflare zone, not in the repo: add a **zone-level Redirect Rule** on the
`1000namesofmakali.com` zone — 301 with expression `http.host eq "www.1000namesofmakali.com"` and
destination `https://1000namesofmakali.com/$1` (preserve path and query) — the same mechanism C5 needs
for `1008namesofmakali.com`. Keep `public/_redirects` for the path redirects that do work (e.g. `/pdf/`
→ `/kali-sahasranama-pdf/`); it cannot enforce the host rule on the www custom domain. After the rule
ships, re-probe `https://www.1000namesofmakali.com/names/` for a 301 to the apex and watch GSC move the
www URL out of alternate-canonical. For JS+JSON, leave offline behaviour alone — no change to `sw.js`,
its `CORE_ASSETS`, or the `/sw.js` registration, and no new dependencies. A future optional win is to
serve the home page's already server-rendered first set of names without the `app.js` JSON fetches (drop
the `data_manifest.json` preload or defer the fetch until interaction); not worth risking the offline
path now.

**Changes made for this audit:** none to `sw.js`, the service-worker registration, or the home-page
reader. This lane's actual edits are the C1 hub deep links and the C3 README link.
