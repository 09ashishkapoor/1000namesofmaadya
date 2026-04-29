const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function createClassList(initial = []) {
  const values = new Set(initial);
  return {
    add: (...tokens) => tokens.forEach((token) => values.add(token)),
    remove: (...tokens) => tokens.forEach((token) => values.delete(token)),
    contains: (token) => values.has(token),
    toggle(token, force) {
      if (force === undefined) {
        if (values.has(token)) {
          values.delete(token);
          return false;
        }
        values.add(token);
        return true;
      }
      if (force) values.add(token);
      else values.delete(token);
      return force;
    }
  };
}

function createElement(overrides = {}) {
  return {
    classList: createClassList(),
    attributes: {},
    childNodes: [],
    focusCalls: 0,
    innerHTML: '',
    disabled: false,
    value: '',
    textContent: '',
    dataset: {},
    appendedChildren: [],
    listeners: {},
    setAttribute(name, value) {
      this.attributes[name] = String(value);
    },
    getAttribute(name) {
      return this.attributes[name];
    },
    focus() {
      this.focusCalls += 1;
    },
    appendChild(child) {
      this.appendedChildren.push(child);
      return child;
    },
    addEventListener(event, handler) {
      this.listeners[event] = handler;
    },
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
    ...overrides
  };
}

function loadHooks({ assetVersion = 'build123', width = 500, documentOverrides = {}, setTimeoutImpl } = {}) {
  const scriptPath = path.join(__dirname, '..', 'public', 'app.js');
  let source = fs.readFileSync(scriptPath, 'utf8');
  source = source.replace(/\}\)\(\);\s*$/, `window.__APP_TEST_HOOKS__ = { state, elements, getAssetUrl, getSearchPanelToggleLabel, setSearchPanelOpen, updateReadingProgress, updateStats, handleClear }\n})();`);

  const documentStub = {
    readyState: 'loading',
    addEventListener() {},
    getElementById() { return null; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    documentElement: { lang: 'en', dataset: {} },
    createDocumentFragment() { return { appendChild() {} }; },
    createElement() { return createElement({ style: {}, querySelector() { return createElement(); } }); },
    ...documentOverrides
  };

  const context = {
    console: { log() {}, warn() {}, error() {} },
    window: {
      __ASSET_VERSION__: assetVersion,
      innerWidth: width,
      __INITIAL_NAMES_PAYLOAD__: null,
      location: { search: '' },
      addEventListener() {},
      requestIdleCallback() {},
      requestAnimationFrame(callback) { callback(); },
      scrollTo() {}
    },
    document: documentStub,
    requestIdleCallback(callback) { callback(); },
    URLSearchParams,
    setTimeout: setTimeoutImpl || (() => 1),
    clearTimeout() {},
    fetch() {
      return Promise.reject(new Error('fetch disabled in test'));
    }
  };

  context.global = context;
  context.globalThis = context;
  context.self = context.window;

  vm.runInNewContext(source, context, { filename: 'app.js' });
  return context.window.__APP_TEST_HOOKS__;
}

function testAssetUrlsUseVersionQuery() {
  const hooks = loadHooks({ assetVersion: 'abc123' });
  assert.strictEqual(hooks.getAssetUrl('/data_manifest.json'), '/data_manifest.json?v=abc123');
}

function testSearchPanelOpenUpdatesStateAndUi() {
  const hooks = loadHooks({ width: 500 });
  hooks.elements.searchPanel = createElement();
  hooks.elements.searchToggleBtn = createElement();
  hooks.elements.searchInput = createElement();

  hooks.setSearchPanelOpen(true, true);

  assert.strictEqual(hooks.state.searchPanelOpen, true);
  assert.strictEqual(hooks.elements.searchToggleBtn.getAttribute('aria-expanded'), 'true');
  assert.ok(hooks.elements.searchPanel.classList.contains('is-open'));
  assert.ok(!hooks.elements.searchPanel.classList.contains('mobile-collapsed'));
  assert.strictEqual(hooks.elements.searchInput.focusCalls, 1);
  assert.strictEqual(hooks.elements.searchToggleBtn.textContent, 'Close Search');
}

function testReadingProgressUsesCurrentPageWindow() {
  const hooks = loadHooks();
  hooks.elements.readingProgress = createElement();
  hooks.state.filteredData = new Array(23).fill({});
  hooks.state.displayedData = new Array(11).fill({});
  hooks.state.currentPage = 1;
  hooks.state.pageSize = 11;

  hooks.updateReadingProgress();

  assert.strictEqual(
    hooks.elements.readingProgress.innerHTML,
    'Showing <strong>12</strong>-<strong>22</strong> of <strong>23</strong>'
  );
}

function testStatsRenderSearchAndDefaultModes() {
  const hooks = loadHooks();
  hooks.elements.statsDisplay = createElement();
  hooks.state.filteredData = new Array(7).fill({});
  hooks.state.searchQuery = 'kali';
  hooks.updateStats();
  assert.strictEqual(hooks.elements.statsDisplay.innerHTML, '🔍 Found <strong>7</strong> names matching "kali"');

  hooks.state.searchQuery = '';
  hooks.updateStats();
  assert.strictEqual(hooks.elements.statsDisplay.innerHTML, '📿 Showing all <strong>1072</strong> names of <strong>Maa Adya Mahakali</strong>');
}

function testSearchToggleLabelUsesEnglishOnlyCopy() {
  const hooks = loadHooks();
  hooks.state.searchPanelOpen = false;
  assert.strictEqual(hooks.getSearchPanelToggleLabel(), 'Open Search');
  hooks.state.searchPanelOpen = true;
  assert.strictEqual(hooks.getSearchPanelToggleLabel(), 'Close Search');
}

function testClearResetsSearchState() {
  const hooks = loadHooks();
  hooks.elements.searchInput = createElement({ value: 'kali' });
  hooks.elements.clearBtn = createElement();
  hooks.elements.statsDisplay = createElement();
  hooks.elements.namesGrid = createElement({
    dataset: {},
    appendChild() {},
    querySelectorAll() { return []; }
  });
  hooks.elements.prevPageBtn = createElement();
  hooks.elements.nextPageBtn = createElement();
  hooks.elements.readingProgress = createElement();
  hooks.state.data = [{ index: 1 }, { index: 2 }];
  hooks.state.filteredData = [{ index: 1 }];
  hooks.state.displayedData = [{ index: 1 }];
  hooks.state.searchQuery = 'kali';

  hooks.handleClear();

  assert.strictEqual(hooks.state.searchQuery, '');
  assert.strictEqual(hooks.elements.searchInput.value, '');
  assert.strictEqual(hooks.elements.clearBtn.disabled, true);
}

testAssetUrlsUseVersionQuery();
testSearchPanelOpenUpdatesStateAndUi();
testReadingProgressUsesCurrentPageWindow();
testStatsRenderSearchAndDefaultModes();
testSearchToggleLabelUsesEnglishOnlyCopy();
testClearResetsSearchState();

console.log('app.js regression tests passed');
