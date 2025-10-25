import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { memo, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// Memoized cart item component for better performance
const CartItem = memo(({ item, onRemove, onUpdateQuantity }: {
  item: any;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}) => (
  <div className="glass-card p-4 rounded-lg">
    <div className="flex gap-4">
      <img
        src={item.image || '/placeholder.svg'}
        alt={item.name}
        className="w-16 h-16 object-cover rounded-lg product-image"
        style={{
          imageRendering: 'crisp-edges'
        }}
      />
      <div className="flex-1">
        <h4 className="font-semibold text-sm mb-1 line-clamp-2">{item.name}</h4>
        <p className="text-xs text-muted-foreground mb-2">{item.category || 'Engine Part'}</p>
        <p className="text-primary font-bold">${item.price.toLocaleString()}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(item.id)}
        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
    
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-8 text-center font-semibold">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      <p className="font-bold">
        ${(item.price * item.quantity).toLocaleString()}
      </p>
    </div>
  </div>
));

export const ShoppingCartSidebar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  // Memoized values to prevent unnecessary re-renders
  const totalItems = useMemo(() => {
    const total = cartItems.reduce((total, item) => total + item.quantity, 0);
    console.log('🛒 ShoppingCartSidebar - totalItems calculated:', total, 'cartItems:', cartItems);
    return total;
  }, [cartItems]);
  const subtotal = useMemo(() => 
    cartItems.reduce((total, item) => total + (item.price * item.quantity), 0), 
    [cartItems]
  );
  const shipping = 150; // $150 shipping
  const total = useMemo(() => subtotal + shipping, [subtotal]);

  // Memoized callbacks to prevent unnecessary re-renders
  const removeItem = useCallback((id: string) => {
    const item = cartItems.find(item => item.id === id);
    removeFromCart(id);
    
    if (item) {
      toast({
        title: "Item Removed",
        description: `${item.name} has been removed from your cart.`,
      });
    }
  }, [cartItems, removeFromCart, toast]);

  const handleUpdateQuantity = useCallback((id: string, newQuantity: number) => {
    updateQuantity(id, newQuantity);
  }, [updateQuantity]);

  const handleProceedToCheckout = useCallback(() => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart Empty",
        description: "Please add items to your cart before proceeding to checkout.",
        variant: "destructive",
      });
      return;
    }
    
    // Close the cart sidebar and navigate to checkout
    const sheetTrigger = document.querySelector('[data-state="open"]');
    if (sheetTrigger) {
      (sheetTrigger as HTMLElement).click();
    }
    
    setTimeout(() => {
      navigate('/checkout');
    }, 300);
  }, [cartItems.length, navigate, toast]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-gray-800 transition-colors">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span 
              key={totalItems}
              className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-bounce"
            >
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="glass-card border-l border-white/10 w-full xs:max-w-full sm:w-[380px] md:w-[420px]">
        <SheetHeader>
          <SheetTitle className="font-['Orbitron'] text-xl">Shopping Cart</SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground">Add some engines to get started!</p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto space-y-4 my-6">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onRemove={removeItem}
                  onUpdateQuantity={handleUpdateQuantity}
                />
              ))}
            </div>

            {/* Order Summary */}
            <div className="border-t border-white/10 pt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>${shipping}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-white/10 pt-4">
                <span>Total</span>
                <span className="text-primary">${total.toLocaleString()}</span>
              </div>
              
              <Button 
                variant="futuristic" 
                size="lg" 
                className="w-full hover:scale-105 transition-transform"
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

// Add display name for debugging
ShoppingCartSidebar.displayName = 'ShoppingCartSidebar';

export default ShoppingCartSidebar;