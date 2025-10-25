import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllSettings, upsertSetting } from '@/services/websiteSettingsService';

export interface WebsiteSettings {
  site_title?: string;
  site_description?: string;
  contact_email?: string;
  contact_phone?: string;
  social_facebook?: string;
  social_instagram?: string;
  social_twitter?: string;
  free_shipping_text?: string;
  join_text?: string;
  hero_title?: string;
  hero_subtitle?: string;
  footer_text?: string;
  maintenance_mode?: boolean;
  tawk_enabled?: boolean;
  tawk_property_id?: string;
  tawk_widget_id?: string;
  tawk_3d_enabled?: boolean;
  tawk_avatar_url?: string;
  tawk_use_default_launcher?: boolean;
  [key: string]: string | boolean | number | undefined;
}

export const useWebsiteSettings = () => {
  const queryClient = useQueryClient();

  // Use React Query for better caching with longer cache times
  const { data: settings = {}, isLoading: loading, error } = useQuery({
    queryKey: ['website-settings'],
    queryFn: async () => {
      const data = await getAllSettings();
      if (!data) {
        // Return default values instead of throwing error
        return {
          site_title: 'verified engine',
          site_description: 'Premium automotive engines and parts',
          contact_phone: '96115404',
          free_shipping_text: 'FREE SHIPPING ON SELECT ITEMS!',
          join_text: 'JOIN THE FUN !!',
          hero_title: 'Premium Automotive Engines',
          hero_subtitle: 'Quality engines you can trust',
          footer_text: '© 2024 Verified Engine. All rights reserved.',
          maintenance_mode: false,
          // Tawk.to settings
          tawk_enabled: true,
          tawk_property_id: '68d3e2e9a5528e1923b79293',
          tawk_widget_id: '1j5tqsot9',
          tawk_3d_enabled: false,
          tawk_avatar_url: '',
          tawk_use_default_launcher: true,
          // Google Ads settings
          google_ads_enabled: false,
          google_ads_code: '',
          // Google Analytics settings
          google_analytics_enabled: false,
          google_analytics_id: '',
          // Google Tag Manager settings
          google_tag_manager_enabled: false,
          google_tag_manager_id: '',
          // WhatsApp settings
          whatsapp_enabled: true,
          whatsapp_number: '+35796115404',
          whatsapp_message: 'Hi! I\'m interested in your products. Can you help me?',
        };
      }

      // Convert array of settings to object
      const settingsObject: WebsiteSettings = {};
      data.forEach(item => {
        // Handle different value types from Supabase
        let value: string | boolean | number | undefined;
        if (typeof item.value === 'string' || typeof item.value === 'boolean' || typeof item.value === 'number') {
          value = item.value;
        } else if (typeof item.value === 'object' && item.value !== null) {
          // Convert objects to strings for storage
          value = JSON.stringify(item.value);
        } else {
          value = String(item.value);
        }
        settingsObject[item.key] = value;
      });

      return settingsObject;
    },
    staleTime: 60 * 60 * 1000, // 1 hour - settings rarely change
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    retry: 0, // Don't retry on error, use defaults
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    // Fallback to default values on error
    placeholderData: {
      site_title: 'verified engine',
      site_description: 'Premium automotive engines and parts',
      contact_phone: '96115404',
      free_shipping_text: 'FREE SHIPPING ON SELECT ITEMS!',
      join_text: 'JOIN THE FUN !!',
      hero_title: 'Premium Automotive Engines',
      hero_subtitle: 'Quality engines you can trust',
      footer_text: '© 2024 Verified Engine. All rights reserved.',
      maintenance_mode: false,
      // Tawk.to settings
      tawk_enabled: true,
      tawk_property_id: '68d3e2e9a5528e1923b79293',
      tawk_widget_id: '1j5tqsot9',
      tawk_3d_enabled: false,
      tawk_avatar_url: '',
      tawk_use_default_launcher: true,
      // Google Ads settings
      google_ads_enabled: false,
      google_ads_code: '',
      // Google Analytics settings
      google_analytics_enabled: false,
      google_analytics_id: '',
      // Google Tag Manager settings
      google_tag_manager_enabled: false,
      google_tag_manager_id: '',
      // WhatsApp settings
      whatsapp_enabled: true,
      whatsapp_number: '+35796115404',
      whatsapp_message: 'Hi! I\'m interested in your products. Can you help me?',
    },
  });

  const getSetting = (key: string, defaultValue: string | boolean | number | undefined = undefined) => {
    return settings[key] ?? defaultValue;
  };

  // Use React Query mutation for updates
  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value, description }: { key: string; value: string | boolean | number; description?: string }) => {
      await upsertSetting({ key, value, description: description || null });
      return { key, value };
    },
    onSuccess: ({ key, value }) => {
      // Update the cache immediately
      queryClient.setQueryData(['website-settings'], (oldData: WebsiteSettings) => ({
        ...oldData,
        [key]: value
      }));
    },
  });

  const updateSetting = async (key: string, value: string | boolean | number, description?: string) => {
    try {
      await updateSettingMutation.mutateAsync({ key, value, description });
      return { success: true };
    } catch (err) {
      console.error('Error updating setting:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update setting' 
      };
    }
  };

  const refreshSettings = () => {
    queryClient.invalidateQueries({ queryKey: ['website-settings'] });
  };

  return {
    settings,
    loading,
    error: error?.message || null,
    getSetting,
    updateSetting,
    refreshSettings,
  };
};