import { ContactForm } from '@/components/ContactForm';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import GoogleMapsStoreFallback from '@/components/GoogleMapsStoreFallback';
import LocalBusinessSchema from '@/components/LocalBusinessSchema';

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <LocalBusinessSchema />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're here to help with all your engine needs. Whether you have questions about our products, 
              need technical support, or want to discuss a custom solution, we'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Address</h3>
                        <p className="text-muted-foreground">
                          8703 Engine Street<br />
                          Auto City, AC 9805<br />
                          United States
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Phone</h3>
                        <p className="text-muted-foreground">
                          +357 96115404<br />
                          +357 96115404
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Email</h3>
                        <p className="text-muted-foreground">
                          info@enginecore.com<br />
                          support@enginecore.com
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Business Hours</h3>
                        <p className="text-muted-foreground">
                          Monday - Friday: 9:00 AM - 6:00 PM<br />
                          Saturday: 10:00 AM - 4:00 PM<br />
                          Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-2">Quick Response</h3>
                    <p className="text-sm text-muted-foreground">
                      We typically respond to all inquiries within 24 hours during business days. 
                      For urgent matters, please call us directly.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">What types of engines do you sell?</h3>
                  <p className="text-muted-foreground">
                    We specialize in high-performance engines from BMW, Mercedes, Audi, and other premium brands. 
                    All engines are thoroughly tested and come with warranties.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Do you offer installation services?</h3>
                  <p className="text-muted-foreground">
                    Yes, we provide professional installation services. Our certified technicians can install 
                    your engine at our facility or at your location.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">What is your return policy?</h3>
                  <p className="text-muted-foreground">
                    We offer a 30-day return policy for all engines. If you're not satisfied with your purchase, 
                    you can return it for a full refund.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Do you ship internationally?</h3>
                  <p className="text-muted-foreground">
                    Yes, we ship worldwide. Shipping costs and delivery times vary by location. 
                    Contact us for a custom quote.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Google Maps Integration */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">Find Our Store</h2>
            <GoogleMapsStoreFallback showBusinessInfo={true} height="500px" />
          </div>
        </div>
      </main>

    </div>
  );
}
