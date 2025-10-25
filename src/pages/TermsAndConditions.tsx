import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function TermsAndConditions() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Terms and Conditions</h1>
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

        <Alert className="mb-8">
          <AlertDescription>
            <strong>Important:</strong> Please read these terms carefully before using our services. 
            By accessing or using EngineCore, you agree to be bound by these terms and conditions.
          </AlertDescription>
        </Alert>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                These Terms and Conditions ("Terms") govern your use of EngineCore marketplace and services. 
                By accessing our website or making a purchase, you agree to these terms.
              </p>
              <div>
                <h3 className="text-lg font-semibold mb-2">Eligibility</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>You must be at least 18 years old to make purchases</li>
                  <li>You must provide accurate and complete information</li>
                  <li>You must have legal capacity to enter into contracts</li>
                  <li>You must comply with all applicable laws and regulations</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">2. Products and Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Automotive Parts and Engines</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>High-quality automotive engines and components</li>
                  <li>Rebuilt, remanufactured, and used engines</li>
                  <li>Genuine OEM and aftermarket parts</li>
                  <li>Professional installation services (where available)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Product Information</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Detailed specifications and compatibility information</li>
                  <li>High-resolution images and technical documentation</li>
                  <li>Warranty information and return policies</li>
                  <li>Professional consultation and support</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">3. Orders and Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Order Process</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>All orders are subject to availability and acceptance</li>
                  <li>We reserve the right to refuse or cancel orders</li>
                  <li>Order confirmation does not guarantee availability</li>
                  <li>Prices are subject to change without notice</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Payment Terms</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Payment is required before order processing</li>
                  <li>We accept major credit cards and secure payment methods</li>
                  <li>All transactions are processed securely</li>
                  <li>Additional fees may apply for international orders</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">4. Shipping and Delivery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Shipping Information</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Shipping costs are calculated at checkout</li>
                  <li>Delivery times vary by location and product availability</li>
                  <li>International shipping may be subject to customs duties</li>
                  <li>We use reputable shipping carriers for secure delivery</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Delivery Terms</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Delivery addresses must be accurate and complete</li>
                  <li>Someone must be available to receive the delivery</li>
                  <li>We are not responsible for delivery delays beyond our control</li>
                  <li>Damaged packages must be reported immediately</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">5. Returns and Warranties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Return Policy</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Returns must be initiated within 30 days of delivery</li>
                  <li>Products must be in original condition and packaging</li>
                  <li>Return shipping costs are the customer's responsibility</li>
                  <li>Custom or special-order items may not be returnable</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Warranty Coverage</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Warranty terms vary by product and manufacturer</li>
                  <li>Warranty claims must be submitted with proof of purchase</li>
                  <li>Installation by qualified professionals may be required</li>
                  <li>Warranty does not cover normal wear and tear</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">6. User Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Account Security</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Keep your account credentials secure and confidential</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>You are responsible for all activities under your account</li>
                  <li>Provide accurate and up-to-date information</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Prohibited Activities</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Use our services for illegal or unauthorized purposes</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with the proper functioning of our website</li>
                  <li>Violate any applicable laws or regulations</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">7. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Our Rights</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>All content on our website is protected by copyright</li>
                  <li>Our trademarks and logos are our exclusive property</li>
                  <li>You may not use our content without permission</li>
                  <li>Unauthorized use may result in legal action</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Your Rights</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>You retain ownership of content you submit</li>
                  <li>You grant us license to use your content for our services</li>
                  <li>You are responsible for ensuring you have rights to submit content</li>
                  <li>You may not submit content that infringes others' rights</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">8. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  To the maximum extent permitted by law, EngineCore shall not be liable for:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li><strong>Indirect Damages:</strong> Loss of profits, data, or business opportunities</li>
                  <li><strong>Installation Issues:</strong> Problems arising from improper installation</li>
                  <li><strong>Third-Party Actions:</strong> Actions or omissions of third parties</li>
                  <li><strong>Force Majeure:</strong> Events beyond our reasonable control</li>
                  <li><strong>Product Compatibility:</strong> Issues arising from incompatible products</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-4">
                  Our total liability shall not exceed the amount paid for the specific product or service.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">9. Dispute Resolution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Governing Law</h3>
                <p className="text-muted-foreground mb-4">
                  These terms are governed by the laws of [Your Jurisdiction]. Any disputes will be resolved in the courts of [Your Jurisdiction].
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Dispute Process</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Contact our customer service first</li>
                  <li>We will attempt to resolve disputes amicably</li>
                  <li>Mediation may be required before legal action</li>
                  <li>Class action waivers may apply</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">10. Privacy and Data Protection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your privacy is important to us. Please review our Privacy Policy to understand how we collect, 
                use, and protect your personal information. By using our services, you consent to our data practices 
                as described in our Privacy Policy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">11. Modifications to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We reserve the right to modify these terms at any time. We will notify users of material changes 
                by posting the updated terms on our website. Your continued use of our services after such 
                modifications constitutes acceptance of the updated terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">12. Severability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                If any provision of these terms is found to be unenforceable or invalid, the remaining provisions 
                will continue to be valid and enforceable. The invalid provision will be replaced with a valid 
                provision that most closely reflects the original intent.
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-2xl text-orange-800">Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-700 mb-4">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <div className="space-y-2 text-orange-700">
                <p><strong>Email:</strong> support@aclassverifiedengine.com</p>
                <p><strong>Phone:</strong> +357 96115404</p>
                <p><strong>Address:</strong> 8703 Engine Street, Auto City, AC 9805, United States</p>
                <p><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM EST</p>
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  );
}
