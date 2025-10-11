import { Link } from 'wouter';

const BeforeAfterGallery = () => {
  return (
    <section id="gallery" className="bg-dark py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-header mb-4">Our Work <span className="text-primary">Before & After</span></h2>
          <p className="text-lightgray max-w-3xl mx-auto">See the difference our professional HVAC installations and upgrades make for our customers.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Before/After Project 1 */}
          <div className="bg-darkgray rounded-lg overflow-hidden">
            <div className="relative">
              <img 
                src="https://pixabay.com/get/g3c94d93e57dbb0472cfd4aa2ac901fdf660dffb8c1982d6ff3de24b5d8d59d16dbba7f5aec6fad5eb551975de29605fe37dd0db0968c3d12a0b2e0b9fdaaa3df_1280.jpg" 
                alt="Old furnace before replacement" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-0 left-0 bg-dark bg-opacity-75 text-white px-4 py-2 rounded-br-lg">
                <span className="font-medium">Before</span>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://pixabay.com/get/gae1425309f073f0b194ac7b3fd0af7cd0626194efe016524bbaa1dba2f2f0976c0a04d8093245a55af3a815e574190507fcbd366ffb6e4bab41e203a0f12850a_1280.jpg" 
                alt="New high-efficiency furnace installation" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-0 left-0 bg-primary text-white px-4 py-2 rounded-br-lg">
                <span className="font-medium">After</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold font-header mb-2">High-Efficiency Furnace Upgrade</h3>
              <p className="text-lightgray mb-3">Replaced an outdated 80% efficiency furnace with a new 96% high-efficiency model in Coaldale.</p>
              <div className="flex justify-between items-center">
                <span className="text-white font-medium">Coaldale, AB</span>
                <span className="text-secondary">Energy Savings: 30%</span>
              </div>
            </div>
          </div>
          
          {/* Before/After Project 2 */}
          <div className="bg-darkgray rounded-lg overflow-hidden">
            <div className="relative">
              <img 
                src="https://pixabay.com/get/g3876d21c96bb5e4d0e4d1a3d7792145ebdec3edcfef8836368aa086f3e32ff8bc45f0e3e7ac749270e7c51cedfe1147cad8e2b8639ca1eda122ed0f4b7703fd0_1280.jpg" 
                alt="Old commercial rooftop unit" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-0 left-0 bg-dark bg-opacity-75 text-white px-4 py-2 rounded-br-lg">
                <span className="font-medium">Before</span>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80" 
                alt="New commercial rooftop HVAC unit" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-0 left-0 bg-primary text-white px-4 py-2 rounded-br-lg">
                <span className="font-medium">After</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold font-header mb-2">Commercial Rooftop RTU Replacement</h3>
              <p className="text-lightgray mb-3">Upgraded a failing 10-ton rooftop unit with a new high-efficiency system for a retail space in Calgary.</p>
              <div className="flex justify-between items-center">
                <span className="text-white font-medium">Calgary, AB</span>
                <span className="text-secondary">Cooling Capacity: +25%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Link href="/gallery">
            <div className="inline-flex items-center bg-secondary hover:bg-opacity-80 text-white py-3 px-6 rounded-md transition-all font-semibold shadow-lg cursor-pointer">
              <i className="fas fa-image mr-2"></i> View More Projects
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterGallery;
