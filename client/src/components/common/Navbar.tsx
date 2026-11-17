import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  ShieldAlert,
  ChevronDown,
  FileText,
  PlusCircle,
  Home,
  Building2,
  HardHat,
  Banknote,
  FileCheck2,
  PhoneCall,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState(115);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Measure dynamic header height so drawer perfectly hugs below the 2-tier header
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  // Close drawer and user dropdown on route change
  useEffect(() => {
    setDrawerOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false);
        setUserDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-close mobile drawer when window is resized to desktop/tablet (>= 768px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setDrawerOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    setDrawerOpen(false);
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', shortLabel: 'Home', path: '/', icon: Home, desc: 'Overview & verified listings' },
    { label: 'Real Estate', shortLabel: 'Real Estate', path: '/real-estate', icon: Building2, desc: 'BDA plots, houses & rentals' },
    { label: 'Construction', shortLabel: 'Construction', path: '/construction', icon: HardHat, desc: 'Turnkey residential building' },
    { label: 'Our Projects', shortLabel: 'Our Projects', path: '/our-projects', icon: Layers, desc: 'Completed & ongoing landmarks' },
    { label: 'KHB Property Services', shortLabel: 'KHB Services', path: '/khb-property-services', icon: FileCheck2, desc: 'Documentation & transfers' },
    { label: 'Loans Made Easy', shortLabel: 'Loans Made Easy', path: '/loans-made-easy', icon: Banknote, desc: 'Multi-bank financing assistance' },
    { label: 'Contact Us', shortLabel: 'Contact Us', path: '/contact', icon: PhoneCall, desc: 'Direct advisory & site visits' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/real-estate') return location.pathname.startsWith('/real-estate') || location.pathname.startsWith('/properties');
    if (path === '/our-projects') return location.pathname.startsWith('/our-projects') || location.pathname.startsWith('/projects');
    if (path === '/khb-property-services') return location.pathname.startsWith('/khb-property-services') || location.pathname.startsWith('/khb-assistance');
    if (path === '/loans-made-easy') return location.pathname.startsWith('/loans-made-easy') || location.pathname.startsWith('/loans');
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Top Header across all UI screens */}
      <header ref={headerRef} className="sticky top-0 z-40 shadow-sm">
        
        {/* ======================================================== */}
        {/* Tier 1: Top Center Company Name with Circular Logo Left & Right */}
        {/* ======================================================== */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 lg:py-4 flex items-center justify-between gap-1.5 sm:gap-4">
            
            {/* Top Left: Attached Circular Logo (Significantly enlarged on mobile) */}
            <Link
              to="/"
              className="flex items-center shrink-0 group focus:outline-none focus:ring-2 focus:ring-gold-500 rounded-full"
              aria-label="Banashankari Enterprises - Return to Home"
            >
              <img
                src="/khb-logo-circle.png"
                alt="KHB Suryanagar Properties Emblem - Left"
                className="w-20 h-20 xs:w-22 xs:h-22 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 object-contain rounded-full drop-shadow-sm group-hover:scale-105 transition-transform duration-200"
              />
            </Link>

            {/* Top Center: Official Company Name and Subtitle (Full of CAPS & Prominent in Mobile) */}
            <div className="text-center flex-1 min-w-0 px-1 sm:px-4">
              <Link to="/" className="inline-block group focus:outline-none w-full">
                <h1 className="font-heading font-black text-sm xs:text-base sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-navy-950 tracking-tight sm:tracking-wide uppercase leading-tight sm:leading-snug group-hover:text-gold-700 transition">
                  <span className="block sm:inline">BANASHANKARI </span>
                  <span className="block sm:inline">ENTERPRISES</span>
                </h1>
                <p className="text-[8.5px] xs:text-[10px] sm:text-xs md:text-sm lg:text-base font-bold tracking-wider sm:tracking-widest uppercase text-gold-600 mt-0.5 sm:mt-1 font-sans leading-tight">
                  REAL ESTATE AND CONSTRUCTIONS
                </p>
              </Link>
            </div>

            {/* Top Right: Attached Circular Logo (Significantly enlarged on mobile) */}
            <Link
              to="/"
              className="flex items-center shrink-0 group focus:outline-none focus:ring-2 focus:ring-gold-500 rounded-full"
              aria-label="Banashankari Enterprises - Return to Home"
            >
              <img
                src="/khb-logo-circle.png"
                alt="KHB Suryanagar Properties Emblem - Right"
                className="w-20 h-20 xs:w-22 xs:h-22 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 object-contain rounded-full drop-shadow-sm group-hover:scale-105 transition-transform duration-200"
              />
            </Link>

          </div>
        </div>

        {/* ======================================================== */}
        {/* Tier 2: Navigation Menus and Login / Sign Up Action Bar */}
        {/* ======================================================== */}
        <div className="bg-slate-50/95 backdrop-blur-md border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-12 sm:h-13 gap-2">
              
              {/* Desktop Navigation Links */}
              <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5 xl:space-x-2 flex-1 overflow-x-auto py-1 scrollbar-none" aria-label="Main Navigation">
                {navLinks.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`px-2 lg:px-2.5 xl:px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition whitespace-nowrap ${
                        active
                          ? 'text-navy-950 bg-white font-bold shadow-2xs border border-slate-200/90 text-gold-700'
                          : 'text-slate-600 hover:text-navy-950 hover:bg-white/80'
                      }`}
                    >
                      <span className="md:inline xl:hidden">{item.shortLabel}</span>
                      <span className="hidden xl:inline">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile: Hamburger Menu Toggle Button */}
              <div className="md:hidden flex items-center">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(!drawerOpen)}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition focus:outline-hidden focus:ring-2 focus:ring-gold-500 shrink-0 ${
                    drawerOpen
                      ? 'bg-navy-950 text-white border-navy-950 shadow-sm'
                      : 'text-navy-900 bg-white hover:bg-slate-100 border-slate-200 shadow-2xs'
                  }`}
                  aria-label="Navigation Menu"
                  aria-expanded={drawerOpen}
                >
                  {drawerOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                  <span>Menu</span>
                </button>
              </div>

              {/* Right: Auth Action (Login / Signup Button or User Dropdown) */}
              <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
                {isAuthenticated ? (
                  /* Authenticated User Button / Dropdown */
                  <div className="relative">
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center space-x-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-navy-900 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition shadow-2xs"
                      aria-expanded={userDropdownOpen}
                      aria-haspopup="true"
                    >
                      <div className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-700 flex items-center justify-center font-bold text-xs">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="max-w-[70px] sm:max-w-[110px] truncate hidden xs:inline">
                        {user?.name.split(' ')[0]}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    {userDropdownOpen && (
                      <div
                        className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                        onMouseLeave={() => setUserDropdownOpen(false)}
                      >
                        <div className="px-4 py-2.5 border-b border-slate-100">
                          <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                          <p className="text-sm font-bold text-navy-950 truncate">{user?.name}</p>
                          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                          <span className="inline-block mt-1.5 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                            {user?.role === 'seller'
                              ? 'Seller / Owner'
                              : user?.role === 'admin'
                              ? 'Administrator'
                              : 'Customer'}
                          </span>
                        </div>

                        {isAdmin ? (
                          <>
                            <Link
                              to="/admin"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center space-x-2 px-4 py-2.5 text-sm text-navy-900 hover:bg-slate-50 font-medium transition"
                            >
                              <ShieldAlert className="w-4 h-4 text-amber-600" />
                              <span>Admin Console</span>
                            </Link>
                            <Link
                              to="/sell-property"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium transition"
                            >
                              <PlusCircle className="w-4 h-4 text-amber-600" />
                              <span>List a Property</span>
                            </Link>
                          </>
                        ) : user?.role === 'seller' ? (
                          <>
                            <Link
                              to="/dashboard"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center space-x-2 px-4 py-2.5 text-sm text-navy-900 hover:bg-slate-50 font-medium transition"
                            >
                              <LayoutDashboard className="w-4 h-4 text-slate-500" />
                              <span>Seller Dashboard</span>
                            </Link>
                            <Link
                              to="/dashboard/properties"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium transition"
                            >
                              <span>My Submitted Listings</span>
                            </Link>
                            <Link
                              to="/sell-property"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium transition"
                            >
                              <span>List a Property</span>
                            </Link>
                          </>
                        ) : (
                          <Link
                            to="/my-enquiries"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center space-x-2 px-4 py-2.5 text-sm text-navy-900 hover:bg-slate-50 font-medium transition"
                          >
                            <FileText className="w-4 h-4 text-gold-600" />
                            <span>My Enquiries</span>
                          </Link>
                        )}

                        <div className="border-t border-slate-100 my-1" />

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 text-left font-medium transition"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Unauthenticated: Combined single Login / Sign Up button (No door icon) */
                  <Link
                    to="/login"
                    className="inline-flex items-center px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-amber-500 via-gold-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-sm hover:shadow transition transform hover:-translate-y-0.5 shrink-0"
                  >
                    <span>Login / Sign Up</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Top-to-Bottom Mobile Navigation Menu (Disappears on screens other than mobile) */}
      {drawerOpen && (
        <div
          className="md:hidden fixed inset-x-0 bottom-0 z-40 flex flex-col"
          style={{ top: `${headerHeight}px` }}
        >
          {/* Backdrop overlay below the dropdown */}
          <div
            className="fixed inset-x-0 bottom-0 bg-navy-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            style={{ top: `${headerHeight}px` }}
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Full-width Top-to-Bottom Menu Panel */}
          <div className="relative z-50 w-full bg-white border-b-2 border-gold-500/50 shadow-2xl overflow-y-auto max-h-[calc(100vh-6rem)] transform transition-all animate-in slide-in-from-top duration-300">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              {/* Mobile Drawer Header with Clear Large Logo */}
              <div className="flex items-center space-x-3.5 pb-4 mb-4 border-b border-slate-100">
                <img
                  src="/khb-logo-circle.png"
                  alt="KHB Suryanagar Properties Emblem"
                  className="w-16 h-16 object-contain rounded-full shadow-xs shrink-0"
                />
                <div className="min-w-0">
                  <h2 className="font-heading font-black text-sm text-navy-950 uppercase leading-snug">
                    BANASHANKARI ENTERPRISES
                  </h2>
                  <p className="text-[10px] font-bold text-gold-600 uppercase tracking-wider">
                    REAL ESTATE AND CONSTRUCTIONS
                  </p>
                </div>
              </div>

              {/* Navigation Links Grid / List (Top to Bottom) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setDrawerOpen(false)}
                      className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl transition group ${
                        active
                          ? 'bg-navy-950 text-white shadow-md'
                          : 'text-navy-900 bg-slate-50 hover:bg-slate-100/90 border border-slate-100 hover:border-gold-500/30'
                      }`}
                    >
                      <div className="flex items-center space-x-3.5 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition ${
                            active
                              ? 'bg-gold-500/20 text-gold-400'
                              : 'bg-white text-navy-900 shadow-2xs border border-slate-200/80 group-hover:bg-gold-50 group-hover:text-gold-600 group-hover:border-gold-300'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p
                            className={`text-sm sm:text-base font-bold truncate ${
                              active ? 'text-white' : 'text-navy-950 group-hover:text-gold-600'
                            }`}
                          >
                            {item.label}
                          </p>
                          <p
                            className={`text-xs truncate ${
                              active ? 'text-slate-300' : 'text-slate-500'
                            }`}
                          >
                            {item.desc}
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 transition ${
                          active
                            ? 'text-gold-400'
                            : 'text-slate-400 group-hover:text-gold-600 group-hover:translate-x-1'
                        }`}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
