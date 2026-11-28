import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Building2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { PropertyCard } from '../components/property/PropertyCard';
import { api } from '../services/api';
import { IProperty } from '@shared/types';

export const PropertiesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 9, totalPages: 1 });

  // Purpose & page from searchParams
  const purpose = searchParams.get('purpose') || 'all';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const query = searchParams.toString();
      const res: any = await api.get(`/properties?${query}`);
      if (res.success) {
        setProperties(res.data);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err) {
      console.error('Failed to fetch properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams]);

  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    next.set('page', '1'); // reset to page 1 on filter change
    setSearchParams(next);
  };

  const handlePageChange = (newPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', newPage.toString());
    setSearchParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title & Purpose Tabs */}
      <div className="space-y-4">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white">
            Bengaluru Property Discovery
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Browse verified residential plots, independent villas, apartments, and rental properties across Bangalore.
          </p>
        </div>

        {/* Purpose pills */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
          {[
            { id: 'all', label: 'All Listings' },
            { id: 'sale', label: 'Properties for Sale' },
            { id: 'rent', label: 'House / Flat Rentals' },
            { id: 'lease', label: 'Commercial Leases' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => updateFilter('purpose', item.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                purpose === item.id
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Result */}
      <div className="space-y-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-64 sm:h-80 animate-pulse border border-slate-100 p-4" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-heading font-bold text-lg text-navy-900">No matching properties found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Check back soon or switch categories above to see other verified Bangalore properties.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-6">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-2 rounded-lg border border-slate-300 disabled:opacity-40 hover:bg-slate-50 text-slate-600"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: pagination.totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePageChange(idx + 1)}
                  className={`w-9 h-9 rounded-lg text-xs font-bold transition ${
                    pagination.page === idx + 1
                      ? 'bg-gold-500 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="p-2 rounded-lg border border-slate-300 disabled:opacity-40 hover:bg-slate-50 text-slate-600"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
    </div>
  );
};
