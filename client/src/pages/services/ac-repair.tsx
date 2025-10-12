import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Mail, 
  CheckCircle, 
  Snowflake,
  Zap,
  AlertTriangle,
  ArrowRight,
  Clock
} from "lucide-react";
import { Link } from "wouter";

export default function ACRepair() {
  const services = [
    {
      title: "AC Repair & Diagnostics",
      description: "Complete diagnosis and repair of all AC system issues",
      features: ["System Diagnostics", "Refrigerant Leak Repair", "Compressor Service", "Electrical Repairs"],
      price: "Service Call: $149",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "AC Installation",
      description: "Professional installation of new air conditioning systems",
      features: ["1-Stage (16 SEER)", "2-Stage (18 SEER)", "Variable Speed (26 SEER)", "10-Year Warranty"],
      price: "Starting at $6,499",
      color: "from-cyan-500 to-teal-500",
      popular: true
    },
    {
      title: "AC Maintenance",
      description: "Regular maintenance to keep your AC running efficiently",
      features: ["Filter Replacement", "Coil Cleaning", "System Tune-up", "Preventive Inspection"],
      price: "Starting at $299/year",
      color: "from-teal-500 to-emerald-500"
    }
  ];

  const commonIssues = [
    "AC Not Cooling",
    "Strange Noises",
    "High Energy Bills",
    "Frozen Coils",
    "Poor Air Flow",
    "Thermostat Issues"
  ];

  return (
    <>
      <Helmet>
        <title>AC Repair & Installation Calgary | AfterHours HVAC Solutions</title>
        <meta name="description" content="Expert AC repair and installation services in Calgary. 24/7 emergency service, licensed technicians, satisfaction guaranteed. Call (403) 613-6014 today." />
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
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-white/90 text-sm font-medium">Emergency Service Available 24/7</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight">
                AC Repair &
                <br />
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Installation
                </span>
              </h1>

              <p className="text-xl text-blue-100">
                Stay cool all summer with professional AC repair and installation services. 
                Our certified technicians provide fast, reliable solutions for all your cooling needs.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-lg px-8 py-6 rounded-xl shadow-2xl shadow-cyan-500/50 transition-all hover:scale-105"
                  data-testid="button-emergency"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Emergency: (403) 613-6014
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
              <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white mb-6 shadow-2xl shadow-cyan-500/50">
                <Snowflake className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-6">Emergency AC Service</h3>
              <ul className="space-y-4">
                <li className="flex items-center text-white">
                  <CheckCircle className="w-5 h-5 text-cyan-400 mr-3" />
                  <span>24/7 Emergency Response</span>
                </li>
                <li className="flex items-center text-white">
                  <CheckCircle className="w-5 h-5 text-cyan-400 mr-3" />
                  <span>Same-Day Service Available</span>
                </li>
                <li className="flex items-center text-white">
                  <CheckCircle className="w-5 h-5 text-cyan-400 mr-3" />
                  <span>Licensed & Insured</span>
                </li>
                <li className="flex items-center text-white">
                  <CheckCircle className="w-5 h-5 text-cyan-400 mr-3" />
                  <span>Satisfaction Guaranteed</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services - Premium Cards */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-cyan-100 text-cyan-700 hover:bg-cyan-100">
              Our Services
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
              Complete AC Services
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From emergency repairs to new installations, we provide comprehensive air conditioning services.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <div key={index} className="relative group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 overflow-hidden">
                {service.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <div className={`h-2 bg-gradient-to-r ${service.color}`}></div>
                <div className="p-8">
                  <div className="text-center mb-6">
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${service.color} text-white mb-4 shadow-lg`}>
                      <Snowflake className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{service.title}</h3>
                    <p className="text-slate-600">{service.description}</p>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-slate-700">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="text-center">
                    <p className="text-3xl font-black text-slate-900 mb-6">
                      {service.price}
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

      {/* Common Issues - Luxury Grid */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20">
              We Fix It All
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              Common AC Problems We Fix
            </h2>
            <p className="text-xl text-blue-100">
              Don't suffer in the heat. We diagnose and repair all AC issues quickly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {commonIssues.map((issue, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 border-l-4 border-l-cyan-400 rounded-xl p-6 text-center hover:bg-white/20 transition-all">
                <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                <h3 className="font-semibold text-white">{issue}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Premium */}
      <section className="py-20 bg-gradient-to-r from-cyan-500 to-blue-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
            Beat the Calgary Heat
          </h2>
          <p className="text-xl text-cyan-50 mb-8 max-w-2xl mx-auto">
            Don't let a broken AC ruin your summer. Call now for fast, reliable service from Calgary's cooling experts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-cyan-600 hover:bg-cyan-50 font-bold text-lg px-8 py-6 rounded-xl shadow-2xl transition-all hover:scale-105"
              data-testid="button-cta-call"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call (403) 613-6014
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-cyan-600 font-bold text-lg px-8 py-6 rounded-xl transition-all hover:scale-105"
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
