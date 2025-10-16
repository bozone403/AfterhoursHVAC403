# 🧮 CALCULATOR & TOOLS AUDIT

**Date:** October 15, 2025  
**Issue:** Most calculators broken or incomplete

---

## 🚨 BROKEN LINKS & MISSING ROUTES

### Issue #1: Membership Nav Goes to 404
**Location:** Navigation bar
**Problem:** "Memberships" link points to `/membership-simple` which doesn't exist as a route
**Actual Route:** `/membership` (line 171 in App.tsx)
**Fix:** Update Navbar.tsx to use `/membership` instead of `/membership-simple`

---

## 📊 CALCULATOR STATUS

### ✅ WORKING CALCULATORS

**Enhanced Quote Builder** ⭐ (The Good One)
- **Path:** `/calculators/enhanced-quote-builder`
- **Status:** ✅ WORKS
- **Why it's good:** Uses real material data and comprehensive pricing

### ❌ BROKEN/INCOMPLETE CALCULATORS

**On /calculators page:**

1. **BTU Calculator**
   - Links to: `/calculators/btu-calculator` ✅ Route exists
   - **Status:** Need to verify if it works properly
   
2. **Energy Savings Calculator**
   - Links to: `/calculators/energy-savings` ✅ Route exists
   - **Status:** Need to verify if it works properly
   
3. **HVAC Load Calculator**
   - Links to: `/calculators/load-calculator` ✅ Route exists
   - **Status:** Need to verify if it works properly
   
4. **Simple BTU Calculator**
   - Links to: `/calculators/btu` ✅ Route exists
   - **Status:** Need to verify if it works properly

**Pro Calculators:**

5. **Advanced Material Calculator**
   - Links to: `/pro-calculator` ✅ Route exists
   - **Component:** ProCalculatorV2
   - **Status:** Need to verify

6. **Commercial Load Calculator**
   - Links to: `/calculators/commercial-estimator` ✅ Route exists
   - **Status:** Need to verify
   
7. **Project Templates**
   - Links to: `/pro-calculator` ✅ Route exists
   - **Status:** Same as #5

---

## 🔧 AVAILABLE BUT NOT LISTED

These calculators/tools exist in routes but aren't prominently featured:

1. `/calculators/pro-btu` - ProBTUCalculator
2. `/calculators/duct-sizing` - DuctSizingCalculator  
3. `/calculators/quote-builder` - QuoteBuilder (different from enhanced)
4. `/calculators/material-estimator` - MaterialEstimator
5. `/tools/ai-symptom-diagnoser` - AI diagnostic tool
6. `/tools/alberta-rebate-calculator` - Rebate calculator
7. `/tools/pro-diagnostic-assistant` - Pro tool
8. `/tools/pro-voice-assistant` - Voice assistant
9. `/tools/system-analyzer` - System analyzer
10. `/tools/hvac-literature` - Literature library

---

## 🎯 RECOMMENDED FIXES

### HIGH PRIORITY

1. **Fix Membership Nav Link**
   - Change `/membership-simple` → `/membership` in Navbar

2. **Promote Enhanced Quote Builder**
   - Make it the PRIMARY material calculator
   - Add prominent link on /calculators page
   - Maybe rename "Advanced Material Calculator" to link to enhanced-quote-builder instead of pro-calculator

3. **Consolidate Calculators**
   - You have duplicate BTU calculators (btu, btu-calculator, pro-btu)
   - Decide which one is best and remove/redirect others
   - Same for quote builders (quote-builder vs enhanced-quote-builder)

### MEDIUM PRIORITY

4. **Test All Calculators**
   - Many calculators might not have real data
   - Verify they actually work and produce accurate results
   - Consider removing non-functional ones

5. **Add Tools Section**
   - You have great tools in /tools/* that aren't discoverable
   - Add a "Professional Tools" section or page
   - Link AI diagnoser, rebate calculator, etc.

### LOW PRIORITY

6. **Create Landing Pages**
   - Pro Portal needs better onboarding
   - Material calculators need explanations
   - Add "how to use" guides

---

## 💡 SUGGESTIONS

### Option A: Simplify
- Keep ONLY Enhanced Quote Builder for materials
- Keep ONE BTU calculator (the best one)
- Remove incomplete/broken calculators
- Focus on quality over quantity

### Option B: Complete Them
- Finish implementing all calculators with real data
- Test thoroughly
- Document how to use each one

### Option C: Hybrid (RECOMMENDED)
- **FREE:** Enhanced Quote Builder (make it public, it's that good)
- **FREE:** 1 comprehensive BTU calculator
- **FREE:** Energy savings calculator
- **PRO:** Advanced features, templates, bulk pricing
- **REMOVE:** Incomplete/duplicate calculators

---

## 🔗 QUICK FIXES TO APPLY NOW

```typescript
// In Navbar.tsx - Fix membership link
{ name: 'Memberships', path: '/membership' },  // NOT /membership-simple

// In calculators.tsx - Add Enhanced Quote Builder to free section
{
  id: 'enhanced-quote',
  title: 'Material Quote Builder',
  description: 'Comprehensive material estimator with real supplier pricing',
  icon: Calculator,
  link: '/calculators/enhanced-quote-builder',
  badge: 'Recommended'
}
```

---

## 📝 NOTES

- Enhanced Quote Builder is legitimately good - should be your flagship calculator
- Most other calculators seem incomplete or use placeholder data
- Too many duplicate/similar calculators confuse users
- Consider what HVAC contractors actually need day-to-day
