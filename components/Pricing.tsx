import React from 'react';
import { Plane, Mountain, Landmark, MapPin, CheckCircle2 } from 'lucide-react';

const Pricing: React.FC = () => {
  const categories = [
    {
      title: "Airport Transfers",
      icon: <Plane className="w-6 h-6 text-gold-500" />,
      items: [
        { route: "KL City ↔ KLIA/KLIA2", price: "from RM65" },
        { route: "Subang Airport ↔ KL City", price: "from RM50" },
        { route: "KLIA ↔ Genting Highlands", price: "from RM180" },
        { route: "Meet & Greet Service", price: "Included" }
      ]
    },
    {
      title: "Holiday Destinations",
      icon: <Mountain className="w-6 h-6 text-gold-500" />,
      items: [
        { route: "KL City ↔ Genting Highlands", price: "from RM130" },
        { route: "KL City ↔ Malacca (Melaka)", price: "from RM250" },
        { route: "KL City ↔ Cameron Highlands", price: "from RM450" },
        { route: "KL City ↔ Port Dickson", price: "from RM180" }
      ]
    },
    {
      title: "Outstation Trips",
      icon: <Landmark className="w-6 h-6 text-gold-500" />,
      items: [
        { route: "KL City ↔ Penang / Ipoh", price: "Quote Required" },
        { route: "KL City ↔ Johor Bahru (JB)", price: "Quote Required" },
        { route: "KL City ↔ Singapore Transfer", price: "from RM900" },
        { route: "Full Day Booking (8 Hours)", price: "from RM400" }
      ]
    }
  ];

  return (
    <section id="rates" className="py-24 bg-gray-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-brand-600 font-black tracking-[0.2em] uppercase text-xs mb-3 block">Rate Card</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-900 mb-4">Affordable Pricing</h2>
          <div className="h-1.5 w-24 bg-gold-500 mx-auto rounded-full"></div>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto font-medium">
            We provide fixed and transparent rates. No surge pricing, no hidden extra costs. Prices below are estimates; contact us for the best current offer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {categories.map((cat, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all hover:shadow-2xl">
              <div className="bg-brand-900 p-6 flex items-center space-x-3">
                <div className="p-2 bg-white/10 rounded-lg">{cat.icon}</div>
                <h3 className="text-xl font-bold text-white">{cat.title}</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {cat.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-gray-50 pb-3 last:border-0">
                      <span className="text-gray-700 text-sm font-medium">{item.route}</span>
                      <span className="text-brand-900 font-black text-sm">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-brand-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <div>
                <h3 className="text-3xl font-bold mb-6">Inclusive Package Details</h3>
                <div className="space-y-4">
                  {[
                    "Fuel, Tolls, and Parking charges can be included",
                    "English & Malay speaking professional drivers",
                    "Clean, non-smoking, and sanitized vehicles",
                    "Door-to-door pickup and drop-off service",
                    "Free flight tracking for airport pickups"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center space-x-3">
                        <CheckCircle2 className="w-5 h-5 text-gold-500" />
                        <span className="text-brand-100 font-medium">{text}</span>
                    </div>
                  ))}
                </div>
             </div>
             <div className="text-center lg:text-right">
                <p className="text-lg text-brand-200 mb-8 italic">"Best rates for outstation trips and group bookings. Book today and save!"</p>
                <a 
                  href="https://wa.me/601128829143" 
                  className="inline-flex items-center px-10 py-5 bg-gold-500 text-brand-900 font-black rounded-2xl shadow-2xl hover:bg-gold-400 transition transform hover:-translate-y-1 uppercase tracking-widest text-xs"
                >
                  Request A Custom Quote
                </a>
             </div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;