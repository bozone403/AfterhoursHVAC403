import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building2, Users, Shield, Calculator, Wrench, CheckCircle, Star, Crown, Zap, Phone, Lock } from "lucide-react";
import { ProAccessGuard } from "@/components/ProAccessGuard";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface CorporateInquiry {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  industry: string;
  companySize: string;
  annualRevenue: string;
  currentUsers: number;
  projectedUsers: number;
  specificNeeds: string;
  timeline: string;
}

export default function CorporateMembership() {
  const [inquiry, setInquiry] = useState<CorporateInquiry>({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    industry: "",
    companySize: "",
    annualRevenue: "",
    currentUsers: 1,
    projectedUsers: 10,
    specificNeeds: "",
    timeline: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiRequest("POST", "/api/corporate-inquiry", inquiry);
      
      toast({
        title: "Corporate Inquiry Submitted",
        description: "Our team will contact you within 24 hours to discuss your custom solution.",
      });

      // Reset form
      setInquiry({
        companyName: "",
        contactName: "",
        email: "",
        phone: "",
        industry: "",
        companySize: "",
        annualRevenue: "",
        currentUsers: 1,
        projectedUsers: 10,
        specificNeeds: "",
        timeline: ""
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly at Jordan@Afterhourshvac.ca",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCorporatePayment = async () => {
    setIsSubmitting(true);
    try {
      const response = await apiRequest("POST", "/api/create-corporate-subscription", {
        companyName: inquiry.companyName,
        contactEmail: inquiry.email,
        maxUsers: inquiry.projectedUsers,
        customPricing: inquiry.annualRevenue
      });
      
      const data = await response.json();
      
      if (data.checkoutUrl) {
        // Redirect to Stripe Checkout for corporate subscription
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      toast({
        title: "Payment Setup Failed",
        description: "Please contact us directly for corporate pricing at Jordan@Afterhourshvac.ca",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-blue-100 border border-blue-200 rounded-full px-6 py-3 mb-6">
            <Building2 className="h-5 w-5 text-blue-700 mr-3" />
            <span className="text-blue-800 text-lg font-bold">Corporate Membership</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Enterprise HVAC Solutions</h1>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto">
            Secure, scalable HVAC tools for teams with unique account verification and multi-user management. 
            Built for contractors, engineering firms, and HVAC companies requiring professional-grade solutions.
          </p>
        </div>

        {/* Security Features */}
        <Card className="shadow-lg border-0 bg-white mb-8">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center gap-3">
              <Shield className="h-6 w-6" />
              Advanced Account Security & Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Phone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Phone Verification Required</h3>
                <p className="text-gray-700">
                  Every account requires unique phone verification to prevent sharing and ensure security compliance.
                </p>
              </div>
              <div className="text-center">
                <Lock className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Device Fingerprinting</h3>
                <p className="text-gray-700">
                  Advanced device tracking and session management prevents unauthorized access and account sharing.
                </p>
              </div>
              <div className="text-center">
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Corporate Account Management</h3>
                <p className="text-gray-700">
                  Centralized billing and user management for teams while maintaining individual account security.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pricing Plans */}
          <div className="space-y-6">
            {/* Standard Corporate Plan */}
            <Card className="shadow-lg border-2 border-blue-200 bg-white relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm font-bold">
                MOST POPULAR
              </div>
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg pb-8">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Crown className="h-6 w-6" />
                  Corporate Membership
                </CardTitle>
                <div className="mt-4">
                  <div className="text-4xl font-bold">$5,000</div>
                  <div className="text-blue-100">Lifetime Access</div>
                  <Badge className="mt-2 bg-white text-blue-700">Up to 10 Users</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Up to 10 verified user accounts</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Complete HVAC equipment catalog access</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Advanced quote builder with real Alggin pricing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Emergency service management system</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Job tracking and scheduling tools</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Priority customer support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Centralized billing and user management</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>No recurring fees - lifetime access</span>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3"
                  onClick={() => {
                    document.getElementById('corporate-inquiry')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Get Started - $5,000 Lifetime
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Custom Plan */}
            <Card className="shadow-lg border-2 border-purple-200 bg-white">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Zap className="h-6 w-6" />
                  Enterprise Custom
                </CardTitle>
                <div className="mt-4">
                  <div className="text-4xl font-bold">Custom</div>
                  <div className="text-purple-100">Consulting & Custom Tools</div>
                  <Badge className="mt-2 bg-white text-purple-700">11+ Users</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Unlimited verified user accounts</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>All Corporate features included</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Custom tool development</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>API integration and custom workflows</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Dedicated account manager</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>On-site training and support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Custom pricing based on requirements</span>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg py-3"
                  onClick={() => {
                    document.getElementById('corporate-inquiry')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Request Custom Quote
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Corporate Inquiry Form */}
          <Card className="shadow-lg border-0 bg-white" id="corporate-inquiry">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
              <CardTitle className="text-2xl flex items-center gap-3">
                <Building2 className="h-6 w-6" />
                Corporate Inquiry
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={inquiry.companyName}
                      onChange={(e) => setInquiry(prev => ({ ...prev, companyName: e.target.value }))}
                      placeholder="AfterHours HVAC Ltd."
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactName">Contact Name *</Label>
                    <Input
                      id="contactName"
                      value={inquiry.contactName}
                      onChange={(e) => setInquiry(prev => ({ ...prev, contactName: e.target.value }))}
                      placeholder="John Smith"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={inquiry.email}
                      onChange={(e) => setInquiry(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="john@company.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={inquiry.phone}
                      onChange={(e) => setInquiry(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(403) 613-6014"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={inquiry.industry}
                      onChange={(e) => setInquiry(prev => ({ ...prev, industry: e.target.value }))}
                      placeholder="HVAC Contracting"
                    />
                  </div>
                  <div>
                    <Label htmlFor="companySize">Company Size</Label>
                    <Input
                      id="companySize"
                      value={inquiry.companySize}
                      onChange={(e) => setInquiry(prev => ({ ...prev, companySize: e.target.value }))}
                      placeholder="50-100 employees"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentUsers">Current Users Needed</Label>
                    <Input
                      id="currentUsers"
                      type="number"
                      value={inquiry.currentUsers}
                      onChange={(e) => setInquiry(prev => ({ ...prev, currentUsers: parseInt(e.target.value) || 1 }))}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="projectedUsers">Projected Users (12 months)</Label>
                    <Input
                      id="projectedUsers"
                      type="number"
                      value={inquiry.projectedUsers}
                      onChange={(e) => setInquiry(prev => ({ ...prev, projectedUsers: parseInt(e.target.value) || 1 }))}
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="annualRevenue">Approximate Annual Revenue</Label>
                  <Input
                    id="annualRevenue"
                    value={inquiry.annualRevenue}
                    onChange={(e) => setInquiry(prev => ({ ...prev, annualRevenue: e.target.value }))}
                    placeholder="$1M - $10M"
                  />
                </div>

                <div>
                  <Label htmlFor="specificNeeds">Specific Requirements & Use Cases</Label>
                  <Textarea
                    id="specificNeeds"
                    value={inquiry.specificNeeds}
                    onChange={(e) => setInquiry(prev => ({ ...prev, specificNeeds: e.target.value }))}
                    placeholder="Describe your specific HVAC business needs, integration requirements, custom tools needed, etc."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="timeline">Implementation Timeline</Label>
                  <Input
                    id="timeline"
                    value={inquiry.timeline}
                    onChange={(e) => setInquiry(prev => ({ ...prev, timeline: e.target.value }))}
                    placeholder="ASAP, 30 days, 90 days, etc."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700 text-white text-lg py-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                  </Button>
                  
                  <Button 
                    type="button"
                    onClick={handleCorporatePayment}
                    className="bg-green-600 hover:bg-green-700 text-white text-lg py-3"
                    disabled={isSubmitting || !inquiry.companyName || !inquiry.email}
                  >
                    {isSubmitting ? "Processing..." : "Subscribe Now - $5,000 CAD/year"}
                  </Button>
                </div>
              </form>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900">Direct Contact</h4>
                    <p className="text-blue-800 text-sm">
                      For immediate assistance call Jordan at <strong>(403) 613-6014</strong> or email{" "}
                      <strong>Jordan@Afterhourshvac.ca</strong>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="p-6 text-center">
              <Calculator className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Professional Tools</h3>
              <p className="text-gray-700">
                Advanced calculators, quote builders, and project management tools designed for HVAC professionals.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="p-6 text-center">
              <Wrench className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Real Industry Data</h3>
              <p className="text-gray-700">
                Integrated with real supplier pricing from Alggin and other industry sources for accurate estimates.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="p-6 text-center">
              <Star className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Dedicated Support</h3>
              <p className="text-gray-700">
                Priority support, training, and account management for corporate customers.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}