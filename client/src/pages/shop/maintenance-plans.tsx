import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Shield, Clock, Wrench, CheckCircle, Star, Phone, Calendar, Award, Sparkles, ShoppingCart } from 'lucide-react';
import { Link } from 'wouter';
import { ServiceBookingModal } from '@/components/ServiceBookingModal';

const MaintenancePlansShop = () => {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const isAnnual = true;

  const handleBookService = (plan: any) => {
    setSelectedService({
      name: plan.name,
      price: plan.price,
      description: plan.description,
      category: 'Maintenance Plan'
    });
    setBookingModalOpen(true);
  };

  const residentialPlans = [
    {
      id: 1,
      name: "QuickShot Diagnostic",
      type: "diagnostic",
      oneTimePrice: 199,
      features: [
        "20-Point System Report",
        "Basic Filter & Zone Checks",
        "Thermostat Calibration",
        "Visual Leak & Efficiency Scan",
        "$50 Credit Toward Repairs"
      ],
      duration: "~1hr",
      badge: "One-Time Service",
      popular: false,
      description: "Perfect for system checkups and troubleshooting"
    },
    {
      id: 2,
      name: "Protect+ Seasonal Optimizer",
      type: "seasonal",
      visitPrice: 349,
      features: [
        "Includes QuickShot diagnostics",
        "Deep Coil Clean (Evap & Condenser)",
        "Refrigerant Top-Up (1 lb R-410A)",
        "Blower Motor Amp Draw & Lube",
        "Drain Flush + Basic Sanitization",
        "Smart Thermostat Optimization",
        "$100 Priority Voucher (6-month expiry)"
      ],
      badge: "Seasonal Service",
      popular: false,
      description: "Comprehensive seasonal tune-up service"
    },
    {
      id: 3,
      name: "Premium Maintenance Plan",
      type: "plan",
      monthlyPrice: 146,
      annualPrice: 1755,
      savings: 145,
      features: [
        "Bi-annual tune-ups",
        "Comprehensive cleaning",
        "Detailed inspection",
        "Priority emergency service",
        "15% discount on repairs",
        "Free filter replacements"
      ],
      badge: "Most Popular",
      popular: true,
      description: "Complete annual maintenance coverage"
    },
    {
      id: 4,
      name: "Ultimate AfterHours Care Plan",
      type: "ultimate",
      monthlyPrice: 199,
      annualPrice: 2149,
      savings: 239,
      features: [
        "Everything in Dominion, plus:",
        "Unlimited Emergency Visits (After-Hours Included)",
        "Free Nest or ecobee Smart Thermostat",
        "Annual CO2 + Radon Testing Package",
        "Annual Full Duct Disinfection",
        "Free Furnace Certification Letter",
        "Transferable Coverage (home sale/rental)",
        "Lifetime Thermostat Coverage",
        "$250/year Equipment Replacement Credit",
        "$500 Breakdown Shield rebate"
      ],
      badge: "Estate Homes",
      popular: false,
      description: "Built for estate homes and multi-system houses"
    }
  ];

  const commercialPlans = [
    {
      id: 1,
      name: "Basic Business Maintenance",
      type: "commercial-basic",
      annualPrice: 1295,
      features: [
        "2x System Tune-Ups / Year",
        "Filter Change + Coil Clean",
        "24h On-Site Response SLA",
        "Inspection Letter for Insurance/Audit",
        "$100 Diagnostic Credit / Incident",
        "Service Window: Business Hours Only"
      ],
      badge: "Commercial",
      popular: false,
      description: "Essential maintenance for small businesses"
    },
    {
      id: 2,
      name: "Protect Pro Commercial",
      type: "commercial-pro",
      annualPrice: 2995,
      features: [
        "Everything in Basic, plus:",
        "4x Visits / Year (Quarterly Tune-Ups)",
        "Smart Building Thermostat Optimization",
        "Drain Line & Compressor Checks",
        "Refrigerant Pressure Test",
        "Early Failure Detection Reports",
        "After-Hours Support (2 Free Calls/Year)"
      ],
      badge: "Professional",
      popular: true,
      description: "Advanced commercial HVAC maintenance"
    },
    {
      id: 3,
      name: "Enterprise Building Contract",
      type: "commercial-enterprise",
      annualPrice: 5995,
      priceNote: "Starting at",
      features: [
        "Custom Maintenance Schedule (6–12x visits/year)",
        "Full System Reporting for Insurance/Compliance",
        "Priority Equipment Replacement Pipeline",
        "Remote Thermostat & System Diagnostics",
        "Dedicated Account Manager",
        "Emergency After-Hours SLA: 4 Hours Max",
        "Employee Air Quality Certification Option"
      ],
      badge: "Enterprise",
      popular: false,
      description: "For buildings with 5+ rooftop units and complex systems"
    }
  ];


  return (
    <>
      <Helmet>
        <title>HVAC Maintenance Plans - Calgary Service Plans | AfterHours HVAC</title>
        <meta name="description" content="Protect your HVAC investment with our comprehensive maintenance plans. Annual service, priority repairs, and extended warranties available." />
      </Helmet>

      {/* Hero Section - Premium Emerald/Teal Gradient */}
      <section className="relative min-h-[80vh] bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '700ms' }}></div>
        </div>

        {/* Premium Badge */}
        <div className="absolute top-8 right-8 z-20">
          <div className="bg-gradient-to-r from-amber-400 to-amber-600 text-white px-6 py-2 rounded-full shadow-xl flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span className="font-semibold text-sm">Premium Care Plans</span>
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-6 pt-24 pb-16">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-8">
              <Settings className="w-4 h-4 text-emerald-400" />
              <span className="text-white/90 text-sm font-medium">Professional Maintenance Solutions</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight mb-8">
              Premium
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                Maintenance Plans
              </span>
            </h1>
            
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto mb-8 leading-relaxed">
              Professional maintenance plans for residential and commercial properties. From quick diagnostics to comprehensive care with emergency coverage.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all hover:scale-105"
                onClick={() => {
                  const element = document.getElementById('maintenance-plans');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                data-testid="button-view-plans"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                View Plans
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
            <div className="flex flex-wrap justify-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-white/90">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-medium">Licensed Professionals</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Clock className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-medium">Priority Service</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Star className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-medium">5-Star Rated</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Residential Plans Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-emerald-50" id="maintenance-plans">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Residential <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">Maintenance Plans</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional maintenance to protect your home comfort investment
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {residentialPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 ${
                  plan.popular ? 'ring-2 ring-amber-500' : ''
                }`}
                data-testid={`card-plan-${plan.id}`}
              >
                {plan.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 shadow-lg">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                {!plan.popular && plan.badge && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge variant="secondary" className="shadow-md" data-testid={`badge-${plan.id}`}>
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="bg-gradient-to-br from-emerald-50 to-teal-50 pb-6">
                  <CardTitle className="text-lg font-bold text-gray-900 mb-2" data-testid={`title-${plan.id}`}>
                    {plan.name}
                  </CardTitle>
                  <div className="mb-4">
                    {plan.oneTimePrice && (
                      <div className="text-3xl font-black text-emerald-600" data-testid={`price-${plan.id}`}>${plan.oneTimePrice}</div>
                    )}
                    {plan.visitPrice && (
                      <div className="text-3xl font-black text-emerald-600" data-testid={`price-${plan.id}`}>${plan.visitPrice}/visit</div>
                    )}
                    {plan.monthlyPrice && plan.annualPrice && (
                      <>
                        <div className="text-3xl font-black text-emerald-600" data-testid={`price-${plan.id}`}>
                          ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                        </div>
                        <div className="text-gray-500 text-sm">
                          {isAnnual ? '/year' : '/month'}
                        </div>
                        {isAnnual && plan.savings > 0 && (
                          <div className="text-green-600 font-semibold text-sm">
                            Save ${plan.savings}/year
                          </div>
                        )}
                      </>
                    )}
                    {plan.duration && (
                      <div className="text-gray-500 text-sm">{plan.duration}</div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600" data-testid={`description-${plan.id}`}>{plan.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {plan.features.slice(0, 6).map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-gray-700" data-testid={`feature-${plan.id}-${idx}`}>
                        <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    asChild
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700' : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700'} text-white shadow-lg`}
                    size="sm"
                    data-testid={`button-choose-${plan.id}`}
                  >
                    <Link href={`/checkout/${plan.name === 'QuickShot Diagnostic' ? 'maintenance-quickshot' : 'maintenance-dominion'}`}>Choose Plan</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Commercial Plans Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Commercial <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">HVAC Contracts</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive maintenance plans for business properties
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {commercialPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 ${
                  plan.popular ? 'ring-2 ring-amber-500' : ''
                }`}
                data-testid={`card-commercial-${plan.id}`}
              >
                {plan.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 shadow-lg">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                {!plan.popular && plan.badge && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge variant="secondary" className="shadow-md" data-testid={`badge-commercial-${plan.id}`}>
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="bg-gradient-to-br from-emerald-50 to-teal-50 pb-6">
                  <CardTitle className="text-xl font-bold text-gray-900 mb-2" data-testid={`title-commercial-${plan.id}`}>
                    {plan.name}
                  </CardTitle>
                  <div className="mb-4">
                    <div className="text-3xl font-black text-emerald-600" data-testid={`price-commercial-${plan.id}`}>
                      {plan.priceNote && <span className="text-lg font-normal">{plan.priceNote} </span>}
                      ${plan.annualPrice.toLocaleString()}
                    </div>
                    <div className="text-gray-500 text-sm">/year</div>
                  </div>
                  <p className="text-sm text-gray-600" data-testid={`description-commercial-${plan.id}`}>{plan.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-gray-700" data-testid={`feature-commercial-${plan.id}-${idx}`}>
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    asChild
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700' : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700'} text-white shadow-lg`}
                    size="lg"
                    data-testid={`button-choose-commercial-${plan.id}`}
                  >
                    <Link href="/membership">Get Quote</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">
              Why Choose Our Maintenance Plans?
            </h2>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Professional care that protects and extends your HVAC investment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: Shield,
                title: "Extended Equipment Life",
                description: "Regular maintenance can extend your system's life by 5-10 years"
              },
              {
                icon: Clock,
                title: "Priority Service",
                description: "Skip the line with priority scheduling for repairs and emergencies"
              },
              {
                icon: Wrench,
                title: "Repair Discounts",
                description: "Save 10-20% on all repair services and replacement parts"
              },
              {
                icon: Star,
                title: "Energy Savings",
                description: "Well-maintained systems use up to 15% less energy"
              }
            ].map((item, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-all">
                <div className="inline-flex p-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl mb-4">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-emerald-100">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Ready to Protect <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">Your Investment?</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of satisfied customers who trust us with their HVAC maintenance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xl hover:scale-105 transition-all text-lg px-8"
                data-testid="button-cta-call"
                asChild
              >
                <a href="tel:4036136014">
                  <Phone className="w-5 h-5 mr-2" />
                  (403) 613-6014
                </a>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 text-lg px-8"
                data-testid="button-cta-schedule"
                asChild
              >
                <Link href="/quote">
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Service
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {selectedService && (
        <ServiceBookingModal
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          service={selectedService}
        />
      )}
    </>
  );
};

export default MaintenancePlansShop;
