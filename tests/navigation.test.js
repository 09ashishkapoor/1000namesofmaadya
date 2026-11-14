const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

function read(file) {
	return fs.readFileSync(path.join(__dirname, "..", file), "utf8");
}

/* ---------- the running head markup ---------- */

function testRunningHeadCarriesBrandNavAndControl() {
	const head = read("src/components/RunningHead.astro");
	assert.ok(head.includes('class="brand"'), "the running head carries the brand");
	assert.ok(head.includes('href="/"'), "the brand links home");
	assert.ok(head.includes('lang="sa"'), "the brand sets the Devanagari title");
	assert.ok(head.includes('nav aria-label="Site"'), "the site nav is labelled");
	["/names/", "/108-names-of-kali/", "/1008-names-of-kali/", "/kali-sahasranama-pdf/", "/kali-sahasranama-lyrics/", "/kali-sahasranama-benefits/", "/about/"].forEach(
		(href) => assert.ok(head.includes(`href: '${href}'`), `the running head keeps the ${href} link`),
	);
	assert.ok(head.includes("data-theme-toggle"), "the running head carries the night control");
	assert.ok(head.includes('aria-pressed="false"'), "the control starts unpressed");
	assert.ok(head.includes('aria-label="Switch to night reading"'), "the control starts with the day label");
}

/* ---------- the shared control ---------- */

function loadTheme({ stored = null, systemDark = false } = {}) {
	const root = {
		attributes: {},
		getAttribute(name) {
			return this.attributes[name];
		},
		setAttribute(name, value) {
			this.attributes[name] = value;
		},
		removeAttribute(name) {
			delete this.attributes[name];
		},
	};

	const button = {
		attributes: {},
		label: null,
		children: { ".lbl": { textContent: "" } },
		setAttribute(name, value) {
			this.attributes[name] = value;
		},
		querySelector(selector) {
			return this.children[selector] || null;
		},
	};

	const listeners = {};
	const changeListeners = [];
	const store = new Map();
	if (stored !== null) store.set("pothi-theme", stored);

	const mediaQuery = {
		matches: systemDark,
		addEventListener(event, handler) {
			if (event === "change") changeListeners.push(handler);
		},
	};

	const context = {
		document: {
			documentElement: root,
			addEventListener(event, handler) {
				listeners[event] = handler;
			},
			querySelectorAll() {
				return [button];
			},
		},
		window: {
			matchMedia() {
				return mediaQuery;
			},
		},
		localStorage: {
			getItem(key) {
				return store.has(key) ? store.get(key) : null;
			},
			setItem(key, value) {
				store.set(key, value);
			},
		},
		console: { log() {}, warn() {} },
	};
	context.global = context;
	context.globalThis = context;

	vm.runInNewContext(read("public/pothi-theme.js"), context, { filename: "pothi-theme.js" });

	function click() {
		listeners.click({
			target: {
				closest(selector) {
					return selector === "[data-theme-toggle]" ? button : null;
				},
			},
		});
	}

	return { root, button, store, changeListeners, mediaQuery, click };
}

function testControlStartsFromTheDayLabel() {
	const { button } = loadTheme();
	assert.strictEqual(button.attributes["aria-pressed"], "false");
	assert.strictEqual(button.attributes["aria-label"], "Switch to night reading");
	assert.strictEqual(button.children[".lbl"].textContent, "Night");
}

function testControlTogglesAndPersists() {
	const theme = loadTheme();
	theme.click();
	assert.strictEqual(theme.root.attributes["data-theme"], "night", "a click switches to night");
	assert.strictEqual(theme.store.get("pothi-theme"), "night", "the choice is remembered");
	assert.strictEqual(theme.button.attributes["aria-pressed"], "true");
	assert.strictEqual(theme.button.attributes["aria-label"], "Switch to day reading");
	assert.strictEqual(theme.button.children[".lbl"].textContent, "Day");

	theme.click();
	assert.strictEqual(theme.root.attributes["data-theme"], undefined, "a second click returns to day");
	assert.strictEqual(theme.store.get("pothi-theme"), "day");
}

function testControlFollowsTheSystemUntilAnExplicitChoice() {
	const theme = loadTheme({ systemDark: false });
	assert.strictEqual(theme.changeListeners.length, 1, "the control listens for system changes");
	theme.mediaQuery.matches = true;
	theme.changeListeners[0]({ matches: true });
	assert.strictEqual(theme.root.attributes["data-theme"], "night", "an unset preference follows the system");
	assert.strictEqual(theme.store.get("pothi-theme"), undefined, "following the system does not write a preference");

	const chosen = loadTheme({ stored: "day", systemDark: true });
	chosen.changeListeners[0]({ matches: true });
	assert.strictEqual(chosen.root.attributes["data-theme"], undefined, "an explicit choice wins over the system");
}

/* ---------- the pre-paint script ---------- */

function testPrePaintScriptRunsBeforeBody() {
	["src/layouts/ReferenceLayout.astro", "src/pages/index.astro"].forEach((file) => {
		const source = read(file);
		const headEnd = source.indexOf("</head>");
		const script = source.indexOf("localStorage.getItem('pothi-theme')");
		const body = source.indexOf("<body>");
		assert.ok(script !== -1, `${file} applies the stored theme inline`);
		assert.ok(script < headEnd, `${file} applies the stored theme inside <head>`);
		assert.ok(script < body, `${file} applies the stored theme before the body paints`);
	});
}

testRunningHeadCarriesBrandNavAndControl();
testControlStartsFromTheDayLabel();
testControlTogglesAndPersists();
testControlFollowsTheSystemUntilAnExplicitChoice();
testPrePaintScriptRunsBeforeBody();

console.log("navigation.js regression tests passed");
