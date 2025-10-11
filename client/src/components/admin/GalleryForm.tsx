import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface GalleryFormProps {
  onClose: () => void;
  project?: any;
}

export default function GalleryForm({ onClose, project }: GalleryFormProps) {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    beforeImageUrl: project?.metadata?.beforeImageUrl || '',
    afterImageUrl: project?.metadata?.afterImageUrl || '',
    location: project?.location || '',
    category: project?.category || 'residential',
    benefit: project?.metadata?.benefit || '',
    benefitValue: project?.metadata?.benefitValue || ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createProjectMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/admin/gallery-projects', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery/services'] });
      toast({
        title: "Success",
        description: "Gallery project added successfully",
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add project",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProjectMutation.mutate(formData);
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>{project ? 'Edit Project' : 'Add New Gallery Project'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="High-Efficiency Furnace Upgrade"
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Calgary, AB"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Brief description of the project..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="beforeImageUrl">Before Image URL</Label>
              <Input
                id="beforeImageUrl"
                value={formData.beforeImageUrl}
                onChange={(e) => setFormData({ ...formData, beforeImageUrl: e.target.value })}
                placeholder="https://example.com/before.jpg"
                required
              />
            </div>
            <div>
              <Label htmlFor="afterImageUrl">After Image URL</Label>
              <Input
                id="afterImageUrl"
                value={formData.afterImageUrl}
                onChange={(e) => setFormData({ ...formData, afterImageUrl: e.target.value })}
                placeholder="https://example.com/after.jpg"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="benefit">Benefit Type</Label>
              <Input
                id="benefit"
                value={formData.benefit}
                onChange={(e) => setFormData({ ...formData, benefit: e.target.value })}
                placeholder="Energy Savings"
              />
            </div>
            <div>
              <Label htmlFor="benefitValue">Benefit Value</Label>
              <Input
                id="benefitValue"
                value={formData.benefitValue}
                onChange={(e) => setFormData({ ...formData, benefitValue: e.target.value })}
                placeholder="30%"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <Button type="submit" disabled={createProjectMutation.isPending}>
              {createProjectMutation.isPending ? 'Adding...' : project ? 'Update Project' : 'Add Project'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}