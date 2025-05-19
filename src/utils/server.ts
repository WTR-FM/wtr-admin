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
import axios from 'axios';

// Load environment variables
dotenv.config();

// Backend server URL
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

// Extend express-session with our custom properties
declare module 'express-session' {
  interface SessionData {
    adminUser?: Record<string, any>;
    isAuthenticatedViaCookies?: boolean;
  }
}

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

  // Create a middleware for token refresh
  const tokenRefreshMiddleware = async (req, res, next) => {
    try {
      // Check if we have a refresh token but no access token or expired access token
      if (req.cookies && req.cookies.refresh_token && (!req.cookies.access_token || req.session.adminUser)) {
        console.log('Attempting to refresh access token using refresh token');
        
        // Call backend refresh endpoint
        const response = await axios.post(`${BACKEND_URL}/auth/refresh`, {}, {
          headers: {
            Cookie: `refresh_token=${req.cookies.refresh_token}`
          },
          withCredentials: true
        });
        
        if (response.data?.tokens?.access_token) {
          // Set the new access token
          res.cookie('access_token', response.data.tokens.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' as const : 'lax' as const,
            maxAge: 15 * 60 * 1000 // 15 minutes
          });
          
          console.log('Access token refreshed successfully');
        }
      }
    } catch (error) {
      console.error('Error refreshing token:', error.message);
      // Don't throw error, just continue to next middleware
    }
    
    next();
  };

  app.use(tokenRefreshMiddleware);

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

  // Session configuration
  const sessionConfig = {
    store: sessionStore,
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET || 'sessionsecret',
    cookie: {
      httpOnly: process.env.NODE_ENV === 'production',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' as const : 'lax' as const,
    },
    name: 'adminjs',
  };

  // Create authentication router with the auth config
  const authConfig = getAuthConfig();
  
  // Pass req and res to authenticate
  const wrappedAuthConfig = {
    ...authConfig,
    authenticate: async (email, password, ctx) => {
      return authConfig.authenticate(email, password, ctx.req, ctx.res);
    }
  };
  
  // Use session middleware before router to make sure it's available
  const sessionMiddleware = session(sessionConfig);
  app.use(sessionMiddleware);
  
  // Create middleware to sync backend session with AdminJS session
  app.use((req, res, next) => {
    // If we have auth cookies but no session, initialize the session
    if (req.cookies && req.cookies.access_token && (!req.session || !req.session.adminUser)) {
      console.log('Found auth cookies but no session, initializing session');
      req.session.isAuthenticatedViaCookies = true;
    }
    next();
  });
  
  const adminRouter = buildAuthenticatedRouter(
    admin,
    wrappedAuthConfig,
    null,
    sessionConfig
  );

  app.use(admin.options.rootPath, adminRouter);
  return app;
}; 