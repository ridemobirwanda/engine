import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { useWebsiteSettings } from '@/hooks/useWebsiteSettings';

export const WhatsAppChat = () => {
  const { getSetting } = useWebsiteSettings();
  const [isVisible, setIsVisible] = useState(true); // Always start as visible
  const [isInitialized, setIsInitialized] = useState(false);

  // Get WhatsApp settings with fallback defaults
  const enabled = getSetting('whatsapp_enabled', true); // Default to enabled
  const number = getSetting('whatsapp_number', '+35796115404'); // Default number
  const message = getSetting('whatsapp_message', 'Hi! I\'m interested in your products. Can you help me?');

  // Initialize visibility once and keep it stable
  useEffect(() => {
    if (!isInitialized) {
      // Always show initially, regardless of database settings
      setIsVisible(true);
      setIsInitialized(true);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 WhatsApp: Initial setup - always visible by default');
      }
    }
  }, [isInitialized]);

  // Only hide if explicitly disabled in database (not just undefined)
  useEffect(() => {
    if (isInitialized) {
      // Only hide if explicitly set to false in database
      if (enabled === false) {
        setIsVisible(false);
        if (process.env.NODE_ENV === 'development') {
          console.log('🔍 WhatsApp: Hiding - explicitly disabled in database');
        }
      } else {
        // Show if enabled (true) or undefined (default)
        setIsVisible(true);
        if (process.env.NODE_ENV === 'development') {
          console.log('🔍 WhatsApp: Showing - enabled:', enabled);
        }
      }
    }
  }, [enabled, isInitialized]);

  const handleWhatsAppClick = () => {
    if (!number.trim()) return;

    // Format the number (remove spaces, dashes, etc.)
    const cleanNumber = number.replace(/[\s\-\(\)]/g, '');
    
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <button
        onClick={handleWhatsAppClick}
        className="group flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
        aria-label="WhatsApp"
      >
        {/* WhatsApp logo - always visible */}
        <svg
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>
        
        <span className="font-medium text-sm hidden sm:inline">
          WhatsApp
        </span>
      </button>
    </div>
  );
};

export default WhatsAppChat;
