import express from 'express';
import session from 'express-session'
import formidable from 'express-formidable';
import { buildAuthenticatedRouter } from '@adminjs/express';
import AdminJS from 'adminjs';
import { getAuthConfig } from './auth.js';
import { componentLoader } from '../types/components.bundler.js';
import Connect from 'connect-pg-simple';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Backend server URL
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

/**
 * Configure AdminJS instance with branding and resources
 * @param resources Array of AdminJS resource configurations
 * @returns Configured AdminJS instance
 */
export const configureAdminJS = (resources) => {
  const admin = new AdminJS({
    rootPath: '/admin',
    branding: {
      companyName: 'WTR Admin Panel',
      logo: false,
      favicon: '/favicon.ico',
    },
    resources,
    componentLoader
  })
  admin.watch()
  return admin;
};

/**
 * Setup Express server with AdminJS router
 * @param admin AdminJS instance
 * @returns Configured Express app
 */
export const setupExpressServer = (admin) => {
  const app = express();
  
  // Set up CORS with credentials
  app.use(cors({
    origin: [BACKEND_URL, process.env.ADMIN_URL || 'http://localhost:5000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }));
  
  // Parse cookies
  app.use(cookieParser());
  
  // For parsing form data
  app.use(formidable());

  const ConnectSession = Connect(session)

  const sessionStore = new ConnectSession({
    conObject: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      ssl: process.env.NODE_ENV === 'production',
    },
    tableName: 'adminJS-sessions',
    createTableIfMissing: true,
  })

  // Create a middleware to extract tokens from backend cookies
  const extractTokensMiddleware = (req, res, next) => {
    // If the backend has set authentication cookies, extract and use them
    if (req.cookies && (req.cookies.accessToken || req.cookies.refreshToken)) {
      console.log('Found authentication cookies from backend', req.cookies);
    }
    // Add debug logging for the session
    if (req.session) {
      console.log('Session data:', req.session);
    }
    next();
  };

  app.use(extractTokensMiddleware);

  const adminRouter = buildAuthenticatedRouter(
    admin,
    getAuthConfig(),
    null,
    {
      store: sessionStore,
      resave: false,
      saveUninitialized: true,
      secret: process.env.SESSION_SECRET || 'sessionsecret',
      cookie: {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
        // maxAge: 24 * 60 * 60 * 1000, // 1 day
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      },
      name: 'adminjs',
    }
  );

  app.use(admin.options.rootPath, adminRouter);
  return app;
}; 