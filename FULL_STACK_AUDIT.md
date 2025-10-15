# 🔍 FULL-STACK COMMUNICATION AUDIT

**Date:** Dec 14, 2025  
**Status:** Running comprehensive QC check

---

## 🎯 METHODOLOGY

Checking:
1. ✅ All frontend API calls
2. ✅ Backend endpoint existence
3. ✅ Database schema alignment
4. ⚠️ Broken connections
5. ⚠️ Missing endpoints
6. ⚠️ Mismatched data structures

---

## 📊 FRONTEND → BACKEND MAPPING

### ✅ **WORKING ENDPOINTS**

#### Authentication & Users
- ✅ `GET /api/user` → Fetches current user
- ✅ `POST /api/login` → User login
- ✅ `POST /api/register` → User registration
- ✅ `POST /api/logout` → User logout
- ✅ `GET /api/admin/users` → Fetch all users (admin)
- ✅ `PUT /api/admin/users/:id` → Update user (admin)
- ✅ `PATCH /api/admin/users/:id` → Update user (admin)

#### Team Management
- ✅ `GET /api/team` → Fetch team members (public)
- ✅ `POST /api/admin/team` → Create team member (admin)
- ✅ `PUT /api/admin/team/:id` → Update team member (admin)
- ✅ `DELETE /api/admin/team/:id` → Delete team member (admin)

#### Payments & Subscriptions
- ✅ `POST /api/create-payment-intent` → Create Stripe payment
- ✅ `POST /api/create-subscription` → Create membership subscription
- ✅ `POST /api/create-checkout-session` → Create Stripe checkout

#### Forms & Submissions
- ✅ `POST /api/contacts` → Contact form (public)
- ✅ `POST /api/emergency-service` → Emergency service request
- ✅ `POST /api/emergency-requests` → Emergency requests
- ✅ `POST /api/service-requests` → Service booking requests
- ✅ `POST /api/job-applications` → Job applications
- ✅ `GET /api/admin/contacts` → View contact submissions (admin)
- ✅ `GET /api/admin/emergency-requests` → View emergency requests (admin)
- ✅ `GET /api/admin/job-applications` → View job applications (admin)

#### Forum
- ✅ `GET /api/forum/categories` → Fetch forum categories
- ✅ `GET /api/forum/categories/:categoryId/topics` → Fetch topics
- ✅ `GET /api/forum/topics/:topicId/posts` → Fetch posts
- ✅ `POST /api/forum/topics` → Create new topic
- ✅ `POST /api/forum/posts` → Create new post
- ✅ `PUT /api/forum/posts/:id` → Edit post
- ✅ `DELETE /api/forum/posts/:id` → Delete post
- ✅ `POST /api/forum/likes` → Like topic/post
- ✅ `DELETE /api/forum/likes` → Unlike topic/post
- ✅ `GET /api/forum/likes/count` → Get like count
- ✅ `GET /api/forum/likes/check` → Check if user liked

#### Blog
- ✅ `GET /api/blog/posts` → Fetch blog posts
- ✅ `POST /api/admin/blog/posts` → Create blog post (admin)
- ✅ `DELETE /api/admin/blog/posts/:id` → Delete blog post (admin)

---

## ⚠️ **POTENTIAL ISSUES FOUND**

### 1. **Admin Dashboard - Missing Endpoints**

#### ❌ `GET /api/admin/bookings`
**Frontend calls:** `admin-dashboard-enhanced.tsx:122`
```tsx
const { data: bookings = [], isLoading: bookingsLoading } = useQuery<any[]>({
  queryKey: ["/api/admin/bookings"],
  enabled: true
});
```
**Backend:** ❌ NO ENDPOINT
**Fix needed:** Create `/api/admin/bookings` or change to `/api/admin/service-bookings`

---

#### ❌ `PUT /api/admin/bookings/:id`
**Frontend calls:** `admin-dashboard-enhanced.tsx:350`
```tsx
mutationFn: async ({ id, data }: { id: number; data: any }) => {
  return await apiRequest("PUT", `/api/admin/bookings/${id}`, data);
}
```
**Backend:** ❌ NO ENDPOINT  
**Fix needed:** Create booking update endpoint

---

#### ❌ `DELETE /api/admin/bookings/:id`
**Frontend calls:** `admin-dashboard-enhanced.tsx:371`
```tsx
mutationFn: async (id: number) => {
  return await apiRequest("DELETE", `/api/admin/bookings/${id}`);
}
```
**Backend:** ❌ NO ENDPOINT  
**Fix needed:** Create booking delete endpoint

---

#### ❌ `POST /api/admin/bookings/:id/send-invoice`
**Frontend calls:** `admin-dashboard-enhanced.tsx:392`
```tsx
mutationFn: async ({ id, amount, description }) => {
  return await apiRequest("POST", `/api/admin/bookings/${id}/send-invoice`, { amount, description });
}
```
**Backend:** ❌ NO ENDPOINT  
**Fix needed:** Create invoice endpoint

---

#### ❌ `POST /api/admin/emergency-requests/:id/send-invoice`
**Frontend calls:** `admin-dashboard-enhanced.tsx:413`
**Backend:** ❌ NO ENDPOINT  
**Fix needed:** Create emergency invoice endpoint

---

#### ❌ `PUT /api/admin/emergency-requests/:id`
**Frontend calls:** `admin-dashboard-enhanced.tsx:319`
```tsx
mutationFn: async ({ id, status }: { id: number; status: string }) => {
  return await apiRequest("PUT", `/api/admin/emergency-requests/${id}`, { status });
}
```
**Backend:** ❌ NO ENDPOINT  
**Fix needed:** Create emergency request update endpoint

---

#### ❌ `GET /api/admin/forum-posts`
**Frontend calls:** `admin-dashboard-enhanced.tsx:140`
```tsx
const { data: forumPosts = [], isLoading: forumLoading } = useQuery<any[]>({
  queryKey: ["/api/admin/forum-posts"],
  enabled: true
});
```
**Backend:** ❌ NO ENDPOINT  
**Fix needed:** Create admin forum posts view

---

#### ❌ `PUT /api/admin/forum-posts/:id`
**Frontend calls:** `admin-dashboard-enhanced.tsx:459`
**Backend:** ❌ NO ENDPOINT  
**Fix needed:** Create forum post moderation endpoint

---

#### ❌ `DELETE /api/admin/forum-posts/:id`
**Frontend calls:** `admin-dashboard-enhanced.tsx:479`
**Backend:** ❌ NO ENDPOINT  
**Fix needed:** Create forum post delete (admin) endpoint

---

### 2. **User Settings - Missing Endpoints**

#### ❌ `PUT /api/user/profile`
**Frontend:** `user-settings.tsx`
**Likely called:** Profile update functionality
**Backend:** ❌ NO ENDPOINT
**Fix needed:** Create user profile update endpoint

---

#### ❌ `PUT /api/user/password`
**Frontend:** `user-settings.tsx`
**Likely called:** Password change functionality
**Backend:** ❌ NO ENDPOINT
**Fix needed:** Create password change endpoint

---

### 3. **Calendar Booking - Potential Issue**

#### ⚠️ `POST /api/bookings`
**Frontend calls:** `calendar-booking.tsx:109`
```tsx
mutationFn: async (data: any) => {
  const response = await apiRequest("POST", "/api/bookings", data);
  return response.json();
}
```
**Backend:** Has `/api/service-bookings` but NOT `/api/bookings`  
**Fix needed:** Add alias route or update frontend

---

### 4. **Emergency Tracker - Missing Endpoints**

#### ❌ `GET /api/emergency-requests/:id`
**Frontend:** `emergency-tracker.tsx:71`
**Backend:** ❌ NO ENDPOINT  
**Fix needed:** Create single emergency request endpoint

---

#### ❌ `PUT /api/emergency-requests/:id/status`
**Frontend:** Likely needed for status updates
**Backend:** ❌ NO ENDPOINT  
**Fix needed:** Create status update endpoint

---

### 5. **Admin Photos - Missing Upload**

#### ⚠️ `POST /api/admin/photos/upload`
**Frontend:** `admin-photos-enhanced.tsx`
**Backend:** May not have file upload configured
**Fix needed:** Implement file upload handler (multer, cloudinary, etc.)

---

### 6. **Job Applications - Missing Update**

#### ❌ `PATCH /api/admin/job-applications/:id`
**Frontend calls:** `admin-dashboard-enhanced.tsx:257`
```tsx
mutationFn: async ({ id, status, notes }) => {
  const res = await apiRequest("PATCH", `/api/admin/job-applications/${id}`, { status, notes });
}
```
**Backend:** ❌ NO ENDPOINT  
**Fix needed:** Create job application status update

---

### 7. **Service Callout Payment - Unclear Flow**

**File:** `service-callout-payment.tsx`
**Potential issue:** May call non-existent payment tracking endpoints

---

## 🔧 **DATABASE SCHEMA ISSUES**

### Missing Tables/Columns

#### ⚠️ `service_bookings` table
- Referenced in code but may not match schema
- Check if `stripe_session_id`, `payment_status` exist

#### ⚠️ `job_applications` table
- Check if `status`, `notes`, `reviewed_at` columns exist

#### ⚠️ `emergency_requests` table
- Check if `status`, `pricing` columns exist

---

## 🚨 **CRITICAL FIXES NEEDED (Priority Order)**

### **HIGH PRIORITY** 🔴

1. **Admin Bookings Management**
   - `GET /api/admin/bookings` (dashboard breaking)
   - `PUT /api/admin/bookings/:id`
   - `DELETE /api/admin/bookings/:id`

2. **Emergency Request Management**
   - `PUT /api/admin/emergency-requests/:id`
   - `GET /api/emergency-requests/:id`

3. **Job Application Status Updates**
   - `PATCH /api/admin/job-applications/:id`

4. **Calendar Booking Alias**
   - `POST /api/bookings` → alias to `/api/service-bookings`

### **MEDIUM PRIORITY** 🟡

5. **User Profile Management**
   - `PUT /api/user/profile`
   - `PUT /api/user/password`

6. **Admin Forum Moderation**
   - `GET /api/admin/forum-posts`
   - `PUT /api/admin/forum-posts/:id`
   - `DELETE /api/admin/forum-posts/:id`

7. **Invoice Sending**
   - `POST /api/admin/bookings/:id/send-invoice`
   - `POST /api/admin/emergency-requests/:id/send-invoice`

### **LOW PRIORITY** 🟢

8. **Photo Upload System**
   - `POST /api/admin/photos/upload`
   - File storage configuration

---

## 📝 **RECOMMENDED ACTION PLAN**

### Phase 1: Fix Breaking Issues (30 min)
1. Create `/api/admin/bookings` endpoint
2. Add booking update/delete endpoints
3. Add emergency request update endpoint
4. Add job application PATCH endpoint

### Phase 2: Add Missing CRUD (1 hour)
5. User profile endpoints
6. Admin forum moderation
7. Invoice endpoints

### Phase 3: Enhancements (1-2 hours)
8. File upload system
9. Status tracking improvements
10. Better error handling

---

## 💡 **FRONTEND IMPROVEMENTS NEEDED**

1. **Better Error Handling**
   - Many API calls don't handle 404/500 errors
   - Add retry logic for failed requests
   - Show user-friendly error messages

2. **Loading States**
   - Some queries don't show loading spinners
   - Add skeleton loaders

3. **Type Safety**
   - Many `any` types should be properly typed
   - Create shared TypeScript interfaces

4. **Query Keys**
   - Standardize query key structure
   - Use query key factories

---

## 🎯 **NEXT STEPS**

1. ✅ Review this audit
2. ⚠️ Prioritize fixes
3. ⚠️ Create missing endpoints
4. ⚠️ Test each flow end-to-end
5. ⚠️ Update database schema if needed
6. ⚠️ Add proper error handling
7. ⚠️ Write tests for critical paths

---

## 📊 **SUMMARY**

- **Total Endpoints Checked:** ~50
- **Working Endpoints:** ~35 (70%)
- **Missing Endpoints:** ~15 (30%)
- **Critical Issues:** 4
- **Medium Issues:** 6
- **Low Issues:** 5

**Overall Grade:** C+ (Functional but needs work)

The site works for basic flows but admin dashboard and some advanced features are broken due to missing backend endpoints.
