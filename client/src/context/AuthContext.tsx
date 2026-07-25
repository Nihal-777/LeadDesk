import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api.js';
import { AuthState } from '../types/index.js';

// Define the auth context structure with operations for signing in, signing out,
// and triggering manual session checks.
interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkSession: () => Promise<void>;
}

// Create the context container with undefined default value.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider Component
 * Manages the global authentication state of the admin panel.
 * It coordinates local storage tokens with API verification checks on application startup.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state. Read token from localStorage so the session can potentially
  // be restored synchronously if it is still valid.
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    admin: null,
    token: localStorage.getItem('lead_desk_admin_token'),
    loading: true, // Start in loading state until the backend verifies the token
  });

  /**
   * checkSession
   * Queries the backend auth check endpoint (/auth/me) with the stored token.
   * If valid, updates authState; if invalid or missing, resets state.
   */
  const checkSession = async () => {
    const token = localStorage.getItem('lead_desk_admin_token');
    
    // No token present locally, bypass API validation
    if (!token) {
      setAuthState({
        isAuthenticated: false,
        admin: null,
        token: null,
        loading: false,
      });
      return;
    }

    try {
      // Axios interceptor will automatically append the local token to this request
      const response = await api.get('/auth/me');
      if (response.data.success) {
        setAuthState({
          isAuthenticated: true,
          admin: response.data.admin,
          token,
          loading: false,
        });
      } else {
        throw new Error('Verification failed');
      }
    } catch (error) {
      // In case of network errors or token expiration, clean up local storage and reset state
      localStorage.removeItem('lead_desk_admin_token');
      setAuthState({
        isAuthenticated: false,
        admin: null,
        token: null,
        loading: false,
      });
    }
  };

  // Run the session verification hook exactly once on application mount
  useEffect(() => {
    checkSession();
  }, []);

  /**
   * login
   * Dispatches credentials to the server. If correct, saves the token
   * and marks the session as active.
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, admin } = response.data;

      // Store token locally to maintain session across tab closes
      localStorage.setItem('lead_desk_admin_token', token);
      
      setAuthState({
        isAuthenticated: true,
        admin,
        token,
        loading: false,
      });

      toast.success('Access Granted! Welcome to LeadDesk Mini.');
      return true;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Login failed. Please check credentials.';
      toast.error(errorMsg);
      return false;
    }
  };

  /**
   * logout
   * Wipes the stored token from localStorage, resets authState, and redirects the admin.
   */
  const logout = () => {
    localStorage.removeItem('lead_desk_admin_token');
    setAuthState({
      isAuthenticated: false,
      admin: null,
      token: null,
      loading: false,
    });
    toast.success('Logged out successfully.');
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth Hook
 * Simple consumer hook providing direct access to the global AuthContext value.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
