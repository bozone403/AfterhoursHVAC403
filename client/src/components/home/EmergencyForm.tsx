import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { submitEmergencyForm, EmergencyFormData } from '@/lib/formHandlers';
import { AlertCircle, CheckCircle } from 'lucide-react';

const emergencyFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  issueType: z.string().min(1, { message: "Please select an issue type" }),
  description: z.string().min(10, { message: "Please describe your emergency (min. 10 characters)" }),
});

const EmergencyForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formResponse, setFormResponse] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const form = useForm<EmergencyFormData>({
    resolver: zodResolver(emergencyFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      issueType: "",
      description: "",
    },
  });

  const onSubmit = async (data: EmergencyFormData) => {
    setIsSubmitting(true);
    setFormResponse(null);

    try {
      const response = await submitEmergencyForm(data);
      
      if (response.success) {
        setFormResponse({
          type: 'success',
          message: response.message
        });
        form.reset();
      } else {
        setFormResponse({
          type: 'error',
          message: response.message
        });
      }
    } catch (error) {
      setFormResponse({
        type: 'error',
        message: "An unexpected error occurred. Please call us directly at (403) 613-6014."
      });
      console.error("Emergency form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-dark-card border border-gray-700 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center mb-2">
          <div className="w-10 h-10 flex items-center justify-center bg-fire rounded-full mr-3">
            <AlertCircle className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-xl font-heading font-bold">24/7 Emergency Service</CardTitle>
        </div>
        <CardDescription className="text-muted-text">
          Need immediate assistance? Complete this form and we'll call you back within 15 minutes.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {formResponse && (
          <Alert 
            variant={formResponse.type === 'success' ? "default" : "destructive"}
            className={`mb-4 ${formResponse.type === 'success' ? 'bg-green-900/20 text-green-400 border-green-900/50' : ''}`}
          >
            {formResponse.type === 'success' ? (
              <CheckCircle className="h-4 w-4 mr-2" />
            ) : (
              <AlertCircle className="h-4 w-4 mr-2" />
            )}
            <AlertDescription>{formResponse.message}</AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-text">Full Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="John Smith" 
                      className="bg-charcoal border-gray-700 text-white" 
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
                  <FormLabel className="text-muted-text">Phone Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="(403) 555-1234" 
                      className="bg-charcoal border-gray-700 text-white" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="issueType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-text">Issue Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-charcoal border-gray-700 text-white">
                        <SelectValue placeholder="Select an issue" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-dark-card text-white border-gray-700">
                      <SelectItem value="no-heat">No Heat</SelectItem>
                      <SelectItem value="no-ac">No AC / Not Cooling</SelectItem>
                      <SelectItem value="water-leak">Water Leak</SelectItem>
                      <SelectItem value="strange-noise">Strange Noise</SelectItem>
                      <SelectItem value="burning-smell">Burning Smell</SelectItem>
                      <SelectItem value="other">Other Issue</SelectItem>
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
                  <FormLabel className="text-muted-text">Brief Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Please describe your emergency..." 
                      className="bg-charcoal border-gray-700 text-white resize-none" 
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-fire hover:bg-fire/90 text-white" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Emergency Request'}
            </Button>
            
            <p className="text-center text-xs text-muted-text">
              Or call directly: <a href="tel:4036136014" className="text-electric">(403) 613-6014</a>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EmergencyForm;
