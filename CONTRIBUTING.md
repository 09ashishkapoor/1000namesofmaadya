# Contributing

Thanks for helping improve this site. A few rules and tips to avoid accidental breakage:

1. Canonical deploy branch
   - `main` is the canonical deploy branch. Cloudflare Pages publishes from `main`.

2. Make changes via pull requests
   - Create a feature branch and open a PR against `main` for review.
   - The repository includes a validation workflow that runs on pushes and PRs to `main`. Wait for it to pass before merging.

3. What the validation workflow checks
   - Presence of: `index.html`, `app.js`, `styles.css`, `navigation.js`, `navigation.css`, `sahasranama_meanings.json`, `sw.js`.
   - That `sw.js` doesn't reference `assets/` precache entries (these caused prior breakage).
   - That `_headers` entries start with a leading `/`.

4. Working with `sw.js`
   - If your workflow regenerates `sw.js`, ensure the precache entries are generated from the final build output and reference files that will be present in the repo root.
   - Test locally by serving the repository root (example: `python -m http.server 8080`) and browsing before opening a PR.

5. Large/Raw data and archive
   - Keep raw exports and large intermediate files in `archive/` or external storage. Do not commit very large binaries to the main history.

6. If the site breaks
   - Open a PR with the fix and reference the failing deployment logs.
   - If urgent, contact a repository maintainer to push a hotfix branch/merge.

Thanks — small, deliberate changes keep the site stable for everyone.
