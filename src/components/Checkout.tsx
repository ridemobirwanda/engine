import { PaymentGateway } from "@/components/PaymentGateway";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import { useGuestAuth } from "@/components/GuestAuthProvider";
import { OrderData, OrderSummary } from "@/services/orderService";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Check, CreditCard, Shield, Truck, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

// Form validation schemas
const shippingSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State/Province is required"),
  zipCode: z.string().min(1, "ZIP/Postal code is required"),
});

const paymentSchema = z.object({
  cardNumber: z.string().min(16, "Card number is required"),
  expiryDate: z.string().min(5, "Expiry date is required"),
  cvv: z.string().min(3, "CVV is required"),
  cardholderName: z.string().min(1, "Cardholder name is required"),
});

export const Checkout = () => {
  const { toast } = useToast();
  const { cartItems, getTotalPrice, clearCart, isLoading, addToCart } = useCart();
  const { guestUser } = useGuestAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Handle instant checkout product from sessionStorage
  useEffect(() => {
    const instantProduct = sessionStorage.getItem('instant-checkout-product');
    if (instantProduct && cartItems.length === 0) {
      try {
        const productData = JSON.parse(instantProduct);
        // Add the product to cart
        addToCart(productData);
        // Clear the sessionStorage
        sessionStorage.removeItem('instant-checkout-product');
        toast({
          title: "Product Added",
          description: `${productData.name} has been added to your cart for checkout.`,
        });
      } catch (error) {
        console.error('Error processing instant checkout:', error);
        sessionStorage.removeItem('instant-checkout-product');
      }
    }
  }, [addToCart, toast]);

  // Cart validation - redirect if empty (only after loading is complete)
  useEffect(() => {
    // Only check if cart is empty after loading is complete
    if (!isLoading && cartItems.length === 0) {
      toast({
        title: "Your cart is empty",
        description: "Please add some items to your cart before proceeding to checkout.",
        variant: "destructive",
      });
      navigate('/products');
      return;
    }
  }, [cartItems.length, isLoading, navigate, toast]);

  // Form setup
  const shippingForm = useForm<z.infer<typeof shippingSchema>>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: guestUser?.email || "",
      phone: "",
      address: "",
      city: "",
      country: "US",
      state: "",
      zipCode: "",
    },
  });

  const paymentForm = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
    },
  });

  const selectedCountry = shippingForm.watch("country");

  // World countries list
  const countries = [
    { code: "US", name: "United States" },
    { code: "CA", name: "Canada" },
    { code: "GB", name: "United Kingdom" },
    { code: "AU", name: "Australia" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "IT", name: "Italy" },
    { code: "ES", name: "Spain" },
    { code: "NL", name: "Netherlands" },
    { code: "BE", name: "Belgium" },
    { code: "CH", name: "Switzerland" },
    { code: "AT", name: "Austria" },
    { code: "SE", name: "Sweden" },
    { code: "NO", name: "Norway" },
    { code: "DK", name: "Denmark" },
    { code: "FI", name: "Finland" },
    { code: "IE", name: "Ireland" },
    { code: "PT", name: "Portugal" },
    { code: "JP", name: "Japan" },
    { code: "KR", name: "South Korea" },
    { code: "CN", name: "China" },
    { code: "SG", name: "Singapore" },
    { code: "IN", name: "India" },
    { code: "MX", name: "Mexico" },
    { code: "BR", name: "Brazil" },
    { code: "AR", name: "Argentina" },
    { code: "CL", name: "Chile" },
    { code: "NZ", name: "New Zealand" },
    { code: "ZA", name: "South Africa" },
  ].sort((a, b) => a.name.localeCompare(b.name));

  // US States for when US is selected
  const usStates = [
    { code: "AL", name: "Alabama" },
    { code: "AK", name: "Alaska" },
    { code: "AZ", name: "Arizona" },
    { code: "AR", name: "Arkansas" },
    { code: "CA", name: "California" },
    { code: "CO", name: "Colorado" },
    { code: "CT", name: "Connecticut" },
    { code: "DE", name: "Delaware" },
    { code: "FL", name: "Florida" },
    { code: "GA", name: "Georgia" },
    { code: "HI", name: "Hawaii" },
    { code: "ID", name: "Idaho" },
    { code: "IL", name: "Illinois" },
    { code: "IN", name: "Indiana" },
    { code: "IA", name: "Iowa" },
    { code: "KS", name: "Kansas" },
    { code: "KY", name: "Kentucky" },
    { code: "LA", name: "Louisiana" },
    { code: "ME", name: "Maine" },
    { code: "MD", name: "Maryland" },
    { code: "MA", name: "Massachusetts" },
    { code: "MI", name: "Michigan" },
    { code: "MN", name: "Minnesota" },
    { code: "MS", name: "Mississippi" },
    { code: "MO", name: "Missouri" },
    { code: "MT", name: "Montana" },
    { code: "NE", name: "Nebraska" },
    { code: "NV", name: "Nevada" },
    { code: "NH", name: "New Hampshire" },
    { code: "NJ", name: "New Jersey" },
    { code: "NM", name: "New Mexico" },
    { code: "NY", name: "New York" },
    { code: "NC", name: "North Carolina" },
    { code: "ND", name: "North Dakota" },
    { code: "OH", name: "Ohio" },
    { code: "OK", name: "Oklahoma" },
    { code: "OR", name: "Oregon" },
    { code: "PA", name: "Pennsylvania" },
    { code: "RI", name: "Rhode Island" },
    { code: "SC", name: "South Carolina" },
    { code: "SD", name: "South Dakota" },
    { code: "TN", name: "Tennessee" },
    { code: "TX", name: "Texas" },
    { code: "UT", name: "Utah" },
    { code: "VT", name: "Vermont" },
    { code: "VA", name: "Virginia" },
    { code: "WA", name: "Washington" },
    { code: "WV", name: "West Virginia" },
    { code: "WI", name: "Wisconsin" },
    { code: "WY", name: "Wyoming" }
  ];

  // Canadian provinces for when Canada is selected
  const canadianProvinces = [
    { code: "AB", name: "Alberta" },
    { code: "BC", name: "British Columbia" },
    { code: "MB", name: "Manitoba" },
    { code: "NB", name: "New Brunswick" },
    { code: "NL", name: "Newfoundland and Labrador" },
    { code: "NS", name: "Nova Scotia" },
    { code: "ON", name: "Ontario" },
    { code: "PE", name: "Prince Edward Island" },
    { code: "QC", name: "Quebec" },
    { code: "SK", name: "Saskatchewan" },
    { code: "NT", name: "Northwest Territories" },
    { code: "NU", name: "Nunavut" },
    { code: "YT", name: "Yukon" }
  ];

  // Use real cart data instead of mock data
  const subtotal = getTotalPrice();
  const shippingTotal = 150; // Fixed shipping cost
  const tax = Math.round(subtotal * 0.08); // 8% tax
  const total = subtotal + shippingTotal + tax;

  const steps = [
    { id: 1, title: "Shipping", icon: Truck },
    { id: 2, title: "Payment", icon: CreditCard },
    { id: 3, title: "Review", icon: Check }
  ];

  const handleNextStep = () => {
    if (currentStep === 1) {
      shippingForm.handleSubmit((data) => {
        console.log("Shipping data:", data);
        setCurrentStep(2);
      })();
    } else if (currentStep === 2) {
      if (paymentMethod === "card") {
        paymentForm.handleSubmit((data) => {
          console.log("Payment data:", data);
          setCurrentStep(3);
        })();
      } else {
        setCurrentStep(3);
      }
    }
  };

  const handlePaymentSuccess = async (paymentId: string, orderId?: string) => {
    try {
      // Clear the cart
      await clearCart();
      
      toast({
        title: "Payment Successful!",
        description: "Your order has been placed successfully.",
      });

      // Redirect to success page
      if (orderId) {
        navigate(`/payment-success?order_id=${orderId}`);
      } else {
        navigate('/payment-success');
      }
    } catch (error) {
      console.error('Error handling payment success:', error);
      toast({
        title: "Order Created",
        description: "Your order has been created, but there was an issue clearing the cart.",
      });
    }
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
  };

  // Prepare order data
  const getOrderData = (): OrderData => {
    const shippingData = shippingForm.getValues();
    return {
      shippingAddress: shippingData,
      billingAddress: shippingData, // Using same address for billing
      paymentMethod,
      notes: `Order placed via ${paymentMethod}`,
    };
  };

  const getOrderSummary = (): OrderSummary => {
    return {
      subtotal,
      shipping: shippingTotal,
      tax,
      total,
    };
  };

  // Show loading state while cart is being loaded
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your cart...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show empty cart message if cart is empty (only after loading is complete)
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => navigate('/products')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold font-['Orbitron'] text-gradient">Checkout</h1>
          </div>
          
          <div className="flex flex-col items-center justify-center py-20">
            <ShoppingCart className="h-24 w-24 text-muted-foreground mb-6" />
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground text-center mb-8 max-w-md">
              You need to add some items to your cart before you can proceed to checkout.
            </p>
            <Button onClick={() => navigate('/products')} size="lg">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/products')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold font-['Orbitron'] text-gradient">Checkout</h1>
          </div>
          
          {/* User Status */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm text-muted-foreground">
              {guestUser ? `Guest: ${guestUser.email}` : 'Authenticated User'}
            </span>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                currentStep >= step.id 
                  ? "bg-primary border-primary text-primary-foreground" 
                  : "border-muted-foreground text-muted-foreground"
              }`}>
                <step.icon className="h-5 w-5" />
              </div>
              <div className="ml-3 text-sm font-medium">
                {step.title}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 ml-6 transition-all duration-300 ${
                  currentStep > step.id ? "bg-primary" : "bg-muted"
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Information */}
            {currentStep === 1 && (
              <Card className="glass-card border-white/10">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 font-['Orbitron'] text-lg">
                    <Truck className="h-4 w-4" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <Form {...shippingForm}>
                    <form onSubmit={shippingForm.handleSubmit((data) => setCurrentStep(2))} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={shippingForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="John" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={shippingForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={shippingForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john.doe@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={shippingForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number *</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="+35796115404" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={shippingForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address *</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main Street" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={shippingForm.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City *</FormLabel>
                              <FormControl>
                                <Input placeholder="New York" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={shippingForm.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-background border-white/20 hover:border-white/40">
                                    <SelectValue placeholder="Select country" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-background border-white/20 max-h-60">
                                  {countries.map((country) => (
                                    <SelectItem key={country.code} value={country.code} className="hover:bg-white/10">
                                      {country.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={shippingForm.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {selectedCountry === "US" ? "State *" : selectedCountry === "CA" ? "Province *" : "State/Province *"}
                              </FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-background border-white/20 hover:border-white/40">
                                    <SelectValue placeholder={
                                      selectedCountry === "US" ? "Select state" : 
                                      selectedCountry === "CA" ? "Select province" : 
                                      "Select state/province"
                                    } />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-background border-white/20 max-h-60">
                                  {selectedCountry === "US" && usStates.map((state) => (
                                    <SelectItem key={state.code} value={state.code} className="hover:bg-white/10">
                                      {state.name}
                                    </SelectItem>
                                  ))}
                                  {selectedCountry === "CA" && canadianProvinces.map((province) => (
                                    <SelectItem key={province.code} value={province.code} className="hover:bg-white/10">
                                      {province.name}
                                    </SelectItem>
                                  ))}
                                  {selectedCountry !== "US" && selectedCountry !== "CA" && (
                                    <SelectItem value="other" className="hover:bg-white/10">
                                      Other/Not Applicable
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={shippingForm.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP/Postal Code *</FormLabel>
                            <FormControl>
                              <Input placeholder="10001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment Information */}
            {currentStep === 2 && (
              <Card className="glass-card border-white/10">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 font-['Orbitron'] text-lg">
                    <CreditCard className="h-4 w-4" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  {/* Payment Method Selection */}
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Payment Method</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {["card", "paypal", "crypto"].map((method) => (
                        <div
                          key={method}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                            paymentMethod === method 
                              ? "border-primary bg-primary/10" 
                              : "border-muted hover:border-primary/50"
                          }`}
                          onClick={() => setPaymentMethod(method)}
                        >
                          <div className="text-center">
                            <CreditCard className="h-8 w-8 mx-auto mb-2" />
                            <p className="font-medium capitalize">
                              {method === "card" ? "Credit Card" : method === "paypal" ? "PayPal" : "Cryptocurrency"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Credit Card Form */}
                  {paymentMethod === "card" && (
                    <Form {...paymentForm}>
                      <form onSubmit={paymentForm.handleSubmit((data) => setCurrentStep(3))} className="space-y-4">
                        <FormField
                          control={paymentForm.control}
                          name="cardholderName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cardholder Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={paymentForm.control}
                          name="cardNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Card Number *</FormLabel>
                              <FormControl>
                                <Input placeholder="1234 5678 9012 3456" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={paymentForm.control}
                            name="expiryDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expiry Date *</FormLabel>
                                <FormControl>
                                  <Input placeholder="MM/YY" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={paymentForm.control}
                            name="cvv"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CVV *</FormLabel>
                                <FormControl>
                                  <Input placeholder="123" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </form>
                    </Form>
                  )}

                  {/* Alternative Payment Methods */}
                  {paymentMethod === "paypal" && (
                    <div className="p-6 border border-muted rounded-lg text-center">
                      <p className="text-muted-foreground">You will be redirected to PayPal to complete your payment.</p>
                    </div>
                  )}

                  {paymentMethod === "crypto" && (
                    <div className="p-6 border border-muted rounded-lg text-center">
                      <p className="text-muted-foreground">Cryptocurrency payment options will be available at checkout.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 3: Review Order */}
            {currentStep === 3 && (
              <Card className="glass-card border-white/10">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 font-['Orbitron'] text-lg">
                    <Check className="h-4 w-4" />
                    Review Order
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  {/* Order Items */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Order Items</h3>
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-4 border border-muted rounded-lg">
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">${(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  {/* Security Guarantee */}
                  <div className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <Shield className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-medium">Secure Checkout</p>
                      <p className="text-sm text-muted-foreground">Your payment information is encrypted and secure</p>
                    </div>
                  </div>

                  {/* Payment Gateway Integration */}
                  <PaymentGateway 
                    amount={total}
                    cartItems={cartItems}
                    orderData={getOrderData()}
                    orderSummary={getOrderSummary()}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="border-white/20 hover:border-white/40"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentStep < 3 && (
                <Button
                  onClick={handleNextStep}
                  className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary"
                >
                  Next Step
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="glass-card border-white/10 sticky top-8">
              <CardHeader className="pb-4">
                <CardTitle className="font-['Orbitron'] text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-sm">${(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <Separator className="bg-white/10" />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>${shippingTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toLocaleString()}</span>
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">${total.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
