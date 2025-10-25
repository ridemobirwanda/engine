import { CartItem } from '@/hooks/useCart';
import { createOrderApi, updateOrderApi, getUserOrdersApi, getOrderByIdApi } from './orderApi';
import { supabase } from '@/integrations/supabase/client';

export interface OrderData {
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    state: string;
    zipCode: string;
  };
  billingAddress?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    state: string;
    zipCode: string;
  };
  paymentMethod: string;
  paymentIntentId?: string;
  notes?: string;
}

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export class OrderService {
  static async createOrder(
    cartItems: CartItem[],
    orderData: OrderData | undefined,
    orderSummary: OrderSummary
  ) {
    try {
      if (!orderSummary || typeof orderSummary.total !== 'number') {
        throw new Error('Invalid order summary');
      }
      const safeOrderData: OrderData = orderData || {
        shippingAddress: {
          firstName: 'Guest', lastName: '', email: 'guest@example.com', phone: '',
          address: '', city: '', country: '', state: '', zipCode: ''
        },
        paymentMethod: 'card',
      };
      const { data: { user } } = await supabase.auth.getUser();
      const isGuest = !user;
      const orderNumber = `ENG-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const orderRecord = {
        user_id: user?.id || null,
        order_number: orderNumber,
        status: 'pending',
        total_amount: orderSummary.total,
        subtotal: orderSummary.subtotal,
        tax_amount: orderSummary.tax,
        shipping_amount: orderSummary.shipping,
        currency: 'USD',
        payment_status: 'pending',
        payment_method: safeOrderData.paymentMethod,
        payment_intent_id: safeOrderData.paymentIntentId,
        billing_address: safeOrderData.billingAddress || safeOrderData.shippingAddress,
        shipping_address: safeOrderData.shippingAddress,
        notes: safeOrderData.notes,
        guest_email: isGuest ? safeOrderData.shippingAddress.email : null,
      } as any;

      const orderItems = cartItems.map(item => ({
        product_id: item.productId || item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
        product_snapshot: {
          name: item.name,
          image: item.image,
          category: item.category,
          sku: item.id,
        }
      }));

      const order = await createOrderApi(orderRecord, orderItems);
      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  static async updateOrderStatus(orderId: string, status: string, paymentStatus?: string) {
    try {
      const updateData: any = { status };
      if (paymentStatus) updateData.payment_status = paymentStatus;
      await updateOrderApi(orderId, updateData);
      return { id: orderId, ...updateData };
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  static async getUserOrders(userId: string) {
    try {
      return await getUserOrdersApi(userId);
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  static async getOrderById(orderId: string) {
    try {
      return await getOrderByIdApi(orderId);
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }
}
