import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { WhatsAppButton } from '../components/common/WhatsAppButton';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col relative text-slate-850 bg-cream-50">
      <Navbar />
      <main className="flex-1 relative z-0">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};
