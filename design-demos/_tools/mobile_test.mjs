// Mobile interaction + layout test (375) and 320 first-screen captures.
import { createRequire } from 'node:module';
const require = createRequire('C:/Users/kalbhairav/.dsh/profiles/desktop/node_modules/');
const { chromium } = require('playwright');

const base = 'file:///C:/Users/kalbhairav/Documents/productionwebsite/1000namesofmaadya/design-demos/';
const browser = await chromium.launch({ channel: 'chrome' });

async function open(w, f) {
  const p = await browser.newPage({ viewport: { width: w, height: 812 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const errors = [];
  p.on('pageerror', (e) => errors.push(String(e).slice(0, 120)));
  p.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 120)); });
  await p.goto(base + f, { waitUntil: 'networkidle' });
  await p.waitForTimeout(500);
  return { p, errors };
}

// D1
{
  const { p, errors } = await open(375, 'dir-1.html');
  await p.locator('.nm-head').first().click();
  await p.waitForTimeout(500);
  const expand = await p.evaluate(() => {
    const n = document.querySelector('.nm-note[data-open="true"]');
    const r = n.getBoundingClientRect();
    const head = document.querySelector('.nm-head').getBoundingClientRect();
    return { noteH: Math.round(r.height), overRight: Math.round(r.right - document.documentElement.clientWidth), headH: Math.round(head.height) };
  });
  await p.fill('#q', 'kali');
  await p.waitForTimeout(250);
  const search = await p.evaluate(() => document.querySelector('#state').textContent.trim());
  await p.fill('#q', '');
  await p.locator('#next').click();
  await p.waitForTimeout(400);
  const afterNext = await p.evaluate(() => ({
    set: document.querySelector('#setNo').textContent.trim(),
    first: document.querySelector('.nm .nm-name').textContent.trim(),
  }));
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log('D1 @375', JSON.stringify({ expand, search, afterNext, overflow, errors }));
  await p.screenshot({ path: 'review/m-check-d1.png' });
  await p.close();
}

// D2
{
  const { p, errors } = await open(375, 'dir-2.html');
  const state = await p.evaluate(() => ({
    index: getComputedStyle(document.querySelector('#mindex')).display,
    items: document.querySelectorAll('#mlist li[data-search]').length,
    searchVisible: Boolean(document.querySelector('#mq').offsetParent),
    leafList: getComputedStyle(document.querySelector('.leaf-left')).display,
  }));
  await p.fill('#mq', 'kali');
  await p.waitForTimeout(250);
  const search = await p.evaluate(() => document.querySelector('#mcount').textContent.trim());
  await p.fill('#mq', '');
  await p.waitForTimeout(200);
  await p.locator('#mlist button').nth(4).click();
  await p.waitForTimeout(300);
  const picked = await p.evaluate(() => ({
    page: document.querySelector('.page-name').textContent.trim(),
    folio: document.querySelector('.folio').textContent.trim(),
  }));
  await p.locator('#next').click();
  await p.waitForTimeout(350);
  const afterNext = await p.evaluate(() => ({ set: document.querySelector('#setNo').textContent.trim(), count: document.querySelector('#mcount').textContent.trim() }));
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log('D2 @375', JSON.stringify({ state, search, picked, afterNext, overflow, errors }));
  await p.screenshot({ path: 'review/m-check-d2.png' });
  await p.close();
}

// D3
{
  const { p, errors } = await open(375, 'dir-3.html');
  await p.locator('.note-btn').first().click();
  await p.waitForTimeout(450);
  const expand = await p.evaluate(() => ({
    noteH: Math.round(document.querySelector('.seg .note[data-open="true"]').getBoundingClientRect().height),
    btnH: Math.round(document.querySelector('.note-btn').getBoundingClientRect().height),
  }));
  const bar = await p.evaluate(() => {
    const b = document.querySelector('.mbar');
    const r = b.getBoundingClientRect();
    return {
      h: Math.round(r.height),
      display: getComputedStyle(b).display,
      bodyPad: getComputedStyle(document.body).paddingBottom,
      btnH: Math.round(document.querySelector('#mNext').getBoundingClientRect().height),
    };
  });
  await p.locator('#mNext').click();
  await p.waitForTimeout(400);
  const afterNext = await p.evaluate(() => ({
    set: document.querySelector('#mSet').textContent.trim(),
    first: document.querySelector('.seg h3').textContent.trim(),
  }));
  await p.fill('#q', 'kali');
  await p.waitForTimeout(300);
  const search = await p.evaluate(() => ({ n: document.querySelector('#qn').textContent.trim(), colN: document.querySelector('#colN').textContent.trim() }));
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log('D3 @375', JSON.stringify({ expand, bar, afterNext, search, overflow, errors }));
  await p.screenshot({ path: 'review/m-check-d3.png' });
  await p.close();
}

// 320 first screens
for (const f of ['dir-1.html', 'dir-2.html', 'dir-3.html']) {
  const { p } = await open(320, f);
  await p.screenshot({ path: 'review/m320-' + f.replace('.html', '') + '.png' });
  await p.close();
}

await browser.close();
