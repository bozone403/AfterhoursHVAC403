import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Phone, Users, Wrench, X } from "lucide-react";
import { useLocation } from "wouter";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const [, setLocation] = useLocation();
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showUserTypeModal, setShowUserTypeModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowEmergencyModal(true);
      setShowUserTypeModal(false);
    }
  }, [isOpen]);

  const handleEmergencyYes = () => {
    setShowEmergencyModal(false);
    onClose();
    setLocation("/emergency-service");
  };

  const handleEmergencyNo = () => {
    setShowEmergencyModal(false);
    setShowUserTypeModal(true);
  };

  const handleUserTypeSelection = (userType: 'customer' | 'pro') => {
    setShowUserTypeModal(false);
    onClose();
    if (userType === 'customer') {
      setLocation("/auth");
    } else {
      setLocation("/auth?type=pro");
    }
  };

  const handleClose = () => {
    setShowEmergencyModal(false);
    setShowUserTypeModal(false);
    onClose();
  };

  return (
    <>
      <Dialog open={showEmergencyModal} onOpenChange={() => {}}>
        <DialogContent className="max-w-lg bg-gradient-to-br from-white to-red-50 border-0 shadow-2xl rounded-2xl overflow-hidden">
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute right-4 top-4 h-8 w-8 p-0 z-50 hover:bg-red-100 rounded-full" 
            onClick={handleClose}
          >
            <X className="h-4 w-4 text-red-700" />
          </Button>
          <DialogHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white -m-6 mb-6 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3 relative z-10">
              <div className="p-2 bg-white/20 rounded-full">
                <AlertTriangle className="h-7 w-7" />
              </div>
              Emergency HVAC Service
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-8 p-2">
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900 mb-3">
                Do you need emergency HVAC service?
              </p>
              <p className="text-gray-600 leading-relaxed">
                We're available 24/7 for heating and cooling emergencies.<br/>
                No overtime charges • Fast response • Licensed technicians
              </p>
            </div>

            <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 rounded-xl text-white text-center shadow-lg">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Phone className="h-6 w-6" />
                <span className="font-bold text-lg">24/7 Emergency Line</span>
              </div>
              <a 
                href="tel:4036136014" 
                className="text-3xl font-black hover:text-red-100 transition-colors block"
              >
                (403) 613-6014
              </a>
              <p className="text-red-100 text-sm mt-2">Tap to call now</p>
            </div>

            <div className="flex gap-4">
              <Button 
                onClick={handleEmergencyYes}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Yes, I Need Emergency Service
              </Button>
              <Button 
                onClick={handleEmergencyNo}
                variant="outline"
                className="flex-1 border-2 border-gray-300 hover:bg-gray-50 py-4 text-lg rounded-xl font-semibold transition-all"
              >
                Continue to Site
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showUserTypeModal} onOpenChange={() => {}}>
        <DialogContent className="max-w-3xl bg-gradient-to-br from-white to-blue-50 border-0 shadow-2xl rounded-2xl overflow-hidden">
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute right-4 top-4 h-8 w-8 p-0 z-50 hover:bg-blue-100 rounded-full" 
            onClick={handleClose}
          >
            <X className="h-4 w-4 text-blue-700" />
          </Button>
          <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white -m-6 mb-6 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3 relative z-10">
              <div className="p-2 bg-white/20 rounded-full">
                <Users className="h-7 w-7" />
              </div>
              Welcome to AfterHours HVAC
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-8 p-2">
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900 mb-3">
                How would you like to access our services?
              </p>
              <p className="text-gray-600 leading-relaxed">
                Choose your account type to unlock personalized features and tools
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card 
                className="cursor-pointer hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 group"
                onClick={() => handleUserTypeSelection('customer')}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-blue-900 font-bold">Customer Portal</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <ul className="text-gray-700 space-y-3 mb-6 text-left">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Schedule service appointments
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Request quotes and estimates
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Access maintenance plans
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Track service history
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Emergency service requests
                    </li>
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all">
                    Continue as Customer
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 group"
                onClick={() => handleUserTypeSelection('pro')}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                    <Wrench className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-orange-900 font-bold">Professional Portal</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <ul className="text-gray-700 space-y-3 mb-6 text-left">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      Advanced HVAC calculators
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      Professional quote tools
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      Industry forum access
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      Technical resources
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      Contractor networking
                    </li>
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all">
                    Continue as Professional
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button 
                variant="ghost" 
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 font-semibold"
              >
                Skip for now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}