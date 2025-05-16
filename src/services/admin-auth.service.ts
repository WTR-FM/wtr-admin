import { compare, hash } from 'bcrypt';
import { Admin } from '../entities/admin.entity.js';

export class AdminAuthService {
  /**
   * Authenticate admin with email and password
   */
  static async authenticate(email: string, password: string) {
    try {
      console.log(`[AdminAuthService] Authenticating admin with email: ${email}`);
      
      // Find admin by email
      const admin = await Admin.findOne({ where: { email, isActive: true } });
      if (!admin) {
        console.log(`[AdminAuthService] Admin not found with email: ${email}`);
        return null;
      }
      
      console.log('[AdminAuthService] Admin found in database, verifying password');
      
      // For debugging only - compare password lengths
      console.log(`[AdminAuthService] Plain password length: ${password.length}`);
      console.log(`[AdminAuthService] Hashed password length: ${admin.password.length}`);
      
      // Compare password using bcrypt
      try {
        const isValidPassword = await compare(password, admin.password);
        console.log(`[AdminAuthService] Password comparison result: ${isValidPassword}`);
        
        if (!isValidPassword) {
          console.log('[AdminAuthService] Password verification failed');
          return null;
        }
        
        console.log('[AdminAuthService] Password verified successfully');
      } catch (error) {
        console.error('[AdminAuthService] Error comparing passwords:', error);
        return null;
      }
      
      // Return admin without password
      const { password: _, ...adminWithoutPassword } = admin.toJSON();
      return adminWithoutPassword;
    } catch (error) {
      console.error('[AdminAuthService] Error authenticating admin:', error);
      return null;
    }
  }

  /**
   * Check if user is a superadmin
   */
  static isSuperAdmin(admin: any) {
    const isSuperAdmin = admin && admin.role === 'superadmin';
    console.log(`[AdminAuthService] Checking if admin is superadmin:`, isSuperAdmin, admin?.role);
    return isSuperAdmin;
  }
  
  /**
   * Check if user is an admin
   */
  static isAdmin(admin: any) {
    const isAdmin = admin && admin.role === 'admin';
    console.log(`[AdminAuthService] Checking if admin is admin:`, isAdmin, admin?.role);
    return isAdmin;
  }
  
  /**
   * Check if user is a viewer
   */
  static isViewer(admin: any) {
    const isViewer = admin && admin.role === 'viewer';
    console.log(`[AdminAuthService] Checking if admin is viewer:`, isViewer, admin?.role);
    return isViewer;
  }
  
  /**
   * Check if user can edit (superadmin or admin)
   */
  static canEdit(admin: any) {
    const canEdit = admin && (admin.role === 'superadmin' || admin.role === 'admin');
    console.log(`[AdminAuthService] Checking if admin can edit:`, canEdit, admin?.role);
    return canEdit;
  }
} 