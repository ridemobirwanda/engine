import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const TawkTest = () => {
  const [status, setStatus] = useState<string>('Checking...');
  const [apiStatus, setApiStatus] = useState<string>('Unknown');
  const [scriptStatus, setScriptStatus] = useState<string>('Unknown');

  useEffect(() => {
    const checkTawkStatus = () => {
      // Check if Tawk API exists
      if (window.Tawk_API) {
        setApiStatus('Available');
        if (window.Tawk_API.showWidget) {
          setStatus('✅ Tawk.to API is loaded and ready');
        } else {
          setStatus('⚠️ Tawk.to API loaded but showWidget not available');
        }
      } else {
        setApiStatus('Not Available');
        setStatus('❌ Tawk.to API not loaded');
      }

      // Check if script exists
      const script = document.getElementById('tawk-script');
      if (script) {
        setScriptStatus('Found');
      } else {
        setScriptStatus('Not Found');
      }
    };

    checkTawkStatus();
    
    // Check again after 3 seconds
    const timeout = setTimeout(checkTawkStatus, 3000);
    
    return () => clearTimeout(timeout);
  }, []);

  const testTawk = () => {
    if (window.Tawk_API?.showWidget) {
      window.Tawk_API.showWidget();
      setStatus('✅ Tawk.to widget shown');
    } else {
      setStatus('❌ Cannot show widget - API not available');
    }
  };

  const testDirect = () => {
    window.open('https://tawk.to/chat/68d3e2e9a5528e1923b79293/1j5tqsot9', '_blank', 'width=400,height=600');
    setStatus('✅ Direct Tawk.to window opened');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Tawk.to Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>API Status:</span>
            <Badge variant={apiStatus === 'Available' ? 'default' : 'destructive'}>
              {apiStatus}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span>Script Status:</span>
            <Badge variant={scriptStatus === 'Found' ? 'default' : 'destructive'}>
              {scriptStatus}
            </Badge>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          {status}
        </div>
        
        <div className="space-y-2">
          <Button onClick={testTawk} className="w-full" variant="outline">
            Test Tawk API
          </Button>
          <Button onClick={testDirect} className="w-full" variant="outline">
            Test Direct Link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TawkTest;


