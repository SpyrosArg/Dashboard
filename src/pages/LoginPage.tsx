import React, { useState, useEffect } from 'react';
import { Shield, AlertCircle, Lock, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function LoginPage() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state, default to /admin
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

  // Check if already logged in and session is valid
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const sessionExpiry = localStorage.getItem('sessionExpiry');
    
    if (isAdmin && sessionExpiry) {
      // Check if session is still valid
      if (new Date().getTime() <= parseInt(sessionExpiry)) {
        navigate(from, { replace: true });
      } else {
        // Clear expired session
        localStorage.clear();
      }
    }
  }, [navigate, from]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username');
    const password = formData.get('password');

    if (username === 'admin' && password === 'admin') {
      // Set admin status and session expiry (24 hours)
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('sessionExpiry', (new Date().getTime() + 24 * 60 * 60 * 1000).toString());
      navigate(from, { replace: true });
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-red-600 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-red-500 to-red-700 p-4 rounded-full">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-white/70">Secure Access Management</p>
        </div>

        <div className="glass-card rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-md p-4 flex items-center text-red-200">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-white mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-white/50" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 text-white rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-white/50"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/50" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 text-white rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-white/50"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}