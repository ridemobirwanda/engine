import React from 'react';
import { useWebsiteSettings } from '@/hooks/useWebsiteSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { CheckCircle, XCircle, AlertCircle, Settings, RefreshCw } from 'lucide-react';

export const IntegrationStatus = () => {
  const { getSetting, refreshSettings, updateSetting } = useWebsiteSettings();

  // Get all integration settings
  const tawkEnabled = getSetting('tawk_enabled', false);
  const tawkPropertyId = getSetting('tawk_property_id', '');
  const tawkWidgetId = getSetting('tawk_widget_id', '');
  
  const googleAdsEnabled = getSetting('google_ads_enabled', false);
  const googleAdsCode = getSetting('google_ads_code', '');
  
  const googleAnalyticsEnabled = getSetting('google_analytics_enabled', false);
  const googleAnalyticsId = getSetting('google_analytics_id', '');
  
  const whatsappEnabled = getSetting('whatsapp_enabled', true);
  const whatsappNumber = getSetting('whatsapp_number', '+35796115404');

  const getStatusIcon = (enabled: boolean, hasConfig: boolean) => {
    if (!enabled) return <XCircle className="h-4 w-4 text-gray-400" />;
    if (!hasConfig) return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const getStatusBadge = (enabled: boolean, hasConfig: boolean) => {
    if (!enabled) return <Badge variant="secondary">Disabled</Badge>;
    if (!hasConfig) return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Needs Configuration</Badge>;
    return <Badge variant="default" className="bg-green-600">Active</Badge>;
  };

  const handleWhatsAppToggle = async (enabled: boolean) => {
    try {
      await updateSetting({
        key: 'whatsapp_enabled',
        value: enabled,
        description: 'WhatsApp chat widget frontend visibility'
      });
      console.log('WhatsApp status updated:', enabled);
    } catch (error) {
      console.error('Failed to update WhatsApp status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          <h2 className="text-2xl font-bold">Integration Status Dashboard</h2>
        </div>
        <Button onClick={refreshSettings} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tawk.to Status */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(tawkEnabled, tawkPropertyId && tawkWidgetId)}
                <CardTitle className="text-lg">Tawk.to Chat</CardTitle>
              </div>
              {getStatusBadge(tawkEnabled, tawkPropertyId && tawkWidgetId)}
            </div>
            <CardDescription>
              Live chat widget for customer support
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Status:</span>
                <span className={`ml-2 ${tawkEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                  {tawkEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div>
                <span className="font-medium">Property ID:</span>
                <span className="ml-2 text-gray-600">
                  {tawkPropertyId ? `${tawkPropertyId.substring(0, 8)}...` : 'Not set'}
                </span>
              </div>
              <div>
                <span className="font-medium">Widget ID:</span>
                <span className="ml-2 text-gray-600">
                  {tawkWidgetId || 'Not set'}
                </span>
              </div>
              <div>
                <span className="font-medium">Frontend:</span>
                <span className={`ml-2 ${tawkEnabled && tawkPropertyId && tawkWidgetId ? 'text-green-600' : 'text-red-500'}`}>
                  {tawkEnabled && tawkPropertyId && tawkWidgetId ? 'Visible' : 'Hidden'}
                </span>
              </div>
            </div>
            {!tawkEnabled && (
              <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded">
                Tawk.to chat widget is disabled and will not appear on the website.
              </p>
            )}
            {tawkEnabled && (!tawkPropertyId || !tawkWidgetId) && (
              <p className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                Tawk.to is enabled but missing configuration. Please set Property ID and Widget ID.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Google Ads Status */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(googleAdsEnabled, googleAdsCode)}
                <CardTitle className="text-lg">Google Ads</CardTitle>
              </div>
              {getStatusBadge(googleAdsEnabled, googleAdsCode)}
            </div>
            <CardDescription>
              Google Ads tracking and conversion measurement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Status:</span>
                <span className={`ml-2 ${googleAdsEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                  {googleAdsEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div>
                <span className="font-medium">Code:</span>
                <span className="ml-2 text-gray-600">
                  {googleAdsCode ? 'Configured' : 'Not set'}
                </span>
              </div>
              <div>
                <span className="font-medium">Frontend:</span>
                <span className={`ml-2 ${googleAdsEnabled && googleAdsCode ? 'text-green-600' : 'text-red-500'}`}>
                  {googleAdsEnabled && googleAdsCode ? 'Active' : 'Hidden'}
                </span>
              </div>
              <div>
                <span className="font-medium">Tracking:</span>
                <span className={`ml-2 ${googleAdsEnabled && googleAdsCode ? 'text-green-600' : 'text-gray-500'}`}>
                  {googleAdsEnabled && googleAdsCode ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
            {!googleAdsEnabled && (
              <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded">
                Google Ads tracking is disabled and will not appear on the website.
              </p>
            )}
            {googleAdsEnabled && !googleAdsCode && (
              <p className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                Google Ads is enabled but missing code. Please add your Google Ads code.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Google Analytics Status */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(googleAnalyticsEnabled, googleAnalyticsId)}
                <CardTitle className="text-lg">Google Analytics</CardTitle>
              </div>
              {getStatusBadge(googleAnalyticsEnabled, googleAnalyticsId)}
            </div>
            <CardDescription>
              Website analytics and visitor tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Status:</span>
                <span className={`ml-2 ${googleAnalyticsEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                  {googleAnalyticsEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div>
                <span className="font-medium">Tracking ID:</span>
                <span className="ml-2 text-gray-600">
                  {googleAnalyticsId || 'Not set'}
                </span>
              </div>
              <div>
                <span className="font-medium">Frontend:</span>
                <span className={`ml-2 ${googleAnalyticsEnabled && googleAnalyticsId ? 'text-green-600' : 'text-red-500'}`}>
                  {googleAnalyticsEnabled && googleAnalyticsId ? 'Active' : 'Hidden'}
                </span>
              </div>
              <div>
                <span className="font-medium">Data Collection:</span>
                <span className={`ml-2 ${googleAnalyticsEnabled && googleAnalyticsId ? 'text-green-600' : 'text-gray-500'}`}>
                  {googleAnalyticsEnabled && googleAnalyticsId ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
            {!googleAnalyticsEnabled && (
              <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded">
                Google Analytics tracking is disabled and will not collect data.
              </p>
            )}
            {googleAnalyticsEnabled && !googleAnalyticsId && (
              <p className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                Google Analytics is enabled but missing Tracking ID. Please add your GA4 measurement ID.
              </p>
            )}
          </CardContent>
        </Card>

        {/* WhatsApp Status */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(whatsappEnabled, whatsappNumber)}
                <CardTitle className="text-lg">WhatsApp Chat</CardTitle>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(whatsappEnabled, whatsappNumber)}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Frontend:</span>
                  <Switch
                    checked={whatsappEnabled}
                    onCheckedChange={handleWhatsAppToggle}
                    aria-label="Toggle WhatsApp frontend visibility"
                  />
                </div>
              </div>
            </div>
            <CardDescription>
              WhatsApp chat widget for customer support
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Status:</span>
                <span className={`ml-2 ${whatsappEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                  {whatsappEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div>
                <span className="font-medium">Number:</span>
                <span className="ml-2 text-gray-600">
                  {whatsappNumber || 'Not set'}
                </span>
              </div>
              <div>
                <span className="font-medium">Frontend:</span>
                <span className={`ml-2 ${whatsappEnabled && whatsappNumber ? 'text-green-600' : 'text-red-500'}`}>
                  {whatsappEnabled && whatsappNumber ? 'Visible' : 'Hidden'}
                </span>
              </div>
              <div>
                <span className="font-medium">Click Action:</span>
                <span className={`ml-2 ${whatsappEnabled && whatsappNumber ? 'text-green-600' : 'text-gray-500'}`}>
                  {whatsappEnabled && whatsappNumber ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
            {!whatsappEnabled && (
              <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded">
                WhatsApp chat widget is disabled and will not appear on the website.
              </p>
            )}
            {whatsappEnabled && !whatsappNumber && (
              <p className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                WhatsApp is enabled but missing phone number. Please add your WhatsApp number.
              </p>
            )}
            {whatsappEnabled && whatsappNumber && (
              <p className="text-sm text-green-600 bg-green-50 p-2 rounded">
                ✅ WhatsApp chat widget is active and visible on the frontend.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common integration management tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Tawk.to</h4>
              <p className="text-sm text-gray-600 mb-3">
                {tawkEnabled ? 'Currently enabled' : 'Currently disabled'}
              </p>
              <p className="text-xs text-gray-500">
                Go to Integrations tab to configure
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Google Ads</h4>
              <p className="text-sm text-gray-600 mb-3">
                {googleAdsEnabled ? 'Currently enabled' : 'Currently disabled'}
              </p>
              <p className="text-xs text-gray-500">
                Go to Integrations tab to configure
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Analytics</h4>
              <p className="text-sm text-gray-600 mb-3">
                {googleAnalyticsEnabled ? 'Currently enabled' : 'Currently disabled'}
              </p>
              <p className="text-xs text-gray-500">
                Go to Integrations tab to configure
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium mb-2">WhatsApp</h4>
              <p className="text-sm text-gray-600 mb-3">
                {whatsappEnabled ? 'Currently enabled' : 'Currently disabled'}
              </p>
              <p className="text-xs text-gray-500">
                Go to Integrations tab to configure
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationStatus;
