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
  Handshake,
  Key,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
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
  const { isAuthenticated, user } = useAuth();
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [settings, setSettings] = useState<ISiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Direct property listing CTA link destination
  const sellerListingLink = !isAuthenticated
    ? '/register'
    : '/sell-property';

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

  // One-Stop Solution Hero Banners Carousel (Services & 15 Years Experience Since 2011)
  const heroServices = [
    {
      id: 'real-estate',
      service: 'Real Estate',
      tagline: 'SURYA NAGAR PHASE 1, 2, 3 & 4 PLOTS & RESIDENCES',
      headline: 'REAL ESTATE & LAND SOLUTIONS',
      description:
        'Verified BDA, BMRDA, and KHB residential plots with 100% clear legal titles, on-ground inspections, and seamless registration assistance.',
      image:
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1920&q=85',
      fallbackImage: '/solutions/plots.jpg',
      link: '/real-estate',
      linkText: 'Explore Real Estate',
      experience: '15 Years of Experience Since 2011',
    },
    {
      id: 'construction',
      service: 'Construction',
      tagline: 'GET YOUR DREAM HOME CONSTRUCTED BY THE EXPERTS',
      headline: 'A RESIDENTIAL CONSTRUCTION COMPANY',
      description:
        'Turnkey architectural design, municipal plan sanctions, structural RCC execution, and bespoke interior finishes delivered with transparent itemized billing.',
      image:
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85',
      fallbackImage: '/solutions/construction.jpg',
      link: '/construction',
      linkText: 'Explore Construction',
      experience: '15 Years of Experience Since 2011',
    },
    {
      id: 'khb-services',
      service: 'KHB Property Services',
      tagline: 'STATUTORY HOUSING BOARD DOCUMENTATION & TRANSFERS',
      headline: 'KHB PROPERTY SERVICES',
      description:
        'Official procedural guidance for Karnataka Housing Board allotments, title deed scrutiny, ownership transfers, and encumbrance checks.',
      image:
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=85',
      fallbackImage: '/solutions/plots.jpg',
      link: '/khb-property-services',
      linkText: 'Explore KHB Services',
      experience: '15 Years of Experience Since 2011',
    },
    {
      id: 'loans',
      service: 'Loans Made Easy',
      tagline: 'HASSLE-FREE MULTI-BANK HOME & PLOT FINANCING',
      headline: 'LOANS MADE EASY',
      description:
        'Pre-qualification checks, documentation compilation, and dedicated liaison with SBI, HDFC, Canara Bank, and ICICI for fast-track loan approvals.',
      image:
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=85',
      fallbackImage: '/solutions/loan.jpg',
      link: '/loans-made-easy',
      linkText: 'Explore Loan Assistance',
      experience: '15 Years of Experience Since 2011',
    },
  ];

  const [activeBannerIdx, setActiveBannerIdx] = useState(0);
  const [isBannerPaused, setIsBannerPaused] = useState(false);
  const bannerTouchStartX = useRef<number | null>(null);

  const handleNextBanner = () => {
    setActiveBannerIdx((prev) => (prev + 1) % heroServices.length);
  };

  const handlePrevBanner = () => {
    setActiveBannerIdx((prev) => (prev - 1 + heroServices.length) % heroServices.length);
  };

  useEffect(() => {
    if (isBannerPaused) return;
    const bannerTimer = setInterval(() => {
      setActiveBannerIdx((prev) => (prev + 1) % heroServices.length);
    }, 4500);
    return () => clearInterval(bannerTimer);
  }, [isBannerPaused, heroServices.length]);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 overflow-x-hidden">
      {/* ======================================================== */}
      {/* 1. HERO SECTION (Transparent with Clear Background Image Behind) */}
      {/* ======================================================== */}
      <section className="relative bg-transparent text-white pt-4 sm:pt-6 lg:pt-8 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8">

        {/* MOBILE & TABLET LAYOUT (< lg: 1024px): Centered Vertical Stack matching mobile view */}
        <div className="lg:hidden relative max-w-xl mx-auto text-center space-y-5 sm:space-y-6 bg-black/45 backdrop-blur-md p-5 sm:p-8 rounded-3xl border border-gold-500/25 shadow-2xl">
          {/* Main Hero Heading in Gold Color */}
          <h1 className="font-heading text-2xl xs:text-3xl sm:text-4xl font-extrabold tracking-tight text-gold-400 leading-tight">
            Buy and Build Your Dream House with Expert Guidance!
          </h1>

          {/* Subtext / Description */}
          <p className="text-sm sm:text-base text-slate-100 font-normal leading-relaxed drop-shadow-sm">
            Looking to buy a property, build your dream home, or explore real estate opportunities in KHB Surya nagar Phase 1, 2, 3 and 4. Get trusted and expert guidance from Ramesh S H, your reliable partner in Real Estate and Construction.
          </p>

          {/* Founder Image (Square & Bigger) above Contact/Enquiry Button */}
          <div className="flex flex-col items-center justify-center pt-2">
            <div className="relative group">
              <div className="w-48 h-48 xs:w-52 xs:h-52 sm:w-60 sm:h-60 rounded-2xl overflow-hidden border-2 sm:border-3 border-gold-400 shadow-2xl shadow-black/50 ring-4 ring-gold-500/20 bg-navy-900">
                <img
                  src={founderPhoto}
                  alt={founderName}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-navy-950/95 border border-gold-400 text-gold-300 px-4 py-1 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap shadow-lg">
                {founderName}
              </div>
            </div>
            <p className="text-xs text-gold-400 font-semibold mt-4 tracking-wide">
              {founderTitle}
            </p>
          </div>

          {/* Enquiry Now Button (Reddish Brown, in Middle, Links to Contact Page) */}
          <div className="flex items-center justify-center pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl text-white font-bold text-sm sm:text-base bg-[#8B2613] hover:bg-[#731E0E] active:scale-95 transition-all duration-200 shadow-xl shadow-red-950/40 hover:shadow-2xl border border-red-900/40 transform hover:-translate-y-0.5 space-x-2"
            >
              <span>Enquiry Now</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
            </Link>
          </div>
        </div>

        {/* LAPTOP & DESKTOP LAYOUT (>= lg: 1024px): 2-Column Balanced Luxury Grid */}
        <div className="hidden lg:block relative max-w-6xl xl:max-w-7xl mx-auto bg-black/45 backdrop-blur-md p-8 lg:p-10 xl:p-12 rounded-3xl border border-gold-500/25 shadow-2xl">
          <div className="grid grid-cols-12 gap-8 xl:gap-12 items-center">
            {/* Left Column (7 cols): Heading, Paragraph, Trust Badges, Enquiry Now Button */}
            <div className="col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center space-x-2 bg-gold-500/20 border border-gold-400/40 px-3.5 py-1 rounded-full text-gold-300 text-xs font-semibold tracking-wide shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span>KHB Surya nagar Specialist & Turnkey Construction</span>
              </div>

              <h1 className="font-heading text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-gold-400 leading-tight">
                Buy and Build Your Dream House with Expert Guidance!
              </h1>

              <p className="text-base xl:text-lg text-slate-100 font-normal leading-relaxed drop-shadow-sm max-w-2xl">
                Looking to buy a property, build your dream home, or explore real estate opportunities in KHB Surya nagar Phase 1, 2, 3 and 4. Get trusted and expert guidance from Ramesh S H, your reliable partner in Real Estate and Construction.
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-200">
                <span className="inline-flex items-center space-x-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/15">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />
                  <span>KHB Phase 1, 2, 3 & 4 Specialist</span>
                </span>
                <span className="inline-flex items-center space-x-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/15">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />
                  <span>100% Clear Title Verification</span>
                </span>
                <span className="inline-flex items-center space-x-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/15">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />
                  <span>Turnkey Home Construction</span>
                </span>
              </div>

              {/* Enquiry Now Button */}
              <div className="pt-2">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 xl:px-10 py-3.5 xl:py-4 rounded-xl text-white font-bold text-sm xl:text-base bg-[#8B2613] hover:bg-[#731E0E] active:scale-95 transition-all duration-200 shadow-xl shadow-red-950/40 hover:shadow-2xl border border-red-900/40 transform hover:-translate-y-0.5 space-x-2 group"
                >
                  <span>Enquiry Now</span>
                  <ArrowRight className="w-4 h-4 xl:w-5 xl:h-5 text-amber-300 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right Column (5 cols): Square Framed Founder Photo with Gold Border and Badges */}
            <div className="col-span-5 flex flex-col items-center justify-center">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gold-500/20 rounded-3xl blur-xl opacity-60 group-hover:opacity-90 transition duration-300 pointer-events-none" />

                <div className="relative w-64 h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 rounded-2xl overflow-hidden border-3 border-gold-400 shadow-2xl shadow-black/70 ring-4 ring-gold-500/20 bg-navy-900">
                  <img
                    src={founderPhoto}
                    alt={founderName}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-navy-950/95 border border-gold-400 text-gold-300 px-4 xl:px-5 py-1 xl:py-1.5 rounded-full text-xs xl:text-sm font-bold uppercase tracking-wider whitespace-nowrap shadow-xl">
                  {founderName}
                </div>
              </div>

              <p className="text-xs xl:text-sm text-gold-400 font-semibold mt-5 tracking-wide text-center">
                {founderTitle}
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* ======================================================== */}
      {/* 2. ONE-STOP SOLUTION FOR ALL REAL ESTATE & CONSTRUCTION NEEDS */}
      {/* ======================================================== */}
      <section className="w-full bg-[#F5ECE1] py-12 sm:py-16 lg:py-20 border-y border-[#E2D2BF]/80 shadow-xs">

        {/* HEADING / TOPIC (Centered container) */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 mb-8 sm:mb-12">

          <h2 className="font-heading text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-950 tracking-tight leading-tight">
            Our One-Stop Solution for All Real Estate & Construction Needs!
          </h2>
        </div>

        {/* HERO BANNERS (Fully Covered Right and Left: w-full edge-to-edge, Arrows removed) */}
        <div
          className="relative w-full overflow-hidden shadow-2xl group select-none min-h-[400px] sm:min-h-[460px] lg:min-h-[520px] flex items-center justify-center bg-navy-950"
          onMouseEnter={() => setIsBannerPaused(true)}
          onMouseLeave={() => setIsBannerPaused(false)}
          onTouchStart={(e) => {
            setIsBannerPaused(true);
            bannerTouchStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            setIsBannerPaused(false);
            if (bannerTouchStartX.current !== null) {
              const diff = bannerTouchStartX.current - e.changedTouches[0].clientX;
              if (diff > 35) handleNextBanner();
              else if (diff < -35) handlePrevBanner();
              bannerTouchStartX.current = null;
            }
          }}
        >
          {heroServices.map((slide, idx) => {
            const isActive = activeBannerIdx === idx;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                  }`}
              >
                {/* Background Image */}
                <img
                  src={slide.image}
                  alt={slide.headline}
                  className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-1000"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = slide.fallbackImage;
                  }}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />

                {/* Dark Twilight Ambient Overlay matching the Reference Image */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/65 to-navy-950/45" />

                {/* Top Corner Milestone Badge on the Banner */}
                <div className="absolute top-4 sm:top-6 right-4 sm:right-8 z-20">
                  <span className="inline-flex items-center space-x-1.5 bg-black/60 backdrop-blur-md border border-gold-400/40 text-gold-300 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                    <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                    <span>15 Years Experience Since 2011</span>
                  </span>
                </div>

                {/* Service Category Tag on Top Left */}
                <div className="absolute top-4 sm:top-6 left-4 sm:left-8 z-20">
                  <span className="inline-flex items-center bg-gold-500/20 backdrop-blur-md border border-gold-400/40 text-gold-300 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                    {slide.service}
                  </span>
                </div>

                {/* Centered Content Typography (Matches Reference Screenshot Structure) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 sm:px-12 lg:px-20 z-10 max-w-4xl mx-auto space-y-3 sm:space-y-4">
                  {/* Small Subtitle in All Caps with Wide Tracking */}
                  <p className="font-sans font-semibold text-[11px] sm:text-xs md:text-sm uppercase tracking-[0.2em] sm:tracking-[0.25em] text-gold-300 drop-shadow-md">
                    {slide.tagline}
                  </p>

                  {/* Main Bold Headline */}
                  <h3 className="font-heading font-extrabold text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-wider leading-tight drop-shadow-xl">
                    {slide.headline}
                  </h3>

                  {/* Description Paragraph */}
                  <p className="text-xs sm:text-sm md:text-base text-slate-100 font-light leading-relaxed max-w-2xl drop-shadow-md hidden xs:block">
                    {slide.description}
                  </p>

                  {/* Action Link Button */}
                  <div className="pt-2">
                    <Link
                      to={slide.link}
                      className="inline-flex items-center space-x-2 px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-xl bg-gold-500 hover:bg-gold-600 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-xl shadow-gold-950/40 border border-gold-400/40 transition transform hover:-translate-y-0.5 group/btn"
                    >
                      <span>{slide.linkText}</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Dash / Pill Indicators at Bottom Center (Exact match to reference photo '— — — —', Arrows removed) */}
          <div className="absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2 sm:space-x-3">
            {heroServices.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveBannerIdx(idx)}
                className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${activeBannerIdx === idx
                  ? 'w-8 sm:w-12 bg-gold-400 shadow-md ring-1 ring-gold-300'
                  : 'w-4 sm:w-6 bg-white/40 hover:bg-white/70'
                  }`}
                aria-label={`Show ${heroServices[idx].service} slide`}
              />
            ))}
          </div>
        </div>

        {/* CONTENT (Centered with max-w-4xl, directly below the edge-to-edge Hero Banner) */}
        <div className="mt-8 sm:mt-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#E2D2BF] shadow-luxury text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>

            <p className="text-base sm:text-lg lg:text-xl text-slate-800 font-medium leading-relaxed max-w-3xl mx-auto font-sans">
              <strong className="text-navy-950 font-bold">Ramesh S H</strong> provides complete expert guidance and support under one roof for all KHB properties in Surya Nagar Phase 1, 2, 3 and 4. We make your property journey simple, convenient and hassle-free, guiding you every step of the way.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-semibold text-slate-700">
              <span className="inline-flex items-center space-x-1.5 bg-[#FAF5EE] border border-[#E2D2BF] px-3.5 py-1.5 rounded-lg shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Surya Nagar Phase 1, 2, 3 & 4 Specialist</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 bg-[#FAF5EE] border border-[#E2D2BF] px-3.5 py-1.5 rounded-lg shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>15+ Years Experience Since 2011</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 bg-[#FAF5EE] border border-[#E2D2BF] px-3.5 py-1.5 rounded-lg shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Direct Guidance from Ramesh S H</span>
              </span>
            </div>
          </div>
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
      {/* PARTNERSHIP SECTION: SELL LAND, HOUSE, RENT & LEASE */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 text-white overflow-hidden p-6 sm:p-10 lg:p-12 border border-gold-500/30 shadow-2xl">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Section Heading & Introduction */}
          <div className="relative z-10 max-w-3xl space-y-3 mb-8 sm:mb-10 text-center sm:text-left">
            <div className="inline-flex items-center space-x-2 bg-gold-500/15 border border-gold-500/40 text-gold-300 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase">
              <Handshake className="w-4 h-4 text-gold-400" />
              <span>Owner & Seller Partnership</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Partner With Us to Sell, Rent & Lease Your Properties
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              Our company helps you sell your land, independent house, or find dependable tenants for rent and lease. You can also showcase and list your properties directly on our website to reach thousands of verified buyers and active tenants across Bangalore.
            </p>
          </div>

          {/* 4 Feature Columns: Land, House, Rent & Lease, Website Showcase */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
            {/* 1. Sell Land & Plots */}
            <div className="bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 hover:border-gold-500/50 rounded-2xl p-5 transition duration-300 transform hover:-translate-y-1 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-gold-500/20 border border-gold-500/30 text-gold-400 flex items-center justify-center mb-3.5 shadow-sm">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-white mb-2">
                  Sell Your Land & Plots
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Fast-track genuine buyers for BDA, BMRDA, DC-converted, and residential layout sites with complete title diligence and verification.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center space-x-1.5 text-[11px] font-semibold text-gold-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Immediate Buyer Match</span>
              </div>
            </div>

            {/* 2. Sell House & Villas */}
            <div className="bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 hover:border-gold-500/50 rounded-2xl p-5 transition duration-300 transform hover:-translate-y-1 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-gold-500/20 border border-gold-500/30 text-gold-400 flex items-center justify-center mb-3.5 shadow-sm">
                  <Home className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-white mb-2">
                  Sell Your House & Villas
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Showcase independent houses, duplex villas, and residential buildings to serious Bangalore buyers with transparent fair market pricing.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center space-x-1.5 text-[11px] font-semibold text-gold-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Guided Site Inspections</span>
              </div>
            </div>

            {/* 3. Rent & Lease */}
            <div className="bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 hover:border-gold-500/50 rounded-2xl p-5 transition duration-300 transform hover:-translate-y-1 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-gold-500/20 border border-gold-500/30 text-gold-400 flex items-center justify-center mb-3.5 shadow-sm">
                  <Key className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-white mb-2">
                  Rent & Lease Spaces
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Connect with screened, verified tenants for apartments, homes, and commercial units with structured rental agreements and deposit support.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center space-x-1.5 text-[11px] font-semibold text-gold-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Verified Tenant Vetting</span>
              </div>
            </div>

            {/* 4. Showcase on Our Website */}
            <div className="bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 hover:border-gold-500/50 rounded-2xl p-5 transition duration-300 transform hover:-translate-y-1 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-gold-500/20 border border-gold-500/30 text-gold-400 flex items-center justify-center mb-3.5 shadow-sm">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-white mb-2">
                  Showcase on Our Website
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  List directly on Banashankari Enterprises with photographs, dimension details, and neighborhood perks to get instant high-intent inquiries.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center space-x-1.5 text-[11px] font-semibold text-gold-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>High Digital Visibility</span>
              </div>
            </div>
          </div>

          {/* Action Strip: Trust Highlights and "List the Properties" Button */}
          <div className="relative z-10 pt-6 border-t border-white/10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 text-xs text-slate-300">

              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Zero Hidden Fees or Markups</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Instant Seller Registration</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Link
                to={sellerListingLink}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold text-sm shadow-gold-glow transition transform hover:-translate-y-0.5"
              >
                <span>List the Properties</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
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

    </div>
  );
};
