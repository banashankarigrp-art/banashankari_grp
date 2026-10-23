import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Banknote,
  CheckCircle2,
  AlertTriangle,
  Calculator,
  ArrowRight,
  Shield,
  FileCheck2,
} from 'lucide-react';
import { api } from '../services/api';
import { COMPANY_INFO } from '@shared/types';
import { useAuth } from '../context/AuthContext';

export const LoanAssistancePage: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    loanPurpose: 'home_construction',
    approximateLoanAmount: 4000000,
    employmentType: 'salaried',
    monthlyIncomeRange: '₹1,00,000 – ₹1,50,000',
    preferredContactTime: 'Afternoon (2 PM - 5 PM)',
    message: '',
  });

  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // EMI Calculator
  const [amount, setAmount] = useState(4000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const calculateEmi = () => {
    const r = rate / 12 / 100;
    const n = tenure * 12;
    if (r === 0) return Math.round(amount / n);
    const emi = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.round(emi);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res: any = await api.post('/enquiries', {
        category: 'loan',
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email,
        details: {
          loanPurpose: formData.loanPurpose,
          approximateLoanAmount: Number(formData.approximateLoanAmount),
          employmentType: formData.employmentType,
          monthlyIncomeRange: formData.monthlyIncomeRange,
          preferredContactTime: formData.preferredContactTime,
          message: formData.message,
        },
        consent: true,
      });

      if (res.success) {
        setSubmittedRef(res.data.referenceId);
      }
    } catch (err: any) {
      alert(err.message || 'Error submitting loan enquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

  const loanCategories = [
    { title: 'Home Construction Loans', desc: 'Assistance for building your own home on a verified plot with staged disbursals based on site civil completion.' },
    { title: 'Home Purchase Loans', desc: 'Guidance on documentation and valuation for purchasing ready-to-move or under-construction villas and apartments.' },
    { title: 'Plot Purchase Loans', desc: 'Liaison for acquiring BDA, BMRDA, and DC-converted residential plots through leading retail banks.' },
    { title: 'Home Renovation Loans', desc: 'Funding support for major structural modifications, floor extensions, and premium interior renovations.' },
    { title: 'Loan Against Property (LAP)', desc: 'Unlocking liquidity against existing clear-title residential or commercial properties in Bangalore.' },
    { title: 'Balance Transfer Assistance', desc: 'Exploring refinancing options to lower existing mortgage interest burdens and reduce overall EMIs.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Top Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block">
          Liaison & Documentation Support
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-navy-900 leading-tight">
          Property & Construction Loan Assistance
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed font-light">
          We help Bangalore property buyers compile clean documentation dossiers and coordinate with institutional lenders to expedite approval workflows.
        </p>
      </div>

      {/* Crucial Regulatory Disclaimer Box (Prompt Requirement) */}
      <div className="bg-amber-50/70 border border-amber-300 rounded-2xl p-5 sm:p-6 flex items-start space-x-4 text-xs text-amber-900 leading-relaxed shadow-sm">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm text-amber-950 mb-1">
            Important Banking & Financial Disclaimer
          </h4>
          <p>
            Banashankari Enterprises acts purely as a real estate documentation liaison and loan assistance facilitator. We are not a bank, non-banking financial company (NBFC), or money lender. Final loan sanction, interest rates, approved loan-to-value (LTV), processing fees, and repayment terms are determined exclusively by the respective lending institution based on applicant underwriting and property title clearance. We do not promise guaranteed loan approvals.
          </p>
        </div>
      </div>

      {/* Supported Loan Categories */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-heading text-2xl font-bold text-navy-900">Assisted Loan Categories</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loanCategories.map((cat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-luxury space-y-2">
              <h3 className="font-heading font-bold text-base text-navy-900">{cat.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{cat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* EMI Calculator */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-luxury space-y-6">
        <h3 className="font-heading font-bold text-xl text-navy-900 flex items-center space-x-2">
          <Calculator className="w-5 h-5 text-gold-600" />
          <span>Quick Home Loan EMI Calculator</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Loan Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Interest Rate (% p.a.)</label>
            <input
              type="number"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Tenure (Years)</label>
            <input
              type="number"
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500"
            />
          </div>
        </div>

        <div className="bg-navy-950 text-white p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-300 block">Indicative Monthly Installment (EMI)</span>
            <span className="text-2xl font-bold text-gold-400 font-sans">
              ₹{calculateEmi().toLocaleString('en-IN')} / month
            </span>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Principal + Interest amortized over {tenure} years
          </span>
        </div>
      </div>

      {/* Loan Enquiry Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-luxury space-y-6">
        <div className="max-w-2xl mx-auto text-center space-y-2">
          <h2 className="font-heading text-2xl font-bold text-navy-900">
            Submit a Loan Assistance Enquiry
          </h2>
          <p className="text-xs text-slate-500">
            Provide basic requirements. We never ask for sensitive credentials, OTPs, or passwords.
          </p>
        </div>

        {submittedRef ? (
          <div className="max-w-xl mx-auto p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 text-xs text-emerald-900">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-base">Enquiry Registered (Ref: #{submittedRef})</h4>
            <p>Our loan coordination officer will contact you during your preferred time window to advise on document preparation.</p>
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
                <label className="font-semibold text-slate-700 block mb-1">Applicant Name *</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="e.g. Anand Gowda"
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
                  placeholder="anand@example.com"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Loan Purpose *</label>
                <select
                  value={formData.loanPurpose}
                  onChange={(e) => setFormData({ ...formData, loanPurpose: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                >
                  <option value="home_construction">Home Construction Loan</option>
                  <option value="home_purchase">Home Purchase Loan</option>
                  <option value="plot_purchase">Plot Purchase Loan</option>
                  <option value="renovation">Renovation Loan</option>
                  <option value="lap">Loan Against Property</option>
                  <option value="balance_transfer">Balance Transfer</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Approximate Amount (₹) *</label>
                <input
                  type="number"
                  required
                  value={formData.approximateLoanAmount}
                  onChange={(e) => setFormData({ ...formData, approximateLoanAmount: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Employment Type *</label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                >
                  <option value="salaried">Salaried Professional</option>
                  <option value="self_employed">Self Employed / Professional</option>
                  <option value="business">Business Proprietor</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Monthly Income Bracket</label>
                <select
                  value={formData.monthlyIncomeRange}
                  onChange={(e) => setFormData({ ...formData, monthlyIncomeRange: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                >
                  <option value="below_50k">Under ₹50,000</option>
                  <option value="50k_1l">₹50,000 – ₹1,00,000</option>
                  <option value="1l_1.5l">₹1,00,000 – ₹1,50,000</option>
                  <option value="above_1.5l">Above ₹1,50,000</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Preferred Time to Receive Call</label>
                <select
                  value={formData.preferredContactTime}
                  onChange={(e) => setFormData({ ...formData, preferredContactTime: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                >
                  <option value="morning">Morning (10:00 AM – 1:00 PM)</option>
                  <option value="afternoon">Afternoon (2:00 PM – 5:00 PM)</option>
                  <option value="evening">Evening (5:00 PM – 7:30 PM)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Additional Notes</label>
              <textarea
                rows={2}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Details about preferred bank, co-applicant status, or existing liabilities..."
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" required defaultChecked className="w-4 h-4 text-gold-600 rounded" />
                <span>I consent to be contacted by Banashankari Enterprises regarding my loan assistance enquiry.</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-navy-900 hover:bg-gold-600 text-white font-bold py-3.5 rounded-xl transition"
            >
              {isSubmitting ? 'Submitting Enquiry...' : 'Submit Loan Assistance Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
