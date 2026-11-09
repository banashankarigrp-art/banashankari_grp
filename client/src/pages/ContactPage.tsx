import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Mail,
  Send,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { api } from '../services/api';
import { COMPANY_INFO } from '@shared/types';
import { useAuth } from '../context/AuthContext';

export const ContactPage: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    category: 'general',
    message: '',
  });

  const [submitted, setSubmitted] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res: any = await api.post('/enquiries', {
        category: formData.category,
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email,
        details: { message: formData.message },
        consent: true,
      });

      if (res.success) {
        setSubmitted(res.data.referenceId);
        setFormData({ customerName: '', phone: '', email: '', category: 'general', message: '' });
      }
    } catch (err: any) {
      alert(err.message || 'Error submitting message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block">
          Get in Touch
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-navy-900 leading-tight">
          Contact Banashankari Enterprises
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed font-light">
          Reach out for property inspections, construction cost estimates, loan guidance, or KHB documentation consultation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-navy-950 text-white rounded-3xl p-8 space-y-6 shadow-luxury">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl">{COMPANY_INFO.name}</h3>
                <p className="text-xs text-gold-400 font-semibold">Founder: {COMPANY_INFO.founder}</p>
              </div>
            </div>

            <div className="space-y-4 pt-2 text-xs">
              {/* Phone */}
              <div className="flex items-start space-x-3 bg-navy-900 p-4 rounded-xl border border-navy-850">
                <Phone className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Call Founder / Desk</span>
                  <a href={`tel:${COMPANY_INFO.phone}`} className="font-bold text-white hover:text-gold-400 text-sm">
                    {COMPANY_INFO.phone}
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start space-x-3 bg-emerald-950/40 p-4 rounded-xl border border-emerald-800/40">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-emerald-300 block text-[10px] uppercase font-bold">WhatsApp Direct</span>
                  <a
                    href={`${COMPANY_INFO.whatsappUrl}?text=${encodeURIComponent(
                      'Hello Banashankari Enterprises, I would like to enquire about your services in Bangalore.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-emerald-400 hover:text-emerald-300 text-sm"
                  >
                    +91 997 253 6991 (Chat Now)
                  </a>
                </div>
              </div>

              {/* Office & Market */}
              <div className="flex items-start space-x-3 bg-navy-900 p-4 rounded-xl border border-navy-850">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Bangalore Operational Base</span>
                  <p className="text-slate-200">Banashankari & Bangalore Suburban Belts, Karnataka, India</p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start space-x-3 bg-navy-900 p-4 rounded-xl border border-navy-850">
                <Clock className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Office Hours</span>
                  <p className="text-slate-200">
                    Monday – Saturday: 9:30 AM – 7:30 PM (IST)<br />
                    Sunday: 10:00 AM – 2:00 PM (By Site Appointment)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-luxury space-y-6">
          <div>
            <h2 className="font-heading font-bold text-2xl text-navy-900">Send an Enquiry Message</h2>
            <p className="text-xs text-slate-500 mt-1">
              Leave your inquiry and our team will get in touch with you promptly.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 text-xs text-emerald-900">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-base">Message Sent Successfully!</h4>
              <p>Reference ID: <strong>#{submitted}</strong>. Ramesh S H and our representative will call you back shortly.</p>
              <div className="pt-1">
                <Link
                  to="/my-enquiries"
                  className="inline-flex items-center space-x-1 font-bold text-emerald-800 underline hover:text-emerald-950"
                >
                  <span>Track your enquiry in My Enquiries →</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="e.g. Anand Gowda"
                    className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500"
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
                    className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="anand@example.com"
                    className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Inquiry Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500"
                  >
                    <option value="general">General Real Estate Inquiry</option>
                    <option value="property">Property Inspection / Purchase</option>
                    <option value="construction">Home Construction Quote</option>
                    <option value="loan">Bank Loan Assistance</option>
                    <option value="khb">KHB Assistance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Your Message or Property Requirement *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share details on your locality of interest, timeline, or specific questions..."
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-navy-900 hover:bg-gold-600 text-white font-bold py-3.5 rounded-xl transition shadow"
              >
                {isSubmitting ? 'Sending Message...' : 'Send Message to Banashankari Enterprises'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
