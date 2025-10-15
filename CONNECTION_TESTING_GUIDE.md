# 🔗 FORM → ADMIN PANEL CONNECTION TESTING GUIDE

## Overview
This guide shows you exactly where each public form connects to the admin panel, how to test them, and what to look for.

---

## 🎯 CONNECTIONS MAP

### 1️⃣ **Contact Form → Contact Messages Tab**

**Frontend Form:** 
- `ContactForm.tsx` component
- Found on: `/contact` page and homepage
- Endpoint: `POST /api/contacts`

**Admin Tab:**
- Tab: **Contact Messages** (5th tab)
- Endpoint: `GET /api/admin/contacts`
- Shows: name, email, phone, message, timestamp

**How to Test:**
1. Go to `/contact` page or homepage
2. Fill out contact form:
   - Name: `Test Customer`
   - Email: `test@example.com`
   - Phone: `403-555-1234`
   - Subject: `General Inquiry`
   - Message: `Testing contact form connection to admin panel`
3. Submit form
4. Go to `/admin` → Click "Contact Messages" tab
5. **✅ You should see** your test message with all details

---

### 2️⃣ **Emergency Service Form → Emergency Requests Tab**

**Frontend Forms:**
- `EmergencyForm.tsx` component
- `EmergencyServicePopup.tsx` component
- Found on: `/emergency-service` page and emergency popup
- Endpoints: 
  - `POST /api/emergency-service`
  - `POST /api/emergency-requests`

**Admin Tab:**
- Tab: **Emergency Requests** (6th tab)
- Endpoint: `GET /api/admin/emergency-requests`
- Shows: name, phone, address, issue description, urgency level, cost, status
- **Features:** Status dropdown, Send Invoice button

**How to Test:**
1. Go to `/emergency-service` page
2. Fill out emergency form:
   - Name: `Emergency Test User`
   - Phone: `403-555-9999`
   - Address: `123 Emergency Lane, Calgary`
   - Issue: `Furnace completely dead in -30°C weather`
   - Urgency: `Critical`
3. Submit form
4. Go to `/admin` → Click "Emergency Requests" tab
5. **✅ You should see** your emergency request
6. **Test Admin Actions:**
   - Change status dropdown (pending → dispatched → completed)
   - Click "Invoice" button to send emergency invoice

---

### 3️⃣ **Service Booking Form → Service Bookings Tab**

**Frontend Form:**
- Calendar booking page at `/calendar-booking`
- Service request forms throughout site
- Endpoint: `POST /api/bookings`

**Admin Tab:**
- Tab: **Service Bookings** (4th tab)
- Endpoint: `GET /api/admin/bookings`
- Shows: customer name, service type, date, address, status, payment
- **Features:** Status updates, Invoice button, Delete button

**How to Test:**
1. Go to `/calendar-booking`
2. Select a date and time
3. Fill out booking form:
   - Name: `Service Test Customer`
   - Email: `service@test.com`
   - Phone: `403-555-7777`
   - Service: `Furnace Maintenance`
   - Address: `456 Service St, Calgary`
4. Submit booking
5. Go to `/admin` → Click "Service Bookings" tab
6. **✅ You should see** your booking
7. **Test Admin Actions:**
   - Change status (pending → confirmed → completed)
   - Click "Invoice" to send service invoice
   - Click "Delete" to remove booking

---

### 4️⃣ **Job Application Form → Job Applications Tab**

**Frontend Form:**
- `/careers` page application form
- Endpoint: `POST /api/job-applications`

**Admin Tab:**
- Tab: **Job Applications** (3rd tab)
- Endpoint: `GET /api/admin/job-applications`
- Shows: applicant name, position, experience, status
- **Features:** Status dropdown (pending → reviewing → approved/rejected → hired)

**How to Test:**
1. Go to `/careers`
2. Click "Apply Now" on any job position
3. Fill out application:
   - First Name: `Test`
   - Last Name: `Applicant`
   - Email: `applicant@test.com`
   - Phone: `403-555-6666`
   - Position: Auto-filled from job selected
   - Experience: `5 years HVAC experience - test application`
   - Availability: `Full-time`
4. Submit application
5. Go to `/admin` → Click "Job Applications" tab
6. **✅ You should see** your application
7. **Test Admin Actions:**
   - Change status dropdown to track hiring pipeline

---

### 5️⃣ **Forum Posts → Forum Management Tab**

**Frontend:**
- Forum at `/forum-interactive`
- Endpoints:
  - `POST /api/forum/topics` - Create topic
  - `POST /api/forum/posts` - Create post

**Admin Tab:**
- Tab: **Forum Management** (7th tab)
- Endpoint: `GET /api/admin/forum-posts`
- Shows: all forum posts with author, content, approval status
- **Features:** Approve, Reject, Hide/Show, Delete

**How to Test:**
1. Go to `/forum-interactive`
2. Create a new topic:
   - Title: `Test Forum Topic`
   - Content: `Testing forum connection to admin panel`
3. Submit topic
4. Create a reply/post on any topic
5. Go to `/admin` → Click "Forum Management" tab
6. **✅ You should see** your forum posts
7. **Test Admin Actions:**
   - Click "Approve" to publish
   - Click "Reject" to hide
   - Click "Hide/Show" to toggle visibility
   - Click "Delete" to permanently remove

---

### 6️⃣ **Blog Posts → Blog Management Tab** ⭐ NEW!

**Admin Only:**
- Tab: **Blog Posts** (NEW - 3rd tab)
- Create posts directly from admin panel
- Endpoint: `POST /api/admin/blog/posts`

**Public View:**
- Blog index at `/blog`
- Endpoint: `GET /api/blog/posts`

**How to Test:**
1. Go to `/admin` → Click "Blog Posts" tab
2. Click "Create Blog Post" button
3. Fill out form:
   - Title: `Test Blog Post - Winter HVAC Tips`
   - Author: `Jordan Boisclair`
   - Category: `Seasonal`
   - Excerpt: `Quick tips for keeping your HVAC running smoothly this winter.`
   - Content: `Here's a test blog post with valuable HVAC maintenance information...`
   - Published: Toggle ON
4. Click "Create Post"
5. **✅ In Admin:** See your new blog post listed
6. **✅ In Public:** Go to `/blog` → See your post displayed
7. **Test Admin Actions:**
   - Click "Eye" icon to view post
   - Click "Delete" to remove post

---

## 📊 ADMIN PANEL TABS SUMMARY

**8 Total Tabs:**
1. **Users** - User account management
2. **Team** - Link to `/admin/team` (Jordan, Derek, Earl)
3. **Blog Posts** ⭐ NEW - Create/delete blog content
4. **Job Applications** - Review career applications
5. **Service Bookings** - Manage service appointments
6. **Contact Messages** - View customer inquiries
7. **Emergency Requests** - Handle urgent service calls
8. **Forum Management** - Moderate community posts

---

## ✅ TEST CHECKLIST

Use this checklist to verify all connections:

- [ ] **Contact Form** → Contact Messages tab shows submission
- [ ] **Emergency Form** → Emergency Requests tab shows request
- [ ] **Service Booking** → Service Bookings tab shows booking
- [ ] **Job Application** → Job Applications tab shows application
- [ ] **Forum Post** → Forum Management tab shows post
- [ ] **Blog Creation** → Blog page shows new post
- [ ] **Emergency Status** → Dropdown updates work
- [ ] **Booking Invoice** → Invoice button triggers
- [ ] **Application Status** → Status changes save
- [ ] **Forum Approve** → Posts become visible
- [ ] **Blog Delete** → Post removed from /blog

---

## 🔧 ADMIN ACTIONS TO TEST

### Emergency Requests Tab:
- ✅ Change status via dropdown
- ✅ Click "Invoice" button (prompts for amount)
- ✅ See status change to "invoiced"

### Service Bookings Tab:
- ✅ Change status via dropdown
- ✅ Click "Invoice" button (prompts for amount)
- ✅ Click "Delete" button (confirms then removes)

### Job Applications Tab:
- ✅ Update status (pending → reviewing → approved → hired)
- ✅ Status changes save and reflect immediately

### Forum Management Tab:
- ✅ Click "Approve" to publish post
- ✅ Click "Reject" to hide post
- ✅ Click "Hide/Show" to toggle visibility
- ✅ Click "Delete" to permanently remove

### Blog Posts Tab:
- ✅ Create new blog post
- ✅ View post on public /blog page
- ✅ Delete post removes from public view

---

## 🐛 TROUBLESHOOTING

### "No data showing in admin tab"
- Check browser console for API errors
- Verify you submitted the form (check toast notification)
- Refresh the admin panel
- Check network tab to see if API call succeeded

### "Form submission failed"
- Check required fields are filled
- Verify phone/email format
- Check browser console for validation errors
- Try opening developer tools before submitting

### "Can't see test data"
- Make sure you're logged in as admin
- Clear browser cache and reload
- Check that form submission showed success toast
- Verify database connection (check server logs)

---

## 🎯 EXPECTED RESULTS

After testing all forms, your admin panel should show:
- 1+ Contact message
- 1+ Emergency request
- 1+ Service booking  
- 1+ Job application
- 1+ Forum post
- 1+ Blog post

All test data should be visible, editable, and deletable from the admin panel.

**Status:** All connections are live and functional! ✅
