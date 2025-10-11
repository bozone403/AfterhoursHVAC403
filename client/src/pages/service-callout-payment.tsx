import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Link, useLocation } from "wouter";
import { 
  Clock, 
  Phone, 
  AlertTriangle, 
  DollarSign, 
  Shield, 
  CheckCircle,
  Calendar,
  MapPin,
  User,
  Mail
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ServiceCalloutData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceAddress: string;
  issueDescription: string;
  urgencyLevel: string;
  preferredTime: string;
}

const ServiceCalloutPayment = () => {
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentTime] = useState(new Date());
  const [serviceData, setServiceData] = useState<ServiceCalloutData>({
    customerName: user?.username || "",
    customerPhone: "",
    customerEmail: user?.email || "",
    serviceAddress: "",
    issueDescription: "",
    urgencyLevel: "standard",
    preferredTime: "asap"
  });

  // Calculate pricing based on time
  const getCurrentPricing = () => {
    const hour = currentTime.getHours();
    
    if (hour >= 17 || hour < 8) {
      // After hours: 5pm-midnight (2h min) or midnight-8am (3h min)
      if (hour >= 17 && hour < 24) {
        return {
          rate: 175,
          minimumHours: 2,
          period: "After Hours (5PM - Midnight)",
          totalMinimum: 350,
          description: "Emergency after-hours service with 2-hour minimum"
        };
      } else {
        return {
          rate: 175,
          minimumHours: 3,
          period: "Late Night (Midnight - 8AM)",
          totalMinimum: 525,
          description: "Emergency late-night service with 3-hour minimum"
        };
      }
    } else {
      // Regular hours
      return {
        rate: 135,
        minimumHours: 1,
        period: "Regular Hours (8AM - 5PM)",
        totalMinimum: 135,
        description: "Standard business hours service call"
      };
    }
  };

  const pricing = getCurrentPricing();

  const createServiceRequest = useMutation({
    mutationFn: async (data: ServiceCalloutData & { amount: number }) => {
      const response = await apiRequest("POST", "/api/service-callout", {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        serviceAddress: data.serviceAddress,
        issueDescription: data.issueDescription,
        urgencyLevel: data.urgencyLevel,
        preferredTime: data.preferredTime,
        amount: data.amount
      });
      return response.json();
    },
    onSuccess: (result) => {
      if (result.clientSecret) {
        toast({
          title: "Service Request Created",
          description: "Redirecting to payment...",
        });
        navigate(`/checkout?clientSecret=${result.clientSecret}&amount=${result.amount}&type=service&serviceId=${result.id}`);
      } else {
        toast({
          title: "Service Request Submitted",
          description: "Jordan will contact you within 2 hours to confirm your service appointment.",
        });
        navigate("/");
      }
    },
    onError: (error) => {
      toast({
        title: "Request Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!serviceData.customerName || !serviceData.customerPhone || !serviceData.serviceAddress) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createServiceRequest.mutate({
      ...serviceData,
      amount: pricing.totalMinimum
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center bg-red-100 border border-red-200 rounded-full px-6 py-3 mb-6">
            <AlertTriangle className="h-5 w-5 text-red-700 mr-3" />
            <span className="text-red-800 text-lg font-bold">Service Call Request</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Professional HVAC Service Call
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Book a professional HVAC technician for on-site diagnosis and repair. 
            Transparent pricing with no hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Request Form */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Service Request Details
              </CardTitle>
              <CardDescription className="text-blue-100">
                Complete the form to schedule your service call
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <Input
                      value={serviceData.customerName}
                      onChange={(e) => setServiceData({...serviceData, customerName: e.target.value})}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <Input
                      type="tel"
                      value={serviceData.customerPhone}
                      onChange={(e) => setServiceData({...serviceData, customerPhone: e.target.value})}
                      placeholder="(403) 555-0123"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={serviceData.customerEmail}
                    onChange={(e) => setServiceData({...serviceData, customerEmail: e.target.value})}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Address *
                  </label>
                  <Input
                    value={serviceData.serviceAddress}
                    onChange={(e) => setServiceData({...serviceData, serviceAddress: e.target.value})}
                    placeholder="123 Main St, Calgary, AB T2P 1A1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Description *
                  </label>
                  <Textarea
                    value={serviceData.issueDescription}
                    onChange={(e) => setServiceData({...serviceData, issueDescription: e.target.value})}
                    placeholder="Describe the HVAC issue you're experiencing..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Urgency Level
                    </label>
                    <select
                      value={serviceData.urgencyLevel}
                      onChange={(e) => setServiceData({...serviceData, urgencyLevel: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="standard">Standard Service</option>
                      <option value="urgent">Urgent (Same Day)</option>
                      <option value="emergency">Emergency (ASAP)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Time
                    </label>
                    <select
                      value={serviceData.preferredTime}
                      onChange={(e) => setServiceData({...serviceData, preferredTime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="asap">As Soon As Possible</option>
                      <option value="morning">Morning (8AM-12PM)</option>
                      <option value="afternoon">Afternoon (12PM-5PM)</option>
                      <option value="evening">Evening (5PM-8PM)</option>
                    </select>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
                  disabled={createServiceRequest.isPending}
                >
                  {createServiceRequest.isPending ? "Processing..." : `Book Service Call - $${pricing.totalMinimum}`}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Pricing Information */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Current Pricing
                </CardTitle>
                <CardDescription className="text-green-100">
                  Transparent pricing based on current time
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Service Period:</span>
                    <Badge className="bg-blue-100 text-blue-800">{pricing.period}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Hourly Rate:</span>
                    <span className="text-lg font-bold text-green-600">${pricing.rate}/hour</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Minimum Hours:</span>
                    <span className="font-semibold">{pricing.minimumHours} hours</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">Total Minimum:</span>
                    <span className="text-2xl font-bold text-green-600">${pricing.totalMinimum}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600">{pricing.description}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  What's Included
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {[
                    "Professional diagnostic assessment",
                    "Detailed explanation of issues found",
                    "Written estimate for any repairs needed",
                    "Licensed and insured technicians",
                    "No hidden fees or surprises",
                    "Follow-up support included"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-orange-50 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Phone className="h-5 w-5 text-orange-600" />
                  <span className="font-semibold text-orange-800">Need Immediate Help?</span>
                </div>
                <p className="text-sm text-orange-700 mb-4">
                  For true emergencies, call us directly at:
                </p>
                <a 
                  href="tel:4036136014"
                  className="text-2xl font-bold text-orange-600 hover:text-orange-700"
                >
                  (403) 613-6014
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCalloutPayment;