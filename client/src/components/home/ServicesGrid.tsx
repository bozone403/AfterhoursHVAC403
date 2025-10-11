import { Link } from 'wouter';

const ServicesGrid = () => {
  return (
    <section className="bg-darkgray py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-header mb-4">HVAC Services That <span className="text-primary">Deliver Results</span></h2>
          <p className="text-lightgray max-w-3xl mx-auto">From emergency repairs to complete system installations, our expert team provides comprehensive solutions for all your heating and cooling needs.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Service Card 1 - Furnace Services */}
          <div className="bg-dark rounded-lg overflow-hidden border border-gray-800 transition-transform hover:transform hover:scale-105">
            <img 
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80" 
              alt="Professional technician installing a modern gas furnace" 
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold font-header">Furnace Services</h3>
                <span className="text-primary"><i className="fas fa-fire text-2xl"></i></span>
              </div>
              <p className="text-lightgray mb-4">Complete furnace installation, repair, and maintenance services to keep your home warm during cold Alberta winters.</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs bg-dark border border-gray-700 rounded-full px-3 py-1">High-Efficiency</span>
                <span className="text-xs bg-dark border border-gray-700 rounded-full px-3 py-1">Repairs</span>
                <span className="text-xs bg-dark border border-gray-700 rounded-full px-3 py-1">24/7 Service</span>
              </div>
              <Link href="/pricing">
                <div className="inline-flex items-center text-secondary hover:text-primary transition-colors font-medium cursor-pointer">
                  View Details <i className="fas fa-arrow-right ml-2"></i>
                </div>
              </Link>
            </div>
          </div>
          
          {/* Service Card 2 - Air Conditioning */}
          <div className="bg-dark rounded-lg overflow-hidden border border-gray-800 transition-transform hover:transform hover:scale-105">
            <img 
              src="https://images.unsplash.com/photo-1631545804013-8b3eb4e9c19d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80" 
              alt="HVAC technician installing outdoor air conditioning condenser unit" 
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold font-header">Air Conditioning</h3>
                <span className="text-secondary"><i className="fas fa-snowflake text-2xl"></i></span>
              </div>
              <p className="text-lightgray mb-4">Keep your home cool and comfortable with our professional AC installation, maintenance, and repair services.</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs bg-dark border border-gray-700 rounded-full px-3 py-1">Installation</span>
                <span className="text-xs bg-dark border border-gray-700 rounded-full px-3 py-1">Refrigerant</span>
                <span className="text-xs bg-dark border border-gray-700 rounded-full px-3 py-1">Efficiency</span>
              </div>
              <Link href="/pricing">
                <div className="inline-flex items-center text-secondary hover:text-primary transition-colors font-medium cursor-pointer">
                  View Details <i className="fas fa-arrow-right ml-2"></i>
                </div>
              </Link>
            </div>
          </div>
          
          {/* Service Card 3 - Maintenance Plans */}
          <div className="bg-dark rounded-lg overflow-hidden border border-gray-800 transition-transform hover:transform hover:scale-105">
            <img 
              src="https://images.unsplash.com/photo-1566489916446-4468b9c3ebcd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80" 
              alt="HVAC technician performing maintenance on air handler unit" 
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold font-header">Maintenance Plans</h3>
                <span className="text-primary"><i className="fas fa-tools text-2xl"></i></span>
              </div>
              <p className="text-lightgray mb-4">Protect your investment with our comprehensive maintenance plans that prevent breakdowns and extend equipment life.</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs bg-dark border border-gray-700 rounded-full px-3 py-1">Annual Service</span>
                <span className="text-xs bg-dark border border-gray-700 rounded-full px-3 py-1">Priority</span>
                <span className="text-xs bg-dark border border-gray-700 rounded-full px-3 py-1">Discounts</span>
              </div>
              <Link href="/pricing">
                <div className="inline-flex items-center text-secondary hover:text-primary transition-colors font-medium cursor-pointer">
                  View Details <i className="fas fa-arrow-right ml-2"></i>
                </div>
              </Link>
            </div>
          </div>
          
          {/* Service Card 4 - New Installations */}
          <div className="bg-dark rounded-lg overflow-hidden border border-gray-800 transition-transform hover:transform hover:scale-105">
            <img 
              src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80" 
              alt="Professional HVAC technician installing new system components" 
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold font-header">New Installations</h3>
                <span className="text-secondary"><i className="fas fa-home text-2xl"></i></span>
              </div>
              <p className="text-lightgray mb-4">Complete HVAC system installations with proper sizing, efficient equipment, and expert setup for optimal performance.</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs bg-dark border border-gray-700 rounded-full px-3 py-1">Energy Efficient</span>
                <span className="text-xs bg-dark border border-gray-700 rounded-full px-3 py-1">Financing</span>
                <span className="text-xs bg-dark border border-gray-700 rounded-full px-3 py-1">Warranties</span>
              </div>
              <Link href="/pricing">
                <div className="inline-flex items-center text-secondary hover:text-primary transition-colors font-medium cursor-pointer">
                  View Details <i className="fas fa-arrow-right ml-2"></i>
                </div>
              </Link>
            </div>
          </div>
          
          {/* Service Card 5 - Emergency Services */}
          <div className="bg-dark rounded-lg overflow-hidden border border-gray-800 transition-transform hover:transform hover:scale-105">
            <img 
              src="https://pixabay.com/get/g5da0ce2151d33b9d12237158849636e464cf84270764c2252a823858805c8e072e65fe1710b97dd41b187444ca89a94999e4c556544ee7f6687aa10fc8834cc8_1280.jpg" 
              alt="Emergency HVAC service" 
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold font-header">Emergency Services</h3>
                <span className="text-primary"><i className="fas fa-exclamation-triangle text-2xl"></i></span>
              </div>
              <p className="text-lightgray mb-4">24/7 emergency HVAC services with rapid response times when you need help most - day or night, weekends or holidays.</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs bg-dark border border-gray-700 rounded-full px-3 py-1">24/7 Response</span>
                <span className="text-xs bg-dark border border-gray-700 rounded-full px-3 py-1">Rapid Service</span>
                <span className="text-xs bg-dark border border-gray-700 rounded-full px-3 py-1">No Heat/AC</span>
              </div>
              <a 
                href="tel:4036136014" 
                className="inline-flex items-center text-secondary hover:text-primary transition-colors font-medium"
              >
                Call Now <i className="fas fa-phone-alt ml-2"></i>
              </a>
            </div>
          </div>
          
          {/* Service Card 6 - Commercial HVAC */}
          <div className="bg-dark rounded-lg overflow-hidden border border-gray-800 transition-transform hover:transform hover:scale-105">
            <img 
              src="https://pixabay.com/get/g39b97a8e661bae04f0b21f14cc0fb140f6da7da8009d3631d572a1f7a7036d055595b0a7180a90741e9fe3f134c3717178ec68fc70180b0206a1b5f6d2e61334_1280.jpg" 
              alt="Commercial HVAC rooftop units" 
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold font-header">Commercial HVAC</h3>
                <span className="text-secondary"><i className="fas fa-building text-2xl"></i></span>
              </div>
              <p className="text-lightgray mb-4">Specialized commercial HVAC solutions for businesses of all sizes, from rooftop units to complete building systems.</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs bg-dark border border-gray-700 rounded-full px-3 py-1">Rooftop Units</span>
                <span className="text-xs bg-dark border border-gray-700 rounded-full px-3 py-1">Tonnage Based</span>
                <span className="text-xs bg-dark border border-gray-700 rounded-full px-3 py-1">Businesses</span>
              </div>
              <Link href="/pricing">
                <div className="inline-flex items-center text-secondary hover:text-primary transition-colors font-medium cursor-pointer">
                  View Details <i className="fas fa-arrow-right ml-2"></i>
                </div>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Link 
            to="/service-callout"
            className="inline-flex items-center bg-primary hover:bg-opacity-80 text-white py-3 px-6 rounded-md transition-all font-semibold shadow-lg"
          >
            <i className="fas fa-calendar-alt mr-2"></i> Schedule a Service Call
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
