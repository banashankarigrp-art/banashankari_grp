import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  CheckSquare,
  AlertCircle,
  Building,
  Users,
  MessageSquare,
  Settings,
  History,
  CheckCircle2,
  XCircle,
  Eye,
  Search,
  ShieldAlert,
  Star,
  RefreshCw,
  Send,
  Phone,
  Mail,
  Lock,
  PlusCircle,
} from 'lucide-react';
import { api } from '../services/api';
import { formatIndianCurrency } from '../components/property/PropertyCard';
import { IProperty, IEnquiry, IUser, IAuditLog, ISiteSettings } from '@shared/types';

export const AdminDashboardPage: React.FC = () => {
  const location = useLocation();

  // Route sub-views based on pathname
  const path = location.pathname;
  const isApprovalsView = path.includes('/approvals');
  const isPropertiesView = path.includes('/properties');
  const isEnquiriesView = path.includes('/enquiries');
  const isUsersView = path.includes('/users');
  const isSettingsView = path.includes('/settings');
  const isAuditView = path.includes('/audit');
  const isOverview = !isApprovalsView && !isPropertiesView && !isEnquiriesView && !isUsersView && !isSettingsView && !isAuditView;

  // State
  const [analytics, setAnalytics] = useState<any>(null);
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [enquiries, setEnquiries] = useState<IEnquiry[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<IAuditLog[]>([]);
  const [settings, setSettings] = useState<ISiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Rejection modal
  const [rejectModalProperty, setRejectModalProperty] = useState<IProperty | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Enquiry response / notes modal
  const [selectedEnquiry, setSelectedEnquiry] = useState<IEnquiry | null>(null);
  const [enquiryStatus, setEnquiryStatus] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [customerResponse, setCustomerResponse] = useState('');

  // Filters
  const [propSearch, setPropSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [enquiryCategoryFilter, setEnquiryCategoryFilter] = useState('all');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [anRes, propRes, enqRes, userRes, setRes, logRes]: any = await Promise.all([
        api.get('/admin/analytics').catch(() => ({ data: null })),
        api.get('/admin/properties').catch(() => ({ data: [] })),
        api.get('/admin/enquiries').catch(() => ({ data: [] })),
        api.get('/admin/users').catch(() => ({ data: [] })),
        api.get('/content/settings').catch(() => ({ data: null })),
        api.get('/admin/audit-logs').catch(() => ({ data: [] })),
      ]);

      if (anRes.data) setAnalytics(anRes.data);
      if (propRes.data) setProperties(propRes.data);
      if (enqRes.data) setEnquiries(enqRes.data);
      if (userRes.data) setUsers(userRes.data);
      if (setRes.data) setSettings(setRes.data);
      if (logRes.data) setAuditLogs(logRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [location.pathname]);

  // Actions
  const handleApprove = async (id: string) => {
    try {
      await api.post(`/admin/properties/${id}/approve`, { publishImmediately: true });
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Error approving property');
    }
  };

  const handleReject = async () => {
    if (!rejectModalProperty || !rejectReason.trim()) {
      alert('Please enter a rejection reason');
      return;
    }
    try {
      await api.post(`/admin/properties/${rejectModalProperty._id}/reject`, { reason: rejectReason });
      setRejectModalProperty(null);
      setRejectReason('');
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Error rejecting property');
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      await api.post(`/admin/properties/${id}/toggle-publish`);
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Error toggling publication');
    }
  };

  const handleToggleFeature = async (id: string) => {
    try {
      await api.post(`/admin/properties/${id}/toggle-feature`);
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Error toggling feature status');
    }
  };

  const handleUpdateAvailability = async (id: string, status: string) => {
    try {
      await api.patch(`/admin/properties/${id}/availability`, { status });
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Error updating availability');
    }
  };

  const handleToggleUserStatus = async (user: IUser) => {
    const nextStatus = user.accountStatus === 'active' ? 'suspended' : 'active';
    const reason = prompt(`Confirm reason to set account status to ${nextStatus}:`);
    if (reason === null) return;
    try {
      await api.patch(`/admin/users/${user._id}/status`, { status: nextStatus, reason });
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Error updating user status');
    }
  };

  const handleSaveEnquiry = async () => {
    if (!selectedEnquiry) return;
    try {
      await api.patch(`/admin/enquiries/${selectedEnquiry._id}`, {
        status: enquiryStatus,
        internalNotes,
        customerResponse,
      });
      setSelectedEnquiry(null);
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Error saving enquiry details');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await api.patch('/content/settings', settings);
      alert('Website CMS settings saved successfully!');
    } catch (err: any) {
      alert(err.message || 'Error saving settings');
    }
  };

  const pendingApprovals = properties.filter((p) => p.approvalStatus === 'pending_review');

  const filteredProperties = properties.filter((p) => {
    if (!propSearch) return true;
    const s = propSearch.toLowerCase();
    return (
      p.title.toLowerCase().includes(s) ||
      p.referenceId.toLowerCase().includes(s) ||
      p.location.locality.toLowerCase().includes(s)
    );
  });

  const filteredEnquiries = enquiries.filter((e) => {
    if (enquiryCategoryFilter === 'all') return true;
    return e.category === enquiryCategoryFilter;
  });

  const filteredUsers = users.filter((u) => {
    if (!userSearch) return true;
    const s = userSearch.toLowerCase();
    return (
      u.name.toLowerCase().includes(s) ||
      u.email.toLowerCase().includes(s) ||
      u.phone.toLowerCase().includes(s)
    );
  });

  const COLORS = ['#C59B27', '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'];

  return (
    <div className="space-y-8 text-slate-100">
      {/* 1. OVERVIEW & ANALYTICS VIEW */}
      {isOverview && (
        <div className="space-y-8">
          {/* Welcome & Quick Action Header */}
          <div className="bg-navy-950 p-6 rounded-2xl border border-navy-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-heading font-bold text-2xl text-white">
                Admin Control Center
              </h2>
              <p className="text-xs text-slate-400">
                Direct administrative management of properties, customer enquiries, approvals, and construction projects.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/sell-property"
                className="bg-amber-500 hover:bg-amber-600 text-navy-950 font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center space-x-1.5 shadow"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ List New Property</span>
              </Link>
              <Link
                to="/admin/approvals"
                className="bg-navy-900 hover:bg-navy-850 text-amber-400 border border-amber-500/40 font-semibold px-4 py-2.5 rounded-xl text-xs transition flex items-center space-x-1.5"
              >
                <CheckSquare className="w-4 h-4" />
                <span>Pending Approvals ({pendingApprovals.length})</span>
              </Link>
            </div>
          </div>

          {/* Top Live Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-navy-950 p-5 rounded-2xl border border-navy-800 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Users</span>
              <div className="text-2xl sm:text-3xl font-bold text-white font-sans">
                {analytics?.metrics?.totalUsers || users.length}
              </div>
              <p className="text-[11px] text-emerald-400">
                {analytics?.metrics?.activeUsers || users.length} active customer accounts
              </p>
            </div>

            <div className="bg-navy-950 p-5 rounded-2xl border border-amber-500/30 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Pending Approvals</span>
              <div className="text-2xl sm:text-3xl font-bold text-amber-400 font-sans">
                {pendingApprovals.length}
              </div>
              <p className="text-[11px] text-slate-400">Awaiting moderator verification</p>
            </div>

            <div className="bg-navy-950 p-5 rounded-2xl border border-navy-800 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Published Listings</span>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-sans">
                {analytics?.metrics?.publishedListings || properties.filter((p) => p.publicationStatus === 'published').length}
              </div>
              <p className="text-[11px] text-slate-400">Live on public search</p>
            </div>

            <div className="bg-navy-950 p-5 rounded-2xl border border-navy-800 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Enquiries</span>
              <div className="text-2xl sm:text-3xl font-bold text-gold-400 font-sans">
                {analytics?.metrics?.totalEnquiries || enquiries.length}
              </div>
              <p className="text-[11px] text-slate-400">Property, construction, loan & KHB</p>
            </div>
          </div>

          {/* Recharts Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Enquiries Breakdown */}
            <div className="bg-navy-950 p-6 rounded-2xl border border-navy-800 space-y-4">
              <h3 className="font-heading font-bold text-base text-white">Enquiries by Category</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics?.charts?.categoryBreakdown || []}>
                    <XAxis dataKey="name" stroke="#64748B" fontSize={10} />
                    <YAxis stroke="#64748B" fontSize={10} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0B1B33', borderColor: '#1E293B', borderRadius: '8px' }}
                    />
                    <Bar dataKey="value" fill="#C59B27" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Property Status Breakdown */}
            <div className="bg-navy-950 p-6 rounded-2xl border border-navy-800 space-y-4">
              <h3 className="font-heading font-bold text-base text-white">Property Moderation Statuses</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics?.charts?.propertyStatusBreakdown || []}>
                    <XAxis dataKey="status" stroke="#64748B" fontSize={10} />
                    <YAxis stroke="#64748B" fontSize={10} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0B1B33', borderColor: '#1E293B', borderRadius: '8px' }}
                    />
                    <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Pending Approval Highlight */}
          {pendingApprovals.length > 0 && (
            <div className="bg-amber-950/40 border border-amber-500/40 p-6 rounded-2xl space-y-3">
              <div className="flex items-center space-x-2 text-amber-400">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <h3 className="font-bold text-sm">
                  {pendingApprovals.length} Property Listing(s) Require Moderator Approval
                </h3>
              </div>
              <p className="text-xs text-amber-200/80">
                Newly submitted listings must be reviewed for ownership declarations before they become publicly searchable.
              </p>
              <div className="pt-2">
                <a
                  href="/admin/approvals"
                  className="bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold px-4 py-2 rounded-xl text-xs inline-flex items-center space-x-1.5 transition"
                >
                  <span>Open Moderation Queue</span>
                  <CheckSquare className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. PROPERTY APPROVAL QUEUE VIEW */}
      {isApprovalsView && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-heading font-bold text-2xl text-white">Property Moderation Queue</h2>
              <p className="text-xs text-slate-400">
                Review submitted properties, verify BDA/title credentials, and publish to the live site.
              </p>
            </div>
            <button
              onClick={fetchAdminData}
              className="p-2 rounded-lg bg-navy-950 border border-navy-800 text-slate-300 hover:text-white"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {pendingApprovals.length === 0 ? (
            <div className="bg-navy-950 p-12 rounded-2xl border border-navy-800 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="font-bold text-sm text-white">All clear! No pending submissions</h3>
              <p className="text-xs text-slate-400">
                Customer listing submissions will appear here for review.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingApprovals.map((prop) => (
                <div key={prop._id} className="bg-navy-950 p-6 rounded-2xl border border-navy-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-navy-900 pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30">
                        {prop.referenceId}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        {prop.propertyType} • For {prop.listingPurpose}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">
                      Submitted on {new Date(prop.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-3 space-y-2">
                      <h3 className="font-heading font-bold text-lg text-white">{prop.title}</h3>
                      <p className="text-xs text-slate-300 leading-relaxed font-light">{prop.description}</p>
                      <div className="text-xs text-slate-400 space-y-1 pt-1">
                        <p><strong>Locality:</strong> {prop.location.locality}, Bangalore</p>
                        <p><strong>Price:</strong> {formatIndianCurrency(prop.pricing.price, prop.listingPurpose)}</p>
                        <p><strong>Area:</strong> {prop.builtUpArea || prop.landArea} {prop.areaUnit}</p>
                      </div>
                    </div>

                    <div className="rounded-xl overflow-hidden bg-navy-900 aspect-[16/10]">
                      <img src={prop.images?.[0]?.url} alt="Cover" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-navy-900">
                    <button
                      onClick={() => handleApprove(prop._id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Publish Live</span>
                    </button>

                    <button
                      onClick={() => setRejectModalProperty(prop)}
                      className="bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Listing</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. ALL PROPERTIES VIEW */}
      {isPropertiesView && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h2 className="font-heading font-bold text-2xl text-white">
                All Property Listings ({properties.length})
              </h2>
              <p className="text-xs text-slate-400">
                Manage publication status, featured flags, and availability states.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/sell-property"
                className="bg-amber-500 hover:bg-amber-600 text-navy-950 font-bold px-4 py-2 rounded-xl text-xs transition flex items-center space-x-1.5 shadow"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ List New Property</span>
              </Link>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search reference, title..."
                  value={propSearch}
                  onChange={(e) => setPropSearch(e.target.value)}
                  className="pl-9 pr-3 py-2 rounded-xl bg-navy-950 border border-navy-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-navy-950 rounded-2xl border border-navy-800 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-navy-900 border-b border-navy-800 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Reference</th>
                  <th className="p-4">Title & Locality</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Moderation</th>
                  <th className="p-4">Publication</th>
                  <th className="p-4">Availability</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-900">
                {filteredProperties.map((prop) => (
                  <tr key={prop._id} className="hover:bg-navy-900/40">
                    <td className="p-4 font-mono font-bold text-amber-400">{prop.referenceId}</td>
                    <td className="p-4">
                      <p className="font-semibold text-white truncate max-w-xs">{prop.title}</p>
                      <p className="text-[11px] text-slate-400">{prop.location.locality}</p>
                    </td>
                    <td className="p-4 font-sans font-bold">
                      {formatIndianCurrency(prop.pricing.price, prop.listingPurpose)}
                    </td>
                    <td className="p-4">
                      <span className="capitalize px-2 py-0.5 rounded bg-slate-800 text-slate-200">
                        {prop.approvalStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleTogglePublish(prop._id)}
                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition ${
                          prop.publicationStatus === 'published'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {prop.publicationStatus}
                      </button>
                    </td>
                    <td className="p-4">
                      <select
                        value={prop.availabilityStatus}
                        onChange={(e) => handleUpdateAvailability(prop._id, e.target.value)}
                        className="bg-navy-900 border border-navy-800 text-xs rounded p-1 text-slate-200"
                      >
                        <option value="available">Available</option>
                        <option value="under_offer">Under Offer</option>
                        <option value="sold">Sold</option>
                        <option value="rented">Rented</option>
                        <option value="leased">Leased</option>
                        <option value="withdrawn">Withdrawn</option>
                      </select>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleFeature(prop._id)}
                        className={`p-1 rounded ${prop.featured ? 'text-amber-400' : 'text-slate-600 hover:text-amber-400'}`}
                        title="Toggle Featured"
                      >
                        <Star className={`w-4 h-4 ${prop.featured ? 'fill-amber-400' : ''}`} />
                      </button>
                      <a
                        href={`/properties/${prop.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 text-slate-400 hover:text-white inline-block"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. CUSTOMER ENQUIRIES VIEW */}
      {isEnquiriesView && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h2 className="font-heading font-bold text-2xl text-white">
                Customer Enquiries & Liaison Requests
              </h2>
              <p className="text-xs text-slate-400">
                Manage property queries, construction quotations, loan inquiries, and KHB requests.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={enquiryCategoryFilter}
                onChange={(e) => setEnquiryCategoryFilter(e.target.value)}
                className="bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="all">All Categories</option>
                <option value="property">Property Inspection</option>
                <option value="construction">Home Construction</option>
                <option value="loan">Bank Loan Assistance</option>
                <option value="khb">KHB Assistance</option>
                <option value="general">General Messages</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredEnquiries.map((enq) => (
              <div key={enq._id} className="bg-navy-950 p-6 rounded-2xl border border-navy-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-navy-900 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                      {enq.referenceId}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-navy-900 text-gold-400 border border-gold-500/20">
                      {enq.category}
                    </span>
                  </div>

                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 uppercase">
                    Status: {enq.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Customer Name</span>
                    <strong className="text-white text-sm">{enq.customerName}</strong>
                    <div className="space-y-1 mt-1 text-slate-400">
                      <p className="flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-gold-500" />
                        <a href={`tel:${enq.phone}`} className="hover:text-white">{enq.phone}</a>
                      </p>
                      <p className="flex items-center space-x-1">
                        <Mail className="w-3 h-3 text-gold-500" />
                        <span>{enq.email}</span>
                      </p>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <span className="text-slate-400 block text-[10px]">Enquiry Requirements</span>
                    <p className="text-slate-200 leading-relaxed font-light">
                      {enq.details?.message || 'No description entered'}
                    </p>

                    {enq.details?.constructionBudget && (
                      <p className="text-[11px] text-gold-300">
                        <strong>Budget:</strong> {enq.details.constructionBudget} • <strong>Plot:</strong> {enq.details.plotDimensions}
                      </p>
                    )}
                    {enq.details?.approximateLoanAmount && (
                      <p className="text-[11px] text-emerald-300">
                        <strong>Requested Loan:</strong> ₹{enq.details.approximateLoanAmount.toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Internal notes banner (Protected from customer) */}
                {enq.internalNotes && (
                  <div className="p-3 bg-navy-900 rounded-xl border border-navy-800 text-xs text-amber-200">
                    <span className="font-bold text-amber-400 block text-[10px] uppercase">
                      🔒 Internal Administrator Note:
                    </span>
                    {enq.internalNotes}
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      setSelectedEnquiry(enq);
                      setEnquiryStatus(enq.status);
                      setInternalNotes(enq.internalNotes || '');
                      setCustomerResponse(enq.customerResponse || '');
                    }}
                    className="bg-navy-900 hover:bg-navy-850 border border-navy-800 text-white px-4 py-2 rounded-xl text-xs font-semibold"
                  >
                    Update Status & Add Notes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. USER MANAGEMENT VIEW */}
      {isUsersView && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h2 className="font-heading font-bold text-2xl text-white">
                Registered Users ({users.length})
              </h2>
              <p className="text-xs text-slate-400">
                View registered customers, filter by status, and suspend or activate accounts.
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by name, email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="pl-9 pr-3 py-2 rounded-xl bg-navy-950 border border-navy-800 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-navy-950 rounded-2xl border border-navy-800 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-navy-900 border-b border-navy-800 text-slate-400 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Account Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-900">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-navy-900/40">
                    <td className="p-4 font-bold text-white">{u.name}</td>
                    <td className="p-4 text-slate-300">{u.email}</td>
                    <td className="p-4">{u.phone}</td>
                    <td className="p-4 uppercase text-[10px] font-bold text-gold-400">{u.role}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.accountStatus === 'active'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {u.accountStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleUserStatus(u)}
                          className={`text-xs font-semibold px-3 py-1 rounded-lg border transition ${
                            u.accountStatus === 'active'
                              ? 'border-red-500/40 text-red-400 hover:bg-red-950/40'
                              : 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-950/40'
                          }`}
                        >
                          {u.accountStatus === 'active' ? 'Suspend Account' : 'Activate Account'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. WEBSITE CMS SETTINGS VIEW */}
      {isSettingsView && settings && (
        <div className="space-y-6">
          <div>
            <h2 className="font-heading font-bold text-2xl text-white">Website CMS Content Settings</h2>
            <p className="text-xs text-slate-400">
              Update hero typography, phone contacts, WhatsApp templates, and business hours without touching code.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="bg-navy-950 p-8 rounded-3xl border border-navy-800 space-y-6 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Company Display Name</label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  className="w-full p-3 rounded-xl bg-navy-900 border border-navy-800 text-white focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Founder Name</label>
                <input
                  type="text"
                  value={settings.founderName}
                  onChange={(e) => setSettings({ ...settings, founderName: e.target.value })}
                  className="w-full p-3 rounded-xl bg-navy-900 border border-navy-800 text-white focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Founder Title</label>
                <input
                  type="text"
                  value={settings.founderTitle || ''}
                  onChange={(e) => setSettings({ ...settings, founderTitle: e.target.value })}
                  placeholder="Founder & Managing Director"
                  className="w-full p-3 rounded-xl bg-navy-900 border border-navy-800 text-white focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Founder Photo URL / Base64</label>
                <div className="flex items-center space-x-3">
                  {settings.founderPhoto && (
                    <img
                      src={settings.founderPhoto}
                      alt="Founder Preview"
                      className="w-12 h-12 object-cover object-top rounded-lg border border-amber-500/50"
                    />
                  )}
                  <input
                    type="text"
                    value={settings.founderPhoto || ''}
                    onChange={(e) => setSettings({ ...settings, founderPhoto: e.target.value })}
                    placeholder="/founder.jpg or data:image/..."
                    className="flex-1 p-3 rounded-xl bg-navy-900 border border-navy-800 text-white focus:ring-1 focus:ring-amber-500 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Official Contact Phone</label>
                <input
                  type="text"
                  value={settings.primaryPhone}
                  onChange={(e) => setSettings({ ...settings, primaryPhone: e.target.value })}
                  className="w-full p-3 rounded-xl bg-navy-900 border border-navy-800 text-white focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Business Hours</label>
                <input
                  type="text"
                  value={settings.businessHours}
                  onChange={(e) => setSettings({ ...settings, businessHours: e.target.value })}
                  className="w-full p-3 rounded-xl bg-navy-900 border border-navy-800 text-white focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Hero Main Headline</label>
              <input
                type="text"
                value={settings.heroHeadline}
                onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
                className="w-full p-3 rounded-xl bg-navy-900 border border-navy-800 text-white focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Hero Subheading</label>
              <textarea
                rows={2}
                value={settings.heroSubheadline}
                onChange={(e) => setSettings({ ...settings, heroSubheadline: e.target.value })}
                className="w-full p-3 rounded-xl bg-navy-900 border border-navy-800 text-white focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Default WhatsApp Message Template</label>
              <textarea
                rows={2}
                value={settings.whatsappTemplate}
                onChange={(e) => setSettings({ ...settings, whatsappTemplate: e.target.value })}
                className="w-full p-3 rounded-xl bg-navy-900 border border-navy-800 text-white focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold px-6 py-3 rounded-xl transition shadow"
            >
              Save Website CMS Settings
            </button>
          </form>
        </div>
      )}

      {/* 7. AUDIT TRAIL LOGS VIEW */}
      {isAuditView && (
        <div className="space-y-6">
          <div>
            <h2 className="font-heading font-bold text-2xl text-white">Security & Audit Logs</h2>
            <p className="text-xs text-slate-400">
              Immutable record of administrative actions, moderation decisions, and user account status updates.
            </p>
          </div>

          <div className="bg-navy-950 rounded-2xl border border-navy-800 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-navy-900 border-b border-navy-800 text-slate-400 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Admin Actor</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Target Type</th>
                  <th className="p-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-900">
                {auditLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-navy-900/40">
                    <td className="p-4 text-slate-400">
                      {new Date(log.createdAt).toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 font-semibold text-white">{log.actorEmail}</td>
                    <td className="p-4 font-mono text-amber-400 font-bold">{log.action}</td>
                    <td className="p-4">{log.targetType}</td>
                    <td className="p-4 text-slate-400 max-w-xs truncate font-mono text-[11px]">
                      {JSON.stringify(log.details || {})}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Reject Listing */}
      {rejectModalProperty && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-navy-950 border border-navy-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4">
            <h3 className="font-heading font-bold text-lg text-white">
              Reject Property Submission
            </h3>
            <p className="text-xs text-slate-400">
              Provide a clear reason why listing "{rejectModalProperty.title}" is being rejected. The customer will receive this feedback.
            </p>

            <textarea
              rows={4}
              required
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Please supply copy of BDA allotment letter / EC does not match ownership details..."
              className="w-full p-3 rounded-xl bg-navy-900 border border-navy-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500"
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setRejectModalProperty(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Update Enquiry Status & Notes */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-navy-950 border border-navy-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-4 text-xs">
            <h3 className="font-heading font-bold text-lg text-white">
              Update Enquiry (Ref: {selectedEnquiry.referenceId})
            </h3>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Status</label>
              <select
                value={enquiryStatus}
                onChange={(e) => setEnquiryStatus(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-navy-900 border border-navy-800 text-white"
              >
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="contacted">Contacted Customer</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-amber-400 block mb-1">
                Internal Administrative Notes (Private - Never Visible to Customer)
              </label>
              <textarea
                rows={3}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Internal notes regarding client phone call, site inspection notes, quotation details..."
                className="w-full p-2.5 rounded-xl bg-navy-900 border border-navy-800 text-white focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">
                Official Response (Visible in Customer Dashboard)
              </label>
              <textarea
                rows={3}
                value={customerResponse}
                onChange={(e) => setCustomerResponse(e.target.value)}
                placeholder="Type response that customer will view in their dashboard..."
                className="w-full p-2.5 rounded-xl bg-navy-900 border border-navy-800 text-white focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEnquiry}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-navy-950 shadow"
              >
                Save Updates
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
