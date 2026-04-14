const { test, expect } = require('@playwright/test');
const { gotoHome, openNamesExplorer } = require('./helpers/site');

test('hero CTA reaches the names explorer and reveals an elaboration', async ({ page }) => {
  await openNamesExplorer(page);

  const firstCard = page.locator('#names-grid .name-card.visible').first();
  await expect(firstCard).toBeVisible();
  await expect(firstCard.locator('.card-index')).toHaveText('#1');

  const toggle = firstCard.locator('.toggle-btn');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();

  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(firstCard.locator('.elaboration')).toHaveClass(/expanded/);
  await expect(firstCard.locator('.elaboration-content')).toBeVisible();
});

test('search can narrow the names list and clear back to the default view', async ({ page }) => {
  await gotoHome(page);

  const searchInput = page.locator('#search-input');
  await expect(searchInput).toBeVisible();
  await searchInput.fill('shhmashhana');
  await expect(page.locator('#stats-display')).toContainText('shhmashhana');
  await expect(page.locator('#names-grid .name-card.visible').first()).toContainText('SHHMASHHANA KALIKA');

  const filteredCount = await page.locator('#names-grid .name-card.visible').count();
  expect(filteredCount).toBeGreaterThan(0);
  expect(filteredCount).toBeLessThan(11);

  await page.locator('#clear-btn').click();
  await expect(searchInput).toHaveValue('');
  await expect(page.locator('#names-grid .name-card.visible')).toHaveCount(11);
  await expect(page.locator('#names-grid .name-card.visible').first()).toContainText('SHHMASHHANA KALIKA');
});

test.describe('mobile reader controls', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('support search toggle, language switching, pagination, and elaboration reveal', async ({ page }) => {
    await openNamesExplorer(page);
    const initialIndex = await page.locator('#names-grid .name-card.visible .card-index').first().innerText();

    const searchToggle = page.locator('#search-toggle-btn');
    await expect(searchToggle).toBeVisible();
    await expect(searchToggle).toHaveAttribute('aria-expanded', 'false');

    await searchToggle.click();
    await expect(searchToggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#search-panel')).toHaveClass(/is-open/);

    await page.selectOption('#language-select', 'hindi');
    await expect(page.locator('html')).toHaveAttribute('lang', 'hi');

    await page.locator('#next-page-btn').click();
    await expect(page.locator('#prev-page-btn')).toBeVisible();
    await expect(page.locator('#names-grid .name-card.visible .card-index').first()).not.toHaveText(initialIndex);

    const nextToggle = page.locator('#names-grid .name-card.visible .toggle-btn').first();
    await nextToggle.click();
    await expect(nextToggle).toHaveAttribute('aria-expanded', 'true');
  });
});
