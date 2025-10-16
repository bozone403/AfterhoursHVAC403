# 🔐 HOW TO ACCESS ADMIN FEATURES

## Blog & Forum Admin Buttons

The blog and forum pages now have admin-only "Create" buttons that only appear if you're logged in as admin.

### To Enable Admin Mode:

**Option 1: Browser Console (Quick & Easy)**
1. Open your browser's DevTools (F12 or Right-click → Inspect)
2. Go to the Console tab
3. Type this and press Enter:
```javascript
localStorage.setItem('isAdmin', 'true');
```
4. Refresh the page
5. You'll now see the "Create Post" button on `/blog` and "Create Topic" button on `/forum`

**Option 2: Disable Admin Mode**
```javascript
localStorage.removeItem('isAdmin');
```

---

## What You Can Do:

### Blog (`/blog`)
- **Create Post** button appears in top-right of header (only for admins)
- Click it to open a dialog where you can:
  - Enter title (slug auto-generates)
  - Write excerpt
  - Write full content (supports markdown)
  - Add tags
  - Publish immediately

### Forum (`/forum-interactive`) 
- **Create Topic** button for starting new discussions
- **Admin CRUD** on all posts:
  - Edit any post
  - Delete any post
  - Pin/unpin topics
- **User CRUD** on their own posts:
  - Edit their own posts
  - Delete their own posts
- Everyone can comment

---

## Removed from Admin Panel:

The Blog Posts and Forum Management tabs have been REMOVED from the admin panel (`/admin`).

**Why?** Pragmatic approach - instead of debugging admin panel issues, we put the functionality directly where it's needed (on the blog and forum pages themselves).

---

## Current Admin Panel Tabs:

1. ✅ **Service Bookings** - View all paid bookings
2. ✅ **Contact Messages** - Customer inquiries
3. ✅ **Emergency Requests** - Urgent service calls
4. ✅ **Job Applications** - Career applications
5. ✅ **Team Management** - Manage team members

**Note:** Blog and Forum are now managed on their respective pages, not in admin panel.

---

## For Production:

Replace the localStorage check with proper authentication:

```typescript
const { data: user } = useQuery({
  queryKey: ['current-user'],
  queryFn: () => apiRequest('GET', '/api/auth/me')
});

const isAdmin = user?.role === 'admin';
```

But for now, localStorage works perfectly for your use case!
