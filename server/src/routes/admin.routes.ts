import { Router } from 'express';
import {
  getAnalytics,
  getAllPropertiesAdmin,
  approveProperty,
  rejectProperty,
  togglePublishProperty,
  toggleFeatureProperty,
  updatePropertyAvailability,
  getAllUsers,
  updateUserStatus,
  getAllEnquiriesAdmin,
  updateEnquiryStatusAndNotes,
  getAuditLogs,
} from '../controllers/admin.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Strict security: all admin routes require both valid authentication and role === 'admin'
router.use(authenticate, requireAdmin);

// Analytics
router.get('/analytics', getAnalytics);

// Properties moderation & queue
router.get('/properties', getAllPropertiesAdmin);
router.post('/properties/:id/approve', approveProperty);
router.post('/properties/:id/reject', rejectProperty);
router.post('/properties/:id/toggle-publish', togglePublishProperty);
router.post('/properties/:id/toggle-feature', toggleFeatureProperty);
router.patch('/properties/:id/availability', updatePropertyAvailability);

// Users management
router.get('/users', getAllUsers);
router.patch('/users/:id/status', updateUserStatus);

// Enquiries moderation
router.get('/enquiries', getAllEnquiriesAdmin);
router.patch('/enquiries/:id', updateEnquiryStatusAndNotes);

// Audit trail
router.get('/audit-logs', getAuditLogs);

export default router;
