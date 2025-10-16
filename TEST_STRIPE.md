# 🧪 TEST STRIPE PAYMENT FLOW

## ✅ ALL 10 SERVICE PAGES NOW HAVE PAYMENT BUTTONS!

### Test Any Service Page:

1. **Residential HVAC**: `/shop/residential`
2. **Commercial Services**: `/shop/commercial`
3. **AC Repair**: `/services/ac-repair`
4. **Duct Cleaning**: `/services/duct-cleaning`
5. **Energy Audit**: `/services/energy-audit`
6. **Furnaces**: `/shop/furnaces`
7. **Water Heaters**: `/shop/water-heaters`
8. **Air Conditioning**: `/shop/air-conditioning`
9. **Add-ons/Extras**: `/shop/addons-extras`
10. **Maintenance Plans**: `/shop/maintenance-plans`

---

## 🧪 HOW TO TEST PAYMENT FLOW

### Step 1: Go to Production Site
```
https://afterhourshvac403.onrender.com/shop/residential
```

### Step 2: Click "Book Now" on Any Service
Pick any service/package and click the "Book Now" or "Subscribe Now" button.

### Step 3: Fill Customer Information
```
Name: Test Customer
Email: test@example.com
Phone: 403-555-1234
Address: 123 Main St, Calgary, AB
Notes: This is a test booking
```

### Step 4: Click "Proceed to Payment"
You'll be redirected to Stripe's hosted checkout page.

### Step 5: Use Test Card
```
Card Number: 4242 4242 4242 4242
Expiry: 12/26 (any future date)
CVC: 123
ZIP: 12345
```

### Step 6: Complete Payment
Click "Pay" on Stripe checkout.

### Step 7: See Success Page
You'll be redirected to `/payment-success` with:
- ✅ Booking confirmation
- ✅ Booking ID number
- ✅ Next steps explanation

### Step 8: Check Admin Panel
1. Go to: `/admin`
2. Click "Service Bookings" tab
3. See your booking with:
   - ✅ Customer name, email, phone
   - ✅ Service name
   - ✅ Payment status: **PAID**
   - ✅ Stripe session ID

---

## 🎯 WHAT YOU'RE TESTING

### Customer Flow:
- [ ] Click button opens modal
- [ ] Form validation works
- [ ] "Proceed to Payment" redirects to Stripe
- [ ] Stripe accepts test card
- [ ] Redirects back to success page
- [ ] Success page shows booking details

### Admin Flow:
- [ ] Booking appears in admin panel
- [ ] Shows "PAID" status
- [ ] All customer details visible
- [ ] Can contact customer

---

## 🐛 TROUBLESHOOTING

### If Payment Fails:
1. Check `.env.production` has `STRIPE_SECRET_KEY`
2. Check browser console for errors
3. Verify Stripe test mode is enabled

### If Booking Doesn't Appear:
1. Check browser console on `/payment-success`
2. Verify sessionStorage has `pendingBooking`
3. Check network tab for API errors

### If Modal Doesn't Open:
1. Hard refresh page (Cmd+Shift+R)
2. Check browser console for React errors
3. Verify page imported `ServiceBookingModal`

---

## 💡 TEST CHECKLIST

Run through each page:

- [ ] `/shop/residential` - Book a package
- [ ] `/shop/commercial` - Book commercial service  
- [ ] `/services/ac-repair` - Book AC service
- [ ] `/services/duct-cleaning` - Book duct cleaning
- [ ] `/services/energy-audit` - Book energy audit
- [ ] `/shop/furnaces` - Book a furnace
- [ ] `/shop/water-heaters` - Book water heater
- [ ] `/shop/air-conditioning` - Book AC unit
- [ ] `/shop/addons-extras` - Book add-on
- [ ] `/shop/maintenance-plans` - Subscribe to plan

**Goal:** Verify each creates a PAID booking in admin panel.

---

## ✅ SUCCESS CRITERIA

Payment flow is working if:
1. ✅ Customer can fill form and pay
2. ✅ Stripe processes payment
3. ✅ Booking created with "PAID" status
4. ✅ Appears in admin panel
5. ✅ All customer details captured

---

## 🚀 READY TO TEST!

Pick any service page and run through the flow. Every service should now accept payments!
