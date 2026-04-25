import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

/**
 * 404 Not Found Page Component
 * Provides user-friendly error page with navigation options
 */
const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-gray-200">404</div>
          <div className="mt-4 text-gray-600">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Page Not Found
            </h1>
            <p className="text-gray-600">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            Go to Homepage
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-sm font-medium text-gray-700 mb-3">
            You might be looking for:
          </h2>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => navigate('/users')}
              className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              👥 User Management
            </button>
            <button
              onClick={() => navigate('/roles')}
              className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              🛡️ Role Management
            </button>
            <button
              onClick={() => navigate('/masters')}
              className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              📁 Master Data
            </button>
          </div>
        </div>

        {/* Search Suggestion */}
        <div className="mt-6 text-sm text-gray-500">
          <p>
            If you believe this is an error, please contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
