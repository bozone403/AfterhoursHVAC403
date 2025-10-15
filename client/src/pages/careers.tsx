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
  availability: z.string().min(1, "Please select your availability"),
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
      availability: "Full-time",
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
        availability: data.availability || "Full-time", // Default to Full-time if not specified
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-orange-50">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-orange-500 text-white">
        <div className="hvac-container py-24">
          <div className="text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-6">
              <Briefcase className="h-5 w-5 mr-3" />
              <span className="text-white text-lg font-bold">💼 Careers at AfterHours HVAC</span>
            </div>
            <h1 className="hvac-heading-xl mb-6">Join Our Growing Team</h1>
            <p className="hvac-text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Build your career with Calgary's leading HVAC company. We offer competitive compensation, 
              comprehensive benefits, and opportunities for professional growth in a supportive environment.
            </p>
          </div>
        </div>
      </div>

      <div className="hvac-container py-16">

        {/* Company Benefits */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="hvac-heading-lg mb-2">Why Work With Us?</h2>
            <p className="hvac-text-lg text-gray-600">Join a team that values your growth and success</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companyBenefits.map((benefit, index) => (
              <div key={index} className="hvac-card text-center group hover:shadow-2xl transition-all duration-300">
                <div className="p-6">
                  <div className="flex justify-center mb-4 text-blue-600 group-hover:scale-110 transition-transform">
                    {benefit.icon}
                  </div>
                  <h3 className="hvac-heading-sm mb-2">{benefit.title}</h3>
                  <p className="hvac-text-base text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-12">
          <div className="text-center mb-10">
            <h2 className="hvac-heading-lg mb-2">Current Openings</h2>
            <p className="hvac-text-lg text-gray-600">Find your perfect role with us</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {jobPositions.map((position) => (
              <div key={position.id} className="hvac-card hover:shadow-2xl transition-all duration-300">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="hvac-heading-md mb-1">
                        {position.title}
                      </h3>
                      <p className="hvac-text-base text-blue-600 font-semibold">
                        {position.department}
                      </p>
                    </div>
                    <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                      {position.type}
                    </Badge>
                  </div>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-orange-500" />
                      {position.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      {position.salary}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-blue-600" />
                      Posted {position.posted}
                    </div>
                  </div>

                  <p className="hvac-text-base text-gray-700">{position.description}</p>

                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Key Requirements:</h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      {position.requirements.slice(0, 3).map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-600 font-bold">✓</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {expandedCard === position.id && (
                    <div className="space-y-4 border-t border-gray-200 pt-4 mt-4">
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <span>📋</span> Complete Requirements:
                        </h4>
                        <ul className="text-sm text-gray-700 space-y-2">
                          {position.requirements.map((req, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-blue-600 font-bold">✓</span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <span>🎁</span> Benefits & Perks:
                        </h4>
                        <ul className="text-sm text-gray-700 space-y-2">
                          {position.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-green-600 font-bold">✓</span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 hvac-button-primary"
                      onClick={() => {
                        setSelectedPosition(position.title);
                        setShowApplication(true);
                        // Scroll to application form
                        setTimeout(() => {
                          document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                    >
                      Apply Now
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                      onClick={() => {
                        setExpandedCard(expandedCard === position.id ? null : position.id);
                      }}
                    >
                      {expandedCard === position.id ? "Hide Details" : "View Details"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            ))}
          </div>
        </div>

        {/* Application Form */}
        {showApplication && (
          <div id="application-form" className="hvac-card max-w-2xl mx-auto">
            <div className="p-6">
              <h3 className="hvac-heading-md mb-2 flex items-center gap-2">
                <FileText className="h-6 w-6 text-blue-600" />
                Job Application
              </h3>
              <p className="hvac-text-base text-gray-600 mb-6">
                {selectedPosition ? `Applying for: ${selectedPosition}` : "Complete the form below to apply"}
              </p>
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
                    name="availability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Availability *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your availability" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Full-time">Full-time</SelectItem>
                            <SelectItem value="Part-time">Part-time</SelectItem>
                            <SelectItem value="Contract">Contract</SelectItem>
                            <SelectItem value="Flexible">Flexible</SelectItem>
                          </SelectContent>
                        </Select>
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
            </div>
          </div>
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