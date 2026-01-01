import React, { useState, useEffect } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';

const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1622185135505-2d79504399d9?auto=format&fit=crop&q=80&w=2000",
];

const Hero: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % BACKGROUND_IMAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="home" className="relative min-h-screen w-full flex flex-col overflow-hidden">
      {/* Background Slider */}
      <div className="absolute inset-0 z-0">
        {BACKGROUND_IMAGES.map((img, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={img} 
              alt={`Slide ${index + 1}`} 
              className="w-full h-full object-cover scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-brand-900/80 via-brand-900/40 to-brand-900/95"></div>
          </div>
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="max-w-4xl text-white">
          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-6 animate-fade-in">
             <span className="px-3 py-1 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest rounded flex items-center shadow-lg">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse mr-2"></div>
                24/7 Available
             </span>
             <span className="px-3 py-1 bg-gold-500 text-brand-900 text-[10px] font-black uppercase tracking-widest rounded shadow-lg">
                Official AJ Taxi KL
             </span>
          </div>
          
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold leading-[1.1] mb-6 animate-slide-up">
            Reliable Private <br className="hidden sm:block"/>
            <span className="text-gold-500">Chauffeur</span> & <br className="hidden sm:block"/>
            <span className="relative">
                Airport Transfer
                <svg className="absolute -bottom-2 left-0 w-full h-2 md:h-3 text-gold-500/40" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
            </span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-6 lg:mb-8 leading-relaxed max-w-2xl animate-slide-up animate-delay-100 font-medium">
            Professional <b>Kereta Sewa</b> and private transfer services across Malaysia. Comfortable, safe, and punctual rides to KLIA, Genting, and beyond.
          </p>
          
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 md:gap-4 mb-8 lg:mb-10 max-w-lg animate-slide-up animate-delay-200">
             {[
                "Punctual & Reliable", 
                "Well Maintained Fleet", 
                "Professional Drivers", 
                "No Hidden Fees"
             ].map((item, i) => (
                <div key={i} className="flex items-center text-gray-100 font-medium text-sm md:text-base">
                    <CheckCircle className="w-4 h-4 md:w-5 text-gold-500 mr-2 flex-shrink-0" />
                    <span>{item}</span>
                </div>
             ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up animate-delay-300">
            <a 
              href="https://wa.me/601128829143" 
              className="group px-8 py-4 bg-gold-500 text-brand-900 font-black rounded-xl hover:bg-gold-400 transition-all shadow-xl hover:-translate-y-1 flex items-center justify-center text-sm uppercase tracking-widest"
            >
              Book via WhatsApp
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="#fleet" 
              className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black rounded-xl hover:bg-white/20 transition-all hover:-translate-y-1 text-center text-sm uppercase tracking-widest"
            >
              Our Fleet
            </a>
          </div>
        </div>
      </div>
      
      {/* Scroll Down Hint */}
      <div className="hidden lg:flex relative pb-10 flex-col items-center animate-bounce text-white/50 pointer-events-none">
          <span className="text-[10px] uppercase font-bold tracking-widest mb-2">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white to-transparent"></div>
      </div>
    </div>
  );
};

export default Hero;