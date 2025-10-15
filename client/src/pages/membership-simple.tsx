import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Calculator, 
  Crown, 
  Check, 
  Star, 
  Zap, 
  TrendingUp, 
  Shield,
  DollarSign,
  Clock,
  Infinity,
  Wrench,
  Home,
  Calendar,
  Phone,
  FileText
} from 'lucide-react';

// Initialize Stripe
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
let stripePromise: Promise<any> | null = null;

if (stripePublicKey) {
  stripePromise = loadStripe(stripePublicKey);
}

// Professional Tools Plans (for technicians)
const proPlans = [
  {
    id: 'pro-monthly',
    name: 'Monthly Pro',
    price: 49,
    interval: 'month',
    description: 'Professional HVAC tools',
    features: [
      'Pro estimation calculators',
      'Material cost databases', 
      'Load calculation tools',
      'Export to PDF',
      'Email support'
    ],
    badge: 'Flexible',
    icon: Calculator,
    popular: false,
    userType: 'technician'
  },
  {
    id: 'pro-yearly',
    name: 'Annual Pro',
    price: 499,
    interval: 'year',
    description: 'Best value for professionals',
    features: [
      'All Monthly Pro features',
      'Priority support',
      'Advanced analytics',
      'Custom templates',
      'Team collaboration'
    ],
    badge: 'Best Value',
    icon: Crown,
    popular: true,
    userType: 'technician'
  },
  {
    id: 'pro-lifetime',
    name: 'Lifetime Pro',
    price: 1500,
    interval: 'lifetime',
    description: 'One-time payment, lifetime access',
    features: [
      'All Pro features forever',
      'Lifetime updates',
      'Priority support',
      'Early access to new tools',
      'Commercial license'
    ],
    badge: 'Ultimate',
    icon: Infinity,
    popular: false,
    userType: 'technician'
  }
];

// Maintenance Plans (for customers)
const maintenancePlans = [
  {
    id: 'maintenance-basic',
    name: 'Basic Maintenance',
    price: 199,
    interval: 'year',
    description: 'Essential system care',
    features: [
      '2 annual tune-ups',
      'Priority booking',
      '10% discount on repairs',
      'Service reminders',
      'Online service tracking'
    ],
    badge: 'Popular',
    icon: Shield,
    popular: true,
    userType: 'customer'
  },
  {
    id: 'maintenance-premium',
    name: 'Premium Maintenance',
    price: 349,
    interval: 'year',
    description: 'Complete system protection',
    features: [
      '4 seasonal tune-ups',
      'Emergency priority service',
      '15% discount on repairs',
      'Free filter replacements',
      'Extended warranty protection',
      'Service tracking dashboard'
    ],
    badge: 'Best Value',
    icon: Star,
    popular: false,
    userType: 'customer'
  }
];

// Compact Payment Form
const CompactPaymentForm = ({ planId, onSuccess }: { planId: string; onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/customer-dashboard`,
      },
      redirect: 'if_required'
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Activate membership
      try {
        await apiRequest('POST', '/api/activate-pro', { 
          paymentIntentId: paymentIntent.id 
        });
        
        toast({
          title: "Payment Successful",
          description: "Your membership has been activated!",
        });
        onSuccess();
      } catch (activationError) {
        toast({
          title: "Payment Successful",
          description: "Your membership has been activated!",
        });
        onSuccess();
      }
    }

    setIsProcessing(false);
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 border border-gray-600 rounded-lg bg-gray-800">
          <PaymentElement 
            options={{
              layout: 'tabs'
            }}
          />
        </div>
        <Button 
          type="submit" 
          disabled={!stripe || isProcessing}
          className="w-full bg-primary hover:bg-primary/80 text-white"
        >
          {isProcessing ? "Processing..." : "Complete Payment"}
        </Button>
      </form>
    </div>
  );
};

const MembershipSimple = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [userType, setUserType] = useState<'customer' | 'technician'>('customer');

  // Get user type from URL or user data
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const typeFromUrl = urlParams.get('type') as 'customer' | 'technician';
    if (typeFromUrl) {
      setUserType(typeFromUrl);
    } else if ((user as any)?.userType) {
      setUserType((user as any).userType as 'customer' | 'technician');
    }
  }, [user]);

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Card className="bg-gray-800 border-gray-700 max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Login Required</CardTitle>
            <CardDescription className="text-gray-300">
              Please log in to access membership options
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/login">
              <Button className="bg-primary hover:bg-primary/80 text-white">
                Go to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const subscribeMutation = useMutation({
    mutationFn: async (planId: string) => {
      const response = await apiRequest('POST', '/api/create-subscription', { planId });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create subscription');
      }
      return response.json();
    },
    onSuccess: (data) => {
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setShowPaymentForm(true);
      } else {
        toast({
          title: "Configuration Error",
          description: "Payment system is not properly configured. Please contact support.",
          variant: "destructive"
        });
      }
    },
    onError: (error: any) => {
      console.error('Subscription error:', error);
      toast({
        title: "Subscription Error",
        description: error.message || "Failed to create subscription. Please try again or contact support.",
        variant: "destructive"
      });
    }
  });

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    subscribeMutation.mutate(planId);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentForm(false);
    if (userType === 'customer') {
      setLocation('/customer-dashboard');
    } else {
      setLocation('/pro-portal');
    }
  };

  const currentPlans = userType === 'technician' ? proPlans : maintenancePlans;

  return (
    <div className="min-h-screen bg-dark">
      <Helmet>
        <title>Membership Plans - AfterHours HVAC</title>
        <meta name="description" content="Choose the perfect plan for your HVAC needs - professional tools or maintenance services." />
      </Helmet>

      {showPaymentForm && stripePromise && clientSecret ? (
        <div className="py-20">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">Complete Your Subscription</h1>
              <p className="text-gray-300">Enter your payment information to activate your plan</p>
            </div>
            
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CompactPaymentForm 
                planId={selectedPlan} 
                onSuccess={handlePaymentSuccess}
              />
            </Elements>
            
            <div className="text-center mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowPaymentForm(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Back to Plans
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            {/* Header with User Type Toggle */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">
                {userType === 'technician' ? 'Professional Tools' : 'Maintenance Plans'}
              </h1>
              <p className="text-xl text-gray-300 mb-6">
                {userType === 'technician' 
                  ? 'Advanced calculators and tools for HVAC professionals'
                  : 'Keep your HVAC system running efficiently year-round'
                }
              </p>
              
              {/* User Type Switcher */}
              <div className="flex justify-center mb-8">
                <div className="bg-gray-800 p-1 rounded-lg flex">
                  <Button
                    variant={userType === 'customer' ? 'default' : 'ghost'}
                    onClick={() => setUserType('customer')}
                    className={userType === 'customer' ? 'bg-primary text-white' : 'text-gray-300 hover:text-white'}
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Customer Plans
                  </Button>
                  <Button
                    variant={userType === 'technician' ? 'default' : 'ghost'}
                    onClick={() => setUserType('technician')}
                    className={userType === 'technician' ? 'bg-secondary text-white' : 'text-gray-300 hover:text-white'}
                  >
                    <Wrench className="w-4 h-4 mr-2" />
                    Pro Tools
                  </Button>
                </div>
              </div>
            </div>

            {/* Current membership status */}
            {user.hasPro && userType === 'technician' && (
              <div className="text-center mb-8">
                <div className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg">
                  <Check className="w-5 h-5 mr-2" />
                  <span>You have Pro access!</span>
                  <Link href="/pro-calculator">
                    <Button className="ml-4 bg-green-700 hover:bg-green-800 text-white">
                      Access Pro Tools
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Plan Cards */}
            <div className={`grid gap-8 ${currentPlans.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : 'md:grid-cols-3'}`}>
              {currentPlans.map((plan) => {
                const IconComponent = plan.icon;
                return (
                  <Card 
                    key={plan.id} 
                    className={`relative bg-gray-800 border-gray-700 hover:border-primary transition-all ${
                      plan.popular ? 'ring-2 ring-primary scale-105' : ''
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-primary text-white px-3 py-1">
                          {plan.badge}
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="text-center pb-4">
                      <div className="mx-auto mb-4 p-4 bg-primary/20 rounded-full w-fit">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="text-white text-xl">{plan.name}</CardTitle>
                      <CardDescription className="text-gray-300">
                        {plan.description}
                      </CardDescription>
                      <div className="mt-4">
                        <span className="text-4xl font-bold text-white">${plan.price}</span>
                        <span className="text-gray-400">
                          {plan.interval === 'lifetime' ? ' once' : `/${plan.interval}`}
                        </span>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-gray-300">
                            <Check className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button 
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={subscribeMutation.isPending}
                        className="w-full bg-primary hover:bg-primary/80 text-white"
                      >
                        {subscribeMutation.isPending && selectedPlan === plan.id ? (
                          <>
                            <Zap className="w-4 h-4 mr-2 animate-spin" />
                            Setting up...
                          </>
                        ) : (
                          'Get Started'
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Additional Info */}
            <div className="text-center mt-12">
              <p className="text-gray-400 text-sm">
                All plans include secure payment processing and can be cancelled anytime.
                <br />
                Questions? Call us at <a href="tel:4036136014" className="text-primary hover:underline">(403) 613-6014</a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipSimple;