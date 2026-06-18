import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import env from './config/env.js';
import { serveSwagger, setupSwagger } from './config/swagger.js';
import authRoutes from './modules/auth/auth.routes.js';
import storeRoutes from './modules/stores/store.routes.js';
import userRoutes from './modules/users/user.routes.js';
import employeeRoutes from './modules/employees/employee.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import storeSharedRoutes from './modules/stores/store.shared.routes.js';
import errorHandler from './middlewares/error.middleware.js';
import { globalLimiter } from './middlewares/rateLimiter.middleware.js';
import { auth } from './middlewares/auth.middleware.js';
import { authorize } from './middlewares/role.middleware.js';
import ROLES from './constants/roles.js';
import ApiError from './utils/ApiError.js';
import { query } from './config/database.js';
import morgan from 'morgan';

const app = express();

app.set('trust proxy', 1);

app.use(globalLimiter);
app.use(helmet());

const allowedOrigins = [
  env.CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:5173'
].map(url => url?.endsWith('/') ? url.slice(0, -1) : url);

app.use(cors({
  origin: (origin, callback) => {
    // Allow same-origin requests or clients without Origin header (like curl or postman)
    if (!origin) return callback(null, true);
    
    const cleanOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;
    
    // Check allowed list or Vercel preview/production domains
    const isAllowed = allowedOrigins.includes(cleanOrigin) ||
                      cleanOrigin.endsWith('.vercel.app') ||
                      (process.env.VERCEL && cleanOrigin.includes('vercel.app'));
                      
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.use(morgan('dev'));

app.use('/api-docs', serveSwagger, setupSwagger);

// Public Auth routes
app.use('/api/v1/auth', authRoutes);

// Protected Admin routes
app.use('/api/v1/admin/stores', storeRoutes);
app.use('/api/v1/admin/users', userRoutes);
app.use('/api/v1/admin/dashboard', dashboardRoutes);

// Protected Owner routes
app.use('/api/v1/owner/stores', employeeRoutes);

// Protected Shared store and rating routes
app.use('/api/v1/stores', storeSharedRoutes);

app.get('/health', async (req, res, next) => {
  try {
    await query('SELECT 1');
    return res.status(200).json({
      success: true,
      message: 'Server health check passed. Database connected.',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(new ApiError(500, 'Health check failed: Database connection error'));
  }
});

app.use('*', (req, res, next) => {
  next(new ApiError(404, `Cannot find ${req.originalUrl} on this server`));
});

app.use(errorHandler);

export default app;
