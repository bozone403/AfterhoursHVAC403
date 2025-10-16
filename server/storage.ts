import { users, products, blogPosts, contactSubmissions, teamMembers, type User, type InsertUser, type Product, type InsertProduct, type BlogPost, type InsertBlogPost, type ContactSubmission, type InsertContactSubmission, type TeamMember, type InsertTeamMember } from "@shared/schema-sqlite";
import { eq, and, gte, lte, desc, count } from "drizzle-orm";
import { db } from "./db";
import session from "express-session";
import connectPg from "connect-pg-simple";
import pg from "pg";

const PostgresSessionStore = connectPg(session);

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // Session store
  sessionStore: session.Store;

  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;
  updateUserProAccess(userId: number, hasAccess: boolean, grantedAt: Date): Promise<User | undefined>;
  updateStripeCustomerId(userId: number, customerId: string): Promise<User | undefined>;
  checkProAccess(userId: number): Promise<boolean>;
  
  // Phone Verification methods
  updateUserPhoneVerification(phone: string, code: string, expiresAt: Date): Promise<void>;
  markPhoneAsVerified(userId: number): Promise<void>;
  getPhoneVerificationAttempts(phone: string, ipAddress?: string): Promise<any>;
  createPhoneVerificationAttempt(data: any): Promise<any>;
  
  // Session Management methods
  getActiveUserSessions(userId: number): Promise<any[]>;
  createUserSession(data: any): Promise<any>;
  getUserSessionBySessionId(sessionId: string): Promise<any>;
  updateSessionActivity(sessionId: string): Promise<void>;
  terminateUserSession(sessionId: string): Promise<void>;
  terminateOldestSession(userId: number): Promise<void>;
  
  // Security methods
  updateUserDeviceFingerprint(userId: number, fingerprint: string): Promise<void>;
  createSecurityLog(data: any): Promise<any>;
  
  // Corporate Account methods
  createCorporateAccount(data: any): Promise<any>;
  getCorporateAccount(id: number): Promise<any>;
  getCorporateAccountByUserId(userId: number): Promise<any>;
  updateCorporateAccountUserCount(accountId: number, count: number): Promise<void>;
  addUserToCorporateAccount(userId: number, corporateAccountId: number): Promise<void>;
  createCorporateInquiry(data: any): Promise<any>;
  
  // Product methods
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, data: Partial<Product>): Promise<Product | undefined>;
  
  // Product Access methods
  getUserProductAccess(userId: number): Promise<ProductAccess[]>;
  checkProductAccess(userId: number, productId: number): Promise<boolean>;
  grantProductAccess(data: InsertProductAccess): Promise<ProductAccess>;
  revokeProductAccess(userId: number, productId: number): Promise<boolean>;
  
  // Gallery methods
  getGalleryImages(): Promise<GalleryImage[]>;
  getGalleryImageById(id: number): Promise<GalleryImage | undefined>;
  createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;
  updateGalleryImage(id: number, data: Partial<GalleryImage>): Promise<GalleryImage | undefined>;
  deleteGalleryImage(id: number): Promise<boolean>;
  
  // Carousel methods
  getCarouselImages(): Promise<CarouselImage[]>;
  createCarouselImage(image: InsertCarouselImage): Promise<CarouselImage>;
  updateCarouselImage(id: number, data: Partial<CarouselImage>): Promise<CarouselImage | undefined>;
  deleteCarouselImage(id: number): Promise<boolean>;
  
  // Blog methods
  getBlogPosts(publishedOnly?: boolean): Promise<BlogPost[]>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, data: Partial<BlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  
  // Blog Category methods
  getBlogCategories(): Promise<BlogCategory[]>;
  createBlogCategory(category: InsertBlogCategory): Promise<BlogCategory>;
  
  // Forum methods
  getForumCategories(): Promise<ForumCategory[]>;
  getForumTopics(categoryId?: number): Promise<ForumTopic[]>;
  getForumPosts(topicId: number): Promise<ForumPost[]>;
  getForumTopicById(id: number): Promise<ForumTopic | undefined>;
  getForumPostById(id: number): Promise<ForumPost | undefined>;
  createForumCategory(category: InsertForumCategory): Promise<ForumCategory>;
  createForumTopic(topic: InsertForumTopic): Promise<ForumTopic>;
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  updateForumTopic(id: number, data: Partial<ForumTopic>): Promise<ForumTopic | undefined>;
  updateForumPost(id: number, data: Partial<ForumPost>): Promise<ForumPost | undefined>;
  deleteForumTopic(id: number): Promise<boolean>;
  deleteForumPost(id: number): Promise<boolean>;
  
  // Forum likes methods
  getForumLikes(topicId?: number, postId?: number): Promise<ForumLike[]>;
  createForumLike(like: InsertForumLike): Promise<ForumLike>;
  deleteForumLike(userId: number, topicId?: number, postId?: number): Promise<boolean>;
  getTopicLikeCount(topicId: number): Promise<number>;
  getPostLikeCount(postId: number): Promise<number>;
  hasUserLikedTopic(userId: number, topicId: number): Promise<boolean>;
  hasUserLikedPost(userId: number, postId: number): Promise<boolean>;
  populateForumWithHvacContent(): Promise<void>;
  
  // Reviews methods
  getReviews(approvedOnly?: boolean): Promise<CustomerReview[]>;
  createReview(review: InsertCustomerReview): Promise<CustomerReview>;
  approveReview(id: number): Promise<CustomerReview | undefined>;
  
  // HVAC Data methods
  getHvacEquipment(): Promise<HvacEquipment[]>;
  createHvacEquipment(equipment: InsertHvacEquipment): Promise<HvacEquipment>;
  updateHvacEquipment(id: number, data: Partial<HvacEquipment>): Promise<HvacEquipment | undefined>;
  
  getHvacMaterials(): Promise<HvacMaterial[]>;
  createHvacMaterial(material: InsertHvacMaterial): Promise<HvacMaterial>;
  updateHvacMaterial(id: number, data: Partial<HvacMaterial>): Promise<HvacMaterial | undefined>;
  
  getHvacAccessories(): Promise<HvacAccessory[]>;
  createHvacAccessory(accessory: InsertHvacAccessory): Promise<HvacAccessory>;
  updateHvacAccessory(id: number, data: Partial<HvacAccessory>): Promise<HvacAccessory | undefined>;
  
  // Customer Records and Analytics methods
  getCustomers(): Promise<Customer[]>;
  getCustomerById(id: number): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, data: Partial<Customer>): Promise<Customer | undefined>;
  
  getContactSubmissions(status?: string): Promise<ContactSubmission[]>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  updateContactSubmissionStatus(id: number, status: string): Promise<ContactSubmission | undefined>;
  
  // Team Member methods
  getTeamMembers(): Promise<TeamMember[]>;
  getTeamMemberById(id: number): Promise<TeamMember | undefined>;
  createTeamMember(member: InsertTeamMember): Promise<TeamMember>;
  updateTeamMember(id: number, data: Partial<TeamMember>): Promise<TeamMember | undefined>;
  deleteTeamMember(id: number): Promise<boolean>;
  
  getEmergencyRequests(): Promise<EmergencyRequest[]>;
  getAllEmergencyRequests(): Promise<EmergencyRequest[]>;
  getUserEmergencyRequests(userId: number): Promise<EmergencyRequest[]>;
  searchEmergencyRequests(query: string): Promise<EmergencyRequest[]>;
  createEmergencyRequest(request: InsertEmergencyRequest): Promise<EmergencyRequest>;
  updateEmergencyRequest(id: number, data: Partial<EmergencyRequest>): Promise<EmergencyRequest | undefined>;
  updateEmergencyRequestStatus(id: number, status: string): Promise<EmergencyRequest | undefined>;
  
  // Job Application methods
  getJobApplications(): Promise<JobApplication[]>;
  getAllJobApplications(): Promise<JobApplication[]>;
  getJobApplicationById(id: number): Promise<JobApplication | undefined>;
  createJobApplication(application: InsertJobApplication): Promise<JobApplication>;
  updateJobApplication(id: number, data: Partial<JobApplication>): Promise<JobApplication | undefined>;
  
  getQuoteRequests(status?: string): Promise<QuoteRequest[]>;
  createQuoteRequest(request: InsertQuoteRequest): Promise<QuoteRequest>;
  updateQuoteRequestStatus(id: number, status: string, quoteAmount?: number): Promise<QuoteRequest | undefined>;
  
  // Analytics methods
  getDashboardStats(dateRange: string): Promise<any>;
  getAnalyticsData(dateRange: string): Promise<any>;
  recordPageView(data: InsertPageView): Promise<PageView>;
  recordCalculatorUsage(data: InsertCalculatorUsage): Promise<CalculatorUsage>;
  recordSystemMetric(data: InsertSystemMetric): Promise<SystemMetric>;
  
  // User session tracking
  createUserSession(data: InsertUserSession): Promise<UserSession>;
  endUserSession(sessionId: string): Promise<void>;

  // Enhanced Quotes methods
  getEnhancedQuotes(): Promise<any[]>;
  getAllQuotes(): Promise<any[]>;
  getEnhancedQuoteById(id: number): Promise<any | undefined>;
  getEnhancedQuoteByNumber(quoteNumber: string): Promise<any | undefined>;
  createEnhancedQuote(quote: any): Promise<any>;
  updateEnhancedQuote(id: number, data: any): Promise<any | undefined>;
  
  // Service Booking methods
  getAllServiceBookings(): Promise<ServiceBooking[]>;
  getServiceBookingById(id: number): Promise<ServiceBooking | undefined>;
  createServiceBooking(booking: InsertServiceBooking): Promise<ServiceBooking>;
  updateServiceBooking(id: number, data: Partial<ServiceBooking>): Promise<ServiceBooking | undefined>;
  updateServiceBookingStatus(id: number, status: string): Promise<ServiceBooking | undefined>;
  
  // Job Scheduling methods
  getJobSchedules(userId?: number): Promise<any[]>;
  getJobScheduleById(id: number): Promise<any | undefined>;
  createJobSchedule(schedule: any): Promise<any>;
  updateJobSchedule(id: number, data: any): Promise<any | undefined>;
  deleteJobSchedule(id: number): Promise<boolean>;
  getJobSchedulesByDate(startDate: Date, endDate: Date): Promise<any[]>;
  
  // Maintenance Plans methods
  getMaintenancePlans(customerId?: number): Promise<any[]>;
  getMaintenancePlanById(id: number): Promise<any | undefined>;
  createMaintenancePlan(plan: any): Promise<any>;
  updateMaintenancePlan(id: number, data: any): Promise<any | undefined>;
  deleteMaintenancePlan(id: number): Promise<boolean>;
  
  // Service Journey Tracking methods
  getServiceRequests(status?: string): Promise<ServiceRequest[]>;
  getServiceRequestById(id: number): Promise<ServiceRequest | undefined>;
  getServiceRequestByNumber(requestNumber: string): Promise<ServiceRequest | undefined>;
  createServiceRequest(request: InsertServiceRequest): Promise<ServiceRequest>;
  updateServiceRequest(id: number, data: Partial<ServiceRequest>): Promise<ServiceRequest | undefined>;
  updateServiceRequestStage(id: number, stage: string): Promise<ServiceRequest | undefined>;
  
  getServiceJourneyStages(serviceRequestId: number): Promise<ServiceJourneyStage[]>;
  createServiceJourneyStage(stage: InsertServiceJourneyStage): Promise<ServiceJourneyStage>;
  updateServiceJourneyStage(id: number, data: Partial<ServiceJourneyStage>): Promise<ServiceJourneyStage | undefined>;
  completeServiceJourneyStage(serviceRequestId: number, stage: string): Promise<ServiceJourneyStage | undefined>;
  
  getServiceUpdates(serviceRequestId: number): Promise<ServiceUpdate[]>;
  createServiceUpdate(update: InsertServiceUpdate): Promise<ServiceUpdate>;
  
  getTechnicianLocation(technicianId: number, serviceRequestId?: number): Promise<TechnicianLocation | undefined>;
  updateTechnicianLocation(location: InsertTechnicianLocation): Promise<TechnicianLocation>;
  getActiveServiceRequests(technicianId?: number): Promise<ServiceRequest[]>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    const pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
    });
    
    this.sessionStore = new PostgresSessionStore({
      pool: pool,
      createTableIfMissing: true,
      tableName: 'sessions'
    });
  }

  // USER METHODS
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        role: "user",
        createdAt: new Date(),
      })
      .returning();
    return user;
  }
  
  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    // Don't add updatedAt as it's not in our schema
    const [updatedUser] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async updateUserProAccess(userId: number, hasAccess: boolean, grantedAt: Date): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({
        hasProAccess: hasAccess,
        proAccessGrantedAt: grantedAt,
      })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }
  
  async updateStripeCustomerId(userId: number, customerId: string): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({
        stripeCustomerId: customerId,
      })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }
  
  async checkProAccess(userId: number): Promise<boolean> {
    const [user] = await db
      .select({ hasAccess: users.hasProAccess })
      .from(users)
      .where(eq(users.id, userId));
    return user?.hasAccess || false;
  }
  
  // PRODUCT METHODS
  async getProducts(): Promise<Product[]> {
    return db.select().from(products).where(eq(products.isActive, true));
  }
  
  async getProductById(id: number): Promise<Product | undefined> {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id));
    return product;
  }
  
  async getProductsByCategory(category: string): Promise<Product[]> {
    return db
      .select()
      .from(products)
      .where(and(
        eq(products.category, category),
        eq(products.isActive, true)
      ));
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values(product)
      .returning();
    return newProduct;
  }
  
  async updateProduct(id: number, data: Partial<Product>): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set(data)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }
  
  // PRODUCT ACCESS METHODS
  async getUserProductAccess(userId: number): Promise<ProductAccess[]> {
    return db
      .select()
      .from(productAccess)
      .where(and(
        eq(productAccess.userId, userId),
        eq(productAccess.active, true)
      ));
  }
  
  async checkProductAccess(userId: number, productId: number): Promise<boolean> {
    const [access] = await db
      .select()
      .from(productAccess)
      .where(and(
        eq(productAccess.userId, userId),
        eq(productAccess.productId, productId),
        eq(productAccess.active, true)
      ));
    return !!access;
  }
  
  async grantProductAccess(data: InsertProductAccess): Promise<ProductAccess> {
    const [access] = await db
      .insert(productAccess)
      .values(data)
      .returning();
    return access;
  }
  
  async revokeProductAccess(userId: number, productId: number): Promise<boolean> {
    const result = await db
      .update(productAccess)
      .set({ active: false })
      .where(and(
        eq(productAccess.userId, userId),
        eq(productAccess.productId, productId)
      ));
    return !!result;
  }
  
  // GALLERY METHODS
  async getGalleryImages(): Promise<GalleryImage[]> {
    return db
      .select()
      .from(galleryImages)
      .where(eq(galleryImages.isActive, true));
  }
  
  async getGalleryImageById(id: number): Promise<GalleryImage | undefined> {
    const [image] = await db
      .select()
      .from(galleryImages)
      .where(eq(galleryImages.id, id));
    return image;
  }
  
  async createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage> {
    const [newImage] = await db
      .insert(galleryImages)
      .values(image)
      .returning();
    return newImage;
  }
  
  async updateGalleryImage(id: number, data: Partial<GalleryImage>): Promise<GalleryImage | undefined> {
    const [updatedImage] = await db
      .update(galleryImages)
      .set(data)
      .where(eq(galleryImages.id, id))
      .returning();
    return updatedImage;
  }
  
  async deleteGalleryImage(id: number): Promise<boolean> {
    const result = await db
      .update(galleryImages)
      .set({ isActive: false })
      .where(eq(galleryImages.id, id));
    return !!result;
  }

  // CAROUSEL METHODS
  async getCarouselImages(): Promise<CarouselImage[]> {
    return db
      .select()
      .from(carouselImages)
      .where(eq(carouselImages.isActive, true))
      .orderBy(carouselImages.sortOrder);
  }

  async createCarouselImage(image: InsertCarouselImage): Promise<CarouselImage> {
    const [newImage] = await db
      .insert(carouselImages)
      .values(image)
      .returning();
    return newImage;
  }

  async updateCarouselImage(id: number, data: Partial<CarouselImage>): Promise<CarouselImage | undefined> {
    const [updatedImage] = await db
      .update(carouselImages)
      .set(data)
      .where(eq(carouselImages.id, id))
      .returning();
    return updatedImage;
  }

  async deleteCarouselImage(id: number): Promise<boolean> {
    const result = await db
      .update(carouselImages)
      .set({ isActive: false })
      .where(eq(carouselImages.id, id));
    return !!result;
  }
  
  // BLOG METHODS
  async getBlogPosts(publishedOnly: boolean = true): Promise<BlogPost[]> {
    if (publishedOnly) {
      return await db.select().from(blogPosts).where(eq(blogPosts.isPublished, true)).orderBy(desc(blogPosts.createdAt)).all();
    } else {
      return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt)).all();
    }
  }
  
  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id));
    return post;
  }
  
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug));
    return post;
  }
  
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db
      .insert(blogPosts)
      .values(post)
      .returning();
    return newPost;
  }
  
  async updateBlogPost(id: number, data: Partial<BlogPost>): Promise<BlogPost | undefined> {
    // updatedAt is in the schema for blog posts
    const [updatedPost] = await db
      .update(blogPosts)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(blogPosts.id, id))
      .returning();
    return updatedPost;
  }
  
  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db
      .delete(blogPosts)
      .where(eq(blogPosts.id, id));
    return !!result;
  }
  
  // BLOG CATEGORY METHODS
  async getBlogCategories(): Promise<BlogCategory[]> {
    return db.select().from(blogCategories);
  }
  
  async createBlogCategory(category: InsertBlogCategory): Promise<BlogCategory> {
    const [newCategory] = await db
      .insert(blogCategories)
      .values(category)
      .returning();
    return newCategory;
  }
  
  // FORUM METHODS
  async getForumCategories(): Promise<ForumCategory[]> {
    try {
      return await this.db.select().from(schema.forumCategories).where(eq(forumCategories.isActive, true));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  async getForumTopics(categoryId?: number): Promise<ForumTopic[]> {
    try {
      if (categoryId) {
        return await this.db.select().from(schema.forumTopics).where(eq(schema.forumTopics.categoryId, categoryId));
      }
      return await this.db.select().from(schema.forumTopics);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  async getForumPosts(topicId?: number): Promise<(ForumPost & { username: string })[]> {
    if (topicId === 0) {
      // Get all forum posts for admin
      const results = await db
        .select({
          id: forumPosts.id,
          topicId: forumPosts.topicId,
          userId: forumPosts.userId,
          content: forumPosts.content,
          displayName: forumPosts.displayName,
          isEdited: forumPosts.isEdited,
          createdAt: forumPosts.createdAt,
          updatedAt: forumPosts.updatedAt,
          username: users.username
        })
        .from(forumPosts)
        .leftJoin(users, eq(forumPosts.userId, users.id))
        .orderBy(desc(forumPosts.createdAt));
      
      return results.map(result => ({
        ...result,
        username: result.displayName || result.username || 'Unknown User'
      }));
    }
    const results = await db
      .select({
        id: forumPosts.id,
        topicId: forumPosts.topicId,
        userId: forumPosts.userId,
        content: forumPosts.content,
        displayName: forumPosts.displayName,
        isEdited: forumPosts.isEdited,
        createdAt: forumPosts.createdAt,
        updatedAt: forumPosts.updatedAt,
        username: users.username
      })
      .from(forumPosts)
      .leftJoin(users, eq(forumPosts.userId, users.id))
      .where(eq(forumPosts.topicId, topicId))
      .orderBy(forumPosts.createdAt);
    
    return results.map(result => ({
      ...result,
      username: result.displayName || result.username || 'Unknown User'
    }));
  }
  
  async createForumCategory(category: InsertForumCategory): Promise<ForumCategory> {
    const [newCategory] = await db
      .insert(forumCategories)
      .values(category)
      .returning();
    return newCategory;
  }
  
  async createForumTopic(topic: InsertForumTopic): Promise<ForumTopic> {
    const [result] = await this.db
      .insert(schema.forumTopics)
      .values(topic)
      .returning();
    return result;
  }
  
  async createForumPost(post: InsertForumPost): Promise<ForumPost> {
    const [newPost] = await db
      .insert(forumPosts)
      .values(post)
      .returning();
    return newPost;
  }

  async getForumTopicById(id: number): Promise<ForumTopic | undefined> {
    const [topic] = await db
      .select()
      .from(forumTopics)
      .where(eq(forumTopics.id, id));
    return topic;
  }

  async updateForumTopic(id: number, data: Partial<ForumTopic>): Promise<ForumTopic | undefined> {
    const [updatedTopic] = await db
      .update(forumTopics)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(forumTopics.id, id))
      .returning();
    return updatedTopic;
  }

  async deleteForumTopic(id: number): Promise<boolean> {
    await db.delete(forumTopics).where(eq(forumTopics.id, id));
    await db.delete(forumPosts).where(eq(forumPosts.topicId, id));
    return true;
  }

  async getForumPostById(id: number): Promise<ForumPost | undefined> {
    const [post] = await db
      .select()
      .from(forumPosts)
      .where(eq(forumPosts.id, id));
    return post;
  }

  async updateForumPost(id: number, data: Partial<ForumPost>): Promise<ForumPost | undefined> {
    const [updatedPost] = await db
      .update(forumPosts)
      .set({ ...data, updatedAt: new Date(), isEdited: true })
      .where(eq(forumPosts.id, id))
      .returning();
    return updatedPost;
  }

  async deleteForumPost(id: number): Promise<boolean> {
    // Delete associated likes first
    await db.delete(forumLikes).where(eq(forumLikes.postId, id));
    // Delete the post
    await db.delete(forumPosts).where(eq(forumPosts.id, id));
    return true;
  }

  // FORUM LIKES METHODS
  async getForumLikes(topicId?: number, postId?: number): Promise<ForumLike[]> {
    const conditions = [];
    if (topicId) conditions.push(eq(forumLikes.topicId, topicId));
    if (postId) conditions.push(eq(forumLikes.postId, postId));
    
    return db
      .select()
      .from(forumLikes)
      .where(conditions.length > 0 ? and(...conditions) : undefined);
  }

  async createForumLike(like: InsertForumLike): Promise<ForumLike> {
    const [newLike] = await db
      .insert(forumLikes)
      .values(like)
      .returning();
    return newLike;
  }

  async deleteForumLike(userId: number, topicId?: number, postId?: number): Promise<boolean> {
    const conditions = [eq(forumLikes.userId, userId)];
    if (topicId) conditions.push(eq(forumLikes.topicId, topicId));
    if (postId) conditions.push(eq(forumLikes.postId, postId));
    
    await db.delete(forumLikes).where(and(...conditions));
    return true;
  }

  async getTopicLikeCount(topicId: number): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(forumLikes)
      .where(eq(forumLikes.topicId, topicId));
    return result?.count || 0;
  }

  async getPostLikeCount(postId: number): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(forumLikes)
      .where(eq(forumLikes.postId, postId));
    return result?.count || 0;
  }

  async hasUserLikedTopic(userId: number, topicId: number): Promise<boolean> {
    const [result] = await db
      .select()
      .from(forumLikes)
      .where(and(
        eq(forumLikes.userId, userId),
        eq(forumLikes.topicId, topicId)
      ));
    return !!result;
  }

  async hasUserLikedPost(userId: number, postId: number): Promise<boolean> {
    const [result] = await db
      .select()
      .from(forumLikes)
      .where(and(
        eq(forumLikes.userId, userId),
        eq(forumLikes.postId, postId)
      ));
    return !!result;
  }
  
  // REVIEWS METHODS
  async getReviews(approvedOnly: boolean = true): Promise<CustomerReview[]> {
    const query = approvedOnly ? 
      and(eq(customerReviews.isApproved, true)) : 
      undefined;
    
    return db
      .select()
      .from(customerReviews)
      .where(query);
  }
  
  async createReview(review: InsertCustomerReview): Promise<CustomerReview> {
    const [newReview] = await db
      .insert(customerReviews)
      .values(review)
      .returning();
    return newReview;
  }
  
  async approveReview(id: number): Promise<CustomerReview | undefined> {
    const [updatedReview] = await db
      .update(customerReviews)
      .set({ isApproved: true })
      .where(eq(customerReviews.id, id))
      .returning();
    return updatedReview;
  }

  // HVAC Data methods
  async getHvacEquipment(): Promise<HvacEquipment[]> {
    return await db.select().from(hvacEquipment);
  }

  async createHvacEquipment(equipment: InsertHvacEquipment): Promise<HvacEquipment> {
    const [newEquipment] = await db
      .insert(hvacEquipment)
      .values(equipment)
      .returning();
    return newEquipment;
  }

  async updateHvacEquipment(id: number, data: Partial<HvacEquipment>): Promise<HvacEquipment | undefined> {
    const [updated] = await db
      .update(hvacEquipment)
      .set(data)
      .where(eq(hvacEquipment.id, id))
      .returning();
    return updated;
  }

  async getHvacMaterials(): Promise<HvacMaterial[]> {
    return await db.select().from(hvacMaterials);
  }

  async createHvacMaterial(material: InsertHvacMaterial): Promise<HvacMaterial> {
    const [newMaterial] = await db
      .insert(hvacMaterials)
      .values(material)
      .returning();
    return newMaterial;
  }

  async updateHvacMaterial(id: number, data: Partial<HvacMaterial>): Promise<HvacMaterial | undefined> {
    const [updated] = await db
      .update(hvacMaterials)
      .set(data)
      .where(eq(hvacMaterials.id, id))
      .returning();
    return updated;
  }

  async getHvacAccessories(): Promise<HvacAccessory[]> {
    return await db.select().from(hvacAccessories);
  }

  async createHvacAccessory(accessory: InsertHvacAccessory): Promise<HvacAccessory> {
    const [newAccessory] = await db
      .insert(hvacAccessories)
      .values(accessory)
      .returning();
    return newAccessory;
  }

  async updateHvacAccessory(id: number, data: Partial<HvacAccessory>): Promise<HvacAccessory | undefined> {
    const [updated] = await db
      .update(hvacAccessories)
      .set(data)
      .where(eq(hvacAccessories.id, id))
      .returning();
    return updated;
  }

  // Customer Records and Analytics implementation
  async getCustomers(): Promise<Customer[]> {
    return await db.select().from(customers).orderBy(desc(customers.createdAt));
  }

  async getCustomerById(id: number): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer;
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db
      .insert(customers)
      .values(customer)
      .returning();
    return newCustomer;
  }

  async updateCustomer(id: number, data: Partial<Customer>): Promise<Customer | undefined> {
    const [updated] = await db
      .update(customers)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(customers.id, id))
      .returning();
    return updated;
  }

  async getContactSubmissions(status?: string): Promise<ContactSubmission[]> {
    const query = db.select().from(contactSubmissions);
    if (status && status !== 'all') {
      query.where(eq(contactSubmissions.status, status));
    }
    return await query.orderBy(desc(contactSubmissions.createdAt));
  }

  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const [newSubmission] = await db
      .insert(contactSubmissions)
      .values(submission)
      .returning();
    return newSubmission;
  }

  async updateContactSubmissionStatus(id: number, status: string): Promise<ContactSubmission | undefined> {
    const [updated] = await db
      .update(contactSubmissions)
      .set({ status, respondedAt: status === 'completed' ? new Date() : undefined })
      .where(eq(contactSubmissions.id, id))
      .returning();
    return updated;
  }

  // TEAM MEMBER METHODS
  async getTeamMembers(): Promise<TeamMember[]> {
    return await db.select().from(teamMembers);
  }

  async getTeamMemberById(id: number): Promise<TeamMember | undefined> {
    const [member] = await db.select().from(teamMembers).where(eq(teamMembers.id, id));
    return member;
  }

  async createTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const [newMember] = await db
      .insert(teamMembers)
      .values(member)
      .returning();
    return newMember;
  }

  async updateTeamMember(id: number, data: Partial<TeamMember>): Promise<TeamMember | undefined> {
    const [updated] = await db
      .update(teamMembers)
      .set(data)
      .where(eq(teamMembers.id, id))
      .returning();
    return updated;
  }

  async deleteTeamMember(id: number): Promise<boolean> {
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
    return true;
  }

  async getEmergencyRequests(): Promise<EmergencyRequest[]> {
    return await db.select().from(emergencyRequests).orderBy(desc(emergencyRequests.createdAt));
  }

  async createEmergencyRequest(request: InsertEmergencyRequest): Promise<EmergencyRequest> {
    const [newRequest] = await db
      .insert(emergencyRequests)
      .values(request)
      .returning();
    return newRequest;
  }

  async updateEmergencyRequestStatus(id: number, status: string): Promise<EmergencyRequest | undefined> {
    const [updated] = await db
      .update(emergencyRequests)
      .set({ status, completedAt: status === 'completed' ? new Date() : undefined })
      .where(eq(emergencyRequests.id, id))
      .returning();
    return updated;
  }

  async getQuoteRequests(status?: string): Promise<QuoteRequest[]> {
    const query = db.select().from(quoteRequests);
    if (status && status !== 'all') {
      query.where(eq(quoteRequests.status, status));
    }
    return await query.orderBy(desc(quoteRequests.createdAt));
  }

  async createQuoteRequest(request: InsertQuoteRequest): Promise<QuoteRequest> {
    const [newRequest] = await db
      .insert(quoteRequests)
      .values(request)
      .returning();
    return newRequest;
  }

  async updateQuoteRequestStatus(id: number, status: string, quoteAmount?: number): Promise<QuoteRequest | undefined> {
    const updateData: any = { status };
    if (quoteAmount) {
      updateData.quoteAmount = quoteAmount;
      updateData.quotedAt = new Date();
    }
    
    const [updated] = await db
      .update(quoteRequests)
      .set(updateData)
      .where(eq(quoteRequests.id, id))
      .returning();
    return updated;
  }

  async getDashboardStats(dateRange: string): Promise<any> {
    const now = new Date();
    let startDate = new Date();
    
    switch(dateRange) {
      case '1d':
        startDate.setDate(now.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // Get counts for different types of inquiries
    const [contactCount] = await db
      .select({ count: count() })
      .from(contactSubmissions)
      .where(gte(contactSubmissions.createdAt, startDate));

    const [emergencyCount] = await db
      .select({ count: count() })
      .from(emergencyRequests)
      .where(gte(emergencyRequests.createdAt, startDate));

    const [quoteCount] = await db
      .select({ count: count() })
      .from(quoteRequests)
      .where(gte(quoteRequests.createdAt, startDate));

    const [calcUsageCount] = await db
      .select({ count: count() })
      .from(calculatorUsage)
      .where(gte(calculatorUsage.createdAt, startDate));

    return {
      totalInquiries: contactCount.count + emergencyCount.count + quoteCount.count,
      emergencyRequests: emergencyCount.count,
      quoteRequests: quoteCount.count,
      calculatorUsage: calcUsageCount.count,
      inquiriesGrowth: 12, // TODO: Calculate actual growth
      pendingEmergencies: 0, // TODO: Get actual pending count
      totalQuoteValue: 0, // TODO: Calculate actual quote value
      calculatorConversion: 15, // TODO: Calculate actual conversion rate
    };
  }

  async getAnalyticsData(dateRange: string): Promise<any> {
    const now = new Date();
    let startDate = new Date();
    
    switch(dateRange) {
      case '1d':
        startDate.setDate(now.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    const [pageViewCount] = await db
      .select({ count: count() })
      .from(pageViews)
      .where(gte(pageViews.createdAt, startDate));

    const [calculatorCount] = await db
      .select({ count: count() })
      .from(calculatorUsage)
      .where(gte(calculatorUsage.createdAt, startDate));

    const [completedCalc] = await db
      .select({ count: count() })
      .from(calculatorUsage)
      .where(and(
        gte(calculatorUsage.createdAt, startDate),
        eq(calculatorUsage.completed, true)
      ));

    return {
      pageViews: pageViewCount.count,
      uniqueVisitors: Math.floor(pageViewCount.count * 0.7), // Estimate
      avgSessionDuration: '4m 32s',
      bounceRate: '45%',
      totalCalculations: calculatorCount.count,
      completedCalculations: completedCalc.count,
      popularCalculator: 'Furnace Calculator',
      calculatorToQuote: '12%',
    };
  }

  async recordPageView(data: InsertPageView): Promise<PageView> {
    const [pageView] = await db
      .insert(pageViews)
      .values(data)
      .returning();
    return pageView;
  }

  async recordCalculatorUsage(data: InsertCalculatorUsage): Promise<CalculatorUsage> {
    const [usage] = await db
      .insert(calculatorUsage)
      .values(data)
      .returning();
    return usage;
  }

  async recordSystemMetric(data: InsertSystemMetric): Promise<SystemMetric> {
    const [metric] = await db
      .insert(systemMetrics)
      .values(data)
      .returning();
    return metric;
  }

  async createUserSession(data: InsertUserSession): Promise<UserSession> {
    const [session] = await db
      .insert(userSessions)
      .values(data)
      .returning();
    return session;
  }

  async endUserSession(sessionId: string): Promise<void> {
    await db
      .update(userSessions)
      .set({ isActive: false })
      .where(eq(userSessions.sessionId, sessionId));
  }

  // Enhanced Quotes Implementation
  async getEnhancedQuotes(): Promise<any[]> {
    return await db.select().from(enhancedQuotes).orderBy(desc(enhancedQuotes.createdAt));
  }

  async getAllQuotes(): Promise<any[]> {
    return await db.select().from(enhancedQuotes).orderBy(desc(enhancedQuotes.createdAt));
  }

  async getEnhancedQuoteById(id: number): Promise<any | undefined> {
    const [quote] = await db.select().from(enhancedQuotes).where(eq(enhancedQuotes.id, id));
    return quote;
  }

  async getEnhancedQuoteByNumber(quoteNumber: string): Promise<any | undefined> {
    const [quote] = await db.select().from(enhancedQuotes).where(eq(enhancedQuotes.quoteNumber, quoteNumber));
    return quote;
  }

  async createEnhancedQuote(quote: any): Promise<any> {
    const [newQuote] = await db
      .insert(enhancedQuotes)
      .values({
        ...quote,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return newQuote;
  }

  async updateEnhancedQuote(id: number, data: any): Promise<any | undefined> {
    const [updatedQuote] = await db
      .update(enhancedQuotes)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(enhancedQuotes.id, id))
      .returning();
    return updatedQuote;
  }

  // Service Journey Tracking Implementation
  async getServiceRequests(status?: string): Promise<ServiceRequest[]> {
    if (status) {
      return await db.select().from(serviceRequests)
        .where(eq(serviceRequests.status, status))
        .orderBy(desc(serviceRequests.createdAt));
    }
    
    return await db.select().from(serviceRequests)
      .orderBy(desc(serviceRequests.createdAt));
  }

  async getServiceRequestById(id: number): Promise<ServiceRequest | undefined> {
    const [request] = await db.select().from(serviceRequests).where(eq(serviceRequests.id, id));
    return request;
  }

  async getServiceRequestByNumber(requestNumber: string): Promise<ServiceRequest | undefined> {
    const [request] = await db.select().from(serviceRequests).where(eq(serviceRequests.requestNumber, requestNumber));
    return request;
  }

  async createServiceRequest(request: InsertServiceRequest): Promise<ServiceRequest> {
    const [newRequest] = await db
      .insert(serviceRequests)
      .values({
        ...request,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return newRequest;
  }

  async updateServiceRequest(id: number, data: Partial<ServiceRequest>): Promise<ServiceRequest | undefined> {
    const [updatedRequest] = await db
      .update(serviceRequests)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(serviceRequests.id, id))
      .returning();
    return updatedRequest;
  }

  async updateServiceRequestStage(id: number, stage: string): Promise<ServiceRequest | undefined> {
    const [updatedRequest] = await db
      .update(serviceRequests)
      .set({ currentStage: stage, updatedAt: new Date() })
      .where(eq(serviceRequests.id, id))
      .returning();
    return updatedRequest;
  }

  async getServiceJourneyStages(serviceRequestId: number): Promise<ServiceJourneyStage[]> {
    return await db
      .select()
      .from(serviceJourneyStages)
      .where(eq(serviceJourneyStages.serviceRequestId, serviceRequestId))
      .orderBy(serviceJourneyStages.createdAt);
  }

  async createServiceJourneyStage(stage: InsertServiceJourneyStage): Promise<ServiceJourneyStage> {
    const [newStage] = await db
      .insert(serviceJourneyStages)
      .values({
        ...stage,
        createdAt: new Date(),
      })
      .returning();
    return newStage;
  }

  async updateServiceJourneyStage(id: number, data: Partial<ServiceJourneyStage>): Promise<ServiceJourneyStage | undefined> {
    const [updatedStage] = await db
      .update(serviceJourneyStages)
      .set(data)
      .where(eq(serviceJourneyStages.id, id))
      .returning();
    return updatedStage;
  }

  // Job Scheduling implementation
  async getJobSchedules(userId?: number): Promise<any[]> {
    if (userId) {
      return await db.select().from(jobSchedules)
        .where(eq(jobSchedules.userId, userId))
        .orderBy(jobSchedules.scheduledDate);
    }
    return await db.select().from(jobSchedules)
      .orderBy(jobSchedules.scheduledDate);
  }

  async getJobScheduleById(id: number): Promise<any | undefined> {
    const [schedule] = await db.select().from(jobSchedules).where(eq(jobSchedules.id, id));
    return schedule;
  }

  async createJobSchedule(schedule: any): Promise<any> {
    const [newSchedule] = await db
      .insert(jobSchedules)
      .values({
        ...schedule,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return newSchedule;
  }

  async updateJobSchedule(id: number, data: any): Promise<any | undefined> {
    const [updatedSchedule] = await db
      .update(jobSchedules)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(jobSchedules.id, id))
      .returning();
    return updatedSchedule;
  }

  async deleteJobSchedule(id: number): Promise<boolean> {
    const result = await db.delete(jobSchedules).where(eq(jobSchedules.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getJobSchedulesByDate(startDate: Date, endDate: Date): Promise<any[]> {
    return await db.select().from(jobSchedules)
      .where(and(
        gte(jobSchedules.scheduledDate, startDate),
        lte(jobSchedules.scheduledDate, endDate)
      ))
      .orderBy(jobSchedules.scheduledDate);
  }

  // Maintenance Plans implementation
  async getMaintenancePlans(customerId?: number): Promise<any[]> {
    if (customerId) {
      return await db.select().from(maintenancePlans)
        .where(eq(maintenancePlans.customerId, customerId))
        .orderBy(maintenancePlans.nextServiceDate);
    }
    return await db.select().from(maintenancePlans)
      .orderBy(maintenancePlans.nextServiceDate);
  }

  async getMaintenancePlanById(id: number): Promise<any | undefined> {
    const [plan] = await db.select().from(maintenancePlans).where(eq(maintenancePlans.id, id));
    return plan;
  }

  async createMaintenancePlan(plan: any): Promise<any> {
    const [newPlan] = await db
      .insert(maintenancePlans)
      .values({
        ...plan,
        createdAt: new Date(),
      })
      .returning();
    return newPlan;
  }

  async updateMaintenancePlan(id: number, data: any): Promise<any | undefined> {
    const [updatedPlan] = await db
      .update(maintenancePlans)
      .set(data)
      .where(eq(maintenancePlans.id, id))
      .returning();
    return updatedPlan;
  }

  async deleteMaintenancePlan(id: number): Promise<boolean> {
    const result = await db.delete(maintenancePlans).where(eq(maintenancePlans.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async completeServiceJourneyStage(serviceRequestId: number, stage: string): Promise<ServiceJourneyStage | undefined> {
    const [updatedStage] = await db
      .update(serviceJourneyStages)
      .set({ 
        status: "completed", 
        completedAt: new Date(),
        actualDuration: Math.floor((Date.now() - new Date().getTime()) / 60000) // rough calculation
      })
      .where(and(
        eq(serviceJourneyStages.serviceRequestId, serviceRequestId),
        eq(serviceJourneyStages.stage, stage)
      ))
      .returning();
    return updatedStage;
  }

  async getServiceUpdates(serviceRequestId: number): Promise<ServiceUpdate[]> {
    return await db
      .select()
      .from(serviceUpdates)
      .where(eq(serviceUpdates.serviceRequestId, serviceRequestId))
      .orderBy(desc(serviceUpdates.createdAt));
  }

  async createServiceUpdate(update: InsertServiceUpdate): Promise<ServiceUpdate> {
    const [newUpdate] = await db
      .insert(serviceUpdates)
      .values({
        ...update,
        createdAt: new Date(),
      })
      .returning();
    return newUpdate;
  }

  async getTechnicianLocation(technicianId: number, serviceRequestId?: number): Promise<TechnicianLocation | undefined> {
    if (serviceRequestId) {
      const [location] = await db.select().from(technicianLocations)
        .where(and(
          eq(technicianLocations.technicianId, technicianId),
          eq(technicianLocations.serviceRequestId, serviceRequestId)
        ))
        .orderBy(desc(technicianLocations.lastUpdated))
        .limit(1);
      return location;
    }
    
    const [location] = await db.select().from(technicianLocations)
      .where(eq(technicianLocations.technicianId, technicianId))
      .orderBy(desc(technicianLocations.lastUpdated))
      .limit(1);
    return location;
  }

  async updateTechnicianLocation(location: InsertTechnicianLocation): Promise<TechnicianLocation> {
    const [updatedLocation] = await db
      .insert(technicianLocations)
      .values({
        ...location,
        lastUpdated: new Date(),
      })
      .onConflictDoUpdate({
        target: [technicianLocations.technicianId, technicianLocations.serviceRequestId],
        set: {
          ...location,
          lastUpdated: new Date(),
        },
      })
      .returning();
    return updatedLocation;
  }

  async getActiveServiceRequests(technicianId?: number): Promise<ServiceRequest[]> {
    if (technicianId) {
      const results = await db
        .select()
        .from(serviceRequests)
        .where(and(
          eq(serviceRequests.status, "in_progress"),
          eq(serviceRequests.assignedTechnician, technicianId)
        ))
        .orderBy(desc(serviceRequests.createdAt));
      return results;
    }
    
    const results = await db
      .select()
      .from(serviceRequests)
      .where(eq(serviceRequests.status, "in_progress"))
      .orderBy(desc(serviceRequests.createdAt));
    return results;
  }

  async populateForumWithHvacContent(): Promise<void> {
    // Check if commercial content already exists
    const existingCommercialTopics = await db.select()
      .from(forumTopics)
      .where(eq(forumTopics.title, "Commercial Rooftop Unit Maintenance in Calgary"));
    
    if (existingCommercialTopics.length > 0) {
      return; // Content already populated
    }

    // Create admin user for content creation if not exists
    let adminUser = await this.getUserByUsername('hvac_expert');
    if (!adminUser) {
      adminUser = await this.createUser({
        username: 'hvac_expert',
        email: 'expert@afterhourshvac.ca',
        password: 'temp_password'
      });
    }

    // Professional HVAC content for each category
    const hvacContent = [
      {
        categoryId: 1, // General Discussion
        topics: [
          {
            title: "Welcome to AfterHours HVAC Professional Forum",
            content: "Welcome to the premier destination for HVAC professionals in Calgary and surrounding areas. This forum is designed for technicians, contractors, and industry professionals to share knowledge, discuss best practices, and stay updated on the latest industry developments.\n\nForum Guidelines:\n• Share professional experiences and technical solutions\n• Respect all members and maintain professional discourse\n• Use proper safety protocols in all discussions\n• Follow Alberta and Canadian HVAC codes and regulations\n\nLet's build a strong community of HVAC excellence together!"
          },
          {
            title: "Calgary HVAC Market Trends - Winter 2024/2025",
            content: "The Calgary HVAC market is experiencing significant changes this winter season:\n\n**Equipment Demand:**\n• High-efficiency furnaces (95%+ AFUE) are becoming the standard\n• Heat pumps gaining popularity despite our climate challenges\n• Smart thermostats now requested in 80% of installations\n\n**Supply Chain Updates:**\n• Lead times for premium equipment: 4-6 weeks\n• Local suppliers (Alggin, WESCO) maintaining good inventory\n• Price increases expected Q1 2025 (8-12% average)\n\n**Regulatory Changes:**\n• New refrigerant regulations coming into effect\n• Updated building codes for multi-family dwellings\n• Enhanced energy efficiency requirements\n\nWhat trends are you seeing in your service area?"
          }
        ]
      },
      {
        categoryId: 2, // Residential HVAC
        topics: [
          {
            title: "Common Residential Furnace Issues in Calgary Winters",
            content: "Calgary's extreme winter conditions present unique challenges for residential furnaces. Here's a comprehensive guide for the most common issues:\n\n**1. Frozen Condensate Lines**\n• Symptoms: Water backing up, furnace shutting down\n• Solution: Insulate exterior portions, check drainage slope\n• Prevention: Regular maintenance, proper installation\n\n**2. Heat Exchanger Stress Cracks**\n• More common in extreme cold due to rapid expansion/contraction\n• Look for corrosion patterns, flame rollout\n• Safety first - immediate shutdown if suspected\n\n**3. Intake/Exhaust Icing**\n• High-efficiency units most susceptible\n• Clear snow/ice buildup immediately\n• Install wind guards where appropriate\n\n**4. Thermostat Drift in Cold**\n• Digital stats can read incorrectly in extreme cold\n• Check sensor placement and calibration\n• Consider upgrading to commercial-grade units\n\n**Emergency Protocol:**\n1. Safety check first\n2. Restore heat quickly (space heaters if safe)\n3. Document findings for warranty claims\n\nShare your residential troubleshooting experiences below!"
          },
          {
            title: "Residential Heat Pump Performance in Calgary Climate",
            content: "Heat pumps are becoming more viable in residential Calgary installations, but require careful consideration:\n\n**Performance Thresholds:**\n• Most residential units maintain efficiency down to -15°C\n• Auxiliary heat kicks in below -20°C\n• Emergency heat mode below -25°C\n\n**Residential Installation Considerations:**\n• Oversizing by 15-20% for our climate\n• Quality defrost controls essential\n• Proper refrigerant charge critical\n• Integration with existing ductwork\n\n**Homeowner Maintenance Schedule:**\n• Pre-winter inspection (September)\n• Mid-winter check (January)\n• Post-winter service (April)\n• Filter changes every 3 months\n\n**Common Residential Issues:**\n• Defrost cycle problems\n• Ice buildup on outdoor unit\n• Refrigerant leaks in extreme cold\n• Backup heating system failures\n\n**Recommended Brands for Calgary Homes:**\n• Mitsubishi Hyper-Heat series\n• Carrier Greenspeed residential\n• Lennox Elite residential series\n\nWhat's your experience with residential heat pump installations?"
          }
        ]
      },
      {
        categoryId: 3, // Commercial HVAC
        topics: [
          {
            title: "Commercial Rooftop Unit Maintenance in Calgary",
            content: "Calgary's extreme weather requires specialized commercial HVAC maintenance protocols:\n\n**Winter Preparation:**\n• Inspect and clean economizer dampers\n• Check gas train components for proper operation\n• Verify proper refrigerant levels before cold weather\n• Test defrost cycles and controls\n• Inspect roof curb and flashing for leaks\n\n**Spring Startup Procedures:**\n• Complete coil cleaning (condenser and evaporator)\n• Belt inspection and tension adjustment\n• Filter replacement and airflow verification\n• Controls calibration and sequence testing\n• Refrigerant leak detection\n\n**Common Commercial Issues:**\n• Economizer lockout in extreme cold\n• Frozen coils from inadequate airflow\n• Gas valve failures in cold weather\n• Variable frequency drive problems\n• Building automation system integration\n\n**Calgary Commercial Suppliers:**\n• WESCO Commercial Division\n• Alggin Commercial Equipment\n• Johnson Controls (local support)\n• Carrier Commercial Calgary\n\n**Maintenance Contracts:**\n• Quarterly inspections recommended\n• Emergency service response times\n• Filter programs for large buildings\n• Energy efficiency reporting\n\nWhat commercial maintenance challenges do you face?"
          },
          {
            title: "Commercial Building Automation Systems - Calgary Market",
            content: "BAS integration is critical for commercial HVAC efficiency in Calgary's climate:\n\n**Popular Systems in Calgary:**\n• Johnson Controls Metasys\n• Honeywell Enterprise Buildings Integrator\n• Schneider Electric StruxureWare\n• Siemens Desigo CC\n• Trane Tracer SC+\n\n**Integration Challenges:**\n• Legacy system compatibility\n• Network security requirements\n• Extreme weather compensation\n• Energy reporting compliance\n• Remote monitoring capabilities\n\n**Installation Considerations:**\n• Proper sensor placement for Calgary climate\n• Redundant communication paths\n• UPS backup for critical systems\n• Cybersecurity compliance\n• Training requirements for facility staff\n\n**Energy Management:**\n• Demand response programs (ENMAX)\n• Peak shaving strategies\n• Free cooling optimization\n• Heat recovery system integration\n• Utility rebate tracking\n\n**Local Support:**\n• Certified technicians in Calgary\n• 24/7 monitoring services\n• Preventive maintenance scheduling\n• Energy audit capabilities\n\nShare your BAS integration experiences and tips!"
          }
        ]
      },
      {
        categoryId: 4, // DIY Tips & Tricks
        topics: [
          {
            title: "Safe DIY HVAC Maintenance for Calgary Homeowners",
            content: "Important DIY maintenance tasks Calgary homeowners can safely perform:\n\n**Monthly Tasks (Homeowner Safe):**\n• Check and replace furnace filters\n• Clear snow/debris from outdoor heat pump units\n• Inspect vents and registers for blockages\n• Test thermostat battery levels\n• Check carbon monoxide detector batteries\n\n**Seasonal Tasks (DIY Friendly):**\n• Clean return air grilles\n• Vacuum around furnace area\n• Check ductwork for obvious damage\n• Inspect outdoor unit for damage\n• Clear vegetation around outdoor units\n\n**WARNING - Call a Professional:**\n• Gas line work (TSSA licensed required)\n• Electrical connections\n• Refrigerant handling\n• Heat exchanger inspection\n• Any work requiring permits\n\n**Calgary-Specific DIY Tips:**\n• Use higher MERV filters in spring (pollen season)\n• Check for ice damming affecting exhaust vents\n• Insulate accessible ductwork in cold zones\n• Keep spare filters during winter storms\n\n**Tools Every Calgary Homeowner Should Have:**\n• Digital multimeter for basic electrical testing\n• Manometer for gas pressure (observation only)\n• Infrared thermometer for vent temperatures\n• Quality flashlight for inspections\n\n**When to Call AfterHours HVAC:**\n• Strange noises or smells\n• Uneven heating/cooling\n• Higher than normal utility bills\n• Any safety concerns\n\nShare your safe DIY experiences and ask questions!"
          },
          {
            title: "DIY Filter Selection and Replacement Guide",
            content: "Choosing the right filters for Calgary homes and proper replacement techniques:\n\n**Filter Types for Calgary Climate:**\n\n**Pleated Filters (Recommended):**\n• MERV 8-11 for most homes\n• Better dust/allergen capture\n• 3-month replacement typical\n• Cost: $15-25 each\n\n**High-Efficiency Filters:**\n• MERV 13-16 for allergy sufferers\n• Excellent particle filtration\n• May reduce airflow (check with pro)\n• Cost: $25-40 each\n\n**Basic Fiberglass (Budget):**\n• MERV 1-4 protection only\n• Monthly replacement needed\n• Minimal allergen protection\n• Cost: $3-8 each\n\n**Calgary-Specific Considerations:**\n• Higher MERV during wildfire season (summer)\n• Standard MERV 8-10 for winter efficiency\n• Extra filters during chinook wind periods\n• Stock up before winter storms\n\n**DIY Replacement Steps:**\n1. Turn off furnace at thermostat\n2. Locate filter compartment\n3. Note airflow direction arrow\n4. Remove old filter carefully\n5. Install new filter (airflow direction correct)\n6. Ensure proper fit and seal\n7. Reset thermostat\n8. Mark calendar for next change\n\n**Common DIY Mistakes:**\n• Installing filter backwards\n• Using wrong size filter\n• Forgetting to replace regularly\n• Using too high MERV without checking\n\n**Local Filter Sources:**\n• Home Depot Calgary (basic selection)\n• Costco Calgary (bulk packages)\n• Amazon delivery (convenient)\n• Local HVAC suppliers (best selection)\n\nWhat filter questions do you have?"
          }
        ]
      },
      {
        categoryId: 5, // Industry News
        topics: [
          {
            title: "Alberta HVAC Code Changes 2024 - What You Need to Know",
            content: "Significant regulatory changes affecting HVAC professionals in Alberta:\n\n**Refrigerant Regulations:**\n• R-410A phase-down accelerated\n• R-454B and R-32 adoption increasing\n• Enhanced recovery requirements\n• New technician certification levels\n\n**Energy Efficiency Updates:**\n• Minimum AFUE increased to 95% for most applications\n• Heat pump incentives expanded\n• Net-zero ready home standards\n• Enhanced building envelope requirements\n\n**Safety and Installation:**\n• Carbon monoxide detector requirements updated\n• Gas appliance venting changes\n• Combustion air calculation revisions\n• Emergency shut-off requirements\n\n**Licensing and Certification:**\n• Continuing education requirements increased\n• Specialized certifications for heat pumps\n• Digital permit submissions mandatory\n• Insurance requirement updates\n\n**Environmental Compliance:**\n• Stricter refrigerant leak reporting\n• Enhanced disposal requirements\n• Greenhouse gas reduction targets\n• Rebate program changes\n\n**Timeline for Implementation:**\n• January 2024: New efficiency standards\n• March 2024: Refrigerant regulations\n• June 2024: Permit system updates\n• September 2024: Training requirements\n\n**Action Items for Contractors:**\n• Update training certifications\n• Review equipment specifications\n• Update estimation software\n• Inform customers of changes\n\nStay informed and compliant!"
          },
          {
            title: "Calgary Utility Rebate Programs - 2024 Update",
            content: "Current rebate and incentive programs available in Calgary:\n\n**ENMAX Energy Efficiency Programs:**\n\n**High-Efficiency Furnace Rebate**\n• 95%+ AFUE: $500\n• 96%+ AFUE: $750\n• Modulating units: Additional $200\n• Must be ENERGY STAR certified\n\n**Heat Pump Incentives**\n• Air-source heat pump: $1,000\n• Cold-climate units: $1,500\n• Dual-fuel systems: $2,000\n• Ground-source: $5,000\n\n**Smart Thermostat Program**\n• ENERGY STAR certified: $75\n• Professional installation required\n• Limit 2 per household\n\n**Federal Programs:**\n\n**Canada Greener Homes Grant**\n• Pre/post energy audits required\n• Heat pumps: Up to $5,000\n• Insulation upgrades: Up to $5,000\n• Combined with provincial programs\n\n**Application Process:**\n• Online applications preferred\n• Professional installation required\n• Receipts and photos needed\n• 8-12 week processing time\n\n**Contractor Requirements:**\n• Registered with program\n• Proper licensing verification\n• Installation certification\n• Customer education required\n\n**Tips for Contractors:**\n• Help customers with applications\n• Factor rebates into pricing\n• Keep program documentation\n• Follow up on approvals\n\nMaximize value for your customers!"
          }
        ]
      }
    ];

    // Insert topics and posts for each category
    for (const category of hvacContent) {
      for (const topicData of category.topics) {
        // Create the topic
        const topic = await this.createForumTopic({
          categoryId: category.categoryId,
          userId: adminUser.id,
          title: topicData.title,
          slug: topicData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          content: topicData.content,
          isPinned: true,
          isLocked: false
        });

        // Add a welcome reply to some topics
        if (topicData.title.includes('Welcome') || topicData.title.includes('Market Trends')) {
          await this.createForumPost({
            topicId: topic.id,
            userId: adminUser.id,
            content: "Feel free to share your experiences and ask questions. This is a professional community focused on advancing HVAC excellence in Calgary and Alberta."
          });
        }
      }
    }
  }

  // Emergency Request methods
  async getAllEmergencyRequests(): Promise<EmergencyRequest[]> {
    const results = await db.select().from(emergencyRequests).orderBy(desc(emergencyRequests.createdAt));
    return results;
  }

  async getUserEmergencyRequests(userId: number): Promise<EmergencyRequest[]> {
    const results = await db
      .select()
      .from(emergencyRequests)
      .where(eq(emergencyRequests.customerId, userId))
      .orderBy(desc(emergencyRequests.createdAt));
    return results;
  }

  async searchEmergencyRequests(query: string): Promise<EmergencyRequest[]> {
    const { or, ilike } = await import("drizzle-orm");
    const results = await db
      .select()
      .from(emergencyRequests)
      .where(
        or(
          ilike(emergencyRequests.phone, `%${query}%`),
          ilike(emergencyRequests.email, `%${query}%`),
          eq(emergencyRequests.id, isNaN(parseInt(query)) ? -1 : parseInt(query))
        )
      )
      .orderBy(desc(emergencyRequests.createdAt));
    return results;
  }

  async updateEmergencyRequest(id: number, data: Partial<EmergencyRequest>): Promise<EmergencyRequest | undefined> {
    const [request] = await db
      .update(emergencyRequests)
      .set(data)
      .where(eq(emergencyRequests.id, id))
      .returning();
    return request;
  }

  // Job Application methods
  async getJobApplications(): Promise<JobApplication[]> {
    const results = await db.select().from(jobApplications).orderBy(desc(jobApplications.id));
    return results;
  }

  async getAllJobApplications(): Promise<JobApplication[]> {
    const results = await db.select().from(jobApplications).orderBy(desc(jobApplications.id));
    return results;
  }

  async getJobApplicationById(id: number): Promise<JobApplication | undefined> {
    const [application] = await db
      .select()
      .from(jobApplications)
      .where(eq(jobApplications.id, id));
    return application;
  }

  async createJobApplication(application: InsertJobApplication): Promise<JobApplication> {
    const [newApplication] = await db
      .insert(jobApplications)
      .values(application)
      .returning();
    return newApplication;
  }

  async updateJobApplication(id: number, data: Partial<JobApplication>): Promise<JobApplication | undefined> {
    const [application] = await db
      .update(jobApplications)
      .set(data)
      .where(eq(jobApplications.id, id))
      .returning();
    return application;
  }

  // Phone Verification methods
  async getUserByPhone(phone: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phone, phone));
    return user;
  }

  async updateUserPhoneVerification(phone: string, code: string, expiresAt: Date): Promise<void> {
    await db
      .update(users)
      .set({
        phoneVerificationCode: code,
        phoneVerificationExpiresAt: expiresAt
      })
      .where(eq(users.phone, phone));
  }

  async markPhoneAsVerified(userId: number): Promise<void> {
    await db
      .update(users)
      .set({
        phoneVerificationCode: null,
        phoneVerificationExpiresAt: null
      })
      .where(eq(users.id, userId));
  }

  async getPhoneVerificationAttempts(phone: string, ipAddress?: string): Promise<any> {
    const [attempt] = await db
      .select()
      .from(phoneVerificationAttempts)
      .where(eq(phoneVerificationAttempts.phone, phone))
      .orderBy(desc(phoneVerificationAttempts.lastAttempt))
      .limit(1);
    return attempt;
  }

  async createPhoneVerificationAttempt(data: any): Promise<any> {
    const [attempt] = await db
      .insert(phoneVerificationAttempts)
      .values(data)
      .returning();
    return attempt;
  }

  // Session Management methods
  async getActiveUserSessions(userId: number): Promise<any[]> {
    const sessions = await db
      .select()
      .from(userSessions)
      .where(and(
        eq(userSessions.userId, userId),
        eq(userSessions.isActive, true)
      ))
      .orderBy(desc(userSessions.lastActivity));
    return sessions;
  }



  async getUserSessionBySessionId(sessionId: string): Promise<any> {
    const [session] = await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.sessionId, sessionId));
    return session;
  }

  async updateSessionActivity(sessionId: string): Promise<void> {
    await db
      .update(userSessions)
      .set({ lastActivity: new Date() })
      .where(eq(userSessions.sessionId, sessionId));
  }

  async terminateUserSession(sessionId: string): Promise<void> {
    await db
      .update(userSessions)
      .set({ isActive: false })
      .where(eq(userSessions.sessionId, sessionId));
  }

  async terminateOldestSession(userId: number): Promise<void> {
    const [oldestSession] = await db
      .select()
      .from(userSessions)
      .where(and(
        eq(userSessions.userId, userId),
        eq(userSessions.isActive, true)
      ))
      .orderBy(userSessions.lastActivity)
      .limit(1);

    if (oldestSession) {
      await this.terminateUserSession(oldestSession.sessionId);
    }
  }

  // Security methods
  async updateUserDeviceFingerprint(userId: number, fingerprint: string): Promise<void> {
    await db
      .update(users)
      .set({
        lastDeviceFingerprint: fingerprint,
        deviceFingerprint: fingerprint
      })
      .where(eq(users.id, userId));
  }

  // User Management methods
  async getAllUsers(): Promise<User[]> {
    const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
    return allUsers;
  }

  async deleteUser(userId: number): Promise<User | undefined> {
    // Delete in proper order to handle foreign key constraints
    
    // 1. Delete forum likes first (references forum posts)
    await db.delete(forumLikes).where(eq(forumLikes.userId, userId));
    
    // 2. Delete forum posts (may be referenced by forum likes)
    await db.delete(forumPosts).where(eq(forumPosts.userId, userId));
    
    // 3. Delete forum topics (may reference user)
    await db.delete(forumTopics).where(eq(forumTopics.userId, userId));
    
    // 4. Delete any other user-related data
    await db.delete(jobApplications).where(eq(jobApplications.reviewedBy, userId));
    await db.delete(emergencyRequests).where(eq(emergencyRequests.customerId, userId));
    
    // 5. Finally delete the user
    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning();
    return deletedUser;
  }

  async updateUserPassword(userId: number, hashedPassword: string): Promise<void> {
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId));
  }

  async createSecurityLog(data: any): Promise<any> {
    const [log] = await db
      .insert(securityLogs)
      .values(data)
      .returning();
    return log;
  }

  // Corporate Account methods
  async createCorporateAccount(data: any): Promise<any> {
    const [account] = await db
      .insert(corporateAccounts)
      .values(data)
      .returning();
    return account;
  }

  async getCorporateAccount(id: number): Promise<any> {
    const [account] = await db
      .select()
      .from(corporateAccounts)
      .where(eq(corporateAccounts.id, id));
    return account;
  }

  async getCorporateAccountByUserId(userId: number): Promise<any> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));
    
    if (user?.corporateAccountId) {
      return await this.getCorporateAccount(user.corporateAccountId);
    }
    return null;
  }

  async updateCorporateAccountUserCount(accountId: number, count: number): Promise<void> {
    await db
      .update(corporateAccounts)
      .set({ currentUsers: count })
      .where(eq(corporateAccounts.id, accountId));
  }

  async addUserToCorporateAccount(userId: number, corporateAccountId: number): Promise<void> {
    await db
      .update(users)
      .set({ 
        corporateAccountId,
        membershipType: 'corporate',
        maxSessions: 5 // Corporate users get more sessions
      })
      .where(eq(users.id, userId));
  }

  async createCorporateInquiry(data: any): Promise<any> {
    // For now, store in contact submissions table since we don't have a separate corporate inquiries table
    const inquiryData = {
      name: data.contactName,
      email: data.email,
      phone: data.phone,
      subject: `Corporate Inquiry - ${data.companyName}`,
      message: `Company: ${data.companyName}\nIndustry: ${data.industry}\nCompany Size: ${data.companySize}\nAnnual Revenue: ${data.annualRevenue}\nCurrent Users: ${data.currentUsers}\nProjected Users: ${data.projectedUsers}\nSpecific Needs: ${data.specificNeeds}\nTimeline: ${data.timeline}`,
      createdAt: new Date()
    };

    const [inquiry] = await db
      .insert(contactSubmissions)
      .values(inquiryData)
      .returning();
    
    return inquiry;
  }

  // Service Booking methods
  async getAllServiceBookings(): Promise<ServiceBooking[]> {
    const bookings = await db
      .select()
      .from(serviceBookings)
      .orderBy(desc(serviceBookings.createdAt));
    return bookings;
  }

  async getServiceBookingById(id: number): Promise<ServiceBooking | undefined> {
    const [booking] = await db
      .select()
      .from(serviceBookings)
      .where(eq(serviceBookings.id, id));
    return booking;
  }

  async createServiceBooking(booking: InsertServiceBooking): Promise<ServiceBooking> {
    const [newBooking] = await db
      .insert(serviceBookings)
      .values(booking)
      .returning();
    return newBooking;
  }

  async updateServiceBooking(id: number, data: Partial<ServiceBooking>): Promise<ServiceBooking | undefined> {
    const [updatedBooking] = await db
      .update(serviceBookings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(serviceBookings.id, id))
      .returning();
    return updatedBooking;
  }

  async deleteServiceBooking(id: number): Promise<boolean> {
    const result = await db
      .delete(serviceBookings)
      .where(eq(serviceBookings.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getServiceBooking(id: number): Promise<ServiceBooking | undefined> {
    const [booking] = await db
      .select()
      .from(serviceBookings)
      .where(eq(serviceBookings.id, id));
    return booking;
  }

  async getEmergencyRequest(id: number): Promise<EmergencyRequest | undefined> {
    const [request] = await db
      .select()
      .from(emergencyRequests)
      .where(eq(emergencyRequests.id, id));
    return request;
  }



  async updateServiceBookingStatus(id: number, status: string): Promise<ServiceBooking | undefined> {
    const [updatedBooking] = await db
      .update(serviceBookings)
      .set({ status, updatedAt: new Date() })
      .where(eq(serviceBookings.id, id))
      .returning();
    return updatedBooking;
  }
}

export const storage = new DatabaseStorage();
