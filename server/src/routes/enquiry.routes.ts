import { Router } from 'express';
import { createEnquiry, getMyEnquiries, trackEnquiryByRef } from '../controllers/enquiry.controller.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import { enquiryCreateSchema } from '../validators/enquiry.validator.js';

const router = Router();

// Submit enquiry (supports both logged in and guest users)
router.post('/', optionalAuth, validateRequest(enquiryCreateSchema), createEnquiry);

// Track enquiry publicly by reference ID
router.get('/track/:referenceId', trackEnquiryByRef);

// Logged-in customer's enquiries
router.get('/mine', authenticate, getMyEnquiries);

export default router;
