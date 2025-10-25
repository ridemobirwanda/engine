import { useEffect, useState } from 'react';
import { useWebsiteSettings } from '@/hooks/useWebsiteSettings';

interface DiagnosticResult {
  test: string;
  status: 'pass' | 'fail' | 'warning' | 'info';
  message: string;
  details?: string;
}

export const GoogleAdsDiagnostic = () => {
  const { getSetting } = useWebsiteSettings();
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const adsEnabled = getSetting('google_ads_enabled', false);
  const adsCode = getSetting('google_ads_code', '');

  const addDiagnostic = (result: DiagnosticResult) => {
    setDiagnostics(prev => [...prev, result]);
  };

  const runDiagnostics = async () => {
    setIsRunning(true);
    setDiagnostics([]);

    // Test 1: Check if Google Ads is enabled
    if (!adsEnabled) {
      addDiagnostic({
        test: 'Google Ads Enabled',
        status: 'fail',
        message: 'Google Ads is not enabled in admin settings',
        details: 'Enable Google Ads in the admin panel to continue'
      });
      setIsRunning(false);
      return;
    }

    addDiagnostic({
      test: 'Google Ads Enabled',
      status: 'pass',
      message: 'Google Ads is enabled in admin settings'
    });

    // Test 2: Check if ads code is provided
    if (!adsCode) {
      addDiagnostic({
        test: 'Google Ads Code',
        status: 'fail',
        message: 'No Google Ads code provided',
        details: 'Add your Google Ads script code in the admin panel'
      });
      setIsRunning(false);
      return;
    }

    addDiagnostic({
      test: 'Google Ads Code',
      status: 'pass',
      message: 'Google Ads code is provided'
    });

    // Test 3: Check script format
    if (adsCode.includes('googlesyndication.com')) {
      addDiagnostic({
        test: 'Script Format',
        status: 'pass',
        message: 'Valid Google Ads script format detected'
      });
    } else {
      addDiagnostic({
        test: 'Script Format',
        status: 'warning',
        message: 'Script format may not be standard Google Ads format'
      });
    }

    // Test 4: Check for existing scripts
    const existingScripts = document.querySelectorAll('script[src*="googlesyndication"]');
    if (existingScripts.length > 0) {
      addDiagnostic({
        test: 'Script Loading',
        status: 'pass',
        message: `Found ${existingScripts.length} Google Ads script(s) loaded`
      });
    } else {
      addDiagnostic({
        test: 'Script Loading',
        status: 'fail',
        message: 'No Google Ads scripts found in DOM'
      });
    }

    // Test 5: Check for ad blocker
    const testAdBlocker = () => {
      return new Promise<boolean>((resolve) => {
        const testAd = document.createElement('div');
        testAd.innerHTML = '&nbsp;';
        testAd.className = 'adsbox';
        testAd.style.position = 'absolute';
        testAd.style.left = '-10000px';
        document.body.appendChild(testAd);
        
        setTimeout(() => {
          const isBlocked = testAd.offsetHeight === 0;
          document.body.removeChild(testAd);
          resolve(isBlocked);
        }, 100);
      });
    };

    const adBlockerDetected = await testAdBlocker();
    if (adBlockerDetected) {
      addDiagnostic({
        test: 'Ad Blocker Detection',
        status: 'fail',
        message: 'Ad blocker detected',
        details: 'Ad blockers prevent Google Ads from loading. Disable ad blocker to test.'
      });
    } else {
      addDiagnostic({
        test: 'Ad Blocker Detection',
        status: 'pass',
        message: 'No ad blocker detected'
      });
    }

    // Test 6: Check network connectivity to Google
    try {
      const response = await fetch('https://www.google.com/favicon.ico', { 
        method: 'HEAD',
        mode: 'no-cors'
      });
      addDiagnostic({
        test: 'Google Connectivity',
        status: 'pass',
        message: 'Can reach Google servers'
      });
    } catch (error) {
      addDiagnostic({
        test: 'Google Connectivity',
        status: 'fail',
        message: 'Cannot reach Google servers',
        details: 'Network connectivity issues may prevent Google Ads from loading'
      });
    }

    // Test 7: Check for CSP headers
    const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (metaCSP) {
      const cspContent = metaCSP.getAttribute('content') || '';
      if (cspContent.includes('googlesyndication.com') || cspContent.includes('*.google.com')) {
        addDiagnostic({
          test: 'Content Security Policy',
          status: 'pass',
          message: 'CSP allows Google Ads domains'
        });
      } else {
        addDiagnostic({
          test: 'Content Security Policy',
          status: 'warning',
          message: 'CSP may be blocking Google Ads',
          details: 'Content Security Policy might prevent Google Ads from loading'
        });
      }
    } else {
      addDiagnostic({
        test: 'Content Security Policy',
        status: 'info',
        message: 'No CSP meta tag found'
      });
    }

    // Test 8: Check adsbygoogle availability
    if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
      addDiagnostic({
        test: 'adsbygoogle Object',
        status: 'pass',
        message: 'adsbygoogle object is available',
        details: `Type: ${typeof (window as any).adsbygoogle}, Length: ${(window as any).adsbygoogle.length || 'N/A'}`
      });
    } else {
      addDiagnostic({
        test: 'adsbygoogle Object',
        status: 'fail',
        message: 'adsbygoogle object is not available',
        details: 'This indicates the Google Ads script has not fully initialized'
      });
    }

    // Test 9: Check for console errors
    const originalError = console.error;
    let hasErrors = false;
    console.error = (...args) => {
      if (args.some(arg => typeof arg === 'string' && arg.includes('google'))) {
        hasErrors = true;
      }
      originalError.apply(console, args);
    };

    setTimeout(() => {
      console.error = originalError;
      if (hasErrors) {
        addDiagnostic({
          test: 'Console Errors',
          status: 'warning',
          message: 'Google-related errors found in console',
          details: 'Check browser console for detailed error messages'
        });
      } else {
        addDiagnostic({
          test: 'Console Errors',
          status: 'pass',
          message: 'No Google-related errors in console'
        });
      }
    }, 2000);

    setIsRunning(false);
  };

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'pass': return '✅';
      case 'fail': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '❓';
    }
  };

  const getStatusColor = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'pass': return 'text-green-700';
      case 'fail': return 'text-red-700';
      case 'warning': return 'text-yellow-700';
      case 'info': return 'text-blue-700';
      default: return 'text-gray-700';
    }
  };

  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Google Ads Diagnostic</h3>
        <button
          onClick={runDiagnostics}
          disabled={isRunning}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
        >
          {isRunning ? 'Running...' : 'Run Diagnostics'}
        </button>
      </div>

      {diagnostics.length > 0 && (
        <div className="space-y-2">
          {diagnostics.map((diagnostic, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded p-3">
              <div className="flex items-start gap-2">
                <span className="text-lg">{getStatusIcon(diagnostic.status)}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">{diagnostic.test}</span>
                    <span className={`text-sm ${getStatusColor(diagnostic.status)}`}>
                      {diagnostic.message}
                    </span>
                  </div>
                  {diagnostic.details && (
                    <p className="text-xs text-gray-600 mt-1">{diagnostic.details}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {diagnostics.length === 0 && !isRunning && (
        <p className="text-gray-600 text-sm">Click "Run Diagnostics" to check Google Ads integration</p>
      )}
    </div>
  );
};

export default GoogleAdsDiagnostic;
