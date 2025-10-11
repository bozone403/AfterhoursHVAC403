import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { FileCheck, DollarSign, Calculator, Download, Plus, Trash2 } from "lucide-react";
import { ProAccessGuard } from "@/components/ProAccessGuard";

interface QuoteItem {
  id: string;
  category: string;
  item: string;
  quantity: number;
  unitPrice: number;
  laborHours: number;
  total: number;
}

interface Quote {
  items: QuoteItem[];
  subtotal: number;
  labor: number;
  markup: number;
  tax: number;
  total: number;
}

// Complete Alggin pricing data from Calgary catalog
const algginPricing = {
  plenums: {
    "Plenum 16.5x20.25x59\" with End Cap": { price: 155.82, laborHours: 2 },
    "Plenum 20x20.25x59\" with End Cap": { price: 170.41, laborHours: 2 },
    "Plenum 23.5x20.25x59\" with End Cap": { price: 183.93, laborHours: 2 },
    "Plenum 13.5x20.25x71\" with End Cap": { price: 142.00, laborHours: 2 },
    "Plenum 16.5x20.25x71\" with End Cap": { price: 140.00, laborHours: 2 },
    "Plenum 20x20.25x71\" with End Cap": { price: 144.00, laborHours: 2 }
  },
  filterFrames: {
    "Filter Frame 20x16x6.5\"": { price: 53.15, laborHours: 0.5 },
    "Filter Frame 25x16x6.5\"": { price: 55.72, laborHours: 0.5 },
    "Filter Frame 25x20x6.5\"": { price: 61.56, laborHours: 0.5 },
    "Filter Frame 25x16x3\"": { price: 37.57, laborHours: 0.5 },
    "Filter Frame 25x20x3\"": { price: 44.95, laborHours: 0.5 },
    "Filter Frame 25x16x1\"": { price: 21.95, laborHours: 0.5 }
  },
  plenumTakeOffs: {
    "Plenum Take Off 8x8 - 5\" Rise": { price: 31.95, laborHours: 0.5 },
    "Plenum Take Off 10x8 - 5\" Rise": { price: 32.68, laborHours: 0.5 },
    "Plenum Take Off 10x10 - 5\" Rise": { price: 33.85, laborHours: 0.5 },
    "Plenum Take Off 12x8 - 5\" Rise": { price: 32.89, laborHours: 0.5 },
    "Plenum Take Off 12x10 - 5\" Rise": { price: 36.07, laborHours: 0.5 },
    "Plenum Take Off 14x8 - 5\" Rise": { price: 33.75, laborHours: 0.5 },
    "Plenum Take Off 14x10 - 5\" Rise": { price: 37.64, laborHours: 0.5 },
    "Plenum Take Off 16x8 - 5\" Rise": { price: 35.20, laborHours: 0.5 },
    "Plenum Take Off 16x10 - 5\" Rise": { price: 38.95, laborHours: 0.5 },
    "Plenum Take Off 18x8 - 5\" Rise": { price: 37.61, laborHours: 0.5 },
    "Plenum Take Off 18x10 - 5\" Rise": { price: 40.46, laborHours: 0.5 },
    "Plenum Take Off 20x8 - 5\" Rise": { price: 38.74, laborHours: 0.5 },
    "Plenum Take Off 20x10 - 5\" Rise": { price: 42.36, laborHours: 0.5 }
  },
  ductwork: {
    "Duct 8x8x5' 30ga Button Lock": { price: 38.70, laborHours: 0.3 },
    "Duct 10x8x5' 30ga Button Lock": { price: 43.20, laborHours: 0.3 },
    "Duct 12x8x5' 30ga Button Lock": { price: 45.90, laborHours: 0.3 },
    "Duct 14x8x5' 30ga Button Lock": { price: 51.60, laborHours: 0.3 },
    "Duct 16x8x5' 28ga Button Lock": { price: 58.95, laborHours: 0.3 },
    "Duct 18x8x5' 28ga Button Lock": { price: 66.00, laborHours: 0.3 },
    "Duct 20x8x5' 28ga Button Lock": { price: 71.90, laborHours: 0.3 },
    "Duct 10x10x5' 30ga Button Lock": { price: 50.70, laborHours: 0.3 },
    "Duct 12x10x5' 30ga Button Lock": { price: 54.00, laborHours: 0.3 },
    "Duct 14x10x5' 30ga Button Lock": { price: 57.30, laborHours: 0.3 },
    "Duct 16x10x5' 28ga Button Lock": { price: 68.10, laborHours: 0.3 },
    "Duct 18x10x5' 28ga Button Lock": { price: 73.65, laborHours: 0.3 },
    "Duct 20x10x5' 28ga Button Lock": { price: 79.55, laborHours: 0.3 }
  },
  endCaps: {
    "End Cap 8x8": { price: 5.24, laborHours: 0.1 },
    "End Cap 10x8": { price: 5.42, laborHours: 0.1 },
    "End Cap 10x10": { price: 6.88, laborHours: 0.1 },
    "End Cap 12x8": { price: 5.70, laborHours: 0.1 },
    "End Cap 12x10": { price: 7.27, laborHours: 0.1 },
    "End Cap 14x8": { price: 6.45, laborHours: 0.1 },
    "End Cap 14x10": { price: 8.01, laborHours: 0.1 },
    "End Cap 16x8": { price: 7.03, laborHours: 0.1 },
    "End Cap 16x10": { price: 9.12, laborHours: 0.1 },
    "End Cap 18x8": { price: 8.09, laborHours: 0.1 },
    "End Cap 18x10": { price: 10.41, laborHours: 0.1 },
    "End Cap 20x8": { price: 8.63, laborHours: 0.1 },
    "End Cap 20x10": { price: 11.14, laborHours: 0.1 }
  },
  ductReducers: {
    "Duct Reducer 10x8 to 8x8": { price: 24.23, laborHours: 0.3 },
    "Duct Reducer 12x8 to 8x8": { price: 24.29, laborHours: 0.3 },
    "Duct Reducer 12x8 to 10x8": { price: 24.01, laborHours: 0.3 },
    "Duct Reducer 14x8 to 10x8": { price: 26.00, laborHours: 0.3 },
    "Duct Reducer 14x8 to 12x8": { price: 25.88, laborHours: 0.3 },
    "Duct Reducer 16x8 to 10x8": { price: 27.94, laborHours: 0.3 },
    "Duct Reducer 16x8 to 12x8": { price: 27.05, laborHours: 0.3 },
    "Duct Reducer 16x8 to 14x8": { price: 27.43, laborHours: 0.3 },
    "Duct Reducer 18x8 to 12x8": { price: 30.66, laborHours: 0.3 },
    "Duct Reducer 18x8 to 14x8": { price: 31.29, laborHours: 0.3 },
    "Duct Reducer 18x8 to 16x8": { price: 30.64, laborHours: 0.3 }
  },
  elbows: {
    "90° Long Way Elbow 8x8": { price: 30.35, laborHours: 0.2 },
    "90° Long Way Elbow 10x8": { price: 36.59, laborHours: 0.2 },
    "45° Long Way Elbow 10x8": { price: 25.81, laborHours: 0.2 },
    "90° Long Way Elbow 12x8": { price: 40.44, laborHours: 0.2 },
    "45° Long Way Elbow 12x8": { price: 29.84, laborHours: 0.2 },
    "90° Long Way Elbow 14x8": { price: 49.31, laborHours: 0.2 },
    "45° Long Way Elbow 14x8": { price: 37.94, laborHours: 0.2 },
    "90° Long Way Elbow 16x8": { price: 54.64, laborHours: 0.2 },
    "45° Long Way Elbow 16x8": { price: 37.70, laborHours: 0.2 },
    "90° Long Way Elbow 18x8": { price: 67.13, laborHours: 0.2 },
    "45° Long Way Elbow 18x8": { price: 42.38, laborHours: 0.2 },
    "90° Short Way Elbow 10x8": { price: 34.86, laborHours: 0.2 },
    "45° Short Way Elbow 10x8": { price: 23.97, laborHours: 0.2 },
    "90° Short Way Elbow 12x8": { price: 38.34, laborHours: 0.2 },
    "45° Short Way Elbow 12x8": { price: 24.49, laborHours: 0.2 },
    "90° Short Way Elbow 14x8": { price: 40.21, laborHours: 0.2 },
    "45° Short Way Elbow 14x8": { price: 26.77, laborHours: 0.2 },
    "90° Short Way Elbow 16x8": { price: 51.22, laborHours: 0.2 },
    "45° Short Way Elbow 16x8": { price: 36.33, laborHours: 0.2 }
  },
  drainPans: {
    "Drain Pan 24x24x2\" with Drain": { price: 78.83, laborHours: 1 }
  },
  freshAirIntakes: {
    "Fresh Air Intake Hood 4\"": { price: 22.44, laborHours: 0.5 },
    "Fresh Air Intake Hood 5\"": { price: 23.22, laborHours: 0.5 },
    "Fresh Air Intake Hood 6\"": { price: 28.62, laborHours: 0.5 },
    "Fresh Air Intake Hood 7\"": { price: 35.70, laborHours: 0.5 },
    "Fresh Air Intake Hood 8\"": { price: 46.80, laborHours: 0.5 },
    "Fresh Air Intake Hood 10\"": { price: 77.28, laborHours: 0.5 },
    "Fresh Air Intake Hood 12\"": { price: 114.60, laborHours: 0.5 }
  },
  combustionAirDiffusers: {
    "Combustion Air Diffuser 4\"": { price: 43.08, laborHours: 0.5 },
    "Combustion Air Diffuser 5\"": { price: 46.26, laborHours: 0.5 },
    "Combustion Air Diffuser 6\"": { price: 51.03, laborHours: 0.5 },
    "Combustion Air Diffuser 7\"": { price: 66.96, laborHours: 0.5 },
    "Combustion Air Diffuser 8\"": { price: 76.53, laborHours: 0.5 },
    "Combustion Air Diffuser 10\"": { price: 100.09, laborHours: 0.5 },
    "Combustion Air Diffuser 12\"": { price: 175.05, laborHours: 0.5 }
  },
  dampers: {
    "Galvanized Damper 4\"": { price: 2.80, laborHours: 0.2 },
    "Galvanized Damper 5\"": { price: 3.04, laborHours: 0.2 },
    "Galvanized Damper 6\"": { price: 3.55, laborHours: 0.2 },
    "Inline Damper 4\"": { price: 20.55, laborHours: 0.3 },
    "Inline Damper 5\"": { price: 24.66, laborHours: 0.3 },
    "Inline Damper 6\"": { price: 27.41, laborHours: 0.3 },
    "Inline Damper 8\"": { price: 34.25, laborHours: 0.3 }
  },
  takeOffs: {
    "Side Take Off 4\"": { price: 6.28, laborHours: 0.2 },
    "Top Take Off 4\"": { price: 7.38, laborHours: 0.2 },
    "Side Take Off 5\"": { price: 6.61, laborHours: 0.2 },
    "Top Take Off 5\"": { price: 7.38, laborHours: 0.2 },
    "Side Take Off 6\"": { price: 8.89, laborHours: 0.2 },
    "Top Take Off 6\"": { price: 8.58, laborHours: 0.2 },
    "Side Take Off 7\"": { price: 11.94, laborHours: 0.2 },
    "Top Take Off 7\"": { price: 16.86, laborHours: 0.2 },
    "Side Take Off 8\"": { price: 16.24, laborHours: 0.2 },
    "Top Take Off 8\"": { price: 24.18, laborHours: 0.2 },
    "Side Take Off 9\"": { price: 22.36, laborHours: 0.2 },
    "Top Take Off 9\"": { price: 29.28, laborHours: 0.2 },
    "Universal Take Off 4\"": { price: 5.22, laborHours: 0.2 },
    "Universal Take Off 5\"": { price: 5.37, laborHours: 0.2 },
    "Universal Take Off 6\"": { price: 6.12, laborHours: 0.2 },
    "Saddle Take Off 4\"": { price: 4.75, laborHours: 0.2 },
    "Saddle Take Off 5\"": { price: 5.04, laborHours: 0.2 },
    "Saddle Take Off 6\"": { price: 7.05, laborHours: 0.2 }
  },
  tapInCollars: {
    "Tap-In Collar Round 4\" 28ga": { price: 5.65, laborHours: 0.1 },
    "Tap-In Collar Round 5\" 28ga": { price: 5.87, laborHours: 0.1 },
    "Tap-In Collar Round 6\" 28ga": { price: 6.10, laborHours: 0.1 },
    "Tap-In Collar Round 7\" 28ga": { price: 6.30, laborHours: 0.1 },
    "Tap-In Collar Round 8\" 28ga": { price: 9.06, laborHours: 0.1 },
    "Tap-In Collar Round 10\" 26ga": { price: 10.62, laborHours: 0.1 },
    "Tap-In Collar Round 12\" 26ga": { price: 11.82, laborHours: 0.1 },
    "Tap-In Collar Duct 24x10x10": { price: 43.28, laborHours: 0.2 },
    "Tap-In Collar Duct 25x9x10": { price: 42.83, laborHours: 0.2 }
  },
  boots: {
    "Right Angle Boot 4\" 3x10": { price: 7.36, laborHours: 0.3 },
    "Universal Boot 4\" 3x10": { price: 7.36, laborHours: 0.3 },
    "End Boot 4\" 3x10": { price: 7.36, laborHours: 0.3 },
    "Right Angle Boot 4\" 4x10": { price: 8.28, laborHours: 0.3 },
    "Universal Boot 4\" 4x10": { price: 8.28, laborHours: 0.3 },
    "End Boot 4\" 4x10": { price: 8.28, laborHours: 0.3 },
    "Right Angle Boot 5\" 2.25x12": { price: 16.22, laborHours: 0.3 },
    "Universal Boot 5\" 2.25x12": { price: 16.22, laborHours: 0.3 },
    "End Boot 5\" 2.25x12": { price: 16.22, laborHours: 0.3 },
    "Right Angle Boot 5\" 3x10": { price: 7.04, laborHours: 0.3 },
    "Universal Boot 5\" 3x10": { price: 7.04, laborHours: 0.3 },
    "End Boot 5\" 3x10": { price: 7.04, laborHours: 0.3 },
    "Right Angle Boot 6\" 3x10": { price: 8.13, laborHours: 0.3 },
    "Universal Boot 6\" 3x10": { price: 8.13, laborHours: 0.3 },
    "End Boot 6\" 3x10": { price: 8.13, laborHours: 0.3 },
    "Right Angle Boot 6\" 4x10": { price: 8.88, laborHours: 0.3 },
    "Universal Boot 6\" 4x10": { price: 8.88, laborHours: 0.3 },
    "End Boot 6\" 4x10": { price: 8.88, laborHours: 0.3 },
    "Right Angle Boot 6\" 4x12": { price: 18.91, laborHours: 0.3 },
    "Universal Boot 6\" 4x12": { price: 18.91, laborHours: 0.3 },
    "End Boot 6\" 4x12": { price: 18.91, laborHours: 0.3 },
    "Universal Boot 7\" 3x10": { price: 41.06, laborHours: 0.3 },
    "Right Angle Boot 7\" 4x10": { price: 43.47, laborHours: 0.3 },
    "Universal Boot 7\" 4x10": { price: 43.47, laborHours: 0.3 },
    "End Boot 7\" 4x10": { price: 43.47, laborHours: 0.3 },
    "Universal Boot 7\" 4x12": { price: 44.02, laborHours: 0.3 },
    "Universal Boot 8\" 3x10": { price: 54.86, laborHours: 0.3 },
    "Right Angle Boot 8\" 4x10": { price: 54.86, laborHours: 0.3 },
    "Universal Boot 8\" 4x10": { price: 54.86, laborHours: 0.3 },
    "Right Angle Boot 8\" 4x12": { price: 54.86, laborHours: 0.3 },
    "Universal Boot 8\" 4x12": { price: 54.86, laborHours: 0.3 },
    "End Boot 8\" 4x12": { price: 54.86, laborHours: 0.3 },
    "Right Angle Boot 8\" 4x14": { price: 54.86, laborHours: 0.3 },
    "Universal Boot 8\" 4x14": { price: 54.86, laborHours: 0.3 }
  },
  pipe: {
    "Galvanized Pipe 3\" x60\" 30ga": { price: 3.19, laborHours: 0.05 },
    "Galvanized Pipe 4\" x60\" Light": { price: 1.73, laborHours: 0.05 },
    "Galvanized Pipe 4\" x60\" 30ga": { price: 2.58, laborHours: 0.05 },
    "Galvanized Pipe 4\" x60\" 28ga": { price: 4.29, laborHours: 0.05 },
    "Galvanized Pipe 5\" x60\" Light": { price: 1.98, laborHours: 0.05 },
    "Galvanized Pipe 5\" x60\" 30ga": { price: 3.14, laborHours: 0.05 },
    "Galvanized Pipe 5\" x60\" 28ga": { price: 5.45, laborHours: 0.05 },
    "Galvanized Pipe 6\" x60\" Light": { price: 2.40, laborHours: 0.05 },
    "Galvanized Pipe 6\" x60\" 30ga": { price: 3.52, laborHours: 0.05 },
    "Galvanized Pipe 6\" x60\" 28ga": { price: 6.07, laborHours: 0.05 }
  },
  supports: {
    "Pipe Support 16\"": { price: 1.28, laborHours: 0.1 },
    "Pipe Support 21\"": { price: 2.02, laborHours: 0.1 },
    "Pipe Support 24\"": { price: 2.26, laborHours: 0.1 },
    "Hanger Strap 1\"x96\" Light Gauge": { price: 3.15, laborHours: 0.1 },
    "Slip Cleat 60\" Light Gauge": { price: 5.32, laborHours: 0.1 },
    "Slip Cleat 96\" Light Gauge": { price: 9.27, laborHours: 0.1 },
    "Drive Cleat 60\" Light Gauge": { price: 3.24, laborHours: 0.1 },
    "Drive Cleat 96\" Light Gauge": { price: 5.97, laborHours: 0.1 },
    "Angle 1.5\"x1.5\"x120\" 28ga": { price: 12.68, laborHours: 0.1 }
  },
  miscellaneous: {
    "Kitchen Kick Board Box 2.25x12x15\"": { price: 22.00, laborHours: 0.5 },
    "Kitchen Kick Board Box 3x10x15\"": { price: 22.00, laborHours: 0.5 },
    "Joist Liner 16\"x34\" Galvanized": { price: 8.04, laborHours: 0.2 },
    "Joist Liner 19.5\"x34\" Galvanized": { price: 9.42, laborHours: 0.2 },
    "Joist Liner 24\"x34\" Galvanized": { price: 11.56, laborHours: 0.2 },
    "Plenum Strip 23\" Wide x 96\" Long": { price: 64.43, laborHours: 0.3 },
    "Plenum Panel 24\" Wide x 35\" Long": { price: 25.67, laborHours: 0.2 },
    "Return Air Frame 9.75\" Long 25x9.5\"": { price: 9.02, laborHours: 0.3 },
    "Brochure Holder": { price: 7.75, laborHours: 0.1 },
    "Range Hood Transition 5\" 3.25x10": { price: 8.70, laborHours: 0.3 },
    "Range Hood Transition 6\" 3.25x10": { price: 8.88, laborHours: 0.3 },
    "Basement Boot 5\" 3x10": { price: 14.89, laborHours: 0.3 }
  }
};

function QuoteBuilderContent() {
  const [quote, setQuote] = useState<Quote>({
    items: [],
    subtotal: 0,
    labor: 0,
    markup: 0,
    tax: 0,
    total: 0
  });
  
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");
  const [laborRate] = useState<number>(95); // $95/hour Calgary rate
  const [markupPercentage] = useState<number>(40); // 40% markup
  const [taxRate] = useState<number>(5); // 5% GST
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    address: "",
    phone: "",
    email: ""
  });

  const categories = Object.keys(algginPricing);
  const availableItems = selectedCategory ? Object.keys(algginPricing[selectedCategory as keyof typeof algginPricing]) : [];

  const addItem = () => {
    if (!selectedCategory || !selectedItem || !quantity) return;

    const categoryData = algginPricing[selectedCategory as keyof typeof algginPricing];
    const itemData = categoryData[selectedItem as keyof typeof categoryData];
    const qty = parseFloat(quantity);
    
    const newItem: QuoteItem = {
      id: `${Date.now()}-${Math.random()}`,
      category: selectedCategory,
      item: selectedItem,
      quantity: qty,
      unitPrice: itemData.price,
      laborHours: itemData.laborHours * qty,
      total: itemData.price * qty
    };

    setQuote(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));

    // Reset form
    setSelectedItem("");
    setQuantity("1");
  };

  const removeItem = (id: string) => {
    setQuote(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    setQuote(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const qty = Math.max(0.1, newQuantity);
          return {
            ...item,
            quantity: qty,
            laborHours: (item.laborHours / item.quantity) * qty,
            total: item.unitPrice * qty
          };
        }
        return item;
      })
    }));
  };

  // Calculate totals whenever items change
  useEffect(() => {
    const subtotal = quote.items.reduce((sum, item) => sum + item.total, 0);
    const totalLaborHours = quote.items.reduce((sum, item) => sum + item.laborHours, 0);
    const labor = totalLaborHours * laborRate;
    const markup = (subtotal + labor) * (markupPercentage / 100);
    const beforeTax = subtotal + labor + markup;
    const tax = beforeTax * (taxRate / 100);
    const total = beforeTax + tax;

    setQuote(prev => ({
      ...prev,
      subtotal,
      labor,
      markup,
      tax,
      total
    }));
  }, [quote.items, laborRate, markupPercentage, taxRate]);

  const generateQuoteText = () => {
    const date = new Date().toLocaleDateString();
    
    return `AFTERHOURS HVAC - PROFESSIONAL QUOTE
Generated: ${date}

Customer Information:
${customerInfo.name}
${customerInfo.address}
${customerInfo.phone}
${customerInfo.email}

ITEMIZED QUOTE:

${quote.items.map(item => 
  `${item.item} x${item.quantity} @ $${item.unitPrice.toFixed(2)} = $${item.total.toFixed(2)}`
).join('\n')}

TOTALS:
Subtotal (Materials): $${quote.subtotal.toFixed(2)}
Labor (${(quote.labor / laborRate).toFixed(1)} hrs @ $${laborRate}/hr): $${quote.labor.toFixed(2)}
Markup (${markupPercentage}%): $${quote.markup.toFixed(2)}
GST (${taxRate}%): $${quote.tax.toFixed(2)}

TOTAL: $${quote.total.toFixed(2)}

Terms:
- Payment: 40% deposit, 40% at rough-in, 20% completion
- Warranty: 1 year workmanship, manufacturer warranty on equipment
- Pricing valid for 30 days

AfterHours HVAC
Calgary, Alberta
(403) 613-6014`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center bg-green-100 border border-green-200 rounded-full px-4 py-2 mb-4">
          <FileCheck className="h-4 w-4 text-green-400 mr-2" />
          <span className="text-green-400 text-sm font-medium">Pro Tool</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Professional Quote Builder</h1>
        <p className="text-white/70">Real-time quoting with Alggin Calgary pricing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Information */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-6">
          
            <h2 className="text-2xl font-bold text-white mb-6">Customer Information</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="customerName" className="text-white/90">Customer Name</Label>
              <Input className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                id="customerName"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                placeholder="John Smith"
              />
            </div>
            <div>
              <Label htmlFor="customerAddress" className="text-white/90">Address</Label>
              <Textarea
                id="customerAddress"
                value={customerInfo.address}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                placeholder="123 Main St, Calgary, AB"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="customerPhone" className="text-white/90">Phone</Label>
              <Input className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                id="customerPhone"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(403) 555-0123"
              />
            </div>
            <div>
              <Label htmlFor="customerEmail" className="text-white/90">Email</Label>
              <Input className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                id="customerEmail"
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john@example.com"
              />
            </div>
          </div>
        </div>

        {/* Add Items */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-6">
          
            <h2 className="text-2xl font-bold text-white mb-6">Add Quote Items</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="category" className="text-white/90">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-white/5 backdrop-blur-sm border-white/20 text-white focus:border-amber-500">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="furnaces">Furnaces</SelectItem>
                  <SelectItem value="airConditioning">Air Conditioning</SelectItem>
                  <SelectItem value="waterHeaters">Water Heaters</SelectItem>
                  <SelectItem value="ductwork">Ductwork</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedCategory && (
              <div>
                <Label htmlFor="item" className="text-white/90">Item</Label>
                <Select value={selectedItem} onValueChange={setSelectedItem}>
                  <SelectTrigger className="bg-white/5 backdrop-blur-sm border-white/20 text-white focus:border-amber-500">
                    <SelectValue placeholder="Select item" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableItems.map(item => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedItem && (
              <div>
                <Label htmlFor="quantity" className="text-white/90">Quantity</Label>
                <Input className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                  id="quantity"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <div className="text-sm text-white/60 mt-1">
                  Unit Price: ${algginPricing[selectedCategory as keyof typeof algginPricing][selectedItem as any]?.price.toFixed(2)}
                </div>
              </div>
            )}

            <Button 
              onClick={addItem}
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={!selectedCategory || !selectedItem || !quantity}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        {/* Quote Summary */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-6">
          
            <h2 className="flex items-center gap-2 text-2xl font-bold text-white mb-6">
              <DollarSign className="h-5 w-5 text-green-400" />
              Quote Summary
            </h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Materials:</span>
                <span>${quote.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Labor:</span>
                <span>${quote.labor.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Markup ({markupPercentage}%):</span>
                <span>${quote.markup.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>GST ({taxRate}%):</span>
                <span>${quote.tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-green-400">${quote.total.toFixed(2)}</span>
              </div>
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/50"
              onClick={() => {
                const quoteText = generateQuoteText();
                navigator.clipboard.writeText(quoteText);
              }}
              disabled={quote.items.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Copy Quote
            </Button>
          </div>
        </div>
      </div>

      {/* Quote Items List */}
      {quote.items.length > 0 && (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-6">
          
            <h2 className="text-2xl font-bold text-white mb-6">Quote Items</h2>
          
          <div>
            <div className="space-y-3">
              {quote.items.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{item.item}</div>
                    <div className="text-sm text-white/70">
                      {item.category} • ${item.unitPrice.toFixed(2)} each • {item.laborHours.toFixed(1)} labor hrs
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Input className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseFloat(e.target.value))}
                      className="w-20"
                    />
                    <Badge variant="outline">${item.total.toFixed(2)}</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function QuoteBuilder() {
  return (
    <ProAccessGuard>
      <QuoteBuilderContent />
    </ProAccessGuard>
  );
}