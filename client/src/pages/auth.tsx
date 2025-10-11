import React, { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, AirVent, User, Mail, Phone, Building, Shield, CheckCircle, Eye, EyeOff } from "lucide-react";
import { Helmet } from "react-helmet-async";

// Login form schema
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Registration form schema
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
  email: z.string().email("Valid email address is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  company: z.string().optional().or(z.literal("")),
  userType: z.enum(["customer", "professional"], {
    required_error: "Please select your account type",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [location, navigate] = useLocation();
  const { user, isLoading, loginMutation, registerMutation } = useAuth();

  // Get user type from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const userTypeFromUrl = urlParams.get('type') === 'pro' ? 'professional' : 'customer';

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      phone: "",
      firstName: "",
      lastName: "",
      company: "",
      userType: userTypeFromUrl,
    },
  });

  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data);
  };

  // Navigation after successful auth
  React.useEffect(() => {
    if (user && !isLoading) {
      const params = new URLSearchParams(window.location.search);
      const returnUrl = params.get('returnUrl');
      if (returnUrl) {
        navigate(decodeURIComponent(returnUrl));
      } else {
        navigate("/");
      }
    }
  }, [user, isLoading, navigate]);

  // Show loading if redirecting
  if (user && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Login & Register - AfterHours HVAC</title>
        <meta name="description" content="Access your AfterHours HVAC account or create a new one. Get professional tools, calculators, and community access." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
            
            {/* Hero Section */}
            <div className="hidden lg:block space-y-8">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-6">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                    <AirVent className="h-8 w-8 text-white" />
                  </div>
                  <div className="ml-4">
                    <h1 className="text-3xl font-bold text-gray-900">AfterHours HVAC</h1>
                    <p className="text-blue-600 font-medium">Professional Services 24/7</p>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Join Calgary's Trusted HVAC Community
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  Access professional tools, expert forums, and exclusive services. 
                  Whether you're a homeowner or contractor, we have the resources you need.
                </p>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Professional Calculators</h3>
                    <p className="text-gray-600 text-sm">Advanced HVAC sizing and load calculation tools</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Expert Community</h3>
                    <p className="text-gray-600 text-sm">Connect with HVAC professionals and get answers</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Service Tracking</h3>
                    <p className="text-gray-600 text-sm">Track appointments and maintenance history</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Priority Support</h3>
                    <p className="text-gray-600 text-sm">24/7 emergency service and priority booking</p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-2">Need Emergency Service?</h3>
                <p className="mb-3 text-red-100">Available 24/7 for heating and cooling emergencies</p>
                <a href="tel:4036136014" className="text-2xl font-black hover:text-red-100">
                  (403) 613-6014
                </a>
              </div>
            </div>

            {/* Auth Forms */}
            <div className="w-full max-w-lg mx-auto">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <Tabs
                  defaultValue="login"
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 bg-gray-50 p-1 rounded-none">
                    <TabsTrigger 
                      value="login" 
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg m-1 font-semibold"
                    >
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger 
                      value="register" 
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg m-1 font-semibold"
                    >
                      Create Account
                    </TabsTrigger>
                  </TabsList>

                  {/* Login Form */}
                  <TabsContent value="login" className="p-0">
                    <div className="p-8">
                      <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                        <p className="text-gray-600 mt-2">Sign in to access your account</p>
                      </div>

                      {loginMutation.error && (
                        <Alert className="mb-6 border-red-200 bg-red-50">
                          <AlertDescription className="text-red-800">
                            {loginMutation.error.message}
                          </AlertDescription>
                        </Alert>
                      )}

                      <Form {...loginForm}>
                        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                          <FormField
                            control={loginForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700">Username</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input 
                                      placeholder="Enter your username" 
                                      className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500" 
                                      {...field} 
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={loginForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700">Password</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Shield className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input
                                      type={showPassword ? "text" : "password"}
                                      placeholder="Enter your password"
                                      className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                      {...field}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowPassword(!showPassword)}
                                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                    >
                                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button
                            type="submit"
                            disabled={loginMutation.isPending}
                            className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                          >
                            {loginMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Signing In...
                              </>
                            ) : (
                              "Sign In"
                            )}
                          </Button>
                        </form>
                      </Form>
                    </div>
                  </TabsContent>

                  {/* Register Form */}
                  <TabsContent value="register" className="p-0">
                    <div className="p-8">
                      <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
                        <p className="text-gray-600 mt-2">Join our HVAC community today</p>
                        {userTypeFromUrl === 'professional' && (
                          <Badge className="mt-2 bg-orange-100 text-orange-800 hover:bg-orange-100">
                            Professional Account
                          </Badge>
                        )}
                      </div>

                      {registerMutation.error && (
                        <Alert className="mb-6 border-red-200 bg-red-50">
                          <AlertDescription className="text-red-800">
                            {registerMutation.error.message}
                          </AlertDescription>
                        </Alert>
                      )}

                      <Form {...registerForm}>
                        <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-6">
                          
                          {/* User Type Selection */}
                          <FormField
                            control={registerForm.control}
                            name="userType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700">Account Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="h-12 border-gray-300">
                                      <SelectValue placeholder="Select account type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="customer">Customer - Home & Business Owners</SelectItem>
                                    <SelectItem value="professional">Professional - HVAC Contractors</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Separator />

                          {/* Personal Information */}
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={registerForm.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-700">First Name</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="First name" 
                                      className="h-12 border-gray-300 focus:border-blue-500" 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={registerForm.control}
                              name="lastName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-700">Last Name</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="Last name" 
                                      className="h-12 border-gray-300 focus:border-blue-500" 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={registerForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700">Username</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input 
                                      placeholder="Choose a username" 
                                      className="pl-10 h-12 border-gray-300 focus:border-blue-500" 
                                      {...field} 
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={registerForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700">Email Address</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input 
                                      type="email" 
                                      placeholder="your.email@example.com" 
                                      className="pl-10 h-12 border-gray-300 focus:border-blue-500" 
                                      {...field} 
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={registerForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700">Phone Number</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input 
                                      type="tel" 
                                      placeholder="(403) 123-4567" 
                                      className="pl-10 h-12 border-gray-300 focus:border-blue-500" 
                                      {...field} 
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={registerForm.control}
                            name="company"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700">Company (Optional)</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input 
                                      placeholder="Company name" 
                                      className="pl-10 h-12 border-gray-300 focus:border-blue-500" 
                                      {...field} 
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Separator />

                          {/* Password Fields */}
                          <FormField
                            control={registerForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700">Password</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Shield className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input
                                      type={showPassword ? "text" : "password"}
                                      placeholder="Create a secure password"
                                      className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500"
                                      {...field}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowPassword(!showPassword)}
                                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                    >
                                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={registerForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700">Confirm Password</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Shield className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input
                                      type={showConfirmPassword ? "text" : "password"}
                                      placeholder="Confirm your password"
                                      className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500"
                                      {...field}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                    >
                                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button
                            type="submit"
                            disabled={registerMutation.isPending}
                            className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                          >
                            {registerMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Creating Account...
                              </>
                            ) : (
                              "Create Account"
                            )}
                          </Button>
                        </form>
                      </Form>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Mobile Emergency Contact */}
              <div className="lg:hidden mt-8 bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-2">Need Emergency Service?</h3>
                <p className="mb-3 text-red-100">Available 24/7 for heating and cooling emergencies</p>
                <a href="tel:4036136014" className="text-2xl font-black hover:text-red-100">
                  (403) 613-6014
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}