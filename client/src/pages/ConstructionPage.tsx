import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Hammer,
  CheckCircle2,
  HardHat,
  Ruler,
  Layers,
  FileSpreadsheet,
  ShieldCheck,
  Send,
  Building,
} from 'lucide-react';
import { api } from '../services/api';
import { IConstructionProject, COMPANY_INFO } from '@shared/types';
import { useAuth } from '../context/AuthContext';

export const ConstructionPage: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<IConstructionProject[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    projectLocation: 'Banashankari / Bengaluru',
    plotDimensions: '30x40 (1,200 Sqft)',
    proposedBuiltUpArea: 2400,
    floors: 2,
    constructionBudget: '₹45 Lakhs – ₹60 Lakhs',
    expectedStartDate: 'Within 2 Months',
    message: '',
  });

  const [submitted, setSubmitted] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res: any = await api.get('/content/projects');
        if (res.success && res.data) {
          setProjects(res.data);
        }
      } catch (err) {
        console.error('Error fetching construction projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res: any = await api.post('/enquiries', {
        category: 'construction',
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email,
        details: {
          projectLocation: formData.projectLocation,
          plotDimensions: formData.plotDimensions,
          proposedBuiltUpArea: Number(formData.proposedBuiltUpArea),
          floors: Number(formData.floors),
          constructionBudget: formData.constructionBudget,
          expectedStartDate: formData.expectedStartDate,
          message: formData.message,
        },
        consent: true,
      });

      if (res.success) {
        setSubmitted(res.data.referenceId);
      }
    } catch (err: any) {
      alert(err.message || 'Error submitting quotation request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const workflowSteps = [
    { title: '1. Initial Consultation', desc: 'Detailed discussion on architectural layout, Vaastu requirements, budget boundaries, and family living preferences.' },
    { title: '2. Site Assessment', desc: 'On-ground soil testing, road approach evaluation, Cauvery water line and BESCOM electrical grid verification.' },
    { title: '3. Design & Planning', desc: '2D architectural floor plans, 3D elevation renderings, structural engineering vetting, and municipal sanction drawings.' },
    { title: '4. Transparent Estimation', desc: 'Comprehensive itemized Bill of Quantities (BOQ) covering cement grades (53 grade), Fe550 TMT steel, and fixtures.' },
    { title: '5. Material & Contractor Oversight', desc: 'Direct on-site material inspections by Ramesh S H with zero unapproved brand substitutions.' },
    { title: '6. Structural Execution', desc: 'Excavation, footing concrete, RCC column casting, brick masonry, and slab reinforcement pouring.' },
    { title: '7. Quality Inspections', desc: 'Cube compressive strength testing, plumbing pressure checks, and concealed electrical insulation tests.' },
    { title: '8. Milestone Updates', desc: 'Regular digital progress reports with high-resolution site photographs sent directly to the client.' },
    { title: '9. Handover & Completion', desc: 'Final deep cleaning, key handover ceremony, structural warranty documentation, and as-built drawing handover.' },
  ];

  return (
    <div className="space-y-16 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block">
          Turnkey Building Coordination
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-navy-900 leading-tight">
          Bespoke Home Construction in Bengaluru
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed font-light">
          From vacant residential plots to finished luxury duplex residences. Led directly by Ramesh S H with rigid quality standards and transparent milestone accounting.
        </p>
      </div>

      {/* 9-Step End-to-End Workflow */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-luxury space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-navy-900">
            Our 9-Stage Construction Methodology
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Engineered for durability, aesthetic distinction, and total budget control.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {workflowSteps.map((step, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="font-heading font-bold text-sm text-navy-900 block">{step.title}</span>
              <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Showcase */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block">Portfolio</span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-navy-900">
            Featured Construction Projects
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((proj) => (
            <div key={proj._id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-luxury">
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img src={proj.coverImage} alt={proj.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-navy-950 text-gold-400">
                  {proj.status.replace('_', ' ')}
                </span>
              </div>
              <div className="p-6 space-y-3">
                <h3 className="font-heading font-bold text-lg text-navy-900">{proj.title}</h3>
                <p className="text-xs text-slate-500">{proj.location}</p>
                <div className="text-xs font-semibold text-gold-700 bg-gold-50 p-2 rounded-lg">
                  Built-up Area: {proj.builtUpArea}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Quotation Form */}
      <div className="bg-navy-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8">
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-400 block">
            Custom Estimate Request
          </span>
          <h2 className="font-heading text-3xl font-bold">Request an Itemized Construction Estimate</h2>
          <p className="text-xs sm:text-sm text-slate-300 font-light">
            Share your plot details and proposed specifications. Ramesh S H will prepare an indicative cost sheet without upfront obligation.
          </p>
        </div>

        {submitted ? (
          <div className="max-w-xl mx-auto p-6 rounded-2xl bg-navy-900 border border-gold-500/30 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-gold-400 mx-auto" />
            <h3 className="font-heading font-bold text-lg text-white">Quotation Request Received</h3>
            <p className="text-xs text-slate-300">
              Your tracking reference is <strong>#{submitted}</strong>. Our engineering desk will review your dimensions and schedule a preliminary consultation call.
            </p>
            <div className="pt-2">
              <Link
                to="/my-enquiries"
                className="inline-flex items-center space-x-1.5 font-bold text-gold-400 hover:text-gold-300 underline text-xs"
              >
                <span>Track this estimate in My Enquiries →</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-4 text-xs text-slate-300">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-semibold block mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="e.g. Anand Gowda"
                  className="w-full p-3 rounded-xl bg-navy-900 border border-navy-800 text-white focus:ring-2 focus:ring-gold-500"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98450 XXXXX"
                  className="w-full p-3 rounded-xl bg-navy-900 border border-navy-800 text-white focus:ring-2 focus:ring-gold-500"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="anand@example.com"
                  className="w-full p-3 rounded-xl bg-navy-900 border border-navy-800 text-white focus:ring-2 focus:ring-gold-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-semibold block mb-1">Plot Location in Bangalore *</label>
                <input
                  type="text"
                  required
                  value={formData.projectLocation}
                  onChange={(e) => setFormData({ ...formData, projectLocation: e.target.value })}
                  className="w-full p-3 rounded-xl bg-navy-900 border border-navy-800 text-white focus:ring-2 focus:ring-gold-500"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Plot Dimensions</label>
                <input
                  type="text"
                  value={formData.plotDimensions}
                  onChange={(e) => setFormData({ ...formData, plotDimensions: e.target.value })}
                  placeholder="e.g. 30x40, 30x50, 40x60"
                  className="w-full p-3 rounded-xl bg-navy-900 border border-navy-800 text-white focus:ring-2 focus:ring-gold-500"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Number of Floors</label>
                <select
                  value={formData.floors}
                  onChange={(e) => setFormData({ ...formData, floors: Number(e.target.value) })}
                  className="w-full p-3 rounded-xl bg-navy-900 border border-navy-800 text-white focus:ring-2 focus:ring-gold-500"
                >
                  <option value={1}>G Floor Only</option>
                  <option value={2}>G+1 Duplex</option>
                  <option value={3}>G+2 Floors</option>
                  <option value={4}>G+3 Floors</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1">Estimated Construction Budget</label>
              <input
                type="text"
                value={formData.constructionBudget}
                onChange={(e) => setFormData({ ...formData, constructionBudget: e.target.value })}
                placeholder="e.g. ₹50 Lakhs – ₹70 Lakhs"
                className="w-full p-3 rounded-xl bg-navy-900 border border-navy-800 text-white focus:ring-2 focus:ring-gold-500"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Special Preferences or Architectural Notes</label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Mention specific requirements such as rental portions on upper floors, lift provision, solar power..."
                className="w-full p-3 rounded-xl bg-navy-900 border border-navy-800 text-white focus:ring-2 focus:ring-gold-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-3.5 rounded-xl transition shadow-gold-glow"
            >
              {isSubmitting ? 'Submitting Quotation Request...' : 'Submit Quotation Request to Ramesh S H'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
