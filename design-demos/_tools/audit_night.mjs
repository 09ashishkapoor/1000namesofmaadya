// Night-mode contrast / overflow audit for the three night-enabled files.
import { createRequire } from 'node:module';
const require = createRequire('C:/Users/kalbhairav/.dsh/profiles/desktop/node_modules/');
const { chromium } = require('playwright');

const base = 'file:///C:/Users/kalbhairav/Documents/productionwebsite/1000namesofmaadya/design-demos/';
const files = ['dir-2.html', 'pothi-name-page.html', 'pothi-range-page.html'];
const browser = await chromium.launch({ channel: 'chrome' });

const AUDIT = () => {
  const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(',').map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const contrast = (a, b) => { const l1 = lum(a), l2 = lum(b); const hi = Math.max(l1, l2), lo = Math.min(l1, l2); return (hi + 0.05) / (lo + 0.05); };
  const bgOf = (el) => { let n = el; while (n && n !== document.documentElement) { const cs = getComputedStyle(n); if (cs.backgroundImage && cs.backgroundImage !== 'none') return null; const c = parse(cs.backgroundColor); if (c && c.a > 0.85) return c; n = n.parentElement; } return null; };
  const out = { low: [], wide: document.documentElement.scrollWidth - window.innerWidth };
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (w.nextNode()) {
    const t = w.currentNode.textContent.trim();
    if (!t) continue;
    const el = w.currentNode.parentElement;
    if (!el || !el.offsetParent) continue;
    const cs = getComputedStyle(el);
    const size = parseFloat(cs.fontSize);
    const fg = parse(cs.color);
    const bg = bgOf(el);
    if (!fg || !bg || fg.a < 0.5) continue;
    const c = contrast(fg, bg);
    const large = size >= 24 || (size >= 18.66 && parseInt(cs.fontWeight, 10) >= 700);
    if (c < 4.5 && !large) out.low.push({ t: t.slice(0, 32), size: Math.round(size), c: Math.round(c * 100) / 100 });
  }
  out.low = out.low.slice(0, 10);
  return out;
};

for (const f of files) {
  for (const w of [1440, 375]) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 }, isMobile: w < 500, hasTouch: w < 500 });
    await page.addInitScript(() => { try { localStorage.setItem('pothi-theme', 'night'); } catch (e) {} });
    const errs = [];
    page.on('pageerror', (e) => errs.push(String(e).slice(0, 100)));
    await page.goto(base + f, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const res = await page.evaluate(AUDIT);
    const theme = await page.evaluate(() => document.documentElement.dataset.theme || 'day');
    console.log(`${f} @${w} theme=${theme} wide=${res.wide} errors=${errs.length} lowContrast=${res.low.length ? JSON.stringify(res.low) : 'none'}`);
    await page.close();
  }
}
await browser.close();
