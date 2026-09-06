import React, { useState, useRef, useEffect } from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  Search,
  ArrowLeftRight,
  Users,
  Briefcase,
  ChevronDown,
  Minus,
  Plus,
  CircleDot
} from 'lucide-react';
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
  const getMinDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const today = getMinDate();

  const [details, setDetails] = useState<BookingDetails>({
    serviceType: 'transfer',
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: today,
    pickupTime: '09:00',
    duration: 4,
    passengers: 2
  });

  const [luggage, setLuggage] = useState(2);
  const [alsoAccommodation, setAlsoAccommodation] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'pickup' | 'dropoff' | null>(null);
  const [showDatePopover, setShowDatePopover] = useState(false);
  const [showPaxPopover, setShowPaxPopover] = useState(false);

  const [suggestions, setSuggestions] = useState<string[]>(POPULAR_LOCATIONS);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
        setShowDatePopover(false);
        setShowPaxPopover(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDisplayDate = (dateStr: string, timeStr: string) => {
    if (!dateStr) return '13 Sep 09:00 AM';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        const day = d.getDate();
        const month = d.toLocaleDateString('en-US', { month: 'short' });
        
        let [hh, mm] = (timeStr || '09:00').split(':');
        let hour = parseInt(hh, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12;
        const formattedHour = String(hour).padStart(2, '0');
        return `${day} ${month} ${formattedHour}:${mm || '00'} ${ampm}`;
      }
      return `${dateStr} ${timeStr}`;
    } catch {
      return `${dateStr} ${timeStr}`;
    }
  };

  const fetchLocations = async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions(POPULAR_LOCATIONS.filter(loc => loc.toLowerCase().includes(query.toLowerCase())));
      return;
    }

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
    }
  };

  const handleLocationInputChange = (field: 'pickupLocation' | 'dropoffLocation', value: string) => {
    setDetails(prev => ({ ...prev, [field]: value }));
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => fetchLocations(value), 400);
  };

  const handleLocationSelect = (field: 'pickupLocation' | 'dropoffLocation', value: string) => {
    setDetails(prev => ({ ...prev, [field]: value }));
    setActiveDropdown(null);
  };

  const handleSwapLocations = () => {
    setDetails(prev => ({
      ...prev,
      pickupLocation: prev.dropoffLocation || '',
      dropoffLocation: prev.pickupLocation
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!details.pickupLocation) {
      alert('Please enter a pick-up location');
      return;
    }

    if (details.serviceType === 'transfer' && !details.dropoffLocation) {
      alert('Please enter your destination');
      return;
    }

    // Google Ads Conversion Tracking Event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', { 'send_to': 'AW-17916725081/7CJyCLaN8fQbENmOrt9C' });
    }

    onSearch(details);
  };

  return (
    <div ref={containerRef} className="relative z-30 w-full max-w-xl lg:max-w-5xl mx-auto font-sans">
      
      {/* Integrated Tab Header (Curved tab connected to the top-left of the card) */}
      <div className="flex">
        <div className="inline-flex items-center bg-white rounded-t-2xl px-2 pt-2 pb-1 border-t border-l border-r border-gray-200/90 shadow-[0_-3px_12px_rgba(0,0,0,0.04)]">
          <button
            type="button"
            onClick={() => setDetails(prev => ({ ...prev, serviceType: 'transfer' }))}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              details.serviceType === 'transfer'
                ? 'bg-black text-white shadow-sm'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            Transfer
          </button>
          <button
            type="button"
            onClick={() => setDetails(prev => ({ ...prev, serviceType: 'hourly' }))}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              details.serviceType === 'hourly'
                ? 'bg-black text-white shadow-sm'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            Hourly
          </button>
        </div>
      </div>

      {/* Main Booking Card */}
      <div className="bg-white rounded-b-3xl rounded-tr-3xl sm:rounded-3xl shadow-[0_12px_45px_rgba(0,0,0,0.18)] p-4 sm:p-6 border border-gray-200/90 text-left">
        
        {/* ========================================================================= */}
        {/* MOBILE VIEW (< lg) - Matches travelthru.com mobile screenshot             */}
        {/* ========================================================================= */}
        <div className="block lg:hidden">
          <form onSubmit={handleSubmit} className="space-y-2.5">
            
            {/* Input 1: Enter your pick-up location */}
            <div className="relative">
              <div className="relative flex items-center border border-gray-200 hover:border-gray-400 focus-within:border-black rounded-2xl px-3.5 py-3.5 bg-white transition-colors">
                <div className="w-4 h-4 rounded-full border-[2.5px] border-black flex items-center justify-center mr-3 flex-shrink-0">
                  <div className="w-1 h-1 bg-black rounded-full" />
                </div>
                <input
                  type="text"
                  placeholder="Enter your pick-up location"
                  value={details.pickupLocation}
                  onChange={(e) => handleLocationInputChange('pickupLocation', e.target.value)}
                  onFocus={() => {
                    setActiveDropdown('pickup');
                    fetchLocations(details.pickupLocation);
                  }}
                  required
                  autoComplete="off"
                  className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none font-normal"
                />
              </div>

              {/* Autocomplete Dropdown */}
              {activeDropdown === 'pickup' && suggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 max-h-56 overflow-y-auto">
                  {suggestions.map((loc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 text-xs font-medium text-gray-800 transition-colors flex items-center border-b border-gray-50 last:border-0"
                      onClick={() => handleLocationSelect('pickupLocation', loc)}
                    >
                      <MapPin className="w-3.5 h-3.5 mr-2 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{loc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input 2: Where are you headed? (Transfer only) */}
            {details.serviceType === 'transfer' ? (
              <div className="relative">
                <div className="relative flex items-center border border-gray-200 hover:border-gray-400 focus-within:border-black rounded-2xl px-3.5 py-3.5 bg-white transition-colors">
                  <MapPin className="w-4 h-4 text-black mr-3 flex-shrink-0 fill-current" />
                  <input
                    type="text"
                    placeholder="Where are you headed?"
                    value={details.dropoffLocation || ''}
                    onChange={(e) => handleLocationInputChange('dropoffLocation', e.target.value)}
                    onFocus={() => {
                      setActiveDropdown('dropoff');
                      fetchLocations(details.dropoffLocation || '');
                    }}
                    required={details.serviceType === 'transfer'}
                    autoComplete="off"
                    className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none font-normal"
                  />
                  {details.pickupLocation && (
                    <button
                      type="button"
                      onClick={handleSwapLocations}
                      title="Swap locations"
                      className="ml-2 text-gray-400 hover:text-black transition-colors flex-shrink-0 p-1"
                    >
                      <ArrowLeftRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Autocomplete Dropdown */}
                {activeDropdown === 'dropoff' && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 max-h-56 overflow-y-auto">
                    {suggestions.map((loc, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 text-xs font-medium text-gray-800 transition-colors flex items-center border-b border-gray-50 last:border-0"
                        onClick={() => handleLocationSelect('dropoffLocation', loc)}
                      >
                        <MapPin className="w-3.5 h-3.5 mr-2 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{loc}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Hourly Duration */
              <div className="relative flex items-center border border-gray-200 hover:border-gray-400 focus-within:border-black rounded-2xl px-3.5 py-3.5 bg-white transition-colors">
                <Clock className="w-4 h-4 text-black mr-3 flex-shrink-0" />
                <select
                  value={details.duration}
                  onChange={(e) => setDetails(p => ({ ...p, duration: parseInt(e.target.value) }))}
                  className="w-full bg-transparent text-sm text-gray-900 outline-none cursor-pointer font-medium"
                >
                  {[2, 3, 4, 5, 6, 7, 8, 10, 12].map(h => (
                    <option key={h} value={h}>{h} Hours Chauffeur Charter</option>
                  ))}
                </select>
              </div>
            )}

            {/* Row 3: Two side-by-side cards (Date/Time & Passengers/Luggage) */}
            <div className="grid grid-cols-[1.25fr_1fr] sm:grid-cols-[1.3fr_1fr] gap-2.5">
              
              {/* Left Box: Date & Time */}
              <div className="relative">
                <div
                  onClick={() => {
                    setShowDatePopover(!showDatePopover);
                    setShowPaxPopover(false);
                  }}
                  className="bg-[#f8f9fa] hover:bg-gray-100/90 rounded-2xl px-3 py-3 flex items-center gap-2 border border-gray-100 cursor-pointer transition-colors"
                >
                  <Calendar className="w-4 h-4 text-black flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                    {formatDisplayDate(details.pickupDate, details.pickupTime)}
                  </span>
                </div>

                {/* Date/Time Popover */}
                {showDatePopover && (
                  <div className="absolute top-full left-0 mt-2 p-4 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 min-w-[280px]">
                    <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                      Pickup Schedule
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 block mb-1">Date</label>
                        <input
                          type="date"
                          min={today}
                          value={details.pickupDate}
                          onChange={(e) => setDetails(prev => ({ ...prev, pickupDate: e.target.value }))}
                          required
                          className="w-full bg-gray-100 rounded-xl px-3 py-2 text-sm text-gray-900 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 block mb-1">Time</label>
                        <input
                          type="time"
                          value={details.pickupTime}
                          onChange={(e) => setDetails(prev => ({ ...prev, pickupTime: e.target.value }))}
                          required
                          className="w-full bg-gray-100 rounded-xl px-3 py-2 text-sm text-gray-900 outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowDatePopover(false)}
                        className="w-full bg-black text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider mt-1 hover:bg-neutral-900"
                      >
                        Set Date & Time
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Box: Passengers & Luggage */}
              <div className="relative">
                <div
                  onClick={() => {
                    setShowPaxPopover(!showPaxPopover);
                    setShowDatePopover(false);
                  }}
                  className="bg-[#f8f9fa] hover:bg-gray-100/90 rounded-2xl px-3 py-3 flex items-center justify-around border border-gray-100 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-black flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-gray-900">
                      {details.passengers}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-black flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-gray-900">
                      {luggage}
                    </span>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </div>
                </div>

                {/* Pax & Luggage Popover */}
                {showPaxPopover && (
                  <div className="absolute top-full right-0 mt-2 p-4 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 min-w-[240px]">
                    <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                      Guests & Bags
                    </div>
                    
                    {/* Passengers Stepper */}
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-700" />
                        <span className="text-xs font-semibold text-gray-800">Passengers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setDetails(p => ({ ...p, passengers: Math.max(1, p.passengers - 1) }))}
                          className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center font-bold text-sm"
                        >
                          -
                        </button>
                        <span className="w-5 text-center font-bold text-xs">{details.passengers}</span>
                        <button
                          type="button"
                          onClick={() => setDetails(p => ({ ...p, passengers: Math.min(16, p.passengers + 1) }))}
                          className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center font-bold text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Luggage Stepper */}
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-gray-700" />
                        <span className="text-xs font-semibold text-gray-800">Luggage</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setLuggage(l => Math.max(0, l - 1))}
                          className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center font-bold text-sm"
                        >
                          -
                        </button>
                        <span className="w-5 text-center font-bold text-xs">{luggage}</span>
                        <button
                          type="button"
                          onClick={() => setLuggage(l => Math.min(16, l + 1))}
                          className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center font-bold text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowPaxPopover(false)}
                      className="w-full bg-black text-white font-bold py-2 rounded-xl text-xs uppercase tracking-wider mt-2 hover:bg-neutral-900"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Big Black CTA Button */}
            <button
              type="submit"
              className="w-full bg-black hover:bg-neutral-900 active:scale-[0.99] text-white font-bold py-3.5 sm:py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 text-base mt-3 transition-all"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Search</span>
            </button>

            {/* Checkbox: Also search for accommodation */}
            <div className="pt-2">
              <label className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-gray-900 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={alsoAccommodation}
                  onChange={(e) => setAlsoAccommodation(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black cursor-pointer"
                />
                <span>Also search for accommodation</span>
              </label>
            </div>

          </form>
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP VIEW (≥ lg) - Matches travelthru.com desktop screenshot           */}
        {/* ========================================================================= */}
        <div className="hidden lg:block">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-3">
              
              {/* Desktop: From */}
              <div className="relative flex-1 min-w-0">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5 block">
                  From
                </label>
                <div className="relative flex items-center border border-gray-200 hover:border-gray-400 focus-within:border-black rounded-2xl px-3.5 py-3 bg-white transition-all">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-black flex items-center justify-center mr-2.5 flex-shrink-0">
                    <div className="w-1 h-1 bg-black rounded-full" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your pick-up location"
                    value={details.pickupLocation}
                    onChange={(e) => handleLocationInputChange('pickupLocation', e.target.value)}
                    onFocus={() => {
                      setActiveDropdown('pickup');
                      fetchLocations(details.pickupLocation);
                    }}
                    required
                    autoComplete="off"
                    className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none truncate font-normal"
                  />
                </div>

                {activeDropdown === 'pickup' && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 max-h-64 overflow-y-auto">
                    {suggestions.map((loc, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 text-xs font-medium text-gray-800 transition-colors flex items-center border-b border-gray-50 last:border-0"
                        onClick={() => handleLocationSelect('pickupLocation', loc)}
                      >
                        <MapPin className="w-3.5 h-3.5 mr-2 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{loc}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop: Swap Button */}
              {details.serviceType === 'transfer' && (
                <div className="pt-6 flex-shrink-0">
                  <button
                    type="button"
                    onClick={handleSwapLocations}
                    title="Swap pickup and dropoff"
                    className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-600 hover:text-black flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Desktop: To */}
              {details.serviceType === 'transfer' && (
                <div className="relative flex-1 min-w-0">
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5 block">
                    To
                  </label>
                  <div className="relative flex items-center border border-gray-200 hover:border-gray-400 focus-within:border-black rounded-2xl px-3.5 py-3 bg-white transition-all">
                    <MapPin className="w-4 h-4 text-black mr-2.5 flex-shrink-0 fill-current" />
                    <input
                      type="text"
                      placeholder="Where are you headed?"
                      value={details.dropoffLocation || ''}
                      onChange={(e) => handleLocationInputChange('dropoffLocation', e.target.value)}
                      onFocus={() => {
                        setActiveDropdown('dropoff');
                        fetchLocations(details.dropoffLocation || '');
                      }}
                      required={details.serviceType === 'transfer'}
                      autoComplete="off"
                      className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none truncate font-normal"
                    />
                  </div>

                  {activeDropdown === 'dropoff' && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 max-h-64 overflow-y-auto">
                      {suggestions.map((loc, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 text-xs font-medium text-gray-800 transition-colors flex items-center border-b border-gray-50 last:border-0"
                          onClick={() => handleLocationSelect('dropoffLocation', loc)}
                        >
                          <MapPin className="w-3.5 h-3.5 mr-2 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{loc}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Desktop: Journey Information */}
              <div className="relative flex-[1.4] min-w-0">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5 block">
                  Journey information
                </label>
                <div className="flex items-center border border-gray-200 rounded-2xl px-3 py-2 bg-white divide-x divide-gray-200">
                  
                  {/* Date/Time Clickable */}
                  <div
                    onClick={() => setShowDatePopover(!showDatePopover)}
                    className="flex items-center gap-2 pr-3 flex-1 cursor-pointer truncate"
                  >
                    <Calendar className="w-4 h-4 text-black flex-shrink-0" />
                    <span className="text-xs font-semibold text-gray-800 truncate">
                      {formatDisplayDate(details.pickupDate, details.pickupTime)}
                    </span>
                  </div>

                  {/* Pax & Luggage */}
                  <div
                    onClick={() => setShowPaxPopover(!showPaxPopover)}
                    className="flex items-center gap-3 pl-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-black flex-shrink-0" />
                      <span className="text-xs font-bold text-gray-900">{details.passengers}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-black flex-shrink-0" />
                      <span className="text-xs font-bold text-gray-900">{luggage}</span>
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>

                  {/* Hourly Duration */}
                  {details.serviceType === 'hourly' && (
                    <div className="pl-3">
                      <select
                        value={details.duration}
                        onChange={(e) => setDetails(p => ({ ...p, duration: parseInt(e.target.value) }))}
                        className="bg-transparent text-xs font-semibold text-gray-900 outline-none cursor-pointer"
                      >
                        {[2, 3, 4, 5, 6, 7, 8, 10, 12].map(h => (
                          <option key={h} value={h}>{h}h Charter</option>
                        ))}
                      </select>
                    </div>
                  )}

                </div>

                {/* Desktop Date Popover */}
                {showDatePopover && (
                  <div className="absolute top-full left-0 mt-2 p-4 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 min-w-[280px]">
                    <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Select Schedule
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">Date</label>
                        <input
                          type="date"
                          min={today}
                          value={details.pickupDate}
                          onChange={(e) => setDetails(prev => ({ ...prev, pickupDate: e.target.value }))}
                          className="w-full bg-gray-100 rounded-xl p-2.5 text-xs text-gray-900 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">Time</label>
                        <input
                          type="time"
                          value={details.pickupTime}
                          onChange={(e) => setDetails(prev => ({ ...prev, pickupTime: e.target.value }))}
                          className="w-full bg-gray-100 rounded-xl p-2.5 text-xs text-gray-900 outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowDatePopover(false)}
                        className="w-full bg-black text-white font-bold py-2 rounded-xl text-xs uppercase"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}

                {/* Desktop Pax Popover */}
                {showPaxPopover && (
                  <div className="absolute top-full right-0 mt-2 p-4 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 min-w-[240px]">
                    <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Passengers & Luggage
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-xs font-semibold text-gray-700">Passengers</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setDetails(p => ({ ...p, passengers: Math.max(1, p.passengers - 1) }))}
                          className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xs font-bold"
                        >-</button>
                        <span className="text-xs font-bold">{details.passengers}</span>
                        <button
                          type="button"
                          onClick={() => setDetails(p => ({ ...p, passengers: Math.min(16, p.passengers + 1) }))}
                          className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xs font-bold"
                        >+</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-xs font-semibold text-gray-700">Luggage</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setLuggage(l => Math.max(0, l - 1))}
                          className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xs font-bold"
                        >-</button>
                        <span className="text-xs font-bold">{luggage}</span>
                        <button
                          type="button"
                          onClick={() => setLuggage(l => Math.min(16, l + 1))}
                          className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xs font-bold"
                        >+</button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPaxPopover(false)}
                      className="w-full bg-black text-white font-bold py-2 rounded-xl text-xs uppercase mt-2"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>

              {/* Desktop: Search Button */}
              <div className="pt-6 flex-shrink-0">
                <button
                  type="submit"
                  className="bg-black hover:bg-neutral-900 text-white font-bold px-8 py-3 rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-98 flex items-center gap-2 text-sm"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </div>

            </div>

            {/* Desktop Bottom: Checkbox & Trust Points */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <label className="flex items-center gap-2 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  checked={alsoAccommodation}
                  onChange={(e) => setAlsoAccommodation(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black cursor-pointer"
                />
                <span className="text-gray-800 font-medium">
                  Also search for accommodation
                </span>
              </label>

              <div className="flex items-center gap-6 font-semibold uppercase tracking-wider text-[11px] text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-black rounded-full" />
                  Fixed Price
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-black rounded-full" />
                  Verified Drivers
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-black rounded-full" />
                  24/7 Dispatch
                </span>
              </div>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default BookingForm;