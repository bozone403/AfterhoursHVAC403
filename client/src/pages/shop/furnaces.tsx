import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThermometerSun, Star, Award, Shield, Zap, CheckCircle, ArrowRight, ShoppingCart, Sparkles, Phone } from 'lucide-react';
import { Link } from 'wouter';

const FurnacesShop = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const furnaceModels = [
    {
      id: 1,
      name: "Ducane 92G1UH Single Stage",
      category: "single-stage",
      efficiency: "92% AFUE",
      price: 5999,
      originalPrice: null,
      image: "/api/placeholder/300/200",
      features: [
        "Single stage gas valve",
        "Reliable on-demand heating",
        "Standard digital thermostat included",
        "Robust no-frills workhorse design",
        "10-year parts warranty"
      ],
      specs: {
        btuh: "40,000 - 120,000",
        efficiency: "92% AFUE",
        warranty: "10 years parts warranty"
      },
      badge: "Good Value",
      popular: false,
      description: "Perfect for budget-conscious clients or rental properties"
    },
    {
      id: 2,
      name: "Lennox EL296V Two Stage",
      category: "two-stage",
      efficiency: "96% AFUE",
      price: 7500,
      originalPrice: null,
      image: "/api/placeholder/300/200",
      features: [
        "Two stage gas valve operation",
        "Variable speed ECM blower motor",
        "Quiet low-stage operation",
        "Enhanced comfort and efficiency",
        "20-year heat exchanger warranty"
      ],
      specs: {
        btuh: "40,000 - 120,000",
        efficiency: "96% AFUE",
        warranty: "10 years parts, 20 years heat exchanger"
      },
      badge: "Most Popular",
      popular: true,
      description: "The new standard for modern homes with balanced temperatures"
    },
    {
      id: 3,
      name: "Lennox SLP98V Modulating",
      category: "modulating",
      efficiency: "98% AFUE",
      price: 11999,
      originalPrice: null,
      image: "/api/placeholder/300/200",
      features: [
        "Modulating gas valve (1% increments)",
        "Communicating smart thermostat included",
        "Quietest operation available",
        "Precise temperature control",
        "Lifetime heat exchanger warranty"
      ],
      specs: {
        btuh: "40,000 - 120,000",
        efficiency: "98% AFUE",
        warranty: "10 years parts, lifetime heat exchanger"
      },
      badge: "Premium",
      popular: false,
      description: "The pinnacle of heating technology for ultimate comfort"
    }
  ];

  const filteredFurnaces = selectedCategory === 'all' 
    ? furnaceModels 
    : furnaceModels.filter(furnace => furnace.category === selectedCategory);

  return (
    <>
      <Helmet>
        <title>Premium Furnaces - Calgary Installation | AfterHours HVAC</title>
        <meta name="description" content="Shop premium high-efficiency furnaces in Calgary. Single-stage, two-stage, and modulating furnaces from trusted brands. Professional installation included." />
      </Helmet>

      {/* Hero Section - Premium Orange/Red Gradient for Heating */}
      <section className="relative min-h-[80vh] bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '700ms' }}></div>
        </div>

        {/* Premium Badge */}
        <div className="absolute top-8 right-8 z-20">
          <div className="bg-gradient-to-r from-amber-400 to-amber-600 text-white px-6 py-2 rounded-full shadow-xl flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span className="font-semibold text-sm">Premium Heating Solutions</span>
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-6 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <ThermometerSun className="w-4 h-4 text-orange-400" />
                <span className="text-white/90 text-sm font-medium">Professional Installation Included</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight">
                Premium
                <br />
                <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  Furnaces
                </span>
              </h1>
              
              <p className="text-xl text-orange-100 max-w-xl leading-relaxed">
                High-efficiency heating systems engineered for Calgary's climate. Expert installation, premium warranties, and unmatched comfort.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                  data-testid="button-shop-now"
                  asChild
                >
                  <a href="#furnace-models">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Shop Furnaces
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
                  <Shield className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-medium">Licensed & Insured</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-medium">10+ Year Warranties</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Star className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-medium">5-Star Rated</span>
                </div>
              </div>
            </div>

            {/* Right Side - Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
                <div className="text-4xl font-black text-white mb-2">92-98%</div>
                <div className="text-orange-200 text-sm">AFUE Efficiency</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
                <div className="text-4xl font-black text-white mb-2">Lifetime</div>
                <div className="text-orange-200 text-sm">Heat Exchanger</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
                <div className="text-4xl font-black text-white mb-2">24/7</div>
                <div className="text-orange-200 text-sm">Support</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
                <div className="text-4xl font-black text-white mb-2">$5,999</div>
                <div className="text-orange-200 text-sm">Starting Price</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Section */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-orange-50" id="furnace-models">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Choose Your <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">Perfect Furnace</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From reliable single-stage models to whisper-quiet modulating systems, find the perfect heating solution for your home.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-white rounded-2xl shadow-xl p-2 gap-2">
              <Button
                onClick={() => setSelectedCategory('all')}
                className={selectedCategory === 'all' 
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg' 
                  : 'bg-transparent text-gray-700 hover:bg-gray-100'}
                data-testid="filter-all"
              >
                <Star className="w-4 h-4 mr-2" />
                All Furnaces
              </Button>
              <Button
                onClick={() => setSelectedCategory('single-stage')}
                className={selectedCategory === 'single-stage' 
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg' 
                  : 'bg-transparent text-gray-700 hover:bg-gray-100'}
                data-testid="filter-single-stage"
              >
                Single Stage
              </Button>
              <Button
                onClick={() => setSelectedCategory('two-stage')}
                className={selectedCategory === 'two-stage' 
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg' 
                  : 'bg-transparent text-gray-700 hover:bg-gray-100'}
                data-testid="filter-two-stage"
              >
                Two Stage
              </Button>
              <Button
                onClick={() => setSelectedCategory('modulating')}
                className={selectedCategory === 'modulating' 
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg' 
                  : 'bg-transparent text-gray-700 hover:bg-gray-100'}
                data-testid="filter-modulating"
              >
                Modulating
              </Button>
            </div>
          </div>

          {/* Furnace Models Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {filteredFurnaces.map((furnace) => (
              <Card 
                key={furnace.id} 
                className={`relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 ${
                  furnace.popular ? 'ring-2 ring-amber-500' : ''
                }`}
                data-testid={`card-furnace-${furnace.id}`}
              >
                {furnace.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 shadow-lg">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {furnace.badge}
                    </Badge>
                  </div>
                )}
                {!furnace.popular && furnace.badge && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge variant="secondary" className="shadow-md" data-testid={`badge-${furnace.id}`}>
                      {furnace.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="bg-gradient-to-br from-orange-50 to-red-50 pb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
                      <ThermometerSun className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="outline" className="border-orange-300 text-orange-700" data-testid={`efficiency-${furnace.id}`}>
                      {furnace.efficiency}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl font-black text-gray-900" data-testid={`title-${furnace.id}`}>
                    {furnace.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-2" data-testid={`description-${furnace.id}`}>
                    {furnace.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-6 space-y-6">
                  {/* Price */}
                  <div className="text-center py-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                    <div className="text-4xl font-black text-gray-900" data-testid={`price-${furnace.id}`}>
                      ${furnace.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Installation Included</div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    {furnace.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700" data-testid={`feature-${furnace.id}-${index}`}>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Specs */}
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Capacity:</span>
                      <span className="font-semibold text-gray-900" data-testid={`spec-btuh-${furnace.id}`}>{furnace.specs.btuh} BTU/h</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Warranty:</span>
                      <span className="font-semibold text-gray-900" data-testid={`spec-warranty-${furnace.id}`}>{furnace.specs.warranty}</span>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:scale-105 transition-all"
                      data-testid={`button-quote-${furnace.id}`}
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
                      data-testid={`button-call-${furnace.id}`}
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

      {/* Why Choose Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">
              Why Choose AfterHours HVAC?
            </h2>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Premium furnace installation with unmatched service quality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: Shield,
                title: "Licensed & Insured",
                description: "Fully licensed technicians with comprehensive coverage"
              },
              {
                icon: Award,
                title: "Premium Warranties",
                description: "Industry-leading warranties up to lifetime coverage"
              },
              {
                icon: Zap,
                title: "Expert Installation",
                description: "Professional installation by certified HVAC experts"
              },
              {
                icon: Star,
                title: "5-Star Service",
                description: "Rated excellent by hundreds of Calgary homeowners"
              }
            ].map((item, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-all">
                <div className="inline-flex p-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl mb-4">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-orange-100">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Ready to Upgrade Your <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">Heating System?</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Contact us today for a free quote and expert consultation on the perfect furnace for your home.
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
                className="border-2 border-orange-600 text-orange-600 hover:bg-orange-50 text-lg px-8"
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

export default FurnacesShop;
