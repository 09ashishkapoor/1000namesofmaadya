(function() {
  'use strict';

  const assetVersion = (typeof window !== 'undefined' && typeof window.__ASSET_VERSION__ === 'string')
    ? window.__ASSET_VERSION__.trim()
    : '';
  const initialNamesPayload = (typeof window !== 'undefined' && window.__INITIAL_NAMES_PAYLOAD__)
    ? window.__INITIAL_NAMES_PAYLOAD__
    : null;
  const initialEntries = Array.isArray(initialNamesPayload?.entries) ? initialNamesPayload.entries : [];

  let searchEntriesFn = null;
  let searchModulePromise = null;
  let fullDataLoadPromise = null;

  function getAssetUrl(path) {
    if (!assetVersion) return path;
    const separator = path.includes('?') ? '&' : '?';
    return `${path}${separator}v=${encodeURIComponent(assetVersion)}`;
  }

  const COPY = {
    statsDefault: '📿 Showing all <strong>1072</strong> names of <strong>Maa Adya Mahakali</strong>',
    statsSearching: '🔍 Found <strong>{count}</strong> names matching "{query}"',
    pageStatus: 'Showing <strong>{start}</strong>-<strong>{end}</strong> of <strong>{total}</strong>',
    showSearchButton: 'Open Search',
    hideSearchButton: 'Close Search',
    loadingNames: 'Loading names...',
    loadingNextNames: 'Loading next names…',
    preparingSearch: 'Preparing search…',
    revealButton: 'Read More',
    hideButton: 'Hide Details'
  };

  const state = {
    data: [...initialEntries],
    filteredData: [...initialEntries],
    displayedData: initialEntries.slice(0, 11),
    currentPage: 0,
    pageSize: 11,
    searchQuery: (function() {
      const urlParams = new URLSearchParams(window.location.search);
      return (urlParams.get('q') || '').toLowerCase().trim();
    })(),
    expandedItems: new Set(),
    searchPanelOpen: false,
    loadedChunks: new Set(),
    totalChunks: Number(initialNamesPayload?.totalChunks || 0),
    chunkSize: Number(initialNamesPayload?.chunkSize || 0),
    totalEntries: Number(initialNamesPayload?.totalEntries || initialEntries.length || 0),
    dataLoaded: initialEntries.length > 0,
    fullDataReady: false,
    fullDataRequested: false,
    usePrerenderedPageOne: initialEntries.length > 0
  };

  const elements = {};

  function init() {
    document.documentElement.lang = 'en';
    cacheDOMElements();
    setupEventListeners();

    if (state.data.length > 0) {
      elements.loadingState.classList.add('hidden');
      renderNames();
      updateStats();

      if (state.searchQuery) {
        setSearchPanelOpen(true, false);
        void handleSearchDebounced();
      }
      return;
    }

    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => void loadData(), { timeout: 2000 });
    } else {
      setTimeout(() => void loadData(), 0);
    }
  }

  function cacheDOMElements() {
    elements.searchInput = document.getElementById('search-input');
    elements.clearBtn = document.getElementById('clear-btn');
    elements.exploreBtn = document.getElementById('explore-btn');
    elements.learnBtn = document.getElementById('learn-btn');
    elements.searchToggleBtn = document.getElementById('search-toggle-btn');
    elements.searchPanel = document.getElementById('search-panel');
    elements.namesGrid = document.getElementById('names-grid');
    elements.prevPageBtn = document.getElementById('prev-page-btn');
    elements.nextPageBtn = document.getElementById('next-page-btn');
    elements.readingProgress = document.getElementById('reading-progress');
    elements.loadingState = document.getElementById('loading-state');
    elements.errorState = document.getElementById('error-state');
    elements.errorMessage = document.getElementById('error-message');
    elements.statsDisplay = document.getElementById('stats-display');
  }

  function setupEventListeners() {
    const debouncedFilter = debounce(() => void handleSearchDebounced(), 100);

    if (elements.searchInput) {
      elements.searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.toLowerCase().trim();
        updateClearButton();
        debouncedFilter();
      });
    }

    if (elements.clearBtn) {
      elements.clearBtn.addEventListener('click', handleClear);
    }

    if (elements.exploreBtn) {
      elements.exploreBtn.addEventListener('click', scrollToNames);
    }

    if (elements.learnBtn) {
      elements.learnBtn.addEventListener('click', scrollToAbout);
    }

    if (elements.searchToggleBtn) {
      elements.searchToggleBtn.addEventListener('click', toggleSearchPanel);
    }

    if (elements.prevPageBtn) {
      elements.prevPageBtn.addEventListener('click', goToPreviousPage);
    }

    if (elements.nextPageBtn) {
      elements.nextPageBtn.addEventListener('click', goToNextPage);
    }

    window.addEventListener('resize', debounce(syncSearchPanelForViewport, 100), { passive: true });
    syncSearchPanelForViewport();

    if (elements.searchInput && state.searchQuery) {
      elements.searchInput.value = state.searchQuery;
    }
  }

  function getTotalAvailableCount() {
    if (state.searchQuery) return state.filteredData.length;
    return state.fullDataReady ? state.filteredData.length : (state.totalEntries || state.filteredData.length);
  }

  function mergeEntries(existingEntries, incomingEntries) {
    const byIndex = new Map();
    [...existingEntries, ...incomingEntries].forEach((entry) => {
      if (entry && typeof entry.index === 'number') {
        byIndex.set(entry.index, entry);
      }
    });

    return Array.from(byIndex.values()).sort((a, b) => a.index - b.index);
  }

  async function ensureSearchModule() {
    if (searchEntriesFn) return searchEntriesFn;
    if (!searchModulePromise) {
      searchModulePromise = import(getAssetUrl('/search.js')).then((mod) => {
        searchEntriesFn = mod.searchEntries;
        return searchEntriesFn;
      });
    }
    return searchModulePromise;
  }

  async function ensureManifestMetadata() {
    if (state.totalChunks && state.chunkSize) return;

    const manifestResponse = await fetch(getAssetUrl('/data_manifest.json'));
    if (!manifestResponse.ok) throw new Error('Failed to load manifest');

    const manifest = await manifestResponse.json();
    state.totalEntries = manifest.total || state.totalEntries;
    state.totalChunks = manifest.chunks || state.totalChunks;
    state.chunkSize = manifest.chunk_size || state.chunkSize;
  }

  async function ensureChunkLoaded(chunkNum) {
    if (state.loadedChunks.has(chunkNum)) return;

    await ensureManifestMetadata();
    const response = await fetch(getAssetUrl(`/data_chunk_${chunkNum}.json`));
    if (!response.ok) throw new Error(`Failed to load chunk ${chunkNum}`);

    const chunkData = await response.json();
    state.data = mergeEntries(state.data, chunkData);
    if (!state.searchQuery) {
      state.filteredData = [...state.data];
    }
    state.loadedChunks.add(chunkNum);
  }

  async function ensureAllDataLoaded() {
    if (state.fullDataReady) return;
    if (!fullDataLoadPromise) {
      state.fullDataRequested = true;
      fullDataLoadPromise = (async () => {
        await ensureManifestMetadata();
        const chunkNumbers = Array.from({ length: state.totalChunks }, (_, idx) => idx + 1);
        await Promise.all(chunkNumbers.map((chunkNum) => ensureChunkLoaded(chunkNum)));
        state.filteredData = [...state.data];
        state.dataLoaded = true;
        state.fullDataReady = true;
      })();
    }

    await fullDataLoadPromise;
  }

  async function ensurePageData(pageIndex) {
    const startIndex = pageIndex * state.pageSize;
    if (state.data.length > startIndex) return;

    const safeChunkSize = state.chunkSize || 200;
    const requiredChunk = Math.floor(startIndex / safeChunkSize) + 1;
    await ensureChunkLoaded(requiredChunk);
    state.dataLoaded = true;
  }

  function setProgressMessage(message) {
    if (elements.readingProgress) {
      elements.readingProgress.textContent = message;
    }
  }

  function setStatsMessage(message) {
    if (elements.statsDisplay) {
      elements.statsDisplay.textContent = message;
    }
  }

  async function prepareSearchExperience() {
    setStatsMessage(COPY.preparingSearch);
    await Promise.all([ensureSearchModule(), ensureAllDataLoaded()]);
  }

  function adoptPrerenderedFirstPage() {
    state.displayedData = state.filteredData.slice(0, state.pageSize);
    const toggleButtons = elements.namesGrid.querySelectorAll('.toggle-btn[data-prerendered="true"]');
    toggleButtons.forEach((button) => {
      if (button.dataset.bound === 'true') return;
      const index = Number(button.dataset.index);
      button.addEventListener('click', () => toggleElaboration(index));
      button.dataset.bound = 'true';
    });
  }

  function isDesktopViewport() {
    return window.innerWidth >= 768;
  }

  function syncSearchPanelForViewport() {
    if (!elements.searchPanel) return;

    if (isDesktopViewport()) {
      setSearchPanelOpen(true, false);
    } else if (state.searchQuery) {
      setSearchPanelOpen(true, false);
    } else {
      setSearchPanelOpen(state.searchPanelOpen, false);
    }
  }

  function setSearchPanelOpen(isOpen, shouldFocusInput = false) {
    if (!elements.searchPanel || !elements.searchToggleBtn) return;

    state.searchPanelOpen = isDesktopViewport() ? true : isOpen;
    elements.searchPanel.classList.toggle('mobile-collapsed', !state.searchPanelOpen);
    elements.searchPanel.classList.toggle('is-open', state.searchPanelOpen);
    elements.searchToggleBtn.setAttribute('aria-expanded', String(state.searchPanelOpen));
    updateSearchToggleButton();

    if (shouldFocusInput && state.searchPanelOpen && elements.searchInput) {
      elements.searchInput.focus();
    }
  }

  function getSearchPanelToggleLabel() {
    return state.searchPanelOpen ? COPY.hideSearchButton : COPY.showSearchButton;
  }

  function updateSearchToggleButton() {
    if (elements.searchToggleBtn) {
      elements.searchToggleBtn.textContent = getSearchPanelToggleLabel();
    }
  }

  function toggleSearchPanel() {
    if (isDesktopViewport()) return;

    const willOpen = !state.searchPanelOpen;
    setSearchPanelOpen(willOpen, willOpen);
    if (willOpen && !state.fullDataRequested) {
      void prepareSearchExperience()
        .then(() => updateStats())
        .catch((error) => {
          console.error('Error preparing search:', error);
          showError(error.message);
        });
    }
  }

  function updatePagination() {
    if (!elements.prevPageBtn || !elements.nextPageBtn) return;

    const hasPreviousPage = state.currentPage > 0;
    const hasNextPage = ((state.currentPage + 1) * state.pageSize) < getTotalAvailableCount();

    elements.prevPageBtn.classList.toggle('hidden', !hasPreviousPage);
    elements.nextPageBtn.classList.toggle('hidden', !hasNextPage);
    elements.prevPageBtn.disabled = !hasPreviousPage;
    elements.nextPageBtn.disabled = !hasNextPage;

    updateReadingProgress();
  }

  function updateReadingProgress() {
    if (!elements.readingProgress) return;

    const total = getTotalAvailableCount();
    if (!total || !state.displayedData.length) {
      elements.readingProgress.innerHTML = '';
      return;
    }

    const start = (state.currentPage * state.pageSize) + 1;
    const end = Math.min(start + state.displayedData.length - 1, total);
    elements.readingProgress.innerHTML = COPY.pageStatus
      .replace('{start}', start)
      .replace('{end}', end)
      .replace('{total}', total);
  }

  function scrollToResultsTop() {
    if (elements.namesGrid) {
      elements.namesGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function goToPreviousPage() {
    if (state.currentPage === 0) return;
    state.currentPage -= 1;
    renderNames();
    scrollToResultsTop();
  }

  async function goToNextPage() {
    if (((state.currentPage + 1) * state.pageSize) >= getTotalAvailableCount()) return;

    const nextPage = state.currentPage + 1;
    const nextStartIndex = nextPage * state.pageSize;

    if (!state.searchQuery && !state.fullDataReady && state.data.length <= nextStartIndex) {
      setProgressMessage(COPY.loadingNextNames);
      elements.nextPageBtn.disabled = true;
      try {
        await ensurePageData(nextPage);
      } catch (error) {
        console.error('Error loading next page:', error);
        showError(error.message);
        updateReadingProgress();
        elements.nextPageBtn.disabled = false;
        return;
      }
    }

    state.usePrerenderedPageOne = false;
    state.currentPage = nextPage;
    renderNames();
    scrollToResultsTop();
  }

  async function loadData() {
    try {
      elements.loadingState.classList.remove('hidden');
      elements.errorState.classList.add('hidden');

      await ensureChunkLoaded(1);
      state.dataLoaded = true;
      state.totalEntries = Math.max(state.totalEntries, state.data.length);
      state.filteredData = [...state.data];
      renderNames();
      updateStats();
      elements.loadingState.classList.add('hidden');
    } catch (error) {
      showError(error.message);
      elements.loadingState.classList.add('hidden');
    }
  }

  function renderNames() {
    try {
      if (state.usePrerenderedPageOne && state.currentPage === 0 && !state.searchQuery && elements.namesGrid?.dataset.prerendered === 'true') {
        adoptPrerenderedFirstPage();
        updatePagination();
        return;
      }

      const start = state.currentPage * state.pageSize;
      const end = start + state.pageSize;
      state.displayedData = state.filteredData.slice(start, end);
      state.usePrerenderedPageOne = false;
      if (elements.namesGrid?.dataset) {
        elements.namesGrid.dataset.prerendered = 'false';
      }

      elements.namesGrid.innerHTML = '';
      renderInChunks(state.displayedData, 0);
      updatePagination();
    } catch (error) {
      console.error('Error rendering names:', error);
      throw error;
    }
  }

  function renderInChunks(data, startIndex, chunkSize = 8) {
    const endIndex = Math.min(startIndex + chunkSize, data.length);
    const fragment = document.createDocumentFragment();

    for (let i = startIndex; i < endIndex; i++) {
      fragment.appendChild(createNameCard(data[i], i));
    }

    elements.namesGrid.appendChild(fragment);

    if (endIndex < data.length) {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => renderInChunks(data, endIndex, chunkSize), { timeout: 1000 });
      } else {
        setTimeout(() => renderInChunks(data, endIndex, chunkSize), 16);
      }
    } else if ('requestIdleCallback' in window) {
      requestIdleCallback(animateCards);
    } else {
      setTimeout(animateCards, 100);
    }
  }

  function highlight(text, query) {
    if (!text || !query) return text;

    const tokens = query
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
      .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    let result = text;

    for (const token of tokens) {
      let regex = new RegExp(`\\b(${token})\\b`, 'gi');
      if (regex.test(result)) {
        result = result.replace(regex, '<mark>$1</mark>');
        continue;
      }

      regex = new RegExp(`\\b(${token})`, 'gi');
      if (regex.test(result)) {
        result = result.replace(regex, '<mark>$1</mark>');
        continue;
      }

      if (token.length >= 3) {
        regex = new RegExp(`(${token})`, 'gi');
        result = result.replace(regex, '<mark>$1</mark>');
      }
    }

    return result;
  }

  function highlightFuzzy(text, query) {
    if (!text || !query) return text;

    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    let t = 0;
    let q = 0;
    const matchIndexes = new Set();

    while (t < lowerText.length && q < lowerQuery.length) {
      if (lowerText[t] === lowerQuery[q]) {
        matchIndexes.add(t);
        q += 1;
      }
      t += 1;
    }

    if (q !== lowerQuery.length) {
      return highlight(text, query);
    }

    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += matchIndexes.has(i) ? `<mark>${text[i]}</mark>` : text[i];
    }
    return result;
  }

  function getToggleButtonLabelMarkup(isExpanded) {
    return isExpanded ? COPY.hideButton : COPY.revealButton;
  }

  function createNameCard(entry, index) {
    const card = document.createElement('div');
    card.className = 'name-card';
    card.style.animationDelay = `${(index % state.pageSize) * 0.05}s`;

    const isExpanded = state.expandedItems.has(entry.index);
    const name = highlightFuzzy(entry.english_name || '', state.searchQuery);
    const oneLine = highlight(entry.english_one_line || '', state.searchQuery);
    const elaboration = highlight(entry.english_elaboration || '', state.searchQuery);
    const detailMarkup = [oneLine ? `<p class="card-meaning">${oneLine}</p>` : '', elaboration ? `<div class="elaboration-copy">${elaboration}</div>` : '']
      .filter(Boolean)
      .join('');

    card.innerHTML = `
      <div class="card-header">
        <span class="card-index">#${entry.index}</span>
      </div>

      <h3 class="card-name">${name}</h3>

      <button
        class="toggle-btn"
        data-index="${entry.index}"
        type="button"
        aria-expanded="${isExpanded ? 'true' : 'false'}"
        aria-controls="elaboration-${entry.index}"
      >
        <span class="toggle-btn-label">${getToggleButtonLabelMarkup(isExpanded)}</span>
        <svg class="chevron ${isExpanded ? 'rotated' : ''}" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      <div class="elaboration ${isExpanded ? 'expanded' : ''}" data-index="${entry.index}" id="elaboration-${entry.index}" aria-hidden="${isExpanded ? 'false' : 'true'}">
        <div class="elaboration-content" tabindex="${isExpanded ? '0' : '-1'}">${detailMarkup}</div>
      </div>
    `;

    card.querySelector('.toggle-btn').addEventListener('click', () => toggleElaboration(entry.index));
    return card;
  }

  function toggleElaboration(index) {
    if (state.expandedItems.has(index)) {
      state.expandedItems.delete(index);
    } else {
      state.expandedItems.add(index);
    }

    const elaboration = document.querySelector(`.elaboration[data-index="${index}"]`);
    const toggleBtn = document.querySelector(`.toggle-btn[data-index="${index}"]`);
    const chevron = toggleBtn.querySelector('.chevron');
    const label = toggleBtn.querySelector('.toggle-btn-label');
    const elaborationContent = elaboration?.querySelector('.elaboration-content');
    const isExpanded = state.expandedItems.has(index);

    if (isExpanded) {
      elaboration.classList.add('expanded');
      elaboration.setAttribute('aria-hidden', 'false');
      chevron.classList.add('rotated');
      toggleBtn.setAttribute('aria-expanded', 'true');
      elaborationContent?.setAttribute('tabindex', '0');
    } else {
      elaboration.classList.remove('expanded');
      elaboration.setAttribute('aria-hidden', 'true');
      chevron.classList.remove('rotated');
      toggleBtn.setAttribute('aria-expanded', 'false');
      elaborationContent?.setAttribute('tabindex', '-1');
    }

    if (label) {
      label.textContent = getToggleButtonLabelMarkup(isExpanded);
    }
  }

  function animateCards() {
    const cards = elements.namesGrid.querySelectorAll('.name-card');
    cards.forEach((card, index) => {
      setTimeout(() => card.classList.add('visible'), index * 30);
    });
  }

  async function handleSearchDebounced() {
    state.currentPage = 0;
    if (state.searchQuery) {
      setSearchPanelOpen(true, false);
      try {
        await prepareSearchExperience();
      } catch (error) {
        console.error('Error loading deferred search experience:', error);
        showError(error.message);
        return;
      }
    }

    await filterData();
    renderNames();
    updateStats();
  }

  async function filterData() {
    if (!state.searchQuery) {
      state.filteredData = [...state.data];
      return;
    }

    const searchEntries = await ensureSearchModule();
    state.filteredData = searchEntries(state.data, state.searchQuery);
  }

  function handleClear() {
    state.searchQuery = '';
    state.currentPage = 0;
    elements.searchInput.value = '';
    state.filteredData = [...state.data];
    renderNames();
    updateStats();
    updateClearButton();
  }

  function updateClearButton() {
    elements.clearBtn.disabled = !state.searchQuery;
  }

  function updateStats() {
    const filteredCount = state.filteredData.length;
    if (state.searchQuery) {
      elements.statsDisplay.innerHTML = COPY.statsSearching
        .replace('{count}', filteredCount)
        .replace('{query}', state.searchQuery);
      return;
    }
    elements.statsDisplay.innerHTML = COPY.statsDefault;
  }

  function scrollToNames() {
    const namesSection = document.getElementById('names-section');
    if (namesSection) {
      namesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function scrollToAbout() {
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function showError(message) {
    elements.errorState.classList.remove('hidden');
    elements.errorMessage.textContent = message;
    if (!state.displayedData.length) {
      elements.namesGrid.innerHTML = '';
    }
  }

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
