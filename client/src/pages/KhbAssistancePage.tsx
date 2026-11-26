import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { api } from '../services/api';
import { COMPANY_INFO } from '@shared/types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const KhbAssistancePage: React.FC = () => {
  const { user } = useAuth();
  const { isKn, t } = useLanguage();
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    phone: (user?.phone || '').replace(/\D/g, '').slice(-10),
    email: user?.email || '',
    khbAssistanceType: 'transfer_assistance',
    khbLocality: '',
    message: '',
  });

  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
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
        category: 'khb',
        customerName: formData.customerName,
        phone: `+91 ${formData.phone}`,
        email: formData.email,
        details: {
          khbAssistanceType: formData.khbAssistanceType,
          khbLocality: formData.khbLocality,
          message: formData.message,
        },
        consent: true,
      });

      if (res.success) {
        setSubmittedRef(res.data.referenceId);
      }
    } catch (err: any) {
      alert(err.message || 'Error submitting KHB assistance enquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    {
      title: 'Documentation Checklist & Verification',
      image: '/khb-assistance/Documentation checklist.jpg',
      desc: 'Assistance in auditing allotment letters, possession certificates, absolute sale deeds, e-Khata, and encumbrance certificates (Form 15 & 16) issued under Karnataka Housing Board schemes.',
    },
    {
      title: 'Property Transfer Assistance',
      image: '/khb-assistance/Property Transfer.jpg',
      desc: 'We help buyers, sellers and families prepare the available documents for KHB property transfer requests, including sale deed and legal-heir related cases. We assist with application submission and follow-up with the concerned office. The transfer is completed only after the authority reviews and approves the application.',
    },
    {
      title: 'Property Document & Legal Review Assistance',
      desc: 'We help buyers collect and organise the sale deed, allotment records, khata, tax receipts and encumbrance certificate for review by a qualified property lawyer. The lawyer’s findings help buyers understand any title issues or resale conditions before proceeding.',
    },
    {
      title: 'KHB Property Services',
      desc: 'We assist buyers and sellers with available KHB resale sites and homes in Suryanagar, Kengeri, Bidadi, Nelamangala and other locations where we operate. Our support includes property enquiries, site visits, document coordination and purchase assistance.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block">
          {isKn ? 'ವಿಶೇಷ ಆಸ್ತಿ ಸಲಹಾ ಸೇವೆ' : 'Specialized Transaction Advisory'}
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-navy-900 leading-tight">
          {t('khb.title', 'Karnataka Housing Board (KHB) Assistance')}
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed font-light">
          {t(
            'khb.subtitle',
            'Reliable advisory and documentation coordination for property buyers and allottees across KHB residential layouts.'
          )}
        </p>
      </div>


      {/* Services Grid */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-heading text-2xl font-bold text-navy-900">Our Scope of KHB Services</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-luxury space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <h3 className="font-heading font-bold text-base text-navy-900">{item.title}</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Statutory Disclaimer Box */}
      <div className="bg-amber-50/70 border border-amber-300 rounded-2xl p-5 sm:p-6 flex items-start space-x-4 text-xs text-amber-900 leading-relaxed shadow-sm">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm text-amber-950 mb-1">
            Official KHB Advisory Notice
          </h4>
          <p>
            Banashankari Enterprises is an independent real estate advisory firm and is not an official branch, authorized agency, or affiliate of the Karnataka Housing Board (KHB) or the Government of Karnataka. We provide documentation assistance, process guidance, and transaction liaison where legally permitted. All official approvals, sanctions, allotment transfers, and legal certifications rest solely with the Karnataka Housing Board and competent statutory authorities.
          </p>
        </div>
      </div>

      {/* Consultation Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-luxury space-y-6">
        <div className="max-w-2xl mx-auto text-center space-y-2">
          <h2 className="font-heading text-2xl font-bold text-navy-900">
            Request KHB Guidance & Document Review
          </h2>
          <p className="text-xs text-slate-500">
            Consult Ramesh S H on your KHB layout property file.
          </p>
        </div>

        {submittedRef ? (
          <div className="max-w-xl mx-auto p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 text-xs text-emerald-900">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-base">Request Submitted (Ref: #{submittedRef})</h4>
            <p>Our documentation desk will review your details and connect with you to review applicable KHB checklists.</p>
            <div className="pt-1">
              <Link
                to="/my-enquiries"
                className="inline-flex items-center space-x-1 font-bold text-emerald-800 underline hover:text-emerald-950"
              >
                <span>Track this request in My Enquiries →</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="e.g. Ramesh S H"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Phone Number (10 digits) *</label>
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
                    placeholder="7353 275 925"
                    className="w-full px-3 py-2.5 text-xs focus:outline-none bg-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ramesh@example.com"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Assistance Type *</label>
                <select
                  value={formData.khbAssistanceType}
                  onChange={(e) => setFormData({ ...formData, khbAssistanceType: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                >
                  <option value="transfer_assistance">KHB Transfer & Allotment Clearance</option>
                  <option value="document_checklist">Document Verification & Audit</option>
                  <option value="title_verification">Title Search & Legal Clearance</option>
                  <option value="general_consultation">General Consultation on KHB Plots</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">KHB Layout / Locality *</label>
                <input
                  type="text"
                  required
                  value={formData.khbLocality}
                  onChange={(e) => setFormData({ ...formData, khbLocality: e.target.value })}
                  placeholder="e.g. KHB, Suryanagar, Phase1, Phase2, Phase3 & 4..."
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Details of Request</label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Mention stage of transaction, available documents, and specific assistance needed..."
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-navy-900 hover:bg-gold-600 text-white font-bold py-3.5 rounded-xl transition"
            >
              {isSubmitting ? 'Submitting...' : 'Request KHB Consultation Call'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
