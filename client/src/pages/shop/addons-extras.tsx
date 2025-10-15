import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wind, Wrench, Fan, Thermometer, Shield, Zap, Home, Factory, Phone, CheckCircle, Star, Clock, DollarSign, ArrowRight, Award, Sparkles, ShoppingCart } from 'lucide-react';
import { Link } from 'wouter';
import { ServiceBookingModal } from '@/components/ServiceBookingModal';

interface AddOnItem {
  id: string;
  name: string;
  description: string;
  price: string;
  laborTime: string;
  category: string;
  features: string[];
  warranty: string;
  availability: string;
  contactRequired?: boolean;
}

const addOnItems: AddOnItem[] = [
  {
    id: "hrv-installation",
    name: "Heat Recovery Ventilator (HRV)",
    description: "Complete HRV system installation for energy-efficient fresh air exchange while retaining indoor heat.",
    price: "$2,800 - $4,200",
    laborTime: "6-8 hours",
    category: "ventilation",
    features: [
      "Energy recovery up to 85%",
      "Balanced ventilation system",
      "Reduces humidity and pollutants",
      "Professional ductwork integration"
    ],
    warranty: "5 years parts, 2 years labor",
    availability: "2-3 weeks lead time"
  },
  {
    id: "erv-installation",
    name: "Energy Recovery Ventilator (ERV)",
    description: "Advanced ERV system for total energy recovery including both heat and moisture transfer.",
    price: "$3,200 - $4,800",
    laborTime: "6-8 hours",
    category: "ventilation",
    features: [
      "Heat and moisture recovery",
      "Ideal for humid climates",
      "Reduces HVAC load",
      "Smart controls included"
    ],
    warranty: "5 years parts, 2 years labor",
    availability: "2-3 weeks lead time"
  },
  {
    id: "bathroom-exhaust",
    name: "Bathroom Exhaust Fan Installation",
    description: "High-quality bathroom exhaust fan installation with proper venting to exterior.",
    price: "$320 - $580",
    laborTime: "2-3 hours",
    category: "ventilation",
    features: [
      "Quiet operation (<1.0 sone)",
      "Energy Star certified",
      "Humidity sensor option",
      "LED lighting available"
    ],
    warranty: "3 years parts, 1 year labor",
    availability: "Same week installation"
  },
  {
    id: "range-hood-install",
    name: "Kitchen Range Hood Installation",
    description: "Professional installation of kitchen range hood with external venting.",
    price: "$480 - $890",
    laborTime: "3-4 hours",
    category: "ventilation",
    features: [
      "Proper exterior venting",
      "Variable speed controls",
      "LED lighting",
      "Grease filter included"
    ],
    warranty: "2 years parts, 1 year labor",
    availability: "Same week installation"
  },
  {
    id: "ac-coil-cleaning",
    name: "AC Coil Deep Cleaning",
    description: "Professional evaporator and condenser coil cleaning to restore efficiency and air quality.",
    price: "$400",
    laborTime: "2-3 hours",
    category: "maintenance",
    features: [
      "Evaporator coil cleaning",
      "Condenser coil cleaning",
      "Drain line cleaning",
      "System performance test"
    ],
    warranty: "90 days service guarantee",
    availability: "Next day service"
  },
  {
    id: "duct-sanitization",
    name: "Duct Sanitization Service",
    description: "Professional duct cleaning and sanitization using hospital-grade disinfectants.",
    price: "$650 - $950",
    laborTime: "4-6 hours",
    category: "maintenance",
    features: [
      "Complete duct cleaning",
      "Antimicrobial treatment",
      "UV light sanitization",
      "Before/after photos"
    ],
    warranty: "1 year sanitization guarantee",
    availability: "1 week scheduling"
  },
  {
    id: "smart-thermostat",
    name: "Smart Thermostat Installation",
    description: "Professional installation of WiFi-enabled smart thermostat with mobile app control.",
    price: "$420 - $680",
    laborTime: "1-2 hours",
    category: "controls",
    features: [
      "WiFi connectivity",
      "Mobile app control",
      "Energy usage reports",
      "Geofencing capability"
    ],
    warranty: "5 years manufacturer, 1 year labor",
    availability: "Same day installation"
  },
  {
    id: "zone-control",
    name: "Zoning System Installation",
    description: "Multi-zone HVAC control system for customized comfort in different areas of your home.",
    price: "$2,400 - $4,200",
    laborTime: "8-12 hours",
    category: "controls",
    features: [
      "Individual room control",
      "Motorized dampers",
      "Multiple thermostats",
      "Energy savings up to 30%"
    ],
    warranty: "5 years parts, 2 years labor",
    availability: "2-3 weeks lead time"
  },
  {
    id: "uv-light-system",
    name: "UV Light Air Purification",
    description: "Germicidal UV light system installation to eliminate bacteria, viruses, and mold.",
    price: "$650 - $950",
    laborTime: "2-3 hours",
    category: "air-quality",
    features: [
      "99.9% pathogen elimination",
      "Reduces odors",
      "Low maintenance",
      "1-year UV bulb included"
    ],
    warranty: "3 years parts, 1 year labor",
    availability: "Same week installation"
  },
  {
    id: "whole-home-humidifier",
    name: "Whole-Home Humidifier",
    description: "Central humidification system to maintain optimal indoor humidity levels.",
    price: "$850 - $1,350",
    laborTime: "3-4 hours",
    category: "air-quality",
    features: [
      "Automatic humidity control",
      "Reduces static electricity",
      "Protects wood furnishings",
      "Digital display panel"
    ],
    warranty: "5 years parts, 2 years labor",
    availability: "1 week installation"
  },
  {
    id: "custom-sheet-metal",
    name: "Custom Sheet Metal Fabrication",
    description: "Bespoke sheet metal ductwork, plenums, and HVAC components fabricated to your specifications.",
    price: "Please Contact",
    laborTime: "Varies",
    category: "custom",
    features: [
      "Custom measurements",
      "Galvanized steel construction",
      "Professional installation",
      "Code compliant"
    ],
    warranty: "2 years craftsmanship",
    availability: "2-4 weeks lead time",
    contactRequired: true
  },
  {
    id: "commercial-makeup-air",
    name: "Commercial Makeup Air Units",
    description: "Industrial makeup air systems for commercial kitchens and manufacturing facilities.",
    price: "Please Contact",
    laborTime: "Varies",
    category: "commercial",
    features: [
      "Code compliant installation",
      "Heat recovery options",
      "Variable speed controls",
      "Professional design"
    ],
    warranty: "5 years parts, 2 years labor",
    availability: "3-6 weeks lead time",
    contactRequired: true
  },
  {
    id: "gas-line-installation",
    name: "Gas Line Installation & Repair",
    description: "Licensed gas fitting services for furnaces, fireplaces, and appliances.",
    price: "$450 - $1,200",
    laborTime: "2-6 hours",
    category: "gas-services",
    features: [
      "Licensed gas fitters",
      "Pressure testing",
      "Code compliant installation",
      "Safety inspection included"
    ],
    warranty: "5 years installation",
    availability: "Same week service"
  },
  {
    id: "electrical-upgrades",
    name: "HVAC Electrical Upgrades",
    description: "Electrical panel upgrades and dedicated circuits for HVAC equipment.",
    price: "$650 - $1,850",
    laborTime: "3-6 hours",
    category: "electrical",
    features: [
      "Licensed electricians",
      "Dedicated HVAC circuits",
      "Code compliant wiring",
      "Electrical safety inspection"
    ],
    warranty: "5 years electrical work",
    availability: "1 week scheduling"
  }
];

const categories = [
  { id: "all", name: "All Add-Ons", icon: Star },
  { id: "ventilation", name: "Ventilation", icon: Wind },
  { id: "maintenance", name: "Cleaning & Maintenance", icon: Wrench },
  { id: "controls", name: "Controls & Automation", icon: Thermometer },
  { id: "air-quality", name: "Air Quality", icon: Shield },
  { id: "custom", name: "Custom Work", icon: Factory },
  { id: "commercial", name: "Commercial", icon: Factory },
  { id: "gas-services", name: "Gas Services", icon: Zap },
  { id: "electrical", name: "Electrical", icon: Zap }
];

const AddonsExtrasShop = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  const handleBookService = (item: AddOnItem) => {
    setSelectedService({
      name: item.name,
      price: item.price,
      description: item.description,
      category: 'HVAC Add-On'
    });
    setBookingModalOpen(true);
  };

  const filteredItems = selectedCategory === "all" 
    ? addOnItems 
    : addOnItems.filter(item => item.category === selectedCategory);

  const getCategoryBadgeColor = (category: string) => {
    const colors: { [key: string]: string } = {
      ventilation: "bg-blue-100 text-blue-800",
      maintenance: "bg-green-100 text-green-800",
      controls: "bg-purple-100 text-purple-800",
      "air-quality": "bg-teal-100 text-teal-800",
      custom: "bg-orange-100 text-orange-800",
      commercial: "bg-gray-100 text-gray-800",
      "gas-services": "bg-red-100 text-red-800",
      electrical: "bg-yellow-100 text-yellow-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <>
      <Helmet>
        <title>HVAC Add-Ons & Extras - Professional Enhancements | AfterHours HVAC</title>
        <meta name="description" content="Professional HVAC add-on services including air quality improvements, smart controls, ventilation, and custom fabrication. Expert installation." />
      </Helmet>

      {/* Hero Section - Premium Amber/Gold Gradient */}
      <section className="relative min-h-[80vh] bg-gradient-to-br from-slate-900 via-amber-900 to-slate-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '700ms' }}></div>
        </div>

        {/* Premium Badge */}
        <div className="absolute top-8 right-8 z-20">
          <div className="bg-gradient-to-r from-amber-400 to-amber-600 text-white px-6 py-2 rounded-full shadow-xl flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span className="font-semibold text-sm">Professional Enhancements</span>
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-6 pt-24 pb-16">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-8">
              <Wrench className="w-4 h-4 text-amber-400" />
              <span className="text-white/90 text-sm font-medium">HVAC Add-Ons & Extras</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight mb-8">
              Professional
              <br />
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                HVAC Enhancements
              </span>
            </h1>
            
            <p className="text-xl text-amber-100 max-w-2xl mx-auto mb-8 leading-relaxed">
              Upgrade your HVAC system with our professional add-on services. From air quality improvements to smart controls, we offer everything you need for optimal comfort and efficiency.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                data-testid="button-view-services"
                asChild
              >
                <a href="#addons-list">
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
                <a href="tel:4036136014">
                  <Phone className="w-5 h-5 mr-2" />
                  (403) 613-6014
                </a>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-white/90">
                <Shield className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-medium">Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Star className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-medium">Quality Guaranteed</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Clock className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-medium">Flexible Scheduling</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-amber-50" id="addons-list">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Professional <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">HVAC Add-Ons</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our comprehensive range of professional HVAC enhancements
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex flex-wrap bg-white rounded-2xl shadow-xl p-2 gap-2 max-w-4xl">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg' 
                    : 'bg-transparent text-gray-700 hover:bg-gray-100'}
                  data-testid={`filter-${category.id}`}
                >
                  <category.icon className="w-4 h-4 mr-2" />
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Add-Ons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {filteredItems.map((item) => (
              <Card 
                key={item.id} 
                className="relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2"
                data-testid={`card-addon-${item.id}`}
              >
                <div className="absolute top-4 right-4 z-10">
                  <Badge className={getCategoryBadgeColor(item.category)} data-testid={`badge-${item.id}`}>
                    {categories.find(c => c.id === item.category)?.name}
                  </Badge>
                </div>

                <CardHeader className="bg-gradient-to-br from-amber-50 to-orange-50 pb-6">
                  <CardTitle className="text-lg font-black text-gray-900" data-testid={`title-${item.id}`}>
                    {item.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600" data-testid={`description-${item.id}`}>
                    {item.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Pricing */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-amber-600" />
                      <span className="font-semibold text-amber-700" data-testid={`price-${item.id}`}>{item.price}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500" data-testid={`time-${item.id}`}>
                      <Clock className="h-4 w-4" />
                      {item.laborTime}
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="font-medium text-sm mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      {item.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm" data-testid={`feature-${item.id}-${index}`}>
                          <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                      {item.features.length > 3 && (
                        <li className="text-sm text-gray-500">
                          +{item.features.length - 3} more features
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Warranty & Availability */}
                  <div className="text-xs text-gray-500 space-y-1">
                    <div><strong>Warranty:</strong> {item.warranty}</div>
                    <div><strong>Availability:</strong> {item.availability}</div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    {item.contactRequired ? (
                      <Button 
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg"
                        data-testid={`button-contact-${item.id}`}
                        asChild
                      >
                        <Link href="/contact">
                          <Phone className="h-4 w-4 mr-2" />
                          Contact for Quote
                        </Link>
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="w-full border-2 border-amber-600 text-amber-600 hover:bg-amber-50"
                        data-testid={`button-quote-${item.id}`}
                        asChild
                      >
                        <Link href="/contact">Get Quote</Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-amber-900 to-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">
              Why Choose AfterHours HVAC?
            </h2>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto">
              Professional installation with quality guaranteed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: CheckCircle,
                title: "Licensed & Insured",
                description: "Fully licensed technicians with comprehensive liability coverage"
              },
              {
                icon: Star,
                title: "Quality Guaranteed",
                description: "Premium components with extended warranties on all installations"
              },
              {
                icon: Clock,
                title: "Flexible Scheduling",
                description: "Same-day service available for most add-on installations"
              }
            ].map((item, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center hover:bg-white/15 transition-all">
                <div className="inline-flex p-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl mb-4">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-amber-100">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Ready to Upgrade <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">Your HVAC System?</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Contact us today for a free consultation and quote on any add-on service.
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
                className="border-2 border-amber-600 text-amber-600 hover:bg-amber-50 text-lg px-8"
                data-testid="button-cta-consultation"
                asChild
              >
                <Link href="/contact">
                  Schedule Consultation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddonsExtrasShop;
