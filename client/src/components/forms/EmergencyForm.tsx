import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Phone, AlertTriangle } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  issue: z.string().min(1, { message: 'Please select an issue type.' }),
  description: z.string().min(5, { message: 'Please provide a brief description of the issue.' })
});

type FormData = z.infer<typeof formSchema>;

const EmergencyForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      issue: '',
      description: ''
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      await apiRequest('POST', '/api/emergency-request', data);
      
      toast({
        title: 'Emergency Request Sent',
        description: 'We\'ve received your emergency request and will contact you shortly.',
      });
      
      form.reset();
    } catch (error) {
      console.error('Error submitting emergency form:', error);
      toast({
        title: 'Submission Error',
        description: 'There was a problem sending your request. Please try again or call us directly.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Full Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your full name"
                  className="bg-white border-gray-300 text-gray-900 focus:ring-orange-500"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Phone Number</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="(403) 123-4567"
                  className="bg-white border-gray-300 text-gray-900 focus:ring-orange-500"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="issue"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Issue Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="no-heat">No Heat</SelectItem>
                  <SelectItem value="no-cooling">No Cooling</SelectItem>
                  <SelectItem value="gas-leak">Gas Leak</SelectItem>
                  <SelectItem value="strange-noise">Strange Noise</SelectItem>
                  <SelectItem value="high-bills">High Energy Bills</SelectItem>
                  <SelectItem value="other">Other Emergency</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please describe the issue in detail..."
                  className="bg-white border-gray-300 text-gray-900 focus:ring-orange-500 min-h-[100px]"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-4">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 mr-2" />
                Send Emergency Request
              </>
            )}
          </Button>

          <a 
            href="tel:4036136014" 
            className="flex items-center justify-center bg-primary hover:bg-primary/80 text-white font-semibold py-3 px-6 rounded-md transition-colors"
          >
            <Phone className="w-4 h-4 mr-2" />
            Call Now
          </a>
        </div>
      </form>
    </Form>
  );
};

export default EmergencyForm;