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
      department TEXT DEFAULT 'General',
      experience TEXT,
      description TEXT,
      specialties TEXT,
      photo_url TEXT,
      icon_name TEXT DEFAULT 'User',
      icon_color TEXT DEFAULT 'from-blue-600 to-blue-800',
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Add department column if it doesn't exist (migration)
  try {
    sqlite.exec(`ALTER TABLE team_members ADD COLUMN department TEXT DEFAULT 'General'`);
  } catch (e) {
    // Column already exists, ignore
  }
  
  // Add icon_name column if it doesn't exist
  try {
    sqlite.exec(`ALTER TABLE team_members ADD COLUMN icon_name TEXT DEFAULT 'User'`);
  } catch (e) {
    // Column already exists, ignore
  }
  
  // Add icon_color column if it doesn't exist
  try {
    sqlite.exec(`ALTER TABLE team_members ADD COLUMN icon_color TEXT DEFAULT 'from-blue-600 to-blue-800'`);
  } catch (e) {
    // Column already exists, ignore
  }
  
  // Add display_order column if it doesn't exist
  try {
    sqlite.exec(`ALTER TABLE team_members ADD COLUMN display_order INTEGER DEFAULT 0`);
  } catch (e) {
    // Column already exists, ignore
  }

  // Seed team members if table is empty
  const existingMembers = sqlite.prepare('SELECT COUNT(*) as count FROM team_members WHERE is_active = 1').get() as { count: number };
  if (existingMembers.count === 0) {
    console.log('Seeding team members...');
    
    // Jordan Boisclair
    sqlite.prepare(`
      INSERT INTO team_members (
        name, role, department, experience, description, specialties,
        icon_name, icon_color, display_order, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `).run(
      'Jordan Boisclair',
      'Commercial Project Coordination & Management',
      'Commercial',
      '15+ years in HVAC industry',
      'Jordan leads the operational side of AfterHours HVAC, overseeing project coordination, material logistics, and communication between clients, trades, and suppliers. With over 15 years in the industry, he bridges field experience and business strategy to ensure every project runs smoothly, on time, and to spec.',
      'Project Management, Commercial HVAC, Logistics, Client Relations',
      'Building2',
      'from-blue-600 to-blue-800',
      1
    );

    // Derek Thompson
    sqlite.prepare(`
      INSERT INTO team_members (
        name, role, department, experience, description, specialties,
        icon_name, icon_color, display_order, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `).run(
      'Derek Thompson',
      'Residential New Home & Retrofit Manager',
      'Residential',
      '10+ years specializing in residential HVAC',
      'Derek manages our residential division, specializing in new home installations and retrofit projects. He ensures every system is designed and installed for long-term reliability, energy efficiency, and comfort. Derek\'s hands-on expertise and attention to detail make him a trusted name for homeowners and builders alike.',
      'Residential HVAC, New Home Installations, Retrofits, Energy Efficiency',
      'Home',
      'from-green-600 to-green-800',
      2
    );

    // Earl (AI)
    sqlite.prepare(`
      INSERT INTO team_members (
        name, role, department, experience, description, specialties,
        icon_name, icon_color, display_order, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `).run(
      'Earl (AI Operations System)',
      'Internal Records & Technical Support AI',
      'Technical Support',
      'Continuous learning AI assistant',
      'Earl is our in-house AI assistant — part record keeper, part technical mentor. He helps our team manage documentation, building data, and field theory. Earl\'s always learning, expanding his knowledge of HVAC codes, manuals, and mechanical literature so our technicians can get instant answers when they need them most.',
      'Documentation, Technical Support, HVAC Codes, Knowledge Management, AI Assistance',
      'Bot',
      'from-orange-500 to-orange-700',
      3
    );

    console.log('✅ Team members seeded successfully!');
  }

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

  // Job applications table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS job_applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      position TEXT NOT NULL,
      experience TEXT NOT NULL,
      availability TEXT NOT NULL,
      cover_letter TEXT,
      status TEXT DEFAULT 'new',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Service requests table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS service_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      service_type TEXT NOT NULL,
      description TEXT NOT NULL,
      urgency TEXT DEFAULT 'normal',
      preferred_date TEXT,
      address TEXT,
      status TEXT DEFAULT 'new',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Emergency requests table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS emergency_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      description TEXT NOT NULL,
      urgency TEXT DEFAULT 'high',
      status TEXT DEFAULT 'new',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Service bookings table (for Stripe purchases)
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS service_bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT,
      customer_email TEXT,
      customer_phone TEXT,
      service_name TEXT NOT NULL,
      service_price TEXT,
      service_description TEXT,
      payment_status TEXT DEFAULT 'pending',
      stripe_session_id TEXT,
      status TEXT DEFAULT 'confirmed',
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
      // Update existing user to ensure admin privileges
      sqlite.prepare(`
        UPDATE users SET 
          role = ?, 
          is_admin = ?, 
          has_pro_access = ?, 
          has_pro = ?
        WHERE email = ?
      `).run(
        userData.role,
        userData.isAdmin ? 1 : 0,
        userData.hasProAccess ? 1 : 0,
        userData.hasPro ? 1 : 0,
        userData.email
      );
      console.log(`Updated admin privileges for existing user: ${userData.email}`);
    }
  }

  console.log('Database initialization complete!');
}

// Run initialization if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase().catch(console.error);
}

export { initializeDatabase };
