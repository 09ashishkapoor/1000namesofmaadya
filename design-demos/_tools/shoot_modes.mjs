// Capture day + night on the name page and the reader cover, for the mode board.
import { createRequire } from 'node:module';
const require = createRequire('C:/Users/kalbhairav/.dsh/profiles/desktop/node_modules/');
const { chromium } = require('playwright');

const base = 'file:///C:/Users/kalbhairav/Documents/productionwebsite/1000namesofmaadya/design-demos/';
const browser = await chromium.launch({ channel: 'chrome' });

for (const [file, name, toggle] of [
  ['pothi-name-page.html', 'mode-day-name', false],
  ['pothi-name-page.html', 'mode-night-name', true],
  ['dir-2.html', 'mode-day-reader', false],
  ['dir-2.html', 'mode-night-reader', true],
]) {
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  p.on('pageerror', (e) => errs.push(String(e).slice(0, 100)));
  await p.goto(base + file, { waitUntil: 'networkidle' });
  await p.waitForTimeout(400);
  if (toggle) {
    await p.click('[data-theme-toggle]');
    await p.waitForTimeout(350);
  }
  const state = await p.evaluate(() => ({
    theme: document.documentElement.dataset.theme || 'day',
    label: document.querySelector('[data-theme-toggle] .lbl').textContent,
    bg: getComputedStyle(document.body).backgroundColor,
  }));
  await p.screenshot({ path: 'review/' + name + '.png' });
  console.log(name, JSON.stringify(state), 'errors:', errs.length);
  await p.close();
}
await browser.close();
