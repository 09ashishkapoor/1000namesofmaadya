const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const BOOT = {
	setSize: 11,
	totalSets: 98,
	totalCount: 1072,
	names: [
		{
			number: 1,
			dev: "श्मशान कालिका",
			iast: "Śmaśāna Kālikā",
			common: "Shmashana Kalika",
			slug: "shmashana-kalika",
			one: "The Dark-bodied Goddess of the Cremation Ground.",
			elab: "The name Shhmashhana Kalika is a powerful compound.",
		},
	],
};

function loadReader({ boot = BOOT, assetVersion = "build123", onLine = true } = {}) {
	const scriptPath = path.join(__dirname, "..", "public", "app.js");
	const source = fs.readFileSync(scriptPath, "utf8");

	const documentStub = {
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
		createElement() {
			return {
				setAttribute() {},
				appendChild() {},
				classList: { add() {}, toggle() {} },
				style: {},
			};
		},
	};

	const context = {
		console: { log() {}, warn() {}, error() {} },
		navigator: { onLine },
		document: documentStub,
		setTimeout,
		clearTimeout,
		Promise,
		Map,
		fetch() {
			return Promise.reject(new Error("fetch disabled in test"));
		},
		window: {
			__ASSET_VERSION__: assetVersion,
			__READER_BOOT__: boot,
			matchMedia() {
				return { matches: false };
			},
		},
	};
	context.global = context;
	context.globalThis = context;
	context.self = context.window;

	vm.runInNewContext(source, context, { filename: "app.js" });
	return { reader: context.window.__READER__, context };
}

function testAssetUrlsUseVersionQuery() {
	const { reader } = loadReader({ assetVersion: "abc123" });
	assert.strictEqual(reader.getAssetUrl("/data_manifest.json"), "/data_manifest.json?v=abc123");
	assert.strictEqual(reader.getAssetUrl("/name-spine.json"), "/name-spine.json?v=abc123");
}

function testAssetUrlsWithoutVersion() {
	const { reader } = loadReader({ assetVersion: "" });
	assert.strictEqual(reader.getAssetUrl("/name-spine.json"), "/name-spine.json");
}

function testNormalizeIsAccentInsensitive() {
	const { reader } = loadReader();
	assert.strictEqual(reader.normalize("Kālī"), "kali");
	assert.strictEqual(reader.normalize("Śmaśāna Kālikā"), "smasana kalika");
	assert.strictEqual(reader.normalize("Kurukullā-Virodhinī"), "kurukulla-virodhini");
	assert.strictEqual(reader.normalize(null), "");
}

function testPadUsesTwoDigits() {
	const { reader } = loadReader();
	assert.strictEqual(reader.pad(1), "01");
	assert.strictEqual(reader.pad(9), "09");
	assert.strictEqual(reader.pad(11), "11");
	assert.strictEqual(reader.pad(1072), "1072");
}

function testShortenCutsOnWordBoundary() {
	const { reader } = loadReader();
	const short = "A short note.";
	assert.strictEqual(reader.shorten(short), short);

	const long = `${"word ".repeat(400)}end`;
	const cut = reader.shorten(long);
	assert.ok(cut.length <= 641, "shortened elaboration stays near the limit");
	assert.ok(cut.endsWith("…"), "shortened elaboration is marked with an ellipsis");
	const kept = cut.slice(0, -1);
	assert.ok(long.startsWith(kept), "the kept text is a prefix of the original");
	assert.ok(/[\s,;:]/.test(long[kept.length]), "the cut lands on a word boundary, not inside a word");
}

function testSetRangesCoverAllNames() {
	const { reader } = loadReader();
	// Objects cross the VM realm boundary, so compare the values, not the references.
	const range = (index) => {
		const value = reader.rangeForSet(index);
		return [value.start, value.end];
	};
	assert.deepStrictEqual(range(0), [1, 11]);
	assert.deepStrictEqual(range(1), [12, 22]);
	assert.deepStrictEqual(range(97), [1068, 1072]);
}

function testBuildSetNamesMergesSpellingAndMeaning() {
	const { reader } = loadReader();
	const spine = new Map([
		[1, { dev: "श्मशान कालिका", iast: "Śmaśāna Kālikā", slug: "shmashana-kalika" }],
		[2, { dev: "काली", iast: "Kālī", slug: "kali" }],
	]);
	const chunk = new Map([
		[1, { index: 1, english_name: "SHHMASHHANA KALIKA", english_one_line: "One.", english_elaboration: "Long note." }],
		[2, { index: 2, english_name: "KALI", english_one_line: "Two.", english_elaboration: "Another note." }],
	]);
	const names = reader.buildSetNames(0, spine, [chunk]);

	assert.strictEqual(names.length, 11, "a set always carries eleven rows");
	assert.strictEqual(names[0].dev, "श्मशान कालिका", "Devanagari comes from the spelling mapping");
	assert.strictEqual(names[1].iast, "Kālī", "IAST comes from the spelling mapping");
	assert.strictEqual(names[0].one, "One.", "the one-line meaning comes from the chunk");
	assert.strictEqual(names[0].slug, "shmashana-kalika", "the page slug comes from the mapping");
	assert.strictEqual(names[0].elab, "Long note.");
	assert.strictEqual(names[2].one, "", "names beyond the loaded chunk render empty rather than guessed text");
}

function testReadableErrorMessages() {
	const { reader } = loadReader();
	assert.strictEqual(
		reader.describeFailure(new Error("boom")),
		"This set of names could not be loaded. Please try again.",
	);
	const offline = loadReader({ onLine: false }).reader;
	assert.strictEqual(offline.describeFailure(new Error("boom")), "You appear to be offline. Reconnect and try again.");
	const aborted = loadReader().reader;
	const error = new Error("timeout");
	error.name = "AbortError";
	assert.strictEqual(
		aborted.describeFailure(error),
		"The connection is taking longer than expected. Please try again.",
	);
}

function testStatusWritesTextAndErrorClass() {
	const { reader } = loadReader();
	const classes = new Set();
	reader.elements.status = {
		textContent: "",
		classList: {
			toggle(name, force) {
				if (force) classes.add(name);
				else classes.delete(name);
			},
		},
	};
	reader.setStatus("Could not load", true);
	assert.strictEqual(reader.elements.status.textContent, "Could not load");
	assert.ok(classes.has("is-error"));
	reader.setStatus("", false);
	assert.strictEqual(reader.elements.status.textContent, "");
	assert.ok(!classes.has("is-error"));
}

function testReaderBootstrapsFromServerPayload() {
	const { reader } = loadReader();
	assert.strictEqual(reader.state.setIndex, 0);
	assert.strictEqual(reader.state.current, 0);
	assert.strictEqual(reader.state.names.length, 1);
	assert.strictEqual(reader.state.names[0].dev, "श्मशान कालिका");
}

function testSelectNameIgnoresOutOfRange() {
	const { reader } = loadReader();
	reader.selectName(3);
	assert.strictEqual(reader.state.current, 0, "an out-of-range index does not move the selection");
}

testAssetUrlsUseVersionQuery();
testAssetUrlsWithoutVersion();
testNormalizeIsAccentInsensitive();
testPadUsesTwoDigits();
testShortenCutsOnWordBoundary();
testSetRangesCoverAllNames();
testBuildSetNamesMergesSpellingAndMeaning();
testReadableErrorMessages();
testStatusWritesTextAndErrorClass();
testReaderBootstrapsFromServerPayload();
testSelectNameIgnoresOutOfRange();

console.log("app.js reader tests passed");
