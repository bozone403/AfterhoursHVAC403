import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Define the form schema with validation
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  subject: z.string().min(1, { message: 'Please select a subject.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' })
});

type FormData = z.infer<typeof formSchema>;

const ContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState(false);

  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      subject: '',
      message: ''
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setFormSuccess(false);
    setFormError(false);
    
    try {
      await apiRequest('POST', '/api/admin/contacts', data);
      
      setFormSuccess(true);
      toast({
        title: 'Message Sent',
        description: 'Thank you! Your message has been sent successfully. We\'ll get back to you shortly.',
      });
      
      reset();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setFormError(true);
      toast({
        title: 'Submission Error',
        description: 'There was a problem sending your message. Please try again or call us directly.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input 
            type="text" 
            id="contact-name"
            className={`w-full bg-white border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
            disabled={isSubmitting}
            {...register('name')}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
        </div>
        
        <div>
          <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input 
            type="tel" 
            id="contact-phone"
            className={`w-full bg-white border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
            disabled={isSubmitting}
            {...register('phone')}
          />
          {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
        </div>
      </div>
      
      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <input 
          type="email" 
          id="contact-email"
          className={`w-full bg-white border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
          disabled={isSubmitting}
          {...register('email')}
        />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
      </div>
      
      <div>
        <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
        <select 
          id="contact-subject"
          className={`w-full bg-white border ${errors.subject ? 'border-red-500' : 'border-gray-300'} rounded-md py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
          disabled={isSubmitting}
          {...register('subject')}
        >
          <option value="">Select a subject</option>
          <option value="quote">Request a Quote</option>
          <option value="service">Schedule Service</option>
          <option value="question">General Question</option>
          <option value="feedback">Feedback</option>
          <option value="other">Other</option>
        </select>
        {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>}
      </div>
      
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea 
          id="contact-message"
          rows={5} 
          className={`w-full bg-white border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-md py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
          disabled={isSubmitting}
          {...register('message')}
        ></textarea>
        {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
      </div>
      
      <div>
        <button 
          type="submit" 
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-md transition-all font-semibold shadow-lg disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
          ) : "Send Message"}
        </button>
      </div>
      
      {formSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-md">
          Thank you! Your message has been sent successfully. We'll get back to you shortly.
        </div>
      )}
      
      {formError && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-md">
          There was an error sending your message. Please try again or call us directly at (403) 613-6014.
        </div>
      )}
    </form>
  );
};

export default ContactForm;
