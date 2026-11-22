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

test("search spans the whole book, is accent-insensitive, and clears back", async ({ page }) => {
	await openReader(page);

	const search = page.locator("#q");
	await search.fill("kali");
	await expect(page.locator("#find-count")).toHaveText(/^\d+ of 1,072$/);

	const results = page.locator("#toc li");
	// The whole book holds eight matches, including names far past the open set.
	await expect(results).toHaveCount(8);
	await expect(page.locator('#toc li[data-number="776"]')).toHaveCount(1);

	// "kali" must reach the Devanagari / IAST row for Kālī (position 2).
	await expect(page.locator('#toc li[data-number="2"] .i')).toHaveText("Kālī");

	await search.fill("");
	await expect(results).toHaveCount(11);
	await expect(page.locator("#find-count")).toHaveText("11 names");
});

test("search finds a name beyond the first set and opens it", async ({ page }) => {
	await openReader(page);

	const search = page.locator("#q");
	await search.fill("Varṇa Japa Mālā Vidhāyinī");
	await expect(page.locator("#find-count")).toHaveText("1 of 1,072");

	const result = page.locator("#toc li").first();
	await expect(result).toContainText("1072");
	await result.locator("button").click();

	await expect(page.locator("#head-set")).toHaveText("98");
	await expect(page.locator("#head-range")).toHaveText("1068–1072");
	await expect(page.locator("#page .page-name")).toHaveText("वर्ण जप माला विधायिनी");
	await expect(page.locator("#toc li")).toHaveCount(5); // names 1068–1072
	await expect(search).toHaveValue("");
});

test("search shows a recoverable empty state", async ({ page }) => {
	await openReader(page);
	await page.locator("#q").fill("zzznomatch");
	await expect(page.locator("#reader-status")).toContainText("No name matches that search");
	await expect(page.locator("#toc li")).toHaveCount(0);
	await page.locator("#q").fill("");
	await expect(page.locator("#toc li")).toHaveCount(11);
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

	test("the phone search spans the whole book", async ({ page }) => {
		await openReader(page);
		await page.locator("#mq").fill("Varṇa Japa Mālā Vidhāyinī");
		await expect(page.locator("#m-count")).toHaveText("1 of 1,072");
		await expect(page.locator("#m-list li")).toHaveCount(1);
		await expect(page.locator("#m-list li")).toContainText("1072");
	});
});

test.describe("no horizontal scroll", () => {
	for (const width of [320, 375, 1440]) {
		for (const path of ["/", "/names/kali/", "/names/1-100/", "/names/", "/108-names-of-kali/", "/about/", "/colophon/"]) {
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

test.describe("the running head holds together", () => {
	// The head used to overflow between 760px and ~890px (the night control was
	// pushed off-screen and the page scrolled sideways), and below 760px the
	// absolutely positioned night control sat on top of the last nav links.
	// Landscape phones (844px) and small tablets (768px) hit the first case.
	for (const width of [320, 360, 390, 412, 768, 844, 900, 901, 1280]) {
		test(`no overlap or sideways scroll at ${width}px`, async ({ page }) => {
			await page.setViewportSize({ width, height: 900 });
			await blockExternalTelemetry(page);
			await page.goto("/", { waitUntil: "load" });

			const layout = await page.evaluate(() => {
				const rect = (element) => element.getBoundingClientRect();
				const overlap = (a, b) =>
					Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) *
					Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
				const theme = rect(document.querySelector(".theme"));
				const links = [...document.querySelectorAll(".bar nav a")].filter(
					(link) => getComputedStyle(link).display !== "none",
				);
				return {
					overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
					themeOutside: theme.right > window.innerWidth + 1 || theme.left < -1,
					overlaps: links.filter((link) => overlap(rect(link), theme) > 0).length,
					rows: new Set(links.map((link) => Math.round(rect(link).top))).size,
				};
			});

			expect(layout.overflow, "the page scrolls sideways").toBeLessThanOrEqual(1);
			expect(layout.themeOutside, "the night control is off-screen").toBe(false);
			expect(layout.overlaps, "nav links sit under the night control").toBe(0);
			expect(layout.rows, "the nav wraps onto more than one row").toBe(1);
		});
	}
});

test("favicons are real images, not an HTML fallback", async ({ page, request }) => {
	await page.goto("/", { waitUntil: "load" });

	// Chromium, Safari and the Google favicon crawler reject WebP icons, so the
	// head must point at ICO/PNG and those files must exist (a missing asset
	// used to come back as the homepage HTML, which reads as a broken icon).
	await expect(page.locator('link[rel="icon"][href="/favicon-48.png"]')).toHaveCount(1);
	await expect(page.locator('link[rel="icon"][href="/favicon.ico"]')).toHaveCount(1);
	await expect(page.locator('link[rel="apple-touch-icon"][href="/apple-touch-icon.png"]')).toHaveCount(1);
	await expect(page.locator('link[rel="manifest"][href="/site.webmanifest"]')).toHaveCount(1);
	await expect(page.locator('link[rel="icon"][type="image/webp"]')).toHaveCount(0);

	for (const asset of ["/favicon.ico", "/favicon-48.png", "/apple-touch-icon.png", "/site.webmanifest"]) {
		const response = await request.get(asset);
		expect(response.status(), asset).toBe(200);
		expect(String(response.headers()["content-type"]), asset).not.toContain("text/html");
	}
});

test("an unknown URL answers with the real 404 page", async ({ page, request }) => {
	// A 200 homepage for a missing path is a soft 404: crawlers cannot tell a
	// miss from a hit, and missing assets looked like valid pages.
	const response = await request.get("/this-page-does-not-exist/");
	expect(response.status()).toBe(404);

	await page.goto("/this-page-does-not-exist/");
	await expect(page.locator("h1")).toHaveText("This page is not in the pothi");
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex,follow");
	await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});
