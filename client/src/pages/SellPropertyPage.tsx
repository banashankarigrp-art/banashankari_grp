import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Upload,
  ShieldCheck,
  AlertCircle,
  FileCheck2,
  MapPin,
  Banknote,
  Home,
  Check,
  Trash2,
  Camera,
  Star,
  ImagePlus,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatIndianCurrency } from '../components/property/PropertyCard';

export const SellPropertyPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<any>(null);

  // Guard: Customers have no listing access
  if (user?.role === 'customer') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 shadow-luxury">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <Building2 className="w-7 h-7" />
          </div>
          <h2 className="font-heading text-xl font-bold text-navy-900">
            Property Listing is for Sellers & Owners
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your account is registered as a <strong>Customer</strong>. Customers have full access to explore all verified Bangalore properties, schedule site visits, and track service requests.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/properties"
              className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-3 rounded-xl text-xs transition shadow text-center"
            >
              Explore Verified Properties
            </Link>
            <Link
              to="/my-enquiries"
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs transition text-center"
            >
              View My Enquiries
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Category & Purpose
    title: '',
    propertyType: 'plot',
    listingPurpose: 'sale',
    description: '',
    // Step 2: Location
    locality: 'Kenchanahalli',
    address: '',
    landmark: '',
    isAddressPublic: false,
    city: 'Bangalore',
    state: 'Karnataka',
    postalCode: '560098',
    // Step 3: Pricing
    price: 5000000,
    isNegotiable: true,
    pricingTerms: 'Negotiable for direct buyers',
    // Step 4: Area
    areaUnit: 'sqft',
    landArea: 1200,
    builtUpArea: 0,
    // Step 5: Specifications & Amenities
    bedrooms: 0,
    bathrooms: 0,
    furnishing: 'unfurnished',
    amenities: ['Cauvery Water', 'Asphalted Road', 'Underground Drainage'],
    // Step 7: Owner Contact
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    // Step 8: Ownership declaration
    isOwner: true,
    hasLegalAuthority: true,
    agreedToTerms: true,
  });

  interface IUploadedPhoto {
    id: string;
    url: string;
    name: string;
    isCover: boolean;
  }

  // Pre-seed with 1 sample plot photo so review is instant, but fully removable & replaceable
  const [uploadedPhotos, setUploadedPhotos] = useState<IUploadedPhoto[]>([
    {
      id: 'default-cover-sample',
      url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      name: 'bengaluru-property-sample.jpg',
      isCover: true,
    },
  ]);
  const [photoError, setPhotoError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDevicePhotoUpload = (filesList: FileList | File[] | null) => {
    setPhotoError('');
    if (!filesList) return;
    const files = Array.from(filesList);
    if (!files.length) return;

    if (uploadedPhotos.length >= 4) {
      setPhotoError('You have already uploaded the maximum limit of 4 photos. Please remove an existing photo to upload another.');
      return;
    }

    if (uploadedPhotos.length + files.length > 4) {
      setPhotoError(`Maximum 4 photos allowed. Only the first ${4 - uploadedPhotos.length} photo(s) were added.`);
    }

    const availableSlots = 4 - uploadedPhotos.length;
    const selectedFiles = files.slice(0, availableSlots);

    selectedFiles.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setPhotoError('Please select valid image files (JPG, PNG, or WebP).');
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        setPhotoError(`Photo "${file.name}" exceeds the 15MB file size limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const resultUrl = event.target?.result as string;
        if (resultUrl) {
          setUploadedPhotos((prev) => {
            if (prev.length >= 4) return prev;
            const hasCover = prev.some((p) => p.isCover);
            return [
              ...prev,
              {
                id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                url: resultUrl,
                name: file.name,
                isCover: !hasCover,
              },
            ];
          });
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (id: string) => {
    setUploadedPhotos((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      if (filtered.length > 0 && !filtered.some((p) => p.isCover)) {
        filtered[0].isCover = true;
      }
      return filtered;
    });
  };

  const handleSetCoverPhoto = (id: string) => {
    setUploadedPhotos((prev) =>
      prev.map((p) => ({
        ...p,
        isCover: p.id === id,
      }))
    );
  };

  const availableAmenities = [
    'Cauvery Water Line',
    'BESCOM 3-Phase Power',
    'Underground Drainage',
    'Asphalted 40ft Tar Road',
    'Compound Wall Built',
    'Borewell Facility',
    'Gated Community Security',
    'A-Katha Certificate',
    'Rainwater Harvesting',
    'Vastu Compliant Facing',
  ];

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists ? prev.amenities.filter((a) => a !== amenity) : [...prev.amenities, amenity],
      };
    });
  };

  const nextStep = () => {
    if (currentStep === 6 && uploadedPhotos.length === 0) {
      setPhotoError('Please upload at least 1 property photograph from your device to continue.');
      return;
    }
    setPhotoError('');
    setCurrentStep((prev) => Math.min(prev + 1, 9));
  };

  const prevStep = () => {
    setPhotoError('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please log in or create an account to submit your property for review.');
      navigate('/login');
      return;
    }

    if (uploadedPhotos.length === 0) {
      alert('Please upload at least 1 property photograph from your device before submitting.');
      setCurrentStep(6);
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        title: formData.title,
        propertyType: formData.propertyType,
        listingPurpose: formData.listingPurpose,
        description: formData.description,
        location: {
          locality: formData.locality,
          address: formData.address,
          landmark: formData.landmark,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          isAddressPublic: formData.isAddressPublic,
        },
        pricing: {
          price: Number(formData.price),
          isNegotiable: formData.isNegotiable,
          pricingTerms: formData.pricingTerms,
        },
        landArea: Number(formData.landArea),
        builtUpArea: Number(formData.builtUpArea),
        areaUnit: formData.areaUnit,
        bedrooms: Number(formData.bedrooms) || undefined,
        bathrooms: Number(formData.bathrooms) || undefined,
        furnishing: formData.furnishing,
        amenities: formData.amenities,
        images: uploadedPhotos.map((photo, idx) => ({
          url: photo.url,
          isCover: photo.isCover,
          caption: photo.isCover ? 'Main property cover photograph' : `Property photograph ${idx + 1}`,
        })),
        ownershipDeclaration: {
          isOwner: formData.isOwner,
          hasLegalAuthority: formData.hasLegalAuthority,
          agreedToTerms: formData.agreedToTerms,
        },
      };

      const res: any = await api.post('/properties', payload);
      if (res.success) {
        setSubmissionSuccess(res.data);
      }
    } catch (err: any) {
      alert(err.message || 'Error submitting listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAdmin = user?.role === 'admin';

  if (submissionSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="font-heading text-3xl font-bold text-navy-900">
          {isAdmin ? 'Property Listing Successfully Published Live!' : 'Listing Successfully Submitted for Review!'}
        </h2>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-left space-y-3 text-xs text-slate-700 shadow-sm">
          <div className="flex justify-between border-b pb-2">
            <span className="text-slate-500">Property Reference ID:</span>
            <strong className="text-navy-900 text-sm font-mono">{submissionSuccess.referenceId}</strong>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-slate-500">Title:</span>
            <strong className="text-navy-900">{submissionSuccess.title}</strong>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-slate-500">Review Status:</span>
            <span className={`px-2 py-0.5 rounded font-bold border ${isAdmin ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
              {isAdmin ? 'APPROVED & PUBLISHED LIVE' : 'PENDING ADMINISTRATIVE REVIEW'}
            </span>
          </div>
          <p className="text-slate-500 pt-2 leading-relaxed">
            {isAdmin
              ? 'Your property is now live and actively viewable by potential buyers across Bengaluru. You can manage, feature, or edit this listing at any time from the Admin Console.'
              : 'Ramesh S H and our administrative moderation team will verify the ownership credentials and title deed details within 24 hours. Once approved, your property will be published to verified buyers across Bangalore!'}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {isAdmin ? (
            <>
              <Link
                to="/admin/properties"
                className="bg-navy-900 hover:bg-navy-850 text-white px-6 py-3 rounded-xl text-xs font-semibold shadow"
              >
                Go to Admin Properties
              </Link>
              <Link
                to={`/properties/${submissionSuccess.slug}`}
                className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-xl text-xs font-semibold shadow"
              >
                View Live Property Page ↗
              </Link>
              <button
                onClick={() => {
                  setSubmissionSuccess(null);
                  setCurrentStep(1);
                }}
                className="border border-slate-300 text-slate-700 px-5 py-3 rounded-xl text-xs font-semibold hover:bg-slate-50"
              >
                + Add Another Property
              </button>
            </>
          ) : (
            <>
              <Link
                to="/dashboard/properties"
                className="bg-navy-900 hover:bg-navy-850 text-white px-6 py-3 rounded-xl text-xs font-semibold shadow"
              >
                Go to My Dashboard
              </Link>
              <Link
                to="/properties"
                className="border border-slate-300 text-slate-700 px-6 py-3 rounded-xl text-xs font-semibold hover:bg-slate-50"
              >
                Browse Properties
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }

  const steps = [
    'Category',
    'Location',
    'Pricing',
    'Dimensions',
    'Specifications',
    'Photographs',
    'Contact Info',
    'Ownership Declaration',
    'Review & Submit',
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Notice Banner if logged in as Admin */}
      {isAdmin && (
        <div className="bg-amber-500/10 border border-amber-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-amber-900">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              <strong>Administrator Mode:</strong> You are listing this property as <strong>{user?.name} (Admin)</strong>. Property listings created by administrators are automatically approved and published live immediately!
            </span>
          </div>
          <Link
            to="/admin/properties"
            className="shrink-0 bg-navy-900 hover:bg-navy-850 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition"
          >
            ← Admin Console
          </Link>
        </div>
      )}

      {/* Page Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block">
          {isAdmin ? 'Admin Property Creator' : 'Direct Seller Onboarding'}
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-navy-900">
          {isAdmin ? 'Create & Publish Property Listing Live' : 'List Your Property for Sale in Bengaluru'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          {isAdmin
            ? 'Publish residential plots, houses, villas, or commercial properties directly to the live catalog with instant approval.'
            : 'Submit your plot, house, villa, or commercial property for direct administrative review and verified buyer matching.'}
        </p>
      </div>

      {/* Progress bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex justify-between text-xs font-semibold text-slate-600">
          <span>Step {currentStep} of 9: <strong className="text-navy-900">{steps[currentStep - 1]}</strong></span>
          <span className="text-gold-600 font-bold">{Math.round((currentStep / 9) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gold-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 9) * 100}%` }}
          />
        </div>
      </div>

      {/* Wizard Form Container */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-luxury">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: Category & Purpose */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in">
              <h3 className="font-heading text-xl font-bold text-navy-900">Step 1: Property Category & Title</h3>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Catchy Listing Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. 1200 Sqft BDA East Facing Residential Plot in Kenchanahalli"
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Property Type *</label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500"
                  >
                    <option value="plot">Residential Plot / Site</option>
                    <option value="villa">Independent Villa / Duplex</option>
                    <option value="house">Individual House</option>
                    <option value="apartment">Apartment / Flat</option>
                    <option value="commercial">Commercial Property</option>
                    <option value="land">Agricultural / Development Land</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Listing Purpose</label>
                  <select
                    value={formData.listingPurpose}
                    onChange={(e) => setFormData({ ...formData, listingPurpose: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500"
                  >
                    <option value="sale">Outright Sale</option>
                    <option value="rent">Rental</option>
                    <option value="lease">Long Term Lease</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Comprehensive Description *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe title deed status (BDA/BMRDA), Cauvery water connectivity, approach road width, nearby landmarks..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Location */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <h3 className="font-heading text-xl font-bold text-navy-900">Step 2: Location in Bengaluru</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Locality / Area *</label>
                  <input
                    type="text"
                    required
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    placeholder="e.g. Kenchanahalli, Banashankari 6th Stage"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Prominent Landmark</label>
                  <input
                    type="text"
                    value={formData.landmark}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    placeholder="e.g. Near National Public School"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Street Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Plot No. / House No., Main Road, Cross"
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="isAddressPublic"
                  checked={formData.isAddressPublic}
                  onChange={(e) => setFormData({ ...formData, isAddressPublic: e.target.checked })}
                  className="w-4 h-4 text-gold-600 rounded"
                />
                <label htmlFor="isAddressPublic" className="text-xs text-slate-600">
                  Allow exact street address to be visible to public visitors (unchecked protects privacy until site visit)
                </label>
              </div>
            </div>
          )}

          {/* STEP 3: Pricing */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <h3 className="font-heading text-xl font-bold text-navy-900">Step 3: Expected Valuation & Terms</h3>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Expected Selling Price (in ₹ INR) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Preview in Indian format: <strong>{formatIndianCurrency(formData.price)}</strong>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Pricing Terms</label>
                  <input
                    type="text"
                    value={formData.pricingTerms}
                    onChange={(e) => setFormData({ ...formData, pricingTerms: e.target.value })}
                    placeholder="e.g. ₹5,500 / Sq.Ft or Slightly Negotiable"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center space-x-2 text-xs text-slate-700 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isNegotiable}
                      onChange={(e) => setFormData({ ...formData, isNegotiable: e.target.checked })}
                      className="w-4 h-4 text-gold-600 rounded"
                    />
                    <span>Price is open to reasonable negotiation</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Area & Dimensions */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-in fade-in">
              <h3 className="font-heading text-xl font-bold text-navy-900">Step 4: Dimensions & Area</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Land / Site Area</label>
                  <input
                    type="number"
                    value={formData.landArea}
                    onChange={(e) => setFormData({ ...formData, landArea: Number(e.target.value) })}
                    placeholder="e.g. 1200"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Built-Up Area (If applicable)</label>
                  <input
                    type="number"
                    value={formData.builtUpArea}
                    onChange={(e) => setFormData({ ...formData, builtUpArea: Number(e.target.value) })}
                    placeholder="e.g. 2400"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Unit of Measurement</label>
                  <select
                    value={formData.areaUnit}
                    onChange={(e) => setFormData({ ...formData, areaUnit: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500"
                  >
                    <option value="sqft">Sq. Ft.</option>
                    <option value="sqyard">Sq. Yards</option>
                    <option value="guntha">Guntha</option>
                    <option value="acres">Acres</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Specs & Amenities */}
          {currentStep === 5 && (
            <div className="space-y-5 animate-in fade-in">
              <h3 className="font-heading text-xl font-bold text-navy-900">Step 5: Rooms & Infrastructure</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                    placeholder="0 for plots"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                    placeholder="0 for plots"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Furnishing Status</label>
                  <select
                    value={formData.furnishing}
                    onChange={(e) => setFormData({ ...formData, furnishing: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500"
                  >
                    <option value="unfurnished">Unfurnished</option>
                    <option value="semi-furnished">Semi-Furnished</option>
                    <option value="fully-furnished">Fully-Furnished</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">Available Infrastructure Features</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableAmenities.map((amenity) => {
                    const isSelected = formData.amenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => handleAmenityToggle(amenity)}
                        className={`text-left p-2.5 rounded-xl border text-xs font-medium transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-navy-900 text-white border-navy-900'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span>{amenity}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-gold-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Device Photo Upload (Up to 4 Images) */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-heading text-xl font-bold text-navy-900">
                    Step 6: Upload Property Photographs
                  </h3>
                  <p className="text-xs text-slate-500">
                    Upload up to 4 high-quality photographs directly from your phone or computer.
                  </p>
                </div>
                <div className="shrink-0">
                  <span
                    className={`inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border ${
                      uploadedPhotos.length === 4
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-navy-900 text-gold-400 border-navy-800'
                    }`}
                  >
                    <span>{uploadedPhotos.length} / 4 Photos Added</span>
                  </span>
                </div>
              </div>

              {photoError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{photoError}</span>
                </div>
              )}

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/png,image/jpeg,image/webp,image/jpg"
                multiple
                className="hidden"
                onChange={(e) => handleDevicePhotoUpload(e.target.files)}
              />

              {/* Upload Dropzone / Button Card */}
              {uploadedPhotos.length < 4 ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDevicePhotoUpload(e.dataTransfer.files);
                  }}
                  className="border-2 border-dashed border-gold-400/60 hover:border-gold-500 bg-gold-500/5 hover:bg-gold-500/10 rounded-3xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-3 group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white text-gold-600 border border-gold-300 flex items-center justify-center shadow-md group-hover:scale-105 transition transform">
                    <Camera className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-base text-navy-900">
                      Upload Photos from Your Device
                    </p>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                      Click the button below or drag & drop property photos from your device (JPG, PNG, WebP up to 15MB each).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="bg-navy-900 hover:bg-navy-850 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center space-x-2 shadow-sm"
                  >
                    <ImagePlus className="w-4 h-4 text-gold-400" />
                    <span>Choose Photos from Device ({4 - uploadedPhotos.length} slots left)</span>
                  </button>
                  <p className="text-[11px] text-slate-400">
                    You can upload up to 4 photos per property listing.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>
                      <strong>Maximum 4 photos uploaded!</strong> Your property gallery has reached the 4-photo limit. To change a photo, click remove below and upload a replacement.
                    </span>
                  </div>
                </div>
              )}

              {/* Uploaded Photos Grid */}
              {uploadedPhotos.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>Uploaded Property Photographs ({uploadedPhotos.length}/4):</span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      The photo marked with ★ Cover Photo will appear as the main card image.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {uploadedPhotos.map((photo, idx) => (
                      <div
                        key={photo.id}
                        className={`relative rounded-2xl overflow-hidden border-2 bg-slate-900 shadow-sm transition ${
                          photo.isCover ? 'border-gold-500 ring-2 ring-gold-400/30' : 'border-slate-200'
                        }`}
                      >
                        <div className="aspect-[16/10] w-full bg-slate-950 overflow-hidden">
                          <img
                            src={photo.url}
                            alt={`Uploaded property photo ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Top Overlays */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-auto">
                          {photo.isCover ? (
                            <span className="bg-gold-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-md flex items-center space-x-1">
                              <Star className="w-3 h-3 fill-white" />
                              <span>★ Cover Photo</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetCoverPhoto(photo.id)}
                              className="bg-navy-950/80 hover:bg-navy-900 text-slate-200 hover:text-white text-[10px] font-semibold px-2 py-1 rounded-lg backdrop-blur-md transition shadow"
                            >
                              Set as Cover
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(photo.id)}
                            className="bg-red-950/80 hover:bg-red-600 text-white p-1.5 rounded-lg backdrop-blur-md transition shadow"
                            title="Remove Photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Bottom Info Bar */}
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-2.5 text-white flex items-center justify-between text-[11px]">
                          <span className="font-semibold">Photo {idx + 1} of {uploadedPhotos.length}</span>
                          <span className="text-[10px] text-slate-300 truncate max-w-[150px]">{photo.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 7: Owner Contact Information */}
          {currentStep === 7 && (
            <div className="space-y-5 animate-in fade-in">
              <h3 className="font-heading text-xl font-bold text-navy-900">Step 7: Owner / Representative Contact</h3>
              <p className="text-xs text-slate-500">
                This information is protected and strictly accessible to Banashankari Enterprises administrative staff.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Owner / Titleholder Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    placeholder="As appears on title deed"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Direct Contact Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.ownerPhone}
                    onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                    placeholder="+91 98450 XXXXX"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: Ownership Declaration */}
          {currentStep === 8 && (
            <div className="space-y-5 animate-in fade-in">
              <h3 className="font-heading text-xl font-bold text-navy-900">Step 8: Ownership Declaration & Consent</h3>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs text-slate-700">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isOwner}
                    onChange={(e) => setFormData({ ...formData, isOwner: e.target.checked })}
                    className="w-4 h-4 text-gold-600 rounded mt-0.5"
                  />
                  <span>
                    I confirm that I am the legal owner or duly authorized representative holding power of attorney (POA) to market this property.
                  </span>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasLegalAuthority}
                    onChange={(e) => setFormData({ ...formData, hasLegalAuthority: e.target.checked })}
                    className="w-4 h-4 text-gold-600 rounded mt-0.5"
                  />
                  <span>
                    I confirm the property possesses marketable title free from undisclosed mortgages, litigations, or statutory encumbrances.
                  </span>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreedToTerms}
                    onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                    className="w-4 h-4 text-gold-600 rounded mt-0.5"
                  />
                  <span>
                    I consent to Banashankari Enterprises verifying ownership credentials and agree that listing will only become publicly searchable following administrative verification.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 9: Review & Submit */}
          {currentStep === 9 && (
            <div className="space-y-5 animate-in fade-in">
              <h3 className="font-heading text-xl font-bold text-navy-900">Step 9: Review & Confirm Submission</h3>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3 text-xs">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Title:</span>
                  <strong className="text-navy-900">{formData.title}</strong>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Category:</span>
                  <span className="capitalize">{formData.propertyType} (For {formData.listingPurpose})</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Locality:</span>
                  <span>{formData.locality}, Bangalore</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Expected Price:</span>
                  <strong className="text-navy-900 font-sans">{formatIndianCurrency(formData.price)}</strong>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Photographs ({uploadedPhotos.length}/4):</span>
                  <strong className="text-navy-900">{uploadedPhotos.length} uploaded from device</strong>
                </div>
                {uploadedPhotos.length > 0 && (
                  <div className="flex items-center space-x-2 py-1 border-b pb-3 overflow-x-auto">
                    {uploadedPhotos.map((p, idx) => (
                      <div key={p.id} className="relative shrink-0 w-16 h-12 rounded-lg overflow-hidden border border-slate-300 shadow-sm">
                        <img src={p.url} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                        {p.isCover && (
                          <div className="absolute top-0 right-0 bg-gold-500 text-white text-[8px] font-bold px-1 rounded-bl">
                            ★ Cover
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex justify-between pb-1">
                  <span className="text-slate-500">Post-submission State:</span>
                  <span className={isAdmin ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                    {isAdmin ? 'Immediate Live Publication (Admin Verified)' : 'Pending Administrative Review'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Wizard Controls */}
          <div className="flex justify-between items-center pt-6 border-t border-slate-100">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            ) : <div />}

            {currentStep < 9 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-850 text-white text-xs font-semibold shadow"
              >
                <span>Continue to Step {currentStep + 1}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || !formData.agreedToTerms}
                className="flex items-center space-x-1.5 px-8 py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-white text-xs font-bold shadow-gold-glow transition disabled:opacity-50"
              >
                <span>
                  {isSubmitting
                    ? (isAdmin ? 'Publishing Live Listing...' : 'Submitting to Review Queue...')
                    : (isAdmin ? 'Publish Property Listing Live' : 'Confirm & Submit Listing for Review')}
                </span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
