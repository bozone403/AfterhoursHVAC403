import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import cors from 'cors';
import session from 'express-session';
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000', 
    'http://localhost:5000',
    'https://afterhourshvac403.onrender.com',
    'https://afterhourshvac.ca',
    'https://www.afterhourshvac.ca'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'afterhours-hvac-session-secret-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to false for development, true for production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax' // Allow cross-site requests
  }
}));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  console.log("Starting server setup...");
  
  // Initialize database
  console.log("Initializing database...");
  try {
    const { initializeDatabase } = await import("./init-db");
    await initializeDatabase();
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization error:", error);
    // Don't exit, continue with server startup
  }
  
  console.log("About to register routes...");
  registerRoutes(app);
  console.log("Routes registered successfully");
  
  const { createServer } = await import("http");
  const server = createServer(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Use PORT from environment (Render provides this) or default to 5000
  const port = parseInt(process.env.PORT || "5000");
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, async () => {
    log(`serving on port ${port}`);
    
    log('Server started successfully');
  });
})();
