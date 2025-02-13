import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check authentication status
  const checkAuth = () => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const sessionExpiry = localStorage.getItem('sessionExpiry');
    
    if (!isAdmin || !sessionExpiry) {
      return false;
    }
    
    // Check if session has expired
    if (new Date().getTime() > parseInt(sessionExpiry)) {
      localStorage.clear();
      return false;
    }
    
    return true;
  };

  const isAuthenticated = checkAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      // Clear any stale data
      localStorage.clear();
      // Redirect to login with return path
      navigate('/login', { 
        state: { from: location },
        replace: true 
      });
    }
  }, [isAuthenticated, navigate, location]);

  // Don't render anything while checking authentication
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}