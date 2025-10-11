import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Snowflake, Shield, Wrench, Clock, Phone, Check, Sparkles, Award, Star, Droplet, Wind, Gauge } from 'lucide-react';

// Stage-based furnace pricing with professional installation - Calgary market rates
const furnaceCards = [
  { 
    stage: "1-Stage", 
    model: "Ducane 92G1UH Series", 
    efficiency: "92% AFUE", 
    installPrice: 6999,
    category: "low",
    features: ["Single-stage heating", "Stainless steel heat exchanger", "10-year parts warranty", "Reliable operation"]
  },
  { 
    stage: "2-Stage", 
    model: "Daikin DM96VC Series", 
    efficiency: "96% AFUE", 
    installPrice: 8499,
    category: "mid",
    features: ["Two-stage heating", "Variable speed blower", "Enhanced comfort control", "15-year parts warranty"]
  },
  { 
    stage: "Variable/Modulating", 
    model: "Lennox SLP98V Series", 
    efficiency: "98% AFUE", 
    installPrice: 11999,
    category: "high",
    popular: true,
    features: ["Variable-speed blower", "Modulating gas valve", "Precise Comfort technology", "20-year heat exchanger warranty"]
  },
];

// Stage-based AC pricing with professional installation - Calgary market rates
const acCards = [
  { 
    stage: "1-Stage", 
    tonnage: "2-5 Ton", 
    model: "Ducane 13ACD Series", 
    seer: "16 SEER", 
    installPrice: 6499,
    category: "low",
    features: ["Single-stage cooling", "R-410A refrigerant", "10-year parts warranty", "Reliable performance"]
  },
  { 
    stage: "2-Stage", 
    tonnage: "2-5 Ton", 
    model: "Daikin DX18TC Series", 
    seer: "18 SEER", 
    installPrice: 7999,
    category: "mid",
    features: ["Two-stage cooling", "Enhanced humidity control", "Quieter operation", "12-year parts warranty"]
  },
  { 
    stage: "Variable Speed", 
    tonnage: "2-5 Ton", 
    model: "Lennox XC25 Series", 
    seer: "26 SEER", 
    installPrice: 11499,
    category: "high",
    popular: true,
    features: ["Variable-speed compressor", "Precise temperature control", "Energy Star certified", "10-year complete unit warranty"]
  },
];

const heatPumpCards = [
  { 
    tonnage: 2.5, 
    model: "Ducane 13HPD Series", 
    hspf: "8.5 HSPF", 
    seer: "14 SEER", 
    installPrice: 8990,
    category: "standard",
    features: ["Heat pump technology", "R-410A refrigerant", "10-year parts warranty", "Year-round comfort"]
  },
  { 
    tonnage: 3, 
    model: "Lennox XP16-036", 
    hspf: "9.0 HSPF", 
    seer: "16 SEER", 
    installPrice: 11490,
    category: "premium",
    popular: true,
    features: ["Two-stage operation", "Enhanced efficiency", "Precise Comfort technology", "Enhanced sound reduction"]
  },
];

const maintenanceCards = [
  {
    name: "Basic Plan",
    price: 1055,
    category: "basic",
    features: ["Annual tune-up", "Basic cleaning", "Safety inspection", "Priority scheduling", "10% discount on repairs"]
  },
  {
    name: "Premium Plan", 
    price: 1755,
    category: "premium",
    popular: true,
    features: ["Bi-annual tune-ups", "Comprehensive cleaning", "Detailed inspection", "Priority emergency service", "15% discount on repairs", "Free filter replacements"]
  },
  {
    name: "Commercial Plan",
    price: 2499,
    category: "commercial", 
    features: ["Quarterly maintenance", "Commercial-grade service", "24/7 emergency support", "Preventive maintenance", "20% discount on all services", "Customized service plan"]
  }
];

const serviceCards = [
  {
    name: "Service Diagnostic",
    price: 149,
    description: "Professional diagnosis of HVAC issues",
    features: ["Complete system inspection", "Detailed report", "Repair recommendations", "No obligation estimate"]
  },
  {
    name: "Duct Cleaning",
    price: 3199,
    description: "Premium air duct cleaning service", 
    features: ["Complete duct system cleaning", "Sanitization treatment", "Before/after photos", "Improved air quality"]
  },
  {
    name: "Thermostat Installation",
    price: 249,
    description: "Smart thermostat installation and setup",
    features: ["Professional installation", "WiFi setup", "Mobile app configuration", "Energy savings optimization"]
  },
  {
    name: "Emergency Service",
    price: 199,
    description: "24/7 emergency HVAC service call",
    urgent: true,
    features: ["24/7 availability", "Same-day service", "Emergency repairs", "Priority response"]
  }
];

// Water tank pricing
const waterTankCards = [
  {
    name: "Standard Electric",
    size: "40-50 Gallon",
    model: "Standard Electric Water Heater",
    installPrice: 2399,
    category: "standard",
    features: ["Electric heating element", "Standard efficiency", "6-year warranty", "Professional installation"]
  },
  {
    name: "High Efficiency Gas",
    size: "40-50 Gallon", 
    model: "High Efficiency Gas Water Heater",
    installPrice: 2899,
    category: "premium",
    popular: true,
    features: ["Natural gas operation", "High efficiency rating", "8-year warranty", "Faster recovery time"]
  },
  {
    name: "Tankless Gas",
    size: "On-Demand",
    model: "Tankless Gas Water Heater",
    installPrice: 4799,
    category: "premium",
    features: ["Endless hot water", "Space-saving design", "High efficiency", "12-year warranty"]
  }
];

// HRV/ERV pricing
const hrvCards = [
  {
    name: "Basic HRV",
    model: "Heat Recovery Ventilator",
    cfm: "100-150 CFM",
    installPrice: 3799,
    category: "standard",
    features: ["Heat recovery", "Fresh air ventilation", "Energy efficient", "Improved air quality"]
  },
  {
    name: "Premium ERV",
    model: "Energy Recovery Ventilator", 
    cfm: "150-200 CFM",
    installPrice: 4999,
    category: "premium",
    popular: true,
    features: ["Heat & moisture recovery", "Advanced controls", "Variable speed", "HEPA filtration"]
  }
];

// Humidifier pricing
const humidifierCards = [
  {
    name: "Bypass Humidifier",
    model: "Whole House Bypass Humidifier",
    coverage: "Up to 4,000 sq ft",
    installPrice: 1299,
    category: "standard",
    features: ["Whole house coverage", "Automatic operation", "Low maintenance", "Professional installation"]
  },
  {
    name: "Steam Humidifier",
    model: "Whole House Steam Humidifier",
    coverage: "Up to 6,000 sq ft",
    installPrice: 2199,
    category: "premium",
    popular: true,
    features: ["Steam technology", "Precise humidity control", "Self-cleaning", "Advanced controls"]
  }
];

export default function PricingCards() {
  const [, setLocation] = useLocation();

  const handleBuyNow = (service: string, amount: number, description: string) => {
    // Check if user is authenticated first
    fetch('/api/user')
      .then(res => {
        if (res.status === 401) {
          // User not authenticated, redirect to login with return URL
          const returnUrl = encodeURIComponent(`/checkout?service=${service}&amount=${amount}&description=${encodeURIComponent(description)}`);
          setLocation(`/auth?returnUrl=${returnUrl}`);
        } else {
          // User is authenticated, proceed to checkout
          const params = new URLSearchParams({
            service,
            amount: amount.toString(),
            description: encodeURIComponent(description)
          });
          setLocation(`/checkout?${params.toString()}`);
        }
      })
      .catch(() => {
        // If there's an error, assume not authenticated
        const returnUrl = encodeURIComponent(`/checkout?service=${service}&amount=${amount}&description=${encodeURIComponent(description)}`);
        setLocation(`/auth?returnUrl=${returnUrl}`);
      });
  };

  return (
    <>
      <Helmet>
        <title>HVAC Equipment Pricing - AfterHours HVAC | Premium HVAC Solutions Calgary</title>
        <meta name="description" content="Professional HVAC equipment pricing including furnaces, air conditioners, heat pumps, and maintenance plans. Starting at $5,999 with professional installation." />
      </Helmet>

      {/* Hero Section - Premium Gradient */}
      <section className="relative min-h-[70vh] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        {/* Premium Badge */}
        <div className="absolute top-8 right-8 z-20">
          <div className="bg-gradient-to-r from-amber-400 to-amber-600 text-white px-6 py-2 rounded-full shadow-xl flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span className="font-semibold text-sm">Transparent Pricing</span>
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-6 pt-24 pb-16">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-white/90 text-sm font-medium">Premium HVAC Solutions</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight">
              Professional HVAC
              <br />
              <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                Equipment Pricing
              </span>
            </h1>

            <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
              Complete HVAC solutions with professional installation, comprehensive warranty coverage, 
              and ongoing support. Upfront pricing with no hidden fees.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-lg px-8 py-6 rounded-xl shadow-2xl shadow-amber-500/50 transition-all hover:scale-105"
                data-testid="button-call"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call (403) 613-6014
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4 py-16">
          {/* Furnace Installation */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-amber-100 text-amber-700 hover:bg-amber-100">
                <Thermometer className="w-3 h-3 mr-1" />
                Heating Systems
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
                Furnace Installation
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                High-efficiency furnaces by heating stage with professional installation
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {furnaceCards.map((furnace, index) => (
                <Card 
                  key={index} 
                  className={`relative rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border-t-4 ${
                    furnace.popular 
                      ? 'border-t-amber-500 bg-gradient-to-b from-amber-50/50 to-white' 
                      : 'border-t-blue-500 bg-white'
                  }`}
                  data-testid={`card-furnace-${index}`}
                >
                  {furnace.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-1 shadow-xl">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pt-8">
                    <div className="mx-auto mb-4">
                      <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${
                        furnace.popular ? 'from-amber-500 to-amber-600' : 'from-blue-500 to-blue-600'
                      } text-white`}>
                        <Thermometer className="w-8 h-8" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-black text-slate-900 mb-2">{furnace.stage}</CardTitle>
                    <CardDescription className="text-sm text-slate-600 font-medium">
                      {furnace.model}
                    </CardDescription>
                    <div className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mt-4">
                      ${furnace.installPrice.toLocaleString()}
                    </div>
                    <Badge variant="outline" className="mt-2 border-amber-200 text-amber-700">
                      {furnace.efficiency}
                    </Badge>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <ul className="space-y-3 mb-8">
                      {furnace.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                          <Check className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full font-bold py-6 rounded-xl shadow-lg transition-all hover:scale-105 ${
                        furnace.popular
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-amber-500/50'
                          : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                      }`}
                      onClick={() => handleBuyNow(
                        'furnace-install',
                        furnace.installPrice,
                        `${furnace.stage} Furnace Installation - ${furnace.model}`
                      )}
                      data-testid={`button-buy-furnace-${index}`}
                    >
                      Buy Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Air Conditioning Installation */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
                <Snowflake className="w-3 h-3 mr-1" />
                Cooling Systems
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
                Air Conditioning Installation
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                High-efficiency air conditioners by cooling stage with professional installation
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {acCards.map((ac, index) => (
                <Card 
                  key={index} 
                  className={`relative rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border-t-4 ${
                    ac.popular 
                      ? 'border-t-amber-500 bg-gradient-to-b from-amber-50/50 to-white' 
                      : 'border-t-blue-500 bg-white'
                  }`}
                  data-testid={`card-ac-${index}`}
                >
                  {ac.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-1 shadow-xl">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pt-8">
                    <div className="mx-auto mb-4">
                      <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${
                        ac.popular ? 'from-amber-500 to-amber-600' : 'from-blue-500 to-cyan-500'
                      } text-white`}>
                        <Snowflake className="w-8 h-8" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-black text-slate-900 mb-2">{ac.stage}</CardTitle>
                    <CardDescription className="text-sm text-slate-600 font-medium">
                      {ac.model} • {ac.tonnage}
                    </CardDescription>
                    <div className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mt-4">
                      ${ac.installPrice.toLocaleString()}
                    </div>
                    <Badge variant="outline" className="mt-2 border-blue-200 text-blue-700">
                      {ac.seer}
                    </Badge>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <ul className="space-y-3 mb-8">
                      {ac.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                          <Check className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full font-bold py-6 rounded-xl shadow-lg transition-all hover:scale-105 ${
                        ac.popular
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-amber-500/50'
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'
                      }`}
                      onClick={() => handleBuyNow(
                        'ac-install',
                        ac.installPrice,
                        `${ac.stage} Air Conditioner Installation - ${ac.model}`
                      )}
                      data-testid={`button-buy-ac-${index}`}
                    >
                      Buy Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Heat Pump Installation */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                <Shield className="w-3 h-3 mr-1" />
                Year-Round Comfort
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
                Heat Pump Installation
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Year-round comfort with efficient heat pump technology
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {heatPumpCards.map((heatPump, index) => (
                <Card 
                  key={index} 
                  className={`relative rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border-t-4 ${
                    heatPump.popular 
                      ? 'border-t-amber-500 bg-gradient-to-b from-amber-50/50 to-white' 
                      : 'border-t-emerald-500 bg-white'
                  }`}
                  data-testid={`card-heatpump-${index}`}
                >
                  {heatPump.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-1 shadow-xl">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pt-8">
                    <div className="mx-auto mb-4">
                      <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${
                        heatPump.popular ? 'from-amber-500 to-amber-600' : 'from-emerald-500 to-teal-500'
                      } text-white`}>
                        <Shield className="w-8 h-8" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-black text-slate-900 mb-2">{heatPump.tonnage} Ton Heat Pump</CardTitle>
                    <CardDescription className="text-sm text-slate-600 font-medium">
                      {heatPump.model}
                    </CardDescription>
                    <div className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mt-4">
                      ${heatPump.installPrice.toLocaleString()}
                    </div>
                    <Badge variant="outline" className="mt-2 border-emerald-200 text-emerald-700">
                      {heatPump.seer} • {heatPump.hspf}
                    </Badge>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <ul className="space-y-3 mb-8">
                      {heatPump.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                          <Check className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full font-bold py-6 rounded-xl shadow-lg transition-all hover:scale-105 ${
                        heatPump.popular
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-amber-500/50'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white'
                      }`}
                      onClick={() => handleBuyNow(
                        'heatpump-install',
                        heatPump.installPrice,
                        `${heatPump.tonnage} Ton Heat Pump Installation - ${heatPump.model}`
                      )}
                      data-testid={`button-buy-heatpump-${index}`}
                    >
                      Buy Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Maintenance Plans */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-100">
                <Wrench className="w-3 h-3 mr-1" />
                Maintenance Services
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
                Maintenance Plans
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Keep your HVAC system running efficiently year-round
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {maintenanceCards.map((plan, index) => (
                <Card 
                  key={index} 
                  className={`relative rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border-t-4 ${
                    plan.popular 
                      ? 'border-t-amber-500 bg-gradient-to-b from-amber-50/50 to-white' 
                      : 'border-t-purple-500 bg-white'
                  }`}
                  data-testid={`card-maintenance-${index}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-1 shadow-xl">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pt-8">
                    <div className="mx-auto mb-4">
                      <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${
                        plan.popular ? 'from-amber-500 to-amber-600' : 'from-purple-500 to-purple-600'
                      } text-white`}>
                        <Wrench className="w-8 h-8" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-black text-slate-900 mb-2">{plan.name}</CardTitle>
                    <div className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mt-4">
                      ${plan.price}
                      <span className="text-xl font-semibold text-slate-500">/year</span>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                          <Check className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full font-bold py-6 rounded-xl shadow-lg transition-all hover:scale-105 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-amber-500/50'
                          : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white'
                      }`}
                      onClick={() => handleBuyNow(
                        `maintenance-${plan.category}`,
                        plan.price,
                        `${plan.name} - Annual Maintenance Plan`
                      )}
                      data-testid={`button-buy-maintenance-${index}`}
                    >
                      Choose Plan
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Additional Services */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-indigo-100 text-indigo-700 hover:bg-indigo-100">
                <Clock className="w-3 h-3 mr-1" />
                Additional Services
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
                Professional Services
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Expert HVAC services and emergency support
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {serviceCards.map((service, index) => (
                <Card 
                  key={index} 
                  className={`relative rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border-t-4 ${
                    service.urgent 
                      ? 'border-t-amber-500 bg-gradient-to-b from-amber-50/50 to-white' 
                      : 'border-t-indigo-500 bg-white'
                  }`}
                  data-testid={`card-service-${index}`}
                >
                  {service.urgent && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-1 shadow-xl">
                        <Clock className="w-3 h-3 mr-1" />
                        24/7
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pt-8">
                    <div className="mx-auto mb-4">
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${
                        service.urgent ? 'from-amber-500 to-amber-600' : 'from-indigo-500 to-indigo-600'
                      } text-white`}>
                        <Clock className="w-6 h-6" />
                      </div>
                    </div>
                    <CardTitle className="text-lg font-black text-slate-900 mb-2">{service.name}</CardTitle>
                    <div className="text-3xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      ${service.price}
                    </div>
                    <CardDescription className="text-xs text-slate-600 font-medium mt-2">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all hover:scale-105 ${
                        service.urgent
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-amber-500/50'
                          : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white'
                      }`}
                      onClick={() => handleBuyNow(
                        service.name.toLowerCase().replace(/\s+/g, '-'),
                        service.price,
                        service.name
                      )}
                      data-testid={`button-buy-service-${index}`}
                    >
                      {service.urgent ? 'Emergency Call' : 'Book Service'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Water Tank Installation */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-cyan-100 text-cyan-700 hover:bg-cyan-100">
                <Droplet className="w-3 h-3 mr-1" />
                Water Heating
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
                Water Heater Installation
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Efficient water heating solutions for your home
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {waterTankCards.map((tank, index) => (
                <Card 
                  key={index} 
                  className={`relative rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border-t-4 ${
                    tank.popular 
                      ? 'border-t-amber-500 bg-gradient-to-b from-amber-50/50 to-white' 
                      : 'border-t-cyan-500 bg-white'
                  }`}
                  data-testid={`card-watertank-${index}`}
                >
                  {tank.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-1 shadow-xl">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pt-8">
                    <div className="mx-auto mb-4">
                      <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${
                        tank.popular ? 'from-amber-500 to-amber-600' : 'from-cyan-500 to-cyan-600'
                      } text-white`}>
                        <Droplet className="w-8 h-8" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-black text-slate-900 mb-2">{tank.name}</CardTitle>
                    <CardDescription className="text-sm text-slate-600 font-medium">
                      {tank.size}
                    </CardDescription>
                    <div className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mt-4">
                      ${tank.installPrice.toLocaleString()}
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <ul className="space-y-3 mb-8">
                      {tank.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                          <Check className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full font-bold py-6 rounded-xl shadow-lg transition-all hover:scale-105 ${
                        tank.popular
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-amber-500/50'
                          : 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white'
                      }`}
                      onClick={() => handleBuyNow(
                        'watertank-install',
                        tank.installPrice,
                        `${tank.name} Installation - ${tank.size}`
                      )}
                      data-testid={`button-buy-watertank-${index}`}
                    >
                      Buy Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* HRV/ERV Installation */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-teal-100 text-teal-700 hover:bg-teal-100">
                <Wind className="w-3 h-3 mr-1" />
                Ventilation
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
                HRV/ERV Installation
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Energy recovery ventilation for fresh, healthy air
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {hrvCards.map((hrv, index) => (
                <Card 
                  key={index} 
                  className={`relative rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border-t-4 ${
                    hrv.popular 
                      ? 'border-t-amber-500 bg-gradient-to-b from-amber-50/50 to-white' 
                      : 'border-t-teal-500 bg-white'
                  }`}
                  data-testid={`card-hrv-${index}`}
                >
                  {hrv.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-1 shadow-xl">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pt-8">
                    <div className="mx-auto mb-4">
                      <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${
                        hrv.popular ? 'from-amber-500 to-amber-600' : 'from-teal-500 to-teal-600'
                      } text-white`}>
                        <Wind className="w-8 h-8" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-black text-slate-900 mb-2">{hrv.name}</CardTitle>
                    <CardDescription className="text-sm text-slate-600 font-medium">
                      {hrv.model} • {hrv.cfm}
                    </CardDescription>
                    <div className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mt-4">
                      ${hrv.installPrice.toLocaleString()}
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <ul className="space-y-3 mb-8">
                      {hrv.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                          <Check className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full font-bold py-6 rounded-xl shadow-lg transition-all hover:scale-105 ${
                        hrv.popular
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-amber-500/50'
                          : 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white'
                      }`}
                      onClick={() => handleBuyNow(
                        'hrv-install',
                        hrv.installPrice,
                        `${hrv.name} Installation - ${hrv.model}`
                      )}
                      data-testid={`button-buy-hrv-${index}`}
                    >
                      Buy Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Humidifier Installation */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-sky-100 text-sky-700 hover:bg-sky-100">
                <Gauge className="w-3 h-3 mr-1" />
                Humidity Control
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
                Humidifier Installation
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Whole-home humidification for comfortable living
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {humidifierCards.map((humidifier, index) => (
                <Card 
                  key={index} 
                  className={`relative rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border-t-4 ${
                    humidifier.popular 
                      ? 'border-t-amber-500 bg-gradient-to-b from-amber-50/50 to-white' 
                      : 'border-t-sky-500 bg-white'
                  }`}
                  data-testid={`card-humidifier-${index}`}
                >
                  {humidifier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-1 shadow-xl">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pt-8">
                    <div className="mx-auto mb-4">
                      <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${
                        humidifier.popular ? 'from-amber-500 to-amber-600' : 'from-sky-500 to-sky-600'
                      } text-white`}>
                        <Gauge className="w-8 h-8" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-black text-slate-900 mb-2">{humidifier.name}</CardTitle>
                    <CardDescription className="text-sm text-slate-600 font-medium">
                      {humidifier.coverage}
                    </CardDescription>
                    <div className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mt-4">
                      ${humidifier.installPrice.toLocaleString()}
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <ul className="space-y-3 mb-8">
                      {humidifier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                          <Check className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full font-bold py-6 rounded-xl shadow-lg transition-all hover:scale-105 ${
                        humidifier.popular
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-amber-500/50'
                          : 'bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white'
                      }`}
                      onClick={() => handleBuyNow(
                        'humidifier-install',
                        humidifier.installPrice,
                        `${humidifier.name} Installation`
                      )}
                      data-testid={`button-buy-humidifier-${index}`}
                    >
                      Buy Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* CTA Section - Premium */}
      <section className="py-20 bg-gradient-to-r from-amber-500 to-amber-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
            Ready to Upgrade Your Comfort?
          </h2>
          <p className="text-xl text-amber-50 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied Calgary homeowners who trust us for premium HVAC solutions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-amber-600 hover:bg-amber-50 font-bold text-lg px-8 py-6 rounded-xl shadow-2xl transition-all hover:scale-105"
              data-testid="button-cta-call"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call (403) 613-6014
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}