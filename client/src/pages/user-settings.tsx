import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { User, Lock, Mail, Save } from 'lucide-react';

export default function UserSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [emailForm, setEmailForm] = useState({
    currentEmail: user?.email || '',
    newEmail: '',
    confirmEmail: ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const updateEmailMutation = useMutation({
    mutationFn: async (data: { newEmail: string }) => {
      const res = await apiRequest('PUT', '/api/user/email', data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Email Updated",
        description: "Your email address has been successfully updated.",
      });
      setEmailForm({
        currentEmail: emailForm.newEmail,
        newEmail: '',
        confirmEmail: ''
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string, newPassword: string }) => {
      const res = await apiRequest('PUT', '/api/user/password', data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Password Updated",
        description: "Your password has been successfully changed.",
      });
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleEmailUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailForm.newEmail || !emailForm.confirmEmail) {
      toast({
        title: "Validation Error",
        description: "Please fill in all email fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (emailForm.newEmail !== emailForm.confirmEmail) {
      toast({
        title: "Validation Error",
        description: "New email addresses do not match.",
        variant: "destructive",
      });
      return;
    }
    
    updateEmailMutation.mutate({ newEmail: emailForm.newEmail });
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    updatePasswordMutation.mutate({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-slate-400">Please log in to access your settings.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Account Settings - AfterHours HVAC</title>
        <meta name="description" content="Manage your account settings, update email and password." />
      </Helmet>

      <div className="min-h-screen bg-slate-900 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
            <p className="text-slate-300">Manage your account information and security settings</p>
          </div>

          {/* Account Information */}
          <Card className="mb-8 bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-400" />
                Account Information
              </CardTitle>
              <CardDescription>Your current account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-300">Username</Label>
                <Input 
                  value={user.username} 
                  disabled 
                  className="bg-slate-700 border-slate-600 text-slate-300"
                />
                <p className="text-xs text-slate-400 mt-1">Username cannot be changed</p>
              </div>
              <div>
                <Label className="text-slate-300">Member Since</Label>
                <Input 
                  value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'} 
                  disabled 
                  className="bg-slate-700 border-slate-600 text-slate-300"
                />
              </div>
            </CardContent>
          </Card>

          {/* Email Settings */}
          <Card className="mb-8 bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Mail className="h-5 w-5 mr-2 text-green-400" />
                Email Address
              </CardTitle>
              <CardDescription>Update your email address for notifications and account recovery</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailUpdate} className="space-y-4">
                <div>
                  <Label className="text-slate-300">Current Email</Label>
                  <Input 
                    value={emailForm.currentEmail || 'No email set'} 
                    disabled 
                    className="bg-slate-700 border-slate-600 text-slate-300"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">New Email Address</Label>
                  <Input
                    type="email"
                    value={emailForm.newEmail}
                    onChange={(e) => setEmailForm({...emailForm, newEmail: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Enter new email address"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Confirm New Email</Label>
                  <Input
                    type="email"
                    value={emailForm.confirmEmail}
                    onChange={(e) => setEmailForm({...emailForm, confirmEmail: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Confirm new email address"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={updateEmailMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateEmailMutation.isPending ? 'Updating...' : 'Update Email'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Password Settings */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Lock className="h-5 w-5 mr-2 text-red-400" />
                Password
              </CardTitle>
              <CardDescription>Change your account password for security</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <Label className="text-slate-300">Current Password</Label>
                  <Input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">New Password</Label>
                  <Input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Enter new password (min 6 characters)"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Confirm New Password</Label>
                  <Input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Confirm new password"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={updatePasswordMutation.isPending}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  {updatePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}