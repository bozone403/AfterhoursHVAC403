import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, Building, Flame, Snowflake, Wrench, DollarSign, Zap, File, Crown, Sparkles, Award, ArrowRight } from 'lucide-react';

const freeCalculators = [
  {
    id: 'enhanced-quote-builder',
    title: 'Material Quote Builder',
    description: 'Comprehensive material estimator with real supplier pricing - our best calculator!',
    icon: Calculator,
    link: '/calculators/enhanced-quote-builder',
    badge: 'Recommended'
  },
  {
    id: 'btu-calculator',
    title: 'BTU Calculator',
    description: 'Calculate heating and cooling requirements with Ducane, Daikin & Lennox equipment recommendations',
    icon: Zap,
    link: '/calculators/btu-calculator',
    badge: 'Free Tool'
  },
  {
    id: 'energy-savings',
    title: 'Energy Savings Calculator',
    description: 'Calculate potential savings and environmental impact of HVAC upgrades',
    icon: DollarSign,
    link: '/calculators/energy-savings',
    badge: 'Free Tool'
  },
  {
    id: 'load-calculator',
    title: 'HVAC Load Calculator',
    description: 'Professional load calculations using Manual J principles with equipment sizing',
    icon: Calculator,
    link: '/calculators/load-calculator',
    badge: 'Free Tool'
  }
];

const proCalculators = [
  {
    id: 'material-estimator',
    title: 'Advanced Material Calculator',
    description: 'Real-time Alggin.com pricing with custom multipliers',
    icon: Calculator,
    link: '/pro-calculator',
    badge: 'Pro Only'
  },
  {
    id: 'commercial-estimator', 
    title: 'Commercial Load Calculator',
    description: 'Complex load calculations for commercial HVAC systems',
    icon: Building,
    link: '/calculators/commercial-estimator',
    badge: 'Pro Only'
  },
  {
    id: 'project-templates',
    title: 'Project Templates',
    description: 'Pre-built templates for common HVAC installations',
    icon: File,
    link: '/pro-calculator',
    badge: 'Pro Only'
  }
];



const Calculators = () => {
  return (
    <>
      <Helmet>
        <title>HVAC Calculators & Service Booking | AfterHours HVAC</title>
        <meta name="description" content="Free HVAC calculators for material costs and BTU requirements, plus online service booking with secure payment for Calgary area." />
      </Helmet>

      {/* Premium Hero Section */}
      <section className="relative min-h-[60vh] bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 pt-24 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-white/90 text-sm font-medium">Professional-Grade Tools</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              HVAC Tools & <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">Services</span>
            </h1>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Professional calculators and streamlined service booking for Calgary HVAC needs
            </p>
          </div>
        </div>
      </section>

      {/* Main Content - Luxury Dark Background */}
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        {/* Additional Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          {/* Free Calculators Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-4">
                <Award className="h-5 w-5 text-amber-400" />
                <span className="text-white font-bold text-sm">FREE ACCESS</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">Free Calculators</h2>
              <p className="text-lg text-blue-200 max-w-2xl mx-auto">Professional estimation tools at no cost</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {freeCalculators.map((calc) => {
                const IconComponent = calc.icon;
                return (
                  <Link key={calc.id} href={calc.link}>
                    <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl rounded-2xl hover:bg-white/15 transition-all duration-300 cursor-pointer group h-full hover:scale-105" data-testid={`card-calculator-${calc.id}`}>
                      <CardHeader className="text-center pb-4">
                        <div className="mx-auto mb-4 p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl w-fit group-hover:scale-110 transition-transform shadow-lg">
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <Badge className="w-fit mx-auto mb-3 bg-blue-500/20 text-blue-100 border-blue-400/30 backdrop-blur-sm">
                          {calc.badge}
                        </Badge>
                        <CardTitle className="text-white text-xl font-black">{calc.title}</CardTitle>
                        <CardDescription className="text-blue-200">
                          {calc.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300" data-testid={`button-open-${calc.id}`}>
                          Open Calculator
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Pro Calculators Section */}
          <div className="relative mb-20">
            {/* Additional background accent */}
            <div className="absolute -inset-8 bg-gradient-to-br from-amber-500/5 via-transparent to-blue-500/5 rounded-3xl blur-2xl"></div>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-10 right-10 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-10 left-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>
            
            <div className="relative p-12 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10">
              <div className="text-center mb-12">
                <div className="inline-flex items-center bg-gradient-to-r from-amber-500 to-amber-600 rounded-full px-6 py-3 mb-6 shadow-2xl shadow-amber-500/50">
                  <Crown className="h-5 w-5 text-white mr-2" />
                  <span className="text-white text-sm font-bold">PROFESSIONAL TOOLS</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">Professional Calculators</h2>
                <p className="text-xl text-blue-200 max-w-2xl mx-auto">Advanced tools with real supplier pricing - $49/month</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {proCalculators.map((calc) => {
                  const IconComponent = calc.icon;
                  return (
                    <Link key={calc.id} href={calc.link}>
                      <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl rounded-2xl hover:bg-white/15 transition-all duration-300 cursor-pointer group relative h-full hover:scale-105" data-testid={`card-calculator-${calc.id}`}>
                        <div className="absolute -top-3 -right-3">
                          <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-2 rounded-full shadow-xl">
                            <Crown className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <CardHeader className="text-center pb-4">
                          <div className="mx-auto mb-4 p-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl w-fit group-hover:scale-110 transition-transform shadow-lg">
                            <IconComponent className="h-8 w-8 text-white" />
                          </div>
                          <Badge className="w-fit mx-auto mb-3 bg-amber-500/20 text-amber-100 border-amber-400/30 backdrop-blur-sm">
                            {calc.badge}
                          </Badge>
                          <CardTitle className="text-white text-xl font-black">{calc.title}</CardTitle>
                          <CardDescription className="text-blue-200">
                            {calc.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold shadow-xl hover:shadow-2xl shadow-amber-500/50 transition-all duration-300 hover:scale-105" data-testid={`button-upgrade-${calc.id}`}>
                            <Crown className="h-4 w-4 mr-2" />
                            Upgrade to Pro
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="relative">
            {/* Background animation */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
            </div>
            
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl rounded-2xl overflow-hidden relative">
              <CardContent className="p-12 relative z-10">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span className="text-white/90 text-sm font-medium">Custom Solutions Available</span>
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-black text-white mb-4">Need Custom Work?</h3>
                  <p className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto">
                    For complex commercial projects or custom HVAC solutions, contact us directly for a personalized quote.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/contact">
                      <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-lg px-8 py-6 rounded-xl shadow-2xl shadow-amber-500/50 transition-all duration-300 hover:scale-105" data-testid="button-custom-quote">
                        Get Custom Quote
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-slate-900 font-bold text-lg px-8 py-6 rounded-xl transition-all duration-300 hover:scale-105"
                      onClick={() => window.open('tel:4036136014')}
                      data-testid="button-call"
                    >
                      Call (403) 613-6014
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Calculators;
