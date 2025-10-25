import React from 'react';
import { useWebsiteSettings } from '@/hooks/useWebsiteSettings';

export const SettingsDebug = () => {
  const { getSetting } = useWebsiteSettings();

  const settings = {
    tawk_enabled: getSetting('tawk_enabled', false),
    tawk_property_id: getSetting('tawk_property_id', ''),
    tawk_widget_id: getSetting('tawk_widget_id', ''),
    google_ads_enabled: getSetting('google_ads_enabled', false),
    google_ads_code: getSetting('google_ads_code', ''),
    google_analytics_enabled: getSetting('google_analytics_enabled', false),
    google_analytics_id: getSetting('google_analytics_id', ''),
    whatsapp_enabled: getSetting('whatsapp_enabled', false),
    whatsapp_number: getSetting('whatsapp_number', ''),
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h3 className="font-bold mb-2">🔍 Settings Debug</h3>
      <div className="text-sm space-y-1">
        {Object.entries(settings).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="font-mono">{key}:</span>
            <span className={`font-mono ${typeof value === 'boolean' ? (value ? 'text-green-600' : 'text-red-600') : 'text-blue-600'}`}>
              {typeof value === 'boolean' ? value.toString() : (value || 'empty')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsDebug;



