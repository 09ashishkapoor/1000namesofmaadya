// D2 mobile verification: index visible, search works, tapping a name turns the page.
import { createRequire } from 'node:module';
const require = createRequire('C:/Users/kalbhairav/.dsh/profiles/desktop/node_modules/');
const { chromium } = require('playwright');

const browser = await chromium.launch({ channel: 'chrome' });
const p = await browser.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
const errs = [];
p.on('pageerror', (e) => errs.push(String(e).slice(0, 140)));
p.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0, 140)); });

await p.goto('file:///C:/Users/kalbhairav/Documents/productionwebsite/1000namesofmaadya/design-demos/dir-2.html', { waitUntil: 'networkidle' });
await p.waitForTimeout(600);

const state = await p.evaluate(() => {
  const m = document.querySelector('#mindex');
  return {
    display: getComputedStyle(m).display,
    items: document.querySelectorAll('#mlist li[data-search]').length,
    count: document.querySelector('#mcount').textContent.trim(),
    h: Math.round(m.getBoundingClientRect().height),
    mqVisible: Boolean(document.querySelector('#mq').offsetParent),
    leafLeftVisible: getComputedStyle(document.querySelector('.leaf-left')).display,
  };
});

await p.fill('#mq', 'kali');
await p.waitForTimeout(300);
const filtered = await p.evaluate(() => ({
  count: document.querySelector('#mcount').textContent.trim(),
  visible: [...document.querySelectorAll('#mlist li[data-search]')].filter((li) => !li.classList.contains('is-hidden')).length,
}));

await p.fill('#mq', '');
await p.waitForTimeout(250);
await p.locator('#mlist button').nth(6).click();
await p.waitForTimeout(300);
const picked = await p.evaluate(() => ({
  name: document.querySelector('.page-name').textContent.trim(),
  folio: document.querySelector('.folio').textContent.trim(),
  current: document.querySelectorAll('#mlist button[aria-current="true"]').length,
  idxCurrent: [...document.querySelectorAll('#mlist button')].findIndex((b) => b.getAttribute('aria-current') === 'true'),
}));

await p.locator('#next').click();
await p.waitForTimeout(400);
const afterSet = await p.evaluate(() => ({
  set: document.querySelector('#setNo').textContent.trim(),
  count: document.querySelector('#mcount').textContent.trim(),
  first: document.querySelector('#mlist button .w').textContent.trim(),
}));

const overflow = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
await p.screenshot({ path: 'review/m-check-d2.png' });
console.log(JSON.stringify({ state, filtered, picked, afterSet, overflow, errs }, null, 1));
await browser.close();
