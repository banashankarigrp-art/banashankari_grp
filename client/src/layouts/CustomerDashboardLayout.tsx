import React from 'react';
import { Link, Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  Building2,
  LayoutDashboard,
  Home,
  PlusCircle,
  FileText,
  Bell,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { COMPANY_INFO } from '@shared/types';

export const CustomerDashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Customers do not have a listing dashboard; redirect directly to My Enquiries
  if (user?.role === 'customer') {
    return <Navigate to="/my-enquiries" replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Seller Dashboard Navigation (No Saved Homes, No Construction/Loans)
  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard, exact: true },
    { label: 'My Properties / Listings', path: '/dashboard/properties', icon: Home },
    { label: 'Buyer Enquiries', path: '/dashboard/enquiries', icon: FileText },
    { label: 'Notifications', path: '/dashboard/notifications', icon: Bell },
  ];

  const isActive = (item: { path: string; exact?: boolean }) => {
    if (item.exact) {
      return location.pathname === '/dashboard' && !location.search;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation Header (No hamburger menu - visible directly at top) */}
      <header className="sticky top-0 z-40 bg-navy-950 text-white border-b border-navy-850 shadow-md">
        {/* Main Header Row */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
            {/* Brand Logo & Portal Badge */}
            <div className="flex items-center space-x-2 shrink-0">
              <Link to="/" className="flex items-center space-x-1.5 sm:space-x-2.5 group">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-navy-900 border border-gold-500/40 flex items-center justify-center text-gold-400 shadow-md group-hover:bg-navy-850 transition shrink-0">
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <span className="font-heading font-bold text-xs sm:text-lg text-white block leading-tight">
                    BANASHANKARI
                  </span>
                  <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-gold-400 font-bold block">
                    Seller Portal
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                      active
                        ? 'bg-gold-500 text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-navy-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Side Actions (All items visible on all screen sizes including mobile) */}
            <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
              {/* List New Property CTA (Desktop view) */}
              <Link
                to="/sell-property"
                className="hidden md:flex bg-gold-500 hover:bg-gold-600 text-white text-xs font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-gold-glow items-center space-x-1.5 transition transform hover:-translate-y-0.5"
              >
                <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>List Property</span>
              </Link>

              {/* User Identity Pill (Always visible, responsive) */}
              <div
                className="flex items-center space-x-1 bg-navy-900/90 border border-navy-800 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shrink-0"
                title={`Signed in as ${user?.name} (Seller)`}
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center font-bold text-[10px] sm:text-xs shrink-0">
                  {user?.name?.[0]?.toUpperCase() || 'S'}
                </div>
                <div className="min-w-0 max-w-[55px] sm:max-w-[100px]">
                  <p className="text-[10px] sm:text-xs font-bold text-white truncate leading-tight">
                    {user?.name?.split(' ')[0]}
                  </p>
                  <span className="text-[8px] text-gold-400 uppercase font-semibold hidden sm:block leading-none">
                    Seller
                  </span>
                </div>
              </div>

              {/* Public Website Link (Always clearly visible near logout on mobile) */}
              <Link
                to="/"
                className="flex items-center space-x-1 text-gold-400 hover:text-white bg-navy-900/90 hover:bg-navy-850 border border-navy-800 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-semibold transition shrink-0"
                title="Go to Public Website"
              >
                <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold-400" />
                <span>Website</span>
              </Link>

              {/* Sign Out Button (Always clearly visible on mobile) */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-[10px] sm:text-xs text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-950/60 border border-red-900/40 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl font-semibold transition shrink-0"
                title="Sign Out"
              >
                <LogOut className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Top Navigation Row (All tabs visible at top, NO hamburger menu) */}
        <div className="md:hidden border-t border-navy-850/80 bg-navy-900/95 px-2.5 py-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center space-x-1.5 min-w-max">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    active
                      ? 'bg-gold-500 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-navy-850'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <Link
              to="/sell-property"
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-gold-500 hover:bg-gold-600 text-white whitespace-nowrap shadow-sm transition"
            >
              <PlusCircle className="w-3 h-3" />
              <span>+ List Property</span>
            </Link>
            <Link
              to="/"
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gold-400 bg-navy-850/80 hover:bg-navy-800 border border-gold-500/30 whitespace-nowrap transition"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Public Website ↗</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Sub-header Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-gold-600 shrink-0" />
            <span>
              <strong>Seller Notice:</strong> All plot & building listings undergo verification and admin approval by Ramesh S H before going live.
            </span>
          </div>

          <div className="text-xs text-slate-500 shrink-0">
            Support Desk: <strong className="text-navy-900">{COMPANY_INFO.phone}</strong>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};
