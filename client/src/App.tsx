import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { PublicLayout } from './layouts/PublicLayout';
import { CustomerDashboardLayout } from './layouts/CustomerDashboardLayout';
import { AdminDashboardLayout } from './layouts/AdminDashboardLayout';

// Public Pages
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { SellPropertyPage } from './pages/SellPropertyPage';
import { RentLeasePropertyPage } from './pages/RentLeasePropertyPage';
import { ConstructionPage } from './pages/ConstructionPage';
import { LoanAssistancePage } from './pages/LoanAssistancePage';
import { KhbAssistancePage } from './pages/KhbAssistancePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { MyEnquiriesPage } from './pages/MyEnquiriesPage';

import { RequireAuth } from './components/common/RequireAuth';

// Dashboard Pages
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Layout Routes */}
            <Route element={<PublicLayout />}>
              {/* Home Page: Publicly Viewable */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* All exploration routes require login or signup */}
              <Route element={<RequireAuth />}>
                <Route path="/properties" element={<PropertiesPage />} />
                <Route path="/properties/:id" element={<PropertyDetailPage />} />
                <Route path="/sell-property" element={<SellPropertyPage />} />
                <Route path="/rent-lease-property" element={<RentLeasePropertyPage />} />
                <Route path="/construction" element={<ConstructionPage />} />
                <Route path="/loans" element={<LoanAssistancePage />} />
                <Route path="/khb-assistance" element={<KhbAssistancePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/my-enquiries" element={<MyEnquiriesPage />} />
              </Route>
            </Route>

            {/* Customer Dashboard Routes (Protected) */}
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <CustomerDashboardLayout />
                </RequireAuth>
              }
            >
              <Route index element={<CustomerDashboardPage />} />
              <Route path="properties" element={<CustomerDashboardPage />} />
              <Route path="enquiries" element={<CustomerDashboardPage />} />
              <Route path="notifications" element={<CustomerDashboardPage />} />
            </Route>

            {/* Admin Isolated Login */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Admin Console Protected Routes */}
            <Route path="/admin" element={<AdminDashboardLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="approvals" element={<AdminDashboardPage />} />
              <Route path="properties" element={<AdminDashboardPage />} />
              <Route path="properties/new" element={<SellPropertyPage />} />
              <Route path="projects" element={<AdminDashboardPage />} />
              <Route path="enquiries" element={<AdminDashboardPage />} />
              <Route path="users" element={<AdminDashboardPage />} />
              <Route path="settings" element={<AdminDashboardPage />} />
              <Route path="audit" element={<AdminDashboardPage />} />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
