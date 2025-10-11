import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  AlertTriangle, 
  CheckCircle, 
  Truck, 
  Search,
  RefreshCcw,
  Zap,
  Wrench,
  Home
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface EmergencyRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  emergencyType: string;
  description: string;
  severity: string;
  status: string;
  assignedTechnician?: string;
  estimatedArrival?: string;
  completedAt?: string;
  totalCost?: string;
  createdAt: string;
}

const emergencyTypeIcons = {
  no_heat: <Home className="w-5 h-5" />,
  no_cooling: <Zap className="w-5 h-5" />,
  gas_leak: <AlertTriangle className="w-5 h-5" />,
  electrical: <Zap className="w-5 h-5" />,
  water_leak: <AlertTriangle className="w-5 h-5" />,
  hvac_failure: <Wrench className="w-5 h-5" />,
  other: <AlertTriangle className="w-5 h-5" />
};

const statusColors = {
  received: "bg-yellow-100 text-yellow-800",
  dispatched: "bg-blue-100 text-blue-800", 
  in_progress: "bg-orange-100 text-orange-800",
  completed: "bg-green-100 text-green-800"
};

const severityColors = {
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800"
};

export default function EmergencyTracker() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<EmergencyRequest | null>(null);
  const queryClient = useQueryClient();

  // Fetch all emergency requests for admin users or user's own requests
  const { data: emergencyRequests, isLoading, refetch } = useQuery({
    queryKey: ['/api/emergency-requests'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/emergency-requests');
      return await response.json();
    },
    refetchInterval: 30000 // Auto-refresh every 30 seconds
  });

  // WebSocket connection for real-time updates
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const socket = new WebSocket(wsUrl);
    
    socket.onopen = () => {
      console.log('Emergency tracker WebSocket connected');
    };
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'emergency_update') {
        // Invalidate and refetch emergency requests when updates come in
        queryClient.invalidateQueries({ queryKey: ['/api/emergency-requests'] });
        
        // If this is an update for the currently selected request, update it
        if (selectedRequest && data.requestId === selectedRequest.id) {
          setSelectedRequest(prev => prev ? { ...prev, ...data.updates } : null);
        }
      }
    };
    
    socket.onclose = () => {
      console.log('Emergency tracker WebSocket disconnected');
    };
    
    return () => {
      socket.close();
    };
  }, [queryClient, selectedRequest]);

  // Search emergency requests by phone, email, or ID
  const searchMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await apiRequest('GET', `/api/emergency-requests/search?q=${encodeURIComponent(query)}`);
      return await response.json();
    },
    onSuccess: (data) => {
      if (data.length === 1) {
        setSelectedRequest(data[0]);
      }
    }
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchMutation.mutate(searchQuery);
    }
  };

  const filteredRequests = emergencyRequests?.filter((request: EmergencyRequest) =>
    request.phone.includes(searchQuery) ||
    request.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.id.toString().includes(searchQuery)
  ) || [];

  const formatEstimatedArrival = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusMessage = (request: EmergencyRequest) => {
    switch (request.status) {
      case 'received':
        return 'Your emergency request has been received and is being processed.';
      case 'dispatched':
        return `A technician has been dispatched and will arrive at approximately ${request.estimatedArrival ? formatEstimatedArrival(request.estimatedArrival) : 'TBD'}.`;
      case 'in_progress':
        return 'Our technician is currently working on your emergency repair.';
      case 'completed':
        return 'Your emergency service has been completed successfully.';
      default:
        return 'Status update pending...';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Helmet>
        <title>Emergency Service Tracker | AfterHours HVAC Solutions</title>
        <meta name="description" content="Track your emergency HVAC service request in real-time. Get live updates on technician dispatch, arrival times, and service completion." />
      </Helmet>

      <div className="hvac-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Emergency Service Tracker</h1>
          <p className="text-lg text-gray-600">Track your emergency service request in real-time</p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Find Your Service Request
            </CardTitle>
            <CardDescription>
              Search by phone number, email, or request ID
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Enter phone number, email, or request ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={searchMutation.isPending}>
                {searchMutation.isPending ? (
                  <RefreshCcw className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Search
              </Button>
              <Button variant="outline" onClick={() => refetch()}>
                <RefreshCcw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Request List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Recent Requests</CardTitle>
                <CardDescription>
                  {isLoading ? 'Loading...' : `${filteredRequests.length} requests found`}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {filteredRequests.map((request: EmergencyRequest) => (
                    <div
                      key={request.id}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedRequest?.id === request.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                      onClick={() => setSelectedRequest(request)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {emergencyTypeIcons[request.emergencyType as keyof typeof emergencyTypeIcons]}
                          <span className="font-medium">#{request.id}</span>
                        </div>
                        <Badge className={statusColors[request.status as keyof typeof statusColors]}>
                          {request.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{request.name}</p>
                      <p className="text-xs text-gray-500">{request.phone}</p>
                    </div>
                  ))}
                  {filteredRequests.length === 0 && !isLoading && (
                    <div className="p-8 text-center text-gray-500">
                      <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No emergency requests found</p>
                      <p className="text-sm">Try searching with a different term</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Tracking */}
          <div className="lg:col-span-2">
            {selectedRequest ? (
              <div className="space-y-6">
                {/* Status Overview */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        Emergency Request #{selectedRequest.id}
                        <Badge className={severityColors[selectedRequest.severity as keyof typeof severityColors]}>
                          {selectedRequest.severity} priority
                        </Badge>
                      </CardTitle>
                      <Badge className={statusColors[selectedRequest.status as keyof typeof statusColors]} variant="outline">
                        {selectedRequest.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        {getStatusMessage(selectedRequest)}
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Name</p>
                        <p className="font-medium">{selectedRequest.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <p className="font-medium">{selectedRequest.phone}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm font-medium text-gray-500">Address</p>
                        <p className="font-medium flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {selectedRequest.address}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Service Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="w-5 h-5" />
                      Service Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Emergency Type</p>
                      <p className="font-medium flex items-center gap-2">
                        {emergencyTypeIcons[selectedRequest.emergencyType as keyof typeof emergencyTypeIcons]}
                        {selectedRequest.emergencyType.replace('_', ' ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Description</p>
                      <p className="text-gray-700">{selectedRequest.description}</p>
                    </div>
                    {selectedRequest.assignedTechnician && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Assigned Technician</p>
                        <p className="font-medium">{selectedRequest.assignedTechnician}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Service Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 pb-4">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Request Received</p>
                          <p className="text-sm text-gray-500">
                            {new Date(selectedRequest.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {selectedRequest.status !== 'received' && (
                        <div className="flex items-center gap-4 pb-4">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Truck className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">Technician Dispatched</p>
                            {selectedRequest.estimatedArrival && (
                              <p className="text-sm text-gray-500">
                                ETA: {formatEstimatedArrival(selectedRequest.estimatedArrival)}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {selectedRequest.status === 'in_progress' && (
                        <div className="flex items-center gap-4 pb-4">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                            <Wrench className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-medium">Service In Progress</p>
                            <p className="text-sm text-gray-500">
                              Technician is working on your emergency
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedRequest.status === 'completed' && (
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Service Completed</p>
                            <p className="text-sm text-gray-500">
                              {selectedRequest.completedAt && new Date(selectedRequest.completedAt).toLocaleString()}
                            </p>
                            {selectedRequest.totalCost && (
                              <p className="text-sm font-medium text-green-600">
                                Total Cost: ${selectedRequest.totalCost}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Emergency Contact */}
                <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Phone className="h-8 w-8 mx-auto mb-3" />
                      <h3 className="text-lg font-bold mb-2">Need Immediate Assistance?</h3>
                      <p className="mb-4 opacity-90">Our emergency team is available 24/7</p>
                      <Button 
                        variant="secondary" 
                        className="bg-white text-gray-900 hover:bg-gray-100"
                        onClick={() => window.location.href = 'tel:(403)613-6014'}
                      >
                        Call (403) 613-6014
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <CardContent className="text-center">
                  <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Emergency Request</h3>
                  <p className="text-gray-600">
                    Search for your emergency service request or select one from the list to view real-time tracking
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}