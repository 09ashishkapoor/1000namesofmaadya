const { test, expect } = require("@playwright/test");
const { blockExternalTelemetry, gotoHome, openReader } = require("./helpers/site");

const FIRST_NAME = "श्मशान कालिका";
const SECOND_NAME = "काली";

test("the cover opens the reader", async ({ page }) => {
	await openReader(page);
	await expect(page.locator("#read")).toBeInViewport();
	await expect(page.locator("#toc li")).toHaveCount(11);
});

test("the first set of eleven is readable without a tap", async ({ page }) => {
	await gotoHome(page);

	// Every one of the eleven rows carries Devanagari and IAST in the HTML.
	await expect(page.locator("#toc li")).toHaveCount(11);
	await expect(page.locator('#toc li .w[lang="sa"]').first()).toHaveText(FIRST_NAME);
	await expect(page.locator("#toc li .i").first()).toHaveText("Śmaśāna Kālikā");

	// The open name shows Devanagari, IAST and the one-line meaning.
	await expect(page.locator("#page .page-name")).toHaveText(FIRST_NAME);
	await expect(page.locator("#page .page-iast")).toHaveText("Śmaśāna Kālikā");
	await expect(page.locator("#page .page-one")).toContainText("Cremation Ground");
	await expect(page.locator("#page .page-elab")).not.toBeEmpty();
});

test.describe("without JavaScript", () => {
	test.use({ javaScriptEnabled: false });

	test("the first set stays on the page", async ({ page }) => {
		await page.goto("/", { waitUntil: "load" });
		await expect(page.locator("#toc li")).toHaveCount(11);
		await expect(page.locator("#page .page-name")).toHaveText(FIRST_NAME);
		await expect(page.locator("#page .page-elab")).not.toBeEmpty();
	});
});

test("choosing a name opens it on the right leaf", async ({ page }) => {
	await openReader(page);
	const second = page.locator("#toc li button").nth(1);
	await second.click();

	await expect(page.locator("#page .page-name")).toHaveText(SECOND_NAME);
	await expect(page.locator("#page .page-iast")).toHaveText("Kālī");
	await expect(page.locator("#foot-page")).toHaveText("2");
	await expect(second).toHaveAttribute("aria-current", "true");
	await expect(page.locator('#toc li button[aria-current="true"]')).toHaveCount(1);
});

test("search narrows the set, is accent-insensitive, and clears back", async ({ page }) => {
	await openReader(page);

	const search = page.locator("#q");
	await search.fill("kali");
	await expect(page.locator("#find-count")).toHaveText(/^\d+\/11$/);

	const visible = page.locator("#toc li:not(.is-hidden)");
	expect(await visible.count()).toBeGreaterThan(0);
	expect(await visible.count()).toBeLessThan(11);

	// "kali" must reach the Devanagari / IAST row for Kālī (position 2).
	await expect(page.locator("#toc li").nth(1)).not.toHaveClass(/is-hidden/);
	await expect(page.locator("#toc li").nth(1)).toContainText("Kālī");

	await search.fill("");
	await expect(page.locator("#toc li:not(.is-hidden)")).toHaveCount(11);
});

test("search shows a recoverable empty state", async ({ page }) => {
	await openReader(page);
	await page.locator("#q").fill("zzznomatch");
	await expect(page.locator("#reader-status")).toContainText("No name in this set matches");
	await page.locator("#q").fill("");
	await expect(page.locator("#toc li:not(.is-hidden)")).toHaveCount(11);
	await expect(page.locator("#reader-status")).toBeEmpty();
});

test("next set loads the next eleven names", async ({ page }) => {
	await openReader(page);

	await expect(page.locator("#prev")).toBeDisabled();
	await page.locator("#next").click();

	await expect(page.locator("#head-set")).toHaveText("02");
	await expect(page.locator("#head-range")).toHaveText("12–22");
	await expect(page.locator("#toc li")).toHaveCount(11);
	await expect(page.locator('#toc li .w[lang="sa"]').first()).not.toBeEmpty();
	await expect(page.locator("#prev")).toBeEnabled();

	await page.locator("#prev").click();
	await expect(page.locator("#head-set")).toHaveText("01");
	await expect(page.locator('#toc li .w[lang="sa"]').first()).toHaveText(FIRST_NAME);
});

test("a failed set load explains itself and can be retried", async ({ page }) => {
	await openReader(page);

	let failures = 0;
	await page.route("**/name-spine.json**", async (route) => {
		if (failures < 1) {
			failures += 1;
			await route.abort();
			return;
		}
		await route.continue();
	});

	await page.locator("#next").click();
	await expect(page.locator("#reader-status")).toContainText("could not be loaded");
	await expect(page.locator("#head-set")).toHaveText("01");

	await page.locator("#next").click();
	await expect(page.locator("#head-set")).toHaveText("02");
	await expect(page.locator("#reader-status")).toBeEmpty();
});

test("the night-reading control toggles and persists across pages", async ({ page }) => {
	await gotoHome(page);

	const toggle = page.locator("[data-theme-toggle]");
	await expect(toggle).toHaveAttribute("aria-pressed", "false");
	await toggle.click();
	await expect(page.locator("html")).toHaveAttribute("data-theme", "night");
	await expect(toggle).toHaveAttribute("aria-pressed", "true");
	await expect(toggle).toHaveAttribute("aria-label", "Switch to day reading");

	await page.goto("/names/kali/", { waitUntil: "load" });
	await expect(page.locator("html")).toHaveAttribute("data-theme", "night");
	await expect(page.locator("[data-theme-toggle]")).toHaveAttribute("aria-pressed", "true");
});

test("the reader table of contents and pager are keyboard reachable", async ({ page }) => {
	await openReader(page);
	const first = page.locator("#toc li button").first();
	await first.focus();
	await page.keyboard.press("Enter");
	await expect(first).toHaveAttribute("aria-current", "true");
});

test.describe("phone reader", () => {
	test.use({ viewport: { width: 390, height: 844 } });
	test("the two-column index carries the same eleven names", async ({ page }) => {
		await openReader(page);
		await expect(page.locator("#m-list li")).toHaveCount(11);
		await expect(page.locator("#m-list li .w").first()).toHaveText(FIRST_NAME);

		await page.locator("#m-list li button").nth(1).click();
		await expect(page.locator("#page .page-name")).toHaveText(SECOND_NAME);
	});

	test("the phone search filters the set", async ({ page }) => {
		await openReader(page);
		await page.locator("#mq").fill("bhadra");
		await expect(page.locator("#m-list li:not(.is-hidden)")).toHaveCount(1);
		await expect(page.locator("#m-count")).toHaveText("1/11");
	});
});

test.describe("no horizontal scroll", () => {
	for (const width of [320, 375, 1440]) {
		for (const path of ["/", "/names/kali/", "/names/1-100/", "/names/", "/108-names-of-kali/", "/about/"]) {
			test(`${path} at ${width}px`, async ({ page }) => {
				await page.setViewportSize({ width, height: 900 });
				await blockExternalTelemetry(page);
				await page.goto(path, { waitUntil: "load" });
				const overflow = await page.evaluate(
					() => document.documentElement.scrollWidth - document.documentElement.clientWidth,
				);
				expect(overflow, `${path} overflows by ${overflow}px at ${width}px`).toBeLessThanOrEqual(1);
			});
		}
	}
});
