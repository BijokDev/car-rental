import React, { useState, useRef, useEffect } from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  Search,
  ArrowLeftRight,
  Users,
  Minus,
  Plus,
  Check,
  ShieldCheck,
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

  const [alsoAccommodation, setAlsoAccommodation] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'pickup' | 'dropoff' | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>(POPULAR_LOCATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      alert('Please enter a pickup location');
      return;
    }

    if (details.serviceType === 'transfer' && !details.dropoffLocation) {
      alert('Please enter a dropoff destination');
      return;
    }

    // Fire Google Ads Conversion Tracking Event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', { 'send_to': 'AW-17916725081/7CJyCLaN8fQbENmOrt9C' });
    }

    onSearch(details);
  };

  return (
    <div
      ref={dropdownRef}
      className="relative z-30 mx-4 lg:mx-auto max-w-xl lg:max-w-6xl mt-6 md:-mt-24 font-sans"
    >
      {/* Top Floating Pill Tabs */}
      <div className="flex items-center gap-2 mb-3 px-2 sm:px-0">
        <button
          type="button"
          onClick={() => setDetails(prev => ({ ...prev, serviceType: 'transfer' }))}
          className={`px-6 py-2.5 text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2 ${
            details.serviceType === 'transfer'
              ? 'bg-black text-white'
              : 'bg-white/90 backdrop-blur text-gray-700 hover:bg-white hover:text-black border border-gray-200/80'
          }`}
        >
          Transfer
        </button>
        <button
          type="button"
          onClick={() => setDetails(prev => ({ ...prev, serviceType: 'hourly' }))}
          className={`px-6 py-2.5 text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2 ${
            details.serviceType === 'hourly'
              ? 'bg-black text-white'
              : 'bg-white/90 backdrop-blur text-gray-700 hover:bg-white hover:text-black border border-gray-200/80'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>By the Hour</span>
        </button>
      </div>

      {/* Main Card Container */}
      <div className="bg-white rounded-3xl shadow-[0_12px_45px_rgba(0,0,0,0.12)] border border-gray-100 p-5 sm:p-7 lg:p-6">
        
        {/* ========================================================================= */}
        {/* DESKTOP VIEW (Visible on lg and above - matches Image 2)                  */}
        {/* ========================================================================= */}
        <div className="hidden lg:block">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-3">
              
              {/* Desktop: From */}
              <div className="relative flex-1 min-w-0">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5 block">
                  From
                </label>
                <div className="relative flex items-center bg-[#f8f9fa] hover:bg-gray-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-black border border-gray-200 rounded-xl px-3.5 py-2.5 transition-all">
                  <CircleDot className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
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
                    className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none truncate font-medium"
                  />
                </div>

                {/* Autocomplete Suggestions */}
                {activeDropdown === 'pickup' && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 max-h-64 overflow-y-auto">
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

              {/* Desktop: Swap Button (Only if transfer) */}
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

              {/* Desktop: To (Transfer only) */}
              {details.serviceType === 'transfer' && (
                <div className="relative flex-1 min-w-0">
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5 block">
                    To
                  </label>
                  <div className="relative flex items-center bg-[#f8f9fa] hover:bg-gray-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-black border border-gray-200 rounded-xl px-3.5 py-2.5 transition-all">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
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
                      className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none truncate font-medium"
                    />
                  </div>

                  {/* Autocomplete Suggestions */}
                  {activeDropdown === 'dropoff' && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 max-h-64 overflow-y-auto">
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

              {/* Desktop: Journey Information (Combined Date, Time, Passengers) */}
              <div className="relative flex-[1.4] min-w-0">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5 block">
                  Journey Information
                </label>
                <div className="flex items-center bg-[#f8f9fa] border border-gray-200 rounded-xl px-3 py-1.5 divide-x divide-gray-200">
                  
                  {/* Date Picker */}
                  <div className="flex items-center gap-1.5 pr-2.5 flex-1 min-w-0">
                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <input
                      type="date"
                      min={today}
                      value={details.pickupDate}
                      onChange={(e) => setDetails(prev => ({ ...prev, pickupDate: e.target.value }))}
                      required
                      className="bg-transparent text-xs text-gray-800 font-medium outline-none cursor-pointer w-full"
                    />
                  </div>

                  {/* Time Picker */}
                  <div className="flex items-center gap-1.5 px-2.5">
                    <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <input
                      type="time"
                      value={details.pickupTime}
                      onChange={(e) => setDetails(prev => ({ ...prev, pickupTime: e.target.value }))}
                      required
                      className="bg-transparent text-xs text-gray-800 font-medium outline-none cursor-pointer"
                    />
                  </div>

                  {/* Passenger Stepper */}
                  <div className="flex items-center gap-2 pl-2.5">
                    <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-xs font-bold text-gray-900 w-4 text-center">
                      {details.passengers}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setDetails(p => ({ ...p, passengers: Math.max(1, p.passengers - 1) }))}
                        className="w-5 h-5 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDetails(p => ({ ...p, passengers: Math.min(16, p.passengers + 1) }))}
                        className="w-5 h-5 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Hourly Duration selector (if Hourly) */}
                  {details.serviceType === 'hourly' && (
                    <div className="pl-2.5">
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
              </div>

              {/* Desktop: Search Button */}
              <div className="pt-6 flex-shrink-0">
                <button
                  type="submit"
                  className="bg-black hover:bg-neutral-900 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-98 flex items-center gap-2 text-sm"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </div>

            </div>

            {/* Desktop Bottom Row: Checkbox & Trust Points */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <label className="flex items-center gap-2 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  checked={alsoAccommodation}
                  onChange={(e) => setAlsoAccommodation(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                />
                <span className="text-gray-700 group-hover:text-black transition-colors font-medium">
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

        {/* ========================================================================= */}
        {/* MOBILE & TABLET VIEW (< lg - matches Image 1)                            */}
        {/* ========================================================================= */}
        <div className="block lg:hidden">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* From */}
            <div className="relative">
              <label className="text-sm font-semibold text-gray-900 mb-1.5 block">
                From
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Address, airport, hotel, ..."
                  value={details.pickupLocation}
                  onChange={(e) => handleLocationInputChange('pickupLocation', e.target.value)}
                  onFocus={() => {
                    setActiveDropdown('pickup');
                    fetchLocations(details.pickupLocation);
                  }}
                  required
                  autoComplete="off"
                  className="w-full bg-[#f1f3f5] rounded-xl pl-11 pr-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium"
                />
              </div>

              {/* Mobile Autocomplete */}
              {activeDropdown === 'pickup' && suggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 max-h-56 overflow-y-auto">
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

            {/* To (Transfer Only) */}
            {details.serviceType === 'transfer' && (
              <div className="relative">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-gray-900 block">
                    To
                  </label>
                  {details.pickupLocation && (
                    <button
                      type="button"
                      onClick={handleSwapLocations}
                      className="text-xs font-semibold text-gray-500 hover:text-black flex items-center gap-1"
                    >
                      <ArrowLeftRight className="w-3 h-3" />
                      <span>Swap</span>
                    </button>
                  )}
                </div>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Address, airport, hotel, ..."
                    value={details.dropoffLocation || ''}
                    onChange={(e) => handleLocationInputChange('dropoffLocation', e.target.value)}
                    onFocus={() => {
                      setActiveDropdown('dropoff');
                      fetchLocations(details.dropoffLocation || '');
                    }}
                    required={details.serviceType === 'transfer'}
                    autoComplete="off"
                    className="w-full bg-[#f1f3f5] rounded-xl pl-11 pr-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium"
                  />
                </div>

                {/* Mobile Autocomplete */}
                {activeDropdown === 'dropoff' && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 max-h-56 overflow-y-auto">
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

            {/* Pickup Date */}
            <div>
              <label className="text-sm font-semibold text-gray-900 mb-1.5 block">
                Pickup date
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  min={today}
                  value={details.pickupDate}
                  onChange={(e) => setDetails(prev => ({ ...prev, pickupDate: e.target.value }))}
                  required
                  className="w-full bg-[#f1f3f5] rounded-xl pl-11 pr-4 py-3.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium"
                />
              </div>
            </div>

            {/* Pickup Time */}
            <div>
              <label className="text-sm font-semibold text-gray-900 mb-1.5 block">
                Pickup time
              </label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                <input
                  type="time"
                  value={details.pickupTime}
                  onChange={(e) => setDetails(prev => ({ ...prev, pickupTime: e.target.value }))}
                  required
                  className="w-full bg-[#f1f3f5] rounded-xl pl-11 pr-4 py-3.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium"
                />
              </div>
            </div>

            {/* Duration (Hourly only) */}
            {details.serviceType === 'hourly' && (
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-1.5 block">
                  Duration (Hours)
                </label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  <select
                    value={details.duration}
                    onChange={(e) => setDetails(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    className="w-full bg-[#f1f3f5] rounded-xl pl-11 pr-4 py-3.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium cursor-pointer"
                  >
                    {[2, 3, 4, 5, 6, 7, 8, 10, 12].map(h => (
                      <option key={h} value={h}>{h} Hours Charter</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Passengers Card */}
            <div className="bg-[#f8f9fa] border border-gray-100 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-gray-500 block mb-0.5">
                  Passengers
                </span>
                <span className="text-base font-bold text-gray-900">
                  {details.passengers}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setDetails(p => ({ ...p, passengers: Math.max(1, p.passengers - 1) }))}
                  className="w-9 h-9 rounded-lg bg-[#232936] hover:bg-black text-white flex items-center justify-center font-bold text-base transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDetails(p => ({ ...p, passengers: Math.min(16, p.passengers + 1) }))}
                  className="w-9 h-9 rounded-lg bg-[#232936] hover:bg-black text-white flex items-center justify-center font-bold text-base transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile Submit Button */}
            <button
              type="submit"
              className="w-full bg-black hover:bg-neutral-900 active:scale-[0.99] text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-base mt-2"
            >
              <Search className="w-5 h-5" />
              <span>See prices</span>
            </button>

            {/* Mobile Trust Points */}
            <div className="pt-2 text-center text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-500 space-y-1">
              <div className="flex items-center justify-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-black rounded-full" />
                  Fixed Price
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-black rounded-full" />
                  Verified Drivers
                </span>
              </div>
              <div className="flex items-center justify-center">
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