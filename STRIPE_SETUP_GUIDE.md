# 💳 STRIPE CHECKOUT & MEMBERSHIP SETUP GUIDE

## 🚨 CURRENT ISSUE
- ❌ Stripe keys not configured
- ❌ Checkout flow not working
- ❌ Membership navigation unclear

---

## ✅ QUICK FIX (3 Steps)

### **STEP 1: Get Your Stripe Keys**

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your **Publishable key** (starts with `pk_test_...`)
3. Copy your **Secret key** (starts with `sk_test_...`)

### **STEP 2: Create `.env.local` File**

Create a file named `.env.local` in the project root with:

```bash
# Database
DATABASE_URL=file:./database.sqlite

# Session
SESSION_SECRET=your-random-secret-key-min-32-characters-long

# STRIPE TEST KEYS (Get from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
VITE_STRIPE_PUBLIC_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE

# Environment
NODE_ENV=development
```

**Replace the Stripe keys with your actual test keys!**

### **STEP 3: Restart the Server**

```bash
npm run dev
```

---

## 🧭 MEMBERSHIP NAVIGATION PATHS

### **For Customers (Maintenance Plans):**
- Direct link: `/membership-simple`
- From homepage: Click "Membership" in nav → See maintenance plans
- Plans: Basic ($199/year), Premium ($349/year)

### **For Technicians (Pro Tools):**
- Direct link: `/membership-simple` (same page, different section)
- Plans: Monthly Pro ($49), Annual Pro ($499), Lifetime Pro ($1500)

### **For Businesses:**
- Direct link: `/corporate-membership`
- Custom enterprise plans

---

## 🛒 CHECKOUT FLOW (How It Works)

### **Current Implementation:**

1. **User selects a plan** on `/membership-simple`
2. **Clicks "Subscribe"** button
3. **Backend creates payment intent** via `/api/create-payment-intent`
4. **Stripe Elements loads** inline payment form
5. **User enters card details** (test card: `4242 4242 4242 4242`)
6. **Payment processes** through Stripe
7. **Redirects to confirmation** page

### **What's Needed:**

✅ **Backend** - Working (routes exist)
❌ **Frontend** - Needs Stripe keys in `.env.local`
❌ **Navigation** - Not prominent enough

---

## 🧪 TESTING CHECKOUT

### **Test Card Numbers:**
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **Auth Required:** `4000 0025 0000 3155`

**Any future expiry date, any CVC, any ZIP works!**

### **Test Flow:**

1. Go to `/membership-simple`
2. Click "Subscribe" on any plan
3. Fill payment form with test card: `4242 4242 4242 4242`
4. Use any future expiry (e.g., 12/26)
5. Use any 3-digit CVC (e.g., 123)
6. Click "Complete Payment"
7. Should redirect to success page

---

## 📁 KEY FILES

### **Frontend:**
- `/client/src/pages/membership-simple.tsx` - Main membership page
- `/client/src/pages/corporate-membership.tsx` - Business plans
- `/client/src/pages/stripe-checkout.tsx` - Checkout page
- `/client/src/pages/payment-confirmation.tsx` - Success page

### **Backend:**
- `/server/routes.ts` - Lines 1034-1158
  - `POST /api/create-payment-intent` - Creates payment
  - `POST /api/create-subscription` - Creates membership
  - `POST /api/create-checkout-session` - Stripe hosted checkout

---

## 🔧 TROUBLESHOOTING

### **"Stripe is not configured" Error**
- ✅ Create `.env.local` file with Stripe keys
- ✅ Restart server (`npm run dev`)
- ✅ Check keys don't have extra spaces

### **"Payment element not loading"**
- ✅ Verify `VITE_STRIPE_PUBLIC_KEY` starts with `pk_test_`
- ✅ Check browser console for errors
- ✅ Ensure Stripe keys are test keys (not live)

### **"Can't find membership page"**
- ✅ Go directly to `/membership-simple`
- ✅ Check navigation header has "Membership" link
- ✅ Verify route exists in App.tsx

### **Payment succeeds but nothing happens**
- ✅ Check `/payment-confirmation` route exists
- ✅ Verify redirect URL in payment form
- ✅ Check browser console for JavaScript errors

---

## 🚀 PRODUCTION DEPLOYMENT

### **When going live:**

1. Get LIVE Stripe keys from: https://dashboard.stripe.com/apikeys
2. Update production environment variables:
   ```
   STRIPE_SECRET_KEY=sk_live_...
   VITE_STRIPE_PUBLIC_KEY=pk_live_...
   ```
3. Set up webhooks at: https://dashboard.stripe.com/webhooks
4. Add webhook endpoint: `https://yourdomain.com/api/stripe-webhook`
5. Handle events: `payment_intent.succeeded`, `customer.subscription.created`

---

## 💡 IMPROVEMENTS NEEDED

### **Priority 1: Navigation**
- [ ] Add prominent "Membership" link in header
- [ ] Add membership CTA on homepage
- [ ] Create membership landing page

### **Priority 2: Checkout UX**
- [ ] Add loading states
- [ ] Show plan details during checkout
- [ ] Add "Back" button
- [ ] Show total with tax

### **Priority 3: Post-Purchase**
- [ ] Email confirmation
- [ ] Account dashboard showing active plan
- [ ] Receipt/invoice generation
- [ ] Subscription management page

---

## 📞 NEED HELP?

1. **Stripe Dashboard**: https://dashboard.stripe.com
2. **Stripe Docs**: https://stripe.com/docs
3. **Test Cards**: https://stripe.com/docs/testing

---

## ✅ QUICK START CHECKLIST

- [ ] Created `.env.local` with Stripe test keys
- [ ] Restarted dev server
- [ ] Tested navigation to `/membership-simple`
- [ ] Selected a plan and clicked Subscribe
- [ ] Saw Stripe payment form load
- [ ] Entered test card `4242 4242 4242 4242`
- [ ] Payment processed successfully
- [ ] Redirected to confirmation page

**If all checked ✅ - Stripe checkout is working!**
