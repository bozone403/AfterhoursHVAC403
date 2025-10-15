import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { ShoppingCart, CheckCircle, Loader2, CreditCard } from 'lucide-react';

const bookingSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().optional(),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface ServiceBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    name: string;
    price: number | string;
    description?: string;
    category?: string;
  };
}

export function ServiceBookingModal({ isOpen, onClose, service }: ServiceBookingModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      address: '',
      notes: '',
    },
  });

  const createCheckoutMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      // Store customer info in sessionStorage for after payment
      sessionStorage.setItem('pendingBooking', JSON.stringify({
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        address: data.address || '',
        notes: data.notes || '',
        serviceName: service.name,
        serviceDescription: service.description || `${service.name} - Customer service booking`,
      }));

      // Extract numeric price from string like "$149" or "Starting at $6,499"
      let numericPrice = 0;
      if (typeof service.price === 'number') {
        numericPrice = service.price;
      } else {
        const priceMatch = service.price.match(/\$?([\d,]+)/);
        if (priceMatch) {
          numericPrice = parseFloat(priceMatch[1].replace(/,/g, ''));
        }
      }

      // Create Stripe checkout session
      const response = await apiRequest('POST', '/api/create-checkout-session', {
        serviceName: service.name,
        price: numericPrice,
        description: service.description || `${service.name} service`,
        category: service.category || 'service',
        customerEmail: data.customerEmail,
      });
      
      return response;
    },
    onSuccess: (data: any) => {
      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Checkout Failed',
        description: error.message || 'Failed to start payment process. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: BookingFormData) => {
    createCheckoutMutation.mutate(data);
  };

  const handleClose = () => {
    if (!createCheckoutMutation.isPending) {
      form.reset();
      setIsSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="rounded-full bg-green-100 p-4 mb-4">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
            <p className="text-gray-600 text-center">
              We'll contact you shortly to schedule your service.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
                Book {service.name}
              </DialogTitle>
              <DialogDescription>
                <div className="space-y-2 mt-2">
                  <div className="text-lg font-semibold text-gray-900">
                    ${typeof service.price === 'number' ? service.price.toLocaleString() : service.price}
                  </div>
                  {service.description && (
                    <p className="text-sm text-gray-600">{service.description}</p>
                  )}
                </div>
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="(403) 555-1234" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Address (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St, Calgary, AB" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any special requirements or questions..." 
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={createCheckoutMutation.isPending}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createCheckoutMutation.isPending}
                    className="flex-1 hvac-button-primary"
                  >
                    {createCheckoutMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Redirecting to Payment...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Proceed to Payment
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
