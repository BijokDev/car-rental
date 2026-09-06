import React, { useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../../components/Navbar';
import RebrandBanner from '../../components/RebrandBanner';
import Hero from '../../components/Hero';
import BookingForm from '../../components/BookingForm';
import Fleet from '../../components/Fleet';
import Gallery from '../../components/Gallery';
import Services from '../../components/Services';
import WhyChooseUs from '../../components/WhyChooseUs';
import CTABanner from '../../components/CTABanner';
import Pricing from '../../components/Pricing';
import PopularRoutes from '../../components/PopularRoutes';
import Features from '../../components/Features';
import Testimonials from '../../components/Testimonials';
import FAQ from '../../components/FAQ';
import ArticlesSection from '../../components/ArticlesSection';
import Footer from '../../components/Footer';
import WhatsAppButton from '../../components/WhatsAppButton';
import { BookingDetails } from '../../types';
import { FAQS } from '../data/faqData';

const SITE_URL = 'https://www.travthru.com';

const Home: React.FC = () => {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const handleBookingSearch = useCallback((details: BookingDetails) => {
    // Construct WhatsApp message for Booking/Quote
    let message = `Hi TravThru, I would like a quote for a ${details.serviceType === 'hourly' ? 'Hourly Chauffeur' : 'Transfer'}:\n\n` +
      `*Service:* ${details.serviceType === 'hourly' ? 'By the Hour' : 'Transfer'}\n` +
      `*From:* ${details.pickupLocation}\n`;
      
    if (details.serviceType === 'transfer') {
      message += `*To:* ${details.dropoffLocation}\n`;
    }
    
    message += `*Date:* ${details.pickupDate}\n` +
      `*Time:* ${details.pickupTime}\n`;
      
    if (details.serviceType === 'hourly') {
      message += `*Duration:* ${details.duration} Hours\n`;
    }
    
    message += `*Passengers:* ${details.passengers} Pax\n`;

    // Open WhatsApp Web/App with proper encoding
    window.open(`https://wa.me/+60107198186?text=${encodeURIComponent(message)}`, '_blank');
  }, []);

  const handleCarSelect = useCallback((carName: string) => {
    // Fire Google Ads Conversion Tracking Event for Contact
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {'send_to': 'AW-17916725081/hG0jCLyN8fQbENmOrt9C'});
    }

    const message = `Hi TravThru, I am interested in booking the *${carName}*. Is it available for my trip?`;
    window.open(`https://wa.me/+60107198186?text=${encodeURIComponent(message)}`, '_blank');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>TravThru | Book Reliable Private Chauffeur & Transfer Service</title>
        <meta name="description" content="Book a reliable private chauffeur and KLIA airport transfer service with TravThru. Premium 6 to 7 seats vehicles for comfortable rides. Get a quote now." />
        <link rel="canonical" href={SITE_URL + '/'} />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <RebrandBanner />
      <Navbar />
      <Hero>
        <BookingForm onSearch={handleBookingSearch} />
      </Hero>
      <Gallery limit={8} />
      <Services />
      <WhyChooseUs />
      <Features />
      <Fleet onSelectCar={handleCarSelect} />
      <CTABanner />
      <Pricing />
      <PopularRoutes />
      <Testimonials />
      <ArticlesSection />
      <FAQ />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Home;
