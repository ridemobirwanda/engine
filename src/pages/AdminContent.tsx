import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Save, Trash2, Plus } from "lucide-react";
import IntegrationStatus from "@/components/IntegrationStatus";
import SettingsDebug from "@/components/SettingsDebug";
import { useToast } from "@/components/ui/use-toast";
import { getAllSettings, upsertSetting, deleteSettingById } from '@/services/websiteSettingsService';
import GoogleAdsTest from "@/components/GoogleAdsTest";
import GoogleAdsDiagnostic from "@/components/GoogleAdsDiagnostic";
import AdManagementPanel from "@/components/AdManagementPanel";

interface ContentItem {
  id: string;
  key: string;
  value: string | boolean | number | object;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface SiteSettings {
  site_title: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  social_facebook: string;
  social_instagram: string;
  social_twitter: string;
  free_shipping_text: string;
  join_text: string;
  hero_title: string;
  hero_subtitle: string;
  footer_text: string;
  maintenance_mode: boolean;
  tawk_enabled: boolean;
  tawk_property_id: string;
  tawk_widget_id: string;
  tawk_3d_enabled: boolean;
  tawk_avatar_url: string;
  tawk_use_default_launcher: boolean;
  whatsapp_enabled: boolean;
  whatsapp_number: string;
  whatsapp_message: string;
  google_ads_enabled: boolean;
  google_ads_code: string;
  google_analytics_enabled: boolean;
  google_analytics_id: string;
  google_tag_manager_enabled: boolean;
  google_tag_manager_id: string;
  seo_meta_title: string;
  seo_meta_description: string;
  seo_meta_keywords: string;
  seo_og_title: string;
  seo_og_description: string;
  seo_og_image: string;
  seo_twitter_title: string;
  seo_twitter_description: string;
  seo_twitter_image: string;
}

export default function AdminContent() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    site_title: "verified engine",
    site_description: "Premium automotive engines and parts",
    contact_email: "info@verifiedengine.com",
    contact_phone: "+357 96115404",
    social_facebook: "",
    social_instagram: "",
    social_twitter: "",
    free_shipping_text: "FREE SHIPPING ON SELECT ITEMS!",
    join_text: "JOIN THE FUN !!",
    hero_title: "Premium Automotive Engines",
    hero_subtitle: "Quality engines you can trust",
    footer_text: "© 2024 Verified Engine. All rights reserved.",
    maintenance_mode: false,
    tawk_enabled: true,
    tawk_property_id: "68d3e2e9a5528e1923b79293",
    tawk_widget_id: "1j5tqsot9",
    tawk_3d_enabled: false,
    tawk_avatar_url: "",
    tawk_use_default_launcher: true,
    whatsapp_enabled: true,
    whatsapp_number: "+35796115404",
    whatsapp_message: "Hi! I'm interested in your products. Can you help me?",
    google_ads_enabled: false,
    google_ads_code: "",
    google_analytics_enabled: false,
    google_analytics_id: "",
    google_tag_manager_enabled: false,
    google_tag_manager_id: "",
    seo_meta_title: "Premium Automotive Engines & Parts | EngineCore - #1 Engine Supplier",
    seo_meta_description: "Discover premium automotive engines, rebuilt engines, used engines, and high-performance parts. Expert-engineered solutions for BMW, Mercedes, Audi, and more. Fast shipping worldwide.",
    seo_meta_keywords: "automotive engines, rebuilt engines, used engines, BMW engines, Mercedes engines, Audi engines, engine parts, engine heads, engine blocks, timing components, engine pistons, engine crankshafts, engine valves, engine camshafts, engine gaskets, engine bearings, engine oil pumps, engine water pumps, engine alternators, engine starters, engine sensors, engine wiring harnesses, engine mounts, engine exhaust systems, engine intake systems, engine cooling systems, engine fuel systems, engine ignition systems, engine turbo systems, engine superchargers, engine cylinder heads, engine connecting rods, engine pushrods, engine lifters, engine rocker arms, engine timing chains, engine timing belts, engine timing tensioners, engine oil filters, engine air filters, engine fuel filters, engine spark plugs, engine ignition coils, engine distributors, engine carburetors, engine fuel injectors, engine throttle bodies, engine manifolds, engine headers, engine catalytic converters, premium engines, high-performance engines, engine specialists, engine warranty, engine shipping, engine installation, engine repair, engine maintenance, engine diagnostics, engine performance",
    seo_og_title: "Premium Automotive Engines & Parts | EngineCore - #1 Engine Supplier",
    seo_og_description: "Discover premium automotive engines, rebuilt engines, used engines, and high-performance parts. Expert-engineered solutions for BMW, Mercedes, Audi, and more. Fast shipping worldwide.",
    seo_og_image: "",
    seo_twitter_title: "Premium Automotive Engines & Parts | EngineCore - #1 Engine Supplier",
    seo_twitter_description: "Discover premium automotive engines, rebuilt engines, used engines, and high-performance parts. Expert-engineered solutions for BMW, Mercedes, Audi, and more. Fast shipping worldwide.",
    seo_twitter_image: "",
  });
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const fetchContent = useCallback(async () => {
    console.log('🔍 AdminContent: fetchContent called');
    try {
      console.log('🔍 AdminContent: Attempting to fetch from MySQL website_settings table');
      const data = await getAllSettings();

      console.log('✅ AdminContent: Successfully fetched data:', data);
      setContentItems(data || []);
      
      // Populate settings from fetched data
      const settingsMap: Record<string, string | boolean | number | object> = {};
      data?.forEach(item => {
        // Handle JSONB values properly
        let value = item.value;
        
        // If value is a JSONB object, extract the actual value
        if (typeof value === 'object' && value !== null) {
          // For JSONB, the value might be wrapped in quotes or be a primitive
          if (typeof value === 'string') {
            // Try to parse as JSON if it's a string
            try {
              value = JSON.parse(value);
            } catch (e) {
              // Keep as string if parsing fails
            }
          }
        }
        
        settingsMap[item.key] = value as string | boolean | number | object;
        console.log(`📥 Loaded setting ${item.key}: ${JSON.stringify(item.value)} -> ${value}`);
      });

      console.log('📥 All loaded settings:', settingsMap);
      setSettings(prev => ({
        ...prev,
        ...settingsMap
      }));

    } catch (error) {
      console.error('❌ AdminContent: Error fetching content:', error);
      console.error('❌ AdminContent: Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      toast({
        title: "Error",
        description: `Failed to load content: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const saveSettings = async () => {
    setSaving(true);
    try {
      console.log('💾 Saving settings:', settings);
      
      // Convert settings to individual items for storage
      const updates = Object.entries(settings).map(([key, value]) => ({
        key, value, description: getDescriptionForKey(key),
      }));

      console.log('💾 Updates to save:', updates);

      for (const item of updates) {
        await upsertSetting(item);
      }

      console.log('✅ All settings saved successfully');
      toast({
        title: "Success",
        description: "Settings saved successfully",
      });

      fetchContent();
    } catch (error) {
      console.error('❌ Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addCustomContent = async () => {
    if (!newKey.trim() || !newValue.trim()) {
      toast({
        title: "Error",
        description: "Key and value are required",
        variant: "destructive",
      });
      return;
    }

    try {
      await upsertSetting({ key: newKey, value: newValue, description: newDescription || null });
      toast({ title: 'Success', description: 'Content added successfully' });

      setNewKey("");
      setNewValue("");
      setNewDescription("");
      fetchContent();
    } catch (error) {
      console.error('Error adding content:', error);
      toast({
        title: "Error",
        description: "Failed to add content",
        variant: "destructive",
      });
    }
  };

  const deleteContent = async (id: string) => {
    try {
      await deleteSettingById(Number(id));
      toast({ title: 'Success', description: 'Content deleted successfully' });

      fetchContent();
    } catch (error) {
      console.error('Error deleting content:', error);
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive",
      });
    }
  };

  const getDescriptionForKey = (key: string): string => {
    const descriptions: Record<string, string> = {
      site_title: "Main website title shown in header",
      site_description: "Site description for SEO and meta tags",
      contact_email: "Primary contact email address",
      contact_phone: "Contact phone number shown in header",
      social_facebook: "Facebook page URL",
      social_instagram: "Instagram profile URL",
      social_twitter: "Twitter profile URL",
      free_shipping_text: "Text shown in top banner",
      join_text: "Subtitle text under logo",
      hero_title: "Main title on homepage hero section",
      hero_subtitle: "Subtitle on homepage hero section",
      footer_text: "Copyright text in footer",
      maintenance_mode: "Enable to show maintenance page",
      // Tawk.to settings
      tawk_enabled: "Enable Tawk.to live chat widget",
      tawk_property_id: "Tawk.to property ID",
      tawk_widget_id: "Tawk.to widget ID",
      tawk_3d_enabled: "Enable 3D Tawk.to widget",
      tawk_avatar_url: "Custom avatar URL for Tawk.to",
      tawk_use_default_launcher: "Use default Tawk.to launcher",
      // WhatsApp settings
      whatsapp_enabled: "Enable WhatsApp chat widget",
      whatsapp_number: "WhatsApp phone number",
      whatsapp_message: "Default WhatsApp message",
      // Google Ads settings
      google_ads_enabled: "Enable Google Ads tracking and conversion measurement",
      google_ads_code: "Google Ads script code for tracking and conversions",
      // Google Analytics settings
      google_analytics_enabled: "Enable Google Analytics tracking",
      google_analytics_id: "Google Analytics 4 measurement ID",
      // Google Tag Manager settings
      google_tag_manager_enabled: "Enable Google Tag Manager",
      google_tag_manager_id: "Google Tag Manager container ID",
      // SEO settings
      seo_meta_title: "Default meta title for SEO",
      seo_meta_description: "Default meta description for SEO",
      seo_meta_keywords: "Default meta keywords for SEO",
      seo_og_title: "Open Graph title for social sharing",
      seo_og_description: "Open Graph description for social sharing",
      seo_og_image: "Open Graph image URL for social sharing",
      seo_twitter_title: "Twitter card title",
      seo_twitter_description: "Twitter card description",
      seo_twitter_image: "Twitter card image URL",
    };
    return descriptions[key] || "";
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AdminSidebar />
          <div className="flex-1 p-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 min-w-0 overflow-auto">
          <header className="bg-background border-b p-3 sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <SidebarTrigger />
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">Website Content Management</h1>
                  <p className="text-gray-500 mt-1 sm:mt-2 text-sm">Manage your website content, settings, and text</p>
                </div>
              </div>
              <Button onClick={saveSettings} disabled={saving} size="sm" className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600">
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save All Changes"}
              </Button>
            </div>
          </header>

          <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
            <Tabs defaultValue="general" className="space-y-6">
              <TabsList className="flex w-full gap-2 overflow-x-auto sm:grid sm:grid-cols-3 lg:grid-cols-6">
                <TabsTrigger value="general">General Settings</TabsTrigger>
                <TabsTrigger value="contact">Contact Info</TabsTrigger>
                <TabsTrigger value="content">Page Content</TabsTrigger>
                <TabsTrigger value="custom">Custom Content</TabsTrigger>
                <TabsTrigger value="status">Status Dashboard</TabsTrigger>
                <TabsTrigger value="integrations">Integrations</TabsTrigger>
                <TabsTrigger value="ads">Advertisement Management</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Site Identity</CardTitle>
                    <CardDescription>Basic website information and branding</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="site_title">Site Title</Label>
                      <Input
                        id="site_title"
                        value={settings.site_title}
                        onChange={(e) => setSettings(prev => ({ ...prev, site_title: e.target.value }))}
                        placeholder="Enter site title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="site_description">Site Description</Label>
                      <Textarea
                        id="site_description"
                        value={settings.site_description}
                        onChange={(e) => setSettings(prev => ({ ...prev, site_description: e.target.value }))}
                        placeholder="Enter site description"
                      />
                    </div>
                    <div>
                      <Label htmlFor="join_text">Tagline Text</Label>
                      <Input
                        id="join_text"
                        value={settings.join_text}
                        onChange={(e) => setSettings(prev => ({ ...prev, join_text: e.target.value }))}
                        placeholder="JOIN THE FUN !!"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="maintenance_mode"
                        checked={settings.maintenance_mode}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenance_mode: checked }))}
                      />
                      <Label htmlFor="maintenance_mode">Maintenance Mode</Label>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Banner Settings</CardTitle>
                    <CardDescription>Configure top banner and promotional text</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="free_shipping_text">Banner Text</Label>
                      <Input
                        id="free_shipping_text"
                        value={settings.free_shipping_text}
                        onChange={(e) => setSettings(prev => ({ ...prev, free_shipping_text: e.target.value }))}
                        placeholder="FREE SHIPPING ON SELECT ITEMS!"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contact" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>Update your business contact details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contact_email">Contact Email</Label>
                        <Input
                          id="contact_email"
                          type="email"
                          value={settings.contact_email}
                          onChange={(e) => setSettings(prev => ({ ...prev, contact_email: e.target.value }))}
                          placeholder="info@verifiedengine.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact_phone">Contact Phone</Label>
                        <Input
                          id="contact_phone"
                          value={settings.contact_phone}
                          onChange={(e) => setSettings(prev => ({ ...prev, contact_phone: e.target.value }))}
                          placeholder="+357 96115404"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Social Media</CardTitle>
                    <CardDescription>Configure social media links</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="social_facebook">Facebook URL</Label>
                      <Input
                        id="social_facebook"
                        value={settings.social_facebook}
                        onChange={(e) => setSettings(prev => ({ ...prev, social_facebook: e.target.value }))}
                        placeholder="https://facebook.com/yourpage"
                      />
                    </div>
                    <div>
                      <Label htmlFor="social_instagram">Instagram URL</Label>
                      <Input
                        id="social_instagram"
                        value={settings.social_instagram}
                        onChange={(e) => setSettings(prev => ({ ...prev, social_instagram: e.target.value }))}
                        placeholder="https://instagram.com/yourprofile"
                      />
                    </div>
                    <div>
                      <Label htmlFor="social_twitter">Twitter URL</Label>
                      <Input
                        id="social_twitter"
                        value={settings.social_twitter}
                        onChange={(e) => setSettings(prev => ({ ...prev, social_twitter: e.target.value }))}
                        placeholder="https://twitter.com/yourprofile"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="content" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Homepage Content</CardTitle>
                    <CardDescription>Edit main page content and messaging</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="hero_title">Hero Section Title</Label>
                      <Input
                        id="hero_title"
                        value={settings.hero_title}
                        onChange={(e) => setSettings(prev => ({ ...prev, hero_title: e.target.value }))}
                        placeholder="Premium Automotive Engines"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hero_subtitle">Hero Section Subtitle</Label>
                      <Input
                        id="hero_subtitle"
                        value={settings.hero_subtitle}
                        onChange={(e) => setSettings(prev => ({ ...prev, hero_subtitle: e.target.value }))}
                        placeholder="Quality engines you can trust"
                      />
                    </div>
                    <div>
                      <Label htmlFor="footer_text">Footer Text</Label>
                      <Input
                        id="footer_text"
                        value={settings.footer_text}
                        onChange={(e) => setSettings(prev => ({ ...prev, footer_text: e.target.value }))}
                        placeholder="© 2024 Verified Engine. All rights reserved."
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="custom" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Add Custom Content</CardTitle>
                    <CardDescription>Create custom content entries for your website</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="new_key">Content Key</Label>
                        <Input
                          id="new_key"
                          value={newKey}
                          onChange={(e) => setNewKey(e.target.value)}
                          placeholder="e.g., about_us_text"
                        />
                      </div>
                      <div>
                        <Label htmlFor="new_description">Description (Optional)</Label>
                        <Input
                          id="new_description"
                          value={newDescription}
                          onChange={(e) => setNewDescription(e.target.value)}
                          placeholder="What is this content for?"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="new_value">Content Value</Label>
                      <Textarea
                        id="new_value"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        placeholder="Enter the content text or data"
                        rows={3}
                      />
                    </div>
                    <Button onClick={addCustomContent} className="bg-green-500 hover:bg-green-600">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Content
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Existing Custom Content</CardTitle>
                    <CardDescription>Manage all custom content entries</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {contentItems.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No custom content entries found</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {contentItems.map((item) => (
                          <div key={item.id} className="border rounded-lg p-4 bg-white">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline">{item.key}</Badge>
                                  <span className="text-sm text-gray-500">
                                    {new Date(item.updated_at).toLocaleDateString()}
                                  </span>
                                </div>
                                {item.description && (
                                  <p className="text-sm text-gray-600 mb-2 break-words">{item.description}</p>
                                )}
                                <p className="text-sm break-words">{String(item.value).substring(0, 140)}...</p>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteContent(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="status" className="space-y-6">
                <IntegrationStatus />
                <SettingsDebug />
              </TabsContent>

              <TabsContent value="integrations" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tawk.to Live Chat</CardTitle>
                    <CardDescription>Enable and configure your Tawk.to chat widget</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        id="tawk_use_default_launcher"
                        checked={settings.tawk_use_default_launcher}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, tawk_use_default_launcher: checked }))}
                      />
                      <Label htmlFor="tawk_use_default_launcher">Use default Tawk launcher (bubble)</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="tawk_enabled"
                        checked={settings.tawk_enabled}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, tawk_enabled: checked }))}
                      />
                      <Label htmlFor="tawk_enabled">Enable Tawk.to Chat</Label>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="tawk_property_id">Property ID</Label>
                        <Input
                          id="tawk_property_id"
                          value={settings.tawk_property_id}
                          onChange={(e) => setSettings(prev => ({ ...prev, tawk_property_id: e.target.value }))}
                          placeholder="e.g., 5a123456b1234567890cdefg"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tawk_widget_id">Widget ID</Label>
                        <Input
                          id="tawk_widget_id"
                          value={settings.tawk_widget_id}
                          onChange={(e) => setSettings(prev => ({ ...prev, tawk_widget_id: e.target.value }))}
                          placeholder="default"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      Find these values in your Tawk.to dashboard under Admin → Channels → Chat Widget → Direct Chat Link / Embed code.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>3D Chat Avatar (Optional)</CardTitle>
                    <CardDescription>Use a 3D human assistant icon instead of the default bubble</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="tawk_3d_enabled"
                        checked={settings.tawk_3d_enabled}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, tawk_3d_enabled: checked }))}
                      />
                      <Label htmlFor="tawk_3d_enabled">Enable 3D Launcher</Label>
                    </div>
                    <div>
                      <Label htmlFor="tawk_avatar_url">3D Model URL (.glb or .gltf)</Label>
                      <Input
                        id="tawk_avatar_url"
                        value={settings.tawk_avatar_url}
                        onChange={(e) => setSettings(prev => ({ ...prev, tawk_avatar_url: e.target.value }))}
                        placeholder="https://cdn.example.com/models/support-agent.glb"
                      />
                      <p className="text-xs text-gray-500 mt-2">Use a hosted GLB/GLTF model with CORS enabled. You can upload to Supabase Storage and paste the public URL.</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>WhatsApp Chat</CardTitle>
                    <CardDescription>Enable WhatsApp chat button for direct messaging</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        id="whatsapp_enabled"
                        checked={settings.whatsapp_enabled}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, whatsapp_enabled: checked }))}
                      />
                      <Label htmlFor="whatsapp_enabled">Enable WhatsApp Chat</Label>
                    </div>
                    
                    {settings.whatsapp_enabled && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
                          <Input
                            id="whatsapp_number"
                            value={settings.whatsapp_number}
                            onChange={(e) => setSettings(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                            placeholder="+35796115404"
                          />
                          <p className="text-xs text-gray-500 mt-1">Include country code (e.g., +35796115404)</p>
                        </div>
                        
                        <div>
                          <Label htmlFor="whatsapp_message">Default Message</Label>
                          <Textarea
                            id="whatsapp_message"
                            value={settings.whatsapp_message}
                            onChange={(e) => setSettings(prev => ({ ...prev, whatsapp_message: e.target.value }))}
                            placeholder="Hi! I'm interested in your products. Can you help me?"
                            rows={3}
                          />
                          <p className="text-xs text-gray-500 mt-1">This message will be pre-filled when users click the WhatsApp button</p>
                        </div>
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-600">
                      <strong>Preview:</strong> When enabled, a WhatsApp button will appear on your website with the text "WhatsApp" that opens WhatsApp with your number and pre-filled message.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Google Ads Integration</CardTitle>
                    <CardDescription>Enable Google Ads tracking and conversion measurement</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        id="google_ads_enabled"
                        checked={settings.google_ads_enabled}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, google_ads_enabled: checked }))}
                      />
                      <Label htmlFor="google_ads_enabled">Enable Google Ads</Label>
                    </div>
                    
                    {settings.google_ads_enabled && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="google_ads_code">Google Ads Code</Label>
                          <Textarea
                            id="google_ads_code"
                            value={settings.google_ads_code}
                            onChange={(e) => setSettings(prev => ({ ...prev, google_ads_code: e.target.value }))}
                            placeholder='<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3802811303973258"&#10;     crossorigin="anonymous"></script>'
                            rows={6}
                          />
                          <p className="text-xs text-gray-500 mt-1">Paste your Google Ads conversion tracking code here</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Google Ads Test Component */}
                    {settings.google_ads_enabled && settings.google_ads_code && (
                      <div className="mt-4 space-y-4">
                        <GoogleAdsTest />
                        <GoogleAdsDiagnostic />
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-600">
                      <strong>Note:</strong> Google Ads code will be automatically added to your website head section when enabled.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Google Analytics & Tag Manager</CardTitle>
                    <CardDescription>Track website analytics and manage marketing tags</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        id="google_analytics_enabled"
                        checked={settings.google_analytics_enabled}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, google_analytics_enabled: checked }))}
                      />
                      <Label htmlFor="google_analytics_enabled">Enable Google Analytics</Label>
                    </div>
                    
                    {settings.google_analytics_enabled && (
                      <div>
                        <Label htmlFor="google_analytics_id">Google Analytics ID</Label>
                        <Input
                          id="google_analytics_id"
                          value={settings.google_analytics_id}
                          onChange={(e) => setSettings(prev => ({ ...prev, google_analytics_id: e.target.value }))}
                          placeholder="G-XXXXXXXXXX"
                        />
                        <p className="text-xs text-gray-500 mt-1">Your Google Analytics 4 measurement ID</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Switch
                        id="google_tag_manager_enabled"
                        checked={settings.google_tag_manager_enabled}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, google_tag_manager_enabled: checked }))}
                      />
                      <Label htmlFor="google_tag_manager_enabled">Enable Google Tag Manager</Label>
                    </div>
                    
                    {settings.google_tag_manager_enabled && (
                      <div>
                        <Label htmlFor="google_tag_manager_id">Google Tag Manager ID</Label>
                        <Input
                          id="google_tag_manager_id"
                          value={settings.google_tag_manager_id}
                          onChange={(e) => setSettings(prev => ({ ...prev, google_tag_manager_id: e.target.value }))}
                          placeholder="GTM-XXXXXXX"
                        />
                        <p className="text-xs text-gray-500 mt-1">Your Google Tag Manager container ID</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>SEO & Social Media</CardTitle>
                    <CardDescription>Optimize your website for search engines and social media sharing</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="seo_meta_title">Meta Title</Label>
                        <Input
                          id="seo_meta_title"
                          value={settings.seo_meta_title}
                          onChange={(e) => setSettings(prev => ({ ...prev, seo_meta_title: e.target.value }))}
                          placeholder="Your website title"
                        />
                        <p className="text-xs text-gray-500 mt-1">Title for search engines (50-60 characters)</p>
                      </div>
                      
                      <div>
                        <Label htmlFor="seo_meta_description">Meta Description</Label>
                        <Textarea
                          id="seo_meta_description"
                          value={settings.seo_meta_description}
                          onChange={(e) => setSettings(prev => ({ ...prev, seo_meta_description: e.target.value }))}
                          placeholder="Your website description"
                          rows={2}
                        />
                        <p className="text-xs text-gray-500 mt-1">Description for search engines (150-160 characters)</p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="seo_meta_keywords">Meta Keywords</Label>
                      <Input
                        id="seo_meta_keywords"
                        value={settings.seo_meta_keywords}
                        onChange={(e) => setSettings(prev => ({ ...prev, seo_meta_keywords: e.target.value }))}
                        placeholder="keyword1, keyword2, keyword3"
                      />
                      <p className="text-xs text-gray-500 mt-1">Comma-separated keywords for SEO</p>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3">Open Graph (Facebook/LinkedIn)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="seo_og_title">OG Title</Label>
                          <Input
                            id="seo_og_title"
                            value={settings.seo_og_title}
                            onChange={(e) => setSettings(prev => ({ ...prev, seo_og_title: e.target.value }))}
                            placeholder="Title for social media"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="seo_og_image">OG Image URL</Label>
                          <Input
                            id="seo_og_image"
                            value={settings.seo_og_image}
                            onChange={(e) => setSettings(prev => ({ ...prev, seo_og_image: e.target.value }))}
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Label htmlFor="seo_og_description">OG Description</Label>
                        <Textarea
                          id="seo_og_description"
                          value={settings.seo_og_description}
                          onChange={(e) => setSettings(prev => ({ ...prev, seo_og_description: e.target.value }))}
                          placeholder="Description for social media"
                          rows={2}
                        />
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3">Twitter Cards</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="seo_twitter_title">Twitter Title</Label>
                          <Input
                            id="seo_twitter_title"
                            value={settings.seo_twitter_title}
                            onChange={(e) => setSettings(prev => ({ ...prev, seo_twitter_title: e.target.value }))}
                            placeholder="Title for Twitter"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="seo_twitter_image">Twitter Image URL</Label>
                          <Input
                            id="seo_twitter_image"
                            value={settings.seo_twitter_image}
                            onChange={(e) => setSettings(prev => ({ ...prev, seo_twitter_image: e.target.value }))}
                            placeholder="https://example.com/twitter-image.jpg"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Label htmlFor="seo_twitter_description">Twitter Description</Label>
                        <Textarea
                          id="seo_twitter_description"
                          value={settings.seo_twitter_description}
                          onChange={(e) => setSettings(prev => ({ ...prev, seo_twitter_description: e.target.value }))}
                          placeholder="Description for Twitter"
                          rows={2}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ads">
                <AdManagementPanel />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}