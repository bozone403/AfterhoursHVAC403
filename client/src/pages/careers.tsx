import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign,
  Upload,
  FileText,
  Users,
  Wrench,
  Truck,
  GraduationCap,
  Shield,
  Heart,
  Star
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
  experience: z.string().min(1, "Please describe your experience"),
  coverLetter: z.string().optional(),
  resume: z.any().optional(),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  posted: string;
}

const Careers = () => {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [showApplication, setShowApplication] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const form = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      position: "",
      experience: "",
      coverLetter: "",
    },
  });

  const submitApplication = useMutation({
    mutationFn: async (data: ApplicationForm & { resumeFile?: File }) => {
      // For now, submit without file upload - just the form data
      const applicationData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        position: data.position,
        experience: data.experience,
        coverLetter: data.coverLetter
      };

      return await apiRequest("POST", "/api/job-applications", applicationData);
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "Thank you for your interest! We'll review your application and contact you soon.",
      });
      form.reset();
      setResumeFile(null);
      setShowApplication(false);
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
    submitApplication.mutate({ ...data, resumeFile: resumeFile || undefined });
  };

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File Too Large",
          description: "Resume file must be under 5MB.",
          variant: "destructive",
        });
        return;
      }
      
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Resume must be a PDF or Word document.",
          variant: "destructive",
        });
        return;
      }
      
      setResumeFile(file);
    }
  };

  const jobPositions: JobPosition[] = [
    {
      id: "hvac-technician-sr",
      title: "Senior HVAC Technician",
      department: "Field Services",
      location: "Calgary, AB",
      type: "Full-time",
      salary: "$65,000 - $85,000",
      description: "We're seeking an experienced HVAC technician to join our growing team. You'll be responsible for installation, maintenance, and repair of residential and commercial HVAC systems throughout Calgary.",
      requirements: [
        "5+ years of HVAC experience",
        "Alberta Refrigeration & A/C Mechanic License",
        "Gas Technician Class A or B license",
        "Valid driver's license and reliable vehicle",
        "Strong troubleshooting and problem-solving skills",
        "Excellent customer service abilities"
      ],
      benefits: [
        "Competitive salary with performance bonuses",
        "Company vehicle and fuel allowance",
        "Health and dental benefits",
        "Retirement savings plan",
        "Ongoing training and certification support",
        "Tool allowance program"
      ],
      posted: "2024-12-20"
    },
    {
      id: "hvac-apprentice",
      title: "HVAC Apprentice",
      department: "Field Services",
      location: "Calgary, AB",
      type: "Full-time",
      salary: "$45,000 - $55,000",
      description: "Start your career in the HVAC industry with AfterHours HVAC. We provide comprehensive training and mentorship to help you become a skilled technician.",
      requirements: [
        "High school diploma or equivalent",
        "Interest in mechanical systems and trades",
        "Willingness to learn and follow safety protocols",
        "Physical ability to work in various conditions",
        "Valid driver's license",
        "Basic hand tool knowledge preferred"
      ],
      benefits: [
        "Paid apprenticeship program",
        "Tuition assistance for trade school",
        "Mentorship from experienced technicians",
        "Health benefits after probation",
        "Career advancement opportunities",
        "Safety equipment provided"
      ],
      posted: "2024-12-18"
    },
    {
      id: "service-coordinator",
      title: "Service Coordinator",
      department: "Customer Service",
      location: "Calgary, AB",
      type: "Full-time",
      salary: "$40,000 - $50,000",
      description: "Join our customer service team as a Service Coordinator. You'll schedule appointments, coordinate with technicians, and ensure excellent customer experiences.",
      requirements: [
        "2+ years of customer service experience",
        "Strong communication and organizational skills",
        "Experience with scheduling software preferred",
        "Ability to multitask in fast-paced environment",
        "Basic knowledge of HVAC systems an asset",
        "Professional phone manner"
      ],
      benefits: [
        "Regular business hours (no evenings/weekends)",
        "Comprehensive benefits package",
        "Professional development opportunities",
        "Friendly team environment",
        "Performance incentives",
        "Paid vacation and sick leave"
      ],
      posted: "2024-12-15"
    },
    {
      id: "sales-representative",
      title: "HVAC Sales Representative",
      department: "Sales",
      location: "Calgary, AB",
      type: "Full-time",
      salary: "$50,000 - $75,000 + Commission",
      description: "Drive sales growth by building relationships with residential and commercial customers. Present HVAC solutions and provide expert consultation on system upgrades and replacements.",
      requirements: [
        "3+ years of sales experience",
        "Knowledge of HVAC systems and technology",
        "Strong presentation and negotiation skills",
        "Self-motivated with proven track record",
        "Valid driver's license and clean record",
        "CRM software experience preferred"
      ],
      benefits: [
        "Base salary plus uncapped commission",
        "Company vehicle or vehicle allowance",
        "Health and dental coverage",
        "Sales training and support",
        "Flexible schedule",
        "Annual sales incentive trips"
      ],
      posted: "2024-12-12"
    }
  ];

  const companyBenefits = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Comprehensive Benefits",
      description: "Health, dental, and vision coverage for you and your family"
    },
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: "Professional Development",
      description: "Ongoing training, certifications, and career advancement opportunities"
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Competitive Compensation",
      description: "Fair wages, performance bonuses, and profit-sharing programs"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Work-Life Balance",
      description: "Flexible schedules, paid time off, and family-friendly policies"
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Company Vehicle",
      description: "Fully equipped service vehicles with fuel and maintenance covered"
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Recognition Programs",
      description: "Employee of the month, service awards, and team celebrations"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-blue-100 border border-blue-200 rounded-full px-6 py-3 mb-6">
            <Briefcase className="h-5 w-5 text-blue-700 mr-3" />
            <span className="text-blue-800 text-lg font-bold">Careers</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Join Our Growing Team</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Build your career with Calgary's leading HVAC company. We offer competitive compensation, 
            comprehensive benefits, and opportunities for professional growth in a supportive environment.
          </p>
        </div>

        {/* Company Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Why Work With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companyBenefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4 text-blue-600">
                    {benefit.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Current Openings</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {jobPositions.map((position) => (
              <Card key={position.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">
                        {position.title}
                      </CardTitle>
                      <CardDescription className="text-lg">
                        {position.department}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {position.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {position.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {position.salary}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Posted {position.posted}
                    </div>
                  </div>

                  <p className="text-gray-700">{position.description}</p>

                  <div>
                    <h4 className="font-semibold mb-2">Key Requirements:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {position.requirements.slice(0, 3).map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {expandedCard === position.id && (
                    <div className="space-y-4 border-t pt-4 mt-4">
                      <div>
                        <h4 className="font-semibold mb-2">Complete Requirements:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {position.requirements.map((req, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-blue-600 mt-1">•</span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Benefits & Perks:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {position.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-green-600 mt-1">•</span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      className="flex-1"
                      onClick={() => {
                        setLocation(`/job-application?position=${encodeURIComponent(position.title)}`);
                      }}
                    >
                      Apply Now
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setExpandedCard(expandedCard === position.id ? null : position.id);
                      }}
                    >
                      {expandedCard === position.id ? "Hide Details" : "View Details"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Application Form */}
        {showApplication && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Job Application
              </CardTitle>
              <CardDescription>
                {selectedPosition ? `Applying for: ${selectedPosition}` : "Complete the form below to apply"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a position" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {jobPositions.map((position) => (
                              <SelectItem key={position.id} value={position.title}>
                                {position.title}
                              </SelectItem>
                            ))}
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relevant Experience *</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            rows={4}
                            placeholder="Describe your relevant work experience, certifications, and skills..."
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
                        <FormLabel>Cover Letter (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            rows={4}
                            placeholder="Tell us why you're interested in this position and what you can bring to our team..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Resume Upload */}
                  <div className="space-y-2">
                    <Label>Resume Upload</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeUpload}
                        className="hidden"
                        id="resume-upload"
                      />
                      <label htmlFor="resume-upload" className="cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          {resumeFile ? resumeFile.name : "Click to upload your resume (PDF or Word, max 5MB)"}
                        </p>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowApplication(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={submitApplication.isPending}
                      className="flex-1"
                    >
                      {submitApplication.isPending ? "Submitting..." : "Submit Application"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Company Culture */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold mb-6">Our Culture</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 mb-8">
              At AfterHours HVAC, we believe in fostering a workplace where every team member can thrive. 
              We're committed to safety, continuous learning, and delivering exceptional service to our customers 
              throughout Calgary and surrounding areas.
            </p>
            <div className="bg-blue-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-4">Ready to Start Your Career?</h3>
              <p className="text-gray-700 mb-6">
                Join a team that values your growth, supports your success, and provides the tools you need to excel in the HVAC industry.
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Phone:</strong> (403) 613-6014</p>
                <p><strong>Email:</strong> Jordan@Afterhourshvac.ca</p>
                <p><strong>Address:</strong> Calgary, Alberta</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Careers;