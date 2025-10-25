import { useEffect, useState } from 'react';
import { useWebsiteSettings } from '@/hooks/useWebsiteSettings';

export const GoogleAdsUnified = () => {
  const { getSetting } = useWebsiteSettings();
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<string>('Initializing...');

  // Get Google Ads settings
  const adsEnabled = getSetting('google_ads_enabled', false);
  const adsCode = getSetting('google_ads_code', '');

  useEffect(() => {
    if (!adsEnabled || !adsCode || isLoaded) {
      if (!adsEnabled) {
        setLoadingStatus('Google Ads disabled');
      } else if (!adsCode) {
        setLoadingStatus('No Google Ads code provided');
      }
      return;
    }

    console.log('🚀 Loading Google Ads...');
    setLoadingStatus('Loading Google Ads...');

    // Clean up any existing Google Ads scripts to prevent conflicts
    const existingScripts = document.querySelectorAll('script[src*="googlesyndication"], script[src*="googleads"], script[src*="googletagmanager"]');
    existingScripts.forEach(script => {
      console.log('🧹 Removing existing Google Ads script:', script.src || 'inline');
      script.remove();
    });

    const loadGoogleAds = () => {
      try {
        // Check if the ads code contains a script tag with src (external script)
        if (adsCode.includes('<script') && adsCode.includes('src=')) {
          loadExternalScript();
        } else {
          // Handle inline script code
          loadInlineScript();
        }
      } catch (error) {
        console.error('❌ Google Ads loading failed:', error);
        setLoadingStatus('❌ Google Ads loading failed');
      }
    };

    const loadExternalScript = () => {
      // Extract script src from the ads code
      const srcMatch = adsCode.match(/src="([^"]+)"/);
      if (srcMatch && srcMatch[1]) {
        const scriptSrc = srcMatch[1];
        console.log('🚀 Loading Google Ads from external source:', scriptSrc);
        setLoadingStatus('Loading external Google Ads script...');
        
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
        
        // Add event listeners
        script.onload = () => {
          console.log('✅ Google Ads external script loaded successfully');
          setLoadingStatus('✅ Google Ads script loaded');
          
          // Initialize adsbygoogle if not already present
          if (typeof window !== 'undefined') {
            if (!(window as any).adsbygoogle) {
              (window as any).adsbygoogle = [];
              console.log('🔧 Initialized adsbygoogle array');
            }
            
            // Try to push a test command to verify it's working
            try {
              (window as any).adsbygoogle = (window as any).adsbygoogle || [];
              console.log('✅ adsbygoogle array is ready');
              setLoadingStatus('✅ Google Ads ready');
              setIsLoaded(true);
              // Dispatch a custom event to notify other components
              window.dispatchEvent(new Event('adsbygoogle-ready'));
            } catch (error) {
              console.warn('⚠️ adsbygoogle initialization issue:', error);
              setLoadingStatus('⚠️ Google Ads loaded but may have issues');
              setIsLoaded(true);
            }
          }
        };

        script.onerror = (error) => {
          console.error('❌ Google Ads script failed to load (CORS/blocked):', error);
          setLoadingStatus('❌ Google Ads blocked - ad blocker or CORS issue');
          // Try fallback method for graceful degradation
          console.log('🔄 Attempting fallback inline script method...');
          loadInlineScript();
        };
        
        // Add to head
        document.head.appendChild(script);
      } else {
        console.warn('⚠️ Could not extract script src, falling back to inline');
        loadInlineScript();
      }
    };

    const loadInlineScript = () => {
      console.log('🔄 Loading Google Ads as inline script...');
      setLoadingStatus('Loading inline Google Ads script...');
      
      // Create a new script element for inline code
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.defer = true;
      
      // Add Cloudflare bypass attributes
      script.setAttribute('data-cfasync', 'false');
      script.setAttribute('data-cf-beacon', 'false');
      script.setAttribute('data-cf-settings', '{}');
      script.setAttribute('data-cf-challenge', 'false');
      
      // Extract and clean the ads code (remove script tags if present)
      const cleanAdsCode = adsCode
        .replace(/<script[^>]*>/gi, '')
        .replace(/<\/script>/gi, '')
        .trim();
      
      script.innerHTML = cleanAdsCode;
      
      // Add to head
      document.head.appendChild(script);
      console.log('✅ Google Ads inline script added successfully');
      setLoadingStatus('✅ Google Ads inline script loaded');
      setIsLoaded(true);
    };

    // Load with a small delay to ensure DOM is ready
    const timeoutId = setTimeout(loadGoogleAds, 100);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
    };

  }, [adsEnabled, adsCode, isLoaded]);

  // This component doesn't render anything visible
  return null;
};

export default GoogleAdsUnified;
