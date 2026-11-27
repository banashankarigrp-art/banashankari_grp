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
import { useLanguage } from '../context/LanguageContext';
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
  const { language, isKn, t } = useLanguage();
  const [properties, setProperties] = useState<IProperty[]>([]);
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
    if (enquiryForm.phone.length !== 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    try {
      setEnquirySubmitting(true);
      const res: any = await api.post('/enquiries', {
        category: enquiryForm.category,
        customerName: enquiryForm.customerName,
        phone: `+91 ${enquiryForm.phone}`,
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
      id: 'hero-founder',
      service: t('hero.badge', 'YOUR DREAM HOUSE'),
      tagline: isKn ? 'ರಮೇಶ್ ಎಸ್ ಹೆಚ್ ಅವರಿಂದ ನೇರ ಮಾರ್ಗದರ್ಶನ' : 'DIRECT GUIDANCE FROM RAMESH S H',
      headline: t('hero.title', 'Buy and Build Your Dream House with Expert Guidance!'),
      description: t(
        'hero.description',
        'Looking to buy a property, build your dream home,or explore real estate opportunities in KHB Suryanagar Phase 1, 2, 3 and 4.Get trusted and expert guidance from Ramesh S H, your reliable partner in Real Estate and Construction.'
      ),
      image: '/site-bg.jpg',
      fallbackImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85',
      link: '/contact',
      linkText: t('common.enquiry_now', 'Enquiry Now'),
      experience: isKn ? '2011 ರಿಂದ 15 ವರ್ಷಗಳ ಅನುಭವ' : '15 Years of Experience Since 2011',
    },
    {
      id: 'real-estate',
      service: t('banner.real_estate_service', 'Real Estate'),
      tagline: t('banner.real_estate_tagline', 'SURYANAGAR PHASE 1, 2, 3 & 4 PLOTS & RESIDENCES'),
      headline: t('banner.real_estate_headline', 'REAL ESTATE & LAND SOLUTIONS'),
      description: t(
        'banner.real_estate_desc',
        'Verified KHB residential plots with 100% clear legal titles, on-ground inspections, and seamless registration assistance.'
      ),
      image:
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1920&q=85',
      fallbackImage: '/solutions/plots.jpg',
      link: '/real-estate',
      linkText: t('nav.real_estate', 'Explore Real Estate'),
      experience: isKn ? '2011 ರಿಂದ 15 ವರ್ಷಗಳ ಅನುಭವ' : '15 Years of Experience Since 2011',
    },
    {
      id: 'construction',
      service: t('banner.construction_service', 'Construction'),
      tagline: t('banner.construction_tagline', 'GET YOUR DREAM HOME CONSTRUCTED BY THE EXPERTS'),
      headline: t('banner.construction_headline', 'A RESIDENTIAL CONSTRUCTION COMPANY'),
      description: t(
        'banner.construction_desc',
        'Turnkey architectural design, municipal plan sanctions, structural RCC execution, and bespoke interior finishes delivered with transparent itemized billing.'
      ),
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85',
      link: '/construction',
      linkText: t('nav.construction', 'Explore Construction'),
      experience: isKn ? '2011 ರಿಂದ 15 ವರ್ಷಗಳ ಅನುಭವ' : '15 Years of Experience Since 2011',
    },
    {
      id: 'khb-services',
      service: t('banner.khb_service', 'KHB Property Services'),
      tagline: t('banner.khb_tagline', 'STATUTORY HOUSING BOARD DOCUMENTATION & TRANSFERS'),
      headline: t('banner.khb_headline', 'KHB PROPERTY SERVICES'),
      description: t(
        'banner.khb_desc',
        'Official procedural guidance for Karnataka Housing Board allotments, title deed scrutiny, ownership transfers, and encumbrance checks.'
      ),
      image:
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=85',
      fallbackImage: '/solutions/plots.jpg',
      link: '/khb-property-services',
      linkText: t('nav.khb_services', 'Explore KHB Services'),
      experience: isKn ? '2011 ರಿಂದ 15 ವರ್ಷಗಳ ಅನುಭವ' : '15 Years of Experience Since 2011',
    },
    {
      id: 'loans',
      service: t('banner.loans_service', 'Loans Made Easy'),
      tagline: t('banner.loans_tagline', 'HASSLE-FREE MULTI-BANK HOME & PLOT FINANCING'),
      headline: t('banner.loans_headline', 'LOANS MADE EASY'),
      description: t(
        'banner.loans_desc',
        'Pre-qualification checks, documentation compilation, and dedicated liaison with SBI, HDFC, Canara Bank, and ICICI for fast-track loan approvals.'
      ),
      image:
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=85',
      fallbackImage: '/solutions/loan.jpg',
      link: '/loans-made-easy',
      linkText: t('loan_guidance.cta', 'Explore Loan Assistance'),
      experience: isKn ? '2011 ರಿಂದ 15 ವರ್ಷಗಳ ಅನುಭವ' : '15 Years of Experience Since 2011',
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
      {/* 1. HERO BANNERS CAROUSEL (Edge-to-Edge Full Width, Hero Section as 1st Banner) */}
      {/* ======================================================== */}
      <section className="relative w-full">
        <div
          className="relative w-full overflow-hidden shadow-2xl group select-none min-h-[460px] sm:min-h-[520px] lg:min-h-[560px] xl:min-h-[600px] flex items-center justify-center bg-navy-950"
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
            const isFounderSlide = slide.id === 'hero-founder';

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

                {/* Dark Twilight Ambient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/70 to-navy-950/50" />

                {/* Service Category Tag on Top Left */}
                <div className="absolute top-4 sm:top-6 left-4 sm:left-8 z-20">
                  <span className="inline-flex items-center bg-gold-500/20 backdrop-blur-md border border-gold-400/40 text-gold-300 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                    {slide.service}
                  </span>
                </div>

                {/* Slide Content */}
                {isFounderSlide ? (
                  /* 1st Banner: Hero Section with Ramesh S H and Enquiry Now */
                  <div className="absolute inset-0 flex items-center justify-center z-10 px-4 sm:px-8 lg:px-14 xl:px-20 py-8 sm:py-10">
                    {/* Desktop & Tablet (lg+): 2-Column Luxury Grid */}
                    <div className="hidden lg:grid grid-cols-12 gap-8 xl:gap-12 items-center w-full max-w-6xl mx-auto">
                      {/* Left: Heading, Paragraph, Trust Badges, Enquiry Now Button */}
                      <div className="col-span-7 space-y-4 xl:space-y-5 text-left">
                        <p className="font-sans font-semibold text-xs uppercase tracking-[0.2em] text-gold-300 drop-shadow-md">
                          {slide.tagline}
                        </p>

                        <h2 className="font-heading font-extrabold text-2xl xl:text-4xl text-gold-400 uppercase tracking-wide leading-tight drop-shadow-xl">
                          {slide.headline}
                        </h2>

                        <p className="text-xs xl:text-sm text-slate-100 font-light leading-relaxed max-w-2xl drop-shadow-md">
                          {slide.description}
                        </p>

                        {/* Trust Badges */}
                       { /* <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-200">
                          <span className="inline-flex items-center space-x-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/15">
                            <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />
                            <span>{t('hero.badge_khb', 'KHB Phase 1, 2, 3 & 4 Specialist')}</span>
                          </span>
                          <span className="inline-flex items-center space-x-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/15">
                            <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />
                            <span>{t('hero.badge_title', '100% Clear Title Verification')}</span>
                          </span>
                          <span className="inline-flex items-center space-x-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/15">
                            <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />
                            <span>{t('hero.badge_construction', 'Turnkey Home Construction')}</span>
                          </span>
                        </div>
                       */}

                        {/* Enquiry Now Button */}
                        <div className="pt-2">
                          <Link
                            to="/contact"
                            className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-white font-bold text-xs sm:text-sm bg-[#8B2613] hover:bg-[#731E0E] active:scale-95 transition-all duration-200 shadow-xl shadow-red-950/40 hover:shadow-2xl border border-red-900/40 transform hover:-translate-y-0.5 space-x-2 group"
                          >
                            <span>{t('common.enquiry_now', 'Enquiry Now')}</span>
                            <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>

                      {/* Right: Founder Photo */}
                      <div className="col-span-5 flex flex-col items-center justify-center">
                        <div className="relative group">
                          <div className="absolute -inset-2 bg-gold-500/20 rounded-3xl blur-xl opacity-60 group-hover:opacity-90 transition duration-300 pointer-events-none" />
                          <div className="relative w-52 h-52 xl:w-64 xl:h-64 rounded-2xl overflow-hidden border-3 border-gold-400 shadow-2xl shadow-black/70 ring-4 ring-gold-500/20 bg-navy-900">
                            <img
                              src={founderPhoto}
                              alt={isKn ? 'ರಮೇಶ್ ಎಸ್ ಹೆಚ್' : founderName}
                              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-navy-950/95 border border-gold-400 text-gold-300 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap shadow-xl">
                            {isKn ? 'ರಮೇಶ್ ಎಸ್ ಹೆಚ್' : founderName}
                          </div>
                        </div>
                        <p className="text-xs text-gold-400 font-semibold mt-4 tracking-wide text-center">
                          {isKn ? 'ಸಂಸ್ಥಾಪಕರು ಮತ್ತು ವ್ಯವಸ್ಥಾಪಕ ನಿರ್ದೇಶಕರು' : founderTitle}
                        </p>
                      </div>
                    </div>

                    {/* Mobile & Small Screen (< lg) Layout */}
                    <div className="lg:hidden flex flex-col items-center justify-center text-center space-y-3 sm:space-y-4 max-w-xl mx-auto">
                      <p className="font-sans font-semibold text-[10px] sm:text-xs uppercase tracking-[0.2em] text-gold-300 drop-shadow-md">
                        {slide.tagline}
                      </p>

                      <h2 className="font-heading font-extrabold text-xl xs:text-2xl sm:text-3xl text-gold-400 uppercase tracking-wide leading-tight drop-shadow-xl">
                        {slide.headline}
                      </h2>

                      <p className="text-xs sm:text-sm text-slate-100 font-light leading-relaxed drop-shadow-md line-clamp-3 xs:line-clamp-none">
                        {slide.description}
                      </p>

                      <div className="flex flex-col items-center justify-center pt-1">
                        <div className="relative">
                          <div className="w-28 h-28 xs:w-32 xs:h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-gold-400 shadow-xl bg-navy-900">
                            <img
                              src={founderPhoto}
                              alt={isKn ? 'ರಮೇಶ್ ಎಸ್ ಹೆಚ್' : founderName}
                              className="w-full h-full object-cover object-top"
                            />
                          </div>
                          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-navy-950/95 border border-gold-400 text-gold-300 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap shadow-md">
                            {isKn ? 'ರಮೇಶ್ ಎಸ್ ಹೆಚ್' : founderName}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Link
                          to="/contact"
                          className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm bg-[#8B2613] hover:bg-[#731E0E] active:scale-95 transition-all duration-200 shadow-xl border border-red-900/40 space-x-1.5"
                        >
                          <span>{t('common.enquiry_now', 'Enquiry Now')}</span>
                          <ArrowRight className="w-4 h-4 text-amber-300" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Standard Banner Content Typography (Slides 1-4, Buttons & Arrows Removed as requested) */
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 sm:px-12 lg:px-20 z-10 max-w-4xl mx-auto space-y-3 sm:space-y-4">
                    <p className="font-sans font-semibold text-[11px] sm:text-xs md:text-sm uppercase tracking-[0.2em] sm:tracking-[0.25em] text-gold-300 drop-shadow-md">
                      {slide.tagline}
                    </p>

                    <h3 className="font-heading font-extrabold text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-wider leading-tight drop-shadow-xl">
                      {slide.headline}
                    </h3>

                    <p className="text-xs sm:text-sm md:text-base text-slate-100 font-light leading-relaxed max-w-2xl drop-shadow-md hidden xs:block">
                      {slide.description}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Dash / Pill Indicators at Bottom Center (for all 5 slides) */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2 sm:space-x-2.5">
            {heroServices.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveBannerIdx(idx)}
                className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${activeBannerIdx === idx
                  ? 'w-8 sm:w-12 bg-gold-400 shadow-md ring-1 ring-gold-300'
                  : 'w-4 sm:w-6 bg-white/40 hover:bg-white/70'
                  }`}
                aria-label={`Show slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

  {/* ======================================================== */}
      {/* 2. ONE-STOP SOLUTION FOR ALL REAL ESTATE & CONSTRUCTION NEEDS */}
      {/* ======================================================== */}
      {/* <section className="w-full bg-white/95 backdrop-blur-md py-12 sm:py-16 lg:py-20 border-y border-slate-200/90 px-4 sm:px-8 lg:px-12 xl:px-16 shadow-xs"> */}
       <section className="w-full bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 text-white py-14 sm:py-20 px-4 sm:px-8 lg:px-12 xl:px-16 border-y border-gold-500/30 relative overflow-hidden shadow-2xl">
        <div className="w-full text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-amber-50 border border-amber-200 text-amber-700 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>{t('affordable.badge', 'Value, Quality & Reliability')}</span>
          </div>

         {/*  <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-navy-900 tracking-tight leading-tight"> */}
         <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
            {t('one_stop.heading', 'One Stop Solution for All Real Estate & Construction Needs!')}
          </h2>

        {/*  <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed font-normal max-w-4xl mx-auto"> */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
            {t(
              'affordable.description',
              'Ramesh S H provides complete expert guidance and support under one roof for all KHB properties in Suryanagar Phase 1, 2, 3 and 4. We make your property journey simple, convenient and hassle-free, guiding you every step of the way.'
            )}
          </p>
        </div>

        {/* Core Decision Pillars mentioned in text */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-4">
              {[
                { key: 'trusted.pillar_buying', label: 'Property Sales & Purchase' },
                { key: 'trusted.pillar_construction', label: 'Rentals & Lease' },
                { key: 'trusted.pillar_rentals', label: 'End-to-End Construction Solutions' },
                { key: 'trusted.pillar_loans', label: 'Loan Assistance' },
              ].map((pillar) => (
                <span
                  key={pillar.key}
                  className="inline-flex items-center space-x-1.5 bg-white border border-slate-200/90 text-navy-900 font-semibold text-xs px-3 py-1.5 rounded-lg shadow-2xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{t(pillar.key, pillar.label)}</span>
                </span>
              ))}
            </div>
      </section>

      {/* ======================================================== */}
      {/* 2.4. ABOUT COMPANY & LIVE METRICS (Covering full width right and left) */}
      {/* ======================================================== */}
      {/* <section className="w-full bg-white/95 backdrop-blur-md py-12 sm:py-16 lg:py-20 border-y border-slate-200/90 px-4 sm:px-8 lg:px-12 xl:px-16 shadow-xs"> */}
       <section className="w-full bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 text-white py-14 sm:py-20 px-4 sm:px-8 lg:px-12 xl:px-16 border-y border-gold-500/30 relative overflow-hidden shadow-2xl">
        <div className="w-full text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-amber-50 border border-amber-200 text-amber-700 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>{t('trusted.badge', 'Proven Track Record Since 2011')}</span>
          </div>

         {/*  <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-navy-900 tracking-tight leading-tight"> */}
         <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            {t('trusted.title', 'Most Trusted Real Estate & Construction Partner Since 2011!')}
          </h2>

        {/*  <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed font-normal max-w-4xl mx-auto"> */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
            {t(
              'mosttrusted.description',
              'With 15 years of experience in the real estate and construction industry, Ramesh S H is committed on helping customers make confident property decisions through buying, construction, rental, lease and property loan assistance.'
            )}
          </p>
        </div>

          {/* Core Decision Pillars mentioned in text */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-4">
              {[
                { key: 'trusted.pillar_buying', label: 'Property Buying' },
                { key: 'trusted.pillar_construction', label: 'Turnkey Construction' },
                { key: 'trusted.pillar_rentals', label: 'House Rentals' },
                { key: 'trusted.pillar_leases', label: 'Property Leases' },
                { key: 'trusted.pillar_loans', label: 'Home Loan Assistance' },
              ].map((pillar) => (
                <span
                  key={pillar.key}
                  className="inline-flex items-center space-x-1.5 bg-white border border-slate-200/90 text-navy-900 font-semibold text-xs px-3 py-1.5 rounded-lg shadow-2xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{t(pillar.key, pillar.label)}</span>
                </span>
              ))}
            </div>
      </section>

      {/* ======================================================== */}
      {/* 3. AFFORDABLE PROPERTIES & SUPERIOR CONSTRUCTION (Covering full width) */}
      {/* ======================================================== */}
      {/* <section className="w-full bg-white/95 backdrop-blur-md py-12 sm:py-16 lg:py-20 border-y border-slate-200/90 px-4 sm:px-8 lg:px-12 xl:px-16 shadow-xs"> */}
       <section className="w-full bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 text-white py-14 sm:py-20 px-4 sm:px-8 lg:px-12 xl:px-16 border-y border-gold-500/30 relative overflow-hidden shadow-2xl">
        <div className="w-full text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-amber-50 border border-amber-200 text-amber-700 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>{t('affordable.badge', 'Value, Quality & Reliability')}</span>
          </div>

         {/*  <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-navy-900 tracking-tight leading-tight"> */}
         <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            {t('affordable.title', 'Affordable Properties. Superior Construction. Timely Delivery!')}
          </h2>

        {/*  <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed font-normal max-w-4xl mx-auto"> */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
            {t(
              'affordable.description',
              'We help you find the right property at a reasonable price and turn it into your dream home with quality construction, reliable workmanship and a commitment to timely delivery.'
            )}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-semibold text-slate-700">
            <span className="inline-flex items-center space-x-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t('affordable.chip_price', 'Affordable Pricing')}</span>
            </span>
            <span className="inline-flex items-center space-x-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t('affordable.chip_quality', 'Superior Construction')}</span>
            </span>
            <span className="inline-flex items-center space-x-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t('affordable.chip_timely', 'Timely Delivery')}</span>
            </span>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 3.5. LOAN GUIDANCE SECTION */}
      {/* ======================================================== */}
     {/*  <section className="w-full bg-[#FAF7F2] py-14 sm:py-20 border-y border-[#E8DFD3] px-4 sm:px-8 lg:px-12 xl:px-16 shadow-xs relative overflow-hidden"> */}
      <section className="w-full bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 text-white py-14 sm:py-20 px-4 sm:px-8 lg:px-12 xl:px-16 border-y border-gold-500/30 relative overflow-hidden shadow-2xl">
        {/* Subtle decorative background accent */}
        <div
          className="absolute -top-12 -right-12 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="w-full relative z-10 text-center space-y-4">
          {/* <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Banknote className="w-4 h-4 text-emerald-600" />
            <span>{t('loan_guidance.badge', 'Multi-Bank Loan Assistance')}</span>
          </div> */}
          
          <div className="inline-flex items-center space-x-2 bg-amber-50 border border-amber-200 text-amber-700 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>{t('loan_guidance.badge', 'Multi-Bank Loan Assistance')}</span>
          </div>

          {/* <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-navy-900 tracking-tight leading-tight max-w-4xl mx-auto"> */}
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            {t('loan_guidance.title', 'The Right Loan Guidance for Your Dream Property!')}
          </h2>

         {/* <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed font-normal max-w-4xl mx-auto"> */}
         <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
            {t(
              'loan_guidance.description',
              'We help you understand the home loan process, documentation requirements and explore suitable loan options with competitive interest rates from available financial institutions.'
            )}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-semibold text-slate-700">
            <span className="inline-flex items-center space-x-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t('affordable.chip_price', 'Home & Plot Loans')}</span>
            </span>
            <span className="inline-flex items-center space-x-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t('affordable.chip_quality', 'Documentation Check')}</span>
            </span>
            <span className="inline-flex items-center space-x-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t('affordable.chip_timely', 'Competitive Rates')}</span>
            </span>
          </div>

          {/* Key Loan Pillars */}
          { /* <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 text-left max-w-6xl mx-auto">
            <div className="bg-white rounded-xl sm:rounded-2xl p-5 border border-[#E8DFD3] shadow-sm hover:shadow-luxury transition">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mb-3">
                <Banknote className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-sm sm:text-base text-navy-900 mb-1">
                {t('loan_guidance.card1_title', 'Home & Plot Loans')}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t(
                  'loan_guidance.card1_desc',
                  'Structured financing for KHB plots, residential sites, independent villas, and home construction.'
                )}
              </p>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-5 border border-[#E8DFD3] shadow-sm hover:shadow-luxury transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-3">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-sm sm:text-base text-navy-900 mb-1">
                {t('loan_guidance.card2_title', 'Documentation Check')}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t(
                  'loan_guidance.card2_desc',
                  'Complete assistance compiling title deeds, Encumbrance Certificates, KYC, and builder agreements.'
                )}
              </p>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-5 border border-[#E8DFD3] shadow-sm hover:shadow-luxury transition">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-sm sm:text-base text-navy-900 mb-1">
                {t('loan_guidance.card3_title', 'Competitive Rates')}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t(
                  'loan_guidance.card3_desc',
                  'Direct coordination across SBI, HDFC, Canara Bank, and ICICI to find suitable borrowing terms.'
                )}
              </p>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-5 border border-[#E8DFD3] shadow-sm hover:shadow-luxury transition">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-sm sm:text-base text-navy-900 mb-1">
                {t('loan_guidance.card4_title', 'Fast-Track Sanction')}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t(
                  'loan_guidance.card4_desc',
                  'Pre-qualification checks and institutional follow-ups to minimize disbursement waiting times.'
                )}
              </p>
            </div>
          </div> */}

          <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/loans-made-easy"
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-navy-900 hover:bg-gold-600 text-white font-bold text-xs sm:text-sm shadow-md transition transform hover:-translate-y-0.5"
            >
              <span>{t('loan_guidance.cta', 'Explore Loan Assistance')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    
      {/* ======================================================== */}
      {/* 9. CUSTOMER ENQUIRY & CONTACT FORM */}
      {/* ======================================================== */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-luxury overflow-hidden grid grid-cols-1 lg:grid-cols-12"> */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-luxury space-y-6">
          {/* Info column */}
          { /* <div className="lg:col-span-5 bg-navy-950 text-white p-8 sm:p-10 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-gold-400 block">
                {t('enquiry.direct_consultation', 'Direct Consultation')}
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold leading-tight">
                {t('enquiry.consultation_title', 'Connect with Ramesh S H & Banashankari Enterprises')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                {t(
                  'enquiry.consultation_desc',
                  'Whether you need assistance with plot purchase, turnkey home construction, rental agreements, or KHB title verification, our team is ready to assist.'
                )}
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center space-x-3 bg-navy-900 p-3 rounded-xl border border-navy-850">
                <PhoneCall className="w-5 h-5 text-gold-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">{t('common.direct_call', 'Direct Call')}</span>
                  <a href={phoneCallUrl} className="font-bold text-white hover:text-gold-400 text-sm">
                    {phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-navy-900 p-3 rounded-xl border border-navy-850">
                <Clock className="w-5 h-5 text-gold-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">{t('common.business_hours', 'Business Timings')}</span>
                  <span className="text-white font-medium">{t('common.mon_sat_hours', 'Mon - Sat: 9:30 AM – 7:30 PM (IST)')}</span>
                </div>
              </div>
            </div>
          </div> */}

          {/* Form column */}
          <div className="lg:col-span-7 p-8 sm:p-10">
            <h4 className="font-heading font-bold text-xl text-navy-900 mb-2">
              {t('enquiry.form_title', 'Send an Instant Enquiry')}
            </h4>
            <p className="text-xs text-slate-500 mb-6">
              {t('enquiry.form_subtitle', 'Fill in your details below and we will follow up with verified recommendations.')}
            </p>

            {enquirySuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs leading-relaxed space-y-2">
                <p>{enquirySuccess}</p>
                <div className="pt-1">
                  <Link
                    to="/my-enquiries"
                    className="inline-flex items-center space-x-1 font-bold text-emerald-900 underline hover:text-emerald-700"
                  >
                    <span>{t('enquiry.track_link', 'Track in My Enquiries →')}</span>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleQuickEnquiry} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t('common.name_label', 'Your Full Name *')}
                    </label>
                    <input
                      type="text"
                      required
                      value={enquiryForm.customerName}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, customerName: e.target.value })}
                      placeholder={isKn ? 'ಉದಾ. ರಮೇಶ್ ಕುಮಾರ್' : 'e.g. Ramesh'}
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t('common.phone_label', 'Phone Number (10 digits) *')}
                    </label>
                    <div className="relative flex rounded-xl border border-slate-300 focus-within:ring-2 focus-within:ring-gold-500 overflow-hidden bg-white">
                      <span className="inline-flex items-center px-3.5 bg-slate-50 border-r border-slate-200 text-slate-700 font-bold text-xs select-none">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        inputMode="numeric"
                        pattern="[0-9]{10}"
                        maxLength={10}
                        minLength={10}
                        title={isKn ? 'ದಯವಿಟ್ಟು 10 ಅಂಕಿಗಳ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ' : 'Please enter a 10-digit mobile number'}
                        value={enquiryForm.phone}
                        onChange={(e) => {
                          let digits = e.target.value.replace(/\D/g, '');
                          if (digits.length === 12 && digits.startsWith('91')) {
                            digits = digits.slice(2);
                          } else if (digits.length === 11 && digits.startsWith('0')) {
                            digits = digits.slice(1);
                          }
                          setEnquiryForm({ ...enquiryForm, phone: digits.slice(0, 10) });
                        }}
                        placeholder="7353275925"
                        className="w-full px-3 py-3 text-xs focus:outline-none bg-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t('common.email_label', 'Email Address *')}
                    </label>
                    <input
                      type="email"
                      required
                      value={enquiryForm.email}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                      placeholder="ramesh@example.com"
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t('enquiry.service_required', 'Service Required *')}
                    </label>
                    <select
                      value={enquiryForm.category}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, category: e.target.value })}
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                    >
                      <option value="general">{t('enquiry.service_general', 'General Real Estate Guidance')}</option>
                      <option value="property">{t('enquiry.service_property', 'Property Inspection / Purchase')}</option>
                      <option value="construction">{t('enquiry.service_construction', 'Turnkey Home Construction')}</option>
                      <option value="loan">{t('enquiry.service_loan', 'Banking Loan Assistance')}</option>
                      <option value="khb">{t('enquiry.service_khb', 'KHB Documentation Assistance')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('common.message_label', 'Describe Your Requirements')}
                  </label>
                  <textarea
                    rows={3}
                    value={enquiryForm.message}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                    placeholder={t(
                      'enquiry.placeholder_desc',
                      'Tell us about the locality, budget, plot size, or specific assistance you need...'
                    )}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={enquirySubmitting}
                  className="w-full bg-gold-500 hover:bg-gold-600 text-white font-semibold py-3 px-6 rounded-xl text-xs shadow-sm transition flex items-center justify-center space-x-2"
                >
                  <span>
                    {enquirySubmitting
                      ? t('common.submitting', 'Submitting...')
                      : t('enquiry.submit_button', 'Submit Enquiry & Request Call')}
                  </span>
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
