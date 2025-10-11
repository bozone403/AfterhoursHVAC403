import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, MessageCircle, Lightbulb, X, Volume2 } from "lucide-react";

interface MascotTip {
  message: string;
  type: 'tip' | 'safety' | 'reminder' | 'encouragement';
  triggerCondition?: string;
}

interface ToolMascotProps {
  currentContext?: string;
  isVisible?: boolean;
  onClose?: () => void;
  onSpeak?: (text: string) => void;
}

const mascotTips: Record<string, MascotTip[]> = {
  'no-heat': [
    {
      message: "Before we panic, let's check the basics! Most heating issues are simple fixes.",
      type: 'encouragement'
    },
    {
      message: "Safety first! If you smell gas, stop everything and leave the house immediately.",
      type: 'safety'
    },
    {
      message: "Pro tip: Check your thermostat batteries - they die at the worst times!",
      type: 'tip'
    }
  ],
  'high-bills': [
    {
      message: "Your wallet will thank you for checking that air filter! It's the #1 cause of high bills.",
      type: 'tip'
    },
    {
      message: "Small steps save big money - start with the simple stuff first.",
      type: 'encouragement'
    }
  ],
  'strange-noises': [
    {
      message: "Don't ignore those sounds! Your system is trying to tell you something.",
      type: 'reminder'
    },
    {
      message: "Safety check: If you hear loud banging or grinding, turn off your system immediately.",
      type: 'safety'
    }
  ],
  'general': [
    {
      message: "I'm Earl, your HVAC helper! I'm here to guide you through any heating or cooling problem.",
      type: 'encouragement'
    },
    {
      message: "Remember: When in doubt, safety first. Never hesitate to call for professional help.",
      type: 'safety'
    },
    {
      message: "Monthly filter checks prevent 80% of HVAC problems. Set a phone reminder!",
      type: 'tip'
    }
  ]
};

export default function ToolMascot({ 
  currentContext = 'general', 
  isVisible = true, 
  onClose, 
  onSpeak 
}: ToolMascotProps) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showMascot, setShowMascot] = useState(isVisible);

  const tips = mascotTips[currentContext] || mascotTips.general;
  const currentTip = tips[currentTipIndex];

  useEffect(() => {
    if (!showMascot) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentTipIndex((prev) => (prev + 1) % tips.length);
        setIsAnimating(false);
      }, 300);
    }, 15000); // Change tip every 15 seconds

    return () => clearInterval(interval);
  }, [tips.length, showMascot]);

  const getTipStyle = (type: string) => {
    switch (type) {
      case 'safety':
        return 'border-red-200 bg-red-50';
      case 'tip':
        return 'border-blue-200 bg-blue-50';
      case 'reminder':
        return 'border-yellow-200 bg-yellow-50';
      case 'encouragement':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getTipIcon = (type: string) => {
    switch (type) {
      case 'safety':
        return '🚨';
      case 'tip':
        return '💡';
      case 'reminder':
        return '⏰';
      case 'encouragement':
        return '👍';
      default:
        return '🔧';
    }
  };

  if (!showMascot) {
    return (
      <Button
        onClick={() => setShowMascot(true)}
        className="fixed bottom-4 right-4 z-40 rounded-full h-14 w-14 bg-blue-600 hover:bg-blue-700 shadow-lg"
        title="Show Earl's Tips"
      >
        <Wrench className="h-6 w-6 text-white" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm">
      <Card className={`shadow-xl border-2 ${getTipStyle(currentTip.type)} transition-all duration-300 ${isAnimating ? 'scale-95 opacity-70' : 'scale-100 opacity-100'}`}>
        <CardContent className="p-4">
          {/* Mascot Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="text-2xl">{getTipIcon(currentTip.type)}</div>
              <div>
                <h4 className="font-semibold text-sm text-gray-900">Earl's Helper</h4>
                <p className="text-xs text-gray-500 capitalize">{currentTip.type}</p>
              </div>
            </div>
            <div className="flex gap-1">
              {onSpeak && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSpeak(currentTip.message)}
                  className="h-6 w-6 p-0"
                  title="Speak tip"
                >
                  <Volume2 className="h-3 w-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowMascot(false);
                  onClose?.();
                }}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Tip Message */}
          <div className="mb-3">
            <p className="text-sm text-gray-700">{currentTip.message}</p>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 text-xs">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentTipIndex((prev) => (prev + 1) % tips.length);
              }}
              className="h-6 text-xs"
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              Next Tip
            </Button>
            
            {currentTip.type === 'safety' && (
              <Button
                size="sm"
                onClick={() => window.open('tel:4036136014')}
                className="h-6 text-xs bg-red-600 hover:bg-red-700"
              >
                Emergency: (403) 613-6014
              </Button>
            )}
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-1 mt-3">
            {tips.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  index === currentTipIndex ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}