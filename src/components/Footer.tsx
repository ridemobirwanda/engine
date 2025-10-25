import engineLogo from "@/assets/engine-logo.png";
import { Button } from "@/components/ui/button";
import { Bitcoin, CreditCard, Facebook, Headphones, Instagram, Mail, MapPin, Phone, Shield, Truck, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-t from-muted/20 to-background border-t border-white/10">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <img 
                  src={engineLogo} 
                  alt="A class Verified Engine Logo" 
                  className="w-12 h-12 object-contain"
                  loading="lazy"
                  decoding="async"
                />
                <h3 className="text-2xl font-bold font-['Orbitron'] text-gradient">
                  A class Verified Engine
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                The future of automotive commerce. AI-powered engine marketplace 
                connecting enthusiasts with premium automotive components worldwide.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>
                    8703 Engine Street<br />
                    Auto City, AC 9805<br />
                    United States
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>+357 96115404</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>support@aclassverifiedengine.com</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 font-['Orbitron']">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { label: "All Engines", href: "/engines" },
                  { label: "Used Engines", href: "/used-engines" }, 
                  { label: "About Us", href: "/about" },
                  { label: "Contact", href: "/contact" },
                  { label: "Checkout", href: "/checkout" }
                ].map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Support */}
            <div>
              <h4 className="text-lg font-semibold mb-6 font-['Orbitron']">Support</h4>
              <ul className="space-y-3">
                {[
                  { label: "Help Center", href: "/help-center" },
                  { label: "Contact Support", href: "/contact" },
                  { label: "Returns & Refunds", href: "/returns-refunds" },
                  { label: "Shipping Info", href: "/shipping-info" },
                  { label: "Payment Methods", href: "/payment-methods" },
                  { label: "Technical Support", href: "/technical-support" },
                  { label: "Live Chat", href: "/live-chat" },
                  { label: "FAQs", href: "/faqs" }
                ].map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust & Security */}
            <div>
              <h4 className="text-lg font-semibold mb-6 font-['Orbitron']">Trust & Security</h4>
              
              {/* Trust Badges */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-5 w-5 text-green-400" />
                  <span>SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CreditCard className="h-5 w-5 text-blue-400" />
                  <span>Secure Payments</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="h-5 w-5 text-purple-400" />
                  <span>Global Shipping</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Headphones className="h-5 w-5 text-orange-400" />
                  <span>24/7 Support</span>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h5 className="font-semibold mb-4">Follow Us</h5>
                <div className="flex gap-3">
                  {[
                    { icon: Facebook, href: "#" },
                    { icon: Twitter, href: "#" },
                    { icon: Instagram, href: "#" },
                    { icon: Youtube, href: "#" }
                  ].map(({ icon: Icon, href }, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 hover:bg-primary/20 hover:text-primary"
                      asChild
                    >
                      <a href={href}>
                        <Icon className="h-5 w-5" />
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              We accept
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="h-8 px-3 rounded-md bg-blue-600 text-white text-xs font-semibold flex items-center">VISA</div>
              <div className="h-8 px-3 rounded-md bg-white/90 text-black text-xs font-semibold flex items-center gap-2 border border-black/10">
                <span className="w-3 h-3 rounded-full bg-red-600 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-400 -ml-2 inline-block"></span>
                <span>Mastercard</span>
              </div>
              <div className="h-8 px-3 rounded-md bg-cyan-700 text-white text-xs font-semibold flex items-center">AMEX</div>
              <div className="h-8 px-3 rounded-md bg-[#003087] text-white text-xs font-semibold flex items-center">PayPal</div>
              <div className="h-8 px-3 rounded-md bg-[#1677FF] text-white text-xs font-semibold flex items-center">Alipay</div>
              <div className="h-8 px-3 rounded-md bg-black text-white text-xs font-semibold flex items-center gap-1 border border-white/10">
                <Bitcoin className="h-3 w-3" />
                Bitcoin
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} A class Verified Engine. All rights reserved. | 
              <Link to="/privacy-policy" className="hover:text-primary ml-1">Privacy Policy</Link> | 
              <Link to="/terms-and-conditions" className="hover:text-primary ml-1">Terms of Service</Link>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-sm text-muted-foreground">
                Powered by AI Technology
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};