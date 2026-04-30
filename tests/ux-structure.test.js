const assert = require("assert");
const fs = require("fs");
const path = require("path");

function read(file) {
	return fs.readFileSync(path.join(__dirname, "..", file), "utf8");
}

const pageSource = read("src/pages/index.astro");
const appJs = read("public/app.js");
const stylesCss = read("public/styles.css");
const translationsJs = read("public/translations.js");
const headersFile = read("public/_headers");
const sitemapXml = read("public/sitemap.xml").replace(/\r\n/g, "\n");
const serviceWorkerJs = read("public/sw.js");

function assertIncludes(text, snippet, message) {
	assert.ok(text.includes(snippet), message);
}

function collectAstroFiles(dir) {
	if (!fs.existsSync(dir)) return [];
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const entryPath = path.join(dir, entry.name);
		if (entry.isDirectory()) return collectAstroFiles(entryPath);
		return entry.isFile() && entry.name.endsWith(".astro") ? [entryPath] : [];
	});
}

function testHeroCtasExist() {
	assertIncludes(pageSource, 'id="explore-btn"', "primary CTA should exist");
	assertIncludes(pageSource, 'id="learn-btn"', "secondary CTA should exist");
}

function testAboutSectionComesAfterNamesSection() {
	const namesIndex = pageSource.indexOf('id="names-section"');
	const aboutIndex = pageSource.indexOf('id="about-section"');
	assert.ok(
		namesIndex !== -1 && aboutIndex !== -1,
		"names and about sections should exist",
	);
	assert.ok(
		aboutIndex > namesIndex,
		"about section should come after names section",
	);
}

function testReadingModeControlsExist() {
	assertIncludes(
		pageSource,
		'id="search-toggle-btn"',
		"search toggle should exist",
	);
	assertIncludes(
		pageSource,
		'id="prev-page-btn"',
		"previous page button should exist",
	);
	assertIncludes(
		pageSource,
		'id="next-page-btn"',
		"next page button should exist",
	);
	assertIncludes(
		pageSource,
		'id="reading-progress"',
		"reading progress element should exist",
	);
	assertIncludes(
		pageSource,
		'id="retry-btn"',
		"retry button should exist in the error state",
	);
	assertIncludes(
		pageSource,
		'id="loading-message"',
		"loading state should expose a dedicated message target",
	);
}

function testPrerenderedFirstPageStructureExists() {
	assertIncludes(
		pageSource,
		"window.__INITIAL_NAMES_PAYLOAD__ = initialNamesPayload;",
		"initial names bootstrap should be exposed to the client",
	);
	assertIncludes(
		pageSource,
		'data-prerendered="true"',
		"first page cards should be prerendered in the Astro HTML",
	);
	assertIncludes(
		pageSource,
		"firstPageEntries.map((entry, index) => (",
		"first 11 names should be rendered at build time",
	);
	assertIncludes(
		pageSource,
		'id="loading-state" class="loading-state hidden"',
		"loading state should stay hidden when the prerendered first page exists",
	);
	assertIncludes(
		pageSource,
		"document.documentElement.lang = 'en';",
		"first-paint language hint should set English before body content renders",
	);
}

function testAppHooksExist() {
	assertIncludes(
		appJs,
		"function scrollToAbout()",
		"learn CTA handler should exist",
	);
	assertIncludes(
		appJs,
		"function goToPreviousPage()",
		"previous page handler should exist",
	);
	assertIncludes(
		appJs,
		"function goToNextPage()",
		"next page handler should exist",
	);
	assertIncludes(
		appJs,
		"function updatePagination()",
		"pagination updater should exist",
	);
	assertIncludes(
		appJs,
		"function toggleSearchPanel()",
		"search toggle handler should exist",
	);
}

function testCollapsedReadingModeMarkup() {
	assertIncludes(
		appJs,
		"detailMarkup",
		"detail markup should be built lazily inside expanded content",
	);
	assert.ok(
		!appJs.includes(
			'<p class="card-meaning">${oneLine}</p>\n      \n      <button',
		),
		"meaning should not render before the reveal button",
	);
}

function testStylesSupportMobileSearchAndPagination() {
	assertIncludes(
		stylesCss,
		".search-panel.mobile-collapsed",
		"mobile search collapse styles should exist",
	);
	assertIncludes(
		stylesCss,
		".reading-pagination",
		"reading pagination styles should exist",
	);
}

function testReducedMotionCriticalCssIsValid() {
	assertIncludes(
		pageSource,
		"@media (prefers-reduced-motion: reduce)",
		"critical CSS should honor prefers-reduced-motion with a valid media query",
	);
	assert.ok(
		!pageSource.includes("@prefers-reduced-motion"),
		"critical CSS should not contain an invalid reduced-motion at-rule",
	);
}

function testElaborationContentDoesNotTrapMobileReading() {
	assertIncludes(
		stylesCss,
		".elaboration.expanded .elaboration-content",
		"expanded elaboration content styles should exist",
	);
	assert.ok(
		!stylesCss.includes("max-height: 500px;"),
		"expanded elaboration content should not be capped to an internal 500px scroll area",
	);
	assert.ok(
		!stylesCss.includes("overflow-y: auto;"),
		"expanded elaboration content should not require nested vertical scrolling",
	);
}

function testVersionedStaticAssetsExist() {
	assertIncludes(
		pageSource,
		"const assetVersion = Date.now().toString(36);",
		"Astro page should create a per-build asset version",
	);
	assertIncludes(
		pageSource,
		"window.__ASSET_VERSION__ = assetVersion;",
		"asset version should be exposed to client scripts",
	);
	assertIncludes(
		pageSource,
		"src={versionedAsset('/app.js')}",
		"app script should be cache-busted",
	);
	assertIncludes(
		pageSource,
		"src={versionedAsset('/navigation.js')}",
		"navigation script should be cache-busted",
	);
	assertIncludes(
		pageSource,
		"src={versionedAsset('/translations.js')}",
		"translations script should be cache-busted",
	);
	assertIncludes(
		pageSource,
		"href={versionedAsset('/styles.min.css')}",
		"stylesheet should be cache-busted",
	);
}

function testJsonFetchesUseVersionedUrls() {
	assertIncludes(
		appJs,
		"function getAssetUrl(path)",
		"app should centralize versioned asset URLs",
	);
	assert.ok(
		appJs.includes("getAssetUrl('/data_manifest.json')") ||
			appJs.includes('getAssetUrl("/data_manifest.json")'),
		"manifest fetch should be cache-busted",
	);
	assertIncludes(
		appJs,
		"getAssetUrl(`/data_chunk_${chunkNum}.json`)",
		"chunk fetches should be cache-busted",
	);
	assert.ok(
		appJs.includes("getAssetUrl('/search.js')") ||
			appJs.includes('getAssetUrl("/search.js")'),
		"search logic should load lazily on first search intent",
	);
	assertIncludes(
		appJs,
		"importModuleWithRetry",
		"lazy search loading should use the same retry wrapper as JSON fetches",
	);
	assertIncludes(
		appJs,
		"withTimeout(() => import(url), timeoutMs)",
		"lazy search loading should have an explicit timeout guard",
	);
	assertIncludes(
		appJs,
		"announceRetryProgress",
		"network retries should expose progressive status updates",
	);
	assertIncludes(
		appJs,
		"usePrerenderedPageOne",
		"app should track whether prerendered page-one DOM can be adopted",
	);
	assertIncludes(
		appJs,
		"function getTotalAvailableCount()",
		"pagination should account for deferred full-data loading",
	);
	assert.ok(
		!appJs.includes("requestIdleCallback(() => preloadRemainingChunks())"),
		"remaining chunks should not eagerly preload on idle",
	);
}

function testServiceWorkerOfflineShellExists() {
	assertIncludes(
		pageSource,
		"navigator.serviceWorker.register('/sw.js?v=' + encodeURIComponent(window.__ASSET_VERSION__ || ''))",
		"page should register the offline service worker",
	);
	assertIncludes(
		serviceWorkerJs,
		"/data_chunk_1.json",
		"service worker should cache the first names chunk for offline reading",
	);
	assertIncludes(
		serviceWorkerJs,
		"/data_manifest.json",
		"service worker should cache the manifest for offline pagination metadata",
	);
	assertIncludes(
		serviceWorkerJs,
		'self.addEventListener("fetch"',
		"service worker should intercept same-origin fetches",
	);
}

function testHeadersDoNotMarkMutableAssetsImmutable() {
	assertIncludes(
		headersFile,
		"/app.js",
		"headers should define app.js caching",
	);
	assertIncludes(
		headersFile,
		"/translations.js",
		"headers should define translations.js caching",
	);
	assert.ok(
		!headersFile.includes(
			"/app.js\n  Cache-Control: public, max-age=2592000, immutable",
		),
		"app.js should no longer be immutable",
	);
	assert.ok(
		!headersFile.includes(
			"/data_manifest.json\n  Cache-Control: public, max-age=2592000, immutable",
		),
		"data manifest should no longer be immutable",
	);
}

function testTranslationsExist() {
	["backToTop", "backToTopTitle", "goToNames", "goToNamesTitle"].forEach(
		(key) =>
			assertIncludes(
				translationsJs,
				key,
				`translation key ${key} should exist`,
			),
	);
}

function testHomepageLinksStaticNamesHub() {
	assertIncludes(
		pageSource,
		'href="/names/"',
		"homepage should visibly link to the static names hub",
	);
}

function testStaticNamesPagesExposeSeoMarkers() {
	const namesPagesDir = path.join(__dirname, "..", "src", "pages", "names");
	const namesFiles = collectAstroFiles(namesPagesDir);
	assert.ok(
		namesFiles.length > 0,
		"names static pages should exist under src/pages/names",
	);

	const namesSource = namesFiles
		.map((file) => fs.readFileSync(file, "utf8"))
		.join("\n");
	assertIncludes(
		namesSource,
		"getStaticPaths",
		"names pages should expose static range paths",
	);
	assertIncludes(
		namesSource,
		'<link rel="canonical"',
		"names pages should define canonical URLs",
	);
	assertIncludes(
		namesSource,
		'<meta name="description"',
		"names pages should define description metadata",
	);
	assert.ok(
		namesSource.includes("application/ld+json") ||
			namesSource.includes("@type': 'ItemList'"),
		"names pages should include structured data markers for static listings",
	);
}

function testSitemapIncludesStaticNamesUrls() {
	const expectedStaticUrls = [
		"https://1000namesofmakali.com/names/",
		"https://1000namesofmakali.com/names/1-100/",
		"https://1000namesofmakali.com/names/1001-1072/",
	];
	expectedStaticUrls.forEach((url) => {
		assertIncludes(
			sitemapXml,
			`<loc>${url}</loc>`,
			`sitemap should include ${url}`,
		);
		assert.ok(
			sitemapXml.includes(
				`<loc>${url}</loc>\n    <lastmod>2026-04-26</lastmod>`,
			),
			`sitemap should mark ${url} with 2026-04-26 lastmod`,
		);
	});
}

testHeroCtasExist();
testAboutSectionComesAfterNamesSection();
testReadingModeControlsExist();
testPrerenderedFirstPageStructureExists();
testAppHooksExist();
testCollapsedReadingModeMarkup();
testStylesSupportMobileSearchAndPagination();
testReducedMotionCriticalCssIsValid();
testElaborationContentDoesNotTrapMobileReading();
testVersionedStaticAssetsExist();
testJsonFetchesUseVersionedUrls();
testServiceWorkerOfflineShellExists();
testHeadersDoNotMarkMutableAssetsImmutable();
testTranslationsExist();
testHomepageLinksStaticNamesHub();
testStaticNamesPagesExposeSeoMarkers();
testSitemapIncludesStaticNamesUrls();

console.log("ux structure tests passed");
