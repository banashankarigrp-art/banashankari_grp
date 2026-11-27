import React, { useState } from 'react';
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
  Video,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';
import { COMPANY_INFO } from '@shared/types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const ConstructionPage: React.FC = () => {
  const { user } = useAuth();
  const { isKn, t } = useLanguage();

  // Form State
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    phone: (user?.phone || '').replace(/\D/g, '').slice(-10),
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phone.length !== 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    try {
      setIsSubmitting(true);
      const res: any = await api.post('/enquiries', {
        category: 'construction',
        customerName: formData.customerName,
        phone: `+91 ${formData.phone}`,
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
    {
      stepNumber: '01',
      title: '1. Initial Consultation',
      knTitle: '1. ಆರಂಭಿಕ ಸಮಾಲೋಚನೆ',
      image: '/methodology/stage-1-initial-consultation.jpg',
      desc: 'Detailed discussion on architectural layout, Vaastu requirements, budget boundaries, and family living preferences.',
      knDesc: 'ವಾಸ್ತು ನಿಯಮಗಳು, ವಾಸ್ತುಶಿಲ್ಪ ವಿನ್ಯಾಸ, ಬಜೆಟ್ ಮಿತಿಗಳು ಮತ್ತು ಕುಟುಂಬದ ಅಗತ್ಯತೆಗಳ ವಿವರವಾದ ಚರ್ಚೆ.',
    },
    {
      stepNumber: '02',
      title: '2. Site Assessment',
      knTitle: '2. ನಿವೇಶನ ಪರಿಶೀಲನೆ',
      image: '/methodology/stage-2-site-assessment.jpg',
      desc: 'On-ground soil testing, road approach evaluation, Cauvery water line and BESCOM electrical grid verification.',
      knDesc: 'ಸ್ಥಳದಲ್ಲಿ ಮಣ್ಣಿನ ಪರೀಕ್ಷೆ, ರಸ್ತೆ ಸಂಪರ್ಕ ಪರಿಶೀಲನೆ, ಕಾವೇರಿ ನೀರಿನ ಲೈನ್ ಮತ್ತು ಬೆಸ್ಕಾಂ ವಿದ್ಯುತ್ ಗ್ರಿಡ್ ಪರಿಶೀಲನೆ.',
    },
    {
      stepNumber: '03',
      title: '3. Design & Planning',
      knTitle: '3. ವಿನ್ಯಾಸ & ಯೋಜನೆ',
      image: '/methodology/stage-3-design-planning.jpg',
      desc: '2D architectural floor plans, 3D elevation renderings, structural engineering vetting, and municipal sanction drawings.',
      knDesc: '2D ವಾಸ್ತುಶಿಲ್ಪ ನೆಲಮಹಡಿ ನಕ್ಷೆಗಳು, 3D ಎಲಿವೇಶನ್ ಚಿತ್ರಗಳು, ಸ್ಟ್ರಕ್ಚರಲ್ ಎಂಜಿನಿಯರಿಂಗ್ ವಿನ್ಯಾಸ ಮತ್ತು ಪಾಲಿಕೆ ಅನುಮೋದನೆ ರೇಖಾಚಿತ್ರಗಳು.',
    },
    {
      stepNumber: '04',
      title: '4. Transparent Estimation',
      knTitle: '4. ಪಾರದರ್ಶಕ ಅಂದಾಜು ಪಟ್ಟಿ',
      image: '/methodology/stage-4-transparent-estimation.jpg',
      desc: 'Comprehensive itemized Bill of Quantities (BOQ) covering cement grades (53 grade), Fe550 TMT steel, and fixtures.',
      knDesc: 'ಸಿಮೆಂಟ್ ಗ್ರೇಡ್‌ಗಳು (53 ಗ್ರೇಡ್), Fe550 TMT ಉಕ್ಕು ಮತ್ತು ಫಿಕ್ಚರ್‌ಗಳನ್ನು ಒಳಗೊಂಡ ಸಮಗ್ರ ಐಟಂವಾರು ಬಿಲ್ ಆಫ್ ಕ್ವಾಂಟಿಟೀಸ್ (BOQ).',
    },
    {
      stepNumber: '05',
      title: '5. Material & Contractor Oversight',
      knTitle: '5. ಸಾಮಗ್ರಿ & ಗುತ್ತಿಗೆದಾರರ ಮೇಲ್ವಿಚಾರಣೆ',
      image: '/methodology/stage-5-material-oversight.jpg',
      desc: 'Direct on-site material inspections by Ramesh S H with zero unapproved brand substitutions.',
      knDesc: 'ಅನಧಿಕೃತ ಬ್ರ್ಯಾಂಡ್ ಬದಲಾವಣೆಗಳಿಲ್ಲದೆ ರಮೇಶ್ ಎಸ್ ಹೆಚ್ ಅವರಿಂದ ನೇರ ಸೈಟ್ ಸಾಮಗ್ರಿ ಪರಿಶೀಲನೆ.',
    },
    {
      stepNumber: '06',
      title: '6. Structural Execution',
      knTitle: '6. ರಚನಾತ್ಮಕ ಕಾಮಗಾರಿ ನಿರ್ವಹಣೆ',
      image: '/methodology/stage-6-structural-execution.jpg',
      desc: 'Excavation, footing concrete, RCC column casting, brick masonry, and slab reinforcement pouring.',
      knDesc: 'ಅಗೆಯುವಿಕೆ, ಫೂಟಿಂಗ್ ಕಾಂಕ್ರೀಟ್, RCC ಪಿಲ್ಲರ್ ಕಾಸ್ಟಿಂಗ್, ಇಟ್ಟಿಗೆ ಕಲ್ಲುಕೆಲಸ ಮತ್ತು ಛಾವಣಿ ಸ್ಲ್ಯಾಬ್ ಕಾಂಕ್ರೀಟ್ ಸುರಿಯುವುದು.',
    },
    {
      stepNumber: '07',
      title: '7. Quality Inspections',
      knTitle: '7. ಗುಣಮಟ್ಟ ತಪಾಸಣೆಗಳು',
      image: '/methodology/stage-7-quality-inspections.jpg',
      desc: 'Cube compressive strength testing, plumbing pressure checks, and concealed electrical insulation tests.',
      knDesc: 'ಕಾಂಕ್ರೀಟ್ ಕ್ಯೂಬ್ ಸಾಮರ್ಥ್ಯ ಪರೀಕ್ಷೆ, ಪ್ಲಂಬಿಂಗ್ ಒತ್ತಡ ಪರೀಕ್ಷೆಗಳು ಮತ್ತು ಮರೆಮಾಚಲಾದ ವಿದ್ಯುತ್ ಇನ್ಸುಲೇಶನ್ ಪರೀಕ್ಷೆಗಳು.',
    },
    {
      stepNumber: '08',
      title: '8. Milestone Updates',
      knTitle: '8. ಹಂತವಾರು ಪ್ರಗತಿ ವರದಿಗಳು',
      image: '/methodology/stage-8-milestone-updates.jpg',
      desc: 'Regular digital progress reports with high-resolution site photographs sent directly to the client.',
      knDesc: 'ಗ್ರಾಹಕರಿಗೆ ನೇರವಾಗಿ ಕಳುಹಿಸಲಾಗುವ ಹೈ-ರೆಸಲ್ಯೂಶನ್ ಸೈಟ್ ಫೋಟೋಗಳೊಂದಿಗೆ ನಿಯಮಿತ ಡಿಜಿಟಲ್ ಪ್ರಗತಿ ವರದಿಗಳು.',
    },
    {
      stepNumber: '09',
      title: '9. Handover & Completion',
      knTitle: '9. ಹಸ್ತಾಂತರ & ಗೃಹಪ್ರವೇಶ',
      image: '/methodology/stage-9-handover-completion.jpg',
      desc: 'Final deep cleaning, key handover ceremony, structural warranty documentation, and as-built drawing handover.',
      knDesc: 'ಅಂತಿಮ ಸ್ವಚ್ಛಗೊಳಿಸುವಿಕೆ, ಕೀ ಹಸ್ತಾಂತರ ಸಮಾರಂಭ, ಸ್ಟ್ರಕ್ಚರಲ್ ವಾರಂಟಿ ದಾಖಲೆಗಳು ಮತ್ತು ನಕ್ಷೆಗಳ ಹಸ್ತಾಂತರ.',
    },
  ];

  return (
    <div className="space-y-16 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-400 block">
          {isKn ? 'ಟರ್ನ್‌ಕೀ ಕಟ್ಟಡ ನಿರ್ಮಾಣ ಸಮನ್ವಯ' : 'Turnkey Building Coordination'}
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-white leading-tight">
          {t('construction.title', 'Bespoke Home Construction in Bengaluru')}
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed font-light">
          {t(
            'construction.subtitle',
            'From vacant residential plots to finished luxury duplex residences. Led directly by Ramesh S H with rigid quality standards and transparent milestone accounting.'
          )}
        </p>
      </div>

      {/* 9-Step End-to-End Workflow */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-luxury space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-navy-900">
            {t('construction.methodology_title', 'Our 9-Stage Construction Methodology')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {isKn
              ? 'ಬಾಳಿಕೆ, ಸೌಂದರ್ಯ ಮತ್ತು ಸಂಪೂರ್ಣ ಬಜೆಟ್ ನಿಯಂತ್ರಣಕ್ಕಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ.'
              : 'Engineered for durability, aesthetic distinction, and total budget control.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {workflowSteps.map((step, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col"
            >
              {/* Image Above */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={step.image}
                  alt={isKn ? step.knTitle || step.title : step.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-navy-950/85 backdrop-blur-sm text-gold-400 font-bold text-[11px] px-2.5 py-1 rounded-full border border-gold-500/30 tracking-wider shadow-sm">
                  STAGE {step.stepNumber}
                </div>
              </div>

              {/* Wordings Under */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-2.5 bg-gradient-to-b from-white to-slate-50/50">
                <span className="font-heading font-bold text-base text-navy-900 block group-hover:text-gold-600 transition-colors">
                  {isKn ? step.knTitle || step.title : step.title}
                </span>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                  {isKn ? step.knDesc || step.desc : step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3D View of Construction of Home Video Section */}
      <div className="bg-gradient-to-b from-navy-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl border border-navy-800 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/25 text-gold-400 text-xs font-bold uppercase tracking-widest">
            <Video className="w-3.5 h-3.5" />
            <span>{isKn ? '3D ವಾಸ್ತುಶಿಲ್ಪದ ಅನಿಮೇಷನ್' : '3D Architectural Walkthrough'}</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-4xl font-bold text-white tracking-tight capitalize">
            {t('construction.video_title', '3d view of construction of home')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
            {t(
              'construction.video_subtitle',
              'Experience the end-to-end structural and architectural progression of home construction in vivid 3D detail.'
            )}
          </p>
        </div>

        {/* Video Players Grid (4 Videos) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { src: '/videos/vedio1.mp4', title: 'Construction Walkthrough 1' },
            { src: '/videos/vedio 2.mp4', title: 'Construction Walkthrough 2' },
            { src: '/videos/vedio 3.mp4', title: 'Construction Walkthrough 3' },
            { src: '/videos/vedio 4.mp4', title: 'Construction Walkthrough 4' },
          ].map((vid, idx) => (
            <div key={idx} className="space-y-2.5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl bg-black aspect-video">
                <video
                  className="w-full h-full object-contain bg-black"
                  controls
                  playsInline
                  preload="metadata"
                >
                  <source src={vid.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-300 px-1">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold">{vid.title}</span>
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
                  placeholder="e.g.ramesh"
                  className="w-full p-3 rounded-xl bg-navy-900 border border-navy-800 text-white focus:ring-2 focus:ring-gold-500"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Phone Number (10 digits) *</label>
                <div className="relative flex rounded-xl border border-navy-800 focus-within:ring-2 focus-within:ring-gold-500 overflow-hidden bg-navy-900">
                  <span className="inline-flex items-center px-3.5 bg-navy-950 border-r border-navy-800 text-gold-400 font-bold text-xs select-none">
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
                    value={formData.phone}
                    onChange={(e) => {
                      let digits = e.target.value.replace(/\D/g, '');
                      if (digits.length === 12 && digits.startsWith('91')) {
                        digits = digits.slice(2);
                      } else if (digits.length === 11 && digits.startsWith('0')) {
                        digits = digits.slice(1);
                      }
                      setFormData({ ...formData, phone: digits.slice(0, 10) });
                    }}
                    placeholder="7353275925"
                    className="w-full px-3 py-3 text-xs focus:outline-none bg-transparent text-white"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ramesh@example.com"
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
