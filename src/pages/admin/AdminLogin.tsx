import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
    const { user, isAdmin, signInWithGoogle, logout } = useAuth();
    // Assuming we will add routing later, for now this component is stand-alone or rendered conditionally
    // But typically we use react-router. The user didn't explicitly ask for react-router setup but the implementation plan mentioned pages.
    // The current App.tsx is a single page scroll.
    // I might need to introduce React Router if I want separate pages properly.
    // For MVP within current structure, I might just overlay or use conditional rendering.
    // BUT, to do it "proper", I should probably add React Router.
    // Given the request "admin page", it implies a separate view.
    // I'll assume I can add react-router-dom.
    
    // Changing approach: I will build the component first.
    
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="flex justify-center mb-6">
          <img src="/logo-cropped.png" alt="TravThru Logo" className="h-16 object-contain" />
        </div>
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h1>
        
        {user ? (
          <div className="text-center">
            <p className="mb-4">Logged in as {user.email}</p>
            {!isAdmin && (
                <div className="mb-4 text-red-500 text-sm bg-red-50 p-2 rounded">
                    You are not authorized as an admin.
                </div>
            )}
            
            {isAdmin ? (
                <button 
                    onClick={() => window.location.href = '/admin/dashboard'} // creative Reload or router push if router exists
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-2"
                >
                    Go to Dashboard
                </button>
            ) : null}

            <button 
              onClick={logout}
              className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
            >
              Logout
            </button>
          </div>
        ) : (
          <button 
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50 transition-colors"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
