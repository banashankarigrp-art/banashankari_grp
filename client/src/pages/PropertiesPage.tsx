import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Grid,
  List,
  RotateCcw,
  Building2,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import { PropertyCard } from '../components/property/PropertyCard';
import { api } from '../services/api';
import { IProperty } from '@shared/types';

export const PropertiesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 9, totalPages: 1 });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Filters from searchParams or defaults
  const purpose = searchParams.get('purpose') || 'all';
  const type = searchParams.get('type') || 'all';
  const locality = searchParams.get('locality') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const bedrooms = searchParams.get('bedrooms') || 'all';
  const sortBy = searchParams.get('sortBy') || 'newest';
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

  const clearAllFilters = () => {
    setSearchParams({});
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-navy-900">
              Bengaluru Property Discovery
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Browse verified residential plots, independent villas, apartments, and rental properties across Bangalore.
            </p>
          </div>

          {/* Grid / List Switcher */}
          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <button
              onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
              className="lg:hidden flex items-center space-x-1.5 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            <div className="bg-slate-200/70 p-1 rounded-lg flex items-center space-x-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md ${
                  viewMode === 'grid' ? 'bg-white shadow text-navy-900' : 'text-slate-500 hover:text-navy-900'
                }`}
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md ${
                  viewMode === 'list' ? 'bg-white shadow text-navy-900' : 'text-slate-500 hover:text-navy-900'
                }`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
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

      {/* Main layout: Filters Sidebar + Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Filters Sidebar */}
        <aside
          className={`lg:block ${
            filterDrawerOpen ? 'block' : 'hidden'
          } bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-navy-900 flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gold-600" />
              <span>Filter Properties</span>
            </h3>
            <button
              onClick={clearAllFilters}
              className="text-[11px] text-slate-500 hover:text-gold-600 flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Search Term */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Search Keywords</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="e.g. Kenchanahalli, Villa..."
                defaultValue={searchParams.get('search') || ''}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    updateFilter('search', (e.target as HTMLInputElement).value);
                  }
                }}
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Locality Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Bangalore Locality</label>
            <select
              value={locality}
              onChange={(e) => updateFilter('locality', e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
            >
              <option value="">All Localities</option>
              <option value="Banashankari">Banashankari</option>
              <option value="Kenchanahalli">Kenchanahalli</option>
              <option value="Uttarahalli">Uttarahalli</option>
              <option value="Electronic City">Electronic City</option>
              <option value="Kanakapura Road">Kanakapura Road</option>
              <option value="Rajarajeshwari Nagar">Rajarajeshwari Nagar</option>
              <option value="Yelahanka">Yelahanka</option>
              <option value="Whitefield">Whitefield</option>
              <option value="Kengeri">Kengeri</option>
            </select>
          </div>

          {/* Property Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Property Type</label>
            <select
              value={type}
              onChange={(e) => updateFilter('type', e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="plot">Residential Plot</option>
              <option value="villa">Independent Villa</option>
              <option value="apartment">Apartment / Flat</option>
              <option value="commercial">Commercial Space</option>
              <option value="land">Construction Land</option>
            </select>
          </div>

          {/* Bedrooms */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Bedrooms (BHK)</label>
            <div className="grid grid-cols-4 gap-1.5">
              {['all', '1', '2', '3'].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => updateFilter('bedrooms', b)}
                  className={`py-1.5 text-xs rounded-lg font-medium transition ${
                    bedrooms === b
                      ? 'bg-navy-900 text-white font-bold'
                      : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {b === 'all' ? 'Any' : `${b} BHK`}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
            >
              <option value="newest">Newest Listings</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="featured">Featured First</option>
            </select>
          </div>
        </aside>

        {/* Listings Result Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Results summary bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
            <span>
              Showing <strong className="text-navy-900">{properties.length}</strong> of{' '}
              <strong className="text-navy-900">{pagination.total}</strong> verified listings
            </span>
            <span className="hidden sm:inline">Bangalore Market Verified</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl h-64 sm:h-80 animate-pulse border border-slate-100 p-4" />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-heading font-bold text-lg text-navy-900">No matching properties found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try widening your budget range or clearing some filters to see other verified Bangalore properties.
              </p>
              <button
                onClick={clearAllFilters}
                className="inline-block mt-2 bg-navy-900 text-white px-5 py-2 rounded-xl text-xs font-semibold hover:bg-gold-600 transition"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6'
                  : 'space-y-4'
              }
            >
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
    </div>
  );
};
