import { apiRequest } from "./queryClient";

const logger = {
  info: (...args: any[]) => console.log("[FormHandlers]", ...args),
  error: (...args: any[]) => console.error("[FormHandlers]", ...args)
};

export interface EmergencyFormData {
  name: string;
  phone: string;
  issueType: string;
  description: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface QuoteFormData {
  name: string;
  email: string;
  phone: string;
  address?: string;
  serviceType: string;
  details?: string;
}

export interface CalculatorFormData {
  homeSize: number;
  systemAge: string;
  fuelType: string;
  monthlyCost: number;
}

export const submitEmergencyForm = async (data: EmergencyFormData): Promise<{ success: boolean; message: string }> => {
  try {
    logger.info("Submitting emergency form", data);
    
    // Map frontend form data to backend schema
    const requestData = {
      name: data.name,
      phone: data.phone,
      address: "Address not provided", // Default since not collected in emergency form
      issueDescription: data.description,
      urgencyLevel: "high", // Emergency requests are always high priority
      emergencyType: data.issueType,
      description: data.description,
      severity: "high"
    };
    
    const response = await apiRequest("POST", "/api/emergency-requests", requestData);
    
    if (!response.ok) {
      const errorData = await response.json();
      logger.error("Emergency form submission failed", errorData);
      return { 
        success: false, 
        message: errorData.message || "Failed to submit emergency request. Please call us directly at (403) 613-6014."
      };
    }
    
    logger.info("Emergency form submitted successfully");
    return { 
      success: true, 
      message: "Emergency request submitted successfully. We will contact you shortly."
    };
  } catch (error) {
    logger.error("Error submitting emergency form", error);
    return { 
      success: false, 
      message: "An unexpected error occurred. Please call us directly at (403) 613-6014."
    };
  }
};

export const submitContactForm = async (data: ContactFormData): Promise<{ success: boolean; message: string }> => {
  try {
    logger.info("Submitting contact form", data);
    const response = await apiRequest("POST", "/api/contact", data);
    
    if (!response.ok) {
      const errorData = await response.json();
      logger.error("Contact form submission failed", errorData);
      return { 
        success: false, 
        message: errorData.message || "Failed to submit contact form. Please try again later."
      };
    }
    
    logger.info("Contact form submitted successfully");
    return { 
      success: true, 
      message: "Message sent successfully. We will get back to you soon!"
    };
  } catch (error) {
    logger.error("Error submitting contact form", error);
    return { 
      success: false, 
      message: "An unexpected error occurred. Please try again later or call us directly."
    };
  }
};

export const submitQuoteForm = async (data: QuoteFormData): Promise<{ success: boolean; message: string }> => {
  try {
    logger.info("Submitting quote form", data);
    const response = await apiRequest("POST", "/api/quote-request", data);
    
    if (!response.ok) {
      const errorData = await response.json();
      logger.error("Quote form submission failed", errorData);
      return { 
        success: false, 
        message: errorData.message || "Failed to submit quote request. Please try again later."
      };
    }
    
    logger.info("Quote form submitted successfully");
    return { 
      success: true, 
      message: "Quote request submitted successfully. We will contact you with your custom quote soon!"
    };
  } catch (error) {
    logger.error("Error submitting quote form", error);
    return { 
      success: false, 
      message: "An unexpected error occurred. Please try again later or call us directly."
    };
  }
};
