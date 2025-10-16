import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Award,
  Shield,
  Star,
  Sparkles,
  Phone,
  Calendar,
  ArrowRight,
  CheckCircle,
  Flame,
  Snowflake,
  Wind,
  Clock,
  Users,
  TrendingUp,
  Brain,
  Calculator,
  Wrench,
  Zap
} from 'lucide-react';

const HomeLuxury = () => {
  return (
    <>
      <Helmet>
        <title>AfterHours HVAC | Calgary's Premier HVAC Excellence</title>
        <meta name="description" content="Experience unparalleled HVAC service in Calgary. Award-winning technicians, premium installations, and white-glove service since 2009." />
      </Helmet>

      {/* Hero Section - Clean Luxury */}
      <section className="relative min-h-[90vh] bg-slate-950 overflow-hidden pt-24">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)', backgroundSize: '100px 100px'}}></div>
        </div>

        {/* Premium Badge */}
        <div className="absolute top-8 right-8 z-20">
          <div className="bg-amber-600 text-white px-5 py-2.5 flex items-center gap-2 border-l-4 border-amber-400">
            <Award className="w-4 h-4" />
            <span className="font-bold text-sm tracking-wide">CALGARY'S PREMIER HVAC</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-6 pt-8 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-amber-600 px-5 py-2 border-l-4 border-amber-400">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-bold tracking-wide uppercase">5,000+ Calgary Homes Trust Us</span>
                </div>
                
                <h1 className="text-6xl lg:text-8xl font-black text-white leading-none tracking-tight">
                  PREMIUM HVAC
                  <br />
                  <span className="text-amber-500">
                    EXCELLENCE
                  </span>
                </h1>
                
                <p className="text-lg text-slate-300 max-w-xl leading-relaxed font-light">
                  Calgary's most trusted HVAC service. Award-winning installations,
                  24/7 emergency response, and uncompromising quality since 2009.
                </p>
              </div>

              {/* CTA Buttons - Clean & Square */}
              <div className="flex flex-col sm:flex-row gap-4 relative z-20">
                <Button 
                  size="lg"
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-base px-10 py-7 transition-all border-l-4 border-amber-400 hover:border-amber-300 w-full sm:w-auto uppercase tracking-wider"
                  data-testid="button-emergency-call"
                >
                  <Phone className="w-5 h-5 mr-3" />
                  24/7 Emergency: (403) 613-6014
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-slate-950 font-bold text-base px-10 py-7 transition-all w-full sm:w-auto uppercase tracking-wider"
                  asChild
                  data-testid="button-schedule"
                >
                  <Link href="/contact">
                    <Calendar className="w-5 h-5 mr-3" />
                    Schedule Service
                  </Link>
                </Button>
              </div>

              {/* AI Tool Callout - Clean */}
              <Link href="/tools/ai-symptom-diagnoser">
                <div className="bg-emerald-600 border-l-4 border-emerald-400 p-6 hover:bg-emerald-500 transition-all group cursor-pointer">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-emerald-700 flex items-center justify-center flex-shrink-0">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-emerald-200 uppercase tracking-widest">NEW AI TOOL</span>
                      </div>
                      <h3 className="text-base font-bold text-white uppercase tracking-wide">AI Symptom Diagnoser</h3>
                      <p className="text-sm text-emerald-100 font-light">Instant diagnosis of HVAC problems</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform flex-shrink-0" />
                  </div>
                </div>
              </Link>

              {/* Trust Indicators - Clean */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="border-l-4 border-amber-500 pl-4">
                  <div className="text-4xl font-black text-white mb-0.5">15+</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Years</div>
                </div>
                <div className="border-l-4 border-amber-500 pl-4">
                  <div className="text-4xl font-black text-white mb-0.5">5K+</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Clients</div>
                </div>
                <div className="border-l-4 border-amber-500 pl-4">
                  <div className="text-4xl font-black text-white mb-0.5">24/7</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Support</div>
                </div>
              </div>
            </div>

            {/* Right: Premium Feature Cards */}
            <div className="space-y-6 relative z-20 mt-8 lg:mt-0">
              <PremiumFeatureCard 
                icon={<Shield className="w-8 h-8" />}
                title="Certified Excellence"
                description="Factory-trained technicians with continuous education"
                accent="from-blue-500 to-blue-600"
              />
              <PremiumFeatureCard 
                icon={<Award className="w-8 h-8" />}
                title="Award-Winning Service"
                description="Calgary's most trusted HVAC service provider"
                accent="from-amber-500 to-amber-600"
              />
              <PremiumFeatureCard 
                icon={<Star className="w-8 h-8" />}
                title="Premium Warranties"
                description="Industry-leading guarantees on all installations"
                accent="from-blue-500 to-blue-600"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Showcase - Elegant Grid */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <Badge className="mb-4 bg-amber-100 text-amber-700 hover:bg-amber-100">
              Our Expertise
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
              Complete HVAC Solutions
            </h2>
            <p className="text-xl text-slate-600">
              From residential comfort to commercial excellence, we deliver perfection
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <LuxuryServiceCard
              icon={<Flame className="w-12 h-12" />}
              title="Premium Heating"
              description="High-efficiency furnaces and heat pumps for ultimate winter comfort"
              features={["Smart Thermostats", "Energy Efficient", "Quiet Operation"]}
              color="from-orange-500 to-red-500"
              link="/shop/furnaces"
            />
            <LuxuryServiceCard
              icon={<Snowflake className="w-12 h-12" />}
              title="Advanced Cooling"
              description="State-of-the-art AC systems for perfect summer climate control"
              features={["Zone Control", "Air Purification", "Smart Integration"]}
              color="from-blue-500 to-cyan-500"
              link="/shop/air-conditioning"
            />
            <LuxuryServiceCard
              icon={<Wind className="w-12 h-12" />}
              title="Air Quality"
              description="Premium filtration and ventilation for healthier living"
              features={["HEPA Filtration", "UV Purification", "Fresh Air Systems"]}
              color="from-emerald-500 to-teal-500"
              link="/services/maintenance"
            />
          </div>
        </div>
      </section>

      {/* AI Tools Section - Full Suite */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-slate-900 to-blue-900" id="ai-tools">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-amber-500/20 border border-amber-500/50 rounded-full px-6 py-2 mb-6">
              <Zap className="w-5 h-5 text-amber-400 mr-2" />
              <span className="text-amber-300 font-semibold">AI-Powered Tools</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
              Smart HVAC <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Diagnostics</span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Get instant professional diagnostics and calculations with our AI-powered tools. Save time and money with accurate problem identification.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link href="/tools/ai-symptom-diagnoser">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 group cursor-pointer hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">AI Symptom Diagnoser</h3>
                <p className="text-blue-200 mb-6">
                  Describe your HVAC problem and get instant AI-powered diagnosis with repair recommendations.
                </p>
                <div className="flex items-center text-amber-400 font-semibold group-hover:gap-2 transition-all">
                  <span>Try AI Diagnosis</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link href="/tools/alberta-rebate-calculator">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 group cursor-pointer hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Calculator className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Alberta Rebate Calculator</h3>
                <p className="text-blue-200 mb-6">
                  Calculate available government rebates for energy-efficient HVAC upgrades in Alberta.
                </p>
                <div className="flex items-center text-amber-400 font-semibold group-hover:gap-2 transition-all">
                  <span>Check Rebates</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link href="/pro-calculator">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 group cursor-pointer hover:-translate-y-2 md:col-span-2 lg:col-span-1">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Wrench className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Pro Calculator</h3>
                <p className="text-blue-200 mb-6">
                  Professional material estimation with real-time pricing for contractors and homeowners.
                </p>
                <div className="flex items-center text-amber-400 font-semibold group-hover:gap-2 transition-all">
                  <span>Access Pro Tools</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Premium Benefits */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-black mb-8">
                The AfterHours
                <br />
                <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                  Difference
                </span>
              </h2>
              <div className="space-y-6">
                <BenefitItem 
                  icon={<CheckCircle className="w-6 h-6" />}
                  title="White-Glove Service"
                  description="Meticulous attention to detail from consultation to completion"
                />
                <BenefitItem 
                  icon={<CheckCircle className="w-6 h-6" />}
                  title="Premium Equipment"
                  description="Top-tier Lennox, Daikin, and Ducane systems"
                />
                <BenefitItem 
                  icon={<CheckCircle className="w-6 h-6" />}
                  title="Transparent Pricing"
                  description="Upfront quotes with no hidden fees or surprises"
                />
                <BenefitItem 
                  icon={<CheckCircle className="w-6 h-6" />}
                  title="Lifetime Support"
                  description="Ongoing maintenance and priority service for life"
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-900 to-slate-900 p-12 rounded-3xl border border-white/10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-amber-500/20 px-4 py-2 rounded-full mb-4">
                  <Star className="w-5 h-5 text-amber-400" />
                  <span className="text-amber-400 font-semibold">Client Testimonial</span>
                </div>
                <div className="flex justify-center gap-1 mb-4">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xl text-blue-100 italic mb-6">
                  "AfterHours transformed our home comfort. Their attention to detail 
                  and professionalism is unmatched in Calgary."
                </p>
                <div className="text-amber-400 font-semibold">Sarah M. - Calgary SW</div>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-6 rounded-xl"
                asChild
              >
                <Link href="/reviews">
                  View All Reviews
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Premium */}
      <section className="py-20 bg-gradient-to-r from-amber-500 to-amber-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
            Ready for Excellence?
          </h2>
          <p className="text-xl text-amber-50 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied Calgary homeowners who trust us for their comfort
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-amber-600 hover:bg-amber-50 font-bold text-lg px-8 py-6 rounded-xl shadow-2xl transition-all hover:scale-105"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call (403) 613-6014
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-amber-600 font-bold text-lg px-8 py-6 rounded-xl transition-all hover:scale-105"
              asChild
            >
              <Link href="/calculators">
                Free Quote Calculator
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

// Premium Feature Card
const PremiumFeatureCard = ({ icon, title, description, accent }: any) => (
  <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all hover:scale-105 cursor-pointer relative z-20">
    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${accent} text-white mb-4`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-blue-200">{description}</p>
  </div>
);

// Luxury Service Card
const LuxuryServiceCard = ({ icon, title, description, features, color, link }: any) => (
  <Link href={link}>
    <div className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all p-8 hover:-translate-y-2 cursor-pointer border border-slate-100">
      <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${color} text-white mb-6`}>
        {icon}
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 mb-6">{description}</p>
      <ul className="space-y-2">
        {features.map((feature: string, i: number) => (
          <li key={i} className="flex items-center text-slate-700">
            <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex items-center text-amber-600 font-semibold group-hover:gap-2 transition-all">
        <span>Learn More</span>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </Link>
);

// Benefit Item
const BenefitItem = ({ icon, title, description }: any) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 text-amber-400">
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-lg mb-1">{title}</h4>
      <p className="text-blue-200">{description}</p>
    </div>
  </div>
);

export default HomeLuxury;
