import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useStripe } from '@stripe/react-stripe-js';
import { loadStripe, PaymentIntent } from '@stripe/stripe-js';

// Extend the PaymentIntent type to include metadata
interface EnhancedPaymentIntent extends PaymentIntent {
  metadata?: {
    isProCalculator?: string;
    service?: string;
    [key: string]: string | undefined;
  };
}

// Make sure to call `loadStripe` outside of a component's render
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

const PaymentConfirmation = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [paymentIntent, setPaymentIntent] = useState<EnhancedPaymentIntent | null>(null);
  const [isPro, setIsPro] = useState(false);
  
  useEffect(() => {
    const fetchPaymentStatus = async () => {
      // Check if we're coming directly from a Stripe redirect
      const query = new URLSearchParams(window.location.search);
      const paymentIntentClientSecret = query.get('payment_intent_client_secret');
      const paymentIntentId = query.get('payment_intent');
      const service = query.get('service'); // Check if service type was passed directly
      
      // For Pro Calculator purchases directly from checkout page
      if (service === 'pro') {
        setIsPro(true);
        setStatus('success');
        
        // Update user access in the database (using mock user ID for demo)
        try {
          const mockUserId = 1; // In a real app, this would be the authenticated user's ID
          const response = await apiFetch(`/api/update-pro-access?userId=${mockUserId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              hasAccess: true,
              grantedAt: new Date().toISOString(),
            }),
          });
          
          if (!response.ok) {
            console.error('Failed to update pro access status');
          }
        } catch (error) {
          console.error('Error updating pro access status:', error);
        }
        
        return;
      }
      
      if (!paymentIntentClientSecret || !paymentIntentId) {
        // If not from a redirect, we're likely coming from a simulated success in checkout
        setStatus('success');
        return;
      }
      
      try {
        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error("Stripe failed to initialize");
        }
        
        const { paymentIntent: retrievedIntent } = await stripe.retrievePaymentIntent(paymentIntentClientSecret);
        
        if (retrievedIntent) {
          // Cast the retrieved payment intent to our enhanced type that includes metadata
          const enhancedIntent = retrievedIntent as EnhancedPaymentIntent;
          setPaymentIntent(enhancedIntent);
          
          // Check if this was for Pro Calculator access
          const isProCalculator = 
            enhancedIntent.description?.toLowerCase().includes('pro calculator') ||
            (enhancedIntent.metadata && enhancedIntent.metadata.isProCalculator === 'true');
            
          if (isProCalculator) {
            setIsPro(true);
            
            // Update user access in the database (using mock user ID for demo)
            try {
              const mockUserId = 1; // In a real app, this would be the authenticated user's ID
              const response = await apiFetch(`/api/update-pro-access?userId=${mockUserId}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  hasAccess: true,
                  grantedAt: new Date().toISOString(),
                }),
              });
              
              if (!response.ok) {
                console.error('Failed to update pro access status');
              }
            } catch (error) {
              console.error('Error updating pro access status:', error);
            }
          }
          
          if (enhancedIntent.status === 'succeeded') {
            setStatus('success');
          } else {
            setStatus('error');
          }
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Error retrieving payment intent:', error);
        setStatus('error');
      }
    };
    
    fetchPaymentStatus();
  }, []);
  
  return (
    <>
      <Helmet>
        <title>Payment Confirmation - AfterHours HVAC</title>
        <meta name="description" content="Confirmation of your payment to AfterHours HVAC. Thank you for your business." />
        <meta name="robots" content="noindex" />
      </Helmet>
      
      {/* Page Header */}
      <div className="relative pt-24 pb-10 bg-dark">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold font-header mb-4">Payment <span className="text-primary">Confirmation</span></h1>
            <p className="text-lightgray max-w-3xl mx-auto">Thank you for your payment to AfterHours HVAC.</p>
          </div>
        </div>
      </div>
      
      {/* Confirmation Section */}
      <section className="bg-dark py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {status === 'loading' && (
              <div className="bg-darkgray rounded-lg p-8 text-center">
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"></div>
                  <p className="text-lightgray">Verifying your payment...</p>
                </div>
              </div>
            )}
            
            {status === 'success' && (
              <div className="bg-darkgray rounded-lg p-8 text-center">
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="w-20 h-20 rounded-full bg-green-900 flex items-center justify-center mb-6">
                    <i className="fas fa-check text-4xl text-white"></i>
                  </div>
                  <h2 className="text-2xl font-bold font-header mb-2">Payment Successful!</h2>
                  <p className="text-lg text-lightgray mb-6">Your payment has been processed successfully.</p>
                  
                  {isPro ? (
                    <div className="bg-dark p-6 rounded-lg border border-green-800 mb-6 text-left w-full">
                      <h3 className="text-xl font-bold font-header mb-3">Pro Calculator Access Granted</h3>
                      <p className="text-lightgray mb-4">You now have lifetime access to our Pro Calculator with all advanced features unlocked.</p>
                      <Link href="/pro-calculator">
                        <a className="bg-primary hover:bg-opacity-80 text-white py-2 px-4 rounded-md transition-all font-semibold inline-block">
                          Access Pro Calculator Now
                        </a>
                      </Link>
                    </div>
                  ) : (
                    <div className="bg-dark p-6 rounded-lg border border-green-800 mb-6 text-left w-full">
                      <h3 className="text-xl font-bold font-header mb-3">Thank You For Your Business</h3>
                      <p className="text-lightgray mb-2">We've received your payment and will process your request promptly.</p>
                      <p className="text-lightgray mb-2">A confirmation email has been sent to your email address.</p>
                      {paymentIntent && (
                        <p className="text-sm text-lightgray mt-4">Payment ID: {paymentIntent.id}</p>
                      )}
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Link href="/">
                      <a className="bg-secondary hover:bg-opacity-80 text-white py-3 px-6 rounded-md transition-all font-semibold">
                        Return to Home
                      </a>
                    </Link>
                    <a 
                      href="https://calendar.app.google/NXZB4v1PP57HhARL7" 
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="bg-primary hover:bg-opacity-80 text-white py-3 px-6 rounded-md transition-all font-semibold"
                    >
                      <i className="fas fa-calendar-alt mr-2"></i> Book Appointment
                    </a>
                  </div>
                </div>
              </div>
            )}
            
            {status === 'error' && (
              <div className="bg-darkgray rounded-lg p-8 text-center">
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="w-20 h-20 rounded-full bg-red-900 flex items-center justify-center mb-6">
                    <i className="fas fa-exclamation-triangle text-4xl text-white"></i>
                  </div>
                  <h2 className="text-2xl font-bold font-header mb-2">Payment Issue Detected</h2>
                  <p className="text-lg text-lightgray mb-6">There seems to be an issue with your payment. It may still be processing, or there might have been an error.</p>
                  
                  <div className="bg-dark p-6 rounded-lg border border-red-800 mb-6 text-left w-full">
                    <h3 className="text-xl font-bold font-header mb-3">What should you do?</h3>
                    <ul className="text-lightgray list-disc list-inside space-y-2 mb-4">
                      <li>Check your email for a payment confirmation from Stripe</li>
                      <li>Verify with your bank or credit card provider that the transaction was processed</li>
                      <li>Contact us if you need immediate assistance</li>
                    </ul>
                    <p className="text-sm text-lightgray mt-4">If you were charged but are seeing this message, please contact us with your payment details.</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Link href="/contact">
                      <a className="bg-primary hover:bg-opacity-80 text-white py-3 px-6 rounded-md transition-all font-semibold">
                        Contact Support
                      </a>
                    </Link>
                    <a 
                      href="tel:4036136014" 
                      className="bg-secondary hover:bg-opacity-80 text-white py-3 px-6 rounded-md transition-all font-semibold"
                    >
                      <i className="fas fa-phone-alt mr-2"></i> Call Us
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Additional Info Section */}
      <section className="bg-darkgray py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-dark p-6 rounded-lg border border-gray-700">
                <h3 className="font-bold font-header text-lg mb-3 flex items-center">
                  <i className="fas fa-question-circle text-primary mr-2"></i>
                  Have Questions?
                </h3>
                <p className="text-lightgray mb-4">If you have any questions about your payment or our services, our customer support team is here to help.</p>
                <Link href="/contact">
                  <a className="text-secondary hover:text-primary transition-colors font-medium inline-flex items-center">
                    Contact Us <i className="fas fa-arrow-right ml-2"></i>
                  </a>
                </Link>
              </div>
              
              <div className="bg-dark p-6 rounded-lg border border-gray-700">
                <h3 className="font-bold font-header text-lg mb-3 flex items-center">
                  <i className="fas fa-calendar-alt text-primary mr-2"></i>
                  Schedule a Service
                </h3>
                <p className="text-lightgray mb-4">Ready to schedule your HVAC service? Use our online booking system to find a convenient time.</p>
                <a 
                  href="https://calendar.app.google/NXZB4v1PP57HhARL7" 
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="text-secondary hover:text-primary transition-colors font-medium inline-flex items-center"
                >
                  Book Now <i className="fas fa-arrow-right ml-2"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PaymentConfirmation;
