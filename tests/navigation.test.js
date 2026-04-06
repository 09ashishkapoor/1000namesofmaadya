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
    toString: () => Array.from(values).join(' ')
  };
}

function createElement(tagName, ownerDocument) {
  const element = {
    tagName: tagName.toUpperCase(),
    ownerDocument,
    id: '',
    innerHTML: '',
    attributes: {},
    children: [],
    classList: createClassList(),
    onclick: null,
    offsetTop: 0,
    offsetParent: null,
    scrollIntoViewCalls: [],
    set className(value) {
      this._className = value;
      this.classList = createClassList(value.split(/\s+/).filter(Boolean));
    },
    get className() {
      return this._className || '';
    },
    setAttribute(name, value) {
      this.attributes[name] = value;
    },
    getAttribute(name) {
      return this.attributes[name];
    },
    appendChild(child) {
      this.children.push(child);
      if (child.id) {
        ownerDocument.elementsById.set(child.id, child);
      }
      return child;
    },
    scrollIntoView(options) {
      this.scrollIntoViewCalls.push(options);
    }
  };

  return element;
}

function createEnvironment({ language = 'english', storageUnavailable = false } = {}) {
  const elementsById = new Map();
  const listeners = {};

  const document = {
    readyState: 'complete',
    body: {
      children: [],
      appendChild(element) {
        this.children.push(element);
        if (element.id) {
          elementsById.set(element.id, element);
        }
        return element;
      }
    },
    elementsById,
    createElement(tagName) {
      return createElement(tagName, document);
    },
    getElementById(id) {
      return elementsById.get(id) || null;
    },
    addEventListener(event, handler) {
      listeners[event] = handler;
    }
  };

  const namesSection = createElement('section', document);
  namesSection.id = 'names-section';
  namesSection.offsetTop = 900;
  elementsById.set(namesSection.id, namesSection);

  const storage = { preferredLanguage: language };
  const windowListeners = {};

  const context = {
    console: { log() {}, warn() {}, error() {} },
    document,
    localStorage: {
      getItem(key) {
        if (storageUnavailable) {
          throw new Error('storage unavailable');
        }
        return Object.prototype.hasOwnProperty.call(storage, key) ? storage[key] : null;
      },
      setItem(key, value) {
        if (storageUnavailable) {
          throw new Error('storage unavailable');
        }
        storage[key] = String(value);
      }
    },
    getTranslation(lang, key) {
      return `${lang}:${key}`;
    },
    window: {
      addEventListener(event, handler) {
        windowListeners[event] = handler;
      },
      requestAnimationFrame(callback) {
        callback();
      },
      scrollToCalls: [],
      scrollTo(options) {
        this.scrollToCalls.push(options);
      },
      scrollY: 0,
      innerHeight: 1000
    },
    setTimeout(callback) {
      callback();
      return 1;
    },
    clearTimeout() {}
  };

  context.global = context;
  context.globalThis = context;
  context.self = context.window;

  return { context, document, namesSection, storage, windowListeners };
}

function runNavigationScript(env) {
  const scriptPath = path.join(__dirname, '..', 'public', 'navigation.js');
  const source = fs.readFileSync(scriptPath, 'utf8');
  vm.runInNewContext(source, env.context, { filename: 'navigation.js' });
}

function testInitialButtonCreation() {
  const env = createEnvironment({ language: 'hindi' });
  runNavigationScript(env);

  const upButton = env.document.getElementById('nav-up-button');
  const downButton = env.document.getElementById('nav-down-button');

  assert.ok(upButton, 'creates the up button');
  assert.ok(downButton, 'creates the down button');
  assert.strictEqual(upButton.getAttribute('aria-label'), 'hindi:navigation.backToTop');
  assert.strictEqual(upButton.getAttribute('title'), 'hindi:navigation.backToTopTitle');
  assert.strictEqual(downButton.getAttribute('aria-label'), 'hindi:navigation.goToNames');
  assert.strictEqual(downButton.getAttribute('title'), 'hindi:navigation.goToNamesTitle');
  assert.ok(upButton.classList.contains('hidden'), 'up button starts hidden near top');
  assert.ok(!downButton.classList.contains('hidden'), 'down button is visible near top');
}

function testLanguageUpdateRefreshesLabels() {
  const env = createEnvironment({ language: 'english' });
  runNavigationScript(env);

  env.storage.preferredLanguage = 'hindi';
  env.context.window.updateNavigationText();

  const upButton = env.document.getElementById('nav-up-button');
  const downButton = env.document.getElementById('nav-down-button');

  assert.strictEqual(upButton.getAttribute('aria-label'), 'hindi:navigation.backToTop');
  assert.strictEqual(upButton.getAttribute('title'), 'hindi:navigation.backToTopTitle');
  assert.strictEqual(downButton.getAttribute('aria-label'), 'hindi:navigation.goToNames');
  assert.strictEqual(downButton.getAttribute('title'), 'hindi:navigation.goToNamesTitle');
}

function testButtonActionsRemainBound() {
  const env = createEnvironment({ language: 'english' });
  runNavigationScript(env);

  const upButton = env.document.getElementById('nav-up-button');
  const downButton = env.document.getElementById('nav-down-button');

  upButton.onclick();
  downButton.onclick();

  assert.strictEqual(env.context.window.scrollToCalls[0].top, 0);
  assert.strictEqual(env.context.window.scrollToCalls[0].behavior, 'smooth');
  assert.strictEqual(env.namesSection.scrollIntoViewCalls[0].behavior, 'smooth');
  assert.strictEqual(env.namesSection.scrollIntoViewCalls[0].block, 'start');
}

function testStorageFallbackKeepsEnglishLabels() {
  const env = createEnvironment({ storageUnavailable: true });
  runNavigationScript(env);

  const upButton = env.document.getElementById('nav-up-button');
  const downButton = env.document.getElementById('nav-down-button');

  assert.strictEqual(upButton.getAttribute('aria-label'), 'english:navigation.backToTop');
  assert.strictEqual(downButton.getAttribute('aria-label'), 'english:navigation.goToNames');
}

testInitialButtonCreation();
testLanguageUpdateRefreshesLabels();
testButtonActionsRemainBound();
testStorageFallbackKeepsEnglishLabels();

console.log('navigation.js regression tests passed');
