import React from 'react';
import { Link } from 'wouter';
import { Calendar, ChevronRight, ArrowLeft } from 'lucide-react';
import SEO from '@/lib/seo';

const PrepareFurnacePost = () => {
  return (
    <>
      <SEO 
        title="How to Prepare Your Furnace for Winter | AfterHours HVAC"
        description="Learn essential maintenance steps to ensure your furnace runs efficiently and reliably throughout Alberta's harsh winter months. Expert tips from AfterHours HVAC."
        ogType="article"
      />
      
      <main>
        {/* Hero Section */}
        <section className="bg-dark-charcoal py-24">
          <div className="container mx-auto px-4">
            <nav className="py-4">
              <ol className="flex flex-wrap text-sm">
                <li className="flex items-center">
                  <Link href="/" className="text-muted-text hover:text-white transition-colors">Home</Link>
                  <ChevronRight className="h-4 w-4 mx-2 text-gray-500" />
                </li>
                <li className="flex items-center">
                  <Link href="/blog" className="text-muted-text hover:text-white transition-colors">Blog</Link>
                  <ChevronRight className="h-4 w-4 mx-2 text-gray-500" />
                </li>
                <li className="text-white">How to Prepare Your Furnace for Winter</li>
              </ol>
            </nav>
          </div>
        </section>

        {/* Blog Post Content */}
        <section className="py-16 bg-charcoal">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <Calendar className="h-5 w-5 text-muted-text mr-2" />
                  <span className="text-muted-text">October 15, 2023</span>
                  <span className="mx-2 text-muted-text">•</span>
                  <span className="text-electric">Maintenance</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                  How to Prepare Your Furnace for Winter
                </h1>
                
                <p className="text-xl text-muted-text">
                  Essential maintenance steps to ensure your heating system runs efficiently and reliably 
                  throughout the cold Alberta winter months.
                </p>
              </div>
              
              <div className="mb-10">
                <img 
                  src="https://pixabay.com/get/gd704f629eabb27369580872fd258f6576303c8ecdd0717d1ee6c79adf02e86831601b543032a352854921cc73aa8a07148b50323133ec3404c13c617365e13bc_1280.jpg" 
                  alt="Furnace maintenance being performed by a technician" 
                  className="w-full h-auto rounded-xl"
                />
              </div>
              
              <div className="prose prose-lg prose-invert max-w-none">
                <p>
                  As Alberta's temperatures begin to drop, it's crucial to ensure your heating system is 
                  ready for the demands of winter. A properly maintained furnace not only provides reliable 
                  warmth but also operates more efficiently, saving you money on energy bills and preventing 
                  costly mid-winter breakdowns.
                </p>
                
                <h2>Why Furnace Preparation Matters</h2>
                
                <p>
                  In our years of service across Alberta, we've seen countless emergency calls that could have 
                  been prevented with simple maintenance. When temperatures plummet below -30°C, the last thing 
                  you want is a furnace failure. Preventative maintenance isn't just about comfort—it's about safety 
                  and protecting your home during our harsh Canadian winters.
                </p>
                
                <h2>DIY Furnace Maintenance Checklist</h2>
                
                <p>Before calling in the professionals, there are several maintenance tasks homeowners can perform:</p>
                
                <h3>1. Replace or Clean Air Filters</h3>
                
                <p>
                  This is the single most important maintenance task you can do yourself. Dirty filters restrict 
                  airflow, reduce efficiency, and can even cause your furnace to overheat.
                </p>
                
                <ul>
                  <li>For standard 1-inch filters: Replace every 1-3 months during heating season</li>
                  <li>For thicker media filters: Replace every 6-12 months</li>
                  <li>For washable filters: Clean according to manufacturer instructions</li>
                </ul>
                
                <h3>2. Clear Area Around Furnace</h3>
                
                <p>
                  Ensure the area around your furnace is clear of dust, debris, and stored items. Your furnace 
                  needs proper airflow and presents a fire hazard if flammable items are stored nearby.
                </p>
                
                <h3>3. Check Vents and Returns</h3>
                
                <p>
                  Make sure all supply vents and cold air returns in your home are open and unblocked by furniture, 
                  rugs, or curtains. Blocked vents can create pressure imbalances that reduce system efficiency.
                </p>
                
                <h3>4. Test Your Thermostat</h3>
                
                <p>
                  Before the first cold snap, test your thermostat by setting it to heat mode and raising the 
                  temperature setting. Your furnace should start within a minute or two. Consider upgrading to a 
                  programmable or smart thermostat for better energy management.
                </p>
                
                <h3>5. Check Carbon Monoxide Detectors</h3>
                
                <p>
                  Ensure all carbon monoxide detectors in your home are working properly with fresh batteries. 
                  This safety step is critical with any gas-burning furnace.
                </p>
                
                <h2>Professional Maintenance is Essential</h2>
                
                <p>
                  While DIY maintenance is important, an annual professional inspection and tune-up is crucial 
                  for optimal performance and safety. Our professional technicians will:
                </p>
                
                <ul>
                  <li>Inspect the heat exchanger for cracks or signs of failure</li>
                  <li>Check and adjust gas pressure and burner combustion</li>
                  <li>Test safety controls and limit switches</li>
                  <li>Inspect the flue pipe and draft diverter</li>
                  <li>Clean flame sensor and check ignition system</li>
                  <li>Lubricate moving parts and inspect belts</li>
                  <li>Check electrical connections and test voltage</li>
                  <li>Calibrate thermostat if needed</li>
                </ul>
                
                <h2>When to Schedule Professional Maintenance</h2>
                
                <p>
                  We recommend scheduling your annual furnace maintenance in early fall, before you need to use 
                  your heating system regularly. This allows time to address any issues before the cold weather arrives.
                </p>
                
                <p>
                  In Calgary and surrounding areas, where temperatures can drop suddenly, having your system checked 
                  in September or early October is ideal. This timeframe also typically allows for more flexible 
                  scheduling before the peak season rush.
                </p>
                
                <h2>Signs Your Furnace Needs Immediate Attention</h2>
                
                <p>Don't wait for a complete breakdown if you notice any of these warning signs:</p>
                
                <ul>
                  <li>Unusual noises (banging, rattling, squealing)</li>
                  <li>Yellow pilot light instead of blue</li>
                  <li>Frequent cycling on and off</li>
                  <li>Increasing energy bills without temperature changes</li>
                  <li>Uneven heating throughout your home</li>
                  <li>System short-cycling or not completing full heating cycles</li>
                </ul>
                
                <h2>Conclusion</h2>
                
                <p>
                  Taking the time to prepare your furnace for winter operations pays dividends in reliability, 
                  efficiency, and peace of mind. Remember that in Alberta's climate, a functioning heating system 
                  isn't just about comfort—it's essential for preventing frozen pipes and protecting your home.
                </p>
                
                <p>
                  For those who haven't scheduled their annual maintenance yet, we recommend doing so immediately. 
                  Our comprehensive maintenance plan includes both fall furnace and spring AC tune-ups, priority 
                  service, and discounts on repairs.
                </p>
                
                <div className="bg-dark-card border border-gray-700 rounded-lg p-6 my-8">
                  <h3 className="text-xl font-bold mb-3">Need Professional Furnace Maintenance?</h3>
                  <p className="mb-4">
                    Our certified technicians provide thorough furnace inspections and tune-ups to ensure your 
                    system is winter-ready. Don't wait for a breakdown in sub-zero temperatures.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <a 
                      href="https://calendar.app.google/NXZB4v1PP57HhARL7" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-5 py-2 bg-fire text-white rounded-md font-medium hover:bg-fire/90 transition-colors"
                    >
                      Schedule Maintenance
                    </a>
                    <Link 
                      href="/contact"
                      className="px-5 py-2 bg-electric text-charcoal rounded-md font-medium hover:bg-electric/90 transition-colors"
                    >
                      Contact Us
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-700 mt-12 pt-8">
                <Link 
                  href="/blog"
                  className="inline-flex items-center text-white hover:text-fire transition-colors font-medium"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back to Blog
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Related Posts */}
        <section className="py-16 bg-dark-charcoal">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-heading font-bold mb-8">Related Articles</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Related Post 1 */}
                <article className="bg-dark-card border border-gray-700 rounded-xl overflow-hidden service-card">
                  <img 
                    src="https://pixabay.com/get/g8457756a5db7297ab98b235fad9a230080e4c4e02905176b9ae9b1d7db3db7a6485f2d07cd9a6c53aa3889459ba300e9f1a91bd7ef37cf93e4c9847e764ca32d_1280.jpg" 
                    alt="Commercial and residential HVAC comparison" 
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-5">
                    <h3 className="text-lg font-heading font-bold mb-2">
                      <Link href="/blog/commercial-vs-residential-hvac" className="hover:text-fire transition-colors">
                        Commercial vs Residential HVAC: What's the Difference?
                      </Link>
                    </h3>
                    <p className="text-muted-text text-sm mb-3">
                      Understanding the key differences between commercial and residential HVAC systems.
                    </p>
                    <Link 
                      href="/blog/commercial-vs-residential-hvac"
                      className="text-electric hover:text-fire transition-colors text-sm font-medium"
                    >
                      Read Article →
                    </Link>
                  </div>
                </article>
                
                {/* Related Post 2 */}
                <article className="bg-dark-card border border-gray-700 rounded-xl overflow-hidden service-card">
                  <img 
                    src="https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500" 
                    alt="HVAC technician performing routine maintenance" 
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-5">
                    <h3 className="text-lg font-heading font-bold mb-2">
                      <Link href="#" className="hover:text-fire transition-colors">
                        The Benefits of Regular HVAC Maintenance
                      </Link>
                    </h3>
                    <p className="text-muted-text text-sm mb-3">
                      Regular maintenance isn't just about preventing breakdowns—it's about extending equipment life.
                    </p>
                    <Link 
                      href="#"
                      className="text-electric hover:text-fire transition-colors text-sm font-medium"
                    >
                      Read Article →
                    </Link>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default PrepareFurnacePost;
