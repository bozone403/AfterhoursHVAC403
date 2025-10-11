import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Zap, Calculator, Thermometer, Wind } from 'lucide-react';

interface BTUCalculation {
  heatingBTU: number;
  coolingBTU: number;
  furnaceSize: string;
  acSize: string;
  recommendations: string[];
}

const BTUCalculator = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    squareFootage: '',
    ceilingHeight: '8',
    insulation: 'average',
    windows: 'average',
    climate: 'calgary',
    roomType: 'living',
    occupants: '2',
    sunExposure: 'average'
  });

  const [calculation, setCalculation] = useState<BTUCalculation | null>(null);

  const calculateBTU = () => {
    const sqft = parseInt(formData.squareFootage);
    if (!sqft || sqft <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid square footage",
        variant: "destructive"
      });
      return;
    }

    // Base BTU calculation (Calgary climate)
    let heatingBTU = sqft * 45; // Base heating BTU per sq ft for Calgary
    let coolingBTU = sqft * 25; // Base cooling BTU per sq ft

    // Ceiling height adjustment
    const ceilingMultiplier = parseFloat(formData.ceilingHeight) / 8;
    heatingBTU *= ceilingMultiplier;
    coolingBTU *= ceilingMultiplier;

    // Insulation adjustments
    const insulationFactors = {
      poor: { heating: 1.3, cooling: 1.2 },
      average: { heating: 1.0, cooling: 1.0 },
      good: { heating: 0.8, cooling: 0.85 },
      excellent: { heating: 0.7, cooling: 0.75 }
    };
    const insulation = insulationFactors[formData.insulation as keyof typeof insulationFactors];
    heatingBTU *= insulation.heating;
    coolingBTU *= insulation.cooling;

    // Window adjustments
    const windowFactors = {
      few: { heating: 0.9, cooling: 0.9 },
      average: { heating: 1.0, cooling: 1.0 },
      many: { heating: 1.2, cooling: 1.3 }
    };
    const windows = windowFactors[formData.windows as keyof typeof windowFactors];
    heatingBTU *= windows.heating;
    coolingBTU *= windows.cooling;

    // Sun exposure adjustments (mainly affects cooling)
    const sunFactors = {
      north: 0.9,
      average: 1.0,
      south: 1.2,
      west: 1.3
    };
    coolingBTU *= sunFactors[formData.sunExposure as keyof typeof sunFactors];

    // Occupant adjustments (600 BTU per person for cooling)
    const occupants = parseInt(formData.occupants);
    coolingBTU += occupants * 600;

    // Room type adjustments
    const roomFactors = {
      bedroom: { heating: 0.9, cooling: 0.9 },
      living: { heating: 1.0, cooling: 1.0 },
      kitchen: { heating: 1.1, cooling: 1.4 },
      office: { heating: 0.95, cooling: 1.1 },
      basement: { heating: 1.2, cooling: 0.7 }
    };
    const room = roomFactors[formData.roomType as keyof typeof roomFactors];
    heatingBTU *= room.heating;
    coolingBTU *= room.cooling;

    // Calculate equipment sizes
    const furnaceSize = Math.round(heatingBTU / 1000) + "K BTU/hr";
    const acTonnage = Math.round((coolingBTU / 12000) * 2) / 2; // Round to nearest 0.5 ton
    const acSize = acTonnage >= 1 ? `${acTonnage} Ton` : `${Math.round(coolingBTU / 1000)}K BTU/hr`;

    // Generate recommendations
    const recommendations = [];
    
    if (insulation.heating > 1.1) {
      recommendations.push("Consider improving insulation to reduce heating costs");
    }
    if (windows.cooling > 1.1) {
      recommendations.push("Multiple windows increase cooling load - consider window treatments");
    }
    if (coolingBTU > 36000) {
      recommendations.push("Large cooling requirement - consider zoned system");
    }
    if (heatingBTU > 100000) {
      recommendations.push("High heating requirement - consider high-efficiency furnace");
    }
    if (formData.roomType === 'kitchen') {
      recommendations.push("Kitchen requires additional ventilation consideration");
    }

    setCalculation({
      heatingBTU: Math.round(heatingBTU),
      coolingBTU: Math.round(coolingBTU),
      furnaceSize,
      acSize,
      recommendations
    });

    toast({
      title: "BTU Calculated",
      description: `Heating: ${Math.round(heatingBTU).toLocaleString()} BTU/hr, Cooling: ${Math.round(coolingBTU).toLocaleString()} BTU/hr`
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (calculation) {
      setCalculation(null); // Reset calculation when inputs change
    }
  };

  return (
    <>
      <Helmet>
        <title>BTU Calculator | AfterHours HVAC</title>
        <meta name="description" content="Free BTU calculator for heating and cooling requirements. Calculate furnace and AC sizing for Calgary homes." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Zap className="h-10 w-10 text-yellow-400" />
              BTU Calculator
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Calculate heating and cooling requirements for proper HVAC sizing
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Input Form */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Room Details</CardTitle>
                <CardDescription>Enter your space information for accurate BTU calculation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="squareFootage">Square Footage *</Label>
                    <Input
                      id="squareFootage"
                      type="number"
                      value={formData.squareFootage}
                      onChange={(e) => handleInputChange('squareFootage', e.target.value)}
                      className="bg-slate-900 border-slate-600"
                      placeholder="Enter square feet"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ceilingHeight">Ceiling Height (ft)</Label>
                    <Select value={formData.ceilingHeight} onValueChange={(value) => handleInputChange('ceilingHeight', value)}>
                      <SelectTrigger className="bg-slate-900 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 feet</SelectItem>
                        <SelectItem value="8">8 feet (standard)</SelectItem>
                        <SelectItem value="9">9 feet</SelectItem>
                        <SelectItem value="10">10 feet</SelectItem>
                        <SelectItem value="12">12+ feet (vaulted)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="roomType">Room Type</Label>
                    <Select value={formData.roomType} onValueChange={(value) => handleInputChange('roomType', value)}>
                      <SelectTrigger className="bg-slate-900 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bedroom">Bedroom</SelectItem>
                        <SelectItem value="living">Living Room</SelectItem>
                        <SelectItem value="kitchen">Kitchen</SelectItem>
                        <SelectItem value="office">Office</SelectItem>
                        <SelectItem value="basement">Basement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="occupants">Number of Occupants</Label>
                    <Select value={formData.occupants} onValueChange={(value) => handleInputChange('occupants', value)}>
                      <SelectTrigger className="bg-slate-900 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 person</SelectItem>
                        <SelectItem value="2">2 people</SelectItem>
                        <SelectItem value="3">3 people</SelectItem>
                        <SelectItem value="4">4 people</SelectItem>
                        <SelectItem value="5">5+ people</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="insulation">Insulation Quality</Label>
                    <Select value={formData.insulation} onValueChange={(value) => handleInputChange('insulation', value)}>
                      <SelectTrigger className="bg-slate-900 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="poor">Poor (older home)</SelectItem>
                        <SelectItem value="average">Average</SelectItem>
                        <SelectItem value="good">Good (modern)</SelectItem>
                        <SelectItem value="excellent">Excellent (new/upgraded)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="windows">Window Coverage</Label>
                    <Select value={formData.windows} onValueChange={(value) => handleInputChange('windows', value)}>
                      <SelectTrigger className="bg-slate-900 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="few">Few windows</SelectItem>
                        <SelectItem value="average">Average windows</SelectItem>
                        <SelectItem value="many">Many/large windows</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="sunExposure">Sun Exposure</Label>
                    <Select value={formData.sunExposure} onValueChange={(value) => handleInputChange('sunExposure', value)}>
                      <SelectTrigger className="bg-slate-900 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="north">North facing (little sun)</SelectItem>
                        <SelectItem value="average">Average sun exposure</SelectItem>
                        <SelectItem value="south">South facing (good sun)</SelectItem>
                        <SelectItem value="west">West facing (hot afternoon sun)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={calculateBTU}
                  className="w-full bg-yellow-600 hover:bg-yellow-700"
                  disabled={!formData.squareFootage}
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate BTU Requirements
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">BTU Requirements</CardTitle>
                <CardDescription>Heating and cooling calculations for your space</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {calculation ? (
                  <>
                    {/* Heating Requirements */}
                    <div className="bg-red-900/20 p-4 rounded-lg border border-red-700">
                      <div className="flex items-center gap-3 mb-3">
                        <Thermometer className="h-6 w-6 text-red-400" />
                        <h3 className="text-lg font-semibold text-white">Heating Requirements</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-300">BTU/hr needed:</span>
                          <span className="text-white font-semibold">{calculation.heatingBTU.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">Furnace size:</span>
                          <span className="text-red-400 font-semibold">{calculation.furnaceSize}</span>
                        </div>
                      </div>
                    </div>

                    {/* Cooling Requirements */}
                    <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-700">
                      <div className="flex items-center gap-3 mb-3">
                        <Wind className="h-6 w-6 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white">Cooling Requirements</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-300">BTU/hr needed:</span>
                          <span className="text-white font-semibold">{calculation.coolingBTU.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">AC size:</span>
                          <span className="text-blue-400 font-semibold">{calculation.acSize}</span>
                        </div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    {calculation.recommendations.length > 0 && (
                      <>
                        <Separator className="bg-slate-600" />
                        <div>
                          <h4 className="font-semibold text-white mb-3">Recommendations</h4>
                          <ul className="space-y-2">
                            {calculation.recommendations.map((rec, index) => (
                              <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                                <span className="text-yellow-400 mt-1">•</span>
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}

                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600 mt-6">
                      <h5 className="font-semibold text-white mb-2">Important Notes</h5>
                      <ul className="text-sm text-slate-400 space-y-1">
                        <li>• Calculations are estimates based on Calgary climate</li>
                        <li>• Professional assessment recommended for final sizing</li>
                        <li>• Ductwork and home layout affect actual requirements</li>
                        <li>• Consider energy efficiency ratings when purchasing</li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Calculator className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">Enter your room details and click Calculate BTU Requirements</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default BTUCalculator;