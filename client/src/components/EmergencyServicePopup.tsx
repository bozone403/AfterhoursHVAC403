import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Phone, 
  Clock, 
  AlertTriangle, 
  DollarSign, 
  MapPin,
  User,
  MessageSquare,
  X,
  CheckCircle
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface EmergencyPricing {
  baseRate: number;
  minimumHours: number;
  totalCost: number;
  timeSlot: string;
  description: string;
}

interface EmergencyServicePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmergencyServicePopup = ({ isOpen, onClose }: EmergencyServicePopupProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPricing, setCurrentPricing] = useState<EmergencyPricing | null>(null);
  const [step, setStep] = useState<'pricing' | 'form' | 'success'>('pricing');
  const [formData, setFormData] = useState({
    name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    emergencyType: '',
    description: '',
    urgencyLevel: 'high'
  });

  // Calculate pricing based on current time
  const calculateEmergencyPricing = (): EmergencyPricing => {
    const now = new Date();
    const hour = now.getHours();
    const baseRate = 175; // $175/hour
    
    if (hour >= 17 || hour < 0) { // 5 PM to midnight
      return {
        baseRate,
        minimumHours: 2,
        totalCost: baseRate * 2,
        timeSlot: "5:00 PM - 12:00 AM",
        description: "Evening Emergency Rate (2 hour minimum)"
      };
    } else if (hour >= 0 && hour < 8) { // Midnight to 8 AM
      return {
        baseRate,
        minimumHours: 3,
        totalCost: baseRate * 3,
        timeSlot: "12:00 AM - 8:00 AM",
        description: "Overnight Emergency Rate (3 hour minimum)"
      };
    } else { // Regular hours
      return {
        baseRate,
        minimumHours: 1,
        totalCost: baseRate * 1,
        timeSlot: "8:00 AM - 5:00 PM",
        description: "Regular Emergency Rate (1 hour minimum)"
      };
    }
  };

  // Update pricing when popup opens
  useEffect(() => {
    if (isOpen) {
      setCurrentPricing(calculateEmergencyPricing());
      setStep('pricing');
    }
  }, [isOpen]);

  const emergencyMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/emergency-service", data);
      return response.json();
    },
    onSuccess: () => {
      setStep('success');
      toast({
        title: "Emergency Service Requested",
        description: "Jordan has been notified via SMS and will contact you within 2 hours.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Request Failed",
        description: error.message || "Failed to submit emergency service request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address || !formData.emergencyType || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const emergencyData = {
      ...formData,
      pricing: currentPricing,
      requestedAt: new Date().toISOString(),
      userId: user?.id
    };

    emergencyMutation.mutate(emergencyData);
  };

  const emergencyTypes = [
    "No Heat",
    "No Air Conditioning", 
    "Gas Leak",
    "Water Leak from HVAC",
    "Furnace Not Working",
    "AC Unit Down",
    "Strange Smells/Burning",
    "System Making Loud Noises",
    "Thermostat Issues",
    "Other Emergency"
  ];

  const handleClose = () => {
    setStep('pricing');
    setFormData({
      name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.username || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: '',
      emergencyType: '',
      description: '',
      urgencyLevel: 'high'
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div>
                <DialogTitle className="text-xl text-red-800">24/7 Emergency HVAC Service</DialogTitle>
                <DialogDescription className="text-red-600">
                  Immediate response for urgent heating and cooling emergencies
                </DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {step === 'pricing' && currentPricing && (
          <div className="space-y-6">
            {/* Current Pricing */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5 text-red-600" />
                <h3 className="font-semibold text-red-800">Current Emergency Pricing</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded p-3 border border-red-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">Time Slot</span>
                  </div>
                  <p className="text-sm text-gray-700">{currentPricing.timeSlot}</p>
                </div>
                
                <div className="bg-white rounded p-3 border border-red-200">
                  <div className="text-sm text-gray-600 mb-1">Minimum Charge</div>
                  <div className="text-xl font-bold text-red-600">${currentPricing.totalCost}</div>
                  <div className="text-xs text-gray-500">{currentPricing.minimumHours}h minimum at ${currentPricing.baseRate}/hr</div>
                </div>
              </div>
              
              <p className="text-sm text-red-700 bg-white p-3 rounded border border-red-200">
                {currentPricing.description}
              </p>
            </div>

            {/* Contact Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-800">Emergency Hotline</span>
                </div>
                <a href="tel:4036136014" className="text-xl font-bold text-blue-600">(403) 613-6014</a>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-600 font-medium">Response Time:</span>
                  <p className="text-blue-800">Within 2 hours</p>
                </div>
                <div>
                  <span className="text-blue-600 font-medium">Service Area:</span>
                  <p className="text-blue-800">Calgary & Area</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={() => setStep('form')} 
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Request Emergency Service
              </Button>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {step === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="(403) 555-0123"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Service Address *
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="123 Main Street, Calgary, AB"
                required
              />
            </div>

            <div>
              <Label htmlFor="emergencyType">Type of Emergency *</Label>
              <select
                id="emergencyType"
                value={formData.emergencyType}
                onChange={(e) => setFormData({...formData, emergencyType: e.target.value})}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select emergency type</option>
                {emergencyTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="description" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Description *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe the emergency situation..."
                rows={3}
                required
              />
            </div>

            {currentPricing && (
              <Alert>
                <AlertDescription>
                  <strong>Service Minimum: ${currentPricing.totalCost}</strong> - This covers the {currentPricing.minimumHours} hour minimum. Additional time billed at ${currentPricing.baseRate}/hour.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                disabled={emergencyMutation.isPending}
              >
                {emergencyMutation.isPending ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Submit Emergency Request
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => setStep('pricing')}>
                Back
              </Button>
            </div>
          </form>
        )}

        {step === 'success' && (
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            <div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Emergency Service Requested</h3>
              <p className="text-gray-600 mb-4">
                Jordan has been notified immediately via SMS and will contact you within 2 hours to confirm arrival time.
              </p>
              <div className="bg-green-50 border border-green-200 rounded p-4 text-left">
                <p className="text-sm text-green-800">
                  <strong>What happens next:</strong><br/>
                  1. Jordan receives immediate SMS notification<br/>
                  2. You'll get a confirmation call within 30 minutes<br/>
                  3. Technician dispatched within 2 hours<br/>
                  4. Minimum charge of ${currentPricing?.totalCost} applies
                </p>
              </div>
            </div>
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmergencyServicePopup;