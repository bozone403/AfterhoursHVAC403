import type { Express, Request, Response } from "express";
import { storage } from "./storage-simple";
import bcrypt from "bcryptjs";
import { z } from "zod";

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
      const user = await storage.getUserByUsername(username) || await storage.getUserByEmail(username);
      
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      (req.session as any).userId = user.id;
      (req.session as any).user = {
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

      // Auto-login the new user
      const newUser = {
        id: result.lastInsertRowid,
        username,
        email,
        role: isAdmin ? 'admin' : 'user',
        isAdmin
      };

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
  app.get("/api/user", (req: Request, res: Response) => {
    const user = (req.session as any)?.user;
    if (!user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    res.json(user); // Return user directly, not wrapped in {user}
  });

  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      const user = await storage.getUserByUsername(username) || await storage.getUserByEmail(username);
      
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      (req.session as any).userId = user.id;
      (req.session as any).user = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin
      };

      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin
      });
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

      // Auto-login the new user
      const newUser = {
        id: result.lastInsertRowid,
        username,
        email,
        role: isAdmin ? 'admin' : 'user',
        isAdmin
      };

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

  app.post("/api/admin/contacts", async (req: Request, res: Response) => {
    try {
      const contactData = contactSchema.parse(req.body);
      const submission = await storage.createContactSubmission(contactData);
      res.json(submission);
    } catch (error) {
      console.error("Contact submission error:", error);
      res.status(500).json({ error: "Failed to submit contact form" });
    }
  });

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

  app.get("/api/team", async (req: Request, res: Response) => {
    try {
      const members = await storage.getTeamMembers();
      res.json(members);
    } catch (error) {
      console.error("Get team members error:", error);
      res.status(500).json({ error: "Failed to get team members" });
    }
  });

  app.post("/api/admin/team", async (req: Request, res: Response) => {
    try {
      const memberData = teamMemberSchema.parse(req.body);
      const member = await storage.createTeamMember(memberData);
      res.json(member);
    } catch (error) {
      console.error("Create team member error:", error);
      res.status(500).json({ error: "Failed to create team member" });
    }
  });

  app.delete("/api/admin/team/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTeamMember(id);
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
      const users = sqlite.prepare('SELECT id, username, email, role, is_admin, created_at FROM users').all();
      res.json(users);
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ error: "Failed to get users" });
    }
  });

  // Job Applications endpoints
  app.post("/api/job-applications", async (req: Request, res: Response) => {
    try {
      const applicationData = jobApplicationSchema.parse(req.body);
      
      // For now, just log the application and return success
      // In a real implementation, you'd save this to a database
      console.log("Job application received:", applicationData);
      
      res.json({ 
        message: "Application submitted successfully",
        id: Date.now(), // Simple ID for demo
        status: "received"
      });
    } catch (error) {
      console.error("Job application error:", error);
      res.status(500).json({ error: "Failed to submit job application" });
    }
  });
}
