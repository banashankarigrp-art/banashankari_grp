import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  CheckCircle2,
  ArrowRight,
  Camera,
  Trash2,
  Star,
  ImagePlus,
  AlertCircle,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const RentLeasePropertyPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<any>(null);
  const [photoError, setPhotoError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  interface IUploadedPhoto {
    id: string;
    url: string;
    name: string;
    isCover: boolean;
  }

  const [uploadedPhotos, setUploadedPhotos] = useState<IUploadedPhoto[]>([
    {
      id: 'default-rental-photo',
      url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      name: 'rental-apartment-sample.jpg',
      isCover: true,
    },
  ]);

  const handleDevicePhotoUpload = (filesList: FileList | File[] | null) => {
    setPhotoError('');
    if (!filesList) return;
    const files = Array.from(filesList);
    if (!files.length) return;

    if (uploadedPhotos.length >= 4) {
      setPhotoError('You have already uploaded the maximum limit of 4 photos.');
      return;
    }

    const availableSlots = 4 - uploadedPhotos.length;
    const selectedFiles = files.slice(0, availableSlots);

    selectedFiles.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setPhotoError('Please select valid image files (JPG, PNG, WebP).');
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        setPhotoError(`Photo "${file.name}" exceeds 15MB limit.`);
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

  // Guard: Customers have no listing access
  if (user?.role === 'customer') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 shadow-luxury">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <Building2 className="w-7 h-7" />
          </div>
          <h2 className="font-heading text-xl font-bold text-navy-900">
            Rental Listing is for Property Owners
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your account is registered as a <strong>Customer</strong>. Customers have full access to explore rental properties, houses, and plots in Bengaluru.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/properties"
              className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-3 rounded-xl text-xs transition shadow text-center"
            >
              Explore Available Properties
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

  const [formData, setFormData] = useState({
    title: '',
    propertyType: 'apartment',
    listingPurpose: 'rent',
    locality: 'Uttarahalli Main Road',
    address: '',
    monthlyRent: 25000,
    securityDeposit: 150000,
    builtUpArea: 1100,
    bedrooms: 2,
    bathrooms: 2,
    furnishing: 'semi-furnished',
    description: '',
    agreedToTerms: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please log in to submit your rental property');
      navigate('/login');
      return;
    }

    if (uploadedPhotos.length === 0) {
      alert('Please upload at least 1 property photograph from your device');
      return;
    }

    try {
      setIsSubmitting(true);
      const res: any = await api.post('/properties', {
        title: formData.title,
        propertyType: formData.propertyType,
        listingPurpose: formData.listingPurpose,
        description: formData.description,
        location: {
          locality: formData.locality,
          address: formData.address,
          city: 'Bangalore',
          state: 'Karnataka',
          isAddressPublic: false,
        },
        pricing: {
          price: Number(formData.monthlyRent),
          isNegotiable: false,
          monthlyRent: Number(formData.monthlyRent),
          securityDeposit: Number(formData.securityDeposit),
          pricingTerms: `₹${Number(formData.monthlyRent).toLocaleString('en-IN')} / mo (Deposit ₹${(Number(formData.securityDeposit)/100000).toFixed(1)}L)`,
        },
        builtUpArea: Number(formData.builtUpArea),
        areaUnit: 'sqft',
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        furnishing: formData.furnishing,
        amenities: ['Power Backup', 'Lift', 'Car Parking', '24/7 Security'],
        images: uploadedPhotos.map((photo, idx) => ({
          url: photo.url,
          isCover: photo.isCover,
          caption: photo.isCover ? 'Cover rental photograph' : `Rental photograph ${idx + 1}`,
        })),
        ownershipDeclaration: {
          isOwner: true,
          hasLegalAuthority: true,
          agreedToTerms: formData.agreedToTerms,
        },
      });

      if (res.success) {
        setSuccess(res.data);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit rental property');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAdmin = user?.role === 'admin';

  if (success) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
        <h2 className="font-heading text-2xl font-bold text-navy-900">
          {isAdmin ? 'Rental Listing Published Live!' : 'Rental Listing Received'}
        </h2>
        <p className="text-xs text-slate-500">
          Ref ID: <strong>{success.referenceId}</strong>.{' '}
          {isAdmin
            ? 'Your rental listing has been published live directly to Bangalore prospective tenants.'
            : 'Our rental verification desk will verify and publish your listing for prospective Bangalore tenants.'}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to={isAdmin ? '/admin/properties' : '/dashboard/properties'}
            className="inline-block bg-navy-900 text-white px-5 py-2.5 rounded-xl text-xs font-semibold"
          >
            {isAdmin ? 'View in Admin Console' : 'View in Dashboard'}
          </Link>
          <Link
            to="/properties"
            className="inline-block border border-slate-300 text-slate-700 px-5 py-2.5 rounded-xl text-xs font-semibold"
          >
            Browse Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block">
          Rental & Lease Onboarding
        </span>
        <h1 className="font-heading text-3xl font-bold text-navy-900">
          List Your Flat, House or Commercial Space for Rent
        </h1>
        <p className="text-xs text-slate-500">
          Find vetted Bangalore tenants with proper rental agreement documentation.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-luxury">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Listing Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Spacious 2 BHK Semi-Furnished Apartment in Uttarahalli"
              className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Property Type</label>
              <select
                value={formData.propertyType}
                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              >
                <option value="apartment">Apartment / Gated Society</option>
                <option value="house">Independent House</option>
                <option value="villa">Villa</option>
                <option value="commercial">Commercial Space / Shop</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Locality in Bangalore *</label>
              <input
                type="text"
                required
                value={formData.locality}
                onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Expected Monthly Rent (₹) *</label>
              <input
                type="number"
                required
                value={formData.monthlyRent}
                onChange={(e) => setFormData({ ...formData, monthlyRent: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Security Deposit (₹) *</label>
              <input
                type="number"
                required
                value={formData.securityDeposit}
                onChange={(e) => setFormData({ ...formData, securityDeposit: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Built-Up Area (Sq.Ft)</label>
              <input
                type="number"
                value={formData.builtUpArea}
                onChange={(e) => setFormData({ ...formData, builtUpArea: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Bedrooms</label>
              <input
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Furnishing</label>
              <select
                value={formData.furnishing}
                onChange={(e) => setFormData({ ...formData, furnishing: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              >
                <option value="unfurnished">Unfurnished</option>
                <option value="semi-furnished">Semi-Furnished</option>
                <option value="fully-furnished">Fully-Furnished</option>
              </select>
            </div>
          </div>

          {/* Device Photo Upload (Up to 4 Images) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700 block text-xs sm:text-sm">
                Property Photographs (Up to 4 Images from Device) *
              </label>
              <span className="text-xs font-bold text-gold-600 bg-gold-50 px-2.5 py-1 rounded-lg border border-gold-200">
                {uploadedPhotos.length} / 4 Uploaded
              </span>
            </div>

            {photoError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{photoError}</span>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              accept="image/png,image/jpeg,image/webp,image/jpg"
              multiple
              className="hidden"
              onChange={(e) => handleDevicePhotoUpload(e.target.files)}
            />

            {uploadedPhotos.length < 4 && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gold-400/60 hover:border-gold-500 bg-gold-500/5 hover:bg-gold-500/10 rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-2 group"
              >
                <div className="w-12 h-12 rounded-xl bg-white text-gold-600 border border-gold-300 flex items-center justify-center shadow group-hover:scale-105 transition transform">
                  <Camera className="w-6 h-6" />
                </div>
                <p className="font-semibold text-xs text-navy-900">
                  Click to Choose Photos from Your Device
                </p>
                <p className="text-[11px] text-slate-400">
                  Supports JPG, PNG, WebP up to 15MB each (Max 4 photos)
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="bg-navy-900 hover:bg-navy-850 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center space-x-1.5 shadow"
                >
                  <ImagePlus className="w-3.5 h-3.5 text-gold-400" />
                  <span>Choose Photos ({4 - uploadedPhotos.length} left)</span>
                </button>
              </div>
            )}

            {uploadedPhotos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {uploadedPhotos.map((photo, idx) => (
                  <div
                    key={photo.id}
                    className={`relative rounded-xl overflow-hidden border-2 bg-slate-900 aspect-[4/3] shadow-sm ${
                      photo.isCover ? 'border-gold-500 ring-2 ring-gold-400/30' : 'border-slate-200'
                    }`}
                  >
                    <img src={photo.url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between">
                      {photo.isCover ? (
                        <span className="bg-gold-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                          ★ Cover
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetCoverPhoto(photo.id)}
                          className="bg-black/60 hover:bg-black/80 text-white text-[9px] px-1.5 py-0.5 rounded backdrop-blur-sm transition"
                        >
                          Cover
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(photo.id)}
                        className="bg-red-600/80 hover:bg-red-600 text-white p-1 rounded backdrop-blur-sm transition"
                        title="Remove Photo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Description & Tenant Preferences *</label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mention family/bachelor preferences, parking space, availability date..."
              className="w-full p-2.5 rounded-xl border border-slate-300"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-navy-900 hover:bg-navy-850 text-white font-bold py-3 rounded-xl transition"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Rental Listing for Verification'}
          </button>
        </form>
      </div>
    </div>
  );
};
