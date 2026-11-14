const { expect } = require("@playwright/test");

const EXTERNAL_TELEMETRY_PATTERNS = [
	"https://www.googletagmanager.com/**",
	"https://www.google-analytics.com/**",
];

async function blockExternalTelemetry(page) {
	for (const pattern of EXTERNAL_TELEMETRY_PATTERNS) {
		await page.route(pattern, (route) => route.abort());
	}
}

async function stubServiceWorker(page) {
	await page.addInitScript(() => {
		if (!navigator.serviceWorker) return;
		navigator.serviceWorker.register = () =>
			Promise.resolve({
				unregister: () => Promise.resolve(true),
				update: () => Promise.resolve(),
			});
	});
}

async function waitForFonts(page) {
	await page.evaluate(async () => {
		if (document.fonts && document.fonts.ready) {
			await document.fonts.ready;
		}
	});
}

async function disableMotionForStableTests(page) {
	await page.addStyleTag({
		content: `
      html { scroll-behavior: auto !important; }
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `,
	});
}

async function gotoHome(page) {
	await blockExternalTelemetry(page);
	await stubServiceWorker(page);
	await page.goto("/", { waitUntil: "load" });
	await disableMotionForStableTests(page);
	// The left leaf is hidden on phones, where the two-column index takes over.
	await expect(page.locator("#toc button:visible, #m-list button:visible").first()).toBeVisible();
	await expect(page.locator("#page .page-name")).not.toBeEmpty();
	await waitForFonts(page);
}

async function openReader(page) {
	await gotoHome(page);
	await page.locator(".cover-copy a.open").click();
	await expect(page.locator("#read")).toBeInViewport();
}

module.exports = {
	blockExternalTelemetry,
	gotoHome,
	openReader,
	stubServiceWorker,
	waitForFonts,
};
