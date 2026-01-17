import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Article } from '../../types';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
});

// Configure DOMPurify
const sanitizeOptions = {
  ADD_TAGS: ['img', 'iframe', 'pre', 'code', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'strong', 'em', 'a', 'p', 'br', 'div', 'hr'],
  ADD_ATTR: ['src', 'alt', 'title', 'class', 'width', 'height', 'target', 'href', 'rel', 'allow', 'allowfullscreen', 'frameborder', 'scrolling', 'data-code']
};

const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Parse markdown content
  const renderedContent = useMemo(() => {
    if (!article?.content) return '';
    
    try {
      // Parse markdown to HTML
      let html = marked.parse(article.content) as string;
      
      // Add copy button to code blocks
      html = html.replace(
        /<pre><code(.*?)>([\s\S]*?)<\/code><\/pre>/g,
        (match, attrs, code) => {
          const encodedCode = encodeURIComponent(code.replace(/<[^>]*>/g, ''));
          return `
            <div style="position: relative; margin: 1.5rem 0;">
              <button 
                class="copy-code-btn" 
                data-code="${encodedCode}"
                style="position: absolute; right: 12px; top: 12px; background: rgba(255,255,255,0.15); color: #fff; border: 1px solid rgba(255,255,255,0.3); padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; opacity: 0.8; transition: all 0.2s; font-weight: 500;"
                onmouseover="this.style.opacity='1'; this.style.background='rgba(255,255,255,0.25)'" 
                onmouseout="this.style.opacity='0.8'; this.style.background='rgba(255,255,255,0.15)'"
              >
                Copy
              </button>
              <pre style="background: #1e293b; color: #e2e8f0; padding: 1.5rem; border-radius: 12px; overflow-x: auto; margin: 0; font-size: 14px; line-height: 1.6;"><code${attrs}>${code}</code></pre>
            </div>
          `;
        }
      );

      return DOMPurify.sanitize(html, sanitizeOptions);
    } catch (error) {
      console.error('Markdown parsing error:', error);
      return '<p>Error rendering content</p>';
    }
  }, [article?.content]);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;
      
      try {
        // Fetch article by slug
        const q = query(
          collection(db, 'car-rental-articles'),
          where('slug', '==', slug),
          where('published', '==', true),
          limit(1)
        );
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
          setNotFound(true);
        } else {
          const articleData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Article;
          setArticle(articleData);
          
          // Update page title for SEO
          document.title = `${articleData.title} | TRAVTHRU`;
          
          // Update meta description
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) {
            metaDesc.setAttribute('content', articleData.excerpt);
          }
          
          // Fetch related articles (excluding current)
          const relatedQ = query(
            collection(db, 'car-rental-articles'),
            where('published', '==', true),
            limit(3)
          );
          const relatedSnapshot = await getDocs(relatedQ);
          setRelatedArticles(
            relatedSnapshot.docs
              .map(d => ({ id: d.id, ...d.data() } as Article))
              .filter(a => a.slug !== slug)
              .slice(0, 2)
          );
        }
      } catch (error) {
        console.error('Error fetching article:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [slug]);

  // Copy code button event listener
  useEffect(() => {
    const handleCopy = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('copy-code-btn')) {
        e.preventDefault();
        e.stopPropagation();
        const code = decodeURIComponent(target.getAttribute('data-code') || '');
        if (code) {
          try {
            await navigator.clipboard.writeText(code);
            const originalText = target.innerText;
            target.innerText = 'Copied!';
            target.style.color = '#4ade80';
            setTimeout(() => {
              target.innerText = originalText;
              target.style.color = '#fff';
            }, 2000);
          } catch (err) {
            console.error('Failed to copy:', err);
          }
        }
      }
    };

    document.addEventListener('click', handleCopy);
    return () => document.removeEventListener('click', handleCopy);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: article?.title,
        text: article?.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Custom styles for article content
  const articleStyles = `
    .article-content h1 { font-size: 2.25rem; font-weight: 700; margin-bottom: 1rem; margin-top: 2rem; color: #111827; line-height: 1.2; font-family: serif; }
    .article-content h2 { font-size: 1.75rem; font-weight: 600; margin-bottom: 1rem; margin-top: 2rem; color: #1f2937; border-bottom: 3px solid #d4af37; padding-bottom: 0.5rem; font-family: serif; }
    .article-content h3 { font-size: 1.375rem; font-weight: 600; margin-bottom: 0.75rem; margin-top: 1.5rem; color: #374151; font-family: serif; }
    .article-content h4 { font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem; color: #4b5563; }
    .article-content p { margin-bottom: 1.25rem; line-height: 1.8; color: #374151; font-size: 1.125rem; }
    .article-content ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1.25rem; }
    .article-content ol { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1.25rem; }
    .article-content li { margin-bottom: 0.5rem; line-height: 1.7; color: #374151; font-size: 1.125rem; }
    .article-content strong { font-weight: 700; color: #111827; }
    .article-content em { font-style: italic; }
    .article-content a { color: #d4af37; text-decoration: underline; transition: color 0.2s; }
    .article-content a:hover { color: #b8972e; }
    .article-content blockquote { border-left: 4px solid #d4af37; padding-left: 1.5rem; margin: 1.5rem 0; background: linear-gradient(to right, #fefce8, transparent); padding: 1.25rem 1.5rem; border-radius: 0 12px 12px 0; color: #78716c; font-style: italic; font-size: 1.125rem; }
    .article-content code { background: #f3f4f6; padding: 0.2rem 0.5rem; border-radius: 4px; font-family: 'Consolas', 'Monaco', monospace; font-size: 0.9rem; color: #dc2626; }
    .article-content pre code { background: transparent; padding: 0; color: inherit; font-size: 0.875rem; }
    .article-content img { max-width: 100%; height: auto; border-radius: 16px; margin: 1.5rem 0; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15); }
    .article-content table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .article-content th { background: linear-gradient(to right, #1f2937, #374151); color: white; padding: 1rem; text-align: left; font-weight: 600; }
    .article-content td { border: 1px solid #e5e7eb; padding: 0.875rem 1rem; }
    .article-content tr:nth-child(even) { background: #f9fafb; }
    .article-content tr:hover { background: #fefce8; }
    .article-content hr { border: none; border-top: 2px solid #e5e7eb; margin: 2.5rem 0; }
  `;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 pb-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-900 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading article...</p>
        </div>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 pb-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-500 mb-8">The article you're looking for doesn't exist or has been removed.</p>
          <Link to="/articles" className="text-gold-600 hover:text-gold-700 font-semibold">
            ← Back to Articles
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{articleStyles}</style>
      <Navbar />
      
      {/* Hero Image */}
      <section className="pt-24">
        <div className="h-64 md:h-96 w-full overflow-hidden">
          <img
            src={article.image || '/placeholder-article.jpg'}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Article Content */}
      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link 
            to="/articles" 
            className="inline-flex items-center text-gray-500 hover:text-brand-900 mb-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Articles
          </Link>
          
          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 leading-tight mb-6">
              {article.title}
            </h1>
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {article.createdAt?.toDate?.()?.toLocaleDateString('en-MY', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) || 'Recently Published'}
                </span>
              </div>
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 text-gold-600 hover:text-gold-700"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
            
            {/* Excerpt */}
            <p className="text-xl text-gray-600 leading-relaxed border-l-4 border-gold-500 pl-4">
              {article.excerpt}
            </p>
          </header>
          
          {/* Article Body - NOW WITH MARKDOWN RENDERING */}
          <div 
            className="article-content"
            dangerouslySetInnerHTML={{ __html: renderedContent }}
          />
          
          {/* CTA Section */}
          <div className="mt-12 p-8 bg-gradient-to-r from-brand-900 to-brand-800 rounded-2xl text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Need a <span className="text-gold-500">Ride</span>?
            </h3>
            <p className="text-gray-300 mb-6">
              Book your premium transfer service with TRAVTHRU today!
            </p>
            <a 
              href="https://wa.me/60107198186" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-gold-500 text-brand-900 font-bold rounded-lg hover:bg-gold-400 transition-colors"
            >
              Book on WhatsApp
            </a>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8">
              Related Articles
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  to={`/articles/${related.slug}`}
                  className="group flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <img
                    src={related.image || '/placeholder-article.jpg'}
                    alt={related.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-gold-600 transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                      {related.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default ArticlePage;
