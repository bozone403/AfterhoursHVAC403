import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link, useLocation } from 'wouter';
import { 
  Calculator, 
  FileText, 
  Bot, 
  BookOpen, 
  Download,
  Crown,
  AlertTriangle,
  Thermometer,
  Settings,
  FileCheck,
  MessageSquare,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Building,
  Sparkles
} from 'lucide-react';

const EarlChatbot = () => {
  const [messages, setMessages] = useState<Array<{id: number, text: string, sender: 'user' | 'earl'}>>([
    {
      id: 1,
      text: "Earl here. Been working HVAC for 30+ years in Alberta. What's your problem? Don't waste my time with the basics - give me the details and I'll tell you how to fix it right the first time.",
      sender: 'earl'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    }
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 0.8;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user' as const
    };

    setMessages(prev => [...prev, userMessage]);
    
    setTimeout(() => {
      const response = generateEarlResponse(inputText);
      const earlMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'earl' as const
      };
      
      setMessages(prev => [...prev, earlMessage]);
      speakResponse(response);
      setInputText('');
    }, 1500);
  };

  const generateEarlResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('vent') || lowerInput.includes('flue')) {
      return "Alright, venting. First thing - what type of furnace are we dealing with? High-efficiency condensing unit or conventional? For high-efficiency, you need System 636 certified PVC/CPVC, sloped 1/4\" per foot back toward the unit. Conventional uses B-vent, sloped 1/4\" per foot UP toward the termination. And for the love of all that's holy, check your clearances from windows, doors, and property lines. B149.1 Table 7.3 has all the termination clearances.";
    }
    
    if (lowerInput.includes('duct') || lowerInput.includes('size')) {
      return "Ductwork sizing, eh? Manual D is your bible here. Don't just guess - do the calculations. Support every 8-10 feet for rigid metal, every 4 feet for flex. Seal every joint with mastic, not just tape. And insulate according to the current STANDATA requirements. Trust me, the inspector will check.";
    }
    
    if (lowerInput.includes('heat pump') || lowerInput.includes('heat strip') || lowerInput.includes('auxiliary heat')) {
      return "Heat pumps in Alberta? You're dealing with cold climate units here. Look for models rated down to -25°C minimum. Dual fuel setups work great - heat pump above 0°C, gas backup below. Heat strips are electric resistance - check your amp draw, most units pull 20-40 amps per strip. And don't forget your crankcase heater in cold climates.";
    }
    
    if (lowerInput.includes('furnace') && (lowerInput.includes('not') || lowerInput.includes('problem') || lowerInput.includes('issue'))) {
      return "Furnace acting up? Start with the basics - thermostat calling for heat? Power to the unit? Gas valve open? Check your sequence: thermostat calls, inducer starts, pressure switch closes, igniter glows, gas valve opens, burner lights, blower delay, then heat. If it's stopping anywhere in that sequence, that's your problem area.";
    }
    
    if (lowerInput.includes('boiler') || lowerInput.includes('hydronic') || lowerInput.includes('radiant')) {
      return "Boiler work, eh? Cast iron, steel fire tube, or condensing? Each has its quirks. Operating temps: cast iron 160-180°F, condensing 130-140°F for efficiency. Watch your water quality - hardness over 7 grains, you need treatment. Expansion tank sizing is critical - 1 gallon per 50 gallons system volume. And don't forget your low water cutoff.";
    }
    
    if (lowerInput.includes('ac') || lowerInput.includes('air condition') || lowerInput.includes('cooling') || lowerInput.includes('evaporator')) {
      return "AC problems? First check - is the outdoor unit running? Dirty filter will kill airflow and freeze your evap coil. Refrigerant leak? Look for oil stains, ice buildup, or short cycling. Superheat should be 8-12°F for most systems, subcooling 10-15°F. Low superheat = overcharge or restriction, high superheat = undercharge or airflow issues.";
    }
    
    if (lowerInput.includes('refrigeration') || lowerInput.includes('commercial') || lowerInput.includes('walk-in') || lowerInput.includes('freezer')) {
      return "Commercial refrigeration? That's a different beast. Walk-ins typically run R-404A or R-449A now. Evap temp for coolers: 28-32°F, freezers: -10 to -5°F. Defrost is critical - electric, hot gas, or reverse cycle. TXV bulb placement matters - secure contact, insulated. And always check your oil return in low-temp systems.";
    }
    
    if (lowerInput.includes('thermostat') || lowerInput.includes('control') || lowerInput.includes('zone')) {
      return "Controls giving you grief? Old mercury stats are simple but done. Digital programmables need proper wire sizing - 18 AWG minimum for runs over 50 feet. Heat pump stats need O/B wire - O for cooling, B for heating call. Zone systems? Check your damper motors, end switches, and static pressure. Bypass damper might be needed.";
    }
    
    if (lowerInput.includes('combustion') || lowerInput.includes('air') || lowerInput.includes('ventilation')) {
      return "Combustion air - critical stuff. High-efficiency units usually pull air directly from outside through concentric or twin-pipe systems. For confined spaces with conventional units, you need openings sized per B149.1 Section 8. Two openings minimum - one high, one low. Each needs to be sized for the appliance BTU input. Don't screw this up - it's a safety issue.";
    }

    if (lowerInput.includes('pressure') || lowerInput.includes('gas')) {
      return "Gas pressure testing - listen up. Before you fire anything up, you better test that system. Incoming pressure should be 7\" WC for natural gas, 11\" WC for propane. Manifold pressure varies by unit - check the rating plate. Use a manometer, not some janky gauge. And don't forget to check for leaks with proper soap solution. One small leak can kill someone.";
    }

    if (lowerInput.includes('electrical') || lowerInput.includes('wire') || lowerInput.includes('motor')) {
      return "Electrical work on HVAC? Better know what you're doing. Disconnect within sight of the unit, proper wire sizing for the amp draw, and don't forget your grounding. Low voltage thermostat wires are usually 18 AWG, but check your heat pump requirements - some need heavier gauge for the heat strips. Compressor motors - check your start components: contactor, capacitors, and overloads.";
    }

    if (lowerInput.includes('refrigerant') || lowerInput.includes('charge') || lowerInput.includes('leak')) {
      return "Refrigerant work? You better have your tickets for this. Proper charging is critical - overcharge and you'll kill efficiency and shorten compressor life. Undercharge and same thing happens. Use manifold gauges, know your superheat and subcooling numbers. And recovery - don't you dare vent refrigerant to atmosphere. EPA will have your hide.";
    }
    
    if (lowerInput.includes('code') || lowerInput.includes('alberta') || lowerInput.includes('calgary') || lowerInput.includes('inspection')) {
      return "Alberta codes - now you're speaking my language. ABC 2019 is current, but you MUST check the STANDATA. They're constantly updating interpretations. B149.1-20 for gas work, Section 7 for venting. City of Calgary has their own amendments too. When in doubt, call the building department. Better to ask than to fail inspection.";
    }
    
    if (lowerInput.includes('install') || lowerInput.includes('startup') || lowerInput.includes('commission')) {
      return "Installation time? Do it right the first time. Level the unit, proper clearances, secure gas connections with pipe dope or thread sealant - never Teflon tape on gas threads. Electrical connections tight, condensate drain sloped properly. Startup sequence: gas leak test, electrical check, airflow verification, temperature rise check, and document everything.";
    }
    
    if (lowerInput.includes('maintenance') || lowerInput.includes('service') || lowerInput.includes('tune') || lowerInput.includes('clean')) {
      return "Maintenance keeps you in business. Annual service minimum - change filters, check gas pressures, clean flame sensor, inspect heat exchanger, test safety controls. Coil cleaning with proper chemicals, not just water. Belt tension - 1\" deflection per foot of span. And always check your combustion analysis - CO levels, draft, and efficiency.";
    }
    
    if (lowerInput.includes('safety') || lowerInput.includes('carbon monoxide') || lowerInput.includes('co') || lowerInput.includes('dangerous')) {
      return "Safety first - that's not just talk. Carbon monoxide kills. Test every gas appliance annually with a combustion analyzer. Cracked heat exchangers, blocked vents, improper installations - all potential killers. If you smell gas, shut it down immediately. When in doubt, tag it out. Your reputation and someone's life depends on it.";
    }
    
    if (lowerInput.includes('carrier') || lowerInput.includes('lennox') || lowerInput.includes('trane') || lowerInput.includes('goodman') || lowerInput.includes('rheem')) {
      return "Brand-specific issues? Each manufacturer has their quirks. Carrier - watch their integrated controls. Lennox - heat exchanger issues on older units. Trane - solid but parts cost more. Goodman - budget option but check your installation manual closely. Rheem - good mid-range, watch for pressure switch issues on newer models.";
    }
    
    if (lowerInput.includes('tool') || lowerInput.includes('equipment') || lowerInput.includes('meter') || lowerInput.includes('gauge')) {
      return "Tools make the job. Digital manifold gauges are worth the investment - faster evacuation, better accuracy. Combustion analyzer is mandatory for gas work. Good multimeter, megohmmeter for motor testing, manometer for pressures. Don't cheap out on recovery equipment - it'll cost you more in the long run when it breaks down.";
    }
    
    if (lowerInput.includes('efficiency') || lowerInput.includes('upgrade') || lowerInput.includes('rebate') || lowerInput.includes('energy')) {
      return "Efficiency upgrades? AFUE ratings: 80% minimum, 90%+ for condensing. SEER ratings for cooling: 13 minimum, 16+ for high efficiency. Variable speed equipment costs more upfront but saves long-term. Don't forget about proper sizing - oversized equipment short cycles and wastes energy. Load calculations are mandatory.";
    }

    return "I hear ya. Can you be more specific about what you're dealing with? Are we talking installation, troubleshooting, code compliance, or something else? I've got 30+ years in this trade - furnaces, boilers, heat pumps, AC, refrigeration, controls, you name it. Gas, electric, oil - seen it all. The more details you give me, the better I can help you avoid the common mistakes I see techs make every day.";
  };

  return (
    <div className="flex flex-col h-[600px] bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden" data-testid="card-earl-chatbot">
      <div className="bg-gradient-to-r from-amber-500/20 via-amber-600/20 to-amber-500/20 border-b border-white/10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-xl backdrop-blur-sm">
              <MessageSquare className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Earl</h3>
              <Badge variant="secondary" className="bg-amber-500/20 text-amber-300 border-amber-400/30 mt-1">
                30+ Years HVAC Expert
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isSpeaking && (
              <Button
                onClick={stopSpeaking}
                variant="outline"
                size="sm"
                className="bg-red-500/20 text-red-300 hover:bg-red-500/30 border-red-400/30"
                data-testid="button-stop-speaking"
              >
                <VolumeX className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              data-testid={`message-${message.sender}-${message.id}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-white shadow-lg shadow-amber-500/20'
                    : 'bg-white/10 backdrop-blur-sm text-white border border-white/20'
                }`}
              >
                <p className="text-sm leading-relaxed" data-testid={`text-message-${message.id}`}>{message.text}</p>
              </div>
            </div>
          ))}
          {isSpeaking && (
            <div className="flex justify-start">
              <div className="bg-amber-500/20 backdrop-blur-sm text-amber-300 p-4 rounded-2xl flex items-center gap-2 border border-amber-400/30">
                <Volume2 className="h-4 w-4 animate-pulse" />
                <span className="text-sm">Earl is speaking...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-6 border-t border-white/10">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask Earl about HVAC codes, installation, troubleshooting..."
            className="flex-1 px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
            data-testid="input-earl-message"
          />
          <Button
            onClick={startListening}
            disabled={isListening}
            variant="outline"
            size="sm"
            className={`${isListening ? 'bg-red-500/20 text-red-300 border-red-400/30' : 'bg-white/5 text-white border-white/20 hover:bg-white/10'} px-4 rounded-xl`}
            data-testid="button-voice-input"
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          <Button 
            onClick={sendMessage} 
            className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:via-amber-700 hover:to-amber-600 text-white font-semibold px-6 rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/50 transition-all duration-300"
            data-testid="button-send-message"
          >
            Send
          </Button>
        </div>
        {isListening && (
          <div className="mt-3 text-sm text-red-300 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            Listening for voice input...
          </div>
        )}
      </div>
    </div>
  );
};

const ProPortal = () => {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  if (!user?.hasProAccess && !user?.hasPro) {
    return (
      <>
        <Helmet>
          <title>Pro Portal Access Required - AfterHours HVAC</title>
          <meta name="description" content="Professional HVAC tools and resources require Pro membership access." />
        </Helmet>
        
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700" />
          </div>

          <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl relative z-10">
            <CardHeader className="text-center space-y-4 pb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-2xl shadow-amber-500/50 mx-auto">
                <Crown className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-3xl text-white font-black">Pro Access Required</CardTitle>
              <CardDescription className="text-blue-200 text-lg">
                Professional HVAC tools and resources are available to Pro members only.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-blue-100 text-center leading-relaxed">
                Upgrade to Pro membership to access Earl AI, professional calculators, diagnostic tools, and Alberta/BC code documentation.
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => setLocation('/membership')} 
                  className="w-full h-12 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:via-amber-700 hover:to-amber-600 text-white font-bold rounded-xl shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/50 transition-all duration-300 hover:scale-105"
                  data-testid="button-upgrade-pro"
                >
                  <Crown className="h-5 w-5 mr-2" />
                  Upgrade to Pro
                </Button>
                <Button 
                  onClick={() => setLocation('/')} 
                  variant="outline" 
                  className="w-full h-12 bg-white/5 border-white/20 text-white hover:bg-white/10 rounded-xl"
                  data-testid="button-back-home"
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Pro Portal - Professional HVAC Tools | AfterHours HVAC</title>
        <meta name="description" content="Professional HVAC tools, Earl AI assistant, diagnostic systems, calculators, and Alberta/BC building codes for certified technicians." />
        <meta name="keywords" content="HVAC professional tools, Earl AI, Alberta building code, diagnostic tools, HVAC calculators, pro portal" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700" />
          <div className="absolute top-2/3 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-2xl shadow-amber-500/50 mb-6">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl font-black text-white mb-4">
              Professional HVAC Portal
            </h1>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Access professional HVAC tools, expert AI assistance, and comprehensive documentation
            </p>
            <Badge className="mt-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 px-4 py-2 text-sm font-semibold shadow-lg shadow-amber-500/30" data-testid="badge-pro-member">
              <Crown className="h-4 w-4 mr-2" />
              Pro Member Access
            </Badge>
          </div>

          <div className="max-w-7xl mx-auto space-y-8">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl rounded-2xl overflow-hidden" data-testid="section-earl-assistant">
              <CardHeader className="bg-gradient-to-r from-amber-500/10 via-amber-600/10 to-amber-500/10 border-b border-white/10">
                <CardTitle className="flex items-center gap-3 text-white text-2xl">
                  <Bot className="h-7 w-7 text-amber-400" />
                  Earl - Your AI HVAC Expert
                </CardTitle>
                <CardDescription className="text-blue-200 text-base mt-2">
                  30+ years of Alberta HVAC expertise with voice interaction
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <EarlChatbot />
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl rounded-2xl" data-testid="section-diagnostic-tools">
              <CardHeader className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 border-b border-white/10">
                <CardTitle className="flex items-center gap-3 text-white text-2xl">
                  <Bot className="h-7 w-7 text-blue-400" />
                  Diagnostic Tools
                </CardTitle>
                <CardDescription className="text-blue-200 text-base mt-2">
                  AI-powered diagnostic assistants for field work and troubleshooting
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl" data-testid="card-advanced-voice">
                    <CardHeader className="pb-4">
                      <div className="p-3 bg-blue-500/20 rounded-xl w-fit mb-3">
                        <MessageSquare className="h-8 w-8 text-blue-300" />
                      </div>
                      <CardTitle className="text-white text-lg">Advanced Voice Diagnostics</CardTitle>
                      <CardDescription className="text-blue-200 text-sm">Professional AI with natural conversation flow</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href="/tools/pro-voice-assistant" data-testid="link-pro-voice-assistant">
                        <Button className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 hover:from-blue-600 hover:via-blue-700 hover:to-blue-600 text-white font-semibold h-11 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300" data-testid="button-advanced-voice">
                          Start Advanced Voice
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl" data-testid="card-system-analyzer">
                    <CardHeader className="pb-4">
                      <div className="p-3 bg-green-500/20 rounded-xl w-fit mb-3">
                        <Settings className="h-8 w-8 text-green-300" />
                      </div>
                      <CardTitle className="text-white text-lg">System Analyzer</CardTitle>
                      <CardDescription className="text-blue-200 text-sm">Advanced system performance analysis</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href="/tools/system-analyzer" data-testid="link-system-analyzer">
                        <Button className="w-full bg-gradient-to-r from-green-500 via-green-600 to-green-500 hover:from-green-600 hover:via-green-700 hover:to-green-600 text-white font-semibold h-11 rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/50 transition-all duration-300" data-testid="button-system-analyzer">
                          Analyze System
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl rounded-2xl" data-testid="section-calculators">
              <CardHeader className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 border-b border-white/10">
                <CardTitle className="flex items-center gap-3 text-white text-2xl">
                  <Calculator className="h-7 w-7 text-purple-400" />
                  Professional Calculators
                </CardTitle>
                <CardDescription className="text-blue-200 text-base mt-2">
                  Load calculations, sizing tools, and professional estimating
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl" data-testid="card-load-calculator">
                    <CardHeader className="pb-4">
                      <div className="p-3 bg-purple-500/20 rounded-xl w-fit mb-3">
                        <Thermometer className="h-8 w-8 text-purple-300" />
                      </div>
                      <CardTitle className="text-white text-lg">Load Calculator</CardTitle>
                      <CardDescription className="text-blue-200 text-sm">Manual J load calculations</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href="/calculators/pro-btu" data-testid="link-pro-btu">
                        <Button className="w-full bg-gradient-to-r from-purple-500 via-purple-600 to-purple-500 hover:from-purple-600 hover:via-purple-700 hover:to-purple-600 text-white font-semibold h-11 rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300" data-testid="button-load-calculator">
                          Open Calculator
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/10 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl" data-testid="card-duct-sizing">
                    <CardHeader className="pb-4">
                      <div className="p-3 bg-indigo-500/20 rounded-xl w-fit mb-3">
                        <Settings className="h-8 w-8 text-indigo-300" />
                      </div>
                      <CardTitle className="text-white text-lg">Duct Sizing</CardTitle>
                      <CardDescription className="text-blue-200 text-sm">Manual D ductwork design</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href="/calculators/duct-sizing" data-testid="link-duct-sizing">
                        <Button className="w-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-500 hover:from-indigo-600 hover:via-indigo-700 hover:to-indigo-600 text-white font-semibold h-11 rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/50 transition-all duration-300" data-testid="button-duct-sizing">
                          Size Ducts
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl" data-testid="card-quote-builder">
                    <CardHeader className="pb-4">
                      <div className="p-3 bg-emerald-500/20 rounded-xl w-fit mb-3">
                        <FileCheck className="h-8 w-8 text-emerald-300" />
                      </div>
                      <CardTitle className="text-white text-lg">Quote Builder</CardTitle>
                      <CardDescription className="text-blue-200 text-sm">Professional job estimating</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href="/calculators/enhanced-quote-builder" data-testid="link-quote-builder">
                        <Button className="w-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-600 text-white font-semibold h-11 rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/50 transition-all duration-300" data-testid="button-quote-builder">
                          Build Quote
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl" data-testid="card-material-estimator">
                    <CardHeader className="pb-4">
                      <div className="p-3 bg-blue-500/20 rounded-xl w-fit mb-3">
                        <Calculator className="h-8 w-8 text-blue-300" />
                      </div>
                      <CardTitle className="text-white text-lg">Material Estimator</CardTitle>
                      <CardDescription className="text-blue-200 text-sm">Real-time pricing with custom multipliers</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href="/pro-calculator" data-testid="link-pro-calculator">
                        <Button className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 hover:from-blue-600 hover:via-blue-700 hover:to-blue-600 text-white font-semibold h-11 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300" data-testid="button-material-estimator">
                          Estimate Materials
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl" data-testid="card-commercial-estimator">
                    <CardHeader className="pb-4">
                      <div className="p-3 bg-cyan-500/20 rounded-xl w-fit mb-3">
                        <Building className="h-8 w-8 text-cyan-300" />
                      </div>
                      <CardTitle className="text-white text-lg">Commercial Estimator</CardTitle>
                      <CardDescription className="text-blue-200 text-sm">Complex commercial HVAC calculations</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href="/calculators/commercial-estimator" data-testid="link-commercial-estimator">
                        <Button className="w-full bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-500 hover:from-cyan-600 hover:via-cyan-700 hover:to-cyan-600 text-white font-semibold h-11 rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/50 transition-all duration-300" data-testid="button-commercial-estimator">
                          Commercial Calculator
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl rounded-2xl" data-testid="section-literature">
              <CardHeader className="bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-teal-500/10 border-b border-white/10">
                <CardTitle className="flex items-center gap-3 text-white text-2xl">
                  <BookOpen className="h-7 w-7 text-teal-400" />
                  Professional Literature & Codes
                </CardTitle>
                <CardDescription className="text-blue-200 text-base mt-2">
                  Alberta Building Code, Canadian Gas Code, and professional documentation
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="bg-gradient-to-br from-red-500/10 to-red-600/10 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl" data-testid="card-abc-code">
                    <CardHeader className="pb-4">
                      <div className="p-3 bg-red-500/20 rounded-xl w-fit mb-3">
                        <FileText className="h-8 w-8 text-red-300" />
                      </div>
                      <CardTitle className="text-white text-lg">Alberta Building Code</CardTitle>
                      <CardDescription className="text-blue-200 text-sm">ABC 2019 with STANDATA updates</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className="w-full bg-gradient-to-r from-red-500 via-red-600 to-red-500 hover:from-red-600 hover:via-red-700 hover:to-red-600 text-white font-semibold h-11 rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/50 transition-all duration-300"
                        onClick={() => window.open('https://www.alberta.ca/building-code', '_blank')}
                        data-testid="button-abc-code"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View ABC 2019
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl" data-testid="card-gas-code">
                    <CardHeader className="pb-4">
                      <div className="p-3 bg-orange-500/20 rounded-xl w-fit mb-3">
                        <AlertTriangle className="h-8 w-8 text-orange-300" />
                      </div>
                      <CardTitle className="text-white text-lg">Canadian Gas Code</CardTitle>
                      <CardDescription className="text-blue-200 text-sm">B149.1-20 Gas Installation Code</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 hover:from-orange-600 hover:via-orange-700 hover:to-orange-600 text-white font-semibold h-11 rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/50 transition-all duration-300"
                        onClick={() => window.open('https://www.csagroup.org/store/product/CSA%20B149.1%3A20/', '_blank')}
                        data-testid="button-gas-code"
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        View B149.1-20
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl" data-testid="card-hvac-literature">
                    <CardHeader className="pb-4">
                      <div className="p-3 bg-yellow-500/20 rounded-xl w-fit mb-3">
                        <BookOpen className="h-8 w-8 text-yellow-300" />
                      </div>
                      <CardTitle className="text-white text-lg">HVAC Literature</CardTitle>
                      <CardDescription className="text-blue-200 text-sm">Manuals, guides, and reference materials</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href="/tools/hvac-literature" data-testid="link-hvac-literature">
                        <Button className="w-full bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-500 hover:from-yellow-600 hover:via-yellow-700 hover:to-yellow-600 text-white font-semibold h-11 rounded-xl shadow-lg shadow-yellow-500/30 hover:shadow-xl hover:shadow-yellow-500/50 transition-all duration-300" data-testid="button-hvac-literature">
                          <Download className="h-4 w-4 mr-2" />
                          Access Literature
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-blue-300 text-sm">
              AfterHours HVAC Professional Services - Your Premium HVAC Partner
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProPortal;
