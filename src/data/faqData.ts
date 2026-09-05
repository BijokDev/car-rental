export interface FaqItem {
  question: string;
  answer: string;
}

// Single source of truth for FAQ content - used both by the rendered
// FAQ accordion (components/FAQ.tsx) and the FAQPage JSON-LD structured
// data (src/pages/Home.tsx), so the two can never drift out of sync.
export const FAQS: FaqItem[] = [
  {
    question: 'How do I book a ride with TravThru?',
    answer: 'You can book instantly via WhatsApp by clicking the "Book Now" button, or fill out our booking form on the website. We\'ll confirm your booking within minutes with driver details.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept cash, credit/debit cards, and online bank transfers. Payment can be made directly to the driver or in advance via online transfer.'
  },
  {
    question: 'Can I cancel or modify my booking?',
    answer: 'Yes! You can cancel or modify your booking up to 2 hours before the scheduled pickup time without any charges. Contact us via WhatsApp for changes.'
  },
  {
    question: 'Do you provide child seats?',
    answer: 'Yes, we provide complimentary child seats upon request. Please inform us when booking so we can arrange the appropriate seat for your child\'s age and size.'
  },
  {
    question: 'Are your drivers licensed and insured?',
    answer: 'Absolutely! All our drivers are professionally licensed, background-checked, and our vehicles are fully insured for your safety and peace of mind.'
  },
  {
    question: 'Do you offer airport pickup services?',
    answer: 'Yes! We specialize in KLIA and KLIA2 airport transfers. Our drivers monitor flight times and will be waiting for you at the arrival hall with a name board.'
  },
  {
    question: 'What if my flight is delayed?',
    answer: 'No worries! We track all flights in real-time. If your flight is delayed, your driver will adjust the pickup time automatically at no extra charge.'
  },
  {
    question: 'Can I book for multiple days or long-distance trips?',
    answer: 'Yes! We offer daily rentals and long-distance packages to destinations like Genting, Cameron Highlands, Penang, and more. Contact us for special rates.'
  }
];
