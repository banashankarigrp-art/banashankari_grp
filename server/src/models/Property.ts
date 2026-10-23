import mongoose, { Schema, Document } from 'mongoose';

export interface IPropertyDocument extends Document {
  referenceId: string;
  ownerId: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  propertyType: 'plot' | 'house' | 'villa' | 'apartment' | 'commercial' | 'land';
  listingPurpose: 'sale' | 'rent' | 'lease';
  description: string;
  location: {
    locality: string;
    address?: string;
    landmark?: string;
    city: string;
    state: string;
    postalCode?: string;
    isAddressPublic: boolean;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  pricing: {
    price: number;
    isNegotiable: boolean;
    pricingTerms?: string;
    monthlyRent?: number;
    securityDeposit?: number;
    maintenanceCharges?: number;
  };
  landArea?: number;
  builtUpArea?: number;
  areaUnit: 'sqft' | 'sqyard' | 'cents' | 'acres' | 'guntha';
  bedrooms?: number;
  bathrooms?: number;
  furnishing?: 'unfurnished' | 'semi-furnished' | 'fully-furnished';
  amenities: string[];
  images: Array<{
    url: string;
    publicId?: string;
    caption?: string;
    isCover: boolean;
  }>;
  ownershipDeclaration: {
    isOwner: boolean;
    hasLegalAuthority: boolean;
    agreedToTerms: boolean;
    submissionDate: Date;
  };
  approvalStatus: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'changes_requested';
  publicationStatus: 'published' | 'unpublished';
  featured: boolean;
  availabilityStatus: 'available' | 'under_offer' | 'sold' | 'rented' | 'leased' | 'withdrawn';
  reviewNotes?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<IPropertyDocument>(
  {
    referenceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
      maxlength: 150,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    propertyType: {
      type: String,
      enum: ['plot', 'house', 'villa', 'apartment', 'commercial', 'land'],
      required: true,
      index: true,
    },
    listingPurpose: {
      type: String,
      enum: ['sale', 'rent', 'lease'],
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    location: {
      locality: { type: String, required: true, trim: true, index: true },
      address: { type: String, trim: true },
      landmark: { type: String, trim: true },
      city: { type: String, default: 'Bangalore', trim: true },
      state: { type: String, default: 'Karnataka', trim: true },
      postalCode: { type: String, trim: true },
      isAddressPublic: { type: Boolean, default: false },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    pricing: {
      price: { type: Number, required: true, min: 0, index: true },
      isNegotiable: { type: Boolean, default: true },
      pricingTerms: String,
      monthlyRent: Number,
      securityDeposit: Number,
      maintenanceCharges: Number,
    },
    landArea: { type: Number, min: 0 },
    builtUpArea: { type: Number, min: 0 },
    areaUnit: {
      type: String,
      enum: ['sqft', 'sqyard', 'cents', 'acres', 'guntha'],
      default: 'sqft',
    },
    bedrooms: { type: Number, min: 0 },
    bathrooms: { type: Number, min: 0 },
    furnishing: {
      type: String,
      enum: ['unfurnished', 'semi-furnished', 'fully-furnished'],
    },
    amenities: [{ type: String, trim: true }],
    images: [
      {
        url: { type: String, required: true },
        publicId: String,
        caption: String,
        isCover: { type: Boolean, default: false },
      },
    ],
    ownershipDeclaration: {
      isOwner: { type: Boolean, default: true },
      hasLegalAuthority: { type: Boolean, default: true },
      agreedToTerms: { type: Boolean, required: true },
      submissionDate: { type: Date, default: Date.now },
    },
    approvalStatus: {
      type: String,
      enum: ['draft', 'pending_review', 'approved', 'rejected', 'changes_requested'],
      default: 'pending_review',
      index: true,
    },
    publicationStatus: {
      type: String,
      enum: ['published', 'unpublished'],
      default: 'unpublished',
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    availabilityStatus: {
      type: String,
      enum: ['available', 'under_offer', 'sold', 'rented', 'leased', 'withdrawn'],
      default: 'available',
      index: true,
    },
    reviewNotes: String,
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient public catalog browsing
PropertySchema.index({ approvalStatus: 1, publicationStatus: 1, listingPurpose: 1, propertyType: 1 });
PropertySchema.index({ 'pricing.price': 1, 'location.locality': 1 });
PropertySchema.index({ title: 'text', description: 'text', 'location.locality': 'text' });

export const Property = mongoose.model<IPropertyDocument>('Property', PropertySchema);
