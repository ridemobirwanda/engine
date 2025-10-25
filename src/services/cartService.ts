import { CartItem } from '@/hooks/useCart';
import { getCart, addOrIncrement, updateQuantity as apiUpdateQty, removeItem, clearUserCart, syncCart as apiSyncCart } from './cartApi';

export class CartService {
  static async syncCartToDatabase(cartItems: CartItem[], userId: string) {
    try {
      await apiSyncCart(userId, cartItems.map(i => ({ product_id: i.productId || i.id, quantity: i.quantity })));
      return [];
    } catch (error) {
      console.error('Error syncing cart to database:', error);
      throw error;
    }
  }

  static async getCartFromDatabase(userId: string): Promise<CartItem[]> {
    try {
      const data = await getCart(userId);
      return (data || []).map((item: any) => ({
        id: item.product_id || item.id,
        productId: item.product_id || item.id,
        name: item.product_name || 'Unknown Product',
        price: Number(item.unit_price || item.price || 0),
        quantity: Number(item.quantity || 1),
        image: item.image_url || '/placeholder.svg',
        category: item.category_name || 'Uncategorized',
      }));
    } catch (error) {
      console.error('Error fetching cart from database:', error);
      return [];
    }
  }

  static async addToCartDatabase(productId: string, quantity: number, userId: string) {
    try {
      await addOrIncrement(userId, productId, quantity);
    } catch (error) {
      console.error('Error adding to cart database:', error);
      throw error;
    }
  }

  static async updateCartItemQuantity(cartItemId: string, quantity: number) {
    try {
      await apiUpdateQty(cartItemId, quantity);
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      throw error;
    }
  }

  static async removeFromCartDatabase(cartItemId: string) {
    try {
      await removeItem(cartItemId);
    } catch (error) {
      console.error('Error removing from cart database:', error);
      throw error;
    }
  }

  static async clearCartDatabase(userId: string) {
    try {
      await clearUserCart(userId);
    } catch (error) {
      console.error('Error clearing cart database:', error);
      throw error;
    }
  }
}
