import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  ImageIcon, 
  Trash2, 
  Edit, 
  Save, 
  X,
  Plus,
  Camera,
  FileImage
} from 'lucide-react';

type GalleryImage = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type ServiceImage = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  serviceType: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

const AdminPhotosEnhanced = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState('gallery');
  const [editingImage, setEditingImage] = useState<GalleryImage | ServiceImage | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newImageForm, setNewImageForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: '',
    serviceType: '',
    isActive: true
  });

  // Check if user is admin (isAdmin flag set by backend based on email/username)
  if (!user || !user.isAdmin) {
    return (
      <>
        <Helmet>
          <title>Access Denied - AfterHours HVAC</title>
        </Helmet>
        <div className="container mx-auto py-24 px-4 min-h-screen">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-6">Access Denied</h1>
            <Card>
              <CardHeader>
                <CardTitle>Admin Access Required</CardTitle>
                <CardDescription>
                  You need administrator privileges to access the photo gallery editor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This area is restricted to authorized administrators only.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  // Get gallery images
  const { data: galleryImages = [], isLoading: galleryLoading } = useQuery<GalleryImage[]>({
    queryKey: ['/api/gallery'],
  });

  // Get service images
  const { data: serviceImages = [], isLoading: serviceLoading } = useQuery<ServiceImage[]>({
    queryKey: ['/api/gallery/services'],
  });

  // File upload handler
  const handleFileUpload = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        resolve(result);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  // Add gallery image mutation
  const addGalleryImageMutation = useMutation({
    mutationFn: async (data: Omit<GalleryImage, 'id' | 'createdAt' | 'updatedAt'>) => {
      const response = await apiRequest('POST', '/api/gallery', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      setNewImageForm({
        title: '',
        description: '',
        imageUrl: '',
        category: '',
        serviceType: '',
        isActive: true
      });
      toast({
        title: "Success",
        description: "Gallery image added successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Add service image mutation
  const addServiceImageMutation = useMutation({
    mutationFn: async (data: Omit<ServiceImage, 'id' | 'createdAt' | 'updatedAt'>) => {
      const response = await apiRequest('POST', '/api/gallery/services', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery/services'] });
      setNewImageForm({
        title: '',
        description: '',
        imageUrl: '',
        category: '',
        serviceType: '',
        isActive: true
      });
      toast({
        title: "Success",
        description: "Service image added successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete image mutation
  const deleteImageMutation = useMutation({
    mutationFn: async ({ id, type }: { id: number; type: 'gallery' | 'service' }) => {
      const endpoint = type === 'gallery' ? '/api/gallery' : '/api/gallery/services';
      const response = await apiRequest('DELETE', `${endpoint}/${id}`);
      return response.json();
    },
    onSuccess: (_, { type }) => {
      const queryKey = type === 'gallery' ? ['/api/gallery'] : ['/api/gallery/services'];
      queryClient.invalidateQueries({ queryKey });
      toast({
        title: "Success",
        description: "Image deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = async () => {
    if (!fileInputRef.current?.files?.[0]) {
      toast({
        title: "No File Selected",
        description: "Please select an image file to upload.",
        variant: "destructive",
      });
      return;
    }

    const file = fileInputRef.current.files[0];
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file (JPG, PNG, GIF, etc.).",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      const imageUrl = await handleFileUpload(file);
      setNewImageForm(prev => ({ ...prev, imageUrl }));
      
      toast({
        title: "File Uploaded",
        description: "Image has been processed and is ready to save.",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to process the image file.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAddImage = (type: 'gallery' | 'service') => {
    if (!newImageForm.title || !newImageForm.description || !newImageForm.imageUrl) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and upload an image.",
        variant: "destructive",
      });
      return;
    }

    if (type === 'gallery') {
      if (!newImageForm.category) {
        toast({
          title: "Missing Category",
          description: "Please select a category for the gallery image.",
          variant: "destructive",
        });
        return;
      }
      addGalleryImageMutation.mutate({
        title: newImageForm.title,
        description: newImageForm.description,
        imageUrl: newImageForm.imageUrl,
        category: newImageForm.category,
        isActive: newImageForm.isActive
      });
    } else {
      if (!newImageForm.serviceType) {
        toast({
          title: "Missing Service Type",
          description: "Please select a service type for the service image.",
          variant: "destructive",
        });
        return;
      }
      addServiceImageMutation.mutate({
        title: newImageForm.title,
        description: newImageForm.description,
        imageUrl: newImageForm.imageUrl,
        serviceType: newImageForm.serviceType,
        isActive: newImageForm.isActive
      });
    }
  };

  const galleryCategories = ['Residential', 'Commercial', 'Emergency Repairs', 'Installations', 'Maintenance', 'Before/After'];
  const serviceTypes = ['Furnace', 'Air Conditioning', 'Maintenance', 'Ductwork', 'Commercial', 'Heat Pumps'];

  return (
    <>
      <Helmet>
        <title>Photo Management - Admin Dashboard</title>
        <meta name="description" content="Manage gallery and service photos for the AfterHours HVAC website" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <ImageIcon className="h-10 w-10 text-green-400" />
              Photo Management System
            </h1>
            <p className="text-xl text-slate-300">
              Upload and manage gallery and service images for the website
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800">
              <TabsTrigger value="gallery">Gallery Images ({galleryImages.length})</TabsTrigger>
              <TabsTrigger value="services">Service Images ({serviceImages.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="gallery" className="space-y-6">
              {/* Add New Gallery Image */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add New Gallery Image
                  </CardTitle>
                  <CardDescription>Upload images to the main project gallery</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="galleryTitle">Title *</Label>
                      <Input
                        id="galleryTitle"
                        value={newImageForm.title}
                        onChange={(e) => setNewImageForm(prev => ({ ...prev, title: e.target.value }))}
                        className="bg-slate-900 border-slate-600"
                        placeholder="Project title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="galleryCategory">Category *</Label>
                      <select
                        value={newImageForm.category}
                        onChange={(e) => setNewImageForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full p-2 bg-slate-900 border border-slate-600 rounded-md"
                      >
                        <option value="">Select category</option>
                        {galleryCategories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="galleryDescription">Description *</Label>
                    <Textarea
                      id="galleryDescription"
                      value={newImageForm.description}
                      onChange={(e) => setNewImageForm(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-slate-900 border-slate-600"
                      placeholder="Describe the project or work shown"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-4">
                    <Label>Upload Image *</Label>
                    <div className="flex items-center gap-4">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        variant="outline"
                        className="border-slate-600"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        {uploading ? 'Processing...' : 'Choose Image'}
                      </Button>
                      {newImageForm.imageUrl && (
                        <Badge variant="secondary" className="bg-green-600/20 text-green-400">
                          <FileImage className="h-3 w-3 mr-1" />
                          Image Ready
                        </Badge>
                      )}
                    </div>
                    
                    {newImageForm.imageUrl && (
                      <div className="mt-4">
                        <img 
                          src={newImageForm.imageUrl} 
                          alt="Preview" 
                          className="max-w-xs h-32 object-cover rounded-lg border border-slate-600"
                        />
                      </div>
                    )}
                  </div>

                  <Button 
                    onClick={() => handleAddImage('gallery')}
                    disabled={addGalleryImageMutation.isPending || !newImageForm.title || !newImageForm.description || !newImageForm.imageUrl || !newImageForm.category}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {addGalleryImageMutation.isPending ? 'Adding...' : 'Add to Gallery'}
                  </Button>
                </CardContent>
              </Card>

              {/* Gallery Images List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryLoading ? (
                  <div className="col-span-full text-center py-8">Loading gallery images...</div>
                ) : galleryImages.length === 0 ? (
                  <div className="col-span-full text-center py-8">
                    <ImageIcon className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                    <p className="text-slate-400">No gallery images yet. Add your first project photo above.</p>
                  </div>
                ) : (
                  galleryImages.map((image) => (
                    <Card key={image.id} className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-4">
                        <img 
                          src={image.imageUrl} 
                          alt={image.title}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <h3 className="font-semibold text-white mb-2">{image.title}</h3>
                        <p className="text-sm text-slate-300 mb-2">{image.description}</p>
                        <Badge variant="outline" className="mb-4">{image.category}</Badge>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => deleteImageMutation.mutate({ id: image.id, type: 'gallery' })}
                            disabled={deleteImageMutation.isPending}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              {/* Add New Service Image */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add New Service Image
                  </CardTitle>
                  <CardDescription>Upload images for specific HVAC services</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="serviceTitle">Title *</Label>
                      <Input
                        id="serviceTitle"
                        value={newImageForm.title}
                        onChange={(e) => setNewImageForm(prev => ({ ...prev, title: e.target.value }))}
                        className="bg-slate-900 border-slate-600"
                        placeholder="Service image title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="serviceType">Service Type *</Label>
                      <select
                        value={newImageForm.serviceType}
                        onChange={(e) => setNewImageForm(prev => ({ ...prev, serviceType: e.target.value }))}
                        className="w-full p-2 bg-slate-900 border border-slate-600 rounded-md"
                      >
                        <option value="">Select service type</option>
                        {serviceTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="serviceDescription">Description *</Label>
                    <Textarea
                      id="serviceDescription"
                      value={newImageForm.description}
                      onChange={(e) => setNewImageForm(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-slate-900 border-slate-600"
                      placeholder="Describe the service or equipment shown"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-4">
                    <Label>Upload Image *</Label>
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        variant="outline"
                        className="border-slate-600"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        {uploading ? 'Processing...' : 'Choose Image'}
                      </Button>
                      {newImageForm.imageUrl && (
                        <Badge variant="secondary" className="bg-green-600/20 text-green-400">
                          <FileImage className="h-3 w-3 mr-1" />
                          Image Ready
                        </Badge>
                      )}
                    </div>
                    
                    {newImageForm.imageUrl && (
                      <div className="mt-4">
                        <img 
                          src={newImageForm.imageUrl} 
                          alt="Preview" 
                          className="max-w-xs h-32 object-cover rounded-lg border border-slate-600"
                        />
                      </div>
                    )}
                  </div>

                  <Button 
                    onClick={() => handleAddImage('service')}
                    disabled={addServiceImageMutation.isPending || !newImageForm.title || !newImageForm.description || !newImageForm.imageUrl || !newImageForm.serviceType}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {addServiceImageMutation.isPending ? 'Adding...' : 'Add Service Image'}
                  </Button>
                </CardContent>
              </Card>

              {/* Service Images List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {serviceLoading ? (
                  <div className="col-span-full text-center py-8">Loading service images...</div>
                ) : serviceImages.length === 0 ? (
                  <div className="col-span-full text-center py-8">
                    <ImageIcon className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                    <p className="text-slate-400">No service images yet. Add your first service photo above.</p>
                  </div>
                ) : (
                  serviceImages.map((image) => (
                    <Card key={image.id} className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-4">
                        <img 
                          src={image.imageUrl} 
                          alt={image.title}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <h3 className="font-semibold text-white mb-2">{image.title}</h3>
                        <p className="text-sm text-slate-300 mb-2">{image.description}</p>
                        <Badge variant="outline" className="mb-4">{image.serviceType}</Badge>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => deleteImageMutation.mutate({ id: image.id, type: 'service' })}
                            disabled={deleteImageMutation.isPending}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default AdminPhotosEnhanced;