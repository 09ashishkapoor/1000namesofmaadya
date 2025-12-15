/**
 * Vanilla JS Mobile Navigation for Kalabhairava Sahasranama
 * Pure JavaScript - no dependencies, no framework issues
 */

(function() {
  'use strict';
  
  // Wait for DOM to be ready
  function init() {
    // Create navigation buttons
    createNavigationButtons();
    
    // Set up scroll detection
    setupScrollDetection();
    
    // Listen for language changes
    window.addEventListener('storage', updateNavigationText);
    
    console.log('✅ Navigation system initialized');
  }
  
  // Update navigation button text when language changes
  function updateNavigationText() {
    const lang = localStorage.getItem('preferredLanguage') || 'english';
    const upButton = document.getElementById('nav-up-button');
    const downButton = document.getElementById('nav-down-button');
    
    if (upButton && typeof getTranslation === 'function') {
      upButton.setAttribute('aria-label', getTranslation(lang, 'navigation.backToTop'));
      upButton.setAttribute('title', getTranslation(lang, 'navigation.backToTopTitle'));
    }
    
    if (downButton && typeof getTranslation === 'function') {
      downButton.setAttribute('aria-label', getTranslation(lang, 'navigation.goToNames'));
      downButton.setAttribute('title', getTranslation(lang, 'navigation.goToNamesTitle'));
    }
  }
  
  // Expose updateNavigationText globally for cross-script communication
  window.updateNavigationText = updateNavigationText;
  
  function createNavigationButtons() {
    // Create UP arrow button
    const upButton = document.createElement('button');
    upButton.id = 'nav-up-button';
    upButton.className = 'nav-button nav-up hidden';
    upButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
      </svg>
    `;
    upButton.setAttribute('aria-label', getTranslation(localStorage.getItem('preferredLanguage') || 'english', 'navigation.backToTop'));
    upButton.setAttribute('title', getTranslation(localStorage.getItem('preferredLanguage') || 'english', 'navigation.backToTopTitle'));
    upButton.onclick = scrollToTop;
    
    // Create DOWN arrow button
    const downButton = document.createElement('button');
    downButton.id = 'nav-down-button';
    downButton.className = 'nav-button nav-down';
    downButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <polyline points="19 12 12 19 5 12"></polyline>
      </svg>
    `;
    downButton.setAttribute('aria-label', getTranslation(localStorage.getItem('preferredLanguage') || 'english', 'navigation.goToNames'));
    downButton.setAttribute('title', getTranslation(localStorage.getItem('preferredLanguage') || 'english', 'navigation.goToNamesTitle'));
    downButton.onclick = scrollToNames;
    
    // Add to body
    document.body.appendChild(upButton);
    document.body.appendChild(downButton);
  }
  
  function setupScrollDetection() {
    let ticking = false;
    let namesSection = document.getElementById('names-section');
    const upButton = document.getElementById('nav-up-button');
    const downButton = document.getElementById('nav-down-button');

    // If buttons aren't present yet, bail — they should exist after createNavigationButtons
    if (!upButton || !downButton) return;

    // Cache measured position. Recomputed on resize or when DOM changes.
    let namesSectionTop = null;
    let lastState = null; // track previous inNamesSection state to avoid redundant writes

    function computeNamesTop() {
      namesSection = document.getElementById('names-section');
      if (!namesSection) return null;
      // Optimization: Use offsetTop which causes less layout thrashing than getBoundingClientRect
      // when just needing the top position relative to the document
      let el = namesSection;
      let top = 0;
      while (el) {
        top += el.offsetTop;
        el = el.offsetParent;
      }
      namesSectionTop = top;
      return namesSectionTop;
    }

    // Debounced resize handler to recompute the top value
    let resizeTimer = null;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        computeNamesTop();
        // Force an immediate update after recomputing
        requestUpdate();
      }, 120);
    }

    function updateNavigation() {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      // If we haven't measured yet, attempt to compute. If still missing, try again later.
      if (namesSectionTop === null) {
        if (computeNamesTop() === null) {
          // Section not in DOM yet; retry later but not on every scroll.
          setTimeout(requestUpdate, 500);
          ticking = false;
          return;
        }
      }

      // Determine which button to show using the cached measurement
      const threshold = namesSectionTop - (windowHeight * 0.3);
      const inNamesSection = scrollPosition > threshold;

      // Only modify classlist when state changes to avoid unnecessary style recalcs
      if (inNamesSection !== lastState) {
        if (inNamesSection) {
          upButton.classList.remove('hidden');
          downButton.classList.add('hidden');
        } else {
          upButton.classList.add('hidden');
          downButton.classList.remove('hidden');
        }
        lastState = inNamesSection;
      }

      ticking = false;
    }

    function requestUpdate() {
      if (!ticking) {
        window.requestAnimationFrame(updateNavigation);
        ticking = true;
      }
    }

    // Listen to scroll and resize
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    // Initial measure & update
    computeNamesTop();
    requestUpdate();
  }
  
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  
  function scrollToNames() {
    const namesSection = document.getElementById('names-section');
    if (namesSection) {
      namesSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
