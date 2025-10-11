import { Link } from 'wouter';
import EmergencyForm from './EmergencyForm';

const Hero = () => {
  return (
    <section className="hero-gradient pt-32 pb-24 md:pb-32" id="home">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white text-shadow leading-tight mb-6">
              When everyone else closes, 
              <span className="text-fire ml-2">we keep the heat on.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-text mb-8 max-w-2xl">
              Professional HVAC services for homes and businesses across Alberta. 
              Available 24/7 for all your heating and cooling needs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link href="#quote" className="inline-flex items-center justify-center px-6 py-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-fire hover:bg-fire/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fire transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Get a Free Quote
              </Link>
              <Link 
                to="/service-callout"
                className="inline-flex items-center justify-center px-6 py-4 border border-transparent rounded-md shadow-sm text-base font-medium text-charcoal bg-electric hover:bg-electric/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-electric transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Book a Service Call
              </Link>
            </div>
          </div>
          
          {/* Emergency Form */}
          <div>
            <EmergencyForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
