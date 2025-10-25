import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Only load Stripe if we have a valid publishable key
const getStripePromise = () => {
  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
  if (!publishableKey || publishableKey === 'pk_test_disabled' || publishableKey.length < 10) {
    console.warn('Stripe not configured - no valid publishable key found');
    return null;
  }
  return loadStripe(publishableKey);
};

const stripePromise = getStripePromise();

interface StripeCardFormProps {
  amount: number;
  currency: string;
  description: string;
  orderId?: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

const StripeCardFormInner = ({ 
  amount, 
  currency, 
  description, 
  orderId, 
  onSuccess, 
  onError 
}: StripeCardFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      // Create payment intent
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const { data, error } = await supabase.functions.invoke('create-stripe-payment-intent', {
        body: {
          amount: Math.round(amount * 100), // Convert to cents
          currency: currency.toLowerCase(),
          description,
          order_id: orderId,
        },
        headers
      });

      if (error) {
        throw new Error(error.message || 'Failed to create payment intent');
      }

      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data.client_secret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
          }
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message || 'Payment failed');
      }

      if (paymentIntent?.status === 'succeeded') {
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully.",
        });
        onSuccess(paymentIntent.id);
      } else {
        throw new Error('Payment was not successful');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: error.message || 'Payment failed',
        variant: "destructive",
      });
      onError(error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={!stripe || loading}
        className="w-full"
      >
        {loading ? 'Processing...' : `Pay $${amount.toFixed(2)} ${currency.toUpperCase()}`}
      </Button>
    </form>
  );
};

export const StripeCardForm = (props: StripeCardFormProps) => {
  // If Stripe is not configured, show a message instead of loading the component
  if (!stripePromise) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Stripe payment processing is not configured. Please contact the administrator.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <StripeCardFormInner {...props} />
    </Elements>
  );
};
