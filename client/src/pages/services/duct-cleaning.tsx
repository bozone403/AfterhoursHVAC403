import { useState } from 'react';
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Mail, 
  CheckCircle, 
  Star,
  Clock,
  Shield,
  Wind,
  Leaf,
  Home,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShoppingCart
} from "lucide-react";
import { Link } from "wouter";
import { ServiceBookingModal } from '@/components/ServiceBookingModal';

export default function DuctCleaning() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  const handleBookService = () => {
    setSelectedService({
      name: 'Professional Duct Cleaning',
      price: 499,
      description: 'Complete HVAC duct cleaning service for your home',
      category: 'Duct Cleaning Service'
    });
    setBookingModalOpen(true);
  };
  const benefits = [
    {
      icon: Wind,
      title: "Improved Air Quality",
      description: "Remove dust, allergens, and contaminants for cleaner, healthier air."
    },
    {
      icon: Leaf,
      title: "Better Energy Efficiency",
      description: "Clean ducts allow your HVAC system to operate more efficiently."
    },
    {
      icon: Shield,
      title: "Reduced Allergies",
      description: "Eliminate allergens and irritants that trigger respiratory issues."
    },
    {
      icon: Home,
      title: "Odor Elimination",
      description: "Remove musty odors and improve overall indoor air freshness."
    }
  ];

  const cleaningProcess = [
    "Initial System Inspection",
    "Pre-Cleaning Air Quality Test",
    "Negative Pressure Setup",
    "Comprehensive Duct Cleaning",
    "Sanitization Treatment",
    "Final Quality Inspection"
  ];

  const warningSignsData = [
    "Visible dust around vents",
    "Musty or stale odors",
    "Increased allergy symptoms",
    "Higher energy bills",
    "Inconsistent room temperatures",
    "Excessive dust accumulation"
  ];

  return (
    <>
      <Helmet>
        <title>Professional Duct Cleaning Calgary | AfterHours HVAC Solutions</title>
        <meta name="description" content="Professional duct cleaning services in Calgary. Improve air quality, reduce allergies, increase energy efficiency. Licensed technicians, satisfaction guaranteed." />
      </Helmet>

      {/* Hero Section - Premium */}
      <section className="relative min-h-[80vh] bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-white/90 text-sm font-medium">Health & Efficiency</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight">
                Professional Duct
                <br />
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Cleaning
                </span>
              </h1>

              <p className="text-xl text-blue-100">
                Breathe easier with our comprehensive duct cleaning services. We remove dust, allergens, 
                and contaminants to improve your indoor air quality and HVAC efficiency.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={handleBookService}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-lg px-8 py-6 rounded-xl shadow-2xl shadow-amber-500/50 transition-all hover:scale-105"
                  data-testid="button-book"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Book Duct Cleaning
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white hover:text-slate-900 font-bold text-lg px-8 py-6 rounded-xl transition-all hover:scale-105"
                  asChild
                  data-testid="button-call"
                >
                  <a href="tel:4036136014">
                    <Phone className="w-5 h-5 mr-2" />
                    Call (403) 613-6014
                  </a>
                </Button>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-xl">
              <Wind className="w-16 h-16 text-cyan-400 mb-4" />
              <h3 className="text-2xl font-black text-white mb-4">Why Clean Your Ducts?</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-white">
                  <CheckCircle className="w-5 h-5 text-cyan-400 mr-3 flex-shrink-0" />
                  <span>Improve indoor air quality</span>
                </li>
                <li className="flex items-center text-white">
                  <CheckCircle className="w-5 h-5 text-cyan-400 mr-3 flex-shrink-0" />
                  <span>Reduce energy costs by up to 20%</span>
                </li>
                <li className="flex items-center text-white">
                  <CheckCircle className="w-5 h-5 text-cyan-400 mr-3 flex-shrink-0" />
                  <span>Eliminate allergens and odors</span>
                </li>
                <li className="flex items-center text-white">
                  <CheckCircle className="w-5 h-5 text-cyan-400 mr-3 flex-shrink-0" />
                  <span>Extend HVAC system lifespan</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-cyan-500 text-white mb-4">
              <Star className="w-3 h-3 mr-1" />
              Clean Air Benefits
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
              Benefits of Professional Duct Cleaning
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Clean ducts are essential for healthy indoor air and efficient HVAC operation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-8 text-center shadow-xl border-2 border-slate-200 hover:border-cyan-500 transition-all hover:scale-105"
                data-testid={`card-benefit-${index}`}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">{benefit.title}</h3>
                <p className="text-slate-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Warning Signs */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-amber-900 to-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/50 mb-4">
              <AlertCircle className="w-3 h-3 mr-1" />
              Warning Signs
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              Signs Your Ducts Need Cleaning
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Don't ignore these warning signs that indicate your ducts need professional attention.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {warningSignsData.map((sign, index) => (
              <div 
                key={index} 
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all hover:scale-105 shadow-xl"
                data-testid={`warning-sign-${index}`}
              >
                <div className="flex items-start">
                  <AlertCircle className="w-6 h-6 text-amber-400 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="font-bold text-white">{sign}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cleaning Process */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-cyan-500 text-white mb-4">
              <Shield className="w-3 h-3 mr-1" />
              Professional Process
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
              Our Professional Cleaning Process
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We follow industry best practices to ensure thorough and effective duct cleaning.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            {cleaningProcess.map((step, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-8 text-center shadow-xl border-2 border-slate-200 hover:border-cyan-500 transition-all hover:scale-105"
                data-testid={`process-step-${index}`}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 font-black text-2xl shadow-lg">
                  {index + 1}
                </div>
                <h3 className="font-black text-slate-900 text-lg">{step}</h3>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-8 text-center shadow-2xl">
              <h3 className="text-2xl font-black text-white mb-3">
                Complete Service Package
              </h3>
              <p className="text-white/90 mb-6 text-lg">
                Our comprehensive duct cleaning service includes supply and return ducts, main trunk lines, 
                grilles, registers, and HVAC unit cleaning.
              </p>
              <div className="text-5xl font-black text-white mb-6">
                Starting at $3,199
              </div>
              <div className="space-y-4">
                <Button 
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg px-8 py-6 rounded-xl shadow-2xl shadow-green-500/50 transition-all hover:scale-105"
                  onClick={() => {
                    const serviceData = {
                      name: "Complete Duct Cleaning Service",
                      price: "$3,199",
                      description: "Comprehensive duct cleaning including supply/return ducts, trunk lines, grilles, and HVAC unit cleaning",
                      category: 'duct-cleaning'
                    };
                    window.location.href = `/checkout?service=${encodeURIComponent(JSON.stringify(serviceData))}`;
                  }}
                >
                  Book Now - $3,199
                </Button>
                <Button 
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-lg px-8 py-6 rounded-xl shadow-2xl shadow-amber-500/50 transition-all hover:scale-105" 
                  asChild
                  data-testid="button-schedule-service"
                >
                  <Link href="/quote">
                    Get Custom Quote
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
            Ready to Breathe Cleaner Air?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Schedule your professional duct cleaning service today and experience the difference clean ducts make.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-lg px-8 py-6 rounded-xl shadow-2xl shadow-amber-500/50 transition-all hover:scale-105"
              data-testid="button-cta-call"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call (403) 613-6014
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white hover:text-slate-900 font-bold text-lg px-8 py-6 rounded-xl transition-all hover:scale-105"
              data-testid="button-cta-email"
            >
              <Mail className="w-5 h-5 mr-2" />
              Email Jordan@Afterhourshvac.ca
            </Button>
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
}
