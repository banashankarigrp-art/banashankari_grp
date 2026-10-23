import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';
import { ENV } from './config/env.js';

const startServer = async () => {
  const app = createApp();

  // Connect to MongoDB
  await connectDatabase();

  app.listen(ENV.PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Banashankari Enterprises Backend Server Running!`);
    console.log(`📡 URL: http://localhost:${ENV.PORT}`);
    console.log(`🩺 Health check: http://localhost:${ENV.PORT}/api/v1/health`);
    console.log(`⚙️ Mode: ${ENV.NODE_ENV}`);
    console.log(`👤 Initial Admin: ${ENV.INITIAL_ADMIN_EMAIL}`);
    console.log(`======================================================\n`);
  });
};

startServer().catch((err) => {
  console.error('Fatal Server Startup Error:', err);
  process.exit(1);
});
