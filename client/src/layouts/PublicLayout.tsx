import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { WhatsAppButton } from '../components/common/WhatsAppButton';

export const PublicLayout: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className={`min-h-screen flex flex-col relative text-slate-850 ${!isHomePage ? 'bg-cream-50' : ''}`}>
      {/* Background Image - Exclusively displayed on the Homepage */}
      {isHomePage && (
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden="true">
          <div
            className="absolute inset-0 bg-cover bg-center top bg-no-repeat bg-fixed pointer-events-none"
            style={{ backgroundImage: "url('/site-bg.jpg')" }}
          />
          {/* Subtle non-distorting overlay preserving building vibrancy while maintaining readability */}
          <div className="absolute inset-0 bg-black/20 pointer-events-none" />
        </div>
      )}

      <Navbar />
      <main className="flex-1 relative z-0">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};
