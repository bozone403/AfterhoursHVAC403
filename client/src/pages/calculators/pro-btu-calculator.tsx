import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Calculator, Thermometer, Home, Snowflake } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProAccessGuard } from "@/components/ProAccessGuard";

interface LoadCalculation {
  heatingLoad: number;
  coolingLoad: number;
  recommendedFurnaceSize: number;
  recommendedACSize: number;
  efficiency: string;
}

function ProBTUCalculatorContent() {
  const [squareFootage, setSquareFootage] = useState<string>("");
  const [ceilingHeight, setCeilingHeight] = useState<string>("8");
  const [insulationLevel, setInsulationLevel] = useState<string>("");
  const [windowCount, setWindowCount] = useState<string>("");
  const [homeAge, setHomeAge] = useState<string>("");
  const [climateZone, setClimateZone] = useState<string>("");
  const [result, setResult] = useState<LoadCalculation | null>(null);

  const calculateLoad = () => {
    if (!squareFootage || !insulationLevel || !windowCount || !homeAge || !climateZone) {
      return;
    }

    const sqft = parseFloat(squareFootage);
    const height = parseFloat(ceilingHeight);
    const windows = parseInt(windowCount);
    
    // Base BTU per square foot calculations for Calgary climate
    let baseBTUHeating = 35; // Base BTU/sqft for heating
    let baseBTUCooling = 20; // Base BTU/sqft for cooling

    // Insulation adjustments
    const insulationMultipliers: { [key: string]: { heating: number; cooling: number } } = {
      "poor": { heating: 1.4, cooling: 1.3 },
      "average": { heating: 1.0, cooling: 1.0 },
      "good": { heating: 0.8, cooling: 0.85 },
      "excellent": { heating: 0.65, cooling: 0.75 }
    };

    // Home age adjustments
    const ageMultipliers: { [key: string]: { heating: number; cooling: number } } = {
      "pre1980": { heating: 1.3, cooling: 1.2 },
      "1980-2000": { heating: 1.1, cooling: 1.1 },
      "2000-2010": { heating: 1.0, cooling: 1.0 },
      "post2010": { heating: 0.9, cooling: 0.95 }
    };

    // Climate zone adjustments (Calgary specific)
    const climateMultipliers: { [key: string]: { heating: number; cooling: number } } = {
      "calgary": { heating: 1.2, cooling: 0.8 },
      "edmonton": { heating: 1.3, cooling: 0.7 },
      "redDeer": { heating: 1.25, cooling: 0.75 },
      "lethbridge": { heating: 1.1, cooling: 0.9 }
    };

    const insulationAdj = insulationMultipliers[insulationLevel];
    const ageAdj = ageMultipliers[homeAge];
    const climateAdj = climateMultipliers[climateZone];

    // Calculate base load
    let heatingLoad = sqft * baseBTUHeating * height / 8;
    let coolingLoad = sqft * baseBTUCooling * height / 8;

    // Apply multipliers
    heatingLoad *= insulationAdj.heating * ageAdj.heating * climateAdj.heating;
    coolingLoad *= insulationAdj.cooling * ageAdj.cooling * climateAdj.cooling;

    // Window adjustments (500 BTU heating, 300 BTU cooling per window)
    heatingLoad += windows * 500;
    coolingLoad += windows * 300;

    // Round to nearest 5000 BTU for furnace sizing
    const recommendedFurnaceSize = Math.ceil(heatingLoad / 5000) * 5000;
    const recommendedACSize = Math.ceil(coolingLoad / 12000) * 0.5; // Convert to tons

    // Efficiency recommendations
    let efficiency = "Standard Efficiency (80-85% AFUE)";
    if (insulationLevel === "good" || insulationLevel === "excellent") {
      efficiency = "High Efficiency (90-96% AFUE)";
    }

    setResult({
      heatingLoad: Math.round(heatingLoad),
      coolingLoad: Math.round(coolingLoad),
      recommendedFurnaceSize,
      recommendedACSize,
      efficiency
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center bg-amber-500/20 border border-amber-500/30 rounded-full px-4 py-2 mb-4">
            <Calculator className="h-4 w-4 text-amber-500 mr-2" />
            <span className="text-amber-500 text-sm font-medium">Pro Tool</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Professional Load Calculator</h1>
          <p className="text-white/70">Manual J-style load calculations for Alberta climate zones</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-6">
            <h2 className="flex items-center gap-2 text-2xl font-bold text-white mb-6">
              <Home className="h-5 w-5 text-amber-500" />
              Building Information
            </h2>
            <div className="space-y-4">
            <div>
              <Label htmlFor="squareFootage" className="text-white/90">Square Footage</Label>
              <Input
                id="squareFootage"
                type="number"
                placeholder="e.g., 2000"
                value={squareFootage}
                onChange={(e) => setSquareFootage(e.target.value)}
                className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                data-testid="input-square-footage"
              />
            </div>

            <div>
              <Label htmlFor="ceilingHeight" className="text-white/90">Ceiling Height (feet)</Label>
              <Select value={ceilingHeight} onValueChange={setCeilingHeight}>
                <SelectTrigger className="bg-white/5 backdrop-blur-sm border-white/20 text-white focus:border-amber-500" data-testid="select-ceiling-height">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8">8 feet</SelectItem>
                  <SelectItem value="9">9 feet</SelectItem>
                  <SelectItem value="10">10 feet</SelectItem>
                  <SelectItem value="12">12 feet (vaulted)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="insulationLevel" className="text-white/90">Insulation Level</Label>
              <Select value={insulationLevel} onValueChange={setInsulationLevel}>
                <SelectTrigger className="bg-white/5 backdrop-blur-sm border-white/20 text-white focus:border-amber-500" data-testid="select-insulation">
                  <SelectValue placeholder="Select insulation level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="poor">Poor (R-12 walls, R-20 attic)</SelectItem>
                  <SelectItem value="average">Average (R-20 walls, R-40 attic)</SelectItem>
                  <SelectItem value="good">Good (R-24 walls, R-50 attic)</SelectItem>
                  <SelectItem value="excellent">Excellent (R-28+ walls, R-60+ attic)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="windowCount" className="text-white/90">Number of Windows</Label>
              <Input
                id="windowCount"
                type="number"
                placeholder="e.g., 15"
                value={windowCount}
                onChange={(e) => setWindowCount(e.target.value)}
                className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                data-testid="input-window-count"
              />
            </div>

            <div>
              <Label htmlFor="homeAge" className="text-white/90">Home Age</Label>
              <Select value={homeAge} onValueChange={setHomeAge}>
                <SelectTrigger className="bg-white/5 backdrop-blur-sm border-white/20 text-white focus:border-amber-500" data-testid="select-home-age">
                  <SelectValue placeholder="Select home age" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pre1980">Pre-1980</SelectItem>
                  <SelectItem value="1980-2000">1980-2000</SelectItem>
                  <SelectItem value="2000-2010">2000-2010</SelectItem>
                  <SelectItem value="post2010">Post-2010</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="climateZone" className="text-white/90">Alberta Climate Zone</Label>
              <Select value={climateZone} onValueChange={setClimateZone}>
                <SelectTrigger className="bg-white/5 backdrop-blur-sm border-white/20 text-white focus:border-amber-500" data-testid="select-climate-zone">
                  <SelectValue placeholder="Select climate zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="calgary">Calgary Area</SelectItem>
                  <SelectItem value="edmonton">Edmonton Area</SelectItem>
                  <SelectItem value="redDeer">Red Deer Area</SelectItem>
                  <SelectItem value="lethbridge">Lethbridge Area</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={calculateLoad} 
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/50"
              disabled={!squareFootage || !insulationLevel || !windowCount || !homeAge || !climateZone}
              data-testid="button-calculate-load"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Load
            </Button>
            </div>
          </div>

          {/* Results */}
          {result && (
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-6">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-white mb-6">
                <Thermometer className="h-5 w-5 text-amber-500" />
                Load Calculation Results
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                    <Snowflake className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white" data-testid="text-heating-load">
                      {result.heatingLoad.toLocaleString()}
                    </div>
                    <div className="text-sm text-white/60">BTU/hr Heating</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                    <Thermometer className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white" data-testid="text-cooling-load">
                      {result.coolingLoad.toLocaleString()}
                    </div>
                    <div className="text-sm text-white/60">BTU/hr Cooling</div>
                  </div>
                </div>

                <div className="h-px bg-white/20 my-4"></div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Equipment Recommendations</h4>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Furnace Size:</span>
                    <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-blue-400 font-semibold" data-testid="text-furnace-size">
                      {result.recommendedFurnaceSize.toLocaleString()} BTU/hr
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-white/70">AC Size:</span>
                    <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-amber-400 font-semibold" data-testid="text-ac-size">
                      {result.recommendedACSize} tons
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Efficiency:</span>
                    <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-green-400 font-semibold" data-testid="text-efficiency">
                      {result.efficiency}
                    </span>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-white/70">
                    These calculations are estimates based on Manual J principles. Professional engineering 
                    calculations may be required for complex installations or permit applications.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProBTUCalculator() {
  return (
    <ProAccessGuard>
      <ProBTUCalculatorContent />
    </ProAccessGuard>
  );
}