import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { ThemeProvider } from './context/ThemeContext.js';
import { AuthProvider } from './context/AuthContext.js';
import { ProtectedRoute } from './components/ProtectedRoute.js';
import { Home } from './pages/Home.js';
import { Login } from './pages/Login.js';
import { Dashboard } from './pages/Dashboard.js';
import { NotFound } from './pages/NotFound.js';

// Setup TanStack Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />

              {/* Protected Admin Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e293b',
                color: '#fff',
                borderRadius: '12px',
              },
              success: {
                style: {
                  background: '#0f172a',
                  border: '1px solid #10b981',
                },
              },
              error: {
                style: {
                  background: '#0f172a',
                  border: '1px solid #ef4444',
                },
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
