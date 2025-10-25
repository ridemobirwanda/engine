import { useEffect } from 'react';

export const GoogleAdsInitializer = () => {
  useEffect(() => {
    // Initialize adsbygoogle array if it doesn't exist
    if (typeof window !== 'undefined') {
      // Ensure adsbygoogle is available
      if (!(window as any).adsbygoogle) {
        (window as any).adsbygoogle = [];
        console.log('🔧 GoogleAdsInitializer: Created adsbygoogle array');
      }

      // Add a small delay to ensure the script has time to load
      const initTimer = setTimeout(() => {
        if ((window as any).adsbygoogle && Array.isArray((window as any).adsbygoogle)) {
          console.log('✅ GoogleAdsInitializer: adsbygoogle is ready');
          
          // Dispatch a custom event to notify other components
          window.dispatchEvent(new CustomEvent('adsbygoogle-ready', {
            detail: { adsbygoogle: (window as any).adsbygoogle }
          }));
        }
      }, 2000);

      return () => clearTimeout(initTimer);
    }
  }, []);

  return null;
};

export default GoogleAdsInitializer;
