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
  Wrench,
  ThermometerSun,
  Zap,
  Award,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Link } from "wouter";

export default function FurnaceInstallation() {
  const furnaceTypes = [
    {
      name: "1-Stage Gas Furnaces",
      efficiency: "92% AFUE",
      features: ["Single-stage heating", "Stainless steel heat exchanger", "10-year parts warranty", "Reliable operation"],
      startingPrice: "$6,999",
      color: "from-orange-500 to-red-500"
    },
    {
      name: "2-Stage Gas Furnaces",
      efficiency: "96% AFUE",
      features: ["Two-stage heating", "Variable speed blower", "Enhanced comfort control", "15-year parts warranty"],
      startingPrice: "$8,499",
      color: "from-amber-500 to-orange-500",
      popular: true
    },
    {
      name: "Variable/Modulating Furnaces",
      efficiency: "98% AFUE",
      features: ["Variable-speed blower", "Modulating gas valve", "Precise Comfort technology", "20-year heat exchanger warranty"],
      startingPrice: "$11,999",
      color: "from-blue-500 to-cyan-500"
    }
  ];

  const installationProcess = [
    { step: "Free In-Home Assessment", description: "Comprehensive evaluation of your heating needs" },
    { step: "Custom System Design", description: "Tailored solution for your home" },
    { step: "Professional Installation", description: "Expert installation by certified technicians" },
    { step: "System Testing & Commissioning", description: "Thorough testing for optimal performance" },
    { step: "Customer Training", description: "Complete walkthrough of your new system" },
    { step: "Warranty Registration", description: "Full warranty activation and support" }
  ];

  return (
    <>
      <Helmet>
        <title>Furnace Installation Calgary | AfterHours HVAC Solutions</title>
        <meta name="description" content="Professional furnace installation services in Calgary. High-efficiency gas, electric, and oil furnaces. Free estimates, expert installation, 10-year warranties." />
      </Helmet>

      {/* Hero Section - Premium */}
      <section className="relative min-h-[80vh] bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <ThermometerSun className="w-4 h-4 text-amber-400" />
                <span className="text-white/90 text-sm font-medium">Professional Installation</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight">
                Expert Furnace
                <br />
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  Installation
                </span>
              </h1>

              <p className="text-xl text-blue-100">
                Stay warm all winter with a professionally installed, high-efficiency furnace. 
                Our certified technicians ensure optimal performance and maximum energy savings.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-lg px-8 py-6 rounded-xl shadow-2xl shadow-amber-500/50 transition-all hover:scale-105"
                  data-testid="button-call"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call (403) 613-6014
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white hover:text-slate-900 font-bold text-lg px-8 py-6 rounded-xl transition-all hover:scale-105"
                  asChild
                  data-testid="button-quote"
                >
                  <Link href="/contact">Get Free Estimate</Link>
                </Button>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
              <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white mb-6 shadow-2xl shadow-amber-500/50">
                <ThermometerSun className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-6">Why Choose Us?</h3>
              <ul className="space-y-4">
                <li className="flex items-center text-white">
                  <CheckCircle className="w-5 h-5 text-amber-400 mr-3" />
                  <span>15+ Years Experience</span>
                </li>
                <li className="flex items-center text-white">
                  <CheckCircle className="w-5 h-5 text-amber-400 mr-3" />
                  <span>Licensed & Insured</span>
                </li>
                <li className="flex items-center text-white">
                  <CheckCircle className="w-5 h-5 text-amber-400 mr-3" />
                  <span>10-Year Warranties</span>
                </li>
                <li className="flex items-center text-white">
                  <CheckCircle className="w-5 h-5 text-amber-400 mr-3" />
                  <span>24/7 Emergency Service</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Furnace Types - Premium Cards */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-amber-100 text-amber-700 hover:bg-amber-100">
              Our Options
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
              Furnace Installation Options
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Choose from our selection of high-quality, energy-efficient furnaces designed for Calgary's climate.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {furnaceTypes.map((furnace, index) => (
              <div key={index} className="relative group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 overflow-hidden">
                {furnace.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <div className={`h-2 bg-gradient-to-r ${furnace.color}`}></div>
                <div className="p-8">
                  <div className="text-center mb-6">
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${furnace.color} text-white mb-4 shadow-lg`}>
                      <Wrench className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{furnace.name}</h3>
                    <Badge variant="outline" className="text-emerald-600 border-emerald-600">
                      {furnace.efficiency}
                    </Badge>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {furnace.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-slate-700">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="text-center">
                    <p className="text-sm text-slate-500 mb-1">Starting at</p>
                    <p className="text-3xl font-black text-slate-900 mb-6">
                      {furnace.startingPrice}
                    </p>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-6 rounded-xl" asChild>
                      <Link href="/contact">
                        Get Quote
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Installation Process - Luxury */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-amber-500/20 text-amber-400 hover:bg-amber-500/20">
              Our Process
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-black mb-4">
              Professional Installation Process
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Expert installation ensures optimal performance and longevity for your investment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {installationProcess.map((item, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-black text-2xl shadow-2xl shadow-amber-500/50">
                  {index + 1}
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{item.step}</h3>
                <p className="text-sm text-blue-200">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Premium */}
      <section className="py-20 bg-gradient-to-r from-amber-500 to-orange-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
            Ready for a New Furnace?
          </h2>
          <p className="text-xl text-amber-50 mb-8 max-w-2xl mx-auto">
            Don't wait for your old furnace to fail. Schedule your free consultation today and ensure your family stays warm this winter.
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
            <Button 
              size="lg" 
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-amber-600 font-bold text-lg px-8 py-6 rounded-xl transition-all hover:scale-105"
              data-testid="button-cta-email"
            >
              <Mail className="w-5 h-5 mr-2" />
              Email Jordan@Afterhourshvac.ca
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
