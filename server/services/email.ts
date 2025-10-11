import { InsertContactSubmission, InsertEmergencyRequest } from "@shared/schema";

// Simple logger for email service
const logger = {
  info: (message: string, data?: any) => console.log(`[EmailService] ${message}`, data || ''),
  warn: (message: string, data?: any) => console.warn(`[EmailService] ${message}`, data || ''),
  error: (message: string, data?: any) => console.error(`[EmailService] ${message}`, data || '')
};

// For development, log emails to console
const transporter = {
  sendMail: async (mailOptions: any) => {
    logger.info('EMAIL WOULD BE SENT', mailOptions);
    return { messageId: 'dev-message-id' };
  }
};

// Company email configuration
const COMPANY_EMAIL = process.env.COMPANY_EMAIL || 'Jordan@Afterhourshvac.ca';
const COMPANY_NAME = 'AfterHours HVAC';

/**
 * Send an email for contact form submissions
 */
export async function processContactForm(data: InsertContactSubmission): Promise<void> {
  try {
    const companyMailOptions = {
      from: `"${COMPANY_NAME} Website" <${COMPANY_EMAIL}>`,
      to: COMPANY_EMAIL,
      subject: `New Contact Form: ${data.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
      `
    };

    await transporter.sendMail(companyMailOptions);
    logger.info(`Contact form email sent for ${data.email}`);
  } catch (error) {
    logger.error('Error sending contact form email:', error);
    throw new Error('Failed to send email notification');
  }
}

/**
 * Send an urgent email for emergency service requests
 */
export async function processEmergencyRequest(data: InsertEmergencyRequest): Promise<void> {
  try {
    const companyMailOptions = {
      from: `"${COMPANY_NAME} EMERGENCY" <${COMPANY_EMAIL}>`,
      to: COMPANY_EMAIL,
      subject: `🚨 URGENT: Emergency Service Request`,
      html: `
        <h2 style="color: #FF3D00;">EMERGENCY SERVICE REQUEST</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Description:</strong></p>
        <p>${(data.issueDescription || '').replace(/\n/g, '<br>')}</p>
        <p style="color: #FF3D00; font-weight: bold;">PLEASE CONTACT CUSTOMER IMMEDIATELY</p>
      `,
      priority: 'high'
    };

    await transporter.sendMail(companyMailOptions);
    logger.info(`Emergency request email sent for ${data.name} - ${data.phone}`);
  } catch (error) {
    logger.error('Error sending emergency request email:', error);
    throw new Error('Failed to send emergency notification');
  }
}

/**
 * Generic email sending function
 */
export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}): Promise<void> {
  try {
    const mailOptions = {
      from: options.from || `"${COMPANY_NAME}" <${COMPANY_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html: options.html
    };
    
    await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${options.to}`);
  } catch (error) {
    logger.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}