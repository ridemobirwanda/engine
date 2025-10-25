import { useEffect } from 'react';
import { useWebsiteSettings } from '@/hooks/useWebsiteSettings';

export const GoogleAds = () => {
  const { getSetting } = useWebsiteSettings();

  // Get Google Ads settings
  const adsEnabled = getSetting('google_ads_enabled', false);
  const adsCode = getSetting('google_ads_code', '');

  useEffect(() => {
    if (!adsEnabled || !adsCode) return;

    // Create a script element for the Google Ads code
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = adsCode;
    script.async = true;
    
    // Add to head
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [adsEnabled, adsCode]);

  return null; // This component doesn't render anything
};

export default GoogleAds;
