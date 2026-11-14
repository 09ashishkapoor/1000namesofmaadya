// Element screenshot at 2x: node shot.mjs <url> <out> <selector>
import { createRequire } from 'node:module';
const require = createRequire('C:/Users/kalbhairav/.dsh/profiles/desktop/node_modules/');
const { chromium } = require('playwright');

const [url, out, sel] = process.argv.slice(2);
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(700);
const el = page.locator(sel).first();
await el.scrollIntoViewIfNeeded();
await page.waitForTimeout(200);
await el.screenshot({ path: out });
console.log(JSON.stringify({ out, sel, box: await el.boundingBox() }));
await browser.close();
