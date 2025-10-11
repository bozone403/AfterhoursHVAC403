import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, AirVent, Home, Wrench, User, Lock, Mail, Phone as PhoneIcon, Building } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Helmet } from 'react-helmet-async';

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  firstName: z.string().optional().or(z.literal("")),
  lastName: z.string().optional().or(z.literal("")),
  company: z.string().optional().or(z.literal("")),
  userType: z.enum(["customer", "technician"]).default("customer"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [location, navigate] = useLocation();
  const { user, registerMutation } = useAuth();

  // Get user type from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const userTypeFromUrl = urlParams.get('type') as 'customer' | 'technician' || 'customer';

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      phone: "",
      firstName: "",
      lastName: "",
      company: "",
      userType: userTypeFromUrl,
    },
  });

  // Redirect if already logged in
  if (user) {
    navigate("/");
    return null;
  }

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await registerMutation.mutateAsync(values);
      navigate("/");
    } catch (error) {
      // Error is handled by the mutation's onError callback
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <Helmet>
        <title>Create Account | AfterHours HVAC</title>
        <meta name="description" content="Create an account to access AfterHours HVAC Pro Calculator tools and exclusive features" />
      </Helmet>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-2xl shadow-amber-500/50 mb-6">
            <AirVent className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2">
            Join AfterHours HVAC
          </h1>
          <p className="text-blue-200">
            Access professional HVAC tools and exclusive features
          </p>
        </div>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" data-testid="form-register">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-semibold">Username *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300" />
                            <Input
                              placeholder="Choose a username"
                              className="pl-11 bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-blue-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50 h-12 rounded-xl"
                              data-testid="input-username"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-amber-300" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-semibold">Password *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300" />
                            <Input
                              type="password"
                              placeholder="Create a password"
                              className="pl-11 bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-blue-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50 h-12 rounded-xl"
                              data-testid="input-password"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-amber-300" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-semibold">First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="First name"
                            className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-blue-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50 h-12 rounded-xl"
                            data-testid="input-firstname"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-amber-300" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-semibold">Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Last name"
                            className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-blue-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50 h-12 rounded-xl"
                            data-testid="input-lastname"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-amber-300" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white font-semibold">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300" />
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            className="pl-11 bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-blue-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50 h-12 rounded-xl"
                            data-testid="input-email"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-amber-300" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="userType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white font-semibold">Account Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white/5 backdrop-blur-sm border-white/20 text-white h-12 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50" data-testid="select-usertype">
                            <SelectValue placeholder="Select your account type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-900 border-white/20">
                          <SelectItem value="customer" className="text-white hover:bg-white/10">
                            <div className="flex items-center gap-2">
                              <Home className="h-4 w-4 text-amber-400" />
                              <span>Customer (Homeowner)</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="technician" className="text-white hover:bg-white/10">
                            <div className="flex items-center gap-2">
                              <Wrench className="h-4 w-4 text-blue-400" />
                              <span>Technician (HVAC Professional)</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-amber-300" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-semibold">Phone</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300" />
                            <Input
                              placeholder="(555) 123-4567"
                              className="pl-11 bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-blue-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50 h-12 rounded-xl"
                              data-testid="input-phone"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-amber-300" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-semibold">Company</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300" />
                            <Input
                              placeholder="Your company name"
                              className="pl-11 bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-blue-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50 h-12 rounded-xl"
                              data-testid="input-company"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-amber-300" />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:via-amber-700 hover:to-amber-600 text-white font-bold rounded-xl shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/50 transition-all duration-300 hover:scale-105 mt-2"
                  disabled={registerMutation.isPending}
                  data-testid="button-create-account"
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
            
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-blue-100 text-center">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-amber-400 hover:text-amber-300 font-semibold transition-colors underline decoration-amber-400/50 hover:decoration-amber-300"
                  data-testid="link-signin"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional help text */}
        <p className="text-center text-blue-300 text-sm mt-6">
          AfterHours HVAC Professional Services
        </p>
      </div>
    </div>
  );
}
