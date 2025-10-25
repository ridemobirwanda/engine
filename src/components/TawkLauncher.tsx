import { useEffect, useMemo } from 'react';
import { Headphones, Keyboard, UserRound } from 'lucide-react';
import { useWebsiteSettings } from '@/hooks/useWebsiteSettings';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    Tawk_API?: any;
  }
}

export const TawkLauncher = () => {
  const { getSetting } = useWebsiteSettings();
  const location = useLocation();

  const show = useMemo(() => {
    const enabled = getSetting('tawk_enabled', true);
    const useDefault = getSetting('tawk_use_default_launcher', true);
    const isAdmin = location.pathname.startsWith('/admin');
    // Show launcher if enabled and not using default launcher and not on admin pages
    return enabled && !useDefault && !isAdmin;
  }, [getSetting, location.pathname]);

  useEffect(() => {
    // Ensure default widget stays hidden when we open/close via API
    if (!show) return;
    if (window.Tawk_API) {
      try {
        window.Tawk_API.hideWidget();
      } catch {}
    }
  }, [show]);

  if (!show) return null;

  const openChat = () => {
    const propertyId = getSetting('tawk_property_id', '68d3e2e9a5528e1923b79293');
    const widgetId = getSetting('tawk_widget_id', '1j5tqsot9');
    
    console.log('🔍 TawkLauncher: Opening chat with Property ID:', propertyId);
    
    // Method 1: Try standard Tawk API
    try {
      if (window.Tawk_API?.showWidget) {
        window.Tawk_API.showWidget();
        if (window.Tawk_API?.maximize) {
          window.Tawk_API.maximize();
        }
        console.log('✅ TawkLauncher: Standard API worked');
        return;
      }
    } catch (error) {
      console.log('⚠️ TawkLauncher: Standard API failed, trying fallbacks');
    }
    
    // Method 2: Direct window.open (most reliable)
    try {
      window.open(`https://tawk.to/chat/${propertyId}/${widgetId}`, '_blank', 'width=400,height=600,scrollbars=yes,resizable=yes');
      console.log('✅ TawkLauncher: Direct window opened');
    } catch (directError) {
      console.error('❌ TawkLauncher: Direct window failed', directError);
      
      // Method 3: Try iframe fallback as last resort
      try {
        const existingIframe = document.getElementById('tawk-launcher-iframe');
        if (existingIframe) {
          existingIframe.remove();
        }
        
        const iframe = document.createElement('iframe');
        iframe.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
        iframe.style.cssText = `
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 350px;
          height: 500px;
          border: none;
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          z-index: 999999;
        `;
        iframe.id = 'tawk-launcher-iframe';
        iframe.setAttribute('allow', 'microphone; camera');
        iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox');
        
        document.body.appendChild(iframe);
        console.log('✅ TawkLauncher: Iframe fallback created');
        
        // Auto-remove after 30 seconds
        setTimeout(() => {
          if (iframe.parentNode) {
            iframe.remove();
          }
        }, 30000);
        
      } catch (iframeError) {
        console.error('❌ TawkLauncher: All methods failed', iframeError);
      }
    }
  };

  return (
    <button
      onClick={openChat}
      aria-label="Open live chat"
      className="fixed bottom-6 right-6 z-50 group"
    >
      <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 shadow-lg border border-white/10 hover:scale-105 transition-all animate-bounce" style={{ animationDuration: '2.5s' }}>
        {/* Headset over user */}
        <Headphones className="w-8 h-8 text-white absolute -top-1" />
        <UserRound className="w-7 h-7 text-white" />
        {/* Keyboard at bottom */}
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex items-end gap-0.5">
          <div className="h-3 w-8 bg-white/95 rounded-sm shadow-sm border border-black/10 flex items-end justify-center">
            {/* typing indicators */}
            <span className="inline-block w-1 h-1 bg-orange-500 rounded-full mx-0.5 animate-pulse" style={{ animationDelay: '0s' }}></span>
            <span className="inline-block w-1 h-1 bg-orange-500 rounded-full mx-0.5 animate-pulse" style={{ animationDelay: '0.2s' }}></span>
            <span className="inline-block w-1 h-1 bg-orange-500 rounded-full mx-0.5 animate-pulse" style={{ animationDelay: '0.4s' }}></span>
          </div>
        </div>
      </div>
      <span className="sr-only">Chat with support</span>
    </button>
  );
};

export default TawkLauncher;


