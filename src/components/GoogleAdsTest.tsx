import { useEffect, useState } from 'react';
import { useWebsiteSettings } from '@/hooks/useWebsiteSettings';

export const GoogleAdsTest = () => {
  const { getSetting } = useWebsiteSettings();
  const [loadingStatus, setLoadingStatus] = useState<string>('Initializing...');
  const [adsLoaded, setAdsLoaded] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  const adsEnabled = getSetting('google_ads_enabled', false);
  const adsCode = getSetting('google_ads_code', '');

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    if (!adsEnabled || !adsCode) {
      setLoadingStatus('Google Ads not enabled or no code provided');
      return;
    }

    console.log('🧪 Testing Google Ads integration...');
    setLoadingStatus('Testing Google Ads integration...');
    addTestResult('Starting Google Ads test');

    // Listen for the adsbygoogle-ready event
    const handleAdsByGoogleReady = () => {
      console.log('✅ Received adsbygoogle-ready event');
      setLoadingStatus('✅ Google Ads is working properly');
      setAdsLoaded(true);
      addTestResult('✅ adsbygoogle object is available - Google Ads is working!');
      
      const adsArray = (window as any).adsbygoogle;
      if (Array.isArray(adsArray)) {
        addTestResult(`adsbygoogle array length: ${adsArray.length}`);
      }
    };

    window.addEventListener('adsbygoogle-ready', handleAdsByGoogleReady);

    // Test Google Ads integration
    const testGoogleAds = () => {
      try {
        addTestResult('Checking for existing Google Ads scripts...');
        
        // Check if Google Ads scripts are already loaded
        const existingScripts = document.querySelectorAll('script[src*="googlesyndication"], script[src*="googleads"]');
        if (existingScripts.length > 0) {
          addTestResult(`Found ${existingScripts.length} existing Google Ads script(s)`);
          existingScripts.forEach((script, index) => {
            const src = (script as HTMLScriptElement).src || 'inline script';
            addTestResult(`Script ${index + 1}: ${src}`);
          });
        } else {
          addTestResult('No existing Google Ads scripts found');
        }

        // Check if adsbygoogle is available with timeout and better detection
        let checkCount = 0;
        const maxChecks = 30; // 30 seconds max
        
        const checkAdsByGoogle = () => {
          checkCount++;
          
          // Check multiple ways adsbygoogle might be available
          const hasAdsByGoogle = typeof window !== 'undefined' && (
            (window as any).adsbygoogle || 
            (window as any).googletag || 
            document.querySelector('ins.adsbygoogle')
          );
          
          if (hasAdsByGoogle) {
            console.log('✅ Google Ads components detected');
            setLoadingStatus('✅ Google Ads components detected');
            setAdsLoaded(true);
            
            if ((window as any).adsbygoogle) {
              addTestResult('✅ adsbygoogle object is available - Google Ads is working!');
              const adsArray = (window as any).adsbygoogle;
              if (Array.isArray(adsArray)) {
                addTestResult(`adsbygoogle array length: ${adsArray.length}`);
              }
            }
            
            if ((window as any).googletag) {
              addTestResult('✅ googletag object is available');
            }
            
            const adsElements = document.querySelectorAll('ins.adsbygoogle');
            if (adsElements.length > 0) {
              addTestResult(`✅ Found ${adsElements.length} ad slot(s) on page`);
            }
            
            return;
          }
          
          if (checkCount >= maxChecks) {
            addTestResult('❌ Timeout: adsbygoogle not available after 30 seconds');
            addTestResult('🔍 This might indicate:');
            addTestResult('   • Ad blocker is blocking Google Ads');
            addTestResult('   • Network connectivity issues');
            addTestResult('   • Content Security Policy blocking scripts');
            addTestResult('   • Cloudflare or firewall blocking requests');
            setLoadingStatus('❌ Google Ads script timeout - check console for details');
            
            // Additional debugging
            addTestResult('🔧 Debug info:');
            addTestResult(`   • Script elements found: ${existingScripts.length}`);
            addTestResult(`   • Window.adsbygoogle: ${typeof (window as any).adsbygoogle}`);
            addTestResult(`   • Window.googletag: ${typeof (window as any).googletag}`);
            
            return;
          }
          
          if (checkCount % 5 === 0) {
            addTestResult(`⏳ Still waiting for adsbygoogle... (${checkCount}/${maxChecks})`);
          } else {
            addTestResult('⏳ adsbygoogle not yet available, checking again...');
          }
          
          setTimeout(checkAdsByGoogle, 1000);
        };

        // Check network requests
        addTestResult('Checking network requests...');
        
        // Monitor network requests for Google Ads
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
          const url = args[0]?.toString() || '';
          if (url.includes('googlesyndication') || url.includes('googleads')) {
            addTestResult(`Network request detected: ${url}`);
          }
          return originalFetch.apply(this, args);
        };

        // Start checking
        setTimeout(checkAdsByGoogle, 1000);

        // Test the provided Google Ads code
        if (adsCode.includes('ca-pub-3802811303973258')) {
          addTestResult('✅ Found Google Ads publisher ID: ca-pub-3802811303973258');
          setLoadingStatus('Google Ads publisher ID detected');
        }

        if (adsCode.includes('googlesyndication.com')) {
          addTestResult('✅ Found Google Ads domain: googlesyndication.com');
        }

      } catch (error) {
        console.error('❌ Error testing Google Ads:', error);
        setLoadingStatus('❌ Error testing Google Ads');
        addTestResult(`❌ Test error: ${error}`);
      }
    };

    // Start the test
    testGoogleAds();

    // Cleanup function
    return () => {
      window.removeEventListener('adsbygoogle-ready', handleAdsByGoogleReady);
    };

  }, [adsEnabled, adsCode]);

  if (!adsEnabled) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-800">Google Ads Test</h3>
        <p className="text-yellow-700">Google Ads is not enabled in admin settings.</p>
      </div>
    );
  }

  if (!adsCode) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-800">Google Ads Test</h3>
        <p className="text-yellow-700">No Google Ads code provided in admin settings.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="font-semibold text-blue-800 mb-2">Google Ads Test Status</h3>
      <p className="text-blue-700 mb-2">{loadingStatus}</p>
      
      {adsLoaded && (
        <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded">
          <p className="text-green-800 text-sm">
            ✅ Google Ads is loaded and ready! Check the browser console for detailed logs.
          </p>
        </div>
      )}
      
      <div className="mt-2 text-xs text-blue-600">
        <p>Script URL: https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3802811303973258</p>
        <p>Status: {adsLoaded ? '✅ Loaded' : '⏳ Loading...'}</p>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-blue-800 mb-2">Test Results:</h4>
          <div className="bg-white border border-blue-200 rounded p-2 max-h-40 overflow-y-auto">
            {testResults.map((result, index) => (
              <div key={index} className="text-xs text-gray-700 mb-1 font-mono">
                {result}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-2 text-xs text-gray-500">
        <p><strong>Note:</strong> Google Ads code will be automatically added to your website head section when enabled.</p>
      </div>
    </div>
  );
};

export default GoogleAdsTest;


