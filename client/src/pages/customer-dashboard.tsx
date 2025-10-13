import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Settings, 
  FileText, 
  Calendar, 
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Star,
  Wrench,
  Shield
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch user's service requests
  const { data: serviceRequests = [] } = useQuery({
    queryKey: ["/api/service-requests"],
  });

  // Fetch user's quotes
  const { data: quotes = [] } = useQuery({
    queryKey: ["/api/quotes"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'in_progress': return 'text-blue-600 bg-blue-50';
      case 'scheduled': return 'text-purple-600 bg-purple-50';
      case 'pending': return 'text-orange-700 bg-orange-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'scheduled': return <Calendar className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.firstName || user?.username}!
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your HVAC services and account settings
              </p>
            </div>
            <div className="flex items-center gap-3">
              {user?.hasProAccess && (
                <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                  <Star className="h-3 w-3 mr-1" />
                  Pro Member
                </Badge>
              )}
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <Shield className="h-3 w-3 mr-1" />
                Verified Customer
              </Badge>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Service History
            </TabsTrigger>
            <TabsTrigger value="quotes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Quotes & Estimates
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Account Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-blue-600" />
                    Active Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {serviceRequests.filter((req: any) => req.status === 'in_progress').length}
                  </div>
                  <p className="text-sm text-gray-600">Services in progress</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    Upcoming
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {serviceRequests.filter((req: any) => req.status === 'scheduled').length}
                  </div>
                  <p className="text-sm text-gray-600">Scheduled appointments</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    Pending Quotes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {quotes.filter((quote: any) => quote.status === 'pending').length}
                  </div>
                  <p className="text-sm text-gray-600">Awaiting approval</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest service requests and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceRequests.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Wrench className="h-8 w-8 mx-auto mb-3 text-gray-400" />
                      <p>No service history yet</p>
                      <p className="text-sm">Book your first service to get started!</p>
                    </div>
                  ) : (
                    serviceRequests.slice(0, 5).map((request: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(request.status)}
                          <div>
                            <h4 className="font-medium">{request.serviceType}</h4>
                            <p className="text-sm text-gray-600">{request.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={`${getStatusColor(request.status)} border-0`}>
                            {request.status.replace('_', ' ')}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Service History Tab */}
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Service History</CardTitle>
                <CardDescription>
                  Complete history of all your HVAC services with AfterHours HVAC
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceRequests.length === 0 ? (
                    <div className="text-center py-12">
                      <Wrench className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Service History</h3>
                      <p className="text-gray-600 mb-6">You haven't booked any services with us yet.</p>
                      <Button>Schedule Your First Service</Button>
                    </div>
                  ) : (
                    serviceRequests.map((request: any, index: number) => (
                      <Card key={index} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold">{request.serviceType}</h3>
                                <Badge className={`${getStatusColor(request.status)} border-0`}>
                                  {getStatusIcon(request.status)}
                                  {request.status.replace('_', ' ')}
                                </Badge>
                              </div>
                              
                              <p className="text-gray-600 mb-4">{request.description}</p>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Calendar className="h-4 w-4" />
                                  Requested: {new Date(request.createdAt).toLocaleDateString()}
                                </div>
                                {request.scheduledDate && (
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <Clock className="h-4 w-4" />
                                    Scheduled: {new Date(request.scheduledDate).toLocaleDateString()}
                                  </div>
                                )}
                                {request.totalCost && (
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <CreditCard className="h-4 w-4" />
                                    Cost: ${request.totalCost}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quotes Tab */}
          <TabsContent value="quotes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quotes & Estimates</CardTitle>
                <CardDescription>
                  View and manage your service quotes and estimates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quotes.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Quotes Yet</h3>
                      <p className="text-gray-600 mb-6">Request a quote for your HVAC needs.</p>
                      <Button>Request Quote</Button>
                    </div>
                  ) : (
                    quotes.map((quote: any, index: number) => (
                      <Card key={index} className="border">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-2">{quote.serviceType}</h3>
                              <p className="text-gray-600 mb-4">{quote.description}</p>
                              
                              <div className="flex gap-6 text-sm text-gray-600">
                                <span>Quote #{quote.id}</span>
                                <span>Expires: {new Date(quote.validUntil).toLocaleDateString()}</span>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600 mb-2">
                                ${quote.quoteAmount}
                              </div>
                              <Badge className={`${getStatusColor(quote.status)} border-0 mb-3`}>
                                {quote.status}
                              </Badge>
                              <div className="space-x-2">
                                <Button size="sm" variant="outline">View Details</Button>
                                {quote.status === 'pending' && (
                                  <Button size="sm">Accept Quote</Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Settings Tab */}
          <TabsContent value="account" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <p className="text-gray-900">{user?.firstName && user?.lastName ? 
                      `${user.firstName} ${user.lastName}` : user?.username}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">{user?.email}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">{user?.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Edit Information
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Membership Status</CardTitle>
                  <CardDescription>Your current membership benefits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Membership Type</label>
                    <div className="flex items-center gap-2">
                      {user?.hasProAccess ? (
                        <>
                          <Star className="h-4 w-4 text-amber-600" />
                          <p className="text-gray-900 font-medium">Pro Member</p>
                        </>
                      ) : (
                        <>
                          <User className="h-4 w-4 text-gray-400" />
                          <p className="text-gray-900">Standard Member</p>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {user?.hasProAccess ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <h4 className="font-medium text-amber-800 mb-2">Pro Benefits Active</h4>
                      <ul className="text-sm text-amber-700 space-y-1">
                        <li>• Priority scheduling</li>
                        <li>• Advanced diagnostic tools</li>
                        <li>• Detailed cost calculators</li>
                        <li>• Extended warranties</li>
                      </ul>
                    </div>
                  ) : (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-800 mb-2">Upgrade to Pro</h4>
                      <p className="text-sm text-blue-700 mb-3">
                        Get access to advanced tools and priority support for just $49/month.
                      </p>
                      <Button size="sm" className="w-full">
                        Upgrade Now
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle>24/7 Emergency Service</CardTitle>
                <CardDescription>Need immediate HVAC assistance?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Phone className="h-6 w-6 text-red-600" />
                    <div>
                      <h3 className="font-semibold text-red-800">Emergency Hotline</h3>
                      <p className="text-red-700 text-2xl font-bold">(403) 613-6014</p>
                    </div>
                  </div>
                  <p className="text-red-700 text-sm mb-4">
                    Available 24/7 for heating, cooling, and ventilation emergencies throughout Calgary.
                  </p>
                  <Button variant="destructive" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Emergency Service
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerDashboard;