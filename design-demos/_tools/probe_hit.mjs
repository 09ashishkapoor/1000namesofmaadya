// Hit-area test: tap just above the small "Meaning note" control.
import { createRequire } from 'node:module';
const require = createRequire('C:/Users/kalbhairav/.dsh/profiles/desktop/node_modules/');
const { chromium } = require('playwright');

const browser = await chromium.launch({ channel: 'chrome' });
const p = await browser.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
await p.goto('file:///C:/Users/kalbhairav/Documents/productionwebsite/1000namesofmaadya/design-demos/dir-3.html', { waitUntil: 'networkidle' });
await p.waitForTimeout(300);

const btn = p.locator('.note-btn').first();
await btn.scrollIntoViewIfNeeded();
await p.waitForTimeout(400);
const box = await btn.boundingBox();
console.log('box', JSON.stringify({ x: Math.round(box.x), y: Math.round(box.y), h: Math.round(box.height) }));

const probe = await p.evaluate(({ x, y }) => {
  const el = document.elementFromPoint(x, y);
  const b = document.querySelector('.note-btn');
  return el === b || b.contains(el) ? 'BUTTON' : el ? el.tagName + '.' + String(el.className).split(' ')[0] : 'null';
}, { x: box.x + 20, y: box.y - 10 });
console.log('element 10px above:', probe);

await p.mouse.click(box.x + 20, box.y - 10);
await p.waitForTimeout(400);
console.log('notes open:', await p.evaluate(() => document.querySelectorAll('.seg .note[data-open="true"]').length));

// control: tap the control itself
await p.mouse.click(box.x + 20, box.y + 8);
await p.waitForTimeout(400);
console.log('notes open after tap on glyphs:', await p.evaluate(() => document.querySelectorAll('.seg .note[data-open="true"]').length));

await browser.close();
