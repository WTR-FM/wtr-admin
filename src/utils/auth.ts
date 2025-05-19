import { UserAuthService } from '../services/user-auth.service.js';
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Backend server URL
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

/**
 * Authentication handler for AdminJS
 * @param email Email address for authentication
 * @param password Password for authentication
 * @returns User object if authenticated, null otherwise
 */
export const authenticate = async (email: string, password: string) => {
  // Try user database authentication
  console.log('Attempting database authentication...');

  // This will isVisiblethrow an error if the account is suspended or not an admin user
  const user = await UserAuthService.authenticate(email, password);

  if (user) {
    console.log('Database authentication successful for:', user.email);


    console.log(`Authentication attempt with email: ${email}`);

    try {
      // Try to authenticate with the backend server
      console.log('Redirecting authentication to backend server...');

      const response = await axios.post(`${BACKEND_URL}/auth/local/signin`, {
        email,
        password
      }, {
        withCredentials: true
      });

      // If login was successful, we should get user data back
      if (response.data && response.data.user) {
        const user = response.data.user;
        console.log('Backend authentication successful for:', user.email);

        console.log('User role:', user.role);
        return user;
      } else {
        console.log('Backend authentication failed');
        return null;
      }
    } catch (error) {
      console.error('Authentication error:', error.message);

      // Handle axios errors
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response error:', error.response.status, error.response.data);

        if (error.response.status === 401) {
          // Unauthorized - invalid credentials
          return null;
        }

        if (error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Request error - no response received');
        throw new Error('Could not connect to the authentication server. Please try again later.');
      }

      // Check if the error is about a suspended account or permissions
      if (error.message.includes('suspended')) {
        console.log('Login rejected: Account suspended');
        // For AdminJS, when authenticate() throws an error, AdminJS will show that error message
        // on the login screen, so throw the error to be caught by AdminJS
        throw new Error('Your account has been suspended. Please contact the super admin.');
      }
      // Check if the error is about permissions
      if (error.message.includes('permission')) {
        console.log('Login rejected: Insufficient permissions');
        // For AdminJS, when authenticate() throws an error, AdminJS will show that error message
        // on the login screen, so throw the error to be caught by AdminJS
        throw new Error('You do not have permission to access the admin portal.');
      }

      // Return null for general authentication failure
      return null;
    }
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