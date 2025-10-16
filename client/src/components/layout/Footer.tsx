import { Link } from "wouter";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Wrench,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Star,
  Award,
  Shield,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const serviceLinks = [
    { name: "Furnace Installation", href: "/shop/furnaces" },
    { name: "AC Repair & Installation", href: "/services/ac-repair" },
    { name: "Duct Cleaning", href: "/services/duct-cleaning" },
    { name: "HVAC Maintenance", href: "/shop/maintenance-plans" },
    { name: "Energy Audits", href: "/services/energy-audit" }
  ];

  const calculatorLinks = [
    { name: "BTU Calculator", href: "/calculators/btu" },
    { name: "Energy Savings Calculator", href: "/calculators/energy-savings" },
    { name: "Load Calculator", href: "/calculators/load-calculator" },
    { name: "Material Estimator", href: "/calculators/material-estimator" }
  ];

  const companyLinks = [
    { name: "About Us", href: "/about" },
    { name: "Service Areas", href: "/service-areas" },
    { name: "Careers", href: "/careers" },
    { name: "Reviews", href: "/reviews" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" }
  ];

  const serviceAreas = [
    "Calgary", "Airdrie", "Okotoks", "Cochrane", "Canmore", "Strathmore",
    "High River", "Chestermere", "Red Deer", "Medicine Hat", "Lethbridge", "Camrose"
  ];

  const certifications = [
    { name: "Licensed & Insured", icon: Shield },
    { name: "BBB Accredited", icon: Award },
    { name: "Energy Star Partner", icon: Zap },
    { name: "24/7 Emergency", icon: Clock }
  ];

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-3 rounded-xl shadow-2xl shadow-amber-500/50">
                <Wrench className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">AfterHours</h3>
                <p className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent font-bold">HVAC Solutions</p>
              </div>
            </div>
            
            <p className="text-blue-200 leading-relaxed">
              Calgary's trusted HVAC experts providing professional heating, cooling, 
              and ventilation services with 24/7 emergency support since 2009.
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white">(403) 613-6014</p>
                  <p className="text-sm text-blue-300">24/7 Emergency Line</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white">Jordan@Afterhourshvac.ca</p>
                  <p className="text-sm text-blue-300">Get a Free Quote</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white">Calgary, Alberta</p>
                  <p className="text-sm text-blue-300">Serving Greater Calgary Area</p>
                </div>
              </div>
            </div>

            {/* Social Media - Connect with us */}
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com/afterhourshvac" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-amber-500 transition-all hover:scale-110"
                aria-label="Visit our Facebook page"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com/afterhourshvac" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-amber-500 transition-all hover:scale-110"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com/afterhourshvac" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-amber-500 transition-all hover:scale-110"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com/company/afterhours-hvac" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-amber-500 transition-all hover:scale-110"
                aria-label="Connect with us on LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-black text-white mb-6">Our Services</h4>
            <div className="space-y-3">
              {serviceLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-blue-200 hover:text-amber-400 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Tools & Resources */}
          <div>
            <h4 className="text-lg font-black text-white mb-6">Tools & Resources</h4>
            <div className="space-y-3">
              {calculatorLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-blue-200 hover:text-amber-400 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <Link href="/pro-calculator" className="flex items-center space-x-2 text-blue-200 hover:text-amber-400 transition-colors">
                <span>Pro Calculator</span>
                <Badge className="bg-amber-500 text-white text-xs">Pro</Badge>
              </Link>
              <Link href="/forum" className="block text-blue-200 hover:text-amber-400 transition-colors">
                HVAC Forum
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-black text-white mb-6">Company</h4>
            <div className="space-y-3">
              {companyLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-blue-200 hover:text-amber-400 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Reviews */}
            <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-bold text-white">5.0</span>
              </div>
              <p className="text-sm text-blue-200">500+ Happy Customers</p>
              <p className="text-xs text-blue-300 mt-1">Google Reviews</p>
            </div>
          </div>
        </div>

        {/* Service Areas */}
        <div className="mt-16 pt-12 border-t border-white/10">
          <h4 className="text-lg font-black text-white text-center mb-8">Service Areas</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {serviceAreas.map((area) => (
              <div key={area} className="text-center">
                <span className="text-blue-200 hover:text-amber-400 transition-colors cursor-pointer">
                  {area}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert) => (
              <div key={cert.name} className="flex items-center space-x-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all">
                <cert.icon className="w-6 h-6 text-amber-400" />
                <span className="text-sm font-semibold text-white">{cert.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency CTA */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-8 text-center shadow-2xl shadow-amber-500/50">
            <h3 className="text-3xl font-black text-white mb-4">Emergency HVAC Service Available 24/7</h3>
            <p className="text-lg mb-6 text-amber-50">
              Heating or cooling emergency? Don't wait - our certified technicians are standing by.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-amber-600 hover:bg-amber-50 font-bold shadow-xl hover:scale-105 transition-all">
                <Phone className="w-5 h-5 mr-2" />
                Call Emergency Line: (403) 613-6014
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-amber-600 font-bold transition-all hover:scale-105" asChild>
                <Link href="/contact">
                  <Clock className="w-5 h-5 mr-2" />
                  Get Emergency Quote
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-slate-950">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-blue-300">
              © {currentYear} AfterHours HVAC Solutions. All rights reserved.
            </div>
            
            <div className="flex flex-wrap items-center space-x-6 text-sm">
              <Link href="/privacy-policy" className="text-blue-300 hover:text-amber-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-blue-300 hover:text-amber-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="text-blue-300 hover:text-amber-400 transition-colors">
                Sitemap
              </Link>
              <div className="flex items-center space-x-2">
                <span className="text-blue-300">Made with</span>
                <span className="text-amber-400">♥</span>
                <span className="text-blue-300">in Calgary</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
