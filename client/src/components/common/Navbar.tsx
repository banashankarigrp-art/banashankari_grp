import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Building2,
  Phone,
  User,
  LogOut,
  LayoutDashboard,
  ShieldAlert,
  ChevronDown,
  FileText,
  PlusCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Find Properties', path: '/properties' },
    { label: 'Construction', path: '/construction' },
    { label: 'Loan Assistance', path: '/loans' },
    { label: 'KHB Guidance', path: '/khb-assistance' },
    { label: 'About Us', path: '/about' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20 gap-2">
          {/* Brand Logo & Monogram */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group min-w-0 shrink">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-navy-900 border border-gold-500/40 flex items-center justify-center text-gold-400 shadow-md group-hover:bg-navy-850 transition shrink-0">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <span className="font-heading font-bold text-base sm:text-xl lg:text-2xl text-navy-900 tracking-tight block leading-tight truncate">
                BANASHANKARI
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-widest uppercase font-semibold text-gold-600 block truncate">
                Enterprises — Real Estate & Construction
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links (Visible on lg and above) */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-7 shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-gold-600 py-2 relative ${
                  isActive(link.path)
                    ? 'text-navy-900 font-semibold'
                    : 'text-slate-600'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500 rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Action Buttons (Visible across all screen sizes) */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
            <Link
              to="/contact"
              className="inline-flex items-center space-x-1 sm:space-x-1.5 bg-gold-500 hover:bg-gold-600 text-white px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition transform hover:-translate-y-0.5"
            >
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Enquire Now</span>
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-1 sm:space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-navy-900 px-2 sm:px-3.5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition"
                >
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-600" />
                  <span className="max-w-[70px] sm:max-w-[100px] truncate">{user?.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                      <p className="text-sm font-semibold text-navy-900 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-gold-50 text-gold-700 border border-gold-200">
                        {user?.role === 'seller' ? 'Seller / Owner' : user?.role === 'admin' ? 'Administrator' : 'Customer'}
                      </span>
                    </div>

                    {isAdmin ? (
                      <>
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2.5 text-sm text-navy-900 hover:bg-slate-50 font-medium"
                        >
                          <ShieldAlert className="w-4 h-4 text-amber-600" />
                          <span>Admin Console</span>
                        </Link>
                        <Link
                          to="/sell-property"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                        >
                          <PlusCircle className="w-4 h-4 text-amber-600" />
                          <span>List a Property (Admin)</span>
                        </Link>
                      </>
                    ) : user?.role === 'seller' ? (
                      <>
                        <Link
                          to="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2.5 text-sm text-navy-900 hover:bg-slate-50"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-500" />
                          <span>Seller Dashboard</span>
                        </Link>

                        <Link
                          to="/dashboard/properties"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <span>My Submitted Listings</span>
                        </Link>

                        <Link
                          to="/sell-property"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <span>List a Property</span>
                        </Link>

                        <Link
                          to="/dashboard/enquiries"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <span>Buyer Enquiries</span>
                        </Link>
                      </>
                    ) : (
                      /* Customer: No separate dashboard or listing controls; direct access to My Enquiries */
                      <Link
                        to="/my-enquiries"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2.5 text-sm text-navy-900 hover:bg-slate-50 font-medium"
                      >
                        <FileText className="w-4 h-4 text-gold-600" />
                        <span>My Enquiries</span>
                      </Link>
                    )}

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center space-x-1 sm:space-x-1.5 border border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition"
              >
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Login / Signup</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Responsive Navigation Bar for Mobile & Tablet (All Menu Items Directly Visible) */}
      <div className="lg:hidden border-t border-slate-100 bg-slate-50/90 backdrop-blur-sm overflow-x-auto scrollbar-none px-3 sm:px-6 py-2">
        <nav className="flex items-center space-x-1.5 sm:space-x-2 whitespace-nowrap min-w-max">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                isActive(link.path)
                  ? 'bg-navy-900 text-white shadow-sm font-bold'
                  : 'text-slate-700 bg-white border border-slate-200/90 hover:bg-slate-100 hover:text-navy-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};
