import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Calculator,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  FileText,
  Wrench,
  ThermometerSun,
  Snowflake,
  Wind,
  Zap
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const quoteSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(1, "Address is required"),
  serviceType: z.string().min(1, "Please select a service type"),
  description: z.string().min(10, "Please provide more details about your needs"),
  urgency: z.string().default("normal"),
  preferredDate: z.string().optional(),
  propertyType: z.string().default("residential"),
  squareFootage: z.string().optional()
});

type QuoteForm = z.infer<typeof quoteSchema>;

export default function Quote() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<QuoteForm>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      urgency: "normal",
      propertyType: "residential"
    }
  });

  const submitQuote = useMutation({
    mutationFn: async (data: QuoteForm) => {
      return await apiRequest("POST", "/api/service-requests", data);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Quote Request Submitted!",
        description: "We'll contact you within 2 hours with your custom quote.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: "Please try again or call us directly at (403) 613-6014",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: QuoteForm) => {
    submitQuote.mutate(data);
  };

  const serviceTypes = [
    { value: "furnace-installation", label: "Furnace Installation", icon: ThermometerSun },
    { value: "ac-installation", label: "AC Installation", icon: Snowflake },
    { value: "furnace-repair", label: "Furnace Repair", icon: Wrench },
    { value: "ac-repair", label: "AC Repair", icon: Wrench },
    { value: "duct-cleaning", label: "Duct Cleaning", icon: Wind },
    { value: "maintenance", label: "HVAC Maintenance", icon: CheckCircle },
    { value: "energy-audit", label: "Energy Audit", icon: Zap },
    { value: "emergency-service", label: "Emergency Service", icon: Phone },
    { value: "other", label: "Other Service", icon: FileText }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Helmet>
          <title>Quote Submitted - AfterHours HVAC</title>
        </Helmet>
        
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-700">Quote Request Received!</CardTitle>
            <CardDescription>
              Thank you for choosing AfterHours HVAC. We'll review your request and contact you within 2 hours with a detailed quote.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700 font-medium">Need immediate assistance?</p>
              <p className="text-lg font-bold text-blue-800">(403) 613-6014</p>
            </div>
            <Button 
              onClick={() => setIsSubmitted(false)}
              variant="outline" 
              className="w-full"
            >
              Submit Another Quote
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Helmet>
        <title>Get Free Quote - Professional HVAC Services | AfterHours HVAC</title>
        <meta name="description" content="Get a free, no-obligation quote for professional HVAC services in Calgary. Expert furnace, AC, and duct cleaning services with 24/7 emergency support." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Calculator className="w-16 h-16 mx-auto mb-6 text-blue-200" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Get Your Free HVAC Quote
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Professional HVAC services in Calgary and surrounding areas. 
            Get a detailed quote within 2 hours - no surprises, just honest pricing.
          </p>
        </div>
      </section>

      {/* Quote Form */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Fast Response</h3>
                <p className="text-gray-600">Quote delivered within 2 hours</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Detailed Estimate</h3>
                <p className="text-gray-600">Comprehensive breakdown of costs</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">No Obligation</h3>
                <p className="text-gray-600">Free quote with no pressure</p>
              </div>
            </div>

            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Request Your Free Quote</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll provide you with a detailed quote for your HVAC needs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Smith" {...field} />
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
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="(403) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="john@example.com" type="email" {...field} />
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
                            <FormLabel>Service Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main St, Calgary, AB" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="serviceType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select service type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {serviceTypes.map((service) => (
                                  <SelectItem key={service.value} value={service.value}>
                                    {service.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="urgency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Urgency</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select urgency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">Low - Within a week</SelectItem>
                                <SelectItem value="normal">Normal - Within 2-3 days</SelectItem>
                                <SelectItem value="high">High - Within 24 hours</SelectItem>
                                <SelectItem value="emergency">Emergency - ASAP</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="propertyType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Property Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select property type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="residential">Residential</SelectItem>
                                <SelectItem value="commercial">Commercial</SelectItem>
                                <SelectItem value="industrial">Industrial</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="squareFootage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Square Footage (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 1500 sq ft" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="preferredDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Service Date (Optional)</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Please describe your HVAC needs, any specific requirements, current issues, or questions you have..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        type="submit" 
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-lg py-6"
                        disabled={submitQuote.isPending}
                      >
                        {submitQuote.isPending ? "Submitting..." : "Get Free Quote"}
                      </Button>
                      <Button 
                        type="button"
                        variant="outline"
                        className="flex-1 text-lg py-6"
                        onClick={() => window.location.href = 'tel:4036136014'}
                      >
                        <Phone className="w-5 h-5 mr-2" />
                        Call (403) 613-6014
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
