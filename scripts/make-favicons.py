#!/usr/bin/env python3
"""Regenerate the favicon set from the shared Adya Kali mark.

Art source: seo/assets/favicon-master.png (512x512), a colour-boosted square
crop of 1111.jpg - the same frontispiece art used across the Adya Kali sites.
The dark, high-contrast crop stays readable at 16px, which the pale
MaaAdyaKali_5.webp frontispiece did not.

Why this script exists: the previous markup pointed <link rel="icon"> at a
WebP file. Chrome, Safari and the Google Search favicon crawler do not accept
WebP favicons, so search results showed a broken/blank icon.

Outputs (all in public/):
  favicon.ico          16/32/48 multi-resolution ICO (legacy + /favicon.ico)
  favicon-32.png       32x32   browser tab
  favicon-48.png       48x48   Google Search requires a multiple of 48px
  favicon-96.png       96x96   high-DPI tab / bookmark
  favicon-192.png      192x192 Android home screen
  favicon-512.png      512x512 Android splash / PWA
  apple-touch-icon.png 180x180 iOS home screen

Usage: python scripts/make-favicons.py
"""

from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
SOURCE = ROOT / "seo" / "assets" / "favicon-master.png"

MASTER = 512
ICO_SIZES = (16, 32, 48)
PNG_SIZES = (32, 48, 96, 192, 512)
APPLE_SIZE = 180


def load_master() -> Image.Image:
    """Square, opaque RGB master. iOS turns transparent pixels black."""
    src = Image.open(SOURCE).convert("RGB")
    if src.width != src.height:
        side = min(src.size)
        left = (src.width - side) // 2
        top = (src.height - side) // 2
        src = src.crop((left, top, left + side, top + side))
    if src.width != MASTER:
        src = src.resize((MASTER, MASTER), Image.LANCZOS)
    return src


def resize(master: Image.Image, size: int) -> Image.Image:
    icon = master.resize((size, size), Image.LANCZOS)
    if size <= 48:
        # Downsampling softens edges; a light unsharp pass keeps the face.
        icon = icon.filter(ImageFilter.UnsharpMask(radius=0.6, percent=80, threshold=1))
    return icon


def main() -> None:
    master = load_master()

    for size in PNG_SIZES:
        resize(master, size).save(PUBLIC / f"favicon-{size}.png", optimize=True)

    resize(master, APPLE_SIZE).save(PUBLIC / "apple-touch-icon.png", optimize=True)

    # ICO with 16/32/48 frames. Largest frame is the base image, the rest are
    # appended; Windows and Chrome pick the closest match.
    frames = [resize(master, size) for size in ICO_SIZES]
    frames[-1].save(
        PUBLIC / "favicon.ico",
        format="ICO",
        sizes=[(s, s) for s in ICO_SIZES],
        append_images=frames[:-1],
    )

    for name in ("favicon.ico", "apple-touch-icon.png", *(f"favicon-{s}.png" for s in PNG_SIZES)):
        path = PUBLIC / name
        print(f"{name:<22} {path.stat().st_size:>7} bytes")


if __name__ == "__main__":
    main()
