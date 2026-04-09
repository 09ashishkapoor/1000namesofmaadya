# Maa Ādya Mahākālī Sahasranāma

A public Astro website for exploring the 1,072 sacred names of Maa Ādya Mahākālī with English and Hindi meanings, elaborations, and a searchable reading experience.

## Highlights

- 1,072 names with detailed English and Hindi content
- Fast client-side search and browsing
- Responsive layout for desktop and mobile
- Static Astro build with all site assets served from `public/`
- SEO-focused metadata and structured content

## Live Site

Visit the deployed website at:

https://1000namesofmakali.com/

## Tech Stack

- Astro
- Vanilla JavaScript
- HTML and CSS
- Static JSON content in `public/`

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

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Project Structure

- `src/pages/index.astro` - Main Astro page and markup
- `public/` - Static JavaScript, CSS, images, JSON data, and site files
- `scripts/` - Data processing and maintenance utilities
- `tests/` - Structure and navigation checks

## Data Notes

- The core names dataset contains 1,072 entries
- The site includes bilingual content in English and Hindi
- Large data files are checked into `public/` so the site can be rebuilt and served statically

## License

MIT
