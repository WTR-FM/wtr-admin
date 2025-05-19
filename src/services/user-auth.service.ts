import { compare } from 'bcrypt';
import { User } from '../entities/user.entity.js';

export class UserAuthService {
  /**
   * Authenticate user with email and password
   */
  static async authenticate(email: string, password: string) {
    try {
      console.log(`[UserAuthService] Authenticating user with email: ${email}`);
      
      // Find user by email without any suspension filter
      const user = await User.findOne({ 
        where: { email }
      });
      
      if (!user) {
        console.log(`[UserAuthService] User not found with email: ${email}`);
        return null;
      }
      
      // Check if the user has admin permissions
      if (!['superadmin', 'admin', 'viewer'].includes(user.role)) {
        console.log(`[UserAuthService] Access denied: User ${email} does not have admin permissions`);
        throw new Error('You do not have permission to access admin portal.');
      }
      
      // Explicit check for suspension
      if (user.isSuspended) {
        console.log(`[UserAuthService] Access denied: User account ${email} is suspended`);
        throw new Error('Your account has been suspended. Please contact the super admin.');
      }
      
      console.log('[UserAuthService] User found in database, verifying password');
      
      // Compare password using bcrypt
      const isValidPassword = await compare(password, user.password);
      console.log(`[UserAuthService] Password comparison result: ${isValidPassword}`);
      
      if (!isValidPassword) {
        console.log('[UserAuthService] Password verification failed');
        return null;
      }
      
      console.log('[UserAuthService] Password verified successfully');
      
      // Return user without password
      const userData = user.toJSON();
      const { password: _, ...userWithoutPassword } = userData;
      return userWithoutPassword;
    } catch (error) {
      console.error('[UserAuthService] Authentication error:', error.message);
      throw error; // Re-throw to be handled by caller
    }
  }

  /**
   * Check if user is a superadmin
   */
  static isSuperAdmin(user: any) {
    const isSuperAdmin = user && user.role === 'superadmin';
    console.log(`[UserAuthService] Checking if user is superadmin:`, isSuperAdmin, user?.role);
    return isSuperAdmin;
  }
  
  /**
   * Check if user is an admin
   */
  static isAdmin(user: any) {
    const isAdmin = user && user.role === 'admin';
    console.log(`[UserAuthService] Checking if user is admin:`, isAdmin, user?.role);
    return isAdmin;
  }
  
  /**
   * Check if user is a viewer
   */
  static isViewer(user: any) {
    const isViewer = user && user.role === 'viewer';
    console.log(`[UserAuthService] Checking if user is viewer:`, isViewer, user?.role);
    return isViewer;
  }
  
  /**
   * Check if user can edit (superadmin or admin)
   */
  static canEdit(user: any) {
    const canEdit = user && (user.role === 'superadmin' || user.role === 'admin');
    console.log(`[UserAuthService] Checking if user can edit:`, canEdit, user?.role);
    return canEdit;
  }
} 