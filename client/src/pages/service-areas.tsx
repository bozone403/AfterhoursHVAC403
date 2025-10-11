import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Mail, 
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  Home,
  Building
} from "lucide-react";
import { Link } from "wouter";

export default function ServiceAreas() {
  const primaryAreas = [
    {
      city: "Calgary",
      population: "1.4M+",
      responseTime: "30-60 min",
      description: "Our headquarters and main service area with the fastest response times",
      features: ["24/7 Emergency Service", "Same-Day Service", "Full Team Coverage"]
    },
    {
      city: "Airdrie",
      population: "74,000+",
      responseTime: "45-90 min",
      description: "Complete HVAC services for residential and commercial properties",
      features: ["Emergency Service", "Scheduled Maintenance", "New Installations"]
    },
    {
      city: "Okotoks",
      population: "32,000+",
      responseTime: "60-90 min",
      description: "Reliable HVAC services for the growing Okotoks community",
      features: ["Residential Service", "Commercial HVAC", "Energy Audits"]
    }
  ];

  const extendedAreas = [
    { name: "Cochrane", time: "60-90 min" },
    { name: "Canmore", time: "90-120 min" },
    { name: "Strathmore", time: "60-90 min" },
    { name: "High River", time: "75-105 min" },
    { name: "Chestermere", time: "45-75 min" },
    { name: "Red Deer", time: "2-3 hours" },
    { name: "Medicine Hat", time: "3-4 hours" },
    { name: "Lethbridge", time: "2.5-3.5 hours" },
    { name: "Camrose", time: "2-3 hours" },
    { name: "Drumheller", time: "90-120 min" },
    { name: "Didsbury", time: "75-105 min" },
    { name: "Olds", time: "90-120 min" }
  ];

  const serviceTypes = [
    {
      icon: Home,
      title: "Residential HVAC",
      description: "Complete home heating and cooling solutions",
      areas: "All service areas"
    },
    {
      icon: Building,
      title: "Commercial HVAC",
      description: "Business and industrial HVAC systems",
      areas: "Calgary, Airdrie, Okotoks"
    },
    {
      icon: Truck,
      title: "Emergency Service",
      description: "24/7 emergency repairs and service",
      areas: "Calgary, Airdrie (24/7), Others (limited hours)"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>HVAC Service Areas Calgary Alberta | AfterHours HVAC Solutions</title>
        <meta name="description" content="Professional HVAC services throughout Calgary, Airdrie, Okotoks, Red Deer, and Southern Alberta. 24/7 emergency service available in primary service areas." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-orange-600 text-white py-20">
        <div className="hvac-container">
          <div className="text-center">
            <Badge className="bg-orange-500 text-white mb-4">
              Southern & Central Alberta
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              HVAC Service Areas
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Professional heating, cooling, and ventilation services throughout Calgary and surrounding areas. 
              Fast response times and reliable service you can count on.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                <Phone className="w-5 h-5 mr-2" />
                Call (403) 613-6014
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900" asChild>
                <Link href="/contact">Get Service Quote</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Service Areas */}
      <section className="py-16">
        <div className="hvac-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Primary Service Areas
            </h2>
            <p className="text-lg text-gray-600">
              Our main service areas with the fastest response times and full service coverage.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {primaryAreas.map((area, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <MapPin className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">{area.city}</h3>
                    <div className="flex justify-center space-x-4 text-sm text-gray-600 mb-2">
                      <span>{area.population}</span>
                      <span>•</span>
                      <span>{area.responseTime}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{area.description}</p>
                  </div>
                  
                  <ul className="space-y-2">
                    {area.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Extended Service Areas */}
      <section className="py-16 bg-blue-50">
        <div className="hvac-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Extended Service Areas
            </h2>
            <p className="text-lg text-gray-600">
              We also serve these communities throughout Southern and Central Alberta.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {extendedAreas.map((area, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{area.name}</h3>
                  <p className="text-sm text-gray-600 flex items-center justify-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {area.time}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Types by Area */}
      <section className="py-16">
        <div className="hvac-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Services by Area
            </h2>
            <p className="text-lg text-gray-600">
              Different service levels available depending on your location.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {serviceTypes.map((service, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <service.icon className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                  <Badge variant="outline" className="text-xs">
                    {service.areas}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Map Info */}
      <section className="py-16 bg-gray-100">
        <div className="hvac-container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Service Area Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardContent className="p-6">
                  <Clock className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold mb-2">Response Times</h3>
                  <p className="text-sm text-gray-600">
                    Response times vary by location and time of day. Emergency services prioritized 24/7 in Calgary and Airdrie.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <Truck className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold mb-2">Travel Charges</h3>
                  <p className="text-sm text-gray-600">
                    No travel charges within Calgary. Reasonable travel fees apply to extended service areas based on distance.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-blue-600 text-white p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Don't See Your Area?</h3>
              <p className="mb-4">
                We're always expanding our service coverage. Contact us to discuss service availability in your area.
              </p>
              <Button className="bg-white text-blue-600 hover:bg-gray-100">
                <Phone className="w-4 h-4 mr-2" />
                Call (403) 613-6014
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="hvac-container text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready for Service?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact us today to schedule service in your area. Fast, reliable HVAC solutions throughout Southern Alberta.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
              <Phone className="w-5 h-5 mr-2" />
              Call (403) 613-6014
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
              <Mail className="w-5 h-5 mr-2" />
              Email Jordan@Afterhourshvac.ca
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}