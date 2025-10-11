import { sqliteTable, text, integer, real, primaryKey } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User and Authentication Tables
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
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
  hasProAccess: integer("has_pro_access", { mode: "boolean" }).default(false),
  hasPro: integer("has_pro", { mode: "boolean" }).default(false),
  isAdmin: integer("is_admin", { mode: "boolean" }).default(false),
  proAccessGrantedAt: text("pro_access_granted_at"),
  membershipType: text("membership_type"), // 'monthly', 'yearly', 'lifetime', 'corporate'
  membershipExpiresAt: text("membership_expires_at"),
  isLifetimeMember: integer("is_lifetime_member", { mode: "boolean" }).default(false),
  profileImageUrl: text("profile_image_url"),
  
  // Phone Verification & Account Security
  phoneVerified: integer("phone_verified", { mode: "boolean" }).default(false),
  phoneVerificationCode: text("phone_verification_code"),
  phoneVerificationExpiresAt: text("phone_verification_expires_at"),
  phoneVerifiedAt: text("phone_verified_at"),
  
  // Corporate Membership Features
  corporateAccountId: integer("corporate_account_id"),
  isCorporateAdmin: integer("is_corporate_admin", { mode: "boolean" }).default(false),
  
  // Device & Session Tracking
  maxSessions: integer("max_sessions").default(1), // Pro: 3, Corporate: unlimited per corporate account
  deviceFingerprint: text("device_fingerprint"), // Browser/device identification
  lastDeviceFingerprint: text("last_device_fingerprint"),
  suspiciousLoginDetected: integer("suspicious_login_detected", { mode: "boolean" }).default(false),
  accountLocked: integer("account_locked", { mode: "boolean" }).default(false),
  lockedAt: text("locked_at"),
  lockReason: text("lock_reason"),
  
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
  lastLogin: text("last_login"),
});

// Contact Submissions
export const contactSubmissions = sqliteTable("contact_submissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  serviceType: text("service_type"),
  urgency: text("urgency").default("normal"),
  preferredContactMethod: text("preferred_contact_method").default("email"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
  status: text("status").default("new"), // new, contacted, quoted, completed
  adminNotes: text("admin_notes"),
});

// Blog Posts
export const blogPosts = sqliteTable("blog_posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  author: text("author").notNull(),
  tags: text("tags"), // JSON string
  published: integer("published", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").default("CURRENT_TIMESTAMP"),
  publishedAt: text("published_at"),
});

// Team Members
export const teamMembers = sqliteTable("team_members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  role: text("role").notNull(),
  experience: text("experience"),
  description: text("description"),
  specialties: text("specialties"), // JSON string
  photoUrl: text("photo_url"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

// Products
export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  price: real("price").notNull(),
  category: text("category").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  stripeProductId: text("stripe_product_id"),
  stripePriceId: text("stripe_price_id"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = typeof contactSubmissions.$inferInsert;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = typeof teamMembers.$inferInsert;
export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

// Zod schemas
export const insertUserSchema = createInsertSchema(users);
export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions);
export const insertBlogPostSchema = createInsertSchema(blogPosts);
export const insertTeamMemberSchema = createInsertSchema(teamMembers);
export const insertProductSchema = createInsertSchema(products);
