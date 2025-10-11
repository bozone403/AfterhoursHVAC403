import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Circle, 
  User, 
  Wrench, 
  DollarSign,
  MessageSquare,
  Navigation,
  Calendar
} from "lucide-react";

interface ServiceRequest {
  id: number;
  requestNumber: string;
  customerName: string;
  serviceType: string;
  status: string;
  currentStage: string;
  address: string;
  scheduledDate: string;
  assignedTechnician: number;
  createdAt: string;
}

interface ServiceStage {
  stage: string;
  status: string;
  startedAt?: string;
  completedAt?: string;
  estimatedDuration?: number;
}

interface ServiceUpdate {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  updateType: string;
}

export default function ServiceTracking() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

  // Mock data for demonstration
  const mockServiceRequests: ServiceRequest[] = [
    {
      id: 1,
      requestNumber: "SR-2024-001",
      customerName: "John Smith",
      serviceType: "Furnace Installation",
      status: "in_progress",
      currentStage: "service",
      address: "123 Main St, Calgary, AB",
      scheduledDate: "2024-06-07T10:00:00Z",
      assignedTechnician: 1,
      createdAt: "2024-06-06T08:00:00Z"
    },
    {
      id: 2,
      requestNumber: "SR-2024-002",
      customerName: "Sarah Johnson",
      serviceType: "AC Repair",
      status: "scheduled",
      currentStage: "scheduled",
      address: "456 Oak Ave, Lethbridge, AB",
      scheduledDate: "2024-06-08T14:00:00Z",
      assignedTechnician: 2,
      createdAt: "2024-06-07T09:15:00Z"
    },
    {
      id: 3,
      requestNumber: "SR-2024-003",
      customerName: "Mike Wilson",
      serviceType: "Emergency Heating",
      status: "completed",
      currentStage: "completion",
      address: "789 Pine St, Coaldale, AB",
      scheduledDate: "2024-06-06T16:00:00Z",
      assignedTechnician: 1,
      createdAt: "2024-06-06T14:30:00Z"
    }
  ];

  const mockStages: ServiceStage[] = [
    { stage: "contact", status: "completed", startedAt: "2024-06-06T08:00:00Z", completedAt: "2024-06-06T08:15:00Z" },
    { stage: "quote", status: "completed", startedAt: "2024-06-06T08:15:00Z", completedAt: "2024-06-06T10:30:00Z" },
    { stage: "scheduled", status: "completed", startedAt: "2024-06-06T10:30:00Z", completedAt: "2024-06-07T09:00:00Z" },
    { stage: "dispatch", status: "completed", startedAt: "2024-06-07T09:00:00Z", completedAt: "2024-06-07T09:45:00Z" },
    { stage: "service", status: "in_progress", startedAt: "2024-06-07T10:00:00Z", estimatedDuration: 180 },
    { stage: "completion", status: "pending" }
  ];

  const mockUpdates: ServiceUpdate[] = [
    {
      id: 1,
      title: "Technician Dispatched",
      message: "Our technician Jordan is on the way to your location. Estimated arrival: 10:00 AM",
      createdAt: "2024-06-07T09:00:00Z",
      updateType: "status_change"
    },
    {
      id: 2,
      title: "Service Started",
      message: "Installation has begun. Estimated completion time: 1:00 PM",
      createdAt: "2024-06-07T10:00:00Z",
      updateType: "technician_update"
    }
  ];

  const getStageIcon = (stage: string, status: string) => {
    if (status === "completed") {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    } else if (status === "in_progress") {
      return <Circle className="h-5 w-5 text-orange-500 animate-pulse" />;
    } else {
      return <Circle className="h-5 w-5 text-gray-300" />;
    }
  };

  const getStageLabel = (stage: string) => {
    const labels: Record<string, string> = {
      contact: "Initial Contact",
      quote: "Quote Provided",
      scheduled: "Appointment Scheduled",
      dispatch: "Technician Dispatched",
      service: "Service in Progress",
      completion: "Service Complete"
    };
    return labels[stage] || stage;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-orange-100 text-orange-800";
      case "scheduled": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredRequests = mockServiceRequests.filter(request =>
    request.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Navigation className="h-8 w-8 text-blue-600" />
            <MapPin className="h-8 w-8 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Service Journey Tracking</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your HVAC service request in real-time from initial contact to completion
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Search and Service List */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-blue-600" />
                  Track Your Service
                </CardTitle>
                <CardDescription>
                  Enter your service request number or name
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="search">Service Request # or Name</Label>
                    <Input
                      id="search"
                      type="text"
                      placeholder="SR-2024-001 or John Smith"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Requests List */}
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <Card 
                  key={request.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedRequest?.id === request.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedRequest(request)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-blue-600">{request.requestNumber}</span>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {request.customerName}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Wrench className="h-4 w-4" />
                          {request.serviceType}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Journey Map and Details */}
          <div className="lg:col-span-2 space-y-6">
            {selectedRequest ? (
              <>
                {/* Service Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{selectedRequest.requestNumber}</span>
                      <Badge className={getStatusColor(selectedRequest.status)}>
                        {selectedRequest.status.replace('_', ' ')}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {selectedRequest.serviceType} for {selectedRequest.customerName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{selectedRequest.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>Scheduled: {new Date(selectedRequest.scheduledDate).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-gray-500" />
                          <span>Technician: Jordan (ID: {selectedRequest.assignedTechnician})</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>(403) 613-6014</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Journey Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Navigation className="h-5 w-5 text-blue-600" />
                      Service Journey
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {mockStages.map((stage, index) => (
                        <div key={stage.stage} className="flex items-start gap-4">
                          <div className="flex flex-col items-center">
                            {getStageIcon(stage.stage, stage.status)}
                            {index < mockStages.length - 1 && (
                              <div className={`w-0.5 h-16 mt-2 ${
                                stage.status === "completed" ? "bg-green-300" : "bg-gray-200"
                              }`} />
                            )}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{getStageLabel(stage.stage)}</h4>
                              <Badge variant="outline" className="text-xs">
                                {stage.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            {stage.completedAt && (
                              <p className="text-sm text-gray-600">
                                Completed: {new Date(stage.completedAt).toLocaleString()}
                              </p>
                            )}
                            {stage.status === "in_progress" && (
                              <p className="text-sm text-orange-600">
                                In progress • Est. {stage.estimatedDuration} minutes
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Live Updates */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-orange-600" />
                      Live Updates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockUpdates.map((update) => (
                        <div key={update.id} className="border-l-4 border-blue-500 pl-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{update.title}</h4>
                            <span className="text-xs text-gray-500">
                              {new Date(update.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{update.message}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Emergency Contact */}
                <Card className="bg-gradient-to-r from-orange-500 to-blue-600 text-white">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Phone className="h-8 w-8 mx-auto mb-3" />
                      <h3 className="text-lg font-bold mb-2">Need Immediate Assistance?</h3>
                      <p className="mb-4 opacity-90">Our team is available 24/7 for emergencies</p>
                      <Button variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100">
                        Call (403) 613-6014
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <CardContent className="text-center">
                  <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Service Request</h3>
                  <p className="text-gray-600">
                    Search for your service request or select one from the list to view real-time tracking
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