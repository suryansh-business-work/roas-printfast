import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import rateLimit from 'express-rate-limit';
import path from 'path';

import config from './config/config';
import connectDatabase from './config/database';
import sessionConfig from './config/session';
import { errorMiddleware } from './middleware/error.middleware';
import logger from './utils/logger';

import authRoutes from './features/auth/auth.routes';
import usersRoutes from './features/users/users.routes';
import configRoutes from './features/config/config.routes';
import vendorsRoutes from './features/vendors/vendors.routes';
import campaignsRoutes from './features/campaigns/campaigns.routes';

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  }),
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(session(sessionConfig));

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, error: { code: 'RATE_LIMIT', message: 'Too many requests' } },
  standardHeaders: true,
  legacyHeaders: false,
});

// Routes
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/config', configRoutes);
app.use('/api/v1/vendors', vendorsRoutes);
app.use('/api/v1/campaigns', campaignsRoutes);

// Serve uploaded files
app.use('/uploads', express.static(path.resolve(__dirname, '../../uploads')));

// Health check
app.get('/api/v1/health', (_req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Error handling (must be last)
app.use(errorMiddleware);

// Start server
const startServer = async (): Promise<void> => {
  await connectDatabase();

  app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
  });
};

startServer().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});

export default app;
