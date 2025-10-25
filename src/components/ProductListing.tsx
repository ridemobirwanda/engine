import { ProductDetailsModal } from "@/components/ProductDetailsModal";
import { QuickBuyModal } from "@/components/QuickBuyModal";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import { useProducts, useProductSearch, type Product } from "@/hooks/useProducts";
import { Fuel, Heart, Search, ShoppingCart, Star, Zap } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

// Default image fallback
const defaultImage = "/placeholder.svg";

export const ProductListing = () => {
  const { toast } = useToast();
  const { addToCartAndWait, cartItems } = useCart();
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 25000]);
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showQuickBuy, setShowQuickBuy] = useState(false);

  // Use optimized product loading hook
  const { products, isLoading, hasData } = useProducts();

  // Handle URL parameters for category filtering
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Use optimized search hook
  const searchResults = useProductSearch(searchQuery, products);

  // Extract unique values from products for filters (memoized for performance)
  const brands = useMemo(() => 
    ["All", ...Array.from(new Set(products.map(p => p.brand).filter(Boolean)))],
    [products]
  );
  
  const years = useMemo(() => 
    Array.from({ length: 25 }, (_, i) => 2024 - i),
    []
  );
  
  const categories = useMemo(() => 
    ["All", "Car Engine", "Motorcycle Engine", "Spare Parts"],
    []
  );

  // Optimized filtering with memoization
  const filteredProducts = useMemo(() => {
    return searchResults.filter(product => {
    const matchesBrand = !selectedBrand || selectedBrand === "All" || product.brand === selectedBrand;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesBrand && matchesPrice;
  });
  }, [searchResults, selectedBrand, priceRange]);

  const handleAddToCart = (product: Product) => {
    if ((product.stock_quantity || 0) <= 0) {
      toast({
        title: "Out of Stock",
        description: `${product.name} is currently out of stock.`,
        variant: "destructive",
      });
      return;
    }

    // Get the first image URL if available
    const imageUrl = Array.isArray(product.images) && product.images.length > 0 
      ? product.images[0]?.url || product.images[0] 
      : defaultImage;
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: imageUrl,
      category: product.brand || 'Engine Part',
      productId: product.id
    });
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleAddToWishlist = (productName: string) => {
    toast({
      title: "Added to Wishlist",
      description: `${productName} has been added to your wishlist.`,
    });
  };

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low": return a.price - b.price;
      case "price-high": return b.price - a.price;
      case "newest": return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default: return 0;
    }
  });

  const handleQuickBuy = async (product: Product) => {
    if ((product.stock_quantity || 0) <= 0) {
      toast({
        title: "Out of Stock",
        description: `${product.name} is currently out of stock.`,
        variant: "destructive",
      });
      return;
    }

    try {
      // Get the first image URL if available
      const imageUrl = Array.isArray(product.images) && product.images.length > 0 
        ? product.images[0]?.url || product.images[0] 
        : defaultImage;
      
      // Store product info in sessionStorage for instant checkout
      const productData = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: imageUrl,
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
      console.error('Error proceeding to checkout:', error);
      toast({
        title: "Error",
        description: "Failed to proceed to checkout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isInCart = (productId: string) => {
    return cartItems.some(item => item.id === productId);
  };


  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-['Orbitron'] text-gradient">
            Engine Marketplace
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">
            Premium engines and parts for all vehicle types
          </p>
        </div>

        {/* Filters */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Input
                placeholder="Search engines, brands, models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-11 md:h-12 bg-background/50 border-white/20"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map(brand => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Product Grid - Show products instantly, only show loading if no data at all */}
        {!hasData && isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass-card border-white/10 rounded-xl overflow-hidden">
                <Skeleton className="h-48 w-full" />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedProducts.map((product) => (
            <Card key={product.id} className="group glass-card border-white/10 overflow-hidden hover:shadow-yellow-500/20 hover:shadow-2xl hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-sm cursor-pointer" onClick={() => handleQuickBuy(product)}>
              <div className="relative h-48 overflow-hidden">
                <OptimizedImage
                  src={(Array.isArray(product.images) ? product.images[0] : product.images) || defaultImage}
                  alt={product.name}
                  className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                  width={300}
                  height={192}
                  priority={false}
                  placeholder={defaultImage}
                />
                
                {/* Hover overlay for reviews */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="text-center text-white">
                    <div className="flex items-center justify-center mb-2">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-semibold">4.8</span>
                      <span className="text-sm text-gray-300 ml-1">(124 reviews)</span>
                    </div>
                    <p className="text-sm text-gray-200">Click to view details & reviews</p>
                  </div>
                </div>
                
                {/* Professional transparent overlay with intelligent animations */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-800/50 to-transparent">
                  {/* Top badges with smart animations */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                    <Badge className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs px-3 py-1.5 font-semibold shadow-lg transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-blue-500/25">
                      {product.condition}
                    </Badge>
                    <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md rounded-full px-3 py-1.5 border border-amber-400/30 transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-amber-500/25">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs text-amber-100 font-semibold">4.8</span>
                    </div>
                  </div>
                  
                  {/* Bottom content area with intelligent fade-in */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
                    {/* Brand and stock with smart animations */}
                    <div className="flex justify-between items-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100">
                      <Badge variant="secondary" className="text-xs px-3 py-1.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-100 border border-emerald-400/30 font-semibold backdrop-blur-sm">
                        {product.brand}
                      </Badge>
                      {(product.stock_quantity || 0) > 0 ? (
                        <div className="flex items-center gap-1.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-full px-3 py-1.5 border border-green-400/30">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-300 font-semibold">In Stock</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-gradient-to-r from-red-500/20 to-rose-500/20 backdrop-blur-md rounded-full px-3 py-1.5 border border-red-400/30">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          <span className="text-xs text-red-300 font-semibold">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Product name with intelligent reveal */}
                    <h3 className="font-bold text-sm text-white line-clamp-2 group-hover:text-cyan-300 transition-all duration-500 leading-tight transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 delay-200">
                      {product.name}
                    </h3>
                    
                    {/* Model with smart fade */}
                    <p className="text-xs text-cyan-200/80 font-medium transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-600 delay-300">
                      {product.model}
                    </p>
                    
                    {/* Specifications with staggered animations */}
                    <div className="flex items-center gap-4 text-xs transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-400">
                      <div className="flex items-center gap-1.5">
                        <Zap className="h-3 w-3 text-yellow-400" />
                        <span className="text-amber-200 font-medium">{product.engine_type}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Fuel className="h-3 w-3 text-orange-400" />
                        <span className="text-orange-200 font-medium">{product.displacement}</span>
                      </div>
                    </div>
                    
                    {/* Price with dramatic reveal */}
                    <div className="flex items-center justify-between transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-800 delay-500">
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                          ${product.price.toLocaleString()}
                        </span>
                        {product.compare_price && product.compare_price > product.price && (
                          <span className="text-xs text-slate-400 line-through">
                            ${product.compare_price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-3 bg-transparent">
                {/* Only buttons remain in the transparent card content */}
              </CardContent>
              
              <CardFooter className="p-3 pt-0 flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1 h-8 px-2 text-xs"
                  variant={isInCart(product.id) ? "secondary" : "default"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  disabled={(product.stock_quantity || 0) <= 0}
                >
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  {isInCart(product.id) ? "Added to Cart" : "Add to Cart"}
                </Button>
                <Button 
                  size="sm" 
                  variant="default"
                  className="flex-1 h-8 px-3 text-xs bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickBuy(product);
                  }}
                  disabled={(product.stock_quantity || 0) <= 0}
                >
                  Buy Now
                </Button>
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToWishlist(product.name);
                  }}
                >
                  <Heart className="h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        )}

        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No products found matching your criteria.
            </p>
          </div>
        )}

        {/* Product Details Modal */}
        <ProductDetailsModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />

        {/* Quick Buy Modal */}
        <QuickBuyModal
          product={selectedProduct}
          isOpen={showQuickBuy}
          onClose={() => setShowQuickBuy(false)}
        />
      </div>
    </section>
  );
};