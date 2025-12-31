import React, { useState, useEffect } from 'react';
import { CAR_FLEET } from '../constants';
import { Users, Briefcase, CheckCircle, Phone, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Car } from '../types';

interface FleetProps {
    onSelectCar: (carName: string) => void;
}

const Fleet: React.FC<FleetProps> = ({ onSelectCar }) => {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openGallery = (car: Car) => {
    setSelectedCar(car);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = () => {
    setSelectedCar(null);
    document.body.style.overflow = 'unset';
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedCar) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedCar.gallery.length);
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedCar) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedCar.gallery.length) % selectedCar.gallery.length);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (!selectedCar) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') closeGallery();
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [selectedCar]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&q=80&w=800";
  };

  return (
    <section id="fleet" className="py-20 lg:py-32 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 lg:mb-24">
          <span className="text-brand-600 font-black tracking-[0.2em] uppercase text-xs mb-4 block">Luxury Fleet</span>
          <h2 className="text-4xl lg:text-6xl font-serif font-bold text-brand-900 mb-6 italic">Premium Vehicles</h2>
          <div className="h-1.5 w-24 bg-gold-500 mx-auto rounded-full"></div>
          <p className="mt-8 text-gray-500 max-w-2xl mx-auto font-medium text-sm sm:text-base leading-relaxed">
            From executive business travel to family vacations, our fleet is equipped with the latest comfort features to make your trip memorable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12">
          {CAR_FLEET.map((car) => (
            <div key={car.id} className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 flex flex-col">
              <div 
                className="relative h-64 lg:h-72 overflow-hidden bg-gray-100 cursor-pointer"
                onClick={() => openGallery(car)}
              >
                <img 
                  src={car.image} 
                  alt={car.name} 
                  onError={handleImageError}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-brand-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-brand-900 px-6 py-3 rounded-xl font-black uppercase tracking-widest shadow-2xl text-[10px] transform -translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        <ZoomIn className="w-4 h-4 mr-2 inline" /> View Gallery
                    </span>
                </div>
                <div className="absolute top-6 right-6 bg-brand-900/90 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black text-white uppercase tracking-widest shadow-lg border border-white/10">
                  {car.category}
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-brand-900 mb-6">{car.name}</h3>
                
                <div className="flex space-x-8 mb-8 text-xs text-gray-500 border-b border-gray-50 pb-6 font-bold uppercase tracking-widest">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-3 text-gold-500" />
                    <span>{car.seats} Seats</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-3 text-gold-500" />
                    <span>Ample Luggage</span>
                  </div>
                </div>

                <div className="space-y-4 mb-10 flex-grow">
                   {car.features.slice(0, 3).map((feature, idx) => (
                       <div key={idx} className="flex items-start text-sm text-gray-600 font-medium">
                           <CheckCircle className="w-4 h-4 mr-4 text-green-500 mt-0.5 flex-shrink-0" />
                           {feature}
                       </div>
                   ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                    <button 
                        onClick={() => openGallery(car)}
                        className="flex-1 bg-gray-50 text-brand-900 hover:bg-gray-100 font-black py-4 rounded-xl transition-all text-[10px] uppercase tracking-widest border border-gray-100"
                    >
                        Detailed Photos
                    </button>
                    <button 
                        onClick={() => onSelectCar(car.name)}
                        className="flex-1 bg-brand-900 text-white hover:bg-brand-800 font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest shadow-xl shadow-brand-900/10"
                    >
                        <Phone className="w-4 h-4" />
                        Book Now
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery Modal */}
      {selectedCar && (
        <div className="fixed inset-0 z-[100] bg-brand-900/98 backdrop-blur-xl flex items-center justify-center animate-fade-in overflow-hidden">
            <button 
                onClick={closeGallery}
                className="absolute top-6 right-6 text-white hover:bg-white/10 p-3 rounded-full z-[110] transition-all"
            >
                <X className="w-8 h-8" />
            </button>

            <div className="w-full h-full flex flex-col lg:flex-row bg-white overflow-hidden shadow-2xl relative">
                
                {/* Image Section */}
                <div className="relative flex-grow bg-black flex items-center justify-center lg:w-2/3 h-[50vh] sm:h-[60vh] lg:h-full group/viewer">
                    <img 
                        src={selectedCar.gallery[currentImageIndex]} 
                        alt={selectedCar.name}
                        onError={handleImageError}
                        className="max-h-full max-w-full object-contain select-none"
                    />
                    
                    {selectedCar.gallery.length > 1 && (
                        <>
                            <button 
                                onClick={prevImage}
                                className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md text-white p-4 lg:p-6 rounded-full hover:bg-white/30 transition-all border border-white/20 z-10"
                            >
                                <ChevronLeft className="w-6 h-6 lg:w-8 lg:h-8" />
                            </button>
                            <button 
                                onClick={nextImage}
                                className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md text-white p-4 lg:p-6 rounded-full hover:bg-white/30 transition-all border border-white/20 z-10"
                            >
                                <ChevronRight className="w-6 h-6 lg:w-8 lg:h-8" />
                            </button>
                        </>
                    )}

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white px-6 py-2 rounded-full text-[10px] font-black tracking-[0.3em] uppercase border border-white/10">
                        {currentImageIndex + 1} / {selectedCar.gallery.length}
                    </div>
                </div>

                {/* Details Section */}
                <div className="bg-white p-8 lg:p-16 lg:w-1/3 flex flex-col overflow-y-auto max-h-[50vh] lg:max-h-none border-t lg:border-t-0 lg:border-l border-gray-100">
                    <div className="mb-10">
                        <span className="text-brand-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">{selectedCar.category}</span>
                        <h3 className="text-4xl lg:text-5xl font-serif font-bold text-brand-900 mb-6 leading-tight">{selectedCar.name}</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-12">
                        <div className="flex items-center p-5 bg-gray-50 rounded-2xl border border-gray-100">
                             <Users className="w-6 h-6 mr-4 text-gold-500" />
                             <span className="font-black text-brand-900 text-sm uppercase tracking-widest">{selectedCar.seats} Pax</span>
                        </div>
                        <div className="flex items-center p-5 bg-gray-50 rounded-2xl border border-gray-100">
                             <Briefcase className="w-6 h-6 mr-4 text-gold-500" />
                             <span className="font-black text-brand-900 text-sm uppercase tracking-widest">Large Bag</span>
                        </div>
                    </div>

                    <div className="mb-12">
                        <h4 className="font-black text-brand-900 mb-6 text-[11px] uppercase tracking-[0.2em] flex items-center">
                            <span className="w-8 h-px bg-gold-500 mr-3"></span>
                            Premium Features
                        </h4>
                        <div className="space-y-4">
                             {selectedCar.features.map((feat, i) => (
                                 <div key={i} className="flex items-start text-sm text-gray-500 font-medium leading-relaxed">
                                     <CheckCircle className="w-5 h-5 mr-4 text-green-500 mt-0.5 flex-shrink-0" />
                                     {feat}
                                 </div>
                             ))}
                        </div>
                    </div>

                    {/* Gallery Thumbnails */}
                    <div className="mb-12">
                        <h4 className="font-black text-brand-900 mb-6 text-[11px] uppercase tracking-[0.2em] flex items-center">
                            <span className="w-8 h-px bg-gold-500 mr-3"></span>
                            View Selection
                        </h4>
                        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                            {selectedCar.gallery.map((img, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-4 transition-all duration-300 ${currentImageIndex === idx ? 'border-brand-900 scale-105 shadow-xl' : 'border-transparent opacity-40 hover:opacity-100'}`}
                                >
                                    <img src={img} alt="thumb" className="w-full h-full object-cover" onError={handleImageError} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto pt-8 border-t border-gray-50">
                        <button 
                            onClick={() => {
                                onSelectCar(selectedCar.name);
                                closeGallery();
                            }}
                            className="w-full bg-brand-900 hover:bg-brand-800 text-white font-black py-6 rounded-2xl shadow-2xl hover:shadow-brand-900/20 transition-all flex items-center justify-center gap-4 text-xs uppercase tracking-[0.2em]"
                        >
                            <Phone className="w-5 h-5" />
                            Book This Vehicle
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </section>
  );
};

export default Fleet;