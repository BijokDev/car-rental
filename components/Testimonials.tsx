import React, { useState, useEffect } from 'react';
import { Star, Quote, X, Send } from 'lucide-react';
import { TESTIMONIALS as HARDCODED_TESTIMONIALS } from '../constants';
import { collection, addDoc, serverTimestamp, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../src/lib/firebase';
import { Testimonial } from '../types';

const Testimonials: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    role: '',
    text: '',
    rating: 5,
  });
  const [testimonials, setTestimonials] = useState<any[]>(HARDCODED_TESTIMONIALS);

  useEffect(() => {
    const q = query(
      collection(db, 'car-rental-testimonials'),
      where('approved', '==', true)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbTestimonials = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      dbTestimonials.sort((a: any, b: any) => {
        const timeA = a.createdAt?.toMillis?.() || 0;
        const timeB = b.createdAt?.toMillis?.() || 0;
        return timeB - timeA;
      });

      if (dbTestimonials.length > 0) {
        setTestimonials([...dbTestimonials, ...HARDCODED_TESTIMONIALS]);
      } else {
        setTestimonials(HARDCODED_TESTIMONIALS);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.text) return;
    
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'car-rental-testimonials'), {
        ...form,
        approved: false,
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
      setForm({ name: '', role: '', text: '', rating: 5 });
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-brand-600 font-bold tracking-wider uppercase text-sm">Client Reviews</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-2 mb-4">What Our Clients Say</h2>
          <div className="h-1 w-20 bg-gold-500 mx-auto rounded-full"></div>
          
          {/* Leave Review Button */}
          <button
            onClick={() => setShowModal(true)}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-brand-900 text-white rounded-lg font-bold text-sm hover:bg-brand-800 transition-colors"
          >
            <Star className="w-4 h-4" />
            Leave a Review
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((review, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-md border-b-4 border-gold-500 relative">
              <Quote className="absolute top-6 right-6 w-8 h-8 text-brand-100" />
              
              <div className="flex text-gold-500 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>

              <p className="text-gray-600 italic mb-6 leading-relaxed">
                "{review.text}"
              </p>

              <div className="flex items-center">
                <div className="w-10 h-10 bg-brand-900 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {review.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <h4 className="font-bold text-gray-900 text-sm">{review.name}</h4>
                  <p className="text-xs text-brand-500 uppercase tracking-wide">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Leave a Review</h3>
              <button onClick={() => { setShowModal(false); setSubmitted(false); }} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Thank You!</h4>
                <p className="text-gray-500">Your review has been submitted and is pending approval.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role/Location</label>
                  <input
                    type="text"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    placeholder="Business Traveler"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setForm({ ...form, rating: star })}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${star <= form.rating ? 'text-gold-500 fill-current' : 'text-gray-300'}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Review *</label>
                  <textarea
                    required
                    rows={4}
                    value={form.text}
                    onChange={(e) => setForm({ ...form, text: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-none"
                    placeholder="Share your experience with us..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gold-500 text-brand-900 rounded-lg font-bold hover:bg-gold-400 transition-colors disabled:opacity-50"
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-900"></div>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Review
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Testimonials;