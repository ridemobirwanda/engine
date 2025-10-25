import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground text-lg">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <Badge variant="outline" className="mt-2">
            EngineCore Marketplace
          </Badge>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">1. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Name, email address, and contact information</li>
                  <li>Billing and shipping addresses</li>
                  <li>Payment information (processed securely through our payment partners)</li>
                  <li>Phone numbers for order communication</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Automotive Data</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Vehicle information for engine compatibility</li>
                  <li>Purchase history and preferences</li>
                  <li>Technical specifications and requirements</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Usage Information</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Website usage patterns and analytics</li>
                  <li>Device information and browser data</li>
                  <li>IP addresses and location data</li>
                  <li>Cookies and tracking technologies</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">2. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Order Processing</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Process and fulfill your orders</li>
                    <li>Provide customer support</li>
                    <li>Send order confirmations and updates</li>
                    <li>Handle returns and warranties</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Service Improvement</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Improve our website and services</li>
                    <li>Personalize your experience</li>
                    <li>Recommend relevant products</li>
                    <li>Analyze usage patterns</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">3. Information Sharing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Service Providers:</strong> Trusted partners who help us operate our business (payment processors, shipping companies, customer support)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                <li><strong>Consent:</strong> When you explicitly consent to sharing</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">4. Data Security</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  We implement industry-standard security measures to protect your personal information:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li><strong>SSL Encryption:</strong> All data transmission is encrypted using SSL/TLS</li>
                  <li><strong>Secure Storage:</strong> Personal data is stored in encrypted databases</li>
                  <li><strong>Access Controls:</strong> Limited access to personal information on a need-to-know basis</li>
                  <li><strong>Regular Audits:</strong> Security assessments and vulnerability testing</li>
                  <li><strong>Payment Security:</strong> PCI DSS compliant payment processing</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">5. Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  We use cookies and similar technologies to enhance your browsing experience:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Essential Cookies</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Session management</li>
                      <li>Security features</li>
                      <li>Basic functionality</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Analytics Cookies</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Google Analytics</li>
                      <li>Usage statistics</li>
                      <li>Performance monitoring</li>
                    </ul>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  You can control cookie settings through your browser preferences.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">6. Your Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground mb-4">
                  You have the following rights regarding your personal information:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Access & Control</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Access your personal data</li>
                      <li>Update or correct information</li>
                      <li>Delete your account</li>
                      <li>Data portability</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Communication</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Opt-out of marketing emails</li>
                      <li>Unsubscribe from newsletters</li>
                      <li>Control notification preferences</li>
                      <li>Request data deletion</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">7. Data Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  We retain your personal information for as long as necessary to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Provide our services and support</li>
                  <li>Comply with legal obligations</li>
                  <li>Resolve disputes and enforce agreements</li>
                  <li>Maintain business records</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-4">
                  Account data is typically retained for 7 years after account closure for legal and business purposes.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">8. International Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                As a global automotive marketplace, we may transfer your personal information to countries outside your residence. 
                We ensure appropriate safeguards are in place to protect your data in accordance with applicable privacy laws.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">9. Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our services are not intended for children under 16 years of age. We do not knowingly collect personal 
                information from children. If we become aware that we have collected personal information from a child, 
                we will take steps to delete such information.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">10. Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by 
                posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued 
                use of our services after any modifications constitutes acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-2xl text-orange-800">Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-700 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-orange-700">
                <p><strong>Email:</strong> support@aclassverifiedengine.com</p>
                <p><strong>Phone:</strong> +357 96115404</p>
                <p><strong>Address:</strong> 8703 Engine Street, Auto City, AC 9805, United States</p>
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  );
}