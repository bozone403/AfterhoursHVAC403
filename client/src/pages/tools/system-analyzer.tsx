import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLocation } from 'wouter';
import { 
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Thermometer,
  Gauge,
  Settings,
  FileText,
  Crown
} from 'lucide-react';

const SystemAnalyzer = () => {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [analysisData, setAnalysisData] = useState({
    systemType: '',
    ageYears: '',
    currentIssues: '',
    maintenanceHistory: '',
    energyBills: '',
    performanceIssues: ''
  });
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Redirect if not pro user
  if (!user?.hasProAccess && !user?.hasPro) {
    return (
      <>
        <Helmet>
          <title>Pro Access Required - System Analyzer</title>
          <meta name="description" content="Advanced system analyzer requires Pro membership access." />
        </Helmet>
        
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-orange-600">Pro Access Required</CardTitle>
              <CardDescription>
                Advanced system analysis is available to Pro members only.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
                Upgrade to Pro membership to access professional system performance analysis tools.
              </p>
              <div className="space-y-2">
                <Button 
                  onClick={() => setLocation('/membership')} 
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  Upgrade to Pro
                </Button>
                <Button 
                  onClick={() => setLocation('/pro-portal')} 
                  variant="outline" 
                  className="w-full"
                >
                  Back to Pro Portal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    
    // Simulate analysis processing
    setTimeout(() => {
      const result = generateAnalysisReport(analysisData);
      setAnalysisResult(result);
      setIsAnalyzing(false);
    }, 3000);
  };

  const generateAnalysisReport = (data: any) => {
    const age = parseInt(data.ageYears) || 0;
    const hasIssues = data.currentIssues.length > 10;
    const poorMaintenance = data.maintenanceHistory.toLowerCase().includes('never') || data.maintenanceHistory.toLowerCase().includes('years');
    
    let efficiency = 85;
    let recommendations = [];
    let priority = 'low';
    
    if (age > 15) {
      efficiency -= 20;
      recommendations.push('Consider system replacement - equipment over 15 years old loses significant efficiency');
      priority = 'high';
    } else if (age > 10) {
      efficiency -= 10;
      recommendations.push('Plan for major maintenance or replacement within 2-3 years');
      priority = 'medium';
    }
    
    if (hasIssues) {
      efficiency -= 15;
      recommendations.push('Address current issues immediately to prevent further damage');
      priority = 'high';
    }
    
    if (poorMaintenance) {
      efficiency -= 20;
      recommendations.push('Implement regular maintenance schedule - lack of maintenance significantly reduces lifespan');
      priority = 'high';
    }
    
    if (data.systemType.toLowerCase().includes('furnace')) {
      recommendations.push('Check heat exchanger for cracks annually');
      recommendations.push('Verify gas pressure and combustion air supply');
    }
    
    if (data.systemType.toLowerCase().includes('heat pump')) {
      recommendations.push('Check refrigerant levels and coil cleanliness');
      recommendations.push('Verify defrost cycle operation for cold climate performance');
    }
    
    return {
      efficiency: Math.max(efficiency, 30),
      priority,
      recommendations: recommendations.slice(0, 6),
      nextService: priority === 'high' ? 'Immediate' : priority === 'medium' ? '30 days' : '90 days',
      estimatedLife: age > 15 ? '1-2 years' : age > 10 ? '3-5 years' : '8-12 years'
    };
  };

  return (
    <>
      <Helmet>
        <title>Professional System Analyzer - AfterHours HVAC</title>
        <meta name="description" content="Advanced HVAC system performance analysis for certified technicians and professionals." />
        <meta name="keywords" content="HVAC system analysis, performance diagnostics, professional tools, system efficiency" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">
                Professional System Analyzer
              </h1>
              <Badge className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 text-sm font-bold">
                Pro Tool
              </Badge>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced system performance analysis and diagnostic recommendations for HVAC professionals
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-green-100 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Information
                </CardTitle>
                <CardDescription className="text-green-100">
                  Enter detailed system data for comprehensive analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="systemType">System Type</Label>
                  <Select value={analysisData.systemType} onValueChange={(value) => setAnalysisData({...analysisData, systemType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select system type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gas-furnace">Gas Furnace</SelectItem>
                      <SelectItem value="heat-pump">Heat Pump</SelectItem>
                      <SelectItem value="boiler">Boiler System</SelectItem>
                      <SelectItem value="central-ac">Central Air Conditioning</SelectItem>
                      <SelectItem value="ductless">Ductless Mini-Split</SelectItem>
                      <SelectItem value="geothermal">Geothermal System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ageYears">System Age (Years)</Label>
                  <Input
                    id="ageYears"
                    type="number"
                    placeholder="Enter age in years"
                    value={analysisData.ageYears}
                    onChange={(e) => setAnalysisData({...analysisData, ageYears: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentIssues">Current Issues/Symptoms</Label>
                  <Textarea
                    id="currentIssues"
                    placeholder="Describe any current problems, unusual sounds, performance issues..."
                    value={analysisData.currentIssues}
                    onChange={(e) => setAnalysisData({...analysisData, currentIssues: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maintenanceHistory">Maintenance History</Label>
                  <Textarea
                    id="maintenanceHistory"
                    placeholder="Last service date, frequency of maintenance, recent repairs..."
                    value={analysisData.maintenanceHistory}
                    onChange={(e) => setAnalysisData({...analysisData, maintenanceHistory: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="performanceIssues">Performance Concerns</Label>
                  <Textarea
                    id="performanceIssues"
                    placeholder="Temperature inconsistencies, energy efficiency concerns, comfort issues..."
                    value={analysisData.performanceIssues}
                    onChange={(e) => setAnalysisData({...analysisData, performanceIssues: e.target.value})}
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !analysisData.systemType || !analysisData.ageYears}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  {isAnalyzing ? 'Analyzing System...' : 'Run System Analysis'}
                </Button>
              </CardContent>
            </Card>

            {/* Analysis Results */}
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-100 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Analysis Results
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Professional diagnostic report and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
                    <p className="text-gray-600">Analyzing system performance...</p>
                  </div>
                ) : analysisResult ? (
                  <div className="space-y-6">
                    {/* System Health Score */}
                    <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                      <div className="flex items-center justify-center gap-3 mb-2">
                        <Gauge className="h-8 w-8 text-green-600" />
                        <span className="text-3xl font-bold text-gray-900">{analysisResult.efficiency}%</span>
                      </div>
                      <p className="text-gray-600">Estimated System Efficiency</p>
                    </div>

                    {/* Priority Level */}
                    <div className={`p-4 rounded-xl border ${
                      analysisResult.priority === 'high' ? 'bg-red-50 border-red-200 text-red-700' :
                      analysisResult.priority === 'medium' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                      'bg-green-50 border-green-200 text-green-700'
                    }`}>
                      <div className="flex items-center gap-2 font-semibold">
                        {analysisResult.priority === 'high' ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                        Priority: {analysisResult.priority.toUpperCase()}
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-xl text-center">
                        <p className="text-sm text-gray-600">Next Service</p>
                        <p className="text-lg font-semibold text-gray-900">{analysisResult.nextService}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl text-center">
                        <p className="text-sm text-gray-600">Estimated Life</p>
                        <p className="text-lg font-semibold text-gray-900">{analysisResult.estimatedLife}</p>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Professional Recommendations
                      </h4>
                      <div className="space-y-2">
                        {analysisResult.recommendations.map((rec: string, index: number) => (
                          <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-900">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Activity className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>Enter system information and click "Run System Analysis" to generate a comprehensive diagnostic report.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Feature Highlights */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/60 backdrop-blur-sm border border-green-200">
              <CardHeader className="pb-3">
                <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle className="text-lg">Performance Analysis</CardTitle>
                <CardDescription className="text-sm">Comprehensive system efficiency evaluation</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-white/60 backdrop-blur-sm border border-blue-200">
              <CardHeader className="pb-3">
                <FileText className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg">Professional Reports</CardTitle>
                <CardDescription className="text-sm">Detailed diagnostic recommendations</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-white/60 backdrop-blur-sm border border-orange-200">
              <CardHeader className="pb-3">
                <Crown className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle className="text-lg">Pro Exclusive</CardTitle>
                <CardDescription className="text-sm">Advanced analysis for certified technicians</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default SystemAnalyzer;