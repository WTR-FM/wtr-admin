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
    console.log("Looking for Email: ", email, "Password: ", password);
    const result = await AdminAuthService.authenticate(email, password);
    console.log("Authentication result:", result);

    // Check if result contains an error message
    if (result && result._error) {
      console.log('Authentication error:', result._error);
      throw new Error(result._error);
    }

    if (result) {
      console.log('Database authentication successful for:', result.email);
      console.log('User role:', result.role);
    } else {
      console.log('Database authentication failed');
    }

    return result;
  } catch (error) {
    console.error('Authentication error:', error.message);
    // AdminJS expects this exact format with an object that has an _error property
    return { 
      _error: error.message || 'Authentication failed. Please check your credentials and try again.' 
    };
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