import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';
import { COMPANY_INFO } from '@shared/types';
import { useSettings } from '../../context/SettingsContext';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { phone, phoneCallUrl, getWhatsAppUrl } = useSettings();
  const { isKn, t } = useLanguage();
  return (
    <footer className="bg-navy-950 text-slate-300 pt-16 pb-12 border-t border-navy-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-navy-800">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="inline-block group">
              <span className="font-heading font-extrabold text-xl text-white tracking-tight block group-hover:text-gold-400 transition">
                {isKn ? 'ಬನಶಂಕರಿ' : 'BANASHANKARI'}
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-gold-400 block mt-0.5">
                {isKn ? 'ಎಂಟರ್‌ಪ್ರೈಸಸ್' : 'ENTERPRISES'}
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed">
              {t(
                'footer.about_text',
                'Your trusted partner for real estate sales, plot purchases, turnkey home construction, residential rentals, and Karnataka Housing Board (KHB) documentation assistance in Bengaluru.'
              )}
            </p>

            <div className="pt-2">
              <span className="inline-flex items-center space-x-2 text-xs bg-navy-900/80 border border-gold-500/20 text-gold-300 px-3 py-1.5 rounded-full">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span>
                  {t('footer.founder_oversight', 'Founder Oversight')}: {isKn ? 'ರಮೇಶ್ ಎಸ್ ಹೆಚ್' : COMPANY_INFO.founder}
                </span>
              </span>
            </div>
          </div>



          {/* Col 3: Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white font-sans border-b border-navy-800 pb-2">
              {t('footer.our_services', 'Our Services')}
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/real-estate" className="hover:text-gold-400 transition flex items-center space-x-1.5">
                  <ArrowRight className="w-3 h-3 text-gold-500" />
                  <span>{t('footer.serv_real_estate', 'Real Estate & Plots')}</span>
                </Link>
              </li>
              <li>
                <Link to="/construction" className="hover:text-gold-400 transition flex items-center space-x-1.5">
                  <ArrowRight className="w-3 h-3 text-gold-500" />
                  <span>{t('footer.serv_construction', 'Turnkey Construction')}</span>
                </Link>
              </li>
              <li>
                <Link to="/our-projects" className="hover:text-gold-400 transition flex items-center space-x-1.5">
                  <ArrowRight className="w-3 h-3 text-gold-500" />
                  <span>{t('footer.serv_projects', 'Our Landmark Projects')}</span>
                </Link>
              </li>
              <li>
                <Link to="/khb-property-services" className="hover:text-gold-400 transition flex items-center space-x-1.5">
                  <ArrowRight className="w-3 h-3 text-gold-500" />
                  <span>{t('footer.serv_khb', 'KHB Property Services')}</span>
                </Link>
              </li>
              <li>
                <Link to="/loans-made-easy" className="hover:text-gold-400 transition flex items-center space-x-1.5">
                  <ArrowRight className="w-3 h-3 text-gold-500" />
                  <span>{t('footer.serv_loans', 'Loans Made Easy')}</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold-400 transition flex items-center space-x-1.5">
                  <ArrowRight className="w-3 h-3 text-gold-500" />
                  <span>{t('footer.serv_contact', 'Contact Us & Site Visits')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Direct Connect */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white font-sans border-b border-navy-800 pb-2">
              {t('footer.direct_connect', 'Direct Connect')}
            </h4>
            <div className="space-y-3 text-sm text-slate-400">
              <a
                href={phoneCallUrl}
                className="flex items-center space-x-3 text-white hover:text-gold-400 transition p-2.5 rounded-lg bg-navy-900 border border-navy-800"
              >
                <Phone className="w-4 h-4 text-gold-400" />
                <span className="font-semibold">{phone}</span>
              </a>

              <a
                href={getWhatsAppUrl(
                  isKn
                    ? 'ನಮಸ್ಕಾರ ಬನಶಂಕರಿ ಎಂಟರ್‌ಪ್ರೈಸಸ್, ನಿಮ್ಮ ಆಸ್ತಿ ಸೇವೆಗಳ ಕುರಿತು ವಿಚಾರಿಸಲು ನಾನು ಬಯಸುತ್ತೇನೆ.'
                    : 'Hello Banashankari Enterprises, I would like to enquire about your property services.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-emerald-400 hover:text-emerald-300 transition p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="font-semibold">{t('tooltip.whatsapp', 'WhatsApp Chat')}</span>
              </a>

              <div className="flex items-start space-x-3 text-xs text-slate-400 pt-1">
                <MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                <span>{t('footer.primary_market', 'Primary Market: Bangalore & Karnataka Suburban Belts')}</span>
              </div>

              <div className="text-xs text-slate-500 pt-1">
                {t('footer.timings_weekday', 'Mon - Sat: 9:30 AM – 7:30 PM')} <br />
                {t('footer.timings_sunday', 'Sunday: 10:00 AM – 2:00 PM (By Appointment)')}
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="py-6 text-[11px] text-slate-500 leading-relaxed border-b border-navy-850">
          <p>
            <strong>{t('footer.notice_title', 'Regulatory & Verification Notice:')}</strong>{' '}
            {t(
              'footer.notice_text',
              'Banashankari Enterprises is a real estate advisory, property rental, and construction coordination company operating in Bengaluru, Karnataka. Banashankari Enterprises does not act as a banking lender; all loan approvals, interest rates, and loan disbursements are determined strictly by individual lending institutions based on applicant eligibility. KHB guidance is advisory; statutory sanctions rest with relevant government authorities.'
            )}
          </p>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-2 sm:space-y-0">
          <p>
            © {new Date().getFullYear()} {isKn ? 'ಬನಶಂಕರಿ ಎಂಟರ್‌ಪ್ರೈಸಸ್' : 'Banashankari Enterprises'}.{' '}
            {t('footer.all_rights', 'All Rights Reserved.')} {t('footer.led_by', 'Led by Ramesh S H.')}
          </p>

        </div>
      </div>
    </footer>
  );
};
