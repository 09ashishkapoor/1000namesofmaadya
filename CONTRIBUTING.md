# Contributing

Thanks for helping improve this site. A few rules and tips to avoid accidental breakage:

1. Canonical deploy branch
   - `main` is the canonical deploy branch. Cloudflare Pages publishes from `main`.

2. Make changes via pull requests
   - Create a feature branch and open a PR against `main` for review.
   - The repository includes an auto-version workflow that runs on pushes to `main`.

3. Project structure
   - `src/pages/index.astro` is the Astro page template (source of truth for HTML).
   - `public/` contains static assets served as-is. Minified files are the production versions.
   - `scripts/` contains data processing and utility scripts.
   - Run `npm run dev` to preview locally, or `npm run build` to produce the static output in `dist/`.

4. Large/Raw data and archive
   - Keep raw exports and large intermediate files out of the repo. Do not commit very large binaries to the main history.

5. If the site breaks
   - Open a PR with the fix and reference the failing deployment logs.
   - If urgent, contact a repository maintainer to push a hotfix branch/merge.

Thanks — small, deliberate changes keep the site stable for everyone.
