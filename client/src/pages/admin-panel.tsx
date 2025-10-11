import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Settings, 
  UserCheck,
  Briefcase,
  Download,
  Mail,
  Phone,
  Calendar,
  Search,
  Filter,
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  AlertTriangle,
  MapPin,
  FileDown,
  Shield,
  Siren
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import jsPDF from "jspdf";

interface JobApplication {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  coverLetter: string;
  resumeUrl?: string;
  status: 'pending' | 'reviewing' | 'interviewing' | 'hired' | 'rejected';
  appliedAt: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  userType: string;
  hasProAccess: boolean;
  createdAt: string;
  lastLogin: string;
}

interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  submittedAt: string;
  status: 'new' | 'contacted' | 'resolved';
}

interface ServiceBooking {
  id: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceAddress: string;
  serviceType: string;
  bookingDate: string;
  bookingTime: string;
  status: string;
  notes?: string;
  amount: string;
  paymentStatus: string;
  source: string;
  createdAt: string;
  updatedAt: string;
}

interface EmergencyRequest {
  id: number;
  customerId?: number;
  name: string;
  email?: string;
  phone: string;
  address: string;
  issueDescription: string;
  urgencyLevel: string;
  status: string;
  requestedAt: string;
  completedAt?: string;
  location?: string;
  priority?: string;
  assignedTo?: number;
  createdAt: string;
  updatedAt: string;
  emergencyType?: string;
  description?: string;
  severity?: string;
  assignedTechnician?: string;
  estimatedArrival?: string;
  totalCost?: string;
}

const AdminPanel = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("applications");
  const [applicationFilter, setApplicationFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: applications = [], isLoading: applicationsLoading } = useQuery({
    queryKey: ["/api/admin/job-applications"],
  });

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ["/api/admin/bookings"],
  });

  const { data: contacts = [], isLoading: contactsLoading } = useQuery({
    queryKey: ["/api/admin/contact-submissions"],
  });

  const { data: emergencyRequests = [], isLoading: emergencyRequestsLoading } = useQuery({
    queryKey: ["/api/admin/emergency-requests"],
  });

  const updateApplicationStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return await apiRequest("PATCH", `/api/admin/job-applications/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/job-applications"] });
      toast({
        title: "Application Updated",
        description: "Application status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update application status.",
        variant: "destructive",
      });
    },
  });

  const updateUserAccess = useMutation({
    mutationFn: async ({ userId, updates }: { userId: number; updates: any }) => {
      return await apiRequest("PATCH", `/api/admin/users/${userId}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "User Updated",
        description: "User access has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update user access.",
        variant: "destructive",
      });
    },
  });

  const updateEmergencyRequestStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return await apiRequest("PUT", `/api/admin/emergency-requests/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/emergency-requests"] });
      toast({
        title: "Request Updated",
        description: "Emergency request status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update emergency request status.",
        variant: "destructive",
      });
    },
  });

  const generateEmergencyRequestPDF = (request: EmergencyRequest) => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("AfterHours HVAC", 105, 20, { align: "center" });
    
    doc.setFontSize(16);
    doc.text("Emergency Service Request", 105, 30, { align: "center" });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Request ID: ${request.id}`, 20, 45);
    doc.text(`Date: ${new Date(request.createdAt).toLocaleString()}`, 20, 52);
    
    doc.setLineWidth(0.5);
    doc.line(20, 58, 190, 58);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Customer Information", 20, 68);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${request.name}`, 20, 76);
    doc.text(`Phone: ${request.phone}`, 20, 83);
    if (request.email) {
      doc.text(`Email: ${request.email}`, 20, 90);
    }
    doc.text(`Address: ${request.address}`, 20, request.email ? 97 : 90);
    
    const addressY = request.email ? 107 : 100;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Emergency Details", 20, addressY);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Urgency Level: ${request.urgencyLevel.toUpperCase()}`, 20, addressY + 8);
    doc.text(`Status: ${request.status.replace(/_/g, ' ').toUpperCase()}`, 20, addressY + 15);
    if (request.emergencyType) {
      doc.text(`Emergency Type: ${request.emergencyType}`, 20, addressY + 22);
    }
    
    const descY = request.emergencyType ? addressY + 32 : addressY + 25;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Issue Description", 20, descY);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const splitDescription = doc.splitTextToSize(request.issueDescription, 170);
    doc.text(splitDescription, 20, descY + 8);
    
    const descHeight = splitDescription.length * 5;
    const nextY = descY + descHeight + 15;
    
    if (request.assignedTechnician) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Assignment Information", 20, nextY);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Technician: ${request.assignedTechnician}`, 20, nextY + 8);
      if (request.estimatedArrival) {
        doc.text(`Estimated Arrival: ${new Date(request.estimatedArrival).toLocaleString()}`, 20, nextY + 15);
      }
    }
    
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text("AfterHours HVAC - 24/7 Emergency Service", 105, 280, { align: "center" });
    
    doc.save(`emergency-request-${request.id}.pdf`);
    
    toast({
      title: "PDF Downloaded",
      description: `Emergency request #${request.id} has been downloaded as PDF.`,
    });
  };

  const filteredApplications = applications.filter((app: JobApplication) => {
    const matchesFilter = applicationFilter === "all" || app.status === applicationFilter;
    const matchesSearch = 
      app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.position.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/20 text-amber-200 border-amber-500/30';
      case 'reviewing': return 'bg-blue-500/20 text-blue-200 border-blue-500/30';
      case 'interviewing': return 'bg-purple-500/20 text-purple-200 border-purple-500/30';
      case 'hired': return 'bg-green-500/20 text-green-200 border-green-500/30';
      case 'rejected': return 'bg-slate-500/20 text-slate-200 border-slate-500/30';
      case 'new': return 'bg-amber-500/20 text-amber-200 border-amber-500/30';
      case 'contacted': return 'bg-blue-500/20 text-blue-200 border-blue-500/30';
      case 'resolved': return 'bg-green-500/20 text-green-200 border-green-500/30';
      default: return 'bg-slate-500/20 text-slate-200 border-slate-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'reviewing': return <Eye className="h-4 w-4" />;
      case 'interviewing': return <MessageSquare className="h-4 w-4" />;
      case 'hired': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 py-8 relative overflow-hidden">
      {/* Animated background blur elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center bg-gradient-to-r from-amber-500/20 to-amber-600/20 backdrop-blur-sm border border-amber-500/30 rounded-full px-6 py-3 mb-6 shadow-lg shadow-amber-500/20">
            <Shield className="h-5 w-5 text-amber-400 mr-3" />
            <span className="text-amber-200 text-lg font-bold">Admin Panel</span>
          </div>
          <h1 className="text-5xl font-black text-white mb-4">System Administration</h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Manage job applications, user accounts, and system settings for AfterHours HVAC.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white/5 backdrop-blur-sm border border-white/10 p-1 rounded-xl">
            <TabsTrigger 
              value="applications" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-amber-500/30 text-blue-200 rounded-lg transition-all duration-300"
              data-testid="tab-applications"
            >
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Job Applications</span>
            </TabsTrigger>
            <TabsTrigger 
              value="bookings" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-amber-500/30 text-blue-200 rounded-lg transition-all duration-300"
              data-testid="tab-bookings"
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Consultations</span>
            </TabsTrigger>
            <TabsTrigger 
              value="emergency-requests" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-amber-500/30 text-blue-200 rounded-lg transition-all duration-300"
              data-testid="tab-emergency-requests"
            >
              <Siren className="h-4 w-4" />
              <span className="hidden sm:inline">Emergency Requests</span>
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-amber-500/30 text-blue-200 rounded-lg transition-all duration-300"
              data-testid="tab-users"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">User Management</span>
            </TabsTrigger>
            <TabsTrigger 
              value="contacts" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-amber-500/30 text-blue-200 rounded-lg transition-all duration-300"
              data-testid="tab-contacts"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Contact Forms</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-amber-500/30 text-blue-200 rounded-lg transition-all duration-300"
              data-testid="tab-settings"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">System Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Job Applications Tab */}
          <TabsContent value="applications" className="space-y-6" data-testid="tabcontent-applications">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white font-black text-2xl">
                  <Briefcase className="h-6 w-6 text-amber-400" />
                  Job Applications Management
                </CardTitle>
                <CardDescription className="text-blue-200">
                  Review and manage job applications from the careers page
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filters and Search */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 h-4 w-4" />
                      <Input
                        placeholder="Search applications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-blue-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50"
                        data-testid="input-search-applications"
                      />
                    </div>
                  </div>
                  <Select value={applicationFilter} onValueChange={setApplicationFilter}>
                    <SelectTrigger className="w-full lg:w-48 bg-white/5 backdrop-blur-sm border-white/20 text-white" data-testid="select-filter-applications">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/20">
                      <SelectItem value="all">All Applications</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewing">Under Review</SelectItem>
                      <SelectItem value="interviewing">Interviewing</SelectItem>
                      <SelectItem value="hired">Hired</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Applications List */}
                <div className="space-y-4">
                  {applicationsLoading ? (
                    <div className="text-center py-8 text-blue-200">Loading applications...</div>
                  ) : filteredApplications.length === 0 ? (
                    <div className="text-center py-8 text-blue-300">No applications found</div>
                  ) : (
                    filteredApplications.map((application: JobApplication) => (
                      <Card key={application.id} className="bg-white/5 backdrop-blur-sm border-l-4 border-l-amber-500 border-white/10 hover:bg-white/10 transition-all duration-300" data-testid={`card-application-${application.id}`}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-white" data-testid={`text-applicant-name-${application.id}`}>
                                  {application.firstName} {application.lastName}
                                </h3>
                                <Badge className={`flex items-center gap-1 border ${getStatusColor(application.status)}`} data-testid={`badge-status-${application.id}`}>
                                  {getStatusIcon(application.status)}
                                  {application.status}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center gap-2 text-sm text-blue-200" data-testid={`text-email-${application.id}`}>
                                  <Mail className="h-4 w-4 text-amber-400" />
                                  {application.email}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-blue-200" data-testid={`text-phone-${application.id}`}>
                                  <Phone className="h-4 w-4 text-amber-400" />
                                  {application.phone}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-blue-200" data-testid={`text-position-${application.id}`}>
                                  <Briefcase className="h-4 w-4 text-amber-400" />
                                  {application.position}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-blue-200" data-testid={`text-applied-date-${application.id}`}>
                                  <Calendar className="h-4 w-4 text-amber-400" />
                                  Applied: {new Date(application.appliedAt).toLocaleDateString()}
                                </div>
                              </div>

                              <div className="mb-4">
                                <h4 className="font-semibold text-white mb-2">Experience:</h4>
                                <p className="text-sm text-blue-200" data-testid={`text-experience-${application.id}`}>{application.experience}</p>
                              </div>

                              {application.coverLetter && (
                                <div className="mb-4">
                                  <h4 className="font-semibold text-white mb-2">Cover Letter:</h4>
                                  <p className="text-sm text-blue-200 bg-white/5 p-3 rounded-lg border border-white/10" data-testid={`text-cover-letter-${application.id}`}>
                                    {application.coverLetter}
                                  </p>
                                </div>
                              )}

                              <div className="flex gap-2">
                                {application.resumeUrl && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="bg-white/5 border-white/20 text-blue-200 hover:bg-white/10 hover:text-white"
                                    data-testid={`button-download-resume-${application.id}`}
                                  >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download Resume
                                  </Button>
                                )}
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => window.open(`mailto:${application.email}`, '_blank')}
                                  className="bg-white/5 border-white/20 text-blue-200 hover:bg-white/10 hover:text-white"
                                  data-testid={`button-email-candidate-${application.id}`}
                                >
                                  <Mail className="h-4 w-4 mr-2" />
                                  Email Candidate
                                </Button>
                              </div>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-blue-200 hover:text-white hover:bg-white/10"
                                  data-testid={`button-actions-${application.id}`}
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-slate-900 border-white/20">
                                <DropdownMenuItem
                                  onClick={() => updateApplicationStatus.mutate({ 
                                    id: application.id, 
                                    status: 'reviewing' 
                                  })}
                                  className="text-blue-200 hover:bg-white/10"
                                  data-testid={`menu-mark-reviewing-${application.id}`}
                                >
                                  Mark as Reviewing
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => updateApplicationStatus.mutate({ 
                                    id: application.id, 
                                    status: 'interviewing' 
                                  })}
                                  className="text-blue-200 hover:bg-white/10"
                                  data-testid={`menu-schedule-interview-${application.id}`}
                                >
                                  Schedule Interview
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => updateApplicationStatus.mutate({ 
                                    id: application.id, 
                                    status: 'hired' 
                                  })}
                                  className="text-green-200 hover:bg-white/10"
                                  data-testid={`menu-mark-hired-${application.id}`}
                                >
                                  Mark as Hired
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => updateApplicationStatus.mutate({ 
                                    id: application.id, 
                                    status: 'rejected' 
                                  })}
                                  className="text-red-200 hover:bg-white/10"
                                  data-testid={`menu-reject-${application.id}`}
                                >
                                  Reject Application
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Consultation Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6" data-testid="tabcontent-bookings">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white font-black text-2xl">
                  <Calendar className="h-6 w-6 text-amber-400" />
                  Consultation Bookings
                </CardTitle>
                <CardDescription className="text-blue-200">
                  Manage commercial and residential consultation requests from customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookingsLoading ? (
                    <div className="text-center py-8 text-blue-200">Loading consultation bookings...</div>
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-8 text-blue-300">No consultation bookings found</div>
                  ) : (
                    bookings.map((booking: ServiceBooking) => (
                      <Card key={booking.id} className="bg-white/5 backdrop-blur-sm border-l-4 border-l-amber-500 border-white/10 hover:bg-white/10 transition-all duration-300" data-testid={`card-booking-${booking.id}`}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-white" data-testid={`text-customer-name-${booking.id}`}>
                                  {booking.customerName}
                                </h3>
                                <Badge className={`flex items-center gap-1 border ${
                                  booking.serviceType === 'commercial_consultation' 
                                    ? 'bg-blue-500/20 text-blue-200 border-blue-500/30' 
                                    : 'bg-green-500/20 text-green-200 border-green-500/30'
                                }`} data-testid={`badge-service-type-${booking.id}`}>
                                  {booking.serviceType === 'commercial_consultation' ? 'Commercial' : 'Residential'}
                                </Badge>
                                <Badge className={`border ${getStatusColor(booking.status)}`} data-testid={`badge-booking-status-${booking.id}`}>
                                  {booking.status}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center gap-2 text-sm text-blue-200" data-testid={`text-customer-phone-${booking.id}`}>
                                  <Phone className="h-4 w-4 text-amber-400" />
                                  {booking.customerPhone}
                                </div>
                                {booking.customerEmail && (
                                  <div className="flex items-center gap-2 text-sm text-blue-200" data-testid={`text-customer-email-${booking.id}`}>
                                    <Mail className="h-4 w-4 text-amber-400" />
                                    {booking.customerEmail}
                                  </div>
                                )}
                                <div className="flex items-center gap-2 text-sm text-blue-200" data-testid={`text-booking-date-${booking.id}`}>
                                  <Calendar className="h-4 w-4 text-amber-400" />
                                  {new Date(booking.bookingDate).toLocaleDateString()} at {booking.bookingTime}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-blue-200" data-testid={`text-booking-amount-${booking.id}`}>
                                  <DollarSign className="h-4 w-4 text-amber-400" />
                                  ${booking.amount}
                                </div>
                              </div>

                              <div className="mb-4">
                                <h4 className="font-semibold text-white mb-2">Service Address:</h4>
                                <p className="text-sm text-blue-200" data-testid={`text-service-address-${booking.id}`}>{booking.serviceAddress}</p>
                              </div>

                              {booking.notes && (
                                <div className="mb-4">
                                  <h4 className="font-semibold text-white mb-2">Notes:</h4>
                                  <p className="text-sm text-blue-200 bg-white/5 p-3 rounded-lg border border-white/10" data-testid={`text-booking-notes-${booking.id}`}>
                                    {booking.notes}
                                  </p>
                                </div>
                              )}

                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => window.open(`tel:${booking.customerPhone}`, '_self')}
                                  className="bg-white/5 border-white/20 text-blue-200 hover:bg-white/10 hover:text-white"
                                  data-testid={`button-call-customer-${booking.id}`}
                                >
                                  <Phone className="h-4 w-4 mr-2" />
                                  Call Customer
                                </Button>
                                {booking.customerEmail && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => window.open(`mailto:${booking.customerEmail}`, '_blank')}
                                    className="bg-white/5 border-white/20 text-blue-200 hover:bg-white/10 hover:text-white"
                                    data-testid={`button-email-customer-${booking.id}`}
                                  >
                                    <Mail className="h-4 w-4 mr-2" />
                                    Email Customer
                                  </Button>
                                )}
                              </div>
                            </div>

                            <div className="ml-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-blue-200 hover:text-white hover:bg-white/10"
                                    data-testid={`button-booking-actions-${booking.id}`}
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-slate-900 border-white/20">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      console.log('Mark as confirmed:', booking.id);
                                    }}
                                    className="text-blue-200 hover:bg-white/10"
                                    data-testid={`menu-confirm-booking-${booking.id}`}
                                  >
                                    Mark as Confirmed
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      console.log('Mark as completed:', booking.id);
                                    }}
                                    className="text-green-200 hover:bg-white/10"
                                    data-testid={`menu-complete-booking-${booking.id}`}
                                  >
                                    Mark as Completed
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      console.log('Cancel booking:', booking.id);
                                    }}
                                    className="text-red-200 hover:bg-white/10"
                                    data-testid={`menu-cancel-booking-${booking.id}`}
                                  >
                                    Cancel Booking
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
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

          {/* Emergency Requests Tab */}
          <TabsContent value="emergency-requests" className="space-y-6" data-testid="tabcontent-emergency-requests">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white font-black text-2xl">
                  <Siren className="h-6 w-6 text-amber-400" />
                  Emergency Service Requests
                </CardTitle>
                <CardDescription className="text-blue-200">
                  Manage emergency HVAC service requests and dispatch technicians
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {emergencyRequestsLoading ? (
                    <div className="text-center py-8 text-blue-200">Loading emergency requests...</div>
                  ) : emergencyRequests.length === 0 ? (
                    <div className="text-center py-8 text-blue-300">No emergency requests found</div>
                  ) : (
                    emergencyRequests.map((request: EmergencyRequest) => (
                      <Card key={request.id} className="bg-white/5 backdrop-blur-sm border-l-4 border-l-red-500 border-white/10 hover:bg-white/10 transition-all duration-300" data-testid={`card-emergency-request-${request.id}`}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-white" data-testid={`text-request-customer-name-${request.id}`}>
                                  {request.name}
                                </h3>
                                <Badge 
                                  className={`flex items-center gap-1 border ${
                                    request.urgencyLevel === 'critical' 
                                      ? 'bg-red-500/30 text-red-200 border-red-500/50' 
                                      : request.urgencyLevel === 'high'
                                      ? 'bg-orange-500/30 text-orange-200 border-orange-500/50'
                                      : 'bg-amber-500/30 text-amber-200 border-amber-500/50'
                                  }`}
                                  data-testid={`badge-urgency-level-${request.id}`}
                                >
                                  <AlertTriangle className="h-3 w-3" />
                                  {request.urgencyLevel.toUpperCase()}
                                </Badge>
                                <Badge 
                                  className={`border ${getStatusColor(request.status)}`}
                                  data-testid={`badge-request-status-${request.id}`}
                                >
                                  {request.status.replace(/_/g, ' ').toUpperCase()}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center gap-2 text-sm text-blue-200" data-testid={`text-request-phone-${request.id}`}>
                                  <Phone className="h-4 w-4 text-amber-400" />
                                  {request.phone}
                                </div>
                                {request.email && (
                                  <div className="flex items-center gap-2 text-sm text-blue-200" data-testid={`text-request-email-${request.id}`}>
                                    <Mail className="h-4 w-4 text-amber-400" />
                                    {request.email}
                                  </div>
                                )}
                                <div className="flex items-center gap-2 text-sm text-blue-200" data-testid={`text-request-address-${request.id}`}>
                                  <MapPin className="h-4 w-4 text-amber-400" />
                                  {request.address}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-blue-200" data-testid={`text-request-timestamp-${request.id}`}>
                                  <Clock className="h-4 w-4 text-amber-400" />
                                  {new Date(request.createdAt).toLocaleString()}
                                </div>
                              </div>

                              {request.emergencyType && (
                                <div className="mb-3">
                                  <h4 className="font-semibold text-white mb-1 text-sm">Emergency Type:</h4>
                                  <p className="text-sm text-blue-200" data-testid={`text-emergency-type-${request.id}`}>
                                    {request.emergencyType}
                                  </p>
                                </div>
                              )}

                              <div className="mb-4">
                                <h4 className="font-semibold text-white mb-2">Issue Description:</h4>
                                <p className="text-sm text-blue-200 bg-white/5 p-3 rounded-lg border border-white/10" data-testid={`text-issue-description-${request.id}`}>
                                  {request.issueDescription}
                                </p>
                              </div>

                              {request.assignedTechnician && (
                                <div className="mb-3">
                                  <h4 className="font-semibold text-white mb-1 text-sm">Assigned Technician:</h4>
                                  <p className="text-sm text-green-200" data-testid={`text-assigned-tech-${request.id}`}>
                                    {request.assignedTechnician}
                                  </p>
                                </div>
                              )}

                              <div className="flex gap-2 flex-wrap">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => window.open(`tel:${request.phone}`, '_self')}
                                  className="bg-white/5 border-white/20 text-blue-200 hover:bg-white/10 hover:text-white"
                                  data-testid={`button-call-customer-${request.id}`}
                                >
                                  <Phone className="h-4 w-4 mr-2" />
                                  Call Customer
                                </Button>
                                {request.email && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => window.open(`mailto:${request.email}`, '_blank')}
                                    className="bg-white/5 border-white/20 text-blue-200 hover:bg-white/10 hover:text-white"
                                    data-testid={`button-email-customer-${request.id}`}
                                  >
                                    <Mail className="h-4 w-4 mr-2" />
                                    Email Customer
                                  </Button>
                                )}
                                <Button 
                                  variant="default" 
                                  size="sm"
                                  onClick={() => generateEmergencyRequestPDF(request)}
                                  className="bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/30"
                                  data-testid={`button-download-pdf-${request.id}`}
                                >
                                  <FileDown className="h-4 w-4 mr-2" />
                                  Download PDF
                                </Button>
                              </div>
                            </div>

                            <div className="flex flex-col gap-3">
                              <Select
                                value={request.status}
                                onValueChange={(newStatus) => {
                                  updateEmergencyRequestStatus.mutate({
                                    id: request.id,
                                    status: newStatus
                                  });
                                }}
                              >
                                <SelectTrigger 
                                  className="w-48 bg-white/5 backdrop-blur-sm border-white/20 text-white"
                                  data-testid={`select-status-${request.id}`}
                                >
                                  <SelectValue placeholder="Update Status" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-white/20">
                                  <SelectItem value="pending" data-testid={`option-pending-${request.id}`}>
                                    Pending
                                  </SelectItem>
                                  <SelectItem value="dispatched" data-testid={`option-dispatched-${request.id}`}>
                                    Dispatched
                                  </SelectItem>
                                  <SelectItem value="in_progress" data-testid={`option-in-progress-${request.id}`}>
                                    In Progress
                                  </SelectItem>
                                  <SelectItem value="completed" data-testid={`option-completed-${request.id}`}>
                                    Completed
                                  </SelectItem>
                                </SelectContent>
                              </Select>
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

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6" data-testid="tabcontent-users">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white font-black text-2xl">
                  <Users className="h-6 w-6 text-amber-400" />
                  User Account Management
                </CardTitle>
                <CardDescription className="text-blue-200">
                  Manage user accounts, roles, and Pro access permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {usersLoading ? (
                    <div className="text-center py-8 text-blue-200">Loading users...</div>
                  ) : (
                    users.map((user: User) => (
                      <Card key={user.id} className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300" data-testid={`card-user-${user.id}`}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-bold text-white" data-testid={`text-username-${user.id}`}>{user.username}</h3>
                              <p className="text-sm text-blue-200" data-testid={`text-user-email-${user.id}`}>{user.email}</p>
                              <div className="flex gap-2 mt-2">
                                <Badge 
                                  className={`border ${user.role === 'admin' ? 'bg-amber-500/20 text-amber-200 border-amber-500/30' : 'bg-blue-500/20 text-blue-200 border-blue-500/30'}`}
                                  data-testid={`badge-user-role-${user.id}`}
                                >
                                  {user.role}
                                </Badge>
                                {user.hasProAccess && (
                                  <Badge 
                                    className="bg-amber-500/20 text-amber-200 border border-amber-500/30"
                                    data-testid={`badge-pro-access-${user.id}`}
                                  >
                                    Pro Access
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateUserAccess.mutate({
                                  userId: user.id,
                                  updates: { hasProAccess: !user.hasProAccess }
                                })}
                                className="bg-white/5 border-white/20 text-blue-200 hover:bg-white/10 hover:text-white"
                                data-testid={`button-toggle-pro-${user.id}`}
                              >
                                {user.hasProAccess ? 'Remove Pro' : 'Grant Pro'}
                              </Button>
                              {user.role !== 'admin' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateUserAccess.mutate({
                                    userId: user.id,
                                    updates: { role: 'admin' }
                                  })}
                                  className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/30"
                                  data-testid={`button-make-admin-${user.id}`}
                                >
                                  Make Admin
                                </Button>
                              )}
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

          {/* Contact Forms Tab */}
          <TabsContent value="contacts" className="space-y-6" data-testid="tabcontent-contacts">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white font-black text-2xl">
                  <MessageSquare className="h-6 w-6 text-amber-400" />
                  Contact Form Submissions
                </CardTitle>
                <CardDescription className="text-blue-200">
                  View and respond to customer inquiries from contact forms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contactsLoading ? (
                    <div className="text-center py-8 text-blue-200">Loading contact submissions...</div>
                  ) : contacts.length === 0 ? (
                    <div className="text-center py-8 text-blue-300">No contact submissions found</div>
                  ) : (
                    contacts.map((contact: ContactSubmission) => (
                      <Card key={contact.id} className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300" data-testid={`card-contact-${contact.id}`}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-bold text-white" data-testid={`text-contact-name-${contact.id}`}>{contact.name}</h3>
                              <div className="flex gap-4 text-sm text-blue-200 mb-3">
                                <span data-testid={`text-contact-email-${contact.id}`}>{contact.email}</span>
                                <span data-testid={`text-contact-phone-${contact.id}`}>{contact.phone}</span>
                              </div>
                              <p className="text-sm text-blue-200" data-testid={`text-contact-message-${contact.id}`}>{contact.message}</p>
                              <p className="text-xs text-blue-300 mt-2" data-testid={`text-contact-submitted-${contact.id}`}>
                                Submitted: {new Date(contact.submittedAt).toLocaleString()}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`mailto:${contact.email}`, '_blank')}
                              className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/30"
                              data-testid={`button-reply-contact-${contact.id}`}
                            >
                              <Mail className="h-4 w-4 mr-2" />
                              Reply
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings Tab */}
          <TabsContent value="settings" className="space-y-6" data-testid="tabcontent-settings">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white font-black text-2xl">
                  <Settings className="h-6 w-6 text-amber-400" />
                  System Configuration
                </CardTitle>
                <CardDescription className="text-blue-200">
                  Manage system-wide settings and configurations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                    <CardHeader>
                      <CardTitle className="text-lg text-white font-bold">Pro Access Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-blue-200">Monthly Pro Price</label>
                          <Input 
                            value="$49" 
                            readOnly 
                            className="bg-white/5 backdrop-blur-sm border-white/20 text-white mt-1"
                            data-testid="input-monthly-price"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-blue-200">Annual Pro Price</label>
                          <Input 
                            value="$499" 
                            readOnly 
                            className="bg-white/5 backdrop-blur-sm border-white/20 text-white mt-1"
                            data-testid="input-annual-price"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-blue-200">Lifetime Pro Price</label>
                          <Input 
                            value="$1500" 
                            readOnly 
                            className="bg-white/5 backdrop-blur-sm border-white/20 text-white mt-1"
                            data-testid="input-lifetime-price"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                    <CardHeader>
                      <CardTitle className="text-lg text-white font-bold">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-blue-200">Primary Phone</label>
                          <Input 
                            value="(403) 613-6014" 
                            readOnly 
                            className="bg-white/5 backdrop-blur-sm border-white/20 text-white mt-1"
                            data-testid="input-primary-phone"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-blue-200">Primary Email</label>
                          <Input 
                            value="Jordan@Afterhourshvac.ca" 
                            readOnly 
                            className="bg-white/5 backdrop-blur-sm border-white/20 text-white mt-1"
                            data-testid="input-primary-email"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-blue-200">Service Area</label>
                          <Input 
                            value="Calgary & surrounding areas" 
                            readOnly 
                            className="bg-white/5 backdrop-blur-sm border-white/20 text-white mt-1"
                            data-testid="input-service-area"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
