import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Phone, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Memberships', path: '/membership-simple' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
      isScrolled 
        ? 'bg-gradient-to-r from-slate-900/98 via-blue-900/98 to-slate-900/98 backdrop-blur-xl shadow-2xl border-b border-amber-500/20' 
        : 'bg-gradient-to-r from-slate-900/90 via-blue-900/90 to-slate-900/90 backdrop-blur-lg'
    )}>
      {/* Subtle top gradient accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
      
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group" data-testid="link-home-logo">
            <div className="relative">
              <Wrench className="absolute -left-8 top-1/2 -translate-y-1/2 h-6 w-6 text-amber-500 opacity-0 group-hover:opacity-100 group-hover:-rotate-12 transition-all duration-300" />
              <span className="text-white font-black text-2xl lg:text-3xl transition-all duration-300 group-hover:text-amber-400 drop-shadow-lg">
                AfterHours
              </span>
              <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent font-black ml-2 text-2xl lg:text-3xl drop-shadow-lg">
                HVAC
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-2">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path}
                onClick={closeMenu}
                data-testid={`link-nav-${link.name.toLowerCase()}`}
                className={cn(
                  'relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 overflow-hidden group',
                  location === link.path 
                    ? 'text-amber-400 bg-white/10 shadow-lg shadow-amber-500/20' 
                    : 'text-white hover:text-amber-400'
                )}
              >
                {location !== link.path && (
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
                <span className="relative z-10">{link.name}</span>
                {location === link.path && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                )}
              </Link>
            ))}
            
            {/* CTA Button */}
            <a 
              href="tel:4036136014"
              data-testid="button-call-header"
              className="ml-4 relative flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:via-amber-700 hover:to-amber-600 text-white rounded-xl font-bold transition-all duration-300 shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/50 hover:scale-105 overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <Phone className="h-4 w-4 mr-2 relative z-10 animate-pulse" />
              <span className="relative z-10">(403) 613-6014</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button 
              type="button" 
              className="relative inline-flex items-center justify-center p-3 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 text-white border border-white/10 hover:border-amber-500/50 shadow-lg hover:shadow-xl hover:shadow-amber-500/20"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              data-testid="button-mobile-menu"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-gradient-to-b from-slate-900/98 via-blue-900/98 to-slate-900/98 backdrop-blur-xl border-t border-amber-500/20 shadow-2xl">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={closeMenu}
                data-testid={`link-mobile-${link.name.toLowerCase()}`}
                className={cn(
                  'block px-4 py-3 rounded-xl text-base font-bold transition-all duration-300 relative overflow-hidden group',
                  location === link.path 
                    ? 'bg-gradient-to-r from-white/10 via-white/15 to-white/10 text-amber-400 shadow-lg shadow-amber-500/10' 
                    : 'text-white hover:bg-white/5 hover:text-amber-400'
                )}
              >
                {location !== link.path && (
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
                <span className="relative z-10">{link.name}</span>
              </Link>
            ))}
            
            <a
              href="tel:4036136014"
              data-testid="button-call-mobile"
              className="relative block px-4 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:via-amber-700 hover:to-amber-600 mt-4 shadow-xl shadow-amber-500/30 transition-all duration-300 overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <Phone className="h-5 w-5 mr-2 inline relative z-10" />
              <span className="relative z-10">(403) 613-6014</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
