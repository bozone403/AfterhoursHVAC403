import { useState } from 'react';
import { Star } from 'lucide-react';

interface Testimonial {
  id: number;
  text: string;
  author: string;
  location: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    text: "AfterHours HVAC saved us during a brutal cold snap when our furnace died at 2am. They answered immediately and had a tech at our house within the hour. Incredible service when we needed it most.",
    author: "Michael S.",
    location: "Calgary, AB",
    rating: 5,
  },
  {
    id: 2,
    text: "The attention to detail during our commercial HVAC installation was impressive. The team was professional, kept the workspace clean, and completed the job ahead of schedule. Our tenants haven't had a single complaint.",
    author: "Jennifer T.",
    location: "Property Manager, Lethbridge",
    rating: 5,
  },
  {
    id: 3,
    text: "Their maintenance plan has been worth every penny. Our system runs perfectly year-round, and they've caught small issues before they became expensive problems. The techs are always friendly and knowledgeable.",
    author: "Robert L.",
    location: "Coaldale, AB",
    rating: 5,
  },
  {
    id: 4,
    text: "We've used AfterHours for both our home and office HVAC systems. Their prices are fair, their work is excellent, and I appreciate that they explain everything clearly without the technical jargon.",
    author: "Sarah M.",
    location: "Taber, AB",
    rating: 5,
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section className="py-16 bg-dark-charcoal">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">What Our Customers Say</h2>
          <p className="text-muted-text max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers have to say about our services.
          </p>
        </div>
        
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <div 
                key={testimonial.id} 
                className="bg-dark-card border border-gray-700 rounded-xl p-6"
              >
                <div className="flex text-electric mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="fill-current" size={16} />
                  ))}
                </div>
                <p className="text-muted-text mb-4">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                    <span className="text-white font-medium">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold">{testimonial.author}</h4>
                    <p className="text-sm text-muted-text">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-center space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === activeIndex ? 'bg-electric' : 'bg-gray-700'
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <a 
            href="https://g.page/r/CQEE3GNkblpDEAI/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-5 py-3 border border-gray-700 rounded-md text-base font-medium text-white hover:bg-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View All Google Reviews
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
