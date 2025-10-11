import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Droplets, Star, Award, Shield, Zap, CheckCircle, ArrowRight, ShoppingCart, Clock, Sparkles, Phone } from 'lucide-react';
import { Link } from 'wouter';

const WaterHeatersShop = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const waterHeaterModels = [
    {
      id: 1,
      name: "Power Vented Gas Water Heater",
      category: "tank",
      capacity: "40 Gallon",
      priceRange: "2300 - 3200",
      price: 2300,
      image: "/api/placeholder/300/200",
      features: [
        "Power vented for safety",
        "Side-wall venting capability",
        "Energy efficient operation",
        "Standard tank installation",
        "Connection to existing lines"
      ],
      specs: {
        capacity: "40-50 Gallons",
        recovery: "Fast recovery rate",
        warranty: "6-8 years tank warranty"
      },
      badge: "Standard",
      popular: true,
      description: "Modern standard for safety and reliability with flexible installation"
    },
    {
      id: 2,
      name: "Tankless On-Demand Gas Water Heater",
      category: "tankless",
      capacity: "Unlimited",
      priceRange: "4500 - 6500+",
      price: 4500,
      image: "/api/placeholder/300/200",
      features: [
        "Instant hot water on-demand",
        "Endless hot water supply",
        "Significant energy savings",
        "Compact wall-mounted design",
        "Advanced digital controls"
      ],
      specs: {
        capacity: "Unlimited flow",
        recovery: "Instant heating",
        warranty: "10-15 years warranty"
      },
      badge: "Premium",
      popular: false,
      description: "Heats water instantly with endless supply and energy savings"
    }
  ];

  const filteredHeaters = selectedCategory === 'all' 
    ? waterHeaterModels 
    : waterHeaterModels.filter(heater => heater.category === selectedCategory);

  return (
    <>
      <Helmet>
        <title>Gas Water Heaters - Calgary Installation Service | AfterHours HVAC</title>
        <meta name="description" content="Shop power vented tank and tankless gas water heaters with professional installation. Energy efficient hot water solutions for Calgary homes." />
      </Helmet>

      {/* Hero Section - Premium Blue/Teal Gradient */}
      <section className="relative min-h-[80vh] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '700ms' }}></div>
        </div>

        {/* Premium Badge */}
        <div className="absolute top-8 right-8 z-20">
          <div className="bg-gradient-to-r from-amber-400 to-amber-600 text-white px-6 py-2 rounded-full shadow-xl flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span className="font-semibold text-sm">Premium Water Solutions</span>
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-6 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Droplets className="w-4 h-4 text-blue-400" />
                <span className="text-white/90 text-sm font-medium">Professional Installation Included</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight">
                Gas Water
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-teal-500 bg-clip-text text-transparent">
                  Heaters
                </span>
              </h1>
              
              <p className="text-xl text-blue-100 max-w-xl leading-relaxed">
                Reliable hot water solutions for Calgary homes. Choose from efficient tank or space-saving tankless models with expert installation.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                  data-testid="button-shop-now"
                  asChild
                >
                  <a href="#water-heater-models">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Shop Water Heaters
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
                  <span className="text-sm font-medium">Licensed Gas Fitters</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Award className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-medium">Up to 15 Year Warranties</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Star className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-medium">5-Star Rated</span>
                </div>
              </div>
            </div>

            {/* Right Side - Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
                <div className="text-4xl font-black text-white mb-2">40-50</div>
                <div className="text-blue-200 text-sm">Gallon Tanks</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
                <div className="text-4xl font-black text-white mb-2">∞</div>
                <div className="text-blue-200 text-sm">Tankless Flow</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
                <div className="text-4xl font-black text-white mb-2">24/7</div>
                <div className="text-blue-200 text-sm">Support</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
                <div className="text-4xl font-black text-white mb-2">$2,300</div>
                <div className="text-blue-200 text-sm">Starting Price</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Section */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-blue-50" id="water-heater-models">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Choose Your <span className="bg-gradient-to-r from-blue-500 to-teal-600 bg-clip-text text-transparent">Water Heater</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From reliable tank models to space-saving tankless systems, find the perfect hot water solution.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-white rounded-2xl shadow-xl p-2 gap-2">
              <Button
                onClick={() => setSelectedCategory('all')}
                className={selectedCategory === 'all' 
                  ? 'bg-gradient-to-r from-blue-500 to-teal-600 text-white shadow-lg' 
                  : 'bg-transparent text-gray-700 hover:bg-gray-100'}
                data-testid="filter-all"
              >
                <Star className="w-4 h-4 mr-2" />
                All Models
              </Button>
              <Button
                onClick={() => setSelectedCategory('tank')}
                className={selectedCategory === 'tank' 
                  ? 'bg-gradient-to-r from-blue-500 to-teal-600 text-white shadow-lg' 
                  : 'bg-transparent text-gray-700 hover:bg-gray-100'}
                data-testid="filter-tank"
              >
                Tank Models
              </Button>
              <Button
                onClick={() => setSelectedCategory('tankless')}
                className={selectedCategory === 'tankless' 
                  ? 'bg-gradient-to-r from-blue-500 to-teal-600 text-white shadow-lg' 
                  : 'bg-transparent text-gray-700 hover:bg-gray-100'}
                data-testid="filter-tankless"
              >
                Tankless
              </Button>
            </div>
          </div>

          {/* Water Heater Models Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {filteredHeaters.map((heater) => (
              <Card 
                key={heater.id} 
                className={`relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 ${
                  heater.popular ? 'ring-2 ring-amber-500' : ''
                }`}
                data-testid={`card-heater-${heater.id}`}
              >
                {heater.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 shadow-lg">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {heater.badge}
                    </Badge>
                  </div>
                )}
                {!heater.popular && heater.badge && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge variant="secondary" className="shadow-md" data-testid={`badge-${heater.id}`}>
                      {heater.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="bg-gradient-to-br from-blue-50 to-teal-50 pb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-teal-600 rounded-xl">
                      <Droplets className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="outline" className="border-blue-300 text-blue-700" data-testid={`capacity-${heater.id}`}>
                      {heater.capacity}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl font-black text-gray-900" data-testid={`title-${heater.id}`}>
                    {heater.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-2" data-testid={`description-${heater.id}`}>
                    {heater.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-6 space-y-6">
                  {/* Price */}
                  <div className="text-center py-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                    <div className="text-4xl font-black text-gray-900" data-testid={`price-${heater.id}`}>
                      ${heater.priceRange}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Installed</div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    {heater.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700" data-testid={`feature-${heater.id}-${index}`}>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Specs */}
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Capacity:</span>
                      <span className="font-semibold text-gray-900" data-testid={`spec-capacity-${heater.id}`}>{heater.specs.capacity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Recovery:</span>
                      <span className="font-semibold text-gray-900" data-testid={`spec-recovery-${heater.id}`}>{heater.specs.recovery}</span>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:scale-105 transition-all"
                      data-testid={`button-quote-${heater.id}`}
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
                      data-testid={`button-call-${heater.id}`}
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

      {/* Comparison Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-gray-900 mb-4">
                Tank vs <span className="bg-gradient-to-r from-blue-500 to-teal-600 bg-clip-text text-transparent">Tankless Comparison</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Choose the right water heater for your home's needs
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-black text-blue-700 mb-6">Tank Water Heaters</h3>
                <div className="space-y-4">
                  {[
                    { text: "Lower upfront cost", positive: true },
                    { text: "Simpler installation", positive: true },
                    { text: "Familiar technology", positive: true },
                    { text: "Limited hot water capacity", positive: false }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {item.positive ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <Clock className="w-6 h-6 text-orange-500" />
                      )}
                      <span className="text-lg">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-black text-teal-700 mb-6">Tankless Water Heaters</h3>
                <div className="space-y-4">
                  {[
                    { text: "Endless hot water supply", positive: true },
                    { text: "Space-saving design", positive: true },
                    { text: "Energy efficient operation", positive: true },
                    { text: "Higher installation cost", positive: false }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {item.positive ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <Clock className="w-6 h-6 text-orange-500" />
                      )}
                      <span className="text-lg">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">
              Professional Water Heater Installation
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Expert installation for reliable, safe operation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: Shield,
                title: "Licensed Gas Fitters",
                description: "Certified professionals ensuring code-compliant installation"
              },
              {
                icon: Award,
                title: "Extended Warranties",
                description: "Comprehensive warranties protecting your investment"
              },
              {
                icon: Zap,
                title: "Energy Efficiency",
                description: "Proper installation maximizes efficiency and savings"
              }
            ].map((item, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-all">
                <div className="inline-flex p-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl mb-4">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-blue-100">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Need Reliable <span className="bg-gradient-to-r from-blue-500 to-teal-600 bg-clip-text text-transparent">Hot Water?</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Contact us today for expert advice on the perfect water heater for your home.
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
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-lg px-8"
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

export default WaterHeatersShop;
