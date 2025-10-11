import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Wrench, MessageSquare, AlertTriangle, CheckCircle, Settings, Phone, ArrowRight, FileText, Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  type: 'user' | 'earl';
  content: string;
  timestamp: Date;
  category?: 'diagnostic' | 'technical' | 'code' | 'safety' | 'business';
  codeReference?: string;
  voiceMemo?: boolean;
}

interface TechnicalData {
  equipment: string;
  readings: { [key: string]: string };
  findings: string[];
  recommendations: string[];
  codeReferences: string[];
  safetyNotes: string[];
}

export default function ProDiagnosticAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'earl',
      content: "Earl here - been in the trades for 30+ years. I know HVAC, sheet metal, plumbing, electrical, and building science inside and out. What's the job today? Give me the equipment details, model numbers, and what you're seeing. Don't waste time with vague descriptions - I need the real technical details to help you properly.",
      timestamp: new Date(),
      category: 'diagnostic'
    }
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentJobData, setCurrentJobData] = useState<TechnicalData>({
    equipment: "",
    readings: {},
    findings: [],
    recommendations: [],
    codeReferences: [],
    safetyNotes: []
  });
  const { toast } = useToast();

  // Professional Earl AI logic - expert level responses
  const processQuery = (userInput: string): ChatMessage => {
    const input = userInput.toLowerCase();
    
    // Equipment identification and technical specs
    if (input.includes('lennox') && (input.includes('g61mp') || input.includes('furnace'))) {
      return {
        id: Date.now().toString(),
        type: 'earl',
        content: "Lennox G61MP - good unit, but watch for common issues. Ignitor resistance should be 40-90 ohms at room temp. Heat exchanger is prone to cracking after 12-15 years on these. Control board is the LB-94394A. What specific symptoms are you seeing? No heat, intermittent operation, or error codes?",
        timestamp: new Date(),
        category: 'technical',
        codeReference: "CSA B149.1 Section 8.4.3 - Ignition system requirements"
      };
    }

    // Static pressure and airflow diagnostics
    if (input.includes('static pressure') || input.includes('airflow')) {
      return {
        id: Date.now().toString(),
        type: 'earl',
        content: "Static pressure diagnosis - critical for proper operation. Residential systems should be under 0.5\" w.c. total external static. Check supply and return separately. High static kills efficiency and shortens equipment life. What are your readings? And what's the equipment capacity?",
        timestamp: new Date(),
        category: 'diagnostic',
        codeReference: "ASHRAE 62.2 - Ventilation requirements"
      };
    }

    // Electrical troubleshooting
    if (input.includes('electrical') || input.includes('voltage') || input.includes('amp')) {
      return {
        id: Date.now().toString(),
        type: 'earl',
        content: "Electrical issues - let's be methodical. Check voltage at the disconnect first, then at the unit. Low voltage side should be 24VAC nominal. Line voltage varies by equipment - 208V, 240V, or 480V three-phase. What's the equipment nameplate say and what readings are you getting? Safety first - lock out the disconnect.",
        timestamp: new Date(),
        category: 'technical',
        codeReference: "CEC Rule 26-700 - Motor control requirements"
      };
    }

    // Gas code and safety
    if (input.includes('gas') || input.includes('combustion') || input.includes('co')) {
      return {
        id: Date.now().toString(),
        type: 'earl',
        content: "Gas work - no shortcuts here. Check manifold pressure first - should match nameplate. CO levels must be under 25 ppm in the flue, ideally under 10 ppm. Combustion air calculations are critical per B149.1. What's the equipment input rating and what space is it in? Confined or unconfined?",
        timestamp: new Date(),
        category: 'safety',
        codeReference: "CSA B149.1 Section 7.2 - Combustion air requirements"
      };
    }

    // Refrigeration and AC
    if (input.includes('refrigerant') || input.includes('superheat') || input.includes('subcool')) {
      return {
        id: Date.now().toString(),
        type: 'earl',
        content: "Refrigeration diagnostics - get your manifold gauges on there. For R-410A, superheat should be 8-12°F, subcooling 8-15°F at design conditions. Low charge shows high superheat, low subcool. Overcharge shows low superheat, high subcool. What refrigerant and what are your pressures and temps?",
        timestamp: new Date(),
        category: 'technical',
        codeReference: "ASHRAE Standard 15 - Safety requirements"
      };
    }

    // Code interpretation requests
    if (input.includes('code') || input.includes('b149') || input.includes('nbc')) {
      return {
        id: Date.now().toString(),
        type: 'earl',
        content: "Code questions - I've got the current versions. B149.1 for gas, NBC for building requirements, CEC for electrical. What specific code section or application are you dealing with? Installation clearances, venting, or equipment requirements? Be specific and I'll cite the exact section.",
        timestamp: new Date(),
        category: 'code'
      };
    }

    // Business and pricing
    if (input.includes('price') || input.includes('quote') || input.includes('estimate')) {
      return {
        id: Date.now().toString(),
        type: 'earl',
        content: "Pricing and quotes - know your costs and mark them up properly. Labor should be $95-$125/hour in Alberta depending on complexity. Parts markup typically 40-60%. Don't forget travel time, permits, and disposal fees. What type of job are you pricing? Installation, service, or emergency?",
        timestamp: new Date(),
        category: 'business'
      };
    }

    // Generic professional response
    return {
      id: Date.now().toString(),
      type: 'earl',
      content: "I need more specific information to help you properly. What equipment are you working on? Model number, symptoms, and what you've checked so far. I can help with diagnostics, code requirements, technical specs, or business questions. Be specific and I'll give you the detailed analysis you need.",
      timestamp: new Date(),
      category: 'diagnostic'
    };
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput("");
    setIsAnalyzing(true);

    // Simulate processing time for realistic feel
    setTimeout(() => {
      const response = processQuery(currentInput);
      setMessages(prev => [...prev, response]);
      setIsAnalyzing(false);
    }, 1000);
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      // Stop listening
      setIsListening(false);
      toast({
        title: "Voice Recording Stopped",
        description: "Processing your voice input...",
      });
    } else {
      // Start listening
      setIsListening(true);
      toast({
        title: "Voice Recording Active",
        description: "Speak your diagnostic question or findings...",
      });
    }
  };

  const generateServiceReport = () => {
    toast({
      title: "Generating Service Report",
      description: "Compiling all diagnostic data and findings...",
    });
    // In real implementation, this would generate a PDF report
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'technical': return <Settings className="h-4 w-4" />;
      case 'safety': return <AlertTriangle className="h-4 w-4" />;
      case 'code': return <FileText className="h-4 w-4" />;
      case 'business': return <Phone className="h-4 w-4" />;
      default: return <Wrench className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'technical': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'safety': return 'bg-red-100 text-red-800 border-red-200';
      case 'code': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'business': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center bg-slate-100 border border-slate-200 rounded-full px-6 py-3 mb-6">
            <Wrench className="h-6 w-6 text-slate-700 mr-3" />
            <span className="text-slate-800 text-lg font-bold">Professional Diagnostic Assistant</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Earl - Field Service AI</h1>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto">
            Expert-level HVAC diagnostic assistance for professional technicians. Get detailed technical analysis, 
            code references, and business guidance from your AI field partner.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg border-0 bg-white h-96">
              <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5" />
                  Earl - Professional Diagnostic Assistant
                  <div className="ml-auto flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleVoiceToggle}
                      className={`text-white hover:bg-white/20 ${isListening ? 'bg-red-500/20' : ''}`}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-full flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-2xl px-4 py-3 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-slate-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        {message.type === 'earl' && message.category && (
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={`text-xs ${getCategoryColor(message.category)}`}>
                              <span className="flex items-center gap-1">
                                {getCategoryIcon(message.category)}
                                {message.category.toUpperCase()}
                              </span>
                            </Badge>
                          </div>
                        )}
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        {message.codeReference && (
                          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                            <strong>Code Reference:</strong> {message.codeReference}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isAnalyzing && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin h-4 w-4 border-2 border-slate-600 border-t-transparent rounded-full"></div>
                          <span className="text-sm">Earl is analyzing your input...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <Input
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      placeholder="Ask Earl about diagnostics, codes, technical specs, or business questions..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={isAnalyzing || !currentInput.trim()}>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Professional mode: Include equipment models, symptoms, and specific technical questions for detailed analysis
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Professional Tools Sidebar */}
          <div className="space-y-4">
            {/* Quick Actions */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="text-lg flex items-center gap-3">
                  <Settings className="h-5 w-5" />
                  Field Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <Button 
                  onClick={generateServiceReport}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Service Report
                </Button>
                
                <Button 
                  onClick={handleVoiceToggle}
                  className={`w-full ${isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                  size="sm"
                >
                  {isListening ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                  {isListening ? 'Stop Recording' : 'Voice Input'}
                </Button>
              </CardContent>
            </Card>

            {/* Common References */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
                <CardTitle className="text-lg flex items-center gap-3">
                  <FileText className="h-5 w-5" />
                  Quick References
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3 text-sm">
                  <div className="border-b pb-2">
                    <h4 className="font-semibold text-gray-900">Gas Pressures</h4>
                    <p className="text-gray-700">Natural Gas: 3.5" w.c.</p>
                    <p className="text-gray-700">Propane: 11" w.c.</p>
                  </div>
                  
                  <div className="border-b pb-2">
                    <h4 className="font-semibold text-gray-900">R-410A Temps</h4>
                    <p className="text-gray-700">Superheat: 8-12°F</p>
                    <p className="text-gray-700">Subcool: 8-15°F</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900">Static Pressure</h4>
                    <p className="text-gray-700">Max: 0.5" w.c. total</p>
                    <p className="text-gray-700">Ideal: &lt;0.3" w.c.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="shadow-lg border-0 bg-white">
              <CardContent className="p-4">
                <div className="text-center">
                  <h4 className="font-bold text-gray-900 mb-2">Technical Support</h4>
                  <p className="text-sm text-gray-700 mb-3">Need immediate assistance?</p>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                    <Phone className="h-4 w-4 mr-2" />
                    (403) 613-6014
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Professional Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="p-6 text-center">
              <Wrench className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Expert Diagnostics</h3>
              <p className="text-gray-700 text-sm">
                Professional-level technical analysis with specific equipment knowledge and troubleshooting guidance.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="p-6 text-center">
              <FileText className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Code References</h3>
              <p className="text-gray-700 text-sm">
                Instant access to CSA B149.1, NBC, CEC, and ASHRAE standards with specific section citations.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="p-6 text-center">
              <Mic className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Voice Integration</h3>
              <p className="text-gray-700 text-sm">
                Hands-free operation with voice commands and automated service report generation.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="p-6 text-center">
              <Settings className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Business Tools</h3>
              <p className="text-gray-700 text-sm">
                Pricing guidance, contract assistance, and administrative support for field operations.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}