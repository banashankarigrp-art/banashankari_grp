import React, { useState, useEffect } from 'react';
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
  PhoneCall,
  Clock,
  Sparkles,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { PropertyCard } from '../components/property/PropertyCard';
import { api } from '../services/api';
import { IProperty, COMPANY_INFO, ISiteSettings } from '@shared/types';

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

  const founderPhoto = settings?.founderPhoto || COMPANY_INFO.founderPhoto || '/founder.jpg';
  const founderName = settings?.founderName || COMPANY_INFO.founder;
  const founderTitle = settings?.founderTitle || COMPANY_INFO.founderTitle || 'Founder & Managing Director';

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
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
            Discover verified plots, build your turnkey dream residence, and access construction finance with Banashankari Enterprises — led by {founderName}.
          </p>

          {/* Founder Feature Spotlight (Square Shape above Explore Properties) */}
          <div className="pt-2 pb-1 flex flex-col items-center justify-center">
            <div className="relative group">
              {/* Outer Golden Ambient Glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-400 via-gold-500 to-amber-300 rounded-3xl blur-md opacity-40 group-hover:opacity-75 transition duration-500" />

              {/* Square Container */}
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-60 md:h-60 aspect-square rounded-2xl sm:rounded-3xl p-1 bg-gradient-to-b from-gold-400 via-navy-800 to-navy-950 shadow-2xl border-2 border-gold-500/50 overflow-hidden">
                <img
                  src={founderPhoto}
                  alt={founderName}
                  className="w-full h-full object-cover object-top rounded-xl sm:rounded-2xl transition duration-500 group-hover:scale-105"
                  loading="eager"
                />

                {/* Founder Info Overlay at Bottom */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-transparent p-3 pt-6 text-center">
                  <p className="text-white font-bold text-sm sm:text-base tracking-wide drop-shadow">

                  </p>
                  <p className="text-gold-300 text-xs font-medium tracking-tight">

                  </p>
                </div>
              </div>
            </div>

            <div className="mt-2.5 text-center">
              <span className="inline-flex items-center space-x-1.5 text-xs text-slate-300 bg-navy-900/90 border border-gold-500/30 px-3.5 py-1 rounded-full shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-slate-200 font-medium">Founder</span>
              </span>
            </div>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
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
              <span>Talk to Ramesh S H (9972536991) </span>
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-6 border border-slate-200/80 shadow-luxury hover:shadow-luxury-hover hover:border-gold-500/40 transition group flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-gold-50 border border-gold-200 text-gold-600 flex items-center justify-center mb-3 sm:mb-5 group-hover:scale-110 transition">
                <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-heading text-sm sm:text-lg font-bold text-navy-900 mb-1 sm:mb-2 leading-tight">
                Residential Plots & Land
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed mb-2 sm:mb-4 line-clamp-3 sm:line-clamp-none">
                Verified BDA, BMRDA, and DC-converted residential plots with complete legal title deeds and immediate registration readiness.
              </p>
              <ul className="hidden sm:block text-xs text-slate-500 space-y-1.5 mb-5 border-t border-slate-100 pt-3">
                <li className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Clear title deed verification</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Cauvery & BESCOM infrastructure</span>
                </li>
              </ul>
            </div>
            <Link
              to="/properties?type=plot"
              className="text-[11px] sm:text-xs font-bold text-navy-900 group-hover:text-gold-600 inline-flex items-center space-x-1 transition mt-1"
            >
              <span>Explore Plots</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-6 border border-slate-200/80 shadow-luxury hover:shadow-luxury-hover hover:border-gold-500/40 transition group flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-gold-50 border border-gold-200 text-gold-600 flex items-center justify-center mb-3 sm:mb-5 group-hover:scale-110 transition">
                <Home className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-heading text-sm sm:text-lg font-bold text-navy-900 mb-1 sm:mb-2 leading-tight">
                Bespoke Home Construction
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed mb-2 sm:mb-4 line-clamp-3 sm:line-clamp-none">
                Architectural planning, structural RCC execution, and turnkey building coordination with stringent material grade checks.
              </p>
              <ul className="hidden sm:block text-xs text-slate-500 space-y-1.5 mb-5 border-t border-slate-100 pt-3">
                <li className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Direct oversight by Ramesh S H</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Transparent itemized billing</span>
                </li>
              </ul>
            </div>
            <Link
              to="/construction"
              className="text-[11px] sm:text-xs font-bold text-navy-900 group-hover:text-gold-600 inline-flex items-center space-x-1 transition mt-1"
            >
              <span>Construction</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-6 border border-slate-200/80 shadow-luxury hover:shadow-luxury-hover hover:border-gold-500/40 transition group flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-gold-50 border border-gold-200 text-gold-600 flex items-center justify-center mb-3 sm:mb-5 group-hover:scale-110 transition">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-heading text-sm sm:text-lg font-bold text-navy-900 mb-1 sm:mb-2 leading-tight">
                Rentals & Leases
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed mb-2 sm:mb-4 line-clamp-3 sm:line-clamp-none">
                Curated residential apartments, independent duplex homes, and prime commercial retail spaces for verified tenants.
              </p>
              <ul className="hidden sm:block text-xs text-slate-500 space-y-1.5 mb-5 border-t border-slate-100 pt-3">
                <li className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Thorough tenant vetting</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Formal rental agreements</span>
                </li>
              </ul>
            </div>
            <Link
              to="/properties?purpose=rent"
              className="text-[11px] sm:text-xs font-bold text-navy-900 group-hover:text-gold-600 inline-flex items-center space-x-1 transition mt-1"
            >
              <span>Rentals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-6 border border-slate-200/80 shadow-luxury hover:shadow-luxury-hover hover:border-gold-500/40 transition group flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-gold-50 border border-gold-200 text-gold-600 flex items-center justify-center mb-3 sm:mb-5 group-hover:scale-110 transition">
                <FileCheck2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-heading text-sm sm:text-lg font-bold text-navy-900 mb-1 sm:mb-2 leading-tight">
                Loan & KHB Advisory
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed mb-2 sm:mb-4 line-clamp-3 sm:line-clamp-none">
                Home loan documentation assistance across premier banks and dedicated procedural guidance for KHB transfers.
              </p>
              <ul className="hidden sm:block text-xs text-slate-500 space-y-1.5 mb-5 border-t border-slate-100 pt-3">
                <li className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Multi-bank eligibility liaison</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>KHB checklist verification</span>
                </li>
              </ul>
            </div>
            <Link
              to="/khb-assistance"
              className="text-[11px] sm:text-xs font-bold text-navy-900 group-hover:text-gold-600 inline-flex items-center space-x-1 transition mt-1"
            >
              <span>KHB Guidance</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. FEATURED BENGALURU PROPERTIES (Screenshot Section 2) */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-gold-600 block">
              Handpicked Portfolio
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-navy-900">
              Featured Bengaluru Properties
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real, verified listings ready for immediate site inspection.
            </p>
          </div>

          <Link
            to="/properties"
            className="mt-4 md:mt-0 inline-flex items-center space-x-1.5 text-sm font-semibold text-navy-900 hover:text-gold-600 transition"
          >
            <span>View All Properties ({properties.length || '5+'})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-64 sm:h-80 animate-pulse border border-slate-100 p-4" />
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
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
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
              src="https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=800&q=80"
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
