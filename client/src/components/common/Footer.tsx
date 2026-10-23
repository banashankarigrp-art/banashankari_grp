import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Phone, Mail, MapPin, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';
import { COMPANY_INFO } from '@shared/types';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 text-slate-300 pt-16 pb-12 border-t border-navy-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-navy-800">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-navy-900 border border-gold-500/40 flex items-center justify-center text-gold-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-heading font-bold text-xl text-white tracking-tight block">
                  BANASHANKARI
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-gold-400 block">
                  Enterprises
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              Your trusted partner for real estate sales, plot purchases, turnkey home construction, residential rentals, and Karnataka Housing Board (KHB) documentation assistance in Bengaluru.
            </p>

            <div className="pt-2">
              <span className="inline-flex items-center space-x-2 text-xs bg-navy-900/80 border border-gold-500/20 text-gold-300 px-3 py-1.5 rounded-full">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span>Founder Oversight: {COMPANY_INFO.founder}</span>
              </span>
            </div>
          </div>

          {/* Col 2: Key Portals */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white font-sans border-b border-navy-800 pb-2">
              Key Portals
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/properties?purpose=sale" className="hover:text-gold-400 transition flex items-center space-x-1.5">
                  <ArrowRight className="w-3 h-3 text-gold-500" />
                  <span>Properties for Sale</span>
                </Link>
              </li>
              <li>
                <Link to="/properties?purpose=rent" className="hover:text-gold-400 transition flex items-center space-x-1.5">
                  <ArrowRight className="w-3 h-3 text-gold-500" />
                  <span>Rental & Leases</span>
                </Link>
              </li>
              <li>
                <Link to="/properties?type=plot" className="hover:text-gold-400 transition flex items-center space-x-1.5">
                  <ArrowRight className="w-3 h-3 text-gold-500" />
                  <span>Residential Plots & Land</span>
                </Link>
              </li>
              <li>
                <Link to="/my-enquiries" className="hover:text-gold-400 transition flex items-center space-x-1.5 text-gold-300 font-medium">
                  <ArrowRight className="w-3 h-3 text-gold-500" />
                  <span>My Raised Enquiries</span>
                </Link>
              </li>
              <li>
                <Link to="/sell-property" className="hover:text-gold-400 transition flex items-center space-x-1.5">
                  <ArrowRight className="w-3 h-3 text-gold-500" />
                  <span>Submit Property for Sale</span>
                </Link>
              </li>
              <li>
                <Link to="/rent-lease-property" className="hover:text-gold-400 transition flex items-center space-x-1.5">
                  <ArrowRight className="w-3 h-3 text-gold-500" />
                  <span>List House / Flat for Rent</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white font-sans border-b border-navy-800 pb-2">
              Our Services
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/construction" className="hover:text-gold-400 transition flex items-center space-x-1.5">
                  <ArrowRight className="w-3 h-3 text-gold-500" />
                  <span>Turnkey Home Construction</span>
                </Link>
              </li>
              <li>
                <Link to="/loans" className="hover:text-gold-400 transition flex items-center space-x-1.5">
                  <ArrowRight className="w-3 h-3 text-gold-500" />
                  <span>Home Loan Assistance</span>
                </Link>
              </li>
              <li>
                <Link to="/khb-assistance" className="hover:text-gold-400 transition flex items-center space-x-1.5">
                  <ArrowRight className="w-3 h-3 text-gold-500" />
                  <span>KHB Transaction Guidance</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold-400 transition flex items-center space-x-1.5">
                  <ArrowRight className="w-3 h-3 text-gold-500" />
                  <span>Company Profile & Mission</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold-400 transition flex items-center space-x-1.5">
                  <ArrowRight className="w-3 h-3 text-gold-500" />
                  <span>Schedule Site Consultation</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Direct Connect */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white font-sans border-b border-navy-800 pb-2">
              Direct Connect
            </h4>
            <div className="space-y-3 text-sm text-slate-400">
              <a
                href={`tel:${COMPANY_INFO.phone}`}
                className="flex items-center space-x-3 text-white hover:text-gold-400 transition p-2.5 rounded-lg bg-navy-900 border border-navy-800"
              >
                <Phone className="w-4 h-4 text-gold-400" />
                <span className="font-semibold">{COMPANY_INFO.phone}</span>
              </a>

              <a
                href={`${COMPANY_INFO.whatsappUrl}?text=${encodeURIComponent(
                  'Hello Banashankari Enterprises, I would like to enquire about your property services.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-emerald-400 hover:text-emerald-300 transition p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="font-semibold">WhatsApp Chat</span>
              </a>

              <div className="flex items-start space-x-3 text-xs text-slate-400 pt-1">
                <MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                <span>Primary Market: Bangalore & Karnataka Suburban Belts</span>
              </div>

              <div className="text-xs text-slate-500 pt-1">
                Mon - Sat: 9:30 AM – 7:30 PM <br />
                Sunday: 10:00 AM – 2:00 PM (By Appointment)
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="py-6 text-[11px] text-slate-500 leading-relaxed border-b border-navy-850">
          <p>
            <strong>Regulatory & Verification Notice:</strong> Banashankari Enterprises is a real estate advisory, property rental, and construction coordination company operating in Bengaluru, Karnataka. Banashankari Enterprises does not act as a banking lender; all loan approvals, interest rates, and loan disbursements are determined strictly by individual lending institutions based on applicant eligibility. KHB guidance is advisory; statutory sanctions rest with relevant government authorities.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-2 sm:space-y-0">
          <p>© {new Date().getFullYear()} Banashankari Enterprises. All Rights Reserved. Led by Ramesh S H.</p>
          <div className="flex space-x-6 text-slate-400">
            <Link to="/about" className="hover:text-white transition">About</Link>
            <Link to="/contact" className="hover:text-white transition">Contact</Link>
            <Link to="/admin/login" className="hover:text-slate-500 transition text-[10px]">Admin Access</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
