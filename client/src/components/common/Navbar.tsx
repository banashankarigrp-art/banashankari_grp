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
  Languages,
  Check,
  Globe,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const Navbar: React.FC = () => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const langDropdownRef = useRef<HTMLDivElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState(115);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { language, setLanguage, isKn, t } = useLanguage();
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

  // Close drawer and dropdowns on route change
  useEffect(() => {
    setDrawerOpen(false);
    setUserDropdownOpen(false);
    setLangDropdownOpen(false);
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

  // Handle ESC key to close drawer and dropdowns
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false);
        setUserDropdownOpen(false);
        setLangDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle outside click for language dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    if (langDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [langDropdownOpen]);

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
    { label: t('nav.home', 'Home'), shortLabel: t('nav.home', 'Home'), path: '/', icon: Home, desc: t('nav.desc.home', 'Overview & verified listings') },
    { label: t('nav.real_estate', 'Real Estate'), shortLabel: t('nav.real_estate', 'Real Estate'), path: '/real-estate', icon: Building2, desc: t('nav.desc.real_estate', 'BDA plots, houses & rentals') },
    { label: t('nav.construction', 'Construction'), shortLabel: t('nav.construction', 'Construction'), path: '/construction', icon: HardHat, desc: t('nav.desc.construction', 'Turnkey residential building') },
    { label: t('nav.our_projects', 'Our Projects'), shortLabel: t('nav.our_projects', 'Our Projects'), path: '/our-projects', icon: Layers, desc: t('nav.desc.projects', 'Completed & ongoing landmarks') },
    { label: t('nav.khb_services', 'KHB Property Services'), shortLabel: isKn ? 'ಕೆ.ಹೆಚ್.ಬಿ ಸೇವೆಗಳು' : 'KHB Services', path: '/khb-property-services', icon: FileCheck2, desc: t('nav.desc.khb', 'Documentation & transfers') },
    { label: t('nav.loans_made_easy', 'Loans Made Easy'), shortLabel: isKn ? 'ಸುಲಭ ಸಾಲ' : 'Loans Made Easy', path: '/loans-made-easy', icon: Banknote, desc: t('nav.desc.loans', 'Multi-bank financing assistance') },
    { label: t('nav.contact_us', 'Contact Us'), shortLabel: t('nav.contact_us', 'Contact Us'), path: '/contact', icon: PhoneCall, desc: t('nav.desc.contact', 'Direct advisory & site visits') },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/real-estate') return location.pathname.startsWith('/real-estate') || location.pathname.startsWith('/properties');
    if (path === '/our-projects') return location.pathname.startsWith('/our-projects') || location.pathname.startsWith('/projects');
    if (path === '/khb-property-services') return location.pathname.startsWith('/khb-property-services') || location.pathname.startsWith('/khbassistance');
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
        <div className="bg-[#6BBF59] border-b border-[#3B732E] shadow-sm">
          <div className="w-full px-2 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 flex items-center justify-between gap-2 sm:gap-4">

            {/* Top Left: Attached "Grow Together" Logo & RGB Text Below */}
            <Link
              to="/"
              className="flex flex-col items-center shrink-0 group focus:outline-none focus:ring-2 focus:ring-[#FFD700] rounded-xl p-0.5 sm:p-1 transition"
              aria-label="Banashankari Enterprises - Return to Home"
            >
              <img
                src="/grow-together-circle.png"
                alt="Grow Together - Banashankari Enterprises"
                className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 object-contain rounded-full drop-shadow-md group-hover:scale-105 transition-transform duration-200 ring-2 ring-white/70 bg-white"
              />

            </Link>

            {/* Top Center: Official Company Name and Subtitle */}
            <div className="text-center flex-1 min-w-0 px-1 sm:px-4">
              <Link to="/" className="inline-block group focus:outline-none w-full">
                <h1 className="font-heading font-black text-sm xs:text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-[#FFD700] tracking-widest uppercase leading-tight sm:leading-snug group-hover:text-[#FFE57F] transition drop-shadow-sm">
                  <span className="block sm:inline">{isKn ? 'ಬನಶಂಕರಿ ' : 'BANASHANKARI '}</span>
                  <span className="block sm:inline">{isKn ? 'ಎಂಟರ್‌ಪ್ರೈಸಸ್' : 'ENTERPRISES'}</span>
                </h1>
                <p className="text-[8.5px] xs:text-[10px] sm:text-xs md:text-xs lg:text-sm font-black tracking-wider sm:tracking-widest uppercase text-black mt-0.5 sm:mt-1 font-sans leading-tight">
                  {isKn ? 'ರಿಯಲ್ ಎಸ್ಟೇಟ್ ಮತ್ತು ಕನ್‌ಸ್ಟ್ರಕ್ಷನ್ಸ್' : 'REAL ESTATE AND CONSTRUCTIONS'}
                </p>
              </Link>
            </div>

            {/* Top Right: Attached Circular Logo & RGB One Stop Solution Text Below */}
            <Link
              to="/"
              className="flex flex-col items-center shrink-0 group focus:outline-none focus:ring-2 focus:ring-[#FFD700] rounded-xl p-0.5 sm:p-1 transition"
              aria-label="Banashankari Enterprises - Return to Home"
            >
              <img
                src="/khb-logo-circle.png"
                alt="KHB Suryanagar Properties Emblem - Right"
                className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 object-contain rounded-full drop-shadow-md group-hover:scale-105 transition-transform duration-200 ring-2 ring-white/70"
              />

            </Link>

          </div>
        </div>

        {/* ======================================================== */}
        {/* Tier 2: Navigation Menus and Login / Sign Up Action Bar */}
        {/* ======================================================== */}
        <div className="bg-slate-50/95 backdrop-blur-md border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-11 sm:h-12 gap-2">

              {/* Mobile Left: Hamburger Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setDrawerOpen(!drawerOpen)}
                className={`md:hidden inline-flex items-center justify-center p-2 sm:p-2.5 rounded-xl border transition focus:outline-hidden focus:ring-2 focus:ring-gold-500 shrink-0 ${drawerOpen
                  ? 'bg-navy-950 text-white border-navy-950 shadow-sm'
                  : 'text-navy-900 bg-white hover:bg-slate-100 border-slate-200 shadow-2xs'
                  }`}
                aria-label="Navigation Menu"
                aria-expanded={drawerOpen}
              >
                {drawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Desktop Navigation Links */}
              <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5 xl:space-x-2 flex-1 overflow-x-auto py-1 scrollbar-none" aria-label="Main Navigation">
                {navLinks.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`px-2 lg:px-2.5 xl:px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition whitespace-nowrap ${active
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

              {/* Right: Actions Container (Language Dropdown, Login / User Profile Button) */}
              <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0">
                {/* Language Dropdown Selector (BEFORE Login Button) */}
                <div className="relative" ref={langDropdownRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setLangDropdownOpen(!langDropdownOpen);
                      setUserDropdownOpen(false);
                    }}
                    className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition shadow-2xs border ${langDropdownOpen
                      ? 'bg-amber-50 text-navy-950 border-gold-400 ring-2 ring-gold-400/20'
                      : 'bg-white hover:bg-slate-100 border-slate-200 text-navy-900'
                      }`}
                    aria-label="Select Language / ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ"
                    aria-expanded={langDropdownOpen}
                    aria-haspopup="true"
                  >
                    <Globe className="w-4 h-4 text-gold-600 shrink-0" />
                    <span className="font-bold text-xs sm:text-sm">
                      {language === 'kn' ? 'ಕನ್ನಡ' : 'English'}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''
                        }`}
                    />
                  </button>

                  {langDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                      onMouseLeave={() => setLangDropdownOpen(false)}
                    >
                      <div className="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                        {isKn ? 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ' : 'Select Language'}
                      </div>

                      {/* 1. English Option */}
                      <button
                        type="button"
                        onClick={() => {
                          setLanguage('en');
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm transition ${language === 'en'
                          ? 'bg-amber-50/80 text-navy-950 font-bold'
                          : 'text-slate-700 hover:bg-slate-50 font-medium'
                          }`}
                      >
                        <span className="flex items-center space-x-2">
                          <span className="text-sm">🇬🇧</span>
                          <span>English</span>
                        </span>
                        {language === 'en' && <Check className="w-4 h-4 text-gold-600 font-bold" />}
                      </button>

                      {/* 2. Kannada Option */}
                      <button
                        type="button"
                        onClick={() => {
                          setLanguage('kn');
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm transition ${language === 'kn'
                          ? 'bg-amber-50/80 text-navy-950 font-bold'
                          : 'text-slate-700 hover:bg-slate-50 font-medium'
                          }`}
                      >
                        <span className="flex items-center space-x-2">
                          <span className="text-sm">🇮🇳</span>
                          <span>ಕನ್ನಡ (Kannada)</span>
                        </span>
                        {language === 'kn' && <Check className="w-4 h-4 text-gold-600 font-bold" />}
                      </button>
                    </div>
                  )}
                </div>

                {isAuthenticated ? (
                  /* Authenticated User Button / Dropdown */
                  <div className="relative">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(!userDropdownOpen);
                        setLangDropdownOpen(false);
                      }}
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
                          <p className="text-xs text-slate-400 font-medium">{t('nav.signed_in_as', 'Signed in as')}</p>
                          <p className="text-sm font-bold text-navy-950 truncate">{user?.name}</p>
                          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                          <span className="inline-block mt-1.5 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                            {user?.role === 'seller'
                              ? (isKn ? 'ಮಾರಾಟಗಾರರು / ಮಾಲೀಕರು' : 'Seller / Owner')
                              : user?.role === 'admin'
                                ? (isKn ? 'ನಿರ್ವಾಹಕರು' : 'Administrator')
                                : (isKn ? 'ಗ್ರಾಹಕರು' : 'Customer')}
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
                              <span>{t('nav.admin_console', 'Admin Console')}</span>
                            </Link>
                            <Link
                              to="/sell-property"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium transition"
                            >
                              <PlusCircle className="w-4 h-4 text-amber-600" />
                              <span>{t('nav.list_property', 'List a Property')}</span>
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
                              <span>{t('nav.seller_dashboard', 'Seller Dashboard')}</span>
                            </Link>
                            <Link
                              to="/dashboard/properties"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium transition"
                            >
                              <span>{t('nav.my_listings', 'My Submitted Listings')}</span>
                            </Link>
                            <Link
                              to="/sell-property"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium transition"
                            >
                              <span>{t('nav.list_property', 'List a Property')}</span>
                            </Link>
                          </>
                        ) : (
                          <Link
                            to="/my-enquiries"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center space-x-2 px-4 py-2.5 text-sm text-navy-900 hover:bg-slate-50 font-medium transition"
                          >
                            <FileText className="w-4 h-4 text-gold-600" />
                            <span>{t('nav.my_enquiries', 'My Enquiries')}</span>
                          </Link>
                        )}

                        <div className="border-t border-slate-100 my-1" />

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 text-left font-medium transition"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>{t('nav.logout', 'Log Out')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Unauthenticated: Login Button (before Hamburger Menu, signup wording removed) */
                  <Link
                    to="/login"
                    className="inline-flex items-center px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-amber-500 via-gold-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-sm hover:shadow transition transform hover:-translate-y-0.5 shrink-0"
                  >
                    <span>{t('nav.login', 'Login')}</span>
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
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
              {/* Navigation Links Grid / List (Top to Bottom) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setDrawerOpen(false)}
                      className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl transition group ${active
                        ? 'bg-navy-950 text-white shadow-md'
                        : 'text-navy-900 bg-slate-50 hover:bg-slate-100/90 border border-slate-100 hover:border-gold-500/30'
                        }`}
                    >
                      <div className="flex items-center space-x-3.5 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition ${active
                            ? 'bg-gold-500/20 text-gold-400'
                            : 'bg-white text-navy-900 shadow-2xs border border-slate-200/80 group-hover:bg-gold-50 group-hover:text-gold-600 group-hover:border-gold-300'
                            }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p
                            className={`text-sm sm:text-base font-bold truncate ${active ? 'text-white' : 'text-navy-950 group-hover:text-gold-600'
                              }`}
                          >
                            {item.label}
                          </p>
                          <p
                            className={`text-xs truncate ${active ? 'text-slate-300' : 'text-slate-500'
                              }`}
                          >
                            {item.desc}
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 transition ${active
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
