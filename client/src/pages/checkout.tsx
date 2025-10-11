import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, CheckCircle } from "lucide-react";

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
      // Create calendar schedule entry after successful payment
      const urlParams = new URLSearchParams(window.location.search);
      const quoteNumber = paymentIntent.metadata?.quoteNumber;
      
      if (quoteNumber) {
        // Schedule the job automatically
        const scheduleData = {
          jobType: 'installation',
          serviceType: 'hvac',
          scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 1 week from now
          startTime: '09:00',
          endTime: '15:00',
          estimatedDuration: 6,
          status: 'scheduled',
          priority: 'normal',
          specialInstructions: 'Payment completed - ready to schedule installation',
          paymentStatus: 'paid'
        };
        
        // Find the quote ID and create schedule
        fetch('/api/quotes')
          .then(res => res.json())
          .then(quotes => {
            const quote = quotes.find((q: any) => q.quoteNumber === quoteNumber);
            if (quote) {
              return fetch(`/api/quotes/${quote.id}/schedule`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(scheduleData)
              });
            }
          })
          .catch(err => console.log('Schedule creation optional:', err));
      }
      
      setMessage('Payment successful! Your job has been automatically added to the schedule.');
      setIsComplete(true);
    }

    setIsLoading(false);
  };

  if (isComplete) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-green-700 mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-4">{message}</p>
        <Button 
          onClick={() => window.close()}
          className="bg-green-600 hover:bg-green-700"
        >
          Close Window
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-gray-50 rounded-lg">
        <PaymentElement 
          options={{
            layout: "tabs",
            defaultValues: {
              billingDetails: {
                address: {
                  country: 'CA'
                }
              }
            }
          }}
        />
      </div>
      
      {message && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {message}
        </div>
      )}
      
      <Button 
        type="submit" 
        disabled={!stripe || !elements || isLoading}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3"
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

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [location] = useLocation();
  
  useEffect(() => {
    // Get client secret from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const secret = urlParams.get('client_secret');
    
    if (secret) {
      setClientSecret(secret);
    } else {
      setClientSecret('missing');
    }
  }, [location]);

  if (!stripePromise) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="text-yellow-600 mb-4">
              <CreditCard className="h-12 w-12 mx-auto mb-2" />
              <h2 className="text-xl font-semibold">Payment System Not Configured</h2>
              <p className="text-gray-600 mt-2">
                Stripe payment system is not configured. Please contact support.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!clientSecret || clientSecret === 'missing') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="text-red-600 mb-4">
              <CreditCard className="h-12 w-12 mx-auto mb-2" />
              <h2 className="text-xl font-semibold">Payment Error</h2>
              <p className="text-gray-600 mt-2">
                Invalid payment session. Please try again from the quote builder.
              </p>
            </div>
            <Button 
              onClick={() => window.close()}
              variant="outline"
            >
              Close Window
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-t-lg">
            <CardTitle className="text-xl flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              AfterHours HVAC - Secure Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Elements 
              stripe={stripePromise} 
              options={{ 
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#ea580c',
                  }
                }
              }}
            >
              <CheckoutForm clientSecret={clientSecret} />
            </Elements>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>🔒 Payments secured by Stripe</p>
          <p>Your payment information is encrypted and secure</p>
        </div>
      </div>
    </div>
  );
}