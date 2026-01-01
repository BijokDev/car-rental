import React, { useState, useEffect } from 'react';
import { Menu, X, Car, Phone, MessageCircle } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

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
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white shadow-xl py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer group" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className={`p-1.5 rounded-lg transition-colors ${isScrolled ? 'bg-brand-900' : 'bg-white'}`}>
                <Car className={`h-6 w-6 ${isScrolled ? 'text-white' : 'text-brand-900'}`} />
            </div>
            <span className={`font-serif text-2xl font-black tracking-tight ${isScrolled ? 'text-brand-900' : 'text-white'}`}>
              AJ<span className="text-gold-500">TAXI KL</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-10">
            {navLinks.map((item) => (
              <a 
                key={item.name} 
                href={`#${item.id}`}
                className={`text-xs font-black uppercase tracking-widest transition-all duration-200 relative pb-1 group ${
                  activeSection === item.id 
                    ? 'text-gold-500' 
                    : (isScrolled ? 'text-brand-900 hover:text-gold-500' : 'text-white/90 hover:text-white')
                }`}
              >
                {item.name}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-gold-500 transition-all duration-300 ${activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </a>
            ))}
            
            <a 
              href="https://wa.me/601128829143" 
              className={`flex items-center px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all transform hover:scale-105 shadow-md ${
                isScrolled ? 'bg-brand-900 text-white hover:bg-brand-800' : 'bg-gold-500 text-brand-900 hover:bg-gold-400'
              }`}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp Us
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-4">
             <a href="https://wa.me/601128829143" className={`p-2 rounded-full ${isScrolled ? 'bg-green-500 text-white' : 'bg-white text-green-500'}`}>
                <Phone className="w-5 h-5" />
             </a>
             <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-lg transition-colors ${isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'}`}
             >
              {mobileMenuOpen ? (
                <X className={`h-6 w-6 ${isScrolled ? 'text-brand-900' : 'text-white'}`} />
              ) : (
                <Menu className={`h-6 w-6 ${isScrolled ? 'text-brand-900' : 'text-white'}`} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`lg:hidden fixed inset-0 z-[-1] bg-white transition-all duration-500 transform ${mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
          <div className="pt-24 px-6 space-y-4">
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={`#${item.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-4 text-lg font-black uppercase tracking-widest border-b border-gray-100 ${
                   activeSection === item.id ? 'text-gold-500' : 'text-brand-900'
                }`}
              >
                {item.name}
              </a>
            ))}
            <div className="pt-8 space-y-4">
                 <a href="tel:0182335796" className="flex items-center justify-center w-full py-4 bg-brand-900 text-white rounded-xl font-black uppercase tracking-widest">
                    <Phone className="w-5 h-5 mr-3" />
                    Call Direct
                 </a>
                 <a href="https://wa.me/601128829143" className="flex items-center justify-center w-full py-4 bg-green-500 text-white rounded-xl font-black uppercase tracking-widest">
                    <MessageCircle className="w-5 h-5 mr-3" />
                    WhatsApp Support
                 </a>
            </div>
          </div>
      </div>
    </nav>
  );
};

export default Navbar;