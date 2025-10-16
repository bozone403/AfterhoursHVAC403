import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Users, 
  UserPlus, 
  Settings, 
  Shield, 
  AlertTriangle, 
  Eye, 
  Edit, 
  Trash2, 
  RefreshCw, 
  Lock, 
  Unlock, 
  FileText, 
  Calendar, 
  DollarSign, 
  Activity, 
  UsersRound, 
  BookOpen, 
  Plus,
  Search,
  Filter,
  MoreVertical,
  CheckCircle, 
  XCircle, 
  Clock,
  Ban,
  Download,
  Upload,
  Mail,
  Building,
  Phone
} from "lucide-react";
import { Link } from "wouter";

interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: string;
  userType: string;
  hasProAccess: boolean;
  isAdmin: boolean;
  accountLocked?: boolean;
  createdAt: string;
  lastLogin?: string;
  lockedAt?: string;
  lockReason?: string;
}

interface JobApplication {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  coverLetter?: string;
  status: string;
  appliedAt: string;
  yearsExperience?: string;
  education?: string;
  certifications?: string;
  availability?: string;
  salaryExpectation?: string;
  references?: string;
}

interface TeamMember {
  id: number;
  name: string;
  title: string;
  bio: string;
  imageUrl: string;
  displayOrder: number;
  active: boolean;
  createdAt: string;
}

interface CreateUserForm {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  userType: string;
  hasProAccess: boolean;
  isAdmin: boolean;
}

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  proUsers: number;
  adminUsers: number;
  pendingApplications: number;
  totalRevenue: number;
}

export default function AdminDashboardEnhanced() {
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [createUserForm, setCreateUserForm] = useState<CreateUserForm>({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: "customer",
    userType: "customer",
    hasProAccess: false,
    isAdmin: false
  });
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [newPassword, setNewPassword] = useState("");

  // Fetch users
  const { data: users = [], isLoading: usersLoading, refetch: refetchUsers } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    enabled: true
  });

  // Fetch job applications
  const { data: applications = [], isLoading: applicationsLoading, refetch: refetchApplications } = useQuery<JobApplication[]>({
    queryKey: ["/api/admin/job-applications"],
    enabled: true
  });

  // Fetch service bookings
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/bookings"],
    enabled: true
  });

  // Fetch contact messages
  const { data: contacts = [], isLoading: contactsLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/contacts"],
    enabled: true
  });

  // Fetch emergency requests
  const { data: emergencyRequests = [], isLoading: emergencyLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/emergency-requests"],
    enabled: true
  });

  // Fetch forum posts
  const { data: forumPosts = [], isLoading: forumLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/forum-posts"],
    enabled: true
  });

  // Fetch team members
  const { data: teamMembers = [], isLoading: teamLoading, refetch: refetchTeam } = useQuery<TeamMember[]>({
    queryKey: ["/api/team"],
    enabled: true
  });

  // Fetch blog posts
  const { data: blogPosts = [], isLoading: blogLoading } = useQuery<any[]>({
    queryKey: ["/api/blog/posts"],
    enabled: true
  });

  // Fetch corporate inquiries
  const { data: corporateInquiries = [], isLoading: corporateLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/corporate-inquiries"],
    enabled: true
  });

  // Fetch service callouts
  const { data: serviceCallouts = [], isLoading: calloutsLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/service-callouts"],
    enabled: true
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: CreateUserForm) => {
      const res = await apiRequest("POST", "/api/admin/users", userData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User created successfully"
      });
      setShowCreateDialog(false);
      setCreateUserForm({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: "",
        role: "customer",
        userType: "customer",
        hasProAccess: false,
        isAdmin: false
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive"
      });
    }
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, ...userData }: Partial<User> & { id: number }) => {
      const res = await apiRequest("PUT", `/api/admin/users/${id}`, userData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User updated successfully"
      });
      setShowEditDialog(false);
      setEditingUser(null);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive"
      });
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await apiRequest("DELETE", `/api/admin/users/${userId}`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User deleted successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive"
      });
    }
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async ({ userId, newPassword }: { userId: number; newPassword: string }) => {
      const res = await apiRequest("POST", `/api/admin/users/${userId}/reset-password`, { newPassword });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Password reset successfully"
      });
      setNewPassword("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reset password",
        variant: "destructive"
      });
    }
  });

  // Update application status mutation
  const updateApplicationMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: number; status: string; notes?: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/job-applications/${id}`, { status, notes });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Application status updated successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/job-applications"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update application",
        variant: "destructive"
      });
    }
  });

  const handleCreateUser = () => {
    if (!createUserForm.username || !createUserForm.email || !createUserForm.password) {
      toast({
        title: "Error",
        description: "Username, email, and password are required",
        variant: "destructive"
      });
      return;
    }
    createUserMutation.mutate(createUserForm);
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;
    updateUserMutation.mutate(editingUser);
  };

  const handleDeleteUser = (userId: number) => {
    deleteUserMutation.mutate(userId);
  };

  const handleResetPassword = (userId: number) => {
    if (!newPassword || newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }
    resetPasswordMutation.mutate({ userId, newPassword });
  };

  const handleToggleUserLock = (user: User) => {
    updateUserMutation.mutate({
      id: user.id,
      accountLocked: !user.accountLocked
    });
  };

  // Update emergency request mutation
  const updateEmergencyRequestMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return await apiRequest("PUT", `/api/admin/emergency-requests/${id}`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Request Updated",
        description: "Emergency request status updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/emergency-requests"] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update emergency request.",
        variant: "destructive",
      });
    },
  });

  // Emergency request update handler
  const updateEmergencyRequest = (id: number, status: string) => {
    updateEmergencyRequestMutation.mutate({ id, status });
  };

  // Application status update handler
  const updateApplicationStatus = (id: number, status: string) => {
    updateApplicationMutation.mutate({ id, status });
  };

  // Service booking update mutation
  const updateServiceBookingMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return await apiRequest("PUT", `/api/admin/bookings/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Booking Updated",
        description: "Service booking has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/bookings"] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update service booking.",
        variant: "destructive",
      });
    },
  });

  // Delete service booking mutation
  const deleteServiceBookingMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/admin/bookings/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Booking Deleted",
        description: "Service booking has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/bookings"] });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete service booking.",
        variant: "destructive",
      });
    },
  });

  // Send invoice mutation
  const sendInvoiceMutation = useMutation({
    mutationFn: async ({ id, amount, description }: { id: number; amount: number; description?: string }) => {
      return await apiRequest("POST", `/api/admin/bookings/${id}/send-invoice`, { amount, description });
    },
    onSuccess: () => {
      toast({
        title: "Invoice Sent",
        description: "Invoice has been sent to the customer successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/bookings"] });
    },
    onError: (error: any) => {
      toast({
        title: "Invoice Failed",
        description: error.message || "Failed to send invoice.",
        variant: "destructive",
      });
    },
  });

  // Emergency invoice mutation
  const sendEmergencyInvoiceMutation = useMutation({
    mutationFn: async ({ id, amount, description }: { id: number; amount: number; description?: string }) => {
      return await apiRequest("POST", `/api/admin/emergency-requests/${id}/send-invoice`, { amount, description });
    },
    onSuccess: () => {
      toast({
        title: "Emergency Invoice Sent",
        description: "Emergency service invoice has been sent successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/emergency-requests"] });
    },
    onError: (error: any) => {
      toast({
        title: "Invoice Failed",
        description: error.message || "Failed to send emergency invoice.",
        variant: "destructive",
      });
    },
  });

  // Service booking handlers
  const updateServiceBooking = (id: number, data: any) => {
    updateServiceBookingMutation.mutate({ id, data });
  };

  const deleteServiceBooking = (id: number) => {
    if (confirm("Are you sure you want to delete this service booking?")) {
      deleteServiceBookingMutation.mutate(id);
    }
  };

  const sendBookingInvoice = (id: number) => {
    const amount = prompt("Enter invoice amount (CAD):");
    if (amount && !isNaN(Number(amount))) {
      sendInvoiceMutation.mutate({ id, amount: Number(amount) });
    }
  };

  const sendEmergencyInvoice = (id: number) => {
    const amount = prompt("Enter invoice amount (CAD):");
    if (amount && !isNaN(Number(amount))) {
      sendEmergencyInvoiceMutation.mutate({ id, amount: Number(amount) });
    }
  };

  // Forum moderation mutations
  const updateForumPostMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return await apiRequest("PUT", `/api/admin/forum-posts/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Post Updated",
        description: "Forum post has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/forum-posts"] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update forum post.",
        variant: "destructive",
      });
    },
  });

  const deleteForumPostMutation = useMutation({
    mutationFn: async (postId: number) => {
      return await apiRequest("DELETE", `/api/admin/forum-posts/${postId}`);
    },
    onSuccess: () => {
      toast({
        title: "Post Deleted",
        description: "Forum post has been permanently deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/forum-posts"] });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete forum post.",
        variant: "destructive",
      });
    },
  });

  // Forum moderation handlers
  const approveForumPost = (postId: number) => {
    updateForumPostMutation.mutate({ 
      id: postId, 
      data: { isApproved: true, isVisible: true } 
    });
  };

  const rejectForumPost = (postId: number) => {
    updateForumPostMutation.mutate({ 
      id: postId, 
      data: { isApproved: false, isVisible: false } 
    });
  };

  const deleteForumPost = (postId: number) => {
    if (confirm("Are you sure you want to delete this forum post? This action cannot be undone.")) {
      deleteForumPostMutation.mutate(postId);
    }
  };

  const toggleForumPostVisibility = (postId: number, isVisible: boolean) => {
    updateForumPostMutation.mutate({ 
      id: postId, 
      data: { isVisible: !isVisible } 
    });
  };

  // Blog post mutations
  const [showBlogDialog, setShowBlogDialog] = useState(false);
  const [blogForm, setBlogForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    category: '',
    published: true
  });

  const createBlogMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/admin/blog/posts", data);
    },
    onSuccess: () => {
      toast({
        title: "Blog Post Created",
        description: "New blog post has been published successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts"] });
      setShowBlogDialog(false);
      setBlogForm({
        title: '',
        content: '',
        excerpt: '',
        author: '',
        category: '',
        published: true
      });
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create blog post.",
        variant: "destructive",
      });
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/admin/blog/posts/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Blog Post Deleted",
        description: "Blog post has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts"] });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete blog post.",
        variant: "destructive",
      });
    },
  });

  const handleCreateBlog = () => {
    if (!blogForm.title || !blogForm.content) {
      toast({
        title: "Validation Error",
        description: "Title and content are required fields.",
        variant: "destructive",
      });
      return;
    }
    createBlogMutation.mutate(blogForm);
  };

  const deleteBlogPost = (id: number) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      deleteBlogMutation.mutate(id);
    }
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'admin': return 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg';
      case 'pro': return 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg';
      case 'corporate': return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg';
      case 'reviewing': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg';
      case 'approved': return 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg';
      case 'rejected': return 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg';
      case 'hired': return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg';
    }
  };

  // Calculate system statistics
  const systemStats: SystemStats = {
    totalUsers: Array.isArray(users) ? users.length : 0,
    activeUsers: Array.isArray(users) ? users.filter((u: User) => !u.accountLocked).length : 0,
    proUsers: Array.isArray(users) ? users.filter((u: User) => u.hasProAccess).length : 0,
    adminUsers: Array.isArray(users) ? users.filter((u: User) => u.isAdmin).length : 0,
    pendingApplications: Array.isArray(applications) ? applications.filter((a: JobApplication) => a.status === 'pending').length : 0,
    totalRevenue: Array.isArray(users) ? users.filter((u: User) => u.hasProAccess).length * 49 : 0 // Estimate based on pro users
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-orange-50">
      <div className="hvac-container space-y-8">
        <div className="hvac-card">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="hvac-heading-lg mb-4 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="hvac-text-lg text-gray-600">Comprehensive system management for AfterHours HVAC</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => refetchUsers()} className="hvac-button-primary">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh All
              </Button>
            </div>
          </div>
        </div>

        {/* System Statistics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <div className="stat-card">
            <Users className="h-8 w-8 text-blue-600 mb-4" />
            <div className="stat-number">{systemStats.totalUsers}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card">
            <Building className="h-8 w-8 text-purple-600 mb-4" />
            <div className="stat-number">{corporateInquiries.length}</div>
            <div className="stat-label">Corporate Inquiries</div>
          </div>
          <div className="stat-card">
            <Phone className="h-8 w-8 text-green-600 mb-4" />
            <div className="stat-number">{serviceCallouts.length}</div>
            <div className="stat-label">Service Callouts</div>
          </div>
          <div className="stat-card">
            <Activity className="h-8 w-8 text-green-600 mb-4" />
            <div className="stat-number">{systemStats.activeUsers}</div>
            <div className="stat-label">Active Users</div>
          </div>
          <div className="stat-card">
            <Shield className="h-8 w-8 text-purple-600 mb-4" />
            <div className="stat-number">{systemStats.proUsers}</div>
            <div className="stat-label">Pro Users</div>
          </div>
          <div className="stat-card">
            <Settings className="h-8 w-8 text-red-600 mb-4" />
            <div className="stat-number">{systemStats.adminUsers}</div>
            <div className="stat-label">Admin Users</div>
          </div>
          <div className="stat-card">
            <FileText className="h-8 w-8 text-orange-600 mb-4" />
            <div className="stat-number">{systemStats.pendingApplications}</div>
            <div className="stat-label">Pending Apps</div>
          </div>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="hvac-card p-2 bg-gradient-to-r from-blue-50 to-orange-50 flex-wrap">
            <TabsTrigger value="users" className="hvac-text-base px-6 py-3 rounded-xl font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white">User Management</TabsTrigger>
            <TabsTrigger value="team" className="hvac-text-base px-6 py-3 rounded-xl font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white">Team Members</TabsTrigger>
            <TabsTrigger value="blog" className="hvac-text-base px-6 py-3 rounded-xl font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white">Blog Posts</TabsTrigger>
            <TabsTrigger value="applications" className="hvac-text-base px-6 py-3 rounded-xl font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white">Job Applications</TabsTrigger>
            <TabsTrigger value="bookings" className="hvac-text-base px-6 py-3 rounded-xl font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white">Service Bookings</TabsTrigger>
            <TabsTrigger value="contacts" className="hvac-text-base px-6 py-3 rounded-xl font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white">Contact Messages</TabsTrigger>
            <TabsTrigger value="emergency" className="hvac-text-base px-6 py-3 rounded-xl font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white">Emergency Requests</TabsTrigger>
            <TabsTrigger value="corporate" className="hvac-text-base px-6 py-3 rounded-xl font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white">Corporate Inquiries</TabsTrigger>
            <TabsTrigger value="callouts" className="hvac-text-base px-6 py-3 rounded-xl font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white">Service Callouts</TabsTrigger>
            <TabsTrigger value="forum" className="hvac-text-base px-6 py-3 rounded-xl font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white">Forum Management</TabsTrigger>
          </TabsList>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="hvac-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="hvac-heading-md mb-2">User Management</h2>
                <p className="hvac-text-base text-gray-600">Create, edit, and manage user accounts</p>
              </div>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="hvac-button-primary">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create User
                  </Button>
                </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New User</DialogTitle>
                      <DialogDescription>
                        Create a new user account with specified permissions
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            value={createUserForm.username}
                            onChange={(e) => setCreateUserForm({ ...createUserForm, username: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={createUserForm.email}
                            onChange={(e) => setCreateUserForm({ ...createUserForm, email: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={createUserForm.password}
                          onChange={(e) => setCreateUserForm({ ...createUserForm, password: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={createUserForm.firstName}
                            onChange={(e) => setCreateUserForm({ ...createUserForm, firstName: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={createUserForm.lastName}
                            onChange={(e) => setCreateUserForm({ ...createUserForm, lastName: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={createUserForm.phone}
                          onChange={(e) => setCreateUserForm({ ...createUserForm, phone: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="role">Role</Label>
                          <Select value={createUserForm.role} onValueChange={(value) => setCreateUserForm({ ...createUserForm, role: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="customer">Customer</SelectItem>
                              <SelectItem value="technician">Technician</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="userType">User Type</Label>
                          <Select value={createUserForm.userType} onValueChange={(value) => setCreateUserForm({ ...createUserForm, userType: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="customer">Customer</SelectItem>
                              <SelectItem value="pro">Pro</SelectItem>
                              <SelectItem value="corporate">Corporate</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="hasProAccess"
                            checked={createUserForm.hasProAccess}
                            onCheckedChange={(checked) => setCreateUserForm({ ...createUserForm, hasProAccess: checked })}
                          />
                          <Label htmlFor="hasProAccess">Pro Access</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="isAdmin"
                            checked={createUserForm.isAdmin}
                            onCheckedChange={(checked) => setCreateUserForm({ ...createUserForm, isAdmin: checked })}
                          />
                          <Label htmlFor="isAdmin">Admin Privileges</Label>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleCreateUser}
                        disabled={createUserMutation.isPending}
                      >
                        {createUserMutation.isPending ? "Creating..." : "Create User"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div>
              {usersLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {users.map((user: User) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{user.username}</h4>
                            <Badge className={getUserTypeColor(user.userType)}>
                              {user.userType}
                            </Badge>
                            {user.isAdmin && <Badge className="bg-red-600 text-white">Admin</Badge>}
                            {user.hasProAccess && <Badge className="bg-purple-600 text-white">Pro</Badge>}
                            {user.accountLocked && <Badge className="bg-red-800 text-white"><Lock className="h-3 w-3 mr-1" />Locked</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : "No name set"}
                            {user.phone && ` • ${user.phone}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>User Details</DialogTitle>
                            </DialogHeader>
                            {selectedUser && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Username</Label>
                                    <p className="font-mono text-sm">{selectedUser.username}</p>
                                  </div>
                                  <div>
                                    <Label>Email</Label>
                                    <p className="font-mono text-sm">{selectedUser.email}</p>
                                  </div>
                                  <div>
                                    <Label>Role</Label>
                                    <p className="font-mono text-sm">{selectedUser.role}</p>
                                  </div>
                                  <div>
                                    <Label>User Type</Label>
                                    <p className="font-mono text-sm">{selectedUser.userType}</p>
                                  </div>
                                  <div>
                                    <Label>Created</Label>
                                    <p className="font-mono text-sm">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                                  </div>
                                  <div>
                                    <Label>Last Login</Label>
                                    <p className="font-mono text-sm">{selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString() : 'Never'}</p>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label>Password Reset</Label>
                                  <div className="flex gap-2">
                                    <Input
                                      type="password"
                                      placeholder="New password (min 6 characters)"
                                      value={newPassword}
                                      onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <Button 
                                      onClick={() => handleResetPassword(selectedUser.id)}
                                      disabled={resetPasswordMutation.isPending}
                                      size="sm"
                                    >
                                      Reset
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            setEditingUser(user);
                            setShowEditDialog(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleToggleUserLock(user)}
                        >
                          {user.accountLocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete User</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {user.username}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </TabsContent>

        {/* Team Members Tab - Redirect to dedicated page */}
        <TabsContent value="team" className="space-y-4">
          <div className="hvac-card">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <UsersRound className="w-20 h-20 text-blue-600 mb-6" />
              <h2 className="text-3xl font-black text-gray-900 mb-4">Team Management</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl">
                Full team member management (add, edit, delete, reorder) is available on the dedicated Team Management page.
              </p>
              
              {teamLoading ? (
                <div className="flex items-center gap-2 text-gray-600">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Loading team stats...</span>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="text-3xl font-bold text-blue-600">{teamMembers.length}</div>
                    <div className="text-sm text-gray-600">Team Members</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="text-3xl font-bold text-green-600">
                      {Array.from(new Set(teamMembers.map((m: any) => m.department || 'General'))).length}
                    </div>
                    <div className="text-sm text-gray-600">Departments</div>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4">
                    <div className="text-3xl font-bold text-orange-600">
                      {teamMembers.filter((m: any) => m.isActive).length}
                    </div>
                    <div className="text-sm text-gray-600">Active</div>
                  </div>
                </div>
              )}

              <Button asChild size="lg" className="hvac-button-primary text-lg px-8 py-6">
                <Link href="/admin/team">
                  <UsersRound className="w-5 h-5 mr-2" />
                  Go to Team Management
                </Link>
              </Button>
              
              <p className="text-sm text-gray-500 mt-4">
                Manage Jordan, Derek, Earl and add new team members
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Blog Posts Tab */}
        <TabsContent value="blog" className="space-y-4">
          <div className="hvac-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="hvac-heading-md mb-2">Blog Post Management</h2>
                <p className="hvac-text-base text-gray-600">Create, edit, and manage blog posts</p>
              </div>
              <Dialog open={showBlogDialog} onOpenChange={setShowBlogDialog}>
                <DialogTrigger asChild>
                  <Button className="hvac-button-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Blog Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Blog Post</DialogTitle>
                    <DialogDescription>
                      Write and publish a new blog post about HVAC tips, news, or updates
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="blog-title">Title</Label>
                      <Input
                        id="blog-title"
                        value={blogForm.title}
                        onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                        placeholder="e.g., Winter HVAC Maintenance Tips"
                      />
                    </div>
                    <div>
                      <Label htmlFor="blog-author">Author</Label>
                      <Input
                        id="blog-author"
                        value={blogForm.author}
                        onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                        placeholder="e.g., Jordan Boisclair"
                      />
                    </div>
                    <div>
                      <Label htmlFor="blog-category">Category</Label>
                      <Select value={blogForm.category} onValueChange={(value) => setBlogForm({ ...blogForm, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="tips">Tips & Advice</SelectItem>
                          <SelectItem value="news">Company News</SelectItem>
                          <SelectItem value="products">Products</SelectItem>
                          <SelectItem value="seasonal">Seasonal</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                          <SelectItem value="residential">Residential</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="blog-excerpt">Excerpt (Short Summary)</Label>
                      <Textarea
                        id="blog-excerpt"
                        value={blogForm.excerpt}
                        onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                        placeholder="Brief summary for preview cards..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="blog-content">Content (Full Article)</Label>
                      <Textarea
                        id="blog-content"
                        value={blogForm.content}
                        onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                        placeholder="Write your full blog post content here..."
                        rows={12}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="blog-published"
                        checked={blogForm.published}
                        onCheckedChange={(checked) => setBlogForm({ ...blogForm, published: checked })}
                      />
                      <Label htmlFor="blog-published">Publish immediately</Label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowBlogDialog(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateBlog}
                      disabled={createBlogMutation.isPending}
                    >
                      {createBlogMutation.isPending ? "Creating..." : "Create Post"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div>
              {blogLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {blogPosts && blogPosts.length > 0 ? (
                    blogPosts.map((post: any) => (
                      <div key={post.id} className="flex items-start justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                            <h4 className="font-semibold text-lg">{post.title}</h4>
                            {post.category && (
                              <Badge className="bg-blue-600 text-white">{post.category}</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            By: {post.author || 'Anonymous'} • {new Date(post.createdAt || post.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-700">{post.excerpt || post.content?.substring(0, 150)}...</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant={post.published ? "default" : "secondary"}>
                              {post.published ? "Published" : "Draft"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`/blog/${post.slug || post.id}`, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteBlogPost(post.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No blog posts yet</p>
                      <p className="text-sm text-gray-500">Create your first blog post to share HVAC tips and updates</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Job Applications Tab */}
        <TabsContent value="applications" className="space-y-4">
          <div className="hvac-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="hvac-heading-md mb-2">Job Applications</h2>
                <p className="hvac-text-base text-gray-600">Review and manage job applications</p>
              </div>
            </div>
            <div>
              {applicationsLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((application: JobApplication) => (
                    <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{application.firstName} {application.lastName}</h4>
                            <Badge className={getStatusColor(application.status)}>
                              {application.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{application.email} • {application.phone}</p>
                          <p className="text-sm text-muted-foreground">
                            Position: {application.position} • Applied: {new Date(application.appliedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedApplication(application)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Application Details</DialogTitle>
                            </DialogHeader>
                            {selectedApplication && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Name</Label>
                                    <p>{selectedApplication.firstName} {selectedApplication.lastName}</p>
                                  </div>
                                  <div>
                                    <Label>Email</Label>
                                    <p>{selectedApplication.email}</p>
                                  </div>
                                  <div>
                                    <Label>Phone</Label>
                                    <p>{selectedApplication.phone}</p>
                                  </div>
                                  <div>
                                    <Label>Position</Label>
                                    <p>{selectedApplication.position}</p>
                                  </div>
                                </div>
                                <div>
                                  <Label>Experience</Label>
                                  <p className="text-sm">{selectedApplication.experience}</p>
                                </div>
                                {selectedApplication.coverLetter && (
                                  <div>
                                    <Label>Cover Letter</Label>
                                    <p className="text-sm">{selectedApplication.coverLetter}</p>
                                  </div>
                                )}
                                <div className="flex gap-2">
                                  <Select 
                                    value={selectedApplication.status} 
                                    onValueChange={(status) => 
                                      updateApplicationMutation.mutate({ 
                                        id: selectedApplication.id, 
                                        status 
                                      })
                                    }
                                  >
                                    <SelectTrigger className="w-40">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="reviewing">Reviewing</SelectItem>
                                      <SelectItem value="approved">Approved</SelectItem>
                                      <SelectItem value="rejected">Rejected</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Contact Messages Tab */}
        <TabsContent value="contacts" className="space-y-4">
          <div className="hvac-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="hvac-heading-md mb-2">Contact Messages</h2>
                <p className="hvac-text-base text-gray-600">Review and respond to customer inquiries</p>
              </div>
            </div>
            <div>
              {contactsLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {contacts && contacts.length > 0 ? (
                    contacts.map((contact: any) => (
                      <div key={contact.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{contact.name}</h4>
                          <p className="text-sm text-muted-foreground">{contact.email} • {contact.phone}</p>
                          <p className="text-sm">{contact.message}</p>
                        </div>
                        <Badge variant={contact.responded ? "default" : "secondary"}>
                          {contact.responded ? "Responded" : "Pending"}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No contact messages found</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Emergency Requests Tab */}
        <TabsContent value="emergency" className="space-y-4">
          <div className="hvac-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="hvac-heading-md mb-2">Emergency Service Requests</h2>
                <p className="hvac-text-base text-gray-600">Monitor urgent HVAC service requests</p>
              </div>
            </div>
            <div>
              {emergencyLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {emergencyRequests && emergencyRequests.length > 0 ? (
                    emergencyRequests.map((request: any) => (
                      <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold">{request.name}</h4>
                          <p className="text-sm text-muted-foreground">{request.phone} • {request.address}</p>
                          <p className="text-sm">{request.issueDescription}</p>
                          <p className="text-sm text-muted-foreground">
                            Priority: {request.urgencyLevel} • Cost: ${request.totalCost}
                          </p>
                          {request.notes && (
                            <p className="text-sm text-blue-600 mt-1">Notes: {request.notes}</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Select
                            value={request.status}
                            onValueChange={(newStatus) => updateEmergencyRequest(request.id, newStatus)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="dispatched">Dispatched</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="invoiced">Invoiced</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => sendEmergencyInvoice(request.id)}
                              disabled={request.status === 'invoiced'}
                            >
                              {request.status === 'invoiced' ? 'Sent' : 'Invoice'}
                            </Button>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No emergency requests found</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Service Bookings Tab */}
        <TabsContent value="bookings" className="space-y-4">
          <div className="hvac-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="hvac-heading-md mb-2">Service Bookings</h2>
                <p className="hvac-text-base text-gray-600">Manage scheduled service appointments</p>
              </div>
            </div>
            <div>
              {bookingsLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings && bookings.length > 0 ? (
                    bookings.map((booking: any) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold">{booking.name}</h4>
                          <p className="text-sm text-muted-foreground">{booking.phone} • {booking.email}</p>
                          <p className="text-sm">{booking.serviceType} - {booking.address}</p>
                          <p className="text-sm text-muted-foreground">
                            Date: {booking.preferredDate ? new Date(booking.preferredDate).toLocaleDateString() : 'Not scheduled'} {booking.preferredTime ? `at ${booking.preferredTime}` : ''}
                          </p>
                          {booking.invoiceSent && (
                            <p className="text-xs text-green-600 mt-1">✓ Invoice sent - Payment: {booking.paymentStatus}</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Select
                            value={booking.status || 'pending'}
                            onValueChange={(newStatus) => updateServiceBooking(booking.id, { status: newStatus })}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => sendBookingInvoice(booking.id)}
                              disabled={booking.invoiceSent}
                            >
                              {booking.invoiceSent ? 'Sent' : 'Invoice'}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteServiceBooking(booking.id)}
                            >
                              Delete
                            </Button>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ${booking.totalCost || '0'}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No service bookings found</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Forum Management Tab */}
        <TabsContent value="forum" className="space-y-4">
          <div className="hvac-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="hvac-heading-md mb-2">Forum Management</h2>
                <p className="hvac-text-base text-gray-600">Moderate forum posts and discussions</p>
              </div>
            </div>
            <div>
              {forumLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {forumPosts && forumPosts.length > 0 ? (
                    forumPosts.map((post: any) => (
                      <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold">{post.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            By: {post.username || post.author} • Category: {post.categoryName || post.category}
                          </p>
                          <p className="text-sm">{post.content?.substring(0, 150)}...</p>
                          <div className="flex gap-2 mt-2">
                            {post.isApproved === null && (
                              <Badge className="bg-orange-600 text-white">Pending Review</Badge>
                            )}
                            {post.isApproved === true && (
                              <Badge className="bg-green-600 text-white">Approved</Badge>
                            )}
                            {post.isApproved === false && (
                              <Badge className="bg-red-600 text-white">Rejected</Badge>
                            )}
                            {post.isVisible === false && (
                              <Badge className="bg-gray-600 text-white">Hidden</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-1">
                            {post.isApproved !== true && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-green-50 hover:bg-green-100"
                                onClick={() => approveForumPost(post.id)}
                              >
                                Approve
                              </Button>
                            )}
                            {post.isApproved !== false && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-red-50 hover:bg-red-100"
                                onClick={() => rejectForumPost(post.id)}
                              >
                                Reject
                              </Button>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleForumPostVisibility(post.id, post.isVisible)}
                            >
                              {post.isVisible ? 'Hide' : 'Show'}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteForumPost(post.id)}
                            >
                              Delete
                            </Button>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No forum posts found</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-username">Username</Label>
                  <Input
                    id="edit-username"
                    value={editingUser.username}
                    onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-firstName">First Name</Label>
                  <Input
                    id="edit-firstName"
                    value={editingUser.firstName || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-lastName">Last Name</Label>
                  <Input
                    id="edit-lastName"
                    value={editingUser.lastName || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={editingUser.phone || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-role">Role</Label>
                  <Select value={editingUser.role} onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="technician">Technician</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-userType">User Type</Label>
                  <Select value={editingUser.userType} onValueChange={(value) => setEditingUser({ ...editingUser, userType: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-hasProAccess"
                    checked={editingUser.hasProAccess}
                    onCheckedChange={(checked) => setEditingUser({ ...editingUser, hasProAccess: checked })}
                  />
                  <Label htmlFor="edit-hasProAccess">Pro Access</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-isAdmin"
                    checked={editingUser.isAdmin}
                    onCheckedChange={(checked) => setEditingUser({ ...editingUser, isAdmin: checked })}
                  />
                  <Label htmlFor="edit-isAdmin">Admin Privileges</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-accountLocked"
                    checked={editingUser.accountLocked || false}
                    onCheckedChange={(checked) => setEditingUser({ ...editingUser, accountLocked: checked })}
                  />
                  <Label htmlFor="edit-accountLocked">Account Locked</Label>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateUser}
              disabled={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending ? "Updating..." : "Update User"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}