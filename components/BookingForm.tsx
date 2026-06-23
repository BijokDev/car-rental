import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Calendar, Clock, Loader2, Search } from 'lucide-react';
import { BookingDetails } from '../types';

interface BookingFormProps {
  onSearch: (details: BookingDetails) => void;
}

const POPULAR_LOCATIONS = [
  "KLIA (Terminal 1) - Main Terminal",
  "KLIA 2 (Terminal 2) - AirAsia/Budget",
  "Subang Airport (SZB)",
  "KL Sentral Station",
  "Kuala Lumpur City Centre (KLCC)",
  "Petronas Twin Towers",
  "Bukit Bintang / Pavilion KL",
  "Berjaya Times Square",
  "Chinatown / Petaling Street",
  "Batu Caves",
  "Genting Highlands (First World Hotel/SkyAvenue)",
  "Awana Skyway Station (Genting)",
  "Cameron Highlands (Tanah Rata/Brinchang)",
  "Fraser's Hill",
  "Sunway Lagoon Theme Park",
  "Legoland Malaysia (Johor)",
  "Genting SkyWorlds Theme Park",
  "I-City Shah Alam",
  "Malacca City (Melaka) - Jonker Street",
  "Johor Bahru (JB City)",
  "Ipoh (Old Town)",
  "Penang (Georgetown/Batu Ferringhi)",
  "Port Dickson (Avillion/Thistle)",
  "Putrajaya (Pink Mosque)",
  "Kuantan / Cherating"
];

const BookingForm: React.FC<BookingFormProps> = ({ onSearch }) => {
  const [details, setDetails] = useState<BookingDetails>({
    serviceType: 'transfer',
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: '',
    pickupTime: '',
    duration: 2,
    passengers: 2
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
    setDetails(prev => ({ ...prev, [name]: name === 'duration' ? parseInt(value) : value }));

    if (name === 'pickupLocation' || name === 'dropoffLocation') {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => fetchLocations(value), 500);
    }
  };

  const handleFocus = (field: 'pickup' | 'dropoff') => {
    setActiveDropdown(field);
    const currentValue = field === 'pickup' ? details.pickupLocation : details.dropoffLocation;
    fetchLocations(currentValue || '');
  };

  const handleLocationSelect = (field: 'pickupLocation' | 'dropoffLocation', value: string) => {
    setDetails(prev => ({ ...prev, [field]: value }));
    setActiveDropdown(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (details.serviceType === 'transfer' && !details.dropoffLocation) {
      alert('Please enter a dropoff location');
      return;
    }

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {'send_to': 'AW-17916725081/7CJyCLaN8fQbENmOrt9C'});
    }

    onSearch(details);
  };

  const inputClasses = "w-full pl-10 pr-4 py-4 bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 border-none rounded-xl transition-all outline-none text-base md:text-sm text-brand-900";
  const labelClasses = "text-sm font-semibold text-gray-800 mb-2 block ml-1";

  return (
    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-6 md:p-10 mt-8 md:-mt-24 relative z-20 mx-4 lg:mx-auto max-w-4xl font-sans">
      
      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-gray-100 pb-2">
        <button
          type="button"
          onClick={() => setDetails(prev => ({ ...prev, serviceType: 'transfer' }))}
          className={`px-6 py-2.5 text-base font-medium rounded-xl transition-all flex items-center gap-2 ${details.serviceType === 'transfer'
            ? 'bg-black text-white shadow-md'
            : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          Transfer
        </button>
        <button
          type="button"
          onClick={() => setDetails(prev => ({ ...prev, serviceType: 'hourly' }))}
          className={`px-6 py-2.5 text-base font-medium rounded-xl transition-all flex items-center gap-2 ${details.serviceType === 'hourly'
            ? 'bg-black text-white shadow-md'
            : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          <Clock className="w-4 h-4" /> By the Hour
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" ref={dropdownRef}>
        
        {/* From */}
        <div className="relative">
          <label className={labelClasses}>From</label>
          <div className="relative group">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
            <input
              type="text"
              name="pickupLocation"
              placeholder="Address, airport, hotel, ..."
              className={inputClasses}
              value={details.pickupLocation}
              onChange={handleChange}
              onFocus={() => handleFocus('pickup')}
              required
              autoComplete="off"
            />
          </div>
          {activeDropdown === 'pickup' && suggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-[60] max-h-60 overflow-y-auto overflow-x-hidden">
              {suggestions.map((loc, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="w-full text-left px-4 py-3.5 hover:bg-gray-50 text-sm font-medium text-gray-800 transition-colors flex items-center border-b border-gray-50 last:border-0"
                  onClick={() => handleLocationSelect('pickupLocation', loc)}
                >
                  <MapPin className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{loc}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* To (Only for Transfer) */}
        {details.serviceType === 'transfer' && (
          <div className="relative">
            <label className={labelClasses}>To</label>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
              <input
                type="text"
                name="dropoffLocation"
                placeholder="Address, airport, hotel, ..."
                className={inputClasses}
                value={details.dropoffLocation || ''}
                onChange={handleChange}
                onFocus={() => handleFocus('dropoff')}
                required={details.serviceType === 'transfer'}
                autoComplete="off"
              />
            </div>
            {activeDropdown === 'dropoff' && suggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-[60] max-h-60 overflow-y-auto overflow-x-hidden">
                {suggestions.map((loc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="w-full text-left px-4 py-3.5 hover:bg-gray-50 text-sm font-medium text-gray-800 transition-colors flex items-center border-b border-gray-50 last:border-0"
                    onClick={() => handleLocationSelect('dropoffLocation', loc)}
                  >
                    <MapPin className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{loc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Date and Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <label className={labelClasses}>Pickup date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10 pointer-events-none" />
              <input
                type="date"
                name="pickupDate"
                min={today}
                className={inputClasses}
                value={details.pickupDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="relative">
            <label className={labelClasses}>Pickup time</label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10 pointer-events-none" />
              <input
                type="time"
                name="pickupTime"
                className={inputClasses}
                value={details.pickupTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Duration (Only for Hourly) */}
        {details.serviceType === 'hourly' && (
          <div className="relative">
            <label className={labelClasses}>Duration</label>
            <select
              name="duration"
              className="w-full px-4 py-4 bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 border-none rounded-xl transition-all outline-none text-base md:text-sm text-brand-900 appearance-none cursor-pointer"
              value={details.duration}
              onChange={handleChange}
            >
              {[2,3,4,5,6,7,8,9,10,11,12].map(hours => (
                <option key={hours} value={hours}>{hours} Hours</option>
              ))}
            </select>
          </div>
        )}

        {/* Passengers */}
        <div className="relative bg-gray-100 rounded-xl p-4 flex justify-between items-center mt-2">
          <div className="flex flex-col">
            <span className={labelClasses.replace('mb-2', 'mb-1')}>Passengers</span>
            <span className="text-sm font-medium text-gray-800 ml-1">{details.passengers}</span>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setDetails(p => ({ ...p, passengers: Math.max(1, p.passengers - 1) }))}
              className="bg-gray-700 hover:bg-black text-white w-8 h-8 rounded-md flex items-center justify-center font-medium transition-colors"
            >
              -
            </button>
            <button
              type="button"
              onClick={() => setDetails(p => ({ ...p, passengers: p.passengers + 1 }))}
              className="bg-gray-700 hover:bg-black text-white w-8 h-8 rounded-md flex items-center justify-center font-medium transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-black hover:bg-gray-900 text-white font-bold py-4 px-8 rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 text-base mt-6"
        >
          <Search className="w-5 h-5" />
          <span>See prices</span>
        </button>
      </form>

      <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
        <span className="flex items-center"><span className="w-1.5 h-1.5 bg-black rounded-full mr-2"></span>Fixed Price</span>
        <span className="flex items-center"><span className="w-1.5 h-1.5 bg-black rounded-full mr-2"></span>Verified Drivers</span>
        <span className="flex items-center"><span className="w-1.5 h-1.5 bg-black rounded-full mr-2"></span>24/7 Dispatch</span>
      </div>
    </div>
  );
};

export default BookingForm;