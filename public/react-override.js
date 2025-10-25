// React Override for Cloudflare Pages - Fixed Version
(function() {
  'use strict';
  
  console.log('React override loaded successfully');
  
  let overrideApplied = false;
  let retryCount = 0;
  const maxRetries = 10;
  
  // Simple React override without infinite loops
  const applyReactOverride = () => {
    if (overrideApplied || retryCount >= maxRetries) return;
    
    try {
      // Override useLayoutEffect globally
      if (typeof window !== 'undefined') {
        // Create a safe useLayoutEffect that falls back to useEffect
        window.useLayoutEffect = window.useLayoutEffect || function(effect, deps) {
          if (typeof window !== 'undefined' && window.React && window.React.useEffect) {
            return window.React.useEffect(effect, deps);
          }
          // Fallback to setTimeout for SSR
          setTimeout(effect, 0);
        };
        
        // Override React if available
        if (window.React && window.React.useLayoutEffect) {
          const originalUseLayoutEffect = window.React.useLayoutEffect;
          window.React.useLayoutEffect = function(effect, deps) {
            if (typeof window !== 'undefined' && window.React.useEffect) {
              return window.React.useEffect(effect, deps);
            }
            return originalUseLayoutEffect ? originalUseLayoutEffect(effect, deps) : effect();
          };
        }
        
        console.log('React useLayoutEffect override applied');
        overrideApplied = true;
      }
    } catch (error) {
      console.error('React override error:', error);
      retryCount++;
      if (retryCount < maxRetries) {
        setTimeout(applyReactOverride, 200);
      }
    }
  };
  
  // Apply override once when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyReactOverride);
  } else {
    applyReactOverride();
  }
  
})();
