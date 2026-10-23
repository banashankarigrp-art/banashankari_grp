import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  ShieldAlert,
  BarChart3,
  CheckSquare,
  Building,
  Users,
  MessageSquare,
  Settings,
  History,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Hammer,
  PlusCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminDashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, isLoading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center text-gold-400">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs tracking-wider uppercase">Validating Administrative Privileges...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Live Analytics', path: '/admin', icon: BarChart3 },
    { label: 'Property Approval Queue', path: '/admin/approvals', icon: CheckSquare },
    { label: 'All Properties', path: '/admin/properties', icon: Building },
    { label: '+ List New Property', path: '/sell-property', icon: PlusCircle },
    { label: 'Construction Projects', path: '/admin/projects', icon: Hammer },
    { label: 'Customer Enquiries', path: '/admin/enquiries', icon: MessageSquare },
    { label: 'User Management', path: '/admin/users', icon: Users },
    { label: 'Website CMS Settings', path: '/admin/settings', icon: Settings },
    { label: 'Security & Audit Logs', path: '/admin/audit', icon: History },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-navy-950 p-4 flex items-center justify-between border-b border-navy-800">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-amber-500" />
          <span className="font-heading font-bold text-sm tracking-wide text-white">ADMIN CONSOLE</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-400 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-navy-950 border-r border-navy-850 z-50 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo / Admin Header */}
          <div className="p-6 border-b border-navy-850 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <span className="font-heading font-bold text-base text-white block leading-tight">
                  BANASHANKARI
                </span>
                <span className="text-[9px] uppercase tracking-widest text-amber-400 font-bold block">
                  Admin Console
                </span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Admin user info */}
          <div className="p-4 mx-3 my-3 bg-navy-900 rounded-xl border border-navy-800">
            <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
            <span className="inline-block mt-1 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Authorized Administrator
            </span>
          </div>

          {/* Navigation links */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                    isActive(item.path)
                      ? 'bg-amber-500 text-navy-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-navy-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer controls */}
        <div className="p-4 border-t border-navy-850 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center space-x-2 text-xs text-slate-400 hover:text-amber-400 px-3 py-2 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Public Website ↗</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 px-3 py-2 rounded-lg transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out of Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900">
        <header className="bg-navy-950 border-b border-navy-800 px-6 py-4 hidden md:flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-slate-400">
              System Live & MongoDB Atlas Ready | Bangalore Timezone (IST)
            </span>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <Link
              to="/sell-property"
              className="bg-amber-500 hover:bg-amber-600 text-navy-950 font-bold px-3.5 py-1.5 rounded-lg transition flex items-center space-x-1.5 shadow"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ List New Property</span>
            </Link>
            <Link
              to="/admin/approvals"
              className="bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 px-3 py-1.5 rounded-lg font-medium transition flex items-center space-x-1.5"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Review Pending Listings</span>
            </Link>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
