import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Link } from 'wouter';
import { Building, Calculator, DollarSign, FileText, Wrench, Lock, Crown } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface CommercialProject {
  buildingType: string;
  squareFootage: number;
  floors: number;
  occupancy: string;
  existingSystem: string;
  projectScope: string;
  timeline: string;
  hvacZones: number;
  specialRequirements: string[];
}

interface SystemCalculation {
  equipment: { name: string; cost: number; quantity: number }[];
  materials: { name: string; cost: number; quantity: number }[];
  labor: { description: string; hours: number; rate: number }[];
  permits: number;
  overhead: number;
  profit: number;
  total: number;
}

const CommercialEstimator = () => {
  const { toast } = useToast();
  const { user, isLoading } = useAuth();

  // Check Pro access
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.hasPro) {
    return (
      <>
        <Helmet>
          <title>Commercial Load Calculator - Pro Required | AfterHours HVAC</title>
          <meta name="description" content="Commercial HVAC load calculator requires Pro membership access." />
        </Helmet>
        
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <Lock className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h1 className="text-4xl font-bold mb-4">Pro Access Required</h1>
                <p className="text-xl text-slate-300 mb-8">
                  The Commercial Load Calculator is available exclusively to Pro members.
                </p>
              </div>
              
              <Card className="bg-slate-800/50 border-slate-700 mb-8">
                <CardHeader className="text-center">
                  <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <CardTitle className="text-white text-2xl">Upgrade to Pro</CardTitle>
                  <CardDescription className="text-slate-300">
                    Get access to commercial HVAC calculations and advanced tools
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="pt-4">
                    <Link href="/membership">
                      <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                        <Crown className="h-4 w-4 mr-2" />
                        Upgrade to Pro Access
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </>
    );
  }

  const [project, setProject] = useState<CommercialProject>({
    buildingType: '',
    squareFootage: 0,
    floors: 1,
    occupancy: '',
    existingSystem: '',
    projectScope: '',
    timeline: '',
    hvacZones: 1,
    specialRequirements: []
  });

  const [calculation, setCalculation] = useState<SystemCalculation>({
    equipment: [],
    materials: [],
    labor: [],
    permits: 0,
    overhead: 0,
    profit: 0,
    total: 0
  });

  const buildingTypes = [
    'Office Building',
    'Retail Store',
    'Restaurant',
    'Warehouse',
    'Medical Facility',
    'School/Education',
    'Manufacturing',
    'Hotel/Hospitality',
    'Mixed Use'
  ];

  const projectScopes = [
    'Complete System Replacement',
    'New Installation',
    'System Upgrade',
    'Zone Addition',
    'Controls Upgrade',
    'Ductwork Modification',
    'Emergency Repair'
  ];

  const specialRequirements = [
    'Clean Room',
    'Kitchen Ventilation',
    'Server Room Cooling',
    'Variable Refrigerant Flow',
    'Energy Recovery',
    'Smart Controls',
    'Backup Systems',
    'Fire/Smoke Dampers'
  ];

  const calculateSystem = () => {
    if (!project.buildingType || !project.squareFootage) {
      toast({
        title: "Missing Information",
        description: "Please fill in building type and square footage",
        variant: "destructive"
      });
      return;
    }

    // Commercial HVAC sizing calculations
    const btuPerSqFt = getBtuPerSqFt(project.buildingType, project.occupancy);
    const totalBtu = project.squareFootage * btuPerSqFt;
    const tonnage = Math.ceil(totalBtu / 12000);

    // Equipment calculations
    const equipment = [
      {
        name: `Commercial RTU (${tonnage} tons)`,
        cost: tonnage * 2800,
        quantity: Math.ceil(tonnage / 25) // Max 25 tons per unit
      },
      {
        name: 'Commercial Thermostat/Controls',
        cost: 450,
        quantity: project.hvacZones
      },
      {
        name: 'Electrical Disconnect',
        cost: 120,
        quantity: Math.ceil(tonnage / 25)
      }
    ];

    // Materials calculation
    const ductworkSqFt = project.squareFootage * 0.15; // 15% coverage
    const materials = [
      {
        name: 'Commercial Ductwork (sq ft)',
        cost: ductworkSqFt * 12,
        quantity: 1
      },
      {
        name: 'Insulation',
        cost: ductworkSqFt * 3.5,
        quantity: 1
      },
      {
        name: 'Grilles/Registers/Diffusers',
        cost: (project.squareFootage / 150) * 85,
        quantity: 1
      },
      {
        name: 'Refrigerant Line Set',
        cost: Math.ceil(tonnage / 25) * 850,
        quantity: 1
      }
    ];

    // Labor calculation
    const baseInstallHours = tonnage * 8;
    const complexityMultiplier = getComplexityMultiplier(project.buildingType, project.projectScope);
    const totalLaborHours = baseInstallHours * complexityMultiplier;

    const labor = [
      {
        description: 'Installation Labor',
        hours: totalLaborHours,
        rate: 95
      },
      {
        description: 'Electrical Work',
        hours: tonnage * 2,
        rate: 110
      },
      {
        description: 'Startup & Commissioning',
        hours: tonnage * 1.5,
        rate: 125
      }
    ];

    // Calculate totals
    const equipmentTotal = equipment.reduce((sum, item) => sum + item.cost, 0);
    const materialsTotal = materials.reduce((sum, item) => sum + item.cost, 0);
    const laborTotal = labor.reduce((sum, item) => sum + (item.hours * item.rate), 0);
    
    const subtotal = equipmentTotal + materialsTotal + laborTotal;
    const permits = subtotal * 0.02; // 2% for permits
    const overhead = subtotal * 0.15; // 15% overhead
    const profit = subtotal * 0.20; // 20% profit
    const total = subtotal + permits + overhead + profit;

    setCalculation({
      equipment,
      materials,
      labor,
      permits,
      overhead,
      profit,
      total
    });

    toast({
      title: "Estimate Calculated",
      description: `Commercial HVAC estimate: $${total.toFixed(0)}`
    });
  };

  const getBtuPerSqFt = (buildingType: string, occupancy: string) => {
    const baseRates: { [key: string]: number } = {
      'Office Building': 25,
      'Retail Store': 30,
      'Restaurant': 45,
      'Warehouse': 15,
      'Medical Facility': 35,
      'School/Education': 28,
      'Manufacturing': 20,
      'Hotel/Hospitality': 32,
      'Mixed Use': 28
    };
    
    let rate = baseRates[buildingType] || 25;
    
    // Adjust for occupancy
    if (occupancy === 'high') rate *= 1.3;
    else if (occupancy === 'low') rate *= 0.8;
    
    return rate;
  };

  const getComplexityMultiplier = (buildingType: string, scope: string) => {
    let multiplier = 1.0;
    
    // Building complexity
    if (['Medical Facility', 'Restaurant', 'Manufacturing'].includes(buildingType)) {
      multiplier *= 1.4;
    } else if (['Hotel/Hospitality', 'Mixed Use'].includes(buildingType)) {
      multiplier *= 1.2;
    }
    
    // Scope complexity
    if (scope === 'Complete System Replacement') multiplier *= 1.3;
    else if (scope === 'System Upgrade') multiplier *= 1.1;
    else if (scope === 'Emergency Repair') multiplier *= 1.5;
    
    return multiplier;
  };

  return (
    <>
      <Helmet>
        <title>Commercial HVAC Estimator | AfterHours HVAC</title>
        <meta name="description" content="Professional commercial HVAC project estimator with detailed cost breakdowns for buildings and facilities." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Building className="h-10 w-10 text-blue-400" />
              Commercial HVAC Estimator
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Comprehensive commercial HVAC project cost estimation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Project Details */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Project Details</CardTitle>
                <CardDescription>Enter building and project information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="buildingType">Building Type</Label>
                    <Select value={project.buildingType} onValueChange={(value) => 
                      setProject(prev => ({ ...prev, buildingType: value }))
                    }>
                      <SelectTrigger className="bg-slate-900 border-slate-600">
                        <SelectValue placeholder="Select building type" />
                      </SelectTrigger>
                      <SelectContent>
                        {buildingTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="squareFootage">Square Footage</Label>
                    <Input
                      id="squareFootage"
                      type="number"
                      value={project.squareFootage || ''}
                      onChange={(e) => setProject(prev => ({ 
                        ...prev, 
                        squareFootage: parseInt(e.target.value) || 0 
                      }))}
                      className="bg-slate-900 border-slate-600"
                      placeholder="Enter total sq ft"
                    />
                  </div>

                  <div>
                    <Label htmlFor="floors">Number of Floors</Label>
                    <Input
                      id="floors"
                      type="number"
                      value={project.floors}
                      onChange={(e) => setProject(prev => ({ 
                        ...prev, 
                        floors: parseInt(e.target.value) || 1 
                      }))}
                      className="bg-slate-900 border-slate-600"
                      min="1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="occupancy">Occupancy Level</Label>
                    <Select value={project.occupancy} onValueChange={(value) => 
                      setProject(prev => ({ ...prev, occupancy: value }))
                    }>
                      <SelectTrigger className="bg-slate-900 border-slate-600">
                        <SelectValue placeholder="Select occupancy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (&lt; 5 people/1000 sq ft)</SelectItem>
                        <SelectItem value="normal">Normal (5-15 people/1000 sq ft)</SelectItem>
                        <SelectItem value="high">High (&gt; 15 people/1000 sq ft)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="hvacZones">HVAC Zones</Label>
                    <Input
                      id="hvacZones"
                      type="number"
                      value={project.hvacZones}
                      onChange={(e) => setProject(prev => ({ 
                        ...prev, 
                        hvacZones: parseInt(e.target.value) || 1 
                      }))}
                      className="bg-slate-900 border-slate-600"
                      min="1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="projectScope">Project Scope</Label>
                    <Select value={project.projectScope} onValueChange={(value) => 
                      setProject(prev => ({ ...prev, projectScope: value }))
                    }>
                      <SelectTrigger className="bg-slate-900 border-slate-600">
                        <SelectValue placeholder="Select project scope" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectScopes.map(scope => (
                          <SelectItem key={scope} value={scope}>{scope}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Special Requirements</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {specialRequirements.map(req => (
                      <label key={req} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={project.specialRequirements.includes(req)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setProject(prev => ({
                                ...prev,
                                specialRequirements: [...prev.specialRequirements, req]
                              }));
                            } else {
                              setProject(prev => ({
                                ...prev,
                                specialRequirements: prev.specialRequirements.filter(r => r !== req)
                              }));
                            }
                          }}
                          className="rounded border-slate-600"
                        />
                        <span className="text-sm text-slate-300">{req}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={calculateSystem}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!project.buildingType || !project.squareFootage}
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Estimate
                </Button>
              </CardContent>
            </Card>

            {/* Cost Breakdown */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Cost Breakdown</CardTitle>
                <CardDescription>Detailed project estimate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {calculation.total > 0 ? (
                  <>
                    {/* Equipment */}
                    <div>
                      <h4 className="font-semibold text-white mb-2">Equipment</h4>
                      {calculation.equipment.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm mb-1">
                          <span className="text-slate-300">{item.name}</span>
                          <span className="text-white">${item.cost.toFixed(0)}</span>
                        </div>
                      ))}
                    </div>

                    <Separator className="bg-slate-600" />

                    {/* Materials */}
                    <div>
                      <h4 className="font-semibold text-white mb-2">Materials</h4>
                      {calculation.materials.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm mb-1">
                          <span className="text-slate-300">{item.name}</span>
                          <span className="text-white">${item.cost.toFixed(0)}</span>
                        </div>
                      ))}
                    </div>

                    <Separator className="bg-slate-600" />

                    {/* Labor */}
                    <div>
                      <h4 className="font-semibold text-white mb-2">Labor</h4>
                      {calculation.labor.map((item, index) => (
                        <div key={index} className="space-y-1 mb-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-300">{item.description}</span>
                            <span className="text-white">${(item.hours * item.rate).toFixed(0)}</span>
                          </div>
                          <div className="text-xs text-slate-400">
                            {item.hours} hrs @ ${item.rate}/hr
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator className="bg-slate-600" />

                    {/* Totals */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Permits & Fees:</span>
                        <span className="text-white">${calculation.permits.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Overhead (15%):</span>
                        <span className="text-white">${calculation.overhead.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Profit (20%):</span>
                        <span className="text-white">${calculation.profit.toFixed(0)}</span>
                      </div>
                      <Separator className="bg-slate-600" />
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-white">Total Project Cost:</span>
                        <span className="text-green-400">${calculation.total.toFixed(0)}</span>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-700">
                      <h5 className="font-semibold text-blue-400 mb-2">Estimate Notes</h5>
                      <ul className="text-sm text-slate-300 space-y-1">
                        <li>• Estimate includes equipment, materials, labor, permits</li>
                        <li>• Final costs may vary based on site conditions</li>
                        <li>• Building permits and inspections included</li>
                        <li>• 1-year warranty on installation</li>
                      </ul>
                    </div>

                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 mt-4"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Proposal
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Wrench className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">Fill in project details and click Calculate Estimate</p>
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

export default CommercialEstimator;