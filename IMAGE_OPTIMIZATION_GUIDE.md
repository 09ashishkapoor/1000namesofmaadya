# Image Optimization Guide

## Background Image (MaaAdyaKali_5.png - 4.4 MB)

### Option 1: Online Conversion (Easiest)
1. Go to https://squoosh.app/
2. Upload `MaaAdyaKali_5.png`
3. Select WebP format
4. Adjust quality to 80-85
5. Download as `MaaAdyaKali_5.webp`
6. Expected size: ~500-800 KB (85% reduction!)

### Option 2: Command Line (If you have tools)
```bash
# Using cwebp (Google's WebP encoder)
cwebp -q 85 MaaAdyaKali_5.png -o MaaAdyaKali_5.webp

# Or using ImageMagick
magick MaaAdyaKali_5.png -quality 85 MaaAdyaKali_5.webp
```

### Update HTML to use WebP with PNG fallback
After conversion, update index.html CSS to use WebP with PNG fallback.

---

## JSON Data File (13 MB)

The JSON file is large but necessary. To optimize:

1. **Minify it** (remove whitespace)
2. **Enable compression** via _headers (already done)
3. **Consider lazy loading** only visible names initially

Expected compression: 13 MB → ~2-3 MB with gzip
