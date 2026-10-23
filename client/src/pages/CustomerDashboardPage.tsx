import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Home,
  FileText,
  Bell,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  Eye,
  Trash2,
  Building2,
  Check,
} from 'lucide-react';
import { api } from '../services/api';
import { formatIndianCurrency } from '../components/property/PropertyCard';
import { IProperty, IEnquiry, INotification } from '@shared/types';
import { useAuth } from '../context/AuthContext';

export const CustomerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [summary, setSummary] = useState<any>({
    totalProperties: 0,
    publishedProperties: 0,
    pendingProperties: 0,
    activeEnquiries: 0,
    recentNotifications: [],
  });

  const [myProperties, setMyProperties] = useState<IProperty[]>([]);
  const [myEnquiries, setMyEnquiries] = useState<IEnquiry[]>([]);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [sumRes, propRes, enqRes, notifRes]: any = await Promise.all([
        api.get('/dashboard/summary').catch(() => ({ data: {} })),
        api.get('/properties/user/mine').catch(() => ({ data: [] })),
        api.get('/enquiries/mine').catch(() => ({ data: [] })),
        api.get('/dashboard/notifications').catch(() => ({ data: [] })),
      ]);

      if (sumRes.data) setSummary(sumRes.data);
      if (propRes.data) setMyProperties(propRes.data);
      if (enqRes.data) setMyEnquiries(enqRes.data);
      if (notifRes.data) setNotifications(notifRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  const handleWithdrawProperty = async (propId: string) => {
    if (!confirm('Are you sure you want to withdraw this property listing?')) return;
    try {
      await api.post(`/properties/user/${propId}/withdraw`);
      fetchDashboardData();
    } catch (err: any) {
      alert(err.message || 'Failed to withdraw property');
    }
  };

  const handleMarkNotificationRead = async (notifId: string) => {
    try {
      await api.patch(`/dashboard/notifications/${notifId}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notifId ? { ...n, isRead: true } : n))
      );
    } catch (e) {
      // Ignore
    }
  };

  const getStatusBadge = (approval: string, pub: string) => {
    if (pub === 'published') {
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
          ● Published & Live
        </span>
      );
    }
    if (approval === 'pending_review') {
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
          ⏳ Under Administrative Review
        </span>
      );
    }
    if (approval === 'rejected') {
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">
          ✕ Not Approved
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800">
        Draft
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Top metrics summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Listings</span>
            <Home className="w-5 h-5 text-gold-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-navy-900 font-sans">
            {summary.totalProperties || myProperties.length}
          </div>
          <p className="text-[11px] text-slate-500">
            Plots, houses, and commercial
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Approved & Live</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-navy-900 font-sans">
            {summary.publishedProperties || myProperties.filter((p) => p.publicationStatus === 'published').length}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium">Visible to verified buyers</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Approval</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-navy-900 font-sans">
            {summary.pendingProperties || myProperties.filter((p) => p.approvalStatus === 'pending_review' || p.approvalStatus === 'draft').length}
          </div>
          <p className="text-[11px] text-amber-600 font-medium">Under admin review</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Buyer Enquiries</span>
            <FileText className="w-5 h-5 text-gold-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-navy-900 font-sans">
            {summary.activeEnquiries || myEnquiries.length}
          </div>
          <p className="text-[11px] text-slate-500">Received on your properties</p>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'overview', label: 'Dashboard Overview' },
          { id: 'properties', label: `My Submitted Properties (${myProperties.length})` },
          { id: 'enquiries', label: `Buyer Enquiries (${myEnquiries.length})` },
          { id: 'notifications', label: `Notifications (${notifications.length})` },
        ].map((tab) => (
          <Link
            key={tab.id}
            to={`/dashboard?tab=${tab.id}`}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === tab.id
                ? 'bg-navy-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* TAB CONTENT */}

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="bg-navy-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="font-heading font-bold text-xl sm:text-2xl">
                Ready to Sell or Rent Another Property?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-light max-w-xl">
                Submit plots, houses, or commercial spaces for verified publication on Banashankari Enterprises.
              </p>
            </div>
            <div className="flex space-x-3 shrink-0">
              <Link
                to="/sell-property"
                className="bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold px-5 py-3 rounded-xl shadow-gold-glow flex items-center space-x-2 transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Submit for Sale</span>
              </Link>
              <Link
                to="/rent-lease-property"
                className="border border-slate-400 hover:bg-white/10 text-white text-xs font-semibold px-5 py-3 rounded-xl transition"
              >
                <span>List for Rent</span>
              </Link>
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-lg text-navy-900">Recent Listing Submissions</h3>
              <Link to="/dashboard?tab=properties" className="text-xs font-bold text-gold-600 hover:underline">
                View All Listings →
              </Link>
            </div>

            {myProperties.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                You haven't submitted any listings yet. Click "Submit for Sale" above to get started.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {myProperties.slice(0, 3).map((prop) => (
                  <div key={prop._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[11px] font-bold text-slate-500">{prop.referenceId}</span>
                        {getStatusBadge(prop.approvalStatus, prop.publicationStatus)}
                      </div>
                      <h4 className="font-semibold text-sm text-navy-900">{prop.title}</h4>
                      <p className="text-xs text-slate-400">
                        {prop.location.locality}, Bangalore • {formatIndianCurrency(prop.pricing.price, prop.listingPurpose)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/properties/${prop.slug}`}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. MY PROPERTIES TAB */}
      {activeTab === 'properties' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-heading font-bold text-xl text-navy-900">
              My Submitted Properties ({myProperties.length})
            </h2>
            <Link
              to="/sell-property"
              className="bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Property</span>
            </Link>
          </div>

          {myProperties.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
              <Home className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-heading font-bold text-base text-navy-900">No properties submitted yet</h3>
              <p className="text-xs text-slate-500">
                You can submit your residential plot, villa, apartment, or commercial space for sale or rent.
              </p>
              <Link to="/sell-property" className="inline-block bg-navy-900 text-white px-5 py-2.5 rounded-xl text-xs font-semibold">
                Submit Property for Sale
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myProperties.map((prop) => (
                <div key={prop._id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-navy-900 bg-slate-100 px-2 py-0.5 rounded">
                        {prop.referenceId}
                      </span>
                      {getStatusBadge(prop.approvalStatus, prop.publicationStatus)}
                      <span className="text-xs text-slate-400 capitalize">
                        {prop.propertyType} • For {prop.listingPurpose}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-lg text-navy-900">{prop.title}</h3>
                    <p className="text-xs text-slate-500">
                      {prop.location.locality}, Bangalore • Expected:{' '}
                      <strong className="text-navy-900">{formatIndianCurrency(prop.pricing.price, prop.listingPurpose)}</strong>
                    </p>

                    {prop.reviewNotes && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 mt-2">
                        <strong>Administrative Feedback:</strong> {prop.reviewNotes}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <Link
                      to={`/properties/${prop.slug}`}
                      className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Listing</span>
                    </Link>

                    {prop.availabilityStatus === 'available' && (
                      <button
                        onClick={() => handleWithdrawProperty(prop._id)}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 transition"
                      >
                        Withdraw Listing
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. BUYER ENQUIRIES TAB */}
      {activeTab === 'enquiries' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-heading font-bold text-xl text-navy-900">
              Buyer Enquiries on Your Properties ({myEnquiries.length})
            </h2>
            <p className="text-xs text-slate-500">
              Prospective buyers and site visit requests received for your listed Bengaluru properties.
            </p>
          </div>

          {myEnquiries.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-heading font-bold text-base text-navy-900">No buyer enquiries yet</h3>
              <p className="text-xs text-slate-500">
                When prospective buyers request site visits or express interest in your plots or houses, their details will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {myEnquiries.map((enq) => {
                const prop = enq.propertyId as any;
                return (
                  <div key={enq._id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-navy-900 bg-slate-100 px-2.5 py-1 rounded">
                          Ref: #{enq.referenceId}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-gold-50 text-gold-700">
                          {enq.category.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 uppercase tracking-wider">
                        Status: {enq.status.replace('_', ' ')}
                      </span>
                    </div>

                    {prop && typeof prop === 'object' && prop.title && (
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <Building2 className="w-4 h-4 text-gold-600" />
                          <span className="font-bold text-navy-900">{prop.title}</span>
                          <span className="text-slate-400">• {prop.location?.locality || 'Bengaluru'}</span>
                        </div>
                        {prop.pricing?.price && (
                          <span className="font-semibold text-slate-700">
                            {formatIndianCurrency(prop.pricing.price)}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Buyer Name:</span>
                        <strong className="text-slate-800">{enq.customerName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Contact Phone:</span>
                        <a href={`tel:${enq.phone}`} className="text-navy-900 font-bold hover:text-gold-600">
                          {enq.phone}
                        </a>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700">
                      <span className="font-semibold text-slate-900 block mb-0.5">Enquiry Note:</span>
                      <p className="italic text-slate-600">
                        "{enq.details?.message || 'Expressed direct interest in your listing.'}"
                      </p>
                    </div>

                    {enq.customerResponse && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                        <strong className="block text-emerald-950 mb-0.5">Banashankari Team Update:</strong>
                        <p>{enq.customerResponse}</p>
                      </div>
                    )}

                    <div className="text-[11px] text-slate-400 pt-1 flex items-center justify-between">
                      <span>Submitted on {new Date(enq.createdAt).toLocaleDateString('en-IN')}</span>
                      <a
                        href={`https://wa.me/91${enq.phone.replace(/[^0-9]/g, '').slice(-10)}?text=${encodeURIComponent(`Hi ${enq.customerName}, regarding your enquiry on Banashankari Enterprises for property ref #${enq.referenceId}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 hover:text-emerald-800 font-semibold"
                      >
                        Contact Buyer on WhatsApp →
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 5. NOTIFICATIONS TAB */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <h2 className="font-heading font-bold text-xl text-navy-900">
            Account & Listing Notifications
          </h2>

          {notifications.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
              <Bell className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-heading font-bold text-base text-navy-900">All caught up!</h3>
              <p className="text-xs text-slate-500">
                You will receive updates here when your properties are reviewed or replies are dispatched.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`p-4 rounded-2xl border transition flex items-start justify-between space-x-3 ${
                    notif.isRead
                      ? 'bg-white border-slate-200'
                      : 'bg-gold-50/50 border-gold-200 shadow-sm'
                  }`}
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-navy-900">{notif.title}</h4>
                    <p className="text-xs text-slate-600">{notif.message}</p>
                    <span className="text-[10px] text-slate-400 block">
                      {new Date(notif.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {!notif.isRead && (
                    <button
                      onClick={() => handleMarkNotificationRead(notif._id)}
                      className="text-xs text-slate-400 hover:text-gold-600 p-1"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
