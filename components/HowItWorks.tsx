import React from 'react';
import { Search, CheckCircle, Car } from 'lucide-react';

const HowItWorks: React.FC = () => {
    const steps = [
        {
            icon: Search,
            title: 'Book Online',
            description: 'Fill in your trip details and get instant quote via WhatsApp or our booking form.',
            step: '01'
        },
        {
            icon: CheckCircle,
            title: 'Get Confirmation',
            description: 'Receive booking confirmation with driver details and vehicle information.',
            step: '02'
        },
        {
            icon: Car,
            title: 'Enjoy Your Ride',
            description: 'Your professional chauffeur arrives on time. Sit back, relax, and enjoy the journey.',
            step: '03'
        }
    ];

    return (
        <section className="py-20 lg:py-32 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16 lg:mb-24">
                    <span className="text-brand-600 font-black tracking-[0.2em] uppercase text-xs mb-4 block">
                        Simple Process
                    </span>
                    <h2 className="text-4xl lg:text-6xl font-serif font-bold text-brand-900 mb-6 italic">
                        How It Works
                    </h2>
                    <div className="h-1.5 w-24 bg-gold-500 mx-auto rounded-full"></div>
                    <p className="mt-8 text-gray-500 max-w-2xl mx-auto font-medium text-sm sm:text-base leading-relaxed">
                        Book your premium chauffeur service in just 3 easy steps. Fast, simple, and hassle-free.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={index}
                                className="relative group"
                            >
                                {/* Connector Line (hidden on mobile) */}
                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-16 left-[60%] w-full h-0.5 bg-gray-200 z-0"></div>
                                )}

                                {/* Card */}
                                <div className="relative bg-white rounded-3xl p-8 lg:p-12 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:-translate-y-2 z-10 h-full flex flex-col items-center text-center">

                                    {/* Step Badge */}
                                    <div className="absolute top-6 right-6 text-[10px] font-black text-gray-200 uppercase tracking-widest group-hover:text-gold-500 transition-colors border border-gray-100 px-3 py-1 rounded-full">
                                        Step {step.step}
                                    </div>

                                    {/* Icon */}
                                    <div className="relative mb-8 inline-flex">
                                        <div className="bg-brand-900 text-white p-5 rounded-2xl shadow-xl group-hover:scale-110 transition-transform duration-500">
                                            <Icon className="w-8 h-8" />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-2xl font-bold text-brand-900 mb-4 group-hover:text-gold-600 transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-500 leading-relaxed font-medium text-sm">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
