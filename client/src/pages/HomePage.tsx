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
import { useSettings } from '../context/SettingsContext';
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
  const { phone, phoneCallUrl, clientsCount, completedProjectsCount, yearsExperience, settings } = useSettings();
  const [properties, setProperties] = useState<IProperty[]>([]);
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
        const propsRes: any = await api.get('/properties?limit=6').catch(() => ({ success: false, data: [] }));
        if (propsRes.success && propsRes.data) {
          setProperties(propsRes.data);
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
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85',
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
    <div className="w-full flex flex-col space-y-12 sm:space-y-16 lg:space-y-20 pb-20 overflow-x-hidden">
      {/* ======================================================== */}
      {/* 1. HERO SECTION (Transparent with Clear Background Image Behind) */}
      {/* ======================================================== */}
      <section className="relative w-full bg-transparent text-white pt-4 sm:pt-6 lg:pt-8 pb-10 sm:pb-14 lg:pb-16 px-3 sm:px-6 lg:px-10 xl:px-14">

        {/* MOBILE & TABLET LAYOUT (< lg: 1024px): Centered Vertical Stack matching mobile view */}
        <div className="lg:hidden relative w-full mx-auto text-center space-y-5 sm:space-y-6 bg-black/45 backdrop-blur-md p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-gold-500/25 shadow-2xl">
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
        <div className="hidden lg:block relative w-full mx-auto bg-black/45 backdrop-blur-md p-8 lg:p-10 xl:p-12 rounded-2xl sm:rounded-3xl border border-gold-500/25 shadow-2xl">
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

        {/* HEADING / TOPIC (Full width centered) */}
        <div className="w-full px-4 sm:px-6 lg:px-8 text-center space-y-3 mb-8 sm:mb-12">

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

        {/* CONTENT (Covering full width right and left) */}
        <div className="mt-8 sm:mt-12 w-full px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="relative w-full bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#E2D2BF] shadow-luxury text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>

            <p className="text-base sm:text-lg lg:text-xl text-slate-800 font-medium leading-relaxed max-w-4xl mx-auto font-sans">
              <strong className="text-navy-950 font-bold">Ramesh S H</strong> provides complete expert guidance and support under one roof for all KHB properties in Surya Nagar Phase 1, 2, 3 and 4. We make your property journey simple, convenient and hassle-free, guiding you every step of the way.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-semibold text-slate-700">
              <span className="inline-flex items-center space-x-1.5 bg-[#FAF5EE] border border-[#E2D2BF] px-3.5 py-1.5 rounded-lg shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Surya Nagar Phase 1, 2, 3 & 4 Specialist</span>
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
      {/* 2.4. ABOUT COMPANY & LIVE METRICS (Covering full width right and left) */}
      {/* ======================================================== */}
      <section className="w-full bg-gradient-to-b from-slate-50 via-white to-slate-50 border-y border-slate-200/90 py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-12 xl:px-16 shadow-xs relative overflow-hidden">
        {/* Subtle decorative background accent */}
        <div
          className="absolute top-0 right-0 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="w-full relative z-10">
          <div className="w-full mb-8 sm:mb-10 text-center sm:text-left">
            <div className="inline-flex items-center space-x-2 bg-gold-50 border border-gold-200/80 text-gold-700 px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4 shadow-sm">
              <Award className="w-3.5 h-3.5 text-gold-600" />
              <span>Proven Track Record Since 2011</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-navy-900 tracking-tight leading-tight mb-3 sm:mb-4">
              Most Trusted Real Estate & Construction Partner Since 2011!
            </h2>
            <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-4xl">
              With {yearsExperience} years of experience in the real estate and construction industry, <strong className="text-navy-950 font-semibold">Ramesh S H</strong> is committed on helping customers make confident property decisions through buying, construction, rental, lease and property loan assistance.
            </p>

            {/* Core Decision Pillars mentioned in text */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4">
              {['Property Buying', 'Turnkey Construction', 'House Rentals', 'Property Leases', 'Home Loan Assistance'].map((pillar) => (
                <span
                  key={pillar}
                  className="inline-flex items-center space-x-1.5 bg-white border border-slate-200/90 text-navy-900 font-semibold text-xs px-3 py-1.5 rounded-lg shadow-2xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{pillar}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Metric Counter Cards with Scroll-Animated Increase */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 w-full">
            {/* Metric 1: Happy Clients */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-slate-200/90 shadow-sm hover:shadow-luxury hover:border-gold-500/40 transition group">
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
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-slate-200/90 shadow-sm hover:shadow-luxury hover:border-gold-500/40 transition group">
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
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-slate-200/90 shadow-sm hover:shadow-luxury hover:border-gold-500/40 transition group">
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
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-slate-200/90 shadow-sm hover:shadow-luxury hover:border-gold-500/40 transition group">
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
      {/* 3. AFFORDABLE PROPERTIES & SUPERIOR CONSTRUCTION (Covering full width) */}
      {/* ======================================================== */}
      <section className="w-full bg-white/95 backdrop-blur-md py-12 sm:py-16 lg:py-20 border-y border-slate-200/90 px-4 sm:px-8 lg:px-12 xl:px-16 shadow-xs">
        <div className="w-full text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-amber-50 border border-amber-200 text-amber-700 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>Value, Quality & Reliability</span>
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-navy-900 tracking-tight leading-tight">
            Affordable Properties. Superior Construction. Timely Delivery!
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed font-normal max-w-4xl mx-auto">
            We help you find the right property at a reasonable price and turn it into your dream home with quality construction, reliable workmanship and a commitment to timely delivery.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-semibold text-slate-700">
            <span className="inline-flex items-center space-x-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Affordable Pricing</span>
            </span>
            <span className="inline-flex items-center space-x-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Superior Construction</span>
            </span>
            <span className="inline-flex items-center space-x-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Timely Delivery</span>
            </span>
          </div>
        </div>
      </section>



      {/* ======================================================== */}
      {/* 3.5. LOAN GUIDANCE SECTION */}
      {/* ======================================================== */}
      <section className="w-full bg-[#FAF7F2] py-14 sm:py-20 border-y border-[#E8DFD3] px-4 sm:px-8 lg:px-12 xl:px-16 shadow-xs relative overflow-hidden">
        {/* Subtle decorative background accent */}
        <div
          className="absolute -top-12 -right-12 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="w-full relative z-10 text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Banknote className="w-4 h-4 text-emerald-600" />
            <span>Multi-Bank Loan Assistance</span>
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-navy-900 tracking-tight leading-tight max-w-4xl mx-auto">
            The Right Loan Guidance for Your Dream Property!
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed font-normal max-w-4xl mx-auto">
            We help you understand the home loan process, documentation requirements and explore suitable loan options with competitive interest rates from available financial institutions.
          </p>

          {/* Key Loan Pillars */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 text-left max-w-6xl mx-auto">
            <div className="bg-white rounded-xl sm:rounded-2xl p-5 border border-[#E8DFD3] shadow-sm hover:shadow-luxury transition">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mb-3">
                <Banknote className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-sm sm:text-base text-navy-900 mb-1">
                Home & Plot Loans
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Structured financing for KHB plots, residential sites, independent villas, and home construction.
              </p>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-5 border border-[#E8DFD3] shadow-sm hover:shadow-luxury transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-3">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-sm sm:text-base text-navy-900 mb-1">
                Documentation Check
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Complete assistance compiling title deeds, Encumbrance Certificates, KYC, and builder agreements.
              </p>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-5 border border-[#E8DFD3] shadow-sm hover:shadow-luxury transition">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-sm sm:text-base text-navy-900 mb-1">
                Competitive Rates
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Direct coordination across SBI, HDFC, Canara Bank, and ICICI to find suitable borrowing terms.
              </p>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-5 border border-[#E8DFD3] shadow-sm hover:shadow-luxury transition">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-sm sm:text-base text-navy-900 mb-1">
                Fast-Track Sanction
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pre-qualification checks and institutional follow-ups to minimize disbursement waiting times.
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/loans-made-easy"
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-navy-900 hover:bg-gold-600 text-white font-bold text-xs sm:text-sm shadow-md transition transform hover:-translate-y-0.5"
            >
              <span>Explore Loan Assistance</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* PARTNERSHIP SECTION: SELL LAND, HOUSE, RENT & LEASE */}
      {/* ======================================================== */}
      <section className="w-full bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 text-white py-14 sm:py-20 px-4 sm:px-8 lg:px-12 xl:px-16 border-y border-gold-500/30 relative overflow-hidden shadow-2xl">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full relative z-10">
          {/* Section Heading & Introduction */}
          <div className="max-w-4xl space-y-3 mb-8 sm:mb-10 text-center sm:text-left">
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





          </div>
        </div>
      </section>



      {/* ======================================================== */}
      {/* 9. CUSTOMER ENQUIRY & CONTACT FORM */}
      {/* ======================================================== */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-luxury overflow-hidden grid grid-cols-1 lg:grid-cols-12">
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
                  <a href={phoneCallUrl} className="font-bold text-white hover:text-gold-400 text-sm">
                    {phone}
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
