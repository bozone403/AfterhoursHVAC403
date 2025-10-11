import { Link } from 'wouter';
import { CheckCircle } from 'lucide-react';

const Features = () => {
  return (
    <section className="py-16 bg-charcoal">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Expert Service You Can Trust</h2>
            <p className="text-muted-text mb-6">
              At AfterHours HVAC, we don't just service equipment – we deliver peace of mind. Our team brings decades of combined experience and a commitment to excellence on every job.
            </p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex">
                <CheckCircle className="text-fire h-6 w-6 mt-1 mr-3" />
                <div>
                  <h4 className="font-heading font-semibold text-lg">24/7 Emergency Response</h4>
                  <p className="text-muted-text">We're always available, even when other companies have closed for the day.</p>
                </div>
              </li>
              <li className="flex">
                <CheckCircle className="text-fire h-6 w-6 mt-1 mr-3" />
                <div>
                  <h4 className="font-heading font-semibold text-lg">Licensed & Insured Technicians</h4>
                  <p className="text-muted-text">Our team consists of fully-trained and certified professionals.</p>
                </div>
              </li>
              <li className="flex">
                <CheckCircle className="text-fire h-6 w-6 mt-1 mr-3" />
                <div>
                  <h4 className="font-heading font-semibold text-lg">Upfront, Transparent Pricing</h4>
                  <p className="text-muted-text">No hidden fees or surprise costs – we quote it right the first time.</p>
                </div>
              </li>
              <li className="flex">
                <CheckCircle className="text-fire h-6 w-6 mt-1 mr-3" />
                <div>
                  <h4 className="font-heading font-semibold text-lg">Advanced AI-Assisted Diagnostics</h4>
                  <p className="text-muted-text">Our unique AI system helps diagnose issues faster and more accurately.</p>
                </div>
              </li>
            </ul>
            
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-fire hover:bg-fire/90 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Talk to an Expert
              </Link>
              <a 
                href="https://g.page/r/CQEE3GNkblpDEAI/review" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-5 py-3 border border-gray-700 rounded-md text-base font-medium text-white hover:bg-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Read Our Reviews
              </a>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1000" 
              alt="HVAC technician working on a furnace system" 
              className="rounded-xl shadow-xl w-full"
            />
            <div className="absolute -bottom-4 -right-4 bg-fire text-white px-6 py-4 rounded-lg shadow-lg">
              <div className="text-2xl font-heading font-bold">15+ Years</div>
              <div className="text-sm">Industry Experience</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
