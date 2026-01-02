import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

const CTABanner: React.FC = () => {
    return (
        <section className="py-20 lg:py-32 bg-brand-900 relative overflow-hidden">
            {/* Background Image Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=2000"
                    alt="Luxury background"
                    className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/90 to-brand-900/80"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-8 animate-fade-in-up">
                        <span className="text-gold-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            Available 24/7 For You
                        </span>
                    </div>

                    {/* Heading */}
                    <h2 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-bold text-white mb-8 italic leading-tight">
                        Ready for your <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">Premium Ride?</span>
                    </h2>
                    <p className="text-gray-300 text-base sm:text-lg mb-12 font-medium leading-relaxed max-w-2xl mx-auto">
                        Get instant quotes and professional service. Whether it's for business, airport transfers, or leisure, drive in style with AJ Taxi KL.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                        <a
                            href="https://wa.me/60107198186"
                            className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-5 bg-green-500 hover:bg-green-600 text-white font-black rounded-2xl shadow-xl hover:shadow-green-500/30 transition-all transform hover:-translate-y-1 text-xs uppercase tracking-[0.2em]"
                        >
                            <MessageCircle className="w-5 h-5 mr-3" />
                            WhatsApp Book
                        </a>
                        <a
                            href="tel:+60107198186"
                            className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-5 bg-white text-brand-900 hover:bg-gray-100 font-black rounded-2xl shadow-xl transition-all transform hover:-translate-y-1 text-xs uppercase tracking-[0.2em]"
                        >
                            <Phone className="w-5 h-5 mr-3" />
                            Call Now
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTABanner;
