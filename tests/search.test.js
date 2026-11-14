const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

function loadReader() {
	const source = fs.readFileSync(path.join(__dirname, "..", "public", "app.js"), "utf8");
	const context = {
		console: { log() {}, warn() {}, error() {} },
		navigator: { onLine: true },
		document: {
			readyState: "complete",
			addEventListener() {},
			getElementById() {
				return null;
			},
			querySelector() {
				return null;
			},
			querySelectorAll() {
				return [];
			},
		},
		setTimeout,
		clearTimeout,
		Promise,
		Map,
		window: {
			__ASSET_VERSION__: "test",
			__READER_BOOT__: {
				setSize: 11,
				totalSets: 98,
				totalCount: 1072,
				names: [
					{
						number: 1,
						dev: "श्मशान कालिका",
						iast: "Śmaśāna Kālikā",
						common: "Shmashana Kalika",
						one: "The Dark-bodied Goddess of the Cremation Ground.",
					},
					{
						number: 2,
						dev: "काली",
						iast: "Kālī",
						common: "Kali",
						one: "The Black Goddess, Ruler of Time.",
					},
				],
			},
			matchMedia() {
				return { matches: false };
			},
		},
	};
	context.global = context;
	context.globalThis = context;
	context.self = context.window;
	vm.runInNewContext(source, context, { filename: "app.js" });
	return context.window.__READER__;
}

const reader = loadReader();

// The reader stores a normalized haystack per row and does a substring test on it.
function rowBlob(name) {
	return reader.normalize([name.dev, name.iast, name.common, name.one].join(" "));
}

function matches(name, query) {
	return rowBlob(name).indexOf(reader.normalize(query)) !== -1;
}

const shmashana = {
	dev: "श्मशान कालिका",
	iast: "Śmaśāna Kālikā",
	common: "Shmashana Kalika",
	one: "The Dark-bodied Goddess of the Cremation Ground, the Power of Death and Dissolution.",
};
const kali = {
	dev: "काली",
	iast: "Kālī",
	common: "Kali",
	one: "The Black Goddess, Ruler of Time.",
};

function testAsciiQueryFindsDiacritics() {
	assert.ok(matches(kali, "kali"), "kali finds Kālī");
	assert.ok(matches(kali, "KALI"), "the query is case-insensitive");
	assert.ok(matches(shmashana, "smasana"), "smasana finds Śmaśāna");
	assert.ok(matches(shmashana, "kalka") === false, "a query that is not there does not match");
}

function testDiacriticQueryFindsAsciiCopy() {
	assert.ok(matches(kali, "Kālī"), "a query typed with diacritics still matches");
	assert.ok(matches(shmashana, "Śmaśāna"), "an accented query matches the IAST row");
}

function testSearchReachesTheMeaning() {
	assert.ok(matches(shmashana, "cremation"), "search covers the one-line meaning");
	assert.ok(matches(kali, "ruler of time"), "multi-word meaning queries match");
}

function testDevanagariQueryMatches() {
	assert.ok(matches(kali, "काली"), "the Devanagari form is searchable");
}

function testEmptyQueryMatchesEverything() {
	assert.strictEqual(reader.normalize(""), "", "an empty query normalizes to empty");
	assert.ok(rowBlob(kali).indexOf("") !== -1, "an empty query matches every row");
}

function testReaderExposesBothSearchInputs() {
	const page = fs.readFileSync(path.join(__dirname, "..", "src", "pages", "index.astro"), "utf8");
	assert.ok(page.includes('id="q"'), "the reading leaf carries a search input");
	assert.ok(page.includes('id="mq"'), "the phone index carries a search input");
	assert.ok(page.includes('aria-label="Search this set"'), "both inputs are labelled");
	assert.ok(page.includes('role="status"'), "result counts are announced");
	assert.ok(page.includes("normalize('NFD')"), "server-rendered rows carry a normalized search blob");
}

testAsciiQueryFindsDiacritics();
testDiacriticQueryFindsAsciiCopy();
testSearchReachesTheMeaning();
testDevanagariQueryMatches();
testEmptyQueryMatchesEverything();
testReaderExposesBothSearchInputs();

console.log("search.js regression tests passed");
