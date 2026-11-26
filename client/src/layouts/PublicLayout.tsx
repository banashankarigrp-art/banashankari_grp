import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { WhatsAppButton } from '../components/common/WhatsAppButton';

export const PublicLayout: React.FC = () => {
  const { pathname } = useLocation();
  const isHomePage = pathname === '/';

  return (
    <div
      className={`min-h-screen flex flex-col relative ${
        isHomePage
          ? 'text-slate-850 bg-cream-50'
          : 'text-slate-850 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950'
      }`}
    >
      <Navbar />
      <main className="flex-1 relative z-0">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};
