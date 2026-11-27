import { Router } from 'express';
import {
  getProperties,
  getPropertyBySlugOrId,
  createProperty,
  toggleSaveProperty,
  getSavedProperties,
} from '../controllers/property.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import { propertyCreateSchema } from '../validators/property.validator.js';

const router = Router();

// Public property discovery
router.get('/', getProperties);
router.get('/detail/:identifier', getPropertyBySlugOrId);

// Admin-only property creation
router.post('/', authenticate, requireAdmin, validateRequest(propertyCreateSchema), createProperty);

// Bookmarks / Saved
router.get('/user/saved', authenticate, getSavedProperties);
router.post('/:id/toggle-save', authenticate, toggleSaveProperty);

export default router;
