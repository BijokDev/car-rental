import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, limit as fsLimit } from 'firebase/firestore';
import { db } from '../src/lib/firebase';
import { isSearchBot } from '../src/lib/botDetection';
import { GalleryImage } from '../types';
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';

interface GalleryProps {
  /** Only show the latest N photos (used on the homepage). Omit to show everything. */
  limit?: number;
}

const Gallery: React.FC<GalleryProps> = ({ limit }) => {
  const [photos, setPhotos] = useState<GalleryImage[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isSearchBot()) return;

    let isMounted = true;
    const constraints = [orderBy('createdAt', 'desc'), ...(limit ? [fsLimit(limit)] : [])];
    const q = query(collection(db, 'car-rental-gallery'), ...constraints);

    getDocs(q)
      .then((snapshot) => {
        if (!isMounted) return;
        setPhotos(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as GalleryImage)));
      })
      .catch((error) => {
        console.error('Failed to load gallery:', error);
      });

    return () => {
      isMounted = false;
    };
  }, [limit]);

  const closeLightbox = () => setActiveIndex(null);
  const nextPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev === null ? null : (prev + 1) % photos.length));
  };
  const prevPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev === null ? null : (prev - 1 + photos.length) % photos.length));
  };

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (activeIndex === null) return;
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [activeIndex, photos.length]);

  if (photos.length === 0) return null;

  return (
    <section id="gallery" className="py-20 lg:py-32 bg-gray-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-brand-600 font-black tracking-[0.2em] uppercase text-xs mb-4 block">Real Moments</span>
          <h2 className="text-4xl lg:text-6xl font-serif font-bold text-brand-900 mb-6 italic">Our Gallery</h2>
          <div className="h-1.5 w-24 bg-gold-500 mx-auto rounded-full"></div>
          <p className="mt-8 text-gray-500 max-w-2xl mx-auto font-medium text-sm sm:text-base leading-relaxed">
            A look at our drivers and vehicles in action, serving customers across Kuala Lumpur.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {photos.map((photo, idx) => (
            <button
              key={photo.id}
              onClick={() => setActiveIndex(idx)}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <img
                src={photo.url}
                alt={photo.caption || 'TravThru chauffeur service in action'}
                loading="lazy"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-brand-900/0 group-hover:bg-brand-900/30 transition-colors duration-500 flex items-center justify-center">
                <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              {photo.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-brand-900/90 to-transparent pt-6 pb-2 px-3">
                  <p className="text-white text-[11px] sm:text-xs font-semibold leading-tight text-left line-clamp-2">
                    {photo.caption}
                  </p>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-brand-900/98 backdrop-blur-xl flex items-center justify-center animate-fade-in"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full z-[110] transition-all backdrop-blur-sm"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-12" onClick={(e) => e.stopPropagation()}>
            <img
              src={photos[activeIndex].url}
              alt={photos[activeIndex].caption || 'TravThru chauffeur service in action'}
              className="max-h-full max-w-full object-contain select-none rounded-lg"
            />

            {photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md text-white p-4 lg:p-6 rounded-full hover:bg-white/30 transition-all border border-white/20"
                >
                  <ChevronLeft className="w-6 h-6 lg:w-8 lg:h-8" />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md text-white p-4 lg:p-6 rounded-full hover:bg-white/30 transition-all border border-white/20"
                >
                  <ChevronRight className="w-6 h-6 lg:w-8 lg:h-8" />
                </button>
              </>
            )}

            {photos[activeIndex].caption && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white px-6 py-2 rounded-full text-sm font-medium max-w-lg text-center">
                {photos[activeIndex].caption}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
