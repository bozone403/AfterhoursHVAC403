import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Settings, Wind, Calculator, Plus, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProAccessGuard } from "@/components/ProAccessGuard";
import { Helmet } from "react-helmet-async";

// Friction loss calculation function
function calculateFrictionLoss(cfm: number, diameter: number, ductType: string): number {
  const frictionFactors = {
    'flexible': 0.025,
    'rigid-galvanized': 0.015,
    'rigid-spiral': 0.012,
    'pvc': 0.010
  };
  
  const factor = frictionFactors[ductType as keyof typeof frictionFactors] || 0.020;
  const velocity = cfm / (Math.PI * Math.pow(diameter / 24, 2));
  
  return Number((factor * Math.pow(velocity / 1000, 1.85) * 100).toFixed(3));
}

interface DuctSizing {
  supply: { [key: string]: { diameter: number; velocity: number; friction: number } };
  return: { diameter: number; velocity: number; friction: number };
  mainTrunk: { diameter: number; velocity: number };
}

function DuctSizingCalculatorContent() {
  const [cfm, setCfm] = useState<string>("");
  const [ductType, setDuctType] = useState<string>("");
  const [rooms, setRooms] = useState<Array<{ name: string; cfm: string }>>([
    { name: "Living Room", cfm: "" },
    { name: "Kitchen", cfm: "" },
    { name: "Master Bedroom", cfm: "" }
  ]);
  const [result, setResult] = useState<DuctSizing | null>(null);

  const addRoom = () => {
    setRooms([...rooms, { name: "", cfm: "" }]);
  };

  const updateRoom = (index: number, field: string, value: string) => {
    const updatedRooms = [...rooms];
    updatedRooms[index] = { ...updatedRooms[index], [field]: value };
    setRooms(updatedRooms);
  };

  const removeRoom = (index: number) => {
    setRooms(rooms.filter((_, i) => i !== index));
  };

  const calculateDuctSizing = () => {
    if (!cfm || !ductType) return;

    const totalCFM = parseFloat(cfm);
    const supply: { [key: string]: { diameter: number; velocity: number; friction: number } } = {};
    
    // Enhanced velocity recommendations based on duct type
    const velocityLimits = {
      'flexible': { max: 900, recommended: 700 },
      'rigid-galvanized': { max: 1200, recommended: 900 },
      'rigid-spiral': { max: 1500, recommended: 1100 },
      'pvc': { max: 800, recommended: 600 }
    };
    
    rooms.forEach(room => {
      if (room.name && room.cfm) {
        const roomCFM = parseFloat(room.cfm);
        const targetVelocity = velocityLimits[ductType as keyof typeof velocityLimits]?.recommended || 800;
        
        // Calculate duct diameter: CFM = Velocity × Area
        const area = roomCFM / targetVelocity;
        const diameter = Math.sqrt(area / Math.PI) * 2 * 12;
        
        // Round to nearest standard duct size
        const standardSizes = [4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 22, 24];
        const roundedDiameter = standardSizes.reduce((prev, curr) => 
          Math.abs(curr - diameter) < Math.abs(prev - diameter) ? curr : prev
        );
        
        // Calculate actual velocity with rounded diameter
        const actualArea = Math.PI * Math.pow(roundedDiameter / 24, 2);
        const actualVelocity = roomCFM / actualArea;
        
        // Calculate friction loss
        const frictionLoss = calculateFrictionLoss(roomCFM, roundedDiameter, ductType);
        
        supply[room.name] = {
          diameter: roundedDiameter,
          velocity: Math.round(actualVelocity),
          friction: frictionLoss
        };
      }
    });

    // Calculate return duct sizing (typically 20% larger than supply)
    const returnCFM = totalCFM * 1.2;
    const returnVelocity = 650;
    const returnArea = returnCFM / returnVelocity;
    const returnDiameter = Math.sqrt(returnArea * 4 / Math.PI) * 12;
    
    const returnStandardSizes = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30];
    const returnRoundedDiameter = returnStandardSizes.find(size => size >= returnDiameter) || returnStandardSizes[returnStandardSizes.length - 1];
    
    const returnActualArea = Math.PI * Math.pow(returnRoundedDiameter / 12, 2) / 4;
    const returnActualVelocity = returnCFM / returnActualArea;
    const returnFriction = calculateFrictionLoss(returnCFM, returnRoundedDiameter, ductType);

    // Calculate main trunk sizing
    const mainTrunkVelocity = 1000;
    const mainTrunkArea = totalCFM / mainTrunkVelocity;
    const mainTrunkDiameter = Math.sqrt(mainTrunkArea * 4 / Math.PI) * 12;
    const mainTrunkStandardSizes = [12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 36];
    const mainTrunkRoundedDiameter = mainTrunkStandardSizes.find(size => size >= mainTrunkDiameter) || mainTrunkStandardSizes[mainTrunkStandardSizes.length - 1];
    
    const mainTrunkActualArea = Math.PI * Math.pow(mainTrunkRoundedDiameter / 12, 2) / 4;
    const mainTrunkActualVelocity = totalCFM / mainTrunkActualArea;

    setResult({
      supply,
      return: {
        diameter: returnRoundedDiameter,
        velocity: Math.round(returnActualVelocity),
        friction: returnFriction
      },
      mainTrunk: {
        diameter: mainTrunkRoundedDiameter,
        velocity: Math.round(mainTrunkActualVelocity)
      }
    });
  };

  return (
    <>
      <Helmet>
        <title>Professional Duct Sizing Calculator | AfterHours HVAC</title>
        <meta name="description" content="Calculate proper duct sizes for HVAC systems with our professional calculator. Includes friction loss calculations and velocity optimization for all duct types." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Professional Duct Sizing Calculator
            </h1>
            <p className="text-lg text-white/60 max-w-3xl mx-auto">
              Calculate optimal duct sizes with professional-grade algorithms including friction loss, 
              velocity optimization, and material-specific recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl border-orange-200">
              
                <CardTitle className="flex items-center text-white">
                  <Settings className="h-5 w-5 mr-2 text-amber-500" />
                  System Parameters
                </CardTitle>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cfm" className="text-white/80">Total System CFM</Label>
                    <Input className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                      id="cfm"
                      type="number"
                      value={cfm}
                      onChange={(e) => setCfm(e.target.value)}
                      placeholder="e.g., 1200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ductType" className="text-white/80">Duct Material</Label>
                    <Select value={ductType} onValueChange={setDuctType}>
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="Select duct type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flexible">Flexible Duct</SelectItem>
                        <SelectItem value="rigid-galvanized">Rigid Galvanized</SelectItem>
                        <SelectItem value="rigid-spiral">Rigid Spiral</SelectItem>
                        <SelectItem value="pvc">PVC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <Label className="text-white/80 text-lg font-medium">Room Requirements</Label>
                    <Button 
                      onClick={addRoom} 
                      variant="outline" 
                      size="sm"
                      className="border-orange-300 text-amber-500 hover:bg-white/5 backdrop-blur-sm border border-white/10"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Room
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {rooms.map((room, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500 flex-1"
                          value={room.name}
                          onChange={(e) => updateRoom(index, 'name', e.target.value)}
                          placeholder="Room name"
                        />
                        <Input className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500 w-24"
                          type="number"
                          value={room.cfm}
                          onChange={(e) => updateRoom(index, 'cfm', e.target.value)}
                          placeholder="CFM"
                        />
                        <Button
                          onClick={() => removeRoom(index)}
                          variant="outline"
                          size="sm"
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={calculateDuctSizing} 
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/50"
                  disabled={!cfm || !ductType}
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Duct Sizing
                </Button>
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl border-blue-200">
              
                <CardTitle className="flex items-center text-white">
                  <Wind className="h-5 w-5 mr-2 text-blue-400" />
                  Sizing Results
                </CardTitle>
              
              <div>
                {result ? (
                  <div className="space-y-6">
                    {/* Supply Ducts */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Supply Ducts</h3>
                      <div className="space-y-3">
                        {Object.entries(result.supply).map(([room, sizing]) => (
                          <div key={room} className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-lg">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-white">{room}</h4>
                              <Badge className="bg-blue-600">{sizing.diameter}"</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-white/70">
                              <span>Velocity: {sizing.velocity} FPM</span>
                              <span>Friction: {sizing.friction}" w.c./100ft</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Return Duct */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Return Duct</h3>
                      <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-white">Main Return</h4>
                          <Badge className="bg-green-600">{result.return.diameter}"</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-white/70">
                          <span>Velocity: {result.return.velocity} FPM</span>
                          <span>Friction: {result.return.friction}" w.c./100ft</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Main Trunk */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Main Supply Trunk</h3>
                      <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-white">Supply Trunk</h4>
                          <Badge className="bg-orange-600">{result.mainTrunk.diameter}"</Badge>
                        </div>
                        <div className="mt-2 text-sm text-white/70">
                          <span>Velocity: {result.mainTrunk.velocity} FPM</span>
                        </div>
                      </div>
                    </div>

                    {/* Professional Notes */}
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Professional Notes:</strong> These calculations are based on standard ACCA Manual D guidelines. 
                        Consider additional factors like duct length, fittings, and static pressure requirements for final design.
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Wind className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">Ready to Calculate</h3>
                    <p className="text-white/70">
                      Enter your system parameters and room requirements to get professional duct sizing recommendations.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function DuctSizingCalculator() {
  return (
    <ProAccessGuard>
      <DuctSizingCalculatorContent />
    </ProAccessGuard>
  );
}