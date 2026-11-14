const fs = require("node:fs");
const path = require("node:path");
const { test, expect } = require("@playwright/test");
const { gotoHome } = require("./helpers/site");

const DIST_DIR = path.join(__dirname, "..", "dist");
const BUDGET = {
	domContentLoadedMs: 1000,
	initialHtmlBytes: 320000,
	// The reader is the only script left on the critical path.
	bootstrapJsBytes: 40000,
	// pothi.css replaced styles.min.css + reference.css.
	initialCssBytes: 40000,
};

test.use({ viewport: { width: 390, height: 844 } });

test("main page stays within the validation performance budget", async ({ page }) => {
	await gotoHome(page);

	const navigation = await page.evaluate(() => {
		const entry = performance.getEntriesByType("navigation")[0];
		return {
			domContentLoaded: entry.domContentLoadedEventEnd,
			load: entry.loadEventEnd,
		};
	});

	const bytes = {
		initialHtml: fs.statSync(path.join(DIST_DIR, "index.html")).size,
		bootstrapJs: fs.statSync(path.join(DIST_DIR, "app.js")).size,
		initialCss: fs.statSync(path.join(DIST_DIR, "pothi.css")).size,
	};

	expect(navigation.domContentLoaded).toBeLessThan(BUDGET.domContentLoadedMs);
	expect(bytes.initialHtml).toBeLessThanOrEqual(BUDGET.initialHtmlBytes);
	expect(bytes.bootstrapJs).toBeLessThanOrEqual(BUDGET.bootstrapJsBytes);
	expect(bytes.initialCss).toBeLessThanOrEqual(BUDGET.initialCssBytes);
});

test("a name page and a guide page stay light", async ({ page }) => {
	const namePageBytes = fs.statSync(path.join(DIST_DIR, "names", "kali", "index.html")).size;
	const guideBytes = fs.statSync(path.join(DIST_DIR, "108-names-of-kali", "index.html")).size;
	expect(namePageBytes).toBeLessThanOrEqual(120000);
	expect(guideBytes).toBeLessThanOrEqual(120000);

	await page.goto("/names/kali/", { waitUntil: "load" });
	const failures = [];
	page.on("response", (response) => {
		if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`);
	});
	await page.reload({ waitUntil: "load" });
	expect(failures).toEqual([]);
});
