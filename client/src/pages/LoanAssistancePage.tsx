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
import { useLanguage } from '../context/LanguageContext';

export const LoanAssistancePage: React.FC = () => {
  const { user } = useAuth();
  const { isKn, t } = useLanguage();
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    phone: (user?.phone || '').replace(/\D/g, '').slice(-10),
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
    if (formData.phone.length !== 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    try {
      setIsSubmitting(true);
      const res: any = await api.post('/enquiries', {
        category: 'loan',
        customerName: formData.customerName,
        phone: `+91 ${formData.phone}`,
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
    {
      title: 'Home Construction Loans',
      knTitle: 'ಗೃಹ ನಿರ್ಮಾಣ ಸಾಲಗಳು (Home Construction Loans)',
      image: '/loans/home-construction-loans.jpg',
      desc: 'We help customers secure home construction loans through document preparation, application submission and bank coordination, subject to lender approval.',
      knDesc: 'ದಾಖಲೆಗಳ ಸಿದ್ಧತೆ, ಅರ್ಜಿ ಸಲ್ಲಿಕೆ ಮತ್ತು ಬ್ಯಾಂಕ್ ಸಮನ್ವಯದ ಮೂಲಕ ಗ್ರಾಹಕರಿಗೆ ಗೃಹ ನಿರ್ಮಾಣ ಸಾಲಗಳನ್ನು ಪಡೆಯಲು ನಾವು ಸಹಾಯ ಮಾಡುತ್ತೇವೆ, ಸಾಲದಾತರ ಅನುಮೋದನೆಗೆ ಒಳಪಟ್ಟಿರುತ್ತದೆ.',
    },
    {
      title: 'Home & Plot Purchase Loans',
      knTitle: 'ಮನೆ & ನಿವೇಶನ ಖರೀದಿ ಸಾಲಗಳು (Home & Plot Purchase Loans)',
      image: '/loans/home-plot-purchase-loans.jpg',
      desc: 'We assist homebuyers & Plotbuyers with documentation, loan applications, legal and valuation coordination, and bank follow-ups to simplify the home loan process.',
      knDesc: 'ಗೃಹ ಸಾಲ ಪ್ರಕ್ರಿಯೆಯನ್ನು ಸುಲಭಗೊಳಿಸಲು ನಾವು ಮನೆ ಮತ್ತು ನಿವೇಶನ ಖರೀದಿದಾರರಿಗೆ ದಾಖಲೆಗಳು, ಸಾಲ ಅರ್ಜಿಗಳು, ಕಾನೂನು ಮತ್ತು ಮೌಲ್ಯಮಾಪನ ಸಮನ್ವಯದೊಂದಿಗೆ ಬೆಂಬಲ ನೀಡುತ್ತೇವೆ.',
    },
    {
      title: 'Home Renovation Loans',
      knTitle: 'ಮನೆ ನವೀಕರಣ ಸಾಲಗಳು (Home Renovation Loans)',
      desc: 'We help customers finance home renovations, structural modifications, floor extensions and interior upgrades through documentation, loan applications and lender coordination.',
      knDesc: 'ದಾಖಲೆಗಳು, ಸಾಲ ಅರ್ಜಿಗಳು ಮತ್ತು ಸಾಲದಾತರ ಸಮನ್ವಯದ ಮೂಲಕ ಮನೆ ನವೀಕರಣ, ರಚನಾತ್ಮಕ ಬದಲಾವಣೆಗಳು, ಹೆಚ್ಚುವರಿ ಮಹಡಿ ವಿಸ್ತರಣೆ ಮತ್ತು ಇಂಟೀರಿಯರ್ ಅಪ್‌ಗ್ರೇಡ್‌ಗಳಿಗೆ ಹಣಕಾಸು ಒದಗಿಸಲು ನಾವು ಸಹಾಯ ಮಾಡುತ್ತೇವೆ.',
    },
    {
      title: 'Loan Against Property (LAP)',
      knTitle: 'ಆಸ್ತಿಯ ಮೇಲಿನ ಸಾಲ (Loan Against Property)',
      desc: 'We help customers secure funds against residential or commercial properties through documentation, loan applications, legal and valuation coordination, and bank follow-ups.',
      knDesc: 'ದಾಖಲೆಗಳು, ಸಾಲ ಅರ್ಜಿಗಳು, ಕಾನೂನು ಮತ್ತು ಮೌಲ್ಯಮಾಪನ ಸಮನ್ವಯ ಮತ್ತು ಬ್ಯಾಂಕ್ ಫಾಲೋ-ಅಪ್‌ಗಳ ಮೂಲಕ ವಸತಿ ಅಥವಾ ವಾಣಿಜ್ಯ ಆಸ್ತಿಗಳ ಮೇಲೆ ನಿಧಿ ಪಡೆಯಲು ನಾವು ಗ್ರಾಹಕರಿಗೆ ಸಹಾಯ ಮಾಡುತ್ತೇವೆ.',
    },
    {
      title: 'Balance Transfer Assistance',
      knTitle: 'ಬ್ಯಾಲೆನ್ಸ್ ವರ್ಗಾವಣೆ ನೆರವು (Balance Transfer Assistance)',
      desc: 'We help customers transfer existing home loans to better lending options through offer comparison, documentation, application support and bank coordination.',
      knDesc: 'ಆಫರ್‌ಗಳ ಹೋಲಿಕೆ, ದಾಖಲಾತಿ, ಅರ್ಜಿ ಬೆಂಬಲ ಮತ್ತು ಬ್ಯಾಂಕ್ ಸಮನ್ವಯದ ಮೂಲಕ ಉತ್ತಮ ಸಾಲದ ಆಯ್ಕೆಗಳಿಗೆ ಅಸ್ತಿತ್ವದಲ್ಲಿರುವ ಗೃಹ ಸಾಲಗಳನ್ನು ವರ್ಗಾಯಿಸಲು ನಾವು ಗ್ರಾಹಕರಿಗೆ ಸಹಾಯ ಮಾಡುತ್ತೇವೆ.',
    },
    {
      title: 'National Housing Bank (NHB) - Senior Citizen Housing Schemes',
      knTitle: 'ರಾಷ್ಟ್ರೀಯ ವಸತಿ ಬ್ಯಾಂಕ್ (NHB) - ಹಿರಿಯ ನಾಗರಿಕರ ಯೋಜನೆಗಳು',
      desc: 'We help eligible senior citizens access Reverse Mortgage Loans, converting home equity into regular income while continuing to live in their homes, supporting financial independence during retirement.',
      knDesc: 'ಅರ್ಹ ಹಿರಿಯ ನಾಗರಿಕರಿಗೆ ರಿವರ್ಸ್ ಮಾರ್ಟ್ಗೇಜ್ ಸಾಲಗಳನ್ನು ಪಡೆಯಲು, ಮನೆಯಲ್ಲಿಯೇ ವಾಸಿಸುತ್ತಾ ಆರ್ಥಿಕ ಸ್ವಾತಂತ್ರ್ಯವನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳಲು ನಾವು ಸಹಾಯ ಮಾಡುತ್ತೇವೆ.',
    },  
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Top Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block">
          {isKn ? 'ಸಮನ್ವಯ & ದಾಖಲೆಗಳ ಬೆಂಬಲ' : 'Liaison & Documentation Support'}
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-navy-900 leading-tight">
          {t('loans.title', 'Property & Home Loan Solutions through BASIC Home Loans DSA Franchise')}
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed font-light">
          {t(
            'loans.subtitle',
            'Our BASIC Home Loans DSA Franchise connects customers with leading banks and NBFCs, offering diverse loan solutions for home purchases, construction, renovations, loans against property and reverse mortgages, backed by expert guidance and end-to-end assistance.'
          )}
        </p>
      </div>

      {/* Supported Loan Categories */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-heading text-2xl font-bold text-navy-900">Assisted Loan Categories</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loanCategories.map((cat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-luxury overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300"
            >
              {cat.image && (
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={cat.image}
                    alt={isKn ? cat.knTitle || cat.title : cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col space-y-2">
                <h3 className="font-heading font-bold text-base text-navy-900 group-hover:text-gold-600 transition-colors">
                  {isKn ? cat.knTitle || cat.title : cat.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-light">
                  {isKn ? cat.knDesc || cat.desc : cat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Crucial Regulatory Disclaimer Box (Prompt Requirement) */}
      <div className="bg-amber-50/70 border border-amber-300 rounded-2xl p-5 sm:p-6 flex items-start space-x-4 text-xs text-amber-900 leading-relaxed shadow-sm">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm text-amber-950 mb-1">
            Important Banking & Financial Disclaimer
          </h4>
          <p>
            Banashankari Enterprises acts purely as a real estate documentation liaison and loan assistance facilitator. We are not a bank, non-banking financial company (NBFC), or money lender. Final loan sanction, interest rates, approved loan-to-value (LTV), processing fees, and repayment terms are determined exclusively by the respective lending institution based on applicant underwriting and property title clearance.
          </p>
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
                  placeholder="e.g. Ramesh"
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
