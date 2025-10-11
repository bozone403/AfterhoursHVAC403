import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { 
  Flame, 
  Snowflake, 
  Wrench, 
  ShieldCheck, 
  ThermometerSun,
  Wind,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface ServiceImage {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  category: string;
}

const defaultServices = [
  {
    title: 'Furnace Installation & Repair',
    description: 'High-efficiency furnace installation and emergency repair services',
    icon: Flame,
    features: ['24/7 Emergency Service', 'Energy Efficient Models', '10-Year Warranty'],
    badge: 'Popular',
    link: '/services/furnace'
  },
  {
    title: 'Air Conditioning Services',
    description: 'Complete AC installation, maintenance, and repair solutions',
    icon: Snowflake,
    features: ['Same-Day Service', 'Energy Star Certified', 'Free Estimates'],
    badge: 'Summer Ready',
    link: '/services/air-conditioning'
  },
  {
    title: 'Preventive Maintenance',
    description: 'Comprehensive HVAC system maintenance and tune-up services',
    icon: Wrench,
    features: ['Annual Inspections', 'Performance Optimization', 'Priority Scheduling'],
    badge: 'Recommended',
    link: '/services/maintenance'
  },
  {
    title: 'Ductwork Services',
    description: 'Duct cleaning, sealing, and installation for optimal airflow',
    icon: Wind,
    features: ['Improved Air Quality', 'Energy Savings', 'Professional Installation'],
    badge: 'Air Quality',
    link: '/services/ductwork'
  },
  {
    title: 'Commercial HVAC',
    description: 'Complete commercial heating and cooling system solutions',
    icon: Settings,
    features: ['Rooftop Units', 'Scheduled Maintenance', 'Energy Management'],
    badge: 'Business',
    link: '/services/commercial'
  },
  {
    title: 'Heat Pump Services',
    description: 'Efficient heat pump installation and maintenance services',
    icon: ThermometerSun,
    features: ['Year-Round Comfort', 'Energy Efficient', 'Quiet Operation'],
    badge: 'Eco-Friendly',
    link: '/services/heat-pumps'
  }
];

const ServicesCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Fetch service images from admin gallery
  const { data: serviceImages } = useQuery<ServiceImage[]>({
    queryKey: ['/api/gallery/services'],
    retry: false
  });

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % defaultServices.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % defaultServices.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + defaultServices.length) % defaultServices.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  // Get image for service from admin gallery or use default
  const getServiceImage = (serviceTitle: string) => {
    const adminImage = serviceImages?.find(img => 
      img.title.toLowerCase().includes(serviceTitle.toLowerCase().split(' ')[0])
    );
    return adminImage?.imageUrl || '/api/placeholder/400/300';
  };

  return (
    <section className="bg-dark py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-header mb-4">Our HVAC Services</h2>
          <p className="text-lightgray text-lg max-w-3xl mx-auto">
            Professional heating, ventilation, and air conditioning services for residential and commercial properties in Calgary and surrounding areas.
          </p>
        </div>
        
        {/* Carousel Container */}
        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden rounded-xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {defaultServices.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <div key={index} className="w-full flex-shrink-0 px-2">
                    <Card className="bg-darkgray border-gray-700 h-full">
                      <div className="relative">
                        <img 
                          src={getServiceImage(service.title)}
                          alt={service.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80`;
                          }}
                        />
                        <div className="absolute top-4 left-4">
                          {service.badge && (
                            <Badge variant="outline" className="border-primary text-primary bg-dark/80">
                              {service.badge}
                            </Badge>
                          )}
                        </div>
                        <div className="absolute top-4 right-4 p-3 bg-primary/10 backdrop-blur-sm rounded-full">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                        <p className="text-lightgray text-sm mb-4 leading-relaxed">
                          {service.description}
                        </p>
                        
                        <ul className="space-y-2 mb-6">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center text-sm text-lightgray">
                              <ShieldCheck className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        
                        <Link href={service.link}>
                          <Button className="w-full bg-primary hover:bg-primarydark text-dark font-medium">
                            Learn More
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-dark/80 hover:bg-dark border border-gray-600 rounded-full p-2 transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-dark/80 hover:bg-dark border border-gray-600 rounded-full p-2 transition-colors"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </div>
        
        {/* Dots Navigation */}
        <div className="flex justify-center mt-8 space-x-2">
          {defaultServices.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-primary' : 'bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/services">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-dark">
              View All Services
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesCarousel;