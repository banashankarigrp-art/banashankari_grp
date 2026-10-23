import { Router } from 'express';
import authRoutes from './auth.routes.js';
import propertyRoutes from './property.routes.js';
import enquiryRoutes from './enquiry.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import adminRoutes from './admin.routes.js';
import contentRoutes from './content.routes.js';
import { getDbConnectionStatus } from '../config/database.js';

const apiRouter = Router();

// Health check endpoint
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Banashankari Enterprises API',
    database: getDbConnectionStatus(),
  });
});

apiRouter.use('/auth', authRoutes);
apiRouter.use('/properties', propertyRoutes);
apiRouter.use('/enquiries', enquiryRoutes);
apiRouter.use('/dashboard', dashboardRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/content', contentRoutes);

export default apiRouter;
