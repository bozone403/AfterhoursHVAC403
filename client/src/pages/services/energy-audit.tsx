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
  Zap,
  TrendingDown,
  Home,
  BarChart3,
  Thermometer,
  DollarSign,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Link } from "wouter";

export default function EnergyAudit() {
  const auditServices = [
    {
      name: "Residential Energy Audit",
      price: "$399",
      description: "Comprehensive home energy assessment",
      features: [
        "Thermal imaging inspection",
        "Air leakage testing",
        "HVAC efficiency analysis",
        "Insulation evaluation",
        "Detailed savings report",
        "Rebate application assistance"
      ]
    },
    {
      name: "Commercial Energy Audit",
      price: "$899",
      description: "Professional building energy analysis",
      features: [
        "Complete building envelope assessment",
        "HVAC system optimization",
        "Lighting efficiency review",
        "Energy consumption monitoring",
        "ROI analysis for upgrades",
        "Utility rebate maximization"
      ],
      popular: true
    },
    {
      name: "Pre-Purchase Inspection",
      price: "$299",
      description: "Energy assessment for home buyers",
      features: [
        "HVAC system condition report",
        "Energy efficiency rating",
        "Potential upgrade costs",
        "Annual energy cost estimate",
        "Negotiation leverage report"
      ]
    }
  ];

  const auditBenefits = [
    {
      icon: DollarSign,
      title: "Save 20-30% on Energy Bills",
      description: "Identify and fix energy waste to reduce monthly costs"
    },
    {
      icon: Home,
      title: "Improve Comfort",
      description: "Eliminate drafts, hot spots, and temperature inconsistencies"
    },
    {
      icon: TrendingDown,
      title: "Reduce Carbon Footprint",
      description: "Lower your environmental impact with energy efficiency"
    },
    {
      icon: BarChart3,
      title: "Increase Home Value",
      description: "Energy-efficient homes sell for 3-5% more than average"
    }
  ];

  const auditProcess = [
    "Initial consultation and inspection",
    "Thermal imaging and blower door testing",
    "HVAC system performance analysis",
    "Insulation and air sealing assessment",
    "Energy usage pattern review",
    "Detailed report with recommendations",
    "Rebate and financing guidance",
    "Follow-up implementation support"
  ];

  const commonFindings = [
    "Air leaks around windows and doors",
    "Inadequate insulation in attics/basements",
    "Inefficient HVAC equipment",
    "Ductwork leaks and poor design",
    "Outdated windows and doors",
    "Poor ventilation systems"
  ];

  return (
    <>
      <Helmet>
        <title>Energy Audit Services Calgary | AfterHours HVAC Solutions</title>
        <meta name="description" content="Professional energy audit services in Calgary. Identify energy waste, reduce bills by 20-30%, improve comfort. Thermal imaging, rebate assistance included." />
      </Helmet>

      {/* Hero Section - Premium */}
      <section className="relative min-h-[80vh] bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span className="text-white/90 text-sm font-medium">Energy Efficiency</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight">
                Professional Energy
                <br />
                <span className="bg-gradient-to-r from-teal-400 to-emerald-500 bg-clip-text text-transparent">
                  Audits
                </span>
              </h1>

              <p className="text-xl text-blue-100">
                Discover how to save 20-30% on your energy bills with our comprehensive energy audits. 
                We use advanced thermal imaging and testing to identify energy waste and improvement opportunities.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-lg px-8 py-6 rounded-xl shadow-2xl shadow-amber-500/50 transition-all hover:scale-105"
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
                  data-testid="button-schedule"
                >
                  <Link href="/contact">Schedule Audit</Link>
                </Button>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-xl">
              <Zap className="w-16 h-16 text-teal-400 mb-4" />
              <h3 className="text-2xl font-black text-white mb-4">Energy Audit Benefits</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-white">
                  <CheckCircle className="w-5 h-5 text-teal-400 mr-3 flex-shrink-0" />
                  <span>Save $200-500+ annually</span>
                </li>
                <li className="flex items-center text-white">
                  <CheckCircle className="w-5 h-5 text-teal-400 mr-3 flex-shrink-0" />
                  <span>Improve indoor comfort</span>
                </li>
                <li className="flex items-center text-white">
                  <CheckCircle className="w-5 h-5 text-teal-400 mr-3 flex-shrink-0" />
                  <span>Qualify for rebates & incentives</span>
                </li>
                <li className="flex items-center text-white">
                  <CheckCircle className="w-5 h-5 text-teal-400 mr-3 flex-shrink-0" />
                  <span>Increase property value</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Audit Services */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-teal-500 text-white mb-4">
              <Star className="w-3 h-3 mr-1" />
              Professional Services
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
              Energy Audit Services
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Choose the energy audit service that best fits your property and goals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {auditServices.map((service, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-2xl shadow-xl border-2 ${
                  service.popular 
                    ? 'border-teal-500 relative' 
                    : 'border-slate-200'
                } overflow-hidden hover:shadow-2xl transition-all hover:scale-105`}
                data-testid={`card-service-${index}`}
              >
                {service.popular && (
                  <div className="absolute top-0 right-0">
                    <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-tl-none rounded-br-none">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <div className="p-8">
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${
                      service.popular 
                        ? 'from-teal-500 to-emerald-500' 
                        : 'from-slate-500 to-slate-600'
                    } flex items-center justify-center`}>
                      <Thermometer className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">{service.name}</h3>
                    <div className="text-4xl font-black bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                      {service.price}
                    </div>
                    <p className="text-slate-600">{service.description}</p>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${
                      service.popular 
                        ? 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700' 
                        : 'bg-slate-900 hover:bg-slate-800'
                    } text-white font-bold py-6 rounded-xl shadow-lg transition-all hover:scale-105`}
                    asChild
                    data-testid={`button-schedule-audit-${index}`}
                  >
                    <Link href="/contact">
                      Schedule Audit
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-teal-500/20 text-teal-300 border border-teal-500/50 mb-4">
              <Shield className="w-3 h-3 mr-1" />
              Proven Results
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              Why Get an Energy Audit?
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Professional energy audits deliver measurable results and long-term savings.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {auditBenefits.map((benefit, index) => (
              <div 
                key={index} 
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center hover:bg-white/15 transition-all hover:scale-105 shadow-xl"
                data-testid={`card-benefit-${index}`}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-black text-white mb-3">{benefit.title}</h3>
                <p className="text-blue-100">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audit Process */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-teal-500 text-white mb-4">
              <CheckCircle className="w-3 h-3 mr-1" />
              Comprehensive Process
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
              Our Comprehensive Audit Process
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We use advanced technology and proven methods to identify all energy improvement opportunities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {auditProcess.map((step, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-6 text-center shadow-xl border-2 border-slate-200 hover:border-teal-500 transition-all hover:scale-105"
                data-testid={`process-step-${index}`}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 font-black text-2xl shadow-lg">
                  {index + 1}
                </div>
                <h3 className="font-black text-slate-900 text-sm leading-tight">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Findings */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-amber-900 to-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/50 mb-4">
              <Zap className="w-3 h-3 mr-1" />
              Common Issues
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              Common Energy Waste Issues We Find
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              These common problems could be costing you hundreds of dollars each year.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {commonFindings.map((finding, index) => (
              <div 
                key={index} 
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all hover:scale-105 shadow-xl"
                data-testid={`finding-${index}`}
              >
                <div className="flex items-start">
                  <Zap className="w-6 h-6 text-amber-400 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="font-bold text-white">{finding}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
            Ready to Start Saving Energy?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Schedule your professional energy audit today and discover how much you can save on your energy bills.
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
    </>
  );
}
