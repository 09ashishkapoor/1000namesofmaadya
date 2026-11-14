// Responsive audit: overflow offenders, tiny text, fixed-bar overlap, at several phone widths.
import { createRequire } from 'node:module';
const require = createRequire('C:/Users/kalbhairav/.dsh/profiles/desktop/node_modules/');
const { chromium } = require('playwright');

const base = 'file:///C:/Users/kalbhairav/Documents/productionwebsite/1000namesofmaadya/design-demos/';
const files = ['dir-1.html', 'dir-2.html', 'dir-3.html'];
const widths = [320, 360, 375, 390, 414, 768];
const browser = await chromium.launch({ channel: 'chrome' });

const PROBE = () => {
  const vw = document.documentElement.clientWidth;
  const pathOf = (el) => {
    const parts = [];
    let n = el;
    while (n && n !== document.body && parts.length < 5) {
      let s = n.tagName.toLowerCase();
      if (n.id) s += '#' + n.id;
      else if (n.className && typeof n.className === 'string') s += '.' + n.className.trim().split(/\s+/)[0];
      parts.unshift(s);
      n = n.parentElement;
    }
    return parts.join(' > ');
  };
  const out = { vw, scrollW: document.documentElement.scrollWidth, overflow: [], clippedText: [], fixedBars: [] };
  const els = document.querySelectorAll('body *');
  for (const el of els) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    if (r.right > vw + 1 && cs.position !== 'fixed') {
      // only report the outermost offender
      if (!out.overflow.some((o) => el.contains(document.querySelector(o.sel)) || o.sel.includes(pathOf(el)))) {
        out.overflow.push({ sel: pathOf(el), right: Math.round(r.right), w: Math.round(r.width), txt: (el.textContent || '').trim().slice(0, 24) });
      }
    }
    // text clipped horizontally inside its own box
    if (el.children.length === 0 && el.textContent.trim() && cs.overflow !== 'visible') {
      if (el.scrollWidth > el.clientWidth + 2) out.clippedText.push({ sel: pathOf(el), scroll: el.scrollWidth, client: el.clientWidth, txt: el.textContent.trim().slice(0, 24) });
    }
    if (cs.position === 'fixed') {
      out.fixedBars.push({ sel: pathOf(el), h: Math.round(r.height), top: Math.round(r.top), bottom: Math.round(r.bottom) });
    }
  }
  out.overflow = out.overflow.slice(0, 8);
  out.clippedText = out.clippedText.slice(0, 6);
  // does the fixed bar cover the last content?
  const bar = [...document.querySelectorAll('body *')].find((e) => {
    const cs = getComputedStyle(e);
    return cs.position === 'fixed' && cs.bottom === '0px' && e.getBoundingClientRect().height > 20;
  });
  if (bar) {
    const pad = parseFloat(getComputedStyle(document.body).paddingBottom);
    out.barCover = { barH: Math.round(bar.getBoundingClientRect().height), bodyPadBottom: pad, ok: pad >= bar.getBoundingClientRect().height - 2 };
  }
  return out;
};

for (const w of widths) {
  for (const f of files) {
    const page = await browser.newPage({ viewport: { width: w, height: 800 }, isMobile: w < 500, hasTouch: w < 500 });
    await page.goto(base + f, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const res = await page.evaluate(PROBE);
    const bad = res.scrollW > res.vw + 1 || res.overflow.length || res.clippedText.length || (res.barCover && !res.barCover.ok);
    console.log(`${f} @${w}  ${bad ? 'PROBLEM' : 'ok'}  scrollW=${res.scrollW} vw=${res.vw}` +
      (res.overflow.length ? `\n   overflow: ${JSON.stringify(res.overflow)}` : '') +
      (res.clippedText.length ? `\n   clipped: ${JSON.stringify(res.clippedText)}` : '') +
      (res.barCover && !res.barCover.ok ? `\n   bar covers: ${JSON.stringify(res.barCover)}` : ''));
    await page.close();
  }
}
await browser.close();
