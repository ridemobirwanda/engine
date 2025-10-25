import { useEffect, useState } from 'react';
import { useWebsiteSettings } from '@/hooks/useWebsiteSettings';

interface AdManagerProps {
  position: 'header' | 'sidebar' | 'footer' | 'content' | 'mobile';
  size?: 'small' | 'medium' | 'large' | 'responsive';
  className?: string;
}

export const AdManager = ({ position, size = 'medium', className = '' }: AdManagerProps) => {
  const { getSetting } = useWebsiteSettings();
  const [adContent, setAdContent] = useState<string>('');

  // Get ad settings from admin panel
  const adsEnabled = getSetting('ads_enabled', false);
  const googleAdsenseEnabled = getSetting('google_adsense_enabled', false);
  const googleAdsenseId = getSetting('google_adsense_id', '');
  const directAdsEnabled = getSetting('direct_ads_enabled', false);

  // Get specific ad content for this position
  const adCode = getSetting(`ad_${position}`, '');
  const adType = getSetting(`ad_${position}_type`, 'adsense');

  // Ad size configurations
  const adSizes = {
    small: { width: '320px', height: '100px' },
    medium: { width: '336px', height: '280px' },
    large: { width: '728px', height: '90px' },
    responsive: { width: '100%', height: 'auto' }
  };

  const adSize = adSizes[size];

  useEffect(() => {
    if (!adsEnabled) return;

    if (adType === 'adsense' && googleAdsenseEnabled && googleAdsenseId) {
      loadGoogleAdsense();
    } else if (adType === 'direct' && directAdsEnabled && adCode) {
      setAdContent(adCode);
    } else if (adType === 'custom' && adCode) {
      setAdContent(adCode);
    }
  }, [adsEnabled, googleAdsenseEnabled, directAdsEnabled, adCode, adType, position]);

  const loadGoogleAdsense = () => {
    // Create AdSense ad unit
    const adsenseCode = `
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="${googleAdsenseId}"
           data-ad-slot="${getSetting(`ad_${position}_slot`, '')}"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
      <script>
           (adsbygoogle = window.adsbygoogle || []).push({});
      </script>
    `;
    setAdContent(adsenseCode);
  };

  // Don't render if ads are disabled
  if (!adsEnabled) return null;

  // Don't render if no ad content
  if (!adContent && adType !== 'placeholder') return null;

  // Render compact placeholder for development/testing
  if (!adContent || adType === 'placeholder') {
    return (
      <div 
        className={`ad-placeholder border border-dashed border-gray-200 bg-gray-50/50 flex items-center justify-center ${className}`}
        style={{ 
          width: size === 'large' ? '100%' : adSize.width, 
          height: size === 'large' ? '60px' : size === 'small' ? '50px' : adSize.height,
          minHeight: size === 'responsive' ? '80px' : undefined,
          maxWidth: '100%'
        }}
      >
        <div className="text-center p-2">
          <div className="text-gray-400 text-xs">
            Ad Space ({position})
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`ad-container ${className}`}
      style={{ 
        width: size === 'large' ? '100%' : adSize.width, 
        height: size === 'responsive' ? 'auto' : adSize.height,
        maxWidth: '100%'
      }}
    >
      <div 
        dangerouslySetInnerHTML={{ __html: adContent }}
        className="ad-content"
      />
      
      {/* Compact ad label for transparency */}
      <div className="text-xs text-gray-400 text-center mt-1 opacity-60">
        Ad
      </div>
    </div>
  );
};

export default AdManager;
