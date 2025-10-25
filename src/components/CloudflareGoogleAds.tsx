import { useEffect } from 'react';
import { useWebsiteSettings } from '@/hooks/useWebsiteSettings';

export const CloudflareGoogleAds = () => {
  const { getSetting } = useWebsiteSettings();

  // Get Google Ads settings
  const adsEnabled = getSetting('google_ads_enabled', false);
  const adsCode = getSetting('google_ads_code', '');

  useEffect(() => {
    if (!adsEnabled || !adsCode) return;

    // Method 1: Load Google Ads script with Cloudflare bypass
    const loadGoogleAdsWithBypass = () => {
      try {
        // Create a script element with specific attributes to bypass Cloudflare
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.defer = true;
        
        // Add Cloudflare bypass attributes
        script.setAttribute('data-cfasync', 'false');
        script.setAttribute('data-cf-beacon', 'false');
        
        // Use a different approach - inject the code directly
        const adsCodeContent = adsCode.replace(/<script[^>]*>|<\/script>/g, '');
        script.innerHTML = adsCodeContent;
        
        // Add to head with delay to bypass Cloudflare
        setTimeout(() => {
          document.head.appendChild(script);
        }, 100);

        // Alternative method: Use fetch to load the script
        const loadViaFetch = async () => {
          try {
            // Create a blob with the ads code
            const blob = new Blob([adsCode], { type: 'text/javascript' });
            const url = URL.createObjectURL(blob);
            
            // Load via dynamic import
            const module = await import(/* @vite-ignore */ url);
            
            // Clean up
            URL.revokeObjectURL(url);
          } catch (error) {
            console.log('Fetch method failed, using direct injection');
          }
        };

        // Try fetch method as backup
        loadViaFetch();

      } catch (error) {
        console.error('Google Ads loading error:', error);
      }
    };

    // Method 2: Use postMessage to bypass Cloudflare
    const loadViaPostMessage = () => {
      try {
        // Create an iframe to bypass Cloudflare restrictions
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = 'about:blank';
        document.body.appendChild(iframe);

        // Send the ads code via postMessage
        iframe.contentWindow?.postMessage({
          type: 'GOOGLE_ADS_CODE',
          code: adsCode
        }, '*');

        // Listen for response
        window.addEventListener('message', (event) => {
          if (event.data.type === 'GOOGLE_ADS_LOADED') {
            console.log('Google Ads loaded via postMessage');
          }
        });

        // Clean up iframe after loading
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 5000);

      } catch (error) {
        console.error('PostMessage method failed:', error);
      }
    };

    // Method 3: Use Web Workers to bypass Cloudflare
    const loadViaWebWorker = () => {
      try {
        const workerCode = `
          self.onmessage = function(e) {
            if (e.data.type === 'LOAD_GOOGLE_ADS') {
              try {
                // Execute the ads code in worker context
                eval(e.data.code);
                self.postMessage({ type: 'ADS_LOADED' });
              } catch (error) {
                self.postMessage({ type: 'ADS_ERROR', error: error.message });
              }
            }
          }
        `;

        const blob = new Blob([workerCode], { type: 'application/javascript' });
        const worker = new Worker(URL.createObjectURL(blob));

        worker.postMessage({
          type: 'LOAD_GOOGLE_ADS',
          code: adsCode
        });

        worker.onmessage = (e) => {
          if (e.data.type === 'ADS_LOADED') {
            console.log('Google Ads loaded via Web Worker');
          }
        };

        // Clean up worker
        setTimeout(() => {
          worker.terminate();
          URL.revokeObjectURL(blob);
        }, 10000);

      } catch (error) {
        console.error('Web Worker method failed:', error);
      }
    };

    // Method 4: Use Service Worker to bypass Cloudflare
    const loadViaServiceWorker = async () => {
      try {
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.register('/sw-ads.js');
          
          // Send ads code to service worker
          navigator.serviceWorker.controller?.postMessage({
            type: 'LOAD_GOOGLE_ADS',
            code: adsCode
          });
        }
      } catch (error) {
        console.error('Service Worker method failed:', error);
      }
    };

    // Try multiple methods with fallback
    const tryLoadAds = () => {
      // Method 1: Direct injection with bypass attributes
      loadGoogleAdsWithBypass();
      
      // Method 2: PostMessage (fallback)
      setTimeout(() => loadViaPostMessage(), 500);
      
      // Method 3: Web Worker (fallback)
      setTimeout(() => loadViaWebWorker(), 1000);
      
      // Method 4: Service Worker (fallback)
      setTimeout(() => loadViaServiceWorker(), 1500);
    };

    // Start loading with delay to bypass Cloudflare
    setTimeout(tryLoadAds, 200);

    // Cleanup function
    return () => {
      // Remove any added scripts
      const scripts = document.querySelectorAll('script[data-cfasync="false"]');
      scripts.forEach(script => script.remove());
    };

  }, [adsEnabled, adsCode]);

  return null; // This component doesn't render anything
};

export default CloudflareGoogleAds;

