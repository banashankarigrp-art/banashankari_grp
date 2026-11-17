import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { WhatsAppButton } from '../components/common/WhatsAppButton';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col relative text-slate-850">
      {/* Fixed Full Website Background Image (Clearly visible as in the original picture) */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0 bg-cover bg-center top bg-no-repeat bg-fixed pointer-events-none"
          style={{ backgroundImage: "url('/site-bg.jpg')" }}
        />
        {/* Subtle non-distorting overlay preserving building vibrancy while maintaining readability */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      </div>

      <Navbar />
      <main className="flex-1 relative z-0">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};
