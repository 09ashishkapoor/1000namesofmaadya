const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;
const { gotoHome, openReader, waitForFonts } = require("./helpers/site");

async function analyze(page) {
	const results = await new AxeBuilder({ page }).analyze();
	return results.violations;
}

test("the reader passes the accessibility scan in day mode", async ({ page }) => {
	await openReader(page);
	const violations = await analyze(page);
	expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("the reader passes the accessibility scan in night mode", async ({ page }) => {
	await gotoHome(page);
	await page.locator("[data-theme-toggle]").click();
	await expect(page.locator("html")).toHaveAttribute("data-theme", "night");
	await waitForFonts(page);
	const violations = await analyze(page);
	expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a name page passes the accessibility scan", async ({ page }) => {
	await page.goto("/names/kali/", { waitUntil: "load" });
	await waitForFonts(page);
	const violations = await analyze(page);
	expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a range page passes the accessibility scan", async ({ page }) => {
	await page.goto("/names/1-100/", { waitUntil: "load" });
	await waitForFonts(page);
	const violations = await analyze(page);
	expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a guide page passes the accessibility scan", async ({ page }) => {
	await page.goto("/108-names-of-kali/", { waitUntil: "load" });
	await waitForFonts(page);
	const violations = await analyze(page);
	expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("the phone reader passes the accessibility scan", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await openReader(page);
	const violations = await analyze(page);
	expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
