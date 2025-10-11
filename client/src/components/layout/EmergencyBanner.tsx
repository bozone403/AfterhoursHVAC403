import React from 'react';
import { Link } from 'wouter';

const EmergencyBanner = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-primary text-white py-3 z-40">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-3 md:mb-0">
            <i className="fas fa-exclamation-triangle text-xl mr-3"></i>
            <span className="font-semibold">24/7 Emergency HVAC Service Available</span>
          </div>
          <div className="flex space-x-4">
            <a 
              href="tel:4036136014" 
              className="bg-white text-primary hover:bg-lightgray py-2 px-4 rounded-md transition-all font-semibold"
            >
              <i className="fas fa-phone-alt mr-2"></i> Call Now
            </a>
            <Link href="/contact">
              <a className="bg-dark text-white hover:bg-opacity-80 py-2 px-4 rounded-md transition-all font-semibold">
                Message Us
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyBanner;
