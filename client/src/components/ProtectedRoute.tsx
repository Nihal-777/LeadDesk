import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authState } = useAuth();
  const location = useLocation();

  if (authState.loading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="relative flex h-16 w-16 items-center justify-center">
          {/* Inner pulse */}
          <div className="absolute h-10 w-10 animate-ping rounded-full bg-brand-550 opacity-40"></div>
          {/* Outer rotating ring */}
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-transparent border-t-brand-550 border-r-brand-550"></div>
        </div>
        <p className="mt-4 text-sm font-medium tracking-wide text-slate-500 dark:text-slate-400">
          Verifying credentials...
        </p>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    // Redirect to login page but save the current location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
