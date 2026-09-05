import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './src/context/AuthContext';
import { HelmetProvider } from 'react-helmet-async';
import Home from './src/pages/Home';

// Code-split everything that isn't the public homepage: the admin dashboard
// (Firestore CRUD editors) and the markdown-heavy article pages don't need
// to ship in the bundle every anonymous visitor downloads.
const AdminLogin = lazy(() => import('./src/pages/admin/AdminLogin'));
const Dashboard = lazy(() => import('./src/pages/admin/Dashboard'));
const ArticleList = lazy(() => import('./src/pages/ArticleList'));
const ArticlePage = lazy(() => import('./src/pages/ArticlePage'));

const RouteFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-900"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/articles" element={<ArticleList />} />
            <Route path="/articles/:slug" element={<ArticlePage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
    </HelmetProvider>
  );
};

export default App;