import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import * as LucideIcons from "lucide-react";
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
  Building2,
  User
} from "lucide-react";

const About = () => {
  // Fetch team members from database
  const { data: teamMembers = [], isLoading: teamLoading } = useQuery({
    queryKey: ["/api/team"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/team");
      return response.json();
    }
  });

  // Helper function to get icon component by name
  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      Building2: LucideIcons.Building2,
      Home: LucideIcons.Home,
      Bot: LucideIcons.Bot,
      User: LucideIcons.User,
      Wrench: LucideIcons.Wrench,
      Settings: LucideIcons.Settings,
      Users: LucideIcons.Users,
      Shield: LucideIcons.Shield,
      Award: LucideIcons.Award,
      Star: LucideIcons.Star,
      ThermometerSun: LucideIcons.ThermometerSun,
      Snowflake: LucideIcons.Snowflake,
      Wind: LucideIcons.Wind,
      Zap: LucideIcons.Zap,
      Target: LucideIcons.Target,
      TrendingUp: LucideIcons.TrendingUp
    };
    return icons[iconName] || LucideIcons.User;
  };

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

  return (
    <>
      <Helmet>
        <title>About AfterHours HVAC - Calgary's Trusted HVAC Experts Since 2009</title>
        <meta name="description" content="Learn about AfterHours HVAC's 15+ year journey serving Calgary. Meet our team of certified technicians and discover our commitment to quality, reliability, and innovation." />
        <meta name="keywords" content="about afterhours hvac, calgary hvac company, hvac technicians calgary, jordan boisclair, derek thompson, earl ai" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-orange-500/10"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-6 bg-orange-500 text-white px-6 py-2 text-lg font-bold">
                Building Calgary's Comfort Legacy Since 2009
              </Badge>
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-tight">
                Building Calgary's 
                <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent"> Comfort Legacy</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                AfterHours HVAC started with one man, one van, and a promise — to show up when others wouldn't. 
                Founded in 2009 by Jordan Boisclair, the company built its reputation on reliability, craftsmanship, and word-of-mouth trust.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-red-600 mb-8"></div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8">Our Story</h2>
                <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                  <p>
                    Fifteen years later, we're proud to serve thousands of homes and businesses across Southern Alberta, 
                    offering honest advice, clean installs, and 24/7 service that actually answers the phone.
                  </p>
                  <p>
                    What began as "helping neighbors after hours" has become a professional team that brings precision, 
                    pride, and purpose to every job we take on.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-500 to-orange-500 rounded-3xl p-8 text-white">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="text-center">
                      <div className="text-4xl font-black mb-2">15+</div>
                      <div className="text-blue-100">Years Experience</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-black mb-2">5000+</div>
                      <div className="text-blue-100">Happy Customers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-black mb-2">24/7</div>
                      <div className="text-blue-100">Emergency Service</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-black mb-2">100%</div>
                      <div className="text-blue-100">Licensed & Insured</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission, Vision & Values */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8">Our Mission, Vision & Values</h2>
            </div>
            
            {/* Mission & Vision */}
            <div className="grid md:grid-cols-2 gap-12 mb-20">
              <div className="bg-white rounded-3xl p-8 shadow-xl">
                <h3 className="text-2xl font-black text-gray-900 mb-4">Mission</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  To keep Calgary's homes and businesses running comfortably through craftsmanship, integrity, and innovation.
                </p>
              </div>
              <div className="bg-white rounded-3xl p-8 shadow-xl">
                <h3 className="text-2xl font-black text-gray-900 mb-4">Vision</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  To redefine what local HVAC service feels like — modern, efficient, and human.
                </p>
              </div>
            </div>

            {/* Core Values */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Meet the Team */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8">Meet the Team</h2>
              <p className="text-xl text-gray-600">
                The professionals behind Calgary's most reliable HVAC service
              </p>
            </div>

            {teamLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading team members...</p>
              </div>
            ) : teamMembers.length > 0 ? (
              <>
                {/* Group by department if multiple departments exist */}
                {Array.from(new Set(teamMembers.map((m: any) => m.department || 'General'))).map((department) => {
                  const deptMembers = teamMembers.filter((m: any) => (m.department || 'General') === department);
                  return (
                    <div key={department} className="mb-16">
                      {teamMembers.some((m: any) => m.department && m.department !== 'General') && (
                        <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">{department}</h3>
                      )}
                      <div className="grid lg:grid-cols-3 gap-8">
                        {deptMembers.map((member: any) => {
                          const IconComponent = getIconComponent(member.iconName || 'User');
                          const isAI = member.name?.toLowerCase().includes('earl') || member.iconName === 'Bot';
                          
                          return (
                            <div key={member.id} className={`bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 group ${isAI ? 'ring-2 ring-orange-500 ring-opacity-50' : ''}`}>
                              {member.photoUrl ? (
                                <img 
                                  src={member.photoUrl} 
                                  alt={member.name}
                                  className="w-20 h-20 rounded-2xl object-cover mb-6 group-hover:scale-110 transition-transform duration-300"
                                />
                              ) : (
                                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.iconColor || 'from-blue-600 to-blue-800'} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${isAI ? 'animate-pulse' : ''}`}>
                                  <IconComponent className="w-10 h-10 text-white" />
                                </div>
                              )}
                              <h3 className="text-2xl font-black text-gray-900 mb-2">{member.name}</h3>
                              <p className="text-orange-600 font-bold mb-4">{member.role}</p>
                              <p className="text-gray-600 leading-relaxed">{member.description}</p>
                              {member.experience && (
                                <p className="text-sm text-gray-500 mt-3">
                                  <strong>Experience:</strong> {member.experience}
                                </p>
                              )}
                              {member.specialties && (
                                <p className="text-sm text-gray-500 mt-2">
                                  <strong>Specialties:</strong> {member.specialties}
                                </p>
                              )}
                              {isAI && (
                                <div className="mt-4 flex items-center space-x-2">
                                  <Sparkles className="w-4 h-4 text-orange-500" />
                                  <span className="text-sm text-orange-600 font-semibold">AI Innovation</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="text-center py-12 text-gray-600">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p>Team information coming soon!</p>
              </div>
            )}
          </div>
        </section>

        {/* Our Edge */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-black mb-8">Old-School Service Meets New-School Tech</h2>
              <p className="text-xl text-slate-300 leading-relaxed">
                We combine hands-on experience with digital precision. Every install, inspection, and service call 
                benefits from real-world skill backed by AI-assisted data and diagnostics.
              </p>
            </div>
          </div>
        </section>

        {/* Join the Team CTA */}
        <section className="py-20 bg-gradient-to-br from-orange-500 to-red-600 text-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-black mb-8">Join the Team</h2>
              <p className="text-xl text-orange-100 mb-8 leading-relaxed">
                Think you've got what it takes to join Calgary's most reliable HVAC team?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 font-bold shadow-xl hover:scale-105 transition-all" asChild>
                  <Link href="/careers">
                    <Users className="w-5 h-5 mr-2" />
                    View Careers
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-orange-600 font-bold transition-all hover:scale-105">
                  <Mail className="w-5 h-5 mr-2" />
                  Careers@Afterhourshvac.ca
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
