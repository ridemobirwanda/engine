// Removed duplicate Header/Footer imports - now handled globally in App.tsx
import { ProductDetailsModal } from "@/components/ProductDetailsModal";
import { QuickBuyModal } from "@/components/QuickBuyModal";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import { useProducts, useProductSearch, type Product } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, ShoppingCart, Star, Zap } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

interface Category {
  id: string;
  name: string;
  description: string | null;
  slug: string;
}

interface DynamicProductPageProps {
  categorySlug: string;
  title: string;
  description: string;
  features?: Array<{
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
  }>;
  compact?: boolean;
}

export const DynamicProductPage = ({ 
  categorySlug, 
  title, 
  description, 
  features,
  compact = false,
}: DynamicProductPageProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showQuickBuy, setShowQuickBuy] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState(false);

  const { toast } = useToast();
  const { addToCart, addToCartAndWait } = useCart();

  // Use optimized product loading hook
  const { products, isLoading, hasData } = useProducts(categorySlug);
  
  // Use optimized search hook
  const searchResults = useProductSearch(searchQuery, products);

  const handleAddToCart = useCallback(
    (product: Product) => {
    if ((product.stock_quantity || 0) <= 0) {
      toast({
        title: "Out of Stock",
        description: `${product.name} is currently out of stock.`,
        variant: "destructive",
      });
      return;
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: Array.isArray(product.images) ? product.images[0] : product.images,
      category: title,
        productId: product.id,
    });
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
    },
    [addToCart, title, toast]
  );

  const handleBuyNow = useCallback(
    async (product: Product) => {
      if ((product.stock_quantity || 0) <= 0) {
        toast({
          title: "Out of Stock",
          description: `${product.name} is currently out of stock.`,
          variant: "destructive",
        });
        return;
      }

      try {
        // Store product info in sessionStorage for instant checkout
        const productData = {
          id: product.id,
          name: product.name,
          price: product.price,
          image: Array.isArray(product.images) && product.images.length > 0 
            ? product.images[0]?.url || product.images[0] 
            : '/placeholder.svg',
          category: product.brand || 'Engine Part',
          productId: product.id,
          quantity: 1
        };
        
        // Store in sessionStorage for instant checkout
        sessionStorage.setItem('instant-checkout-product', JSON.stringify(productData));
        
        toast({
          title: "Proceeding to Checkout",
          description: `Redirecting to checkout for ${product.name}...`,
        });
        
        // Navigate directly to checkout
        window.location.href = '/checkout';
        
      } catch (error) {
        console.error('Error in Buy Now:', error);
        toast({
          title: "Error",
          description: "Failed to proceed to checkout. Please try again.",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  const handleViewDetails = useCallback((product: Product) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
  }, []);

  const handleAddToWishlist = useCallback(
    (productName: string) => {
    toast({
      title: "Added to Wishlist",
      description: `${productName} has been added to your wishlist.`,
    });
    },
    [toast]
  );

  // Use search results directly (already filtered by search query)
  const filteredProducts = searchResults;
  
  return (
    <div className={compact ? "bg-background" : "min-h-screen bg-background"}>
      {/* Header removed - now handled globally in App.tsx */}
      
      <main className="py-12">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className={compact ? "text-center mb-6" : "text-center mb-16"}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-['Orbitron'] text-gradient">
              {title}
            </h1>
            <p className={compact ? "text-base text-muted-foreground max-w-3xl mx-auto mb-4" : "text-xl text-muted-foreground max-w-3xl mx-auto mb-8"}>
              {description}
            </p>
            {features && (
              <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <feature.icon className="h-4 w-4 text-primary" />
                    <span>{feature.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Filter Stats */}
          <div className={compact ? "mb-4 text-center relative overflow-hidden rounded-lg h-14" : "mb-8 text-center relative overflow-hidden rounded-lg h-20"}>
            <div className="relative z-10 bg-black/50 backdrop-blur-sm rounded-lg p-6 h-full flex items-center justify-center">
              <p className="text-white font-medium text-lg drop-shadow-lg">
              Showing {filteredProducts.length} of {products.length} products
              {categorySlug !== 'all-products' && ` in ${title}`}
            </p>
            </div>
          </div>

          {/* Products Grid - Show products instantly */}
          {!hasData && isLoading ? (
            <div className={compact ? "product-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" : "product-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="glass-card border-white/10 rounded-xl overflow-hidden">
                  <Skeleton className={compact ? "h-60 w-full" : "h-80 w-full"} />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
          <div className={compact ? "product-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" : "product-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"}>
            {filteredProducts.map((product) => {
              // Handle both hardcoded products (image) and database products (images)
              const images = product.images 
                ? (Array.isArray(product.images) ? product.images : [product.images])
                : product.image 
                ? [product.image]
                : [];
              return (
                <Card key={product.id} className="group glass-card border-white/10 overflow-hidden hover:shadow-yellow-500/20 hover:shadow-2xl hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-sm cursor-pointer" onClick={() => handleViewDetails(product)}>
                    {/* Image Carousel */}
                  <div className={compact ? "relative h-60 overflow-hidden bg-muted" : "relative h-80 overflow-hidden bg-muted"}>
                    {images.length > 1 ? (
                        <Carousel className="w-full h-full">
                          <CarouselContent>
                          {images.map((img, idx) => (
                            <CarouselItem key={idx}>
                              <OptimizedImage
                                src={img || "/placeholder.svg"}
                                alt={`${product.name} - Image ${idx + 1}`}
                                className={compact ? "w-full h-60 group-hover:scale-105 transition-transform duration-300" : "w-full h-80 group-hover:scale-105 transition-transform duration-300"}
                                width={400}
                                height={compact ? 240 : 320}
                                priority={idx === 0}
                                placeholder="/placeholder.svg"
                              />
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                              <CarouselPrevious className="left-2" />
                              <CarouselNext className="right-2" />
                        </Carousel>
                      ) : (
                          <OptimizedImage
                        src={images[0] || "/placeholder.svg"}
                            alt={product.name}
                        className={compact ? "w-full h-60 group-hover:scale-105 transition-transform duration-300" : "w-full h-80 group-hover:scale-105 transition-transform duration-300"}
                        width={400}
                        height={compact ? 240 : 320}
                        priority={true}
                        placeholder="/placeholder.svg"
                      />
                    )}
                    
                    {/* Hover overlay for reviews */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="text-center text-white">
                        <div className="flex items-center justify-center mb-2">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="font-semibold">{product.rating || 4.5}</span>
                          <span className="text-sm text-gray-300 ml-1">({product.reviews || 0} reviews)</span>
                        </div>
                        <p className="text-sm text-gray-200">Click to view details & reviews</p>
                      </div>
                    </div>
                    </div>
                    
                  {/* Card Content */}
                  <CardContent className={compact ? "p-4 space-y-3 bg-gradient-to-b from-gray-800/50 to-black/70 backdrop-blur-sm min-h-[120px]" : "p-4 space-y-3 bg-gradient-to-b from-gray-800/50 to-black/70 backdrop-blur-sm min-h-[140px]"}>
                    <div className="flex justify-between items-center mb-2">
                      <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30 hover:bg-yellow-500/30 transition-colors">
                            {product.condition}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-rose-400/30 text-rose-300 hover:bg-rose-500/20 hover:border-rose-400/50 transition-all"
                        onClick={() => handleAddToWishlist(product.name)}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                  </div>

                    <div className="space-y-2">
                      <h3 className="font-bold text-base line-clamp-2 text-white group-hover:text-yellow-300 transition-colors">
                          {product.name}
                        </h3>
                      <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
                      {product.short_description || product.description}
                    </p>

                      {/* Price and Rating */}
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <div className="text-lg font-bold text-yellow-400">
                          ${product.price.toLocaleString()}
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-sm text-gray-400 line-through ml-2">
                                ${product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-gray-300">{product.rating || 4.5}</span>
                            <span className="text-xs text-gray-400">({product.reviews || 0})</span>
                        </div>
                      </div>
                    </div>
                    </div>

                    <div className="flex justify-between mt-4 pt-3 border-t border-gray-700/50">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-green-400/30 text-green-300 hover:bg-green-500/20 hover:border-green-400/50 transition-all flex-1 mr-2 h-8 px-2 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        disabled={(product.stock_quantity || 0) <= 0}
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Add to Cart
                      </Button>
                      <Button 
                        size="sm"
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/25 flex-1 h-8 px-3 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBuyNow(product);
                        }}
                        disabled={(product.stock_quantity || 0) <= 0}
                      >
                        <Zap className="h-3 w-3 mr-1" />
                        Buy Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          )}

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
                No products found in this category.
            </div>
          )}

          {/* Features Section */}
          {!compact && features && (
            <div className="mt-16 glass-card p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4 text-center">Why Choose Our {title}?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((feature, i) => (
                  <div key={i} className="text-center">
                    <feature.icon className="h-12 w-12 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Footer removed - now handled globally in App.tsx */}
      
      {/* Quick Buy Modal */}
      {selectedProduct && showQuickBuy && (
        <QuickBuyModal
          isOpen={showQuickBuy}
          onClose={() => {
            setShowQuickBuy(false);
            setSelectedProduct(null);
          }}
          product={{
            id: selectedProduct.id,
            name: selectedProduct.name,
            price: selectedProduct.price,
            image: selectedProduct.images 
              ? (Array.isArray(selectedProduct.images) ? selectedProduct.images[0] : selectedProduct.images)
              : selectedProduct.image || "/placeholder.svg",
          }}
        />
      )}

      {/* Product Details Modal */}
      {selectedProduct && showProductDetails && (
        <ProductDetailsModal
          isOpen={showProductDetails}
          onClose={() => {
            setShowProductDetails(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
        />
      )}
    </div>
  );
};
