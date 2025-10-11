var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/schema-sqlite.ts
var schema_sqlite_exports = {};
__export(schema_sqlite_exports, {
  blogPosts: () => blogPosts,
  contactSubmissions: () => contactSubmissions,
  insertBlogPostSchema: () => insertBlogPostSchema,
  insertContactSubmissionSchema: () => insertContactSubmissionSchema,
  insertProductSchema: () => insertProductSchema,
  insertTeamMemberSchema: () => insertTeamMemberSchema,
  insertUserSchema: () => insertUserSchema,
  products: () => products,
  teamMembers: () => teamMembers,
  users: () => users
});
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
var users, contactSubmissions, blogPosts, teamMembers, products, insertUserSchema, insertContactSubmissionSchema, insertBlogPostSchema, insertTeamMemberSchema, insertProductSchema;
var init_schema_sqlite = __esm({
  "shared/schema-sqlite.ts"() {
    "use strict";
    users = sqliteTable("users", {
      id: integer("id").primaryKey({ autoIncrement: true }),
      username: text("username").notNull().unique(),
      password: text("password").notNull(),
      email: text("email"),
      phone: text("phone"),
      firstName: text("first_name"),
      lastName: text("last_name"),
      company: text("company"),
      role: text("role").default("user"),
      // user, admin, moderator
      userType: text("user_type").default("customer"),
      // customer, technician
      stripeCustomerId: text("stripe_customer_id"),
      stripeSubscriptionId: text("stripe_subscription_id"),
      hasProAccess: integer("has_pro_access", { mode: "boolean" }).default(false),
      hasPro: integer("has_pro", { mode: "boolean" }).default(false),
      isAdmin: integer("is_admin", { mode: "boolean" }).default(false),
      proAccessGrantedAt: text("pro_access_granted_at"),
      membershipType: text("membership_type"),
      // 'monthly', 'yearly', 'lifetime', 'corporate'
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
      maxSessions: integer("max_sessions").default(1),
      // Pro: 3, Corporate: unlimited per corporate account
      deviceFingerprint: text("device_fingerprint"),
      // Browser/device identification
      lastDeviceFingerprint: text("last_device_fingerprint"),
      suspiciousLoginDetected: integer("suspicious_login_detected", { mode: "boolean" }).default(false),
      accountLocked: integer("account_locked", { mode: "boolean" }).default(false),
      lockedAt: text("locked_at"),
      lockReason: text("lock_reason"),
      createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
      lastLogin: text("last_login")
    });
    contactSubmissions = sqliteTable("contact_submissions", {
      id: integer("id").primaryKey({ autoIncrement: true }),
      name: text("name").notNull(),
      email: text("email").notNull(),
      phone: text("phone"),
      message: text("message").notNull(),
      serviceType: text("service_type"),
      urgency: text("urgency").default("normal"),
      preferredContactMethod: text("preferred_contact_method").default("email"),
      createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
      status: text("status").default("new"),
      // new, contacted, quoted, completed
      adminNotes: text("admin_notes")
    });
    blogPosts = sqliteTable("blog_posts", {
      id: integer("id").primaryKey({ autoIncrement: true }),
      title: text("title").notNull(),
      slug: text("slug").notNull().unique(),
      content: text("content").notNull(),
      excerpt: text("excerpt"),
      author: text("author").notNull(),
      tags: text("tags"),
      // JSON string
      published: integer("published", { mode: "boolean" }).default(false),
      createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
      updatedAt: text("updated_at").default("CURRENT_TIMESTAMP"),
      publishedAt: text("published_at")
    });
    teamMembers = sqliteTable("team_members", {
      id: integer("id").primaryKey({ autoIncrement: true }),
      name: text("name").notNull(),
      role: text("role").notNull(),
      experience: text("experience"),
      description: text("description"),
      specialties: text("specialties"),
      // JSON string
      photoUrl: text("photo_url"),
      isActive: integer("is_active", { mode: "boolean" }).default(true),
      createdAt: text("created_at").default("CURRENT_TIMESTAMP")
    });
    products = sqliteTable("products", {
      id: integer("id").primaryKey({ autoIncrement: true }),
      name: text("name").notNull(),
      description: text("description"),
      price: real("price").notNull(),
      category: text("category").notNull(),
      isActive: integer("is_active", { mode: "boolean" }).default(true),
      stripeProductId: text("stripe_product_id"),
      stripePriceId: text("stripe_price_id"),
      createdAt: text("created_at").default("CURRENT_TIMESTAMP")
    });
    insertUserSchema = createInsertSchema(users);
    insertContactSubmissionSchema = createInsertSchema(contactSubmissions);
    insertBlogPostSchema = createInsertSchema(blogPosts);
    insertTeamMemberSchema = createInsertSchema(teamMembers);
    insertProductSchema = createInsertSchema(products);
  }
});

// server/db.ts
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
var DATABASE_URL, dbPath, sqlite, db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema_sqlite();
    DATABASE_URL = process.env.DATABASE_URL || "file:./database.sqlite";
    dbPath = DATABASE_URL.replace("file:", "");
    sqlite = new Database(dbPath);
    db = drizzle(sqlite, { schema: schema_sqlite_exports });
    sqlite.pragma("journal_mode = WAL");
  }
});

// server/init-db.ts
var init_db_exports = {};
__export(init_db_exports, {
  initializeDatabase: () => initializeDatabase
});
import bcrypt3 from "bcryptjs";
async function initializeDatabase() {
  console.log("Initializing SQLite database...");
  console.log("Creating tables...");
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      first_name TEXT,
      last_name TEXT,
      company TEXT,
      role TEXT DEFAULT 'user',
      user_type TEXT DEFAULT 'customer',
      stripe_customer_id TEXT,
      stripe_subscription_id TEXT,
      has_pro_access INTEGER DEFAULT 0,
      has_pro INTEGER DEFAULT 0,
      is_admin INTEGER DEFAULT 0,
      pro_access_granted_at TEXT,
      membership_type TEXT,
      membership_expires_at TEXT,
      is_lifetime_member INTEGER DEFAULT 0,
      profile_image_url TEXT,
      phone_verified INTEGER DEFAULT 0,
      phone_verification_code TEXT,
      phone_verification_expires_at TEXT,
      phone_verified_at TEXT,
      corporate_account_id INTEGER,
      is_corporate_admin INTEGER DEFAULT 0,
      max_sessions INTEGER DEFAULT 1,
      device_fingerprint TEXT,
      last_device_fingerprint TEXT,
      suspicious_login_detected INTEGER DEFAULT 0,
      account_locked INTEGER DEFAULT 0,
      locked_at TEXT,
      lock_reason TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      last_login TEXT
    )
  `);
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      message TEXT NOT NULL,
      service_type TEXT,
      urgency TEXT DEFAULT 'normal',
      preferred_contact_method TEXT DEFAULT 'email',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'new',
      admin_notes TEXT
    )
  `);
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      content TEXT NOT NULL,
      excerpt TEXT,
      author TEXT NOT NULL,
      tags TEXT,
      published INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      published_at TEXT
    )
  `);
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS team_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      experience TEXT,
      description TEXT,
      specialties TEXT,
      photo_url TEXT,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      stripe_product_id TEXT,
      stripe_price_id TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("Tables created successfully!");
  console.log("Creating admin users...");
  const adminUsers = [
    {
      username: "jordan",
      email: "Jordan@Afterhourshvac.ca",
      password: "password",
      firstName: "Jordan",
      lastName: "Boisclair",
      role: "admin",
      isAdmin: true,
      hasProAccess: true,
      hasPro: true
    },
    {
      username: "derek",
      email: "Derek@Afterhourshvac.ca",
      password: "password",
      firstName: "Derek",
      lastName: "Thompson",
      role: "admin",
      isAdmin: true,
      hasProAccess: true,
      hasPro: true
    }
  ];
  for (const userData of adminUsers) {
    const existingUser = sqlite.prepare("SELECT id FROM users WHERE email = ?").get(userData.email);
    if (!existingUser) {
      const salt = await bcrypt3.genSalt(10);
      const hashedPassword = await bcrypt3.hash(userData.password, salt);
      sqlite.prepare(`
        INSERT INTO users (
          username, email, password, first_name, last_name, role, 
          is_admin, has_pro_access, has_pro, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `).run(
        userData.username,
        userData.email,
        hashedPassword,
        userData.firstName,
        userData.lastName,
        userData.role,
        userData.isAdmin ? 1 : 0,
        userData.hasProAccess ? 1 : 0,
        userData.hasPro ? 1 : 0
      );
      console.log(`Created admin user: ${userData.email}`);
    } else {
      console.log(`Admin user already exists: ${userData.email}`);
    }
  }
  console.log("Database initialization complete!");
}
var init_init_db = __esm({
  "server/init-db.ts"() {
    "use strict";
    init_db();
    if (import.meta.url === `file://${process.argv[1]}`) {
      initializeDatabase().catch(console.error);
    }
  }
});

// server/index.ts
import "dotenv/config";
import express2 from "express";
import cors from "cors";
import session from "express-session";

// server/storage-simple.ts
init_schema_sqlite();
init_db();
import { eq, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";
var Storage = class {
  // User methods
  async getUser(id) {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }
  async getUserByUsername(username) {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }
  async getUserByEmail(email) {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }
  async createUser(user) {
    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }
  async updateUser(id, data) {
    const result = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return result[0];
  }
  // Contact methods
  async createContactSubmission(submission) {
    const result = await db.insert(contactSubmissions).values(submission).returning();
    return result[0];
  }
  async getContactSubmissions() {
    return await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
  }
  // Blog methods
  async createBlogPost(post) {
    const result = await db.insert(blogPosts).values(post).returning();
    return result[0];
  }
  async getBlogPosts() {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }
  async getBlogPost(id) {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    return result[0];
  }
  async updateBlogPost(id, data) {
    const result = await db.update(blogPosts).set(data).where(eq(blogPosts.id, id)).returning();
    return result[0];
  }
  async deleteBlogPost(id) {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }
  // Team methods
  async createTeamMember(member) {
    const result = await db.insert(teamMembers).values(member).returning();
    return result[0];
  }
  async getTeamMembers() {
    return await db.select().from(teamMembers).where(eq(teamMembers.isActive, true));
  }
  async deleteTeamMember(id) {
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
  }
};
var storage = new Storage();

// server/routes.ts
import bcrypt2 from "bcryptjs";
import { z } from "zod";
var loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});
var contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1),
  serviceType: z.string().optional(),
  urgency: z.string().default("normal")
});
var blogPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  author: z.string().min(1),
  tags: z.string().optional(),
  published: z.boolean().default(false)
});
var teamMemberSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  experience: z.string().optional(),
  description: z.string().optional(),
  specialties: z.string().optional(),
  photoUrl: z.string().optional()
});
var jobApplicationSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  position: z.string().min(1),
  experience: z.string().min(1),
  coverLetter: z.string().optional()
});
function registerRoutes(app2) {
  console.log("Registering API routes...");
  app2.get("/api/health", (req, res) => {
    console.log("Health check endpoint hit");
    res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      const user = await storage.getUserByUsername(username) || await storage.getUserByEmail(username);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const isValid = await bcrypt2.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      req.session.userId = user.id;
      req.session.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin
      };
      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          isAdmin: user.isAdmin
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });
  app2.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });
  app2.get("/api/auth/me", (req, res) => {
    const user = req.session?.user;
    if (!user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    res.json({ user });
  });
  app2.post("/api/admin/contacts", async (req, res) => {
    try {
      const contactData = contactSchema.parse(req.body);
      const submission = await storage.createContactSubmission(contactData);
      res.json(submission);
    } catch (error) {
      console.error("Contact submission error:", error);
      res.status(500).json({ error: "Failed to submit contact form" });
    }
  });
  app2.get("/api/admin/contacts", async (req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Get contacts error:", error);
      res.status(500).json({ error: "Failed to get contact submissions" });
    }
  });
  app2.get("/api/blog/posts", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Get blog posts error:", error);
      res.status(500).json({ error: "Failed to get blog posts" });
    }
  });
  app2.post("/api/admin/blog/posts", async (req, res) => {
    try {
      const postData = blogPostSchema.parse(req.body);
      const slug = postData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const post = await storage.createBlogPost({ ...postData, slug });
      res.json(post);
    } catch (error) {
      console.error("Create blog post error:", error);
      res.status(500).json({ error: "Failed to create blog post" });
    }
  });
  app2.delete("/api/admin/blog/posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteBlogPost(id);
      res.json({ message: "Blog post deleted" });
    } catch (error) {
      console.error("Delete blog post error:", error);
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });
  app2.get("/api/team", async (req, res) => {
    try {
      const members = await storage.getTeamMembers();
      res.json(members);
    } catch (error) {
      console.error("Get team members error:", error);
      res.status(500).json({ error: "Failed to get team members" });
    }
  });
  app2.post("/api/admin/team", async (req, res) => {
    try {
      const memberData = teamMemberSchema.parse(req.body);
      const member = await storage.createTeamMember(memberData);
      res.json(member);
    } catch (error) {
      console.error("Create team member error:", error);
      res.status(500).json({ error: "Failed to create team member" });
    }
  });
  app2.delete("/api/admin/team/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTeamMember(id);
      res.json({ message: "Team member deleted" });
    } catch (error) {
      console.error("Delete team member error:", error);
      res.status(500).json({ error: "Failed to delete team member" });
    }
  });
  app2.get("/api/admin/users", async (req, res) => {
    try {
      const user = req.session?.user;
      if (!user || !user.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }
      res.json([user]);
    } catch (error) {
      console.error("Get admin users error:", error);
      res.status(500).json({ error: "Failed to get admin users" });
    }
  });
  app2.post("/api/job-applications", async (req, res) => {
    try {
      const applicationData = jobApplicationSchema.parse(req.body);
      console.log("Job application received:", applicationData);
      res.json({
        message: "Application submitted successfully",
        id: Date.now(),
        // Simple ID for demo
        status: "received"
      });
    } catch (error) {
      console.error("Job application error:", error);
      res.status(500).json({ error: "Failed to submit job application" });
    }
  });
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
    // ✅ Valid and properly typed
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "../dist/public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(cors({
  origin: (process.env.CORS_ORIGIN || "").split(",").filter(Boolean).length > 0 ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim()) : true,
  credentials: true
}));
app.use(express2.json({ limit: "50mb" }));
app.use(express2.urlencoded({ extended: false, limit: "50mb" }));
app.use(session({
  secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1e3
    // 24 hours
  }
}));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  console.log("Starting server setup...");
  if (process.env.NODE_ENV === "production") {
    console.log("Initializing database for production...");
    try {
      const { initializeDatabase: initializeDatabase2 } = await Promise.resolve().then(() => (init_init_db(), init_db_exports));
      await initializeDatabase2();
      console.log("Database initialized successfully");
    } catch (error) {
      console.error("Database initialization error:", error);
    }
  }
  console.log("About to register routes...");
  registerRoutes(app);
  console.log("Routes registered successfully");
  const { createServer } = await import("http");
  const server = createServer(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000");
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, async () => {
    log(`serving on port ${port}`);
    log("Server started successfully");
  });
})();
