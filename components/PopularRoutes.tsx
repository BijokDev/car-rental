import React from 'react';
import { ArrowRight, Clock, MapPin } from 'lucide-react';

const PopularRoutes: React.FC = () => {
const routes = [
        {
            from: 'KLIA/KLIA2',
            to: 'KL City Center',
            price: 'From RM150',
            duration: '45-60 mins',
            // Petronas Twin Towers at night
            image: "https://images.unsplash.com/photo-1682261282469-a5d3e84948f7?auto=format&fit=crop&q=80&w=800" 
        },
        {
            from: 'Kuala Lumpur',
            to: 'Genting Highlands',
            price: 'From RM250',
            duration: '1-1.5 hours',
            // Genting Highlands misty mountains/cable car view
            image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&q=80&w=800"
        },
        {
            from: 'Kuala Lumpur',
            to: 'Malacca',
            price: 'From RM350',
            duration: '2-2.5 hours',
            // Malacca Christ Church (Red Square)
            image: "https://images.unsplash.com/photo-1594354940496-6e8e2c9fb856?auto=format&fit=crop&q=80&w=800"
        },
        {
            from: 'KLIA',
            to: 'Johor Bahru',
            price: 'From RM650',
            duration: '3.5-4 hours',
            // Johor Bahru City/Streets
            image: "https://images.unsplash.com/photo-1647682883443-995093d86ff1?auto=format&fit=crop&q=80&w=800"
        },
        {
            from: 'Kuala Lumpur',
            to: 'Cameron Highlands',
            price: 'From RM550',
            duration: '3-4 hours',
            // Cameron Highlands Tea Plantation
            image: "https://images.unsplash.com/photo-1646977860771-beafae0cd4a1?auto=format&fit=crop&q=80&w=800"
        },
        {
            from: 'KLIA',
            to: 'Penang',
            price: 'From RM850',
            duration: '4-5 hours',
            // Penang Bridge at night
            image: "https://images.unsplash.com/photo-1581480455040-6ce38da95d95?auto=format&fit=crop&q=80&w=800"
        }
    ];

    return (
        <section className="py-20 lg:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16 lg:mb-24">
                    <span className="text-brand-600 font-black tracking-[0.2em] uppercase text-xs mb-4 block">
                        Top Destinations
                    </span>
                    <h2 className="text-4xl lg:text-6xl font-serif font-bold text-brand-900 mb-6 italic">
                        Popular Routes
                    </h2>
                    <div className="h-1.5 w-24 bg-gold-500 mx-auto rounded-full"></div>
                    <p className="mt-8 text-gray-500 max-w-2xl mx-auto font-medium text-sm sm:text-base leading-relaxed">
                        Frequently traveled destinations with estimated pricing. Get exact quotes via WhatsApp.
                    </p>
                </div>

                {/* Routes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                    {routes.map((route, index) => (
                        <div
                            key={index}
                            className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:-translate-y-2 flex flex-col"
                        >
                            {/* Image Header with Overlay */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={route.image}
                                    alt={`${route.from} to ${route.to}`}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-brand-900/60 transition-opacity duration-300"></div>

                                {/* Route Info Overlay */}
                                <div className="absolute inset-0 flex flex-col justify-center px-8 z-10">
                                    <div className="flex items-center gap-3 text-white mb-2">
                                        <span className="font-bold text-lg">{route.from}</span>
                                        <ArrowRight className="w-5 h-5 text-gold-500" />
                                        <span className="font-bold text-lg">{route.to}</span>
                                    </div>
                                    <div className="flex items-center text-gray-300 text-xs font-bold uppercase tracking-widest gap-2">
                                        <Clock className="w-3.5 h-3.5" />
                                        {route.duration}
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 flex flex-col flex-grow">
                                <div className="flex justify-between items-end mb-8">
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-2">
                                            Starting From
                                        </p>
                                        <p className="text-3xl font-black text-brand-900">{route.price}</p>
                                    </div>
                                </div>

                                <a
                                    href={`https://wa.me/60107198186?text=Hi, I need a quote for ${route.from} to ${route.to}`}
                                    className="mt-auto w-full bg-gray-50 hover:bg-brand-900 text-brand-900 hover:text-white font-black py-4 rounded-xl transition-all text-center text-[10px] uppercase tracking-[0.2em] border border-gray-100 hover:border-transparent"
                                >
                                    Get Quote
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Custom Route CTA */}
                <div className="mt-16 text-center">
                    <p className="text-gray-500 mb-6 font-medium text-sm">
                        Don't see your destination? We cover all of Malaysia!
                    </p>
                    <a
                        href="https://wa.me/60107198186"
                        className="inline-flex items-center px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-black rounded-xl shadow-xl hover:shadow-green-500/20 transition-all transform hover:-translate-y-1 text-xs uppercase tracking-[0.2em]"
                    >
                        Request Custom Quote
                    </a>
                </div>
            </div>
        </section>
    );
};

export default PopularRoutes;
