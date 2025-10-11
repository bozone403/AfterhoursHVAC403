import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Quote, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  verified: boolean;
}

const reviews: Review[] = [
  {
    id: '1',
    author: 'Sarah Thompson',
    rating: 5,
    date: '2 weeks ago',
    text: 'AfterHours HVAC saved the day! Our furnace broke down on Christmas Eve and they had a technician out within 2 hours. Professional, honest pricing, and got us warm again quickly. Highly recommend!',
    verified: true
  },
  {
    id: '2',
    author: 'Mike Rodriguez',
    rating: 5,
    date: '1 month ago',
    text: 'Outstanding service from start to finish. Installed a new high-efficiency furnace and AC system. The team was clean, punctual, and explained everything clearly. Great value for money.',
    verified: true
  },
  {
    id: '3',
    author: 'Jennifer Lee',
    rating: 5,
    date: '3 weeks ago',
    text: 'Called them for emergency AC repair in the middle of summer. Arrived same day, diagnosed the issue quickly, and had parts on the truck. Fixed and running in under 2 hours!',
    verified: true
  },
  {
    id: '4',
    author: 'David Wilson',
    rating: 5,
    date: '1 week ago',
    text: 'Professional installation of our new heat pump. Jordan and his team were fantastic - on time, clean work area, and took time to explain the system. Couldn\'t be happier!',
    verified: true
  },
  {
    id: '5',
    author: 'Lisa Chen',
    rating: 5,
    date: '2 months ago',
    text: 'Best HVAC company in Calgary! Fixed our ductwork issues and improved our home\'s efficiency dramatically. Fair pricing and excellent workmanship.',
    verified: true
  },
  {
    id: '6',
    author: 'Robert Johnson',
    rating: 5,
    date: '3 weeks ago',
    text: 'Emergency furnace repair on a -30°C day. AfterHours had someone out within an hour and got our heat back on. Truly appreciate their 24/7 service!',
    verified: true
  }
];

const GoogleReviews = () => {
  const averageRating = 4.9;
  const totalReviews = 127;
  const [currentIndex, setCurrentIndex] = useState(0);
  const reviewsPerPage = 3;

  const nextReviews = () => {
    setCurrentIndex((prev) => 
      prev + reviewsPerPage >= reviews.length ? 0 : prev + reviewsPerPage
    );
  };

  const prevReviews = () => {
    setCurrentIndex((prev) => 
      prev - reviewsPerPage < 0 ? Math.max(0, reviews.length - reviewsPerPage) : prev - reviewsPerPage
    );
  };

  useEffect(() => {
    const interval = setInterval(nextReviews, 5000);
    return () => clearInterval(interval);
  }, []);

  const visibleReviews = reviews.slice(currentIndex, currentIndex + reviewsPerPage);

  return (
    <section className="bg-slate-900 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-blue-600/10 border border-blue-600/20 rounded-full px-4 py-2 mb-4">
            <Star className="h-4 w-4 text-blue-400 mr-2" />
            <span className="text-blue-400 text-sm font-medium">Customer Reviews</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">What Our Customers Say</h2>
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="flex items-center space-x-1">
              {[1,2,3,4,5].map(star => (
                <Star key={star} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <div className="text-white">
              <span className="text-2xl font-bold">{averageRating}</span>
              <span className="text-slate-400 ml-2">({totalReviews} reviews)</span>
            </div>
          </div>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Trusted by homeowners and businesses across Alberta for reliable HVAC solutions
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {visibleReviews.map((review) => (
                <Card key={review.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        {[1,2,3,4,5].map(star => (
                          <Star 
                            key={star} 
                            className={`h-4 w-4 ${star <= review.rating 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                      {review.verified && (
                        <Badge variant="outline" className="border-green-500 text-green-400 text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <Quote className="h-5 w-5 text-blue-400 mb-2" />
                      <p className="text-slate-300 text-sm leading-relaxed">{review.text}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white text-sm">{review.author}</p>
                        <p className="text-slate-400 text-xs">{review.date}</p>
                      </div>
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {review.author.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={prevReviews}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-slate-800/80 hover:bg-slate-700 text-white p-2 rounded-full transition-all border border-slate-600"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextReviews}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-800/80 hover:bg-slate-700 text-white p-2 rounded-full transition-all border border-slate-600"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dots indicator */}
          <div className="flex justify-center space-x-2 mt-6">
            {Array.from({ length: Math.ceil(reviews.length / reviewsPerPage) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * reviewsPerPage)}
                className={`w-2 h-2 rounded-full transition-all ${
                  Math.floor(currentIndex / reviewsPerPage) === index
                    ? 'bg-blue-400'
                    : 'bg-slate-600 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <a 
            href="https://www.google.com/search?q=AfterHours+HVAC+Calgary+reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all font-semibold"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View All Google Reviews
          </a>
        </div>
      </div>
    </section>
  );
};

export default GoogleReviews;