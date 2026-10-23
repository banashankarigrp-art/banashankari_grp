import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle2,
  Calendar,
  Building2,
  Phone,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Search,
  Compass,
  Hammer,
  Landmark,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { api } from '../services/api';
import { IEnquiry, COMPANY_INFO } from '@shared/types';
import { useAuth } from '../context/AuthContext';
import { formatIndianCurrency } from '../components/property/PropertyCard';

export const MyEnquiriesPage: React.FC = () => {
  const { user } = useAuth();
  const [enquiries, setEnquiries] = useState<IEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'plots' | 'construction' | 'finance'>('all');

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      setError('');
      const res: any = await api.get('/enquiries/mine');
      if (res && res.data) {
        setEnquiries(res.data);
      } else {
        setEnquiries([]);
      }
    } catch (err: any) {
      console.error('Error fetching enquiries:', err);
      setError(err.message || 'Unable to load your enquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600 shrink-0" />
            <span>Submitted & Queued</span>
          </span>
        );
      case 'contacted':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Phone className="w-3 h-3 text-blue-600 shrink-0" />
            <span>Contacted by Team</span>
          </span>
        );
      case 'site_visit_scheduled':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <Calendar className="w-3 h-3 text-purple-600 shrink-0" />
            <span>Site Visit Scheduled</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <RefreshCw className="w-3 h-3 text-indigo-600 shrink-0" />
            <span>In Discussion</span>
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>Completed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <span>{status}</span>
          </span>
        );
    }
  };

  const getCategoryMeta = (cat: string) => {
    switch (cat) {
      case 'site_visit':
        return { label: 'Site Visit Request', icon: Calendar, color: 'text-purple-600 bg-purple-50' };
      case 'plot_booking':
        return { label: 'Plot / Property Booking', icon: Building2, color: 'text-navy-600 bg-navy-50' };
      case 'construction':
        return { label: 'Turnkey Construction', icon: Hammer, color: 'text-amber-600 bg-amber-50' };
      case 'loan_assistance':
        return { label: 'Banking & Home Loan', icon: Landmark, color: 'text-emerald-600 bg-emerald-50' };
      case 'khb_guidance':
        return { label: 'KHB Assistance', icon: ShieldCheck, color: 'text-teal-600 bg-teal-50' };
      default:
        return { label: 'General Enquiry', icon: MessageSquare, color: 'text-slate-600 bg-slate-50' };
    }
  };

  // Filter logic
  const filteredEnquiries = enquiries.filter((enq) => {
    if (selectedFilter === 'plots') {
      return enq.category === 'site_visit' || enq.category === 'plot_booking';
    }
    if (selectedFilter === 'construction') {
      return enq.category === 'construction';
    }
    if (selectedFilter === 'finance') {
      return enq.category === 'loan_assistance' || enq.category === 'khb_guidance';
    }
    return true;
  });

  const activeCount = enquiries.filter((e) => e.status !== 'closed').length;
  const closedCount = enquiries.filter((e) => e.status === 'closed').length;

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-gold-50 text-gold-700 border border-gold-200">
                Customer Account
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">{user?.email}</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-navy-900">
              My Enquiries & Service Requests
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              Track your property site visit requests, construction estimates, banking loan queries, and KHB legal assistance in real-time.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-center min-w-[90px]">
              <span className="block text-2xl font-bold text-navy-900 leading-tight">
                {enquiries.length}
              </span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                Total Raised
              </span>
            </div>
            <div className="bg-amber-50/60 border border-amber-200 rounded-2xl px-4 py-3 text-center min-w-[90px]">
              <span className="block text-2xl font-bold text-amber-700 leading-tight">
                {activeCount}
              </span>
              <span className="text-[10px] text-amber-700 font-semibold uppercase tracking-wider">
                Active
              </span>
            </div>
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl px-4 py-3 text-center min-w-[90px]">
              <span className="block text-2xl font-bold text-emerald-700 leading-tight">
                {closedCount}
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider">
                Completed
              </span>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm text-xs font-medium">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3.5 py-2 rounded-xl transition ${
                selectedFilter === 'all'
                  ? 'bg-navy-950 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              All Enquiries ({enquiries.length})
            </button>
            <button
              onClick={() => setSelectedFilter('plots')}
              className={`px-3.5 py-2 rounded-xl transition ${
                selectedFilter === 'plots'
                  ? 'bg-navy-950 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              Plots & Site Visits
            </button>
            <button
              onClick={() => setSelectedFilter('construction')}
              className={`px-3.5 py-2 rounded-xl transition ${
                selectedFilter === 'construction'
                  ? 'bg-navy-950 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              Construction
            </button>
            <button
              onClick={() => setSelectedFilter('finance')}
              className={`px-3.5 py-2 rounded-xl transition ${
                selectedFilter === 'finance'
                  ? 'bg-navy-950 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              Loans & KHB
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchEnquiries}
              disabled={loading}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <Link
              to="/properties"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-white text-xs font-bold transition shadow-sm"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore Verified Plots</span>
            </Link>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-gold-500 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-navy-900">Fetching your enquiries...</p>
            <p className="text-xs text-slate-400">Loading latest status from Banashankari Enterprises.</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center space-y-3">
            <p className="text-sm font-bold text-red-700">{error}</p>
            <button
              onClick={fetchEnquiries}
              className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        ) : filteredEnquiries.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-slate-200 p-10 sm:p-14 text-center space-y-5 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-gold-50 text-gold-600 flex items-center justify-center mx-auto border border-gold-200">
              <FileText className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="font-heading text-xl font-bold text-navy-900">
                {selectedFilter === 'all'
                  ? 'No Enquiries Raised Yet'
                  : 'No Enquiries in this Category'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                As a customer, you can freely explore our Bangalore plots, request site visits, calculate construction estimates, and apply for bank loans. All your requests will show up here.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/properties"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-navy-950 text-white text-xs font-semibold hover:bg-navy-900 transition shadow-sm"
              >
                <Compass className="w-4 h-4 text-gold-400" />
                <span>Browse Verified Properties</span>
              </Link>
              <Link
                to="/construction"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
              >
                <Hammer className="w-4 h-4 text-amber-500" />
                <span>Turnkey Construction</span>
              </Link>
              <Link
                to="/loans"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
              >
                <Landmark className="w-4 h-4 text-emerald-500" />
                <span>Bank Loan Assistance</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Enquiry Cards List */
          <div className="space-y-4">
            {filteredEnquiries.map((enquiry) => {
              const meta = getCategoryMeta(enquiry.category);
              const CategoryIcon = meta.icon;
              const prop = enquiry.propertyId as any;

              return (
                <div
                  key={enquiry._id}
                  className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition space-y-4"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${meta.color}`}>
                        <CategoryIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-navy-950">
                            #{enquiry.referenceId}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs font-semibold text-slate-700">
                            {meta.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 flex items-center space-x-1.5 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>
                            Submitted on {new Date(enquiry.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-start sm:self-auto">
                      {getStatusBadge(enquiry.status)}
                    </div>
                  </div>

                  {/* Property Details (If linked) */}
                  {prop && typeof prop === 'object' && prop.title && (
                    <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 flex items-center justify-between gap-4">
                      <div className="flex items-center space-x-3 min-w-0">
                        {prop.images?.[0] ? (
                          <img
                            src={prop.images[0]}
                            alt={prop.title}
                            className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-navy-950 text-gold-400 flex items-center justify-center shrink-0">
                            <Building2 className="w-6 h-6" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="text-[10px] uppercase font-bold text-gold-600 block tracking-wider">
                            Property of Interest
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-navy-900 truncate">
                            {prop.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate">
                            {prop.location?.locality || prop.location?.address || 'Bengaluru'}
                            {prop.pricing?.totalPrice && ` • ${formatIndianCurrency(prop.pricing.totalPrice)}`}
                          </p>
                        </div>
                      </div>

                      <Link
                        to={`/properties/${prop._id}`}
                        className="inline-flex items-center space-x-1 text-xs font-semibold text-navy-900 hover:text-gold-600 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-white transition shrink-0"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  )}

                  {/* Enquiry Details Breakdown */}
                  <div className="space-y-2 text-xs">
                    {enquiry.details?.message && (
                      <div className="p-3 rounded-xl bg-slate-50 text-slate-700">
                        <span className="font-semibold text-slate-900 block mb-0.5">Your Message:</span>
                        <p className="italic text-slate-600 leading-relaxed">
                          "{enquiry.details.message}"
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1 text-[11px] text-slate-600">
                      {enquiry.details?.preferredContactTime && (
                        <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg">
                          <span className="font-semibold text-slate-700">Contact Preference:</span>
                          <span>{enquiry.details.preferredContactTime}</span>
                        </div>
                      )}

                      {enquiry.details?.plotDimensions && (
                        <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg">
                          <span className="font-semibold text-slate-700">Dimensions:</span>
                          <span>{enquiry.details.plotDimensions}</span>
                        </div>
                      )}

                      {enquiry.details?.constructionBudget && (
                        <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg">
                          <span className="font-semibold text-slate-700">Budget:</span>
                          <span>{enquiry.details.constructionBudget}</span>
                        </div>
                      )}

                      {enquiry.details?.approximateLoanAmount && (
                        <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg">
                          <span className="font-semibold text-slate-700">Loan Amount:</span>
                          <span>{formatIndianCurrency(enquiry.details.approximateLoanAmount)}</span>
                        </div>
                      )}

                      {enquiry.details?.khbAssistanceType && (
                        <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg">
                          <span className="font-semibold text-slate-700">KHB Service:</span>
                          <span className="capitalize">{enquiry.details.khbAssistanceType.replace('_', ' ')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Representative Follow-up Footer */}
                  <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center space-x-2 text-slate-500">
                      <ShieldCheck className="w-4 h-4 text-gold-600 shrink-0" />
                      <span>
                        Handled directly by Banashankari Enterprises verification team.
                      </span>
                    </div>

                    <a
                      href={`https://wa.me/919845012345?text=${encodeURIComponent(`Hi Banashankari Enterprises, I'm following up on my enquiry #${enquiry.referenceId} (${meta.label})`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 font-bold text-emerald-700 hover:text-emerald-800 transition"
                    >
                      <Phone className="w-3 h-3" />
                      <span>WhatsApp Follow-up</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
