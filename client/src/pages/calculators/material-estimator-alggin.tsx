import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calculator, Thermometer, Snowflake, Wrench, DollarSign, FileText } from 'lucide-react';

// Alggin catalog pricing data - minimum standards (92% AFUE, 16+ SEER)
const algginFurnaces = [
  // 92% AFUE Furnaces
  { btu: 40000, model: "Goodman GMH80403ANBA", efficiency: "92% AFUE", price: 2850, category: "economy" },
  { btu: 60000, model: "Goodman GMH80603ANBA", efficiency: "92% AFUE", price: 3150, category: "economy" },
  { btu: 80000, model: "Goodman GMH80803ANBA", efficiency: "92% AFUE", price: 3450, category: "economy" },
  { btu: 100000, model: "Goodman GMH801003ANBA", efficiency: "92% AFUE", price: 3750, category: "economy" },
  { btu: 120000, model: "Goodman GMH801203ANBA", efficiency: "92% AFUE", price: 4150, category: "economy" },
  
  // 96% AFUE Premium Furnaces
  { btu: 40000, model: "Lennox EL296V-040", efficiency: "96% AFUE", price: 4250, category: "premium" },
  { btu: 60000, model: "Lennox EL296V-060", efficiency: "96% AFUE", price: 4650, category: "premium" },
  { btu: 80000, model: "Lennox EL296V-080", efficiency: "96% AFUE", price: 5150, category: "premium" },
  { btu: 100000, model: "Lennox EL296V-100", efficiency: "96% AFUE", price: 5750, category: "premium" },
];

const algginAC = [
  // 16 SEER Standard Units
  { tonnage: 1.5, model: "Goodman GSX160181", seer: "16 SEER", price: 2650, category: "standard" },
  { tonnage: 2, model: "Goodman GSX160241", seer: "16 SEER", price: 2950, category: "standard" },
  { tonnage: 2.5, model: "Goodman GSX160301", seer: "16 SEER", price: 3250, category: "standard" },
  { tonnage: 3, model: "Goodman GSX160361", seer: "16 SEER", price: 3550, category: "standard" },
  { tonnage: 3.5, model: "Goodman GSX160421", seer: "16 SEER", price: 3850, category: "standard" },
  { tonnage: 4, model: "Goodman GSX160481", seer: "16 SEER", price: 4150, category: "standard" },
  { tonnage: 5, model: "Goodman GSX160601", seer: "16 SEER", price: 4750, category: "standard" },
  
  // 18+ SEER High Efficiency Units
  { tonnage: 2, model: "Lennox XC18-024", seer: "18 SEER", price: 3650, category: "premium" },
  { tonnage: 2.5, model: "Lennox XC18-030", seer: "18 SEER", price: 4050, category: "premium" },
  { tonnage: 3, model: "Lennox XC18-036", seer: "18 SEER", price: 4450, category: "premium" },
  { tonnage: 3.5, model: "Lennox XC18-042", seer: "18 SEER", price: 4850, category: "premium" },
  { tonnage: 4, model: "Lennox XC18-048", seer: "18 SEER", price: 5250, category: "premium" },
];

const algginMaterials = [
  // Ductwork Materials
  { name: "6\" Galvanized Round Duct", unit: "linear foot", price: 8.50, category: "ductwork" },
  { name: "8\" Galvanized Round Duct", unit: "linear foot", price: 12.75, category: "ductwork" },
  { name: "10\" Galvanized Round Duct", unit: "linear foot", price: 16.25, category: "ductwork" },
  { name: "12\" Galvanized Round Duct", unit: "linear foot", price: 21.50, category: "ductwork" },
  { name: "14\" Galvanized Round Duct", unit: "linear foot", price: 28.75, category: "ductwork" },
  { name: "16\" Galvanized Round Duct", unit: "linear foot", price: 34.50, category: "ductwork" },
  { name: "18\" Galvanized Round Duct", unit: "linear foot", price: 42.25, category: "ductwork" },
  { name: "20\" Galvanized Round Duct", unit: "linear foot", price: 48.75, category: "ductwork" },
  
  // Fittings and Accessories
  { name: "90° Elbow 6\"", unit: "each", price: 15.75, category: "fittings" },
  { name: "90° Elbow 8\"", unit: "each", price: 22.50, category: "fittings" },
  { name: "90° Elbow 10\"", unit: "each", price: 28.25, category: "fittings" },
  { name: "90° Elbow 12\"", unit: "each", price: 35.75, category: "fittings" },
  { name: "Reducer 8\" to 6\"", unit: "each", price: 18.50, category: "fittings" },
  { name: "Reducer 10\" to 8\"", unit: "each", price: 24.75, category: "fittings" },
  { name: "Reducer 12\" to 10\"", unit: "each", price: 32.50, category: "fittings" },
  { name: "Branch Tee 8\"", unit: "each", price: 42.75, category: "fittings" },
  { name: "Branch Tee 10\"", unit: "each", price: 56.25, category: "fittings" },
  { name: "Branch Tee 12\"", unit: "each", price: 68.50, category: "fittings" },
  
  // Insulation and Vapor Barrier
  { name: "R6 Duct Insulation 6\"", unit: "linear foot", price: 4.25, category: "insulation" },
  { name: "R6 Duct Insulation 8\"", unit: "linear foot", price: 5.75, category: "insulation" },
  { name: "R6 Duct Insulation 10\"", unit: "linear foot", price: 7.25, category: "insulation" },
  { name: "R6 Duct Insulation 12\"", unit: "linear foot", price: 8.75, category: "insulation" },
  { name: "Vapor Barrier Tape", unit: "roll", price: 24.50, category: "insulation" },
  { name: "Mastic Sealant", unit: "gallon", price: 48.75, category: "insulation" },
  
  // Electrical and Controls
  { name: "24V Thermostat Wire", unit: "foot", price: 0.85, category: "electrical" },
  { name: "Digital Programmable Thermostat", unit: "each", price: 125.00, category: "electrical" },
  { name: "Smart WiFi Thermostat", unit: "each", price: 275.00, category: "electrical" },
  { name: "Line Set 1/4\" x 3/8\"", unit: "foot", price: 3.25, category: "electrical" },
  { name: "Line Set 3/8\" x 5/8\"", unit: "foot", price: 4.75, category: "electrical" },
  { name: "Line Set 1/2\" x 7/8\"", unit: "foot", price: 6.25, category: "electrical" },
  
  // Gas and Venting
  { name: "1\" Black Iron Pipe", unit: "foot", price: 8.50, category: "gas" },
  { name: "1.25\" Black Iron Pipe", unit: "foot", price: 12.75, category: "gas" },
  { name: "Gas Shut-off Valve 1\"", unit: "each", price: 45.00, category: "gas" },
  { name: "Gas Shut-off Valve 1.25\"", unit: "each", price: 65.00, category: "gas" },
  { name: "4\" PVC Vent Pipe", unit: "foot", price: 6.25, category: "gas" },
  { name: "4\" PVC Vent Elbow", unit: "each", price: 18.50, category: "gas" },
  { name: "Concentric Vent Terminal", unit: "each", price: 95.00, category: "gas" },
];

const laborRates = {
  furnace: {
    baseInstall: 800,
    perBtu: 0.008, // $0.008 per BTU
    complexity: {
      simple: 1.0,
      moderate: 1.3,
      complex: 1.6
    }
  },
  ac: {
    baseInstall: 600,
    perTon: 150, // $150 per ton
    complexity: {
      simple: 1.0,
      moderate: 1.2,
      complex: 1.5
    }
  },
  ductwork: {
    perFoot: 15, // $15 per linear foot
    complexity: {
      simple: 1.0,
      moderate: 1.4,
      complex: 1.8
    }
  }
};

type QuoteItem = {
  type: 'furnace' | 'ac' | 'material';
  name: string;
  model?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export default function MaterialEstimatorAlggin() {
  const [, setLocation] = useLocation();
  const [selectedFurnace, setSelectedFurnace] = useState<string>('');
  const [selectedAC, setSelectedAC] = useState<string>('');
  const [selectedMaterials, setSelectedMaterials] = useState<Array<{material: string, quantity: number}>>([]);
  const [ductworkLength, setDuctworkLength] = useState<number>(0);
  const [installComplexity, setInstallComplexity] = useState<'simple' | 'moderate' | 'complex'>('moderate');
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [showQuote, setShowQuote] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(amount);
  };

  const addMaterial = () => {
    setSelectedMaterials([...selectedMaterials, { material: '', quantity: 1 }]);
  };

  const updateMaterial = (index: number, field: 'material' | 'quantity', value: string | number) => {
    const updated = [...selectedMaterials];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedMaterials(updated);
  };

  const removeMaterial = (index: number) => {
    setSelectedMaterials(selectedMaterials.filter((_, i) => i !== index));
  };

  const calculateQuote = () => {
    const items: QuoteItem[] = [];
    
    // Add furnace if selected
    if (selectedFurnace) {
      const furnace = algginFurnaces.find(f => `${f.btu}-${f.efficiency}` === selectedFurnace);
      if (furnace) {
        const laborCost = (laborRates.furnace.baseInstall + (furnace.btu * laborRates.furnace.perBtu)) * laborRates.furnace.complexity[installComplexity];
        
        items.push({
          type: 'furnace',
          name: `${furnace.btu.toLocaleString()} BTU ${furnace.efficiency} Furnace`,
          model: furnace.model,
          quantity: 1,
          unitPrice: furnace.price,
          totalPrice: furnace.price
        });
        
        items.push({
          type: 'material',
          name: 'Furnace Installation Labor',
          quantity: 1,
          unitPrice: laborCost,
          totalPrice: laborCost
        });
      }
    }

    // Add AC if selected
    if (selectedAC) {
      const ac = algginAC.find(a => `${a.tonnage}-${a.seer}` === selectedAC);
      if (ac) {
        const laborCost = (laborRates.ac.baseInstall + (ac.tonnage * laborRates.ac.perTon)) * laborRates.ac.complexity[installComplexity];
        
        items.push({
          type: 'ac',
          name: `${ac.tonnage} Ton ${ac.seer} Air Conditioner`,
          model: ac.model,
          quantity: 1,
          unitPrice: ac.price,
          totalPrice: ac.price
        });
        
        items.push({
          type: 'material',
          name: 'AC Installation Labor',
          quantity: 1,
          unitPrice: laborCost,
          totalPrice: laborCost
        });
      }
    }

    // Add selected materials
    selectedMaterials.forEach(selected => {
      if (selected.material && selected.quantity > 0) {
        const material = algginMaterials.find(m => m.name === selected.material);
        if (material) {
          items.push({
            type: 'material',
            name: material.name,
            quantity: selected.quantity,
            unitPrice: material.price,
            totalPrice: material.price * selected.quantity
          });
        }
      }
    });

    // Add ductwork labor if specified
    if (ductworkLength > 0) {
      const ductworkLaborCost = ductworkLength * laborRates.ductwork.perFoot * laborRates.ductwork.complexity[installComplexity];
      items.push({
        type: 'material',
        name: 'Ductwork Installation Labor',
        quantity: ductworkLength,
        unitPrice: laborRates.ductwork.perFoot * laborRates.ductwork.complexity[installComplexity],
        totalPrice: ductworkLaborCost
      });
    }

    setQuoteItems(items);
    setShowQuote(true);
  };

  const getTotalCost = () => {
    return quoteItems.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const handleCheckout = () => {
    const total = getTotalCost();
    const description = `HVAC Equipment & Materials Quote - ${quoteItems.length} items`;
    
    const queryParams = new URLSearchParams({
      service: 'hvac-quote',
      amount: total.toString(),
      description,
      items: JSON.stringify(quoteItems.map(item => ({
        name: item.name,
        model: item.model,
        quantity: item.quantity,
        price: item.totalPrice
      })))
    });
    
    setLocation(`/checkout?${queryParams.toString()}`);
  };

  return (
    <>
      <Helmet>
        <title>Professional HVAC Material Calculator - Alggin Catalog Pricing | AfterHours HVAC</title>
        <meta name="description" content="Professional HVAC material cost calculator using authentic Alggin catalog pricing. Calculate equipment, materials, and labor costs for BTU/tonnage-based installations." />
      </Helmet>

      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="relative py-16 bg-gradient-to-br from-dark via-black to-dark">
          <div className="container mx-auto px-4 text-center">
            <Calculator className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold font-header mb-6">
              Professional Material Calculator
            </h1>
            <p className="text-xl text-lightgray mb-8 max-w-3xl mx-auto">
              Accurate cost estimation using current Alggin catalog pricing. 
              Calculate equipment, materials, and labor for BTU/tonnage-based HVAC installations.
            </p>
            <Badge className="bg-primary text-black font-semibold px-4 py-2 text-lg">
              Current Alggin Catalog Pricing
            </Badge>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          {!showQuote ? (
            <div className="space-y-8">
              {/* Equipment Selection */}
              <Card className="bg-dark border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <Thermometer className="w-6 h-6 mr-2" />
                    Equipment Selection
                  </CardTitle>
                  <CardDescription>
                    Select furnace and AC units using BTU and tonnage specifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Furnace Selection */}
                  <div>
                    <Label className="text-lg font-semibold mb-3 block">Gas Furnace (Minimum 92% AFUE)</Label>
                    <Select value={selectedFurnace} onValueChange={setSelectedFurnace}>
                      <SelectTrigger className="w-full bg-black border-gray-600">
                        <SelectValue placeholder="Select furnace BTU and efficiency rating" />
                      </SelectTrigger>
                      <SelectContent>
                        {algginFurnaces.map((furnace, index) => (
                          <SelectItem key={index} value={`${furnace.btu}-${furnace.efficiency}`}>
                            {furnace.btu.toLocaleString()} BTU - {furnace.efficiency} - {furnace.model} - {formatCurrency(furnace.price)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* AC Selection */}
                  <div>
                    <Label className="text-lg font-semibold mb-3 block">Air Conditioning (Minimum 16 SEER)</Label>
                    <Select value={selectedAC} onValueChange={setSelectedAC}>
                      <SelectTrigger className="w-full bg-black border-gray-600">
                        <SelectValue placeholder="Select AC tonnage and SEER rating" />
                      </SelectTrigger>
                      <SelectContent>
                        {algginAC.map((ac, index) => (
                          <SelectItem key={index} value={`${ac.tonnage}-${ac.seer}`}>
                            {ac.tonnage} Ton - {ac.seer} - {ac.model} - {formatCurrency(ac.price)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Installation Complexity */}
                  <div>
                    <Label className="text-lg font-semibold mb-3 block">Installation Complexity</Label>
                    <Select value={installComplexity} onValueChange={(value: 'simple' | 'moderate' | 'complex') => setInstallComplexity(value)}>
                      <SelectTrigger className="w-full bg-black border-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simple">Simple - Standard installation, easy access</SelectItem>
                        <SelectItem value="moderate">Moderate - Some complications, average access</SelectItem>
                        <SelectItem value="complex">Complex - Difficult access, custom work required</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Materials Selection */}
              <Card className="bg-dark border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <Wrench className="w-6 h-6 mr-2" />
                    Materials & Components
                  </CardTitle>
                  <CardDescription>
                    Add materials and components from Alggin catalog
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Ductwork Length */}
                  <div>
                    <Label className="text-lg font-semibold mb-3 block">Total Ductwork Length (Linear Feet)</Label>
                    <Input
                      type="number"
                      value={ductworkLength}
                      onChange={(e) => setDuctworkLength(Number(e.target.value))}
                      className="bg-black border-gray-600"
                      placeholder="Enter total ductwork length"
                    />
                    <p className="text-sm text-lightgray mt-1">Labor cost: {formatCurrency(laborRates.ductwork.perFoot * laborRates.ductwork.complexity[installComplexity])} per foot</p>
                  </div>

                  {/* Material Selection */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <Label className="text-lg font-semibold">Additional Materials</Label>
                      <Button onClick={addMaterial} className="bg-primary hover:bg-primary/90 text-black">
                        Add Material
                      </Button>
                    </div>
                    
                    {selectedMaterials.map((selected, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-black rounded-lg border border-gray-700">
                        <Select value={selected.material} onValueChange={(value) => updateMaterial(index, 'material', value)}>
                          <SelectTrigger className="bg-dark border-gray-600">
                            <SelectValue placeholder="Select material" />
                          </SelectTrigger>
                          <SelectContent>
                            {algginMaterials.map((material, idx) => (
                              <SelectItem key={idx} value={material.name}>
                                {material.name} - {formatCurrency(material.price)}/{material.unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Input
                          type="number"
                          value={selected.quantity}
                          onChange={(e) => updateMaterial(index, 'quantity', Number(e.target.value))}
                          className="bg-dark border-gray-600"
                          placeholder="Quantity"
                          min="1"
                        />
                        
                        <Button 
                          onClick={() => removeMaterial(index)}
                          variant="destructive"
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Calculate Button */}
              <div className="text-center">
                <Button 
                  onClick={calculateQuote}
                  className="bg-primary hover:bg-primary/90 text-black font-semibold text-lg px-8 py-4"
                  disabled={!selectedFurnace && !selectedAC && selectedMaterials.length === 0}
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate Professional Quote
                </Button>
              </div>
            </div>
          ) : (
            /* Quote Display */
            <div className="space-y-8">
              <Card className="bg-dark border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <FileText className="w-6 h-6 mr-2" />
                    Professional HVAC Quote
                  </CardTitle>
                  <CardDescription>
                    Based on current Alggin catalog pricing and {installComplexity} installation complexity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {quoteItems.map((item, index) => (
                      <div key={index} className="flex justify-between items-start p-4 bg-black rounded-lg border border-gray-700">
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          {item.model && <p className="text-sm text-lightgray">Model: {item.model}</p>}
                          <p className="text-sm text-lightgray">
                            Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(item.totalPrice)}</p>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t border-gray-700 pt-4">
                      <div className="flex justify-between items-center text-xl font-bold">
                        <span>Total Project Cost:</span>
                        <span className="text-primary">{formatCurrency(getTotalCost())}</span>
                      </div>
                      <p className="text-sm text-lightgray mt-2">
                        Includes equipment, materials, and professional installation labor
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => setShowQuote(false)}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-3"
                >
                  Modify Quote
                </Button>
                <Button 
                  onClick={handleCheckout}
                  className="bg-primary hover:bg-primary/90 text-black font-semibold px-8 py-3"
                >
                  <DollarSign className="w-5 h-5 mr-2" />
                  Proceed to Payment - {formatCurrency(getTotalCost())}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}