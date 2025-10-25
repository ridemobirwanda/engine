import { supabase } from '@/integrations/supabase/client';
import { CartService } from '@/services/cartService';
// Google Ads tracking removed to prevent loading issues
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
  productId?: string;
}

const CART_STORAGE_KEY = 'engine_store_cart';

interface CartContextValue {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => Promise<void>;
  addToCartAndWait: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, newQuantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isLoading: boolean;
  isAuthenticated: boolean;
  forceSaveCart: () => void;
  waitForCartSave: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const hasLoadedCart = useRef(false);

  // Debug cart state changes (only in development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🛒 Cart state changed:', cartItems.length, 'items');
    }
  }, [cartItems]);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load cart on mount and auth changes
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      try {
        if (isAuthenticated) {
          // Load from database for authenticated users
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const dbCart = await CartService.getCartFromDatabase(user.id);
            setCartItems(dbCart);
          }
        } else {
          // Load from localStorage for guest users
          const savedCart = localStorage.getItem(CART_STORAGE_KEY);
          if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            setCartItems(parsedCart);
          }
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        // Fallback to localStorage
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            setCartItems(parsedCart);
          } catch (parseError) {
            console.error('Error parsing localStorage cart:', parseError);
            setCartItems([]);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [isAuthenticated]); // Include isAuthenticated dependency

  // Save cart to localStorage for guest users (debounced for performance)
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        if (process.env.NODE_ENV === 'development') {
          console.log('💾 Cart saved to localStorage:', cartItems.length, 'items');
        }
      }, 100); // Reduced debounce for faster persistence
      
      return () => clearTimeout(timeoutId);
    }
  }, [cartItems, isAuthenticated, isLoading]);

  const addToCart = useCallback(async (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const quantity = item.quantity || 1;
    
    // Debug logging only in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🛒 addToCart called:', item, 'quantity:', quantity);
    }
    
    // Validate item data
    if (!item.id || !item.name || item.price === undefined) {
      console.error('Invalid item data:', item);
      return;
    }
    
    // Google Ads tracking removed

    // Update local state IMMEDIATELY for instant UI feedback
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Item exists, updating quantity from', existingItem.quantity, 'to', existingItem.quantity + quantity);
        }
        const newItems = prevItems.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
        if (process.env.NODE_ENV === 'development') {
          console.log('🔄 Updated cart items:', newItems);
        }
        return newItems;
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.log('➕ New item, adding to cart');
        }
        const newItems = [...prevItems, { ...item, quantity }];
        if (process.env.NODE_ENV === 'development') {
          console.log('🔄 Updated cart items:', newItems);
        }
        return newItems;
      }
    });

    // Force save to localStorage immediately for guest users
    if (!isAuthenticated) {
      // Use setTimeout to ensure state update is complete
      setTimeout(() => {
        setCartItems(currentItems => {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(currentItems));
          if (process.env.NODE_ENV === 'development') {
            console.log('💾 Cart immediately saved to localStorage:', currentItems.length, 'items');
          }
          return currentItems;
        });
      }, 50);
    }

    // Then sync with database in the background (non-blocking)
    try {
      if (isAuthenticated) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Use setTimeout to make this non-blocking
          setTimeout(async () => {
            try {
              await CartService.addToCartDatabase(item.productId || item.id, quantity, user.id);
              console.log('Successfully synced to database');
            } catch (dbError) {
              console.error('Database sync failed:', dbError);
              // Optionally show a toast notification about sync failure
            }
          }, 0);
        }
      }
    } catch (error) {
      console.error('Error in addToCart:', error);
    }
  }, [isAuthenticated]);

  const removeFromCart = async (id: string) => {
    // Update local state IMMEDIATELY for instant UI feedback
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));

    // Then sync with database in the background (non-blocking)
    try {
      if (isAuthenticated) {
        const cartItem = cartItems.find(item => item.id === id);
        if (cartItem?.productId) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            setTimeout(async () => {
              try {
                const { data: dbCartItems } = await supabase
                  .from('cart_items')
                  .select('id')
                  .eq('user_id', user.id)
                  .eq('product_id', cartItem.productId);
                
                if (dbCartItems && dbCartItems.length > 0) {
                  await CartService.removeFromCartDatabase(dbCartItems[0].id);
                  console.log('Successfully removed from database');
                }
              } catch (dbError) {
                console.error('Database sync failed:', dbError);
              }
            }, 0);
          }
        }
      }
    } catch (error) {
      console.error('Error in removeFromCart:', error);
    }
  };

  const updateQuantity = async (id: string, newQuantity: number) => {
    // Update local state IMMEDIATELY for instant UI feedback
    if (newQuantity <= 0) {
      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }

    // Then sync with database in the background (non-blocking)
    try {
      if (isAuthenticated && newQuantity > 0) {
        const cartItem = cartItems.find(item => item.id === id);
        if (cartItem?.productId) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            setTimeout(async () => {
              try {
                const { data: dbCartItems } = await supabase
                  .from('cart_items')
                  .select('id')
                  .eq('user_id', user.id)
                  .eq('product_id', cartItem.productId);
                
                if (dbCartItems && dbCartItems.length > 0) {
                  await CartService.updateCartItemQuantity(dbCartItems[0].id, newQuantity);
                  console.log('Successfully updated quantity in database');
                }
              } catch (dbError) {
                console.error('Database sync failed:', dbError);
              }
            }, 0);
          }
        }
      } else if (newQuantity <= 0) {
        // Handle removal case
        await removeFromCart(id);
      }
    } catch (error) {
      console.error('Error in updateQuantity:', error);
    }
  };

  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await CartService.clearCartDatabase(user.id);
        }
      }

      // Update local state
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      // Still update local state even if database sync fails
      setCartItems([]);
    }
  };

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);

  const forceSaveCart = useCallback(() => {
    if (!isAuthenticated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      if (process.env.NODE_ENV === 'development') {
        console.log('💾 Cart force saved to localStorage:', cartItems.length, 'items');
      }
    }
  }, [cartItems, isAuthenticated]);

  const waitForCartSave = useCallback(async (): Promise<void> => {
    return new Promise((resolve) => {
      if (!isAuthenticated) {
        // Force save the current cart state to localStorage
        setCartItems(currentItems => {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(currentItems));
          if (process.env.NODE_ENV === 'development') {
            console.log('💾 Cart force saved to localStorage:', currentItems.length, 'items');
          }
          return currentItems;
        });
        // Small delay to ensure localStorage write is complete
        setTimeout(resolve, 300);
      } else {
        resolve();
      }
    });
  }, [isAuthenticated]);

  const addToCartAndWait = useCallback(async (item: Omit<CartItem, 'quantity'> & { quantity?: number }): Promise<void> => {
    // Add to cart first
    await addToCart(item);
    
    // Wait a bit for the state to update
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Force save to localStorage using current state
    if (!isAuthenticated) {
      setCartItems(currentItems => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(currentItems));
        if (process.env.NODE_ENV === 'development') {
          console.log('💾 Cart saved after addToCartAndWait:', currentItems.length, 'items');
        }
        return currentItems;
      });
    }
  }, [addToCart, isAuthenticated]);

  const value: CartContextValue = {
    cartItems,
    addToCart,
    addToCartAndWait,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isLoading,
    isAuthenticated,
    forceSaveCart,
    waitForCartSave,
  };

  // Use createElement to avoid JSX in .ts file
  return React.createElement(CartContext.Provider, { value }, children as React.ReactNode);
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};