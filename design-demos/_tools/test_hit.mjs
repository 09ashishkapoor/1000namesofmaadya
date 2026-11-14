// Verify the invisible tap area around the small "Meaning note" control (D3).
import { createRequire } from 'node:module';
const require = createRequire('C:/Users/kalbhairav/.dsh/profiles/desktop/node_modules/');
const { chromium } = require('playwright');

const browser = await chromium.launch({ channel: 'chrome' });
const p = await browser.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
await p.goto('file:///C:/Users/kalbhairav/Documents/productionwebsite/1000namesofmaadya/design-demos/dir-3.html', { waitUntil: 'networkidle' });
await p.waitForTimeout(400);

const box = await p.locator('.note-btn').first().boundingBox();
// tap 9px above the type — outside the button's own box, inside the ::after hit area
await p.mouse.click(box.x + 20, box.y - 9);
await p.waitForTimeout(400);
const opened = await p.evaluate(() => document.querySelectorAll('.seg .note[data-open="true"]').length);

console.log(JSON.stringify({ buttonBoxHeight: Math.round(box.height), tappedY: Math.round(box.y - 9), opened }));
await browser.close();
