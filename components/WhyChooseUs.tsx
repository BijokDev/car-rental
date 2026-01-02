import React from 'react';
import { Clock, Shield, DollarSign, Sparkles, MapPin, CreditCard } from 'lucide-react';

const WhyChooseUs: React.FC = () => {
    const features = [
        {
            icon: Clock,
            title: '24/7 Availability',
            description: 'Round-the-clock service for all your transportation needs, anytime, anywhere.'
        },
        {
            icon: Shield,
            title: 'Licensed & Insured',
            description: 'All drivers are professionally licensed with comprehensive insurance coverage.'
        },
        {
            icon: DollarSign,
            title: 'Fixed Pricing',
            description: 'No surge pricing or hidden fees. What you see is what you pay.'
        },
        {
            icon: Sparkles,
            title: 'Clean Vehicles',
            description: 'Well-maintained, sanitized fleet for your comfort and safety.'
        },
        {
            icon: MapPin,
            title: 'GPS Tracking',
            description: 'Real-time tracking for peace of mind and accurate ETAs.'
        },
        {
            icon: CreditCard,
            title: 'Flexible Payment',
            description: 'Cash, card, or online transfer - pay your way.'
        }
    ];

    return (
        <section className="py-20 lg:py-32 bg-brand-900 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-16 lg:mb-24">
                    <span className="text-gold-500 font-black tracking-[0.2em] uppercase text-xs mb-4 block">
                        Our Advantages
                    </span>
                    <h2 className="text-4xl lg:text-6xl font-serif font-bold text-white mb-6 italic">
                        Why Choose AJ Taxi KL
                    </h2>
                    <div className="h-1.5 w-24 bg-gold-500 mx-auto rounded-full"></div>
                    <p className="mt-8 text-gray-300 max-w-2xl mx-auto font-medium text-sm sm:text-base leading-relaxed">
                        Experience the difference with Malaysia's most trusted chauffeur service.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 lg:p-10 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 flex flex-col"
                            >
                                {/* Icon */}
                                <div className="mb-8 inline-flex">
                                    <div className="bg-gold-500 text-brand-900 p-5 rounded-2xl shadow-xl group-hover:scale-110 transition-transform duration-500">
                                        <Icon className="w-8 h-8" />
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-gold-400 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400 leading-relaxed font-medium text-sm">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
