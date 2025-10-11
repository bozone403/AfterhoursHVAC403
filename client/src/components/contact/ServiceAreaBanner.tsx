import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

const ServiceAreaBanner = () => {
  const cities = [
    'Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'Medicine Hat', 'Airdrie',
    'Okotoks', 'Cochrane', 'Canmore', 'Banff', 'Camrose', 'Lacombe',
    'Innisfail', 'Olds', 'Didsbury', 'Strathmore', 'High River', 'Turner Valley',
    'Black Diamond', 'Chestermere', 'Rocky View County', 'Foothills County',
    'Mountain View County', 'Drumheller'
  ];

  const [currentCityIndex, setCurrentCityIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCityIndex((prev) => (prev + 1) % cities.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [cities.length]);

  return (
    <div className="bg-gradient-to-r from-slate-800 via-blue-800 to-slate-800 py-4 overflow-hidden border-b border-amber-500/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-2 text-white">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-amber-400" />
            <span className="text-sm md:text-base font-medium">
              Now serving
            </span>
          </div>
          <div className="relative min-w-[150px] h-7 flex items-center justify-center">
            <span 
              key={currentCityIndex}
              className="absolute inset-0 flex items-center justify-center font-black text-base md:text-lg text-amber-400 animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              {cities[currentCityIndex]}
            </span>
          </div>
          <span className="text-sm md:text-base font-medium">
            and surrounding areas
          </span>
        </div>
      </div>
    </div>
  );
};

export default ServiceAreaBanner;
