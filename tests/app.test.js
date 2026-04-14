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

function loadHooks({
  assetVersion = 'build123',
  width = 500,
  documentOverrides = {},
  windowOverrides = {},
  localStorageOverrides = {},
  setTimeoutImpl
} = {}) {
  const scriptPath = path.join(__dirname, '..', 'public', 'app.js');
  let source = fs.readFileSync(scriptPath, 'utf8');
  source = source.replace(/import\s+\{\s*searchEntries\s*\}\s+from\s+['"]\.\/search\.js['"];?\r?\n/, '');
  source = source.replace(/\}\)\(\);\s*$/, `window.__APP_TEST_HOOKS__ = { state, elements, getAssetUrl, getSearchPanelToggleLabel, setSearchPanelOpen, updateReadingProgress, updateStats, bindLanguagePillButtons, initializeLanguagePillButtons, applyLanguageChange, updateFooterText };\n})();`);

  const documentStub = {
    readyState: 'loading',
    addEventListener() {},
    getElementById() { return null; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    documentElement: { lang: 'en', dataset: {} },
    ...documentOverrides
  };

  const context = {
    console: { log() {}, warn() {}, error() {} },
    searchEntries(data) { return data; },
    getTranslation(_lang, key) {
      if (key === 'names.pageStatus') return 'Showing <strong>{start}</strong>-<strong>{end}</strong> of <strong>{total}</strong>';
      if (key === 'names.statsSearching') return 'Found <strong>{count}</strong> names matching "{query}"';
      if (key === 'names.statsDefault') return 'Default stats';
      if (key === 'names.showSearchButton') return 'Search Names';
      if (key === 'names.hideSearchButton') return 'Hide Search';
      if (key === 'footer.developedBy') return 'Developed By';
      if (key === 'footer.dedicatedTo') return 'Dedicated To';
      if (key === 'footer.connectInstagram') return 'Connect';
      if (key === 'footer.version') return 'Version';
      if (key === 'footer.lastUpdated') return 'Last Updated';
      return key;
    },
    window: {
      __ASSET_VERSION__: assetVersion,
      innerWidth: width,
      location: { search: '' },
      addEventListener() {},
      requestIdleCallback() {},
      requestAnimationFrame(callback) { callback(); },
      scrollTo() {},
      ...windowOverrides
    },
    document: documentStub,
    localStorage: {
      getItem() { return null; },
      setItem() {},
      ...localStorageOverrides
    },
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
  assert.strictEqual(hooks.elements.searchToggleBtn.textContent, 'Hide Search');
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
  assert.strictEqual(hooks.elements.statsDisplay.innerHTML, 'Found <strong>7</strong> names matching "kali"');

  hooks.state.searchQuery = '';
  hooks.updateStats();
  assert.strictEqual(hooks.elements.statsDisplay.innerHTML, 'Default stats');
}

function testBindLanguagePillButtonsSyncsActiveStateAndListeners() {
  const hooks = loadHooks();
  const englishBtn = createElement({ dataset: { lang: 'english' } });
  const hindiBtn = createElement({ dataset: { lang: 'hindi' } });
  hooks.state.language = 'hindi';

  hooks.bindLanguagePillButtons([englishBtn, hindiBtn], '');

  assert.ok(englishBtn.listeners.click, 'english button should receive click handler');
  assert.ok(hindiBtn.listeners.click, 'hindi button should receive click handler');
  assert.ok(!englishBtn.classList.contains('active'), 'non-selected language should not be active');
  assert.ok(hindiBtn.classList.contains('active'), 'selected language should be active');
}

function testInitializeLanguagePillButtonsBindsRetryButtons() {
  const retryEnglishBtn = createElement({ dataset: { lang: 'english' } });
  const retryHindiBtn = createElement({ dataset: { lang: 'hindi' } });
  let requestedSelector = null;

  const hooks = loadHooks({
    documentOverrides: {
      querySelectorAll(selector) {
        requestedSelector = selector;
        return [retryEnglishBtn, retryHindiBtn];
      }
    },
    setTimeoutImpl(callback, delay) {
      if (delay === 100) {
        callback();
      }
      return 1;
    }
  });

  hooks.state.language = 'english';
  hooks.elements.languagePillBtns = [];
  hooks.initializeLanguagePillButtons();

  assert.strictEqual(requestedSelector, '.language-pill-btn');
  assert.ok(retryEnglishBtn.listeners.click, 'retry-bound english button should receive click handler');
  assert.ok(retryHindiBtn.listeners.click, 'retry-bound hindi button should receive click handler');
  assert.ok(retryEnglishBtn.classList.contains('active'), 'current language should be active after retry binding');
  assert.ok(!retryHindiBtn.classList.contains('active'), 'non-selected retry button should stay inactive');
}

function testApplyLanguageChangePersistsAndSyncsSideEffects() {
  const select = createElement({ value: 'english' });
  const searchToggleBtn = createElement();
  const namesGrid = createElement({
    appendChild() {},
    querySelectorAll() { return []; }
  });
  const statsDisplay = createElement();
  const readingProgress = createElement();
  const prevPageBtn = null;
  const nextPageBtn = null;
  const storageWrites = [];
  let navigationUpdates = 0;

  const hooks = loadHooks({
    documentOverrides: {
      createDocumentFragment() {
        return {};
      }
    },
    windowOverrides: {
      updateNavigationText() {
        navigationUpdates += 1;
      }
    },
    localStorageOverrides: {
      setItem(key, value) {
        storageWrites.push([key, value]);
      }
    }
  });

  hooks.elements.languageSelect = select;
  hooks.elements.searchToggleBtn = searchToggleBtn;
  hooks.elements.namesGrid = namesGrid;
  hooks.elements.statsDisplay = statsDisplay;
  hooks.elements.readingProgress = readingProgress;
  hooks.elements.prevPageBtn = prevPageBtn;
  hooks.elements.nextPageBtn = nextPageBtn;
  hooks.elements.languagePillBtns = [
    createElement({ dataset: { lang: 'english' } }),
    createElement({ dataset: { lang: 'hindi' } })
  ];
  hooks.state.filteredData = [];
  hooks.state.displayedData = [];

  hooks.applyLanguageChange('hindi', { syncSelect: true });

  assert.strictEqual(hooks.state.language, 'hindi');
  assert.deepStrictEqual(storageWrites, [['preferredLanguage', 'hindi']]);
  assert.strictEqual(select.value, 'hindi');
  assert.strictEqual(navigationUpdates, 1);
  assert.ok(!hooks.elements.languagePillBtns[0].classList.contains('active'));
  assert.ok(hooks.elements.languagePillBtns[1].classList.contains('active'));
}

function testFooterTextPreservesExistingNodes() {
  const instagramLink = createElement();
  const footerSocial = createElement({
    querySelector(selector) {
      return selector === 'a' ? instagramLink : null;
    }
  });
  const footerRepo = createElement();
  const footerVersion = createElement();
  const footerMantra = createElement({ outerHTML: '<span class="footer-mantra">Mantra</span>' });
  const footerText = createElement({
    querySelector(selector) {
      const map = {
        '.footer-mantra': footerMantra,
        '.footer-social': footerSocial,
        '.footer-repo': footerRepo,
        '.footer-version': footerVersion
      };
      return map[selector] || null;
    }
  });
  const versionNumber = createElement({ textContent: 'V1.2.3' });
  const lastUpdated = createElement({ textContent: 'April 13, 2026' });

  const hooks = loadHooks({
    documentOverrides: {
      querySelector(selector) {
        return selector === '.footer-text' ? footerText : null;
      },
      getElementById(id) {
        if (id === 'version-number') return versionNumber;
        if (id === 'last-updated') return lastUpdated;
        return null;
      }
    }
  });

  hooks.updateFooterText();

  assert.ok(footerText.innerHTML.includes('Developed By'));
  assert.ok(footerText.innerHTML.includes('Dedicated To'));
  assert.ok(footerText.innerHTML.includes('<span class="footer-mantra">Mantra</span>'));
  assert.deepStrictEqual(footerText.appendedChildren, [footerSocial, footerRepo, footerVersion]);
  assert.strictEqual(footerSocial.innerHTML, 'Connect ');
  assert.deepStrictEqual(footerSocial.appendedChildren, [instagramLink]);
  assert.ok(footerVersion.innerHTML.includes('Version <span id="version-number">V1.2.3</span>'));
  assert.ok(footerVersion.innerHTML.includes('Last Updated <span id="last-updated">April 13, 2026</span>'));
}

testAssetUrlsUseVersionQuery();
testSearchPanelOpenUpdatesStateAndUi();
testReadingProgressUsesCurrentPageWindow();
testStatsRenderSearchAndDefaultModes();
testBindLanguagePillButtonsSyncsActiveStateAndListeners();
testInitializeLanguagePillButtonsBindsRetryButtons();
testApplyLanguageChangePersistsAndSyncsSideEffects();
testFooterTextPreservesExistingNodes();

console.log('app.js regression tests passed');
