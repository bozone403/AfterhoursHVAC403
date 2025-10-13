import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Snowflake, Star, Award, Shield, Zap, CheckCircle, ArrowRight, ShoppingCart, Thermometer, Sparkles, Phone } from 'lucide-react';
import { Link } from 'wouter';

const AirConditioningShop = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const acModels = [
    {
      id: 1,
      name: "Ducane 4AC16L Single Stage",
      category: "single-stage",
      efficiency: "16 SEER",
      price: 5999,
      originalPrice: null,
      image: "/api/placeholder/300/200",
      features: [
        "Single stage compressor",
        "100% capacity cooling",
        "Reliable summer performance",
        "Standard electrical hookup",
        "10-year parts & compressor warranty"
      ],
      specs: {
        capacity: "1.5 - 5 tons",
        efficiency: "16 SEER",
        warranty: "10 years parts & compressor"
      },
      badge: "Good Value",
      popular: false,
      description: "Cost-effective choice for reliable cooling during Calgary summers"
    },
    {
      id: 2,
      name: "Lennox EL18XCV Two Stage",
      category: "two-stage",
      efficiency: "18 SEER",
      price: 7999,
      originalPrice: null,
      image: "/api/placeholder/300/200",
      features: [
        "Two stage compressor operation",
        "Superior humidity removal",
        "Quieter operation",
        "Enhanced comfort control",
        "10-year parts & compressor warranty"
      ],
      specs: {
        capacity: "1.5 - 5 tons",
        efficiency: "18 SEER",
        warranty: "10 years parts & compressor"
      },
      badge: "Most Popular",
      popular: true,
      description: "Significant upgrade in comfort with longer, quieter operation"
    },
    {
      id: 3,
      name: "Lennox SL28XCV Variable Capacity",
      category: "variable-capacity",
      efficiency: "28 SEER",
      price: 12499,
      originalPrice: null,
      image: "/api/placeholder/300/200",
      features: [
        "Variable capacity compressor",
        "Communicating smart thermostat included",
        "Quietest operation available",
        "Ultimate energy efficiency",
        "10-year parts & compressor warranty"
      ],
      specs: {
        capacity: "1.5 - 5 tons",
        efficiency: "28 SEER",
        warranty: "10 years parts & compressor"
      },
      badge: "Premium",
      popular: false,
      description: "The quietest and most energy-efficient central AC available"
    }
  ];

  const filteredACs = selectedCategory === 'all' 
    ? acModels 
    : acModels.filter(ac => ac.category === selectedCategory);

  return (
    <>
      <Helmet>
        <title>Central Air Conditioning Systems - Calgary AC Installation | AfterHours HVAC</title>
        <meta name="description" content="Shop premium central air conditioning systems with professional installation. Choose from single stage, two stage, and variable capacity models." />
      </Helmet>

      {/* Hero Section - Premium Cyan/Blue Gradient for Cooling */}
      <section className="relative min-h-[80vh] bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '700ms' }}></div>
        </div>

        {/* Premium Badge */}
        <div className="absolute top-8 right-8 z-20">
          <div className="bg-gradient-to-r from-amber-400 to-amber-600 text-white px-6 py-2 rounded-full shadow-xl flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span className="font-semibold text-sm">Premium Cooling Solutions</span>
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-6 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Snowflake className="w-4 h-4 text-cyan-400" />
                <span className="text-white/90 text-sm font-medium">Professional Installation Included</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight">
                Central Air
                <br />
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Conditioning
                </span>
              </h1>
              
              <p className="text-xl text-cyan-100 max-w-xl leading-relaxed">
                Beat Calgary's summer heat with premium air conditioning systems. Energy-efficient cooling with whisper-quiet operation and smart controls.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                  data-testid="button-shop-now"
                  asChild
                >
                  <a href="#ac-models">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Shop AC Systems
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
                  <Shield className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm font-medium">Licensed & Insured</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Award className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm font-medium">10-Year Warranties</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Star className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm font-medium">5-Star Rated</span>
                </div>
              </div>
            </div>

            {/* Right Side - Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
                <div className="text-4xl font-black text-white mb-2">16-28</div>
                <div className="text-cyan-200 text-sm">SEER Rating</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
                <div className="text-4xl font-black text-white mb-2">1.5-5</div>
                <div className="text-cyan-200 text-sm">Ton Capacity</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
                <div className="text-4xl font-black text-white mb-2">24/7</div>
                <div className="text-cyan-200 text-sm">Support</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
                <div className="text-4xl font-black text-white mb-2">$5,999</div>
                <div className="text-cyan-200 text-sm">Starting Price</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Section */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-cyan-50" id="ac-models">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Choose Your <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Perfect AC System</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From reliable single-stage units to ultra-efficient variable capacity systems, experience premium cooling comfort.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-white rounded-2xl shadow-xl p-2 gap-2">
              <Button
                onClick={() => setSelectedCategory('all')}
                className={selectedCategory === 'all' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg' 
                  : 'bg-transparent text-gray-700 hover:bg-gray-100'}
                data-testid="filter-all"
              >
                <Star className="w-4 h-4 mr-2" />
                All Systems
              </Button>
              <Button
                onClick={() => setSelectedCategory('single-stage')}
                className={selectedCategory === 'single-stage' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg' 
                  : 'bg-transparent text-gray-700 hover:bg-gray-100'}
                data-testid="filter-single-stage"
              >
                Single Stage
              </Button>
              <Button
                onClick={() => setSelectedCategory('two-stage')}
                className={selectedCategory === 'two-stage' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg' 
                  : 'bg-transparent text-gray-700 hover:bg-gray-100'}
                data-testid="filter-two-stage"
              >
                Two Stage
              </Button>
              <Button
                onClick={() => setSelectedCategory('variable-capacity')}
                className={selectedCategory === 'variable-capacity' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg' 
                  : 'bg-transparent text-gray-700 hover:bg-gray-100'}
                data-testid="filter-variable-capacity"
              >
                Variable Capacity
              </Button>
            </div>
          </div>

          {/* AC Models Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {filteredACs.map((ac) => (
              <Card 
                key={ac.id} 
                className={`relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 ${
                  ac.popular ? 'ring-2 ring-amber-500' : ''
                }`}
                data-testid={`card-ac-${ac.id}`}
              >
                {ac.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 shadow-lg">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {ac.badge}
                    </Badge>
                  </div>
                )}
                {!ac.popular && ac.badge && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge variant="secondary" className="shadow-md" data-testid={`badge-${ac.id}`}>
                      {ac.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="bg-gradient-to-br from-cyan-50 to-blue-50 pb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl">
                      <Snowflake className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="outline" className="border-cyan-300 text-cyan-700" data-testid={`efficiency-${ac.id}`}>
                      {ac.efficiency}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl font-black text-gray-900" data-testid={`title-${ac.id}`}>
                    {ac.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-2" data-testid={`description-${ac.id}`}>
                    {ac.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-6 space-y-6">
                  {/* Price */}
                  <div className="text-center py-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl">
                    <div className="text-4xl font-black text-gray-900" data-testid={`price-${ac.id}`}>
                      ${ac.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Installation Included</div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    {ac.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700" data-testid={`feature-${ac.id}-${index}`}>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Specs */}
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Capacity:</span>
                      <span className="font-semibold text-gray-900" data-testid={`spec-capacity-${ac.id}`}>{ac.specs.capacity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Warranty:</span>
                      <span className="font-semibold text-gray-900" data-testid={`spec-warranty-${ac.id}`}>{ac.specs.warranty}</span>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:scale-105 transition-all"
                      data-testid={`button-buy-${ac.id}`}
                      onClick={() => {
                        const serviceData = {
                          name: ac.name,
                          price: `$${ac.price.toLocaleString()}`,
                          description: `${ac.name} - ${ac.specs.efficiency}`,
                          category: 'ac-purchase'
                        };
                        window.location.href = `/checkout?service=${encodeURIComponent(JSON.stringify(serviceData))}`;
                      }}
                    >
                      Buy Now - ${ac.price.toLocaleString()}
                    </Button>
                    <div className="flex gap-3">
                      <Button 
                        className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:scale-105 transition-all"
                        data-testid={`button-quote-${ac.id}`}
                        asChild
                      >
                        <Link href="/quote">
                          Get Quote
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-2 hover:bg-gray-50"
                        data-testid={`button-call-${ac.id}`}
                        onClick={() => window.location.href = 'tel:4036136014'}
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Installation Details Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-gray-900 mb-4">
                What's <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Included</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Professional installation with every central air conditioner
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-cyan-600 mb-6">Standard Installation Includes:</h3>
                {[
                  "New outdoor condensing unit",
                  "New indoor evaporator coil",
                  "Composite pad installation",
                  "Standard lineset run (up to 25ft)",
                  "Electrical hookup from existing disconnect",
                  "System evacuation and refrigerant charging"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <span className="text-lg text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-orange-600 mb-6">Additional Costs May Apply For:</h3>
                {[
                  "Electrical upgrades or new disconnect",
                  "Lineset runs over 25 feet",
                  "Complex installation scenarios",
                  "Ductwork modifications"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-orange-200 flex-shrink-0 mt-1"></div>
                    <span className="text-lg text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">
              Why Choose Professional Installation?
            </h2>
            <p className="text-xl text-cyan-100 max-w-2xl mx-auto">
              Expert installation ensures optimal performance and energy efficiency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: Thermometer,
                title: "Optimal Performance",
                description: "Proper sizing and installation ensures maximum efficiency and comfort"
              },
              {
                icon: Zap,
                title: "Energy Savings",
                description: "Professional installation maximizes efficiency, reducing utility bills"
              },
              {
                icon: Shield,
                title: "Warranty Protection",
                description: "Professional installation protects your manufacturer warranty"
              }
            ].map((item, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-all">
                <div className="inline-flex p-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl mb-4">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-cyan-100">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-cyan-50 to-blue-50">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Ready to Beat the <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Summer Heat?</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Contact us today for a free quote and expert consultation on the perfect AC system for your home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xl hover:scale-105 transition-all text-lg px-8"
                data-testid="button-cta-contact"
                asChild
              >
                <Link href="/contact">
                  Get Free Quote
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-50 text-lg px-8"
                data-testid="button-cta-call"
                asChild
              >
                <a href="tel:4036136014">
                  <Phone className="w-5 h-5 mr-2" />
                  (403) 613-6014
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AirConditioningShop;
