import { useState } from 'react';
import { Link } from 'wouter';

const CalculatorPreview = () => {
  const [showResults, setShowResults] = useState(false);
  const [formData, setFormData] = useState({
    propertyType: 'residential',
    squareFootage: '',
    currentSystemAge: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('calculator-', '')]: value
    }));
  };

  const handleCalculate = () => {
    // In a real application, we would do actual calculations here
    setShowResults(true);
  };

  const handleReset = () => {
    setFormData({
      propertyType: 'residential',
      squareFootage: '',
      currentSystemAge: ''
    });
    setShowResults(false);
  };

  return (
    <section className="bg-gradient-to-r from-darkgray to-dark py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-header mb-6">Find Your Perfect <span className="text-primary">HVAC Solution</span></h2>
            <p className="text-lightgray mb-6">Our interactive calculators help you find the right HVAC system for your home or business, with accurate estimates and energy savings calculations.</p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="bg-primary rounded-full p-2 mr-4 mt-1">
                  <i className="fas fa-calculator text-white"></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold font-header mb-1">Basic Estimator</h3>
                  <p className="text-lightgray">Get a quick estimate based on your home size and current system.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary rounded-full p-2 mr-4 mt-1">
                  <i className="fas fa-bolt text-white"></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold font-header mb-1">Energy Savings Calculator</h3>
                  <p className="text-lightgray">See how much you could save by upgrading to a high-efficiency system.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary rounded-full p-2 mr-4 mt-1">
                  <i className="fas fa-crown text-white"></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold font-header mb-1">Pro Calculator</h3>
                  <p className="text-lightgray">Advanced calculator with Alberta pricing, load calculations, and detailed quotes.</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/calculators">
                <div className="bg-secondary hover:bg-opacity-80 text-white py-3 px-6 rounded-md transition-all font-semibold shadow-lg cursor-pointer">
                  Try Free Calculator
                </div>
              </Link>
              <Link href="/pro-calculator">
                <div className="bg-dark border border-primary text-primary hover:bg-primary hover:text-white py-3 px-6 rounded-md transition-all font-semibold cursor-pointer">
                  Upgrade to Pro
                </div>
              </Link>
            </div>
          </div>
          
          {/* Calculator Preview */}
          <div className="bg-darkgray rounded-lg shadow-xl overflow-hidden border border-gray-700">
            <div className="bg-dark px-6 py-4 border-b border-gray-700">
              <h3 className="text-xl font-bold font-header text-white">HVAC Energy Savings Calculator</h3>
            </div>
            
            <div className="p-6">
              <form id="calculator-preview" className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-lightgray mb-1">Property Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`bg-dark rounded-md p-4 border ${formData.propertyType === 'residential' ? 'border-primary' : 'border-gray-700'} cursor-pointer hover:border-primary transition-colors`}
                         onClick={() => setFormData(prev => ({ ...prev, propertyType: 'residential' }))}>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          name="property-type" 
                          id="calculator-residential" 
                          className="mr-3" 
                          checked={formData.propertyType === 'residential'}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="calculator-residential" className="cursor-pointer">
                          <div className="font-medium">Residential</div>
                          <div className="text-xs text-lightgray">Homes & Condos</div>
                        </label>
                      </div>
                    </div>
                    
                    <div className={`bg-dark rounded-md p-4 border ${formData.propertyType === 'commercial' ? 'border-primary' : 'border-gray-700'} cursor-pointer hover:border-primary transition-colors`}
                         onClick={() => setFormData(prev => ({ ...prev, propertyType: 'commercial' }))}>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          name="property-type" 
                          id="calculator-commercial" 
                          className="mr-3"
                          checked={formData.propertyType === 'commercial'}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="calculator-commercial" className="cursor-pointer">
                          <div className="font-medium">Commercial</div>
                          <div className="text-xs text-lightgray">Offices & Retail</div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="calculator-squareFootage" className="block text-sm font-medium text-lightgray mb-1">Square Footage</label>
                  <input 
                    type="number" 
                    id="calculator-squareFootage" 
                    placeholder="Enter square feet" 
                    className="w-full bg-dark border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.squareFootage}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="calculator-currentSystemAge" className="block text-sm font-medium text-lightgray mb-1">Current System Age</label>
                  <select 
                    id="calculator-currentSystemAge" 
                    className="w-full bg-dark border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.currentSystemAge}
                    onChange={handleInputChange}
                  >
                    <option value="">Select age range</option>
                    <option value="0-5">0-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="11-15">11-15 years</option>
                    <option value="16+">16+ years</option>
                  </select>
                </div>
                
                <div className="flex justify-between pt-4">
                  <button 
                    type="button" 
                    className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-all font-medium"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                  <button 
                    type="button" 
                    className="bg-primary hover:bg-opacity-80 text-white py-2 px-4 rounded-md transition-all font-medium"
                    onClick={handleCalculate}
                  >
                    Calculate Savings
                  </button>
                </div>
                
                {showResults && (
                  <div id="calculator-results" className="mt-6 p-4 bg-dark border border-gray-700 rounded-lg">
                    <h4 className="font-bold mb-3 font-header text-lg">Estimated Annual Savings</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-lightgray">Current Annual Cost</p>
                        <p className="text-xl font-semibold text-white">$2,400</p>
                      </div>
                      <div>
                        <p className="text-sm text-lightgray">New System Annual Cost</p>
                        <p className="text-xl font-semibold text-secondary">$1,680</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-lightgray">Annual Savings</p>
                          <p className="text-2xl font-bold text-primary">$720</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-lightgray">ROI Timeline</p>
                          <p className="text-lg font-semibold text-white">6.8 years</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalculatorPreview;
