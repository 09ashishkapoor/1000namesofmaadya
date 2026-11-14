// Interaction smoke test for the three prototypes: expand, search, set nav, console errors.
import { createRequire } from 'node:module';
const require = createRequire('C:/Users/kalbhairav/.dsh/profiles/desktop/node_modules/');
const { chromium } = require('playwright');

const base = 'file:///C:/Users/kalbhairav/Documents/productionwebsite/1000namesofmaadya/design-demos/';
const browser = await chromium.launch({ channel: 'chrome' });

for (const [file, sel] of [['dir-1.html', { expand: '.nm-head', input: '#q', next: '#next' }],
                           ['dir-2.html', { expand: '.toc button', input: '#q', next: '#next' }],
                           ['dir-3.html', { expand: '.note-btn', input: '#q', next: '#next' }]]) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)); });
  page.on('pageerror', (e) => errors.push('PAGEERROR ' + String(e).slice(0, 160)));
  await page.goto(base + file, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  const report = { file, errors };

  if (file !== 'dir-2.html') {
    await page.locator(sel.expand).first().click();
    await page.waitForTimeout(500);
    report.expanded = await page.evaluate(() => {
      const n = document.querySelector('[data-open="true"], .nm-head[aria-expanded="true"]');
      return n ? n.textContent.trim().slice(0, 40) : null;
    });
  } else {
    await page.locator(sel.expand).nth(2).click();
    await page.waitForTimeout(300);
    report.expanded = await page.evaluate(() => document.querySelector('.page-name')?.textContent || null);
  }

  await page.fill(sel.input, 'kali');
  await page.waitForTimeout(300);
  report.searchState = await page.evaluate(() => {
    const s = document.querySelector('#state, #findCount, #qn');
    return s ? s.textContent.trim() : null;
  });
  await page.fill(sel.input, '');

  await page.locator(sel.next).click();
  await page.waitForTimeout(400);
  report.afterNext = await page.evaluate(() => {
    const s = document.querySelector('#setNo, #headSet, #rSet');
    const first = document.querySelector('.nm .nm-name, .toc .w, .seg h3');
    return { set: s ? s.textContent.trim() : null, first: first ? first.textContent.trim() : null };
  });

  report.horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  console.log(JSON.stringify(report, null, 1));
  await page.close();
}
await browser.close();
