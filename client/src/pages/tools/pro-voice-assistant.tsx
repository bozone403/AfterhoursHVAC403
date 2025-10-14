import { Helmet } from 'react-helmet-async';
import { useState, useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLocation } from 'wouter';
import { 
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  MessageSquare,
  Crown,
  Settings,
  Zap,
  Brain,
  Headphones
} from 'lucide-react';

const ProVoiceAssistant = () => {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<Array<{id: number, text: string, sender: 'user' | 'assistant'}>>([
    {
      id: 1,
      text: "Earl here - your expert HVAC consultant with 30+ years in the trades. Been working Alberta systems since before you were probably born. I know every furnace, every code, every trick in the book. What's your problem? Give me the details and I'll tell you exactly how to fix it right the first time.",
      sender: 'assistant'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);
  const utteranceRef = useRef<any>(null);

  // Redirect if not pro user
  if (!user?.hasProAccess && !user?.hasPro) {
    return (
      <>
        <Helmet>
          <title>Pro Access Required - Advanced Voice Assistant</title>
          <meta name="description" content="Advanced voice assistant requires Pro membership access." />
        </Helmet>
        
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-orange-600">Pro Access Required</CardTitle>
              <CardDescription>
                Advanced voice assistant is available to Pro members only.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
                Upgrade to Pro membership to access advanced AI voice capabilities with natural conversation flow.
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

  useEffect(() => {
    // Initialize advanced speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          setInputText(finalTranscript);
          handleVoiceInput(finalTranscript);
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (utteranceRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel(); // Stop any current speech
      setIsSpeaking(true);
      
      // Process text for more natural speech patterns
      const naturalText = text
        .replace(/\./g, '. ') // Add pause after periods
        .replace(/\,/g, ', ') // Add pause after commas
        .replace(/\:/g, ': ') // Add pause after colons
        .replace(/\;/g, '; ') // Add pause after semicolons
        .replace(/\?/g, '? ') // Add pause after questions
        .replace(/\!/g, '! ') // Add pause after exclamations
        .replace(/\s+/g, ' ') // Clean up extra spaces
        .replace(/(\d+)\s*degrees?/gi, '$1 degrees') // Fix temperature pronunciation
        .replace(/HVAC/g, 'H-V-A-C') // Spell out acronym
        .replace(/BTU/g, 'B-T-U') // Spell out acronym
        .replace(/CFM/g, 'C-F-M') // Spell out acronym
        .replace(/AFUE/g, 'A-F-U-E') // Spell out acronym
        .trim();
      
      const utterance = new SpeechSynthesisUtterance(naturalText);
      
      // More natural speech parameters
      utterance.rate = 1.0; // Normal speaking rate
      utterance.pitch = 1.0; // Natural pitch
      utterance.volume = 0.9;
      
      // Get voices and select the most natural one
      const voices = speechSynthesis.getVoices();
      
      // Prioritize natural-sounding voices
      const preferredVoice = voices.find(voice => 
        // Look for high-quality system voices first
        (voice.name.includes('Samantha') && voice.lang.startsWith('en-US')) ||
        (voice.name.includes('Alex') && voice.lang.startsWith('en-US')) ||
        (voice.name.includes('Tom') && voice.lang.startsWith('en-US')) ||
        (voice.name.includes('Daniel') && voice.lang.startsWith('en-US'))
      ) || voices.find(voice => 
        // Fallback to other good US voices
        voice.lang.startsWith('en-US') && 
        voice.localService &&
        !voice.name.includes('Google') // Avoid robotic Google voices
      ) || voices.find(voice => 
        // Last resort - any US English voice
        voice.lang.startsWith('en-US')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
        console.log('Using voice:', preferredVoice.name);
      }
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = (event) => {
        console.error('Speech error:', event);
        setIsSpeaking(false);
      };
      
      utteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleVoiceInput = async (transcript: string) => {
    if (!transcript.trim()) return;
    
    setIsProcessing(true);
    stopListening();
    
    const userMessage = {
      id: Date.now(),
      text: transcript,
      sender: 'user' as const
    };

    setMessages(prev => [...prev, userMessage]);
    
    try {
      // Call Earl AI API for real HVAC expertise
      const response = await apiFetch('/api/earl/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: transcript,
          isProLevel: true
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Earl');
      }

      const data = await response.json();
      const assistantMessage = {
        id: Date.now() + 1,
        text: data.response,
        sender: 'assistant' as const
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      speakResponse(data.response);
      setInputText('');
    } catch (error) {
      console.error('Error getting Earl response:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting right now. Let me know what HVAC issue you're dealing with and I'll help you troubleshoot it.",
        sender: 'assistant' as const
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;
    handleVoiceInput(inputText);
  };

  const generateAdvancedResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    // Advanced diagnostic patterns with detailed technical responses
    if (lowerInput.includes('no heat') || lowerInput.includes('furnace not working')) {
      return "I'll guide you through a comprehensive no-heat diagnostic protocol. Start with thermostat verification - confirm it's calling for heat with 24VAC between R and W terminals. Next, check the primary power supply at the disconnect and verify proper voltage at the unit. For gas furnaces, inspect the gas valve - you should have 24VAC during a call for heat. Check the ignition sequence: induced draft motor energizes first, pressure switch closes, then ignition begins. Common failure points include failed pressure switches, cracked heat exchangers causing rollout switch trips, or faulty gas valves. Each component has specific testing procedures I can walk you through.";
    }
    
    if (lowerInput.includes('short cycling') || lowerInput.includes('keeps turning on and off')) {
      return "Short cycling is a critical efficiency and comfort issue requiring systematic analysis. First, measure static pressure - it should be below 0.5 inches WC total external static pressure for residential systems. High static pressure from dirty filters, closed dampers, or undersized ductwork forces the system to overheat and trip on limit switches. Check the heat exchanger for cracks using a combustible gas detector during operation. Verify the limit switch is properly calibrated and not nuisance tripping. For heat pumps, examine defrost cycle operation and refrigerant pressures. Oversized equipment also causes short cycling - proper Manual J load calculations prevent this issue.";
    }
    
    if (lowerInput.includes('strange noise') || lowerInput.includes('loud sound')) {
      return "Sound diagnosis is a precise diagnostic tool when done systematically. Grinding typically indicates worn blower motor bearings or damaged fan blades. Squealing suggests belt issues or motor bearing failure. Rumbling often points to burner problems, dirty heat exchangers, or ductwork vibration. Clicking sounds usually indicate relay cycling, gas valve operation, or ductwork expansion. Time the noise occurrence - startup noises differ from operational sounds. Use a digital sound meter to quantify decibel levels and frequency ranges. I can guide you through isolation techniques using circuit analysis to pinpoint the exact component causing the issue.";
    }
    
    if (lowerInput.includes('high bills') || lowerInput.includes('efficiency')) {
      return "Energy efficiency analysis requires comprehensive system evaluation using multiple measurement points. Start with combustion analysis - measure CO2, O2, and flue gas temperature to calculate combustion efficiency. It should exceed 80% for standard efficiency units, 90%+ for condensing equipment. Perform ductwork leakage testing using a duct blaster - leakage should be under 6% of system airflow. Measure temperature rise across the heat exchanger - it should match manufacturer specifications within 40-70°F typically. Check refrigerant subcooling and superheat for cooling systems. Use thermal imaging to identify envelope losses and ductwork issues. I'll help you calculate actual operating costs versus theoretical efficiency ratings.";
    }
    
    if (lowerInput.includes('code') || lowerInput.includes('permit') || lowerInput.includes('inspection')) {
      return "Code compliance requires detailed knowledge of current standards and local amendments. For Alberta installations, reference NBC 2015 with provincial modifications, CSA B149 gas codes, and local municipal requirements. Gas line sizing must follow CSA B149.1 tables for proper BTU delivery. Venting requirements vary by equipment category - Category I, II, III, or IV systems have specific clearances and materials. Combustion air calculations use CSA B149.1 methods - typically 1 cubic foot per 1000 BTU input for outdoor air. Electrical connections must meet CEC standards with proper disconnect placement and emergency shutoffs. I can walk you through specific code sections and calculation methods for your installation type.";
    }
    
    if (lowerInput.includes('sizing') || lowerInput.includes('load calculation')) {
      return "Proper equipment sizing uses ACCA Manual J methodology with precise heat loss and gain calculations. Start with building envelope analysis - measure wall, window, ceiling, and floor areas. Calculate U-values for each surface using construction details and insulation R-values. Factor in infiltration rates using ACH50 blower door results or estimate 0.35 ACH for average construction. Include internal heat gains from occupants, lighting, and appliances. Design temperatures use 99% heating and 1% cooling values for your location. Equipment selection uses Manual S guidelines - heating capacity should be 100-125% of calculated load, cooling capacity 95-115%. Ductwork design follows Manual D principles with proper friction rates and velocity limits. Oversizing reduces efficiency and comfort significantly.";
    }
    
    if (lowerInput.includes('refrigerant') || lowerInput.includes('charging')) {
      return "Refrigerant charging demands precision measurement and proper certification compliance. Start with system evacuation to 500 microns using a two-stage vacuum pump and micron gauge. Charge by weight when possible using manufacturer specifications on the unit nameplate. For field charging, measure suction line temperature and pressure to calculate superheat - typically 8-12°F for TXV systems, 10-15°F for fixed orifices. Subcooling should be 8-15°F measured at the liquid line near the condenser. Use calibrated digital manifolds for accuracy. Check for leaks using electronic leak detectors sensitive to 0.1 oz/year. Document pressures, temperatures, and ambient conditions. Improper charging reduces capacity by 10-20% and increases operating costs substantially. Always follow EPA Section 608 recovery requirements.";
    }
    
    if (lowerInput.includes('controls') || lowerInput.includes('thermostat')) {
      return "Modern control systems require understanding of both conventional and communicating protocols. For conventional systems, verify 24VAC transformer output under load - it should maintain 22-26VAC. Check thermostat wiring using proper color codes: R (power), W (heat), Y (cool), G (fan), C (common). Measure voltage drops across connections and verify proper wire sizing - 18 AWG minimum for most applications. For communicating systems, use manufacturer-specific diagnostic tools to check bus communication, address conflicts, and error codes. Smart thermostats require WiFi signal strength analysis and firmware updates. Zoning systems need proper bypass damper sizing and static pressure controls. I can guide you through specific troubleshooting sequences for any control system type.";
    }
    
    if (lowerInput.includes('heat pump') || lowerInput.includes('defrost')) {
      return "Heat pump diagnostics require understanding of refrigeration cycles and defrost controls. Check refrigerant pressures against manufacturer charts based on outdoor temperature - suction pressure drops significantly in cold weather. Defrost initiation typically occurs on time and temperature - outdoor coil temperature below 26°F for 30-90 minutes depending on system. Verify defrost termination using coil temperature sensors, typically 65-70°F. Check reversing valve operation using solenoid voltage and system pressures. Backup heat should energize during defrost and cold weather lockout, usually below 25-30°F outdoor temperature. Measure amp draw on compressor, outdoor fan, and auxiliary heat. Heat pump balance point calculations determine when backup heat becomes more economical than heat pump operation.";
    }
    
    if (lowerInput.includes('combustion') || lowerInput.includes('gas') || lowerInput.includes('burner')) {
      return "Combustion analysis ensures safe and efficient operation using precise measurements. Measure gas pressure at the manifold - natural gas should be 3.5 inches WC, propane 11 inches WC typically. Check gas valve operation through main and pilot valves. Perform combustion analysis measuring CO2 (8-10% for natural gas), O2 (3-5%), and CO (under 100 PPM air-free). Calculate combustion efficiency using flue gas temperature rise above combustion air temperature. Check burner flame characteristics - blue flames with minimal yellow tips indicate proper air-fuel mixture. Inspect heat exchanger using cameras or mirrors for cracks, especially near stress points. Verify proper venting using draft measurements and spillage testing. Document all readings for safety compliance and efficiency optimization.";
    }
    
    return "I'm your advanced HVAC technical consultant ready to provide detailed diagnostic procedures, code interpretation, and system optimization guidance. My expertise covers installation protocols, troubleshooting methodologies, efficiency analysis, and safety compliance. What specific technical challenge would you like me to analyze with you today?";
  };

  return (
    <>
      <Helmet>
        <title>Advanced Pro Voice Assistant - AfterHours HVAC</title>
        <meta name="description" content="Professional HVAC voice assistant with advanced conversational AI capabilities for certified technicians." />
        <meta name="keywords" content="HVAC voice assistant, professional diagnostics, AI technician support, advanced voice recognition" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">
                Advanced Pro Voice Assistant
              </h1>
              <Badge className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 text-sm font-bold">
                Professional AI
              </Badge>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Natural conversation flow with advanced HVAC expertise for professional technicians
            </p>
          </div>

          {/* Main Chat Interface */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-100 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Headphones className="h-6 w-6" />
                  <div>
                    <CardTitle className="text-xl">Professional Voice Assistant</CardTitle>
                    <CardDescription className="text-blue-100">
                      Advanced AI with natural conversation capabilities
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isProcessing && (
                    <div className="flex items-center gap-2 bg-blue-500/30 px-3 py-1 rounded-full">
                      <Zap className="h-4 w-4 animate-pulse" />
                      <span className="text-sm">Processing...</span>
                    </div>
                  )}
                  {isSpeaking && (
                    <Button
                      onClick={stopSpeaking}
                      variant="outline"
                      size="sm"
                      className="bg-red-100 text-red-600 hover:bg-red-200 border-red-300"
                    >
                      <VolumeX className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <ScrollArea className="h-[500px] p-6">
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] p-4 rounded-2xl ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                            : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 border border-gray-300'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.text}</p>
                      </div>
                    </div>
                  ))}
                  {isSpeaking && (
                    <div className="flex justify-start">
                      <div className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 p-4 rounded-2xl flex items-center gap-3 border border-blue-200">
                        <Volume2 className="h-5 w-5 animate-pulse" />
                        <span className="text-sm font-medium">Assistant is speaking...</span>
                      </div>
                    </div>
                  )}
                  {isProcessing && (
                    <div className="flex justify-start">
                      <div className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 p-4 rounded-2xl flex items-center gap-3 border border-purple-200">
                        <Brain className="h-5 w-5 animate-pulse" />
                        <span className="text-sm font-medium">Analyzing your question...</span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              {/* Input Controls */}
              <div className="p-6 border-t bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask about HVAC diagnostics, codes, installation procedures..."
                    className="flex-1 px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                    disabled={isProcessing}
                  />
                  <Button
                    onClick={isListening ? stopListening : startListening}
                    disabled={isProcessing}
                    variant="outline"
                    size="lg"
                    className={`px-6 ${
                      isListening 
                        ? 'bg-red-100 text-red-600 border-red-300 hover:bg-red-200' 
                        : 'bg-blue-100 text-blue-600 border-blue-300 hover:bg-blue-200'
                    }`}
                  >
                    {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>
                  <Button 
                    onClick={sendMessage} 
                    disabled={isProcessing}
                    className="px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Send
                  </Button>
                </div>
                {isListening && (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-3 bg-red-100 text-red-700 px-4 py-2 rounded-full border border-red-300">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Advanced voice recognition active...</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Feature Highlights */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/60 backdrop-blur-sm border border-blue-200">
              <CardHeader className="pb-3">
                <Headphones className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg">Natural Voice</CardTitle>
                <CardDescription className="text-sm">Advanced speech synthesis with conversational flow</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-white/60 backdrop-blur-sm border border-purple-200">
              <CardHeader className="pb-3">
                <Brain className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle className="text-lg">Expert Knowledge</CardTitle>
                <CardDescription className="text-sm">Comprehensive HVAC expertise with detailed guidance</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-white/60 backdrop-blur-sm border border-orange-200">
              <CardHeader className="pb-3">
                <Crown className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle className="text-lg">Professional Only</CardTitle>
                <CardDescription className="text-sm">Exclusive to Pro members with advanced capabilities</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProVoiceAssistant;