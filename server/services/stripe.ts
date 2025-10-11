import Stripe from 'stripe';
import { storage } from '../storage';
import { createLogger } from '../../client/src/lib/utils';

const logger = createLogger('StripeService');

// Initialize Stripe with API key from environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  logger.error('Missing Stripe secret key. Set STRIPE_SECRET_KEY environment variable.');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

// Fixed price for Pro Calculator access
const PRO_CALCULATOR_PRICE = 50000; // $500.00 in cents

/**
 * Create a payment intent for Pro Calculator purchase
 */
export async function createPaymentIntent() {
  try {
    logger.info('Creating payment intent for Pro Calculator purchase');
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: PRO_CALCULATOR_PRICE,
      currency: 'cad',
      description: 'AfterHours HVAC Pro Calculator Access',
      metadata: {
        product: 'pro_calculator'
      }
    });
    
    logger.info(`Payment intent created: ${paymentIntent.id}`);
    return paymentIntent;
  } catch (error) {
    logger.error('Error creating payment intent:', error);
    throw error;
  }
}

/**
 * Handle Stripe webhook events
 */
export async function handleWebhook(req: any) {
  const payload = req.body;
  const sig = req.headers['stripe-signature'];
  
  // Validate webhook signature if enabled
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      
      // Process the event
      return await processWebhookEvent(event);
    } catch (err: any) {
      logger.error(`Webhook signature verification failed: ${err.message}`);
      throw new Error(`Webhook Error: ${err.message}`);
    }
  } else {
    // Process without signature validation for development
    try {
      const event = payload;
      return await processWebhookEvent(event);
    } catch (err: any) {
      logger.error(`Webhook processing failed: ${err.message}`);
      throw new Error(`Webhook Error: ${err.message}`);
    }
  }
}

/**
 * Process Stripe webhook events
 */
async function processWebhookEvent(event: Stripe.Event) {
  logger.info(`Processing webhook event: ${event.type}`);
  
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
      break;
    
    case 'payment_intent.payment_failed':
      await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
      break;
      
    default:
      logger.info(`Unhandled event type: ${event.type}`);
  }
  
  return { received: true };
}

/**
 * Handle successful payments
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  logger.info(`Payment succeeded: ${paymentIntent.id}`);
  
  try {
    // Find the corresponding pro calculator access record
    const access = await storage.getProCalculatorAccessByStripeId(paymentIntent.id);
    
    if (access) {
      // Update the access record to active
      await storage.activateProCalculatorAccess(access.id, paymentIntent.customer as string);
      logger.info(`Pro Calculator access activated for ID ${access.id}`);
    } else {
      logger.warn(`No Pro Calculator access record found for payment intent: ${paymentIntent.id}`);
    }
  } catch (error) {
    logger.error('Error processing successful payment:', error);
  }
}

/**
 * Handle failed payments
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  logger.error(`Payment failed: ${paymentIntent.id}`, paymentIntent.last_payment_error);
  
  try {
    // Find the corresponding pro calculator access record
    const access = await storage.getProCalculatorAccessByStripeId(paymentIntent.id);
    
    if (access) {
      // Log the failure but keep the record for retry
      logger.info(`Payment failed for Pro Calculator access ID ${access.id}`);
    }
  } catch (error) {
    logger.error('Error processing failed payment:', error);
  }
}
