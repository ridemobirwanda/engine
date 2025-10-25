import { useEffect, useState } from 'react';
import { useWebsiteSettings } from '@/hooks/useWebsiteSettings';

export const CloudflareGoogleAdsFixed = () => {
  const { getSetting } = useWebsiteSettings();
  const [isLoaded, setIsLoaded] = useState(false);

  // Get Google Ads settings
  const adsEnabled = getSetting('google_ads_enabled', false);
  const adsCode = getSetting('google_ads_code', '');

  useEffect(() => {
    if (!adsEnabled || !adsCode || isLoaded) return;

    console.log('🚀 Loading Google Ads...');

    // Enhanced Google Ads loading with Cloudflare bypass
    const loadGoogleAds = () => {
      try {
        // Remove any existing Google Ads scripts
        const existingScripts = document.querySelectorAll('script[src*="googletagmanager"], script[src*="googleads"], script[src*="googlesyndication"]');
        existingScripts.forEach(script => script.remove());

        // Check if the ads code contains a script tag with src
        if (adsCode.includes('<script') && adsCode.includes('src=')) {
          // Extract script src from the ads code
          const srcMatch = adsCode.match(/src="([^"]+)"/);
          if (srcMatch && srcMatch[1]) {
            const scriptSrc = srcMatch[1];
            console.log('🚀 Loading Google Ads from src:', scriptSrc);
            
            // Create script element with src
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.defer = true;
            script.src = scriptSrc;
            script.crossOrigin = 'anonymous';
            
            // Add Cloudflare bypass attributes
            script.setAttribute('data-cfasync', 'false');
            script.setAttribute('data-cf-beacon', 'false');
            script.setAttribute('data-cf-settings', '{}');
            script.setAttribute('data-cf-challenge', 'false');
            
            // Add error handling
            script.onerror = (error) => {
              console.error('❌ Google Ads script failed to load:', error);
              // Try alternative loading method
              loadGoogleAdsAlternative();
            };
            
            script.onload = () => {
              console.log('✅ Google Ads script loaded successfully');
              setIsLoaded(true);
            };
            
            // Add to head
            document.head.appendChild(script);
          } else {
            // Fallback to inline script
            loadGoogleAdsAlternative();
          }
        } else {
          // Load as inline script
          loadGoogleAdsAlternative();
        }
      } catch (error) {
        console.error('❌ Google Ads loading failed:', error);
        loadGoogleAdsAlternative();
      }
    };

    // Alternative loading method for inline scripts
    const loadGoogleAdsAlternative = () => {
      try {
        console.log('🔄 Trying alternative Google Ads loading method...');
        
        // Create a new script element
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.defer = true;
        
        // Add bypass attributes
        script.setAttribute('data-cfasync', 'false');
        script.setAttribute('data-cf-beacon', 'false');
        script.setAttribute('data-cf-settings', '{}');
        script.setAttribute('data-cf-challenge', 'false');
        
        // Extract and clean the ads code
        const cleanAdsCode = adsCode
          .replace(/<script[^>]*>/gi, '')
          .replace(/<\/script>/gi, '')
          .trim();
        
        script.innerHTML = cleanAdsCode;
        
        // Add to head
        document.head.appendChild(script);
        console.log('✅ Google Ads script added (alternative method)');
        
        setIsLoaded(true);
      } catch (error) {
        console.error('❌ Alternative Google Ads loading failed:', error);
      }
    };

    // Load with a small delay to ensure DOM is ready
    const timeoutId = setTimeout(loadGoogleAds, 100);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
    };

  }, [adsEnabled, adsCode, isLoaded]);

  return null; // This component doesn't render anything
};

export default CloudflareGoogleAdsFixed;
