import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Users, UserPlus, Edit, Trash2, ArrowUp, ArrowDown, Image as ImageIcon, Sparkles } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  department: string;
  experience?: string;
  description?: string;
  specialties?: string;
  photoUrl?: string;
  iconName: string;
  iconColor: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

interface TeamMemberForm {
  name: string;
  role: string;
  department: string;
  experience: string;
  description: string;
  specialties: string;
  photoUrl: string;
  iconName: string;
  iconColor: string;
  displayOrder: number;
}

const departments = [
  "General",
  "Residential",
  "Commercial",
  "Industrial",
  "Service",
  "Sales",
  "Admin",
  "Technical Support"
];

const iconOptions = [
  "User", "Users", "Building2", "Home", "Bot", "Wrench", 
  "Settings", "Shield", "Award", "Star", "ThermometerSun",
  "Snowflake", "Wind", "Zap", "Target", "TrendingUp"
];

const colorOptions = [
  { name: "Blue", value: "from-blue-600 to-blue-800" },
  { name: "Green", value: "from-green-600 to-green-800" },
  { name: "Orange", value: "from-orange-500 to-orange-700" },
  { name: "Red", value: "from-red-600 to-red-800" },
  { name: "Purple", value: "from-purple-600 to-purple-800" },
  { name: "Amber", value: "from-amber-500 to-amber-700" },
  { name: "Cyan", value: "from-cyan-600 to-cyan-800" },
  { name: "Pink", value: "from-pink-600 to-pink-800" },
];

export default function AdminTeamManagement() {
  const { toast } = useToast();
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [form, setForm] = useState<TeamMemberForm>({
    name: "",
    role: "",
    department: "General",
    experience: "",
    description: "",
    specialties: "",
    photoUrl: "",
    iconName: "User",
    iconColor: "from-blue-600 to-blue-800",
    displayOrder: 0
  });

  // Fetch team members
  const { data: teamMembers = [], isLoading, refetch } = useQuery<TeamMember[]>({
    queryKey: ["/api/team"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/team");
      return response.json();
    }
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: TeamMemberForm) => {
      const response = await apiRequest("POST", "/api/admin/team", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Team Member Added",
        description: "New team member has been added successfully."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/team"] });
      setShowCreateDialog(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Add Member",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: TeamMemberForm & { id: number }) => {
      const response = await apiRequest("PUT", `/api/admin/team/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Member Updated",
        description: "Team member has been updated successfully."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/team"] });
      setShowEditDialog(false);
      setEditingMember(null);
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/team/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Member Removed",
        description: "Team member has been removed successfully."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/team"] });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setForm({
      name: "",
      role: "",
      department: "General",
      experience: "",
      description: "",
      specialties: "",
      photoUrl: "",
      iconName: "User",
      iconColor: "from-blue-600 to-blue-800",
      displayOrder: 0
    });
  };

  const handleCreate = () => {
    if (!form.name || !form.role || !form.description) {
      toast({
        title: "Missing Fields",
        description: "Name, role, and description are required.",
        variant: "destructive"
      });
      return;
    }
    createMutation.mutate(form);
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setForm({
      name: member.name,
      role: member.role,
      department: member.department,
      experience: member.experience || "",
      description: member.description || "",
      specialties: member.specialties || "",
      photoUrl: member.photoUrl || "",
      iconName: member.iconName,
      iconColor: member.iconColor,
      displayOrder: member.displayOrder
    });
    setShowEditDialog(true);
  };

  const handleUpdate = () => {
    if (!editingMember) return;
    if (!form.name || !form.role || !form.description) {
      toast({
        title: "Missing Fields",
        description: "Name, role, and description are required.",
        variant: "destructive"
      });
      return;
    }
    updateMutation.mutate({ id: editingMember.id, ...form });
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from the team?`)) {
      deleteMutation.mutate(id);
    }
  };

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = LucideIcons;
    return icons[iconName] || LucideIcons.User;
  };

  return (
    <>
      <Helmet>
        <title>Team Management - Admin Panel | AfterHours HVAC</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">Team Management</h1>
              <p className="text-gray-600">Manage your team members displayed on the About page</p>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-orange-500">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Team Member
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Team Member</DialogTitle>
                  <DialogDescription>
                    Add a new member to your team. This will appear on the About page.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="create-name">Name *</Label>
                      <Input
                        id="create-name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Jordan Boisclair"
                      />
                    </div>
                    <div>
                      <Label htmlFor="create-role">Title/Role *</Label>
                      <Input
                        id="create-role"
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                        placeholder="Commercial Project Manager"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="create-department">Department</Label>
                    <Select value={form.department} onValueChange={(val) => setForm({ ...form, department: val })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="create-description">Description/Bio *</Label>
                    <Textarea
                      id="create-description"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Tell us about this team member's role and expertise..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="create-experience">Years of Experience</Label>
                    <Input
                      id="create-experience"
                      value={form.experience}
                      onChange={(e) => setForm({ ...form, experience: e.target.value })}
                      placeholder="15+ years in HVAC"
                    />
                  </div>

                  <div>
                    <Label htmlFor="create-specialties">Specialties</Label>
                    <Input
                      id="create-specialties"
                      value={form.specialties}
                      onChange={(e) => setForm({ ...form, specialties: e.target.value })}
                      placeholder="Commercial HVAC, Project Management, Energy Efficiency"
                    />
                  </div>

                  <div>
                    <Label htmlFor="create-photo">Photo URL (optional)</Label>
                    <Input
                      id="create-photo"
                      value={form.photoUrl}
                      onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
                      placeholder="https://example.com/photo.jpg"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave blank to use an icon instead</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="create-icon">Icon (if no photo)</Label>
                      <Select value={form.iconName} onValueChange={(val) => setForm({ ...form, iconName: val })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {iconOptions.map((icon) => (
                            <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="create-color">Icon Color</Label>
                      <Select value={form.iconColor} onValueChange={(val) => setForm({ ...form, iconColor: val })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {colorOptions.map((color) => (
                            <SelectItem key={color.value} value={color.value}>{color.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="create-order">Display Order (lower = shown first)</Label>
                    <Input
                      id="create-order"
                      type="number"
                      value={form.displayOrder}
                      onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                  <Button onClick={handleCreate} disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Adding..." : "Add Member"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Team Members Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading team members...</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member) => {
                const IconComponent = getIconComponent(member.iconName);
                const isAI = member.name.toLowerCase().includes('earl') || member.iconName === 'Bot';
                
                return (
                  <Card key={member.id} className="relative overflow-hidden hover:shadow-xl transition-shadow">
                    {isAI && (
                      <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-500 to-transparent px-4 py-1">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          {member.photoUrl ? (
                            <img 
                              src={member.photoUrl} 
                              alt={member.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          ) : (
                            <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${member.iconColor} flex items-center justify-center ${isAI ? 'animate-pulse' : ''}`}>
                              <IconComponent className="w-8 h-8 text-white" />
                            </div>
                          )}
                          <div>
                            <CardTitle className="text-lg">{member.name}</CardTitle>
                            <p className="text-sm text-orange-600 font-semibold">{member.role}</p>
                            <Badge className="mt-1" variant="outline">{member.department}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-3">{member.description}</p>
                      {member.experience && (
                        <p className="text-xs text-gray-500 mb-1">
                          <strong>Experience:</strong> {member.experience}
                        </p>
                      )}
                      {member.specialties && (
                        <p className="text-xs text-gray-500 mb-3">
                          <strong>Specialties:</strong> {member.specialties}
                        </p>
                      )}
                      <div className="flex justify-between items-center pt-3 border-t">
                        <span className="text-xs text-gray-500">Order: {member.displayOrder}</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(member)}>
                            <Edit className="w-3 h-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove Team Member?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove {member.name} from the team? This will remove them from the About page.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(member.id, member.name)}>
                                  Remove
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {teamMembers.length === 0 && !isLoading && (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">No Team Members Yet</h3>
                <p className="text-gray-600 mb-4">Add your first team member to get started!</p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add First Member
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Edit Dialog */}
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Team Member</DialogTitle>
                <DialogDescription>
                  Update team member information
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-name">Name *</Label>
                    <Input
                      id="edit-name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-role">Title/Role *</Label>
                    <Input
                      id="edit-role"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-department">Department</Label>
                  <Select value={form.department} onValueChange={(val) => setForm({ ...form, department: val })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="edit-description">Description/Bio *</Label>
                  <Textarea
                    id="edit-description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="edit-experience">Years of Experience</Label>
                  <Input
                    id="edit-experience"
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="edit-specialties">Specialties</Label>
                  <Input
                    id="edit-specialties"
                    value={form.specialties}
                    onChange={(e) => setForm({ ...form, specialties: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="edit-photo">Photo URL (optional)</Label>
                  <Input
                    id="edit-photo"
                    value={form.photoUrl}
                    onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-icon">Icon (if no photo)</Label>
                    <Select value={form.iconName} onValueChange={(val) => setForm({ ...form, iconName: val })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((icon) => (
                          <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="edit-color">Icon Color</Label>
                    <Select value={form.iconColor} onValueChange={(val) => setForm({ ...form, iconColor: val })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {colorOptions.map((color) => (
                          <SelectItem key={color.value} value={color.value}>{color.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-order">Display Order</Label>
                  <Input
                    id="edit-order"
                    type="number"
                    value={form.displayOrder}
                    onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {
                  setShowEditDialog(false);
                  setEditingMember(null);
                }}>Cancel</Button>
                <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Updating..." : "Update Member"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}
