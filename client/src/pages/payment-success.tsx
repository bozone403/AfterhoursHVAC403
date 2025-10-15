import { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { Helmet } from 'react-helmet-async';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, Mail, Phone, Loader2, AlertCircle } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [bookingId, setBookingId] = useState<number | null>(null);

  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      return await apiRequest('POST', '/api/bookings', bookingData);
    },
    onSuccess: (data: any) => {
      setBookingId(data.id);
      setStatus('success');
      // Clear the pending booking from storage
      sessionStorage.removeItem('pendingBooking');
    },
    onError: (error: any) => {
      console.error('Failed to create booking:', error);
      setStatus('error');
    },
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      setStatus('error');
      return;
    }

    // Get pending booking info from sessionStorage
    const pendingBookingStr = sessionStorage.getItem('pendingBooking');
    if (!pendingBookingStr) {
      setStatus('error');
      return;
    }

    try {
      const pendingBooking = JSON.parse(pendingBookingStr);
      
      // Create the booking with paid status
      createBookingMutation.mutate({
        customerName: pendingBooking.customerName,
        customerEmail: pendingBooking.customerEmail,
        customerPhone: pendingBooking.customerPhone,
        serviceName: pendingBooking.serviceName,
        servicePrice: 'Paid via Stripe',
        serviceDescription: pendingBooking.serviceDescription,
        address: pendingBooking.address || '',
        notes: pendingBooking.notes || '',
        paymentStatus: 'paid',
        status: 'confirmed',
        stripeSessionId: sessionId,
      });
    } catch (error) {
      console.error('Error processing payment success:', error);
      setStatus('error');
    }
  }, []);

  if (status === 'loading') {
    return (
      <>
        <Helmet>
          <title>Processing Payment | AfterHours HVAC</title>
        </Helmet>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Your Payment...</h2>
            <p className="text-gray-600">Please wait while we confirm your booking.</p>
          </div>
        </div>
      </>
    );
  }

  if (status === 'error') {
    return (
      <>
        <Helmet>
          <title>Payment Error | AfterHours HVAC</title>
        </Helmet>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
          <div className="hvac-card max-w-2xl w-full text-center p-8">
            <div className="rounded-full bg-red-100 p-4 inline-flex mb-6">
              <AlertCircle className="w-16 h-16 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Payment Processing Error
            </h1>
            <p className="text-gray-600 mb-8">
              We encountered an issue processing your booking. Please contact us directly to complete your service booking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="hvac-button-primary">
                <a href="tel:4036136014">
                  <Phone className="w-4 h-4 mr-2" />
                  Call (403) 613-6014
                </a>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Payment Successful | AfterHours HVAC</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-orange-50 p-4">
        <div className="hvac-card max-w-3xl w-full text-center p-12">
          {/* Success Icon */}
          <div className="rounded-full bg-green-100 p-6 inline-flex mb-8">
            <CheckCircle className="w-24 h-24 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment Successful! 🎉
          </h1>
          <p className="text-xl text-gray-700 mb-2">
            Your service has been booked and payment confirmed.
          </p>
          <p className="text-gray-600 mb-8">
            Booking ID: #{bookingId}
          </p>

          {/* What Happens Next */}
          <div className="bg-blue-50 rounded-xl p-8 mb-8 text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              What Happens Next?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-blue-100 p-2 flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Email Confirmation</h3>
                  <p className="text-gray-600 text-sm">
                    You'll receive an email confirmation with your booking details shortly.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-orange-100 p-2 flex-shrink-0">
                  <Phone className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">We'll Contact You</h3>
                  <p className="text-gray-600 text-sm">
                    Our team will reach out within 24 hours to schedule your service appointment.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-green-100 p-2 flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Service Delivery</h3>
                  <p className="text-gray-600 text-sm">
                    Our certified technicians will arrive on schedule to complete your service professionally.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold mb-2">Need Immediate Assistance?</h3>
            <p className="mb-4">Our team is available 24/7 for emergency service</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a 
                href="tel:4036136014"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors"
              >
                <Phone className="w-4 h-4" />
                (403) 613-6014
              </a>
              <a 
                href="mailto:Jordan@Afterhourshvac.ca"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-colors border border-white/30"
              >
                <Mail className="w-4 h-4" />
                Jordan@Afterhourshvac.ca
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="hvac-button-primary" size="lg">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/services">
                Browse More Services
              </Link>
            </Button>
          </div>

          {/* Fine Print */}
          <p className="text-sm text-gray-500 mt-8">
            A receipt has been sent to your email address. If you have any questions about your booking, 
            please don't hesitate to contact us.
          </p>
        </div>
      </div>
    </>
  );
}
