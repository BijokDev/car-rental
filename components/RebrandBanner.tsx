import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const RebrandBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(() => {
        // Check if user has dismissed the banner before
        return !localStorage.getItem('rebrand-banner-dismissed');
    });

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('rebrand-banner-dismissed', 'true');
    };

    // Update body padding when banner visibility changes
    useEffect(() => {
        if (isVisible) {
            document.body.style.paddingTop = '52px';
        } else {
            document.body.style.paddingTop = '0px';
        }

        return () => {
            document.body.style.paddingTop = '0px';
        };
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div className="bg-gradient-to-r from-gold-500 to-gold-400 text-brand-900 py-3 px-4 fixed top-0 left-0 right-0 z-[60]">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">🚕</span>
                    <p className="text-sm md:text-base font-bold">
                        <span className="font-black">TravThru</span> (formerly AJ Taxi KL) - Same trusted service, new premium experience!
                    </p>
                </div>
                <button
                    onClick={handleDismiss}
                    className="p-1 hover:bg-brand-900/10 rounded-full transition-colors flex-shrink-0"
                    aria-label="Dismiss banner"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default RebrandBanner;
