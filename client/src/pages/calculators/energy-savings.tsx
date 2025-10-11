import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Calculator, Leaf, DollarSign, TrendingUp, Lightbulb, Zap } from "lucide-react";

export default function EnergySavingsCalculator() {
  const [formData, setFormData] = useState({
    squareFootage: "",
    currentHeatingCost: "",
    currentCoolingCost: "",
    currentSystemAge: "",
    currentSystemType: "",
    newSystemType: "",
    energyRating: "",
    utilityRate: "0.12"
  });

  const [results, setResults] = useState<any>(null);

  const calculateSavings = () => {
    const sqft = parseInt(formData.squareFootage) || 0;
    const currentHeating = parseFloat(formData.currentHeatingCost) || 0;
    const currentCooling = parseFloat(formData.currentCoolingCost) || 0;
    const systemAge = parseInt(formData.currentSystemAge) || 0;
    const rate = parseFloat(formData.utilityRate) || 0.12;

    // Efficiency multipliers based on system type and age
    const efficiencyFactors: Record<string, number> = {
      "old_furnace": 0.65,
      "standard_furnace": 0.80,
      "high_efficiency_furnace": 0.95,
      "heat_pump": 0.85,
      "geothermal": 0.98
    };

    const newSystemFactors: Record<string, number> = {
      "high_efficiency_furnace": 0.95,
      "heat_pump": 0.85,
      "geothermal": 0.98,
      "variable_speed": 0.97
    };

    // Age depreciation (systems lose efficiency over time)
    const ageDepreciation = Math.max(0.6, 1 - (systemAge * 0.02));
    
    const currentEfficiency = (efficiencyFactors[formData.currentSystemType] || 0.75) * ageDepreciation;
    const newEfficiency = newSystemFactors[formData.newSystemType] || 0.90;

    const totalCurrentCost = currentHeating + currentCooling;
    const projectedNewCost = totalCurrentCost * (currentEfficiency / newEfficiency);
    const annualSavings = totalCurrentCost - projectedNewCost;
    const monthlySavings = annualSavings / 12;

    // Carbon footprint reduction (kg CO2/year)
    const carbonReduction = annualSavings * 8.5; // rough estimate: $1 savings ≈ 8.5kg CO2

    // 10-year projection
    const tenYearSavings = annualSavings * 10;
    const tenYearCarbonReduction = carbonReduction * 10;

    setResults({
      currentEfficiency: Math.round(currentEfficiency * 100),
      newEfficiency: Math.round(newEfficiency * 100),
      annualSavings: Math.round(annualSavings),
      monthlySavings: Math.round(monthlySavings),
      carbonReduction: Math.round(carbonReduction),
      tenYearSavings: Math.round(tenYearSavings),
      tenYearCarbonReduction: Math.round(tenYearCarbonReduction),
      paybackPeriod: annualSavings > 0 ? Math.round((8000 / annualSavings) * 10) / 10 : 0
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Leaf className="h-8 w-8 text-green-600" />
            <Calculator className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Energy Savings Calculator</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Calculate potential energy savings and environmental impact of upgrading your HVAC system
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-600" />
                System Information
              </CardTitle>
              <CardDescription>
                Enter your current system details and energy costs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="squareFootage">Home Size (sq ft)</Label>
                  <Input
                    id="squareFootage"
                    type="number"
                    placeholder="e.g., 1500"
                    value={formData.squareFootage}
                    onChange={(e) => setFormData(prev => ({ ...prev, squareFootage: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentSystemAge">System Age (years)</Label>
                  <Input
                    id="currentSystemAge"
                    type="number"
                    placeholder="e.g., 15"
                    value={formData.currentSystemAge}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentSystemAge: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentHeatingCost">Monthly Heating Cost</Label>
                  <Input
                    id="currentHeatingCost"
                    type="number"
                    placeholder="e.g., 180"
                    value={formData.currentHeatingCost}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentHeatingCost: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentCoolingCost">Monthly Cooling Cost</Label>
                  <Input
                    id="currentCoolingCost"
                    type="number"
                    placeholder="e.g., 120"
                    value={formData.currentCoolingCost}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentCoolingCost: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentSystemType">Current System Type</Label>
                <Select value={formData.currentSystemType} onValueChange={(value) => setFormData(prev => ({ ...prev, currentSystemType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select current system" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="old_furnace">Old Furnace (15+ years)</SelectItem>
                    <SelectItem value="standard_furnace">Standard Furnace</SelectItem>
                    <SelectItem value="high_efficiency_furnace">High Efficiency Furnace</SelectItem>
                    <SelectItem value="heat_pump">Heat Pump</SelectItem>
                    <SelectItem value="geothermal">Geothermal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newSystemType">Upgrade To</Label>
                <Select value={formData.newSystemType} onValueChange={(value) => setFormData(prev => ({ ...prev, newSystemType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select upgrade option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high_efficiency_furnace">High Efficiency Furnace (95% AFUE)</SelectItem>
                    <SelectItem value="heat_pump">Air Source Heat Pump</SelectItem>
                    <SelectItem value="geothermal">Geothermal System</SelectItem>
                    <SelectItem value="variable_speed">Variable Speed System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={calculateSavings} className="w-full" size="lg">
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Savings
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {results && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Financial Savings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">${results.annualSavings}</div>
                      <div className="text-sm text-gray-600">Annual Savings</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">${results.monthlySavings}</div>
                      <div className="text-sm text-gray-600">Monthly Savings</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">${results.tenYearSavings}</div>
                      <div className="text-sm text-gray-600">10-Year Savings</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{results.paybackPeriod} years</div>
                      <div className="text-sm text-gray-600">Payback Period</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-green-600" />
                    Environmental Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{results.carbonReduction} kg</div>
                      <div className="text-sm text-gray-600">Annual CO₂ Reduction</div>
                    </div>
                    <div className="text-center p-4 bg-emerald-50 rounded-lg">
                      <div className="text-2xl font-bold text-emerald-600">{results.tenYearCarbonReduction} kg</div>
                      <div className="text-sm text-gray-600">10-Year CO₂ Reduction</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Efficiency Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Current System Efficiency</span>
                        <span className="text-sm font-medium">{results.currentEfficiency}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: `${results.currentEfficiency}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">New System Efficiency</span>
                        <span className="text-sm font-medium">{results.newEfficiency}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${results.newEfficiency}%` }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Lightbulb className="h-8 w-8 mx-auto mb-3" />
                    <h3 className="text-lg font-bold mb-2">Ready to Start Saving?</h3>
                    <p className="mb-4 opacity-90">Get a professional quote for your HVAC upgrade</p>
                    <Button variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100">
                      Get Free Quote
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}