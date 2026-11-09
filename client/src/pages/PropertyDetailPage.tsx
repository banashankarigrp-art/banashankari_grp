import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  Share2,
  Phone,
  MessageSquare,
  ShieldCheck,
  Building2,
  Clock,
  ArrowRight,
  Calculator,
  ChevronRight,
} from 'lucide-react';
import { PropertyCard, formatIndianCurrency } from '../components/property/PropertyCard';
import { api } from '../services/api';
import { IProperty, COMPANY_INFO } from '@shared/types';
import { useAuth } from '../context/AuthContext';

export const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [property, setProperty] = useState<IProperty | null>(null);
  const [similar, setSimilar] = useState<IProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // EMI Calculator state
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenureYears, setLoanTenureYears] = useState(20);

  // Site visit request form
  const [visitName, setVisitName] = useState(user?.name || '');
  const [visitPhone, setVisitPhone] = useState(user?.phone || '');
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('morning');
  const [visitSubmitted, setVisitSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res: any = await api.get(`/properties/detail/${id}`);
        if (res.success && res.data) {
          setProperty(res.data);
          setSimilar(res.similar || []);
          if (res.data.pricing?.price) {
            setLoanAmount(Math.round(res.data.pricing.price * 0.8)); // 80% loan default
          }
        }
      } catch (err) {
        console.error('Error fetching property detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // EMI Calculation: P * r * (1 + r)^n / ((1 + r)^n - 1)
  const calculateEmi = () => {
    const r = interestRate / 12 / 100;
    const n = loanTenureYears * 12;
    if (r === 0) return Math.round(loanAmount / n);
    const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.round(emi);
  };

  const handleScheduleVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;
    try {
      setIsSubmitting(true);
      const res: any = await api.post('/enquiries', {
        category: 'site_visit',
        customerName: visitName,
        phone: visitPhone,
        email: user?.email || 'inquiry@banashankari.com',
        propertyId: property._id,
        details: {
          message: `Site visit requested for ${property.title} (Ref: ${property.referenceId}) on ${visitDate} (${visitTime}).`,
          preferredContactTime: `${visitDate} - ${visitTime}`,
        },
        consent: true,
      });

      if (res.success) {
        setVisitSubmitted(true);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit visit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-3 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs uppercase tracking-widest text-slate-500">Loading Property Record...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <Building2 className="w-16 h-16 text-slate-300 mx-auto" />
        <h2 className="font-heading text-2xl font-bold text-navy-900">Property Listing Not Found</h2>
        <p className="text-xs text-slate-500">
          This property may have been sold, withdrawn, or is undergoing administrative review.
        </p>
        <Link
          to="/properties"
          className="inline-block bg-navy-900 text-white px-6 py-2.5 rounded-xl text-xs font-semibold"
        >
          Explore Available Properties
        </Link>
      </div>
    );
  }

  const images = property.images && property.images.length > 0
    ? property.images
    : [{ url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80', isCover: true }];

  const activeImage = images[activeImageIdx]?.url || images[0]?.url;

  const prefilledWhatsapp = encodeURIComponent(
    `Hello Banashankari Enterprises, I am interested in property "${property.title}" (Ref: ${property.referenceId}). Please share verification details and available inspection slots.`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-gold-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/properties" className="hover:text-gold-600">Properties</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-navy-900 font-medium truncate max-w-xs">{property.title}</span>
      </div>

      {/* Main Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded bg-navy-950 text-gold-400 border border-gold-500/30">
              Ref ID: {property.referenceId}
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded bg-slate-100 text-slate-700 uppercase">
              For {property.listingPurpose}
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded bg-slate-100 text-slate-700 uppercase">
              {property.propertyType}
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-4xl font-bold text-navy-900 leading-snug">
            {property.title}
          </h1>

          <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-600">
            <MapPin className="w-4 h-4 text-gold-600 shrink-0" />
            <span>
              {property.location.address || `${property.location.locality}, Bangalore, Karnataka`}
            </span>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-right self-start lg:self-auto shrink-0 min-w-[240px]">
          <span className="text-xs text-slate-400 uppercase tracking-wider block font-medium">Expected Price</span>
          <div className="text-2xl sm:text-3xl font-bold text-navy-900 font-sans tracking-tight">
            {formatIndianCurrency(property.pricing.price, property.listingPurpose)}
          </div>
          {property.pricing.pricingTerms && (
            <span className="text-xs text-slate-500 block mt-1">{property.pricing.pricingTerms}</span>
          )}
        </div>
      </div>

      {/* Gallery Section */}
      <div className="space-y-3">
        <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden shadow-luxury bg-slate-900">
          <img
            src={activeImage}
            alt={property.title}
            className="w-full h-full object-cover transition duration-300"
          />
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex items-center space-x-3 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`relative w-24 h-16 sm:w-32 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                  activeImageIdx === idx ? 'border-gold-500 shadow-md scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Property Details Grid + Contact/Visit Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Details, Amenities, Overview, Calculator */}
        <div className="lg:col-span-8 space-y-10">
          {/* Key Specs Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Total Area</span>
              <p className="font-heading font-bold text-lg text-navy-900">
                {(property.builtUpArea || property.landArea || 0).toLocaleString()} {property.areaUnit}
              </p>
            </div>
            <div className="space-y-1 border-l border-slate-100">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Bedrooms</span>
              <p className="font-heading font-bold text-lg text-navy-900">
                {property.bedrooms ? `${property.bedrooms} BHK` : 'N/A'}
              </p>
            </div>
            <div className="space-y-1 border-l border-slate-100">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Bathrooms</span>
              <p className="font-heading font-bold text-lg text-navy-900">
                {property.bathrooms || 'N/A'}
              </p>
            </div>
            <div className="space-y-1 border-l border-slate-100">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Availability</span>
              <p className="font-heading font-bold text-sm text-emerald-600 capitalize">
                {property.availabilityStatus.replace('_', ' ')}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-xl text-navy-900">Property Overview</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line font-light">
              {property.description}
            </p>
          </div>

          {/* Amenities & Infrastructure */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-heading font-bold text-xl text-navy-900">Infrastructure & Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Home Loan EMI Estimator */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-xl text-navy-900 flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-gold-600" />
                <span>Estimated Home Loan EMI</span>
              </h3>
              <span className="text-xs text-slate-400">Subject to bank eligibility</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Loan Amount (₹)
                </label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Interest Rate (% p.a.)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Tenure (Years)
                </label>
                <input
                  type="number"
                  value={loanTenureYears}
                  onChange={(e) => setLoanTenureYears(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500"
                />
              </div>
            </div>

            <div className="bg-navy-950 text-white p-5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-300 block">Estimated Monthly Payment (EMI)</span>
                <span className="text-2xl font-bold text-gold-400 font-sans">
                  ₹{calculateEmi().toLocaleString('en-IN')} / month
                </span>
              </div>
              <Link
                to="/loans"
                className="bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow transition"
              >
                Apply for Loan Assistance
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Actions, WhatsApp Direct, Schedule Site Visit */}
        <div className="lg:col-span-4 space-y-6" id="enquire">
          {/* WhatsApp Direct CTA */}
          <div className="bg-emerald-900 text-white p-6 rounded-2xl shadow-luxury space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Instant WhatsApp Assistance</h4>
                <p className="text-xs text-emerald-200">Talk directly with Ramesh S H</p>
              </div>
            </div>

            <p className="text-xs text-emerald-100 leading-relaxed font-light">
              Connect on WhatsApp to receive title documents checklist, site visit location pin, and negotiation guidance.
            </p>

            <a
              href={`${COMPANY_INFO.whatsappUrl}?text=${prefilledWhatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white hover:bg-slate-100 text-emerald-900 py-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow transition"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Enquire on WhatsApp (+91 997 253 6991)</span>
            </a>
          </div>

          {/* Schedule Site Visit Form */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-heading font-bold text-lg text-navy-900">Schedule a Site Visit</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our site coordinator will meet you at the property location for an in-person walkthrough.
            </p>

            {visitSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-2">
                <p>✅ Site visit request submitted! Our team will contact you to confirm the inspection appointment.</p>
                <div className="pt-1">
                  <Link
                    to="/my-enquiries"
                    className="inline-flex items-center space-x-1.5 font-bold text-emerald-900 hover:text-emerald-700 underline"
                  >
                    <span>Track in My Enquiries →</span>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleScheduleVisit} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={visitName}
                    onChange={(e) => setVisitName(e.target.value)}
                    placeholder="e.g. Anand Kumar"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={visitPhone}
                    onChange={(e) => setVisitPhone(e.target.value)}
                    placeholder="+91 98450 XXXXX"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Preferred Date *</label>
                  <input
                    type="date"
                    required
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Preferred Slot</label>
                  <select
                    value={visitTime}
                    onChange={(e) => setVisitTime(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  >
                    <option value="morning">Morning (10:00 AM – 1:00 PM)</option>
                    <option value="afternoon">Afternoon (2:00 PM – 4:30 PM)</option>
                    <option value="evening">Evening (4:30 PM – 6:30 PM)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-navy-900 hover:bg-gold-600 text-white py-3 rounded-xl text-xs font-bold shadow-sm transition"
                >
                  {isSubmitting ? 'Booking Visit...' : 'Confirm Site Visit Request'}
                </button>
              </form>
            )}

            <div className="pt-2 text-center text-[11px] text-slate-400">
              Office Phone: <strong className="text-navy-900">{COMPANY_INFO.phone}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Published Properties */}
      {similar.length > 0 && (
        <div className="pt-10 border-t border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gold-600">Explore Alternatives</span>
              <h3 className="font-heading font-bold text-2xl text-navy-900">Similar Verified Properties</h3>
            </div>
            <Link to="/properties" className="text-xs font-bold text-navy-900 hover:text-gold-600">
              View All ↗
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similar.map((prop) => (
              <PropertyCard key={prop._id} property={prop} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
