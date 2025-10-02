import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import OrganizationDetail from './components/OrganizationDetail';
import MyRequests from './components/MyRequests';
import StytchOAuthAuthorize from './components/StytchOAuthAuthorize';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return user ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />
      <Route
        path="/oauth/authorize"
        element={
          <ProtectedRoute>
            <StytchOAuthAuthorize />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/organization"
        element={
          <ProtectedRoute>
            <Layout>
              <OrganizationDetail />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-requests"
        element={
          <ProtectedRoute>
            <Layout>
              <MyRequests />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 fallback */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
              <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
              <a href="/dashboard" className="text-indigo-600 hover:text-indigo-800">
                Go to Dashboard
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
