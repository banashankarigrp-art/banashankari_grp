import { z } from 'zod';

export const enquiryCreateSchema = z.object({
  category: z.enum(['general', 'property', 'construction', 'loan', 'khb']),
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid 10-digit phone number is required'),
  propertyId: z.string().optional(),
  details: z.object({
    message: z.string().optional(),
    preferredContactTime: z.string().optional(),
    // Construction specifics
    plotDimensions: z.string().optional(),
    proposedBuiltUpArea: z.number().optional(),
    floors: z.number().optional(),
    constructionBudget: z.string().optional(),
    expectedStartDate: z.string().optional(),
    projectLocation: z.string().optional(),
    // Loan specifics
    loanPurpose: z.string().optional(),
    approximateLoanAmount: z.number().optional(),
    employmentType: z.string().optional(),
    monthlyIncomeRange: z.string().optional(),
    // KHB specifics
    khbAssistanceType: z.string().optional(),
    khbLocality: z.string().optional(),
  }).default({}),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'You must consent to be contacted regarding your enquiry' }),
  }),
});
