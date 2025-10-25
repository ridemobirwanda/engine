import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useWebsiteSettings } from '@/hooks/useWebsiteSettings';

declare global {
  interface Window {
    Tawk_API?: {
      onLoad?: () => void;
      onChatStarted?: () => void;
      onChatEnded?: () => void;
      setAttributes?: (attributes: { name?: string; email?: string; hash?: string }) => void;
      hideWidget?: () => void;
      showWidget?: () => void;
      maximize?: () => void;
    };
    Tawk_LoadStart?: Date;
  }
}

export const TawkChat = () => {
  const location = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);
  const { getSetting } = useWebsiteSettings();

  useEffect(() => {
    // Don't load on admin pages
    const isAdmin = location.pathname.startsWith('/admin');
    if (isAdmin) {
      if (window.Tawk_API?.hideWidget) {
        window.Tawk_API.hideWidget();
      }
      return;
    }

    // Check if Tawk.to is enabled in settings
    const tawkEnabled = getSetting('tawk_enabled', true);
    const enabled = String(tawkEnabled).toLowerCase() === 'true' || tawkEnabled === true;
    
    if (!enabled) {
      console.log('🔍 Tawk.to: Disabled in settings');
      return;
    }

    // Get credentials from settings
    const propertyId = String(getSetting('tawk_property_id', '68d3e2e9a5528e1923b79293'));
    const widgetId = String(getSetting('tawk_widget_id', '1j5tqsot9'));
    
    console.log('🔍 Tawk.to: Loading widget - Property:', propertyId, 'Widget:', widgetId);

    // Check if already loaded
    if (window.Tawk_API?.showWidget) {
      console.log('🔍 Tawk.to: Already loaded, showing widget');
      window.Tawk_API.showWidget();
      setIsLoaded(true);
      return;
    }

    // Check if script already exists
    const existingScript = document.getElementById('tawk-script');
    if (existingScript) {
      console.log('🔍 Tawk.to: Script already exists');
      return;
    }

    console.log('🔍 Tawk.to: Initializing new chat widget');
    
    // Initialize Tawk API
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();
    
    // Setup callbacks
    window.Tawk_API.onLoad = function () {
      console.log('✅ Tawk.to: Widget loaded and ready!');
      setIsLoaded(true);
      
      // Force show widget
      if (window.Tawk_API?.showWidget) {
        window.Tawk_API.showWidget();
        console.log('✅ Tawk.to: Widget shown');
      }
    };

    window.Tawk_API.onChatStarted = function() {
      console.log('💬 Tawk.to: Chat conversation started');
    };

    window.Tawk_API.onChatEnded = function() {
      console.log('💬 Tawk.to: Chat conversation ended');
    };

    // Create and load script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
    script.charset = 'UTF-8';
    script.id = 'tawk-script';
    script.setAttribute('crossorigin', '*');
    
    script.onerror = () => {
      console.error('❌ Tawk.to: Failed to load script from:', script.src);
    };
    
    script.onload = () => {
      console.log('📦 Tawk.to: Script file loaded successfully');
    };
    
    document.head.appendChild(script);
    console.log('📝 Tawk.to: Script tag added to page');

    // Cleanup function
    return () => {
      if (isAdmin) {
        const tawkScript = document.getElementById('tawk-script');
        if (tawkScript) {
          tawkScript.remove();
          console.log('🧹 Tawk.to: Script removed (admin page)');
        }
      }
    };
  }, [location.pathname, getSetting]);

  return null;
};

export default TawkChat;