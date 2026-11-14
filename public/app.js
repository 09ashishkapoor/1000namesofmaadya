/* ==========================================================================
   The reader — sets of eleven, one open name at a time.

   The first set arrives server-rendered (window.__READER_BOOT__) and the script
   adopts it: no flash, no network round trip, and the sacred text is readable
   with JavaScript disabled.

   Everything past the first set comes from the committed data:
     /name-spine.json      the Devanagari, IAST and page slug for all 1,072 names
     /data_chunk_N.json    the English one-line meaning and the longer note
   Both are fetched only when the reader turns a page, and cached after that.
   ========================================================================== */
(function () {
  'use strict';

  var boot = window.__READER_BOOT__;
  if (!boot || !boot.names || !boot.names.length) return;

  var SET_SIZE = boot.setSize || 11;
  var TOTAL_SETS = boot.totalSets || 98;
  var TOTAL_COUNT = boot.totalCount || 1072;
  var CHUNK_SIZE = 200;
  var TOTAL_CHUNKS = Math.ceil(TOTAL_COUNT / CHUNK_SIZE);
  var ELAB_LIMIT = 640;
  var FETCH_TIMEOUT_MS = 12000;

  var state = {
    setIndex: 0,
    current: 0,
    names: boot.names.slice(),
    spine: null,
    chunks: new Map(),
    loading: false,
    error: null,
  };

  var elements = {};

  function byId(id) {
    return document.getElementById(id);
  }

  function collectElements() {
    elements.headSet = byId('head-set');
    elements.headRange = byId('head-range');
    elements.listCount = byId('list-count');
    elements.findCount = byId('find-count');
    elements.mCount = byId('m-count');
    elements.footPage = byId('foot-page');
    elements.setNo = byId('set-no');
    elements.prev = byId('prev');
    elements.next = byId('next');
    elements.toc = byId('toc');
    elements.mlist = byId('m-list');
    elements.q = byId('q');
    elements.mq = byId('mq');
    elements.status = byId('reader-status');
    elements.page = byId('page');
    elements.pageName = elements.page && elements.page.querySelector('.page-name');
    elements.pageIast = elements.page && elements.page.querySelector('.page-iast');
    elements.pageOne = elements.page && elements.page.querySelector('.page-one');
    elements.pageElab = elements.page && elements.page.querySelector('.page-elab');
    elements.pageEyebrow = elements.page && elements.page.querySelector('.page-eyebrow span');
    elements.pageLink = elements.page && elements.page.querySelector('.page-foot a');
    elements.pageFolio = elements.page && elements.page.querySelector('.page-foot .folio');
  }

  /* ---------- helpers ---------- */

  function getAssetUrl(path) {
    var version = window.__ASSET_VERSION__;
    if (!version) return path;
    return path + (path.indexOf('?') === -1 ? '?' : '&') + 'v=' + version;
  }

  function normalize(value) {
    return String(value == null ? '' : value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  function shorten(text, limit) {
    var max = limit || ELAB_LIMIT;
    if (typeof text !== 'string') return '';
    if (text.length <= max) return text;
    return text.slice(0, max).replace(/[\s,;:]\S*$/, '') + '…';
  }

  function pad(value) {
    return String(value).length < 2 ? '0' + value : String(value);
  }

  function withTimeout(promise, ms) {
    return new Promise(function (resolve, reject) {
      var timer = setTimeout(function () {
        var error = new Error('The request took too long.');
        error.name = 'AbortError';
        reject(error);
      }, ms);
      promise.then(
        function (value) {
          clearTimeout(timer);
          resolve(value);
        },
        function (error) {
          clearTimeout(timer);
          reject(error);
        }
      );
    });
  }

  function describeFailure(error) {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      return 'You appear to be offline. Reconnect and try again.';
    }
    if (error && error.name === 'AbortError') {
      return 'The connection is taking longer than expected. Please try again.';
    }
    return 'This set of names could not be loaded. Please try again.';
  }

  function setStatus(message, isError) {
    state.error = isError ? message : null;
    if (!elements.status) return;
    elements.status.textContent = message || '';
    elements.status.classList.toggle('is-error', Boolean(isError));
  }

  /* ---------- data ---------- */

  function loadJson(path) {
    return withTimeout(fetch(getAssetUrl(path)).then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json();
    }), FETCH_TIMEOUT_MS);
  }

  function ensureSpine() {
    if (state.spine) return Promise.resolve(state.spine);
    return loadJson('/name-spine.json').then(function (payload) {
      var map = new Map();
      (payload.names || []).forEach(function (row) {
        map.set(Number(row[0]), { dev: row[1], iast: row[2], slug: row[3] });
      });
      state.spine = map;
      return map;
    });
  }

  function ensureChunk(chunkNumber) {
    if (state.chunks.has(chunkNumber)) return Promise.resolve(state.chunks.get(chunkNumber));
    return loadJson('/data_chunk_' + chunkNumber + '.json').then(function (entries) {
      var map = new Map();
      entries.forEach(function (entry) {
        map.set(Number(entry.index), entry);
      });
      state.chunks.set(chunkNumber, map);
      return map;
    });
  }

  function rangeForSet(setIndex) {
    var start = setIndex * SET_SIZE + 1;
    var end = Math.min(start + SET_SIZE - 1, TOTAL_COUNT);
    return { start: start, end: end };
  }

  function chunksFor(range) {
    var first = Math.ceil(range.start / CHUNK_SIZE);
    var last = Math.ceil(range.end / CHUNK_SIZE);
    var list = [];
    for (var n = first; n <= last; n += 1) list.push(n);
    return list;
  }

  function buildSetNames(setIndex, spine, chunkMaps) {
    var range = rangeForSet(setIndex);
    var names = [];
    for (var number = range.start; number <= range.end; number += 1) {
      var spelling = spine.get(number) || {};
      var entry = null;
      for (var i = 0; i < chunkMaps.length; i += 1) {
        if (chunkMaps[i].has(number)) {
          entry = chunkMaps[i].get(number);
          break;
        }
      }
      names.push({
        number: number,
        dev: spelling.dev || '',
        iast: spelling.iast || '',
        slug: spelling.slug || null,
        common: entry ? entry.english_name : spelling.iast || '',
        one: entry ? entry.english_one_line : '',
        elab: entry ? shorten(entry.english_elaboration) : '',
      });
    }
    return names;
  }

  function loadSet(setIndex) {
    var range = rangeForSet(setIndex);
    var chunkNumbers = chunksFor(range);
    var needsSpine = !state.spine;
    var missing = chunkNumbers.filter(function (n) {
      return !state.chunks.has(n);
    });
    if (!needsSpine && !missing.length) {
      return Promise.resolve(buildSetNames(setIndex, state.spine, chunkNumbers.map(function (n) {
        return state.chunks.get(n);
      })));
    }
    return Promise.all([ensureSpine()].concat(chunkNumbers.map(ensureChunk))).then(function (results) {
      var spine = results[0];
      return buildSetNames(setIndex, spine, results.slice(1));
    });
  }

  /* ---------- rendering ---------- */

  function searchBlob(name) {
    return normalize([name.dev, name.iast, name.common, name.one].join(' '));
  }

  function buildButton(name, index, variant) {
    var button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('data-index', String(index));
    button.setAttribute('aria-current', index === state.current ? 'true' : 'false');
    if (variant === 'mobile') button.setAttribute('aria-label', 'Name ' + name.number + ': ' + name.common);

    var number = document.createElement('span');
    number.className = 'n';
    number.textContent = pad(name.number);

    var wrap = document.createElement('span');
    var dev = document.createElement('span');
    dev.className = 'w';
    dev.lang = 'sa';
    dev.textContent = name.dev;
    var iast = document.createElement('span');
    iast.className = 'i';
    iast.textContent = name.iast;
    wrap.appendChild(dev);
    wrap.appendChild(iast);

    button.appendChild(number);
    button.appendChild(wrap);
    return button;
  }

  function renderList() {
    if (!elements.toc || !elements.mlist) return;
    while (elements.toc.firstChild) elements.toc.removeChild(elements.toc.firstChild);
    while (elements.mlist.firstChild) elements.mlist.removeChild(elements.mlist.firstChild);

    state.names.forEach(function (name, index) {
      var row = document.createElement('li');
      row.setAttribute('data-search', searchBlob(name));
      row.appendChild(buildButton(name, index, 'desktop'));
      elements.toc.appendChild(row);

      var mobileRow = document.createElement('li');
      mobileRow.setAttribute('data-search', searchBlob(name));
      mobileRow.appendChild(buildButton(name, index, 'mobile'));
      elements.mlist.appendChild(mobileRow);
    });

    if (elements.listCount) {
      elements.listCount.textContent = state.names.length + ' names';
    }
  }

  function renderPage() {
    var name = state.names[state.current] || state.names[0];
    if (!name) return;
    if (elements.pageEyebrow) {
      elements.pageEyebrow.textContent = 'Name ' + pad(name.number) + ' of ' + TOTAL_COUNT.toLocaleString('en-US');
    }
    if (elements.pageName) elements.pageName.textContent = name.dev;
    if (elements.pageIast) elements.pageIast.textContent = name.iast;
    if (elements.pageOne) elements.pageOne.textContent = name.one;
    if (elements.pageElab) elements.pageElab.textContent = name.elab;
    if (elements.pageFolio) elements.pageFolio.textContent = pad(name.number);
    if (elements.pageLink) {
      elements.pageLink.setAttribute('href', name.slug ? '/names/' + name.slug + '/' : '/names/');
    }
    if (elements.footPage) elements.footPage.textContent = String(state.current + 1);
    selectButtons();
  }

  function selectButtons() {
    if (!elements.toc) return;
    [elements.toc, elements.mlist].forEach(function (list) {
      if (!list) return;
      Array.prototype.forEach.call(list.querySelectorAll('button[data-index]'), function (button) {
        var isCurrent = Number(button.getAttribute('data-index')) === state.current;
        button.setAttribute('aria-current', isCurrent ? 'true' : 'false');
      });
    });
  }

  function renderChrome() {
    var range = rangeForSet(state.setIndex);
    if (elements.headSet) elements.headSet.textContent = pad(state.setIndex + 1);
    if (elements.setNo) elements.setNo.textContent = pad(state.setIndex + 1);
    if (elements.headRange) elements.headRange.textContent = range.start + '–' + range.end;
    if (elements.prev) elements.prev.disabled = state.setIndex === 0;
    if (elements.next) elements.next.disabled = state.setIndex >= TOTAL_SETS - 1;
    if (elements.footPage) elements.footPage.textContent = String(state.current + 1);
  }

  /* ---------- interaction ---------- */

  function selectName(index) {
    if (index < 0 || index >= state.names.length) return;
    state.current = index;
    renderPage();
  }

  function applyFilter(input, list, counter, emptyMessage) {
    var query = normalize((input && input.value) || '').trim();
    var shown = 0;
    var total = 0;
    Array.prototype.forEach.call(list.querySelectorAll('li[data-search]'), function (row) {
      total += 1;
      var hit = !query || row.getAttribute('data-search').indexOf(query) !== -1;
      row.classList.toggle('is-hidden', !hit);
      if (hit) shown += 1;
    });
    if (counter) {
      counter.textContent = query ? shown + '/' + total : total + ' names';
    }
    var none = list.querySelector('.none');
    if (none) none.classList.toggle('on', Boolean(query) && shown === 0);
    if (emptyMessage) {
      // Always rewrite the status, so clearing the query removes a stale message.
      setStatus(query && shown === 0 ? emptyMessage : '', false);
    }
    return { shown: shown, query: query };
  }

  function filterDesktop() {
    applyFilter(elements.q, elements.toc, elements.findCount, 'No name in this set matches that search.');
    // Keep the open name visible when the filter hides it.
    var active = elements.toc.querySelector('button[aria-current="true"]');
    if (active) {
      var row = active.parentNode;
      if (row && row.classList.contains('is-hidden')) {
        var firstVisible = elements.toc.querySelector('li[data-search]:not(.is-hidden) button');
        if (firstVisible) selectName(Number(firstVisible.getAttribute('data-index')));
      }
    }
  }

  function filterMobile() {
    applyFilter(elements.mq, elements.mlist, elements.mCount, 'No name in this set matches that search.');
    var active = elements.mlist.querySelector('button[aria-current="true"]');
    if (active) {
      var row = active.parentNode;
      if (row && row.classList.contains('is-hidden')) {
        var firstVisible = elements.mlist.querySelector('li[data-search]:not(.is-hidden) button');
        if (firstVisible) selectName(Number(firstVisible.getAttribute('data-index')));
      }
    }
  }

  function goToSet(nextIndex) {
    if (state.loading) return;
    if (nextIndex < 0 || nextIndex >= TOTAL_SETS) return;
    if (nextIndex === state.setIndex) return;

    state.loading = true;
    if (elements.prev) elements.prev.disabled = true;
    if (elements.next) elements.next.disabled = true;
    setStatus('Loading set ' + pad(nextIndex + 1) + '…', false);

    loadSet(nextIndex)
      .then(function (names) {
        state.setIndex = nextIndex;
        state.names = names;
        state.current = 0;
        if (elements.q) elements.q.value = '';
        if (elements.mq) elements.mq.value = '';
        if (elements.findCount) elements.findCount.textContent = '';
        state.loading = false;
        renderList();
        renderChrome();
        renderPage();
        setStatus('', false);
      })
      .catch(function (error) {
        state.loading = false;
        renderChrome();
        setStatus(describeFailure(error), true);
      });
  }

  function bindList(list, mobile) {
    if (!list) return;
    list.addEventListener('click', function (event) {
      var button = event.target.closest ? event.target.closest('button[data-index]') : null;
      if (!button) return;
      selectName(Number(button.getAttribute('data-index')));
      if (mobile && window.matchMedia && window.matchMedia('(max-width: 1080px)').matches) {
        if (elements.page && elements.page.scrollIntoView) {
          elements.page.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

  function start() {
    collectElements();
    renderChrome();
    renderPage();
    if (state.names.length < SET_SIZE) {
      if (elements.next) elements.next.disabled = true;
    }
    bindList(elements.toc, false);
    bindList(elements.mlist, true);
    if (elements.q) elements.q.addEventListener('input', filterDesktop);
    if (elements.mq) elements.mq.addEventListener('input', filterMobile);
    if (elements.prev) {
      elements.prev.addEventListener('click', function () {
        goToSet(state.setIndex - 1);
      });
    }
    if (elements.next) {
      elements.next.addEventListener('click', function () {
        goToSet(state.setIndex + 1);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  // Exposed for the unit tests.
  window.__READER__ = {
    state: state,
    elements: elements,
    getAssetUrl: getAssetUrl,
    normalize: normalize,
    shorten: shorten,
    pad: pad,
    describeFailure: describeFailure,
    buildSetNames: buildSetNames,
    rangeForSet: rangeForSet,
    goToSet: goToSet,
    selectName: selectName,
    setStatus: setStatus,
  };
})();
