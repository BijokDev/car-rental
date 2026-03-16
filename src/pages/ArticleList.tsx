import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Article } from '../../types';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Calendar, User, ArrowRight } from 'lucide-react';

const ArticleList: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Note: We fetch all and filter client-side to avoid Firestore composite index requirement
        const q = query(collection(db, 'car-rental-articles'));
        const snapshot = await getDocs(q);
        const allArticles = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Article));
        
        // Sort in memory to preserve articles created directly in Firebase Console without a createdAt field
        allArticles.sort((a, b) => {
          const timeA = a.createdAt?.toMillis?.() || 0;
          const timeB = b.createdAt?.toMillis?.() || 0;
          return timeB - timeA;
        });

        // Filter for published articles
        const publishedArticles = allArticles.filter(a => a.published === true);
        console.log('Fetched articles:', allArticles.length, 'Published:', publishedArticles.length);
        setArticles(publishedArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Travel <span className="text-gold-500">Blog</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Discover tips, guides, and insights about transportation services in Malaysia
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-900 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading articles...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No articles published yet.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  to={`/articles/${article.slug}`}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Article Image */}
                  <div className="h-48 overflow-hidden">
                    <img
                      src={article.image || '/placeholder-article.jpg'}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* Article Content */}
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-gold-600 transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    
                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {article.createdAt?.toDate?.()?.toLocaleDateString('en-MY', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) || 'Recently'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Read More */}
                    <div className="mt-4 flex items-center text-gold-600 font-semibold text-sm group-hover:text-gold-700">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ArticleList;
