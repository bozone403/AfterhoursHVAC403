import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Flame, 
  Check, 
  Star, 
  DollarSign, 
  Shield, 
  Award
} from 'lucide-react';

const furnaceProducts = [
  {
    id: 'standard-furnace',
    name: 'Standard High-Efficiency Furnace',
    price: 6000,
    description: '95% AFUE high-efficiency furnace for residential homes',
    features: [
      '95% AFUE efficiency rating',
      '10-year parts warranty',
      '2-year labor warranty',
      'Professional installation included',
      'Energy Star certified',
      'Quiet operation'
    ],
    badge: 'Most Popular',
    icon: Flame,
    sizes: ['80,000 BTU', '100,000 BTU', '120,000 BTU'],
    popular: true
  },
  {
    id: 'premium-furnace',
    name: 'Premium High-Efficiency Furnace',
    price: 8500,
    description: '96% AFUE premium furnace with advanced features',
    features: [
      '96% AFUE efficiency rating',
      '12-year parts warranty',
      '3-year labor warranty',
      'Smart thermostat integration',
      'Variable speed blower',
      'Advanced filtration system',
      'Professional installation included'
    ],
    badge: 'Premium',
    icon: Star,
    sizes: ['80,000 BTU', '100,000 BTU', '120,000 BTU'],
    popular: false
  },
  {
    id: 'modulating-furnace',
    name: 'Modulating Communicating Furnace',
    price: 12000,
    description: '98% AFUE modulating furnace with communicating technology',
    features: [
      '98% AFUE efficiency rating',
      '15-year parts warranty',
      '5-year labor warranty',
      'Modulating gas valve',
      'Communicating technology',
      'Smart home integration',
      'Premium air filtration',
      'Ultra-quiet operation',
      'Professional installation included'
    ],
    badge: 'Top of Line',
    icon: Award,
    sizes: ['80,000 BTU', '100,000 BTU', '120,000 BTU'],
    popular: false
  }
];

const FurnacePage = () => {
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    installationDate: ''
  });

  const purchaseMutation = useMutation({
    mutationFn: async (purchaseData: any) => {
      const response = await apiRequest('POST', '/api/create-payment-intent', purchaseData);
      return response.json();
    },
    onSuccess: (data) => {
      window.location.href = `/checkout?client_secret=${data.clientSecret}&product=${selectedProduct}`;
    },
    onError: () => {
      toast({
        title: "Purchase Error",
        description: "Failed to process purchase. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handlePurchase = () => {
    if (!selectedProduct || !selectedSize) {
      toast({
        title: "Selection Required",
        description: "Please select a furnace model and size",
        variant: "destructive"
      });
      return;
    }

    if (!customerInfo.name || !customerInfo.email || !customerInfo.address) {
      toast({
        title: "Information Required",
        description: "Please fill in all required customer information",
        variant: "destructive"
      });
      return;
    }

    const product = furnaceProducts.find(p => p.id === selectedProduct);
    if (!product) return;

    purchaseMutation.mutate({
      productId: selectedProduct,
      productName: product.name,
      size: selectedSize,
      amount: product.price,
      customerInfo,
      category: 'furnace'
    });
  };

  const selectedProductData = furnaceProducts.find(p => p.id === selectedProduct);

  return (
    <>
      <Helmet>
        <title>High-Efficiency Furnaces | AfterHours HVAC</title>
        <meta name="description" content="Professional furnace installation in Calgary. High-efficiency models starting at $6,000 with full warranty and professional installation included." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-12">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Flame className="h-10 w-10 text-orange-400" />
              High-Efficiency Furnaces
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Professional furnace installation with premium equipment and comprehensive warranties. 
              All models comply with Calgary efficiency standards.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6">Choose Your Furnace</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {furnaceProducts.map((product) => {
                  const IconComponent = product.icon;
                  return (
                    <Card 
                      key={product.id}
                      className={`cursor-pointer transition-all hover:border-orange-600/50 relative ${
                        selectedProduct === product.id 
                          ? 'bg-orange-600/10 border-orange-600/30 ring-2 ring-orange-600/20' 
                          : 'bg-slate-800/50 border-slate-700'
                      }`}
                      onClick={() => setSelectedProduct(product.id)}
                    >
                      {product.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                          <Badge className="bg-orange-600 text-white">
                            {product.badge}
                          </Badge>
                        </div>
                      )}

                      <CardHeader className="text-center pb-4">
                        <div className="mx-auto mb-4 p-3 bg-orange-600/10 rounded-full w-fit">
                          <IconComponent className="h-8 w-8 text-orange-400" />
                        </div>
                        
                        <CardTitle className="text-white text-xl">{product.name}</CardTitle>
                        <CardDescription className="text-slate-300">
                          {product.description}
                        </CardDescription>
                        
                        <div className="text-3xl font-bold text-orange-400 mt-2">
                          ${product.price.toLocaleString()}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <ul className="space-y-2">
                          {product.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start text-sm">
                              <Check className="h-4 w-4 text-orange-400 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-slate-300">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {selectedProduct && (
                <Card className="bg-slate-800/50 border-slate-700 mb-6">
                  <CardHeader>
                    <CardTitle className="text-white">Select Size</CardTitle>
                    <CardDescription>Choose the appropriate BTU capacity for your home</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Select value={selectedSize} onValueChange={setSelectedSize}>
                      <SelectTrigger className="bg-slate-900 border-slate-600">
                        <SelectValue placeholder="Select BTU capacity" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedProductData?.sizes.map(size => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Customer Information</CardTitle>
                  <CardDescription>Required for scheduling installation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-slate-900 border-slate-600"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="bg-slate-900 border-slate-600"
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="bg-slate-900 border-slate-600"
                      placeholder="(403) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Installation Address *</Label>
                    <Input
                      id="address"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                      className="bg-slate-900 border-slate-600"
                      placeholder="123 Main St, Calgary, AB"
                    />
                  </div>

                  <div>
                    <Label htmlFor="date">Preferred Installation Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={customerInfo.installationDate}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, installationDate: e.target.value }))}
                      className="bg-slate-900 border-slate-600"
                    />
                  </div>
                </CardContent>
              </Card>

              {selectedProduct && (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Product:</span>
                        <span className="text-white">{selectedProductData?.name}</span>
                      </div>
                      {selectedSize && (
                        <div className="flex justify-between">
                          <span className="text-slate-300">Size:</span>
                          <span className="text-white">{selectedSize}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-slate-300">Installation:</span>
                        <span className="text-green-400">Included</span>
                      </div>
                    </div>

                    <Separator className="bg-slate-600" />

                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-white">Total:</span>
                      <span className="text-orange-400">${selectedProductData?.price.toLocaleString()}</span>
                    </div>

                    <Button 
                      onClick={handlePurchase}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                      disabled={!selectedProduct || !selectedSize || purchaseMutation.isPending}
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      {purchaseMutation.isPending ? 'Processing...' : 'Purchase Now'}
                    </Button>

                    <div className="text-center text-sm text-slate-400">
                      Secure payment • Professional installation • Full warranty
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-white mb-4 flex items-center">
                    <Shield className="h-4 w-4 text-orange-400 mr-2" />
                    What's Included
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-center">
                      <Check className="h-3 w-3 text-orange-400 mr-2" />
                      Professional installation by certified technicians
                    </li>
                    <li className="flex items-center">
                      <Check className="h-3 w-3 text-orange-400 mr-2" />
                      All permits and inspections included
                    </li>
                    <li className="flex items-center">
                      <Check className="h-3 w-3 text-orange-400 mr-2" />
                      Removal and disposal of old equipment
                    </li>
                    <li className="flex items-center">
                      <Check className="h-3 w-3 text-orange-400 mr-2" />
                      Comprehensive warranty coverage
                    </li>
                    <li className="flex items-center">
                      <Check className="h-3 w-3 text-orange-400 mr-2" />
                      Post-installation system testing
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FurnacePage;