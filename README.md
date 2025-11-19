
> NOTICE: This repository was cleaned up — the canonical, production-ready website is now under the `site/` folder.
> Duplicate site builds and raw exports were moved to `archive/`. See `archive/README.md` for details.

# ॥ Maa Ādya Mahākālī Sahasranāma ॥

A beautiful, interactive website displaying the 1,072 sacred names of Maa Ādya Mahākālī with detailed meanings and elaborations in both English and Hindi.

## ✨ Features

- **1,072 Complete Names** - All names with comprehensive elaborations
- **Bilingual Support** - Toggle between English and Hindi
- **Beautiful Design** - Glassmorphism UI with divine imagery
- **Smooth Navigation** - Quick scroll to top/bottom with elegant buttons
- **Responsive Layout** - Works perfectly on all devices
- **Search Functionality** - Find names easily
- **Dark Theme** - Easy on the eyes with divine aesthetics

## 🚀 Live Website

Visit: **https://09ashishkapoor.github.io/1000namesofmaadya/**

**Developer notes:**

- Canonical deploy branch: `main`. Cloudflare Pages is configured to publish from `main`.
- CI Validation: A GitHub Action (`Validate Site Build`) runs on pushes and PRs to `main` and will fail if required files are missing or if `sw.js` contains precache entries for non-existent `assets/` paths.
- How to update the site safely:
	1. Make changes on a feature branch and open a PR against `main`.
	2. Ensure the validation workflow passes on your PR (it checks `index.html`, `app.js`, `styles.css`, `navigation.*`, `sahasranama_meanings.json`, and `sw.js`).
	3. If you regenerate `sw.js`, make sure the precache list references only files present in the repo root.
	4. After merge, Cloudflare Pages will redeploy automatically.

If you're uncertain, open a PR and ask for a quick review before merging.

## 📁 Files

- `index.html` - Main webpage
- `app.js` - Application logic and data loading
- `styles.css` - Main styling
- `navigation.js` - Navigation controls
- `navigation.css` - Navigation styling
- `mahakali_sahasranama_meanings.json` - Complete dataset (1,072 names)
- `MaaAdyaKali_5.png` - Divine background image

## 🌐 Local Development

1. Clone the repository:
```bash
git clone https://github.com/09ashishkapoor/1000namesofmaadya.git
cd 1000namesofmaadya
```

2. Start a local server:
```bash
python -m http.server 8080
```

3. Open in browser:
```
http://localhost:8080
```

## 📊 Data Quality

- **Total Entries**: 1,072
- **Complete Elaborations**: 100%
- **Bilingual Content**: English + Hindi (Devanagari)
- **JSON Size**: ~13 MB (comprehensive elaborations)

## 🙏 Dedication

This website is dedicated to Maa Ādya Mahākālī and all her devotees seeking to understand her divine names and qualities.

## 📝 License

Created with devotion for spiritual seekers worldwide.
