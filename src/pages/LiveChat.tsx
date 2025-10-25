import { useState, useEffect } from "react";
// Header and Footer removed - now handled globally in App.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Clock, MessageCircle, Paperclip, Send, Smile, Phone, Mail } from "lucide-react";
import { getSettingByKey } from '@/services/websiteSettingsService';

const LiveChat = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [chatStarted, setChatStarted] = useState(false);
  const [whatsappConfig, setWhatsappConfig] = useState({
    enabled: false,
    number: "+35796115404",
    message: "Hi! I'm interested in your products. Can you help me?"
  });
  const [loading, setLoading] = useState(true);

  // Load WhatsApp configuration
  useEffect(() => {
    const loadWhatsappConfig = async () => {
      try {
        const data = await getSettingByKey('content_settings');
        if (data?.value) {
          const settings = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
          setWhatsappConfig({
            enabled: settings.whatsapp_enabled || false,
            number: settings.whatsapp_number || "+35796115404",
            message: settings.whatsapp_message || "Hi! I'm interested in your products. Can you help me?"
          });
        }
      } catch (error) {
        console.error('Error loading WhatsApp config:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWhatsappConfig();
  }, []);

  const openWhatsApp = (customMessage?: string) => {
    const phoneNumber = whatsappConfig.number.replace(/\D/g, ''); // Remove all non-digits
    const message = customMessage || whatsappConfig.message;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const quickQuestions = [
    "What engines do you have for a 2015 Honda Civic?",
    "How much does shipping cost?",
    "What's your return policy?",
    "Can you help me check compatibility?",
    "I need help with installation"
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading chat configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header removed - now handled globally in App.tsx */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold font-['Orbitron'] text-gradient mb-4">
              Live Chat Support
            </h1>
            <p className="text-muted-foreground text-lg">
              Get instant help from our automotive experts
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <Card className="glass-card h-[600px] flex flex-col">
                <CardHeader className="border-b border-white/10">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      Live Support Chat
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <Badge variant="secondary">Online</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col p-0">
                  {/* WhatsApp Chat Interface */}
                  <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    <div className="text-center py-12">
                      <MessageCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Chat with us on WhatsApp</h3>
                      <p className="text-muted-foreground mb-6">
                        Get instant support from our automotive experts via WhatsApp
                      </p>
                      <div className="space-y-3">
                        <Button 
                          onClick={() => openWhatsApp()} 
                          className="bg-green-500 hover:bg-green-600 text-white"
                          size="lg"
                        >
                          <MessageCircle className="h-5 w-5 mr-2" />
                          Start WhatsApp Chat
                        </Button>
                        <p className="text-sm text-muted-foreground">
                          Opens WhatsApp with our support team
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Custom Message Input */}
                  <div className="border-t border-white/10 p-4">
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">Or send a custom message:</p>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type your custom message..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="flex-1"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && message.trim()) {
                              openWhatsApp(message);
                              setMessage("");
                            }
                          }}
                        />
                        <Button 
                          onClick={() => {
                            if (message.trim()) {
                              openWhatsApp(message);
                              setMessage("");
                            }
                          }}
                          disabled={!message.trim()}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Support Hours */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Support Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Monday - Friday</span>
                    <span className="text-sm">8AM - 8PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Saturday</span>
                    <span className="text-sm">9AM - 6PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Sunday</span>
                    <span className="text-sm">10AM - 4PM EST</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-400">Currently Online</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Questions */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Quick Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {quickQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full text-left h-auto p-2 justify-start text-sm"
                        onClick={() => openWhatsApp(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Alternatives */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Contact Methods</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-1 flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-green-500" />
                      WhatsApp Chat
                    </h4>
                    <p className="text-sm text-muted-foreground">{whatsappConfig.number}</p>
                    <Button 
                      size="sm" 
                      className="bg-green-500 hover:bg-green-600 text-white mt-1"
                      onClick={() => openWhatsApp()}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Chat Now
                    </Button>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-blue-500" />
                      Phone Support
                    </h4>
                    <p className="text-sm text-muted-foreground">+35796115404</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-orange-500" />
                      Email Support
                    </h4>
                    <p className="text-sm text-muted-foreground">support@aclassverifiedengine.com</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Response Time</h4>
                    <p className="text-sm text-muted-foreground">WhatsApp: Instant | Phone: Immediate | Email: Within 2 hours</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      {/* Footer removed - now handled globally in App.tsx */}
    </div>
  );
};

export default LiveChat;