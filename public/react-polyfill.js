// React Polyfill for Cloudflare Pages - Simplified
(function() {
  'use strict';
  
  console.log('React polyfill loaded successfully');
  
  // Simple React polyfill without complex overrides
  if (typeof window !== 'undefined') {
    // Create React namespace if it doesn't exist
    if (!window.React) {
      window.React = {};
    }
    
    // Simple useLayoutEffect polyfill
    if (!window.React.useLayoutEffect) {
      window.React.useLayoutEffect = function(effect, deps) {
        // Use setTimeout to simulate useLayoutEffect in SSR
        setTimeout(effect, 0);
      };
    }
    
    // Simple useEffect polyfill
    if (!window.React.useEffect) {
      window.React.useEffect = function(effect, deps) {
        setTimeout(effect, 0);
      };
    }
    
    // Simple useState polyfill
    if (!window.React.useState) {
      window.React.useState = function(initialState) {
        return [initialState, function() {}];
      };
    }
    
    // Simple createElement polyfill
    if (!window.React.createElement) {
      window.React.createElement = function(type, props, ...children) {
        return { type, props: { ...props, children } };
      };
    }
    
    console.log('React polyfill loaded successfully');
  }
  
})();
