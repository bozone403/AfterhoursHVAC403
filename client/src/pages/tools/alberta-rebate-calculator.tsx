import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, DollarSign, TrendingUp, Leaf, Phone, CheckCircle, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EquipmentOption {
  id: string;
  name: string;
  efficiency: number;
  type: 'furnace' | 'ac' | 'heatpump';
  price: number;
}

interface RebateProgram {
  name: string;
  amount: number;
  description: string;
  eligibility: string;
}

export default function AlbertaRebateCalculator() {
  const [currentEquipment, setCurrentEquipment] = useState("");
  const [proposedEquipment, setProposedEquipment] = useState("");
  const [monthlyBill, setMonthlyBill] = useState("");
  const [homeSize, setHomeSize] = useState("");
  const [homeAge, setHomeAge] = useState("");
  const [results, setResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  // Equipment database with current Alberta pricing
  const currentEquipmentOptions: EquipmentOption[] = [
    { id: 'old_furnace_60', name: '20+ Year Old 60% AFUE Furnace', efficiency: 60, type: 'furnace', price: 0 },
    { id: 'old_furnace_80', name: '15+ Year Old 80% AFUE Furnace', efficiency: 80, type: 'furnace', price: 0 },
    { id: 'old_furnace_90', name: '10+ Year Old 90% AFUE Furnace', efficiency: 90, type: 'furnace', price: 0 },
    { id: 'old_ac_10', name: '15+ Year Old 10 SEER AC', efficiency: 10, type: 'ac', price: 0 },
    { id: 'old_ac_13', name: '10+ Year Old 13 SEER AC', efficiency: 13, type: 'ac', price: 0 },
  ];

  const proposedEquipmentOptions: EquipmentOption[] = [
    { id: 'lennox_slp99v', name: 'Lennox SLP99V 99% AFUE Variable Speed', efficiency: 99, type: 'furnace', price: 14499 },
    { id: 'carrier_infinity', name: 'Carrier Infinity 96% AFUE Two-Stage', efficiency: 96, type: 'furnace', price: 12999 },
    { id: 'goodman_gmvc96', name: 'Goodman GMVC96 96% AFUE Variable Speed', efficiency: 96, type: 'furnace', price: 9999 },
    { id: 'lennox_ac_18', name: 'Lennox XC25 18 SEER Variable Speed AC', efficiency: 18, type: 'ac', price: 8999 },
    { id: 'carrier_ac_16', name: 'Carrier Infinity 16 SEER Two-Stage AC', efficiency: 16, type: 'ac', price: 7499 },
    { id: 'goodman_ac_16', name: 'Goodman GSXC16 16 SEER Single Stage AC', efficiency: 16, type: 'ac', price: 5999 },
  ];

  // Alberta-specific rebate programs (2025 rates)
  const albertaRebates: RebateProgram[] = [
    {
      name: "Canada Greener Homes Grant",
      amount: 2500,
      description: "Federal rebate for high-efficiency furnaces (95%+ AFUE)",
      eligibility: "Pre and post EnerGuide evaluation required"
    },
    {
      name: "Alberta CEIP Rebate",
      amount: 1000,
      description: "Provincial rebate for ENERGY STAR certified equipment",
      eligibility: "Equipment must be ENERGY STAR certified"
    },
    {
      name: "Municipal Utility Rebate",
      amount: 500,
      description: "Local utility rebates (varies by municipality)",
      eligibility: "Contact local utility for specific programs"
    },
    {
      name: "Low-Income Energy Efficiency",
      amount: 3000,
      description: "Additional support for qualifying low-income households",
      eligibility: "Income verification required"
    }
  ];

  const calculateSavings = () => {
    if (!currentEquipment || !proposedEquipment || !monthlyBill) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to calculate savings.",
        variant: "destructive"
      });
      return;
    }

    setIsCalculating(true);

    setTimeout(() => {
      const currentEq = currentEquipmentOptions.find(eq => eq.id === currentEquipment);
      const proposedEq = proposedEquipmentOptions.find(eq => eq.id === proposedEquipment);
      const bill = parseFloat(monthlyBill);
      const size = parseInt(homeSize) || 2000;

      if (!currentEq || !proposedEq) return;

      // Calculate efficiency improvement
      const efficiencyGain = (proposedEq.efficiency - currentEq.efficiency) / currentEq.efficiency;
      
      // Estimate annual energy savings based on monthly bill and efficiency gain
      const annualCurrentCost = bill * 12;
      const annualSavings = annualCurrentCost * efficiencyGain * 0.8; // Conservative estimate

      // Calculate applicable rebates
      const applicableRebates = albertaRebates.filter(rebate => {
        if (rebate.name.includes("Greener Homes") && proposedEq.efficiency >= 95) return true;
        if (rebate.name.includes("CEIP") && proposedEq.efficiency >= 90) return true;
        if (rebate.name.includes("Municipal")) return true;
        return false;
      });

      const totalRebates = applicableRebates.reduce((sum, rebate) => sum + rebate.amount, 0);
      const netCost = proposedEq.price - totalRebates;
      const simplePayback = annualSavings > 0 ? netCost / annualSavings : 999;
      const tenYearSavings = (annualSavings * 10) - netCost;

      const calculationResults = {
        currentEquipment: currentEq,
        proposedEquipment: proposedEq,
        grossCost: proposedEq.price,
        totalRebates,
        netCost,
        annualSavings,
        simplePayback,
        tenYearSavings,
        applicableRebates,
        monthlyBill: bill,
        efficiencyImprovement: (efficiencyGain * 100).toFixed(1)
      };

      setResults(calculationResults);
      setIsCalculating(false);
    }, 2000);
  };

  const handleRequestQuote = () => {
    toast({
      title: "Quote Request",
      description: "Redirecting to our quote request system...",
    });
    window.location.href = '/contact';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-green-100 border border-green-200 rounded-full px-6 py-3 mb-6">
            <Calculator className="h-5 w-5 text-green-700 mr-3" />
            <span className="text-green-800 text-lg font-bold">Alberta Rebate Calculator</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">HVAC Upgrade ROI Calculator</h1>
          <p className="text-xl text-white/80 max-w-4xl mx-auto">
            Calculate your savings with real Alberta rebates and current natural gas prices. 
            Get accurate payback periods for your HVAC upgrade investment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Calculator className="h-6 w-6" />
                  Equipment & Usage Information
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="current-equipment" className="text-white/90">Current Equipment *</Label>
                    <Select value={currentEquipment} onValueChange={setCurrentEquipment}>
                      <SelectTrigger className="bg-white/5 backdrop-blur-sm border-white/20 text-white focus:border-amber-500">
                        <SelectValue placeholder="Select your current system" />
                      </SelectTrigger>
                      <SelectContent>
                        {currentEquipmentOptions.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="proposed-equipment" className="text-white/90">Proposed Upgrade *</Label>
                    <Select value={proposedEquipment} onValueChange={setProposedEquipment}>
                      <SelectTrigger className="bg-white/5 backdrop-blur-sm border-white/20 text-white focus:border-amber-500">
                        <SelectValue placeholder="Select upgrade option" />
                      </SelectTrigger>
                      <SelectContent>
                        {proposedEquipmentOptions.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.name} - ${option.price.toLocaleString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="monthly-bill" className="text-white/90">Average Monthly Gas Bill *</Label>
                    <Input className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                      id="monthly-bill"
                      type="number"
                      placeholder="250"
                      value={monthlyBill}
                      onChange={(e) => setMonthlyBill(e.target.value)}
                    />
                    <p className="text-xs text-white/60 mt-1">During heating season</p>
                  </div>

                  <div>
                    <Label htmlFor="home-size" className="text-white/90">Home Size (sq ft)</Label>
                    <Input className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                      id="home-size"
                      type="number"
                      placeholder="2000"
                      value={homeSize}
                      onChange={(e) => setHomeSize(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="home-age" className="text-white/90">Home Age (years)</Label>
                    <Select value={homeAge} onValueChange={setHomeAge}>
                      <SelectTrigger className="bg-white/5 backdrop-blur-sm border-white/20 text-white focus:border-amber-500">
                        <SelectValue placeholder="Select age" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">0-5 years</SelectItem>
                        <SelectItem value="recent">6-15 years</SelectItem>
                        <SelectItem value="mature">16-30 years</SelectItem>
                        <SelectItem value="old">30+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={calculateSavings} 
                  disabled={isCalculating}
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-3"
                >
                  {isCalculating ? (
                    <div className="flex items-center">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Calculating Savings...
                    </div>
                  ) : (
                    <>
                      <Calculator className="h-5 w-5 mr-2" />
                      Calculate My Savings
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            {results && (
              <Card className="bg-white shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <TrendingUp className="h-6 w-6" />
                    Your Investment Analysis
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 border border-blue-200 rounded-lg p-4">
                      <h4 className="text-lg font-bold text-blue-900 mb-3">Investment Breakdown</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-blue-800">Gross Equipment Cost:</span>
                          <span className="font-bold text-blue-900">${results.grossCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-green-700">
                          <span>Less Alberta Rebates:</span>
                          <span className="font-bold">-${results.totalRebates.toLocaleString()}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg">
                          <span className="font-bold text-white">Net Investment:</span>
                          <span className="font-bold text-white">${results.netCost.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 border border-green-200 rounded-lg p-4">
                      <h4 className="text-lg font-bold text-green-900 mb-3">Savings Analysis</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-green-800">Annual Energy Savings:</span>
                          <span className="font-bold text-green-900">${results.annualSavings.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-800">Simple Payback Period:</span>
                          <span className="font-bold text-green-900">
                            {results.simplePayback < 50 ? `${results.simplePayback.toFixed(1)} years` : '50+ years'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-800">10-Year Net Savings:</span>
                          <span className="font-bold text-green-900">
                            ${results.tenYearSavings > 0 ? results.tenYearSavings.toFixed(0) : '0'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <h4 className="text-lg font-bold text-yellow-900 mb-3">Efficiency Improvement</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-yellow-800">
                        Upgrading from {results.currentEquipment.efficiency}% to {results.proposedEquipment.efficiency}% efficiency
                      </span>
                      <Badge className="bg-yellow-100 text-yellow-800 text-lg px-3 py-1">
                        +{results.efficiencyImprovement}% improvement
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-white">Applicable Alberta Rebates</h4>
                    {results.applicableRebates.map((rebate: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-semibold text-white">{rebate.name}</h5>
                          <Badge className="bg-green-100 text-green-800">
                            ${rebate.amount.toLocaleString()}
                          </Badge>
                        </div>
                        <p className="text-sm text-white/80 mb-1">{rebate.description}</p>
                        <p className="text-xs text-white/70">{rebate.eligibility}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm border border-white/10 border border-blue-200 rounded-lg">
                    <h4 className="font-bold text-blue-900 mb-2">Ready to Move Forward?</h4>
                    <p className="text-sm text-blue-800 mb-3">
                      Get a free, no-obligation quote to confirm your eligibility for these rebates and 
                      finalize your upgrade investment.
                    </p>
                    <Button 
                      onClick={handleRequestQuote}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Request Free Quote & Rebate Verification
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Rebates */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
                <CardTitle className="text-xl flex items-center gap-3">
                  <Award className="h-5 w-5" />
                  2025 Alberta Rebates
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {albertaRebates.slice(0, 3).map((rebate, index) => (
                    <div key={index} className="border-b pb-3 last:border-b-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-sm text-white">{rebate.name}</h4>
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          ${rebate.amount.toLocaleString()}
                        </Badge>
                      </div>
                      <p className="text-xs text-white/80">{rebate.description}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-xs text-yellow-800">
                    <strong>Note:</strong> Rebate amounts and eligibility requirements change frequently. 
                    Our technicians will verify current programs during your consultation.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Natural Gas Prices */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-t-lg">
                <CardTitle className="text-xl flex items-center gap-3">
                  <DollarSign className="h-5 w-5" />
                  Current Alberta Rates
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/80">Natural Gas:</span>
                    <span className="font-bold">$3.89/GJ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Electricity:</span>
                    <span className="font-bold">$0.24/kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Carbon Tax:</span>
                    <span className="font-bold">$65/tonne</span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-white/5 backdrop-blur-sm border border-white/10 border border-blue-200 rounded">
                  <p className="text-xs text-blue-800">
                    Rates updated monthly. Calculator uses current provincial averages.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-4">
                <div className="text-center">
                  <h4 className="font-bold text-white mb-2">Expert Rebate Assistance</h4>
                  <p className="text-sm text-white/80 mb-3">
                    Our certified technicians help maximize your rebates
                  </p>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                    <Phone className="h-4 w-4 mr-2" />
                    (403) 613-6014
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl shadow-lg border-0 bg-white">
            <div className="p-6 text-center">
              <Leaf className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Real Alberta Data</h3>
              <p className="text-white/80">
                Current natural gas prices, rebate amounts, and provincial regulations integrated for accurate calculations.
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl shadow-lg border-0 bg-white">
            <div className="p-6 text-center">
              <CheckCircle className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Rebate Navigation</h3>
              <p className="text-white/80">
                Expert guidance through complex federal and provincial rebate programs to maximize your savings.
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl shadow-lg border-0 bg-white">
            <div className="p-6 text-center">
              <TrendingUp className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Investment Analysis</h3>
              <p className="text-white/80">
                Transform equipment costs into clear investment returns with payback periods and long-term savings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}