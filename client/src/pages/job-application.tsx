import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Upload,
  FileText,
  ArrowLeft,
  Check,
  X,
  Image,
  File
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const applicationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  position: z.string().min(1, "Please select a position"),
  experience: z.string().min(50, "Please provide detailed experience (minimum 50 characters)"),
  coverLetter: z.string().min(100, "Cover letter must be at least 100 characters"),
  yearsExperience: z.string().min(1, "Years of experience required"),
  education: z.string().min(1, "Education level required"),
  certifications: z.string().optional(),
  availability: z.string().min(1, "Availability required"),
  salaryExpectation: z.string().optional(),
  references: z.string().optional(),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

interface FileUpload {
  name: string;
  file: File | null;
  uploaded: boolean;
  required: boolean;
}

const JobApplication = () => {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [files, setFiles] = useState<Record<string, FileUpload>>({
    resume: { name: "Resume", file: null, uploaded: false, required: true },
    coverLetter: { name: "Cover Letter", file: null, uploaded: false, required: false },
    certifications: { name: "Certifications", file: null, uploaded: false, required: false },
    driversAbstract: { name: "Driver's Abstract", file: null, uploaded: false, required: false },
    license: { name: "License/ID", file: null, uploaded: false, required: false },
    tickets: { name: "Tickets/Credentials", file: null, uploaded: false, required: false },
    references: { name: "References", file: null, uploaded: false, required: false },
  });

  // Get position from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const selectedPosition = urlParams.get('position') || '';

  const form = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      position: selectedPosition,
      experience: "",
      coverLetter: "",
      yearsExperience: "",
      education: "",
      certifications: "",
      availability: "",
      salaryExpectation: "",
      references: "",
    },
  });

  const submitApplication = useMutation({
    mutationFn: async (data: ApplicationForm) => {
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Add form fields
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value || '');
      });

      // Add files
      Object.entries(files).forEach(([key, fileData]) => {
        if (fileData.file) {
          formData.append(key, fileData.file);
        }
      });

      return await apiRequest("POST", "/api/job-applications", formData);
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted Successfully!",
        description: "Thank you for your interest! We'll review your application and contact you within 3-5 business days.",
      });
      setLocation("/careers");
    },
    onError: (error: any) => {
      toast({
        title: "Submission Error",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ApplicationForm) => {
    // Check required files
    const missingRequiredFiles = Object.entries(files)
      .filter(([, fileData]) => fileData.required && !fileData.file)
      .map(([, fileData]) => fileData.name);

    if (missingRequiredFiles.length > 0) {
      toast({
        title: "Missing Required Files",
        description: `Please upload: ${missingRequiredFiles.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    submitApplication.mutate(data);
  };

  const handleFileUpload = (category: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // File size limit: 10MB
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "File must be under 10MB.",
        variant: "destructive",
      });
      return;
    }

    // Allowed file types
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload PDF, Word document, or image files only.",
        variant: "destructive",
      });
      return;
    }

    setFiles(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        file,
        uploaded: true
      }
    }));

    toast({
      title: "File Uploaded",
      description: `${files[category].name} uploaded successfully.`,
    });
  };

  const removeFile = (category: string) => {
    setFiles(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        file: null,
        uploaded: false
      }
    }));
  };

  const positions = [
    "Senior HVAC Technician",
    "HVAC Technician",
    "HVAC Apprentice",
    "Service Coordinator",
    "Installation Specialist",
    "Maintenance Technician",
    "Administrative Assistant",
    "Sales Representative"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/careers")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Careers
          </Button>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Job Application</h1>
          <p className="text-xl text-gray-600">Join the AfterHours HVAC team - Calgary's premier HVAC service company</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              Application Details
            </CardTitle>
            <CardDescription>
              {selectedPosition ? `Applying for: ${selectedPosition}` : "Complete all sections below"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="(403) 555-0123" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Position Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Position Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position Applied For *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a position" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {positions.map((position) => (
                                <SelectItem key={position} value={position}>
                                  {position}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="yearsExperience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Years of Experience *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select experience level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0-1">0-1 years</SelectItem>
                              <SelectItem value="2-3">2-3 years</SelectItem>
                              <SelectItem value="4-5">4-5 years</SelectItem>
                              <SelectItem value="6-10">6-10 years</SelectItem>
                              <SelectItem value="10+">10+ years</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="education"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Education Level *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select education level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="high-school">High School</SelectItem>
                              <SelectItem value="trade-school">Trade School</SelectItem>
                              <SelectItem value="college">College</SelectItem>
                              <SelectItem value="university">University</SelectItem>
                              <SelectItem value="apprenticeship">Apprenticeship Program</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="availability"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Availability *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="When can you start?" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="immediately">Immediately</SelectItem>
                              <SelectItem value="1-week">Within 1 week</SelectItem>
                              <SelectItem value="2-weeks">2 weeks notice</SelectItem>
                              <SelectItem value="1-month">1 month notice</SelectItem>
                              <SelectItem value="negotiable">Negotiable</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="salaryExpectation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salary Expectation (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., $25-30/hour or $50,000-60,000/year" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Experience and Qualifications */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Experience & Qualifications</h3>
                  
                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work Experience *</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            rows={5}
                            placeholder="Describe your relevant work experience, including specific HVAC systems you've worked with, types of installations/repairs, and any notable projects..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="certifications"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Certifications & Training</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            rows={3}
                            placeholder="List any relevant certifications, licenses, or training (e.g., Red Seal, HRAI, gas fitter license, refrigeration tickets, etc.)"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="coverLetter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cover Letter *</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            rows={6}
                            placeholder="Tell us why you want to work at AfterHours HVAC and what makes you a great fit for this position..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* File Uploads */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Document Uploads</h3>
                  <p className="text-sm text-gray-600">Upload relevant documents to support your application. Maximum file size: 10MB each.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(files).map(([key, fileData]) => (
                      <div key={key} className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="font-medium">
                            {fileData.name}
                            {fileData.required && <span className="text-red-500 ml-1">*</span>}
                          </Label>
                          {fileData.uploaded && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(key)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        {fileData.uploaded && fileData.file ? (
                          <div className="flex items-center gap-2 text-green-600">
                            <Check className="h-4 w-4" />
                            <span className="text-sm">{fileData.file.name}</span>
                          </div>
                        ) : (
                          <div>
                            <input
                              type="file"
                              id={key}
                              className="hidden"
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              onChange={(e) => handleFileUpload(key, e)}
                            />
                            <label
                              htmlFor={key}
                              className="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-800"
                            >
                              <Upload className="h-4 w-4" />
                              <span className="text-sm">Click to upload</span>
                            </label>
                            <p className="text-xs text-gray-500 mt-1">PDF, Word, or Image files</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* References */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">References</h3>
                  
                  <FormField
                    control={form.control}
                    name="references"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Professional References</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            rows={4}
                            placeholder="Provide contact information for 2-3 professional references (name, title, company, phone, email, relationship)"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation("/careers")}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitApplication.isPending}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {submitApplication.isPending ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JobApplication;