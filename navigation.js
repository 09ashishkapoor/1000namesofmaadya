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
    
    console.log('✅ Navigation system initialized');
  }
  
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
    upButton.setAttribute('aria-label', 'Back to top');
    upButton.setAttribute('title', 'Back to landing page');
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
    downButton.setAttribute('aria-label', 'Go to names');
    downButton.setAttribute('title', 'Explore sacred names');
    downButton.onclick = scrollToNames;
    
    // Add to body
    document.body.appendChild(upButton);
    document.body.appendChild(downButton);
  }
  
  function setupScrollDetection() {
    let ticking = false;
    
    function updateNavigation() {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Try to find the names section (React renders it dynamically)
      const namesSection = document.getElementById('names-section');
      
      if (!namesSection) {
        // If section not found yet, check again soon
        setTimeout(updateNavigation, 500);
        return;
      }
      
      const namesSectionTop = namesSection.offsetTop;
      const upButton = document.getElementById('nav-up-button');
      const downButton = document.getElementById('nav-down-button');
      
      if (!upButton || !downButton) return;
      
      // Determine which button to show
      const threshold = namesSectionTop - (windowHeight * 0.3);
      const inNamesSection = scrollPosition > threshold;
      
      if (inNamesSection) {
        // Show UP button (red)
        upButton.classList.remove('hidden');
        downButton.classList.add('hidden');
      } else {
        // Show DOWN button (orange)
        upButton.classList.add('hidden');
        downButton.classList.remove('hidden');
      }
      
      ticking = false;
    }
    
    function requestUpdate() {
      if (!ticking) {
        window.requestAnimationFrame(updateNavigation);
        ticking = true;
      }
    }
    
    // Listen to scroll events
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
    
    // Initial update
    setTimeout(updateNavigation, 100);
    setTimeout(updateNavigation, 1000);
    setTimeout(updateNavigation, 2000);
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
