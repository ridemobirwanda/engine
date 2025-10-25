// Service Worker for Google Ads Cloudflare Bypass
self.addEventListener('message', (event) => {
  if (event.data.type === 'LOAD_GOOGLE_ADS') {
    try {
      // Execute Google Ads code in service worker context
      // This bypasses Cloudflare restrictions
      const adsCode = event.data.code;
      
      // Create a new script context
      const scriptContext = new Function(adsCode);
      scriptContext();
      
      // Notify that ads are loaded
      self.postMessage({ type: 'ADS_LOADED' });
      
    } catch (error) {
      console.error('Service Worker Google Ads Error:', error);
      self.postMessage({ type: 'ADS_ERROR', error: error.message });
    }
  }
});

// Handle fetch events to bypass Cloudflare
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Bypass Cloudflare for Google Ads domains
  if (url.hostname.includes('googleads') || 
      url.hostname.includes('googletagmanager') ||
      url.hostname.includes('google-analytics')) {
    
    // Create a new request with bypass headers
    const newRequest = new Request(event.request, {
      headers: {
        ...event.request.headers,
        'CF-Cache-Status': 'BYPASS',
        'CF-Ray': '',
        'User-Agent': 'Mozilla/5.0 (compatible; GoogleAds/1.0)'
      }
    });
    
    event.respondWith(fetch(newRequest));
  }
});

