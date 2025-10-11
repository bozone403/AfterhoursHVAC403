import { db, sqlite } from './db';
import { users } from '@shared/schema-sqlite';
import bcrypt from 'bcryptjs';

async function initializeDatabase() {
  console.log('Initializing SQLite database...');

  // Create tables
  console.log('Creating tables...');
  
  // Users table
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

  // Contact submissions table
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

  // Blog posts table
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

  // Team members table
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

  // Products table
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

  console.log('Tables created successfully!');

  // Create admin users
  console.log('Creating admin users...');
  
  const adminUsers = [
    {
      username: 'jordan',
      email: 'Jordan@Afterhourshvac.ca',
      password: 'password',
      firstName: 'Jordan',
      lastName: 'Boisclair',
      role: 'admin',
      isAdmin: true,
      hasProAccess: true,
      hasPro: true
    },
    {
      username: 'derek',
      email: 'Derek@Afterhourshvac.ca', 
      password: 'password',
      firstName: 'Derek',
      lastName: 'Thompson',
      role: 'admin',
      isAdmin: true,
      hasProAccess: true,
      hasPro: true
    }
  ];

  for (const userData of adminUsers) {
    // Check if user already exists
    const existingUser = sqlite.prepare('SELECT id FROM users WHERE email = ?').get(userData.email);
    
    if (!existingUser) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      // Insert user
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

  console.log('Database initialization complete!');
}

// Run initialization if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase().catch(console.error);
}

export { initializeDatabase };
