import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import afterHoursLogo from "/assets/logo.jpg";
import { 
  Menu, 
  X, 
  Phone, 
  Clock,
  ChevronDown,
  Home,
  Wrench,
  Calculator,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Crown,
  Shield,
  Building2,
  AlertTriangle
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EmergencyServicePopup from "@/components/EmergencyServicePopup";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEmergencyPopupOpen, setIsEmergencyPopupOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const navigationItems = [
    { name: "Home", href: "/", icon: Home },
    {
      name: "Services", 
      href: "/shop/residential",
      icon: Building2,
      submenu: [
        { name: "Residential Custom & New Builds", href: "/shop/residential", isPro: false },
        { name: "Commercial & Multi-Family", href: "/shop/commercial", isPro: false },
        { name: "AC Repair & Installation", href: "/services/ac-repair", isPro: false },
        { name: "Duct Cleaning", href: "/services/duct-cleaning", isPro: false },
        { name: "Energy Audits", href: "/services/energy-audit", isPro: false },
        { name: "HVAC Add-Ons & Extras", href: "/shop/addons", isPro: false },
        { name: "Equipment & Products", href: "/shop/furnaces", isPro: false },
        { name: "Maintenance Plans", href: "/shop/maintenance-plans", isPro: false }
      ]
    },
    { name: "Memberships", href: "/membership-simple", icon: Crown },
    { name: "Forum", href: "/forum", icon: MessageSquare },
    { name: "About", href: "/about" }
  ];

  const isActivePage = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/95 border-b border-gray-200/50 shadow-2xl">
      {/* Premium Emergency Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 text-white py-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
        <div className="hvac-container relative">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-3">
              <div className="p-1.5 bg-white/20 rounded-full backdrop-blur-sm">
                <Clock className="w-4 h-4 animate-pulse" />
              </div>
              <span className="font-bold tracking-wide">24/7 EMERGENCY HVAC SERVICE AVAILABLE</span>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <a href="tel:4036136014" className="flex items-center space-x-2 hover:text-orange-100 transition-all duration-300 hover:scale-105">
                <div className="p-1.5 bg-white/20 rounded-full backdrop-blur-sm">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="font-black tracking-wider">(403) 613-6014</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="hvac-container py-4">
        <div className="flex items-center justify-between">
          {/* Premium Logo */}
          <Link href="/" className="flex items-center space-x-5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-orange-500 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative bg-white p-2 rounded-3xl shadow-2xl group-hover:shadow-3xl transition-all duration-500 transform group-hover:scale-110">
                <img 
                  src={afterHoursLogo} 
                  alt="AfterHours HVAC Logo" 
                  className="w-16 h-16 object-contain"
                />
              </div>
            </div>
            <div className="relative">
              <h1 className="text-4xl font-black text-gray-900 tracking-tight bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent" style={{fontFamily: 'DM Sans, Poppins, sans-serif'}}>
                AfterHours
              </h1>
              <p className="text-sm font-black tracking-[0.2em] text-orange-600 uppercase drop-shadow-sm">HVAC SOLUTIONS</p>
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <div key={item.name} className="relative group">
                {item.submenu ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`relative nav-link flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 overflow-hidden group ${
                          item.href && isActivePage(item.href) 
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl transform scale-105" 
                            : "text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-orange-50 hover:shadow-lg hover:transform hover:scale-105"
                        }`}
                      >
                        {item.icon && <item.icon className="w-5 h-5" />}
                        <span className="relative z-10">{item.name}</span>
                        <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-2xl rounded-2xl p-2">
                      <DropdownMenuLabel className="text-gray-900 font-bold text-lg px-4 py-2">{item.name}</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gradient-to-r from-blue-200 to-orange-200" />
                      {item.submenu.map((subItem) => (
                        <DropdownMenuItem key={subItem.name} asChild>
                          <Link href={subItem.href} className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-orange-50 rounded-xl transition-all duration-300 hover:transform hover:scale-105 group">
                            {subItem.isPro && <Crown className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />}
                            <span className="font-medium">{subItem.name}</span>
                            {subItem.isPro && <Badge className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 text-xs font-bold">Pro</Badge>}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    variant="ghost"
                    asChild
                    className={`nav-link flex items-center space-x-1 px-4 py-2 rounded-xl transition-all duration-200 ${
                      isActivePage(item.href) ? "nav-link-active bg-blue-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <Link href={item.href}>
                      {item.icon && <item.icon className="w-4 h-4" />}
                      <span>{item.name}</span>
                    </Link>
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Emergency Service Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button 
              onClick={() => setIsEmergencyPopupOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2 animate-pulse shadow-lg"
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="font-semibold">Emergency Service</span>
            </Button>
          </div>

          {/* User Menu & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-gray-50">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                      <div className="text-xs text-gray-500 flex items-center space-x-1">
                        {user.hasProAccess ? (
                          <>
                            <Crown className="w-3 h-3 text-orange-500" />
                            <span>Pro Member</span>
                          </>
                        ) : (
                          <span>Standard</span>
                        )}
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white border border-gray-200 shadow-xl rounded-xl">
                  <DropdownMenuLabel className="text-gray-900 font-semibold">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {user.hasProAccess ? (
                    <DropdownMenuItem asChild>
                      <Link href="/pro-portal" className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Crown className="w-4 h-4 text-orange-500" />
                        <span>Pro Portal</span>
                      </Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link href="/membership" className="flex items-center space-x-2 px-3 py-2 text-orange-600 hover:bg-orange-50 rounded-lg">
                        <Crown className="w-4 h-4" />
                        <span>Upgrade to Pro</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuItem asChild>
                    <Link href="/customer-dashboard" className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Settings className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link href="/calculators" className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Calculator className="w-4 h-4" />
                      <span>Tools</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  {user.isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Shield className="w-4 h-4" />
                        <span>Admin Panel</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer">
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" asChild className="nav-link">
                  <Link href="/auth">Sign In</Link>
                </Button>
                <Button asChild className="hvac-button-primary">
                  <Link href="/contact">Get Quote</Link>
                </Button>
              </div>
            )}

            <Button asChild className="hvac-button-secondary">
              <a href="tel:4036136014" className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span className="hidden xl:inline">Call Now</span>
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            {user && (
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <div key={item.name}>
                  <Button
                    variant="ghost"
                    asChild
                    className={`w-full justify-start px-4 py-3 rounded-xl ${
                      item.href && isActivePage(item.href) ? "nav-link-active bg-blue-50" : "hover:bg-gray-50"
                    }`}
                    onClick={() => !item.submenu && setIsMobileMenuOpen(false)}
                  >
                    <Link href={item.href || "#"}>
                      {item.icon && <item.icon className="w-4 h-4 mr-3" />}
                      {item.name}
                    </Link>
                  </Button>
                  
                  {item.submenu && (
                    <div className="ml-4 mt-2 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Button
                          key={subItem.name}
                          variant="ghost"
                          asChild
                          className="w-full justify-start px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Link href={subItem.href} className="flex items-center space-x-2">
                            {subItem.isPro && <Crown className="w-3 h-3 text-orange-500" />}
                            <span>{subItem.name}</span>
                            {subItem.isPro && <Badge className="bg-orange-100 text-orange-600 text-xs">Pro</Badge>}
                          </Link>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Mobile User Actions */}
              <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                {user ? (
                  <>
                    <div className="px-4 py-2">
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                      <div className="text-xs text-gray-500 flex items-center space-x-1">
                        {user.hasProAccess ? (
                          <>
                            <Crown className="w-3 h-3 text-orange-500" />
                            <span>Pro Member</span>
                          </>
                        ) : (
                          <span>Standard Member</span>
                        )}
                      </div>
                    </div>
                    
                    {user.hasProAccess ? (
                      <Button variant="ghost" asChild className="w-full justify-start px-4 py-3 rounded-xl">
                        <Link href="/pro-portal" onClick={() => setIsMobileMenuOpen(false)}>
                          <Crown className="w-4 h-4 mr-3 text-orange-500" />
                          Pro Portal
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="ghost" asChild className="w-full justify-start px-4 py-3 rounded-xl text-orange-600">
                        <Link href="/membership" onClick={() => setIsMobileMenuOpen(false)}>
                          <Crown className="w-4 h-4 mr-3" />
                          Upgrade to Pro
                        </Link>
                      </Button>
                    )}
                    
                    <Button variant="ghost" asChild className="w-full justify-start px-4 py-3 rounded-xl">
                      <Link href="/customer-dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                        <Settings className="w-4 h-4 mr-3" />
                        Dashboard
                      </Link>
                    </Button>
                    
                    <Button variant="ghost" asChild className="w-full justify-start px-4 py-3 rounded-xl">
                      <Link href="/tools" onClick={() => setIsMobileMenuOpen(false)}>
                        <Calculator className="w-4 h-4 mr-3" />
                        Tools
                      </Link>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      onClick={handleLogout}
                      className="w-full justify-start px-4 py-3 rounded-xl text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" asChild className="w-full justify-start px-4 py-3 rounded-xl">
                      <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                        <User className="w-4 h-4 mr-3" />
                        Sign In
                      </Link>
                    </Button>
                    <Button asChild className="w-full hvac-button-primary mx-4">
                      <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                        Get Quote
                      </Link>
                    </Button>
                  </>
                )}
                
                <Button asChild className="w-full hvac-button-secondary mx-4 mt-2">
                  <a href="tel:4036136014">
                    <Phone className="w-4 h-4 mr-2" />
                    Call (403) 613-6014
                  </a>
                </Button>

                {/* Mobile Emergency Service Button */}
                <Button 
                  onClick={() => {
                    setIsEmergencyPopupOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white mx-4 mt-2 animate-pulse"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Emergency Service
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Emergency Service Popup */}
      <EmergencyServicePopup 
        isOpen={isEmergencyPopupOpen} 
        onClose={() => setIsEmergencyPopupOpen(false)} 
      />
    </header>
  );
};

export default Header;