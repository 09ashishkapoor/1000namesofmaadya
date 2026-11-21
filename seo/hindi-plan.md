# Hindi project — the meaning layer, in Hindi

**Status:** proposed, separate from the English SEO project · **Written:** 2026-11-21
**Owner:** Ashish (Kaliputra) · **Related:** [`growth-plan.md`](growth-plan.md) (English SEO)

This is the decision and build brief for bringing the Hindi meanings back. It is written to be picked up
cold by a later session.

---

## 1. The claim, tested

**Claim:** nobody publishes detailed Hindi meanings per name; the Hindi market is real; the content already
exists.

**SERP check, 2026-11-21** (`hl=hi&gl=in`, non-personalized; screenshots in `docs/screenshots/hindi/`):

| Query | What ranks |
|---|---|
| `काली सहस्रनाम अर्थ सहित` | AI Overview with **5 names, one line each**; then a **2011 Blogspot** post with one-line meanings; Ganjbasoda (benefits/paath); Drik Panchang (stotram text); YouTube chants; Scribd PDF |
| `माँ काली के 1008 नाम अर्थ सहित` | Drik Panchang (**list only**, no meanings); the same 2011 Blogspot; Scribd (**184 names** with descriptions); YouTube; Facebook; Bhaktiras ("1111 names", translated) |

Nobody in the top 10 offers a per-name Hindi elaboration. The strongest competitor is a **fifteen-year-old
Blogspot post with one-line glosses**. "People also ask" confirms the intent: *माँ काली के 1008 नाम हिंदी में
क्या हैं?*, *व्याख्या PDF कैसे डाउनलोड करें?*, *फलश्रुति*, *पाठ विधि*, *काली सहस्त्रनाम PDF*.

**Claim: confirmed.** The Hindi SERP is shallow; the depth we hold is genuinely rare there.

## 2. Assets (verified)

- **Hindi elaboration data exists in git.** Deleted in `7eb337d`; recover with:
  `git show 7eb337d^:"mahakali1000nameswebsite/mahakali_sahasranama(1000)_HINDI_withelaborations.txt"`
  — **22,146 lines, ~4.7M chars** (~4,400 chars per name, structured as: name → one-line meaning →
  `व्याख्या/विस्तार (ELABORATION)` → several paragraphs and sub-sections). A `..._CompleteReference.txt`
  (~4.4M chars) also exists at the same revision. The on-site language toggle was removed in `98a786d`.
- **Book:** <https://archive.org/details/adya-mahakali-sahasranama-in-Hindi-kaliputraashish> — **1,191 views,
  1 favourite**, published 2025-12-16 (verified from the page's `InteractionCounter`).
- **PDF:** `https://files.jaikhyapaparampara.com/AdyaMahakali_1000names_ebook_Final_Hindi.pdf` — **28,782,260
  bytes**, served through Cloudflare (`cf-cache-status: HIT`) from R2 (`khepa-library-files` bucket).

## 3. Decision: `/hi/` on the main domain, hub-first

**Do not register a new domain. Do not build a second codebase.**

| Option | Verdict |
|---|---|
| **A. `/hi/` on `1000namesofmakali.com`** | ✅ **Chosen.** Inherits the existing crawl and the 52 links; one deploy, one design system; hreflang handles language targeting. Crawl is the binding constraint (933 English pages waiting, ~1.6 new URLs/day) — a fresh domain starts that queue from zero. |
| B. Repurpose `1008namesofmakali.com` | Rejected for now. It is a full duplicate deployment of this site; keeping it as a 301 (task C5) is the better use. It stays available if Hindi ever earns its own brand — a 301 is reversible. |
| C. Buy a new Hindi domain | ❌ No. New registration, new deploy, zero history, same crawl starvation, more maintenance — for a user whose constraint is time. |

Language targeting does not require a Hindi domain. Devanagari content + `lang="hi"` + `hreflang` is what
matters. A second domain would split the only authority we have.

## 4. Structure (phase 1 = ~14 URLs, not 1,072)

1. `/hi/` — hub: "माँ काली के 1008 नाम — अर्थ सहित". Explains the text, lists the 11 ranges, links the PDF.
2. `/hi/names/1-100/` … `/hi/names/901-1000/` (11 range pages) — one-line Hindi meaning per name, with a link
   to each name's detail page as those ship.
3. Optional: `/hi/108-names/` and `/hi/pdf/` if the Hindi PDF is re-linked.

**Pages stay light.** 100 names × ~4,400 chars = ~440 KB of text on one page — do not do that. Range pages
carry one-line meanings only; the long elaborations go on per-name pages.

**Phase 2 (only after phase 1 earns impressions):** per-name Hindi pages (`/hi/names/<slug>/`) in waves of
100, each with the full elaboration. Those pages are the actual moat — the Hindi equivalent of the English
name pages — and they also give 1,072 long-tail targets ("<नाम> का अर्थ").

## 5. Technical requirements

- `lang="hi"` on Hindi pages; Devanagari titles and descriptions; `og:locale` `hi_IN` (English stays `en_US`).
- `hreflang` pairs: `en` ↔ `hi`, `x-default` → English. Self-referencing canonical on each language page.
- A Hindi sitemap section (`/sitemap-hi.xml` or one sitemap with both), submitted in GSC.
- Reuse The Pothi components; the Devanagari type already exists (Tiro Devanagari Sanskrit / Noto Serif
  Devanagari). No new design system.
- Data pipeline: parse the recovered text into JSON keyed by the existing `src/data/name-mapping.json` slugs,
  validate 1,072 entries, then render. Do not hand-edit 22k lines.

## 6. Measurement (and the PDF-count gap)

- GSC: filter `Page contains /hi/`; track impressions, clicks, position separately from English.
- **The Hindi PDF's download count is not measurable with the Cloudflare CLI.** Verified 2026-11-21:
  `wrangler 4.86.0` is authenticated but exposes no analytics commands; R2 has no per-object counters; the
  OAuth token scopes (`user`, `offline_access`, `k2.read`) do not include analytics. The dashboard's R2
  metrics are aggregate operations, not per-file.
  If a number is wanted: (a) a tiny Worker in front of the PDF that increments a counter (R2/KV), or
  (b) Cloudflare Logpush. Otherwise archive.org's **1,191 views** is the only per-item figure we have.
- Add UTM-free internal links; track via GSC only.

## 7. Non-goals

- No new domain; no second repo.
- No 1,072-page launch.
- Do not machine-translate the English meanings — the Hindi elaborations are the original depth and already
  exist.
- Do not block the English project: this ships after, or independently of, the English crawl work.

## 8. Open questions

1. Devanagari numerals in copy (१,००८) vs Latin (1,008)? Recommend Devanagari in prose, Latin in UI counts.
2. Re-link the existing 28.7 MB PDF as-is, or produce a lighter/split web edition?
3. "1008 नाम" vs "सहस्रनाम" — target both in copy; the SERP shows both.
4. Does the Hindi book page on archive.org need its description updated to link the new `/hi/` hub?

## 9. First three steps

1. Recover and parse the Hindi elaborations; produce `src/data/hindi-names.json` + a validation report
   (count, missing, duplicates).
2. Build `/hi/` + the 11 range pages with one-line meanings and hreflang.
3. Submit the Hindi sitemap; watch GSC for 4–6 weeks before committing to per-name pages.
