import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, TrendingUp, Eye, MousePointer, ChevronDown, ChevronUp, Settings, BarChart3 } from 'lucide-react';

export const AdManagementPanel = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Ad settings state
  const [adSettings, setAdSettings] = useState({
    ads_enabled: false,
    google_adsense_enabled: false,
    google_adsense_id: '',
    direct_ads_enabled: false,
    
    // Header ad
    ad_header: '',
    ad_header_type: 'adsense',
    ad_header_slot: '',
    
    // Sidebar ad
    ad_sidebar: '',
    ad_sidebar_type: 'adsense', 
    ad_sidebar_slot: '',
    
    // Footer ad
    ad_footer: '',
    ad_footer_type: 'adsense',
    ad_footer_slot: '',
    
    // Content ad
    ad_content: '',
    ad_content_type: 'adsense',
    ad_content_slot: '',
    
    // Mobile ad
    ad_mobile: '',
    ad_mobile_type: 'adsense',
    ad_mobile_slot: ''
  });

  // Mock analytics data (you can connect to real analytics later)
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalClicks: 0,
    impressions: 0,
    ctr: 0,
    cpc: 0
  });

  const saveAdSettings = async () => {
    setSaving(true);
    try {
      // Here you would save to your database
      // For now, we'll simulate the save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Ad settings saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to save ad settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const AdPositionCard = ({ 
    position, 
    title, 
    description 
  }: { 
    position: string; 
    title: string; 
    description: string; 
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor={`ad_${position}_type`}>Ad Type</Label>
          <Select
            value={adSettings[`ad_${position}_type` as keyof typeof adSettings] as string}
            onValueChange={(value) => 
              setAdSettings(prev => ({ ...prev, [`ad_${position}_type`]: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="adsense">Google AdSense</SelectItem>
              <SelectItem value="direct">Direct Advertisement</SelectItem>
              <SelectItem value="custom">Custom HTML/JS</SelectItem>
              <SelectItem value="placeholder">Placeholder (Testing)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(adSettings[`ad_${position}_type` as keyof typeof adSettings] === 'adsense') && (
          <div>
            <Label htmlFor={`ad_${position}_slot`}>AdSense Ad Slot ID</Label>
            <Input
              id={`ad_${position}_slot`}
              value={adSettings[`ad_${position}_slot` as keyof typeof adSettings] as string}
              onChange={(e) => 
                setAdSettings(prev => ({ ...prev, [`ad_${position}_slot`]: e.target.value }))
              }
              placeholder="1234567890"
            />
          </div>
        )}

        {(adSettings[`ad_${position}_type` as keyof typeof adSettings] === 'direct' || 
          adSettings[`ad_${position}_type` as keyof typeof adSettings] === 'custom') && (
          <div>
            <Label htmlFor={`ad_${position}`}>Ad Code</Label>
            <Textarea
              id={`ad_${position}`}
              value={adSettings[`ad_${position}` as keyof typeof adSettings] as string}
              onChange={(e) => 
                setAdSettings(prev => ({ ...prev, [`ad_${position}`]: e.target.value }))
              }
              placeholder="Enter HTML/JavaScript ad code here"
              rows={4}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      {/* Compact Header with Quick Stats */}
      <Card className="border-l-4 border-l-green-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-sm font-medium">Advertisement Management</div>
                  <div className="text-xs text-muted-foreground">
                    Status: {adSettings.ads_enabled ? 'Active' : 'Inactive'} • 
                    Revenue: ${analytics.monthlyRevenue}/month
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="ads_enabled_quick"
                  checked={adSettings.ads_enabled}
                  onCheckedChange={(checked) => 
                    setAdSettings(prev => ({ ...prev, ads_enabled: checked }))
                  }
                />
                <Label htmlFor="ads_enabled_quick" className="text-sm">Enable Ads</Label>
              </div>
              
              <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4 mr-1" />
                    {isExpanded ? 'Hide Settings' : 'Show Settings'}
                    {isExpanded ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                  </Button>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="mt-4">
                  <div className="border-t pt-4">
                    <Tabs defaultValue="settings" className="space-y-4">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
                        <TabsTrigger value="placements" className="text-xs">Placements</TabsTrigger>
                        <TabsTrigger value="analytics" className="text-xs">Analytics</TabsTrigger>
                        <TabsTrigger value="guide" className="text-xs">Guide</TabsTrigger>
                      </TabsList>

                      <TabsContent value="settings" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base">General Ad Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="google_adsense_enabled"
                                  checked={adSettings.google_adsense_enabled}
                                  onCheckedChange={(checked) => 
                                    setAdSettings(prev => ({ ...prev, google_adsense_enabled: checked }))
                                  }
                                />
                                <Label htmlFor="google_adsense_enabled" className="text-sm">Enable Google AdSense</Label>
                              </div>

                              {adSettings.google_adsense_enabled && (
                                <div>
                                  <Label htmlFor="google_adsense_id" className="text-sm">Google AdSense Publisher ID</Label>
                                  <Input
                                    id="google_adsense_id"
                                    value={adSettings.google_adsense_id}
                                    onChange={(e) => 
                                      setAdSettings(prev => ({ ...prev, google_adsense_id: e.target.value }))
                                    }
                                    placeholder="ca-pub-1234567890123456"
                                    className="text-sm"
                                  />
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Find this in your AdSense account under "Account" → "Account information"
                                  </p>
                                </div>
                              )}

                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="direct_ads_enabled"
                                  checked={adSettings.direct_ads_enabled}
                                  onCheckedChange={(checked) => 
                                    setAdSettings(prev => ({ ...prev, direct_ads_enabled: checked }))
                                  }
                                />
                                <Label htmlFor="direct_ads_enabled" className="text-sm">Enable Direct Advertisements</Label>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base flex items-center">
                                <BarChart3 className="h-4 w-4 mr-2" />
                                Quick Stats
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                  <div className="text-xs text-muted-foreground">Monthly Revenue</div>
                                  <div className="font-semibold text-green-600">${analytics.monthlyRevenue}</div>
                                </div>
                                <div>
                                  <div className="text-xs text-muted-foreground">Total Clicks</div>
                                  <div className="font-semibold">{analytics.totalClicks}</div>
                                </div>
                                <div>
                                  <div className="text-xs text-muted-foreground">Impressions</div>
                                  <div className="font-semibold">{analytics.impressions}</div>
                                </div>
                                <div>
                                  <div className="text-xs text-muted-foreground">CTR</div>
                                  <div className="font-semibold">{analytics.ctr}%</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>

                      <TabsContent value="placements" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <AdPositionCard
                            position="header"
                            title="Header Banner"
                            description="728x90 banner at the top of every page"
                          />
                          
                          <AdPositionCard
                            position="sidebar"
                            title="Sidebar Ad"
                            description="300x250 rectangle in the sidebar"
                          />
                          
                          <AdPositionCard
                            position="footer"
                            title="Footer Banner"
                            description="728x90 banner at the bottom of pages"
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="analytics" className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-2">
                                <DollarSign className="h-4 w-4 text-green-600" />
                                <span className="text-xs font-medium">Total Revenue</span>
                              </div>
                              <div className="text-lg font-bold">${analytics.totalRevenue}</div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-2">
                                <TrendingUp className="h-4 w-4 text-blue-600" />
                                <span className="text-xs font-medium">Monthly</span>
                              </div>
                              <div className="text-lg font-bold">${analytics.monthlyRevenue}</div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-2">
                                <MousePointer className="h-4 w-4 text-purple-600" />
                                <span className="text-xs font-medium">Clicks</span>
                              </div>
                              <div className="text-lg font-bold">{analytics.totalClicks}</div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-2">
                                <Eye className="h-4 w-4 text-orange-600" />
                                <span className="text-xs font-medium">Views</span>
                              </div>
                              <div className="text-lg font-bold">{analytics.impressions}</div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>

                      <TabsContent value="guide" className="space-y-4">
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">Quick Setup Guide</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="text-sm space-y-2">
                              <div className="flex items-start space-x-2">
                                <div className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center mt-0.5">1</div>
                                <div>
                                  <div className="font-medium">Apply for Google AdSense</div>
                                  <div className="text-xs text-muted-foreground">Visit google.com/adsense and apply</div>
                                </div>
                              </div>
                              
                              <div className="flex items-start space-x-2">
                                <div className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center mt-0.5">2</div>
                                <div>
                                  <div className="font-medium">Get Publisher ID</div>
                                  <div className="text-xs text-muted-foreground">Copy your ca-pub-xxxxxxxxx ID</div>
                                </div>
                              </div>
                              
                              <div className="flex items-start space-x-2">
                                <div className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center mt-0.5">3</div>
                                <div>
                                  <div className="font-medium">Enable Ads</div>
                                  <div className="text-xs text-muted-foreground">Enter ID above and toggle "Enable Ads"</div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                    
                    <div className="flex justify-end mt-4">
                      <Button onClick={saveAdSettings} disabled={saving} size="sm">
                        {saving ? 'Saving...' : 'Save Settings'}
                      </Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdManagementPanel;
