// Shared types for client-side use
// These mirror the server-side schema types

export interface User {
  id: number;
  username: string;
  email: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  role: string;
  userType: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  hasProAccess: boolean;
  hasPro: boolean;
  isAdmin: boolean;
  proAccessGrantedAt: string | null;
  membershipType: string | null;
  membershipExpiresAt: string | null;
  isLifetimeMember: boolean;
  profileImageUrl: string | null;
  phoneVerified: boolean;
  phoneVerificationCode: string | null;
  phoneVerificationExpiresAt: string | null;
  phoneVerifiedAt: string | null;
  corporateAccountId: number | null;
  isCorporateAdmin: boolean;
  maxSessions: number;
  deviceFingerprint: string | null;
  lastDeviceFingerprint: string | null;
  suspiciousLoginDetected: boolean;
  accountLocked: boolean;
  lockedAt: string | null;
  lockReason: string | null;
  createdAt: string;
  lastLogin: string | null;
}

export interface ForumCategory {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface ForumTopic {
  id: number;
  categoryId: number;
  userId: number;
  title: string;
  content: string;
  slug: string;
  displayName: string | null;
  views: number;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface ForumPost {
  id: number;
  topicId: number;
  userId: number;
  content: string;
  displayName: string | null;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface ForumLike {
  id: number;
  userId: number;
  topicId: number | null;
  postId: number | null;
  createdAt: string;
}

export interface GalleryImage {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string;
  category: string;
  tags: string[];
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  authorId: number;
  categoryId: number | null;
  featuredImage: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface CustomerReview {
  id: number;
  customerName: string;
  customerEmail: string | null;
  rating: number;
  title: string;
  content: string;
  serviceType: string | null;
  isApproved: boolean;
  createdAt: string;
}

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  respondedAt: string | null;
  createdAt: string;
}

export interface EmergencyRequest {
  id: number;
  customerId: number | null;
  name: string;
  phone: string;
  email: string | null;
  issueDescription: string;
  urgencyLevel: string;
  serviceAddress: string;
  preferredTime: string | null;
  status: string;
  assignedTechnician: number | null;
  estimatedCost: number | null;
  actualCost: number | null;
  completedAt: string | null;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  tier: string;
  features: string[];
  isActive: boolean;
  createdAt: string;
}

export interface ProductAccess {
  id: number;
  userId: number;
  productId: number;
  grantedAt: string;
  expiresAt: string | null;
  active: boolean;
}

// API Response types
export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
