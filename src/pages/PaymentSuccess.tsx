import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateOrderStatus as updateOrderStatusApi } from '@/services/orderApi';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const { toast } = useToast();

  const sessionId = searchParams.get('session_id');
  const paymentIntentId = searchParams.get('payment_intent');

  useEffect(() => {
    const updateOrderStatus = async () => {
      try {
        setLoading(true);

        if (!sessionId && !paymentIntentId) {
          throw new Error('No payment reference found');
        }

        // Find and update order via API
        const response = await fetch(`http://localhost:3001/api/orders/payment-success?${sessionId ? `session_id=${sessionId}` : `payment_intent=${paymentIntentId}`}`, {
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error('Failed to update order status');
        }

        const order = await response.json();
        setOrderDetails(order);
        
        toast({
          title: "Payment Confirmed",
          description: "Your order has been confirmed and payment processed successfully.",
        });
      } catch (error: any) {
        console.error('Error updating order:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to update order status",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (sessionId || paymentIntentId) {
      updateOrderStatus();
    } else {
      setLoading(false);
    }
  }, [sessionId, paymentIntentId, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="glass-card border-green-200">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-green-600">
                Payment Successful!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-lg text-muted-foreground mb-4">
                  Thank you for your purchase! Your payment has been processed successfully.
                </p>
                
                {orderDetails && (
                  <div className="bg-muted/50 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-5 w-5" />
                      <span className="font-semibold">Order Details</span>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p><strong>Order Number:</strong> {orderDetails.order_number}</p>
                      <p><strong>Total Amount:</strong> ${orderDetails.total_amount?.toFixed(2)}</p>
                      <p><strong>Payment Method:</strong> {orderDetails.payment_method || 'Credit Card'}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    You will receive an email confirmation shortly with your order details and tracking information.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild>
                      <Link to="/orders">
                        View My Orders
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Continue Shopping
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}