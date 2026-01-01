import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Calendar, Clock, Car, Phone, Loader2, ArrowRightLeft } from 'lucide-react';
import { BookingDetails } from '../types';

interface BookingFormProps {
  onSearch: (details: BookingDetails) => void;
}

const POPULAR_LOCATIONS = [
  "KLIA (Kuala Lumpur International Airport)"
  // "KLIA 2",
  // "Kuala Lumpur City Centre",
  // "Genting Highlands",
  // "Cameron Highlands",
  // "Malacca (Melaka)",
  // "Johor Bahru",
  // "Ipoh",
  // "Penang",
  // "Legoland Malaysia",
  // "Port Dickson",
  // "Subang Airport"
];

const BookingForm: React.FC<BookingFormProps> = ({ onSearch }) => {
  const [details, setDetails] = useState<BookingDetails>({
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: '',
    pickupTime: '',
    returnDate: '',
    returnTime: '',
    tripType: 'one-way'
  });

  const [activeDropdown, setActiveDropdown] = useState<'pickup' | 'dropoff' | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>(POPULAR_LOCATIONS);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const dropdownRef = useRef<HTMLFormElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getMinDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const today = getMinDate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchLocations = async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions(POPULAR_LOCATIONS.filter(loc => loc.toLowerCase().includes(query.toLowerCase())));
      setIsLoadingLocation(false);
      return;
    }

    setIsLoadingLocation(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=my&limit=5&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && Array.isArray(data)) {
        const places = data.map((item: any) => item.display_name);
        setSuggestions(Array.from(new Set(places)));
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      setSuggestions(POPULAR_LOCATIONS.filter(loc => loc.toLowerCase().includes(query.toLowerCase())));
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));

    if (name === 'pickupLocation' || name === 'dropoffLocation') {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => fetchLocations(value), 500);
    }
  };

  const handleFocus = (field: 'pickup' | 'dropoff') => {
    setActiveDropdown(field);
    const currentValue = field === 'pickup' ? details.pickupLocation : details.dropoffLocation;
    fetchLocations(currentValue);
  };

  const handleLocationSelect = (field: 'pickupLocation' | 'dropoffLocation', value: string) => {
    setDetails(prev => ({ ...prev, [field]: value }));
    setActiveDropdown(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(details);
  };

  const isReturn = details.tripType === 'return';

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-10 -mt-20 md:-mt-24 relative z-20 mx-4 lg:mx-auto max-w-6xl border-t-4 border-gold-500 font-sans">
      
      {/* Header & Trip Type */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-6">
        <div className="flex items-center w-full sm:w-auto">
          <div className="bg-brand-900 text-white p-2.5 rounded-xl mr-4 shadow-lg hidden sm:flex">
              <Car className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-0.5">Reservation</span>
            <span className="text-xl font-bold text-brand-900">Get Instant Quote</span>
          </div>
        </div>
        
        <div className="flex w-full sm:w-auto bg-gray-50 p-1.5 rounded-xl border border-gray-100">
          <button 
            type="button"
            onClick={() => setDetails(prev => ({...prev, tripType: 'one-way'}))}
            className={`flex-1 sm:flex-none px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${
              details.tripType === 'one-way' 
                ? 'bg-white text-brand-900 shadow-md' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            One Way
          </button>
          <button 
            type="button"
            onClick={() => setDetails(prev => ({...prev, tripType: 'return'}))}
            className={`flex-1 sm:flex-none px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${
              details.tripType === 'return' 
                ? 'bg-white text-brand-900 shadow-md' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Return
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6" ref={dropdownRef}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Pickup & Dropoff Row */}
          <div className="grid grid-cols-1 sm:grid-cols-11 gap-4 items-center">
            <div className="sm:col-span-5 relative">
              <label className="text-[10px] font-black text-brand-900/50 uppercase tracking-widest mb-2 block ml-1">From</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-500 z-10" />
                <input
                  type="text"
                  name="pickupLocation"
                  placeholder="Pickup location..."
                  className="w-full pl-12 pr-10 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-xl focus:border-brand-500 focus:bg-white focus:ring-0 transition-all outline-none text-sm font-bold text-brand-900"
                  value={details.pickupLocation}
                  onChange={handleChange}
                  onFocus={() => handleFocus('pickup')}
                  required
                  autoComplete="off"
                />
                {isLoadingLocation && activeDropdown === 'pickup' && (
                  <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-500 animate-spin z-10" />
                )}
              </div>
              {activeDropdown === 'pickup' && suggestions.length > 0 && (
                 <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-[60] max-h-60 overflow-y-auto overflow-x-hidden">
                   {suggestions.map((loc, idx) => (
                     <button
                       key={idx}
                       type="button"
                       className="w-full text-left px-4 py-3.5 hover:bg-brand-50 text-xs font-bold text-brand-900 transition-colors flex items-center border-b border-gray-50 last:border-0"
                       onClick={() => handleLocationSelect('pickupLocation', loc)}
                     >
                       <MapPin className="w-4 h-4 mr-3 text-brand-300 flex-shrink-0" />
                       <span className="truncate">{loc}</span>
                     </button>
                   ))}
                 </div>
              )}
            </div>

            <div className="hidden sm:flex sm:col-span-1 justify-center pt-6">
                <ArrowRightLeft className="w-5 h-5 text-gray-300" />
            </div>

            <div className="sm:col-span-5 relative">
              <label className="text-[10px] font-black text-brand-900/50 uppercase tracking-widest mb-2 block ml-1">To</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-brand-500 transition-colors z-10" />
                <input
                  type="text"
                  name="dropoffLocation"
                  placeholder="Destination..."
                  className="w-full pl-12 pr-10 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-xl focus:border-brand-500 focus:bg-white focus:ring-0 transition-all outline-none text-sm font-bold text-brand-900"
                  value={details.dropoffLocation}
                  onChange={handleChange}
                  onFocus={() => handleFocus('dropoff')}
                  required
                  autoComplete="off"
                />
                 {isLoadingLocation && activeDropdown === 'dropoff' && (
                  <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-500 animate-spin z-10" />
                )}
              </div>
              {activeDropdown === 'dropoff' && suggestions.length > 0 && (
                 <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-[60] max-h-60 overflow-y-auto overflow-x-hidden">
                   {suggestions.map((loc, idx) => (
                     <button
                       key={idx}
                       type="button"
                       className="w-full text-left px-4 py-3.5 hover:bg-brand-50 text-xs font-bold text-brand-900 transition-colors flex items-center border-b border-gray-50 last:border-0"
                       onClick={() => handleLocationSelect('dropoffLocation', loc)}
                     >
                       <MapPin className="w-4 h-4 mr-3 text-brand-300 flex-shrink-0" />
                       <span className="truncate">{loc}</span>
                     </button>
                   ))}
                 </div>
              )}
            </div>
          </div>

          {/* Dates & Times Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-brand-900/50 uppercase tracking-widest mb-2 block ml-1">Departure</label>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10 pointer-events-none" />
                  <input
                    type="date"
                    name="pickupDate"
                    min={today}
                    className="w-full pl-10 pr-2 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-brand-500 focus:bg-white focus:ring-0 outline-none text-xs font-bold text-brand-900 appearance-none"
                    value={details.pickupDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="relative w-28 md:w-32">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10 pointer-events-none" />
                  <input
                    type="time"
                    name="pickupTime"
                    className="w-full pl-10 pr-2 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-brand-500 focus:bg-white focus:ring-0 outline-none text-xs font-bold text-brand-900 appearance-none"
                    value={details.pickupTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {isReturn && (
                <div className="space-y-2 animate-fade-in">
                <label className="text-[10px] font-black text-brand-500 uppercase tracking-widest mb-2 block ml-1">Return Trip</label>
                <div className="flex gap-2">
                    <div className="relative flex-grow">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-500 z-10 pointer-events-none" />
                    <input
                        type="date"
                        name="returnDate"
                        min={details.pickupDate || today}
                        className="w-full pl-10 pr-2 py-4 bg-brand-50/50 border-2 border-brand-200 rounded-xl focus:border-brand-500 focus:bg-white focus:ring-0 outline-none text-xs font-bold text-brand-900 appearance-none"
                        value={details.returnDate}
                        onChange={handleChange}
                        required={isReturn}
                    />
                    </div>
                    <div className="relative w-28 md:w-32">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-500 z-10 pointer-events-none" />
                    <input
                        type="time"
                        name="returnTime"
                        className="w-full pl-10 pr-2 py-4 bg-brand-50/50 border-2 border-brand-200 rounded-xl focus:border-brand-500 focus:bg-white focus:ring-0 outline-none text-xs font-bold text-brand-900 appearance-none"
                        value={details.returnTime}
                        onChange={handleChange}
                        required={isReturn}
                    />
                    </div>
                </div>
                </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-5 px-8 rounded-2xl shadow-xl hover:shadow-green-500/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 text-sm uppercase tracking-[0.2em]"
        >
          <Phone className="w-5 h-5" />
          <span>Request Quote via WhatsApp</span>
        </button>
      </form>
      
      <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
         <span className="flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>Fixed Price</span>
         <span className="flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>Verified Drivers</span>
         <span className="flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>24/7 Dispatch</span>
      </div>
    </div>
  );
};

export default BookingForm;