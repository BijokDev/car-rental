import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../src/lib/firebase';
import { Article } from '../types';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';

const ArticlesSection: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchArticles = async () => {
      try {
        const q = query(
          collection(db, 'car-rental-articles'),
          where('published', '==', true)
        );
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));

        // Sort descending by creation date
        items.sort((a, b) => {
          const timeA = a.createdAt?.toMillis?.() || 0;
          const timeB = b.createdAt?.toMillis?.() || 0;
          return timeB - timeA;
        });

        if (isMounted) {
          // Take the top 3 latest articles for the homepage
          setArticles(items.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching homepage articles:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchArticles();
    return () => {
      isMounted = false;
    };
  }, []);

  // If finished loading and no articles exist, do not display empty section
  if (!loading && articles.length === 0) {
    return null;
  }

  return (
    <section id="articles" className="py-20 lg:py-28 bg-gray-50 border-t border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-500/10 border border-gold-500/20 rounded-full text-brand-900 text-xs font-bold uppercase tracking-widest mb-3">
              <BookOpen className="w-3.5 h-3.5 text-gold-600" />
              <span>Travel Guides & Insights</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
              Latest <span className="text-gold-600">Articles</span> & Tips
            </h2>
            <p className="mt-3 text-gray-600 max-w-xl text-base sm:text-lg">
              Expert guides, route tips, and local insights for your private chauffeur journeys across Malaysia.
            </p>
          </div>

          <div className="mt-6 md:mt-0">
            <Link
              to="/articles"
              className="inline-flex items-center text-brand-900 hover:text-gold-600 font-bold text-sm tracking-wide group transition-colors"
            >
              <span>View All Articles</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-6 bg-gray-200 rounded w-5/6" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link
                key={article.id || article.slug}
                to={`/articles/${article.slug}`}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 transform hover:-translate-y-1.5"
              >
                {/* Thumbnail Image */}
                <div className="relative h-52 overflow-hidden bg-gray-100">
                  <img
                    src={article.image || '/car-rental-images/alpharp.webp'}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/car-rental-images/alpharp.webp';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-md text-[11px] font-bold text-gray-800 rounded-full shadow-sm">
                    Guide
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    {/* Meta info */}
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gold-600" />
                        <span>
                          {article.createdAt?.toDate?.()?.toLocaleDateString('en-MY', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          }) || 'Recently'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span>{article.author || 'TRAVTHRU'}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-gold-600 transition-colors line-clamp-2 leading-snug mb-2">
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4">
                      {article.excerpt}
                    </p>
                  </div>

                  {/* Read More Link */}
                  <div className="pt-2 border-t border-gray-100 flex items-center text-sm font-semibold text-gold-600 group-hover:text-gold-700">
                    <span>Read Full Article</span>
                    <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Mobile View All button */}
        <div className="mt-8 text-center md:hidden">
          <Link
            to="/articles"
            className="inline-flex items-center justify-center w-full px-6 py-3.5 bg-white border border-gray-200 rounded-xl font-bold text-sm text-gray-800 shadow-sm hover:bg-gray-50 active:scale-98 transition-all"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default ArticlesSection;
