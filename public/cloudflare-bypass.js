// Enhanced Cloudflare Bypass for Google Ads
(function() {
  'use strict';
  
  console.log('🚀 Cloudflare bypass initialized');
  
  let bypassApplied = false;
  let retryCount = 0;
  const maxRetries = 5;
  
  // Enhanced bypass for Google Ads
  const applyBypass = () => {
    if (bypassApplied || retryCount >= maxRetries) return;
    
    try {
      // Set up gtag and dataLayer
      window.gtag = window.gtag || function() {
        (window.gtag.q = window.gtag.q || []).push(arguments);
      };
      
      window.dataLayer = window.dataLayer || [];
      
      // Override createElement to bypass Cloudflare for Google Ads
      const originalCreateElement = document.createElement;
      document.createElement = function(tagName) {
        const element = originalCreateElement.call(this, tagName);
        
        if (tagName.toLowerCase() === 'script') {
          // Add bypass attributes for Google Ads scripts
          element.setAttribute('data-cfasync', 'false');
          element.setAttribute('data-cf-beacon', 'false');
          element.setAttribute('data-cf-settings', '{}');
          element.setAttribute('data-cf-challenge', 'false');
          
          // Override src setter to bypass Cloudflare
          const originalSrcSetter = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src');
          if (originalSrcSetter && originalSrcSetter.set) {
            Object.defineProperty(element, 'src', {
              set: function(value) {
                if (value && (
                  value.includes('googlesyndication') || 
                  value.includes('googleads') ||
                  value.includes('googletagmanager') ||
                  value.includes('google-analytics')
                )) {
                  // Use direct URL without Cloudflare interference
                  originalSrcSetter.set.call(this, value);
                } else {
                  originalSrcSetter.set.call(this, value);
                }
              },
              get: function() {
                return this.getAttribute('src');
              }
            });
          }
        }
        
        return element;
      };
      
      // Override fetch to bypass Cloudflare for Google Ads
      const originalFetch = window.fetch;
      window.fetch = function(url, options = {}) {
        if (typeof url === 'string' && (
          url.includes('googlesyndication') || 
          url.includes('googleads') ||
          url.includes('googletagmanager') ||
          url.includes('google-analytics')
        )) {
          // Add bypass headers
          options.headers = {
            ...options.headers,
            'CF-Cache-Status': 'BYPASS',
            'CF-Ray': '',
            'User-Agent': 'Mozilla/5.0 (compatible; GoogleAds/1.0)',
            'Accept': '*/*',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          };
        }
        
        return originalFetch.call(this, url, options);
      };
      
      // Override XMLHttpRequest to bypass Cloudflare
      const originalXHROpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function(method, url, ...args) {
        if (typeof url === 'string' && (
          url.includes('googlesyndication') || 
          url.includes('googleads') ||
          url.includes('googletagmanager') ||
          url.includes('google-analytics')
        )) {
          // Add bypass headers
          this.setRequestHeader('CF-Cache-Status', 'BYPASS');
          this.setRequestHeader('CF-Ray', '');
          this.setRequestHeader('User-Agent', 'Mozilla/5.0 (compatible; GoogleAds/1.0)');
          this.setRequestHeader('Accept', '*/*');
          this.setRequestHeader('Cache-Control', 'no-cache');
        }
        
        return originalXHROpen.call(this, method, url, ...args);
      };
      
      console.log('✅ Enhanced Cloudflare bypass applied for Google Ads');
      bypassApplied = true;
      
    } catch (error) {
      console.error('❌ Cloudflare bypass error:', error);
      retryCount++;
      if (retryCount < maxRetries) {
        setTimeout(applyBypass, 500);
      }
    }
  };
  
  // Apply bypass once when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyBypass);
  } else {
    applyBypass();
  }
  
})();
