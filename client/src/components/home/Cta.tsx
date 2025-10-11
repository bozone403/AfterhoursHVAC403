import { Link } from 'wouter';
import { PhoneCall, MessageSquare, Zap, Bolt, Shield } from 'lucide-react';

const Cta = () => {
  return (
    <section className="relative py-20 bg-cta-pattern bg-cover bg-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6 text-white">Need Emergency HVAC Service?</h2>
        <p className="text-xl text-muted-text mb-10 max-w-3xl mx-auto">
          Don't wait in the cold. Our technicians are available 24/7 to keep your home comfortable.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <a 
            href="tel:4036136014"
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-fire hover:bg-fire/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fire transition-colors"
          >
            <PhoneCall className="h-5 w-5 mr-2" />
            Call (403) 613-6014
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-charcoal bg-electric hover:bg-electric/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-electric transition-colors"
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            Message Us
          </Link>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8">
          <div className="flex items-center">
            <Zap className="text-fire h-5 w-5 mr-3" />
            <span className="text-white">Fast Response Times</span>
          </div>
          <div className="flex items-center">
            <Bolt className="text-fire h-5 w-5 mr-3" />
            <span className="text-white">Expert Technicians</span>
          </div>
          <div className="flex items-center">
            <Shield className="text-fire h-5 w-5 mr-3" />
            <span className="text-white">Guaranteed Workmanship</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;
