import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './src/context/AuthContext';
import { HelmetProvider } from 'react-helmet-async';
import Home from './src/pages/Home';
import AdminLogin from './src/pages/admin/AdminLogin';
import Dashboard from './src/pages/admin/Dashboard';
import ArticleList from './src/pages/ArticleList';
import ArticlePage from './src/pages/ArticlePage';

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articles" element={<ArticleList />} />
          <Route path="/articles/:slug" element={<ArticlePage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
    </HelmetProvider>
  );
};

export default App;