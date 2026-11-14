const assert = require("assert");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

function read(file) {
	return fs.readFileSync(path.join(ROOT, file), "utf8");
}

function walk(dir, extensions) {
	const absolute = path.join(ROOT, dir);
	if (!fs.existsSync(absolute)) return [];
	return fs.readdirSync(absolute, { withFileTypes: true }).flatMap((entry) => {
		const entryPath = path.join(absolute, entry.name);
		if (entry.isDirectory()) return walk(path.join(dir, entry.name), extensions);
		return entry.isFile() && extensions.some((extension) => entry.name.endsWith(extension))
			? [entryPath]
			: [];
	});
}

const layout = read("src/layouts/ReferenceLayout.astro");
const readerPage = read("src/pages/index.astro");
const namePage = read("src/pages/names/[name].astro");
const rangePage = read("src/pages/names/[range].astro");
const hubPage = read("src/pages/names/index.astro");
const runningHead = read("src/components/RunningHead.astro");
const colophon = read("src/components/Colophon.astro");
const appJs = read("public/app.js");
const pothiCss = read("public/pothi.css");
const themeJs = read("public/pothi-theme.js");
const headersFile = read("public/_headers");
const sitemapXml = read("public/sitemap.xml").replace(/\r\n/g, "\n");
const serviceWorkerJs = read("public/sw.js");

const astroPages = walk("src/pages", [".astro"]);
const astroSources = [...astroPages, ...walk("src/layouts", [".astro"]), ...walk("src/components", [".astro"])].map(
	(file) => fs.readFileSync(file, "utf8"),
);

function assertIncludes(text, snippet, message) {
	assert.ok(text.includes(snippet), message);
}

/* ---------- one stylesheet ---------- */

function testLegacyStylesheetsAreGone() {
	["public/styles.css", "public/styles.min.css", "public/reference.css"].forEach((file) => {
		assert.ok(!fs.existsSync(path.join(ROOT, file)), `${file} should be removed from the build`);
	});
	astroSources.forEach((source) => {
		assert.ok(!source.includes("reference.css"), "no template should link the old reference.css");
		assert.ok(!source.includes("styles.min.css"), "no template should link the old styles.min.css");
	});
}

function testSingleStylesheetIsLinked() {
	assertIncludes(layout, 'href="/pothi.css"', "the shared layout links the one Pothi stylesheet");
	assertIncludes(readerPage, "versionedAsset('/pothi.css')", "the reader links the same stylesheet");
	assertIncludes(pothiCss, "--cinnabar:", "the stylesheet carries the approved tokens");
	assertIncludes(pothiCss, ':root[data-theme="night"]', "the stylesheet carries the night token set");
}

/* ---------- night reading on every template ---------- */

function testNightReadingIsOnEveryTemplate() {
	assertIncludes(layout, "<RunningHead />", "the shared layout renders the head that carries the control");
	assertIncludes(runningHead, "data-theme-toggle", "the running head component carries the night control");
	assertIncludes(layout, "localStorage.getItem('pothi-theme')", "the layout applies the stored theme before paint");
	assertIncludes(readerPage, "localStorage.getItem('pothi-theme')", "the reader applies the stored theme before paint");
	assertIncludes(layout, 'src="/pothi-theme.js"', "the layout loads the shared control script");
	assertIncludes(readerPage, 'src="/pothi-theme.js"', "the reader loads the shared control script");
	assertIncludes(themeJs, "localStorage.setItem", "the control remembers an explicit choice");
	assertIncludes(themeJs, "prefers-color-scheme: dark", "the control follows the system while unset");
	assertIncludes(themeJs, "aria-pressed", "the control exposes aria-pressed");
	assertIncludes(pothiCss, "@media print", "print restores the day tokens");
}

/* ---------- shared chrome ---------- */

function testEveryPageOpensAndClosesTheSameBook() {
	assertIncludes(layout, "<RunningHead />", "the shared layout renders the running head");
	assertIncludes(layout, "<Colophon", "the shared layout renders the colophon");
	assertIncludes(readerPage, "<RunningHead />", "the reader renders the running head");
	assertIncludes(readerPage, "<Colophon", "the reader renders the colophon");
	assertIncludes(colophon, "V{version}", "the colophon renders the version at build time");
	assertIncludes(colophon, "{lastUpdated}", "the colophon renders the last-updated date at build time");
	assert.ok(!colophon.includes("V1.21.0"), "the stale hardcoded version is gone");
}

function testGuideAndTextPagesUseTheSharedLayout() {
	const required = [
		"108-names-of-kali",
		"1008-names-of-kali",
		"kali-sahasranama-pdf",
		"kali-sahasranama-lyrics",
		"kali-sahasranama-benefits",
		"about",
		"contact",
		"privacy",
		"sources",
	];
	required.forEach((slug) => {
		const source = read(`src/pages/${slug}/index.astro`);
		assertIncludes(source, "ReferenceLayout", `${slug} renders through the shared layout`);
	});
}

/* ---------- the reader: eleven names, server-rendered ---------- */

function testReaderServerRendersItsFirstSet() {
	assertIncludes(readerPage, "getNameMapping()", "the reader reads spelling forms from the name mapping");
	assertIncludes(readerPage, "firstChunkEntries.slice(0, SET_SIZE)", "the first eleven meanings are read at build time");
	assertIncludes(readerPage, "row?.devanagari", "the reader renders Devanagari from the mapping");
	assertIncludes(readerPage, "row?.iast", "the reader renders IAST from the mapping");
	assertIncludes(readerPage, "window.__READER_BOOT__ = readerBoot", "the first set is handed to the client");
	assertIncludes(readerPage, 'lang="sa"', "Devanagari is marked as Sanskrit");
	assert.ok(!readerPage.includes("name-card"), "the old card grid is gone");
	assert.ok(!readerPage.includes("data-prerendered"), "the old prerender marker is gone");
}

function testReaderScriptKeepsTheContracts() {
	assertIncludes(appJs, "function getAssetUrl", "asset URLs stay versioned");
	assertIncludes(appJs, "function normalize", "search stays accent-insensitive");
	assertIncludes(appJs, "function describeFailure", "network failures still explain themselves");
	assertIncludes(appJs, "navigator.onLine === false", "offline is still detected");
	assertIncludes(appJs, "reader-status", "the reader announces loading and failure");
	assertIncludes(appJs, "'/name-spine.json'", "the remainder of the names comes from the committed data");
	assert.ok(!appJs.includes("innerHTML"), "the reader never injects markup into the page");
}

function testReaderSourceHasNoStrayScriptTag() {
	assert.ok(
		!/<\/script>\s*<\/script>/.test(readerPage),
		"no stray </script> closes a script that was never opened",
	);
}

/* ---------- name / range / hub ---------- */

function testNamePageUsesTheSystem() {
	assertIncludes(namePage, 'class="dev-title"', "the Devanagari name is the page title");
	assertIncludes(namePage, 'class="iast-title"', "IAST sits under the Devanagari");
	assertIncludes(namePage, 'class="common-title"', "the common spelling stays visible");
	assertIncludes(namePage, 'class="spellings"', "the spelling table is present");
	assertIncludes(namePage, 'class="pager"', "the name pager is present");
	assertIncludes(namePage, 'class="seealso"', "the see-also list is present");
	assertIncludes(namePage, "getStaticPaths", "name pages are statically generated");
}

function testRangePageRendersStaticRows() {
	assertIncludes(rangePage, "getStaticPaths", "range pages expose static paths");
	assertIncludes(rangePage, 'class="rtabs"', "range tabs are present");
	assertIncludes(rangePage, 'class="nrow"', "rows use the dense index component");
	assertIncludes(rangePage, "id={`name-${entry.index}`}", "rows keep the anchors the ItemList schema points at");
	assertIncludes(rangePage, "itemListElement", "the ItemList structured data is preserved");
	assertIncludes(rangePage, "entry.devanagari", "rows carry Devanagari");
	assertIncludes(rangePage, "entry.iast", "rows carry IAST");
}

function testHubListsTheRanges() {
	assertIncludes(hubPage, 'class="range-list"', "the hub lists the eleven ranges");
	assertIncludes(hubPage, "range.firstName.english", "each range keeps its first name");
	assertIncludes(hubPage, "range.lastName.english", "each range keeps its last name");
}

/* ---------- accessibility floor ---------- */

function testAccessibilityFloor() {
	assertIncludes(pothiCss, "@media (prefers-reduced-motion: reduce)", "reduced motion is honoured");
	assertIncludes(pothiCss, ":focus-visible", "focus rings are visible");
	assertIncludes(pothiCss, "min-height: 44px", "controls meet the 44px target");
	assertIncludes(pothiCss, "font-size: 17.5px", "phones get the 17.5px floor");
	assert.ok(!pothiCss.includes("text-transform: uppercase"), "no uppercase micro-labels");
	astroSources.forEach((source) => {
		assert.ok(!/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(source), "no emoji in page markup");
	});
	assert.ok(!/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(appJs), "no emoji in the reader script");
}

/* ---------- assets, service worker, headers, sitemap ---------- */

function testVersionedAssetsAndOfflineShell() {
	assertIncludes(readerPage, "const assetVersion = encodeURIComponent(packageJson.version || '1');", "assets stay versioned");
	assertIncludes(readerPage, "window.__ASSET_VERSION__ = assetVersion;", "the version reaches the client");
	assertIncludes(readerPage, "src={versionedAsset('/app.js')}", "app.js is cache-busted");
	assertIncludes(readerPage, "href={versionedAsset('/pothi.css')}", "the stylesheet is cache-busted");
	assertIncludes(readerPage, "navigator.serviceWorker", "the offline shell is still registered");
	assertIncludes(readerPage, "/sw.js?v=", "the service worker is registered with the asset version");
	assertIncludes(serviceWorkerJs, "/data_chunk_1.json", "the service worker caches the first names chunk");
	assertIncludes(serviceWorkerJs, "/data_manifest.json", "the service worker caches the manifest");
	assertIncludes(serviceWorkerJs, "/pothi.css", "the service worker caches the one stylesheet");
	assertIncludes(serviceWorkerJs, 'self.addEventListener("fetch"', "the service worker intercepts fetches");
	assertIncludes(serviceWorkerJs, 'url.pathname === "/version.json"', "version.json is never cached");
}

function testHeadersDoNotMarkMutableAssetsImmutable() {
	assertIncludes(headersFile, "/app.js", "headers define app.js caching");
	assertIncludes(headersFile, "/pothi.css", "headers define the stylesheet caching");
	assert.ok(
		!headersFile.includes("/app.js\n  Cache-Control: public, max-age=2592000, immutable"),
		"app.js should not be immutable",
	);
	assert.ok(
		!headersFile.includes("/data_manifest.json\n  Cache-Control: public, max-age=2592000, immutable"),
		"the data manifest should not be immutable",
	);
}

function testSitemapIncludesStaticNamesUrls() {
	[
		"https://1000namesofmakali.com/names/",
		"https://1000namesofmakali.com/names/1-100/",
		"https://1000namesofmakali.com/names/1001-1072/",
	].forEach((url) => {
		assertIncludes(sitemapXml, `<loc>${url}</loc>`, `sitemap should include ${url}`);
		assert.ok(
			sitemapXml.includes(`<loc>${url}</loc>\n    <lastmod>2026-04-26</lastmod>`),
			`sitemap should mark ${url} with 2026-04-26 lastmod`,
		);
	});
}

function testStaticNamesPagesExposeSeoMarkers() {
	const namesSource = [layout, namePage, rangePage, hubPage].join("\n");
	assertIncludes(namesSource, "getStaticPaths", "names pages expose static paths");
	assertIncludes(namesSource, 'rel="canonical"', "names pages define canonical URLs");
	assertIncludes(namesSource, 'name="description"', "names pages define description metadata");
	assert.ok(
		namesSource.includes("application/ld+json") || namesSource.includes("@type': 'ItemList'"),
		"names pages include structured data",
	);
}

/* ---------- the derived spine cannot drift ---------- */

function testNameSpineMatchesTheMapping() {
	const mapping = JSON.parse(read("src/data/name-mapping.json"));
	const spine = JSON.parse(read("public/name-spine.json"));
	assert.strictEqual(spine.count, mapping.rows.length, "the spine covers every name");
	assert.deepStrictEqual(
		spine.names.map((row) => row[0]),
		mapping.rows.map((row) => Number(row.number)),
		"the spine keeps the same positions",
	);
	const first = spine.names[0];
	const firstRow = mapping.rows[0];
	assert.strictEqual(first[1], firstRow.devanagari, "Devanagari matches the mapping");
	assert.strictEqual(first[2], firstRow.iast, "IAST matches the mapping");
	assert.strictEqual(first[3], firstRow.page_slug, "the slug matches the mapping");
}

testLegacyStylesheetsAreGone();
testSingleStylesheetIsLinked();
testNightReadingIsOnEveryTemplate();
testEveryPageOpensAndClosesTheSameBook();
testGuideAndTextPagesUseTheSharedLayout();
testReaderServerRendersItsFirstSet();
testReaderScriptKeepsTheContracts();
testReaderSourceHasNoStrayScriptTag();
testNamePageUsesTheSystem();
testRangePageRendersStaticRows();
testHubListsTheRanges();
testAccessibilityFloor();
testVersionedAssetsAndOfflineShell();
testHeadersDoNotMarkMutableAssetsImmutable();
testSitemapIncludesStaticNamesUrls();
testStaticNamesPagesExposeSeoMarkers();
testNameSpineMatchesTheMapping();

console.log("ux structure tests passed");
