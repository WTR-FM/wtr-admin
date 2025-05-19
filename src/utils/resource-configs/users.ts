import { User } from "../../entities/user.entity.js";
import { UserAuthService } from "../../services/user-auth.service.js";
import { SpotifyTokenEdit, SpotifyTokenExpiry } from "../../types/components.bundler.js";

const UserConfig = {
  resource: User,
  options: {
    listProperties: ['firstName', 'lastName', 'email', 'role', 'isSuspended', 'isVerified', 'createdAt'],
    showProperties: ['id', 'firstName', 'lastName', 'email', 'phoneNumber', 'role', 'spotifyConnection', 'country', 'state', 'pincode', 'about', 'isSuspended', 'isVerified', 'coinbaseWalletAddress', 'spotifyStatus', 'createdAt', 'updatedAt'],
    editProperties: ['firstName', 'lastName', 'email', 'password', 'role', 'isSuspended', 'isVerified','spotifyConnectionEdit'],
    filterProperties: ['firstName', 'lastName', 'email', 'role', 'isSuspended', 'isVerified', 'createdAt'],
    properties: {
      password: {
        type: 'password',
        isVisible: {
          edit: false,
        },
      },
      role: {
        availableValues: [
          { value: 'superadmin', label: 'Super Admin' },
          { value: 'admin', label: 'Admin' },
          { value: 'viewer', label: 'Viewer' },
          { value: 'user', label: 'User' },
        ],
        isRequired: true,
        isVisible: {
          list: true,
          filter: true,
          show: true,
          edit: true,
        },
      },
      'spotifyConnection': { 
        isVisible: true, 
        type: 'mixed',
        components: {
          show: SpotifyTokenExpiry
        },
        label: 'Spotify Tokens Expired'
      },
      'spotifyConnectionEdit': { 
        isVisible: true,
        components: {
          edit: SpotifyTokenEdit
        },
        label: 'Spotify Tokens Expired'
      },
    },
    actions: {
      delete: { isAccessible: ({ currentAdmin }) => UserAuthService.isSuperAdmin(currentAdmin) },
      bulkDelete: { isAccessible: ({ currentAdmin }) => UserAuthService.isSuperAdmin(currentAdmin) },
      new: {
        isAccessible: ({ currentAdmin }) =>
          // Only superadmin and admin can create users
          UserAuthService.canEdit(currentAdmin)
      },
      edit: {
        isAccessible: ({ currentAdmin, record }) => {
          // Self-edit is always allowed
          if (record && currentAdmin && currentAdmin.id === record.param('id')) {
            return true;
          }
          
          // Only superadmin can edit other users with admin roles
          if (record && ['superadmin', 'admin'].includes(record.param('role'))) {
            return UserAuthService.isSuperAdmin(currentAdmin);
          }
          
          // Admins can edit users and viewers
          return UserAuthService.canEdit(currentAdmin);
        },
        before: async (request, context) => {
          const { currentAdmin, record } = context;
          
          // User editing themselves - can't change their own role
          if (currentAdmin.id === record.param('id')) {
            if (request.payload.role && request.payload.role !== currentAdmin.role) {
              throw new Error("You cannot change your own role.");
            }
          }
          
          // Only superadmin can create or modify superadmin role
          if (request.payload.role === 'superadmin' && !UserAuthService.isSuperAdmin(currentAdmin)) {
            throw new Error("Only superadmins can assign the superadmin role.");
          }
          
          return request;
        }
      },
      list: {
        isAccessible: ({ currentAdmin }) =>
          // All admin roles can see the list
          true
      },
      show: {
        isAccessible: ({ currentAdmin }) =>
          // All admin roles can see details
          true
      },
    },
    navigation: {
      name: 'User Management',
      icon: 'User',
    },
  },
}

export default UserConfig;