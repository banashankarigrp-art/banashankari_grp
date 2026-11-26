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
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';

export const ContactPage: React.FC = () => {
  const { user } = useAuth();
  const { phone, phoneCallUrl, whatsappNumber, getWhatsAppUrl } = useSettings();
  const { isKn, t } = useLanguage();
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    phone: (user?.phone || '').replace(/\D/g, '').slice(-10),
    email: user?.email || '',
    category: 'general',
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
        category: formData.category,
        customerName: formData.customerName,
        phone: `+91 ${formData.phone}`,
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
        <span className="text-xs font-bold uppercase tracking-widest text-gold-400 block">
          {t('contact.get_in_touch', 'Get in Touch')}
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-white leading-tight">
          {t('contact.page_title', 'Contact Banashankari Enterprises')}
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed font-light">
          {t(
            'contact.page_subtitle',
            'Reach out for property inspections, construction cost estimates, loan guidance, or KHB documentation consultation.'
          )}
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
                <h3 className="font-heading font-bold text-xl">
                  {isKn ? 'ಬನಶಂಕರಿ ಎಂಟರ್‌ಪ್ರೈಸಸ್' : COMPANY_INFO.name}
                </h3>
                <p className="text-xs text-gold-400 font-semibold">
                  {isKn ? 'ಸಂಸ್ಥಾಪಕರು: ರಮೇಶ್ ಎಸ್ ಹೆಚ್' : `Founder: ${COMPANY_INFO.founder}`}
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-2 text-xs">
              {/* Phone */}
              <div className="flex items-start space-x-3 bg-navy-900 p-4 rounded-xl border border-navy-850">
                <Phone className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    {isKn ? 'ನೇರ ಕರೆ / ಸಂಸ್ಥಾಪಕರು' : 'Call Founder / Desk'}
                  </span>
                  <a href={phoneCallUrl} className="font-bold text-white hover:text-gold-400 text-sm">
                    {phone}
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start space-x-3 bg-emerald-950/40 p-4 rounded-xl border border-emerald-800/40">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-emerald-300 block text-[10px] uppercase font-bold">
                    {isKn ? 'ವಾಟ್ಸಾಪ್ ನೇರ ಚಾಟ್' : 'WhatsApp Direct'}
                  </span>
                  <a
                    href={getWhatsAppUrl(
                      isKn
                        ? 'ನಮಸ್ಕಾರ ಬನಶಂಕರಿ ಎಂಟರ್‌ಪ್ರೈಸಸ್, ಬೆಂಗಳೂರಿನಲ್ಲಿ ನಿಮ್ಮ ಸೇವೆಗಳ ಕುರಿತು ವಿಚಾರಿಸಲು ನಾನು ಬಯಸುತ್ತೇನೆ.'
                        : 'Hello Banashankari Enterprises, I would like to enquire about your services in Bangalore.'
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-emerald-400 hover:text-emerald-300 text-sm"
                  >
                    {whatsappNumber || phone} ({isKn ? 'ಈಗಲೇ ಚಾಟ್ ಮಾಡಿ' : 'Chat Now'})
                  </a>
                </div>
              </div>

              {/* Office & Market */}
              <div className="flex items-start space-x-3 bg-navy-900 p-4 rounded-xl border border-navy-850">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    {isKn ? 'ಕಚೇರಿ ವಿಳಾಸ' : 'Bangalore Operational Base'}
                  </span>
                  <p className="text-slate-200">
                    {isKn
                      ? 'ಬನಶಂಕರಿ & ಬೆಂಗಳೂರು ಸುತ್ತಮುತ್ತಲಿನ ಪ್ರದೇಶಗಳು, ಕರ್ನಾಟಕ, ಭಾರತ'
                      : 'KHB Surya nagar & Bangalore Suburban Belts, Karnataka, India'}
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start space-x-3 bg-navy-900 p-4 rounded-xl border border-navy-850">
                <Clock className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    {isKn ? 'ವ್ಯವಹಾರದ ಸಮಯ' : 'Office Hours'}
                  </span>
                  <p className="text-slate-200">
                    {isKn ? (
                      <>
                        ಸೋಮವಾರ – ಶನಿವಾರ: ಬೆಳಿಗ್ಗೆ 9:30 – ಸಂಜೆ 7:30 (IST)<br />
                        ಭಾನುವಾರ: ಬೆಳಿಗ್ಗೆ 10:00 – ಮಧ್ಯಾಹ್ನ 2:00 (ಮುಂಗಡ ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಮೂಲಕ)
                      </>
                    ) : (
                      <>
                        Monday – Saturday: 9:30 AM – 7:30 PM (IST)<br />
                        Sunday: 10:00 AM – 2:00 PM (By Site Appointment)
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-luxury space-y-6">
          <div>
            <h2 className="font-heading font-bold text-2xl text-navy-900">
              {t('contact.form_heading', 'Send an Enquiry Message')}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {t('contact.form_subheading', 'Leave your inquiry and our team will get in touch with you promptly.')}
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 text-xs text-emerald-900">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-base">{t('contact.success_title', 'Message Sent Successfully!')}</h4>
              <p>
                {t('contact.success_ref', 'Reference ID:')} <strong>#{submitted}</strong>.{' '}
                {t('contact.success_note', 'Ramesh S H and our representative will call you back shortly.')}
              </p>
              <div className="pt-1">
                <Link
                  to="/my-enquiries"
                  className="inline-flex items-center space-x-1 font-bold text-emerald-800 underline hover:text-emerald-950"
                >
                  <span>{t('enquiry.track_link', 'Track your enquiry in My Enquiries →')}</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {t('common.name_label', 'Your Full Name *')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder={isKn ? 'ಉದಾ. ಆನಂದ್ ಗೌಡ' : 'e.g. Ramesh SH'}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {t('common.phone_label', 'Phone Number (10 digits) *')}
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
                      title={isKn ? 'ದಯವಿಟ್ಟು 10 ಅಂಕಿಗಳ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ' : 'Please enter a 10-digit mobile number'}
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
                      className="w-full px-3 py-3 text-xs focus:outline-none bg-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {t('common.email_label', 'Email Address *')}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ramesh@example.com"
                    className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {t('enquiry.service_required', 'Inquiry Category *')}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500"
                  >
                    <option value="general">{t('enquiry.service_general', 'General Real Estate Guidance')}</option>
                    <option value="property">{t('enquiry.service_property', 'Property Inspection / Purchase')}</option>
                    <option value="construction">{t('enquiry.service_construction', 'Turnkey Home Construction')}</option>
                    <option value="loan">{t('enquiry.service_loan', 'Banking Loan Assistance')}</option>
                    <option value="khb">{t('enquiry.service_khb', 'KHB Documentation Assistance')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {t('common.message_label', 'Your Message or Property Requirement *')}
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t(
                    'enquiry.placeholder_desc',
                    'Share details on your locality of interest, timeline, or specific questions...'
                  )}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-navy-900 hover:bg-gold-600 text-white font-bold py-3.5 rounded-xl transition shadow"
              >
                {isSubmitting
                  ? t('common.submitting', 'Sending Message...')
                  : isKn
                  ? 'ಬನಶಂಕರಿ ಎಂಟರ್‌ಪ್ರೈಸಸ್‌ಗೆ ಸಂದೇಶ ಕಳುಹಿಸಿ'
                  : 'Send Message to Banashankari Enterprises'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
