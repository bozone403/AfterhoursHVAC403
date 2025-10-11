import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Phone, 
  Clock, 
  AlertTriangle, 
  DollarSign, 
  MapPin,
  User,
  MessageSquare,
  CreditCard,
  CheckCircle,
  Sparkles,
  Award,
  Mail
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface EmergencyPricing {
  baseRate: number;
  minimumHours: number;
  totalCost: number;
  timeSlot: string;
  description: string;
}

const EmergencyServicePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPricing, setCurrentPricing] = useState<EmergencyPricing | null>(null);
  const [formData, setFormData] = useState({
    name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    emergencyType: '',
    description: '',
    urgencyLevel: 'high'
  });

  // Calculate pricing based on current time
  const calculateEmergencyPricing = (): EmergencyPricing => {
    const now = new Date();
    const hour = now.getHours();
    const baseRate = 175; // $175/hour
    
    if (hour >= 17 || hour < 0) { // 5 PM to midnight
      return {
        baseRate,
        minimumHours: 2,
        totalCost: baseRate * 2,
        timeSlot: "5:00 PM - 12:00 AM",
        description: "Evening Emergency Rate (2 hour minimum)"
      };
    } else if (hour >= 0 && hour < 8) { // Midnight to 8 AM
      return {
        baseRate,
        minimumHours: 3,
        totalCost: baseRate * 3,
        timeSlot: "12:00 AM - 8:00 AM",
        description: "Overnight Emergency Rate (3 hour minimum)"
      };
    } else { // Regular hours
      return {
        baseRate,
        minimumHours: 1,
        totalCost: baseRate * 1,
        timeSlot: "8:00 AM - 5:00 PM",
        description: "Regular Emergency Rate (1 hour minimum)"
      };
    }
  };

  // Update pricing when component mounts
  useEffect(() => {
    setCurrentPricing(calculateEmergencyPricing());
    
    // Update pricing every minute
    const interval = setInterval(() => {
      setCurrentPricing(calculateEmergencyPricing());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const emergencyMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/emergency-service", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Emergency Service Requested",
        description: "Your emergency service request has been submitted. Jordan will be notified immediately and contact you shortly.",
      });
      
      // Reset form
      setFormData({
        ...formData,
        address: '',
        emergencyType: '',
        description: ''
      });
    },
    onError: (error: any) => {
      toast({
        title: "Request Failed",
        description: error.message || "Failed to submit emergency service request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address || !formData.emergencyType || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!currentPricing) {
      toast({
        title: "Pricing Error",
        description: "Unable to calculate pricing. Please refresh and try again.",
        variant: "destructive",
      });
      return;
    }

    const emergencyData = {
      ...formData,
      pricing: currentPricing,
      requestedAt: new Date().toISOString(),
      userId: user?.id
    };

    emergencyMutation.mutate(emergencyData);
  };

  const emergencyTypes = [
    "No Heat",
    "No Air Conditioning", 
    "Gas Leak",
    "Water Leak from HVAC",
    "Furnace Not Working",
    "AC Unit Down",
    "Strange Smells/Burning",
    "System Making Loud Noises",
    "Thermostat Issues",
    "Other Emergency"
  ];

  return (
    <>
      <Helmet>
        <title>24/7 Emergency HVAC Service - AfterHours HVAC Calgary</title>
        <meta name="description" content="Emergency HVAC service available 24/7 in Calgary. Fast response for urgent heating, cooling, and ventilation emergencies. Call (403) 613-6014" />
      </Helmet>

      {/* Premium Hero Section with Urgency */}
      <section className="relative min-h-[50vh] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 pt-24 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-red-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-red-500/30 mb-6 animate-pulse">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-red-200 text-sm font-bold">EMERGENCY SERVICE AVAILABLE</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              24/7 Emergency <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">HVAC Service</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Immediate response for urgent heating, cooling, and ventilation emergencies in Calgary
            </p>
            
            <Button 
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xl px-10 py-7 rounded-xl shadow-2xl shadow-amber-500/50 transition-all hover:scale-105"
              asChild
              data-testid="button-emergency-call"
            >
              <a href="tel:4036136014">
                <Phone className="w-6 h-6 mr-3" />
                Call Now: (403) 613-6014
              </a>
            </Button>
          </div>
        </div>
      </section>

      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Pricing Card */}
            <div className="lg:col-span-1">
              <Card className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 border-0 shadow-2xl overflow-hidden relative mb-6">
                <div className="absolute inset-0">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
                </div>
                
                <CardHeader className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg">
                      <DollarSign className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-white font-black">Current Emergency Pricing</CardTitle>
                  </div>
                  <CardDescription className="text-blue-200">
                    Pricing automatically calculated based on current time
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                  {currentPricing && (
                    <>
                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-amber-400" />
                          <span className="font-bold text-white">Time Slot</span>
                        </div>
                        <p className="text-blue-100" data-testid="text-time-slot">{currentPricing.timeSlot}</p>
                      </div>
                      
                      <div className="space-y-2 bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
                        <div className="flex justify-between">
                          <span className="text-sm text-blue-200">Base Rate:</span>
                          <span className="font-bold text-white" data-testid="text-base-rate">${currentPricing.baseRate}/hour</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-blue-200">Minimum Hours:</span>
                          <span className="font-bold text-white" data-testid="text-minimum-hours">{currentPricing.minimumHours} hours</span>
                        </div>
                        <Separator className="bg-white/20" />
                        <div className="flex justify-between text-lg font-black">
                          <span className="text-amber-400">Total Minimum:</span>
                          <span className="text-amber-400" data-testid="text-total-cost">${currentPricing.totalCost}</span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-blue-100 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20">
                        {currentPricing.description}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card className="bg-white rounded-2xl shadow-xl border border-slate-200">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="font-black text-slate-900">Emergency Contact</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center bg-slate-50 rounded-xl p-4">
                      <p className="text-sm text-slate-600 mb-1 font-medium">24/7 Emergency Hotline</p>
                      <a href="tel:4036136014" className="text-3xl font-black bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent" data-testid="link-emergency-phone">(403) 613-6014</a>
                    </div>
                    <Separator />
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-sm text-slate-600 mb-1 font-medium">Service Area</p>
                      <p className="font-bold text-slate-900">Calgary & Surrounding Areas</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                      <p className="text-sm text-green-700 mb-1 font-medium">Response Time</p>
                      <p className="font-bold text-green-600">Within 2 hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Emergency Service Form */}
            <div className="lg:col-span-2">
              <Card className="bg-white rounded-2xl shadow-xl border border-slate-200">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg">
                      <AlertTriangle className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="font-black text-slate-900 text-2xl">Emergency Service Request</CardTitle>
                  </div>
                  <CardDescription className="text-slate-600">
                    Fill out this form for immediate emergency service. Jordan will receive an instant notification.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="flex items-center gap-2 font-semibold text-slate-700">
                          <User className="h-4 w-4" />
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Your full name"
                          required
                          className="mt-1"
                          data-testid="input-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="flex items-center gap-2 font-semibold text-slate-700">
                          <Phone className="h-4 w-4" />
                          Phone Number *
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="(403) 555-0123"
                          required
                          className="mt-1"
                          data-testid="input-phone"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="flex items-center gap-2 font-semibold text-slate-700">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="your.email@example.com"
                        className="mt-1"
                        data-testid="input-email"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address" className="flex items-center gap-2 font-semibold text-slate-700">
                        <MapPin className="h-4 w-4" />
                        Service Address *
                      </Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        placeholder="123 Main Street, Calgary, AB"
                        required
                        className="mt-1"
                        data-testid="input-address"
                      />
                    </div>

                    {/* Emergency Details */}
                    <div>
                      <Label htmlFor="emergencyType" className="font-semibold text-slate-700">Type of Emergency *</Label>
                      <select
                        id="emergencyType"
                        value={formData.emergencyType}
                        onChange={(e) => setFormData({...formData, emergencyType: e.target.value})}
                        className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        required
                        data-testid="select-emergency-type"
                      >
                        <option value="">Select emergency type</option>
                        {emergencyTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="description" className="flex items-center gap-2 font-semibold text-slate-700">
                        <MessageSquare className="h-4 w-4" />
                        Detailed Description *
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Please describe the emergency situation in detail. Include any symptoms, when it started, and any safety concerns..."
                        rows={4}
                        required
                        className="mt-1"
                        data-testid="textarea-description"
                      />
                    </div>

                    <div>
                      <Label htmlFor="urgencyLevel" className="font-semibold text-slate-700">Urgency Level</Label>
                      <select
                        id="urgencyLevel"
                        value={formData.urgencyLevel}
                        onChange={(e) => setFormData({...formData, urgencyLevel: e.target.value})}
                        className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        data-testid="select-urgency"
                      >
                        <option value="high">High - Immediate attention needed</option>
                        <option value="critical">Critical - Safety hazard</option>
                        <option value="moderate">Moderate - Can wait a few hours</option>
                      </select>
                    </div>

                    {/* Pricing Summary */}
                    {currentPricing && (
                      <Alert className="bg-amber-50 border-amber-200">
                        <CreditCard className="h-4 w-4 text-amber-600" />
                        <AlertDescription>
                          <div className="space-y-2">
                            <p className="font-bold text-amber-900">Service Call Minimum: ${currentPricing.totalCost}</p>
                            <p className="text-sm text-amber-700">
                              This covers the {currentPricing.minimumHours} hour minimum at ${currentPricing.baseRate}/hour for {currentPricing.timeSlot} service calls. Additional time will be billed at the same hourly rate.
                            </p>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Submit Button */}
                    <div className="space-y-4">
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-6 text-lg rounded-xl shadow-2xl shadow-amber-500/50 transition-all hover:scale-105"
                        disabled={emergencyMutation.isPending}
                        data-testid="button-submit-emergency"
                      >
                        {emergencyMutation.isPending ? (
                          <>
                            <Clock className="h-5 w-5 mr-2 animate-spin" />
                            Submitting Emergency Request...
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-5 w-5 mr-2" />
                            Submit Emergency Service Request
                          </>
                        )}
                      </Button>
                      
                      <div className="text-center">
                        <p className="text-sm text-slate-600">
                          By submitting this request, you agree to the minimum service charge and authorize payment processing.
                        </p>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Footer Info */}
          <Card className="mt-8 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 border-0 shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0">
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
            </div>
            
            <CardContent className="p-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <CheckCircle className="h-12 w-12 text-amber-400 mx-auto mb-3" />
                    <h3 className="font-black text-white text-lg mb-2">Licensed & Insured</h3>
                    <p className="text-sm text-blue-100">Fully licensed HVAC technicians</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <Clock className="h-12 w-12 text-amber-400 mx-auto mb-3" />
                    <h3 className="font-black text-white text-lg mb-2">Fast Response</h3>
                    <p className="text-sm text-blue-100">Within 2 hours emergency response</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <Phone className="h-12 w-12 text-amber-400 mx-auto mb-3" />
                    <h3 className="font-black text-white text-lg mb-2">24/7 Availability</h3>
                    <p className="text-sm text-blue-100">Always available for emergencies</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default EmergencyServicePage;
