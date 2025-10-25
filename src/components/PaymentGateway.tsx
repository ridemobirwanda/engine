import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CartItem } from "@/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";
import { OrderData, OrderService, OrderSummary } from "@/services/orderService";
import { CreditCard, Loader2, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { StripeCardForm } from "./StripeCardForm";
import CryptoPayment from "./CryptoPayment";
import { getSettingByKey } from '@/services/websiteSettingsService';

interface PaymentGatewayProps {
  amount: number;
  currency?: string;
  description?: string;
  cartItems: CartItem[];
  orderData: OrderData;
  orderSummary: OrderSummary;
  onSuccess?: (paymentId: string, orderId?: string) => void;
  onError?: (error: string) => void;
}

export const PaymentGateway = ({ 
  amount, 
  currency = "USD", 
  description = "Payment",
  cartItems,
  orderData,
  orderSummary,
  onSuccess, 
  onError 
}: PaymentGatewayProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [paymentSettings, setPaymentSettings] = useState({
    stripe_enabled: false,
    paypal_enabled: false,
    crypto_enabled: false,
    test_mode: true
  });

  // Load payment settings from database
  useEffect(() => {
    const loadPaymentSettings = async () => {
      try {
        const paymentSettingsRecord = await getSettingByKey('payment_settings');
        if (paymentSettingsRecord?.value) {
          const paymentSettingsData = typeof paymentSettingsRecord.value === 'string' ? JSON.parse(paymentSettingsRecord.value) : paymentSettingsRecord.value;
          setPaymentSettings({
            stripe_enabled: paymentSettingsData.stripe_enabled || false,
            paypal_enabled: paymentSettingsData.paypal_enabled || false,
            crypto_enabled: paymentSettingsData.crypto_enabled || false,
            test_mode: paymentSettingsData.test_mode ?? true
          });
        } else {
          // Fallback: load individual settings as before, but from MySQL
          const keys = ['stripe_enabled', 'paypal_enabled', 'crypto_enabled', 'test_mode'];
          const vals = {};
          for (const key of keys) {
            const rec = await getSettingByKey(key);
            vals[key] = rec?.value ?? false;
          }
          setPaymentSettings({
            stripe_enabled: vals.stripe_enabled,
            paypal_enabled: vals.paypal_enabled,
            crypto_enabled: vals.crypto_enabled,
            test_mode: vals.test_mode
          });
        }
      } catch (error) {
        console.error('Error loading payment settings:', error);
      }
    };

    loadPaymentSettings();
  }, []);

  // Normalize inputs
  const items = Array.isArray(cartItems) ? cartItems : [];

  // Compute a safe fallback summary if caller didn't provide one
  const safeSummary: OrderSummary = (() => {
    if (orderSummary && typeof orderSummary.total === 'number') return orderSummary;
    const computedSubtotal = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const computedTotal = Number.isFinite(amount) && amount > 0 ? amount : computedSubtotal;
    return { subtotal: computedSubtotal, shipping: 0, tax: 0, total: computedTotal };
  })();

  const buildOrderData = (method: string): OrderData => {
    const base = orderData || {
      shippingAddress: {
        firstName: 'Guest',
        lastName: '',
        email: 'guest@example.com',
        phone: '',
        address: '',
        city: '',
        country: '',
        state: '',
        zipCode: ''
      },
      paymentMethod: method as string,
    } as OrderData;
    return { ...base, paymentMethod: method };
  };

  const processStripePayment = async () => {
    setLoading(true);
    try {
      // Get the auth header for the current user (optional for guest purchases)
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      // Try to create order first, but don't fail if it doesn't work
      let orderId = null;
      try {
        const order = await OrderService.createOrder(items, buildOrderData('card'), safeSummary);
        orderId = order.id;
      } catch (orderError) {
        console.log('Could not create order, proceeding with payment only:', orderError);
        // Continue with payment even if order creation fails
      }

      console.log('Calling Stripe payment function with:', {
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        description,
        order_id: orderId
      });

      const { data, error } = await supabase.functions.invoke('create-stripe-payment', {
        body: {
          amount: Math.round(amount * 100), // Convert to cents
          currency: currency.toLowerCase(),
          description,
          order_id: orderId,
        },
        headers
      });

      console.log('Stripe function response:', { data, error });

      if (error) {
        console.error('Stripe function error details:', error);
        throw new Error(`Payment service error: ${error.message || 'Failed to process payment'}`);
      }

      if (data?.url) {
        // Update order with payment intent ID if we have an order
        if (orderId) {
          try {
            await OrderService.updateOrderStatus(orderId, 'pending', 'processing');
          } catch (updateError) {
            console.log('Could not update order status:', updateError);
          }
        }
        
        // Open Stripe checkout in new tab
        window.open(data.url, '_blank');
        toast({
          title: "Redirecting to Stripe",
          description: "Please complete your payment in the new tab.",
        });
        onSuccess?.(data.session_id, orderId);
      }
    } catch (error: any) {
      console.error('Stripe payment error:', error);
      let errorMessage = 'Payment failed';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error.error) {
        errorMessage = error.error;
      }
      
      console.error('Final error message:', errorMessage);
      
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const processPayPalPayment = async () => {
    setLoading(true);
    try {
      // Get the auth header for the current user (optional for guest purchases)
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      // Try to create order first, but don't fail if it doesn't work
      let orderId = null;
      try {
        const order = await OrderService.createOrder(items, buildOrderData('paypal'), safeSummary);
        orderId = order.id;
      } catch (orderError) {
        console.log('Could not create order, proceeding with payment only:', orderError);
        // Continue with payment even if order creation fails
      }
      
      const { data, error } = await supabase.functions.invoke('create-paypal-payment', {
        body: {
          amount,
          currency,
          description,
          order_id: orderId,
        },
        headers
      });

      if (error) throw error;

      if (data?.url) {
        // Update order with payment intent ID if we have an order
        if (orderId) {
          try {
            await OrderService.updateOrderStatus(orderId, 'pending', 'processing');
          } catch (updateError) {
            console.log('Could not update order status:', updateError);
          }
        }
        
        // Open PayPal checkout in new tab
        window.open(data.url, '_blank');
        toast({
          title: "Redirecting to PayPal",
          description: "Please complete your payment in the new tab.",
        });
        onSuccess?.(data.payment_id, orderId);
      }
    } catch (error: any) {
      console.error('PayPal payment error:', error);
      const errorMessage = error.message || 'PayPal payment failed';
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const processCryptoPayment = async (currency: string) => {
    setLoading(true);
    try {
      // Create order first
      const order = await OrderService.createOrder(items, buildOrderData(`crypto_${currency.toLowerCase()}`), safeSummary);
      
      // Get crypto settings
      const { data, error } = await supabase
        .from('website_settings')
        .select('value')
        .eq('key', 'crypto_settings')
        .single();

      if (error) throw error;

      const cryptoSettings = data.value as any;
      let address = '';
      
      switch (currency.toLowerCase()) {
        case 'btc':
          address = cryptoSettings?.btc_address || '';
          break;
        case 'usdt':
          address = cryptoSettings?.usdt_address || '';
          break;
        case 'eth':
          address = cryptoSettings?.eth_address || '';
          break;
        case 'bnb':
          address = cryptoSettings?.bnb_address || '';
          break;
        default:
          throw new Error('Unsupported cryptocurrency');
      }

      if (!address) {
        throw new Error(`${currency.toUpperCase()} address not configured`);
      }

      // Update order status to pending payment
      await OrderService.updateOrderStatus(order.id, 'pending', 'pending');

      toast({
        title: `${currency.toUpperCase()} Payment`,
        description: `Send ${amount} ${currency.toUpperCase()} to: ${address}`,
        duration: 10000,
      });

      onSuccess?.(`crypto_${currency}_${Date.now()}`, order.id);
    } catch (error: any) {
      console.error('Crypto payment error:', error);
      const errorMessage = error.message || 'Cryptocurrency payment failed';
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const hasEnabledPayments = paymentSettings.stripe_enabled || paymentSettings.paypal_enabled || paymentSettings.crypto_enabled;

  if (!hasEnabledPayments) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No payment methods are currently configured.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CreditCard className="h-4 w-4" />
          Payment Options
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs px-2 py-1">
            ${amount.toFixed(2)} {currency}
          </Badge>
          {paymentSettings.test_mode && (
            <Badge variant="secondary" className="text-xs px-2 py-1">
              Test Mode
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="text-sm text-muted-foreground mb-4">
          {description}
        </div>

        <div className="space-y-3">
          {paymentSettings.stripe_enabled && (
            <div className="space-y-4">
              <StripeCardForm
                amount={amount}
                currency={currency}
                description={description}
                orderId={orderId}
                onSuccess={(paymentIntentId) => {
                  toast({
                    title: "Payment Successful",
                    description: "Your payment has been processed successfully.",
                  });
                  onSuccess?.(paymentIntentId, orderId);
                }}
                onError={(error) => {
                  toast({
                    title: "Payment Error",
                    description: error,
                    variant: "destructive",
                  });
                  onError?.(error);
                }}
              />
            </div>
          )}

          {paymentSettings.paypal_enabled && (
            <Button
              onClick={processPayPalPayment}
              disabled={loading}
              className="w-full bg-[#0070ba] hover:bg-[#005ea6]"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <CreditCard className="h-4 w-4 mr-2" />
              )}
              Pay with PayPal
            </Button>
          )}

          {paymentSettings.crypto_enabled && (
            <CryptoPayment
              amount={amount}
              currency={currency}
              onSuccess={(paymentData) => {
                toast({
                  title: "Payment Submitted",
                  description: "Your cryptocurrency payment has been submitted for verification.",
                });
                onSuccess?.(paymentData.transactionHash, orderId);
              }}
              onError={(error) => {
                toast({
                  title: "Payment Error",
                  description: error,
                  variant: "destructive",
                });
                onError?.(error);
              }}
            />
          )}
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-4">
          <Shield className="h-3 w-3" />
          <span>Secure payment processing</span>
        </div>
      </CardContent>
    </Card>
  );
};
