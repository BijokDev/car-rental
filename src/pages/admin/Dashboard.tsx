import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Testimonial, Article, AppUser } from '../../../types';
import ArticleEditor from './ArticleEditor';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Users, 
  LogOut, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Shield, 
  ShieldAlert,
  Search,
  ChevronRight,
  Star
} from 'lucide-react';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAdmin, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<'testimonials' | 'articles' | 'users'>('testimonials');
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [articles, setArticles] = useState<Article[]>([]);
    const [users, setUsers] = useState<AppUser[]>([]);
    const [showEditor, setShowEditor] = useState(false);
    const [editingArticle, setEditingArticle] = useState<Article | null>(null);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    useEffect(() => {
        if (!isAdmin) return;

        // Subscribe to Testimonials (Sort client-side to include console entries)
        const qTestimonials = query(collection(db, 'car-rental-testimonials'));
        const unsubTestimonials = onSnapshot(qTestimonials, (snapshot) => {
            const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial));
            data.sort((a, b) => {
                const timeA = a.createdAt?.toMillis?.() || 0;
                const timeB = b.createdAt?.toMillis?.() || 0;
                return timeB - timeA;
            });
            setTestimonials(data);
        });

        // Subscribe to Articles (Sort client-side)
        const qArticles = query(collection(db, 'car-rental-articles'));
        const unsubArticles = onSnapshot(qArticles, (snapshot) => {
            const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Article));
            data.sort((a, b) => {
                const timeA = a.createdAt?.toMillis?.() || 0;
                const timeB = b.createdAt?.toMillis?.() || 0;
                return timeB - timeA;
            });
            setArticles(data);
        });

        // Subscribe to Users (Sort client-side)
        const qUsers = query(collection(db, 'car-rental-users'));
        const unsubUsers = onSnapshot(qUsers, (snapshot) => {
            const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as AppUser));
            data.sort((a, b) => {
                const timeA = a.lastSignIn?.toMillis?.() || 0;
                const timeB = b.lastSignIn?.toMillis?.() || 0;
                return timeB - timeA;
            });
            setUsers(data);
        });

        return () => {
            unsubTestimonials();
            unsubArticles();
            unsubUsers();
        };
    }, [isAdmin]);

    const handleApproveTestimonial = async (id: string, currentStatus: boolean) => {
        await updateDoc(doc(db, 'car-rental-testimonials', id), { approved: !currentStatus });
    };

    const handleDeleteTestimonial = async (id: string) => {
        if (confirm('Are you sure you want to delete this testimonial?')) {
            await deleteDoc(doc(db, 'car-rental-testimonials', id));
        }
    };

    const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
        const action = currentStatus ? 'remove admin rights from' : 'grant admin rights to';
        if (confirm(`Are you sure you want to ${action} this user?`)) {
            await updateDoc(doc(db, 'car-rental-users', userId), { isAdmin: !currentStatus });
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (confirm('Are you sure you want to delete this user? This cannot be undone.')) {
            await deleteDoc(doc(db, 'car-rental-users', userId));
        }
    };

    const handleTogglePublish = async (articleId: string, currentStatus: boolean) => {
        await updateDoc(doc(db, 'car-rental-articles', articleId), { published: !currentStatus });
    };

    const handleDeleteArticle = async (articleId: string) => {
        if (confirm('Are you sure you want to delete this article?')) {
            await deleteDoc(doc(db, 'car-rental-articles', articleId));
        }
    };

    if (!user || !isAdmin) {
        return <div className="p-10 text-center text-gray-500">Access Denied</div>;
    }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-10">
      {/* Mobile Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-30 lg:hidden">
        <div className="px-4 h-16 flex items-center justify-between">
           <div className="flex items-center gap-2">
             <LayoutDashboard className="w-5 h-5 text-brand-900" />
             <span className="font-bold text-lg text-brand-900">Dashboard</span>
           </div>
           <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-600 transition-colors">
             <LogOut className="w-5 h-5" />
           </button>
        </div>
      </nav>

      {/* Desktop Header */}
      <nav className="hidden lg:block bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
                <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-6 h-6 text-brand-900" />
                    <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500 font-medium">{user.email}</span>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        
        {/* Desktop Tabs */}
        <div className="hidden lg:block border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
                <button
                    onClick={() => setActiveTab('testimonials')}
                    className={`${activeTab === 'testimonials' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                >
                    <MessageSquare className="w-4 h-4" />
                    Testimonials
                </button>
                <button
                    onClick={() => setActiveTab('articles')}
                    className={`${activeTab === 'articles' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                >
                    <FileText className="w-4 h-4" />
                    Articles (SEO)
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`${activeTab === 'users' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                >
                    <Users className="w-4 h-4" />
                    Users <span className="ml-1 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">{users.length}</span>
                </button>
            </nav>
        </div>

        {/* Tab Content */}
        
        {/* Testimonials Tab */}
        {activeTab === 'testimonials' && (
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-4 lg:hidden">
                    <h2 className="text-xl font-bold text-gray-800">Testimonials</h2>
                </div>
                
                <div className="grid gap-4 md:gap-6">
                    {testimonials.map((t) => (
                        <div key={t.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all hover:shadow-md">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 font-bold text-lg">
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{t.name}</h3>
                                        <p className="text-xs text-gray-500">{t.role}</p>
                                    </div>
                                </div>
                                <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${t.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {t.approved ? 'Approved' : 'Pending'}
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-1 mb-3">
                                {[...Array(t.rating || 5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                                ))}
                            </div>
                            
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">{t.text}</p>
                            
                            <div className="flex items-center gap-2 pt-4 border-t border-gray-50 mt-2">
                                <button 
                                    onClick={() => handleApproveTestimonial(t.id!, t.approved)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-colors ${t.approved ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                                >
                                    {t.approved ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                                    {t.approved ? 'Unapprove' : 'Approve'}
                                </button>
                                <button 
                                    onClick={() => handleDeleteTestimonial(t.id!)}
                                    className="px-4 py-2.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {testimonials.length === 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
                             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageSquare className="w-8 h-8 text-gray-300" />
                             </div>
                             <p className="text-gray-500 font-medium">No testimonials yet</p>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* Articles Tab */}
        {activeTab === 'articles' && (
            <div className="space-y-4">
                {!showEditor ? (
                    <>
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xl font-bold text-gray-800 lg:hidden">Articles</h2>
                            <button 
                                onClick={() => setShowEditor(true)}
                                className="bg-brand-600 text-white px-4 py-2.5 rounded-lg shadow-sm hover:bg-brand-700 flex items-center gap-2 font-medium text-sm transition-all active:scale-95"
                            >
                                <Plus className="w-4 h-4" />
                                Write Article
                            </button>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {articles.map((article) => (
                                <div key={article.id} className="bg-white shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden border border-gray-100 flex flex-col h-full">
                                     {article.image && (
                                        <div className="h-48 w-full bg-cover bg-center relative" style={{ backgroundImage: `url(${article.image.startsWith('http') ? article.image : 'https://storage.bijokdev.com' + article.image})` }}>
                                             <div className="absolute top-3 right-3">
                                                 <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm border border-white/20 backdrop-blur-md ${article.published ? 'bg-green-500/90 text-white' : 'bg-gray-500/90 text-white'}`}>
                                                    {article.published ? 'Published' : 'Draft'}
                                                 </span>
                                             </div>
                                        </div>
                                     )}
                                     <div className="p-5 flex-1 flex flex-col">
                                        <h3 className="font-bold text-lg mb-2 text-gray-900 leading-tight">{article.title}</h3>
                                        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{article.excerpt}</p>
                                        
                                        <div className="flex items-center text-xs text-gray-400 mb-4 font-medium">
                                            <Users className="w-3 h-3 mr-1" />
                                            {article.author}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-50">
                                            <button 
                                                onClick={() => { setEditingArticle(article); setShowEditor(true); }}
                                                className="flex items-center justify-center py-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleTogglePublish(article.id!, article.published)}
                                                className={`flex items-center justify-center py-2 rounded-lg text-sm font-medium transition-colors ${article.published ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                                            >
                                                {article.published ? 'Hide' : 'Post'}
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteArticle(article.id!)}
                                                className="flex items-center justify-center py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                     </div>
                                </div>
                            ))}
                            {articles.length === 0 && (
                                <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-gray-300">
                                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 font-medium">No articles created yet</p>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <ArticleEditor 
                        onClose={() => { setShowEditor(false); setEditingArticle(null); }}
                        editArticle={editingArticle}
                    />
                )}
            </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
            <div className="space-y-4">
                 <div className="flex items-center justify-between mb-4 lg:hidden">
                    <h2 className="text-xl font-bold text-gray-800">Users ({users.length})</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {users.map((u) => (
                        <div key={u.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between h-full">
                            <div className="flex items-start gap-4 mb-4">
                                {u.photoURL ? (
                                    <img src={u.photoURL} alt={u.displayName} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold border-2 border-white shadow-sm">
                                        {u.displayName?.charAt(0) || u.email?.charAt(0) || '?'}
                                    </div>
                                )}
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-bold text-gray-900 leading-none">{u.displayName || 'No Name'}</h3>
                                        {u.isAdmin ? (
                                            <span className="bg-brand-900 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                                <Shield className="w-3 h-3" /> Admin
                                            </span>
                                        ) : (
                                            <span className="bg-gray-100 text-gray-600 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">User</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1 break-all">{u.email}</p>
                                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                        <LayoutDashboard className="w-3 h-3" />
                                        Last seen: {u.lastSignIn?.toDate?.()?.toLocaleDateString() || 'N/A'}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex gap-3 pt-4 border-t border-gray-50 mt-auto">
                                <button 
                                    onClick={() => handleToggleAdmin(u.id!, u.isAdmin)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-colors ${u.isAdmin ? 'bg-orange-50 text-orange-700 hover:bg-orange-100' : 'bg-brand-50 text-brand-700 hover:bg-brand-100'}`}
                                >
                                    {u.isAdmin ? <ShieldAlert className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                                    {u.isAdmin ? 'Demote' : 'Promote'}
                                </button>
                                <button 
                                    onClick={() => handleDeleteUser(u.id!)}
                                    className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {users.length === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-400">
                             <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                             No users found
                        </div>
                    )}
                </div>
            </div>
        )}

      </main>
      
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 lg:hidden pb-safe">
        <div className="grid grid-cols-3 h-16">
            <button
                onClick={() => setActiveTab('testimonials')}
                className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${activeTab === 'testimonials' ? 'text-brand-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
                <div className={`p-1.5 rounded-full transition-all ${activeTab === 'testimonials' ? 'bg-brand-50 translate-y-[-2px]' : ''}`}>
                    <MessageSquare className={`w-6 h-6 ${activeTab === 'testimonials' ? 'fill-current' : ''}`} />
                </div>
                <span className="text-[10px] font-bold tracking-wide">Testimonials</span>
            </button>
            <button
                onClick={() => setActiveTab('articles')}
                className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${activeTab === 'articles' ? 'text-brand-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
                <div className={`p-1.5 rounded-full transition-all ${activeTab === 'articles' ? 'bg-brand-50 translate-y-[-2px]' : ''}`}>
                    <FileText className={`w-6 h-6 ${activeTab === 'articles' ? 'fill-current' : ''}`} />
                </div>
                <span className="text-[10px] font-bold tracking-wide">SEO Articles</span>
            </button>
            <button
                onClick={() => setActiveTab('users')}
                className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${activeTab === 'users' ? 'text-brand-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
                <div className={`p-1.5 rounded-full transition-all ${activeTab === 'users' ? 'bg-brand-50 translate-y-[-2px]' : ''}`}>
                    <Users className={`w-6 h-6 ${activeTab === 'users' ? 'fill-current' : ''}`} />
                </div>
                <span className="text-[10px] font-bold tracking-wide">Users</span>
            </button>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
