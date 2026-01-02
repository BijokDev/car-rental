import React from 'react';
import { Clock, Shield, DollarSign, Sparkles, MapPin, CreditCard } from 'lucide-react';

const WhyChooseUs: React.FC = () => {
    const features = [
        {
            icon: Clock,
            title: 'Always Available',
            description: '24/7 service for early flights & late arrivals. We are always ready when you are.'
        },
        {
            icon: Shield,
            title: 'Fully Insured',
            description: 'Professional licensed drivers & comprehensive coverage for your peace of mind.'
        },
        {
            icon: DollarSign,
            title: 'Fixed Rates',
            description: 'Transparent all-inclusive pricing. No hidden surges or unexpected fees.'
        },
        {
            icon: Sparkles,
            title: 'Immaculate Fleet',
            description: 'Sanitized, smoke-free, and luxury vehicles maintained to the highest standards.'
        },
        {
            icon: MapPin,
            title: 'Real-Time Tracking',
            description: 'Share your live ride status with loved ones for added safety and coordination.'
        },
        {
            icon: CreditCard,
            title: 'Easy Payments',
            description: 'Flexible payment options including cash, credit card, or instant online transfer.'
        }
    ];

    return (
        <section className="py-20 lg:py-32 bg-brand-900 relative overflow-hidden">
            {/* Background Image Overlay */}
            <div className="absolute inset-0 z-0 opacity-10">
                <img
                    src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=2000"
                    alt="Luxury background"
                    className="w-full h-full object-cover"
                />
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
                        Experience the difference with Malaysia's most trusted premium chauffeur service.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 lg:p-10 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 flex flex-col"
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
