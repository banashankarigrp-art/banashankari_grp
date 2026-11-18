import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  HardHat,
  MapPin,
  CheckCircle2,
  ArrowRight,
  PhoneCall,
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { api } from '../services/api';
import { IConstructionProject, COMPANY_INFO } from '@shared/types';
import { useSettings } from '../context/SettingsContext';

export const OurProjectsPage: React.FC = () => {
  const { phoneCallUrl } = useSettings();
  const [projects, setProjects] = useState<IConstructionProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'completed' | 'in_progress'>('all');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res: any = await api.get('/content/projects');
        if (res.success && res.data) {
          setProjects(res.data);
        }
      } catch (err) {
        console.error('Error fetching construction projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((p) => {
    if (activeFilter === 'all') return true;
    return p.status === activeFilter;
  });

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* Header Banner */}
      <section className="bg-navy-950 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-navy-900 border border-gold-500/30 text-gold-400 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Turnkey Execution Portfolio</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Our Landmark Projects
          </h1>

          <p className="text-slate-300 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed font-light">
            Explore turnkey residences, independent duplex homes, and civil structures completed and managed under the direct supervision of Ramesh S H across Bengaluru.
          </p>

          {/* Quick Metrics Strip */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
            <div className="p-3 bg-navy-900/80 rounded-2xl border border-navy-800 text-center">
              <span className="block font-heading text-xl sm:text-2xl font-bold text-gold-400">200+</span>
              <span className="text-[11px] text-slate-400">Projects Completed</span>
            </div>
            <div className="p-3 bg-navy-900/80 rounded-2xl border border-navy-800 text-center">
              <span className="block font-heading text-xl sm:text-2xl font-bold text-gold-400">15+</span>
              <span className="text-[11px] text-slate-400">Years of Integrity</span>
            </div>
            <div className="p-3 bg-navy-900/80 rounded-2xl border border-navy-800 text-center">
              <span className="block font-heading text-xl sm:text-2xl font-bold text-gold-400">100%</span>
              <span className="text-[11px] text-slate-400">RCC Grade Certified</span>
            </div>
            <div className="p-3 bg-navy-900/80 rounded-2xl border border-navy-800 text-center">
              <span className="block font-heading text-xl sm:text-2xl font-bold text-gold-400">1,000+</span>
              <span className="text-[11px] text-slate-400">Satisfied Families</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="inline-flex bg-slate-100 p-1 rounded-2xl border border-slate-200/80 text-xs font-semibold">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-xl transition ${
                activeFilter === 'all'
                  ? 'bg-white text-navy-950 shadow-sm border border-slate-200/60 font-bold'
                  : 'text-slate-600 hover:text-navy-950'
              }`}
            >
              All Projects ({projects.length})
            </button>
            <button
              onClick={() => setActiveFilter('completed')}
              className={`px-4 py-2 rounded-xl transition ${
                activeFilter === 'completed'
                  ? 'bg-white text-navy-950 shadow-sm border border-slate-200/60 font-bold'
                  : 'text-slate-600 hover:text-navy-950'
              }`}
            >
              Completed ({projects.filter((p) => p.status === 'completed').length})
            </button>
            <button
              onClick={() => setActiveFilter('in_progress')}
              className={`px-4 py-2 rounded-xl transition ${
                activeFilter === 'in_progress'
                  ? 'bg-white text-navy-950 shadow-sm border border-slate-200/60 font-bold'
                  : 'text-slate-600 hover:text-navy-950'
              }`}
            >
              Ongoing Construction ({projects.filter((p) => p.status === 'in_progress').length})
            </button>
          </div>

          <Link
            to="/construction"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-gold-600 hover:text-gold-700"
          >
            <span>Request Custom Home Estimate</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl h-96 animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-heading font-bold text-lg text-navy-900">No projects found in this category</h3>
            <p className="text-xs text-slate-500">Check back soon or view all completed landmark projects.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((proj) => (
              <div
                key={proj._id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  {/* Cover Image & Status Badge */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={proj.coverImage}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-navy-950/90 text-gold-400 border border-gold-500/30 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                      {proj.clientType}
                    </div>
                    <span
                      className={`absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm ${
                        proj.status === 'completed'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {proj.status === 'completed' ? 'Completed Handover' : 'Under Construction'}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                        <span>{proj.location}</span>
                      </div>
                      <h3 className="font-heading font-bold text-lg text-navy-950 leading-snug group-hover:text-gold-600 transition">
                        {proj.title}
                      </h3>
                    </div>

                    <div className="inline-block text-xs font-bold text-navy-900 bg-gold-50/70 border border-gold-200/60 px-2.5 py-1 rounded-lg">
                      Built-up Area: {proj.builtUpArea}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-light line-clamp-3">
                      {proj.description}
                    </p>

                    {/* Features list */}
                    {proj.features && proj.features.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        {proj.features.slice(0, 3).map((f, i) => (
                          <div key={i} className="flex items-center space-x-1.5 text-xs text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span className="truncate">{f}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1 text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Year: {proj.completionYear || 2024}</span>
                  </div>

                  <Link
                    to="/contact"
                    className="inline-flex items-center space-x-1 text-xs font-bold text-navy-900 hover:text-gold-600 transition"
                  >
                    <span>Enquire Design</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bottom Consultation Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 text-white p-8 sm:p-12 border border-gold-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase tracking-widest text-gold-400 font-bold block">
              Direct Builder Supervision
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold">
              Ready to construct your home in Bengaluru?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-light max-w-xl">
              From soil testing and BDA/BBMP plan sanction to structural RCC pouring and interior woodwork, Ramesh S H provides complete personal oversight.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
            <Link
              to="/construction"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs shadow-gold-sm transition text-center"
            >
              Get Free Estimate
            </Link>
            <a
              href={phoneCallUrl}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs transition flex items-center justify-center space-x-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5 text-gold-400" />
              <span>Call Builder Directly</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
