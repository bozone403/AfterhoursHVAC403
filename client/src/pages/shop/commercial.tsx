import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Star, Award, Shield, Zap, CheckCircle, ArrowRight, Phone, ChefHat, Briefcase, Home, Warehouse, Calendar, Mail, Sparkles } from 'lucide-react';
import { Link } from 'wouter';

const CommercialShop = () => {
  const [activeTab, setActiveTab] = useState('restaurants');

  const niches = {
    restaurants: {
      icon: ChefHat,
      title: "Restaurants & Food Service",
      description: "Specializing in commercial kitchen ventilation, exhaust fans, and make-up air (MUA) units to keep your kitchen compliant and your staff and customers comfortable.",
      services: [
        "Commercial Kitchen Ventilation Systems",
        "Exhaust Fan Installation & Maintenance",
        "Make-Up Air (MUA) Units",
        "Commercial Refrigeration Support",
        "Health Code Compliance Solutions",
        "Emergency Kitchen HVAC Repair"
      ]
    },
    office: {
      icon: Briefcase,
      title: "Office & Retail",
      description: "Tenant comfort is key. We offer zoned systems, rooftop unit (RTU) maintenance, and indoor air quality solutions to create a productive and welcoming environment.",
      services: [
        "Rooftop Unit (RTU) Installation & Service",
        "Multi-Zone Climate Control Systems",
        "Indoor Air Quality Solutions",
        "Energy-Efficient HVAC Retrofits",
        "Tenant Space Buildouts",
        "Smart Building Integration"
      ]
    },
    multifamily: {
      icon: Home,
      title: "Multi-Family & Apartments",
      description: "Keep your tenants happy with reliable heating and cooling. We offer bulk maintenance contracts and timely service for apartment buildings, condos, and townhome complexes.",
      services: [
        "Bulk Maintenance Contracts",
        "Central Boiler & Chiller Systems",
        "Individual Suite HVAC Units",
        "Common Area Climate Control",
        "Emergency Tenant Service",
        "Energy Management Systems"
      ]
    },
    warehouse: {
      icon: Warehouse,
      title: "Warehouses & Light Industrial",
      description: "Efficiently heat and ventilate large spaces with our expertise in unit heaters, infrared heaters, and large-scale ventilation systems.",
      services: [
        "Unit Heater Installation & Service",
        "Infrared Heating Systems",
        "Large-Scale Ventilation Systems",
        "Warehouse Climate Control",
        "Industrial Air Quality Solutions",
        "Energy-Efficient Heating Solutions"
      ]
    }
  };

  return (
    <>
      <Helmet>
        <title>Commercial HVAC Solutions - Calgary Commercial Heating & Cooling | AfterHours HVAC</title>
        <meta name="description" content="Professional commercial HVAC solutions for restaurants, offices, multi-family buildings, and warehouses. Expert installation and maintenance services." />
      </Helmet>

      {/* Hero Section - Premium Blue/Slate Gradient */}
      <section className="relative min-h-[80vh] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-slate-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '700ms' }}></div>
        </div>

        {/* Premium Badge */}
        <div className="absolute top-8 right-8 z-20">
          <div className="bg-gradient-to-r from-amber-400 to-amber-600 text-white px-6 py-2 rounded-full shadow-xl flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span className="font-semibold text-sm">Commercial HVAC Experts</span>
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-6 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Building2 className="w-4 h-4 text-blue-400" />
                <span className="text-white/90 text-sm font-medium">Professional Commercial Solutions</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight">
                Commercial
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-slate-500 bg-clip-text text-transparent">
                  HVAC Solutions
                </span>
              </h1>
              
              <p className="text-xl text-blue-100 max-w-xl leading-relaxed">
                Reliable HVAC solutions that protect your business and bottom line. Specialized services for restaurants, offices, multi-family buildings, and warehouses.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                  data-testid="button-view-services"
                  asChild
                >
                  <a href="#commercial-services">
                    View Services
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </a>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all"
                  data-testid="button-call-now"
                  asChild
                >
                  <Link href="/contact">
                    <Phone className="w-5 h-5 mr-2" />
                    (403) 613-6014
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2 text-white/90">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-medium">Licensed & Insured</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Award className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-medium">24/7 Emergency Service</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Star className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-medium">Commercial Certified</span>
                </div>
              </div>
            </div>

            {/* Right Side - Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
                <div className="text-4xl font-black text-white mb-2">24/7</div>
                <div className="text-blue-200 text-sm">Emergency Service</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
                <div className="text-4xl font-black text-white mb-2">100+</div>
                <div className="text-blue-200 text-sm">Commercial Clients</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
                <div className="text-4xl font-black text-white mb-2">15+</div>
                <div className="text-blue-200 text-sm">Years Experience</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
                <div className="text-4xl font-black text-white mb-2">4hr</div>
                <div className="text-blue-200 text-sm">Response Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Niches Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50" id="commercial-services">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Specialized Solutions for <span className="bg-gradient-to-r from-blue-500 to-slate-600 bg-clip-text text-transparent">Every Industry</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert HVAC services tailored to your specific commercial needs
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-6xl mx-auto">
            <div className="flex justify-center mb-8">
              <TabsList className="inline-flex bg-white rounded-2xl shadow-xl p-2 gap-2">
                {Object.entries(niches).map(([key, niche]) => (
                  <TabsTrigger 
                    key={key} 
                    value={key} 
                    className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-slate-600 data-[state=active]:text-white"
                    data-testid={`tab-${key}`}
                  >
                    <niche.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{niche.title.split(' ')[0]}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {Object.entries(niches).map(([key, niche]) => (
              <TabsContent key={key} value={key}>
                <Card className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-br from-blue-50 to-slate-50 pb-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-4 bg-gradient-to-r from-blue-500 to-slate-600 rounded-xl">
                        <niche.icon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-3xl font-black text-gray-900" data-testid={`title-${key}`}>
                          {niche.title}
                        </CardTitle>
                        <CardDescription className="text-lg text-gray-600 mt-2" data-testid={`description-${key}`}>
                          {niche.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-8">
                    <div className="grid md:grid-cols-2 gap-4">
                      {niche.services.map((service, index) => (
                        <div key={index} className="flex items-center gap-3" data-testid={`service-${key}-${index}`}>
                          <CheckCircle className="h-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{service}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Value Props Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-gray-900 mb-4">
                Why Commercial Clients <span className="bg-gradient-to-r from-blue-500 to-slate-600 bg-clip-text text-transparent">Choose Us</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Professional HVAC service that protects your business
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  title: "Protecting Your Asset",
                  description: "We're maintaining critical business infrastructure, keeping tenants happy and ensuring business continuity."
                },
                {
                  icon: Zap,
                  title: "Total Cost of Ownership",
                  description: "Long-term solutions focused on lower energy bills, fewer breakdowns, and longer equipment lifespan."
                },
                {
                  icon: Calendar,
                  title: "Preventive Maintenance",
                  description: "Comprehensive maintenance contracts providing predictable service and peace of mind."
                }
              ].map((item, index) => (
                <Card key={index} className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-slate-600 rounded-xl">
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl text-gray-900">{item.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Maintenance Program Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">
              Commercial Maintenance Program
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Predictable, proactive maintenance that protects your investment
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              "Reduce the risk of costly, unexpected breakdowns",
              "Lower energy consumption through peak efficiency tuning",
              "Extend the operational lifespan of your equipment",
              "Ensure tenant and employee comfort and safety",
              "Provide detailed service reports for your records",
              "Preferred pricing on all repairs and future installations"
            ].map((benefit, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white text-lg">{benefit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Protect Your <span className="bg-gradient-to-r from-blue-500 to-slate-600 bg-clip-text text-transparent">Business Investment</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Schedule a free site assessment to receive a customized maintenance proposal for your property.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-white border-2 border-blue-200">
                <CardContent className="p-6 text-center">
                  <Phone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Emergency Service</h3>
                  <p className="text-gray-600 mb-4">24/7 emergency response</p>
                  <Button 
                    asChild 
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
                    data-testid="button-emergency-call"
                  >
                    <a href="tel:4036136014">(403) 613-6014</a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white border-2 border-green-200">
                <CardContent className="p-6 text-center">
                  <Calendar className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Schedule Assessment</h3>
                  <p className="text-gray-600 mb-4">Free on-site evaluation</p>
                  <Button 
                    asChild 
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                    data-testid="button-schedule"
                  >
                    <Link href="/calendar-booking">Book Assessment</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white border-2 border-purple-200">
                <CardContent className="p-6 text-center">
                  <Mail className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Quote</h3>
                  <p className="text-gray-600 mb-4">Custom maintenance proposal</p>
                  <Button 
                    asChild 
                    className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                    data-testid="button-email"
                  >
                    <a href="mailto:Jordan@Afterhourshvac.ca">Email Jordan</a>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Protect Your Business?</h3>
              <p className="text-gray-600 mb-6">
                Join hundreds of Calgary businesses who trust AfterHours HVAC for reliable commercial service and maintenance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:scale-105 transition-all text-lg px-8"
                  data-testid="button-cta-contact"
                  asChild
                >
                  <Link href="/contact">
                    Request Site Assessment
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-lg px-8"
                  data-testid="button-cta-plans"
                  asChild
                >
                  <Link href="/shop/maintenance-plans">View Maintenance Plans</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CommercialShop;
