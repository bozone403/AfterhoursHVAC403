import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { ProAccessGuard } from '@/components/pro-access-guard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";
import { Calculator, Home, Wrench, DollarSign, FileText, Plus, Minus, Search, Download, Save, CreditCard, Trash2 } from 'lucide-react';
import { algginCatalog, categories, subcategories, searchCatalog, type CatalogItem } from '@shared/alggin-catalog';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
interface MaterialItem {
  id: string;
  catalogItem: CatalogItem;
  quantity: number;
  totalPrice: number;
  notes?: string;
}

interface LaborItem {
  id: string;
  description: string;
  hours: number;
  rate: number;
  totalCost: number;
}

interface CustomItem {
  id: string;
  description: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PaymentForm = ({ amount, onSuccess }: { amount: number; onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/pro-portal`,
      },
      redirect: 'if_required'
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      toast({
        title: "Payment Successful",
        description: "Invoice has been paid and saved to customer records.",
      });
      onSuccess();
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-6 border border-gray-600 rounded-lg bg-gray-800">
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-white mb-2">
          ${amount.toFixed(2)} CAD
        </div>
        <p className="text-gray-300 mb-4">Total Amount Due</p>
        
        <Button 
          type="submit" 
          disabled={!stripe || isProcessing}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white"
        >
          {isProcessing ? (
            <>Processing...</>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pay Now
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

const ProCalculatorV2 = () => {
  const { toast } = useToast();
  
  // Project Information
  const [projectName, setProjectName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [projectAddress, setProjectAddress] = useState('');
  const [projectNotes, setProjectNotes] = useState('');
  
  // Material Search and Selection
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  
  // Labor Items
  const [laborItems, setLaborItems] = useState<LaborItem[]>([]);
  
  // Custom Items
  const [customItems, setCustomItems] = useState<CustomItem[]>([]);
  
  // Pricing Settings
  const [markupPercentage, setMarkupPercentage] = useState('25');
  const [overheadPercentage, setOverheadPercentage] = useState('15');
  const [laborRate, setLaborRate] = useState('75');
  
  // Payment Processing
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  
  // Search and filter catalog items
  const filteredCatalog = useMemo(() => {
    let items = algginCatalog;
    
    if (searchTerm) {
      items = searchCatalog(searchTerm);
    }
    
    if (selectedCategory) {
      items = items.filter(item => item.category === selectedCategory);
    }
    
    if (selectedSubcategory) {
      items = items.filter(item => item.subcategory === selectedSubcategory);
    }
    
    return items;
  }, [searchTerm, selectedCategory, selectedSubcategory]);
  
  // Calculate totals
  const calculations = useMemo(() => {
    const materialsSubtotal = materials.reduce((sum, item) => sum + item.totalPrice, 0);
    const laborSubtotal = laborItems.reduce((sum, item) => sum + item.totalCost, 0);
    const customSubtotal = customItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    const subtotal = materialsSubtotal + laborSubtotal + customSubtotal;
    const overhead = (subtotal * parseFloat(overheadPercentage)) / 100;
    const markup = ((subtotal + overhead) * parseFloat(markupPercentage)) / 100;
    const total = subtotal + overhead + markup;
    
    return {
      materialsSubtotal,
      laborSubtotal,
      customSubtotal,
      subtotal,
      overhead,
      markup,
      total
    };
  }, [materials, laborItems, customItems, markupPercentage, overheadPercentage]);

  // Add material to takeoff
  const addMaterial = (catalogItem: CatalogItem, quantity: number = 1) => {
    const id = Date.now().toString();
    const newMaterial: MaterialItem = {
      id,
      catalogItem,
      quantity,
      totalPrice: catalogItem.price * quantity
    };
    setMaterials(prev => [...prev, newMaterial]);
    
    toast({
      title: "Material Added",
      description: `${catalogItem.description} added to takeoff`,
    });
  };

  // Update material quantity
  const updateMaterialQuantity = (id: string, quantity: number) => {
    setMaterials(prev => prev.map(item => 
      item.id === id 
        ? { ...item, quantity, totalPrice: item.catalogItem.price * quantity }
        : item
    ));
  };

  // Remove material
  const removeMaterial = (id: string) => {
    setMaterials(prev => prev.filter(item => item.id !== id));
  };

  // Add labor item
  const addLaborItem = () => {
    const id = Date.now().toString();
    const newLabor: LaborItem = {
      id,
      description: 'Installation Labor',
      hours: 1,
      rate: parseFloat(laborRate),
      totalCost: parseFloat(laborRate)
    };
    setLaborItems(prev => [...prev, newLabor]);
  };

  // Update labor item
  const updateLaborItem = (id: string, updates: Partial<LaborItem>) => {
    setLaborItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, ...updates };
        updated.totalCost = updated.hours * updated.rate;
        return updated;
      }
      return item;
    }));
  };

  // Remove labor item
  const removeLaborItem = (id: string) => {
    setLaborItems(prev => prev.filter(item => item.id !== id));
  };

  // Add custom item
  const addCustomItem = () => {
    const id = Date.now().toString();
    const newCustom: CustomItem = {
      id,
      description: 'Custom Item',
      price: 0,
      quantity: 1,
      totalPrice: 0
    };
    setCustomItems(prev => [...prev, newCustom]);
  };

  // Update custom item
  const updateCustomItem = (id: string, updates: Partial<CustomItem>) => {
    setCustomItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, ...updates };
        updated.totalPrice = updated.price * updated.quantity;
        return updated;
      }
      return item;
    }));
  };

  // Remove custom item
  const removeCustomItem = (id: string) => {
    setCustomItems(prev => prev.filter(item => item.id !== id));
  };

  // Save estimate to customer file
  const saveEstimate = async () => {
    try {
      const estimateData = {
        projectName,
        customerName,
        customerEmail,
        projectAddress,
        projectNotes,
        materials,
        laborItems,
        customItems,
        calculations,
        markupPercentage,
        overheadPercentage,
        laborRate,
        createdAt: new Date().toISOString()
      };

      const response = await fetch('/api/estimates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(estimateData)
      });

      if (response.ok) {
        toast({
          title: "Estimate Saved",
          description: "Estimate has been saved to customer records.",
        });
      }
    } catch (error) {
      toast({
        title: "Save Error",
        description: "Failed to save estimate. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Generate PDF estimate
  const generatePDF = async () => {
    try {
      const estimateData = {
        projectName,
        customerName,
        projectAddress,
        materials,
        laborItems,
        customItems,
        calculations
      };

      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(estimateData)
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${projectName || 'HVAC-Estimate'}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: "PDF Generated",
          description: "Estimate PDF has been downloaded.",
        });
      }
    } catch (error) {
      toast({
        title: "PDF Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Create Stripe payment intent
  const createPaymentIntent = async () => {
    try {
      const response = await apiFetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(calculations.total * 100), // Convert to cents
          currency: 'cad',
          description: `HVAC Estimate - ${projectName || 'Project'}`,
          customer_name: customerName,
          customer_email: customerEmail,
          project_details: {
            materials: materials.length,
            labor_hours: laborItems.reduce((sum, item) => sum + item.hours, 0),
            project_address: projectAddress
          }
        })
      });
      
      const data = await response.json();
      setClientSecret(data.clientSecret);
      setShowPaymentForm(true);
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Failed to create payment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentForm(false);
    saveEstimate();
  };

  if (showPaymentForm && stripePromise && clientSecret) {
    return (
      <ProAccessGuard feature="pro-calculator">
        <div className="min-h-screen bg-gray-900 py-20">
          <Helmet>
            <title>Complete Payment - AfterHours HVAC</title>
          </Helmet>
          
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">Complete Payment</h1>
              <p className="text-gray-300">{customerName} - {projectName}</p>
            </div>
            
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm 
                amount={calculations.total} 
                onSuccess={handlePaymentSuccess}
              />
            </Elements>
            
            <div className="text-center mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowPaymentForm(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Back to Estimate
              </Button>
            </div>
          </div>
        </div>
      </ProAccessGuard>
    );
  }

  return (
    <ProAccessGuard feature="pro-calculator">
      <div className="min-h-screen bg-gray-900 py-20">
        <Helmet>
          <title>Professional Material Takeoff Calculator - AfterHours HVAC</title>
          <meta name="description" content="Professional HVAC material takeoff calculator with real Alggin catalog pricing, labor calculations, and instant payment processing." />
        </Helmet>

        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-2">
              <Calculator className="text-orange-500" />
              Professional Material Takeoff
            </h1>
            <p className="text-xl text-gray-300">
              Complete HVAC estimating with real Alggin catalog pricing
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Project Information */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-800 border-gray-700 mb-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="text-orange-500" />
                    Project Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="projectName" className="text-white">Project Name</Label>
                    <Input 
                      className="mt-1 bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                      id="projectName"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="e.g., Furnace Installation"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="customerName" className="text-white">Customer Name</Label>
                    <Input 
                      className="mt-1 bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                      id="customerName"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Customer name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="customerEmail" className="text-white">Customer Email</Label>
                    <Input 
                      className="mt-1 bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                      id="customerEmail"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="customer@email.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="projectAddress" className="text-white">Project Address</Label>
                    <Input 
                      className="mt-1 bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                      id="projectAddress"
                      value={projectAddress}
                      onChange={(e) => setProjectAddress(e.target.value)}
                      placeholder="Street address"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="projectNotes" className="text-white">Notes</Label>
                    <Textarea
                      id="projectNotes"
                      value={projectNotes}
                      onChange={(e) => setProjectNotes(e.target.value)}
                      className="mt-1 bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                      rows={3}
                      placeholder="Project notes..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Pricing Settings */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="text-orange-500" />
                    Pricing Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="laborRate" className="text-white">Labor Rate ($/hour)</Label>
                    <Input className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                      id="laborRate"
                      type="number"
                      value={laborRate}
                      onChange={(e) => setLaborRate(e.target.value)}
                      className="mt-1 bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="overhead" className="text-white">Overhead (%)</Label>
                    <Input className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                      id="overhead"
                      type="number"
                      value={overheadPercentage}
                      onChange={(e) => setOverheadPercentage(e.target.value)}
                      className="mt-1 bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="markup" className="text-white">Markup (%)</Label>
                    <Input className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                      id="markup"
                      type="number"
                      value={markupPercentage}
                      onChange={(e) => setMarkupPercentage(e.target.value)}
                      className="mt-1 bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Material Selection */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-800 border-gray-700 mb-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Search className="text-orange-500" />
                    Alggin Catalog Search
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Search and add materials from the real Alggin catalog
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <Label htmlFor="search" className="text-white">Search Materials</Label>
                      <Input className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                        id="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mt-1 bg-gray-700 border-gray-600 text-white"
                        placeholder="Search pipe, fittings, etc..."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="category" className="text-white">Category</Label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="All categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Categories</SelectItem>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="subcategory" className="text-white">Subcategory</Label>
                      <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                        <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="All subcategories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Subcategories</SelectItem>
                          {selectedCategory && subcategories[selectedCategory]?.map(sub => (
                            <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Catalog Results */}
                  <div className="max-h-80 overflow-y-auto">
                    <div className="space-y-2">
                      {filteredCatalog.map((item) => (
                        <div key={item.stockNumber} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium text-white">{item.description}</div>
                            <div className="text-sm text-gray-300">
                              {item.stockNumber} • {item.category} • {item.subcategory}
                              {item.size && ` • Size: ${item.size}`}
                              {item.gauge && ` • Gauge: ${item.gauge}`}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="font-bold text-orange-500">${item.price.toFixed(2)}</div>
                              <div className="text-xs text-gray-400">{item.unit || 'each'}</div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => addMaterial(item)}
                              className="bg-orange-600 hover:bg-orange-700"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Material Takeoff */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Wrench className="text-orange-500" />
                    Material Takeoff
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Selected materials, labor, and custom items
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Materials */}
                  {materials.length > 0 && (
                    <div>
                      <h4 className="text-white font-semibold mb-3">Materials</h4>
                      <div className="space-y-2">
                        {materials.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                            <div className="flex-1">
                              <div className="font-medium text-white">{item.catalogItem.description}</div>
                              <div className="text-sm text-gray-300">{item.catalogItem.stockNumber}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Input className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateMaterialQuantity(item.id, parseFloat(e.target.value) || 0)}
                                className="w-20 bg-gray-600 border-gray-500 text-white text-center"
                                min="0"
                                step="0.1"
                              />
                              <span className="text-gray-300 w-12">x ${item.catalogItem.price}</span>
                              <span className="text-orange-500 font-bold w-20 text-right">
                                ${item.totalPrice.toFixed(2)}
                              </span>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => removeMaterial(item.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Labor */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-semibold">Labor</h4>
                      <Button size="sm" onClick={addLaborItem} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Labor
                      </Button>
                    </div>
                    {laborItems.length > 0 && (
                      <div className="space-y-2">
                        {laborItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                            <Input className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                              value={item.description}
                              onChange={(e) => updateLaborItem(item.id, { description: e.target.value })}
                              className="flex-1 bg-gray-600 border-gray-500 text-white"
                              placeholder="Labor description"
                            />
                            <Input className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                              type="number"
                              value={item.hours}
                              onChange={(e) => updateLaborItem(item.id, { hours: parseFloat(e.target.value) || 0 })}
                              className="w-20 bg-gray-600 border-gray-500 text-white text-center"
                              placeholder="Hours"
                              step="0.25"
                            />
                            <span className="text-gray-300">hrs</span>
                            <Input className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                              type="number"
                              value={item.rate}
                              onChange={(e) => updateLaborItem(item.id, { rate: parseFloat(e.target.value) || 0 })}
                              className="w-20 bg-gray-600 border-gray-500 text-white text-center"
                              placeholder="Rate"
                            />
                            <span className="text-orange-500 font-bold w-20 text-right">
                              ${item.totalCost.toFixed(2)}
                            </span>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => removeLaborItem(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Custom Items */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-semibold">Custom Items</h4>
                      <Button size="sm" onClick={addCustomItem} className="bg-green-600 hover:bg-green-700">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Custom
                      </Button>
                    </div>
                    {customItems.length > 0 && (
                      <div className="space-y-2">
                        {customItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                            <Input className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                              value={item.description}
                              onChange={(e) => updateCustomItem(item.id, { description: e.target.value })}
                              className="flex-1 bg-gray-600 border-gray-500 text-white"
                              placeholder="Item description"
                            />
                            <Input className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateCustomItem(item.id, { quantity: parseFloat(e.target.value) || 0 })}
                              className="w-20 bg-gray-600 border-gray-500 text-white text-center"
                              placeholder="Qty"
                              step="0.1"
                            />
                            <Input className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-amber-500"
                              type="number"
                              value={item.price}
                              onChange={(e) => updateCustomItem(item.id, { price: parseFloat(e.target.value) || 0 })}
                              className="w-24 bg-gray-600 border-gray-500 text-white text-center"
                              placeholder="Price"
                              step="0.01"
                            />
                            <span className="text-orange-500 font-bold w-20 text-right">
                              ${item.totalPrice.toFixed(2)}
                            </span>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => removeCustomItem(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator className="bg-gray-600" />

                  {/* Totals */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-300">
                      <span>Materials Subtotal:</span>
                      <span>${calculations.materialsSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Labor Subtotal:</span>
                      <span>${calculations.laborSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Custom Items Subtotal:</span>
                      <span>${calculations.customSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal:</span>
                      <span>${calculations.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Overhead ({overheadPercentage}%):</span>
                      <span>${calculations.overhead.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Markup ({markupPercentage}%):</span>
                      <span>${calculations.markup.toFixed(2)}</span>
                    </div>
                    <Separator className="bg-gray-600" />
                    <div className="flex justify-between text-xl font-bold text-orange-500">
                      <span>Total:</span>
                      <span>${calculations.total.toFixed(2)} CAD</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={saveEstimate} className="bg-blue-600 hover:bg-blue-700">
                      <Save className="w-4 h-4 mr-2" />
                      Save Estimate
                    </Button>
                    
                    <Button onClick={generatePDF} className="bg-green-600 hover:bg-green-700">
                      <Download className="w-4 h-4 mr-2" />
                      Generate PDF
                    </Button>
                    
                    <Button 
                      onClick={createPaymentIntent} 
                      className="bg-orange-600 hover:bg-orange-700"
                      disabled={!customerName || calculations.total <= 0}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Collect Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProAccessGuard>
  );
};

export default ProCalculatorV2;