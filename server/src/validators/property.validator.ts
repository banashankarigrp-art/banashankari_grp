import { z } from 'zod';

export const propertyCreateSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(150),
  propertyType: z.enum(['plot', 'house', 'villa', 'apartment', 'commercial', 'land']),
  listingPurpose: z.enum(['sale', 'rent', 'lease']),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  location: z.object({
    locality: z.string().min(2, 'Locality is required (e.g., Banashankari, Whitefield)'),
    address: z.string().optional(),
    landmark: z.string().optional(),
    city: z.string().default('Bangalore'),
    state: z.string().default('Karnataka'),
    postalCode: z.string().optional(),
    isAddressPublic: z.boolean().default(false),
  }),
  pricing: z.object({
    price: z.number().min(0, 'Price must be positive'),
    isNegotiable: z.boolean().default(true),
    pricingTerms: z.string().optional(),
    monthlyRent: z.number().optional(),
    securityDeposit: z.number().optional(),
    maintenanceCharges: z.number().optional(),
  }),
  landArea: z.number().optional(),
  builtUpArea: z.number().optional(),
  areaUnit: z.enum(['sqft', 'sqyard', 'cents', 'acres', 'guntha']).default('sqft'),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  furnishing: z.enum(['unfurnished', 'semi-furnished', 'fully-furnished']).optional(),
  amenities: z.array(z.string()).default([]),
  images: z
    .array(
      z.object({
        url: z.string().min(1, 'Image data or URL is required'),
        publicId: z.string().optional(),
        caption: z.string().optional(),
        isCover: z.boolean().default(false),
      })
    )
    .min(1, 'At least one property image is required'),
  ownershipDeclaration: z.object({
    isOwner: z.boolean().default(true),
    hasLegalAuthority: z.boolean().default(true),
    agreedToTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must confirm ownership or legal authority to list this property' }),
    }),
  }),
});

export const propertyUpdateSchema = propertyCreateSchema.partial();
