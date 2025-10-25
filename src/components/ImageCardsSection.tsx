import { Json } from "@/integrations/supabase/types";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { ProductDetailsModal } from "./ProductDetailsModal";
import { listProducts } from "@/services/productsApi";

interface Product {
  id: string;
  name: string;
  short_description: string | null;
  description: string | null;
  price: number;
  compare_price: number | null;
  images: Json | null;
  brand: string | null;
  stock_quantity: number | null;
  specifications: Json | null;
}

export const ImageCardsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const data = await listProducts({
          is_featured: true,
          is_active: true,
          limit: 6,
        });

        setProducts((data || []).map((p: any) => ({
          ...p,
          id: String(p.id),
        })));
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching featured products:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const getImageUrls = (images: Json | null): string[] => {
    if (!images || !Array.isArray(images) || images.length === 0) {
      return ["/placeholder.svg"];
    }
    // Handle both string URLs and object URLs {url: "..."}
    return images.map((img: any) => {
      if (typeof img === 'string') return img;
      return img?.url || "/placeholder.svg";
    });
  };

  const getCurrentImageUrl = (productId: string, images: Json | null) => {
    const imageUrls = getImageUrls(images);
    const currentIndex = currentImageIndex[productId] || 0;
    return imageUrls[currentIndex];
  };

  // Auto-slide images every 40 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => {
        const newIndices = { ...prev };
        products.forEach(product => {
          const imageUrls = getImageUrls(product.images);
          if (imageUrls.length > 1) {
            newIndices[product.id] = ((prev[product.id] || 0) + 1) % imageUrls.length;
          }
        });
        return newIndices;
      });
    }, 40000); // 40 seconds

    return () => clearInterval(interval);
  }, [products]);

  if (loading) {
    return (
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Featured Products</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our premium collection of automotive engines and components
            </p>
          </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-card rounded-xl h-64 shadow-lg"></div>
            </div>
          ))}
        </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold text-foreground mb-4">Featured Products</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our premium collection of automotive engines and components
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedProduct(product)}
            >
              {/* Image Background */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={getCurrentImageUrl(product.id, product.images)}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                />
                
                {/* Image indicators */}
                {getImageUrls(product.images).length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                    {getImageUrls(product.images).map((_, imgIndex) => (
                      <div
                        key={imgIndex}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          (currentImageIndex[product.id] || 0) === imgIndex 
                            ? 'bg-white' 
                            : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
                
                {/* Professional Gradient Overlay with intelligent animations */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-800/50 to-transparent"></div>
                
                {/* Top badges with smart animations */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  {product.brand && (
                    <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-md rounded-full px-3 py-1.5 border border-emerald-400/30 transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-emerald-500/25">
                      <span className="text-xs font-semibold text-emerald-100">
                        {product.brand}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md rounded-full px-3 py-1.5 border border-amber-400/30 transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-amber-500/25">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs text-amber-100 font-semibold">4.8</span>
                  </div>
                </div>
                
                {/* Bottom content area with intelligent fade-in */}
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                  {/* Title with intelligent reveal */}
                  <h3 className="text-lg font-bold text-white line-clamp-2 group-hover:text-cyan-300 transition-all duration-500 leading-tight transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 delay-200">
                    {product.name}
                  </h3>
                  
                  {/* Description with smart fade */}
                  {product.short_description && (
                    <p className="text-sm text-cyan-200/80 line-clamp-2 font-medium transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-600 delay-300">
                      {product.short_description}
                    </p>
                  )}
                  
                  {/* Price and CTA with dramatic reveal */}
                  <div className="flex items-center justify-between transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-800 delay-500">
                    <span className="text-xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                      ${product.price.toLocaleString()}
                    </span>
                    
                    {/* Call to Action */}
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 delay-700">
                      <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg backdrop-blur-sm transform hover:scale-105">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-t from-accent/20 via-transparent to-transparent"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <button className="group px-8 py-4 bg-card border border-border rounded-xl font-semibold text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <span className="mr-2">View All Products</span>
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>
        </div>

        {/* Product Details Modal */}
        <ProductDetailsModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </div>
    </section>
  );
};