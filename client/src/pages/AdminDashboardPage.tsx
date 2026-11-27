import React, { useState, useEffect } from 'react';
import { useLocation, Link, useOutletContext } from 'react-router-dom';
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
  Trash2,
} from 'lucide-react';
import { api } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { formatIndianCurrency } from '../components/property/PropertyCard';
import { IProperty, IEnquiry, IUser, IAuditLog, ISiteSettings } from '@shared/types';

export const AdminDashboardPage: React.FC = () => {
  const location = useLocation();
  const outletContext = useOutletContext<{ isDark?: boolean } | null>();
  const isDark = Boolean(outletContext?.isDark);

  // Route sub-views based on pathname
  const path = location.pathname;
  const isPropertiesView = path.includes('/properties');
  const isEnquiriesView = path.includes('/enquiries');
  const isUsersView = path.includes('/users');
  const isSettingsView = path.includes('/settings');
  const isAuditView = path.includes('/audit');
  const isOverview = !isPropertiesView && !isEnquiriesView && !isUsersView && !isSettingsView && !isAuditView;

  // State
  const [analytics, setAnalytics] = useState<any>(null);
  const { updateSettingsState, refreshSettings } = useSettings();
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [enquiries, setEnquiries] = useState<IEnquiry[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<IAuditLog[]>([]);
  const [settings, setSettings] = useState<ISiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccessMsg, setSettingsSuccessMsg] = useState('');

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
    setSavingSettings(true);
    setSettingsSuccessMsg('');
    try {
      const payload = {
        primaryPhone: settings.primaryPhone,
        whatsappNumber: settings.whatsappNumber,
        clientsCount: Number(settings.clientsCount) || 0,
        completedProjectsCount: Number(settings.completedProjectsCount) || 0,
        yearsExperience: Number(settings.yearsExperience) || 0,
      };
      const res: any = await api.patch('/content/settings', payload);
      if (res && res.data) {
        setSettings(res.data);
        updateSettingsState(res.data);
      } else {
        updateSettingsState(payload);
      }
      await refreshSettings();
      setSettingsSuccessMsg('Website CMS settings saved successfully! Updated phone, WhatsApp, and metrics are now live.');
      setTimeout(() => setSettingsSuccessMsg(''), 6000);
    } catch (err: any) {
      alert(err.message || 'Error saving settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleDeleteUser = async (targetUser: IUser) => {
    if (!window.confirm(`Delete user "${targetUser.name}" (${targetUser.email})? This action cannot be undone.`)) {
      return;
    }
    try {
      await api.delete(`/admin/users/${targetUser._id}`);
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Error deleting user');
    }
  };

  const handleDeleteEnquiry = async (enquiry: IEnquiry) => {
    if (!window.confirm(`Delete enquiry ${enquiry.referenceId} from "${enquiry.customerName}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await api.delete(`/admin/enquiries/${enquiry._id}`);
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Error deleting enquiry');
    }
  };

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
    <div className="space-y-8 text-slate-900 dark:text-slate-100">
      {/* 1. OVERVIEW & ANALYTICS VIEW */}
      {isOverview && (
        <div className="space-y-8">
          {/* Welcome & Quick Action Header */}
          <div className="bg-white dark:bg-navy-950 p-6 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-heading font-bold text-2xl text-navy-900 dark:text-white">
                Admin Control Center
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct administrative management of properties, customer enquiries, and construction projects.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/admin/properties/new"
                className="bg-amber-500 hover:bg-amber-600 text-navy-950 font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center space-x-1.5 shadow"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ List New Property</span>
              </Link>
            </div>
          </div>

          {/* Top Live Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-navy-950 p-5 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Users</span>
              <div className="text-2xl sm:text-3xl font-bold text-navy-900 dark:text-white font-sans">
                {analytics?.metrics?.totalUsers || users.length}
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                {analytics?.metrics?.activeUsers || users.length} active customer accounts
              </p>
            </div>

            <div className="bg-white dark:bg-navy-950 p-5 rounded-2xl border border-amber-200 dark:border-amber-500/30 shadow-sm space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Total Properties</span>
              <div className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400 font-sans">
                {analytics?.metrics?.totalProperties || properties.length}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Admin-managed inventory</p>
            </div>

            <div className="bg-white dark:bg-navy-950 p-5 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Published Listings</span>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 font-sans">
                {analytics?.metrics?.publishedListings || properties.filter((p) => p.publicationStatus === 'published').length}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Live on public search</p>
            </div>

            <div className="bg-white dark:bg-navy-950 p-5 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Enquiries</span>
              <div className="text-2xl sm:text-3xl font-bold text-gold-600 dark:text-gold-400 font-sans">
                {analytics?.metrics?.totalEnquiries || enquiries.length}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Property, construction, loan & KHB</p>
            </div>
          </div>

          {/* Recharts Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Enquiries Breakdown */}
            <div className="bg-white dark:bg-navy-950 p-6 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm space-y-4">
              <h3 className="font-heading font-bold text-base text-navy-900 dark:text-white">Enquiries by Category</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics?.charts?.categoryBreakdown || []}>
                    <XAxis dataKey="name" stroke="#64748B" fontSize={10} />
                    <YAxis stroke="#64748B" fontSize={10} />
                    <Tooltip
                      contentStyle={
                        isDark
                          ? { backgroundColor: '#0B1B33', borderColor: '#1E293B', color: '#F8FAFC', borderRadius: '8px' }
                          : { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', color: '#0B1B33', borderRadius: '8px' }
                      }
                    />
                    <Bar dataKey="value" fill="#C59B27" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Property Status Breakdown */}
            <div className="bg-white dark:bg-navy-950 p-6 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm space-y-4">
              <h3 className="font-heading font-bold text-base text-navy-900 dark:text-white">Property Moderation Statuses</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics?.charts?.propertyStatusBreakdown || []}>
                    <XAxis dataKey="status" stroke="#64748B" fontSize={10} />
                    <YAxis stroke="#64748B" fontSize={10} />
                    <Tooltip
                      contentStyle={
                        isDark
                          ? { backgroundColor: '#0B1B33', borderColor: '#1E293B', color: '#F8FAFC', borderRadius: '8px' }
                          : { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', color: '#0B1B33', borderRadius: '8px' }
                      }
                    />
                    <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 2. ALL PROPERTIES VIEW */}
      {isPropertiesView && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h2 className="font-heading font-bold text-2xl text-navy-900 dark:text-white">
                All Property Listings ({properties.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage publication status, featured flags, and availability states.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/admin/properties/new"
                className="bg-amber-500 hover:bg-amber-600 text-navy-950 font-bold px-4 py-2 rounded-xl text-xs transition flex items-center space-x-1.5 shadow"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ List New Property</span>
              </Link>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search reference, title..."
                  value={propSearch}
                  onChange={(e) => setPropSearch(e.target.value)}
                  className="pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-navy-950 border border-slate-300 dark:border-navy-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-navy-950 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-navy-900 border-b border-slate-200 dark:border-navy-800 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
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
              <tbody className="divide-y divide-slate-100 dark:divide-navy-900">
                {filteredProperties.map((prop) => (
                  <tr key={prop._id} className="hover:bg-slate-50 dark:hover:bg-navy-900/40">
                    <td className="p-4 font-mono font-bold text-amber-600 dark:text-amber-400">{prop.referenceId}</td>
                    <td className="p-4">
                      <p className="font-semibold text-navy-900 dark:text-white truncate max-w-xs">{prop.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{prop.location.locality}</p>
                    </td>
                    <td className="p-4 font-sans font-bold text-navy-900 dark:text-slate-100">
                      {formatIndianCurrency(prop.pricing.price, prop.listingPurpose)}
                    </td>
                    <td className="p-4">
                      <span className="capitalize px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                        {prop.approvalStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleTogglePublish(prop._id)}
                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition ${
                          prop.publicationStatus === 'published'
                            ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/40'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {prop.publicationStatus}
                      </button>
                    </td>
                    <td className="p-4">
                      <select
                        value={prop.availabilityStatus}
                        onChange={(e) => handleUpdateAvailability(prop._id, e.target.value)}
                        className="bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-800 text-xs rounded p-1 text-slate-800 dark:text-slate-200"
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
                        className={`p-1 rounded ${prop.featured ? 'text-amber-500 dark:text-amber-400' : 'text-slate-400 dark:text-slate-600 hover:text-amber-500 dark:hover:text-amber-400'}`}
                        title="Toggle Featured"
                      >
                        <Star className={`w-4 h-4 ${prop.featured ? 'fill-amber-400' : ''}`} />
                      </button>
                      <a
                        href={`/properties/${prop.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 text-slate-500 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white inline-block"
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
              <h2 className="font-heading font-bold text-2xl text-navy-900 dark:text-white">
                Customer Enquiries & Liaison Requests
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage property queries, construction quotations, loan inquiries, and KHB requests.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={enquiryCategoryFilter}
                onChange={(e) => setEnquiryCategoryFilter(e.target.value)}
                className="bg-white dark:bg-navy-950 border border-slate-300 dark:border-navy-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white"
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
              <div key={enq._id} className="bg-white dark:bg-navy-950 p-6 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-navy-900 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-500/30">
                      {enq.referenceId}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-900 text-navy-900 dark:text-gold-400 border border-slate-200 dark:border-gold-500/20">
                      {enq.category}
                    </span>
                  </div>

                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase">
                    Status: {enq.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Customer Name</span>
                    <strong className="text-navy-900 dark:text-white text-sm">{enq.customerName}</strong>
                    <div className="space-y-1 mt-1 text-slate-600 dark:text-slate-400">
                      <p className="flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-gold-600 dark:text-gold-500" />
                        <a href={`tel:${enq.phone}`} className="hover:text-navy-900 dark:hover:text-white">{enq.phone}</a>
                      </p>
                      <p className="flex items-center space-x-1">
                        <Mail className="w-3 h-3 text-gold-600 dark:text-gold-500" />
                        <span>{enq.email}</span>
                      </p>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Enquiry Requirements</span>
                    <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-light">
                      {enq.details?.message || 'No description entered'}
                    </p>

                    {enq.details?.constructionBudget && (
                      <p className="text-[11px] text-amber-700 dark:text-gold-300">
                        <strong>Budget:</strong> {enq.details.constructionBudget} • <strong>Plot:</strong> {enq.details.plotDimensions}
                      </p>
                    )}
                    {enq.details?.approximateLoanAmount && (
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                        <strong>Requested Loan:</strong> ₹{enq.details.approximateLoanAmount.toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Internal notes banner (Protected from customer) */}
                {enq.internalNotes && (
                  <div className="p-3 bg-amber-50 dark:bg-navy-900 rounded-xl border border-amber-200 dark:border-navy-800 text-xs text-amber-900 dark:text-amber-200">
                    <span className="font-bold text-amber-700 dark:text-amber-400 block text-[10px] uppercase">
                      🔒 Internal Administrator Note:
                    </span>
                    {enq.internalNotes}
                  </div>
                )}

                <div className="flex justify-end items-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      setSelectedEnquiry(enq);
                      setEnquiryStatus(enq.status);
                      setInternalNotes(enq.internalNotes || '');
                      setCustomerResponse(enq.customerResponse || '');
                    }}
                    className="bg-navy-900 hover:bg-navy-850 dark:border dark:border-navy-800 text-white px-4 py-2 rounded-xl text-xs font-semibold transition"
                  >
                    Update Status & Add Notes
                  </button>
                  <button
                    onClick={() => handleDeleteEnquiry(enq)}
                    className="inline-flex items-center space-x-1.5 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 border border-red-200 dark:border-red-500/40 text-red-600 dark:text-red-400 px-3.5 py-2 rounded-xl text-xs font-semibold transition"
                    title="Delete enquiry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
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
              <h2 className="font-heading font-bold text-2xl text-navy-900 dark:text-white">
                Registered Users ({users.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                View registered customers, filter by status, and suspend, activate, or delete accounts.
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by name, email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-navy-950 border border-slate-300 dark:border-navy-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-navy-950 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-navy-900 border-b border-slate-200 dark:border-navy-800 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Account Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-navy-900">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-navy-900/40">
                    <td className="p-4 font-bold text-navy-900 dark:text-white">{u.name}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{u.email}</td>
                    <td className="p-4">{u.phone}</td>
                    <td className="p-4 uppercase text-[10px] font-bold text-amber-700 dark:text-gold-400">{u.role}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.accountStatus === 'active'
                            ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-transparent'
                            : 'bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-transparent'
                        }`}
                      >
                        {u.accountStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {u.role !== 'admin' && (
                        <div className="inline-flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleUserStatus(u)}
                            className={`text-xs font-semibold px-3 py-1 rounded-lg border transition ${
                              u.accountStatus === 'active'
                                ? 'border-amber-300 dark:border-red-500/40 text-amber-700 dark:text-red-400 hover:bg-amber-50 dark:hover:bg-red-950/40'
                                : 'border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                            }`}
                          >
                            {u.accountStatus === 'active' ? 'Suspend Account' : 'Activate Account'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u)}
                            className="inline-flex items-center space-x-1 text-xs font-semibold px-3 py-1 rounded-lg border border-red-200 dark:border-red-500/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/60 transition"
                            title="Delete user"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
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
            <h2 className="font-heading font-bold text-2xl text-navy-900 dark:text-white">Website CMS Content Settings</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage official phone number, WhatsApp contact number, and homepage About Company scroll-animated metrics.
            </p>
          </div>

          {settingsSuccessMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center space-x-3 shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{settingsSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="bg-white dark:bg-navy-950 p-8 rounded-3xl border border-slate-200 dark:border-navy-800 shadow-sm space-y-6 text-xs">
            {/* Phone & WhatsApp Contact Numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Phone Number (e.g. +91 997 253 6991)
                </label>
                <input
                  type="text"
                  value={settings.primaryPhone || ''}
                  onChange={(e) => setSettings({ ...settings, primaryPhone: e.target.value })}
                  placeholder="+91 997 253 6991"
                  className="w-full p-3 rounded-xl bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-amber-500 font-mono"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Reflects across website header, footer, floating call button, and contact cards.
                </span>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  WhatsApp Number (e.g. 919972536991 or +91 997 253 6991)
                </label>
                <input
                  type="text"
                  value={settings.whatsappNumber || ''}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  placeholder="919972536991"
                  className="w-full p-3 rounded-xl bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-amber-500 font-mono"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Reflects in floating WhatsApp button, direct chat links, and enquiry buttons.
                </span>
              </div>
            </div>

            {/* About Company Section & Scroll-Animated Metrics */}
            <div className="border-t border-slate-200 dark:border-navy-800 pt-6 mt-6">
              <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 mb-1">
                About Company Section &amp; Scroll-Animated Metrics
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-4">
                These numbers automatically animate upwards when visitors scroll into the &ldquo;About Company&rdquo; section on the home page.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Happy Clients Count (e.g. 1000+)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={settings.clientsCount ?? 1000}
                    onChange={(e) =>
                      setSettings({ ...settings, clientsCount: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full p-3 rounded-xl bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Displays as &quot;{settings.clientsCount ?? 1000}+&quot;
                  </span>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Completed Projects (e.g. 200+)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={settings.completedProjectsCount ?? 200}
                    onChange={(e) =>
                      setSettings({ ...settings, completedProjectsCount: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full p-3 rounded-xl bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Displays as &quot;{settings.completedProjectsCount ?? 200}+&quot;
                  </span>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Years of Experience (e.g. 15+)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={settings.yearsExperience ?? 15}
                    onChange={(e) =>
                      setSettings({ ...settings, yearsExperience: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full p-3 rounded-xl bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Displays as &quot;{settings.yearsExperience ?? 15}+ Years&quot;
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingSettings}
                className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-navy-950 font-bold px-6 py-3 rounded-xl transition shadow flex items-center space-x-2"
              >
                {savingSettings && <RefreshCw className="w-4 h-4 animate-spin text-navy-950" />}
                <span>{savingSettings ? 'Saving...' : 'Save Website CMS Settings'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 7. AUDIT TRAIL LOGS VIEW */}
      {isAuditView && (
        <div className="space-y-6">
          <div>
            <h2 className="font-heading font-bold text-2xl text-navy-900 dark:text-white">Security & Audit Logs</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Immutable record of administrative actions, moderation decisions, and user account status updates.
            </p>
          </div>

          <div className="bg-white dark:bg-navy-950 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-navy-900 border-b border-slate-200 dark:border-navy-800 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Admin Actor</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Target Type</th>
                  <th className="p-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-navy-900">
                {auditLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50 dark:hover:bg-navy-900/40">
                    <td className="p-4 text-slate-500 dark:text-slate-400">
                      {new Date(log.createdAt).toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 font-semibold text-navy-900 dark:text-white">{log.actorEmail}</td>
                    <td className="p-4 font-mono text-amber-600 dark:text-amber-400 font-bold">{log.action}</td>
                    <td className="p-4">{log.targetType}</td>
                    <td className="p-4 text-slate-500 dark:text-slate-400 max-w-xs truncate font-mono text-[11px]">
                      {JSON.stringify(log.details || {})}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Update Enquiry Status & Notes */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/50 dark:bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-navy-950 border border-slate-200 dark:border-navy-800 shadow-2xl rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-4 text-xs">
            <h3 className="font-heading font-bold text-lg text-navy-900 dark:text-white">
              Update Enquiry (Ref: {selectedEnquiry.referenceId})
            </h3>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Status</label>
              <select
                value={enquiryStatus}
                onChange={(e) => setEnquiryStatus(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-800 text-slate-900 dark:text-white"
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
              <label className="font-semibold text-amber-700 dark:text-amber-400 block mb-1">
                Internal Administrative Notes (Private - Never Visible to Customer)
              </label>
              <textarea
                rows={3}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Internal notes regarding client phone call, site inspection notes, quotation details..."
                className="w-full p-2.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Official Response (Visible in Customer Dashboard)
              </label>
              <textarea
                rows={3}
                value={customerResponse}
                onChange={(e) => setCustomerResponse(e.target.value)}
                placeholder="Type response that customer will view in their dashboard..."
                className="w-full p-2.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white"
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
