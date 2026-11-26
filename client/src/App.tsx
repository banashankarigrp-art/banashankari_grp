import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { LanguageProvider } from './context/LanguageContext';
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
import { OurProjectsPage } from './pages/OurProjectsPage';
import { LoanAssistancePage } from './pages/LoanAssistancePage';
import { KhbAssistancePage } from './pages/KhbAssistancePage';
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
        <SettingsProvider>
          <LanguageProvider>
            <BrowserRouter>
              <Routes>
            {/* Public Layout Routes - All pages navigatable without login */}
            <Route element={<PublicLayout />}>
              {/* 1. Home */}
              <Route path="/" element={<HomePage />} />

              {/* 2. Real Estate */}
              <Route path="/real-estate" element={<PropertiesPage />} />
              <Route path="/properties" element={<PropertiesPage />} />
              <Route path="/properties/:id" element={<PropertyDetailPage />} />

              {/* 3. Construction */}
              <Route path="/construction" element={<ConstructionPage />} />

              {/* 4. Our Projects */}
              <Route path="/our-projects" element={<OurProjectsPage />} />
              <Route path="/projects" element={<OurProjectsPage />} />

              {/* 5. KHB Property Services */}
              <Route path="/khb-property-services" element={<KhbAssistancePage />} />
              <Route path="/loans" element={<KhbAssistancePage />} />
             {/*  <Route path="/khb-assistance" element={<KhbAssistancePage />} /> */}
              <Route path="/khbservices" element={<KhbAssistancePage />} />



              {/* 6. Loans Made Easy */}
              <Route path="/loans-made-easy" element={<LoanAssistancePage />} />
              <Route path="/loans" element={<LoanAssistancePage />} />

              {/* 7. Contact Us */}
              <Route path="/contact" element={<ContactPage />} />

              {/* Auxiliary Public Flow Routes */}
              <Route path="/sell-property" element={<SellPropertyPage />} />
              <Route path="/rent-lease-property" element={<RentLeasePropertyPage />} />
              <Route path="/my-enquiries" element={<MyEnquiriesPage />} />
              <Route path="/about" element={<Navigate to="/" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
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
          </LanguageProvider>
        </SettingsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
