import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Calendar,
  Layers,
} from 'lucide-react';

interface FrontendProject {
  _id: string;
  title: string;
  location: string;
  clientType: string;
  status: 'completed' | 'in_progress';
  builtUpArea: string;
  coverImage: string;
  description: string;
  features: string[];
  completionYear: number;
}

const ONGOING_PROJECTS: FrontendProject[] = [
  {
    _id: 'ongoing-1',
    title: 'Multi-Storey Residential Building (G+3)',
    location: 'Bengaluru, Karnataka',
    clientType: 'Turnkey Residential',
    status: 'in_progress',
    builtUpArea: '4,200 sq. ft.',
    coverImage: '/projects/ongoing-project-1.jpg',
    description:
      'Ongoing multi-storey residential construction featuring stilt parking, modern elevation with natural ventilation, and structural RCC execution under direct supervision.',
    features: [
      'Stilt Parking + 3 Residential Floors',
      'Earthquake-Resistant RCC Frame Structure',
      'Direct Site Supervision by Ramesh S H',
    ],
    completionYear: 2026,
  },
  {
    _id: 'ongoing-2',
    title: 'Modern Stilt + 2 Floor Residence',
    location: 'Bengaluru, Karnataka',
    clientType: 'Custom Home',
    status: 'in_progress',
    builtUpArea: '3,100 sq. ft.',
    coverImage: '/projects/ongoing-project-2.jpg',
    description:
      'Ongoing contemporary residential home with dedicated stilt car parking, architectural facade lighting, wooden cladding accents, and premium turnkey finishing.',
    features: [
      'Dedicated Stilt Car & Two-Wheeler Parking',
      'Contemporary Facade with Warm LED Accent Lighting',
      'A-Grade Cement & Fe-550D Steel Execution',
    ],
    completionYear: 2026,
  },
];

export const OurProjectsPage: React.FC = () => {
  const [projects] = useState<FrontendProject[]>(ONGOING_PROJECTS);
  const [activeFilter, setActiveFilter] = useState<'all' | 'completed' | 'in_progress'>('all');
  const [enquiryForm, setEnquiryForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    category: 'construction',
    message: '',
  });
  const [enquirySuccess, setEnquirySuccess] = useState('');

  const handleProjectEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (enquiryForm.phone.length !== 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    setEnquirySuccess(
      `Thank you, ${enquiryForm.customerName}! Your enquiry details have been noted. Ramesh S H and our team will contact you shortly on +91 ${enquiryForm.phone}.`
    );
    setEnquiryForm({ customerName: '', phone: '', email: '', category: 'construction', message: '' });
  };

  const filteredProjects = projects.filter((p) => {
    if (activeFilter === 'all') return true;
    return p.status === activeFilter;
  });

  return (
    <div className="space-y-12 sm:space-y-16 pt-8 sm:pt-12 pb-20">
      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 bg-amber-50 border border-amber-200 text-amber-700 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-gold-600" />
            <span>Turnkey Execution Portfolio</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Our Landmark Projects
          </h1>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="inline-flex bg-slate-100 p-1 rounded-2xl border border-slate-200/80 text-xs font-semibold">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-xl transition ${activeFilter === 'all'
                ? 'bg-white text-navy-950 shadow-sm border border-slate-200/60 font-bold'
                : 'text-slate-600 hover:text-navy-950'
                }`}
            >
              All Projects ({projects.length})
            </button>
            <button
              onClick={() => setActiveFilter('completed')}
              className={`px-4 py-2 rounded-xl transition ${activeFilter === 'completed'
                ? 'bg-white text-navy-950 shadow-sm border border-slate-200/60 font-bold'
                : 'text-slate-600 hover:text-navy-950'
                }`}
            >
              Completed ({projects.filter((p) => p.status === 'completed').length})
            </button>
            <button
              onClick={() => setActiveFilter('in_progress')}
              className={`px-4 py-2 rounded-xl transition ${activeFilter === 'in_progress'
                ? 'bg-white text-navy-950 shadow-sm border border-slate-200/60 font-bold'
                : 'text-slate-600 hover:text-navy-950'
                }`}
            >
              Ongoing Construction ({projects.filter((p) => p.status === 'in_progress').length})
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-heading font-bold text-lg text-navy-900">No projects found in this category</h3>
            <p className="text-xs text-slate-500">Check back soon or view all completed landmark projects.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((proj) => (
              <div
                key={proj._id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  {/* Cover Image & Status Badge */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={proj.coverImage}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-navy-950/90 text-gold-400 border border-gold-500/30 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                      {proj.clientType}
                    </div>
                    <span
                      className={`absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm ${proj.status === 'completed'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-500 text-white'
                        }`}
                    >
                      {proj.status === 'completed' ? 'Completed Handover' : 'Under Construction'}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                        <span>{proj.location}</span>
                      </div>
                      <h3 className="font-heading font-bold text-lg text-navy-950 leading-snug group-hover:text-gold-600 transition">
                        {proj.title}
                      </h3>
                    </div>

                    <div className="inline-block text-xs font-bold text-navy-900 bg-gold-50/70 border border-gold-200/60 px-2.5 py-1 rounded-lg">
                      Built-up Area: {proj.builtUpArea}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-light line-clamp-3">
                      {proj.description}
                    </p>

                    {/* Features list */}
                    {proj.features && proj.features.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        {proj.features.slice(0, 3).map((f, i) => (
                          <div key={i} className="flex items-center space-x-1.5 text-xs text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span className="truncate">{f}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Info */}
                <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1 text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Year: {proj.completionYear || 2024}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Project Enquiry Form Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-luxury">
          <div className="max-w-3xl">
            <h3 className="font-heading font-bold text-2xl text-navy-900 mb-2">
              Enquire About a Project or Custom Home
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              Fill in your details below and our team will get back to you with project specifications, site visit scheduling, and estimates.
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
              <form onSubmit={handleProjectEnquiry} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={enquiryForm.customerName}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, customerName: e.target.value })}
                      placeholder="e.g. Ramesh"
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number (10 digits) *
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
                        title="Please enter a 10-digit mobile number"
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
                      Email Address *
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
                      Service Required *
                    </label>
                    <select
                      value={enquiryForm.category}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, category: e.target.value })}
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                    >
                      <option value="construction">Turnkey Home Construction</option>
                      <option value="property">Property Inspection / Purchase</option>
                      <option value="loan">Banking Loan Assistance</option>
                      <option value="khb">KHB Documentation Assistance</option>
                      <option value="general">General Real Estate Guidance</option>
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
                    placeholder="Tell us about your plot size, preferred project, locality, or construction requirements..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto bg-gold-500 hover:bg-gold-600 text-white font-semibold py-3 px-8 rounded-xl text-xs shadow-sm transition inline-flex items-center justify-center space-x-2"
                >
                  <span>Submit Enquiry</span>
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
