import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { 
  Map, Home, Wrench, Calculator, ShoppingCart, Users, 
  Building2, Phone, FileText, Shield, Eye, Crown,
  Settings, Calendar, AlertTriangle, BookOpen, Star,
  Zap, Hammer, ChartBar, Gauge, Database
} from "lucide-react";

export default function Sitemap() {
  const siteStructure = [
    {
      category: "Main Pages",
      icon: Home,
      color: "blue",
      pages: [
        { name: "Home", path: "/", description: "Main landing page with services overview" },
        { name: "About Us", path: "/about", description: "Company information and team details" },
        { name: "Services", path: "/services", description: "Complete HVAC services catalog" },
        { name: "Contact", path: "/contact", description: "Contact information and inquiry forms" },
        { name: "Gallery", path: "/gallery", description: "Project photos and service examples" },
      ]
    },
    {
      category: "Professional Tools",
      icon: Wrench,
      color: "orange",
      pages: [
        { name: "Pro Portal", path: "/pro-portal", description: "Advanced diagnostic tools for professionals" },
        { name: "AI Symptom Diagnoser", path: "/tools/ai-symptom-diagnoser", description: "Earl AI-powered HVAC diagnostics" },
        { name: "Pro Diagnostic Assistant", path: "/tools/pro-diagnostic-assistant", description: "Professional-grade diagnostic tools" },
        { name: "System Health Monitor", path: "/tools/system-health-monitor", description: "Real-time HVAC system monitoring" },
        { name: "Maintenance Scheduler", path: "/tools/maintenance-scheduler", description: "Automated maintenance planning" },
      ]
    },
    {
      category: "Calculators & Quotes",
      icon: Calculator,
      color: "green",
      pages: [
        { name: "Quote Builder", path: "/calculators/quote-builder", description: "Professional estimate generation" },
        { name: "Enhanced Quote Builder", path: "/calculators/enhanced-quote-builder", description: "Advanced project quoting system" },
        { name: "Load Calculator", path: "/calculators/load-calculator", description: "HVAC load calculation tools" },
        { name: "Energy Efficiency", path: "/calculators/energy-efficiency", description: "Energy savings calculators" },
        { name: "Rebate Calculator", path: "/calculators/rebate-calculator", description: "Alberta rebate calculations" },
      ]
    },
    {
      category: "E-Commerce",
      icon: ShoppingCart,
      color: "purple",
      pages: [
        { name: "Shop", path: "/shop", description: "HVAC equipment and parts catalog" },
        { name: "Equipment Categories", path: "/shop/categories", description: "Browse by equipment type" },
        { name: "Parts & Accessories", path: "/shop/parts", description: "Replacement parts and accessories" },
        { name: "Cart", path: "/cart", description: "Shopping cart and checkout" },
        { name: "Checkout", path: "/checkout", description: "Secure payment processing" },
      ]
    },
    {
      category: "Membership & Accounts",
      icon: Users,
      color: "indigo",
      pages: [
        { name: "Membership Plans", path: "/membership", description: "Pro and corporate membership options" },
        { name: "Corporate Membership", path: "/corporate-membership", description: "Enterprise solutions for businesses" },
        { name: "User Dashboard", path: "/dashboard", description: "Personal account management" },
        { name: "Customer Portal", path: "/customer-portal", description: "Customer service and support portal" },
        { name: "Admin Dashboard", path: "/admin-dashboard-enhanced", description: "Administrative controls and reporting" },
      ]
    },
    {
      category: "Emergency Services",
      icon: AlertTriangle,
      color: "red",
      pages: [
        { name: "Emergency Service", path: "/emergency", description: "24/7 emergency HVAC services" },
        { name: "Service Request", path: "/emergency-request", description: "Submit emergency service requests" },
        { name: "Service Tracking", path: "/emergency-tracking", description: "Track emergency service status" },
        { name: "Technician Dispatch", path: "/dispatch", description: "Technician assignment and routing" },
      ]
    },
    {
      category: "Business Management",
      icon: Building2,
      color: "teal",
      pages: [
        { name: "Job Applications", path: "/careers", description: "Employment opportunities and applications" },
        { name: "Schedule Management", path: "/schedule", description: "Appointment and job scheduling" },
        { name: "Maintenance Plans", path: "/maintenance-plans", description: "Recurring maintenance programs" },
        { name: "Customer Management", path: "/customers", description: "Customer relationship management" },
        { name: "Inventory", path: "/inventory", description: "Parts and equipment inventory" },
      ]
    },
    {
      category: "Analytics & Reports",
      icon: ChartBar,
      color: "cyan",
      pages: [
        { name: "Business Analytics", path: "/analytics", description: "Performance metrics and insights" },
        { name: "Financial Reports", path: "/reports/financial", description: "Revenue and expense reporting" },
        { name: "Service Reports", path: "/reports/service", description: "Service performance analytics" },
        { name: "Equipment Performance", path: "/reports/equipment", description: "Equipment efficiency tracking" },
      ]
    },
    {
      category: "Legal & Support",
      icon: Shield,
      color: "gray",
      pages: [
        { name: "Terms of Service", path: "/terms-of-service", description: "Platform terms and conditions" },
        { name: "Privacy Policy", path: "/privacy-policy", description: "Data protection and privacy practices" },
        { name: "Support Center", path: "/support", description: "Help documentation and FAQs" },
        { name: "Contact Support", path: "/support/contact", description: "Technical support and assistance" },
        { name: "Sitemap", path: "/sitemap", description: "Complete site navigation structure" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-gray-100 border border-gray-200 rounded-full px-6 py-3 mb-6">
            <Map className="h-5 w-5 text-gray-700 mr-3" />
            <span className="text-gray-800 text-lg font-bold">Site Navigation</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Site Map</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Complete navigation structure for AfterHours HVAC professional platform
          </p>
        </div>

        {/* Site Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {siteStructure.map((section, index) => {
            const IconComponent = section.icon;
            const colorClasses = {
              blue: "from-blue-600 to-blue-700 border-blue-200 bg-blue-50",
              orange: "from-orange-600 to-orange-700 border-orange-200 bg-orange-50",
              green: "from-green-600 to-green-700 border-green-200 bg-green-50",
              purple: "from-purple-600 to-purple-700 border-purple-200 bg-purple-50",
              indigo: "from-indigo-600 to-indigo-700 border-indigo-200 bg-indigo-50",
              red: "from-red-600 to-red-700 border-red-200 bg-red-50",
              teal: "from-teal-600 to-teal-700 border-teal-200 bg-teal-50",
              cyan: "from-cyan-600 to-cyan-700 border-cyan-200 bg-cyan-50",
              gray: "from-gray-600 to-gray-700 border-gray-200 bg-gray-50"
            };

            return (
              <Card key={index} className="shadow-lg border-0 bg-white overflow-hidden">
                <CardHeader className={`bg-gradient-to-r ${colorClasses[section.color as keyof typeof colorClasses].split(' ')[0]} ${colorClasses[section.color as keyof typeof colorClasses].split(' ')[1]} text-white`}>
                  <CardTitle className="text-xl font-bold flex items-center">
                    <IconComponent className="h-6 w-6 mr-3" />
                    {section.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {section.pages.map((page, pageIndex) => (
                      <div key={pageIndex} className="border-l-4 border-gray-200 pl-4 hover:border-blue-400 transition-colors">
                        <Link href={page.path}>
                          <div className="cursor-pointer group">
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {page.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">{page.description}</p>
                            <p className="text-xs text-blue-500 mt-1 opacity-75">{page.path}</p>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Access Section */}
        <Card className="shadow-lg border-0 bg-white mt-12">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardTitle className="text-2xl font-bold flex items-center">
              <Zap className="h-6 w-6 mr-3" />
              Quick Access Links
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              <Link href="/emergency">
                <div className="text-center group cursor-pointer">
                  <div className="bg-red-100 rounded-full p-4 mb-3 group-hover:bg-red-200 transition-colors">
                    <AlertTriangle className="h-8 w-8 text-red-600 mx-auto" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Emergency</p>
                </div>
              </Link>

              <Link href="/pro-portal">
                <div className="text-center group cursor-pointer">
                  <div className="bg-orange-100 rounded-full p-4 mb-3 group-hover:bg-orange-200 transition-colors">
                    <Hammer className="h-8 w-8 text-orange-600 mx-auto" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Pro Tools</p>
                </div>
              </Link>

              <Link href="/calculators/quote-builder">
                <div className="text-center group cursor-pointer">
                  <div className="bg-green-100 rounded-full p-4 mb-3 group-hover:bg-green-200 transition-colors">
                    <Calculator className="h-8 w-8 text-green-600 mx-auto" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Quotes</p>
                </div>
              </Link>

              <Link href="/shop">
                <div className="text-center group cursor-pointer">
                  <div className="bg-purple-100 rounded-full p-4 mb-3 group-hover:bg-purple-200 transition-colors">
                    <ShoppingCart className="h-8 w-8 text-purple-600 mx-auto" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Shop</p>
                </div>
              </Link>

              <Link href="/membership">
                <div className="text-center group cursor-pointer">
                  <div className="bg-indigo-100 rounded-full p-4 mb-3 group-hover:bg-indigo-200 transition-colors">
                    <Crown className="h-8 w-8 text-indigo-600 mx-auto" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Membership</p>
                </div>
              </Link>

              <Link href="/dashboard">
                <div className="text-center group cursor-pointer">
                  <div className="bg-teal-100 rounded-full p-4 mb-3 group-hover:bg-teal-200 transition-colors">
                    <Gauge className="h-8 w-8 text-teal-600 mx-auto" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Dashboard</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer Information */}
        <Card className="shadow-lg border-0 bg-white">
          <CardContent className="p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AfterHours HVAC Platform</h3>
              <p className="text-gray-700 mb-6 max-w-3xl mx-auto">
                Professional HVAC management platform serving Calgary and Alberta with advanced diagnostic tools, 
                e-commerce solutions, emergency services, and comprehensive business management capabilities.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <div className="text-center">
                  <Phone className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">24/7 Emergency</h4>
                  <p className="text-gray-700">(403) 613-6014</p>
                </div>
                
                <div className="text-center">
                  <Star className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Professional Service</h4>
                  <p className="text-gray-700">Licensed & Insured</p>
                </div>
                
                <div className="text-center">
                  <Database className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Secure Platform</h4>
                  <p className="text-gray-700">Enterprise-Grade Security</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Last Updated */}
        <div className="text-center pt-8">
          <p className="text-sm text-gray-500">
            Sitemap Last Updated: January 1, 2025 | Total Pages: {siteStructure.reduce((total, section) => total + section.pages.length, 0)}
          </p>
        </div>
      </div>
    </div>
  );
}