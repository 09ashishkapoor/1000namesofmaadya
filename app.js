/**
 * Ādya Mahākālī Sahasranāma - Pure Vanilla JS Application
 * Mobile-first, lightweight, fast
 */

(function() {
  'use strict';
  
  // State
  const state = {
    data: [],
    filteredData: [],
    displayedData: [],
    currentPage: 0,
    pageSize: 11,
    searchQuery: '',
    language: 'english',
    expandedItems: new Set(),
    theme: localStorage.getItem('theme') || 'dark',
    // Lazy loading
    loadedChunks: new Set(),
    totalChunks: 0,
    dataLoaded: false
  };
  
  // DOM Elements
  const elements = {};
  
  // Initialize
  function init() {
    cacheDOMElements();
    setupEventListeners();
    applyTheme(state.theme);
    loadData();
    console.log('✅ App initialized');
  }
  
  function cacheDOMElements() {
    elements.searchInput = document.getElementById('search-input');
    elements.languageSelect = document.getElementById('language-select');
    elements.clearBtn = document.getElementById('clear-btn');
    elements.themeToggle = document.getElementById('theme-toggle');
    elements.exploreBtn = document.getElementById('explore-btn');
    elements.namesGrid = document.getElementById('names-grid');
    elements.loadMoreBtn = document.getElementById('load-more-btn');
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

    elements.searchInput.addEventListener('input', (e) => {
      // update simple UI state immediately to improve input-to-next-paint
      state.searchQuery = e.target.value.toLowerCase().trim();
      updateClearButton();
      // run the heavier filtering/rendering on a short debounce
      debouncedFilter();
    });
    
    // Language
    elements.languageSelect.addEventListener('change', handleLanguageChange);
    
    // Clear
    elements.clearBtn.addEventListener('click', handleClear);
    
    // Theme
    elements.themeToggle.addEventListener('click', toggleTheme);
    
    // Explore button
    elements.exploreBtn.addEventListener('click', scrollToNames);
    
    // Load more
    elements.loadMoreBtn.addEventListener('click', loadMoreNames);
  }
  
  // Load Data - Lazy loading with chunks
  async function loadData() {
    try {
      elements.loadingState.classList.remove('hidden');
      elements.errorState.classList.add('hidden');
      
      // Load manifest first (tiny file)
      const manifestResponse = await fetch('data_manifest.json');
      if (!manifestResponse.ok) throw new Error('Failed to load manifest');
      
      const manifest = await manifestResponse.json();
      state.totalChunks = manifest.chunks;
      
      // Load only first chunk initially (fast!)
      await loadChunk(1);
      
      state.dataLoaded = true;
      renderNames();
      updateStats();
      
      elements.loadingState.classList.add('hidden');
      
      // Preload remaining chunks in background
      preloadRemainingChunks();
      
    } catch (error) {
      showError(error.message);
      elements.loadingState.classList.add('hidden');
    }
  }
  
  // Load a specific chunk
  async function loadChunk(chunkNum) {
    if (state.loadedChunks.has(chunkNum)) return;
    
    try {
      const response = await fetch(`data_chunk_${chunkNum}.json`);
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
      const start = 0;
      const end = (state.currentPage + 1) * state.pageSize;
      state.displayedData = state.filteredData.slice(start, end);
      
      elements.namesGrid.innerHTML = '';
      
      // Render in chunks to avoid blocking the main thread
      renderInChunks(state.displayedData, 0);
      
      // Show/hide load more button
      if (state.displayedData.length < state.filteredData.length) {
        elements.loadMoreBtn.classList.remove('hidden');
      } else {
        elements.loadMoreBtn.classList.add('hidden');
      }
    } catch (error) {
      console.error('Error rendering names:', error);
      throw error;
    }
  }
  
  // Render cards in chunks to prevent blocking
  function renderInChunks(data, startIndex, chunkSize = 10) {
    const endIndex = Math.min(startIndex + chunkSize, data.length);
    
    for (let i = startIndex; i < endIndex; i++) {
      const card = createNameCard(data[i], i);
      elements.namesGrid.appendChild(card);
    }
    
    if (endIndex < data.length) {
      // Use requestIdleCallback if available, otherwise setTimeout
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => renderInChunks(data, endIndex, chunkSize));
      } else {
        setTimeout(() => renderInChunks(data, endIndex, chunkSize), 0);
      }
    } else {
      // All cards rendered, animate them
      animateCards();
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
    
    card.innerHTML = `
      <div class="card-header">
        <span class="card-index">#${entry.index}</span>
      </div>
      
      <h3 class="card-name">${name}</h3>
      
      <p class="card-meaning">${oneLine}</p>
      
      <button class="toggle-btn" data-index="${entry.index}">
        <span>${isExpanded ? 'Hide' : 'Reveal'} Elaboration</span>
        <svg class="chevron ${isExpanded ? 'rotated' : ''}" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      
      <div class="elaboration ${isExpanded ? 'expanded' : ''}" data-index="${entry.index}">
        <div class="elaboration-content">${elaboration}</div>
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
      span.textContent = 'Hide Elaboration';
    } else {
      elaboration.classList.remove('expanded');
      chevron.classList.remove('rotated');
      span.textContent = 'Reveal Elaboration';
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
    renderNames();
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
  
  function loadMoreNames() {
    state.currentPage++;
    renderNames();
    
    // Smooth scroll to new content
    setTimeout(() => {
      const newCard = elements.namesGrid.querySelector(`.name-card:nth-child(${state.currentPage * state.pageSize + 1})`);
      if (newCard) {
        newCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }
  
  function updateStats() {
    const totalNames = state.data.length;
    const filteredCount = state.filteredData.length;
    
    if (state.searchQuery) {
      elements.statsDisplay.innerHTML = `
        🔍 Found <strong>${filteredCount}</strong> name${filteredCount !== 1 ? 's' : ''} 
        matching "<strong>${state.searchQuery}</strong>" 
        out of <strong>${totalNames}</strong> total names
      `;
    } else {
      elements.statsDisplay.innerHTML = `
        📿 Displaying the sacred <strong>${totalNames}</strong> names of <strong>Maa Ādya Mahākālī</strong>
      `;
    }
  }
  
  // Theme
  function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(state.theme);
    localStorage.setItem('theme', state.theme);
  }
  
  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    const sunIcon = elements.themeToggle.querySelector('.sun-icon');
    const moonIcon = elements.themeToggle.querySelector('.moon-icon');
    
    if (theme === 'dark') {
      sunIcon.classList.remove('hidden');
      moonIcon.classList.add('hidden');
    } else {
      sunIcon.classList.add('hidden');
      moonIcon.classList.remove('hidden');
    }
  }
  
  // Navigation
  function scrollToNames() {
    const namesSection = document.getElementById('names-section');
    if (namesSection) {
      namesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
