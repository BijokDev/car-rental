import React, { useState, useEffect } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';

const BACKGROUND_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=2000",
    alt: "TravThru premium chauffeur vehicle in Kuala Lumpur",
  },
  {
    src: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=2000",
    alt: "KLIA airport transfer and travel service",
  },
  {
    src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=2000",
    alt: "Professional TravThru chauffeur opening the car door for a client",
  },
  {
    src: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=2000",
    alt: "TravThru private driver service at night in Kuala Lumpur",
  },
];

interface HeroProps {
  children?: React.ReactNode;
}

const Hero: React.FC<HeroProps> = ({ children }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % BACKGROUND_IMAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="home" className="relative min-h-screen w-full flex flex-col justify-start sm:justify-center overflow-hidden">
      {/* Background Slider */}
      <div className="absolute inset-0 z-0">
        {BACKGROUND_IMAGES.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover object-center"
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'auto'}
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-black/90"></div>
          </div>
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24 flex flex-col items-center">
        
        {/* Hero Title & Subtext */}
        <div className="w-full max-w-4xl text-left sm:text-center text-white mb-5 sm:mb-8">
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-gray-300 mb-2">
            Your Trusted Transportation & Travel Partner
          </p>
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight text-white">
            Book your premium <span className="text-gold-500">chauffeur service</span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm md:text-base text-gray-300 font-normal max-w-2xl sm:mx-auto hidden xs:block">
            Enjoy reliable, fixed-price private airport transfers & chauffeured rides across Malaysia.
          </p>
        </div>

        {/* The Booking Widget - Positioned right under the headline */}
        {children && (
          <div className="w-full max-w-xl lg:max-w-6xl">
            {children}
          </div>
        )}

      </div>
    </div>
  );
};

export default Hero;