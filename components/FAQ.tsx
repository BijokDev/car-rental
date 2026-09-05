import React, { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { FAQS } from '../src/data/faqData';

const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = FAQS;

    return (
        <section className="py-20 lg:py-32 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16 lg:mb-24">
                    <span className="text-brand-600 font-black tracking-[0.2em] uppercase text-xs mb-4 block">
                        Got Questions?
                    </span>
                    <h2 className="text-4xl lg:text-6xl font-serif font-bold text-brand-900 mb-6 italic">
                        Frequently Asked Questions
                    </h2>
                    <div className="h-1.5 w-24 bg-gold-500 mx-auto rounded-full"></div>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors group"
                            >
                                <span className={`font-bold pr-8 text-base transition-colors ${openIndex === index ? 'text-brand-900' : 'text-gray-700 group-hover:text-brand-900'}`}>
                                    {faq.question}
                                </span>
                                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${openIndex === index ? 'bg-brand-900 text-white rotate-180' : 'bg-gray-100 text-gray-500 group-hover:bg-brand-900 group-hover:text-white'}`}>
                                    <ChevronDown className="w-4 h-4" />
                                </span>
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div className="px-8 pb-8 pt-0">
                                    <div className="w-full h-px bg-gray-100 mb-6"></div>
                                    <p className="text-gray-500 leading-relaxed font-medium text-sm">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Still Have Questions CTA */}
                <div className="mt-16 text-center bg-white rounded-3xl p-8 lg:p-12 border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <MessageCircle className="w-32 h-32 text-brand-900" />
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold text-brand-900 mb-4">
                            Still have questions?
                        </h3>
                        <p className="text-gray-500 mb-8 font-medium">
                            Our customer support team is available 24/7 to assist you.
                        </p>
                        <a
                            href="https://wa.me/60107198186"
                            className="inline-flex items-center px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-black rounded-xl shadow-xl hover:shadow-green-500/20 transition-all transform hover:-translate-y-1 text-xs uppercase tracking-[0.2em]"
                        >
                            Chat With Us
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
