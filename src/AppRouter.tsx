import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import PublicLayout from './layouts/PublicLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProtectedRoute from './pages/auth/ProtectedRoute';

// Dashboard Pages
import UserOverview from './pages/user/Overview';
import BotConfig from './pages/user/BotConfig';
import UserBilling from './pages/user/Billing';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

const NotFound = () => <h1>404 - Not Found</h1>;

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* User Dashboard Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="overview" element={<UserOverview />} />
          <Route path="config" element={<BotConfig />} />
          <Route path="billing" element={<UserBilling />} />
        </Route>

        {/* Admin Dashboard Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;