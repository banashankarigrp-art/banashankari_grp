import { Router } from 'express';
import {
  getProperties,
  getPropertyBySlugOrId,
  createProperty,
  getMyProperties,
  updateMyProperty,
  withdrawMyProperty,
  toggleSaveProperty,
  getSavedProperties,
} from '../controllers/property.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import { propertyCreateSchema, propertyUpdateSchema } from '../validators/property.validator.js';

const router = Router();

// Public property discovery
router.get('/', getProperties);
router.get('/detail/:identifier', getPropertyBySlugOrId);

// Customer protected property routes
router.post('/', authenticate, validateRequest(propertyCreateSchema), createProperty);
router.get('/user/mine', authenticate, getMyProperties);
router.patch('/user/:id', authenticate, validateRequest(propertyUpdateSchema), updateMyProperty);
router.post('/user/:id/withdraw', authenticate, withdrawMyProperty);

// Bookmarks / Saved
router.get('/user/saved', authenticate, getSavedProperties);
router.post('/:id/toggle-save', authenticate, toggleSaveProperty);

export default router;
