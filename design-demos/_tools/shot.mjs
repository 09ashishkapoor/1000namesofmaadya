// Screenshot helper for design review + mockups.
// usage: node shot.mjs <url> <outfile> [width] [height] [--full] [--clip y:height]
import { createRequire } from 'node:module';
const require = createRequire('C:/Users/kalbhairav/.dsh/profiles/desktop/node_modules/');
const { chromium } = require('playwright');

const [url, out, w = '1440', h = '900', ...flags] = process.argv.slice(2);
const width = parseInt(w, 10);
const height = parseInt(h, 10);
const full = flags.includes('--full');
const clipArg = flags.find((f) => f.startsWith('--clip='));
const dsfArg = flags.find((f) => f.startsWith('--dsf='));

const browser = await chromium.launch({
  channel: 'chrome',
  args: ['--force-color-profile=srgb', '--font-render-hinting=none'],
});
const ctx = await browser.newContext({
  viewport: { width, height },
  deviceScaleFactor: dsfArg ? parseFloat(dsfArg.split('=')[1]) : 1,
  isMobile: width < 500,
  hasTouch: width < 500,
});
const page = await ctx.newPage();
const errors = [];
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text().slice(0, 200));
});
page.on('pageerror', (e) => errors.push('PAGEERROR ' + String(e).slice(0, 200)));
await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(async () => {
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
});
await page.waitForTimeout(900);
if (full) {
  // allow lazy content to settle
  await page.evaluate(async () => {
    await new Promise((r) => {
      let y = 0;
      const step = () => {
        y += 700;
        window.scrollTo(0, y);
        if (y < document.body.scrollHeight) setTimeout(step, 60);
        else {
          window.scrollTo(0, 0);
          setTimeout(r, 300);
        }
      };
      step();
    });
  });
}
const opts = { path: out, fullPage: full };
if (clipArg) {
  const [cy, ch] = clipArg.split('=')[1].split(':').map(Number);
  opts.clip = { x: 0, y: cy, width, height: ch };
  opts.fullPage = true;
}
await page.screenshot(opts);
console.log(JSON.stringify({ out, url, width, height, full, errors }, null, 2));
await browser.close();
