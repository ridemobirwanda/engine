import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, CreditCard } from 'lucide-react';

export default function PaymentCancelled() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="glass-card border-red-200">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <XCircle className="h-16 w-16 text-red-500" />
              </div>
              <CardTitle className="text-2xl text-red-600">
                Payment Cancelled
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-lg text-muted-foreground mb-4">
                  Your payment was cancelled. No charges have been made to your account.
                </p>
                
                <div className="bg-muted/50 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-5 w-5" />
                    <span className="font-semibold">What happened?</span>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• You cancelled the payment process</p>
                    <p>• There was an issue with your payment method</p>
                    <p>• The payment session expired</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    You can try again with a different payment method or contact support if you continue to have issues.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild>
                      <Link to="/checkout">
                        Try Again
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