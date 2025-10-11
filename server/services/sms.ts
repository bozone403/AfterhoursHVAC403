import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !twilioPhoneNumber) {
  console.warn('Twilio credentials not configured. SMS notifications will only log to console.');
  console.log('Available credentials:', {
    accountSid: accountSid ? 'SET' : 'MISSING',
    authToken: authToken ? 'SET' : 'MISSING', 
    twilioPhoneNumber: twilioPhoneNumber ? 'SET' : 'MISSING'
  });
}

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export async function sendSMS(to: string, message: string): Promise<boolean> {
  if (!client || !twilioPhoneNumber) {
    console.log(`SMS would be sent to ${to}:`, message);
    console.log('Attempting SMS delivery to', to, 'via email gateways');
    return false;
  }

  try {
    // Ensure phone number is properly formatted
    const formattedNumber = to.startsWith('+') ? to : `+1${to.replace(/\D/g, '')}`;
    
    const result = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: formattedNumber
    });

    console.log(`SMS sent successfully to ${formattedNumber}. SID: ${result.sid}`);
    return true;
  } catch (error) {
    console.error('Failed to send SMS via Twilio:', error);
    console.log('Attempting SMS delivery to', to, 'via email gateways');
    return false;
  }
}

export async function sendEmergencyNotification(
  phoneNumber: string,
  customerName: string,
  customerPhone: string,
  serviceAddress: string,
  issueDescription: string,
  urgencyLevel: string,
  totalCost: number,
  minimumHours: number,
  baseRate: number,
  preferredTime?: string,
  customerEmail?: string
): Promise<boolean> {
  const message = `🚨 EMERGENCY HVAC SERVICE REQUEST

Name: ${customerName}
Phone: ${customerPhone}
Address: ${serviceAddress}
Issue: ${issueDescription}
Urgency: ${urgencyLevel}
Cost: $${totalCost} (${minimumHours}h min @ $${baseRate}/h)
${preferredTime ? `Preferred: ${preferredTime}` : ''}
${customerEmail ? `Email: ${customerEmail}` : ''}

Time: ${new Date().toLocaleString()}
Action Required: Contact customer immediately`;

  return await sendSMS(phoneNumber, message);
}

export async function sendTestNotification(phoneNumber: string): Promise<boolean> {
  const message = `TEST SMS from AfterHours HVAC - Your SMS notifications are working! Time: ${new Date().toLocaleString()}`;

  return await sendSMS(phoneNumber, message);
}