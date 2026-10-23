import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize2, Tag, ShieldCheck, Heart } from 'lucide-react';
import { IProperty } from '@shared/types';
import { api } from '../../services/api';

interface PropertyCardProps {
  property: IProperty;
  onSavedToggle?: (propertyId: string, isSaved: boolean) => void;
  isSaved?: boolean;
}

export const formatIndianCurrency = (amount: number, purpose?: string) => {
  if (purpose === 'rent') {
    return `₹${amount.toLocaleString('en-IN')} / mo`;
  }
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹${cr.toFixed(2).replace(/\.00$/, '')} Crore`;
  }
  if (amount >= 100000) {
    const lk = amount / 100000;
    return `₹${lk.toFixed(2).replace(/\.00$/, '')} Lakhs`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSavedToggle,
  isSaved = false,
}) => {
  const [saved, setSaved] = React.useState(isSaved);
  const [isToggling, setIsToggling] = React.useState(false);

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsToggling(true);
      const res: any = await api.post(`/properties/${property._id}/toggle-save`);
      setSaved(res.isSaved);
      if (onSavedToggle) {
        onSavedToggle(property._id, res.isSaved);
      }
    } catch (err) {
      // Prompt user to login if unauthenticated
      window.location.href = '/login';
    } finally {
      setIsToggling(false);
    }
  };

  const coverImage =
    property.images?.find((img) => img.isCover)?.url ||
    property.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';

  const getPurposeBadge = () => {
    if (property.propertyType === 'plot') return 'READY FOR REGISTRATION - PLOT';
    if (property.listingPurpose === 'rent') return 'VERIFIED RENTAL APARTMENT';
    if (property.listingPurpose === 'lease') return 'COMMERCIAL LEASE';
    if (property.availabilityStatus === 'sold') return 'SOLD OUT';
    return 'READY TO MOVE - RESIDENTIAL';
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 overflow-hidden shadow-luxury hover:shadow-luxury-hover transition-all duration-300 flex flex-col group">
      {/* Image container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={coverImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Status / Category Badge */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 items-start max-w-[80%]">
          <span className="text-[8px] sm:text-[10px] font-bold tracking-wider uppercase px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded bg-navy-950/90 text-gold-300 backdrop-blur-sm border border-gold-500/30 shadow-sm truncate max-w-full">
            {getPurposeBadge()}
          </span>
          {property.featured && (
            <span className="text-[8px] sm:text-[10px] font-bold tracking-wider uppercase px-1.5 sm:px-2 py-0.5 rounded bg-amber-500 text-white shadow-sm">
              ★ Featured
            </span>
          )}
        </div>

        {/* Favorite Bookmark Button */}
        <button
          onClick={handleToggleSave}
          disabled={isToggling}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-600 hover:text-red-500 transition shadow-sm"
          aria-label="Save listing"
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${saved ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Purpose Chip */}
        <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-navy-900/90 text-white text-[9px] sm:text-xs font-semibold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded backdrop-blur-sm capitalize">
          For {property.listingPurpose}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location */}
          <div className="flex items-center space-x-1 text-[10px] sm:text-xs font-medium text-slate-500 mb-1 sm:mb-2">
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold-600 shrink-0" />
            <span className="truncate">{property.location.locality}</span>
          </div>

          {/* Title */}
          <Link to={`/properties/${property.slug}`}>
            <h3 className="font-heading text-xs sm:text-lg font-bold text-navy-900 hover:text-gold-600 transition line-clamp-2 leading-snug mb-2 sm:mb-3">
              {property.title}
            </h3>
          </Link>

          {/* Key specs row */}
          <div className="grid grid-cols-3 gap-1 py-1.5 sm:py-3 border-y border-slate-100 text-[10px] sm:text-xs text-slate-600 mb-2 sm:mb-4 bg-slate-50/60 rounded-lg px-1 sm:px-2 text-center">
            <div className="flex flex-col items-center justify-center">
              <span className="text-[8px] sm:text-[10px] text-slate-400 uppercase tracking-wider">Area</span>
              <span className="font-semibold text-navy-900 text-[9px] sm:text-xs truncate max-w-full">
                {(property.builtUpArea || property.landArea || 0).toLocaleString()} {property.areaUnit}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center border-x border-slate-200">
              <span className="text-[8px] sm:text-[10px] text-slate-400 uppercase tracking-wider">Type</span>
              <span className="font-semibold text-navy-900 capitalize text-[9px] sm:text-xs truncate max-w-full">{property.propertyType}</span>
            </div>

            <div className="flex flex-col items-center justify-center">
              <span className="text-[8px] sm:text-[10px] text-slate-400 uppercase tracking-wider">Rooms</span>
              <span className="font-semibold text-navy-900 text-[9px] sm:text-xs truncate max-w-full">
                {property.bedrooms ? `${property.bedrooms} BHK` : 'Plot'}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing and Action CTAs */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2 sm:mb-3">
            <div>
              <span className="text-[9px] sm:text-[11px] text-slate-400 block font-medium">Expected Value</span>
              <div className="text-sm sm:text-xl font-bold text-navy-900 tracking-tight font-sans">
                {formatIndianCurrency(property.pricing.price, property.listingPurpose)}
              </div>
            </div>
            {property.pricing.pricingTerms && (
              <span className="text-[9px] sm:text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded mt-0.5 sm:mt-0 self-start sm:self-auto truncate max-w-full">
                {property.pricing.pricingTerms}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            <Link
              to={`/properties/${property.slug}`}
              className="text-center py-1.5 sm:py-2.5 px-1.5 sm:px-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-[10px] sm:text-xs transition truncate"
            >
              Details
            </Link>

            <Link
              to={`/properties/${property.slug}#enquire`}
              className="text-center py-1.5 sm:py-2.5 px-1.5 sm:px-3 rounded-lg bg-gold-500 hover:bg-gold-600 text-white font-semibold text-[10px] sm:text-xs shadow-sm transition truncate"
            >
              Enquire
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
