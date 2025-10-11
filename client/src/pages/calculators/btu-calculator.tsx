import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Thermometer, Wind, Snowflake, Home } from "lucide-react";

export default function BTUCalculator() {
  const [formData, setFormData] = useState({
    squareFootage: "",
    roomType: "",
    ceilingHeight: "8",
    insulation: "",
    windowCount: "",
    exposures: "",
    occupancy: ""
  });

  const [results, setResults] = useState<any>(null);

  const calculateBTU = () => {
    const sqft = parseInt(formData.squareFootage) || 0;
    const height = parseFloat(formData.ceilingHeight) || 8;
    const windows = parseInt(formData.windowCount) || 0;
    const occupancy = parseInt(formData.occupancy) || 2;

    // Base BTU calculation
    let baseBtu = sqft * 20; // Base 20 BTU per sq ft

    // Room type adjustments
    const roomFactors: Record<string, number> = {
      "bedroom": 1.0,
      "living_room": 1.1,
      "kitchen": 1.3,
      "dining_room": 1.1,
      "office": 1.1,
      "basement": 0.8,
      "attic": 1.4
    };

    if (formData.roomType) {
      baseBtu *= roomFactors[formData.roomType] || 1.0;
    }

    // Ceiling height adjustment
    if (height > 8) {
      baseBtu *= (height / 8);
    }

    // Insulation adjustments
    const insulationFactors: Record<string, number> = {
      "poor": 1.3,
      "average": 1.0,
      "good": 0.85,
      "excellent": 0.7
    };

    if (formData.insulation) {
      baseBtu *= insulationFactors[formData.insulation] || 1.0;
    }

    // Window load (600 BTU per window average)
    baseBtu += windows * 600;

    // Sun exposure
    const exposureFactors: Record<string, number> = {
      "north": 1.0,
      "east": 1.1,
      "south": 1.15,
      "west": 1.2
    };

    if (formData.exposures) {
      baseBtu *= exposureFactors[formData.exposures] || 1.0;
    }

    // Occupancy (400 BTU per person after first 2)
    if (occupancy > 2) {
      baseBtu += (occupancy - 2) * 400;
    }

    // Equipment recommendations for different brands
    const coolingTonnage = Math.ceil(baseBtu / 12000 * 10) / 10;
    const heatingBtu = Math.round(baseBtu * 1.1);

    // Ducane recommendations
    const ducaneModels = getDucaneModels(coolingTonnage, heatingBtu);
    
    // Daikin recommendations
    const daikinModels = getDaikinModels(coolingTonnage, heatingBtu);
    
    // Lennox recommendations
    const lennoxModels = getLennoxModels(coolingTonnage, heatingBtu);

    setResults({
      totalBtu: Math.round(baseBtu),
      coolingTonnage,
      heatingBtu,
      ducaneModels,
      daikinModels,
      lennoxModels
    });
  };

  const getDucaneModels = (tonnage: number, heatingBtu: number) => {
    const coolingModels: Record<number, string> = {
      1.5: "2R13L18P - 1.5 Ton, 13 SEER",
      2: "2R13L24P - 2 Ton, 13 SEER",
      2.5: "2R13L30P - 2.5 Ton, 13 SEER", 
      3: "2R13L36P - 3 Ton, 13 SEER",
      3.5: "2R13L42P - 3.5 Ton, 13 SEER",
      4: "2R13L48P - 4 Ton, 13 SEER",
      5: "2R13L60P - 5 Ton, 13 SEER"
    };

    const heatingModels: Record<number, string> = {
      40000: "R801T040 - 40k BTU, 80% AFUE",
      60000: "R801T060 - 60k BTU, 80% AFUE", 
      80000: "R801T080 - 80k BTU, 80% AFUE",
      100000: "R96V1003 - 100k BTU, 96% AFUE",
      120000: "R96V1203 - 120k BTU, 96% AFUE"
    };

    const coolingModel = coolingModels[tonnage] || `${tonnage} Ton Unit`;
    
    const heatingSizes = [40000, 60000, 80000, 100000, 120000];
    const closestHeatingSize = heatingSizes.find(size => size >= heatingBtu) || heatingSizes[heatingSizes.length - 1];
    const heatingModel = heatingModels[closestHeatingSize];

    return { cooling: coolingModel, heating: heatingModel };
  };

  const getDaikinModels = (tonnage: number, heatingBtu: number) => {
    const coolingModels: Record<number, string> = {
      1.5: "DX13SA0181 - 1.5 Ton, 13 SEER",
      2: "DX13SA0241 - 2 Ton, 13 SEER",
      2.5: "DX13SA0301 - 2.5 Ton, 13 SEER",
      3: "DX13SA0361 - 3 Ton, 13 SEER", 
      3.5: "DX13SA0421 - 3.5 Ton, 13 SEER",
      4: "DX13SA0481 - 4 Ton, 13 SEER",
      5: "DX13SA0601 - 5 Ton, 13 SEER"
    };

    const heatingModels: Record<number, string> = {
      40000: "DM80SS0403B - 40k BTU, 80% AFUE",
      60000: "DM80SS0603B - 60k BTU, 80% AFUE",
      80000: "DM80SS0803B - 80k BTU, 80% AFUE", 
      100000: "DM96SS1003B - 100k BTU, 96% AFUE",
      120000: "DM96SS1203B - 120k BTU, 96% AFUE"
    };

    const coolingModel = coolingModels[tonnage] || `${tonnage} Ton Unit`;
    
    const heatingSizes = [40000, 60000, 80000, 100000, 120000];
    const closestHeatingSize = heatingSizes.find(size => size >= heatingBtu) || heatingSizes[heatingSizes.length - 1];
    const heatingModel = heatingModels[closestHeatingSize];

    return { cooling: coolingModel, heating: heatingModel };
  };

  const getLennoxModels = (tonnage: number, heatingBtu: number) => {
    const coolingModels: Record<number, string> = {
      1.5: "13ACX-018 - 1.5 Ton, 13 SEER",
      2: "13ACX-024 - 2 Ton, 13 SEER", 
      2.5: "13ACX-030 - 2.5 Ton, 13 SEER",
      3: "13ACX-036 - 3 Ton, 13 SEER",
      3.5: "13ACX-042 - 3.5 Ton, 13 SEER",
      4: "13ACX-048 - 4 Ton, 13 SEER",
      5: "13ACX-060 - 5 Ton, 13 SEER"
    };

    const heatingModels: Record<number, string> = {
      40000: "ML180UH045P36A - 40k BTU, 80% AFUE",
      60000: "ML180UH070P36A - 60k BTU, 80% AFUE",
      80000: "ML180UH090P36A - 80k BTU, 80% AFUE",
      100000: "SL280V100 - 100k BTU, 96% AFUE", 
      120000: "SL280V120 - 120k BTU, 96% AFUE"
    };

    const coolingModel = coolingModels[tonnage] || `${tonnage} Ton Unit`;
    
    const heatingSizes = [40000, 60000, 80000, 100000, 120000];
    const closestHeatingSize = heatingSizes.find(size => size >= heatingBtu) || heatingSizes[heatingSizes.length - 1];
    const heatingModel = heatingModels[closestHeatingSize];

    return { cooling: coolingModel, heating: heatingModel };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="h-8 w-8 text-amber-500" />
            <Thermometer className="h-8 w-8 text-amber-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">BTU Calculator</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Calculate the right heating and cooling capacity for any room or space
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-6">
            <div className="mb-6">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-white mb-2">
                <Home className="h-5 w-5 text-amber-500" />
                Room Information
              </h2>
              <p className="text-white/60">
                Enter room details for accurate BTU calculation
              </p>
            </div>
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="squareFootage" className="text-white/90">Square Footage</Label>
                  <Input
                    id="squareFootage"
                    type="number"
                    placeholder="e.g., 300"
                    value={formData.squareFootage}
                    onChange={(e) => setFormData(prev => ({ ...prev, squareFootage: e.target.value }))}
                    className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                    data-testid="input-square-footage"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ceilingHeight" className="text-white/90">Ceiling Height (ft)</Label>
                  <Select value={formData.ceilingHeight} onValueChange={(value) => setFormData(prev => ({ ...prev, ceilingHeight: value }))}>
                    <SelectTrigger className="bg-white/5 backdrop-blur-sm border-white/20 text-white focus:border-amber-500" data-testid="select-ceiling-height">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8">8 feet</SelectItem>
                      <SelectItem value="9">9 feet</SelectItem>
                      <SelectItem value="10">10 feet</SelectItem>
                      <SelectItem value="12">12 feet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomType" className="text-white/90">Room Type</Label>
                <Select value={formData.roomType} onValueChange={(value) => setFormData(prev => ({ ...prev, roomType: value }))}>
                  <SelectTrigger className="bg-white/5 backdrop-blur-sm border-white/20 text-white focus:border-amber-500" data-testid="select-room-type">
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bedroom">Bedroom</SelectItem>
                    <SelectItem value="living_room">Living Room</SelectItem>
                    <SelectItem value="kitchen">Kitchen</SelectItem>
                    <SelectItem value="dining_room">Dining Room</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="basement">Basement</SelectItem>
                    <SelectItem value="attic">Attic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="windowCount" className="text-white/90">Number of Windows</Label>
                  <Input
                    id="windowCount"
                    type="number"
                    placeholder="e.g., 2"
                    value={formData.windowCount}
                    onChange={(e) => setFormData(prev => ({ ...prev, windowCount: e.target.value }))}
                    className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                    data-testid="input-window-count"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupancy" className="text-white/90">Average Occupancy</Label>
                  <Input
                    id="occupancy"
                    type="number"
                    placeholder="e.g., 2"
                    value={formData.occupancy}
                    onChange={(e) => setFormData(prev => ({ ...prev, occupancy: e.target.value }))}
                    className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                    data-testid="input-occupancy"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="insulation" className="text-white/90">Insulation Quality</Label>
                <Select value={formData.insulation} onValueChange={(value) => setFormData(prev => ({ ...prev, insulation: value }))}>
                  <SelectTrigger className="bg-white/5 backdrop-blur-sm border-white/20 text-white focus:border-amber-500" data-testid="select-insulation">
                    <SelectValue placeholder="Select insulation level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="poor">Poor</SelectItem>
                    <SelectItem value="average">Average</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="excellent">Excellent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="exposures" className="text-white/90">Sun Exposure</Label>
                <Select value={formData.exposures} onValueChange={(value) => setFormData(prev => ({ ...prev, exposures: value }))}>
                  <SelectTrigger className="bg-white/5 backdrop-blur-sm border-white/20 text-white focus:border-amber-500" data-testid="select-sun-exposure">
                    <SelectValue placeholder="Primary sun exposure" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="north">North (Minimal sun)</SelectItem>
                    <SelectItem value="east">East (Morning sun)</SelectItem>
                    <SelectItem value="south">South (Moderate sun)</SelectItem>
                    <SelectItem value="west">West (Afternoon sun)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={calculateBTU} 
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/50" 
                size="lg"
                data-testid="button-calculate-btu"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Calculate BTU Requirements
              </Button>
            </div>
          </div>

          {/* Results */}
          {results && (
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-6">
                <h2 className="flex items-center gap-2 text-2xl font-bold text-white mb-6">
                  <Thermometer className="h-5 w-5 text-amber-500" />
                  BTU Requirements
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Snowflake className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-white" data-testid="text-cooling-tonnage">{results.coolingTonnage} Tons</div>
                    <div className="text-sm text-white/60">Cooling Capacity</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Wind className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="text-2xl font-bold text-white" data-testid="text-heating-btu">{results.heatingBtu.toLocaleString()}</div>
                    <div className="text-sm text-white/60">Heating BTU/hr</div>
                  </div>
                </div>
              </div>

              {/* Equipment Recommendations */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Recommended Equipment</h3>
                
                {/* Ducane */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-4">
                  <h4 className="text-base text-amber-500 font-bold mb-3">Ducane Equipment</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                      <div className="font-medium text-sm text-blue-400 mb-1">Air Conditioner</div>
                      <div className="text-sm text-white/80" data-testid="text-ducane-cooling">{results.ducaneModels.cooling}</div>
                    </div>
                    <div className="p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                      <div className="font-medium text-sm text-amber-400 mb-1">Furnace</div>
                      <div className="text-sm text-white/80" data-testid="text-ducane-heating">{results.ducaneModels.heating}</div>
                    </div>
                  </div>
                </div>

                {/* Daikin */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-4">
                  <h4 className="text-base text-amber-500 font-bold mb-3">Daikin Equipment</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                      <div className="font-medium text-sm text-blue-400 mb-1">Air Conditioner</div>
                      <div className="text-sm text-white/80" data-testid="text-daikin-cooling">{results.daikinModels.cooling}</div>
                    </div>
                    <div className="p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                      <div className="font-medium text-sm text-amber-400 mb-1">Furnace</div>
                      <div className="text-sm text-white/80" data-testid="text-daikin-heating">{results.daikinModels.heating}</div>
                    </div>
                  </div>
                </div>

                {/* Lennox */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-4">
                  <h4 className="text-base text-amber-500 font-bold mb-3">Lennox Equipment</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                      <div className="font-medium text-sm text-blue-400 mb-1">Air Conditioner</div>
                      <div className="text-sm text-white/80" data-testid="text-lennox-cooling">{results.lennoxModels.cooling}</div>
                    </div>
                    <div className="p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                      <div className="font-medium text-sm text-amber-400 mb-1">Furnace</div>
                      <div className="text-sm text-white/80" data-testid="text-lennox-heating">{results.lennoxModels.heating}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-500 to-amber-600 shadow-2xl shadow-amber-500/50 rounded-2xl p-6">
                <div className="text-center">
                  <Calculator className="h-8 w-8 mx-auto mb-3 text-white" />
                  <h3 className="text-lg font-bold mb-2 text-white">Ready for Installation?</h3>
                  <p className="mb-4 text-white/90">Get professional installation from AfterHours HVAC</p>
                  <Button 
                    variant="secondary" 
                    className="bg-white text-slate-900 hover:bg-white/90 font-semibold"
                    data-testid="button-get-quote"
                  >
                    Get Free Quote
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}