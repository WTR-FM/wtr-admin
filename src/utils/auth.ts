import { AdminAuthService } from '../services/admin-auth.service.js';

/**
 * Authentication handler for AdminJS
 * @param email Email address for authentication
 * @param password Password for authentication
 * @returns Admin object if authenticated, null otherwise
 */
export const authenticate = async (email: string, password: string) => {
  console.log(`Authentication attempt with email: ${email}`);
  // Try admin database authentication
  console.log('Attempting database authentication...');
  console.log("Looking for Email: ", email, "Password: ", password);
  const admin = await AdminAuthService.authenticate(email, password);
  console.log("Admin: ", admin);

  if (admin) {
    console.log('Database authentication successful for:', admin.email);
    console.log('User role:', admin.role);
  } else {
    console.log('Database authentication failed');
  }

  return admin;
};

/**
 * Configure authentication options for AdminJS
 * @returns Authentication configuration object
 */
export const getAuthConfig = () => ({
  authenticate,
  cookieName: 'adminjs',
  cookiePassword: process.env.COOKIE_SECRET || 'sessionsecret',
}); 