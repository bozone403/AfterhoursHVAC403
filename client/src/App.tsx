import React, { useEffect, useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EmergencyBanner from "@/components/layout/EmergencyBanner";
import WelcomeModal from "@/components/modals/WelcomeModal";

// Pages
import HomeLuxury from "@/pages/home-luxury";
import About from "@/pages/about";

import Pricing from "@/pages/pricing-cards";
import Contact from "@/pages/contact";
import Quote from "@/pages/quote";
import Calculators from "@/pages/calculators";
import MaterialEstimator from "@/pages/calculators/material-estimator-alggin";
import CommercialEstimator from "@/pages/calculators/commercial-estimator";
import BTUCalculator from "@/pages/calculators/btu";
import BTUCalc from "@/pages/calculators/btu-calculator";
import EnergySavingsCalculator from "@/pages/calculators/energy-savings";
import LoadCalculator from "@/pages/calculators/load-calculator";
import ProBTUCalculator from "@/pages/calculators/pro-btu-calculator";
import DuctSizingCalculator from "@/pages/calculators/duct-sizing-calculator";
import QuoteBuilder from "@/pages/calculators/quote-builder";
import EnhancedQuoteBuilder from "@/pages/calculators/enhanced-quote-builder";
import ServiceTracking from "@/pages/service-tracking";
import EmergencyTracker from "@/pages/emergency-tracker";
import EmergencyService from "@/pages/emergency-service";
import ProCalculatorV2 from "@/pages/pro-calculator-v2";
import ProPortal from "@/pages/pro-portal";
import MembershipSimple from "@/pages/membership-simple";
import CorporateMembership from "@/pages/corporate-membership";
import AISymptomDiagnoser from "@/pages/tools/ai-symptom-diagnoser";
import AlbertaRebateCalculator from "@/pages/tools/alberta-rebate-calculator";
import ProDiagnosticAssistant from "@/pages/tools/pro-diagnostic-assistant";
import ProVoiceAssistant from "@/pages/tools/pro-voice-assistant";
import SystemAnalyzer from "@/pages/tools/system-analyzer";
import HVACLiterature from "@/pages/tools/hvac-literature";
import FurnaceInstall from "@/pages/services/furnace-install";
import ACRepair from "@/pages/services/ac-repair";
import DuctCleaning from "@/pages/services/duct-cleaning";
import HVACMaintenance from "@/pages/services/maintenance";
import EnergyAudit from "@/pages/services/energy-audit";
import ServiceAreas from "@/pages/service-areas";
import Careers from "@/pages/careers";
import Reviews from "@/pages/reviews";
import BlogIndex from "@/pages/blog/index";
import BlogFurnaceWinter from "@/pages/blog/prepare-furnace-winter";
import BlogCommercialVsResidential from "@/pages/blog/commercial-vs-residential-hvac";
import Checkout from "@/pages/checkout";
import Payment from "@/pages/payment";
import StripeCheckout from "@/pages/stripe-checkout";
import AdminPhotos from "@/pages/admin-photos-enhanced";
import PaymentConfirmation from "@/pages/payment-confirmation";
import PaymentSuccess from "@/pages/payment-success";
import CalendarBooking from "@/pages/calendar-booking";
import FurnacePage from "@/pages/products/furnace";
import AuthPage from "@/pages/auth";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import ForumPage from "@/pages/forum-interactive";
import AdminDashboard from "@/pages/admin-dashboard-enhanced";
import AdminTeamManagement from "@/pages/admin-team-management";
import UserSettings from "@/pages/user-settings";
import CustomerDashboard from "@/pages/customer-dashboard";
import ResidentialServices from "@/pages/shop/residential";
import CommercialServices from "@/pages/shop/commercial";
import AddOnsExtras from "@/pages/shop/addons-extras";
import ServiceCalloutPayment from "@/pages/service-callout-payment";
import FurnacesShop from "@/pages/shop/furnaces";
import MaintenancePlansShop from "@/pages/shop/maintenance-plans";
import AirConditioningShop from "@/pages/shop/air-conditioning";
import WaterHeatersShop from "@/pages/shop/water-heaters";
import TermsOfService from "@/pages/terms-of-service";
import JobApplication from "@/pages/job-application";
import PrivacyPolicy from "@/pages/privacy-policy";
import Sitemap from "@/pages/sitemap";
import Gallery from "@/pages/gallery";

function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        {/* Public routes */}
        <Route path="/" component={HomeLuxury} />
        <Route path="/about" component={About} />
        <Route path="/services" component={ResidentialServices} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/shop" component={ResidentialServices} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/contact" component={Contact} />
        <Route path="/quote" component={Quote} />
        <Route path="/calculators" component={Calculators} />
        <Route path="/calculators/material-estimator" component={MaterialEstimator} />
        <Route path="/calculators/commercial-estimator" component={CommercialEstimator} />
        <Route path="/calculators/btu" component={BTUCalculator} />
        <Route path="/calculators/btu-calculator" component={BTUCalc} />
        <Route path="/calculators/energy-savings" component={EnergySavingsCalculator} />
        <Route path="/calculators/load-calculator" component={LoadCalculator} />
        <Route path="/tools/ai-symptom-diagnoser" component={AISymptomDiagnoser} />
        <Route path="/tools/alberta-rebate-calculator" component={AlbertaRebateCalculator} />
        <Route path="/tools/pro-diagnostic-assistant" component={ProDiagnosticAssistant} />
        <Route path="/tools/pro-voice-assistant" component={ProVoiceAssistant} />
        <Route path="/tools/system-analyzer" component={SystemAnalyzer} />
        <Route path="/tools/hvac-literature" component={HVACLiterature} />
        <Route path="/service-tracking" component={ServiceTracking} />
        <Route path="/services/furnace-install">
          {() => {
            window.location.href = '/shop/furnaces';
            return null;
          }}
        </Route>
        <Route path="/services/maintenance">
          {() => {
            window.location.href = '/shop/maintenance-plans';
            return null;
          }}
        </Route>
        <Route path="/services/ac-repair" component={ACRepair} />
        <Route path="/services/duct-cleaning" component={DuctCleaning} />
        <Route path="/services/energy-audit" component={EnergyAudit} />
        <Route path="/emergency-tracker" component={EmergencyTracker} />
        <Route path="/products/furnace" component={FurnacePage} />
        
        {/* Shop routes */}
        <Route path="/shop/residential" component={ResidentialServices} />
        <Route path="/shop/commercial" component={CommercialServices} />
        <Route path="/shop/addons" component={AddOnsExtras} />
        <Route path="/shop/furnaces" component={FurnacesShop} />
        <Route path="/shop/air-conditioning" component={AirConditioningShop} />
        <Route path="/shop/water-heaters" component={WaterHeatersShop} />
        <Route path="/shop/maintenance-plans" component={MaintenancePlansShop} />
        
        <Route path="/blog" component={BlogIndex} />
        <Route path="/blog/prepare-furnace-winter" component={BlogFurnaceWinter} />
        <Route path="/blog/commercial-vs-residential-hvac" component={BlogCommercialVsResidential} />
        <Route path="/service-areas" component={ServiceAreas} />
        <Route path="/careers" component={Careers} />
        <Route path="/job-application" component={JobApplication} />
        <Route path="/reviews" component={Reviews} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        
        {/* Legal pages */}
        <Route path="/terms-of-service" component={TermsOfService} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/sitemap" component={Sitemap} />
        
        {/* Membership and Pro routes */}
        <Route path="/membership" component={MembershipSimple} />
        <Route path="/corporate-membership" component={CorporateMembership} />
        <Route path="/pro-calculator" component={ProCalculatorV2} />
        <Route path="/pro-portal" component={ProPortal} />
        <Route path="/calculators/pro-btu" component={ProBTUCalculator} />
        <Route path="/calculators/duct-sizing" component={DuctSizingCalculator} />
        <Route path="/calculators/quote-builder" component={QuoteBuilder} />
        <Route path="/calculators/enhanced-quote-builder" component={EnhancedQuoteBuilder} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/checkout/:productId" component={Checkout} />
        <Route path="/payment/:productId" component={Payment} />
        <Route path="/stripe-checkout" component={StripeCheckout} />
        <Route path="/payment-confirmation" component={PaymentConfirmation} />
        <Route path="/payment-success" component={PaymentSuccess} />
        <Route path="/calendar-booking" component={CalendarBooking} />
        <Route path="/service-callout" component={ServiceCalloutPayment} />
        
        {/* Protected routes that require authentication */}
        <ProtectedRoute path="/forum" component={ForumPage} />
        <ProtectedRoute path="/settings" component={UserSettings} />
        
        {/* Customer dashboard routes */}
        <ProtectedRoute path="/dashboard" component={CustomerDashboard} customerOnly={true} />
        <ProtectedRoute path="/customer-dashboard" component={CustomerDashboard} />
        
        {/* Pro-only routes - Pro members only */}
        <ProtectedRoute path="/pro-portal" component={ProPortal} proOnly={true} />
        
        {/* Admin-only routes - only JordanBoz */}
        <ProtectedRoute path="/admin" component={AdminDashboard} adminOnly={true} />
        <ProtectedRoute path="/admin/photos" component={AdminPhotos} adminOnly={true} />
        <ProtectedRoute path="/admin/team" component={AdminTeamManagement} adminOnly={true} />
        
        {/* 404 fallback */}
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    // Check if this is a first-time visitor
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setShowWelcomeModal(true);
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <Router />
              </main>
              <Footer />
            </div>
            <Toaster />
            <WelcomeModal 
              isOpen={showWelcomeModal} 
              onClose={handleCloseWelcomeModal} 
            />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
