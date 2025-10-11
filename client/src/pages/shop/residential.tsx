import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, Star, Award, Shield, Zap, CheckCircle, ArrowRight, ShoppingCart, Package, Sparkles, Phone, ThermometerSun, Snowflake } from 'lucide-react';
import { Link } from 'wouter';

const ResidentialShop = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const residentialPackages = [
    {
      id: 1,
      name: "Essential Comfort Package",
      category: "essential",
      price: 13999,
      originalPrice: null,
      image: "/api/placeholder/300/200",
      features: [
        "Ducane 92% AFUE Single Stage Furnace (40,000-120,000 BTU/h)",
        "Ducane 16 SEER Single Stage Central AC (1.5-5 tons)",
        "Standard digital thermostat included",
        "Complete professional installation",
        "10-year parts & compressor warranty"
      ],
      specs: {
        furnaceEfficiency: "92% AFUE",
        acEfficiency: "16 SEER",
        warranty: "10 years parts & compressor"
      },
      badge: "Great Value",
      popular: false,
      description: "Reliable heating and cooling for budget-conscious homeowners"
    },
    {
      id: 2,
      name: "Premium Comfort Package",
      category: "premium",
      price: 17999,
      originalPrice: null,
      image: "/api/placeholder/300/200",
      features: [
        "Lennox 96% AFUE Two Stage Furnace (40,000-120,000 BTU/h)",
        "Lennox 18 SEER Two Stage Central AC (1.5-5 tons)",
        "Variable speed ECM blower motor",
        "Enhanced comfort and humidity control",
        "Complete professional installation",
        "20-year heat exchanger warranty"
      ],
      specs: {
        furnaceEfficiency: "96% AFUE",
        acEfficiency: "18 SEER",
        warranty: "10 years parts, 20 years heat exchanger"
      },
      badge: "Most Popular",
      popular: true,
      description: "Superior comfort with energy-efficient two-stage operation"
    },
    {
      id: 3,
      name: "Ultimate Luxury Package",
      category: "luxury",
      price: 28999,
      originalPrice: null,
      image: "/api/placeholder/300/200",
      features: [
        "Lennox 98% AFUE Modulating Furnace (40,000-120,000 BTU/h)",
        "Lennox 28 SEER Variable Capacity AC (1.5-5 tons)",
        "Communicating smart thermostat included",
        "Whisper-quiet operation",
        "Ultimate energy efficiency",
        "Complete professional installation",
        "Lifetime heat exchanger warranty"
      ],
      specs: {
        furnaceEfficiency: "98% AFUE",
        acEfficiency: "28 SEER",
        warranty: "10 years parts, lifetime heat exchanger"
      },
      badge: "Premium",
      popular: false,
      description: "The pinnacle of home comfort and energy efficiency"
    }
  ];

  const filteredPackages = selectedCategory === 'all' 
    ? residentialPackages 
    : residentialPackages.filter(pkg => pkg.category === selectedCategory);

  return (
    <>
      <Helmet>
        <title>Residential HVAC Packages - Complete Heating & Cooling | AfterHours HVAC</title>
        <meta name="description" content="Complete residential HVAC packages combining premium furnaces and air conditioners. Professional installation with comprehensive warranties." />
      </Helmet>

      {/* Hero Section - Premium Professional Gradient */}
      <section className="relative min-h-[80vh] bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '700ms' }}></div>
        </div>

        {/* Premium Badge */}
        <div className="absolute top-8 right-8 z-20">
          <div className="bg-gradient-to-r from-amber-400 to-amber-600 text-white px-6 py-2 rounded-full shadow-xl flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span className="font-semibold text-sm">Complete HVAC Solutions</span>
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-6 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Home className="w-4 h-4 text-indigo-400" />
                <span className="text-white/90 text-sm font-medium">Complete Heating & Cooling Packages</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight">
                Residential
                <br />
                <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                  HVAC Packages
                </span>
              </h1>
              
              <p className="text-xl text-indigo-100 max-w-xl leading-relaxed">
                Complete home comfort solutions combining premium furnaces and air conditioners. Save more with package pricing and enjoy year-round comfort.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                  data-testid="button-shop-now"
                  asChild
                >
                  <a href="#residential-packages">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Shop Packages
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
                  <Shield className="w-5 h-5 text-indigo-400" />
                  <span className="text-sm font-medium">Licensed & Insured</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Award className="w-5 h-5 text-indigo-400" />
                  <span className="text-sm font-medium">Extended Warranties</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Star className="w-5 h-5 text-indigo-400" />
                  <span className="text-sm font-medium">5-Star Rated</span>
                </div>
              </div>
            </div>

            {/* Right Side - Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
                <div className="text-4xl font-black text-white mb-2">92-98%</div>
                <div className="text-indigo-200 text-sm">AFUE Furnace</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
                <div className="text-4xl font-black text-white mb-2">16-28</div>
                <div className="text-indigo-200 text-sm">SEER AC</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
                <div className="text-4xl font-black text-white mb-2">24/7</div>
                <div className="text-indigo-200 text-sm">Support</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
                <div className="text-4xl font-black text-white mb-2">$13,999</div>
                <div className="text-indigo-200 text-sm">Starting Price</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Section */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-indigo-50" id="residential-packages">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Choose Your <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Perfect Package</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete heating and cooling solutions tailored to your comfort needs and budget.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-white rounded-2xl shadow-xl p-2 gap-2">
              <Button
                onClick={() => setSelectedCategory('all')}
                className={selectedCategory === 'all' 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' 
                  : 'bg-transparent text-gray-700 hover:bg-gray-100'}
                data-testid="filter-all"
              >
                <Star className="w-4 h-4 mr-2" />
                All Packages
              </Button>
              <Button
                onClick={() => setSelectedCategory('essential')}
                className={selectedCategory === 'essential' 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' 
                  : 'bg-transparent text-gray-700 hover:bg-gray-100'}
                data-testid="filter-essential"
              >
                Essential
              </Button>
              <Button
                onClick={() => setSelectedCategory('premium')}
                className={selectedCategory === 'premium' 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' 
                  : 'bg-transparent text-gray-700 hover:bg-gray-100'}
                data-testid="filter-premium"
              >
                Premium
              </Button>
              <Button
                onClick={() => setSelectedCategory('luxury')}
                className={selectedCategory === 'luxury' 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' 
                  : 'bg-transparent text-gray-700 hover:bg-gray-100'}
                data-testid="filter-luxury"
              >
                Luxury
              </Button>
            </div>
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {filteredPackages.map((pkg) => (
              <Card 
                key={pkg.id} 
                className={`relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 ${
                  pkg.popular ? 'ring-2 ring-amber-500' : ''
                }`}
                data-testid={`card-package-${pkg.id}`}
              >
                {pkg.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 shadow-lg">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {pkg.badge}
                    </Badge>
                  </div>
                )}
                {!pkg.popular && pkg.badge && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge variant="secondary" className="shadow-md" data-testid={`badge-${pkg.id}`}>
                      {pkg.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="bg-gradient-to-br from-indigo-50 to-purple-50 pb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex gap-2">
                      <ThermometerSun className="w-5 h-5 text-orange-500" />
                      <Snowflake className="w-5 h-5 text-cyan-500" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-black text-gray-900" data-testid={`title-${pkg.id}`}>
                    {pkg.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-2" data-testid={`description-${pkg.id}`}>
                    {pkg.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-6 space-y-6">
                  {/* Price */}
                  <div className="text-center py-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                    <div className="text-4xl font-black text-gray-900" data-testid={`price-${pkg.id}`}>
                      ${pkg.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Complete Package Installed</div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    {pkg.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700" data-testid={`feature-${pkg.id}-${index}`}>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Specs */}
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Furnace:</span>
                      <span className="font-semibold text-gray-900" data-testid={`spec-furnace-${pkg.id}`}>{pkg.specs.furnaceEfficiency}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">AC:</span>
                      <span className="font-semibold text-gray-900" data-testid={`spec-ac-${pkg.id}`}>{pkg.specs.acEfficiency}</span>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:scale-105 transition-all"
                      data-testid={`button-quote-${pkg.id}`}
                      asChild
                    >
                      <Link href="/contact">
                        Get Quote
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-2 hover:bg-gray-50"
                      data-testid={`button-call-${pkg.id}`}
                      asChild
                    >
                      <Link href="/contact">
                        <Phone className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Package Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-gray-900 mb-4">
                Why Choose a <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Complete Package?</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Save money and enjoy better performance with matched systems
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Award,
                  title: "Save Money",
                  description: "Package pricing saves thousands compared to purchasing separately"
                },
                {
                  icon: Zap,
                  title: "Matched Performance",
                  description: "Furnace and AC designed to work together for optimal efficiency"
                },
                {
                  icon: Shield,
                  title: "Single Installation",
                  description: "Install both systems at once, saving time and installation costs"
                }
              ].map((item, index) => (
                <div key={index} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 text-center">
                  <div className="inline-flex p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl mb-4">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">
              Professional Installation Included
            </h2>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Expert installation ensures optimal performance and efficiency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: Shield,
                title: "Licensed Technicians",
                description: "Certified HVAC professionals"
              },
              {
                icon: Award,
                title: "Warranty Protection",
                description: "Extended manufacturer warranties"
              },
              {
                icon: Zap,
                title: "Energy Efficient",
                description: "Maximize efficiency and savings"
              },
              {
                icon: Star,
                title: "5-Star Service",
                description: "Rated excellent by homeowners"
              }
            ].map((item, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-all">
                <div className="inline-flex p-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl mb-4">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-indigo-100">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Ready for Complete <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Home Comfort?</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Contact us today for a free quote on the perfect HVAC package for your home.
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
                className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 text-lg px-8"
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

export default ResidentialShop;
