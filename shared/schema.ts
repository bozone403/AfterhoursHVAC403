import { pgTable, text, serial, integer, boolean, timestamp, numeric, jsonb, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User and Authentication Tables
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  phone: text("phone"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  company: text("company"),
  role: text("role").default("user"), // user, admin, moderator
  userType: text("user_type").default("customer"), // customer, technician
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  hasProAccess: boolean("has_pro_access").default(false),
  hasPro: boolean("has_pro").default(false),
  isAdmin: boolean("is_admin").default(false),
  proAccessGrantedAt: timestamp("pro_access_granted_at"),
  membershipType: text("membership_type"), // 'monthly', 'yearly', 'lifetime', 'corporate'
  membershipExpiresAt: timestamp("membership_expires_at"),
  isLifetimeMember: boolean("is_lifetime_member").default(false),
  profileImageUrl: text("profile_image_url"),
  
  // Phone Verification & Account Security
  phoneVerified: boolean("phone_verified").default(false),
  phoneVerificationCode: text("phone_verification_code"),
  phoneVerificationExpiresAt: timestamp("phone_verification_expires_at"),
  phoneVerifiedAt: timestamp("phone_verified_at"),
  
  // Corporate Membership Features
  corporateAccountId: integer("corporate_account_id").references(() => corporateAccounts.id),
  isCorporateAdmin: boolean("is_corporate_admin").default(false),
  
  // Device & Session Tracking
  maxSessions: integer("max_sessions").default(1), // Pro: 3, Corporate: unlimited per corporate account
  deviceFingerprint: text("device_fingerprint"), // Browser/device identification
  lastDeviceFingerprint: text("last_device_fingerprint"),
  suspiciousLoginDetected: boolean("suspicious_login_detected").default(false),
  accountLocked: boolean("account_locked").default(false),
  lockedAt: timestamp("locked_at"),
  lockReason: text("lock_reason"),
  
  createdAt: timestamp("created_at").defaultNow(),
  lastLogin: timestamp("last_login"),
});

// Corporate Accounts - for managing multiple users under one subscription
export const corporateAccounts = pgTable("corporate_accounts", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  adminUserId: integer("admin_user_id").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  maxUsers: integer("max_users").default(10), // Standard corporate: 10, custom for more
  currentUsers: integer("current_users").default(0),
  isActive: boolean("is_active").default(true),
  subscriptionType: text("subscription_type").default("corporate"), // corporate, enterprise_custom
  annualRevenue: text("annual_revenue"), // For custom enterprise pricing
  customPricingNotes: text("custom_pricing_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Active Sessions - track where users are logged in
export const userSessions = pgTable("user_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  sessionId: text("session_id").notNull().unique(),
  deviceFingerprint: text("device_fingerprint").notNull(),
  deviceInfo: jsonb("device_info"), // Browser, OS, IP, etc.
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  location: text("location"), // City, Country from IP
  isActive: boolean("is_active").default(true),
  lastActivity: timestamp("last_activity").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

// Phone Verification Attempts - rate limiting
export const phoneVerificationAttempts = pgTable("phone_verification_attempts", {
  id: serial("id").primaryKey(),
  phone: text("phone").notNull(),
  ipAddress: text("ip_address"),
  attemptCount: integer("attempt_count").default(1),
  lastAttempt: timestamp("last_attempt").defaultNow(),
  blockedUntil: timestamp("blocked_until"),
});

// Suspicious Activity Log
export const securityLogs = pgTable("security_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  eventType: text("event_type").notNull(), // 'login', 'failed_login', 'device_change', 'suspicious_activity'
  details: jsonb("details"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  severity: text("severity").default("low"), // low, medium, high, critical
  resolved: boolean("resolved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Product Access Tracking for different systems
export const productAccess = pgTable("product_access", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  productId: integer("product_id").notNull().references(() => products.id),
  purchasedAt: timestamp("purchased_at").defaultNow(),
  expiresAt: timestamp("expires_at"), // for time-limited access
  active: boolean("active").default(true),
  paymentIntentId: text("payment_intent_id"),
});

// Products that can be purchased/accessed
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(), // furnace, ac, pro_tools, maintenance
  tier: text("tier"), // economy, mid_range, premium
  features: jsonb("features"), // Array of features included
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Forum and Discussion
export const forumCategories = pgTable("forum_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  slug: text("slug").notNull().unique(),
  sortOrder: integer("sort_order"),
  isActive: boolean("is_active").default(true),
});

export const forumTopics = pgTable("forum_topics", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => forumCategories.id),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  slug: text("slug").notNull(),
  displayName: text("display_name"),
  views: integer("views").default(0),
  isPinned: boolean("is_pinned").default(false),
  isLocked: boolean("is_locked").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id").references(() => forumTopics.id),
  userId: integer("user_id").references(() => users.id),
  content: text("content").notNull(),
  displayName: text("display_name"),
  isEdited: boolean("is_edited").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Forum likes/reactions system
export const forumLikes = pgTable("forum_likes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  topicId: integer("topic_id").references(() => forumTopics.id),
  postId: integer("post_id").references(() => forumPosts.id),
  likeType: text("like_type").default("like"), // like, dislike, helpful, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// Gallery for photos
export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  title: text("title"),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  altText: text("alt_text"),
  category: text("category"), // residential, commercial, etc.
  sortOrder: integer("sort_order"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
});

// Carousel Images for Homepage
export const carouselImages = pgTable("carousel_images", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  uploadedBy: integer("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Reviews
export const customerReviews = pgTable("customer_reviews", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  location: text("location"),
  rating: integer("rating").notNull(), // 1-5 stars
  reviewText: text("review_text").notNull(),
  serviceType: text("service_type"), // what service was performed
  isApproved: boolean("is_approved").default(false),
  serviceDate: timestamp("service_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Blog posts
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  coverImageUrl: text("cover_image_url"),
  authorId: integer("author_id").references(() => users.id),
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const blogCategories = pgTable("blog_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
});

// Many-to-many relationship between blog posts and categories
export const blogPostCategories = pgTable("blog_post_categories", {
  postId: integer("post_id").notNull().references(() => blogPosts.id),
  categoryId: integer("category_id").notNull().references(() => blogCategories.id),
}, (t) => ({
  pk: primaryKey({ columns: [t.postId, t.categoryId] }),
}));

// Tables for HVAC data and equipment
export const hvacEquipmentCategories = pgTable("hvac_equipment_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export const hvacEquipment = pgTable("hvac_equipment", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => hvacEquipmentCategories.id),
  name: text("name").notNull(),
  description: text("description"),
  manufacturer: text("manufacturer"),
  model: text("model"),
  efficiency: text("efficiency"),
  basePrice: numeric("base_price", { precision: 10, scale: 2 }),
  installationCost: numeric("installation_cost", { precision: 10, scale: 2 }),
  annualOperatingCost: numeric("annual_operating_cost", { precision: 10, scale: 2 }),
  lifespan: integer("lifespan"),
  type: text("type"), // furnace, AC, heat pump, etc.
  btuOutput: integer("btu_output"),
  seerRating: numeric("seer_rating", { precision: 4, scale: 1 }),
  afueRating: numeric("afue_rating", { precision: 4, scale: 1 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const hvacMaterials = pgTable("hvac_materials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  unit: text("unit").notNull(), // feet, square feet, pieces, etc.
  costPerUnit: numeric("cost_per_unit", { precision: 10, scale: 2 }),
  type: text("type"), // ductwork, insulation, refrigerant, etc.
  isActive: boolean("is_active").default(true),
});

export const hvacLabor = pgTable("hvac_labor", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(), // technician, installer, etc.
  description: text("description"),
  hourlyRate: numeric("hourly_rate", { precision: 10, scale: 2 }),
  averageTimePerJob: numeric("average_time_per_job", { precision: 5, scale: 2 }),
});

export const hvacAccessories = pgTable("hvac_accessories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }),
  installationTime: numeric("installation_time", { precision: 5, scale: 2 }),
  compatibility: text("compatibility").array(), // what systems this is compatible with
  isActive: boolean("is_active").default(true),
});

export const proCalculatorQuotes = pgTable("pro_calculator_quotes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  clientName: text("client_name"),
  clientEmail: text("client_email"),
  clientPhone: text("client_phone"),
  propertyType: text("property_type"),
  squareFootage: integer("square_footage"),
  equipmentDetails: jsonb("equipment_details"),
  materialsDetails: jsonb("materials_details"),
  laborDetails: jsonb("labor_details"),
  accessoriesDetails: jsonb("accessories_details"),
  totalCost: numeric("total_cost", { precision: 10, scale: 2 }),
  annualSavings: numeric("annual_savings", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  notes: text("notes"),
});

// Scheduling and Calendar System
export const jobSchedules = pgTable("job_schedules", {
  id: serial("id").primaryKey(),
  quoteId: integer("quote_id").references(() => enhancedQuotes.id),
  userId: integer("user_id").references(() => users.id),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone"),
  customerAddress: text("customer_address"),
  jobType: text("job_type").notNull(), // installation, maintenance, repair, inspection
  serviceType: text("service_type"), // furnace, ac, ductwork, etc.
  scheduledDate: timestamp("scheduled_date").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  estimatedDuration: integer("estimated_duration"), // in hours
  technician: text("technician"),
  status: text("status").default("scheduled"), // scheduled, in_progress, completed, cancelled, rescheduled
  priority: text("priority").default("normal"), // low, normal, high, emergency
  specialInstructions: text("special_instructions"),
  equipmentRequired: jsonb("equipment_required"),
  materialsRequired: jsonb("materials_required"),
  completionNotes: text("completion_notes"),
  paymentStatus: text("payment_status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const maintenancePlans = pgTable("maintenance_plans", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => users.id),
  planType: text("plan_type").notNull(), // basic, premium, comprehensive
  equipmentType: text("equipment_type").notNull(), // furnace, ac, heat_pump, boiler
  startDate: timestamp("start_date").notNull(),
  nextServiceDate: timestamp("next_service_date").notNull(),
  frequency: text("frequency").notNull(), // monthly, quarterly, biannual, annual
  annualCost: numeric("annual_cost", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").default(true),
  servicesIncluded: jsonb("services_included"),
  equipmentDetails: jsonb("equipment_details"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const enhancedQuotes = pgTable("enhanced_quotes", {
  id: serial("id").primaryKey(),
  quoteNumber: text("quote_number").notNull().unique(),
  userId: integer("user_id").references(() => users.id),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  customerAddress: text("customer_address"),
  jobDescription: text("job_description"),
  items: jsonb("items").notNull(), // Array of quote items
  laborHours: numeric("labor_hours", { precision: 5, scale: 1 }),
  laborRate: numeric("labor_rate", { precision: 10, scale: 2 }),
  markupPercentage: numeric("markup_percentage", { precision: 5, scale: 2 }),
  taxRate: numeric("tax_rate", { precision: 5, scale: 2 }),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }),
  labor: numeric("labor", { precision: 10, scale: 2 }),
  markup: numeric("markup", { precision: 10, scale: 2 }),
  tax: numeric("tax", { precision: 10, scale: 2 }),
  total: numeric("total", { precision: 10, scale: 2 }),
  depositAmount: numeric("deposit_amount", { precision: 10, scale: 2 }),
  paymentStatus: text("payment_status").default("pending"), // pending, paid, partial
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customer Records and Analytics
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  province: text("province"),
  postalCode: text("postal_code"),
  company: text("company"),
  customerType: text("customer_type").default("residential"), // residential, commercial
  source: text("source"), // website, referral, marketing
  notes: text("notes"),
  totalSpent: numeric("total_spent", { precision: 10, scale: 2 }).default("0"),
  lastContactDate: timestamp("last_contact_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact Form Submissions
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject"),
  message: text("message").notNull(),
  source: text("source").default("contact_form"), // contact_form, emergency_form, quote_request
  priority: text("priority").default("normal"), // low, normal, high, urgent
  status: text("status").default("new"), // new, in_progress, completed, closed
  assignedTo: integer("assigned_to").references(() => users.id),
  responseRequired: boolean("response_required").default(true),
  respondedAt: timestamp("responded_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Emergency Service Requests
export const emergencyRequests = pgTable("emergency_requests", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  issueDescription: text("issue_description").notNull(),
  urgencyLevel: text("urgency_level").notNull(),
  status: text("status").default("pending"),
  requestedAt: timestamp("requested_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  location: text("location"),
  priority: text("priority"),
  assignedTo: integer("assigned_to").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  emergencyType: text("emergency_type"),
  description: text("description"),
  severity: text("severity"),
  assignedTechnician: text("assigned_technician"),
  estimatedArrival: timestamp("estimated_arrival"),
  totalCost: numeric("total_cost", { precision: 10, scale: 2 }),
});

// Service Bookings
export const serviceBookings = pgTable("service_bookings", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  serviceType: text("service_type").notNull(), // installation, repair, maintenance, inspection
  description: text("description"),
  preferredDate: timestamp("preferred_date"),
  preferredTime: text("preferred_time"),
  status: text("status").default("pending"), // pending, confirmed, in_progress, completed, cancelled
  assignedTechnician: integer("assigned_technician").references(() => users.id),
  estimatedDuration: integer("estimated_duration"), // in minutes
  actualStartTime: timestamp("actual_start_time"),
  actualEndTime: timestamp("actual_end_time"),
  totalCost: numeric("total_cost", { precision: 10, scale: 2 }),
  notes: text("notes"),
  internalNotes: text("internal_notes"),
  invoiceSent: boolean("invoice_sent").default(false),
  invoiceId: text("invoice_id"),
  paymentStatus: text("payment_status").default("pending"), // pending, paid, partial, overdue
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Quote Requests
export const quoteRequests = pgTable("quote_requests", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  address: text("address"),
  serviceType: text("service_type").notNull(), // installation, repair, maintenance
  systemType: text("system_type"), // furnace, ac, heat_pump, etc
  description: text("description"),
  preferredContactMethod: text("preferred_contact_method").default("email"), // email, phone, text
  preferredContactTime: text("preferred_contact_time"),
  budget: text("budget"),
  timeline: text("timeline"),
  status: text("status").default("pending"), // pending, quoted, approved, declined, completed
  quoteAmount: numeric("quote_amount", { precision: 10, scale: 2 }),
  quotedAt: timestamp("quoted_at"),
  validUntil: timestamp("valid_until"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Job Applications Table (Simplified)
export const jobApplications = pgTable("job_applications", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  position: text("position").notNull(),
  experience: text("experience").notNull(),
  coverLetter: text("cover_letter"),
  yearsExperience: text("years_experience"),
  education: text("education"),
  certifications: text("certifications"),
  availability: text("availability"),
  salaryExpectation: text("salary_expectation"),
  referenceInfo: text("reference_info"),
  resumeUrl: text("resume_url"),
  status: text("status").default("pending"), // pending, reviewing, interviewing, hired, rejected
  appliedAt: timestamp("applied_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: integer("reviewed_by").references(() => users.id),
  notes: text("notes"), // Internal admin notes
});

// Removed duplicate userSessions - using the more comprehensive one defined above

// Website Analytics
export const pageViews = pgTable("page_views", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  sessionId: text("session_id"),
  page: text("page").notNull(),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  duration: integer("duration"), // time spent on page in seconds
  createdAt: timestamp("created_at").defaultNow(),
});

// Calculator Usage Analytics
export const calculatorUsage = pgTable("calculator_usage", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  calculatorType: text("calculator_type").notNull(), // furnace, ac, maintenance
  tier: text("tier"), // economy, mid_range, premium
  inputData: jsonb("input_data"),
  completed: boolean("completed").default(false),
  conversionToQuote: boolean("conversion_to_quote").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// System Performance Metrics
export const systemMetrics = pgTable("system_metrics", {
  id: serial("id").primaryKey(),
  metricType: text("metric_type").notNull(), // response_time, error_count, user_count
  value: numeric("value", { precision: 10, scale: 2 }).notNull(),
  metadata: jsonb("metadata"),
  recordedAt: timestamp("recorded_at").defaultNow(),
});

// Service Journey Tracking
export const serviceRequests = pgTable("service_requests", {
  id: serial("id").primaryKey(),
  requestNumber: text("request_number").notNull().unique(), // SR-2024-001
  customerId: integer("customer_id").references(() => customers.id),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  serviceType: text("service_type").notNull(), // installation, repair, maintenance, emergency
  priority: text("priority").default("normal"), // low, normal, high, urgent
  status: text("status").default("received"), // received, scheduled, in_progress, completed, cancelled
  currentStage: text("current_stage").default("contact"), // contact, quote, scheduled, dispatch, service, completion
  address: text("address").notNull(),
  description: text("description").notNull(),
  equipmentType: text("equipment_type"), // furnace, ac, heat_pump
  assignedTechnician: integer("assigned_technician").references(() => users.id),
  scheduledDate: timestamp("scheduled_date"),
  estimatedCompletion: timestamp("estimated_completion"),
  actualStartTime: timestamp("actual_start_time"),
  actualEndTime: timestamp("actual_end_time"),
  totalCost: numeric("total_cost", { precision: 10, scale: 2 }),
  paymentStatus: text("payment_status").default("pending"), // pending, paid, partial
  customerSatisfaction: integer("customer_satisfaction"), // 1-5 rating
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const serviceJourneyStages = pgTable("service_journey_stages", {
  id: serial("id").primaryKey(),
  serviceRequestId: integer("service_request_id").references(() => serviceRequests.id),
  stage: text("stage").notNull(), // contact, quote, scheduled, dispatch, service, completion
  status: text("status").notNull(), // pending, in_progress, completed, skipped
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  estimatedDuration: integer("estimated_duration"), // minutes
  actualDuration: integer("actual_duration"), // minutes
  notes: text("notes"),
  performedBy: integer("performed_by").references(() => users.id),
  customerNotified: boolean("customer_notified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const serviceUpdates = pgTable("service_updates", {
  id: serial("id").primaryKey(),
  serviceRequestId: integer("service_request_id").references(() => serviceRequests.id),
  updateType: text("update_type").notNull(), // status_change, technician_update, customer_message
  title: text("title").notNull(),
  message: text("message").notNull(),
  isVisibleToCustomer: boolean("is_visible_to_customer").default(true),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const technicianLocations = pgTable("technician_locations", {
  id: serial("id").primaryKey(),
  technicianId: integer("technician_id").references(() => users.id),
  serviceRequestId: integer("service_request_id").references(() => serviceRequests.id),
  latitude: numeric("latitude", { precision: 10, scale: 8 }),
  longitude: numeric("longitude", { precision: 11, scale: 8 }),
  accuracy: numeric("accuracy", { precision: 8, scale: 2 }), // meters
  heading: numeric("heading", { precision: 5, scale: 2 }), // degrees
  speed: numeric("speed", { precision: 5, scale: 2 }), // km/h
  estimatedArrival: timestamp("estimated_arrival"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// USER AND AUTH
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  phone: true,
  firstName: true,
  lastName: true,
  company: true,
});

export const insertUserAdminSchema = createInsertSchema(users);

// Security and Corporate Account schemas
export const insertCorporateAccountSchema = createInsertSchema(corporateAccounts);
export const insertUserSessionSchema = createInsertSchema(userSessions);
export const insertPhoneVerificationAttemptSchema = createInsertSchema(phoneVerificationAttempts);
export const insertSecurityLogSchema = createInsertSchema(securityLogs);

// PRODUCTS AND ACCESS
export const insertProductSchema = createInsertSchema(products);
export const insertProductAccessSchema = createInsertSchema(productAccess);

// FORUM
export const insertForumCategorySchema = createInsertSchema(forumCategories);
export const insertForumTopicSchema = createInsertSchema(forumTopics);
export const insertForumPostSchema = createInsertSchema(forumPosts);
export const insertForumLikeSchema = createInsertSchema(forumLikes);

// GALLERY
export const insertGalleryImageSchema = createInsertSchema(galleryImages);

// REVIEWS
export const insertCustomerReviewSchema = createInsertSchema(customerReviews);

// BLOG
export const insertBlogPostSchema = createInsertSchema(blogPosts);
export const insertBlogCategorySchema = createInsertSchema(blogCategories);

// HVAC EQUIPMENT
export const insertHvacEquipmentSchema = createInsertSchema(hvacEquipment);

// ENHANCED QUOTES
export const insertEnhancedQuoteSchema = createInsertSchema(enhancedQuotes);
export const selectEnhancedQuoteSchema = enhancedQuotes;
export const insertHvacMaterialsSchema = createInsertSchema(hvacMaterials);
export const insertHvacAccessoriesSchema = createInsertSchema(hvacAccessories);
export const insertProCalculatorQuoteSchema = createInsertSchema(proCalculatorQuotes);

// SERVICE JOURNEY TRACKING
export const insertServiceRequestSchema = createInsertSchema(serviceRequests);
export const insertServiceJourneyStageSchema = createInsertSchema(serviceJourneyStages);
export const insertServiceUpdateSchema = createInsertSchema(serviceUpdates);
export const insertTechnicianLocationSchema = createInsertSchema(technicianLocations);

// CUSTOMER DATA
export const insertCustomerSchema = createInsertSchema(customers);
export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions);
export const insertEmergencyRequestSchema = createInsertSchema(emergencyRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  requestedAt: true
});
export const insertQuoteRequestSchema = createInsertSchema(quoteRequests);
export const insertServiceBookingSchema = createInsertSchema(serviceBookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
export const insertJobApplicationSchema = createInsertSchema(jobApplications);

// TYPES
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertProductAccess = z.infer<typeof insertProductAccessSchema>;
export type ProductAccess = typeof productAccess.$inferSelect;

export type InsertForumCategory = z.infer<typeof insertForumCategorySchema>;
export type ForumCategory = typeof forumCategories.$inferSelect;

export type InsertForumTopic = z.infer<typeof insertForumTopicSchema>;
export type ForumTopic = typeof forumTopics.$inferSelect;

export type InsertForumPost = z.infer<typeof insertForumPostSchema>;
export type ForumPost = typeof forumPosts.$inferSelect;

export type InsertForumLike = z.infer<typeof insertForumLikeSchema>;
export type ForumLike = typeof forumLikes.$inferSelect;

export type InsertGalleryImage = z.infer<typeof insertGalleryImageSchema>;
export type GalleryImage = typeof galleryImages.$inferSelect;

export const insertCarouselImageSchema = createInsertSchema(carouselImages);
export type InsertCarouselImage = z.infer<typeof insertCarouselImageSchema>;
export type CarouselImage = typeof carouselImages.$inferSelect;

export type InsertCustomerReview = z.infer<typeof insertCustomerReviewSchema>;
export type CustomerReview = typeof customerReviews.$inferSelect;

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export type InsertBlogCategory = z.infer<typeof insertBlogCategorySchema>;
export type BlogCategory = typeof blogCategories.$inferSelect;

export type InsertHvacEquipment = z.infer<typeof insertHvacEquipmentSchema>;
export type HvacEquipment = typeof hvacEquipment.$inferSelect;

export type InsertHvacMaterial = z.infer<typeof insertHvacMaterialsSchema>;
export type HvacMaterial = typeof hvacMaterials.$inferSelect;

export type InsertHvacAccessory = z.infer<typeof insertHvacAccessoriesSchema>;
export type HvacAccessory = typeof hvacAccessories.$inferSelect;

export type InsertProCalculatorQuote = z.infer<typeof insertProCalculatorQuoteSchema>;
export type ProCalculatorQuote = typeof proCalculatorQuotes.$inferSelect;

// Customer and Analytics Types
export type InsertCustomer = typeof customers.$inferInsert;
export type Customer = typeof customers.$inferSelect;

export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

export type InsertEmergencyRequest = z.infer<typeof insertEmergencyRequestSchema>;
export type EmergencyRequest = typeof emergencyRequests.$inferSelect;

export type InsertQuoteRequest = typeof quoteRequests.$inferInsert;
export type QuoteRequest = typeof quoteRequests.$inferSelect;

export type InsertJobApplication = typeof jobApplications.$inferInsert;
export type JobApplication = typeof jobApplications.$inferSelect;

export type InsertUserSession = typeof userSessions.$inferInsert;
export type UserSession = typeof userSessions.$inferSelect;

export type InsertPageView = typeof pageViews.$inferInsert;
export type PageView = typeof pageViews.$inferSelect;

export type InsertServiceBooking = z.infer<typeof insertServiceBookingSchema>;
export type ServiceBooking = typeof serviceBookings.$inferSelect;

export type InsertCalculatorUsage = typeof calculatorUsage.$inferInsert;
export type CalculatorUsage = typeof calculatorUsage.$inferSelect;

export type InsertSystemMetric = typeof systemMetrics.$inferInsert;
export type SystemMetric = typeof systemMetrics.$inferSelect;

// Service Journey Tracking Types
export type InsertServiceRequest = z.infer<typeof insertServiceRequestSchema>;
export type ServiceRequest = typeof serviceRequests.$inferSelect;

export type InsertServiceJourneyStage = z.infer<typeof insertServiceJourneyStageSchema>;
export type ServiceJourneyStage = typeof serviceJourneyStages.$inferSelect;

export type InsertServiceUpdate = z.infer<typeof insertServiceUpdateSchema>;
export type ServiceUpdate = typeof serviceUpdates.$inferSelect;

export type InsertTechnicianLocation = z.infer<typeof insertTechnicianLocationSchema>;
export type TechnicianLocation = typeof technicianLocations.$inferSelect;
