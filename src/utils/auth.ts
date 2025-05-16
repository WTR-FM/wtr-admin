import { AdminAuthService } from '../services/admin-auth.service.js';

/**
 * Authentication handler for AdminJS
 * @param email Email address for authentication
 * @param password Password for authentication
 * @returns Admin object if authenticated, null otherwise
 */
export const authenticate = async (email: string, password: string) => {
  console.log(`Authentication attempt with email: ${email}`);
  try {
    // Try admin database authentication
    console.log('Attempting database authentication...');
    
    // This will throw an error if the account is suspended
    const admin = await AdminAuthService.authenticate(email, password);
    
    if (admin) {
      console.log('Database authentication successful for:', admin.email);
      console.log('User role:', admin.role);
      return admin;
    } else {
      console.log('Database authentication failed');
      // AdminJS expects null for auth failure without message
      return null;
    }
  } catch (error) {
    console.error('Authentication error:', error.message);
    
    // Check if the error is about a suspended account
    if (error.message.includes('suspended')) {
      console.log('Login rejected: Account suspended');
      
      // For AdminJS, when authenticate() throws an error, AdminJS will show that error message
      // on the login screen, so throw the error to be caught by AdminJS
      throw new Error('Your account has been suspended. Please contact the super admin.');
    }
    
    // Return null for general authentication failure
    return null;
  }
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