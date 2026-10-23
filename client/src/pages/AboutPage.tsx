import React from 'react';
import { Building2, ShieldCheck, Users, Target, CheckCircle2, Phone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { COMPANY_INFO } from '@shared/types';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block">
          Our Foundation & Philosophy
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-navy-900 leading-tight">
          About Banashankari Enterprises
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
          Built upon transparency, verified title documentation, and hands-on construction craftsmanship in Bengaluru.
        </p>
      </div>

      {/* Leadership Profile */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-luxury grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-5 bg-navy-950 text-white rounded-2xl p-8 flex flex-col justify-between space-y-6 aspect-[4/3] sm:aspect-auto">
          <div>
            <div className="w-12 h-12 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-xs text-gold-400 uppercase tracking-widest font-bold block mb-1">
              Founder & Managing Principal
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold">{COMPANY_INFO.founder}</h3>
          </div>
          <div className="border-t border-navy-850 pt-4 space-y-2 text-xs text-slate-300">
            <p><strong>Primary Market:</strong> Bangalore Metropolitan & Suburban Hubs</p>
            <p><strong>Operational Focus:</strong> Real Estate, Turnkey Civil Contracting, KHB Liaison</p>
            <p><strong>Direct Desk:</strong> {COMPANY_INFO.phone}</p>
          </div>
        </div>

        <div className="md:col-span-7 space-y-4">
          <h2 className="font-heading text-2xl font-bold text-navy-900">
            A Direct, Honest Approach to Bengaluru Property
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Banashankari Enterprises was founded by Ramesh S H to address the most critical gap in the Bangalore property landscape: authentic, transparent transactions free from opaque middleman markups.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Whether a customer is acquiring a BDA residential plot in Kenchanahalli, embarking on the turnkey civil construction of a 3 BHK duplex home, seeking tenant leasing for an apartment, or coordinating complex Karnataka Housing Board (KHB) documentation, our firm operates with direct personal oversight from start to completion.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <div className="flex items-center space-x-1.5 text-xs text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Direct Title Due Diligence</span>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Contractual Cost Transparency</span>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Institutional Loan Liaison</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Core Values */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 shadow-luxury space-y-2 sm:space-y-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gold-50 text-gold-600 flex items-center justify-center font-bold">
            <Target className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <h3 className="font-heading font-bold text-sm sm:text-lg text-navy-900 leading-tight">Our Mission</h3>
          <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-light">
            To provide Bangalore homebuyers with an uncompromised standard of legal transparency and reliability.
          </p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 shadow-luxury space-y-2 sm:space-y-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gold-50 text-gold-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <h3 className="font-heading font-bold text-sm sm:text-lg text-navy-900 leading-tight">Verified Title</h3>
          <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-light">
            We adhere to strict due-diligence protocols, verifying BDA/BMRDA approvals and encumbrance certificates.
          </p>
        </div>

        <div className="col-span-2 md:col-span-1 bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 shadow-luxury space-y-2 sm:space-y-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gold-50 text-gold-600 flex items-center justify-center font-bold">
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <h3 className="font-heading font-bold text-sm sm:text-lg text-navy-900 leading-tight">End-to-End Care</h3>
          <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-light">
            From preliminary land survey to bank loan paperwork and registration, we support our clients throughout.
          </p>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-navy-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-4">
        <h3 className="font-heading text-2xl sm:text-3xl font-bold">
          Ready to Discuss Your Property or Construction Plans?
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-light">
          Reach out to Ramesh S H directly to schedule a personal consultation at our Banashankari office or at your property site.
        </p>
        <div className="pt-2 flex justify-center space-x-4">
          <Link
            to="/contact"
            className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-xl text-xs font-semibold shadow transition"
          >
            Contact Our Team
          </Link>
          <a
            href={`tel:${COMPANY_INFO.phone}`}
            className="border border-slate-400 text-white hover:bg-white/10 px-6 py-3 rounded-xl text-xs font-semibold transition"
          >
            Call {COMPANY_INFO.phone}
          </a>
        </div>
      </div>
    </div>
  );
};
