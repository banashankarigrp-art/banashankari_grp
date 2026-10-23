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

export const KhbAssistancePage: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    khbAssistanceType: 'transfer_assistance',
    khbLocality: 'Kengeri KHB Layout',
    message: '',
  });

  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res: any = await api.post('/enquiries', {
        category: 'khb',
        customerName: formData.customerName,
        phone: formData.phone,
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
      desc: 'Assistance in auditing allotment letters, possession certificates, absolute sale deeds, and encumbrance certificates (Form 15 & 16) issued under Karnataka Housing Board schemes.',
    },
    {
      title: 'Property Transfer Liaison',
      desc: 'Procedural guidance on transfer of allotment, legal heir succession records, and documentation coordination with competent KHB sub-division offices.',
    },
    {
      title: 'Title Due-Diligence & Clearances',
      desc: 'Legal verification ensuring the plot or house is unencumbered and meets regulatory resale conditions prior to executing purchase transactions.',
    },
    {
      title: 'KHB Consultation & Allotment Advice',
      desc: 'Orientation on KHB residential schemes across Bangalore suburban development belts (Kengeri, Suryanagar, Bidadi, Nelamangala).',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block">
          Specialized Transaction Advisory
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-navy-900 leading-tight">
          Karnataka Housing Board (KHB) Assistance
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed font-light">
          Reliable advisory and documentation coordination for property buyers and allottees across Bangalore KHB residential layouts.
        </p>
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
                <label className="font-semibold text-slate-700 block mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98450 XXXXX"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
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
                  placeholder="e.g. Kengeri KHB, Suryanagar, Bidadi..."
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
