import { useState, useEffect, useMemo } from "react";
import { useLocation, useRoute, Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  CheckCircle, 
  CreditCard,
  Shield,
  Loader2
} from "lucide-react";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

// Product configurations (same as checkout page)
const productConfigs = {
  'furnace-premium': {
    name: 'Premium High-Efficiency Furnace',
    price: 7999,
    description: '96% AFUE efficiency rating with advanced features',
    category: 'Furnaces'
  },
  'ac-premium': {
    name: 'Premium Central Air Conditioning',
    price: 7499,
    description: '18+ SEER high-efficiency cooling system',
    category: 'Air Conditioning'
  },
  'water-heater-premium': {
    name: 'Premium Gas Water Heater',
    price: 3200,
    description: 'High-efficiency 50-gallon capacity',
    category: 'Water Heaters'
  },
  'maintenance-quickshot': {
    name: 'QuickShot Diagnostic',
    price: 319,
    description: '20-point comprehensive HVAC system inspection',
    category: 'Maintenance'
  },
  'maintenance-dominion': {
    name: 'Dominion Annual Plan',
    price: 1055,
    description: 'Comprehensive yearly maintenance coverage',
    category: 'Maintenance'
  }
};

const maintenanceAddOns = [
  {
    id: 'quickshot',
    name: 'QuickShot Diagnostic',
    price: 319,
  },
  {
    id: 'dominion',
    name: 'Annual Maintenance Plan',
    price: 1055,
  }
];

const PaymentForm = ({ productId, addOns, onSuccess }: { 
  productId: string; 
  addOns: string[];
  onSuccess: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const product = productConfigs[productId as keyof typeof productConfigs];
  
  const calculateTotal = () => {
    if (!product) return 0;
    const addOnTotal = addOns.reduce((total, addOnId) => {
      const addOn = maintenanceAddOns.find(a => a.id === addOnId);
      return total + (addOn?.price || 0);
    }, 0);
    return product.price + addOnTotal;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      setIsProcessing(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-confirmation`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsProcessing(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>{product?.name}</span>
            <span>${product?.price.toLocaleString()}</span>
          </div>
          {addOns.map(addOnId => {
            const addOn = maintenanceAddOns.find(a => a.id === addOnId);
            return addOn ? (
              <div key={addOn.id} className="flex justify-between text-gray-600">
                <span>{addOn.name}</span>
                <span>+${addOn.price}</span>
              </div>
            ) : null;
          })}
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span className="text-blue-600">${calculateTotal().toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <PaymentElement />
      
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Complete Payment
          </>
        )}
      </Button>
    </form>
  );
};

const PaymentPage = () => {
  const [, params] = useRoute("/payment/:productId");
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [paymentIntentCreated, setPaymentIntentCreated] = useState(false);
  
  const productId = params?.productId;
  const urlParams = new URLSearchParams(window.location.search);
  const addOns = urlParams.get('addons')?.split(',').filter(Boolean) || [];
  
  const product = productId ? productConfigs[productId as keyof typeof productConfigs] : null;

  useEffect(() => {
    // Redirect if not authenticated
    if (!user) {
      setLocation(`/auth?redirect=/payment/${productId}`);
      return;
    }

    // Create payment intent only once
    if (product && !paymentIntentCreated && user) {
      setPaymentIntentCreated(true);
      
      const addOnTotal = addOns.reduce((total, addOnId) => {
        const addOn = maintenanceAddOns.find(a => a.id === addOnId);
        return total + (addOn?.price || 0);
      }, 0);
      const totalAmount = product.price + addOnTotal;

      apiRequest("POST", "/api/create-payment-intent", { 
        amount: totalAmount,
        description: `${product.name}${addOns.length > 0 ? ' with maintenance services' : ''}`,
        metadata: {
          productId,
          addOns: addOns.join(','),
          userId: user.id
        }
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error creating payment intent:', error);
          setIsLoading(false);
          setPaymentIntentCreated(false);
        });
    }
  }, [user, product, productId, addOns, paymentIntentCreated]);

  const handlePaymentSuccess = () => {
    setLocation('/payment-confirmation');
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-6">The requested product could not be found.</p>
            <Button asChild>
              <Link href="/">Return Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || !clientSecret) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold mb-2">Preparing Your Payment</h2>
            <p className="text-gray-600">Please wait while we set up your secure checkout...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Payment - {product.name} | AfterHours HVAC</title>
        <meta name="description" content={`Complete your purchase of ${product.name}`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/checkout/${productId}`}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Checkout
                  </Link>
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">Complete Payment</h1>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Secured by Stripe</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            
            {/* Product Summary */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Your Order
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-gray-600 text-sm">{product.description}</p>
                    {addOns.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Add-on Services:</p>
                        {addOns.map(addOnId => {
                          const addOn = maintenanceAddOns.find(a => a.id === addOnId);
                          return addOn ? (
                            <p key={addOn.id} className="text-sm text-gray-600">• {addOn.name}</p>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
                <p className="text-sm text-gray-600">
                  Your payment is secure and encrypted. We never store your payment information.
                </p>
              </CardHeader>
              <CardContent>
                {clientSecret && (
                  <Elements 
                    stripe={stripePromise} 
                    options={{ 
                      clientSecret,
                      appearance: {
                        theme: 'stripe',
                        variables: {
                          colorPrimary: '#2563eb',
                        }
                      }
                    }}
                  >
                    <PaymentForm 
                      productId={productId!} 
                      addOns={addOns}
                      onSuccess={handlePaymentSuccess}
                    />
                  </Elements>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;