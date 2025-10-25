// Header and Footer removed - now handled globally in App.tsx
import { ImageCardsSection } from "@/components/ImageCardsSection";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header and Footer removed - now handled globally in App.tsx */}
      <main>
        <div className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold mb-6 font-['Orbitron'] text-gradient">About EngineCore</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Your premier destination for high-quality automotive engines and parts, 
                trusted by mechanics and enthusiasts worldwide.
              </p>
            </div>

            {/* Company Story */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="text-3xl font-bold mb-6 font-['Orbitron'] text-gradient">Our Story</h2>
                <div className="prose prose-lg text-muted-foreground">
                  <p className="mb-4">
                    Founded with a passion for automotive excellence, EngineCore has been at the forefront 
                    of the engine and parts industry for over two decades. We started as a small family 
                    business with a simple mission: to provide the highest quality engines and parts 
                    to mechanics, enthusiasts, and automotive professionals.
                  </p>
                  <p className="mb-4">
                    Today, we've grown into a trusted name in the industry, serving customers across 
                    the globe with our extensive inventory of premium engines, parts, and accessories. 
                    Our commitment to quality, reliability, and customer service remains unchanged.
                  </p>
                  <p>
                    Every engine and part we sell undergoes rigorous testing and quality assurance 
                    to ensure it meets our high standards. We believe that when you choose EngineCore, 
                    you're not just buying a product – you're investing in reliability and performance.
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-4 font-['Orbitron']">Why Choose EngineCore?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <span>Premium quality engines and parts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <span>Expert technical support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <span>Fast and reliable shipping</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <span>Comprehensive warranty coverage</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <span>Competitive pricing</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">20+</div>
                <div className="text-muted-foreground">Years of Experience</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
                <div className="text-muted-foreground">Engines Sold</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">50+</div>
                <div className="text-muted-foreground">Countries Served</div>
              </div>
            </div>

            {/* Mission & Values */}
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 mb-16">
              <h2 className="text-3xl font-bold mb-6 font-['Orbitron'] text-gradient text-center">Our Mission & Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Mission</h3>
                  <p className="text-muted-foreground">
                    To provide the highest quality automotive engines and parts while delivering 
                    exceptional customer service and technical support to automotive professionals 
                    and enthusiasts worldwide.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Core Values</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Quality and reliability in every product</li>
                    <li>• Customer satisfaction as our top priority</li>
                    <li>• Innovation and continuous improvement</li>
                    <li>• Integrity and transparency in all dealings</li>
                    <li>• Environmental responsibility</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ImageCardsSection />
      </main>
    </div>
  );
};

export default AboutPage;