import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Mail, 
  Star,
  Quote,
  Calendar,
  MapPin,
  ThumbsUp,
  CheckCircle,
  Award,
  Users,
  TrendingUp,
  Clock,
  Sparkles
} from "lucide-react";
import { Link } from "wouter";

export default function Reviews() {
  const featuredReviews = [
    {
      name: "Sarah M.",
      location: "Calgary, AB",
      service: "Furnace Installation",
      rating: 5,
      date: "December 2024",
      review: "Jordan and his team installed our new high-efficiency furnace in November. The work was done professionally, on time, and within budget. Our heating bills have already dropped significantly. Highly recommend AfterHours HVAC!",
      verified: true
    },
    {
      name: "Mike R.",
      location: "Airdrie, AB", 
      service: "Emergency AC Repair",
      rating: 5,
      date: "August 2024",
      review: "Called them on a Sunday when our AC died during the heat wave. Derek was at our house within 2 hours and had us back up and running. Fair pricing and excellent service - these guys are the real deal.",
      verified: true
    },
    {
      name: "Jennifer L.",
      location: "Calgary, AB",
      service: "Annual Maintenance",
      rating: 5,
      date: "October 2024",
      review: "We've been using AfterHours for our annual maintenance for 3 years now. They're always thorough, explain everything clearly, and their preventive approach has saved us from any major breakdowns.",
      verified: true
    },
    {
      name: "Robert T.",
      location: "Okotoks, AB",
      service: "Duct Cleaning",
      rating: 5,
      date: "September 2024",
      review: "Amazing duct cleaning service! They showed us before and after photos - the difference was incredible. Our home's air quality has improved noticeably. Professional team and fair pricing.",
      verified: true
    },
    {
      name: "Lisa K.",
      location: "Calgary, AB",
      service: "Heat Pump Installation",
      rating: 5,
      date: "June 2024",
      review: "Jordan helped us choose the perfect heat pump for our home. The installation was flawless and the team cleaned up everything. Our energy costs have dropped 40% compared to our old system!",
      verified: true
    },
    {
      name: "David W.",
      location: "Calgary, AB",
      service: "Commercial HVAC",
      rating: 5,
      date: "November 2024",
      review: "AfterHours handles all our commercial HVAC needs. They're reliable, professional, and their preventive maintenance has kept our systems running smoothly for years. Great team!",
      verified: true
    }
  ];

  const stats = [
    { number: "4.9/5", label: "Average Rating", icon: Star },
    { number: "500+", label: "5-Star Reviews", icon: ThumbsUp },
    { number: "98%", label: "Customer Satisfaction", icon: CheckCircle },
    { number: "95%", label: "Referral Rate", icon: Users }
  ];

  const platforms = [
    { name: "Google Reviews", rating: "4.9/5", reviews: "200+" },
    { name: "Better Business Bureau", rating: "A+", reviews: "Accredited" },
    { name: "Facebook", rating: "4.8/5", reviews: "150+" },
    { name: "HomeStars", rating: "4.9/5", reviews: "100+" }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
        }`}
        data-testid={`star-${i}`}
      />
    ));
  };

  return (
    <>
      <Helmet>
        <title>Customer Reviews - AfterHours HVAC Calgary | 4.9/5 Star Rating</title>
        <meta name="description" content="Read authentic customer reviews for AfterHours HVAC in Calgary. 4.9/5 star rating with 500+ satisfied customers. See what our clients say about our HVAC services." />
      </Helmet>

      {/* Hero Section - Premium Gradient */}
      <section className="relative min-h-[70vh] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        {/* Premium Badge */}
        <div className="absolute top-8 right-8 z-20">
          <div className="bg-gradient-to-r from-amber-400 to-amber-600 text-white px-6 py-2 rounded-full shadow-xl flex items-center gap-2">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-semibold text-sm">4.9/5 Star Rating</span>
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-6 pt-24 pb-16">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-white/90 text-sm font-medium">Trusted by Calgary Homeowners</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight">
              What Our Customers
              <br />
              <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                Say About Us
              </span>
            </h1>

            <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
              Don't just take our word for it. Read reviews from hundreds of satisfied customers 
              who trust AfterHours HVAC for their heating and cooling needs.
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
                data-testid="button-quote"
              >
                <Link href="/contact">Get Your Quote</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Review Stats */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <Card 
                key={index} 
                className="text-center border-0 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-white"
                data-testid={`stat-card-${index}`}
              >
                <CardContent className="p-8">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br mb-4 ${
                    index === 0 ? 'from-amber-500 to-amber-600' :
                    index === 1 ? 'from-blue-500 to-blue-600' :
                    index === 2 ? 'from-emerald-500 to-emerald-600' :
                    'from-purple-500 to-purple-600'
                  } text-white`}>
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <div className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-slate-600 font-semibold">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Reviews - Premium Cards */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-amber-500/20 text-amber-400 hover:bg-amber-500/20 border-amber-500/30">
              <Quote className="w-3 h-3 mr-1" />
              Featured Testimonials
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              Customer Success Stories
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Real feedback from real customers about their experience with our services
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {featuredReviews.map((review, index) => (
              <Card 
                key={index} 
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl hover:bg-white/20 transition-all hover:scale-105"
                data-testid={`review-card-${index}`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <CardTitle className="text-lg text-white font-bold">{review.name}</CardTitle>
                        <div className="flex items-center text-sm text-blue-200">
                          <MapPin className="w-3 h-3 mr-1" />
                          {review.location}
                        </div>
                      </div>
                    </div>
                    {review.verified && (
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-blue-200">{review.date}</span>
                  </div>
                  
                  <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-400 bg-amber-500/10">
                    {review.service}
                  </Badge>
                </CardHeader>
                
                <CardContent>
                  <div className="relative">
                    <Quote className="w-8 h-8 text-amber-400/30 absolute -top-2 -left-1" />
                    <p className="text-blue-100 leading-relaxed pl-6 italic">
                      "{review.review}"
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Review Platforms */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
              <Award className="w-3 h-3 mr-1" />
              Review Platforms
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
              Find Us Everywhere
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We're proud of our reputation across multiple review platforms
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {platforms.map((platform, index) => (
              <Card 
                key={index} 
                className="text-center border-0 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-white"
                data-testid={`platform-card-${index}`}
              >
                <CardContent className="p-8">
                  <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white mb-4">
                    <Award className="w-8 h-8" />
                  </div>
                  <h3 className="font-black text-slate-900 mb-3 text-lg">{platform.name}</h3>
                  <div className="text-3xl font-black bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent mb-2">
                    {platform.rating}
                  </div>
                  <p className="text-sm text-slate-600 font-semibold">{platform.reviews}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Write a Review */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
              Share Your Experience
            </h2>
            <p className="text-xl text-blue-200 mb-12 max-w-3xl mx-auto">
              Had a great experience with AfterHours HVAC? We'd love to hear about it! 
              Your feedback helps us improve and helps other customers make informed decisions.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all">
                <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white mb-6">
                  <Star className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-white mb-3">Leave a Google Review</h3>
                <p className="text-blue-200 text-sm mb-6">
                  Share your experience on Google to help other local customers find us.
                </p>
                <Button 
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg transition-all hover:scale-105"
                  data-testid="button-google-review"
                >
                  Write Google Review
                </Button>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all">
                <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white mb-6">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-white mb-3">Email Us Feedback</h3>
                <p className="text-blue-200 text-sm mb-6">
                  Send us your thoughts directly and help us continue improving our service.
                </p>
                <Button 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg transition-all hover:scale-105"
                  data-testid="button-email-feedback"
                >
                  Email Feedback
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Highlights */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-100">
              <TrendingUp className="w-3 h-3 mr-1" />
              Customer Insights
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
              What Sets Us Apart
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Common themes from our customer reviews highlight what makes us different
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center border-0 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-white">
              <CardContent className="p-8">
                <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white mb-6">
                  <Clock className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-6">Reliable & Punctual</h3>
                <div className="space-y-4">
                  <p className="text-sm text-slate-600 italic bg-slate-50 p-3 rounded-lg">"Always on time and professional"</p>
                  <p className="text-sm text-slate-600 italic bg-slate-50 p-3 rounded-lg">"Quick response to our emergency call"</p>
                  <p className="text-sm text-slate-600 italic bg-slate-50 p-3 rounded-lg">"Finished the job when promised"</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center border-0 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-white">
              <CardContent className="p-8">
                <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white mb-6">
                  <Award className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-6">Quality Work</h3>
                <div className="space-y-4">
                  <p className="text-sm text-slate-600 italic bg-slate-50 p-3 rounded-lg">"Exceptional attention to detail"</p>
                  <p className="text-sm text-slate-600 italic bg-slate-50 p-3 rounded-lg">"Clean, professional installation"</p>
                  <p className="text-sm text-slate-600 italic bg-slate-50 p-3 rounded-lg">"Work was done perfectly"</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center border-0 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-white">
              <CardContent className="p-8">
                <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white mb-6">
                  <Users className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-6">Honest & Fair</h3>
                <div className="space-y-4">
                  <p className="text-sm text-slate-600 italic bg-slate-50 p-3 rounded-lg">"Fair and transparent pricing"</p>
                  <p className="text-sm text-slate-600 italic bg-slate-50 p-3 rounded-lg">"Honest about what we needed"</p>
                  <p className="text-sm text-slate-600 italic bg-slate-50 p-3 rounded-lg">"No unnecessary upselling"</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section - Premium */}
      <section className="py-20 bg-gradient-to-r from-amber-500 to-amber-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
            Experience the AfterHours Difference
          </h2>
          <p className="text-xl text-amber-50 mb-8 max-w-2xl mx-auto">
            Join hundreds of satisfied customers who trust us for their HVAC needs. 
            See why we're Calgary's highest-rated HVAC company.
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
              data-testid="button-cta-schedule"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Service
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}