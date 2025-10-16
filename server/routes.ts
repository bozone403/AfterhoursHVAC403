import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import { z } from "zod";
import Stripe from "stripe";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

const registerSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().optional(),
  lastName: z.string().optional()
});

// Admin emails that get automatic admin access
const ADMIN_EMAILS = [
  'jordan@afterhourshvac.ca',
  'Jordan@Afterhourshvac.ca', 
  'derek@afterhourshvac.ca',
  'Derek@Afterhourshvac.ca',
  'admin@afterhourshvac.ca',
  'Admin@afterhourshvac.ca'
];

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1),
  serviceType: z.string().optional(),
  urgency: z.string().default("normal")
});

const blogPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  author: z.string().min(1),
  tags: z.string().optional(),
  published: z.boolean().default(false)
});

const jobApplicationSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  position: z.string().min(1),
  experience: z.string().min(1),
  availability: z.string().min(1),
  coverLetter: z.string().optional()
});

const serviceRequestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  serviceType: z.string().min(1),
  description: z.string().min(1),
  urgency: z.string().default("normal"),
  preferredDate: z.string().optional(),
  address: z.string().optional()
});

const emergencyRequestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().min(1),
  description: z.string().min(1),
  urgency: z.string().default("high")
});

const teamMemberSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  experience: z.string().optional(),
  description: z.string().optional(),
  specialties: z.string().optional(),
  photoUrl: z.string().optional()
});

export function registerRoutes(app: Express): void {
  console.log("Registering API routes...");
  
  app.get("/api/health", (req, res) => {
    console.log("Health check endpoint hit");
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.get("/api/debug/users", async (req, res) => {
    try {
      // Simple database query to check users
      const { sqlite } = await import('./db');
      const users = sqlite.prepare('SELECT id, username, email, role, is_admin FROM users').all();
      res.json({ 
        count: users.length, 
        users: users.map((u: any) => ({ 
          id: u.id, 
          username: u.username, 
          email: u.email, 
          role: u.role,
          isAdmin: u.is_admin 
        })) 
      });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to get users", details: error?.message || "Unknown error" });
    }
  });

  app.get("/api/admin/export-data", async (req, res) => {
    try {
      const user = (req.session as any)?.user;
      if (!user || !user.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }

      const { sqlite } = await import('./db');
      
      // Export all important data
      const users = sqlite.prepare('SELECT * FROM users').all();
      const contacts = sqlite.prepare('SELECT * FROM contact_submissions').all();
      const blogPosts = sqlite.prepare('SELECT * FROM blog_posts').all();
      const teamMembers = sqlite.prepare('SELECT * FROM team_members').all();
      
      const exportData = {
        users,
        contacts,
        blogPosts,
        teamMembers,
        exportDate: new Date().toISOString(),
        version: "1.0"
      };

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="afterhours-hvac-data.json"');
      res.json(exportData);
    } catch (error: any) {
      res.status(500).json({ error: "Export failed", details: error?.message });
    }
  });

  app.post("/api/admin/import-data", async (req, res) => {
    try {
      const user = (req.session as any)?.user;
      if (!user || !user.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }

      const { users, contacts, blogPosts, teamMembers } = req.body;
      const { sqlite } = await import('./db');
      
      let imported = { users: 0, contacts: 0, blogPosts: 0, teamMembers: 0 };

      // Import users (skip if already exists)
      if (users) {
        for (const userData of users) {
          try {
            sqlite.prepare(`
              INSERT OR IGNORE INTO users (
                username, email, password, first_name, last_name, role, 
                is_admin, has_pro_access, has_pro, created_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).run(
              userData.username, userData.email, userData.password,
              userData.first_name, userData.last_name, userData.role,
              userData.is_admin, userData.has_pro_access, userData.has_pro,
              userData.created_at
            );
            imported.users++;
          } catch (e) { /* Skip duplicates */ }
        }
      }

      // Import other data similarly...
      if (contacts) {
        for (const contact of contacts) {
          try {
            sqlite.prepare(`
              INSERT OR IGNORE INTO contact_submissions (
                name, email, phone, message, service_type, urgency, created_at, status
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `).run(
              contact.name, contact.email, contact.phone, contact.message,
              contact.service_type, contact.urgency, contact.created_at, contact.status
            );
            imported.contacts++;
          } catch (e) { /* Skip duplicates */ }
        }
      }

      res.json({ message: "Data imported successfully", imported });
    } catch (error: any) {
      res.status(500).json({ error: "Import failed", details: error?.message });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      // Fetch user with all fields from database
      const { sqlite } = await import('./db');
      const user = sqlite.prepare(`
        SELECT 
          id, username, email, password, first_name as firstName, last_name as lastName,
          phone, role, user_type as userType, is_admin as isAdmin,
          has_pro_access as hasProAccess, has_pro as hasPro,
          account_locked as accountLocked, created_at as createdAt,
          last_login as lastLogin
        FROM users 
        WHERE username = ? OR email = ?
      `).get(username, username);
      
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Check if account is locked
      if (user.accountLocked) {
        return res.status(403).json({ error: "Account is locked. Please contact support." });
      }

      // Remove password from user object before storing in session
      const { password: _, ...userWithoutPassword } = user;
      
      (req.session as any).userId = user.id;
      (req.session as any).user = userWithoutPassword;

      // Update last login timestamp
      sqlite.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);

      res.json({
        user: userWithoutPassword
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { username, email, password, firstName, lastName } = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username) || await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Check if this email should get admin access
      const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase()) || ADMIN_EMAILS.includes(email);
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create user with admin privileges if email matches
      const { sqlite } = await import('./db');
      const result = sqlite.prepare(`
        INSERT INTO users (
          username, email, password, first_name, last_name, role, 
          is_admin, has_pro_access, has_pro, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `).run(
        username,
        email,
        hashedPassword,
        firstName || '',
        lastName || '',
        isAdmin ? 'admin' : 'user',
        isAdmin ? 1 : 0,
        isAdmin ? 1 : 0,
        isAdmin ? 1 : 0
      );

      // Fetch the newly created user with all fields
      const newUser = sqlite.prepare(`
        SELECT 
          id, username, email, first_name as firstName, last_name as lastName,
          phone, role, user_type as userType, is_admin as isAdmin,
          has_pro_access as hasProAccess, has_pro as hasPro,
          account_locked as accountLocked, created_at as createdAt,
          last_login as lastLogin
        FROM users 
        WHERE id = ?
      `).get(result.lastInsertRowid);

      (req.session as any).userId = newUser.id;
      (req.session as any).user = newUser;

      res.json({
        user: newUser,
        message: isAdmin ? "Admin account created successfully!" : "Account created successfully!"
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", (req: Request, res: Response) => {
    const user = (req.session as any)?.user;
    if (!user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    res.json({ user });
  });

  // Frontend compatibility routes (frontend expects these paths)
  app.get("/api/user", async (req: Request, res: Response) => {
    const sessionUser = (req.session as any)?.user;
    if (!sessionUser) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      // Fetch fresh user data from database to get latest roles/permissions
      const { sqlite } = await import('./db');
      const freshUser = sqlite.prepare(`
        SELECT 
          id, username, email, first_name as firstName, last_name as lastName,
          phone, role, user_type as userType, is_admin as isAdmin,
          has_pro_access as hasProAccess, has_pro as hasPro,
          account_locked as accountLocked, created_at as createdAt,
          last_login as lastLogin
        FROM users 
        WHERE id = ?
      `).get(sessionUser.id);
      
      if (!freshUser) {
        // User was deleted, destroy session
        req.session.destroy(() => {});
        return res.status(401).json({ error: "User no longer exists" });
      }
      
      // Update session with fresh data
      (req.session as any).user = freshUser;
      
      res.json(freshUser); // Return fresh user data
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Fallback to cached session data if database fetch fails
      res.json(sessionUser);
    }
  });

  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      // Fetch user with all fields from database
      const { sqlite } = await import('./db');
      const user = sqlite.prepare(`
        SELECT 
          id, username, email, password, first_name as firstName, last_name as lastName,
          phone, role, user_type as userType, is_admin as isAdmin,
          has_pro_access as hasProAccess, has_pro as hasPro,
          account_locked as accountLocked, created_at as createdAt,
          last_login as lastLogin
        FROM users 
        WHERE username = ? OR email = ?
      `).get(username, username);
      
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Check if account is locked
      if (user.accountLocked) {
        return res.status(403).json({ error: "Account is locked. Please contact support." });
      }

      // Remove password from user object before storing in session
      const { password: _, ...userWithoutPassword } = user;
      
      (req.session as any).userId = user.id;
      (req.session as any).user = userWithoutPassword;

      // Update last login timestamp
      sqlite.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);

      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/register", async (req: Request, res: Response) => {
    try {
      const { username, email, password, firstName, lastName } = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username) || await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Check if this email should get admin access
      const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase()) || ADMIN_EMAILS.includes(email);
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create user with admin privileges if email matches
      const { sqlite } = await import('./db');
      const result = sqlite.prepare(`
        INSERT INTO users (
          username, email, password, first_name, last_name, role, 
          is_admin, has_pro_access, has_pro, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `).run(
        username,
        email,
        hashedPassword,
        firstName || '',
        lastName || '',
        isAdmin ? 'admin' : 'user',
        isAdmin ? 1 : 0,
        isAdmin ? 1 : 0,
        isAdmin ? 1 : 0
      );

      // Fetch the newly created user with all fields
      const newUser = sqlite.prepare(`
        SELECT 
          id, username, email, first_name as firstName, last_name as lastName,
          phone, role, user_type as userType, is_admin as isAdmin,
          has_pro_access as hasProAccess, has_pro as hasPro,
          account_locked as accountLocked, created_at as createdAt,
          last_login as lastLogin
        FROM users 
        WHERE id = ?
      `).get(result.lastInsertRowid);

      (req.session as any).userId = newUser.id;
      (req.session as any).user = newUser;

      res.json(newUser); // Return user directly for frontend compatibility
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Public contact form submission
  const handleContactSubmission = async (req: Request, res: Response) => {
    try {
      const contactData = req.body;
      const { sqlite } = await import('./db');
      
      const result = sqlite.prepare(`
        INSERT INTO contact_submissions (
          name, email, phone, subject, message, created_at, status
        ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, 'new')
      `).run(
        contactData.name || '',
        contactData.email || '',
        contactData.phone || '',
        contactData.subject || 'General Inquiry',
        contactData.message || ''
      );

      res.json({ id: result.lastInsertRowid, message: "Contact form submitted successfully" });
    } catch (error) {
      console.error("Contact submission error:", error);
      res.status(500).json({ error: "Failed to submit contact form" });
    }
  };

  app.post("/api/contacts", handleContactSubmission); // Public endpoint
  app.post("/api/admin/contacts", handleContactSubmission); // Keep old route for compatibility

  app.get("/api/admin/contacts", async (req: Request, res: Response) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Get contacts error:", error);
      res.status(500).json({ error: "Failed to get contact submissions" });
    }
  });

  app.get("/api/blog/posts", async (req: Request, res: Response) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Get blog posts error:", error);
      res.status(500).json({ error: "Failed to get blog posts" });
    }
  });

  app.post("/api/admin/blog/posts", async (req: Request, res: Response) => {
    try {
      const postData = blogPostSchema.parse(req.body);
      const slug = postData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const post = await storage.createBlogPost({ ...postData, slug });
      res.json(post);
    } catch (error) {
      console.error("Create blog post error:", error);
      res.status(500).json({ error: "Failed to create blog post" });
    }
  });

  app.delete("/api/admin/blog/posts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteBlogPost(id);
      res.json({ message: "Blog post deleted" });
    } catch (error) {
      console.error("Delete blog post error:", error);
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });

  // Team member endpoints - Public can view, Admin can CRUD
  app.get("/api/team", async (req: Request, res: Response) => {
    try {
      const { sqlite } = await import('./db');
      const members = sqlite.prepare(`
        SELECT 
          id, name, role, department, experience, description, 
          specialties, photo_url as photoUrl, icon_name as iconName, 
          icon_color as iconColor, display_order as displayOrder,
          is_active as isActive, created_at as createdAt
        FROM team_members 
        WHERE is_active = 1 
        ORDER BY display_order ASC, id ASC
      `).all();
      res.json(members);
    } catch (error) {
      console.error("Get team members error:", error);
      res.status(500).json({ error: "Failed to get team members" });
    }
  });

  app.post("/api/admin/team", async (req: Request, res: Response) => {
    try {
      const user = (req.session as any)?.user;
      if (!user || !user.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }

      const memberData = req.body;
      const { sqlite } = await import('./db');
      
      const result = sqlite.prepare(`
        INSERT INTO team_members (
          name, role, department, experience, description, 
          specialties, photo_url, icon_name, icon_color, display_order, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
      `).run(
        memberData.name || '',
        memberData.role || '',
        memberData.department || 'General',
        memberData.experience || '',
        memberData.description || '',
        memberData.specialties || '',
        memberData.photoUrl || '',
        memberData.iconName || 'User',
        memberData.iconColor || 'from-blue-600 to-blue-800',
        memberData.displayOrder || 0
      );

      const newMember = sqlite.prepare('SELECT * FROM team_members WHERE id = ?').get(result.lastInsertRowid);
      res.json(newMember);
    } catch (error) {
      console.error("Create team member error:", error);
      res.status(500).json({ error: "Failed to create team member" });
    }
  });

  app.put("/api/admin/team/:id", async (req: Request, res: Response) => {
    try {
      const user = (req.session as any)?.user;
      if (!user || !user.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      const memberData = req.body;
      const { sqlite } = await import('./db');
      
      sqlite.prepare(`
        UPDATE team_members SET
          name = ?, role = ?, department = ?, experience = ?,
          description = ?, specialties = ?, photo_url = ?,
          icon_name = ?, icon_color = ?, display_order = ?
        WHERE id = ?
      `).run(
        memberData.name || '',
        memberData.role || '',
        memberData.department || 'General',
        memberData.experience || '',
        memberData.description || '',
        memberData.specialties || '',
        memberData.photoUrl || '',
        memberData.iconName || 'User',
        memberData.iconColor || 'from-blue-600 to-blue-800',
        memberData.displayOrder || 0,
        id
      );

      const updatedMember = sqlite.prepare(`
        SELECT 
          id, name, role, department, experience, description, 
          specialties, photo_url as photoUrl, icon_name as iconName, 
          icon_color as iconColor, display_order as displayOrder,
          is_active as isActive, created_at as createdAt
        FROM team_members WHERE id = ?
      `).get(id);
      
      res.json(updatedMember);
    } catch (error) {
      console.error("Update team member error:", error);
      res.status(500).json({ error: "Failed to update team member" });
    }
  });

  app.delete("/api/admin/team/:id", async (req: Request, res: Response) => {
    try {
      const user = (req.session as any)?.user;
      if (!user || !user.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      const { sqlite } = await import('./db');
      
      // Soft delete
      sqlite.prepare('UPDATE team_members SET is_active = 0 WHERE id = ?').run(id);
      res.json({ message: "Team member deleted" });
    } catch (error) {
      console.error("Delete team member error:", error);
      res.status(500).json({ error: "Failed to delete team member" });
    }
  });

  app.get("/api/admin/users", async (req: Request, res: Response) => {
    try {
      const user = (req.session as any)?.user;
      if (!user || !user.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }

      const { sqlite } = await import('./db');
      const users = sqlite.prepare(`
        SELECT 
          id, username, email, first_name as firstName, last_name as lastName,
          phone, role, user_type as userType, is_admin as isAdmin, 
          has_pro_access as hasProAccess, account_locked as accountLocked,
          created_at as createdAt, last_login as lastLogin
        FROM users
      `).all();
      res.json(users);
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ error: "Failed to get users" });
    }
  });

  // Update user roles and access levels (both PATCH and PUT for compatibility)
  const updateUserHandler = async (req: Request, res: Response) => {
    try {
      const user = (req.session as any)?.user;
      if (!user || !user.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }

      const userId = parseInt(req.params.id);
      const updates = req.body;
      const { sqlite } = await import('./db');

      // Map frontend fields to database columns
      const fieldMap: Record<string, string> = {
        'isAdmin': 'is_admin',
        'hasProAccess': 'has_pro_access',
        'role': 'role',
        'userType': 'user_type',
        'accountLocked': 'account_locked',
        'firstName': 'first_name',
        'lastName': 'last_name',
        'phone': 'phone',
        'email': 'email'
      };

      const updateFields: string[] = [];
      const values: any[] = [];

      for (const [key, value] of Object.entries(updates)) {
        if (key === 'id') continue; // Skip ID field
        const dbField = fieldMap[key] || key;
        updateFields.push(`${dbField} = ?`);
        values.push(value);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({ error: "No valid fields to update" });
      }

      values.push(userId);
      const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
      
      sqlite.prepare(query).run(...values);
      
      // Return updated user with proper field mapping
      const updatedUser = sqlite.prepare(`
        SELECT 
          id, username, email, first_name as firstName, last_name as lastName,
          phone, role, user_type as userType, is_admin as isAdmin,
          has_pro_access as hasProAccess, has_pro as hasPro,
          account_locked as accountLocked, created_at as createdAt,
          last_login as lastLogin
        FROM users 
        WHERE id = ?
      `).get(userId);
      
      // If admin is updating their own account OR updating the currently logged in user's session
      // Update all active sessions for this user (in production, you'd use Redis/session store)
      // For now, we update the session if the admin is updating themselves
      const currentUser = (req.session as any)?.user;
      if (currentUser && currentUser.id === userId) {
        (req.session as any).user = updatedUser;
      }
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  };

  app.patch("/api/admin/users/:id", updateUserHandler);
  app.put("/api/admin/users/:id", updateUserHandler);

  // Job Applications endpoints
  app.post("/api/job-applications", async (req: Request, res: Response) => {
    try {
      const applicationData = jobApplicationSchema.parse(req.body);
      const { sqlite } = await import('./db');
      
      const result = sqlite.prepare(`
        INSERT INTO job_applications (
          first_name, last_name, email, phone, position, 
          experience, availability, cover_letter, created_at, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, 'new')
      `).run(
        applicationData.firstName,
        applicationData.lastName,
        applicationData.email,
        applicationData.phone,
        applicationData.position,
        applicationData.experience,
        applicationData.availability,
        applicationData.coverLetter || ''
      );

      res.json({ 
        message: "Application submitted successfully",
        id: result.lastInsertRowid,
        status: "received"
      });
    } catch (error) {
      console.error("Job application error:", error);
      res.status(500).json({ error: "Failed to submit job application" });
    }
  });

  app.get("/api/admin/job-applications", async (req: Request, res: Response) => {
    try {
      const user = (req.session as any)?.user;
      if (!user || !user.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }

      const { sqlite } = await import('./db');
      const applications = sqlite.prepare('SELECT * FROM job_applications ORDER BY created_at DESC').all();
      res.json(applications);
    } catch (error) {
      console.error("Get job applications error:", error);
      res.status(500).json({ error: "Failed to get job applications" });
    }
  });

  app.patch("/api/admin/job-applications/:id", async (req: Request, res: Response) => {
    try {
      const user = (req.session as any)?.user;
      if (!user || !user.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      const { status, notes } = req.body;
      const { sqlite } = await import('./db');
      
      // Check if status column exists, if not add it
      try {
        sqlite.exec('ALTER TABLE job_applications ADD COLUMN status TEXT DEFAULT "pending"');
      } catch (e) {
        // Column already exists
      }

      // Check if notes column exists, if not add it
      try {
        sqlite.exec('ALTER TABLE job_applications ADD COLUMN notes TEXT');
      } catch (e) {
        // Column already exists
      }

      sqlite.prepare(`
        UPDATE job_applications SET
          status = COALESCE(?, status),
          notes = COALESCE(?, notes)
        WHERE id = ?
      `).run(status, notes, id);

      const updatedApplication = sqlite.prepare('SELECT * FROM job_applications WHERE id = ?').get(id);
      res.json(updatedApplication);
    } catch (error) {
      console.error("Update job application error:", error);
      res.status(500).json({ error: "Failed to update job application" });
    }
  });

  // Service Requests endpoints
  app.post("/api/service-requests", async (req: Request, res: Response) => {
    try {
      const requestData = serviceRequestSchema.parse(req.body);
      const { sqlite } = await import('./db');
      
      const result = sqlite.prepare(`
        INSERT INTO service_requests (
          name, email, phone, service_type, description, 
          urgency, preferred_date, address, created_at, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, 'new')
      `).run(
        requestData.name,
        requestData.email,
        requestData.phone || '',
        requestData.serviceType,
        requestData.description,
        requestData.urgency,
        requestData.preferredDate || '',
        requestData.address || ''
      );

      res.json({ id: result.lastInsertRowid, message: "Service request submitted successfully" });
    } catch (error) {
      console.error("Service request error:", error);
      res.status(500).json({ error: "Failed to submit service request" });
    }
  });

  // Customer endpoint - get their own service requests
  app.get("/api/service-requests", async (req: Request, res: Response) => {
    try {
      const user = (req.session as any)?.user;
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const { sqlite } = await import('./db');
      const requests = sqlite.prepare(`
        SELECT * FROM service_requests 
        WHERE user_id = ? OR email = ?
        ORDER BY created_at DESC
      `).all(user.id, user.email);
      
      res.json(requests);
    } catch (error) {
      console.error("Get service requests error:", error);
      res.status(500).json({ error: "Failed to get service requests" });
    }
  });

  // Admin endpoint - get all service requests
  app.get("/api/admin/service-requests", async (req: Request, res: Response) => {
    try {
      const user = (req.session as any)?.user;
      if (!user || !user.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }

      const { sqlite } = await import('./db');
      const requests = sqlite.prepare('SELECT * FROM service_requests ORDER BY created_at DESC').all();
      res.json(requests);
    } catch (error) {
      console.error("Get service requests error:", error);
      res.status(500).json({ error: "Failed to get service requests" });
    }
  });

  // Emergency Requests endpoints
  const handleEmergencyRequest = async (req: Request, res: Response) => {
    try {
      const requestData = req.body;
      const { sqlite } = await import('./db');
      
      const result = sqlite.prepare(`
        INSERT INTO emergency_requests (
          name, email, phone, address, description, 
          urgency, created_at, status
        ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, 'new')
      `).run(
        requestData.name || '',
        requestData.email || '',
        requestData.phone || '',
        requestData.address || '',
        requestData.description || requestData.emergencyType || '',
        requestData.urgency || 'high'
      );

      res.json({ id: result.lastInsertRowid, message: "Emergency request submitted successfully" });
    } catch (error) {
      console.error("Emergency request error:", error);
      res.status(500).json({ error: "Failed to submit emergency request" });
    }
  };
  
  app.post("/api/emergency-requests", handleEmergencyRequest);
  app.post("/api/emergency-service", handleEmergencyRequest); // Alias for frontend compatibility

  app.get("/api/admin/emergency-requests", async (req: Request, res: Response) => {
    try {
      const user = (req.session as any)?.user;
      if (!user || !user.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }

      const { sqlite } = await import('./db');
      const requests = sqlite.prepare('SELECT * FROM emergency_requests ORDER BY created_at DESC').all();
      res.json(requests);
    } catch (error) {
      console.error("Get emergency requests error:", error);
      res.status(500).json({ error: "Failed to get emergency requests" });
    }
  });

  // Get single emergency request
  app.get("/api/emergency-requests/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { sqlite } = await import('./db');
      
      const request = sqlite.prepare('SELECT * FROM emergency_requests WHERE id = ?').get(id);
      if (!request) {
        return res.status(404).json({ error: "Emergency request not found" });
      }
      
      res.json(request);
    } catch (error) {
      console.error("Get emergency request error:", error);
      res.status(500).json({ error: "Failed to get emergency request" });
    }
  });

  // Update emergency request
  app.put("/api/admin/emergency-requests/:id", async (req: Request, res: Response) => {
    try {
      const user = (req.session as any)?.user;
      if (!user || !user.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      const { status, notes } = req.body;
      const { sqlite } = await import('./db');
      
      sqlite.prepare(`
        UPDATE emergency_requests SET
          status = COALESCE(?, status)
        WHERE id = ?
      `).run(status, id);

      const updatedRequest = sqlite.prepare('SELECT * FROM emergency_requests WHERE id = ?').get(id);
      res.json(updatedRequest);
    } catch (error) {
      console.error("Update emergency request error:", error);
      res.status(500).json({ error: "Failed to update emergency request" });
    }
  });

  // Send invoice for emergency request
  app.post("/api/admin/emergency-requests/:id/send-invoice", async (req: Request, res: Response) => {
    try {
      const user = (req.session as any)?.user;
      if (!user || !user.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      const { amount, description } = req.body;
      const { sqlite } = await import('./db');
      
      const request = sqlite.prepare('SELECT * FROM emergency_requests WHERE id = ?').get(id) as any;
      if (!request) {
        return res.status(404).json({ error: "Emergency request not found" });
      }

      // Update request status to invoiced
      sqlite.prepare(`
        UPDATE emergency_requests SET
          status = 'invoiced'
        WHERE id = ?
      `).run(id);

      // In a real implementation, you'd send an email with Stripe invoice here
      
      res.json({ 
        message: "Emergency invoice sent successfully",
        amount,
        request_id: id
      });
    } catch (error) {
      console.error("Send emergency invoice error:", error);
      res.status(500).json({ error: "Failed to send emergency invoice" });
    }
  });

  // Stripe payment intent creation
  app.post("/api/create-payment-intent", async (req: Request, res: Response) => {
    try {
      const { amount, description, metadata } = req.body;
      
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ error: "Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables." });
      }
      
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-05-28.basil'
      });
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'cad',
        description: description || 'AfterHours HVAC Service',
        metadata: metadata || {},
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error: any) {
      console.error("Create payment intent error:", error);
      res.status(500).json({ error: error.message || "Failed to create payment intent" });
    }
  });

  // Stripe subscription creation (for memberships)
  app.post("/api/create-subscription", async (req: Request, res: Response) => {
    try {
      const { planId } = req.body;
      const user = (req.session as any)?.user;
      
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ error: "Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables." });
      }
      
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-05-28.basil'
      });

      // Map plan IDs to amounts (in dollars)
      const planPrices: Record<string, number> = {
        'basic': 49,
        'premium': 149,
        'elite': 299,
        'pro_monthly': 49,
        'pro_yearly': 490
      };

      const amount = planPrices[planId] || 49;
      
      // Create a payment intent for the subscription
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'cad',
        description: `AfterHours HVAC - ${planId} Subscription`,
        metadata: {
          planId,
          userId: user.id.toString(),
          userEmail: user.email,
          subscriptionType: 'membership'
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: amount
      });
    } catch (error: any) {
      console.error("Create subscription error:", error);
      res.status(500).json({ error: error.message || "Failed to create subscription" });
    }
  });

  // Customer endpoint - get their own quotes
  app.get("/api/quotes", async (req: Request, res: Response) => {
    try {
      const user = (req.session as any)?.user;
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const { sqlite } = await import('./db');
      // Check if quotes table exists, if not return empty array
      try {
        const quotes = sqlite.prepare(`
          SELECT * FROM quotes 
          WHERE user_id = ? OR email = ?
          ORDER BY created_at DESC
        `).all(user.id, user.email);
        res.json(quotes);
      } catch (dbError) {
        // Table might not exist yet
        console.log("Quotes table may not exist yet:", dbError);
        res.json([]);
      }
    } catch (error) {
      console.error("Get quotes error:", error);
      res.status(500).json({ error: "Failed to get quotes" });
    }
  });

  // Stripe checkout session creation
  app.post("/api/create-checkout-session", async (req: Request, res: Response) => {
    try {
      const { serviceName, price, description, category, customerEmail } = req.body;
      
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ error: "Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables." });
      }
      
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-05-28.basil'
      });
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'cad',
            product_data: {
              name: serviceName,
              description: description || '',
            },
            unit_amount: Math.round(price * 100), // Convert to cents
          },
          quantity: 1,
        }],
        mode: 'payment',
        customer_email: customerEmail,
        success_url: `${req.headers.origin || 'http://localhost:5000'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin || 'http://localhost:5000'}/`,
        metadata: {
          category: category || 'service',
          serviceName: serviceName,
        }
      });

      res.json({ sessionId: session.id, url: session.url });
    } catch (error: any) {
      console.error("Create checkout session error:", error);
      res.status(500).json({ error: error.message || "Failed to create checkout session" });
    }
  });

  // Service bookings (for tracking Stripe purchases)
  app.post("/api/service-bookings", async (req: Request, res: Response) => {
    try {
      const bookingData = req.body;
      const { sqlite } = await import('./db');
      
      const result = sqlite.prepare(`
        INSERT INTO service_bookings (
          customer_name, customer_email, customer_phone, service_name, 
          service_price, service_description, payment_status, 
          stripe_session_id, created_at, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, 'confirmed')
      `).run(
        bookingData.customerName || '',
        bookingData.customerEmail || '',
        bookingData.customerPhone || '',
        bookingData.serviceName,
        bookingData.servicePrice,
        bookingData.serviceDescription || '',
        bookingData.paymentStatus || 'pending',
        bookingData.stripeSessionId || ''
      );

      res.json({ id: result.lastInsertRowid, message: "Service booking created successfully" });
    } catch (error) {
      console.error("Service booking error:", error);
      res.status(500).json({ error: "Failed to create service booking" });
    }
  });

  app.get("/api/admin/service-bookings", async (req: Request, res: Response) => {
    try {
      const user = (req.session as any)?.user;
      if (!user || !user.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }

      const { sqlite } = await import('./db');
      const bookings = sqlite.prepare('SELECT * FROM service_bookings ORDER BY created_at DESC').all();
      res.json(bookings);
    } catch (error) {
      console.error("Get service bookings error:", error);
      res.status(500).json({ error: "Failed to get service bookings" });
    }
  });

  // Alias for frontend compatibility
  app.get("/api/admin/bookings", async (req: Request, res: Response) => {
    try {
      const user = (req.session as any)?.user;
      if (!user || !user.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }

      const { sqlite } = await import('./db');
      const bookings = sqlite.prepare('SELECT * FROM service_bookings ORDER BY created_at DESC').all();
      res.json(bookings);
    } catch (error) {
      console.error("Get bookings error:", error);
      res.status(500).json({ error: "Failed to get bookings" });
    }
  });

  // Update booking
  app.put("/api/admin/bookings/:id", async (req: Request, res: Response) => {
    try {
      const user = (req.session as any)?.user;
      if (!user || !user.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      const data = req.body;
      const { sqlite } = await import('./db');
      
      sqlite.prepare(`
        UPDATE service_bookings SET
          status = COALESCE(?, status),
          payment_status = COALESCE(?, payment_status),
          customer_name = COALESCE(?, customer_name),
          customer_email = COALESCE(?, customer_email),
          customer_phone = COALESCE(?, customer_phone),
          service_name = COALESCE(?, service_name),
          service_description = COALESCE(?, service_description)
        WHERE id = ?
      `).run(
        data.status,
        data.payment_status,
        data.customer_name,
        data.customer_email,
        data.customer_phone,
        data.service_name,
        data.service_description,
        id
      );

      const updatedBooking = sqlite.prepare('SELECT * FROM service_bookings WHERE id = ?').get(id);
      res.json(updatedBooking);
    } catch (error) {
      console.error("Update booking error:", error);
      res.status(500).json({ error: "Failed to update booking" });
    }
  });

  // Delete booking
  app.delete("/api/admin/bookings/:id", async (req: Request, res: Response) => {
    try {
      const user = (req.session as any)?.user;
      if (!user || !user.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      const { sqlite } = await import('./db');
      
      sqlite.prepare('DELETE FROM service_bookings WHERE id = ?').run(id);
      res.json({ message: "Booking deleted successfully" });
    } catch (error) {
      console.error("Delete booking error:", error);
      res.status(500).json({ error: "Failed to delete booking" });
    }
  });

  // Send invoice for booking
  app.post("/api/admin/bookings/:id/send-invoice", async (req: Request, res: Response) => {
    try {
      const user = (req.session as any)?.user;
      if (!user || !user.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      const { amount, description } = req.body;
      const { sqlite } = await import('./db');
      
      const booking = sqlite.prepare('SELECT * FROM service_bookings WHERE id = ?').get(id) as any;
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      // Update booking with invoice amount
      sqlite.prepare(`
        UPDATE service_bookings SET
          service_price = ?,
          payment_status = 'invoiced'
        WHERE id = ?
      `).run(amount?.toString() || booking.service_price, id);

      // In a real implementation, you'd send an email with Stripe invoice here
      // For now, just mark as invoiced
      
      res.json({ 
        message: "Invoice sent successfully",
        amount,
        booking_id: id
      });
    } catch (error) {
      console.error("Send invoice error:", error);
      res.status(500).json({ error: "Failed to send invoice" });
    }
  });

  // Alias for bookings POST
  app.post("/api/bookings", async (req: Request, res: Response) => {
    try {
      const bookingData = req.body;
      const { sqlite } = await import('./db');
      
      const result = sqlite.prepare(`
        INSERT INTO service_bookings (
          customer_name, customer_email, customer_phone,
          service_name, service_price, service_description,
          payment_status, stripe_session_id, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `).run(
        bookingData.customerName || bookingData.customer_name || '',
        bookingData.customerEmail || bookingData.customer_email || '',
        bookingData.customerPhone || bookingData.customer_phone || '',
        bookingData.serviceName || bookingData.service_name || '',
        bookingData.servicePrice?.toString() || bookingData.service_price || '',
        bookingData.serviceDescription || bookingData.service_description || '',
        bookingData.paymentStatus || bookingData.payment_status || 'pending',
        bookingData.stripeSessionId || bookingData.stripe_session_id || null,
        bookingData.status || 'confirmed'
      );

      const newBooking = sqlite.prepare('SELECT * FROM service_bookings WHERE id = ?').get(result.lastInsertRowid);
      res.json(newBooking);
    } catch (error) {
      console.error("Create booking error:", error);
      res.status(500).json({ error: "Failed to create booking" });
    }
  });

  // Forum API Routes
  app.get("/api/forum/categories", async (req: Request, res: Response) => {
    try {
      const categories = await storage.getForumCategories();
      res.json(categories);
    } catch (error) {
      console.error("Get forum categories error:", error);
      res.status(500).json({ error: "Failed to get forum categories" });
    }
  });

  app.get("/api/forum/categories/:categoryId/topics", async (req: Request, res: Response) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const topics = await storage.getForumTopics(categoryId);
      res.json(topics);
    } catch (error) {
      console.error("Get forum topics error:", error);
      res.status(500).json({ error: "Failed to get forum topics" });
    }
  });

  app.get("/api/forum/topics/:topicId/posts", async (req: Request, res: Response) => {
    try {
      const topicId = parseInt(req.params.topicId);
      const posts = await storage.getForumPosts(topicId);
      res.json(posts);
    } catch (error) {
      console.error("Get forum posts error:", error);
      res.status(500).json({ error: "Failed to get forum posts" });
    }
  });

  app.post("/api/forum/topics", async (req: Request, res: Response) => {
    try {
      const user = (req.session as any)?.user;
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const topicData = {
        ...req.body,
        userId: user.id,
        displayName: req.body.displayName || user.username
      };
      const topic = await storage.createForumTopic(topicData);
      res.json(topic);
    } catch (error) {
      console.error("Create forum topic error:", error);
      res.status(500).json({ error: "Failed to create forum topic" });
    }
  });

  app.post("/api/forum/posts", async (req: Request, res: Response) => {
    try {
      const user = (req.session as any)?.user;
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const postData = {
        ...req.body,
        userId: user.id,
        displayName: req.body.displayName || user.username
      };
      const post = await storage.createForumPost(postData);
      res.json(post);
    } catch (error) {
      console.error("Create forum post error:", error);
      res.status(500).json({ error: "Failed to create forum post" });
    }
  });

  app.get("/api/forum/likes/count", async (req: Request, res: Response) => {
    try {
      const topicId = req.query.topicId ? parseInt(req.query.topicId as string) : undefined;
      const postId = req.query.postId ? parseInt(req.query.postId as string) : undefined;

      let count = 0;
      if (topicId) {
        count = await storage.getTopicLikeCount(topicId);
      } else if (postId) {
        count = await storage.getPostLikeCount(postId);
      }

      res.json({ count });
    } catch (error) {
      console.error("Get like count error:", error);
      res.status(500).json({ error: "Failed to get like count" });
    }
  });

  app.get("/api/forum/likes/check", async (req: Request, res: Response) => {
    try {
      const user = (req.session as any)?.user;
      if (!user) {
        return res.json({ hasLiked: false });
      }

      const topicId = req.query.topicId ? parseInt(req.query.topicId as string) : undefined;
      const postId = req.query.postId ? parseInt(req.query.postId as string) : undefined;

      let hasLiked = false;
      if (topicId) {
        hasLiked = await storage.hasUserLikedTopic(user.id, topicId);
      } else if (postId) {
        hasLiked = await storage.hasUserLikedPost(user.id, postId);
      }

      res.json({ hasLiked });
    } catch (error) {
      console.error("Check like error:", error);
      res.status(500).json({ error: "Failed to check like status" });
    }
  });

  app.post("/api/forum/likes", async (req: Request, res: Response) => {
    try {
      const user = (req.session as any)?.user;
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const likeData = {
        ...req.body,
        userId: user.id
      };
      const like = await storage.createForumLike(likeData);
      res.json(like);
    } catch (error) {
      console.error("Create like error:", error);
      res.status(500).json({ error: "Failed to create like" });
    }
  });

  app.delete("/api/forum/likes", async (req: Request, res: Response) => {
    try {
      const user = (req.session as any)?.user;
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const topicId = req.query.topicId ? parseInt(req.query.topicId as string) : undefined;
      const postId = req.query.postId ? parseInt(req.query.postId as string) : undefined;

      await storage.deleteForumLike(user.id, topicId, postId);
      res.json({ message: "Like removed successfully" });
    } catch (error) {
      console.error("Delete like error:", error);
      res.status(500).json({ error: "Failed to delete like" });
    }
  });

  app.put("/api/forum/topics/:id", async (req: Request, res: Response) => {
    try {
      const user = (req.session as any)?.user;
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const topicId = parseInt(req.params.id);
      const topic = await storage.updateForumTopic(topicId, req.body);
      res.json(topic);
    } catch (error) {
      console.error("Update topic error:", error);
      res.status(500).json({ error: "Failed to update topic" });
    }
  });

  app.put("/api/forum/posts/:id", async (req: Request, res: Response) => {
    try {
      const user = (req.session as any)?.user;
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const postId = parseInt(req.params.id);
      const post = await storage.updateForumPost(postId, req.body);
      res.json(post);
    } catch (error) {
      console.error("Update post error:", error);
      res.status(500).json({ error: "Failed to update post" });
    }
  });

  app.delete("/api/forum/topics/:id", async (req: Request, res: Response) => {
    try {
      const user = (req.session as any)?.user;
      if (!user || !user.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }

      const topicId = parseInt(req.params.id);
      await storage.deleteForumTopic(topicId);
      res.json({ message: "Topic deleted successfully" });
    } catch (error) {
      console.error("Delete topic error:", error);
      res.status(500).json({ error: "Failed to delete topic" });
    }
  });

  app.delete("/api/forum/posts/:id", async (req: Request, res: Response) => {
    try {
      const user = (req.session as any)?.user;
      if (!user || !user.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }

      const postId = parseInt(req.params.id);
      await storage.deleteForumPost(postId);
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error("Delete post error:", error);
      res.status(500).json({ error: "Failed to delete post" });
    }
  });

  // Pro membership activation (CRITICAL - missing endpoint)
  app.post("/api/activate-pro", async (req: Request, res: Response) => {
    try {
      const { paymentIntentId } = req.body;
      const user = (req.session as any)?.user;
      
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      console.log(`Activating Pro access for user ${user.id} (${user.email}) - Payment Intent: ${paymentIntentId}`);
      
      // Update user to have pro access
      const { sqlite } = await import('./db');
      sqlite.prepare(`
        UPDATE users 
        SET has_pro = 1, 
            has_pro_access = 1, 
            pro_access_granted_at = CURRENT_TIMESTAMP,
            membership_type = 'pro'
        WHERE id = ?
      `).run(user.id);
      
      // Update session with new pro status
      const updatedUser = sqlite.prepare(`
        SELECT 
          id, username, email, first_name as firstName, last_name as lastName,
          phone, role, user_type as userType, is_admin as isAdmin,
          has_pro_access as hasProAccess, has_pro as hasPro,
          membership_type as membershipType,
          account_locked as accountLocked, created_at as createdAt,
          last_login as lastLogin
        FROM users 
        WHERE id = ?
      `).get(user.id);
      
      (req.session as any).user = updatedUser;
      
      console.log(`✅ Pro access activated successfully for user ${user.id}`);
      
      res.json({ 
        success: true, 
        message: "Pro access activated successfully",
        user: updatedUser
      });
    } catch (error) {
      console.error("Pro activation error:", error);
      res.status(500).json({ error: "Failed to activate pro access" });
    }
  });

  // Corporate inquiry endpoints
  app.post("/api/corporate-inquiry", async (req: Request, res: Response) => {
    try {
      const { companyName, contactName, email, phone, industry, projectedUsers, message } = req.body;
      const { sqlite } = await import('./db');
      
      const result = sqlite.prepare(`
        INSERT INTO corporate_inquiries (
          company_name, contact_name, email, phone, industry, 
          projected_users, message, created_at, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, 'new')
      `).run(
        companyName || '',
        contactName || '',
        email || '',
        phone || '',
        industry || '',
        projectedUsers || 0,
        message || ''
      );

      console.log(`✅ Corporate inquiry saved: ${companyName} (${email})`);
      res.json({ id: result.lastInsertRowid, message: "Corporate inquiry submitted successfully" });
    } catch (error) {
      console.error("Corporate inquiry error:", error);
      res.status(500).json({ error: "Failed to submit corporate inquiry" });
    }
  });

  app.post("/api/create-corporate-subscription", async (req: Request, res: Response) => {
    try {
      const { companyName, contactEmail, maxUsers } = req.body;
      
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ error: "Stripe is not configured" });
      }
      
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-05-28.basil'
      });

      // Calculate corporate pricing (example: $49 per user)
      const pricePerUser = 49;
      const totalAmount = (maxUsers || 1) * pricePerUser;
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalAmount * 100),
        currency: 'cad',
        description: `AfterHours HVAC - Corporate Membership for ${companyName}`,
        metadata: {
          companyName,
          contactEmail,
          maxUsers: maxUsers.toString(),
          subscriptionType: 'corporate'
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      console.log(`✅ Corporate subscription created: ${companyName} - ${maxUsers} users`);
      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: totalAmount
      });
    } catch (error: any) {
      console.error("Create corporate subscription error:", error);
      res.status(500).json({ error: error.message || "Failed to create corporate subscription" });
    }
  });

  app.get("/api/admin/corporate-inquiries", async (req: Request, res: Response) => {
    try {
      const user = (req.session as any)?.user;
      if (!user || !user.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }

      const { sqlite } = await import('./db');
      const inquiries = sqlite.prepare('SELECT * FROM corporate_inquiries ORDER BY created_at DESC').all();
      res.json(inquiries);
    } catch (error) {
      console.error("Get corporate inquiries error:", error);
      res.status(500).json({ error: "Failed to get corporate inquiries" });
    }
  });

  // Gallery management endpoints
  app.post("/api/gallery", async (req: Request, res: Response) => {
    try {
      const user = (req.session as any)?.user;
      if (!user || !user.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }

      const { title, description, imageUrl, category, projectType, location, dateCompleted, featured } = req.body;
      const { sqlite } = await import('./db');
      
      const result = sqlite.prepare(`
        INSERT INTO gallery_images (
          title, description, image_url, category, project_type, location, 
          date_completed, featured, is_active, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).run(
        title || '',
        description || '',
        imageUrl || '',
        category || 'general',
        projectType || '',
        location || '',
        dateCompleted || '',
        featured ? 1 : 0
      );

      console.log(`✅ Gallery image added: ${title}`);
      res.json({ id: result.lastInsertRowid, message: "Gallery image added successfully" });
    } catch (error) {
      console.error("Add gallery image error:", error);
      res.status(500).json({ error: "Failed to add gallery image" });
    }
  });

  app.get("/api/gallery", async (req: Request, res: Response) => {
    try {
      const { sqlite } = await import('./db');
      const images = sqlite.prepare(`
        SELECT * FROM gallery_images 
        WHERE is_active = 1 
        ORDER BY featured DESC, display_order ASC, created_at DESC
      `).all();
      res.json(images);
    } catch (error) {
      console.error("Get gallery images error:", error);
      res.status(500).json({ error: "Failed to get gallery images" });
    }
  });

  app.delete("/api/gallery/:id", async (req: Request, res: Response) => {
    try {
      const user = (req.session as any)?.user;
      if (!user || !user.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      const { sqlite } = await import('./db');
      sqlite.prepare('UPDATE gallery_images SET is_active = 0 WHERE id = ?').run(id);
      
      console.log(`✅ Gallery image deleted: ${id}`);
      res.json({ message: "Gallery image deleted successfully" });
    } catch (error) {
      console.error("Delete gallery image error:", error);
      res.status(500).json({ error: "Failed to delete gallery image" });
    }
  });

  // Service callout endpoint
  app.post("/api/service-callout", async (req: Request, res: Response) => {
    try {
      const { customerName, customerEmail, customerPhone, serviceAddress, serviceDescription, urgency, amount, stripePaymentIntentId } = req.body;
      const { sqlite } = await import('./db');
      
      const result = sqlite.prepare(`
        INSERT INTO service_callouts (
          customer_name, customer_email, customer_phone, service_address, 
          service_description, urgency, amount, stripe_payment_intent_id, 
          payment_status, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'new', CURRENT_TIMESTAMP)
      `).run(
        customerName || '',
        customerEmail || '',
        customerPhone || '',
        serviceAddress || '',
        serviceDescription || '',
        urgency || 'normal',
        amount || 0,
        stripePaymentIntentId || null
      );

      console.log(`✅ Service callout saved: ${customerName} at ${serviceAddress}`);
      res.json({ id: result.lastInsertRowid, message: "Service callout request submitted successfully" });
    } catch (error) {
      console.error("Service callout error:", error);
      res.status(500).json({ error: "Failed to submit service callout request" });
    }
  });

  app.get("/api/admin/service-callouts", async (req: Request, res: Response) => {
    try {
      const user = (req.session as any)?.user;
      if (!user || !user.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }

      const { sqlite } = await import('./db');
      const callouts = sqlite.prepare('SELECT * FROM service_callouts ORDER BY created_at DESC').all();
      res.json(callouts);
    } catch (error) {
      console.error("Get service callouts error:", error);
      res.status(500).json({ error: "Failed to get service callouts" });
    }
  });

  // Admin Forum Moderation Routes
  app.get("/api/admin/forum-posts", async (req: Request, res: Response) => {
    try {
      const user = (req.session as any)?.user;
      if (!user || !user.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }

      const { sqlite } = await import('./db');
      const posts = sqlite.prepare(`
        SELECT 
          fp.*, 
          ft.title as topic_title,
          u.username as author_username
        FROM forum_posts fp
        LEFT JOIN forum_topics ft ON fp.topic_id = ft.id
        LEFT JOIN users u ON fp.user_id = u.id
        ORDER BY fp.created_at DESC
      `).all();
      res.json(posts);
    } catch (error) {
      console.error("Get admin forum posts error:", error);
      res.status(500).json({ error: "Failed to get forum posts" });
    }
  });

  app.put("/api/admin/forum-posts/:id", async (req: Request, res: Response) => {
    try {
      const user = (req.session as any)?.user;
      if (!user || !user.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }

      const postId = parseInt(req.params.id);
      const data = req.body;
      const { sqlite } = await import('./db');

      sqlite.prepare(`
        UPDATE forum_posts SET
          content = COALESCE(?, content),
          is_hidden = COALESCE(?, is_hidden),
          is_pinned = COALESCE(?, is_pinned)
        WHERE id = ?
      `).run(data.content, data.is_hidden, data.is_pinned, postId);

      const updatedPost = sqlite.prepare('SELECT * FROM forum_posts WHERE id = ?').get(postId);
      res.json(updatedPost);
    } catch (error) {
      console.error("Update forum post error:", error);
      res.status(500).json({ error: "Failed to update forum post" });
    }
  });

  app.delete("/api/admin/forum-posts/:id", async (req: Request, res: Response) => {
    try {
      const user = (req.session as any)?.user;
      if (!user || !user.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }

      const postId = parseInt(req.params.id);
      await storage.deleteForumPost(postId);
      res.json({ message: "Forum post deleted successfully" });
    } catch (error) {
      console.error("Delete forum post error:", error);
      res.status(500).json({ error: "Failed to delete forum post" });
    }
  });
}
