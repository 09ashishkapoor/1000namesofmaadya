# ॥ Maa Ādya Mahākālī Sahasranāma ॥

[![Live Site](https://img.shields.io/badge/Live%20Site-1000namesofmakali.com-crimson?style=flat-square)](https://1000namesofmakali.com/)
[![Public Repo](https://img.shields.io/badge/Public%20Repo-GitHub-181717?style=flat-square&logo=github)](https://github.com/09ashishkapoor/1000namesofmaadya)
[![Built with Astro](https://img.shields.io/badge/Built%20with-Astro-FF5D01?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

A live devotional website for reading and studying the **1,072 sacred names of Maa Ādya Mahākālī** with English meanings and elaborations.

- **Live website:** [https://1000namesofmakali.com/](https://1000namesofmakali.com/)
- **Public repository:** [https://github.com/09ashishkapoor/1000namesofmaadya](https://github.com/09ashishkapoor/1000namesofmaadya)

---

## About

This project exists to support devotional reading and spiritual study of the Maa Ādya Mahākālī Sahasranāma. It is designed as a calm, mobile-first reading experience for returning devotees and first-time readers who want to move through the names with focus and reverence.

The site is static, fast, searchable, and open source. It requires no backend API at runtime.

---

## Features

- **1,072 sacred names** with English meanings and detailed elaborations
- **Searchable reader** for finding names or meanings quickly
- **Reading pagination** in sets of 11 names for slower devotional pacing
- **Expandable name cards** for short meanings and longer notes
- **Static names reference pages** at `/names/` for SEO, sharing, and no-JavaScript access
- **Mobile-first interface** with large touch targets and resilient text wrapping
- **Devotional visual system** documented in `PRODUCT.md`, `DESIGN.md`, and `DESIGN.json`
- **Offline/cache support** through a service worker
- **Validation baseline** with unit tests, Playwright smoke tests, accessibility checks, visual snapshots, and performance budgets
- **Static deployment** suitable for Cloudflare Pages or any static host

---

## Tech Stack

| Layer     | Technology                                       |
| --------- | ------------------------------------------------ |
| Framework | [Astro](https://astro.build) static output       |
| Runtime   | Vanilla JavaScript ES modules                    |
| Styling   | Plain CSS with OKLCH design tokens               |
| Data      | Static JSON chunks in `public/data_chunk_*.json` |
| Testing   | Node.js regression tests + Playwright            |
| CI        | GitHub Actions validation and link checking      |
| Hosting   | Cloudflare Pages                                 |

---

## Project Structure

```text
├── src/
│   ├── lib/staticNames.js          # Static names-page data helpers
│   └── pages/
│       ├── index.astro             # Main interactive reader
│       └── names/                  # Static names reference pages
├── public/
│   ├── app.js                      # Reader/search/pagination logic
│   ├── navigation.js               # Floating navigation controls
│   ├── search.js                   # Search implementation
│   ├── styles.css / styles.min.css # Main visual system CSS
│   ├── data_chunk_1-6.json         # Chunked names dataset
│   ├── data_manifest.json          # Chunk metadata
│   ├── mahakali_sahasranama_meanings.json
│   ├── sw.js                       # Service worker
│   ├── sitemap.xml
│   └── robots.txt
├── playwright-tests/               # Browser, a11y, visual, and performance tests
├── tests/                          # Node regression tests
├── docs/validation-baseline.md     # Validation policy and update rules
├── PRODUCT.md                      # Product and brand context
├── DESIGN.md                       # Human-readable design system
└── DESIGN.json                     # Machine-readable design sidecar
```

---

## Local Development

### Prerequisites

- Node.js 22 recommended, Node.js 18+ should work for local development
- npm

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open the local URL printed by Astro, usually `http://localhost:4321`.

### Build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

---

## Validation

Run the full local validation suite before opening a pull request:

```bash
npm run validate
```

This runs:

1. Node regression tests
2. syntax checks for Playwright files
3. Astro production build
4. Playwright smoke tests
5. scoped axe accessibility check
6. visual regression snapshots
7. performance budget test

Useful commands:

```bash
npm run test:unit
npm run check:syntax
npm run test:browser
npm run test:browser:update
```

Use `npm run test:browser:update` only when a visual change is intentional, then review changed files in `playwright-tests/visual.spec.js-snapshots/` before committing.

See [`docs/validation-baseline.md`](docs/validation-baseline.md) for the test policy, CI behavior, and snapshot update rules.

---

## Data Notes

- The dataset contains **1,072 entries**.
- The interactive reader pre-renders the first 11 names and progressively loads the rest from chunked JSON.
- `public/data_manifest.json` describes the chunk count and total entry count.
- `public/mahakali_sahasranama_meanings.json` is kept as the full reference dataset.
- Static reference pages under `/names/` make the content available without relying only on client-side JavaScript.

---

## Design System

The current visual direction is documented in:

- [`PRODUCT.md`](PRODUCT.md) — users, purpose, brand personality, anti-references, principles
- [`DESIGN.md`](DESIGN.md) — design-system narrative and tokens
- [`DESIGN.json`](DESIGN.json) — machine-readable sidecar for design tooling

Core design principles:

- Reverent reading first
- Mobile clarity is non-negotiable
- Dark shrine atmosphere, not generic dark SaaS
- Crimson is sacred emphasis, not decoration everywhere
- Gold is blessing and guidance, not sparkle
- No decorative glassmorphism, gradient text, or AI-slop card grids

---

## Contributing

This is a public devotional website and public repository. Corrections and improvements are welcome.

Good contributions include:

- corrections to names, meanings, or elaborations
- accessibility improvements
- performance improvements
- SEO/static-page improvements
- test coverage that protects existing behavior
- documentation improvements

For content corrections, please include a brief explanation and source/context when possible. For larger changes, open an issue or discussion first so the devotional reading experience remains consistent.

Before submitting a pull request:

```bash
npm run validate
```

---

## Deployment

The site builds to static files with Astro:

```bash
npm run build
```

The generated `dist/` directory can be deployed to Cloudflare Pages or any static host. The live production site is:

[https://1000namesofmakali.com/](https://1000namesofmakali.com/)

---

## Dedication

This site is dedicated to GuruShreshta Maa Ādya Mahākālī and to my Guru Shri Praveen Radhakrishnan and Khyapa Parampara.

> Jai Ma Krishna  
> Jai Mā Ādya Mahākālī  
> Jai Kālabhairava

---

## License

This project is open source under the [MIT License](LICENSE).
