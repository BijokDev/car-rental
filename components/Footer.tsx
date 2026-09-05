import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

// Fill in real profile URLs here to show the icon on the site - until then
// it stays hidden rather than linking nowhere (a dead "#" link is worse
// for users and looks bad to search engines than not showing it at all).
const SOCIAL_LINKS = {
  facebook: '',
  instagram: '',
  twitter: '',
};

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-brand-900 text-white pt-16 pb-8 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-1.5 rounded-xl bg-white shadow-md flex items-center justify-center">
                <img src="/logo-mark.png" alt="TravThru Logo" className="h-8 w-8 object-contain rounded-lg" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-black text-white leading-none">
                  <span className="text-gold-500">Trav</span>thru
                </span>
                <span className="text-[0.6rem] font-bold uppercase tracking-[0.35em] text-brand-200 mt-1">
                  Premium Transport
                </span>
              </div>
            </div>
            <p className="text-brand-100 text-sm leading-relaxed">
              TRAVTHRU Private Chauffeur Enterprise (SSM: 002334361-T).<br />
              Your professional partner for KLIA transfers, Genting Highlands trips, and private chauffeur services in Malaysia.
            </p>
            {(SOCIAL_LINKS.facebook || SOCIAL_LINKS.instagram || SOCIAL_LINKS.twitter) && (
              <div className="flex space-x-4">
                {SOCIAL_LINKS.facebook && (
                  <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" aria-label="TravThru on Facebook" className="text-white hover:text-gold-500 transition"><Facebook className="w-5 h-5" /></a>
                )}
                {SOCIAL_LINKS.instagram && (
                  <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="TravThru on Instagram" className="text-white hover:text-gold-500 transition"><Instagram className="w-5 h-5" /></a>
                )}
                {SOCIAL_LINKS.twitter && (
                  <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" aria-label="TravThru on Twitter" className="text-white hover:text-gold-500 transition"><Twitter className="w-5 h-5" /></a>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gold-500">Quick Links</h3>
            <ul className="space-y-2 text-sm text-brand-100">
              <li><a href="#home" className="hover:text-white transition">Home</a></li>
              <li><a href="#rates" className="hover:text-white transition">Rates & Pricing</a></li>
              <li><a href="#fleet" className="hover:text-white transition">Our Fleet</a></li>
              <li><a href="#services" className="hover:text-white transition">Services</a></li>
              <li><a href="#contact" className="hover:text-white transition">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gold-500">Contact Us</h3>
            <ul className="space-y-4 text-sm text-brand-100">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  Lot 302 Pertama Complex, Jalan Tuanku Abdul Rahman, Chow Kit,<br />
                  50100 Wilayah Persekutuan,<br />
                  Wilayah Persekutuan Kuala Lumpur
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2 flex-shrink-0" />
                <a href="https://wa.me/60107198186" className="hover:text-white transition">
                  +60107198186 (Call & WhatsApp)
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2 flex-shrink-0" />
                <a href="mailto:travethru@gmail.com" className="hover:text-white transition">
                  travethru@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gold-500">Book via WhatsApp</h3>
            <p className="text-sm text-brand-100 mb-4">Fastest way to get a quote and confirm your ride.</p>
            <a
              href="https://wa.me/60107198186"
              className="inline-flex items-center justify-center w-full bg-green-500 text-white font-bold py-3 rounded hover:bg-green-600 transition"
            >
              <Phone className="w-4 h-4 mr-2" />
              WhatsApp Now
            </a>
          </div>

        </div>

        <div className="border-t border-brand-800 pt-8 text-center text-xs text-brand-200">
          <p>&copy; {new Date().getFullYear()} TRAVTHRU Private Chauffeur Enterprise. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;