# AfterHours HVAC - Replit Configuration

## Overview

AfterHours HVAC is a comprehensive web application serving dual business units: a local HVAC service company (Calgary and surrounding areas) and a Pro Tools SaaS platform for HVAC technicians across Canada. The application provides customer-facing services including quote generation, service booking, emergency requests, and AI-powered diagnostics, alongside a professional membership platform with advanced calculators, tools, and an AI assistant named "Earl."

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management
- Tailwind CSS with shadcn/ui components for styling

**Design System:**
- Custom HVAC-themed color palette (royal blue, accent orange, neutral grays)
- Dark mode support via next-themes
- Responsive mobile-first design approach
- Custom fonts: Inter, Poppins, DM Sans, Space Grotesk, JetBrains Mono

**Key UI Components:**
- Radix UI primitives for accessible, unstyled components
- Custom calculator interfaces for HVAC calculations
- Form components with react-hook-form and Zod validation
- Toast notifications for user feedback
- Protected routes with authentication guards

### Backend Architecture

**Server Framework:**
- Express.js server with TypeScript
- Session-based authentication using express-session with Passport.js
- PostgreSQL session store for persistence

**Database Layer:**
- PostgreSQL database accessed via Drizzle ORM
- Schema-first approach with comprehensive type generation
- Connection pooling via node-postgres (pg)
- SSL-enabled connections for hosted database environments

**API Design:**
- RESTful endpoints under `/api/*` namespace
- Session-based authentication with CORS support
- Role-based access control (user, admin, moderator)
- Multi-tier membership system (user, pro, corporate, lifetime)

**Authentication & Security:**
- Bcrypt-based password hashing using scrypt
- Phone verification system with SMS integration
- Device fingerprinting for suspicious login detection
- Session management with configurable max concurrent sessions
- Admin role detection via email whitelist and database flags

### Data Storage Solutions

**Primary Database (PostgreSQL):**
- User accounts with role-based permissions
- Product catalog and membership tiers
- Forum system (categories, topics, posts, likes)
- Gallery and carousel image management
- Blog posts and categories
- HVAC equipment, materials, and accessories catalog
- Customer reviews and testimonials
- Emergency requests and service bookings
- Job applications

**Session Storage:**
- PostgreSQL-backed session store using connect-pg-simple
- Tracks active user sessions with device information
- Session activity logging for security auditing

**File Storage:**
- Image uploads for gallery, carousel, and user profiles
- PDF generation for quotes and invoices (planned)

### External Dependencies

**Payment Processing:**
- Stripe for payment processing and subscription management
- Stripe Checkout integration for one-time payments
- Subscription lifecycle management
- Customer portal integration (planned)

**AI Services:**
- Google Gemini API for "Earl" AI assistant (primary)
- Anthropic Claude API as alternative AI provider
- Symptom diagnosis for homeowners
- Technical guidance for pro users
- Context-aware responses based on user tier

**Communication Services:**
- SMS service integration for phone verification (implementation needed)
- Email service via SendGrid (configuration pending)
- Emergency notification system

**Error Monitoring:**
- Sentry integration for both frontend and backend
- Real-time error tracking and alerting

**Analytics & Mapping:**
- Structured data for SEO (JSON-LD schema markup)
- Geographic coordinates for local business listing

**Build & Development:**
- Replit-specific plugins for runtime error handling
- Cartographer plugin for Replit development environment
- Vite HMR over WebSocket with server integration

### Key Architectural Decisions

**Monorepo Structure:**
- Shared schema definitions in `/shared` for type consistency
- Separate client and server directories with independent package.json files
- Common build output to `/dist` directory

**Database ORM Choice:**
- Drizzle ORM selected for type-safe PostgreSQL access
- Schema defined in TypeScript for compile-time validation
- Migration management via drizzle-kit
- Note: While Prisma client is generated, Drizzle is the primary ORM in use

**Session vs JWT:**
- Session-based authentication chosen over JWT for better security control
- Enables server-side session invalidation
- Supports concurrent session limits per user tier

**Multi-Tenancy for Corporate:**
- Corporate accounts support multiple users under one subscription
- Hierarchical user structure with corporate admin roles
- Unlimited sessions for corporate accounts (vs 1-3 for individual tiers)

**Catalog Data Management:**
- Real pricing data from Alggin HVAC supplier embedded in codebase
- Calculator tools use actual wholesale pricing for accurate quotes
- Material estimator integrates supplier catalog directly

**AI Integration Strategy:**
- Dual AI provider support (Gemini primary, Claude secondary)
- Context-aware system prompts based on user expertise level
- "Earl" persona maintains consistent voice across interactions
- Different response depth for homeowners vs professional technicians