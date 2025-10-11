import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Shield, 
  Clock, 
  ArrowRight,
  Phone,
  Thermometer,
  Wind,
  Wrench,
  ChevronRight
} from 'lucide-react';

const HomeV2 = () => {
  return (
    <>
      <Helmet>
        <title>AfterHours HVAC | Calgary's Industrial HVAC Solutions</title>
        <meta name="description" content="Professional HVAC systems for Calgary. 24/7 emergency service, certified technicians, industrial-grade installations." />
      </Helmet>

      {/* Hero Section - Split Screen Industrial */}
      <section className="relative min-h-screen bg-void overflow-hidden">
        {/* Diagonal Grid Background */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(0, 240, 255, 0.03) 40px, rgba(0, 240, 255, 0.03) 80px)'
        }}></div>
        
        {/* Scan Lines Effect */}
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 240, 255, 0.02) 2px, rgba(0, 240, 255, 0.02) 4px)'
        }}></div>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex items-center">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              {/* Left: Text Content */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="inline-block px-4 py-2 bg-charcoal border border-cyberCyan/30 rounded-sm">
                    <span className="text-cyberCyan font-mono text-sm tracking-wider">SYSTEM.HVAC.ONLINE</span>
                  </div>
                  
                  <h1 className="font-industrial text-6xl lg:text-7xl font-black text-white leading-none tracking-tight">
                    INDUSTRIAL
                    <br />
                    <span className="text-cyberCyan" style={{textShadow: '0 0 30px rgba(0, 240, 255, 0.5)'}}>
                      HVAC SYSTEMS
                    </span>
                  </h1>
                  
                  <p className="text-xl text-gray-400 font-tech max-w-xl">
                    Calgary's advanced HVAC solutions. 24/7 emergency deployment. 
                    Certified technicians. Industrial-grade installations.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg"
                    className="bg-cyberCyan text-charcoal hover:bg-cyberCyan/90 font-industrial font-bold text-lg py-6 px-8 rounded-none border-2 border-cyberCyan transition-all"
                    style={{boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)'}}
                    data-testid="button-emergency-call"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    EMERGENCY: (403) 613-6014
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="bg-transparent text-white hover:bg-steel border-2 border-iron hover:border-hazardAmber font-industrial font-bold text-lg py-6 px-8 rounded-none transition-all"
                    asChild
                    data-testid="button-get-quote"
                  >
                    <Link href="/calculators">
                      SYSTEM CALCULATOR
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-iron">
                  <div className="space-y-1">
                    <div className="text-3xl font-black font-industrial text-cyberCyan">15+</div>
                    <div className="text-sm text-gray-500 font-tech uppercase tracking-wider">Years Active</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-black font-industrial text-hazardAmber">5000+</div>
                    <div className="text-sm text-gray-500 font-tech uppercase tracking-wider">Systems Installed</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-black font-industrial text-techGreen">24/7</div>
                    <div className="text-sm text-gray-500 font-tech uppercase tracking-wider">Emergency Service</div>
                  </div>
                </div>
              </div>

              {/* Right: Tech Panel */}
              <div className="relative">
                <div className="bg-charcoal border-2 border-iron p-8 relative">
                  {/* Corner Accent */}
                  <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyberCyan"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-hazardAmber"></div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-iron">
                      <span className="text-cyberCyan font-mono text-sm">SYSTEM STATUS</span>
                      <span className="text-techGreen font-mono text-sm">● OPERATIONAL</span>
                    </div>
                    
                    <div className="space-y-4">
                      <ServiceIndicator 
                        icon={<Thermometer className="w-6 h-6" />}
                        title="HEATING SYSTEMS"
                        status="ACTIVE"
                        color="hazardAmber"
                      />
                      <ServiceIndicator 
                        icon={<Wind className="w-6 h-6" />}
                        title="COOLING SYSTEMS"
                        status="ACTIVE"
                        color="cyberCyan"
                      />
                      <ServiceIndicator 
                        icon={<Wrench className="w-6 h-6" />}
                        title="MAINTENANCE"
                        status="ACTIVE"
                        color="techGreen"
                      />
                    </div>

                    <Link href="/pro-portal">
                      <button className="w-full bg-steel hover:bg-iron border border-iron hover:border-cyberCyan text-white py-4 px-6 font-industrial font-bold transition-all flex items-center justify-between group">
                        <span>ACCESS PRO PORTAL</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-charcoal/80 backdrop-blur-sm border-t border-iron">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between text-sm font-mono">
              <div className="flex items-center gap-6">
                <span className="text-gray-500">CALGARY_HQ</span>
                <span className="text-gray-500">|</span>
                <span className="text-techGreen">● ONLINE</span>
                <span className="text-gray-500">|</span>
                <span className="text-gray-400">RESPONSE_TIME: &lt;15MIN</span>
              </div>
              <div className="text-gray-500">
                AFTERHOURS.HVAC.SYS
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid - Industrial Cards */}
      <section className="bg-charcoal py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black font-industrial text-white mb-4">
              SERVICE <span className="text-cyberCyan">MODULES</span>
            </h2>
            <p className="text-gray-400 font-tech text-lg">
              Comprehensive HVAC solutions for Calgary
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <ServiceModule
              title="EMERGENCY"
              subtitle="24/7 Response"
              icon={<Zap className="w-12 h-12" />}
              color="alertRed"
              link="/emergency-service"
            />
            <ServiceModule
              title="INSTALLATION"
              subtitle="Industrial Grade"
              icon={<Wrench className="w-12 h-12" />}
              color="cyberCyan"
              link="/shop/furnaces"
            />
            <ServiceModule
              title="MAINTENANCE"
              subtitle="Preventive Care"
              icon={<Shield className="w-12 h-12" />}
              color="techGreen"
              link="/services/maintenance"
            />
          </div>
        </div>
      </section>
    </>
  );
};

// Service Indicator Component
const ServiceIndicator = ({ icon, title, status, color }: any) => (
  <div className="flex items-center justify-between p-4 bg-gunmetal border border-iron">
    <div className="flex items-center gap-3">
      <div className={`text-${color}`}>{icon}</div>
      <div>
        <div className="text-white font-industrial font-bold text-sm">{title}</div>
        <div className="text-gray-500 font-mono text-xs">{status}</div>
      </div>
    </div>
    <div className={`w-2 h-2 rounded-full bg-${color} animate-pulse`}></div>
  </div>
);

// Service Module Component
const ServiceModule = ({ title, subtitle, icon, color, link }: any) => (
  <Link href={link}>
    <div className="group relative bg-gunmetal border-2 border-iron hover:border-cyberCyan p-8 transition-all cursor-pointer overflow-hidden">
      {/* Hover Glow Effect */}
      <div className={`absolute inset-0 bg-${color}/5 opacity-0 group-hover:opacity-100 transition-opacity`}></div>
      
      <div className="relative z-10 space-y-4">
        <div className={`text-${color}`}>{icon}</div>
        <div>
          <h3 className="text-2xl font-black font-industrial text-white mb-1">{title}</h3>
          <p className="text-gray-400 font-tech text-sm">{subtitle}</p>
        </div>
        <div className="flex items-center text-cyberCyan font-mono text-sm group-hover:translate-x-2 transition-transform">
          <span>ACCESS_MODULE</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </div>
      </div>
    </div>
  </Link>
);

export default HomeV2;
