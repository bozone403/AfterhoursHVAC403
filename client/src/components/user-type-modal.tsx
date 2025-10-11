import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Wrench, Users, Calculator } from 'lucide-react';
import { useLocation } from 'wouter';

interface UserTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserTypeModal = ({ isOpen, onClose }: UserTypeModalProps) => {
  const [, setLocation] = useLocation();

  const handleUserTypeSelection = (userType: 'customer' | 'technician') => {
    onClose();
    
    if (userType === 'customer') {
      setLocation('/register?type=customer');
    } else {
      setLocation('/register?type=technician');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white text-center">
            Welcome to AfterHours HVAC
          </DialogTitle>
          <DialogDescription className="text-gray-300 text-center">
            Choose your account type to get started
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Customer Option */}
          <Card 
            className="bg-gray-700 border-gray-600 hover:border-primary cursor-pointer transition-all hover:scale-105"
            onClick={() => handleUserTypeSelection('customer')}
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-primary/20 rounded-full w-fit">
                <Home className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-white">I'm a Homeowner</CardTitle>
              <CardDescription className="text-gray-300">
                Looking for HVAC services for my home
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  Service requests & tracking
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  Installation quotes
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  Emergency repairs
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  Maintenance scheduling
                </li>
              </ul>
              <Button className="w-full mt-4 bg-primary hover:bg-primary/80 text-white">
                <Home className="w-4 h-4 mr-2" />
                Continue as Customer
              </Button>
            </CardContent>
          </Card>

          {/* Technician Option */}
          <Card 
            className="bg-gray-700 border-gray-600 hover:border-secondary cursor-pointer transition-all hover:scale-105"
            onClick={() => handleUserTypeSelection('technician')}
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-secondary/20 rounded-full w-fit">
                <Wrench className="h-8 w-8 text-secondary" />
              </div>
              <CardTitle className="text-white">I'm an HVAC Professional</CardTitle>
              <CardDescription className="text-gray-300">
                Looking for professional tools and calculators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                  Pro estimation calculators
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                  Material cost databases
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                  Load calculation tools
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                  Professional forum access
                </li>
              </ul>
              <Button className="w-full mt-4 bg-secondary hover:bg-secondary/80 text-white">
                <Wrench className="w-4 h-4 mr-2" />
                Continue as Professional
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <button 
              onClick={() => {
                onClose();
                setLocation('/login');
              }}
              className="text-primary hover:underline"
            >
              Sign in here
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};