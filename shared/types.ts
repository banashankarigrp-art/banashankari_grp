export type UserRole = 'customer' | 'seller' | 'admin';
export type AccountStatus = 'active' | 'suspended' | 'pending_verification';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  accountStatus: AccountStatus;
  emailVerified: boolean;
  profile?: {
    avatarUrl?: string;
    address?: string;
    city?: string;
    state?: string;
  };
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export type PropertyType = 'plot' | 'house' | 'villa' | 'apartment' | 'commercial' | 'land';
export type ListingPurpose = 'sale' | 'rent' | 'lease';
export type ApprovalStatus = 'draft' | 'pending_review' | 'approved' | 'rejected' | 'changes_requested';
export type PublicationStatus = 'published' | 'unpublished';
export type AvailabilityStatus = 'available' | 'under_offer' | 'sold' | 'rented' | 'leased' | 'withdrawn';

export interface IPropertyLocation {
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
}

export interface IPropertyPricing {
  price: number; // In INR
  isNegotiable: boolean;
  pricingTerms?: string; // e.g., 'Per Sq Ft', 'All Inclusive', 'Deposit ₹2 Lakhs'
  monthlyRent?: number;
  securityDeposit?: number;
  maintenanceCharges?: number;
}

export interface IPropertyImage {
  url: string;
  publicId?: string;
  caption?: string;
  isCover: boolean;
}

export interface IProperty {
  _id: string;
  referenceId: string;
  ownerId: string | IUser;
  title: string;
  slug: string;
  propertyType: PropertyType;
  listingPurpose: ListingPurpose;
  description: string;
  location: IPropertyLocation;
  pricing: IPropertyPricing;
  landArea?: number;
  builtUpArea?: number;
  areaUnit: 'sqft' | 'sqyard' | 'cents' | 'acres' | 'guntha';
  bedrooms?: number;
  bathrooms?: number;
  furnishing?: 'unfurnished' | 'semi-furnished' | 'fully-furnished';
  amenities: string[];
  images: IPropertyImage[];
  ownershipDeclaration: {
    isOwner: boolean;
    hasLegalAuthority: boolean;
    agreedToTerms: boolean;
    submissionDate: string;
  };
  approvalStatus: ApprovalStatus;
  publicationStatus: PublicationStatus;
  featured: boolean;
  availabilityStatus: AvailabilityStatus;
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type EnquiryCategory = 'general' | 'property' | 'construction' | 'loan' | 'khb';
export type EnquiryStatus = 'submitted' | 'under_review' | 'contacted' | 'in_progress' | 'resolved' | 'closed';

export interface IEnquiry {
  _id: string;
  referenceId: string;
  userId?: string | IUser;
  category: EnquiryCategory;
  customerName: string;
  email: string;
  phone: string;
  propertyId?: string | IProperty;
  details: {
    message?: string;
    preferredContactTime?: string;
    // Construction specifics
    plotDimensions?: string;
    proposedBuiltUpArea?: number;
    floors?: number;
    constructionBudget?: string;
    expectedStartDate?: string;
    projectLocation?: string;
    // Loan specifics
    loanPurpose?: 'home_purchase' | 'home_construction' | 'plot_purchase' | 'renovation' | 'loan_against_property' | 'balance_transfer';
    approximateLoanAmount?: number;
    employmentType?: 'salaried' | 'self_employed' | 'business';
    monthlyIncomeRange?: string;
    // KHB specifics
    khbAssistanceType?: 'allotment_guidance' | 'document_checklist' | 'transfer_assistance' | 'title_verification' | 'general_consultation';
    khbLocality?: string;
  };
  consent: boolean;
  status: EnquiryStatus;
  assignedAdminId?: string;
  internalNotes?: string;
  followUpAt?: string;
  customerResponse?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IConstructionProject {
  _id: string;
  title: string;
  location: string;
  clientType: string;
  status: 'planning' | 'in_progress' | 'completed';
  builtUpArea: string;
  durationMonths?: number;
  description: string;
  coverImage: string;
  gallery: string[];
  features: string[];
  completionYear?: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface INotification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'listing_update' | 'enquiry_update' | 'system' | 'security';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface IAuditLog {
  _id: string;
  actorId: string;
  actorName: string;
  actorEmail: string;
  action: string;
  targetType: string;
  targetId: string;
  details?: Record<string, any>;
  ipAddress?: string;
  createdAt: string;
}

export interface ISiteSettings {
  companyName: string;
  founderName: string;
  founderTitle?: string;
  founderPhoto?: string;
  primaryPhone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  city: string;
  state: string;
  businessHours: string;
  heroHeadline: string;
  heroSubheadline: string;
  aboutText: string;
  whatsappTemplate: string;
}

export const COMPANY_INFO = {
  name: 'Banashankari Enterprises',
  founder: 'Ramesh S H',
  founderTitle: 'Founder & Managing Director',
  founderPhoto: '/founder.jpg',
  phone: '+91 997 253 6991',
  whatsappRaw: '919972536991',
  whatsappUrl: 'https://wa.me/919972536991',
  market: 'Bangalore, Karnataka, India',
  currency: 'INR',
  currencySymbol: '₹',
  address: 'Banashankari / Bengaluru, Karnataka, India',
  supportEmail: 'contact@banashankarienterprises.com',
};
