# Owner actions (outside the repo)

Repo-side SEO work is implemented on the `seo/name-pages` branch. These steps need the site owner
because they live in external dashboards or third-party properties. Work top to bottom; steps 1–3
are the highest value.

## 1. Google Search Console (highest priority)

1. Open Search Console → **Add property** → **Domain** → `1000namesofmakali.com`.
2. Add the DNS TXT record it provides in Cloudflare DNS. Because the domain is already on
   Cloudflare, verification is usually immediate.
3. Submit the sitemap: `https://1000namesofmakali.com/sitemap.xml`
   (it now lists 1,061 URLs: home, hub, 11 ranges, 1,039 name pages, landing pages, PDF page).
4. **Bing Webmaster Tools** → "Import from Google Search Console" (one click; Bing feeds Copilot
   and has its own indexing path).
5. After ~1 week, open **Performance → Queries**. This is now the real keyword list — use it to
   decide which name spellings/landing pages need work next.
6. Optional: link GA4 to Search Console (Admin → Product links) so query data also appears in GA4.

## 2. Cloudflare caching for HTML

The plan noted that static HTML is served with `max-age=0, must-revalidate`. For a static article
site, edge caching is free performance:

1. Cloudflare dashboard → **Caching → Cache Rules → Create rule**.
2. Expression: `(http.request.method eq "GET" and not starts_with(http.request.uri.path, "/downloads/"))`
   or simply `http.host eq "1000namesofmakali.com"`.
3. Settings: **Eligible for cache**, **Edge TTL: 1 day**, **Browser TTL: 4 hours** (or "Respect origin"
   after deploying `_headers` changes already in this branch).
4. Keep `/downloads/*.pdf` on the `_headers` rule already committed (1 hour + stale-while-revalidate).
5. Purge cache after deploying the branch, then re-check with `curl -I` that `cf-cache-status: HIT`
   appears on a second request.

## 3. PDF hosting decision (blocks "host the PDF on this domain")

The official designed ebook is **53 MB**, which is above Cloudflare Pages' **25 MiB per-file limit**.
It cannot be committed and deployed as a Pages asset. Options, best first:

- **Cloudflare R2** (recommended): upload the official PDF to an R2 bucket and serve it through a
  custom route such as `/files/...` or `pdf.1000namesofmakali.com`; then point the official ebook
  link on `/kali-sahasranama-pdf/` at the on-domain URL. R2 costs effectively nothing at this size.
- **Compress the PDF** under 25 MB (e.g. Ghostscript `/ebook` preset, or re-render the page images
  to downsampled JPEG) and commit it as `public/downloads/...`.
- **Leave it external** at `files.jaikhyapaparampara.com` (current state). The landing page still
  ranks and converts; the download is simply not on the canonical domain.

Already shipped: a **2.2 MB printable English edition** generated from site data at
`/downloads/kali-sahasranama-names.pdf` (68 pages, selectable text, Devanagari included). It is
rebuildable with `node seo/build-print-pdf.mjs` (needs Chrome/Edge).

## 4. Backlinks and entity consistency

- **GitHub README**: it still points to the old site sections; add the names hub, 108-names page,
  and PDF page URLs. The repo is public and indexed.
- **archive.org items** (`adya-mahakali-sahasranama-kaliputraashish`,
  `adya-mahakali-sahasranama-in-Hindi-kaliputraashish`): update the item description to name the
  companion site and the on-domain printable PDF. Archive.org item descriptions are indexed and
  are a strong entity signal.
- **Instagram bio** (`@ashishkaliputra`): link `1000namesofmakali.com` (or the names hub).
- **YouTube descriptions** (if any) and **jaikhyapaparampara.com**: add the site link.
- **Genuine participation**: Reddit (r/hinduism, r/Shaktism), Quora, devotee forums — answer the
  question first, link the specific name page or the 108-names page only where it genuinely helps.
  Do not drop bare links.
- Keep the same name/description everywhere: **Adya Mahakali 1000 Names**, 1,072 names, English.

## 5. Editorial/content checks only the owner can answer

- Confirm the 108-name page (names 1–108 of the Sahasranama) is acceptable as the site's
  "108 names of Kali" list, or supply a preferred traditional 108-name set.
- Confirm the "official designed ebook" link should stay pointed at
  `files.jaikhyapaparampara.com/AdyaMahakali_1000names_ebook_Final_V4.pdf`.
- Hindi translation remains out of scope because the two-language data was removed as too costly to
  maintain. If it is ever restored, the plan's `/hi/` + `hreflang` work can reuse the existing
  name-spelling mapping, which already carries Devanagari.

## 6. Verification after deploy

- `https://1000namesofmakali.com/names/shmashana-kalika/` loads, has Devanagari, and shows
  "Also spelled" entries.
- `https://1000namesofmakali.com/pdf/` 301-redirects to `/kali-sahasranama-pdf/`.
- `https://1000namesofmakali.com/sitemap.xml` lists 1,061 URLs and includes the landing pages.
- Rich Results Test on a name page: `Article`, `DefinedTerm`, `BreadcrumbList`; on the PDF page:
  `Book`, `FAQPage`.
- Mobile-friendly / Core Web Vitals check on the names hub and a name page after deploy.
