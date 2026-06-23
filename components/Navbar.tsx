import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Car, Phone, MessageCircle, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../src/context/AuthContext';

const Navbar: React.FC = () => {
  const { user, isAdmin, signInWithGoogle, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Handle navigation - redirect to homepage with hash if not on homepage
  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (isHomePage) {
      // On homepage, just scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // On other pages, navigate to homepage with hash
      navigate(`/#${sectionId}`);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      // After sign-in, redirect to dashboard if admin
      // The useEffect below will handle redirection based on user/isAdmin state
    } catch (error) {
      console.error('Sign-in failed:', error);
    }
  };

  // Redirect to dashboard after successful admin sign-in
  useEffect(() => {
    if (user && isAdmin && !loading) {
      navigate('/admin/dashboard');
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = ['home', 'rates', 'fleet', 'services', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Pricing', id: 'rates' },
    { name: 'Fleet', id: 'fleet' },
    { name: 'Services', id: 'services' },
    { name: 'Contact', id: 'contact' },
    { name: 'Blog', id: 'blog', isRoute: true, path: '/articles' },
  ];

  // On non-homepage, always show scrolled style (solid background)
  const showSolidNav = !isHomePage || isScrolled;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${showSolidNav ? 'bg-white/95 backdrop-blur-md shadow-xl py-3 border-b border-gray-200' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 cursor-pointer group">
            {/* Modern Car Icon Mark */}
            <div className={`relative p-2.5 rounded-xl transition-all duration-300 transform group-hover:scale-105 shadow-lg ${showSolidNav ? 'bg-gradient-to-br from-brand-900 to-brand-800' : 'bg-white'}`}>
              <Car className={`h-5 w-5 ${showSolidNav ? 'text-gold-500' : 'text-brand-900'}`} strokeWidth={1.5} />
              {/* Decorative dot */}
              <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${showSolidNav ? 'bg-white' : 'bg-gold-500'}`}></div>
            </div>

            <div className="flex flex-col">
              <span className={`font-serif text-xl font-black tracking-tight leading-none ${showSolidNav ? 'text-brand-900' : 'text-white'}`}>
                <span className="text-gold-500">Trav</span>ethru
              </span>
              <span className={`text-[0.6rem] font-bold uppercase tracking-[0.35em] ${showSolidNav ? 'text-gray-400' : 'text-white/70'}`}>
                Premium Transport
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-10">
            {navLinks.map((item) => (
              item.isRoute ? (
                <Link
                  key={item.name}
                  to={item.path || '/'}
                  className={`text-xs font-black uppercase tracking-widest transition-all duration-200 relative pb-1 group ${
                    showSolidNav ? 'text-brand-900 hover:text-gold-500' : 'text-white/90 hover:text-white'
                  }`}
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 h-0.5 bg-gold-500 transition-all duration-300 w-0 group-hover:w-full"></span>
                </Link>
              ) : (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-xs font-black uppercase tracking-widest transition-all duration-200 relative pb-1 group ${activeSection === item.id && isHomePage
                    ? 'text-gold-500'
                    : (showSolidNav ? 'text-brand-900 hover:text-gold-500' : 'text-white/90 hover:text-white')
                  }`}
                >
                  {item.name}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-gold-500 transition-all duration-300 ${activeSection === item.id && isHomePage ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </button>
              )
            ))}

            {/* Auth Button */}
            {user ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className={`text-xs font-black uppercase tracking-widest transition-all duration-200 ${
                       showSolidNav ? 'text-brand-900 hover:text-gold-500' : 'text-white/90 hover:text-white'
                    }`}
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={async () => { await logout(); navigate('/'); }}
                  className={`flex items-center gap-1 text-xs font-black uppercase tracking-widest transition-all duration-200 ${
                     showSolidNav ? 'text-red-600 hover:text-red-700' : 'text-red-400 hover:text-red-300'
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className={`flex items-center gap-1 text-xs font-black uppercase tracking-widest transition-all duration-200 relative pb-1 group ${
                   showSolidNav ? 'text-brand-900 hover:text-gold-500' : 'text-white/90 hover:text-white'
                }`}
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}
            <a
              href="https://wa.me/60107198186"
              className={`flex items-center px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all transform hover:scale-105 shadow-md ${showSolidNav ? 'bg-brand-900 text-white hover:bg-brand-800' : 'bg-gold-500 text-brand-900 hover:bg-gold-400'
                }`}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp Us
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-4">
            <a href="https://wa.me/60107198186" aria-label="Call Direct" className={`p-2 rounded-full ${showSolidNav ? 'bg-green-500 text-white' : 'bg-white text-green-500'}`}>
              <Phone className="w-5 h-5" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className={`p-2 rounded-lg transition-colors ${showSolidNav ? 'hover:bg-gray-100' : 'hover:bg-white/10'}`}
            >
              {mobileMenuOpen ? (
                <X className={`h-6 w-6 ${showSolidNav ? 'text-brand-900' : 'text-white'}`} />
              ) : (
                <Menu className={`h-6 w-6 ${showSolidNav ? 'text-brand-900' : 'text-white'}`} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed top-0 left-0 w-screen h-screen z-[100] flex flex-col"
          style={{ backgroundColor: '#001a3d' }} // Hardcoded brand-900 for guaranteed opacity
        >
          {/* Header with Logo and Close */}
          <div className="flex justify-between items-center p-6">
            <span className="font-serif text-xl font-black text-white">
              <span className="text-gold-500">Trav</span>thru
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          
          {/* Nav Links - Centered */}
          <div className="flex-1 flex flex-col justify-center px-8 space-y-4">
            {navLinks.map((item) => (
              item.isRoute ? (
                <Link
                  key={item.name}
                  to={item.path || '/'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-3xl font-black uppercase tracking-wider text-white hover:text-gold-500 transition-colors"
                >
                  {item.name}
                </Link>
              ) : (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left py-2 text-3xl font-black uppercase tracking-wider transition-colors ${
                    activeSection === item.id && isHomePage ? 'text-gold-500' : 'text-white hover:text-gold-500'
                  }`}
                >
                  {item.name}
                </button>
              )
            ))}

            {/* Mobile Auth Buttons */}
            <div className="pt-4 border-t border-white/10 mt-4">
              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 text-xl font-bold uppercase tracking-wider text-gold-500 hover:text-white transition-colors"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={async () => {
                      await logout();
                      setMobileMenuOpen(false);
                      navigate('/');
                    }}
                    className="block w-full text-left py-2 text-xl font-bold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    handleSignIn();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-xl font-bold uppercase tracking-wider text-white hover:text-gold-500 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
          
          {/* Bottom CTA Buttons */}
          <div className="p-6 space-y-3 pb-safe">
            <a href="tel:0107198186" className="flex items-center justify-center w-full py-4 bg-white text-brand-900 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors">
              <Phone className="w-5 h-5 mr-2" />
              Call Direct
            </a>
            <a href="https://wa.me/60107198186" className="flex items-center justify-center w-full py-4 bg-green-500 text-white rounded-xl font-bold text-lg hover:bg-green-600 transition-colors">
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;