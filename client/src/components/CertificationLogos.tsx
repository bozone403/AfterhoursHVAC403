import { Shield, Award, Star, CheckCircle, Zap, Clock } from "lucide-react";

const CertificationLogos = () => {
  const certifications = [
    {
      name: "WCB Alberta",
      logo: (
        <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center shadow-lg">
          <Shield className="w-8 h-8 text-white" />
        </div>
      ),
      description: "Workers' Compensation Board Alberta Certified"
    },
    {
      name: "BBB Accredited",
      logo: (
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
          <Award className="w-8 h-8 text-white" />
        </div>
      ),
      description: "Better Business Bureau A+ Rating"
    },
    {
      name: "Alberta Safety",
      logo: (
        <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl flex items-center justify-center shadow-lg">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
      ),
      description: "Alberta Safety Codes Officer Certified"
    },
    {
      name: "Energy Star",
      logo: (
        <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
          <Zap className="w-8 h-8 text-white" />
        </div>
      ),
      description: "ENERGY STAR Partner"
    },
    {
      name: "24/7 Service",
      logo: (
        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
          <Clock className="w-8 h-8 text-white" />
        </div>
      ),
      description: "24/7 Emergency Service Available"
    },
    {
      name: "Google Reviews",
      logo: (
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Star className="w-8 h-8 text-white" />
        </div>
      ),
      description: "5.0 Star Google Rating"
    }
  ];

  return (
    <div className="bg-white py-16 border-t border-gray-100">
      <div className="hvac-container">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Licensed, Certified & Trusted</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Fully licensed and insured with all necessary certifications to provide safe, 
            professional HVAC services throughout Calgary and Alberta.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {certifications.map((cert, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              <div className="mb-4 transform transition-transform duration-300 group-hover:scale-110">
                {cert.logo}
              </div>
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">{cert.name}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{cert.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 bg-green-50 text-green-800 px-6 py-3 rounded-full border border-green-200">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Fully Licensed & Insured</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificationLogos;