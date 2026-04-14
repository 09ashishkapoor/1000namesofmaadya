# ॥ Maa Ādya Mahākālī Sahasranāma ॥

[![Live Site](https://img.shields.io/badge/Live%20Site-1000namesofmakali.com-crimson?style=flat-square&logo=cloudflare)](https://1000namesofmakali.com/)
[![Built with Astro](https://img.shields.io/badge/Built%20with-Astro-FF5D01?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

A devotional, bilingual web experience presenting all **1,072 sacred names** of Maa Ādya Mahākālī — the primordial form of the Divine Mother — with detailed meanings and spiritual elaborations in both English and Hindi (Devanāgarī).

---

## Live Site

**[https://1000namesofmakali.com/](https://1000namesofmakali.com/)**

---

## Features

- **1,072 Complete Names** — every name with full elaboration and meaning
- **Bilingual Content** — toggle between English and Hindi (Devanāgarī script)
- **Fast Client-Side Search** — find any name or meaning instantly
- **Chunked JSON Loading** — large dataset split across multiple files for fast initial load
- **Responsive Design** — works on desktop, tablet, and mobile
- **Glassmorphism UI** — dark divine aesthetic with smooth animations
- **Quick Navigation** — scroll-to-top/bottom controls and smooth paging
- **Static Build** — zero server-side runtime; hosted on Cloudflare Pages
- **SEO-Ready** — structured metadata, sitemap, and `robots.txt`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Astro](https://astro.build) (static output) |
| Deployment | Cloudflare Pages |
| Scripting | Vanilla JavaScript (ES modules) |
| Styling | Plain CSS with custom properties |
| Data | Static JSON (`public/data_chunk_*.json`) |
| Testing | Node.js regression scripts + Playwright validation baseline |

---

## Project Structure

```
├── src/
│   ├── layouts/          # Shared Astro layout components
│   └── pages/
│       └── index.astro   # Main page template and markup
├── public/
│   ├── app.js / app.min.js         # Core application logic
│   ├── navigation.js / *.min.*     # Navigation controls
│   ├── styles.css / *.min.css      # Stylesheets
│   ├── data_chunk_1-6.json         # Chunked name dataset (1,072 entries)
│   ├── data_manifest.json          # Chunk index for progressive loading
│   ├── mahakali_sahasranama_meanings.json  # Full dataset (reference)
│   ├── translations.js             # Language toggle logic
│   ├── sitemap.xml                 # SEO sitemap
│   └── robots.txt                  # Crawler rules
├── scripts/
│   └── bump-version.js             # Version bump utility
└── tests/
    ├── navigation.test.js          # Navigation behaviour checks
    └── ux-structure.test.js        # UI structure assertions
```

---

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser.

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

---

## Validation

### Run the full local validation suite

```bash
npm run validate
```

This runs:
- existing Node.js regression tests
- syntax checks for the validation files
- Astro production build
- Playwright smoke, accessibility, visual, and performance checks

### Playwright-only commands

```bash
npm run test:browser
npm run test:browser:update
```

Use `npm run test:browser:update` only when an intentional UI change requires refreshed visual baselines. Review the changed snapshot files before committing them.

### CI validation

GitHub Actions now runs:
- **browser validation on Windows** for Playwright + visual baseline parity
- **link checking with Lychee** for `README.md`, the built home page, and the sitemap

See [`docs/validation-baseline.md`](docs/validation-baseline.md) for the standardized pattern, reuse guidance, and snapshot update rules.

---

## Data Notes

- The dataset contains **1,072 entries** — each with a Sanskrit name, transliteration, English meaning, Hindi meaning, and a full spiritual elaboration.
- Data is split into six chunks (`data_chunk_1.json` – `data_chunk_6.json`) indexed by `data_manifest.json`. This keeps the initial page load fast while the full ~13 MB dataset loads progressively.
- All data files are checked into `public/` so the static build is fully self-contained and requires no external API.

---

## Contributing

Contributions are welcome. If you notice an error in a name, meaning, or transliteration, please open an issue or submit a pull request with the correction and a brief explanation.

For larger changes (design, features), please open an issue first to discuss the approach.

---

## Dedication

This site is dedicated to GuruShreshta Maa Ādya Mahākālī and My Guru Shri Praveen RadhaKrishnan.

> *"Jai Ma Adya Mahakali, Jai Kalabhairava baba , Jai Ma Krishna,*
> *Jai Khyapa Parampara"*

---

## License

[MIT](LICENSE)
