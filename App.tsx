import React, { useCallback } from 'react';
import Navbar from './components/Navbar';
import RebrandBanner from './components/RebrandBanner';
import Hero from './components/Hero';
import BookingForm from './components/BookingForm';
import HowItWorks from './components/HowItWorks';
import Fleet from './components/Fleet';
import Services from './components/Services';
import WhyChooseUs from './components/WhyChooseUs';
import CTABanner from './components/CTABanner';
import Pricing from './components/Pricing';
import PopularRoutes from './components/PopularRoutes';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import { BookingDetails } from './types';

const App: React.FC = () => {

  const handleBookingSearch = useCallback((details: BookingDetails) => {
    // Construct WhatsApp message for Booking/Quote
    let message = `Hi TravThru, I would like a quote for a transfer:\n\n` +
      `*Trip Type:* ${details.tripType === 'return' ? 'Return Trip' : 'One Way'}\n` +
      `*From:* ${details.pickupLocation}\n` +
      `*To:* ${details.dropoffLocation}\n` +
      `*Date:* ${details.pickupDate}\n` +
      `*Time:* ${details.pickupTime}\n`;

    // Append Return details if applicable
    if (details.tripType === 'return') {
      message += `*Return Date:* ${details.returnDate || 'Not specified'}\n` +
        `*Return Time:* ${details.returnTime || 'Not specified'}\n`;
    }

    // Open WhatsApp Web/App with proper encoding
    window.open(`https://wa.me/+60107198186?text=${encodeURIComponent(message)}`, '_blank');
  }, []);

  const handleCarSelect = useCallback((carName: string) => {
    const message = `Hi TravThru, I am interested in booking the *${carName}*. Is it available for my trip?`;
    window.open(`https://wa.me/+60107198186?text=${encodeURIComponent(message)}`, '_blank');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <RebrandBanner />
      <Navbar />
      <Hero />
      <BookingForm onSearch={handleBookingSearch} />
      <HowItWorks />
      <Services />
      <WhyChooseUs />
      <Features />
      <Fleet onSelectCar={handleCarSelect} />
      <CTABanner />
      <Pricing />
      <PopularRoutes />
      <Testimonials />
      <FAQ />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default App;