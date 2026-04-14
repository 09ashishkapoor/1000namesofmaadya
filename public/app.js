/**
 * Ādya Mahākālī Sahasranāma - Pure Vanilla JS Application
 * Mobile-first, lightweight, fast
 */

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
  
  // Safe localStorage access for incognito mode
  function getFromStorage(key, defaultValue) {
    try {
      return localStorage.getItem(key) || defaultValue;
    } catch (e) {
      console.warn('⚠️ localStorage not available (incognito mode?)', e);
      return defaultValue;
    }
  }
  
  function setToStorage(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.warn('⚠️ localStorage not available (incognito mode?)', e);
      return false;
    }
  }

  function getInitialLanguagePreference() {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    if (langParam === 'hi' || langParam === 'hindi') return 'hindi';
    if (langParam === 'en' || langParam === 'english') return 'english';
    return getFromStorage('preferredLanguage', 'english');
  }

  function applyDocumentLanguage(lang) {
    document.documentElement.lang = lang === 'hindi' ? 'hi' : 'en';
    document.documentElement.dataset.uiLang = lang;
  }
  
  // State
  const state = {
    data: [...initialEntries],
    filteredData: [...initialEntries],
    displayedData: initialEntries.slice(0, 11),
    currentPage: 0,
    pageSize: 11,
    language: getInitialLanguagePreference(),
    searchQuery: (function() {
      const urlParams = new URLSearchParams(window.location.search);
      return (urlParams.get('q') || '').toLowerCase().trim();
    })(),
    expandedItems: new Set(),
    searchPanelOpen: false,
    // Lazy loading
    loadedChunks: new Set(),
    totalChunks: Number(initialNamesPayload?.totalChunks || 0),
    chunkSize: Number(initialNamesPayload?.chunkSize || 0),
    totalEntries: Number(initialNamesPayload?.totalEntries || initialEntries.length || 0),
    dataLoaded: initialEntries.length > 0,
    fullDataReady: false,
    fullDataRequested: false,
    usePrerenderedPageOne: initialEntries.length > 0
  };
  
  // DOM Elements
  const elements = {};
  
  // Initialize
  function init() {
    initializeLocalization();
    cacheDOMElements();
    setupEventListeners();

    if (state.data.length > 0) {
      elements.loadingState.classList.add('hidden');
      renderNames();
      updateStats();
      console.log('✅ App initialized - Adopted prerendered first page');

      if (state.searchQuery) {
        setSearchPanelOpen(true, false);
        void handleSearchDebounced();
      }
    } else {
      // Fallback path when bootstrap data is unavailable
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          void loadData();
          console.log('✅ App initialized - Data loading started');
        }, { timeout: 2000 });
      } else {
        setTimeout(() => {
          void loadData();
        }, 0);
        console.log('✅ App initialized - Data loading started (fallback)');
      }
    }
  }
  
  // Initialize Localization
  function initializeLocalization() {
    applyDocumentLanguage(state.language);

    // Set language selectors to match stored preference
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
      languageSelect.value = state.language;
    }

    // Set search input if q parameter is present
    const searchInput = document.getElementById('search-input');
    if (searchInput && state.searchQuery) {
      searchInput.value = state.searchQuery;
    }
    
    // Update all UI text with current language after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', updateUIText);
    } else {
      // DOM already loaded, update immediately
      setTimeout(updateUIText, 0);
    }
    
    console.log(`✅ Localization initialized (${state.language})`);
  }
  
  // Update SEO meta tags dynamically
  function updateSEOMetaTags() {
    const lang = state.language;
    
    // Update HTML lang attribute
    applyDocumentLanguage(lang);
    
    // Update page title
    const title = getTranslation(lang, 'seo.title');
    if (title) {
      document.title = title;
    }
    
    // Update meta description
    const description = getTranslation(lang, 'seo.description');
    if (description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', description);
      }
    }

    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.href = lang === 'hindi' ? 'https://1000namesofmakali.com/?lang=hi' : 'https://1000namesofmakali.com/';
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && title) {
      ogTitle.setAttribute('content', title);
    }
    
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && description) {
      ogDesc.setAttribute('content', description);
    }
    
    // Update Twitter Card tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle && title) {
      twitterTitle.setAttribute('content', title);
    }
    
    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc && description) {
      twitterDesc.setAttribute('content', description);
    }
    
    console.log(`✅ SEO meta tags updated for ${lang}`);
  }

  function setTextContent(selector, translationKey) {
    const element = document.querySelector(selector);
    if (element) {
      element.textContent = getTranslation(state.language, translationKey);
    }
  }

  function setInnerHtml(selector, translationKey) {
    const element = document.querySelector(selector);
    if (element) {
      element.innerHTML = getTranslation(state.language, translationKey);
    }
  }

  function updateLandingText() {
    setTextContent('.title-line-main', 'landing.titleMain');
    setTextContent('.title-line-sub', 'landing.titleSub');
    setTextContent('.title-description', 'landing.titleDescription');
    setInnerHtml('.description-text', 'landing.descriptionText');
    setTextContent('.significance-title', 'landing.significanceTitle');
    setInnerHtml('.significance-text', 'landing.significanceText');

    const exploreBtn = document.getElementById('explore-btn');
    if (exploreBtn) {
      const span = exploreBtn.querySelector('span');
      if (span) span.textContent = getTranslation(state.language, 'landing.exploreButton');
    }

    const learnBtn = document.getElementById('learn-btn');
    if (learnBtn) {
      const span = learnBtn.querySelector('span');
      if (span) {
        span.textContent = getTranslation(state.language, 'landing.learnButton');
      } else {
        learnBtn.textContent = getTranslation(state.language, 'landing.learnButton');
      }
    }

    setInnerHtml('.dedication-text', 'landing.dedicationText');

    const dedicationMantra = document.querySelector('.dedication-mantra');
    if (dedicationMantra) {
      const emoji = dedicationMantra.querySelector('span[title]');
      const emojiHTML = emoji ? emoji.outerHTML : '';
      dedicationMantra.innerHTML = `${getTranslation(state.language, 'landing.dedicationMantra')} ${emojiHTML}`;
    }
  }

  function updateAboutText() {
    setTextContent('#about-section header h2', 'about.sectionTitle');
    setTextContent('#about-section header p', 'about.sectionSubtitle');

    const aboutArticles = document.querySelectorAll('#about-section article');
    if (aboutArticles.length >= 1) {
      const whoIsTitle = aboutArticles[0].querySelector('h3');
      if (whoIsTitle) whoIsTitle.textContent = getTranslation(state.language, 'about.whoIsTitle');

      const paragraphs = aboutArticles[0].querySelectorAll('p');
      if (paragraphs[0]) paragraphs[0].innerHTML = getTranslation(state.language, 'about.whoIsContent1');
      if (paragraphs[1]) paragraphs[1].textContent = getTranslation(state.language, 'about.whoIsContent2');
    }

    if (aboutArticles.length >= 2) {
      const benefitsTitle = aboutArticles[1].querySelector('h3');
      if (benefitsTitle) benefitsTitle.textContent = getTranslation(state.language, 'about.benefitsTitle');

      const benefitItems = aboutArticles[1].querySelectorAll('div[style*="display: flex"]');
      for (let i = 0; i < benefitItems.length && i < 5; i++) {
        const h4 = benefitItems[i].querySelector('h4');
        const p = benefitItems[i].querySelector('p');
        if (h4) h4.textContent = getTranslation(state.language, `about.benefit${i + 1}Title`);
        if (p) p.textContent = getTranslation(state.language, `about.benefit${i + 1}Text`);
      }
    }
  }

  function updateNamesSectionText() {
    setTextContent('.section-title', 'names.sectionTitle');
    setTextContent('.section-subtitle', 'names.sectionSubtitle');
    setTextContent('.reading-mode-title', 'names.readingModeTitle');
    setTextContent('.reading-mode-text', 'names.readingModeText');

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.placeholder = getTranslation(state.language, 'names.searchPlaceholder');
      searchInput.setAttribute('aria-label', getTranslation(state.language, 'names.searchAriaLabel'));
    }

    updateSearchToggleButton();

    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
      languageSelect.setAttribute('aria-label', getTranslation(state.language, 'names.languageSelectLabel'));
    }

    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) clearBtn.textContent = getTranslation(state.language, 'names.clearButton');

    const loadingState = document.querySelector('#loading-state p');
    if (loadingState) loadingState.textContent = getTranslation(state.language, 'names.loadingText');

    const errorTitle = document.querySelector('#error-state h3');
    if (errorTitle) errorTitle.textContent = getTranslation(state.language, 'names.errorTitle');

    const prevPageBtn = document.getElementById('prev-page-btn');
    if (prevPageBtn) prevPageBtn.textContent = getTranslation(state.language, 'names.previousButton');

    const nextPageBtn = document.getElementById('next-page-btn');
    if (nextPageBtn) nextPageBtn.textContent = getTranslation(state.language, 'names.nextButton');
  }

  function updateEbookText() {
    setTextContent('.ebook-promo-badge', 'ebook.badge');
    setTextContent('.ebook-promo-title', 'ebook.title');
    setInnerHtml('.ebook-promo-text', 'ebook.description');

    const ebookFeatures = document.querySelectorAll('.ebook-features li');
    if (ebookFeatures.length >= 5) {
      ebookFeatures[0].innerHTML = getTranslation(state.language, 'ebook.feature1');
      ebookFeatures[1].innerHTML = getTranslation(state.language, 'ebook.feature2');
      ebookFeatures[2].innerHTML = getTranslation(state.language, 'ebook.feature3');
      ebookFeatures[3].innerHTML = getTranslation(state.language, 'ebook.feature4');
      ebookFeatures[4].innerHTML = getTranslation(state.language, 'ebook.feature5');
    }

    const ebookCtaBtn = document.querySelector('.ebook-cta-btn');
    if (ebookCtaBtn) {
      const textNodes = Array.from(ebookCtaBtn.childNodes).filter(node => node.nodeType === 3);
      if (textNodes.length > 0) {
        textNodes[0].textContent = `${getTranslation(state.language, 'ebook.ctaButton')} `;
      }
    }

    setInnerHtml('.ebook-promo-footer', 'ebook.footerText');
  }

  function updateFooterText() {
    const footerText = document.querySelector('.footer-text');
    if (!footerText) return;

    const developedText = getTranslation(state.language, 'footer.developedBy');
    const dedicatedText = getTranslation(state.language, 'footer.dedicatedTo');
    const connectText = getTranslation(state.language, 'footer.connectInstagram');
    const versionText = getTranslation(state.language, 'footer.version');
    const lastUpdatedText = getTranslation(state.language, 'footer.lastUpdated');

    const footerMantra = footerText.querySelector('.footer-mantra');
    const footerSocial = footerText.querySelector('.footer-social');
    const footerRepo = footerText.querySelector('.footer-repo');
    const footerVersion = footerText.querySelector('.footer-version');
    const versionNumber = document.getElementById('version-number');
    const lastUpdated = document.getElementById('last-updated');

    footerText.innerHTML = `
      ${developedText}<br>
      ${dedicatedText}<br>
      ${footerMantra ? footerMantra.outerHTML : '<span class="footer-mantra">Jai Ma Krishna<br>Jai Mā Ādya Mahākālī<br>Jai Kālabhairava</span>'}
    `;

    if (footerSocial) {
      const instagramLink = footerSocial.querySelector('a');
      footerSocial.innerHTML = `${connectText} `;
      if (instagramLink) footerSocial.appendChild(instagramLink);
      footerText.appendChild(footerSocial);
    }

    if (footerRepo) {
      footerText.appendChild(footerRepo);
    }

    if (footerVersion) {
      const versionNum = versionNumber ? versionNumber.textContent : 'V1.21.0';
      const lastUpd = lastUpdated ? lastUpdated.textContent : 'Loading...';
      footerVersion.innerHTML = `${versionText} <span id="version-number">${versionNum}</span> | ${lastUpdatedText} <span id="last-updated">${lastUpd}</span>`;
      footerText.appendChild(footerVersion);
    }
  }
  
  // Update UI Text based on current language
  function updateUIText() {
    // Update SEO meta tags first
    updateSEOMetaTags();
    updateLandingText();
    updateAboutText();
    updateNamesSectionText();
    updateEbookText();
    updateFooterText();
    
    // Update stats display
    if (state.dataLoaded) {
      updateStats();
    }

    updateReadingProgress();
  }
  
  function cacheDOMElements() {
    elements.searchInput = document.getElementById('search-input');
    elements.languageSelect = document.getElementById('language-select');
    elements.languagePillBtns = document.querySelectorAll('.language-pill-btn');
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
      searchModulePromise = import(getAssetUrl('/search.js'))
        .then((mod) => {
          searchEntriesFn = mod.searchEntries;
          return searchEntriesFn;
        });
    }
    return searchModulePromise;
  }

  async function ensureManifestMetadata() {
    if (state.totalChunks && state.chunkSize) {
      return;
    }

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
    setStatsMessage(state.language === 'hindi' ? 'खोज तैयार की जा रही है…' : 'Preparing search…');
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
  
  function setupEventListeners() {
    // Search — provide immediate UI feedback, run expensive filtering debounced
    const debouncedFilter = debounce(() => {
      void handleSearchDebounced();
    }, 100);

    if (elements.searchInput) {
      elements.searchInput.addEventListener('input', (e) => {
        // update simple UI state immediately to improve input-to-next-paint
        state.searchQuery = e.target.value.toLowerCase().trim();
        updateClearButton();
        // run the heavier filtering/rendering on a short debounce
        debouncedFilter();
      });
    }
    
    // Language
    if (elements.languageSelect) {
      elements.languageSelect.addEventListener('change', handleLanguageChange);
    }
    
    initializeLanguagePillButtons();
    
    // Clear
    if (elements.clearBtn) {
      elements.clearBtn.addEventListener('click', handleClear);
    }
    
    // Explore button
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
  }

  function bindLanguagePillButtons(buttons, contextLabel) {
    elements.languagePillBtns = buttons;
    console.log(`✅ Found ${buttons.length} language pill buttons${contextLabel}`);
    buttons.forEach(btn => {
      btn.addEventListener('click', handleLanguagePillClick);
    });
    updateLanguagePillButtons();
    showFirstVisitPulse();
  }

  function initializeLanguagePillButtons() {
    if (elements.languagePillBtns && elements.languagePillBtns.length > 0) {
      bindLanguagePillButtons(elements.languagePillBtns, '');
      return;
    }

    console.warn('⚠️ Language pill buttons not found, retrying...');
    setTimeout(() => {
      const retryButtons = document.querySelectorAll('.language-pill-btn');
      if (retryButtons && retryButtons.length > 0) {
        bindLanguagePillButtons(retryButtons, ' on retry');
      }
    }, 100);
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

  function updateSearchToggleButton() {
    if (!elements.searchToggleBtn) return;

    const labelKey = getSearchPanelToggleLabel();
    elements.searchToggleBtn.textContent = getTranslation(state.language, labelKey);
  }

  function getSearchPanelToggleLabel() {
    return state.searchPanelOpen ? 'names.hideSearchButton' : 'names.showSearchButton';
  }

  function toggleSearchPanel() {
    if (isDesktopViewport()) return;

    const willOpen = !state.searchPanelOpen;
    setSearchPanelOpen(willOpen, willOpen);
    if (willOpen && !state.fullDataRequested) {
      void prepareSearchExperience()
        .then(() => {
          updateStats();
        })
        .catch((error) => {
          console.error('Error preparing search:', error);
          showError(error.message);
        });
    }
  }

  function scrollToResultsTop() {
    if (elements.namesGrid) {
      elements.namesGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    const template = getTranslation(state.language, 'names.pageStatus');

    elements.readingProgress.innerHTML = template
      .replace('{start}', start)
      .replace('{end}', end)
      .replace('{total}', total);
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
      setProgressMessage(state.language === 'hindi' ? 'अगले नाम लोड हो रहे हैं…' : 'Loading next names…');
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
  
  // Load Data - Lazy loading with chunks
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
  
  // Render Names - Optimized to reduce blocking time
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
      
      // Render in chunks to avoid blocking the main thread
      renderInChunks(state.displayedData, 0);
      
      updatePagination();
    } catch (error) {
      console.error('Error rendering names:', error);
      throw error;
    }
  }
  
  // Render cards in chunks to prevent blocking - OPTIMIZED with requestIdleCallback
  function renderInChunks(data, startIndex, chunkSize = 8) {
    const endIndex = Math.min(startIndex + chunkSize, data.length);
    const fragment = document.createDocumentFragment();
    
    for (let i = startIndex; i < endIndex; i++) {
      const card = createNameCard(data[i], i);
      fragment.appendChild(card);
    }
    
    elements.namesGrid.appendChild(fragment);
    
    if (endIndex < data.length) {
      // Use requestIdleCallback for more aggressive idle-time rendering
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => renderInChunks(data, endIndex, chunkSize), { timeout: 1000 });
      } else {
        // Fallback: use small setTimeout to yield to browser
        setTimeout(() => renderInChunks(data, endIndex, chunkSize), 16);
      }
    } else {
      // All cards rendered, defer animation to requestIdleCallback
      if ('requestIdleCallback' in window) {
        requestIdleCallback(animateCards);
      } else {
        setTimeout(animateCards, 100);
      }
    }
  }

  function highlight(text, query) {
    if (!text || !query) return text;

    const tokens = query
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
      .map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    let result = text;

    for (const token of tokens) {
      if (!token) continue;

      // 1. exact word
      let regex = new RegExp(`\\b(${token})\\b`, 'gi');
      if (regex.test(result)) {
        result = result.replace(regex, '<mark>$1</mark>');
        continue;
      }

      // 2. word start (but only highlight the token itself)
      regex = new RegExp(`\\b(${token})`, 'gi');
      if (regex.test(result)) {
        result = result.replace(regex, '<mark>$1</mark>');
        continue;
      }

      // 3. fallback contains (ONLY if token is long enough)
      if (token.length >= 3) {
        regex = new RegExp(`(${token})`, 'gi');
        result = result.replace(regex, '<mark>$1</mark>');
      }
    }

    return result;
  }

  function getToggleButtonLabelMarkup(isExpanded) {
    const englishKey = isExpanded ? 'names.hideButton' : 'names.revealButton';
    const hindiKey = englishKey;
    return `
      <span class="language-copy language-copy--english">${getTranslation('english', englishKey)}</span>
      <span class="language-copy language-copy--hindi">${getTranslation('hindi', hindiKey)}</span>
    `;
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
        q++;
      }
      t++;
    }

    // if not all query chars matched, fallback to normal highlight
    if (q !== lowerQuery.length) {
      return highlight(text, query); // your existing exact highlight
    }

    // rebuild string with <mark>
    let result = "";
    for (let i = 0; i < text.length; i++) {
      if (matchIndexes.has(i)) {
        result += `<mark>${text[i]}</mark>`;
      } else {
        result += text[i];
      }
    }

    return result;
  }
  
  function createNameCard(entry, index) {
    const card = document.createElement('div');
    card.className = 'name-card';
    card.style.animationDelay = `${(index % state.pageSize) * 0.05}s`;
    
    const isExpanded = state.expandedItems.has(entry.index);
    const rawName = state.language === 'english'
      ? (entry.english_name || '')
      : (entry.hindi_name || '');

    const rawOneLine = state.language === 'english'
      ? (entry.english_one_line || '')
      : (entry.hindi_one_line || '');

    const rawElaboration = state.language === 'english'
      ? (entry.english_elaboration || '')
      : (entry.hindi_elaboration || '');

    const name = highlightFuzzy(rawName, state.searchQuery);
    const oneLine = highlight(rawOneLine, state.searchQuery);
    const elaboration = highlight(rawElaboration, state.searchQuery);
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
    
    // Add toggle event
    const toggleBtn = card.querySelector('.toggle-btn');
    toggleBtn.addEventListener('click', () => toggleElaboration(entry.index));
    
    return card;
  }
  
  function toggleElaboration(index) {
    if (state.expandedItems.has(index)) {
      state.expandedItems.delete(index);
    } else {
      state.expandedItems.add(index);
    }
    
    // Find the card and update it
    const elaboration = document.querySelector(`.elaboration[data-index="${index}"]`);
    const toggleBtn = document.querySelector(`.toggle-btn[data-index="${index}"]`);
    const chevron = toggleBtn.querySelector('.chevron');
    const label = toggleBtn.querySelector('.toggle-btn-label');
    const elaborationContent = elaboration?.querySelector('.elaboration-content');
    
    if (state.expandedItems.has(index)) {
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
      label.innerHTML = getToggleButtonLabelMarkup(state.expandedItems.has(index));
    }
  }
  
  function animateCards() {
    const cards = elements.namesGrid.querySelectorAll('.name-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('visible');
      }, index * 30);
    });
  }
  
  // Search & Filter
  // Called after short debounce to do heavier work
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
    // Do filtering and rendering — these are the heavier steps
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
    state.filteredData = searchEntries(
      state.data,
      state.searchQuery,
      state.language
    );
  }

  function notifyNavigationLanguageChange() {
    if (window.updateNavigationText && typeof window.updateNavigationText === 'function') {
      window.updateNavigationText();
    }
  }

  function applyLanguageChange(newLang, { syncSelect = false } = {}) {
    state.language = newLang;
    setToStorage('preferredLanguage', state.language);
    applyDocumentLanguage(state.language);
    updateLanguagePillButtons();

    if (syncSelect && elements.languageSelect) {
      elements.languageSelect.value = state.language;
    }

    updateUIText();
    renderNames();
    notifyNavigationLanguageChange();
  }
  
  function handleLanguageChange(e) {
    applyLanguageChange(e.target.value);
    
    console.log(`✅ Language changed to ${state.language}`);
  }
  
  function handleLanguagePillClick(e) {
    const btn = e.currentTarget;
    const newLang = btn.dataset.lang;
    
    console.log(`🔄 Language pill clicked: ${newLang} (current: ${state.language})`);
    
    if (!newLang) {
      console.error('❌ No language data attribute found on button');
      return;
    }
    
    if (newLang === state.language) {
      console.log('ℹ️ Language already selected');
      return; // Already selected
    }

    applyLanguageChange(newLang, { syncSelect: true });
    
    console.log(`✅ Language changed to ${state.language}`);
  }
  
  function updateLanguagePillButtons() {
    if (elements.languagePillBtns) {
      elements.languagePillBtns.forEach(btn => {
        if (btn.dataset.lang === state.language) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }
  }
  
  function showFirstVisitPulse() {
    // Check if user has visited before
    const hasVisitedBefore = getFromStorage('hasVisited', null);
    
    if (!hasVisitedBefore) {
      console.log('🎯 First visit detected - showing language selector pulse');
      
      // Delay pulse slightly so user can see the page first
      setTimeout(() => {
        // Add pulse animation to the toggle container
        const languageToggle = document.querySelector('.language-pill-toggle');
        if (languageToggle) {
          languageToggle.classList.add('first-visit-pulse');
          
          // Add glow to the Hindi button specifically
          const hindiBtn = document.querySelector('.language-pill-btn[data-lang="hindi"]');
          if (hindiBtn) {
            hindiBtn.classList.add('first-visit-highlight');
          }
          
          // Remove animations after they complete (6 seconds for 3 pulse cycles at 2s each)
          setTimeout(() => {
            languageToggle.classList.remove('first-visit-pulse');
            if (hindiBtn) {
              hindiBtn.classList.remove('first-visit-highlight');
            }
          }, 6500);
        }
      }, 800); // Start pulsing after 800ms
      
      // Mark that user has visited
      setToStorage('hasVisited', 'true');
    } else {
      console.log('✅ Returning visitor - no pulse animation');
    }
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
      const template = getTranslation(state.language, 'names.statsSearching');
      elements.statsDisplay.innerHTML = template
        .replace('{count}', filteredCount)
        .replace('{query}', state.searchQuery);
    } else {
      elements.statsDisplay.innerHTML = getTranslation(state.language, 'names.statsDefault');
    }
  }
  
  // Navigation
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
  
  // Error handling
  function showError(message) {
    elements.errorState.classList.remove('hidden');
    elements.errorMessage.textContent = message;
    if (!state.displayedData.length) {
      elements.namesGrid.innerHTML = '';
    }
  }
  
  // Utility: Debounce
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
  
  // Start the app
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();












