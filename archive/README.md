# Archive folder

This folder contains duplicate site builds, raw data exports and historical files that were moved out of the repository root for clarity while preserving git history.

- `duplicates/` — Duplicate root site files (index, app, styles, images and datasets)
- `mahakali_site/` — Another site build (moved here for backup)
- `mahakali1000nameswebsite/` — Raw exports and intermediate files (big text files)
- `kalabhairava/` — Unrelated `kalabhairava` files moved for safekeeping

These were archived to keep the repository clean and make `site/` the canonical production folder.

If you need any file restored, use `git mv` to move it back, or review history with `git log -- archive/`.
