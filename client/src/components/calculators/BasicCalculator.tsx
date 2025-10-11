import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const basicCalculatorSchema = z.object({
  propertyType: z.string().min(1, { message: "Please select a property type" }),
  propertySize: z.string().min(1, { message: "Please enter your property size" }),
  systemAge: z.string().min(1, { message: "Please select your current system age" }),
  systemType: z.string().min(1, { message: "Please select a system type" }),
});

type BasicCalculatorFormValues = z.infer<typeof basicCalculatorSchema>;

// Price estimation functions for different system types
const estimateFurnaceCost = (propertyType: string, propertySize: number, systemAge: string) => {
  // Base prices
  const basePrices = {
    residential: {
      standard: 5500,
      midRange: 7500,
      premium: 9800,
    },
    commercial: {
      small: 8500, // Up to 2000 sq ft
      medium: 12000, // 2000-5000 sq ft
      large: 15000, // 5000+ sq ft
    }
  };
  
  // Age factors (older systems might require more work)
  const ageFactor = {
    '0-5': 1,
    '6-10': 1.05,
    '11-15': 1.1,
    '16+': 1.15,
  }[systemAge] || 1;
  
  // Calculate based on property type
  if (propertyType === "residential") {
    // Size adjustments for residential
    if (propertySize <= 1500) {
      return basePrices.residential.standard * ageFactor;
    } else if (propertySize <= 3000) {
      return basePrices.residential.midRange * ageFactor;
    } else {
      return basePrices.residential.premium * ageFactor;
    }
  } else { // Commercial
    // Size adjustments for commercial
    if (propertySize <= 2000) {
      return basePrices.commercial.small * ageFactor;
    } else if (propertySize <= 5000) {
      return basePrices.commercial.medium * ageFactor;
    } else {
      return basePrices.commercial.large * ageFactor;
    }
  }
};

const estimateACCost = (propertyType: string, propertySize: number, systemAge: string) => {
  // Base prices
  const basePrices = {
    residential: {
      standard: 4800,
      midRange: 6800,
      premium: 8900,
    },
    commercial: {
      small: 7500, // Up to 2000 sq ft
      medium: 10500, // 2000-5000 sq ft
      large: 14000, // 5000+ sq ft
    }
  };
  
  // Age factors (older systems might require more work)
  const ageFactor = {
    '0-5': 1,
    '6-10': 1.05,
    '11-15': 1.1,
    '16+': 1.15,
  }[systemAge] || 1;
  
  // Calculate based on property type
  if (propertyType === "residential") {
    // Size adjustments for residential
    if (propertySize <= 1500) {
      return basePrices.residential.standard * ageFactor;
    } else if (propertySize <= 3000) {
      return basePrices.residential.midRange * ageFactor;
    } else {
      return basePrices.residential.premium * ageFactor;
    }
  } else { // Commercial
    // Size adjustments for commercial
    if (propertySize <= 2000) {
      return basePrices.commercial.small * ageFactor;
    } else if (propertySize <= 5000) {
      return basePrices.commercial.medium * ageFactor;
    } else {
      return basePrices.commercial.large * ageFactor;
    }
  }
};

const BasicCalculator = () => {
  const [estimateResults, setEstimateResults] = useState<{
    lowEstimate: number;
    highEstimate: number;
    systemType: string;
  } | null>(null);

  const form = useForm<BasicCalculatorFormValues>({
    resolver: zodResolver(basicCalculatorSchema),
    defaultValues: {
      propertyType: "",
      propertySize: "",
      systemAge: "",
      systemType: "",
    },
  });

  const onSubmit = (values: BasicCalculatorFormValues) => {
    try {
      const propertySize = parseFloat(values.propertySize);
      let lowEstimate = 0;
      let highEstimate = 0;
      
      // Calculate estimates based on system type
      if (values.systemType === "furnace") {
        const baseCost = estimateFurnaceCost(values.propertyType, propertySize, values.systemAge);
        lowEstimate = Math.round(baseCost * 0.9);
        highEstimate = Math.round(baseCost * 1.1);
      } else if (values.systemType === "ac") {
        const baseCost = estimateACCost(values.propertyType, propertySize, values.systemAge);
        lowEstimate = Math.round(baseCost * 0.9);
        highEstimate = Math.round(baseCost * 1.1);
      } else if (values.systemType === "both") {
        const furnaceCost = estimateFurnaceCost(values.propertyType, propertySize, values.systemAge);
        const acCost = estimateACCost(values.propertyType, propertySize, values.systemAge);
        
        // Apply bundle discount
        const bundleDiscount = 0.05; // 5% discount
        lowEstimate = Math.round((furnaceCost + acCost) * (1 - bundleDiscount) * 0.9);
        highEstimate = Math.round((furnaceCost + acCost) * (1 - bundleDiscount) * 1.1);
      }
      
      setEstimateResults({
        lowEstimate,
        highEstimate,
        systemType: values.systemType
      });
    } catch (error) {
      console.error("Error calculating estimate:", error);
    }
  };

  return (
    <Card className="bg-dark-card border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl font-heading">Basic HVAC Estimator</CardTitle>
        <CardDescription className="text-muted-text">
          Get a quick estimate for your HVAC replacement costs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="propertyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-text">Property Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-charcoal border-gray-700 text-white">
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-dark-card text-white border-gray-700">
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="propertySize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-text">Property Size (sq ft)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., 2000" 
                      className="bg-charcoal border-gray-700 text-white" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="systemAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-text">Current System Age</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-charcoal border-gray-700 text-white">
                        <SelectValue placeholder="Select system age" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-dark-card text-white border-gray-700">
                      <SelectItem value="0-5">0-5 years</SelectItem>
                      <SelectItem value="6-10">6-10 years</SelectItem>
                      <SelectItem value="11-15">11-15 years</SelectItem>
                      <SelectItem value="16+">16+ years</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="systemType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-text">System Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-charcoal border-gray-700 text-white">
                        <SelectValue placeholder="Select system type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-dark-card text-white border-gray-700">
                      <SelectItem value="furnace">Furnace Only</SelectItem>
                      <SelectItem value="ac">Air Conditioning Only</SelectItem>
                      <SelectItem value="both">Both Furnace & AC</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full bg-fire hover:bg-fire/90 text-white mt-2">
              Calculate Estimate
            </Button>
          </form>
        </Form>
        
        {estimateResults && (
          <Alert className="mt-6 bg-green-900/20 text-green-400 border-green-900/50">
            <CheckCircle className="h-4 w-4 mt-0.5 mr-2" />
            <AlertDescription className="space-y-2">
              <h4 className="font-semibold text-white">
                Estimated {estimateResults.systemType === "furnace" 
                  ? "Furnace" 
                  : estimateResults.systemType === "ac"
                    ? "AC"
                    : "HVAC System"} Replacement Cost:
              </h4>
              <p className="text-xl font-bold">
                {formatPrice(estimateResults.lowEstimate)} - {formatPrice(estimateResults.highEstimate)}
              </p>
              <p className="text-sm text-muted-text mt-2">
                This is a basic estimate. For a detailed quote, please 
                <a href="/contact" className="text-electric ml-1">contact us</a> or 
                <a href="https://calendar.app.google/NXZB4v1PP57HhARL7" target="_blank" rel="noopener noreferrer" className="text-electric ml-1">book a consultation</a>.
              </p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default BasicCalculator;
