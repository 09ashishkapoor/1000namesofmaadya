const { test, expect } = require("@playwright/test");
const { gotoHome, openReader, waitForFonts } = require("./helpers/site");

const screenshotOptions = {
	animations: "disabled",
	caret: "hide",
	maxDiffPixelRatio: 0.02,
	scale: "css",
};

test("the title page stays visually stable", async ({ page }) => {
	await gotoHome(page);
	await expect(page.locator(".cover-copy")).toHaveScreenshot("cover-copy.png", screenshotOptions);
});

test("the open spread stays visually stable", async ({ page }) => {
	await openReader(page);
	await expect(page.locator(".spread")).toHaveScreenshot("spread.png", screenshotOptions);
});

test("the night-reading spread stays visually stable", async ({ page }) => {
	await openReader(page);
	await page.locator("[data-theme-toggle]").click();
	await expect(page.locator("html")).toHaveAttribute("data-theme", "night");
	await waitForFonts(page);
	await expect(page.locator(".spread")).toHaveScreenshot("spread-night.png", screenshotOptions);
});
