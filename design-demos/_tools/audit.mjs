// Accessibility + craft audit for the three prototypes (node playwright).
import { createRequire } from 'node:module';
const require = createRequire('C:/Users/kalbhairav/.dsh/profiles/desktop/node_modules/');
const { chromium } = require('playwright');

const base = 'file:///C:/Users/kalbhairav/Documents/productionwebsite/1000namesofmaadya/design-demos/';
const files = ['dir-1.html', 'dir-2.html', 'dir-3.html'];
const browser = await chromium.launch({ channel: 'chrome' });

const AUDIT = () => {
  const parse = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(',').map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const lum = ({ r, g, b }) => {
    const f = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const contrast = (a, b) => { const l1 = lum(a), l2 = lum(b); const hi = Math.max(l1, l2), lo = Math.min(l1, l2); return (hi + 0.05) / (lo + 0.05); };
  const bgOf = (el) => {
    let n = el;
    while (n && n !== document.documentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return null;
      const c = parse(cs.backgroundColor);
      if (c && c.a > 0.85) return c;
      n = n.parentElement;
    }
    const c = parse(getComputedStyle(document.body).backgroundColor);
    return c && c.a > 0.85 ? c : null;
  };
  const emoji = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/u;
  const out = { lowContrast: [], smallBody: [], emoji: [], smallTargets: [], imagesNoAlt: [], wide: document.documentElement.scrollWidth - window.innerWidth };
  const texts = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const t = walker.currentNode.textContent.trim();
    if (!t) continue;
    const el = walker.currentNode.parentElement;
    if (!el || !el.offsetParent) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || +cs.opacity === 0) continue;
    texts.push({ el, t, cs });
  }
  for (const { el, t, cs } of texts) {
    if (emoji.test(t)) out.emoji.push(t.slice(0, 20));
    const size = parseFloat(cs.fontSize);
    const fg = parse(cs.color);
    const bg = bgOf(el);
    if (fg && bg && fg.a > 0.5) {
      const c = contrast(fg, bg);
      const large = size >= 24 || (size >= 18.66 && parseInt(cs.fontWeight, 10) >= 700);
      if (c < 4.5 && !large) out.lowContrast.push({ t: t.slice(0, 34), size: Math.round(size), c: Math.round(c * 100) / 100 });
    }
    if (size < 16 && t.length > 90) out.smallBody.push({ t: t.slice(0, 30), size });
  }
  for (const el of document.querySelectorAll('button, a')) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const label = (el.textContent || '').trim().slice(0, 24);
    if ((r.width < 40 || r.height < 40) && !el.closest('p, .barm, nav')) out.smallTargets.push({ label, w: Math.round(r.width), h: Math.round(r.height) });
  }
  for (const img of document.querySelectorAll('img')) if (!img.getAttribute('alt')) out.imagesNoAlt.push(img.src.slice(-30));
  out.emoji = [...new Set(out.emoji)];
  out.lowContrast = out.lowContrast.slice(0, 14);
  out.counts = { texts: texts.length };
  return out;
};

for (const w of [1440, 375]) {
  for (const f of files) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 }, isMobile: w < 500 });
    await page.goto(base + f, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    const res = await page.evaluate(AUDIT);
    console.log(`\n== ${f} @${w} ==`);
    console.log('wide:', res.wide, '| emoji:', res.emoji.length ? res.emoji : 'none', '| imagesNoAlt:', res.imagesNoAlt.length);
    console.log('lowContrast:', res.lowContrast.length ? JSON.stringify(res.lowContrast) : 'none');
    console.log('smallBody(<16px, >90 chars):', res.smallBody.length ? JSON.stringify(res.smallBody.slice(0, 5)) : 'none');
    console.log('smallTargets:', res.smallTargets.length ? JSON.stringify(res.smallTargets.slice(0, 8)) : 'none');
    await page.close();
  }
}
await browser.close();
