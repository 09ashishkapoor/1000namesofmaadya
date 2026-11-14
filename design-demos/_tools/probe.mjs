// Probe: fonts actually used, glyph box vs line box, overflow ancestors.
import { createRequire } from 'node:module';
const require = createRequire('C:/Users/kalbhairav/.dsh/profiles/desktop/node_modules/');
const { chromium } = require('playwright');

const url = process.argv[2];
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
const info = await page.evaluate(() => {
  const el = document.querySelector('.nm-name');
  const cs = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  const out = {
    text: el.textContent,
    fontFamily: cs.fontFamily,
    fontSize: cs.fontSize,
    lineHeight: cs.lineHeight,
    fontWeight: cs.fontWeight,
    rect: { w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x), y: Math.round(r.y) },
    fontsReady: document.fonts.status,
    notoLoaded: [...document.fonts].filter(f => f.family.includes('Noto') && f.status === 'loaded').map(f => f.family + ' ' + f.weight),
    garamondLoaded: [...document.fonts].filter(f => f.family.includes('Garamond') && f.status === 'loaded').length,
    clippingAncestors: [],
  };
  let p = el.parentElement;
  while (p && p !== document.documentElement) {
    const s = getComputedStyle(p);
    if (s.overflow !== 'visible' || s.overflowY !== 'visible' || s.contain !== 'none') {
      out.clippingAncestors.push({ tag: p.tagName, cls: p.className, overflow: s.overflow, contain: s.contain });
    }
    p = p.parentElement;
  }
  // measure glyph ink box with canvas
  const cv = document.createElement('canvas');
  const ctx = cv.getContext('2d');
  ctx.font = `500 36px "Noto Serif Devanagari"`;
  const m = ctx.measureText(el.textContent);
  out.ink = { ascent: Math.round(m.actualBoundingBoxAscent), descent: Math.round(m.actualBoundingBoxDescent), width: Math.round(m.width) };
  return out;
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
