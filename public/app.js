/**
 * Ādya Mahākālī Sahasranāma - Pure Vanilla JS Application
 * Mobile-first, lightweight, fast
 */

(function() {
  'use strict';

  const assetVersion = (typeof window !== 'undefined' && typeof window.__ASSET_VERSION__ === 'string')
    ? window.__ASSET_VERSION__.trim()
    : '';

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
  
  // State
  const state = {
    data: [],
    filteredData: [],
    displayedData: [],
    currentPage: 0,
    pageSize: 11,
    language: (function() {
      const urlParams = new URLSearchParams(window.location.search);
      const langParam = urlParams.get('lang');
      if (langParam === 'hi' || langParam === 'hindi') return 'hindi';
      if (langParam === 'en' || langParam === 'english') return 'english';
      return getFromStorage('preferredLanguage', 'english');
    })(),
    searchQuery: (function() {
      const urlParams = new URLSearchParams(window.location.search);
      return (urlParams.get('q') || '').toLowerCase().trim();
    })(),
    expandedItems: new Set(),
    searchPanelOpen: false,
    // Lazy loading
    loadedChunks: new Set(),
    totalChunks: 0,
    dataLoaded: false
  };
  
  // DOM Elements
  const elements = {};
  
  // Initialize
  function init() {
    initializeLocalization();
    cacheDOMElements();
    setupEventListeners();
    // Defer data loading to requestIdleCallback to avoid blocking critical rendering
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        loadData();
        console.log('✅ App initialized - Data loading started');
      }, { timeout: 2000 }); // Timeout ensures loading starts even if idle callback doesn't fire
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(loadData, 0);
      console.log('✅ App initialized - Data loading started (fallback)');
    }
  }
  
  // Initialize Localization
  function initializeLocalization() {
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
    document.documentElement.lang = lang === 'hindi' ? 'hi' : 'en';
    
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
  
  // Update UI Text based on current language
  function updateUIText() {
    const lang = state.language;
    
    // Update SEO meta tags first
    updateSEOMetaTags();
    
    // Landing page title
    const titleMain = document.querySelector('.title-line-main');
    if (titleMain) titleMain.textContent = getTranslation(lang, 'landing.titleMain');
    
    const titleSub = document.querySelector('.title-line-sub');
    if (titleSub) titleSub.textContent = getTranslation(lang, 'landing.titleSub');
    
    // Landing page
    const titleDesc = document.querySelector('.title-description');
    if (titleDesc) titleDesc.textContent = getTranslation(lang, 'landing.titleDescription');
    
    const descText = document.querySelector('.description-text');
    if (descText) descText.innerHTML = getTranslation(lang, 'landing.descriptionText');
    
    const sigTitle = document.querySelector('.significance-title');
    if (sigTitle) sigTitle.textContent = getTranslation(lang, 'landing.significanceTitle');
    
    const sigText = document.querySelector('.significance-text');
    if (sigText) sigText.innerHTML = getTranslation(lang, 'landing.significanceText');
    
    const exploreBtn = document.getElementById('explore-btn');
    if (exploreBtn) {
      const span = exploreBtn.querySelector('span');
      if (span) span.textContent = getTranslation(lang, 'landing.exploreButton');
    }

    const learnBtn = document.getElementById('learn-btn');
    if (learnBtn) {
      const span = learnBtn.querySelector('span');
      if (span) {
        span.textContent = getTranslation(lang, 'landing.learnButton');
      } else {
        learnBtn.textContent = getTranslation(lang, 'landing.learnButton');
      }
    }
    
    const dedicationText = document.querySelector('.dedication-text');
    if (dedicationText) dedicationText.innerHTML = getTranslation(lang, 'landing.dedicationText');
    
    const dedicationMantra = document.querySelector('.dedication-mantra');
    if (dedicationMantra) {
      const emoji = dedicationMantra.querySelector('span[title]');
      const emojiHTML = emoji ? emoji.outerHTML : '';
      dedicationMantra.innerHTML = getTranslation(lang, 'landing.dedicationMantra') + ' ' + emojiHTML;
    }
    
    // About section
    const aboutTitle = document.querySelector('#about-section header h2');
    if (aboutTitle) aboutTitle.textContent = getTranslation(lang, 'about.sectionTitle');
    
    const aboutSubtitle = document.querySelector('#about-section header p');
    if (aboutSubtitle) aboutSubtitle.textContent = getTranslation(lang, 'about.sectionSubtitle');
    
    const aboutArticles = document.querySelectorAll('#about-section article');
    if (aboutArticles.length >= 1) {
      const whoIsTitle = aboutArticles[0].querySelector('h3');
      if (whoIsTitle) whoIsTitle.textContent = getTranslation(lang, 'about.whoIsTitle');
      
      const paragraphs = aboutArticles[0].querySelectorAll('p');
      if (paragraphs[0]) paragraphs[0].innerHTML = getTranslation(lang, 'about.whoIsContent1');
      if (paragraphs[1]) paragraphs[1].textContent = getTranslation(lang, 'about.whoIsContent2');
    }
    
    if (aboutArticles.length >= 2) {
      const benefitsTitle = aboutArticles[1].querySelector('h3');
      if (benefitsTitle) benefitsTitle.textContent = getTranslation(lang, 'about.benefitsTitle');
      
      const benefitItems = aboutArticles[1].querySelectorAll('div[style*="display: flex"]');
      for (let i = 0; i < benefitItems.length && i < 5; i++) {
        const h4 = benefitItems[i].querySelector('h4');
        const p = benefitItems[i].querySelector('p');
        if (h4) h4.textContent = getTranslation(lang, `about.benefit${i+1}Title`);
        if (p) p.textContent = getTranslation(lang, `about.benefit${i+1}Text`);
      }
    }
    
    // Names section
    const namesTitle = document.querySelector('.section-title');
    if (namesTitle) namesTitle.textContent = getTranslation(lang, 'names.sectionTitle');
    
    const namesSubtitle = document.querySelector('.section-subtitle');
    if (namesSubtitle) namesSubtitle.textContent = getTranslation(lang, 'names.sectionSubtitle');

    const readingModeTitle = document.querySelector('.reading-mode-title');
    if (readingModeTitle) readingModeTitle.textContent = getTranslation(lang, 'names.readingModeTitle');

    const readingModeText = document.querySelector('.reading-mode-text');
    if (readingModeText) readingModeText.textContent = getTranslation(lang, 'names.readingModeText');
    
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.placeholder = getTranslation(lang, 'names.searchPlaceholder');
      searchInput.setAttribute('aria-label', getTranslation(lang, 'names.searchAriaLabel'));
    }

    updateSearchToggleButton();
    
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
      languageSelect.setAttribute('aria-label', getTranslation(lang, 'names.languageSelectLabel'));
    }
    
    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) clearBtn.textContent = getTranslation(lang, 'names.clearButton');
    
    const loadingState = document.querySelector('#loading-state p');
    if (loadingState) loadingState.textContent = getTranslation(lang, 'names.loadingText');
    
    const errorTitle = document.querySelector('#error-state h3');
    if (errorTitle) errorTitle.textContent = getTranslation(lang, 'names.errorTitle');
    
    const prevPageBtn = document.getElementById('prev-page-btn');
    if (prevPageBtn) prevPageBtn.textContent = getTranslation(lang, 'names.previousButton');

    const nextPageBtn = document.getElementById('next-page-btn');
    if (nextPageBtn) nextPageBtn.textContent = getTranslation(lang, 'names.nextButton');
    
    // eBook promo section
    const ebookBadge = document.querySelector('.ebook-promo-badge');
    if (ebookBadge) ebookBadge.textContent = getTranslation(lang, 'ebook.badge');
    
    const ebookTitle = document.querySelector('.ebook-promo-title');
    if (ebookTitle) ebookTitle.textContent = getTranslation(lang, 'ebook.title');
    
    const ebookText = document.querySelector('.ebook-promo-text');
    if (ebookText) ebookText.innerHTML = getTranslation(lang, 'ebook.description');
    
    const ebookFeatures = document.querySelectorAll('.ebook-features li');
    if (ebookFeatures.length >= 5) {
      ebookFeatures[0].innerHTML = getTranslation(lang, 'ebook.feature1');
      ebookFeatures[1].innerHTML = getTranslation(lang, 'ebook.feature2');
      ebookFeatures[2].innerHTML = getTranslation(lang, 'ebook.feature3');
      ebookFeatures[3].innerHTML = getTranslation(lang, 'ebook.feature4');
      ebookFeatures[4].innerHTML = getTranslation(lang, 'ebook.feature5');
    }
    
    const ebookCtaBtn = document.querySelector('.ebook-cta-btn');
    if (ebookCtaBtn) {
      const textNodes = Array.from(ebookCtaBtn.childNodes).filter(node => node.nodeType === 3);
      if (textNodes.length > 0) {
        textNodes[0].textContent = getTranslation(lang, 'ebook.ctaButton') + ' ';
      }
    }
    
    const ebookPromoFooter = document.querySelector('.ebook-promo-footer');
    if (ebookPromoFooter) ebookPromoFooter.innerHTML = getTranslation(lang, 'ebook.footerText');
    
    // Footer
    const footerText = document.querySelector('.footer-text');
    if (footerText) {
      const developedText = getTranslation(lang, 'footer.developedBy');
      const dedicatedText = getTranslation(lang, 'footer.dedicatedTo');
      const connectText = getTranslation(lang, 'footer.connectInstagram');
      const versionText = getTranslation(lang, 'footer.version');
      const lastUpdatedText = getTranslation(lang, 'footer.lastUpdated');
      
      // Preserve existing elements while updating text
      const footerMantra = footerText.querySelector('.footer-mantra');
      const footerSocial = footerText.querySelector('.footer-social');
      const footerVersion = footerText.querySelector('.footer-version');
      const versionNumber = document.getElementById('version-number');
      const lastUpdated = document.getElementById('last-updated');
      
      // Reconstruct footer with preserved elements
      footerText.innerHTML = `
        ${developedText}<br>
        ${dedicatedText}<br>
        ${footerMantra ? footerMantra.outerHTML : '<span class="footer-mantra">Jai Ma Krishna<br>Jai Mā Ādya Mahākālī<br>Jai Kālabhairava</span>'}
      `;
      
      // Re-append social and version
      if (footerSocial) {
        const instagramLink = footerSocial.querySelector('a');
        footerSocial.innerHTML = `${connectText} `;
        if (instagramLink) footerSocial.appendChild(instagramLink);
        footerText.appendChild(footerSocial);
      }
      
      if (footerVersion) {
        const versionNum = versionNumber ? versionNumber.textContent : 'V1.21.0';
        const lastUpd = lastUpdated ? lastUpdated.textContent : 'Loading...';
        footerVersion.innerHTML = `${versionText} <span id="version-number">${versionNum}</span> | ${lastUpdatedText} <span id="last-updated">${lastUpd}</span>`;
        footerText.appendChild(footerVersion);
      }
    }
    
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
  
  function setupEventListeners() {
    // Search — provide immediate UI feedback, run expensive filtering debounced
    const debouncedFilter = debounce(() => {
      handleSearchDebounced();
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
    
    // Language pill toggle buttons
    if (elements.languagePillBtns && elements.languagePillBtns.length > 0) {
      console.log(`✅ Found ${elements.languagePillBtns.length} language pill buttons`);
      elements.languagePillBtns.forEach(btn => {
        btn.addEventListener('click', handleLanguagePillClick);
      });
      // Update initial state
      updateLanguagePillButtons();
      // Show pulse animation for first-time visitors
      showFirstVisitPulse();
    } else {
      console.warn('⚠️ Language pill buttons not found, retrying...');
      // Retry after a short delay in case DOM hasn't fully loaded
      setTimeout(() => {
        elements.languagePillBtns = document.querySelectorAll('.language-pill-btn');
        if (elements.languagePillBtns && elements.languagePillBtns.length > 0) {
          console.log(`✅ Found ${elements.languagePillBtns.length} language pill buttons on retry`);
          elements.languagePillBtns.forEach(btn => {
            btn.addEventListener('click', handleLanguagePillClick);
          });
          updateLanguagePillButtons();
          // Show pulse animation for first-time visitors
          showFirstVisitPulse();
        }
      }, 100);
    }
    
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

    setSearchPanelOpen(!state.searchPanelOpen, !state.searchPanelOpen);
  }

  function scrollToResultsTop() {
    if (elements.namesGrid) {
      elements.namesGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function updatePagination() {
    if (!elements.prevPageBtn || !elements.nextPageBtn) return;

    const hasPreviousPage = state.currentPage > 0;
    const hasNextPage = ((state.currentPage + 1) * state.pageSize) < state.filteredData.length;

    elements.prevPageBtn.classList.toggle('hidden', !hasPreviousPage);
    elements.nextPageBtn.classList.toggle('hidden', !hasNextPage);
    elements.prevPageBtn.disabled = !hasPreviousPage;
    elements.nextPageBtn.disabled = !hasNextPage;

    updateReadingProgress();
  }

  function updateReadingProgress() {
    if (!elements.readingProgress) return;

    const total = state.filteredData.length;
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

  function goToNextPage() {
    if (((state.currentPage + 1) * state.pageSize) >= state.filteredData.length) return;

    state.currentPage += 1;
    renderNames();
    scrollToResultsTop();
  }
  
  // Load Data - Lazy loading with chunks
  async function loadData() {
    try {
      elements.loadingState.classList.remove('hidden');
      elements.errorState.classList.add('hidden');
      
      // Load manifest first (tiny file)
      const manifestResponse = await fetch(getAssetUrl('/data_manifest.json'));
      if (!manifestResponse.ok) throw new Error('Failed to load manifest');
      
      const manifest = await manifestResponse.json();
      state.totalChunks = manifest.chunks;
      
      // Load only first chunk initially (fast!)
      await loadChunk(1);
      
      state.dataLoaded = true;
      renderNames();
      updateStats();
      
      elements.loadingState.classList.add('hidden');
      
      // Preload remaining chunks in background - Defer to avoid TBT
      // Wait for main thread to settle or user interaction
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => preloadRemainingChunks());
      } else {
        setTimeout(preloadRemainingChunks, 2000);
      }
      
    } catch (error) {
      showError(error.message);
      elements.loadingState.classList.add('hidden');
    }
  }
  
  // Load a specific chunk
  async function loadChunk(chunkNum) {
    if (state.loadedChunks.has(chunkNum)) return;
    
    try {
      const response = await fetch(getAssetUrl(`/data_chunk_${chunkNum}.json`));
      if (!response.ok) throw new Error(`Failed to load chunk ${chunkNum}`);
      
      const chunkData = await response.json();
      state.data = [...state.data, ...chunkData];
      state.filteredData = [...state.data];
      state.loadedChunks.add(chunkNum);
      
      console.log(`✅ Loaded chunk ${chunkNum}/${state.totalChunks} (${chunkData.length} names)`);
    } catch (error) {
      console.error(`Error loading chunk ${chunkNum}:`, error);
    }
  }
  
  // Preload remaining chunks in background (non-blocking)
  async function preloadRemainingChunks() {
    // Start chunk fetches in a staggered parallel fashion to avoid
    // blocking the main thread and to make better use of network.
    const preloadPromises = [];
    for (let i = 2; i <= state.totalChunks; i++) {
      // Stagger start times to avoid a burst of simultaneous requests
      const delay = (i - 2) * 120; // 120ms between starts
      const p = new Promise(resolve => {
        setTimeout(async () => {
          await loadChunk(i);
          // Update display occasionally while preloading
          if (state.dataLoaded && state.searchQuery === '') updateStats();
          resolve();
        }, delay);
      });
      preloadPromises.push(p);
    }

    await Promise.allSettled(preloadPromises);
    console.log('✅ All chunks loaded');
  }
  
  // Render Names - Optimized to reduce blocking time
  function renderNames() {
    try {
      const start = state.currentPage * state.pageSize;
      const end = start + state.pageSize;
      state.displayedData = state.filteredData.slice(start, end);
      
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
  
  function createNameCard(entry, index) {
    const card = document.createElement('div');
    card.className = 'name-card';
    card.style.animationDelay = `${(index % state.pageSize) * 0.05}s`;
    
    const isExpanded = state.expandedItems.has(entry.index);
    const name = state.language === 'english' ? (entry.english_name || '') : (entry.hindi_name || '');
    const oneLine = state.language === 'english' ? (entry.english_one_line || '') : (entry.hindi_one_line || '');
    const elaboration = state.language === 'english' ? (entry.english_elaboration || '') : (entry.hindi_elaboration || '');
    const detailMarkup = [oneLine ? `<p class="card-meaning">${oneLine}</p>` : '', elaboration ? `<div class="elaboration-copy">${elaboration}</div>` : '']
      .filter(Boolean)
      .join('');
    
    card.innerHTML = `
      <div class="card-header">
        <span class="card-index">#${entry.index}</span>
      </div>
      
      <h3 class="card-name">${name}</h3>

      <button class="toggle-btn" data-index="${entry.index}">
        <span>${isExpanded ? getTranslation(state.language, 'names.hideButton') : getTranslation(state.language, 'names.revealButton')}</span>
        <svg class="chevron ${isExpanded ? 'rotated' : ''}" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      
      <div class="elaboration ${isExpanded ? 'expanded' : ''}" data-index="${entry.index}">
        <div class="elaboration-content">${detailMarkup}</div>
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
    const span = toggleBtn.querySelector('span');
    
    if (state.expandedItems.has(index)) {
      elaboration.classList.add('expanded');
      chevron.classList.add('rotated');
      span.textContent = getTranslation(state.language, 'names.hideButton');
    } else {
      elaboration.classList.remove('expanded');
      chevron.classList.remove('rotated');
      span.textContent = getTranslation(state.language, 'names.revealButton');
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
  function handleSearchDebounced() {
    state.currentPage = 0;
    if (state.searchQuery) {
      setSearchPanelOpen(true, false);
    }
    // Do filtering and rendering — these are the heavier steps
    filterData();
    renderNames();
    updateStats();
  }
  
  function filterData() {
    if (!state.searchQuery) {
      state.filteredData = [...state.data];
      return;
    }
    
    state.filteredData = state.data.filter(entry => {
      const searchFields = [
        entry.english_name,
        entry.english_one_line,
        entry.english_elaboration,
        entry.hindi_name,
        entry.hindi_one_line,
        entry.hindi_elaboration,
        entry.index.toString()
      ];
      
      return searchFields.some(field => 
        field && field.toLowerCase().includes(state.searchQuery)
      );
    });
  }
  
  function handleLanguageChange(e) {
    state.language = e.target.value;
    
    // Save preference to localStorage (if available)
    setToStorage('preferredLanguage', state.language);
    
    // Sync pill buttons
    updateLanguagePillButtons();
    
    // Update SEO meta tags and UI text
    updateUIText();
    
    // Re-render name cards
    renderNames();
    
    // Notify navigation about language change (since storage event doesn't fire in same tab)
    if (window.updateNavigationText && typeof window.updateNavigationText === 'function') {
      window.updateNavigationText();
    }
    
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
    
    state.language = newLang;
    
    // Save preference to localStorage (if available)
    setToStorage('preferredLanguage', state.language);
    
    // Update pill buttons
    updateLanguagePillButtons();
    
    // Sync dropdown selector
    if (elements.languageSelect) {
      elements.languageSelect.value = state.language;
    }
    
    // Update all UI text
    updateUIText();
    
    // Re-render name cards
    renderNames();
    
    // Notify navigation about language change
    if (window.updateNavigationText && typeof window.updateNavigationText === 'function') {
      window.updateNavigationText();
    }
    
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
    elements.namesGrid.innerHTML = '';
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












