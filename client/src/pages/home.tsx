import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Thermometer, 
  Snowflake, 
  Wrench, 
  Clock, 
  Shield, 
  CheckCircle, 
  Star,
  Phone,
  Droplets,
  MapPin,
  Calendar,
  ArrowRight,
  Award,
  Brain,
  Calculator,
  Zap,
  Users,
  Heart,
  ThermometerSun,
  Wind,
  Settings,
  TrendingUp
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import CertificationLogos from "@/components/CertificationLogos";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch carousel images
  interface CarouselImage {
    id: number;
    title: string;
    imageUrl: string;
    description?: string;
  }
  
  const { data: carouselImages = [] } = useQuery<CarouselImage[]>({
    queryKey: ["/api/carousel"],
  });

  // Fetch services
  const { data: services = [] } = useQuery({
    queryKey: ["/api/gallery/services"],
  });

  // Auto-rotate carousel
  useEffect(() => {
    if (carouselImages && carouselImages.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [carouselImages]);

  const stats = [
    { number: "2000+", label: "Happy Customers", icon: Users },
    { number: "15+", label: "Years Experience", icon: Award },
    { number: "24/7", label: "Emergency Service", icon: Clock },
    { number: "100%", label: "Satisfaction Rate", icon: Heart }
  ];

  const equipmentCategories = [
    {
      icon: ThermometerSun,
      title: "High-Efficiency Furnaces",
      description: "Shop premium Ducane and Lennox furnaces with single stage, two stage, and modulating controls",
      features: ["Starting at $5,999", "10-Year Warranty", "Professional Installation"],
      link: "/shop/furnaces",
      badge: "Most Popular"
    },
    {
      icon: Snowflake,
      title: "Central Air Conditioning",
      description: "Complete AC systems with variable speed technology and smart controls",
      features: ["Starting at $5,999", "Up to 28 SEER", "Professional Installation"],
      link: "/shop/air-conditioning",
      badge: "Summer Ready"
    },
    {
      icon: Droplets,
      title: "Gas Water Heaters",
      description: "Power vented tank and tankless models for reliable hot water supply",
      features: ["Starting at $2,300", "Tank & Tankless Options", "Professional Installation"],
      link: "/shop/water-heaters",
      badge: "Essential"
    },
    {
      icon: Settings,
      title: "Maintenance Plans",
      description: "From quick diagnostics to comprehensive care plans with emergency coverage",
      features: ["Starting at $199", "Residential & Commercial", "Emergency Response"],
      link: "/shop/maintenance-plans",
      badge: "Complete Care"
    }
  ];

  const features = [
    "Licensed & Insured Technicians",
    "24/7 Emergency Service Available",
    "Free Estimates on New Installations",
    "Warranty on All Work Performed",
    "Energy-Efficient Solutions",
    "Serving Calgary & Surrounding Areas"
  ];

  return (
    <>
      <Helmet>
        <title>Professional HVAC Services Calgary | AfterHours HVAC</title>
        <meta name="description" content="Calgary's trusted HVAC experts providing furnace installation, AC repair, duct cleaning, and emergency services. Licensed, insured, and available 24/7." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section with Carousel */}
        <section className="relative hvac-gradient-hero overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          
          {/* Carousel Background */}
          {carouselImages && carouselImages.length > 0 && (
            <div className="absolute inset-0">
              {carouselImages.map((image: any, index: number) => (
                <div
                  key={image.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentSlide ? "opacity-30" : "opacity-0"
                  }`}
                >
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="relative hvac-container py-24 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-white space-y-8 fade-in">
                <div className="space-y-4">
                  <Badge className="bg-orange-500 text-white px-4 py-2 text-sm font-semibold">
                    Calgary's #1 HVAC Experts
                  </Badge>
                  <h1 className="hvac-heading-xl">
                    Professional HVAC Solutions for Your Home
                  </h1>
                  <p className="text-xl text-blue-100 leading-relaxed">
                    Expert heating, cooling, and ventilation services with 24/7 emergency support. 
                    Licensed technicians, quality workmanship, and customer satisfaction guaranteed.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="hvac-button-secondary text-lg px-8 py-4" data-testid="button-call-hero">
                    <Phone className="w-5 h-5 mr-2" />
                    Call (403) 613-6014
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-900 text-lg px-8 py-4"
                    asChild
                    data-testid="button-schedule-hero"
                  >
                    <Link href="/contact">
                      <Calendar className="w-5 h-5 mr-2" />
                      Schedule Service
                    </Link>
                  </Button>
                </div>

                <div className="flex items-center space-x-6 pt-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-blue-100">5.0 Rating • 500+ Reviews</span>
                </div>
              </div>

              <div className="lg:justify-self-end slide-up">
                <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Get Free Estimate</h3>
                  <form className="space-y-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="hvac-input"
                      data-testid="input-name-estimate"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="hvac-input"
                      data-testid="input-phone-estimate"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="hvac-input"
                      data-testid="input-email-estimate"
                    />
                    <select className="hvac-input" data-testid="select-service-estimate">
                      <option>Select Service</option>
                      <option>Furnace Installation</option>
                      <option>AC Repair</option>
                      <option>Duct Cleaning</option>
                      <option>Emergency Service</option>
                    </select>
                    <Button className="w-full hvac-button-primary text-lg py-3" data-testid="button-submit-estimate">
                      Get My Free Quote
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Indicators */}
          {carouselImages && carouselImages.length > 1 && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {carouselImages.map((_: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? "bg-white" : "bg-white/40"
                  }`}
                  data-testid={`button-carousel-${index}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </section>

        {/* Stats Section */}
        <section className="hvac-section bg-white">
          <div className="hvac-container">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card group hover:scale-105 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-3 group-hover:text-orange-500 transition-colors" />
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Equipment Shopping Section */}
        <section className="hvac-section">
          <div className="hvac-container">
            <div className="text-center mb-16">
              <h2 className="hvac-heading-lg mb-4">Shop Premium HVAC Equipment</h2>
              <p className="hvac-text-lg max-w-3xl mx-auto">
                Browse our selection of high-efficiency Ducane equipment with professional installation included. 
                Choose from single stage, two stage, modulating, and communicating systems.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {equipmentCategories.map((category, index) => (
                <Card key={index} className="service-card border-0 bg-white shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                  {category.badge && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                      {category.badge}
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <category.icon className="service-card-icon mx-auto" />
                    <CardTitle className="text-xl font-bold text-gray-900">{category.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 mb-4 leading-relaxed">
                      {category.description}
                    </CardDescription>
                    <ul className="space-y-2 mb-6">
                      {category.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="w-full hvac-button-primary" data-testid={`button-shop-${category.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <Link href={category.link}>
                        Shop Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* AI Tools Section - Updated */}
        <section className="hvac-section bg-gradient-to-br from-blue-900 via-slate-900 to-blue-900" id="ai-tools">
          <div className="hvac-container">
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-amber-500/20 border border-amber-500/50 rounded-full px-6 py-2 mb-6">
                <Zap className="w-5 h-5 text-amber-400 mr-2" />
                <span className="text-amber-300 font-semibold">AI-Powered Tools</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
                Advanced HVAC <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Diagnostics</span>
              </h2>
              <p className="text-xl text-blue-200 max-w-3xl mx-auto">
                Get instant professional diagnostics with our AI-powered tools. Save time and money with accurate problem identification.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">AI Symptom Diagnoser</h3>
                <p className="text-blue-200 mb-6">
                  Describe your HVAC problem and get instant AI-powered diagnosis with repair recommendations.
                </p>
                <Link href="/tools/ai-symptom-diagnoser">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 transition-all">
                    Try AI Diagnosis
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Calculator className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Alberta Rebate Calculator</h3>
                <p className="text-blue-200 mb-6">
                  Calculate available government rebates for energy-efficient HVAC upgrades in Alberta.
                </p>
                <Link href="/tools/alberta-rebate-calculator">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 transition-all">
                    Check Rebates
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 group md:col-span-2 lg:col-span-1">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Wrench className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Pro Calculator</h3>
                <p className="text-blue-200 mb-6">
                  Professional material estimation with real-time pricing for contractors and homeowners.
                </p>
                <Link href="/pro-calculator">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 transition-all">
                    Access Pro Tools
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="hvac-section bg-white">
          <div className="hvac-container">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div>
                  <h2 className="hvac-heading-lg mb-4">Why Choose AfterHours HVAC?</h2>
                  <p className="hvac-text-lg">
                    With over 15 years of experience serving Calgary, we're your trusted partner 
                    for all heating and cooling needs. Our commitment to excellence sets us apart.
                  </p>
                </div>

                <div className="feature-list">
                  {features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <CheckCircle className="feature-check" />
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="hvac-button-primary" asChild data-testid="button-learn-more">
                    <Link href="/about">Learn More About Us</Link>
                  </Button>
                  <Button variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white" asChild data-testid="button-get-in-touch">
                    <Link href="/contact">Get In Touch</Link>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="pro-card">
                    <Shield className="w-8 h-8 text-blue-600 mb-3" />
                    <h4 className="font-bold text-gray-900 mb-2">Licensed & Insured</h4>
                    <p className="text-sm text-gray-600">Fully certified technicians with comprehensive insurance coverage</p>
                  </div>
                  <div className="emergency-card">
                    <Clock className="w-8 h-8 text-red-600 mb-3" />
                    <h4 className="font-bold text-gray-900 mb-2">24/7 Emergency</h4>
                    <p className="text-sm text-gray-600">Round-the-clock emergency HVAC services when you need us most</p>
                  </div>
                </div>
                <div className="space-y-6 pt-8">
                  <div className="success-card">
                    <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
                    <h4 className="font-bold text-gray-900 mb-2">Energy Efficient</h4>
                    <p className="text-sm text-gray-600">Modern solutions that reduce energy costs and environmental impact</p>
                  </div>
                  <div className="hvac-card">
                    <Zap className="w-8 h-8 text-orange-500 mb-3" />
                    <h4 className="font-bold text-gray-900 mb-2">Fast Response</h4>
                    <p className="text-sm text-gray-600">Quick response times with same-day service availability</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Emergency CTA Section */}
        <section className="hvac-section hvac-gradient-hero">
          <div className="hvac-container text-center">
            <div className="max-w-4xl mx-auto text-white space-y-8">
              <h2 className="text-3xl lg:text-4xl font-bold">Need Emergency HVAC Service?</h2>
              <p className="text-xl text-blue-100">
                Don't let heating or cooling problems disrupt your comfort. Our emergency team is standing by 24/7 
                to restore your system quickly and efficiently.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="hvac-button-secondary text-lg px-8 py-4" data-testid="button-emergency-call">
                  <Phone className="w-5 h-5 mr-2" />
                  Emergency: (403) 613-6014
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-900 text-lg px-8 py-4"
                  asChild
                  data-testid="button-request-emergency"
                >
                  <Link href="/emergency">
                    <Wrench className="w-5 h-5 mr-2" />
                    Request Emergency Service
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Certifications Section */}
        <CertificationLogos />

        {/* Service Areas Section */}
        <section className="hvac-section bg-gray-50">
          <div className="hvac-container text-center">
            <h2 className="hvac-heading-lg mb-8">Proudly Serving Calgary & Area</h2>
            <div className="flex items-center justify-center mb-8">
              <MapPin className="w-6 h-6 text-blue-600 mr-2" />
              <span className="text-lg text-gray-700">Professional HVAC Services Across the Region</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
              {["Calgary", "Airdrie", "Okotoks", "Cochrane", "Canmore", "Strathmore", "High River", "Chestermere", "Red Deer", "Medicine Hat", "Lethbridge", "Camrose"].map((city) => (
                <div key={city} className="bg-white rounded-2xl px-6 py-4 text-gray-800 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  {city}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;