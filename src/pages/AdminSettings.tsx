import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAllSettings, upsertSetting } from '@/services/websiteSettingsService';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [generalSettings, setGeneralSettings] = useState({
    site_name: 'Engine Parts Store',
    site_description: 'Premium engine parts and components',
    contact_email: 'contact@engineparts.com',
    contact_phone: '+35796115404',
    address: '123 Engine St, Motor City, MC 12345',
    facebook_url: '',
    twitter_url: '',
    instagram_url: '',
    linkedin_url: '',
  });

  const [businessSettings, setBusinessSettings] = useState({
    tax_rate: '8.5',
    shipping_rate: '15.00',
    free_shipping_threshold: '100.00',
    currency: 'USD',
    timezone: 'America/New_York',
    business_hours: 'Mon-Fri 9AM-6PM EST',
  });

  const [emailSettings, setEmailSettings] = useState({
    enable_order_confirmations: true,
    enable_shipping_notifications: true,
    enable_newsletter: true,
    smtp_host: 'smtp.gmail.com',
    smtp_port: '587',
    smtp_username: 'verifiedengines@gmail.com',
    smtp_password: 'iyny cwvk uynx gvez',
    // Contact reply email settings
    enable_contact_replies: true,
    contact_reply_from: 'verifiedengines@gmail.com',
    contact_reply_name: 'Engine Markets',
    email_service_type: 'smtp', // 'smtp', 'webhook', 'resend'
    email_webhook_url: 'https://hooks.zapier.com/hooks/catch/24823540/u9tsqv8/',
    resend_api_key: '',
  });

  const [paymentSettings, setPaymentSettings] = useState({
    stripe_enabled: true,
    stripe_publishable_key: 'pk_live_51RI3Og05wvGS0fkuSwSAG8cUjInZXp3EnJVOwC53c0FMwNEjKx2S1NmCB9WmlmWxbHyreYTFJj4EwGsV4lVJ7UxE00EA0cvuYb',
    stripe_secret_key: '', // Will be set by admin
    paypal_enabled: false,
    paypal_client_id: '',
    paypal_client_secret: '',
    paypal_mode: 'live', // Changed to live mode
    square_enabled: false,
    square_application_id: '',
    square_access_token: '',
    square_location_id: '',
    razorpay_enabled: false,
    razorpay_key_id: '',
    razorpay_key_secret: '',
    apple_pay_enabled: false,
    google_pay_enabled: false,
    test_mode: false, // Changed to live mode
    // Cryptocurrency settings
    crypto_enabled: true,
    bitcoin_address: '1NqUvkxoUJDdMRRZu3PUjj68Ro9Ki2UEkc',
    ethereum_address: '0x7d2E576De04A87bF1d5B754b3A07ED0619F141a5',
    usdt_address: '0x7d2E576De04A87bF1d5B754b3A07ED0619F141a5',
    bnb_address: '0x7d2E576De04A87bF1d5B754b3A07ED0619F141a5',
  });

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await getAllSettings();
      if (!data) throw new Error('Could not fetch settings');

      // Convert array of settings to grouped objects
      if (data) {
        const settings = data.reduce((acc: Record<string, unknown>, setting: { key: string; value: unknown }) => {
          acc[setting.key] = setting.value;
          return acc;
        }, {});

        // Update state with loaded settings
        setGeneralSettings({
          site_name: (settings.site_name as string) || '',
          site_description: (settings.site_description as string) || '',
          contact_email: (settings.contact_email as string) || '',
          contact_phone: (settings.contact_phone as string) || '',
          address: (settings.address as string) || '',
          facebook_url: (settings.facebook_url as string) || '',
          twitter_url: (settings.twitter_url as string) || '',
          instagram_url: (settings.instagram_url as string) || '',
          linkedin_url: (settings.linkedin_url as string) || '',
        });

        setBusinessSettings({
          tax_rate: (settings.tax_rate as string) || '8.5',
          shipping_rate: (settings.shipping_rate as string) || '15.00',
          free_shipping_threshold: (settings.free_shipping_threshold as string) || '100.00',
          currency: (settings.currency as string) || 'USD',
          timezone: (settings.timezone as string) || 'America/New_York',
          business_hours: (settings.business_hours as string) || 'Mon-Fri 9AM-6PM EST',
        });

        setEmailSettings({
          enable_order_confirmations: (settings.enable_order_confirmations as boolean) || true,
          enable_shipping_notifications: (settings.enable_shipping_notifications as boolean) || true,
          enable_newsletter: (settings.enable_newsletter as boolean) || true,
          smtp_host: (settings.smtp_host as string) || '',
          smtp_port: (settings.smtp_port as string) || '587',
          smtp_username: (settings.smtp_username as string) || '',
          smtp_password: (settings.smtp_password as string) || '',
        });

        setPaymentSettings({
          stripe_enabled: (settings.stripe_enabled as boolean) || false,
          stripe_publishable_key: (settings.stripe_publishable_key as string) || '',
          stripe_secret_key: (settings.stripe_secret_key as string) || '',
          paypal_enabled: (settings.paypal_enabled as boolean) || false,
          paypal_client_id: (settings.paypal_client_id as string) || '',
          paypal_client_secret: (settings.paypal_client_secret as string) || '',
          paypal_mode: (settings.paypal_mode as string) || 'sandbox',
          square_enabled: (settings.square_enabled as boolean) || false,
          square_application_id: (settings.square_application_id as string) || '',
          square_access_token: (settings.square_access_token as string) || '',
          square_location_id: (settings.square_location_id as string) || '',
          razorpay_enabled: (settings.razorpay_enabled as boolean) || false,
          razorpay_key_id: (settings.razorpay_key_id as string) || '',
          razorpay_key_secret: (settings.razorpay_key_secret as string) || '',
          apple_pay_enabled: (settings.apple_pay_enabled as boolean) || false,
          google_pay_enabled: (settings.google_pay_enabled as boolean) || false,
          test_mode: (settings.test_mode as boolean) || true,
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: "Error",
        description: `Failed to load settings: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount


  const saveSettings = async (settingsType: string, settings: Record<string, unknown>) => {
    setSaving(true);
    try {
      const row = {
        key: settingsType,
        value: JSON.parse(JSON.stringify(settings)),
        description: `${settingsType.replace('_', ' ')} configuration`
      };
      await upsertSetting(row);

      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to save settings',
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        
        <main className="flex-1 min-w-0">
          <header className="bg-background border-b p-3 sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <SidebarTrigger />
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold truncate">Admin Settings</h1>
                  <p className="text-muted-foreground text-sm">Configure website and business settings</p>
                </div>
              </div>
            </div>
          </header>

          <div className="p-4 sm:p-6">
            <Tabs defaultValue="general" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="business">Business</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="payment">Payment</TabsTrigger>
              </TabsList>

              <TabsContent value="general">
                <Card>
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="site_name">Site Name</Label>
                        <Input
                          id="site_name"
                          value={generalSettings.site_name}
                          onChange={(e) => setGeneralSettings({
                            ...generalSettings,
                            site_name: e.target.value
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact_email">Contact Email</Label>
                        <Input
                          id="contact_email"
                          type="email"
                          value={generalSettings.contact_email}
                          onChange={(e) => setGeneralSettings({
                            ...generalSettings,
                            contact_email: e.target.value
                          })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="site_description">Site Description</Label>
                      <Textarea
                        id="site_description"
                        value={generalSettings.site_description}
                        onChange={(e) => setGeneralSettings({
                          ...generalSettings,
                          site_description: e.target.value
                        })}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contact_phone">Contact Phone</Label>
                        <Input
                          id="contact_phone"
                          value={generalSettings.contact_phone}
                          onChange={(e) => setGeneralSettings({
                            ...generalSettings,
                            contact_phone: e.target.value
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={generalSettings.address}
                          onChange={(e) => setGeneralSettings({
                            ...generalSettings,
                            address: e.target.value
                          })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="facebook_url">Facebook URL</Label>
                        <Input
                          id="facebook_url"
                          value={generalSettings.facebook_url}
                          onChange={(e) => setGeneralSettings({
                            ...generalSettings,
                            facebook_url: e.target.value
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="twitter_url">Twitter URL</Label>
                        <Input
                          id="twitter_url"
                          value={generalSettings.twitter_url}
                          onChange={(e) => setGeneralSettings({
                            ...generalSettings,
                            twitter_url: e.target.value
                          })}
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={() => saveSettings('general_settings', generalSettings)}
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save General Settings'}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="business">
                <Card>
                  <CardHeader>
                    <CardTitle>Business Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                        <Input
                          id="tax_rate"
                          type="number"
                          step="0.1"
                          value={businessSettings.tax_rate}
                          onChange={(e) => setBusinessSettings({
                            ...businessSettings,
                            tax_rate: e.target.value
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="shipping_rate">Shipping Rate ($)</Label>
                        <Input
                          id="shipping_rate"
                          type="number"
                          step="0.01"
                          value={businessSettings.shipping_rate}
                          onChange={(e) => setBusinessSettings({
                            ...businessSettings,
                            shipping_rate: e.target.value
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="free_shipping_threshold">Free Shipping Threshold ($)</Label>
                        <Input
                          id="free_shipping_threshold"
                          type="number"
                          step="0.01"
                          value={businessSettings.free_shipping_threshold}
                          onChange={(e) => setBusinessSettings({
                            ...businessSettings,
                            free_shipping_threshold: e.target.value
                          })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Input
                          id="currency"
                          value={businessSettings.currency}
                          onChange={(e) => setBusinessSettings({
                            ...businessSettings,
                            currency: e.target.value
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Input
                          id="timezone"
                          value={businessSettings.timezone}
                          onChange={(e) => setBusinessSettings({
                            ...businessSettings,
                            timezone: e.target.value
                          })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="business_hours">Business Hours</Label>
                      <Input
                        id="business_hours"
                        value={businessSettings.business_hours}
                        onChange={(e) => setBusinessSettings({
                          ...businessSettings,
                          business_hours: e.target.value
                        })}
                      />
                    </div>

                    <Button 
                      onClick={() => saveSettings('business_settings', businessSettings)}
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Business Settings'}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="email">
                <Card>
                  <CardHeader>
                    <CardTitle>Email Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Switch
                          id="enable_order_confirmations"
                          checked={emailSettings.enable_order_confirmations}
                          onCheckedChange={(checked) => setEmailSettings({
                            ...emailSettings,
                            enable_order_confirmations: checked
                          })}
                        />
                        <Label htmlFor="enable_order_confirmations">Enable Order Confirmations</Label>
                      </div>

                    <div className="flex items-center gap-2">
                        <Switch
                          id="enable_shipping_notifications"
                          checked={emailSettings.enable_shipping_notifications}
                          onCheckedChange={(checked) => setEmailSettings({
                            ...emailSettings,
                            enable_shipping_notifications: checked
                          })}
                        />
                        <Label htmlFor="enable_shipping_notifications">Enable Shipping Notifications</Label>
                      </div>

                    <div className="flex items-center gap-2">
                        <Switch
                          id="enable_newsletter"
                          checked={emailSettings.enable_newsletter}
                          onCheckedChange={(checked) => setEmailSettings({
                            ...emailSettings,
                            enable_newsletter: checked
                          })}
                        />
                        <Label htmlFor="enable_newsletter">Enable Newsletter</Label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="smtp_host">SMTP Host</Label>
                        <Input
                          id="smtp_host"
                          value={emailSettings.smtp_host}
                          onChange={(e) => setEmailSettings({
                            ...emailSettings,
                            smtp_host: e.target.value
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtp_port">SMTP Port</Label>
                        <Input
                          id="smtp_port"
                          value={emailSettings.smtp_port}
                          onChange={(e) => setEmailSettings({
                            ...emailSettings,
                            smtp_port: e.target.value
                          })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="smtp_username">SMTP Username</Label>
                        <Input
                          id="smtp_username"
                          value={emailSettings.smtp_username}
                          onChange={(e) => setEmailSettings({
                            ...emailSettings,
                            smtp_username: e.target.value
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtp_password">SMTP Password</Label>
                        <Input
                          id="smtp_password"
                          type="password"
                          value={emailSettings.smtp_password}
                          onChange={(e) => setEmailSettings({
                            ...emailSettings,
                            smtp_password: e.target.value
                          })}
                        />
                      </div>
                    </div>

                    {/* Contact Reply Email Settings */}
                    <div className="border-t pt-6 mt-6">
                      <h3 className="text-lg font-semibold mb-4">Contact Reply Email Settings</h3>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <Switch
                          id="enable_contact_replies"
                          checked={emailSettings.enable_contact_replies}
                          onCheckedChange={(checked) => setEmailSettings({
                            ...emailSettings,
                            enable_contact_replies: checked
                          })}
                        />
                        <Label htmlFor="enable_contact_replies">Enable Contact Reply Emails</Label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contact_reply_from">Reply From Email</Label>
                          <Input
                            id="contact_reply_from"
                            value={emailSettings.contact_reply_from}
                            onChange={(e) => setEmailSettings({
                              ...emailSettings,
                              contact_reply_from: e.target.value
                            })}
                            placeholder="support@enginecore.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contact_reply_name">Reply From Name</Label>
                          <Input
                            id="contact_reply_name"
                            value={emailSettings.contact_reply_name}
                            onChange={(e) => setEmailSettings({
                              ...emailSettings,
                              contact_reply_name: e.target.value
                            })}
                            placeholder="EngineCore Support"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 mt-4">
                        <Label htmlFor="email_service_type">Email Service Type</Label>
                        <select
                          id="email_service_type"
                          value={emailSettings.email_service_type}
                          onChange={(e) => setEmailSettings({
                            ...emailSettings,
                            email_service_type: e.target.value
                          })}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="webhook">Webhook (Recommended)</option>
                          <option value="smtp">SMTP</option>
                          <option value="resend">Resend API</option>
                        </select>
                      </div>

                      {emailSettings.email_service_type === 'webhook' && (
                        <div className="space-y-2 mt-4">
                          <Label htmlFor="email_webhook_url">Webhook URL</Label>
                          <Input
                            id="email_webhook_url"
                            value={emailSettings.email_webhook_url}
                            onChange={(e) => setEmailSettings({
                              ...emailSettings,
                              email_webhook_url: e.target.value
                            })}
                            placeholder="https://hooks.zapier.com/hooks/catch/..."
                          />
                          <p className="text-sm text-muted-foreground">
                            Use Zapier, Make.com, or similar service to send emails
                          </p>
                        </div>
                      )}

                      {emailSettings.email_service_type === 'resend' && (
                        <div className="space-y-2 mt-4">
                          <Label htmlFor="resend_api_key">Resend API Key</Label>
                          <Input
                            id="resend_api_key"
                            type="password"
                            value={emailSettings.resend_api_key}
                            onChange={(e) => setEmailSettings({
                              ...emailSettings,
                              resend_api_key: e.target.value
                            })}
                            placeholder="re_..."
                          />
                        </div>
                      )}
                    </div>

                    <Button 
                      onClick={() => saveSettings('email_settings', emailSettings)}
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Email Settings'}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payment">
                <div className="space-y-6">
                  {/* Test Mode Toggle */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Configuration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <Switch
                          id="test_mode"
                          checked={paymentSettings.test_mode}
                          onCheckedChange={(checked) => setPaymentSettings({
                            ...paymentSettings,
                            test_mode: checked
                          })}
                        />
                        <Label htmlFor="test_mode">Test Mode (Use sandbox/test credentials)</Label>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Stripe Configuration */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Stripe Payment Gateway</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="stripe_enabled"
                          checked={paymentSettings.stripe_enabled}
                          onCheckedChange={(checked) => setPaymentSettings({
                            ...paymentSettings,
                            stripe_enabled: checked
                          })}
                        />
                        <Label htmlFor="stripe_enabled">Enable Stripe Payments</Label>
                      </div>

                      {paymentSettings.stripe_enabled && (
                        <div className="grid grid-cols-1 gap-4 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="stripe_publishable_key">Stripe Publishable Key</Label>
                            <Input
                              id="stripe_publishable_key"
                              placeholder={paymentSettings.test_mode ? "pk_test_..." : "pk_live_..."}
                              value={paymentSettings.stripe_publishable_key}
                              onChange={(e) => setPaymentSettings({
                                ...paymentSettings,
                                stripe_publishable_key: e.target.value
                              })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="stripe_secret_key">Stripe Secret Key</Label>
                            <Input
                              id="stripe_secret_key"
                              type="password"
                              placeholder={paymentSettings.test_mode ? "sk_test_..." : "sk_live_..."}
                              value={paymentSettings.stripe_secret_key}
                              onChange={(e) => setPaymentSettings({
                                ...paymentSettings,
                                stripe_secret_key: e.target.value
                              })}
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* PayPal Configuration */}
                  <Card>
                    <CardHeader>
                      <CardTitle>PayPal Payment Gateway</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          id="paypal_enabled"
                          checked={paymentSettings.paypal_enabled}
                          onCheckedChange={(checked) => setPaymentSettings({
                            ...paymentSettings,
                            paypal_enabled: checked
                          })}
                        />
                        <Label htmlFor="paypal_enabled">Enable PayPal Payments</Label>
                      </div>

                      {paymentSettings.paypal_enabled && (
                        <div className="grid grid-cols-1 gap-4 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="paypal_client_id">PayPal Client ID</Label>
                            <Input
                              id="paypal_client_id"
                              value={paymentSettings.paypal_client_id}
                              onChange={(e) => setPaymentSettings({
                                ...paymentSettings,
                                paypal_client_id: e.target.value
                              })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="paypal_client_secret">PayPal Client Secret</Label>
                            <Input
                              id="paypal_client_secret"
                              type="password"
                              value={paymentSettings.paypal_client_secret}
                              onChange={(e) => setPaymentSettings({
                                ...paymentSettings,
                                paypal_client_secret: e.target.value
                              })}
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Cryptocurrency Configuration */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Cryptocurrency Payments</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          id="crypto_enabled"
                          checked={paymentSettings.crypto_enabled}
                          onCheckedChange={(checked) => setPaymentSettings({
                            ...paymentSettings,
                            crypto_enabled: checked
                          })}
                        />
                        <Label htmlFor="crypto_enabled">Enable Cryptocurrency Payments</Label>
                      </div>

                      {paymentSettings.crypto_enabled && (
                        <div className="grid grid-cols-1 gap-4 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="bitcoin_address">Bitcoin Address</Label>
                            <Input
                              id="bitcoin_address"
                              value={paymentSettings.bitcoin_address}
                              onChange={(e) => setPaymentSettings({
                                ...paymentSettings,
                                bitcoin_address: e.target.value
                              })}
                              placeholder="1NqUvkxoUJDdMRRZu3PUjj68Ro9Ki2UEkc"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="ethereum_address">Ethereum Address</Label>
                            <Input
                              id="ethereum_address"
                              value={paymentSettings.ethereum_address}
                              onChange={(e) => setPaymentSettings({
                                ...paymentSettings,
                                ethereum_address: e.target.value
                              })}
                              placeholder="0x7d2E576De04A87bF1d5B754b3A07ED0619F141a5"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="usdt_address">USDT Address</Label>
                            <Input
                              id="usdt_address"
                              value={paymentSettings.usdt_address}
                              onChange={(e) => setPaymentSettings({
                                ...paymentSettings,
                                usdt_address: e.target.value
                              })}
                              placeholder="0x7d2E576De04A87bF1d5B754b3A07ED0619F141a5"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bnb_address">BNB Address</Label>
                            <Input
                              id="bnb_address"
                              value={paymentSettings.bnb_address}
                              onChange={(e) => setPaymentSettings({
                                ...paymentSettings,
                                bnb_address: e.target.value
                              })}
                              placeholder="0x7d2E576De04A87bF1d5B754b3A07ED0619F141a5"
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Square Configuration */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Square Payment Gateway</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          id="square_enabled"
                          checked={paymentSettings.square_enabled}
                          onCheckedChange={(checked) => setPaymentSettings({
                            ...paymentSettings,
                            square_enabled: checked
                          })}
                        />
                        <Label htmlFor="square_enabled">Enable Square Payments</Label>
                      </div>

                      {paymentSettings.square_enabled && (
                        <div className="grid grid-cols-1 gap-4 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="square_application_id">Square Application ID</Label>
                            <Input
                              id="square_application_id"
                              value={paymentSettings.square_application_id}
                              onChange={(e) => setPaymentSettings({
                                ...paymentSettings,
                                square_application_id: e.target.value
                              })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="square_access_token">Square Access Token</Label>
                            <Input
                              id="square_access_token"
                              type="password"
                              value={paymentSettings.square_access_token}
                              onChange={(e) => setPaymentSettings({
                                ...paymentSettings,
                                square_access_token: e.target.value
                              })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="square_location_id">Square Location ID</Label>
                            <Input
                              id="square_location_id"
                              value={paymentSettings.square_location_id}
                              onChange={(e) => setPaymentSettings({
                                ...paymentSettings,
                                square_location_id: e.target.value
                              })}
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Razorpay Configuration */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Razorpay Payment Gateway</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          id="razorpay_enabled"
                          checked={paymentSettings.razorpay_enabled}
                          onCheckedChange={(checked) => setPaymentSettings({
                            ...paymentSettings,
                            razorpay_enabled: checked
                          })}
                        />
                        <Label htmlFor="razorpay_enabled">Enable Razorpay Payments</Label>
                      </div>

                      {paymentSettings.razorpay_enabled && (
                        <div className="grid grid-cols-1 gap-4 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="razorpay_key_id">Razorpay Key ID</Label>
                            <Input
                              id="razorpay_key_id"
                              value={paymentSettings.razorpay_key_id}
                              onChange={(e) => setPaymentSettings({
                                ...paymentSettings,
                                razorpay_key_id: e.target.value
                              })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="razorpay_key_secret">Razorpay Key Secret</Label>
                            <Input
                              id="razorpay_key_secret"
                              type="password"
                              value={paymentSettings.razorpay_key_secret}
                              onChange={(e) => setPaymentSettings({
                                ...paymentSettings,
                                razorpay_key_secret: e.target.value
                              })}
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Digital Wallets */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Digital Wallets</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="apple_pay_enabled"
                          checked={paymentSettings.apple_pay_enabled}
                          onCheckedChange={(checked) => setPaymentSettings({
                            ...paymentSettings,
                            apple_pay_enabled: checked
                          })}
                        />
                        <Label htmlFor="apple_pay_enabled">Enable Apple Pay</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="google_pay_enabled"
                          checked={paymentSettings.google_pay_enabled}
                          onCheckedChange={(checked) => setPaymentSettings({
                            ...paymentSettings,
                            google_pay_enabled: checked
                          })}
                        />
                        <Label htmlFor="google_pay_enabled">Enable Google Pay</Label>
                      </div>
                    </CardContent>
                  </Card>

                  <Button 
                    onClick={() => saveSettings('payment_settings', paymentSettings)}
                    disabled={saving}
                    className="w-full"
                  >
                    {saving ? 'Saving...' : 'Save Payment Settings'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}