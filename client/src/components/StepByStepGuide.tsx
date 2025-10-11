import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Clock, ArrowRight, ArrowLeft, PlayCircle, PauseCircle } from "lucide-react";

interface Step {
  id: number;
  title: string;
  description: string;
  safety: 'safe' | 'caution' | 'danger';
  estimatedTime: string;
  tools?: string[];
  images?: string[];
  warnings?: string[];
  tips?: string[];
}

interface StepByStepGuideProps {
  steps: Step[];
  title: string;
  onComplete?: () => void;
  onExit?: () => void;
}

export default function StepByStepGuide({ 
  steps, 
  title, 
  onComplete, 
  onExit 
}: StepByStepGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isActive, setIsActive] = useState(false);

  const handleStepComplete = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
    
    if (stepId === steps.length - 1) {
      onComplete?.();
    } else {
      setCurrentStep(stepId + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const getSafetyColor = (safety: string) => {
    switch (safety) {
      case 'safe': return 'bg-green-100 text-green-800 border-green-200';
      case 'caution': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'danger': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSafetyIcon = (safety: string) => {
    switch (safety) {
      case 'safe': return <CheckCircle className="h-4 w-4" />;
      case 'caution': return <AlertTriangle className="h-4 w-4" />;
      case 'danger': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (!isActive) {
    return (
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="h-5 w-5 text-blue-600" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Follow our step-by-step guide with safety checks and time estimates.
          </p>
          <div className="flex gap-2">
            <Button onClick={() => setIsActive(true)} className="bg-blue-600 hover:bg-blue-700">
              Start Guide
            </Button>
            {onExit && (
              <Button variant="outline" onClick={onExit}>
                Not Now
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const step = steps[currentStep];

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="h-5 w-5 text-blue-600" />
            {title}
          </CardTitle>
          <Badge variant="outline">
            Step {currentStep + 1} of {steps.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Current Step */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{step.title}</h3>
            <div className="flex items-center gap-2">
              <Badge className={getSafetyColor(step.safety)}>
                {getSafetyIcon(step.safety)}
                {step.safety.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {step.estimatedTime}
              </Badge>
            </div>
          </div>

          <p className="text-gray-700">{step.description}</p>

          {/* Safety Warnings */}
          {step.warnings && step.warnings.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
                <AlertTriangle className="h-4 w-4" />
                Safety Warnings
              </div>
              <ul className="text-red-700 text-sm space-y-1">
                {step.warnings.map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Tools Required */}
          {step.tools && step.tools.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="font-medium text-blue-800 mb-2">Tools Required:</div>
              <div className="flex flex-wrap gap-2">
                {step.tools.map((tool, index) => (
                  <Badge key={index} variant="outline" className="text-blue-700">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          {step.tips && step.tips.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="font-medium text-green-800 mb-2">Pro Tips:</div>
              <ul className="text-green-700 text-sm space-y-1">
                {step.tips.map((tip, index) => (
                  <li key={index}>• {tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsActive(false)}
            >
              <PauseCircle className="h-4 w-4 mr-2" />
              Pause
            </Button>
            
            {currentStep === steps.length - 1 ? (
              <Button 
                onClick={() => handleStepComplete(currentStep)}
                className="bg-green-600 hover:bg-green-700"
              >
                Complete Guide
              </Button>
            ) : (
              <Button 
                onClick={() => handleStepComplete(currentStep)}
                className="flex items-center gap-2"
              >
                Mark Complete & Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Emergency Exit */}
        <div className="text-center pt-2 border-t">
          <p className="text-xs text-gray-500 mb-2">
            Need help? Call AfterHours HVAC: (403) 613-6014
          </p>
          {onExit && (
            <Button variant="ghost" size="sm" onClick={onExit} className="text-red-600">
              Exit Guide
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}