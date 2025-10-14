import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, CheckCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

const CheckoutForm = ({ clientSecret }: { clientSecret: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout-success`,
      },
      redirect: "if_required"
    });

    if (error) {
      setMessage(error.message || 'An unexpected error occurred.');
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setMessage('Payment succeeded!');
      setIsComplete(true);
    }

    setIsLoading(false);
  };

  if (isComplete) {
    return (
      <div className="text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
        <p className="text-gray-600">Thank you for your purchase. We'll be in touch soon to schedule your service.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {message && (
        <div className="text-red-600 text-sm">{message}</div>
      )}
      <Button 
        type="submit" 
        disabled={!stripe || isLoading} 
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4 mr-2" />
            Complete Payment
          </>
        )}
      </Button>
    </form>
  );
};

const Checkout = () => {
  const [location] = useLocation();
  const [clientSecret, setClientSecret] = useState('');
  const [serviceData, setServiceData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    
    if (serviceParam) {
      try {
        const parsedService = JSON.parse(decodeURIComponent(serviceParam));
        setServiceData(parsedService);
        
        // Create payment intent
        apiFetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: parseFloat(parsedService.price.replace(/[$,]/g, '')) * 100, // Convert to cents
            currency: 'cad',
            metadata: {
              serviceName: parsedService.name,
              serviceCategory: parsedService.category,
              description: parsedService.description
            }
          }),
        })
        .then((res) => res.json())
        .then((data) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          } else if (data.error) {
            setError(data.error);
          }
        })
        .catch((error) => {
          console.error('Error creating payment intent:', error);
          setError('Failed to initialize payment. Please check your Stripe configuration.');
        });
      } catch (error) {
        console.error('Error parsing service data:', error);
        setError('Invalid service data provided.');
      }
    }
  }, [location]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="text-red-600 mb-4">
              <CreditCard className="h-12 w-12 mx-auto mb-2" />
              <h2 className="text-xl font-semibold">Payment Error</h2>
              <p className="text-gray-600 mt-2">{error}</p>
            </div>
            <Button 
              onClick={() => window.history.back()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!clientSecret || !stripePromise) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading payment form...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Complete Your Purchase</CardTitle>
            {serviceData && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold">{serviceData.name}</h3>
                <p className="text-gray-600 text-sm">{serviceData.description}</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">{serviceData.price}</p>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm clientSecret={clientSecret} />
            </Elements>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;
