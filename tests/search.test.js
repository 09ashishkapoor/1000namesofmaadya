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
	assert.ok(page.includes('aria-label="Search all 1,072 names"'), "both inputs are labelled for the whole book");
	assert.ok(page.includes('placeholder="find any name or meaning"'), "both inputs advertise global search");
	assert.ok(page.includes('role="status"'), "result counts are announced");
	assert.ok(page.includes("normalize('NFD')"), "server-rendered rows carry a normalized search blob");
}

function testSearchIndexCoversAllNames() {
	const index = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "public", "search-index.json"), "utf8"));
	assert.strictEqual(index.length, 1072, "the index carries every name in the book");
	index.forEach((row, offset) => {
		assert.strictEqual(row[0], offset + 1, "indices stay in canonical order");
		assert.ok(row[1] && row[2] && row[3] && row[4], "each row has Devanagari, IAST, spelling and meaning");
	});
}

function testGlobalSearchReachesTheWholeRange() {
	const index = reader.parseSearchIndex(
		JSON.parse(fs.readFileSync(path.join(__dirname, "..", "public", "search-index.json"), "utf8")),
	);
	const find = (query) => reader.globalMatches(index, query).map((name) => name.number);

	// The last name in the book is far past the eleven server-rendered rows.
	assert.ok(find("Varṇa Japa Mālā Vidhāyinī").includes(1072), "a late name is found by its accented IAST");
	assert.ok(find("varna japa mala").includes(1072), "a late name is found without diacritics");
	assert.ok(find("वर्ण जप माला विधायिनी").includes(1072), "a late name is found by Devanagari");
	assert.ok(find("rosary of japa").includes(1072), "a late name is found by its meaning");
	assert.ok(find("1072").includes(1072), "a name can be found by its ordinal");
	assert.ok(find("Smasana Kalika").includes(1), "a known spelling variant is searchable");
	assert.ok(find("not-a-real-name-shmashana").length === 0, "a nonsense query finds nothing");
}

testAsciiQueryFindsDiacritics();
testDiacriticQueryFindsAsciiCopy();
testSearchReachesTheMeaning();
testDevanagariQueryMatches();
testEmptyQueryMatchesEverything();
testReaderExposesBothSearchInputs();
testSearchIndexCoversAllNames();
testGlobalSearchReachesTheWholeRange();

console.log("search.js regression tests passed");
