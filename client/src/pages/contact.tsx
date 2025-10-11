import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Phone, Mail, Calendar, Clock, Star, MapPin, AlertTriangle, Sparkles, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ContactForm from '@/components/forms/ContactForm';
import ServiceAreaBanner from '@/components/contact/ServiceAreaBanner';

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us - AfterHours HVAC</title>
        <meta name="description" content="Contact AfterHours HVAC for 24/7 emergency service, installation quotes, and maintenance plans. Serving Calgary, Lethbridge, and surrounding areas." />
      </Helmet>
      
      {/* Service Area Banner */}
      <ServiceAreaBanner />
      
      {/* Premium Hero Section */}
      <section className="relative min-h-[50vh] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 pt-24 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-white/90 text-sm font-medium">Premium Service, Anytime</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Get In <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Have questions or need service? Contact our team for prompt, professional assistance.
            </p>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="relative py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-200">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">Send Us a Message</h3>
                  </div>
                  <ContactForm />
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-2xl overflow-hidden shadow-xl h-full relative">
                {/* Subtle background animation */}
                <div className="absolute inset-0">
                  <div className="absolute top-10 right-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
                </div>
                
                <div className="relative p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <Award className="h-6 w-6 text-amber-400" />
                    <h3 className="text-2xl font-black text-white">Contact Information</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all">
                      <div className="flex items-start">
                        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-full p-2 mr-4 mt-1">
                          <Phone className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold mb-1 text-white">Phone</h4>
                          <a 
                            href="tel:4036136014" 
                            className="text-blue-100 hover:text-amber-400 transition-colors font-semibold text-lg"
                            data-testid="link-phone"
                          >
                            (403) 613-6014
                          </a>
                          <p className="text-sm text-blue-200 mt-1">Available 24/7 for emergencies</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all">
                      <div className="flex items-start">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full p-2 mr-4 mt-1">
                          <Mail className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold mb-1 text-white">Email</h4>
                          <a 
                            href="mailto:Jordan@Afterhourshvac.ca" 
                            className="text-blue-100 hover:text-amber-400 transition-colors"
                            data-testid="link-email"
                          >
                            Jordan@Afterhourshvac.ca
                          </a>
                          <p className="text-sm text-blue-200 mt-1">We typically respond within 24 hours</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all">
                      <div className="flex items-start">
                        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-full p-2 mr-4 mt-1">
                          <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold mb-1 text-white">Book Online</h4>
                          <a 
                            href="https://calendar.app.google/NXZB4v1PP57HhARL7" 
                            target="_blank"
                            rel="noopener noreferrer" 
                            className="text-blue-100 hover:text-amber-400 transition-colors"
                            data-testid="link-calendar"
                          >
                            Schedule an Appointment
                          </a>
                          <p className="text-sm text-blue-200 mt-1">Select a convenient date and time</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all">
                      <div className="flex items-start">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full p-2 mr-4 mt-1">
                          <Clock className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold mb-1 text-white">Business Hours</h4>
                          <p className="text-blue-100">Monday - Friday: 8:00 AM - 5:00 PM</p>
                          <p className="text-blue-100">Emergency Service: 24/7/365</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all">
                      <div className="flex items-start">
                        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-full p-2 mr-4 mt-1">
                          <Star className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold mb-1 text-white">Reviews</h4>
                          <a 
                            href="https://g.page/r/CQEE3GNkblpDEAI/review" 
                            target="_blank"
                            rel="noopener noreferrer" 
                            className="text-blue-100 hover:text-amber-400 transition-colors"
                            data-testid="link-reviews"
                          >
                            Google Business
                          </a>
                          <p className="text-sm text-blue-200 mt-1">Share your experience with us</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Our Service <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">Areas</span>
            </h2>
            <p className="text-blue-100 max-w-3xl mx-auto">We provide HVAC services throughout Calgary and surrounding areas in Alberta.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md p-1 rounded-2xl overflow-hidden border border-white/20 shadow-xl">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d321202.8130375833!2d-114.36801981347658!3d51.02757586482484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x537170039f843fd5%3A0x266d3bb1b652b63a!2sCalgary%2C%20AB%2C%20Canada!5e0!3m2!1sen!2sus!4v1652280085779!5m2!1sen!2sus" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="AfterHours HVAC Service Area Map"
              className="w-full rounded-2xl"
            ></iframe>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl text-center hover:bg-white/15 transition-all">
              <MapPin className="h-6 w-6 text-amber-400 mb-2 mx-auto" />
              <h4 className="font-medium text-white">Calgary</h4>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl text-center hover:bg-white/15 transition-all">
              <MapPin className="h-6 w-6 text-amber-400 mb-2 mx-auto" />
              <h4 className="font-medium text-white">Lethbridge</h4>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl text-center hover:bg-white/15 transition-all">
              <MapPin className="h-6 w-6 text-amber-400 mb-2 mx-auto" />
              <h4 className="font-medium text-white">Coaldale</h4>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl text-center hover:bg-white/15 transition-all">
              <MapPin className="h-6 w-6 text-amber-400 mb-2 mx-auto" />
              <h4 className="font-medium text-white">Taber</h4>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl text-center hover:bg-white/15 transition-all">
              <MapPin className="h-6 w-6 text-amber-400 mb-2 mx-auto" />
              <h4 className="font-medium text-white">Fort Macleod</h4>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl text-center hover:bg-white/15 transition-all">
              <MapPin className="h-6 w-6 text-amber-400 mb-2 mx-auto" />
              <h4 className="font-medium text-white">Rural Areas</h4>
            </div>
          </div>
        </div>
      </section>
      
      {/* Emergency Contact */}
      <section className="relative bg-gradient-to-r from-amber-500 to-amber-600 py-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-2 flex items-center">
                <AlertTriangle className="h-8 w-8 mr-3" />
                Emergency HVAC Service Available 24/7
              </h2>
              <p className="text-white text-opacity-90 max-w-xl">
                Don't wait until morning for heating or cooling emergencies. Our skilled technicians are on call around the clock to restore comfort to your home or business.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-white text-amber-600 hover:bg-slate-50 font-bold text-lg px-8 py-6 rounded-xl shadow-2xl transition-all hover:scale-105"
                asChild
                data-testid="button-emergency-call"
              >
                <a href="tel:4036136014">
                  <Phone className="h-5 w-5 mr-2" /> (403) 613-6014
                </a>
              </Button>
              <Button 
                className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white hover:opacity-90 font-bold text-lg px-8 py-6 rounded-xl shadow-2xl transition-all hover:scale-105"
                asChild
                data-testid="button-schedule"
              >
                <a 
                  href="https://calendar.app.google/NXZB4v1PP57HhARL7" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Calendar className="h-5 w-5 mr-2" /> Schedule Service
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
