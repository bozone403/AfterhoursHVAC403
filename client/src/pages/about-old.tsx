import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Award,
  Users,
  Clock,
  Shield,
  Star,
  CheckCircle,
  Phone,
  Mail,
  Calendar,
  Heart,
  ThermometerSun,
  Snowflake,
  Wind,
  Settings,
  Target,
  Eye,
  Zap,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Bot,
  Wrench,
  Home,
  Building2
} from "lucide-react";

const About = () => {
  const teamMembers = [
    {
      name: "Jordan Boisclair",
      title: "Commercial Project Coordination & Management",
      bio: "Jordan leads the operational side of AfterHours HVAC, overseeing project coordination, material logistics, and communication between clients, trades, and suppliers. With over 15 years in the industry, he bridges field experience and business strategy to ensure every project runs smoothly, on time, and to spec.",
      icon: Building2,
      color: "from-blue-600 to-blue-800"
    },
    {
      name: "Derek Thompson", 
      title: "Residential New Home & Retrofit Manager",
      bio: "Derek manages our residential division, specializing in new home installations and retrofit projects. He ensures every system is designed and installed for long-term reliability, energy efficiency, and comfort. Derek's hands-on expertise and attention to detail make him a trusted name for homeowners and builders alike.",
      icon: Home,
      color: "from-green-600 to-green-800"
    },
    {
      name: "Earl (AI Operations System)",
      title: "Internal Records & Technical Support AI", 
      bio: "Earl is our in-house AI assistant — part record keeper, part technical mentor. He helps our team manage documentation, building data, and field theory. Earl's always learning, expanding his knowledge of HVAC codes, manuals, and mechanical literature so our technicians can get instant answers when they need them most.",
      icon: Bot,
      color: "from-orange-500 to-orange-700",
      isAI: true
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description: "Every call, every quote, every install — we treat it like it's our own home.",
      color: "from-rose-500 to-pink-500"
    },
    {
      icon: Wrench,
      title: "Quality Workmanship", 
      description: "We don't cut corners, ever. The right tools, the right materials, the right way.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Clock,
      title: "Reliability",
      description: "When it's urgent, we're there — day or night, no excuses.",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "From smart systems to AI support, we're always evolving to serve better.",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Target,
      title: "Sustainability",
      description: "Efficient systems mean savings for you and less impact on the planet.",
      color: "from-green-500 to-emerald-500"
    }
  ];
      title: "Energy Efficient",
      description: "We promote sustainable solutions that reduce energy costs and environmental impact for a better future.",
      color: "from-emerald-500 to-teal-500"
    }
  ];

  const services = [
    {
      icon: ThermometerSun,
      title: "Heating Systems",
      description: "Expert furnace installation, repair, and maintenance to keep your home warm and comfortable.",
      features: ["High-Efficiency Furnaces", "Heat Pumps", "Boiler Systems", "Radiant Heating"]
    },
    {
      icon: Snowflake,
      title: "Cooling Solutions",
      description: "Professional air conditioning services for optimal indoor climate control year-round.",
      features: ["Central Air Systems", "Ductless Mini-Splits", "Heat Pumps", "AC Maintenance"]
    },
    {
      icon: Wind,
      title: "Ventilation",
      description: "Comprehensive ductwork and ventilation services for improved air quality and system efficiency.",
      features: ["Duct Cleaning", "Duct Repair", "Air Quality Testing", "Ventilation Design"]
    },
    {
      icon: Settings,
      title: "Maintenance",
      description: "Preventive maintenance programs to extend system life and prevent costly breakdowns.",
      features: ["Annual Inspections", "Filter Replacement", "System Tune-ups", "Performance Optimization"]
    }
  ];

  const certifications = [
    "Licensed HVAC Contractors",
    "Comprehensive Liability Insurance",
    "Better Business Bureau Accredited",
    "Energy Star Partner",
    "Manufacturer Certified Technicians",
    "Safety Training Certified"
  ];

  const teamMembers = [
    {
      name: "Jordan Boisclair",
      role: "Owner & Master Technician",
      experience: "15+ Years Experience",
      specialties: ["Commercial HVAC", "System Design", "Energy Audits"],
      description: "Leading AfterHours HVAC with expertise in complex commercial systems and energy-efficient solutions."
    },
    {
      name: "Earl McRae",
      role: "AI Operations Specialist",
      experience: "Advanced AI Systems",
      specialties: ["Process Optimization", "Digital Solutions", "Customer Experience"],
      description: "Enhancing service delivery through cutting-edge technology and automated systems."
    },
    {
      name: "Derek Thompson",
      role: "Senior Field Technician",
      experience: "12+ Years Experience", 
      specialties: ["Residential Service", "Emergency Repairs", "Installation"],
      description: "Expert technician specializing in residential HVAC systems and emergency service calls."
    }
  ];

  return (
    <>
      <Helmet>
        <title>About AfterHours HVAC - Calgary's Premier HVAC Experts | Professional Heating & Cooling</title>
        <meta name="description" content="Learn about AfterHours HVAC - Calgary's premier heating and cooling experts with 15+ years of experience. Licensed, insured, and committed to excellence. Meet our team of professionals." />
      </Helmet>

      {/* Hero Section - Premium */}
      <section className="relative min-h-[70vh] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 pt-24 pb-16">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-white/90 text-sm font-medium">Calgary's HVAC Experts Since 2009</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight">
              Your Trusted Partner for
              <br />
              <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                Comfort Solutions
              </span>
            </h1>

            <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
              For over 15 years, AfterHours HVAC has been Calgary's go-to source for professional 
              heating, cooling, and ventilation services. We're not just technicians – we're your 
              neighbors, committed to keeping your family comfortable year-round.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
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
                <Link href="/contact">
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Service
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Elegant */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all hover:-translate-y-2">
                  <stat.icon className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                  <div className="text-4xl font-black text-slate-900 mb-2">{stat.number}</div>
                  <div className="text-slate-600 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section - Premium Layout */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <Badge className="mb-4 bg-amber-500/20 text-amber-400 hover:bg-amber-500/20">
                  Our Story
                </Badge>
                <h2 className="text-4xl font-black mb-6">Building Trust Since 2009</h2>
                <div className="space-y-6 text-blue-100 leading-relaxed text-lg">
                  <p>
                    Founded in 2009 by Jordan Boisclair, AfterHours HVAC began with a simple mission: 
                    to provide Calgary families and businesses with reliable, professional HVAC services 
                    when they need them most – including after hours and on weekends.
                  </p>
                  <p>
                    What started as a one-person operation has grown into Calgary's most trusted HVAC 
                    service company, but we've never lost sight of our core values: exceptional customer 
                    service, quality workmanship, and honest, transparent pricing.
                  </p>
                  <p>
                    Today, our team of certified technicians continues to serve the Greater Calgary Area 
                    with the same dedication to excellence that has earned us over 5,000 satisfied customers 
                    and countless referrals from friends and neighbors.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold" asChild>
                  <Link href="/contact">Get Your Free Quote</Link>
                </Button>
                <Button variant="outline" className="border-2 border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-white" asChild>
                  <Link href="/reviews">Read Customer Reviews</Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all">
                  <Target className="w-8 h-8 text-amber-400 mb-4" />
                  <h4 className="font-bold text-white mb-3">Our Mission</h4>
                  <p className="text-sm text-blue-200">
                    To provide exceptional HVAC services that keep Calgary families and businesses 
                    comfortable while building lasting relationships based on trust and reliability.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6 hover:from-red-500/30 hover:to-orange-500/30 transition-all">
                  <TrendingUp className="w-8 h-8 text-red-400 mb-4" />
                  <h4 className="font-bold text-white mb-3">Our Growth</h4>
                  <p className="text-sm text-blue-200">
                    From humble beginnings to Calgary's premier HVAC service provider, we've grown 
                    through referrals and repeat customers who trust our expertise.
                  </p>
                </div>
              </div>
              <div className="space-y-6 pt-8">
                <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-6 hover:from-emerald-500/30 hover:to-teal-500/30 transition-all">
                  <Eye className="w-8 h-8 text-emerald-400 mb-4" />
                  <h4 className="font-bold text-white mb-3">Our Vision</h4>
                  <p className="text-sm text-blue-200">
                    To be Western Canada's most trusted HVAC company, known for innovation, 
                    sustainability, and unmatched customer satisfaction.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-amber-500/20 to-yellow-500/20 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-6 hover:from-amber-500/30 hover:to-yellow-500/30 transition-all">
                  <Heart className="w-8 h-8 text-amber-400 mb-4" />
                  <h4 className="font-bold text-white mb-3">Our Promise</h4>
                  <p className="text-sm text-blue-200">
                    Every job is completed to the highest standards with a focus on quality, 
                    safety, and customer satisfaction – guaranteed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section - Premium Cards */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-amber-100 text-amber-700 hover:bg-amber-100">
              Our Foundation
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              These fundamental principles guide every decision we make and every service we provide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${value.color}`}></div>
                <div className="p-8 text-center">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${value.color} text-white mb-6`}>
                    <value.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - Luxury */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-amber-500/20 text-amber-400 hover:bg-amber-500/20">
              Our Team
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-black mb-4">Meet Our Expert Team</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Our certified professionals bring decades of combined experience and a commitment 
              to excellence in every job we complete.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member, index) => (
              <div key={index} className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:bg-white/20 transition-all hover:-translate-y-2">
                <div className="p-8 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-amber-500/50">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-amber-400 font-semibold mb-4">{member.role}</p>
                  <Badge className="mb-4 bg-blue-500/20 text-blue-300">{member.experience}</Badge>
                  <p className="text-sm text-blue-200 leading-relaxed mb-6">{member.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-white text-sm">Specialties:</h4>
                    {member.specialties.map((specialty, idx) => (
                      <div key={idx} className="text-sm text-blue-200 flex items-center justify-center gap-2">
                        <CheckCircle className="w-3 h-3 text-amber-400" />
                        {specialty}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview - Premium Grid */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-amber-100 text-amber-700 hover:bg-amber-100">
              Our Expertise
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">Complete HVAC Solutions</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From emergency repairs to new installations, we provide comprehensive heating, 
              cooling, and ventilation services for residential and commercial properties.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all p-8 hover:-translate-y-2">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/50">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">{service.title}</h3>
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <div className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications - Premium */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-amber-500/20 text-amber-400 hover:bg-amber-500/20">
              Credentials
            </Badge>
            <h2 className="text-4xl font-black text-white mb-4">Licensed, Certified & Insured</h2>
            <p className="text-xl text-blue-100">
              We maintain the highest professional standards and certifications in the industry.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center hover:bg-white/20 transition-all">
                <Shield className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                <h3 className="font-semibold text-white">{cert}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Premium */}
      <section className="py-20 bg-gradient-to-r from-amber-500 to-amber-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
            Ready to Experience the AfterHours Difference?
          </h2>
          <p className="text-xl text-amber-50 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust AfterHours HVAC for all their heating and cooling needs.
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
};

export default About;
