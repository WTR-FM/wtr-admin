import express from 'express';
import formidable from 'express-formidable';
import { buildAuthenticatedRouter } from '@adminjs/express';
import AdminJS from 'adminjs';
import { getAuthConfig } from './auth.js';
import { componentLoader, Dashboard } from '../types/components.bundler.js';

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
    dashboard: {
      component: Dashboard,
    },
    resources,
    componentLoader,
    pages: {
      // Add custom pages here if needed
    }
  })
  
  // Watch for changes
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
  // For parsing form data
  app.use(formidable());

  //   const ConnectSession = Connect(session)
  //   const sessionStore = new ConnectSession({
  //     conObject: {
  //       connectionString: 'postgres://adminjs:@localhost:5432/adminjs',
  //       ssl: process.env.NODE_ENV === 'production',
  //     },
  //     tableName: 'session',
  //     createTableIfMissing: true,
  //   })


  const adminRouter = buildAuthenticatedRouter(
    admin,
    getAuthConfig(),
    null,
    {
      resave: false,
      saveUninitialized: true,
      secret: process.env.SESSION_SECRET || 'sessionsecret',
      cookie: {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
      },
      name: 'adminjs',
    }
  );

  app.use(admin.options.rootPath, adminRouter);
  return app;
}; 