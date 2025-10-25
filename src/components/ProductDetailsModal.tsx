import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import { Calendar, Fuel, Gauge, Heart, Info, Settings, ShoppingCart, Star, Zap } from "lucide-react";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  images?: string[] | string | null;
  image?: string;
  description?: string | null;
  short_description?: string | null;
  stock_quantity?: number | null;
  brand?: string | null;
  model?: string | null;
  engine_type?: string | null;
  displacement?: string | null;
  fuel_type?: string | null;
  condition?: string | null;
  compare_price?: number | null;
  category?: string;
  originalPrice?: number;
  stockCount?: number;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  warranty?: string;
  shipping?: string;
  type?: string;
  cylinders?: string;
  power?: string;
  torque?: string;
  compatibility?: string[];
  year?: string;
}

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export const ProductDetailsModal = ({ isOpen, onClose, product }: ProductDetailsModalProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addToCartAndWait } = useCart();
  const { toast } = useToast();

  // Early return if product is null
  if (!product) {
    return null;
  }

  // Handle both hardcoded products (image) and database products (images)
  const productImages = product.images 
    ? (Array.isArray(product.images) ? product.images : [product.images])
    : product.image 
    ? [product.image]
    : [];

  const handleAddToCart = async () => {
    if ((product.stock_quantity || 0) <= 0) {
      toast({
        title: "Out of Stock",
        description: `${product.name} is currently out of stock.`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: productImages[0],
        category: product.category,
        productId: product.id
      });
      
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddToWishlist = () => {
    toast({
      title: "Added to Wishlist",
      description: `${product.name} has been added to your wishlist.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative">
              <Carousel className="w-full">
                <CarouselContent>
                  {productImages.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative h-80 bg-muted rounded-lg overflow-hidden">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`${product.name} - Image ${index + 1}`}
                          className="w-full h-full object-cover product-image"
                          style={{
                            imageRendering: 'crisp-edges'
                          }}
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {productImages.length > 1 && (
                  <>
                    <CarouselPrevious />
                    <CarouselNext />
                  </>
                )}
              </Carousel>
            </div>
            
            {/* Thumbnail Grid */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {productImages.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative h-16 bg-muted rounded overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover product-image"
                      style={{
                        imageRendering: 'crisp-edges'
                      }}
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Price and Stock */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-muted-foreground">4.5 (24 reviews)</span>
                </div>
              </div>
              
              {product.compare_price && (
                <div className="text-lg text-muted-foreground line-through">
                  ${product.compare_price.toFixed(2)}
                </div>
              )}
              
              <div className="flex items-center gap-2">
                {(product.stock_quantity || 0) > 0 ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    In Stock ({product.stock_quantity})
                  </Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
                {product.condition && (
                  <Badge variant="outline">{product.condition}</Badge>
                )}
              </div>
            </div>

            <Separator />

            {/* Description */}
            {(product.description || product.short_description) && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Description
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description || product.short_description}
                </p>
              </div>
            )}

            {/* Key Specifications */}
            <div>
              <h3 className="font-semibold mb-3">Key Specifications</h3>
              <div className="grid grid-cols-2 gap-3">
                {product.brand && (
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Brand: {product.brand}</span>
                  </div>
                )}
                {product.model && (
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Model: {product.model}</span>
                  </div>
                )}
                {product.engine_type && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Type: {product.engine_type}</span>
                  </div>
                )}
                {product.displacement && (
                  <div className="flex items-center gap-2">
                    <Fuel className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Displacement: {product.displacement}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={async () => await handleAddToCart()}
                  disabled={(product.stock_quantity || 0) <= 0}
                  variant="outline"
                  className="w-full"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  onClick={async () => {
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
                      
                      onClose();
                      
                      // Navigate directly to checkout
                      window.location.href = '/checkout';
                    } catch (error) {
                      console.error('Error in Buy Now:', error);
                    }
                  }}
                  disabled={(product.stock_quantity || 0) <= 0}
                  className="w-full"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Buy Now
                </Button>
              </div>
              <Button
                onClick={handleAddToWishlist}
                variant="ghost"
                className="w-full"
              >
                <Heart className="h-4 w-4 mr-2" />
                Add to Wishlist
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};