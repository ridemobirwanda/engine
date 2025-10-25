import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Import 3 images with lazy loading
import heroImage3 from "@/assets/bmw-v6-engine.jpg";
import heroImage1 from "@/assets/hero-engines.jpg";
import heroImage2 from "@/assets/mercedes-v8-engine.jpg";

export const Hero = () => {
  const images = [heroImage1, heroImage2, heroImage3];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative min-h-[600px] flex items-center justify-center bg-black overflow-hidden">
      {/* Sliding Images */}
      <div
        className="absolute inset-0 flex transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          width: `${images.length * 100}%`,
        }}
      >
        {images.map((img, index) => (
          <div
            key={index}
            className="w-full h-full flex-shrink-0 bg-cover bg-center brightness-90"
            style={{ 
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
        ))}
      </div>

      {/* Softer Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-10" />

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
          Premium Automotive
          <span className="block text-orange-400">Engines & Parts</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto drop-shadow-md">
          Discover our premium collection of automotive engines, parts, and components.
          Quality guaranteed with professional installation support.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-6 h-auto shadow-lg"
          >
            <Link to="/products">Browse Engines</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-black text-lg px-8 py-6 h-auto shadow-lg"
          >
            <Link to="/contact">Get Quote</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
