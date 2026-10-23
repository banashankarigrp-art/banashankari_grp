import { Router } from 'express';
import {
  getSiteSettings,
  updateSiteSettings,
  getConstructionProjects,
  createConstructionProject,
  getTestimonials,
} from '../controllers/content.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Public CMS data
router.get('/settings', getSiteSettings);
router.get('/projects', getConstructionProjects);
router.get('/testimonials', getTestimonials);

// Admin CMS editing
router.patch('/settings', authenticate, requireAdmin, updateSiteSettings);
router.post('/projects', authenticate, requireAdmin, createConstructionProject);

export default router;
