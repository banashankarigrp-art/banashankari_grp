import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Building2,
  Home,
  CheckCircle2,
  ArrowRight,
  Shield,
  Layers,
  Banknote,
  FileCheck2,
  Users2,
  Users,
  Award,
  ShieldCheck,
  PhoneCall,
  Clock,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { PropertyCard } from '../components/property/PropertyCard';
import { api } from '../services/api';
import { IProperty, COMPANY_INFO, ISiteSettings } from '@shared/types';

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  duration?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  target,
  suffix = '',
  duration = 2000,
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (target <= 0) {
      setCount(0);
      return;
    }

    if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
      setCount(target);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            let startTime: number | null = null;

            const animate = (currentTime: number) => {
              if (!startTime) startTime = currentTime;
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease-out cubic formula for organic deceleration
              const easeOut = 1 - Math.pow(1 - progress, 3);
              const currentVal = Math.floor(easeOut * target);
              setCount(currentVal);

              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                setCount(target);
              }
            };

            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [target, duration, hasAnimated]);

  useEffect(() => {
    if (hasAnimated) {
      setCount(target);
    }
  }, [target, hasAnimated]);

  return (
    <span ref={ref}>
      {count.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
};

export const HomePage: React.FC = () => {
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [settings, setSettings] = useState<ISiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // FAQ Accordion
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Quick enquiry form state
  const [enquiryForm, setEnquiryForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    category: 'general',
    message: '',
  });
  const [enquirySuccess, setEnquirySuccess] = useState('');
  const [enquirySubmitting, setEnquirySubmitting] = useState(false);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoading(true);
        const [propsRes, settingsRes]: any = await Promise.all([
          api.get('/properties?limit=6').catch(() => ({ success: false, data: [] })),
          api.get('/content/settings').catch(() => ({ success: false, data: null })),
        ]);
        if (propsRes.success && propsRes.data) {
          setProperties(propsRes.data);
        }
        if (settingsRes?.data) {
          setSettings(settingsRes.data);
        }
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPageData();
  }, []);


  const handleQuickEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setEnquirySubmitting(true);
      const res: any = await api.post('/enquiries', {
        category: enquiryForm.category,
        customerName: enquiryForm.customerName,
        phone: enquiryForm.phone,
        email: enquiryForm.email,
        details: { message: enquiryForm.message },
        consent: true,
      });

      if (res.success) {
        setEnquirySuccess(
          `Thank you, ${enquiryForm.customerName}! Your enquiry (Ref: ${res.data.referenceId}) was registered. Ramesh S H and our team will contact you shortly.`
        );
        setEnquiryForm({ customerName: '', phone: '', email: '', category: 'general', message: '' });
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit enquiry');
    } finally {
      setEnquirySubmitting(false);
    }
  };

  const faqs = [
    {
      q: 'Do you offer direct assistance for Karnataka Housing Board (KHB) properties?',
      a: 'Yes, Banashankari Enterprises offers dedicated advisory for KHB allotments, title deeds verification, documentation check, and transfer process assistance in Bangalore. Final official sanctions are issued by the competent authorities.',
    },
    {
      q: 'Can Banashankari Enterprises handle turnkey residential construction?',
      a: 'Absolutely. Led directly by founder Ramesh S H, we coordinate the complete building lifecycle: architectural planning, municipal plan approvals, foundation excavation, structural RCC framing, plumbing/electrical execution, and premium interior woodwork with transparent cost estimates.',
    },
    {
      q: 'How does your banking home loan assistance work?',
      a: 'We assist clients in coordinating home purchase, plot purchase, and construction loan applications across major banks including SBI, HDFC, Canara Bank, and ICICI. We assist with documentation compilation and eligibility pre-checks. Final loan sanction and interest rates are determined solely by the respective bank.',
    },
    {
      q: 'How do I schedule a site visit or enquire about a property?',
      a: 'Simply click "Enquire Now" or reach out to founder Ramesh S H directly. Our advisory team arranges prompt site visits, legal document reviews, and direct consultations with complete transparency.',
    },
  ];

  // Load founder image directly from static folder
  const founderPhoto = '/founder.jpg';
  const founderName = settings?.founderName || COMPANY_INFO.founder;
  const founderTitle = settings?.founderTitle || COMPANY_INFO.founderTitle || 'Founder & Managing Director';

  // About Company & Dynamic Metrics
  const clientsCount = settings?.clientsCount ?? 1000;
  const completedProjectsCount = settings?.completedProjectsCount ?? 200;
  const yearsExperience = settings?.yearsExperience ?? 15;
  const aboutCompanyHeading =
    settings?.aboutCompanyHeading ||
    'Pioneering Bangalore’s Real Estate & Civil Construction with Unmatched Integrity';
  const aboutCompanyText =
    settings?.aboutCompanyText ||
    'With over 15 years of ground expertise, Banashankari Enterprises stands as South Bangalore’s most dependable real estate advisory and civil construction partner. From title-verified BDA plot procurement to comprehensive turnkey structural construction and KHB liaison, our hands-on leadership ensures every square foot reflects integrity, precision, and lasting family value.';

  // End-to-End Property Solutions (User Uploaded Images)
  const solutions = [
    {
      id: 'plots',
      title: 'Residential Plots & Land',
      category: 'Land & Plots',
      image: '/solutions/plots.jpg',
      description:
        'Verified BDA, BMRDA, and DC-converted residential plots with complete legal title deeds and immediate registration readiness.',
      highlights: ['Clear title deed verification', 'Cauvery & BESCOM infrastructure ready'],
      link: '/properties?type=plot',
      linkText: 'Explore Plots',
    },
    {
      id: 'construction',
      title: 'Bespoke Home Construction',
      category: 'Civil & Building',
      image: '/solutions/construction.jpg',
      description:
        'Architectural planning, structural RCC execution, and turnkey building coordination with stringent material grade checks.',
      highlights: ['Direct oversight by Ramesh S H', 'Transparent itemized material billing'],
      link: '/construction',
      linkText: 'Explore Construction',
    },
    {
      id: 'rentals',
      title: 'Rentals & Leases',
      category: 'Rental Spaces',
      image: '/solutions/rental.jpg',
      description:
        'Curated residential apartments, independent duplex homes, and prime commercial retail spaces for verified tenants.',
      highlights: ['Thorough tenant vetting', 'Formal rental agreements & deposit escrow'],
      link: '/properties?purpose=rent',
      linkText: 'Explore Rentals',
    },
    {
      id: 'loans',
      title: 'Loan & KHB Advisory',
      category: 'Finance & Legal',
      image: '/solutions/loan.jpg',
      description:
        'Home loan documentation assistance across premier banks and dedicated procedural guidance for KHB transfers.',
      highlights: ['Multi-bank loan eligibility liaison', 'KHB statutory checklist verification'],
      link: '/khb-assistance',
      linkText: 'KHB & Loan Guidance',
    },
  ];

  // Mobile 2s Card Shuffle & Rotational Animation State
  const [activeSolutionIdx, setActiveSolutionIdx] = useState(0);
  const [isShufflePaused, setIsShufflePaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const handleNextSolution = () => {
    setActiveSolutionIdx((prev) => (prev + 1) % solutions.length);
  };

  const handlePrevSolution = () => {
    setActiveSolutionIdx((prev) => (prev - 1 + solutions.length) % solutions.length);
  };

  useEffect(() => {
    if (isShufflePaused) return;
    const shuffleTimer = setInterval(() => {
      setActiveSolutionIdx((prev) => (prev + 1) % solutions.length);
    }, 2000);
    return () => clearInterval(shuffleTimer);
  }, [isShufflePaused, solutions.length]);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 overflow-x-hidden">
      {/* ======================================================== */}
      {/* 1. HERO SECTION (Matches Screenshot Exactly) */}
      {/* ======================================================== */}
      <section className="relative bg-navy-950 text-white pt-12 pb-24 sm:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle architectural background texture */}
        <div
          className="absolute inset-0 opacity-15 bg-cover bg-center mix-blend-luminosity pointer-events-none"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80")',
          }}
        />

        {/* Ambient gradients */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gold-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-navy-700/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          {/* Company Brand Badge */}
          <div className="inline-flex items-center space-x-2 bg-navy-900/90 border border-gold-500/40 text-gold-300 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest shadow-md backdrop-blur-sm">
            <Building2 className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-gold-300 font-bold tracking-wider">BANASHANKARI ENTERPRISES</span>
            <span className="text-gold-500/50">•</span>
            <span className="text-slate-300 font-normal">Bengaluru</span>
          </div>

          {/* Main Hero Heading with Company Name and Slogan */}
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.15]">
            <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold uppercase tracking-wide bg-gradient-to-r from-amber-200 via-gold-400 to-amber-100 bg-clip-text text-transparent mb-2.5 sm:mb-3 drop-shadow-sm font-sans">
              Banashankari Enterprises
            </span>
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white">
              Your Land. Your Dream Home.
            </span>
            <span className="text-gold-400 italic block font-serif text-3xl sm:text-4xl md:text-5xl mt-1.5 sm:mt-2">
              Our Commitment.
            </span>
            <span className="text-gold-400 italic block font-serif text-3xl sm:text-4xl md:text-5xl mt-1.5 sm:mt-2">
              One Stop Solution for all your Needs
            </span>
          </h1>

          {/* Subtext */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            Discover verified plots, build your turnkey dream residence, and access construction finance with Banashankari Enterprises.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/properties"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-semibold text-sm shadow-gold-glow transition transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
            >
              <span>Explore Properties</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={`tel:${COMPANY_INFO.phone}`}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-navy-900 hover:bg-navy-850 border border-navy-800 text-slate-200 text-sm font-medium transition flex items-center justify-center space-x-2"
            >
              <PhoneCall className="w-4 h-4 text-gold-400" />
              <span>Talk to Ramesh S H (9972536991 / 9880275925) </span>
            </a>
          </div>


        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. OUR ARCHITECTURAL & REAL ESTATE SOLUTIONS (Screenshot Section 1) */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-gold-600 block">
            End-to-End Property Solutions
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-navy-900">
            Our Architectural & Real Estate Solutions
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Delivering transparent property transactions, bespoke home construction, and institutional liaison across Bangalore.
          </p>
        </div>

        {/* ======================================================== */}
        {/* MOBILE LAYOUT: Rotational Card Shuffle Animation (Every 2s) */}
        {/* ======================================================== */}
        <div
          className="sm:hidden relative max-w-sm mx-auto pt-4 pb-6 px-1 select-none"
          onTouchStart={(e) => {
            setIsShufflePaused(true);
            touchStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            setIsShufflePaused(false);
            if (touchStartX.current !== null) {
              const diff = touchStartX.current - e.changedTouches[0].clientX;
              if (diff > 35) {
                // Swiped left -> next card
                handleNextSolution();
              } else if (diff < -35) {
                // Swiped right -> prev card
                handlePrevSolution();
              }
              touchStartX.current = null;
            }
          }}
          onMouseEnter={() => setIsShufflePaused(true)}
          onMouseLeave={() => setIsShufflePaused(false)}
        >
          {/* Side Navigation Buttons (Tapping either side navigates cards) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevSolution();
            }}
            className="absolute -left-2 top-1/2 -translate-y-6 z-20 w-8 h-8 rounded-full bg-white/95 text-navy-950 border border-slate-200 shadow-md flex items-center justify-center hover:bg-gold-500 hover:text-white transition active:scale-90"
            aria-label="Previous solution card"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNextSolution();
            }}
            className="absolute -right-2 top-1/2 -translate-y-6 z-20 w-8 h-8 rounded-full bg-white/95 text-navy-950 border border-slate-200 shadow-md flex items-center justify-center hover:bg-gold-500 hover:text-white transition active:scale-90"
            aria-label="Next solution card"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Fanned-out Rotated Deck Silhouettes for Realistic Card Rotation Effect */}
          <div className="absolute inset-x-4 top-6 bottom-7 bg-slate-200 border border-slate-300 rounded-2xl transform -rotate-3 -translate-x-1.5 translate-y-3 shadow-sm pointer-events-none opacity-60" />
          <div className="absolute inset-x-2 top-5 bottom-6 bg-slate-100 border border-slate-200 rounded-2xl transform rotate-3 translate-x-1.5 translate-y-1.5 shadow-sm pointer-events-none opacity-80" />

          {/* Active Top Card with Rotational Animation Entrance */}
          {(() => {
            const sol = solutions[activeSolutionIdx];
            return (
              <div
                key={sol.id}
                className="relative z-10 bg-white rounded-2xl border-2 border-gold-500/30 shadow-2xl overflow-hidden flex flex-col animate-card-rotate cursor-grab active:cursor-grabbing"
              >
                {/* Image Above Wording (Scaled compact so wording is fully visible on mobile) */}
                <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={sol.image}
                    alt={sol.title}
                    className="w-full h-full object-cover pointer-events-none"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-navy-950/90 text-gold-400 border border-gold-500/30 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                    {sol.category}
                  </div>
                  <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-sm text-navy-950 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm border border-slate-200">
                    {activeSolutionIdx + 1} of {solutions.length}
                  </div>
                </div>

                {/* Content Wording Below Image - Prominently Displayed */}
                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-white">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-navy-950 leading-snug mb-1">
                      {sol.title}
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed font-normal mb-3">
                      {sol.description}
                    </p>

                    <ul className="text-xs text-slate-600 space-y-1.5 mb-3.5 border-t border-slate-100 pt-2.5">
                      {sol.highlights.map((h, i) => (
                        <li key={i} className="flex items-center space-x-1.5 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <Link
                      to={sol.link}
                      className="w-full inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs shadow-md transition"
                    >
                      <span>{sol.linkText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Dot / Pill Indicators to navigate cards */}
          <div className="flex items-center justify-center space-x-2 mt-4">
            {solutions.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setActiveSolutionIdx(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${activeSolutionIdx === idx
                  ? 'w-7 bg-gold-500 shadow-sm'
                  : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                aria-label={`Show ${s.title}`}
              />
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* DESKTOP / BIG SCREEN LAYOUT: Shown Separately in 4 Columns */}
        {/* ======================================================== */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((sol) => (
            <div
              key={sol.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-luxury hover:shadow-luxury-hover hover:border-gold-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              {/* Image Above Wording */}
              <div className="relative h-44 lg:h-48 w-full overflow-hidden bg-slate-100 shrink-0">
                <img
                  src={sol.image}
                  alt={sol.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-2.5 left-2.5 bg-navy-950/90 text-gold-400 border border-gold-500/30 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                  {sol.category}
                </div>
              </div>

              {/* Wording Below Image */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading text-base lg:text-lg font-bold text-navy-900 mb-1.5 leading-snug group-hover:text-gold-600 transition">
                    {sol.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {sol.description}
                  </p>
                  <ul className="text-xs text-slate-500 space-y-1.5 mb-4 border-t border-slate-100 pt-3">
                    {sol.highlights.map((h, i) => (
                      <li key={i} className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={sol.link}
                  className="text-xs font-bold text-navy-900 group-hover:text-gold-600 inline-flex items-center space-x-1 transition mt-auto pt-2 border-t border-slate-50"
                >
                  <span>{sol.linkText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2.4. ABOUT COMPANY & LIVE METRICS (Scroll-Animated Stats) */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-12 shadow-luxury relative overflow-hidden">
          {/* Subtle decorative background accent */}
          <div
            className="absolute top-0 right-0 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="max-w-3xl mb-8 sm:mb-10">
            <div className="inline-flex items-center space-x-2 bg-gold-50 border border-gold-200/80 text-gold-700 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              <span>About Banashankari Enterprises</span>
            </div>
            <h2 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-navy-900 tracking-tight leading-tight mb-3 sm:mb-4">
              {aboutCompanyHeading}
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
              {aboutCompanyText}
            </p>
          </div>

          {/* Metric Counter Cards with Scroll-Animated Increase */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {/* Metric 1: Happy Clients */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-5 lg:p-6 border border-slate-200/90 shadow-sm hover:shadow-luxury hover:border-gold-500/40 transition group">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gold-50 border border-gold-200 text-gold-600 flex items-center justify-center mb-2.5 sm:mb-4 group-hover:scale-105 transition">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-navy-900 tracking-tight mb-1 text-gold-600">
                <AnimatedCounter target={clientsCount} suffix="+" />
              </div>
              <h3 className="font-semibold text-xs sm:text-sm text-navy-900 mb-0.5 sm:mb-1">
                Happy Clients
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed hidden sm:block">
                Families and investors guided with verified property purchases and advisory.
              </p>
            </div>

            {/* Metric 2: Completed Projects */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-5 lg:p-6 border border-slate-200/90 shadow-sm hover:shadow-luxury hover:border-gold-500/40 transition group">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gold-50 border border-gold-200 text-gold-600 flex items-center justify-center mb-2.5 sm:mb-4 group-hover:scale-105 transition">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-navy-900 tracking-tight mb-1 text-gold-600">
                <AnimatedCounter target={completedProjectsCount} suffix="+" />
              </div>
              <h3 className="font-semibold text-xs sm:text-sm text-navy-900 mb-0.5 sm:mb-1">
                Completed Projects
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed hidden sm:block">
                Turnkey residential buildings, plots registered, and civil structures delivered.
              </p>
            </div>

            {/* Metric 3: Years of Experience */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-5 lg:p-6 border border-slate-200/90 shadow-sm hover:shadow-luxury hover:border-gold-500/40 transition group">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gold-50 border border-gold-200 text-gold-600 flex items-center justify-center mb-2.5 sm:mb-4 group-hover:scale-105 transition">
                <Award className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-navy-900 tracking-tight mb-1 text-gold-600">
                <AnimatedCounter target={yearsExperience} suffix="+" />
              </div>
              <h3 className="font-semibold text-xs sm:text-sm text-navy-900 mb-0.5 sm:mb-1">
                Years of Excellence
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed hidden sm:block">
                Continuous ground presence and transparent client advocacy in Bangalore.
              </p>
            </div>

            {/* Metric 4: Verified Title Scrutiny */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-5 lg:p-6 border border-slate-200/90 shadow-sm hover:shadow-luxury hover:border-gold-500/40 transition group">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-2.5 sm:mb-4 group-hover:scale-105 transition">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-navy-900 tracking-tight mb-1 text-emerald-600">
                100%
              </div>
              <h3 className="font-semibold text-xs sm:text-sm text-navy-900 mb-0.5 sm:mb-1">
                Title Transparency
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed hidden sm:block">
                All plots and listings undergo strict BDA, BBMP, and KHB title diligence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2.5. FOUNDER LEADERSHIP SPOTLIGHT (Exact Match to User Reference) */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative group">
          {/* Ambient Under Dark Blue Glow / Shade */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-[#0B132B] to-blue-950 rounded-2xl sm:rounded-3xl blur-xl opacity-75 pointer-events-none" />

          {/* Main Rectangular Container */}
          <div className="relative bg-[#0B132B] border border-gold-500/25 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-12 shadow-2xl overflow-hidden">
            {/* Geometric / Low-Poly Faceted Texture Overlay (Matching Reference Screenshot) */}
            <svg
              className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              aria-hidden="true"
            >
              <defs>
                <pattern id="founder-mesh" width="160" height="160" patternUnits="userSpaceOnUse">
                  <path d="M0 0 L80 40 L160 0 L80 80 Z" fill="none" stroke="#D4AF37" strokeWidth="0.7" opacity="0.35" />
                  <path d="M80 80 L160 0 L160 160 L80 120 Z" fill="none" stroke="#D4AF37" strokeWidth="0.7" opacity="0.3" />
                  <path d="M0 0 L0 160 L80 120 L80 80 Z" fill="none" stroke="#D4AF37" strokeWidth="0.7" opacity="0.3" />
                  <path d="M0 160 L80 120 L160 160 Z" fill="none" stroke="#D4AF37" strokeWidth="0.7" opacity="0.35" />
                  <polygon points="0,0 80,40 0,80" fill="#1B2653" opacity="0.2" />
                  <polygon points="80,40 160,0 160,80" fill="#0B132B" opacity="0.25" />
                  <polygon points="80,80 160,160 80,120" fill="#1B2653" opacity="0.2" />
                  <polygon points="0,80 80,120 0,160" fill="#0B132B" opacity="0.25" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#founder-mesh)" />
            </svg>

            {/* Content Layout: Mobile (Title -> Photo -> Text) vs Laptop (Text on Left, Photo on Right) */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-8 lg:gap-12 items-center">

              {/* MOBILE-ONLY TITLE (Centered at Top above Photo) */}
              <div className="md:hidden text-center">
                <h3 className="font-serif text-lg sm:text-xl text-[#D4AF37] font-medium tracking-wide">
                  Mr. {founderName}, {founderTitle}
                </h3>
              </div>

              {/* PHOTO: In Middle on Mobile, on Right on Laptop/Desktop */}
              <div className="md:order-2 md:col-span-5 flex justify-center">
                <div className="relative w-full max-w-[260px] sm:max-w-[300px] md:max-w-none aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-gold-500/30 bg-[#0F172A] mx-auto group/photo">
                  <img
                    src={founderPhoto}
                    alt={founderName}
                    className="w-full h-full object-cover object-top transition duration-700 group-hover/photo:scale-105"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* TEXT: Below Photo on Mobile, on Left on Laptop/Desktop */}
              <div className="md:order-1 md:col-span-7 space-y-4 lg:space-y-6 text-left">
                {/* DESKTOP-ONLY TITLE (Left-aligned above Paragraphs) */}
                <div className="hidden md:block">
                  <h3 className="font-serif text-2xl lg:text-3xl xl:text-4xl text-[#D4AF37] font-medium tracking-wide leading-snug">
                    Mr. {founderName}, {founderTitle}
                  </h3>
                </div>

                {/* Paragraph 1 */}
                <p className="text-slate-200 text-xs sm:text-sm lg:text-base leading-relaxed sm:leading-relaxed lg:leading-loose font-light">
                  Mr. {founderName}, the founder and Managing Director of Banashankari Enterprises, established the firm with decades of hands-on ground experience in real estate transactions, BDA layout verification, and turnkey residential construction across Bangalore. He holds comprehensive expertise in statutory due diligence and municipal development regulations.
                </p>


              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. FEATURED BENGALURU PROPERTIES (Screenshot Section 2) */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-gold-600 block">
              Handpicked Portfolio
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-navy-900">
              Featured Bengaluru Properties
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real, verified listings ready for immediate site inspection.
            </p>
          </div>

          <Link
            to="/properties"
            className="mt-3 md:mt-0 inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-navy-900 hover:text-gold-600 transition"
          >
            <span>View All Properties ({properties.length || '5+'})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl sm:rounded-2xl h-60 sm:h-80 animate-pulse border border-slate-100 p-3 sm:p-4" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="font-heading font-bold text-lg text-navy-900">No properties published yet</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Properties will appear once approved by the administrator in the moderation queue.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-gold-500 text-white px-5 py-2.5 rounded-lg text-xs font-semibold"
            >
              Contact Our Team
            </Link>
          </div>
        ) : (
          /* Showing two two in mobile view (grid-cols-2) and 3 in laptop view (lg:grid-cols-3) */
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6 lg:gap-8">
            {properties.map((prop) => (
              <PropertyCard key={prop._id} property={prop} />
            ))}
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* 4. WHY HOMEOWNERS PARTNER WITH US (Screenshot Section 3) */}
      {/* ======================================================== */}
      <section className="bg-white py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-12">
            <span className="text-xs font-bold tracking-widest uppercase text-gold-600 block">
              Trust & Professional Standards
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-navy-900">
              Why Bengaluru Homeowners Partner with Banashankari Enterprises
            </h2>
            <p className="text-sm text-slate-600">
              We eliminate middleman ambiguities and deliver end-to-end transparency across every real estate step.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-8">
            <div className="space-y-2 sm:space-y-3 bg-slate-50/70 p-3 sm:p-0 rounded-xl sm:rounded-none sm:bg-transparent">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-navy-900 text-gold-400 flex items-center justify-center font-bold">
                <FileCheck2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h4 className="font-heading font-bold text-xs sm:text-base text-navy-900 leading-tight">
                Title-verified Documentation
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                Prior to publishing, every listing goes through land record checks and layout approval confirmation.
              </p>
            </div>

            <div className="space-y-2 sm:space-y-3 bg-slate-50/70 p-3 sm:p-0 rounded-xl sm:rounded-none sm:bg-transparent">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-navy-900 text-gold-400 flex items-center justify-center font-bold">
                <Users2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h4 className="font-heading font-bold text-xs sm:text-base text-navy-900 leading-tight">
                Personal Contractor Oversight
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                Founder Ramesh S H directly monitors construction execution, contractor compliance, and schedules.
              </p>
            </div>

            <div className="space-y-2 sm:space-y-3 bg-slate-50/70 p-3 sm:p-0 rounded-xl sm:rounded-none sm:bg-transparent">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-navy-900 text-gold-400 flex items-center justify-center font-bold">
                <Banknote className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h4 className="font-heading font-bold text-xs sm:text-base text-navy-900 leading-tight">
                Bank Loan & KHB Guidance
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                Seamless coordination for bank sanctions and statutory KHB documentation without cumbersome delays.
              </p>
            </div>

            <div className="space-y-2 sm:space-y-3 bg-slate-50/70 p-3 sm:p-0 rounded-xl sm:rounded-none sm:bg-transparent">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-navy-900 text-gold-400 flex items-center justify-center font-bold">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h4 className="font-heading font-bold text-xs sm:text-base text-navy-900 leading-tight">
                Transparent Execution
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                No hidden brokerage charges, no surprise project variations, and complete contractual transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. BENGALURU CONSTRUCTION CRAFTSMANSHIP (Screenshot Section 4) */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-gold-600 block">
            Execution Standards
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-navy-900">
            Bengaluru Construction Craftsmanship
          </h2>
          <p className="text-sm text-slate-600">
            Real milestone progress across ongoing and completed residential sites built to endure.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {/* Stage 1 */}
          <div className="relative group rounded-2xl overflow-hidden shadow-luxury aspect-[4/5] bg-navy-950">
            <img
              src="https://images.unsplash.com/photo-1610079732288-72a77bd816c9?q=80&w=2664&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
              alt="Foundation & Structural Framing"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent flex flex-col justify-end p-5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gold-400 mb-1">Stage 01</span>
              <h4 className="font-heading font-bold text-white text-base leading-tight">
                Foundation & Structural Framing
              </h4>
              <p className="text-[11px] text-slate-300 mt-1">Deep footing & Fe550 steel reinforcement</p>
            </div>
          </div>

          {/* Stage 2 */}
          <div className="relative group rounded-2xl overflow-hidden shadow-luxury aspect-[4/5] bg-navy-950">
            <img
              src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80"
              alt="RCC Pouring & Brick Masonry"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent flex flex-col justify-end p-5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gold-400 mb-1">Stage 02</span>
              <h4 className="font-heading font-bold text-white text-base leading-tight">
                RCC Pouring & Brick Masonry
              </h4>
              <p className="text-[11px] text-slate-300 mt-1">Ready-mix concrete with slump testing</p>
            </div>
          </div>

          {/* Stage 3 */}
          <div className="relative group rounded-2xl overflow-hidden shadow-luxury aspect-[4/5] bg-navy-950">
            <img
              src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80"
              alt="Electrical & Plumbing Rough-ins"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent flex flex-col justify-end p-5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gold-400 mb-1">Stage 03</span>
              <h4 className="font-heading font-bold text-white text-base leading-tight">
                Electrical & Plumbing Rough-ins
              </h4>
              <p className="text-[11px] text-slate-300 mt-1">Concealed CPVC lines & fire-retardant wiring</p>
            </div>
          </div>

          {/* Stage 4 */}
          <div className="relative group rounded-2xl overflow-hidden shadow-luxury aspect-[4/5] bg-navy-950">
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80"
              alt="Luxury Interior Fitouts"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent flex flex-col justify-end p-5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gold-400 mb-1">Stage 04</span>
              <h4 className="font-heading font-bold text-white text-base leading-tight">
                Luxury Interior Woodwork
              </h4>
              <p className="text-[11px] text-slate-300 mt-1">Teakwood framing & bespoke finishings</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/construction"
            className="inline-flex items-center space-x-2 bg-navy-900 text-white hover:bg-gold-600 px-6 py-3 rounded-xl text-xs font-semibold shadow transition"
          >
            <span>Request Detailed Construction Estimate & Quotation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. HOW WE HELP YOU BUILD OR INVEST (Screenshot Section 5) */}
      {/* ======================================================== */}
      <section className="bg-cream-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-12">
            <span className="text-xs font-bold tracking-widest uppercase text-gold-600 block">
              Step-by-Step Process
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-navy-900">
              How We Help You Build or Invest
            </h2>
            <p className="text-sm text-slate-600">
              A structured, stress-free path to acquiring property or building your family home.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            <div className="bg-white p-3.5 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-sm relative">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gold-500 text-white font-bold flex items-center justify-center text-[10px] sm:text-xs mb-2 sm:mb-4">
                1
              </div>
              <h4 className="font-heading font-bold text-xs sm:text-base text-navy-900 mb-1 sm:mb-2 leading-tight">Discuss & Inspect</h4>
              <p className="text-[10px] sm:text-xs text-slate-600 leading-relaxed">
                Connect with our team to review preferred locality, plot dimensions, or budget with on-ground visits.
              </p>
            </div>

            <div className="bg-white p-3.5 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-sm relative">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gold-500 text-white font-bold flex items-center justify-center text-[10px] sm:text-xs mb-2 sm:mb-4">
                2
              </div>
              <h4 className="font-heading font-bold text-xs sm:text-base text-navy-900 mb-1 sm:mb-2 leading-tight">Custom Plan</h4>
              <p className="text-[10px] sm:text-xs text-slate-600 leading-relaxed">
                We detail architectural layouts, Vaastu preferences, material finishes, and rental yield expectations.
              </p>
            </div>

            <div className="bg-white p-3.5 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-sm relative">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gold-500 text-white font-bold flex items-center justify-center text-[10px] sm:text-xs mb-2 sm:mb-4">
                3
              </div>
              <h4 className="font-heading font-bold text-xs sm:text-base text-navy-900 mb-1 sm:mb-2 leading-tight">Plan & Price</h4>
              <p className="text-[10px] sm:text-xs text-slate-600 leading-relaxed">
                Receive clear documentation checklists, verified title copies, and itemized construction cost estimations.
              </p>
            </div>

            <div className="bg-white p-3.5 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-sm relative">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gold-500 text-white font-bold flex items-center justify-center text-[10px] sm:text-xs mb-2 sm:mb-4">
                4
              </div>
              <h4 className="font-heading font-bold text-xs sm:text-base text-navy-900 mb-1 sm:mb-2 leading-tight">Execute & Loan</h4>
              <p className="text-[10px] sm:text-xs text-slate-600 leading-relaxed">
                We coordinate bank loan disbursements, KHB paperwork, registration execution, and turnkey site handover.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* ======================================================== */}
      {/* 8. VOICES OF TRUST IN BENGALURU (Screenshot Section 7) */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-gold-600 block">
            Client Experiences
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-navy-900">
            Voices of Trust in Bengaluru
          </h2>
          <p className="text-sm text-slate-600">
            Real feedback from Bangalore families who acquired plots or built homes with us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-luxury flex flex-col justify-between">
            <p className="text-xs text-slate-600 leading-relaxed italic mb-6">
              "Banashankari Enterprises guided us through purchasing our plot in Kenchanahalli with complete title verification. Ramesh S H gave transparent advice on building regulations and bank approvals. Truly refreshing honesty!"
            </p>
            <div className="border-t border-slate-100 pt-4">
              <h5 className="font-bold text-navy-900 text-sm">Anand & Sangeetha K.</h5>
              <p className="text-[11px] text-slate-400">Kenchanahalli, Bangalore</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-luxury flex flex-col justify-between">
            <p className="text-xs text-slate-600 leading-relaxed italic mb-6">
              "We entrusted Ramesh S H with the complete turnkey construction of our 3 BHK duplex home. The structural quality, daily photographic updates, and adherence to agreed budgets exceeded all our family expectations."
            </p>
            <div className="border-t border-slate-100 pt-4">
              <h5 className="font-bold text-navy-900 text-sm">Dr. Manjunath Murthy</h5>
              <p className="text-[11px] text-slate-400">Banashankari 3rd Stage</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-luxury flex flex-col justify-between">
            <p className="text-xs text-slate-600 leading-relaxed italic mb-6">
              "Navigating KHB documentation and bank loan sanctions can be overwhelming in Bangalore. Banashankari Enterprises simplified every single step, cleared our paperwork, and got our loan sanctioned without hassles."
            </p>
            <div className="border-t border-slate-100 pt-4">
              <h5 className="font-bold text-navy-900 text-sm">Bhavana Hegde</h5>
              <p className="text-[11px] text-slate-400">Electronic City, Bangalore</p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 9. CUSTOMER ENQUIRY & CONTACT FORM */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-luxury overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Info column */}
          <div className="lg:col-span-5 bg-navy-950 text-white p-8 sm:p-10 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-gold-400 block">
                Direct Consultation
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold leading-tight">
                Connect with Ramesh S H & Banashankari Enterprises
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                Whether you need assistance with plot purchase, turnkey home construction, rental agreements, or KHB title verification, our team is ready to assist.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center space-x-3 bg-navy-900 p-3 rounded-xl border border-navy-850">
                <PhoneCall className="w-5 h-5 text-gold-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Direct Call</span>
                  <a href={`tel:${COMPANY_INFO.phone}`} className="font-bold text-white hover:text-gold-400 text-sm">
                    {COMPANY_INFO.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-navy-900 p-3 rounded-xl border border-navy-850">
                <Clock className="w-5 h-5 text-gold-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Business Timings</span>
                  <span className="text-white font-medium">Mon - Sat: 9:30 AM – 7:30 PM (IST)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form column */}
          <div className="lg:col-span-7 p-8 sm:p-10">
            <h4 className="font-heading font-bold text-xl text-navy-900 mb-2">Send an Instant Enquiry</h4>
            <p className="text-xs text-slate-500 mb-6">
              Fill in your details below and we will follow up with verified recommendations.
            </p>

            {enquirySuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs leading-relaxed space-y-2">
                <p>{enquirySuccess}</p>
                <div className="pt-1">
                  <Link
                    to="/my-enquiries"
                    className="inline-flex items-center space-x-1 font-bold text-emerald-900 underline hover:text-emerald-700"
                  >
                    <span>Track in My Enquiries →</span>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleQuickEnquiry} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={enquiryForm.customerName}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, customerName: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (10 digits) *</label>
                    <input
                      type="tel"
                      required
                      value={enquiryForm.phone}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                      placeholder="+91 98450 XXXXX"
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={enquiryForm.email}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Service Required *</label>
                    <select
                      value={enquiryForm.category}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, category: e.target.value })}
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                    >
                      <option value="general">General Real Estate Guidance</option>
                      <option value="property">Property Inspection / Purchase</option>
                      <option value="construction">Turnkey Home Construction</option>
                      <option value="loan">Banking Loan Assistance</option>
                      <option value="khb">KHB Documentation Assistance</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Describe Your Requirements
                  </label>
                  <textarea
                    rows={3}
                    value={enquiryForm.message}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                    placeholder="Tell us about the locality, budget, plot size, or specific assistance you need..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={enquirySubmitting}
                  className="w-full bg-gold-500 hover:bg-gold-600 text-white font-semibold py-3 px-6 rounded-xl text-xs shadow-sm transition flex items-center justify-center space-x-2"
                >
                  <span>{enquirySubmitting ? 'Submitting...' : 'Submit Enquiry & Request Call'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 10. FREQUENTLY ASKED QUESTIONS */}
      {/* ======================================================== */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold tracking-widest uppercase text-gold-600 block">
            Clear Answers
          </span>
          <h2 className="font-heading text-3xl font-bold text-navy-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm transition"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex justify-between items-center space-x-4 hover:bg-slate-50 transition"
                >
                  <span className="font-semibold text-sm text-navy-900">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'transform rotate-180 text-gold-600' : ''
                      }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
